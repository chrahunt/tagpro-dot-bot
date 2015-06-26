var util = require('util');
var Goal = require('./goals').Goal,
    CompositeGoal = require('./goals').CompositeGoal,
    GoalStatus = require('./goals').GoalStatus;
var Point = require('../geometry').Point;

var NavigateToPoint = require('./navigate').NavigateToPoint;
var GetPowerup = require('./powerup').GetPowerup;

/**
 * @module
 */
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
  var ourFlagInBase = this.bot.game.enemies().every(function (player) {
    return player.flag === null;
  });
  var enemyFlagInBase = this.bot.game.teammates().every(function (player) {
    return player.flag === null;
  });
  var iHaveFlag = !!this.bot.game.player().flag;
  // States
  if (ourFlagInBase && enemyFlagInBase) {
    // Go get their flag, detour for pups.
    this.addSubgoal(new SetUpForGrab(this.bot));
  } else if (!ourFlagInBase && enemyFlagInBase) {
    // Go get their flag, offensive defense, be careful.
    // TODO: Be more conservative in this situation.
    this.addSubgoal(new SetUpForGrab(this.bot));
  } else if (!ourFlagInBase && iHaveFlag) {
    // Stay alive.
    // TODO: Be more conservative, stay alive instead, be ok with backtracking.
    this.addSubgoal(new SetUpForCap(this.bot));
  } else if (!ourFlagInBase && !enemyFlagInBase) {
    // Teammate has their flag, get on regrab (quickly)
    this.addSubgoal(new GetOnRegrab(this.bot));
  } else if (ourFlagInBase && iHaveFlag) {
    // Go get cap.
    this.addSubgoal(new SetUpForCap(this.bot));
  } else if (ourFlagInBase && !enemyFlagInBase) {
    // Teammate has their flag, get on regrab (less quickly)
    // TODO: prioritize powerups in this situation.
    this.addSubgoal(new GetOnRegrab(this.bot));
  }
};

Offense.prototype.process = function() {
  this.activateIfInactive();

  var status = this.processSubgoals();

  if (status == GoalStatus.completed) {
    console.log("Goal was completed, doing activation.");
    console.log(this.print());
    this.activate();
  } else {
    this.status = status;
  }
  return this.status;
};

/**
 * Handle own grab and 
 * @param {string} msg - The message
 * @return {boolean} - Whether the message was handled.
 */
Offense.prototype.handleMessage = function(msg) {
  if (msg.name == "grab" || msg.name == "cap") {
    this.status = GoalStatus.inactive;
    return true;
  } else if (msg.name == "powerups") {
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
      this.removeAllSubgoals();
      this.addSubgoal(new GetPowerup(this.bot, chosen.id));
      return true;
    }
  }
  return this.forwardToFirstSubgoal(msg);
};

/**
 * Sets up for a grab.
 * @param {[type]} bot [description]
 */
function SetUpForGrab(bot) {
  CompositeGoal.apply(this, arguments);
}

util.inherits(SetUpForGrab, CompositeGoal);

SetUpForGrab.prototype.activate = function() {
  this.status = GoalStatus.active;
  // TODO: Plan path through states.
  var destination = this.bot.game.findEnemyFlag();
  this.addSubgoal(new NavigateToPoint(this.bot, destination.location));
};

SetUpForGrab.prototype.valueFunction = function() {
  var boosts = this.bot.game.boosts();
  var bombs = this.bot.game.bombs();
  var powerups = this.bot.game.powerups();
  var actions = [
    {
      type: "boost",
      id: "boostid",
      solution: {}
    }, {
      type: "powerup-spawned", // or powerup-spawning
      id: "pupid" // get info when goal executes.
    }, {

    }
  ];
};

SetUpForGrab.prototype.getActions = function(state, weights) {
  // Get sequence of actions to get to grab setup.
};

SetUpForGrab.prototype.process = function() {
  this.activateIfInactive();
  if (this.status !== GoalStatus.completed) {
    var status = this.processSubgoals();
    if (status == GoalStatus.completed) {
      this.activate();
    } else {
      this.status = status;
    }
  }
  return this.status;
};

