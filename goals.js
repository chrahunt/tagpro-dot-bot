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
   * subgoal still remaining.
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

  /**
   * This goal is concerned with making decisions and guiding the
   * behavior of the bot.
   */
  var Think = function(bot) {
    CompositeGoal.apply(this, arguments);
    // Game type, either ctf or cf
    this.gameType = this.bot.game.gameType();
  };

  inherits(Think, CompositeGoal);

  Think.prototype.activate = function() {
    this.status = GoalStatus.active;
    this.think();
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
   * Think handles death messages directly, and passes all others to
   * its subgoals.
   */
  Think.prototype.handleMessage = function(msg) {
    if (msg == "dead") {
      this.terminate();
      this.status = GoalStatus.inactive;
      return true;
    } else if (msg == "stanceChange") {
      this.terminate();
      this.status = GoalStatus.inactive;
    } else {
      return this.forwardToFirstSubgoal(msg);
    }
  };

  /**
   * Choose action to take.
   */
  Think.prototype.think = function() {
    if (this.gameType == this.bot.game.GameTypes.ctf) {
      // Choose based on manual selection.
      if (this.bot.isOffense()) {
        // Make sure we're not already on offense.
        if (!this.isFirstSubgoal(Offense)) {
          // Only set to offense for now.
          // This goal replaces all others.
          this.removeAllSubgoals();
          this.addSubgoal(new Offense(this.bot));
        }
      } else if (this.bot.isDefence()) {
        console.log("Not implemented.");
      }
    } else {
      // Center flag game.
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
    if (!this.bot.self.flag) {
      destination = this.bot.game.findEnemyFlag();
      this.addSubgoal(new NavigateToPoint(this.bot, destination));
    } else {
      destination = this.bot.game.findOwnFlag();
      this.addSubgoal(new NavigateToPoint(this.bot, destination));
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
   * The Defence goal is concerned with defending a flag in base,
   * preventing an enemy capture, and chasing and returning the
   * enemy flag carrier.
   */
  var Defence = function(bot) {
    CompositeGoal.apply(this, arguments);
  }

  inherits(Defence, CompositeGoal);

  Defence.prototype.activate = function() {
    this.status = GoalStatus.active;
    
  };

  Defence.prototype.handleMessage = function(first_argument) {
    // Our/Enemy flag has been returned.
    // Our/Enemy flag has been taken.
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
  }

  inherits(NavigateToPoint, CompositeGoal);

  NavigateToPoint.prototype.activate = function() {
    this.status = GoalStatus.active;
    var start = this.bot.game.location();
    var end = this.point.location;

    // Add subgoal to calculate the path.
    this.addSubgoal(new CalculatePath(this.bot, start, end, function(path) {
      this.addSubgoal(new FollowPath(this.bot, path));
    }.bind(this)));
  };

  NavigateToPoint.prototype.process = function() {
    this.activateIfInactive();
    
    this.status = this.processSubgoals();

    return this.status;
  };

  /**
   * This goal calculates a path from the start to the end points and
   * calls the provided callback function after the path is calculated.
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
      this.status = GoalStatus.completed;
      path = this._postProcessPath(path);
      this.callback(path);
    }.bind(this));
  };

  CalculatePath.prototype.process = function() {
    this.activateIfInactive();
    return this.status;
  };

  /**
   * Post-process a path to move it away from obstacles.
   * @param {Array.<Point>} path - The path to process.
   * @return {Array.<Point>} - The processed path.
   */
  CalculatePath.prototype._postProcessPath = function(path) {
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

  var GrabFlag = function() {};

  var DefendFlag = function() {};

  /**
   * This goal 
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
      this.addSubgoal(new SeekToPoint(this.bot, destination));
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
   * Seek to the given point, which is assumed to be a static point in
   * the line-of-sight of the bot.
   * @param {Bot} bot
   * @param {Point} point - The point to navigate to.
   */
  var SeekToPoint = function(bot, point) {
    CompositeGoal.apply(this, arguments);
    this.point = point;
  };

  inherits(SeekToPoint, Goal);

  SeekToPoint.prototype.activate = function() {
    this.status = GoalStatus.active;

    // Set bot steering target.
    this.bot.setTarget(this.point);
  };

  SeekToPoint.prototype.process = function() {
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
