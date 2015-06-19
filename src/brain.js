var Point = require('./geometry').Point;

function inherits(child, parent) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}

GoalStatus = {
  inactive: 1,
  active: 2,
  completed: 3,
  failed: 4,
  waiting: 5
};

var Goal = function(bot) {
  this.bot = bot;
  this.status = GoalStatus.inactive;
};

/**
 * Called to activate the goal. This is where any necessary state is set.
 */
Goal.prototype.activate = function() {};

/**
 * Called to continue processing the goal. This can directly change bot
 * behavior and examine and update its own status and state. Typically
 * a goal should return its own status so it can be managed properly.
 */
Goal.prototype.process = function() {
  return this.status;
};

/**
 * Called to clean up any state that may have been set by the goal
 * before its execution is terminated.
 */
Goal.prototype.terminate = function() {};

/**
 * This function allows passing a message to a goal to be handled in
 * real-time. If this is not overriden then the default behavior is
 * to not handle the message.
 * @param {} msg - The message.
 * @return {boolean} - Whether or not the goal handled the message.
 */
Goal.prototype.handleMessage = function(msg) {
  return false;
};

/**
 * Run the activate function for the current goal if its current
 * status is inactive, otherwise do nothing.
 * @return {boolean} - Whether or not the activate function was run.
 */
Goal.prototype.activateIfInactive = function() {
  if (this.isInactive()) {
    this.activate();
    return true;
  } else {
    return false;
  }
};

Goal.prototype.reactivateIfFailed = function() {
  if (this.hasFailed()) {
    this.status = GoalStatus.inactive;
  }
};

Goal.prototype.type = function() {
  return this.constructor;
};

Goal.prototype.isActive = function() {
  return this.status == GoalStatus.active;
};

Goal.prototype.isInactive = function() {
  return this.status == GoalStatus.inactive;
};

Goal.prototype.isCompleted = function() {
  return this.status == GoalStatus.completed;
};

Goal.prototype.hasFailed = function() {
  return this.status == GoalStatus.failed;
};

/**
 * Acts as a goal with subgoals.
 * @constructor
 * @param {Bot} bot
 */
CompositeGoal = function(bot) {
  Goal.apply(this, arguments);
  this.subgoals = [];
};

inherits(CompositeGoal, Goal);

/**
 * By default, a composite goal forwards messages to the first
 * subgoal and returns the result.
 * @param {} msg - The message to handle.
 * @return {boolean} - Whether or not the message was handled.
 */
CompositeGoal.prototype.handleMessage = function(msg) {
  return this.forwardToFirstSubgoal(msg);
};

/**
 * Forward the given message to the first subgoal of this goal, or if
 * there are no subgoals, return false.
 * @param {} msg - The message to forward.
 * @param {boolean} - Whether or not the nessage was handled.
 */
CompositeGoal.prototype.forwardToFirstSubgoal = function(msg) {
  if (this.subgoals.length > 0) {
    return this.subgoals[0].handleMessage(msg);
  } else {
    return false;
  }
};

/**
 * Process the subgoals of a composite goal. This removes completed
 * and failed goals from the subgoal list and processes the first
 * subgoal still remaining, returning its status. If all subgoals have
 * been completed then the 'completed' status is returned.
 * @return {GoalStatus}
 */
CompositeGoal.prototype.processSubgoals = function() {
  // Remove completed and failed subgoals.
  while (this.subgoals.length !== 0 &&
    (this.subgoals[0].isCompleted() || this.subgoals[0].hasFailed())) {
    var subgoal = this.subgoals.shift();
    subgoal.terminate();
  }
  // Process first subgoal.
  if (this.subgoals.length !== 0) {
    var subgoalStatus = this.subgoals[0].process();
    if (subgoalStatus == GoalStatus.completed && this.subgoals.length > 1) {
      return GoalStatus.active;
    }
    return subgoalStatus;
  } else {
    return GoalStatus.completed;
  }
};

/**
 * Add goal to subgoals.
 * @param {(Goal|CompositeGoal)} goal - The goal to add.
 */
CompositeGoal.prototype.addSubgoal = function(goal) {
  this.subgoals.push(goal);
};

/**
 * Removes all subgoals from the composite goal, terminating each.
 */
CompositeGoal.prototype.removeAllSubgoals = function() {
  var subgoals = this.subgoals.splice(0, this.subgoals.length);
  subgoals.forEach(function(subgoal) {
    subgoal.terminate();
  });
};

