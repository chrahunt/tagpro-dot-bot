var util = require('util');
var Goal = require('./goals').Goal,
    CompositeGoal = require('./goals').CompositeGoal,
    GoalStatus = require('./goals').GoalStatus;

var NavigateToPoint = require('./navigate').NavigateToPoint;

/**
 * @module behavior/powerup
 */

/**
 * Goal to retrieve a powerup or wait at an adjacent tile.
 * @extends module:behavior/goals.CompositeGoal
 * @alias module:behavior/powerup
 * @constructor
 * @param {Bot} bot - The bot
 * @param {Powerup} powerup - The powerup information.
 */
function GetPowerup(bot, powerup) {
  CompositeGoal.apply(this, arguments);
  this.id = powerup.id;
  this.powerup = powerup;
}

exports.GetPowerup = GetPowerup;
util.inherits(GetPowerup, CompositeGoal);

GetPowerup.prototype.activate = function() {
  this.status = GoalStatus.active;
  if (this.powerup.present) {
    console.log("Going after a present powerup.");
    this.addSubgoal(new GetSpawnedPowerup(this.bot, this.powerup));
  } else {
    console.log("Going after a respawning powerup.");
    this.addSubgoal(new GetRespawningPowerup(this.bot, this.powerup));
  }
};

GetPowerup.prototype.process = function() {
  console.log("Processing GetPowerup.");
  this.activateIfInactive();
  this.status = this.processSubgoals();
  if (this.status === GoalStatus.completed) {
    console.log("GetPowerup was completed. Tree: %s.", this.print());
  }
  return this.status;
};

/**
 * Retrieve a spawned powerup
 * @param {Bot} bot - The bot.
 * @param {Powerup} powerup
 */
function GetSpawnedPowerup(bot, powerup) {
  CompositeGoal.apply(this, arguments);
  console.log("GetSpawnedPowerup constructor.");
  this.id = powerup.id;
  this.powerup = powerup;
}

util.inherits(GetSpawnedPowerup, CompositeGoal);

GetSpawnedPowerup.prototype.activate = function() {
  this.status = GoalStatus.active;
  console.log("Activating GetSpawnedPowerup.");
  // Go directly to the powerup.
  var loc = new Point(this.powerup.x, this.powerup.y);
  var destination = loc.mul(40).add(20);
  this.addSubgoal(new NavigateToPoint(this.bot, destination));
};

GetSpawnedPowerup.prototype.handleMessage = function(msg) {
  if (typeof msg == "object") {
    if (msg.name == "powerup_grabbed" && msg.id == this.id) {
      console.log("Got message, setting as complete.");
      // Grabbed powerup, complete.
      this.status = GoalStatus.completed;
      return true;
    }
  }
  return this.forwardToFirstSubgoal(msg);
};

GetSpawnedPowerup.prototype.process = function() {
  console.log("Processing GetSpawnedPowerup.");
  this.activateIfInactive();
  if (this.status !== GoalStatus.completed) {
    this.status = this.processSubgoals();
  } else {
    console.log("Completed GetSpawnedPowerup: %s.", this.print());
  }
  return this.status;
};

/**
 * Get a powerup that is respawning.
 * @param {Bot} bot
 * @param {Powerup} powerup
 */
function GetRespawningPowerup(bot, powerup) {
  CompositeGoal.apply(this, arguments);
  this.id = powerup.id;
  this.powerup = powerup;
}

util.inherits(GetRespawningPowerup, CompositeGoal);

GetRespawningPowerup.prototype.activate = function() {
  this.status = GoalStatus.active;
  if (!this.powerup.present) {
    var loc = new Point(this.powerup.x, this.powerup.y);

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
  } else {
    this.addSubgoal(new GetSpawnedPowerup(this.bot, this.powerup));
  }
};

GetRespawningPowerup.prototype.process = function() {
  this.activateIfInactive();

  if (this.status !== GoalStatus.failed) {
    this.status = this.processSubgoals();
  }

  return this.status;
};

GetRespawningPowerup.prototype.handleMessage = function(msg) {
  if (typeof msg == "object") {
    if (msg.name == "powerup_spawned" && msg.id == this.id) {
      // Spawned, grab powerup.
      this.powerup.present = true;
      this.status = GoalStatus.inactive;
      return true;
    }
  }
  return this.forwardToFirstSubgoal(msg);
};
