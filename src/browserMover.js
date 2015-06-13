/**
 * The Mover is responsible for executing actions within the
 * browser environment and managing keypresses.
 * Agents should utilize a personal `move` function that should
 * be set as the move function of the object created from this
 * class.
 * @constructor
 * @alias module:mover/browser
 */
var Mover = function(socket) {
  this.dirs = ["up", "down", "left", "right"];
  this.socket = socket;
  // Override emit to have one key press count.
  this.socket.emit = (function() {
    var socketEmit = tagpro.socket.emit;
    var keyCount = 1;
    var keyState = {};
    return function(event, data) {
      if (event === "keyup" || event === "keydown") {
        if (keyState[data.k] === event) return;
        keyState[data.k] = event;
        data.t = keyCount++;
      }
      socketEmit.apply(this.socket, arguments);
    };
  })();
  this.move({});
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
Mover.prototype.move = function(state) {
  for (var i = 0, l = this.dirs.length; i < l; i++) {
    var dir = this.dirs[i];
    var action = state[dir] ? "keydown" : "keyup";
    this.socket.emit(action, {k: dir});
  }
};
