var util = require('util');
var Goal = require('./goals').Goal,
    CompositeGoal = require('./goals').CompositeGoal,
    GoalStatus = require('./goals').GoalStatus;
var Point = require('../geometry').Point;

var NavigateToPoint = require('./navigate').NavigateToPoint;
var GetPowerup = require('./powerup');

/**
 * Offense is a goal with the purpose of capturing the enemy flag and
 * returning it to base to obtain a capture.
 * @constructor
 * @param {Bot} bot - The bot.
 */
function Offense(bot) {
  CompositeGoal.apply(this, arguments);
}

util.inherits(Offense, CompositeGoal);
module.exports = Offense;

/**
 * The Offense goal activation function checks whether or not the bot
 * has the flag and initiates navigation to either retrieve it or
 * return to base to get a capture.
 */
Offense.prototype.activate = function() {
  console.log("Activating Offense behavior.");
  this.status = GoalStatus.active;
  var destination;
  this.removeAllSubgoals();
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
  } else {
    this.status = status;
  }
  //console.log("Offense status: %s.", this.status);
  return this.status;
};

/**
 * Handle own grab and 
 * @param {string} msg - The message
 * @return {[type]} [description]
 */
Offense.prototype.handleMessage = function(msg) {
  if (msg == "grab" || msg == "cap") {
    this.status = GoalStatus.inactive;
    return true;
  } else if (typeof msg == "object") {
    // Handle general powerup information.
    if (msg.name == "powerups") {
      // Don't get another powerup if we're already going after one.
      if (this.isFirstSubgoal(GetPowerup)) return true;
      var chosen = false;
      var type = null;

      var playerLocation = this.bot.game.location();
      var closest = Infinity;
      if (!chosen && msg.spawned.length > 0) {
        var border = 500;
        msg.spawned.forEach(function (powerup) {
          var loc = Point.fromPointLike(powerup).mul(40).add(20);
          var dist = loc.dist(playerLocation);
          if (dist < closest && dist < border) {
            type = "spawned";
            chosen = powerup;
          }
        });
      }
      // Go get a respawning powerup if we haven't already picked one.
      if (!chosen && msg.respawning.length > 0) {
        var respawn_limit = 10e3;
        var respawn_time = this.bot.game.parameters.game.respawn.powerup;
        var now = Date.now();

        msg.respawning.forEach(function (powerup) {
          var dist = Point.fromPointLike(powerup).mul(40).add(20).dist(playerLocation);
          var time = powerup.taken_time + respawn_time - now;
          if (time < respawn_limit && dist < closest) {
            type = "respawning";
            chosen = powerup;
          }
        });
      }
      if (chosen) {
        console.log("Going to go pick up a %s powerup.", type);
        // But only if we aren't already after a pup.
        if (!this.isFirstSubgoal(GetPowerup)) {
          this.removeAllSubgoals();
          this.addSubgoal(new GetPowerup(this.bot, chosen));
        }
        return true;
      }
    }
  }
  return this.forwardToFirstSubgoal(msg);
};
