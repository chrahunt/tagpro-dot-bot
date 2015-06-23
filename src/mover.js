/**
 * @module mover
 */
/**
 * The Mover is responsible for executing actions to change agent
 * velocity in the game environment.
 * 
 * Agents should initialize then use the `move` function for a higher-
 * level interface, or `press` for the low-level keypress interface.
 * @constructor
 * @param {GameState} state - The game state interface, which can
 *   provide the player's current velocity as well as the socket to
 *   interface with.
 * @param {object} [options] - Options governing the movement behavior.
 */
var Mover = function(state, opts) {
  this.dirs = ["up", "down", "left", "right"];
  this.socket = state.socket;
  this.state = state;
  this.parameters = {
    action_threshold: 0.05,
    top_speed_threshold: 0.1,
    current_vector: 0
  };
  if (typeof opts !== "undefined") {
    // merge options.
  }

  // Override emit to have one key press count.
  this.socket.emit = (function() {
    var socketEmit = tagpro.socket.emit;
    var keyCount = 1;
    var keyState = {};
    var presses = [];
    var time = 1000;
    var limit = 15;
    return function(event, data) {
      if (event === "keyup" || event === "keydown") {
        if (keyState[data.k] === event) return;
        var now = Date.now();
        presses.push(now);
        var recent_presses = presses.filter(function (press) {
          return now - press < time;
        });
        if (recent_presses.length > limit) {
          recent_presses.pop();
          presses = recent_presses;
          return;
        } else {
          presses = recent_presses;
        }
        keyState[data.k] = event;
        data.t = keyCount++;
      }
      socketEmit.apply(this.socket, arguments);
    };
  })();
  // Initialize.
  this.press({});
};

module.exports = Mover;

/**
 * @typedef DirHash
 * @type {object}
 * @property {boolean} [left]
 * @property {boolean} [right]
 * @property {boolean} [up]
 * @property {boolean} [down]
 */
/**
 * Sets the state of movement directions to that indicated by the
 * `state` parameter. If a direction is omitted from the object then
 * it will be assumed `false` and the keys corresponding to that
 * movement direction will be 'released'.
 * @param {DirHash} state - The desired movement direction states.
 */
Mover.prototype.press = function(state) {
  for (var i = 0, l = this.dirs.length; i < l; i++) {
    var dir = this.dirs[i];
    var action = state[dir] ? "keydown" : "keyup";
    this.socket.emit(action, {k: dir});
  }
};

/**
 * Takes a vector representing the desired velocity and presses the
 * keys that make it happen.
 * @param {Point} vec - The desired velocity.
 */
Mover.prototype.move = function(vec) {
  // The cutoff for the difference between a desired velocity and the
  // current velocity is small enough that no action needs to be taken.
  var ACTION_THRESHOLD = this.parameters.action_threshold;
  var CURRENT_VECTOR = this.parameters.current_vector;
  var TOP_SPEED_THRESHOLD = this.parameters.top_speed_threshold;
  var current = this.state.pVelocity(CURRENT_VECTOR);
  var topSpeed = this.state.player().ms;
  var isTopSpeed = {};
  // actual speed can vary +- 0.02 of top speed/
  isTopSpeed.x = Math.abs(topSpeed - Math.abs(current.x)) < TOP_SPEED_THRESHOLD;
  isTopSpeed.y = Math.abs(topSpeed - Math.abs(current.y)) < TOP_SPEED_THRESHOLD;
  var dirs = {};
  if (Math.abs(current.x - vec.x) < ACTION_THRESHOLD && (Math.abs(vec.x) < Math.abs(current.x))) {
    // Do nothing.
  } else if (Math.abs(current.x - vec.x) < ACTION_THRESHOLD) {
    // We're already going fast and we want to keep going fast.
    if (isTopSpeed.x) {
      if (current.x > 0) {
        dirs.right = true;
      } else {
        dirs.left = true;
      }
    }
  } else if (vec.x < current.x) {
    dirs.left = true;
  } else {
    dirs.right = true;
  }

  if (Math.abs(current.y - vec.y) < ACTION_THRESHOLD && (Math.abs(vec.y) < Math.abs(current.y))) {
    // Do nothing.
  } else if (Math.abs(current.y - vec.y) < ACTION_THRESHOLD) {
    // We're already going fast and we want to keep going fast.
    if (isTopSpeed.y) {
      if (current.y > 0) {
        dirs.down = true;
      } else {
        dirs.up = true;
      }
    }
  } else if (vec.y < current.y) {
    dirs.up = true;
  } else {
    dirs.down = true;
  }
  this.press(dirs);
};
