var util = require('util');
var Goal = require('./goals').Goal,
    CompositeGoal = require('./goals').CompositeGoal,
    GoalStatus = require('./goals').GoalStatus;

/**
 * This goal navigates to the given point, where the point may be
 * a static location anywhere in the traversable area of the game
 * map.
 * @param {Bot} bot - The bot.
 * @param {Point} point - The point to navigate to.
 */
var NavigateToPoint = function(bot, point) {
  CompositeGoal.apply(this, arguments);
  this.point = point;
};

util.inherits(NavigateToPoint, CompositeGoal);
exports.NavigateToPoint = NavigateToPoint;

/**
 * Calculates the path from the player to the target point, and
 * initiates path following.
 */
NavigateToPoint.prototype.activate = function() {
  this.status = GoalStatus.active;
  var start = this.bot.game.location();
  var end = this.point;

  this.removeAllSubgoals();

  // Add subgoal to calculate the path.
  this.addSubgoal(new CalculatePath(this.bot, start, end, function(path) {
    if (path) {
      this.addSubgoal(new FollowPath(this.bot, path));
    } else {
      // Handle no path being found.
      this.status = GoalStatus.failed;
    }
  }.bind(this)));
};

NavigateToPoint.prototype.process = function() {
  this.activateIfInactive();
  
  var status = this.processSubgoals();
  if (status !== GoalStatus.inactive) {
    this.status = status;
  }

  return this.status;
};

/**
 * Handles navUpdate message indicating that the navigation mesh has
 * been updated.
 */
NavigateToPoint.prototype.handleMessage = function(msg) {
  if (msg == "navUpdate") {
    // Inactivate so we find a different path.
    this.status = GoalStatus.inactive;
    return true;
  } else {
    return this.forwardToFirstSubgoal(msg);
  }
};

/**
 * Callback function to the CalculatePath goal.
 * @callback PathCallback
 * @param {?Array.<PointLike>} - The path, or null if the path was
 *   not found.
 */
/**
 * This goal calculates a path from the start to the end points and
 * calls the provided callback function after the path is calculated.
 * The status of this goal is completed if the path is calculated
 * successful, and failed otherwise. If the path is not calculated
 * then the callback is not called.
 * @param {Bot} bot - The bot.
 * @param {Point} start - The start location for the path.
 * @param {Point} end - The end location for the path.
 * @param {} callback - The callback function to be invoked when the
 *   path has been calculated.
 */
var CalculatePath = function(bot, start, end, callback) {
  Goal.apply(this, arguments);
  this.start = start;
  this.end = end;
  this.callback = callback;
};

util.inherits(CalculatePath, Goal);

CalculatePath.prototype.activate = function() {
  this.status = GoalStatus.waiting;
  // Calculate path.
  this.bot.navmesh.calculatePath(this.start, this.end, function(path) {
    if (path) {
      this.status = GoalStatus.completed;
      path = this._postProcessPath(path);
      this.callback(path);
    } else {
      this.status = GoalStatus.failed;
    }
  }.bind(this));
};

CalculatePath.prototype.process = function() {
  this.activateIfInactive();
  return this.status;
};

/**
 * Post-process a path to move it away from dangerous obstacles.
 * @private
 * @param {Array.<Point>} path - The path to process.
 * @return {Array.<Point>} - The processed path.
 */
