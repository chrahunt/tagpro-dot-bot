var util = require('util');

var Goal = require('./goals').Goal,
    CompositeGoal = require('./goals').CompositeGoal,
    GoalStatus = require('./goals').GoalStatus;

/**
 * @module behavior/defense
 */
/**
 * The Defense goal is concerned with defending a flag in base,
 * preventing an enemy capture, and chasing and returning the
 * enemy flag carrier.
 * @exports behavior/defense
 * @extends module:behavior/goals.CompositeGoal
 * @constructor
 * @param {Bot} bot - The bot.
 */
function Defense(bot) {
  CompositeGoal.apply(this, arguments);
}

util.inherits(Defense, CompositeGoal);
module.exports = Defense;

Defense.prototype.activate = function() {
  this.status = GoalStatus.active;
  // Get own team's flag status.
  var flag = this.bot.game.findOwnFlag();
  // Flag is home.
  if (flag.state) {
    // Consider current location.
    if (this.bot.game.inBase()) {
      // Inside base, defend our flag.
      this.addSubgoal(new DefendFlag(this.bot));
    } else {
      // Outside of base, plot a course for the base's location.
      var base = this.bot.game.base();
      this.addSubgoal(new NavigateToPoint(this.bot, base.location));
    }
  } else {
    // Flag is not home.
    this.addSubgoal(new OffensiveDefense(this.bot));
  }
};

Defense.prototype.process = function() {
  this.activateIfInactive();

  var status = this.processSubgoals();
  if (status !== GoalStatus.active) {
    this.activate();
  }

  return this.status;
};

Defense.prototype.handleMessage = function(msg) {
  // Enemy takes flag, resort to out-of-base defense.
  // Our/Enemy flag has been returned.
  // Our/Enemy flag has been taken.
  // Default behavior.
  return this.forwardToFirstSubgoal(msg);
};

/**
 * Implements strategies and behaviors related to the goal of in-base
 * defense. Assumes we're located in-base.
 * @extends CompositeGoal
 * @constructor
 */
function DefendFlag(bot) {
  CompositeGoal.apply(this, arguments);
}

util.inherits(DefendFlag, CompositeGoal);

DefendFlag.prototype.activate = function() {
  this.status = GoalStatus.active;
  // Play no-grab for now.
  //if (!this.isFirstSubgoal(NoGrabDefense)) {
    this.removeAllSubgoals();
    this.addSubgoal(new NoGrabDefense(this.bot));
  //}
};

DefendFlag.prototype.process = function() {
  this.activateIfInactive();
  this.status = this.processSubgoals();
  return this.status;
};

DefendFlag.prototype.handleMessage = function(msg) {
  // Powerup value consideration.
  // Additional enemies present in base.
  // Default behavior.
  return this.forwardToFirstSubgoal(msg);
};

/**
 * Holds the strategy of no-grab defense. Push enemies away from
 * own flag.
 * @extends CompositeGoal
 * @constructor
 */
function NoGrabDefense(bot) {
  CompositeGoal.apply(this, arguments);
}

util.inherits(NoGrabDefense, CompositeGoal);

NoGrabDefense.prototype.activate = function() {
  this.status = GoalStatus.active;
  // Select target enemy.
  var enemies = this.bot.game.enemiesInBase();
  if (enemies.length > 0) {
    // Select first for now.
    var target = enemies[0];
    var base = this.bot.game.base().location;
    this.addSubgoal(new KeepPlayerFromPoint(this.bot, target.id, base));
  } else {
    // Nothing now.
  }
};

NoGrabDefense.prototype.process = function() {
  this.activateIfInactive();

  this.status = this.processSubgoals();

  return this.status;
};

/**
 * Push an enemy away from the flag.
 * @extends CompositeGoal
 * @constructor
 * @param {Bot} bot - The bot.
 * @param {integer} target - The id of the player to push away from
 *   the flag.
 * @param {Point} point - The point to keep the target away from.
 */