/**
 * Checks if the current first subgoal is of the type passed. If
 * there are no subgoals then this returns false.
 * @param {Function} goalType - The type to check for.
 * @return {boolean} - Whether the first subgoal is of the given
 *   type.
 */
CompositeGoal.prototype.isFirstSubgoal = function(goalType) {
  if (this.subgoals.length > 0) {
    return (this.subgoals[0] instanceof goalType);
  } else {
    return false;
  }
};

/**
 * Clean up.
 * @override
 */
CompositeGoal.prototype.terminate = function() {
  this.removeAllSubgoals();
};

/**
 * This goal is concerned with making decisions and guiding the
 * behavior of the bot.
 */
var Think = function(bot) {
  CompositeGoal.apply(this, arguments);
  // Game type, either ctf or cf
  this.gameType = this.bot.game.gameType();
  this.alive = this.bot.game.alive();
};
module.exports = Think;

inherits(Think, CompositeGoal);

/**
 * Initiate thinking if alive.
 * @override
 */
Think.prototype.activate = function() {
  this.status = GoalStatus.active;
  if (this.alive) {
    this.think();
  } else {
    this.status = GoalStatus.inactive;
  }
};

Think.prototype.process = function() {
  this.activateIfInactive();
  var status = this.processSubgoals();
  if (status == GoalStatus.completed || status == GoalStatus.failed) {
    this.status = GoalStatus.inactive;
  }
  return this.status;
};

/**
 * Think handles the following message types:
 * * dead
 * * stanceChange
 * * alive
 * @override
 */
Think.prototype.handleMessage = function(msg) {
  if (msg == "dead") {
    this.terminate();
    this.status = GoalStatus.inactive;
    this.alive = false;
    return true;
  } else if (msg == "alive") {
    this.alive = true;
    return true;
  } else if (msg == "positionChange") {
    this.terminate();
    this.status = GoalStatus.inactive;
    return true;
  } else {
    return this.forwardToFirstSubgoal(msg);
  }
};

/**
 * Choose action to take.
 */
Think.prototype.think = function() {
  var control = this.bot.getState("control");
  if (control == "automatic") {
    if (this.gameType == this.bot.game.GameTypes.ctf) {
      var position = this.bot.getState("position");
      // Choose based on manual selection.
      if (position == "offense") {
        // Make sure we're not already on offense.
        if (!this.isFirstSubgoal(Offense)) {
          // Only set to offense for now.
          // This goal replaces all others.
          this.removeAllSubgoals();
          this.addSubgoal(new Offense(this.bot));
        }
      } else if (position == "defense") {
        if (!this.isFirstSubgoal(Defense)) {
          this.removeAllSubgoals();
          this.addSubgoal(new Defense(this.bot));
        }
      }
    } else {
      // Center flag game.
      this.bot.chat("I can't play this.");
    }
  } else if (control == "manual") {
    // Manual control.
    if (!this.isFirstSubgoal(ManualControl)) {
      this.removeAllSubgoals();
      this.addSubgoal(new ManualControl(this.bot));
    }
  }
};

/**
 * Handles manual control actions, mostly for debugging.
 * @param {Bot} bot - The bot.
 */
var ManualControl = function(bot) {
  CompositeGoal.apply(this, arguments);
};

inherits(ManualControl, CompositeGoal);

/**
 * Checks for a manual target and navigates to it if needed.
 */
ManualControl.prototype.activate = function() {
  this.status = GoalStatus.active;
  var target = this.bot.getState("manual_target");
  if (target) {
    if (this.isFirstSubgoal(NavigateToPoint)) {
      if (this.subgoals[0].point.neq(target)) {
        this.removeAllSubgoals();
        this.addSubgoal(new NavigateToPoint(this.bot, target));
      }
    } else {
      this.removeAllSubgoals();
      this.addSubgoal(new NavigateToPoint(this.bot, target));
    }
  }
};

ManualControl.prototype.process = function() {
  this.activateIfInactive();
  var status = this.processSubgoals();
  if (status == GoalStatus.completed) {
    this.bot.setState("manual_target", null);
    this.status = GoalStatus.inactive;
  } else if (status !== GoalStatus.active) {
    this.activate();
  }
  return this.status;
};

/**
 * Handles the case where the manual position has changed.
 * @param {*} message
 */