CalculatePath.prototype._postProcessPath = function(path) {
  // Convert point-like path coordinates to point objects.
  path = path.map(Point.fromPointLike);

  // Remove current point.
  if (path.length > 1) {
    path.shift();
  }
  var spikes = this.bot.game.getspikes();
  // The additional buffer to give the obstacles.
  var buffer = this.bot.spike_buffer || 20;
  // The threshold for determining points which are 'close' to
  // obstacles.
  var threshold = this.bot.spike_threshold || 60;
  var spikesByPoint = new Map();
  path.forEach(function(point) {
    var closeSpikes = [];
    spikes.forEach(function(spike) {
      if (spike.dist(point) < threshold) {
        closeSpikes.push(spike);
      }
    });
    if (closeSpikes.length > 0) {
      spikesByPoint.set(point, closeSpikes);
    }
  });
  for (var i = 0; i < path.length; i++) {
    var point = path[i];
    if (spikesByPoint.has(point)) {
      var obstacles = spikesByPoint.get(point);
      if (obstacles.length == 1) {
        // Move away from the single point.
        var obstacle = obstacles[0];
        var v = point.sub(obstacle);
        var len = v.len();
        var newPoint = obstacle.add(v.mul(1 + buffer / len));
        path[i] = newPoint;
      } else if (obstacles.length == 2) {
        // Move away from both obstacles.
        var center = obstacles[1].add(obstacles[0].sub(obstacles[1]).mul(0.5));
        var v = point.sub(center);
        var len = v.len();
        var newPoint = center.add(v.mul(1 + (buffer + threshold) / len));
        path[i] = newPoint;
      }
    }
  }
  return path;
};

/**
 * This goal follows a path of points. If a point along the path cannot
 * be approached, then the goal fails.
 * @param {Bot} bot - The bot.
 * @param {Array.<Point>} path - The path to follow.
 */
var FollowPath = function(bot, path) {
  CompositeGoal.apply(this, arguments);
  this.path = path;
  this.reactivate_threshold = 20;
};

util.inherits(FollowPath, CompositeGoal);

/**
 * [activate description]
 * @return {[type]} [description]
 */
FollowPath.prototype.activate = function() {
  this.status = GoalStatus.active;
  this.iteration = 0;
  // Get furthest visible point along path.
  var destination = this._getNextPoint();

  // try to navigate to front of path.
  if (destination) {
    if (this.subgoals.length > 0) {
      var subgoal = this.subgoals[0];
      if (subgoal.point && subgoal.point.neq(destination)) {
        this.removeAllSubgoals();
        this.addSubgoal(this._nextSubgoal(destination));
      }
    } else {
      this.addSubgoal(this._nextSubgoal(destination));
    }
  } else if (destination === null) {
    // Error getting point.
    this.status = GoalStatus.failed;
  } else {
    // No next point, completed.
    this.status = GoalStatus.completed;
  }
};

/**
 * Get the next subgoal for approaching a point.
 * @private
 * @param {Point} point - The next destination.
 * @return {(ArriveToPoint|SeekToPoint)} - The goal corresponding to
 *   to the approach to the point.
 */
FollowPath.prototype._nextSubgoal = function(point) {
  if (this._isLastPoint(point)) {
    return new ArriveToPoint(this.bot, point);
  } else {
    return new SeekToPoint(this.bot, point);
  }
};

/**
 * Follows the path.
 * @return {GoalStatus} [description]
 */
FollowPath.prototype.process = function() {
  this.activateIfInactive();
  if (this.iteration == this.reactivate_threshold) {
    this.status = GoalStatus.inactive;
  } else {
    this.iteration++;
    if (this.status !== GoalStatus.failed && this.status !== GoalStatus.completed) {
      var status = this.processSubgoals();
      // Add next point onto path if possible.
      if (status == GoalStatus.completed && this.path.length !== 2) {
        this.activate();
      }
    }
  }

  return this.status;
};

/**
 * Get the next point along the path.
 * @private
 * @param {integer} [limit] - If provided, limits the number of
 *   points ahead on the path that will be checked for visibility.
 * @return {(Point|boolean|null)} - The next point on the path to navigate
 *   to, false if there is no next point, or null if there is no path or
 *   there was some other error.
 */
FollowPath.prototype._getNextPoint = function(limit) {
  if (typeof limit == 'undefined') {
    limit = this.path.length;
  } else {
    limit = Math.min(limit, this.path.length);
  }
  if (!this.path)
    return null;

  var goal;
  var path = this.path.slice();
  // Find next location to seek out in path.
  if (path.length > 0) {
    var me = this.bot.game.location();
    var anyVisible = false;
    var last_index = 0;

    // Get point furthest along path that is visible from current
    // location.
    for (var i = 0; i < limit; i++) {
      var point = path[i];
      if (this.bot.navmesh.checkVisible(me, point)) {
        goal = point;
        last_index = i;
        anyVisible = true;
      }
    }

    if (anyVisible) {
      path = path.slice(last_index);
      if (path.length == 1) {
        goal = path[0];
        // Finished if within this distance of the last point on the
        // path.
        if (me.dist(goal) < 20) {
          goal = false;
        }
      }
    } else {
      goal = null;
    }
  } else {
    goal = false;
  }

  // Update bot state.
  if (goal) {
    this.path = path;
  }
  return goal;
};

