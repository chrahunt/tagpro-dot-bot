/**
 * @module mover/browser
 */
define(function() {
  /**
   * The Mover is responsible for executing actions within the
   * browser environment and managing keypresses.
   *
   * To set an agent as a mover, extend its prototype, like
   *     $.extend(Agent.prototype, new Mover());
   * @constructor
   * @alias module:mover/browser
   */
  var Mover = function() {
    // Tracks active movement directions.
    this.dirPressed = {right: false, left: false, down: false, up: false};

    // Maps directions to key codes.
    this.keyCodes = {
      right: 100,
      left: 97,
      down: 115,
      up: 119
    };

    // For differently-named viewports on tangent/other servers.
    var possible_ids = ["viewPort", "viewport"];
    for (var i = 0; i < possible_ids.length; i++) {
      var possible_id = possible_ids[i];
      if ($('#' + possible_id).length > 0) {
        this.viewport = $('#' + possible_id);
        break;
      }
    }
    
    // This is to detect key presses. Both real key presses and the bots. This is needed so we don't mess up the simPressed object.
    document.onkeydown = this._keyUpdateFunc(true);

    // This is to detect key releases. Both real key releases and the bots. This is needed so we don't mess up the simPressed object.
    document.onkeyup = this._keyUpdateFunc(false);
  }

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
    // Keys to set.
    var keys = [];
    var keysSeen = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    // Add calls for explicitly set keys.
    for (var dir in state) {
      keysSeen[dir] = true;
      if (state[dir] !== this.dirPressed[dir]) {
        keys.push({
          dir: dir,
          state: (state[dir] ? "keydown" : "keyup")
        });
      }
    }

    // Add calls for keys not explicitly set.
    for (var dir in keysSeen) {
      if (!keysSeen[dir] && this.dirPressed[dir]) {
        keys.push({
          dir: dir,
          state: "keyup"
        });
      }
    }

    if (keys.length > 0)
      this._updateKeys(keys);
  }

  /**
   * This function takes an array of function simulates a keypress on the viewport.
   * @param {Array.<{{dir: string, state: string}}>} keys - The keys
   *   to update. The dir property gives the direction and state is either
   *   "keyup" or "keydown".
   */
  Mover.prototype._updateKeys = function(keys) {
    keys.forEach(function(key) {
      var e = $.Event(key.state);
      e.keyCode = this.keyCodes[key.dir];
      this.viewport.trigger(e);
    }, this);
  }

  /**
   * Creates a callback function for updating current movement direction
   * as the server sees it.
   * @param {boolean} newState - Whether the event indicates the key
   *   would cause movement in a direction.
   * @returns {function} - Function to update the movement direction state.
   */
  Mover.prototype._keyUpdateFunc = function(newState) {
    return function(d) {
      d = d || window.event;
      switch(d.keyCode) {
        case 39: case 68: case 100: this.dirPressed.right = newState; break;
        case 37: case 65: case 97: this.dirPressed.left = newState; break;
        case 40: case 83: case 115: this.dirPressed.down = newState; break;
        case 38: case 87: case 119: this.dirPressed.up = newState; break;
      }
    }.bind(this);
  }
  return Mover;
});