ManualControl.prototype.handleMessage = function(msg) {
  if (msg == "manual_target_changed") {
    this.terminate();
    this.status = GoalStatus.inactive;
    return true;
  } else {
    return this.forwardToFirstSubgoal(msg);
  }
};

/**
 * Offense is a goal with the purpose of capturing the enemy flag and
 * returning it to base to obtain a capture.
 * @constructor
 * @param {Bot} bot - The bot.
 */
var Offense = function(bot) {
  CompositeGoal.apply(this, arguments);
};

inherits(Offense, CompositeGoal);

/**
 * The Offense goal activation function checks whether or not the bot
 * has the flag and initiates navigation to either retrieve it or
 * return to base to get a capture.
 */
Offense.prototype.activate = function() {
  this.status = GoalStatus.active;
  var destination;
  if (!this.bot.game.player().flag) {
    destination = this.bot.game.findEnemyFlag();
    this.addSubgoal(new NavigateToPoint(this.bot, destination.location));
  } else {
    destination = this.bot.game.findOwnFlag();
    this.addSubgoal(new NavigateToPoint(this.bot, destination.location));
  }
};

Offense.prototype.process = function() {
  this.activateIfInactive();

  var status = this.processSubgoals();

  if (status == GoalStatus.completed) {
    this.activate();
  }
  return this.status;
};

/**
 * The Defense goal is concerned with defending a flag in base,
 * preventing an enemy capture, and chasing and returning the
 * enemy flag carrier.
 */
var Defense = function(bot) {
  CompositeGoal.apply(this, arguments);
};

inherits(Defense, CompositeGoal);

Defense.prototype.activate = function() {
  this.status = GoalStatus.active;
  // Get own team's flag status.
  var flag = this.bot.game.findOwnFlag();
  // Flag is home.
  if (flag.state) {
    // Consider current location.
    if (this.bot.game.inBase()) {
      // Inside base, defend our flag.
      this.addSubgoal(new DefendFlag(this.bot));
    } else {
      // Outside of base, plot a course for the base's location.
      var base = this.bot.game.base();
      this.addSubgoal(new NavigateToPoint(this.bot, base.location));
    }
  } else {
    // Flag is not home.
    this.addSubgoal(new OffensiveDefense(this.bot));
  }
};

Defense.prototype.process = function() {
  this.activateIfInactive();

  var status = this.processSubgoals();
  if (status !== GoalStatus.active) {
    this.activate();
  }

  return this.status;
};

Defense.prototype.handleMessage = function(msg) {
  // Enemy takes flag, resort to out-of-base defense.
  // Our/Enemy flag has been returned.
  // Our/Enemy flag has been taken.
  // Default behavior.
  return this.forwardToFirstSubgoal(msg);
};

/**
 * Implements strategies and behaviors related to the goal of in-base
 * defense. Assumes we're located in-base.
 */
var DefendFlag = function(bot) {
  CompositeGoal.apply(this, arguments);
};

inherits(DefendFlag, CompositeGoal);

DefendFlag.prototype.activate = function() {
  this.status = GoalStatus.active;
  // Play no-grab for now.
  //if (!this.isFirstSubgoal(NoGrabDefense)) {
    this.removeAllSubgoals();
    this.addSubgoal(new NoGrabDefense(this.bot));
  //}
};

DefendFlag.prototype.process = function() {
  this.activateIfInactive();
  this.status = this.processSubgoals();
  return this.status;
};

DefendFlag.prototype.handleMessage = function(msg) {
  // Powerup value consideration.
  // Additional enemies present in base.
  // Default behavior.
  return this.forwardToFirstSubgoal(msg);
};

/**
 * Holds the strategy of no-grab defense. Push enemies away from
 * own flag.
 */
var NoGrabDefense = function(bot) {
  CompositeGoal.apply(this, arguments);
};

inherits(NoGrabDefense, CompositeGoal);

NoGrabDefense.prototype.activate = function() {
  this.status = GoalStatus.active;
  // Select target enemy.
  var enemies = this.bot.game.enemiesInBase();
  if (enemies.length > 0) {
    // Select first for now.
    var target = enemies[0];
    var base = this.bot.game.base().location;
    this.addSubgoal(new KeepPlayerFromPoint(this.bot, target.id, base));
  } else {
    // Nothing now.
  }
};

NoGrabDefense.prototype.process = function() {
  this.activateIfInactive();

  this.status = this.processSubgoals();

  return this.status;
};

