var util = require('util');
var Goal = require('./goals').Goal,
    CompositeGoal = require('./goals').CompositeGoal,
    GoalStatus = require('./goals').GoalStatus;

var NavigateToPoint = require('./navigate').NavigateToPoint;

/**
 * @module
 */

function GetPowerup(bot, powerup) {
  CompositeGoal.apply(this, arguments);
  this.id = powerup.id;
  this.powerup = powerup;
}

module.exports = GetPowerup;
util.inherits(GetPowerup, CompositeGoal);

GetPowerup.prototype.activate = function() {
  var loc = new Point(this.powerup.x, this.powerup.y);
  console.log("getting powerup");
  console.log(this.powerup);
  // Get powerup information.
  if (this.powerup.present) {
    // Go directly to the powerup.
    var destination = loc.mul(40).add(20);
    this.addSubgoal(new NavigateToPoint(this.bot, destination));
  } else {
    // Wait next to the powerup.
    // Get adjacent tile.
    var tiles = this.bot.game.getTraversableTilesNextTo(this.powerup);
    var myLocation = this.bot.game.location();
    var shortest = Infinity;
    var selected = false;
    tiles.forEach(function (tile) {
      // Get world location.
      var loc = tile.mul(40).add(20);
      var dist = myLocation.dist(loc);
      if (dist < shortest) {
        shortest = dist;
        selected = loc;
      }
    });
    if (selected) {
      // Go to tile next to powerup.
      this.addSubgoal(new NavigateToPoint(this.bot, selected));
    } else {
      this.status = GoalStatus.failed;
    }
  }
};

GetPowerup.prototype.process = function() {
  this.activateIfInactive();

  if (this.status !== GoalStatus.completed) {
    var status = this.processSubgoals();
    if (status == GoalStatus.completed) {
      console.log("Done navigating.");
      // Done navigating to adjacent tile, now wait for respawn.
      this.status = GoalStatus.waiting;
    } else {
      this.status = status;
    }
  }

  return this.status;
};

/**
 * Handles powerup spawn and powerup grab messages.
 * @param {*} msg - message indicating a powerup was spawned or grabbed.
 * @return {boolean} - Whether the message was handled.
 */
GetPowerup.prototype.handleMessage = function(msg) {
  if (typeof msg == "object") {
    if (msg.name == "powerup_grabbed" && msg.id == this.id) {
      console.log("Got message, setting as complete.");
      // Grabbed powerup, complete.
      this.status = GoalStatus.completed;
      return true;
    } else if (msg.name == "powerup_spawned" && msg.id == this.id) {
      // Spawned, grab powerup.
      this.powerup.present = true;
      this.status = GoalStatus.inactive;
      return true;
    }
  }
  return this.forwardToFirstSubgoal(msg);
};