/**
 * Checks whether this point is the last on the path.
 * @private
 * @param {Point} point
 * @return {Boolean}
 */
FollowPath.prototype._isLastPoint = function(point) {
  return point == this.path[this.path.length - 1];
};

/**
 * Seek to the given point, which is assumed to be a static point in
 * the line-of-sight of the bot. The goal fails if the point is not
 * visible to the bot, and completes if the point is reached.
 * @param {Bot} bot
 * @param {Point} point - The point to navigate to.
 */
var SeekToPoint = function(bot, point) {
  Goal.apply(this, arguments);
  this.point = point;
};

util.inherits(SeekToPoint, Goal);

/**
 * Sets the point associated with this goal to the target for the bot.
 */
SeekToPoint.prototype.activate = function() {
  this.status = GoalStatus.active;

  // Set bot steering target.
  this.bot.setState("target", {
    loc: this.point,
    type: "static",
    movement: "seek"
  });
};

SeekToPoint.prototype.process = function() {
  this.activateIfInactive();

  // Check for death. - may need to be done higher up.
  var position = this.bot.game.location();
  // Check for point visibility.
  // Check if at position.
  if (position.dist(this.point) < 20) {
    this.status = GoalStatus.completed;
    this.bot.setState("target", false);
  } else if (!this.bot.navmesh.checkVisible(position, this.point)) {
    this.status = GoalStatus.failed;
  }

  return this.status;
};

/**
 * Clean up.
 */
SeekToPoint.prototype.terminate = function() {
  this.bot.setState("target", false);
};

/**
 * Seek to the given point, which is assumed to be a static point in
 * the line-of-sight of the bot.
 * @param {Bot} bot
 * @param {Point} point - The point to navigate to.
 */
var ArriveToPoint = function(bot, point) {
  Goal.apply(this, arguments);
  this.point = point;
};

util.inherits(ArriveToPoint, Goal);

ArriveToPoint.prototype.activate = function() {
  this.status = GoalStatus.active;

  // Set bot steering target.
  this.bot.setState("target", {
    loc: this.point,
    type: "static",
    movement: "arrive"
  });
};

ArriveToPoint.prototype.process = function() {
  this.activateIfInactive();

  // Check for death. - may need to be done higher up.
  var position = this.bot.game.location();
  // Check for point visibility.
  // Check if at position.
  if (position.dist(this.point) < 20) {
    this.status = GoalStatus.completed;
    this.bot.setState("target", false);
  } else if (!this.bot.navmesh.checkVisible(position, this.point)) {
    this.status = GoalStatus.failed;
  }

  return this.status;
};

/**
 * Clean up.
 */
ArriveToPoint.prototype.terminate = function() {
  this.bot.setState("target", false);
};

/**
 * Align the bot along a vector going torwards a point.
 * @param {Bot} bot - The bot.
 * @param {Point} point - The desired point.
 * @param {Point} velocity - The desired velocity at that point.
 */
var Align = function(bot, point, velocity) {
  Goal.apply(this, arguments);
  this.point = point;
  this.velocity = velocity;
};

util.inherits(Align, Goal);
exports.Align = Align;

/**
 * Add the relevant items to the bot state.
 */
Align.prototype.activate = function() {
  this.status = GoalStatus.active;
  this.bot.setState("target", {
    loc: this.point,
    velocity: this.velocity,
    movement: "align",
    type: "static"
  });
};

/**
 * Add the steering action if it hasn't already been added.
 * @return {GoalStatus} - The current goal status.
 */
Align.prototype.process = function() {
  this.activateIfInactive();
  return this.status;
};

Align.prototype.terminate = function() {
  this.bot.setState("target", false);
};