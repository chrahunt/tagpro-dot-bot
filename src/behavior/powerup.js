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
function GetPowerup(bot, id) {
  CompositeGoal.apply(this, arguments);
  this.id = id;
}

exports.GetPowerup = GetPowerup;
util.inherits(GetPowerup, CompositeGoal);

GetPowerup.prototype.activate = function() {
  this.status = GoalStatus.active;
  this.powerup = this.bot.game.powerupTracker.getPowerup(this.id);
  if (this.powerup.present) {
    console.log("Going after a present powerup.");
    this.addSubgoal(new GetSpawnedPowerup(this.bot, this.id));
  } else {
    console.log("Going after a respawning powerup.");
    this.addSubgoal(new WaitForRespawningPowerup(this.bot, this.id));
    this.addSubgoal(new GetSpawnedPowerup(this.bot, this.id));
  }
};

GetPowerup.prototype.process = function() {
  //console.log("Processing GetPowerup.");
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
function GetSpawnedPowerup(bot, id) {
  CompositeGoal.apply(this, arguments);
  console.log("GetSpawnedPowerup constructor.");
  this.id = id;
}

util.inherits(GetSpawnedPowerup, CompositeGoal);

GetSpawnedPowerup.prototype.activate = function() {
  this.status = GoalStatus.active;
  console.log("Activating GetSpawnedPowerup.");
  this.powerup = this.bot.game.powerupTracker.getPowerup(this.id);
  if (this.powerup.present) {
    // Go directly to the powerup.
    var loc = new Point(this.powerup.x, this.powerup.y);
    var destination = loc.mul(40).add(20);
    this.addSubgoal(new NavigateToPoint(this.bot, destination));
  } else {
    this.status = GoalStatus.failed;
  }
};

GetSpawnedPowerup.prototype.process = function() {
  //console.log("Processing GetSpawnedPowerup.");
  this.activateIfInactive();
  if (this.status !== GoalStatus.completed) {
    this.status = this.processSubgoals();
  } else {
    console.log("Completed GetSpawnedPowerup: %s.", this.print());
  }
  return this.status;
};

GetSpawnedPowerup.prototype.handleMessage = function(msg) {
  if (msg.name == "powerup_grabbed" && msg.id == this.id) {
    console.log("Got powerup grab message, setting as complete.");
    // Grabbed powerup, complete.
    this.status = GoalStatus.completed;
    return true;
  }
  return this.forwardToFirstSubgoal(msg);
};

/**
 * Get a powerup that is respawning.
 * @param {Bot} bot
 * @param {Powerup} powerup
 */
function WaitForRespawningPowerup(bot, id) {
  CompositeGoal.apply(this, arguments);
  this.id = id;
}

util.inherits(WaitForRespawningPowerup, CompositeGoal);

WaitForRespawningPowerup.prototype.activate = function() {
  this.status = GoalStatus.active;
  this.powerup = this.bot.game.powerupTracker.getPowerup(this.id);
  if (!this.powerup.present) {
    var loc = new Point(this.powerup.x, this.powerup.y);

    // Wait next to the powerup.
    // Get adjacent tile.
    var tiles = this.bot.game.getTraversableTilesNextTo(this.powerup);
    console.log("Tiles next to powerup:");
    console.log(tiles);
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
    this.status = GoalStatus.completed;
  }
};

WaitForRespawningPowerup.prototype.process = function() {
  this.activateIfInactive();

  if (this.status !== GoalStatus.failed && this.status !== GoalStatus.completed) {
    var status = this.processSubgoals();
    // Only update status if not completed.
    if (status !== GoalStatus.completed) {
      this.status = status;
    } else {
      this.status = GoalStatus.waiting;
    }
  }

  return this.status;
};

WaitForRespawningPowerup.prototype.handleMessage = function(msg) {
  if (msg.name == "powerup_spawned" && msg.id == this.id) {
    this.status = GoalStatus.completed;
    return true;
  }
  return this.forwardToFirstSubgoal(msg);
};
