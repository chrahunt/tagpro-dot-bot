var util = require('util');
var _ = require('lodash');

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
    console.log("%s event occurred.", msg.name);
    this.status = GoalStatus.inactive;
    return true;
  }
  return this.forwardToFirstSubgoal(msg);
};

// Mixin for selecting actions.
var ActionSelector = {
  // Given state and weights, get an action.
  getAction: function(state, weights) {
    // Map information, contains boost angles.
    var map_info = this.bot.game.getMapInfo();
    // Example weights.
    var weights2 = {
      havingPowerup: 5,
      doingBoostGrab: 10,
      doingBombGrab: 10,
      waitingOnPowerup: 5,
      beingOutsideBase: 0,
      usingBoost: 5,
      distanceRatio: 0.5
    };
    var bot_location = this.bot.game.location();
    var flag_array_loc = state.target.sub(20).div(40);
    var flag_tile_id = flag_array_loc.toString();
    var dist_to_target = this.bot.game.location().dist(state.target);
    // Boost adjustment.
    /*var valid_boosts = state.boosts.map(function (boost) {
      var id = boost.toString();
      return map_info.boosts[id];
    });
    // Rule out boost solutions based on lack of need, i.e. grab.
    var boost_solutions = [];
    valid_boosts.forEach(function (boost) {
      Array.prototype.push.apply(boost_solutions, boost.solutions);
    });
    boost_solutions = boost_solutions.filter(function (solution) {
      // Dismiss if the start of the solution is further from the
      // target than we are currently.
      if (Point.fromPointLike(solution.p).dist(state.target) > dist_to_target) {
        return false;
      }
    });
    var solutions = boost_solutions.map(function (solution) {
      // Get score for each of the solutions.
    });

    // Rule out boost solutions based on 
    var actions = [
      {
        type: "boost-powerup", // or -grab or -nav
        id: "boostid",
        solution: {},
        cost: 0
      }, {
        type: "powerup-spawned", // or powerup-spawning
        id: "pupid", // get info when goal executes.
        cost: 0
      }, {
        type: "gettobase",
        cost: 0
      }, {

      }
    ];*/

    // Powerup goals.
    var powerups = state.powerups;
    var powerup_actions = [];

    // Make powerup actions.
    if (powerups.spawned.length > 0) {
      powerups.spawned.forEach(function (powerup) {
        var loc = Point.fromPointLike(powerup).mul(40).add(20);
        powerup_actions.push({
          type: "spawned",
          loc: loc,
          player_distance: loc.dist(bot_location),
          target_distance: loc.dist(state.target),
          powerup: powerup
        });
      });
    }

    if (powerups.respawning.length > 0) {
      var respawn_time = this.bot.game.parameters.game.respawn.powerup;
      var now = Date.now();
      powerups.respawning.forEach(function (powerup) {
        var loc = Point.fromPointLike(powerup).mul(40).add(20);
        powerup_actions.push({
          type: "respawning",
          time: powerup.taken_time + respawn_time - now,
          loc: loc,
          powerup: powerup,
          player_distance: loc.dist(bot_location),
          target_distance: loc.dist(state.target)
        });
      });
    }

    // Max respawning limit.
    var respawn_limit = 5e3;
    var dist_ratio = 2;

    // Rule out powerup actions.
    powerup_actions = powerup_actions.filter(function (action) {
      if (action.type == "respawning") {
        if (action.time > respawn_limit) return false;
      }
      if (action.player_distance + action.target_distance > dist_ratio * dist_to_target) {
        return false;
      }
      return true;
    });

    var goal;
    if (powerup_actions.length > 0) {
      // Then go get a powerup.
      var chosen = powerup_actions.reduce(function (p1, p2) {
        if (p1.player_distance + p1.target_distance < p2.player_distance + p2.target_distance) {
          return p1;
        } else {
          return p2;
        }
      });
      return new GetPowerup(this.bot, chosen.powerup.id);
    } else {
      var destination = this.bot.game.findEnemyFlag();
      return new NavigateToPoint(this.bot, destination.location);
    }
  },
  // Override in mixed-in class to set state and weights.
  actionSelection: function() {
    console.warn("%s doesn't override actionSelection!", this.constructor.name);
  },
  // Default activation function.
  activate: function() {
    this.status = GoalStatus.active;
    var goal = this.actionSelection();
    if (goal) {
      this.addSubgoal(goal);
    } else {
      this.status = GoalStatus.failed;
    }
  },
  // Get default state.
  getState: function() {
    return {
      // Active boosts on the map.
      boosts: this.bot.game.getBoosts(),
      // TODO: Active bombs on the map.
      bombs: [],
      // Powerups on the map.
      powerups: this.bot.game.getPowerups(),
      // Target end location for testing boost grabs and distance ratio checking.
      target: this.bot.game.findEnemyFlag().location
    };
  }
};

/**
 * Sets up for a grab.
 * @param {[type]} bot [description]
 */
function SetUpForGrab(bot) {
  CompositeGoal.apply(this, arguments);
}

util.inherits(SetUpForGrab, CompositeGoal);
_.merge(SetUpForGrab.prototype, ActionSelector);

/*SetUpForGrab.prototype.activate = function() {
  this.status = GoalStatus.active;
  var goal = this.actionSelection();
  if (goal) {
    this.addSubgoal(goal);
  } else {
    this.status = GoalStatus.failed;
  }
};*/

/**
 * Select an action that gives the lowest cost, return the goal.
 * @return {Goal?} - The goal, or nothing if no action was found.
 */
SetUpForGrab.prototype.actionSelection = function() {
  var state = this.getState();
  var weights = {
    havingPowerup: 5,
    doingBoostGrab: 10,
    doingBombGrab: 10,
    waitingOnPowerup: 5,
    beingOutsideBase: 0,
    usingBoost: 5,
    distanceRatio: 0.5
  };
  return this.getAction(state, weights);
  /*
  // Get action with lowest cost.
  var lowest_cost = Infinity;
  var selected_action = null;
  for (var i = 0; i < actions.length; i++) {
    var action = actions[i];
    if (action.cost < lowest_cost) {
      lowest_cost = action.cost;
      selected_action = action;
    }
  }
  if (selected_action) {
    return this.getActionGoal(selected_action);
  } else {
    return null;
  }*/
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

