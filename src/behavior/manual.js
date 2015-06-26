var util = require('util');
var Goal = require('./goals').Goal,
    CompositeGoal = require('./goals').CompositeGoal,
    GoalStatus = require('./goals').GoalStatus;
var NavigateToPoint = require('./navigate').NavigateToPoint,
    Align = require('./navigate').Align;

/**
 * @module
 */
/**
 * Handles manual control actions, mostly for debugging.
 * @param {Bot} bot - The bot.
 */
function ManualControl(bot) {
  CompositeGoal.apply(this, arguments);
}

util.inherits(ManualControl, CompositeGoal);
module.exports = ManualControl;

/**
 * Checks for a manual target and navigates to it if needed.
 */
ManualControl.prototype.activate = function() {
  this.status = GoalStatus.active;
  var target = this.bot.getState("manual_target");
  var boost = this.bot.getState("boost_test");
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
  } else if (boost) {
    this.addSubgoal(new Boost(this.bot, boost));
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
  if (msg.name == "manual_target_changed") {
    this.terminate();
    this.status = GoalStatus.inactive;
    return true;
  } else if (msg.name == "boosted") {
    this.terminate();
    this.status = GoalStatus.inactive;
    return true;
  } else {
    return this.forwardToFirstSubgoal(msg);
  }
};

/**
 * @typedef {object} BoostInfo
 * @property {Point} array_loc - Array location of boost.
 * @property {Point} incoming - Incoming point.
 * @property {Point} v - Incoming velocity.
 */
/**
 * Takes a boost with the given information.
 * @param {Bot} bot - The bot.
 * @param {BoostInfo} info - Information for the boost to take.
 */
function Boost(bot, info) {
  CompositeGoal.apply(this, arguments);
  this.info = info;
}
util.inherits(Boost, CompositeGoal);

/**
 * Determine points needed to get to boost properly and add seek to first point.
 */
Boost.prototype.activate = function() {
  this.status = GoalStatus.active;
  this.addSubgoal(new Align(this.bot, this.info.incoming, this.info.v));
  /*
  if (!this.points) {
    // Determine points to go to in order to line up for the boost.
    // Spaced evenly apart.
    this.points = [];
    var numPoints = 3;
    var intersect = this.info.incoming;
    var back = this.info.v.mul(-1);// backwards vector.
    for (var i = 0; i < numPoints; i++) {
      this.points.push(intersect.add(back.mul(numPoints - i)));
    }
    this.points.push(intersect.add(this.info.v));// add another point so it keeps going.
  } else {
    // Points already set.
    if (this.points.length === 0) {
      // No points left.
      this.status = GoalStatus.completed;
    } else {
      this.addSubgoal(new SeekToPoint(this.bot, this.points.shift()));
    }
  }*/
};

/**
 * Process navigation subgoals.
 * @return {GoalStatus} - The status of the subgoal.
 */
Boost.prototype.process = function() {
  this.activateIfInactive();
  if (this.status !== GoalStatus.failed && this.status !== GoalStatus.completed) {
    var status = this.processSubgoals();
    /*
    // Add next point onto path if possible.
    if (status == GoalStatus.completed) {
      this.activate();
    }
    */
  }

  return this.status;
};

/**
 * Handles message indicating boost completed.
 * @param {string} msg - The message.
 * @return {boolean} - Whether the message was handled.
 */
Boost.prototype.handleMessage = function(msg) {
  if (msg.name === "boost") {
    this.status = GoalStatus.completed;
    this.terminate();
    console.log("Got info about boost, all done.");
    return true;
  } else {
    return this.forwardToFirstSubgoal(msg);
  }
};

/**
 * Remove boost test information and terminate subgoals.
 */
Boost.prototype.terminate = function() {
  console.log("TERMINATING BOOST.");
  this.removeAllSubgoals();
  this.bot.setState("boost_test", false);
};