/**
 * Push an enemy away from the flag.
 * @param {Bot} bot - The bot.
 * @param {integer} target - The id of the player to push away from
 *   the flag.
 * @param {Point} point - The point to keep the target away from.
 */
var KeepPlayerFromPoint = function(bot, target, point) {
  CompositeGoal.apply(this, arguments);
  this.target = this.bot.game.player(target);
  this.point = point;
};

inherits(KeepPlayerFromPoint, CompositeGoal);

/**
 * Checks that player is in-between target player and point, getting
 * between if necessary and pushing away.
 */
KeepPlayerFromPoint.prototype.activate = function() {
  this.status = GoalStatus.active;
  // The margin for checking whether player is between the two points.
  var margin = 20;
  var playerPos = this.bot.game.location();
  var targetPos = this.bot.game.location(this.target.id);
  var flagPos = this.point;
  if (this.bot.game.isInterposed(playerPos, targetPos, flagPos)) {
    // Player is between target and flag.
    this.bot.chat("I'm between target and flag.");
    //this.addSubgoal(new )
  } else {
    // Player is not between target and flag.
    this.addSubgoal(new StaticInterpose(this.bot, this.target.id, this.point));
  }
};

KeepPlayerFromPoint.prototype.process = function() {
  this.activateIfInactive();

  var status = this.processSubgoals();
  if (status == GoalStatus.completed) {
    // Set to inactive so we run activate next tick.
    this.status = GoalStatus.inactive;
  }

  return this.status;
};

/**
 * Get in-between a target and static point.
 * @param {Bot} bot - The bot.
 * @param {number} target - The id of the player to push away from
 *   the flag.
 * @param {Point} point - The point to keep the target away from.
 */
var StaticInterpose = function(bot, target, point) {
  CompositeGoal.apply(this, arguments);
  this.target = this.bot.game.player(target);
  this.point = point;
};

inherits(StaticInterpose, CompositeGoal);

StaticInterpose.prototype.activate = function() {
  this.status = GoalStatus.active;

  var pos = this.bot.game.location();
  var enemyPos = this.bot.game.location(this.target.id);
  var point = this.point;

  if (!this.bot.game.isInterposed(pos, enemyPos, point)) {
    // Get position to seek towards.
    var vel = this.bot.game.velocity();

    var enemyVel = this.bot.game.velocity(this.target.id);
    // Point to seek between two objects.
    var midpoint = point.add(enemyPos).div(2);
    this.addSubgoal(new SeekToPoint(this.bot, midpoint));
  } else {
    this.status = GoalStatus.completed;
  }
};

StaticInterpose.prototype.process = function() {
  var status = this.processSubgoals();
  if (status !== GoalStatus.active) {
    this.activate();
  }

  return this.status;
};

/**
 * Tries to push a target player away along a ray emanating from a
 * point.
 * @param {Bot} bot - The Bot.
 * @param {Player} target - The target player.
 * @param {Point} point - The point to push the player from.
 * @param {Point} ray - Unit vector direction from point in which to
 *   push the player.
 */
var PushPlayerAway = function(bot, target, point, ray) {
  Goal.apply(this, arguments);
  this.target = target;
  this.point = point;
  this.ray = ray;
};

inherits(PushPlayerAway, Goal);

/**
 * Check that target player is within a margin of the target ray,
 * failing if they are too far.
 */
PushPlayerAway.prototype.activate = function() {
  
};

PushPlayerAway.prototype.process = function() {
  
};

var ContainmentDefense = function(bot) {
  CompositeGoal.apply(this, arguments);
};

inherits(ContainmentDefense, CompositeGoal);


/**
 * Defense strategy to use when flag is out-of-base.
 */
var OffensiveDefense = function(bot) {
  CompositeGoal.apply(this, arguments);
};

inherits(OffensiveDefense, CompositeGoal);

OffensiveDefense.prototype.activate = function() {
  this.status = GoalStatus.active;
};

OffensiveDefense.prototype.process = function() {
  this.activateIfInactive();

  this.status = this.processSubgoals();

  return this.status;
};

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

inherits(NavigateToPoint, CompositeGoal);

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

inherits(CalculatePath, Goal);

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

inherits(FollowPath, CompositeGoal);

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

inherits(SeekToPoint, Goal);

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

inherits(ArriveToPoint, Goal);

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
