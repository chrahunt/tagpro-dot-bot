var util = require('util');
var Goal = require('./goals').Goal,
    CompositeGoal = require('./goals').CompositeGoal,
    GoalStatus = require('./goals').GoalStatus;
var Nav = require('./navigate'),
    SeekToPoint = Nav.SeekToPoint;

/**
 * Behavior guiding OFM.
 * @param {Bot} bot - The bot.
 */
function OFM(bot) {
  OFM.super_.apply(this, arguments);
}

util.inherits(OFM, CompositeGoal);
module.exports = OFM;

OFM.prototype.activate = function() {
  this.status = GoalStatus.active;
  var iHaveFlag = !!this.bot.game.player().flag;
  var enemyHasFlag = this.bot.game.enemies().some(function (player) {
    return player.flag !== null;
  });

  if (iHaveFlag) {
    // Evade.
  } else if (enemyHasFlag) {
    // Pop.
  } else {
    this.removeAllSubgoals();
    this.addSubgoal(new GrabNeutralFlag(this.bot));
  }
};

OFM.prototype.process = function() {
  this.activateIfInactive();
  this.status = this.processSubgoals();
  return this.status;
};

OFM.prototype.handleMessage = function(msg) {
  if (msg.name == "grab") {
    this.status = GoalStatus.inactive;
  }
};

/**
 * Execute neutral flag grab. More carefully if an enemy is close by.
 * @param {Bot} bot
 */
function GrabNeutralFlag(bot) {
  GrabNeutralFlag.super_.apply(this, arguments);
  this.target = this.bot.game.findYellowFlag().location;
}

util.inherits(GrabNeutralFlag, CompositeGoal);

GrabNeutralFlag.prototype.activate = function() {
  this.status = GoalStatus.active;

  //var loc = this.bot.game.location();
  //if (loc.dist(this.target) > 5) {
    this.addSubgoal(new SeekToPoint(this.target));
  //}

  // See if predicted location is close to flag.
  // Use that + enemy information to determine if futher consideration is needed.
  // Grab flag if no issue or if push grab is ok.
};

/**
 * Evade the enemy in OFM. Seek to various points and see if the
 * default avoidance behavior is enough to work.
 * @param {Bot} bot
 */
function Evade(bot) {
  Evade.super_.apply(this, arguments);
}

util.inherits(Evade, CompositeGoal);

Evade.prototype.activate = function() {
  this.status = GoalStatus.active;
};

Evade.prototype.process = function() {
  this.activateIfInactive();
};