SetUpForGrab.prototype.handleMessage = function(msg) {
  if (msg.name == "grab") {
    this.status = GoalStatus.completed;
  }
  // TODO: Handle powerups.
};

/**
 * Get on regrab and wait, re-evaluating periodically.
 * @param {Bot} bot
 */
function GetOnRegrab(bot) {
  CompositeGoal.apply(this, arguments);
}

util.inherits(GetOnRegrab, CompositeGoal);

GetOnRegrab.prototype.activate = function() {
  this.status = GoalStatus.active;

  if (!this.iAmOnRegrab()) {
    destination = this.bot.game.findEnemyFlag();
    this.addSubgoal(new NavigateToPoint(this.bot, destination.location));
  }
};

/**
 * Whether or not I'm currently on regrab.
 * @return {boolean}
 */
GetOnRegrab.prototype.iAmOnRegrab = function() {
  var flag = this.bot.game.findEnemyFlag();
  var me = this.bot.game.location();
  return me.dist(flag) < 20;
};

/**
 * Process subgoals, reactivate if needed, or wait.
 */
GetOnRegrab.prototype.process = function() {
  this.activateIfInactive();
  if (this.subgoals.length > 0) {
    var status = this.processSubgoals();
    if (status !== GoalStatus.completed) {
      this.status = status;
    } else {
      // In case of grabbing a powerup, try to reactivate to get back
      // on regrab.
      this.activate();
    }
  } else if (this.iAmOnRegrab()) {
    this.status = GoalStatus.waiting;
  }
  return this.status;
};

GetOnRegrab.prototype.handleMessage = function(msg) {
  if (msg.name == "") {

  }
  // Handle self grab event, handle powerup events.
};

/**
 * Get back to base, stay alive.
 * @param {Bot} bot
 */
function SetUpForCap(bot) {
  CompositeGoal.apply(this, arguments);
}

util.inherits(SetUpForCap, CompositeGoal);

SetUpForCap.prototype.activate = function() {
  this.status = GoalStatus.active;
  // TODO: Handle state where flag isn't home.
  var destination = this.bot.game.findOwnFlag();
  this.addSubgoal(new NavigateToPoint(this.bot, destination.location));
};

SetUpForCap.prototype.process = function() {
  this.activateIfInactive();
  if (this.status !== GoalStatus.completed) {
    var status = this.processSubgoals();
    if (status == GoalStatus.completed) {
      this.activate();
    } else {
      this.status = status;
    }
  }
  return this.status;
};

SetUpForCap.prototype.handleMessage = function(msg) {
  // listen for cap, own flag grab, own flag return, powerups.
  return this.forwardToFirstSubgoal(msg);
};

/**
 * Last defender strategy.
 */
function OffensiveDefense(bot) {
  CompositeGoal.apply(this, arguments);
}

util.inherits(OffensiveDefense, CompositeGoal);

OffensiveDefense.prototype.activate = function() {
  this.status = GoalStatus.active;
  // Get player with flag.
  // Chase but don't allow them to get ahead towards flag.
};

OffensiveDefense.prototype.process = function() {
  this.activateIfInactive();

  this.status = this.processSubgoals();

  return this.status;
};

///////////
// Grabs //
///////////
function ManualGrab(bot) {
  CompositeGoal.apply(this, arguments);
}

util.inherits(ManualGrab, CompositeGoal);

ManualGrab.prototype.activate = function() {
  this.status = GoalStatus.active;
  if (this.bot.game.inEnemyBase()) {

  } else {
    // Get to enemy base.
    
  }
};

ManualGrab.prototype.process = function() {
  this.activateIfInactive();
  if (this.bot.game.inEnemyBase()) {
    this.activate();
  }
  this.status = this.processSubgoals();
  return this.status;
};

function BoostGrab(bot) {
  CompositeGoal.apply(this, arguments);
}

util.inherits(BoostGrab, CompositeGoal);

function BombGrab(bot) {
  CompositeGoal.apply(this, arguments);
}

util.inherits(BombGrab, CompositeGoal);

