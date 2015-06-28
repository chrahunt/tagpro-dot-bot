var geo = require('./geometry');
var Point = geo.Point;
/**
 * @module steerer
 */
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
    max_see_ahead: 10, // navigation interval length, TODO: set using 
    // argument
    dist_multiplier: 10
  };
  this.parameters.avoid = {
    max_see_ahead: 300, // Time in ms to look ahead for a collision.
    int_see_ahead: 100, // Smaller time to look for a collision.
    current_location: 40,
    assumed_difference: 65,
    spike_intersection_radius: this.gamestate.parameters.game.radius.spike +
      this.gamestate.parameters.game.radius.ball
  };
  this.parameters.dynamic_avoid = {
    look_ahead: 0,
    player_intersection_radius: 38
  };
  this.parameters.align = {
    num_points_prior: 3,
    backwards_multiplier: 20,
    forward_multiplier: 20
  };
};
module.exports = Steerer;

/**
 * External function called with bot state.
 * @param {BotState} state - The state of the bot, includes information
 *   passed from brain.
 * @return {Point} - Desired vector.
 */
Steerer.prototype.steer = function(state) {
  this.botstate = state;
  if (this.botstate.target) {
    if (this.botstate.target.movement == "align") {
      return this.align();
    } else {
      return this.inverseSteering(32);
    }
  } else {
    return new Point(0, 0);
  }
};

/**
 * @private
 * @param {number} n - The number of vectors to consider.
 */
Steerer.prototype.inverseSteering = function(n) {
  if (typeof n == 'undefined') n = 8;
  // Generate vectors.
  var angle = 2 * Math.PI / n;
  var vectors = [];
  for (var i = 0; i < n; i++) {
    vectors.push(new Point(Math.cos(angle * i), Math.sin(angle * i)));
  }

  // Calculate costs.
  var costs = [];
  costs.push(this.inverseStaticAvoid(vectors));
  if (this.botstate.dangerous_enemies) {
    costs.push(this.inverseDynamicAvoid(vectors));
  }
  costs.push(this.inverseSeek(vectors));
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
    var scaled = vectors[idx].mul(distance / 40);
    return clampVector(scaled, -2.5, 2.5);
  } else {
    return clampVector(vectors[idx].mul(3), -2.5, 2.5);
  }
};

/**
 * Avoid static obstacles.
 * @private
 * @param {Array.<Point>} vectors - The directions to consider.
 */
Steerer.prototype.inverseStaticAvoid = function(vectors) {
  var params = this.parameters.avoid;

  // For determining intersection and cost of distance.
  var SPIKE_INTERSECTION_RADIUS = params.spike_intersection_radius;
  var spikes = this.gamestate.getspikes();
  spikes = spikes.map(function (spike) {
    return {
      loc: spike,
      radius: SPIKE_INTERSECTION_RADIUS
    };
  });
  return this.inverseAvoid(vectors, spikes);
};

Steerer.prototype.inverseDynamicAvoid = function(vectors) {
  // Ids of enemies that are dangerous.
  var dangerousEnemies = this.botstate.dangerous_enemies;

  // Project areas of influence.
  var obstacles = dangerousEnemies.map(function (id) {
    return this.getInfluenceRegion(id);
  }, this).filter(function (obstacle) {
    return obstacle !== null;
  });
  return this.inverseAvoid(vectors, obstacles);
};

/**
 * Get region of influence that bot will try to stay away from.
 * @private
 * @param {integer} id - The id of the player to avoid.
 * @return {Obstacle?} - The obstacle object corresponding to the
 *   player, or null if player should be disregarded.
 */
Steerer.prototype.getInfluenceRegion = function(id) {
  if (this.gamestate.visible(id)) {
    var params = this.parameters.dynamic_avoid;
    // TODO: Parameter on look-ahead
    return {
      loc: this.gamestate.pLocation(id, params.look_ahead),
      radius: params.player_intersection_radius
    };
  } else {
    return null;
  }
};

Steerer.prototype.inverseAvoid = function(vectors, obstacles) {
  var costs = zeroArray(vectors.length);
  var params = this.parameters.avoid;

  // For determining how many ms to look ahead for the location to use
  // as the basis for seeing the impact a direction will have.
  var BASIS = params.current_location;
  var LOOK_AHEAD = params.max_see_ahead;
  var MED_LOOK_AHEAD = params.int_see_ahead;

  // For determining how much difference heading towards a single direction
  // will make.
  var DIR_LOOK_AHEAD = params.assumed_difference;

  // Ray with current position as basis.
  var position = this.gamestate.pLocation(BASIS);
  // look ahead 20ms
  var ahead = this.gamestate.pLocation(LOOK_AHEAD);
  var med_ahead = this.gamestate.pLocation(MED_LOOK_AHEAD);
  var ahead_distance = ahead.sub(position).len();
  var med_ahead_distance = med_ahead.sub(position).len();

  var relative_location = ahead.sub(position);

  var bad_directions = [];
  vectors.forEach(function(vector, i) {
    vector = relative_location.add(vector.mul(DIR_LOOK_AHEAD));
    var veclen = vector.len();
    // Put vector relative to predicted position.
    vector = vector.normalize();
    for (var j = 0; j < obstacles.length; j++) {
      var obstacle = obstacles[j];
      // Skip spikes that are too far away to matter.
      if (obstacle.loc.dist(position) - obstacle.radius > veclen) continue;
      collision = geo.util.lineCircleIntersection(
        position,
        vector,
        obstacle.loc,
        obstacle.radius
      );
      if (collision.collides) {
        costs[i] += 50;
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
Steerer.prototype.inverseSeek = function(vectors) {
  var costs = zeroArray(vectors.length);

  if (this.botstate.target) {
    var params = this.parameters.seek;
    var p = this.gamestate.location();
    var goal = this.botstate.target.loc.sub(p).normalize();
    
    vectors.forEach(function(vector, i) {
      var val = vector.dist(goal) * params.dist_multiplier;
      costs[i] = clamp(val, 0, 20);
    });
  }
  return costs;
};

/**
 * Aligns with a point/velocity combination.
 * @private
 * @return {Point} - The desired velocity.
 */
Steerer.prototype.align = function() {
  var target = this.botstate.target;
  var steering = this.botstate.steering;
  var loc = this.gamestate.location();
  var v = this.gamestate.velocity();
  var params = this.parameters.align;
  if (!steering ||
    (target.loc !== steering.p || target.velocity !== steering.v)) {
    steering = this.botstate.steering = {
      p: target.loc,
      v: target.velocity,
      points: []
    };
    var numPoints = params.num_points_prior;
    var b_multiplier = params.backwards_multiplier;
    var f_multiplier = params.forward_multiplier;
    var p = steering.p;
    var inv_v = steering.v.mul(-1); // backwards vector.
    for (var i = 0; i < numPoints; i++) {
      steering.points.push(p.add(inv_v.mul(numPoints - i).mul(b_multiplier)));
    }
    steering.points.push(p.add(steering.v));
  } else {
    var target_p = target.loc;
    // Keep points ahead of the player.
    steering.points = steering.points.filter(function (p) {
      var this_target = target_p.sub(p);
      var this_loc = loc.sub(p);
      return this_loc.dot(this_target) < 0;
    });
  }
  return this.seek(steering.points[0]);
};

/**
 * Seek a specific location, normal vector steering behavior approach.
 * @private
 * @param {Point} loc - The location to seek
 * @return {Point} - The desired vector.
 */
Steerer.prototype.seek = function(loc) {
  var location = this.gamestate.location();
  return clampVector(loc.sub(location), -2.5, 2.5);
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
