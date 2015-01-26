define(function() {
  
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
  }

  var Goal = function(bot) {
    this.bot = bot;
    this.status = GoalStatus.inactive;
  };

  Goal.prototype.activate = function() {};

  Goal.prototype.process = function() {};

  Goal.prototype.terminate = function() {};

  Goal.prototype.handleMessage = function(msg) {};

  Goal.prototype.activateIfInactive = function() {
    if (this.isInactive()) {
      this.activate();
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

  CompositeGoal = function(bot) {
    Goal.apply(this, arguments);
    this.subgoals = [];
  };

  inherits(CompositeGoal, Goal);

  CompositeGoal.prototype.processSubgoals = function(first_argument) {
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
   * @param {Goal} goal - The goal to add.
   */
  CompositeGoal.prototype.addSubgoal = function(goal) {
    this.subgoals.push(goal);
  };

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
   */
  CompositeGoal.prototype.terminate = function() {
    this.removeAllSubgoals();
  };

  var Think = function(bot) {
    CompositeGoal.apply(this, arguments);
  };

  inherits(Think, CompositeGoal);

  Think.prototype.activate = function() {
    this.think();
    this.status = GoalStatus.active;
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
   * Choose action to take.
   */
  Think.prototype.think = function() {
    // Make sure we're not already on offense.
    if (!this.isFirstSubgoal(Offense)) {
      // Only set to offense for now.
      // This goal replaces all others.
      this.removeAllSubgoals();
      this.addSubgoal(new Offense(this.bot));
    }
  };

  var Offense = function(bot) {
    CompositeGoal.apply(this, arguments);
    // NavigateToEnemyBase
    // GrabFlag
    // ReturnToHomeBase
    // Cap
  };

  inherits(Offense, CompositeGoal);

  Offense.prototype.activate = function() {
    this.status = GoalStatus.active;
    var destination;
    if (!this.bot.self.flag) {
      this.addSubgoal(new NavigateToEnemyBase(this.bot));
    } else {
      this.addSubgoal(new NavigateToHomeBase(this.bot));
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

  var NavigateToEnemyBase = function(bot) {
    CompositeGoal.apply(this, arguments);
  };

  inherits(NavigateToEnemyBase, CompositeGoal);

  NavigateToEnemyBase.prototype.activate = function() {
    this.status = GoalStatus.active;
    var start = this.bot.game.location();
    var destination = this.bot.game.findEnemyFlag();
    this.status = GoalStatus.waiting;
    // Calculate path.
    this.bot.navmesh.calculatePath(start, destination.location, function(path) {
      // Navigate path.
      this.addSubgoal(new FollowPath(this.bot, path));
      this.status = GoalStatus.active;
    }.bind(this));
  };

  NavigateToEnemyBase.prototype.process = function() {
    this.activateIfInactive();
    
    if (this.status !== GoalStatus.waiting) {
      this.status = this.processSubgoals();
    }

    return this.status;
  };

  var NavigateToHomeBase = function(bot) {
    CompositeGoal.apply(this, arguments);
  }

  inherits(NavigateToHomeBase, CompositeGoal);

  NavigateToHomeBase.prototype.activate = function() {
    this.status = GoalStatus.active;
    var start = this.bot.game.location();
    // TODO: Transition to goal that takes into account lack of flag in base.
    var destination = this.bot.game.findOwnFlag();
    this.status = GoalStatus.waiting;
    // Calculate path.
    this.bot.navmesh.calculatePath(start, destination.location, function(path) {
      this.status = GoalStatus.active;
      // Navigate path.
      this.addSubgoal(new FollowPath(this.bot, path));
    }.bind(this));
  };

  NavigateToHomeBase.prototype.process = function() {
    this.activateIfInactive();

    // Ensure we're not waiting on the path.
    if (this.status !== GoalStatus.waiting) {
      this.status = this.processSubgoals();
    }

    return this.status;
  };

  var CalculatePath = function() {};

  var GrabFlag = function() {};

  var DefendFlag = function() {};

  /**
   * @param {Bot} bot - The bot.
   * @param {Array.<Point>} path - The path to follow.
   */
  var FollowPath = function(bot, path) {
    CompositeGoal.apply(this, arguments);
    this.path = path;
  };

  inherits(FollowPath, CompositeGoal);

  FollowPath.prototype.activate = function() {
    this.status = GoalStatus.active;
    // Get front of path.
    var destination = this._getNext();

    // try to navigate to front of path.
    if (destination) {
      this.addSubgoal(new NavigateToPoint(this.bot, destination));
    } else {
      this.status = GoalStatus.failed;
    }

    // If front of path is not visible, set failed. - may need to do
    // lower in goal hierarchy.

  };

  FollowPath.prototype.process = function() {
    this.activateIfInactive();

    this.status = this.processSubgoals();

    // Add next point onto path if possible.
    if (this.status == GoalStatus.completed && this.path.length !== 2) {
      this.activate();
    }

    return this.status;
  };

  /**
   * Get the next point along the path.
   * @return {Point} - The next point on the path to navigate to.
   */
  FollowPath.prototype._getNext = function() {
    var goal = false;
    var me = this.bot.game.location();
    if (!this.path)
      return;

    var path = this.path.slice();
    // Find next location to seek out in path.
    if (path.length > 0) {
      goal = path[0];
      var cut = false;
      var last_index = 0;

      // Get point furthest along path that is visible from current
      // location.
      for (var i = 0; i < path.length; i++) {
        if (this.bot.navmesh.checkVisible(me, path[i])) {
          goal = path[i];
          if (i !== 0) {
            last_index = i;
            cut = true;
          }
        } else {
          // If we're very near a point, remove it and head towards the
          // next one.
          if (me.dist(goal) < 20) {
            if (i !== 0) {
              last_index = i;
              //cut = true;
            }
          }
          break;
        }
      }

      if (cut) {
        path.splice(0, last_index - 1);
      }

      if (path.length == 1) {
        goal = path[0];
        if (me.dist(goal) < 20) {
          goal = false;
        }
      }
    }

    // Update bot state.
    this.bot.draw.updatePoint("goal", goal);
    this.path = path;
    return goal;
  };

  /**
   * Navigate to the given point.
   * @param {Bot} bot
   * @param {Point} point - The point to navigate to.
   */
  var NavigateToPoint = function(bot, point) {
    CompositeGoal.apply(this, arguments);
    this.point = point;
  };

  inherits(NavigateToPoint, Goal);
  NavigateToPoint.prototype.activate = function() {
    this.status = GoalStatus.active;

    // Set bot steering target.
    this.bot.setTarget(this.point);
  };

  NavigateToPoint.prototype.process = function() {
    this.activateIfInactive();

    // Check for death. - may need to be done higher up.
    var position = this.bot.game.location();
    // Check for point visibility.
    // Check if at position.
    if (position.dist(this.point) < 20) {
      this.status = GoalStatus.completed;
    } else if (!this.bot.navmesh.checkVisible(position, this.point)) {
      this.status = GoalStatus.failed;
    }

    return this.status;
  };

  return Think;
});
