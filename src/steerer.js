var geo = require('./geometry');
var Point = geo.Point;
/**
 * Steerer interface exposes a single function that takes the agent
 * state information and returns a vector representing the velocity
 * that should be taken to best meet the agent's goals.
 * @constructor
 * @param {GameState} state - The game state interface that provides
 *   player and game information.
 */
var Steerer = function(state) {
  this.gamestate = state;
  this.parameters = {};
  this.parameters.seek = {
    max_see_ahead: 10 // navigation interval length, TODO: set using 
    // argument
  };
  this.parameters.avoid = {
    max_see_ahead: 300, // Time in ms to look ahead for a collision.
    assumed_difference: 35,
    spike_intersection_radius: this.gamestate.parameters.game.radius.spike +
      this.gamestate.parameters.game.radius.ball
  };
};
module.exports = Steerer;

Steerer.prototype.steer = function(state) {
  this.botstate = state;
  if (this.botstate.target) {
    return this._steering(32).mul(2);
  } else {
    return new Point(0, 0);
  }
};

/**
 * @private
 * @param {number} n - The number of vectors to consider.
 */
Steerer.prototype._steering = function(n) {
  if (typeof n == 'undefined') n = 8;
  // Generate vectors.
  var angle = 2 * Math.PI / n;
  var vectors = [];
  for (var i = 0; i < n; i++) {
    vectors.push(new Point(Math.cos(angle * i), Math.sin(angle * i)));
  }

  // Calculate costs.
  var costs = [];
  costs.push(this.staticAvoid(vectors));
  costs.push(this.seek(vectors));
  this.costs = costs;

  // Do selection.
  var heuristic = function(costs) {
    var w = 1;
    // Add multiple cost arrays into one.
    var summedCosts = costs.reduce(function(summed, cost) {
      return summed.map(function(sum, i) {
        return sum + cost[i];
      });
    }, zeroArray(costs[0].length));

    // Get index of lowest.
    var min = summedCosts[0];
    var idx = 0;
    for (var i = 1; i < summedCosts.length; i++) {
      if (summedCosts[i] < min) {
        min = summedCosts[i];
        idx = i;
      }
    }
    return idx;
  };

  var idx = heuristic(costs);
  var selected = vectors[idx];
  if (this.botstate.target.movement == "arrive") {
    var distance = this.botstate.target.loc.dist(this.gamestate.location());
    // TODO: Scale vector with distance to target.
    var scaled = vectors[idx].mul(distance / 80);
    return clampVector(scaled, -2.5, 2.5);
  } else {
    return clampVector(vectors[idx].mul(2), -2.5, 2.5);
  }
};

/**
 * Avoid static obstacles.
 * @private
 * @param {Array.<Point>} vectors - The directions to consider.
 */
Steerer.prototype.staticAvoid = function(vectors) {
  var costs = zeroArray(vectors.length);
  var params = this.parameters.avoid;

  // For determining intersection and cost of distance.
  var SPIKE_INTERSECTION_RADIUS = params.spike_intersection_radius;
  // For determining how many ms to look ahead for the location to use
  // as the basis for seeing the impact a direction will have.
  var LOOK_AHEAD = params.max_see_ahead;

  // For determining how much difference heading towards a single direction
  // will make.
  var DIR_LOOK_AHEAD = params.assumed_difference;

  // Ray with current position as basis.
  var position = this.gamestate.location();
  // look ahead 20ms
  var ahead = this.gamestate.pLocation(LOOK_AHEAD);
  var ahead_distance = ahead.sub(position).len();

  var relative_location = ahead.sub(position);

  var spikes = this.gamestate.getspikes();

  var bad_directions = [];
  vectors.forEach(function(vector, i) {
    vector = relative_location.add(vector.mul(DIR_LOOK_AHEAD));
    var veclen = vector.len();
    // Put vector relative to predicted position.
    vector = vector.normalize();
    for (var j = 0; j < spikes.length; j++) {
      var spike = spikes[j];
      // Skip spikes that are too far away to matter.
      if (spike.dist(position) - SPIKE_INTERSECTION_RADIUS > veclen) continue;
      collision = geo.util.lineCircleIntersection(
        position,
        vector,
        spike,
        SPIKE_INTERSECTION_RADIUS
      );
      if (collision.collides) {
        costs[i] += 50;
        /*
        if (collision.inside) {
          costs[i] += 100;
        } else {
          // Calculate cost.
          costs[i] += clamp(SPIKE_INTERSECTION_RADIUS / ahead.dist(collision.point), 0, 100);
        }*/
      } else {

      }
    }
  });
  vectors.forEach(function (vector, i) {
    if (bad_directions.indexOf(i) !== -1) return;

    costs[i] += bad_directions.reduce(function (sum, j) {
      return vector.dot(vectors[j]) * costs[j] + sum;
    }, 0);
  });
  return costs;
};

/**
 * Seek to a point.
 * @param {Array.<Point>} vectors
 * @return {Array.<number>} - The costs associated with each direction.
 */
Steerer.prototype.seek = function(vectors) {
  var costs = zeroArray(vectors.length);

  if (this.botstate.target) {
    var params = this.parameters.seek;
    var p = this.gamestate.location();
    var goal = this.botstate.target.loc.sub(p).normalize();
    
    vectors.forEach(function(vector, i) {
      var val = vector.dot(goal);
      if (val <= 0) {
        // Vector points away from or at 90 degrees to goal.
        costs[i] = 20;
      } else {
        // Vector points towards goal, with less penalty the closer it
        // points.
        costs[i] = clamp(1 / val, 0, 20);
      }
    });
  }
  return costs;
};

/**
 * Scale a vector in accordance with the approach behavior.
 * @param {Point} vector - The selected vector to scale.
 * @return {Point} - The scaled vector.
 */
Steerer.prototype.arrive = function(vector) {
  var p = this.gamestate.location();
  var dist = this.botstate.target.loc.dist(p);
  return vector.mul();
};

/**
 * Clamps a vector so that both coordinates are constrained by the
 * provided min and max, and their values are the same relative to one
 * another.
 * @param {Point} vec - The vector to scale.
 * @param {number} min - The minimum value of either component.
 * @param {number} max - The maximum value of either component.
 * @return {Point} - The converted vector.
 */
function clampVector(vec, min, max) {
  var ratio = 0;
  if (vec.x >= min && vec.y >= min && vec.x <= max && vec.y <= max) {
    return vec;
  } else if (Math.abs(vec.x) >= Math.abs(vec.y)) {
    if (vec.x !== 0) {
      ratio = Math.abs(max / vec.x);
    }
  } else {
    ratio = Math.abs(max / vec.y);
  }
  var scaled = vec.mul(ratio);
  return scaled;
}

/**
 * If vector has a component outside of the normal velocity range,
 * scale both components so their ratio is preserved but the maximum
 * is the top speed of the player.
 * @param {Point} vec - The vector to scale.
 * @return {Point} - The scaled vector.
 */
function scaleVector(vec) {

}

function clamp(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

function smoothArray(array, smoothing) {
  var newArray = [];
  for (i = 0; i < array.length; i++) {
    var sum = 0;

    for (index = i - smoothing; index <= i + smoothing; index++) {
      var thisIndex = index < 0 ? index + array.length : index % array.length;
      sum += array[thisIndex];
    }
    newArray[i] = sum / ((smoothing * 2) + 1);
  }

  return newArray;
}

// Returns an array of the given length initialized with zeros.
function zeroArray(length) {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr[i] = 0;
  }
  return arr;
}
