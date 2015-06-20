var util = require('util');
var Goal = require('./goals').Goal,
    CompositeGoal = require('./goals').CompositeGoal,
    GoalStatus = require('./goals').GoalStatus;

var NavigateToPoint = require('./navigate').NavigateToPoint;

/**
 * Offense is a goal with the purpose of capturing the enemy flag and
 * returning it to base to obtain a capture.
 * @constructor
 * @param {Bot} bot - The bot.
 */
var Offense = function(bot) {
  CompositeGoal.apply(this, arguments);
};

util.inherits(Offense, CompositeGoal);
module.exports = Offense;

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
