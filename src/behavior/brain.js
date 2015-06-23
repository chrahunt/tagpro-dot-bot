var util = require('util');
var Goal = require('./goals').Goal,
    CompositeGoal = require('./goals').CompositeGoal,
    GoalStatus = require('./goals').GoalStatus;
var Offense = require('./offense'),
    Defense = require('./defense'),
    ManualControl = require('./manual');
var Point = require('../geometry').Point;

/**
 * @module behavior/brain
 */
/**
 * This goal is concerned with making decisions and guiding the
 * behavior of the bot.
 * @exports behavior/brain
 * @constructor
 */
function Brain(bot) {
  CompositeGoal.apply(this, arguments);
  // Game type, either ctf or cf
  this.gameType = this.bot.game.gameType();
  this.alive = this.bot.game.alive();
}
module.exports = Brain;

util.inherits(Brain, CompositeGoal);

/**
 * Initiate thinking if alive.
 * @override
 */
Brain.prototype.activate = function() {
  this.status = GoalStatus.active;
  if (this.alive) {
    this.think();
  } else {
    this.status = GoalStatus.inactive;
  }
};

Brain.prototype.process = function() {
  this.activateIfInactive();
  var status = this.processSubgoals();
  if (status == GoalStatus.completed || status == GoalStatus.failed) {
    this.status = GoalStatus.inactive;
  }
  return this.status;
};

/**
 * Brain handles the following message types:
 * * dead
 * * stanceChange
 * * alive
 * @override
 */
Brain.prototype.handleMessage = function(msg) {
  if (msg == "dead") {
    this.terminate();
    this.status = GoalStatus.inactive;
    this.bot.setState("dangerous_enemies", false); // dead have no enemies
    this.alive = false;
    return true;
  } else if (msg == "alive") {
    this.alive = true;
    return true;
  } else if (msg == "positionChange") {
    this.terminate();
    this.status = GoalStatus.inactive;
    return true;
  } else if (typeof msg == "object") {
    // Handle powerup messages.
    //console.log("Received powerup message!");
    //console.log(msg);
  } else {
    // Handle messages that impact steering obstacles, but still forward
    // to first subgoal.
    if (msg == "grab") {
      // Everyone on the other team is an enemy.
      var enemies = this.bot.game.enemies().map(function (player) {
        return player.id;
      });
      this.bot.setState("dangerous_enemies", enemies);
    } else if (msg == "cap") {
      this.bot.setState("dangerous_enemies", false);
    }
  }
  return this.forwardToFirstSubgoal(msg);
};

/**
 * Choose action to take.
 */
Brain.prototype.think = function() {
  if (!this.alive) return;
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
 * Print current state of behavior tree.
 */
Brain.prototype.print = function() {
  var strings = [];
  var format = "%s (%d)";
  strings.push(util.format(format, this.constructor.name, this.status));
  var next = this.subgoals.length > 0 && this.subgoals[0];
  while (next) {
    strings.push(util.format(format, next.constructor.name, next.status));
    next = next.subgoals && next.subgoals.length > 0 && next.subgoals[0];
  }
  console.log(strings.join(" > "));
};