function KeepPlayerFromPoint(bot, target, point) {
  CompositeGoal.apply(this, arguments);
  this.target = this.bot.game.player(target);
  this.point = point;
}

util.inherits(KeepPlayerFromPoint, CompositeGoal);

/**
 * Checks that player is in-between target player and point, getting
 * between if necessary and pushing away.
 */
KeepPlayerFromPoint.prototype.activate = function() {
  this.status = GoalStatus.active;
  // The margin for checking whether player is between the two points.
  var margin = 20;
  var playerPos = this.bot.game.location();
  var targetPos = this.bot.game.location(this.target.id);
  var flagPos = this.point;
  if (this.bot.game.isInterposed(playerPos, targetPos, flagPos)) {
    // Player is between target and flag.
    this.bot.chat("I'm between target and flag.");
    //this.addSubgoal(new )
  } else {
    // Player is not between target and flag.
    this.addSubgoal(new StaticInterpose(this.bot, this.target.id, this.point));
  }
};

KeepPlayerFromPoint.prototype.process = function() {
  this.activateIfInactive();

  var status = this.processSubgoals();
  if (status == GoalStatus.completed) {
    // Set to inactive so we run activate next tick.
    this.status = GoalStatus.inactive;
  }

  return this.status;
};

/**
 * Get in-between a target and static point.
 * @param {Bot} bot - The bot.
 * @param {number} target - The id of the player to push away from
 *   the flag.
 * @param {Point} point - The point to keep the target away from.
 */
function StaticInterpose(bot, target, point) {
  CompositeGoal.apply(this, arguments);
  this.target = this.bot.game.player(target);
  this.point = point;
}

util.inherits(StaticInterpose, CompositeGoal);

StaticInterpose.prototype.activate = function() {
  this.status = GoalStatus.active;

  var pos = this.bot.game.location();
  var enemyPos = this.bot.game.location(this.target.id);
  var point = this.point;

  if (!this.bot.game.isInterposed(pos, enemyPos, point)) {
    // Get position to seek towards.
    var vel = this.bot.game.velocity();

    var enemyVel = this.bot.game.velocity(this.target.id);
    // Point to seek between two objects.
    var midpoint = point.add(enemyPos).div(2);
    this.addSubgoal(new SeekToPoint(this.bot, midpoint));
  } else {
    this.status = GoalStatus.completed;
  }
};

StaticInterpose.prototype.process = function() {
  var status = this.processSubgoals();
  if (status !== GoalStatus.active) {
    this.activate();
  }

  return this.status;
};

/**
 * Tries to push a target player away along a ray emanating from a
 * point.
 * @param {Bot} bot - The Bot.
 * @param {Player} target - The target player.
 * @param {Point} point - The point to push the player from.
 * @param {Point} ray - Unit vector direction from point in which to
 *   push the player.
 */
function PushPlayerAway(bot, target, point, ray) {
  Goal.apply(this, arguments);
  this.target = target;
  this.point = point;
  this.ray = ray;
}

util.inherits(PushPlayerAway, Goal);

/**
 * Check that target player is within a margin of the target ray,
 * failing if they are too far.
 */
PushPlayerAway.prototype.activate = function() {
  
};

PushPlayerAway.prototype.process = function() {
  
};

function ContainmentDefense(bot) {
  CompositeGoal.apply(this, arguments);
}

util.inherits(ContainmentDefense, CompositeGoal);

/**
 * Defense strategy to use when flag is out-of-base.
 */
function OffensiveDefense(bot) {
  CompositeGoal.apply(this, arguments);
}

util.inherits(OffensiveDefense, CompositeGoal);

OffensiveDefense.prototype.activate = function() {
  this.status = GoalStatus.active;
};

OffensiveDefense.prototype.process = function() {
  this.activateIfInactive();

  this.status = this.processSubgoals();

  return this.status;
};
