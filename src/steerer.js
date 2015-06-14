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
    max_see_ahead: 200, // Time in ms to look ahead for a collision.
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
  costs.push(this._inv_Avoid(vectors));
  costs.push(this._inv_Seek(vectors));
  this.costs = costs;

  // Do selection.
  var heuristic = function(costs) {
    var w = 1;
    var summedCosts = [];
    for (var i = 0; i < costs[0].length; i++) {
      summedCosts[i] = 0;
    }
    summedCosts = costs.reduce(function(summed, cost) {
      return summed.map(function(sum, i) {
        return sum + cost[i];
      });
    }, summedCosts);
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
  return vectors[idx];
};

// Takes in vectors, associates cost with each.
// Returns vector of costs.
Steerer.prototype._inv_Avoid = function(vectors) {
  var costs = vectors.map(function() {
    return 0;
  });
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
        if (collision.inside) {
          costs[i] += 100;
        } else {
          // Calculate cost.
          costs[i] += SPIKE_INTERSECTION_RADIUS / position.dist(collision.point);
        }
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
 * Takes an array of unit vectors and assigns a penalty to each
 * depending on how much they do not align.
 * @param {[type]} vectors [description]
 * @return {[type]} [description]
 */
Steerer.prototype._inv_Seek = function(vectors) {
  var costs = vectors.map(function() {
    return 0;
  });

  if (this.botstate.target) {
    var params = this.parameters.seek;
    var p = this.gamestate.location();
    var goal = this.botstate.target.sub(p).normalize();
    
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
 * Scale a vector so that one of the components is maximized.
 * @param {Point} vec - The vector to scale.
 * @param {number} max - The maximum (absolute) value of either component.
 * @return {Point} - The converted vector.
 */
function scaleVector(vec, max) {
  var ratio = 0;
  if (Math.abs(vec.x) >= Math.abs(vec.y) && vec.x !== 0) {
    ratio = Math.abs(max / vec.x);
  } else if (vec.y !== 0) {
    ratio = Math.abs(max / vec.y);
  }
  var scaled = vec.mul(ratio);
  return scaled;
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
