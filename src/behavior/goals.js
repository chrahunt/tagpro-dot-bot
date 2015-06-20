var util = require('util');

GoalStatus = {
  inactive: 1,
  active: 2,
  completed: 3,
  failed: 4,
  waiting: 5
};
exports.GoalStatus = GoalStatus;

var Goal = function(bot) {
  this.bot = bot;
  this.status = GoalStatus.inactive;
};
exports.Goal = Goal;

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

util.inherits(CompositeGoal, Goal);
exports.CompositeGoal = CompositeGoal;

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
 * Clean up any state. The default behavior is to remove all subgoals,
 * calling their termination actions.
 * @override
 */
CompositeGoal.prototype.terminate = function() {
  this.removeAllSubgoals();
};
