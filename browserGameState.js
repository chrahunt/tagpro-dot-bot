/**
 * @module gamestate/browser
 */
define(function() {
  /**
   * The GameState object is responsible for getting information about
   * the environment, including the player's location within it.
   * @constructor
   * @alias module:gamestate/browser
   */
  var GameState = function(tagpro) {
    // Initialization
    this.tagpro = tagpro;
    this.parameters = {};
    // Holds information about the game physics parameters.
    this.parameters.game = {
      step: 1e3 / 60, // Physics step size in ms.
      radius: {
        spike: 14,
        ball: 19
      }
    };
    this.self = this.player();
  }

  /**
   * Set up browser-based optimizations that will assist in retrieving
   * information about the game state.
   */
  GameState.prototype.optimizations = function() {
    // Overriding this function allows the state of the box2d body to
    // be accessed from the player object.
    Box2D.Dynamics.b2Body.prototype.GetPosition = function() {
      var player = tagpro.players[this.player.id];
      // Assign "this" to "player.body".
      player.body = player.body || this;
      
      // Return current position.
      return this.m_xf.position;
    };
  }

  GameState.prototype.initialized = function() {
    return !(typeof tagpro !== 'object' || !tagpro.playerId);
  }

  /**
   * Get player given by id, or `null` if no such player exists. If id
   * is not provided, then the current player is returned.
   */
  GameState.prototype.player = function(id) {
    if (typeof id == 'undefined') id = this.tagpro.playerId;
    return this.tagpro.players[id];
  }

  /**
   * Returns the array of map tiles, or `null` if not initialized.
   */
  GameState.prototype.map = function() {
    if (typeof this.tagpro !== 'object' || !this.tagpro.map) return null;
    return this.tagpro.map;
  }

  /**
   * Get the location of the player given by id, or `null` if no such
   * player exists. If id is not provided, then the location for the
   * current player is returned.
   * @param {integer} [id] - The id of the player to get the predicted
   *   location for. Defaults to id of current player.
   * @return {Point} - The current location of the player.
   */
  GameState.prototype.location = function(id) {
    var player = this.player(id);
    return new Point(player.x + 20, player.y + 20);
  }

  /**
   * Get predicted location based on current position and velocity.
   * @param {integer} [id] - The id of the player to get the predicted
   *   location for. Defaults to id of current player.
   * @param {number} ahead - The amount to look ahead to determine the
   *   predicted location. Default interpretation is in ms.
   * @param {boolean} [steps=false] - Whether to interpret `ahead` as
   *   the number of steps in the physics simulation.
   * @return {Point} - The predicted location of the player.
   */
  GameState.prototype.pLocation = function(id, ahead, steps) {
    if (arguments.length == 1) {
      id = this.tagpro.playerId;
      ahead = this._msToSteps(arguments[0]);
    } else if (arguments.length == 2) {
      if (typeof arguments[1] == 'boolean') {
        ahead = arguments[0];
        steps = arguments[1];
        if (!steps) {
          ahead = this._msToSteps(ahead);
        }
      }
    }
    if (steps) {
      var time = this._msToSteps(ahead);
    } else {
      var time = ahead;
    }
    var cv = this.velocity(id);
    // Bound the predicted velocity 
    var pv = this.pVelocity(id, 1, true);
    var current_location = this.location(id);
    var dx = 0;
    var dy = 0;

    if (Math.abs(pv.x) == this.self.ms) {
      // Find point that max velocity was reached.
      var step = Math.abs(pv.x - cv.x) / this.self.ac;
      var accTime = step * (1 / 60);
      dx += accTime * ((pv.x + cv.x) / 2);
      dx += (time - accTime) * pv.x;
    } else {
      dx += time * ((pv.x + cv.x) / 2);
    }

    if (Math.abs(pv.y) == this.self.ms) {
      var step = Math.abs(pv.y - cv.y) / this.self.ac;
      var accTime = step * (1 / 60);
      dy += accTime * ((pv.y + cv.y) / 2);
      dy += (time - accTime) * pv.y;
    } else {
      dy += time * ((pv.y + cv.y) / 2);
    }
    var dl = new Point(dx, dy);
    // Convert from physics units to x, y coordinates.
    dl = dl.mul(100);

    return current_location.add(dl);
  }

  /**
   * Get velocity of player given by id. If id is not provided, then
   * returns the velocity for the current player.
   * @param {integer} [id] - The id of the player to get the velocity
   *   for. Defaults to id of current player.
   * @return {Point} - The velocity of the player.
   */
  GameState.prototype.velocity = function(id) {
    var player = this.player(id);
    var clx, cly;
    if (player.body) {
      var vel = player.body.GetLinearVelocity();
      clx = vel.x;
      cly = vel.y;
    } else {
      clx = player.lx;
      cly = player.ly;
    }
    return new Point(clx, cly);
  }

  /**
   * Get predicted velocity a number of steps into the future based on
   * current velocity, acceleration, max velocity, and the keys being
   * pressed.
   * @param {integer} [id] - The id of the player to get the predicted
   *   velocity for. Defaults to id of current player.
   * @param {number} ahead - The amount to look ahead to determine the
   *   predicted velocity. Default interpretation is in ms.
   * @param {boolean} [steps=false] - Whether to interpret `ahead` as
   *   the number of steps in the physics simulation.
   * @return {Point} - The predicted velocity of the player.
   */
  GameState.prototype.pVelocity = function(id, ahead, steps) {
    if (arguments.length == 1) {
      id = this.tagpro.playerId;
      ahead = this._msToSteps(arguments[0]);
    } else if (arguments.length == 2) {
      if (typeof arguments[1] == 'boolean') {
        ahead = arguments[0];
        steps = arguments[1];
        if (!steps) {
          ahead = this._msToSteps(ahead);
        }
      }
    }
    var vel = this.velocity(id);
    var player = this.player(id);

    var change_x = 0, change_y = 0;
    if (player.pressing.up) {
      change_y = -1;
    } else if (player.pressing.down) {
      change_y = 1;
    }
    if (player.pressing.left) {
      change_x = -1;
    } else if (player.pressing.right) {
      change_x = 1;
    }
    var plx, ply;
    plx = vel.x + player.ac * ahead * change_x;
    plx = Math.sign(plx) * Math.min(Math.abs(plx), player.ms);
    ply = vel.y + player.ac * ahead * change_y;
    ply = Math.sign(ply) * Math.min(Math.abs(ply), player.ms);

    return new Point(plx, ply);
  }

  /**
   * Given a time in ms, return the number of steps needed to represent
   * that time.
   * @private
   * @param {integer} ms - The number of ms.
   * @return {integer} - The number of steps.
   */
  GameState.prototype._msToSteps = function(ms) {
    return ms / this.parameters.game.step;
  }

  /**
   * Translate an array location from `tagpro.map` into a point
   * representing the x, y coordinates of the top left of the tile,
   * or the center of the tile if 'center' is true.
   * @param {integer} row - The row of the tile.
   * @param {integer} col - The column of the tile.
   * @return {Point} - The x, y coordinates of the tile.
   */
  GameState.prototype._arrayToCoord = function(row, col) {
    return new Point(40 * row, 40 * col);
  }

  // Get enemy flag coordinates. An object is returned with properties 'point' and 'present'.
  // if flag is present at point then it will be set to true. If no flag is found, then
  // null is returned.
  GameState.prototype.findEnemyFlag = function() {
    // Get flag value.
    var tile = (this.self.team == GameState.Teams.blue ? GameState.Tiles.redflag : GameState.Tiles.blueflag);
    return this.findTile(tile);
  }

  // Get own flag coordinates. See #findEnemyFlag for details.
  GameState.prototype.findOwnFlag = function() {
    var tile = (this.self.team == GameState.Teams.blue ? GameState.Tiles.blueflag : GameState.Tiles.redflag);
    return this.findTile(tile);
  }

  /**
   * Find yellow flag.
   */
  GameState.prototype.findYellowFlag = function() {
    return this.findTile(GameState.Tiles.yellowflag);
  }

  /**
   * Returns an array of Points that specifies the coordinates of any
   * spikes on the map.
   * @return {Array.<Point>} - An array of Point objects representing the
   *   coordinates of the center of each spike.
   */
  GameState.prototype.getspikes = function() {
    if (this.hasOwnProperty('spikes')) {
      return this.spikes;
    } else {
      var results = this.findTiles(GameState.Tiles.spike);
      var spikes = results.map(function(result) {
        return result.location;
      });
      this.spikes = spikes;
      // Debugging, draw circle used for determining spike intersection.
      /*this.spikes.forEach(function(spike, i) {
        this.draw.addCircle(
          "spike-" + i,
          this.parameters.steering.avoid.spike_intersection_radius,
          0xbbbb00
        );
        this.draw.updateCircle("spike-" + i, spike);
      }, this);*/
      return spikes;
    }
  }

  // Static Game Information
  /**
   * Represents a tile along with its possible values and the value for the 'state' attribute
   * of the tile result that should be returned from a search.
   * @typedef Tile
   * @type {object.<(number|string), *>}
   */
  GameState.Tiles = {
    yellowflag: {16: true, "16.1": false},
    redflag: {3: true, "3.1": false},
    blueflag: {4: true, "4.1": false},
    powerup: {6: false, "6.1": "grip", "6.2": "bomb", "6.3": "tagpro", "6.4": "speed"},
    bomb: {10: true, "10.1": false},
    spike: {7: true}
  };

  GameState.Teams = {
    red: 1,
    blue: 2
  };

  GameState.GameTypes = {
    ctf: 1, // Capture-the-flag
    yf: 2 // Yellow flag
  }

  GameState.prototype.Tiles = GameState.Tiles;
  GameState.prototype.Teams = GameState.Teams;
  GameState.prototype.GameTypes = GameState.GameTypes;

  /**
   * Result of tile search function, contains a location and state.
   * @typedef TileSearchResult
   * @type {object}
   * @property {Point} location - The x, y location of the found tile.
   * @property {*} state - A field defined by the given tile object and
   *   the actual value that was matched.
   */

  /**
   * Search the map for a tile matching the given tile description, and
   * return the first one found, or `null` if no such tile is found. The
   * location in the returned tile results points to the center of the
   * tile.
   * @param {Tile} tile - A tile to search for.
   * @return {?TileSearchResult} - The result of the tile search, or
   *   null if no tile was found.
   */
  GameState.prototype.findTile = function(tile) {
    // Get keys and convert to numbers
    var vals = Object.keys(tile).map(function(val) {return +val;});
    for (var row in this.tagpro.map) {
      for (var col in this.tagpro.map[row]) {
        if (vals.indexOf(+this.tagpro.map[row][col]) !== -1) {
          var loc = this._arrayToCoord(+row, +col).add(20);
          var state = tile[this.tagpro.map[row][col]];
          return {location: loc, state: state};
        }
      }
    }
    return null;
  }

  /**
   * Find all tiles in map that match the given tile, and return their
   * information.
   * @param {Tile} tile - A tile type to search for the locations of in
   *   the map.
   * @return {Array.<TileSearchResult>} - The results of the search, or
   *   an empty array if no tiles were found.
   */
  GameState.prototype.findTiles = function(tile) {
    var tiles_found = [];
    var vals = Object.keys(tile).map(function(val) {return +val;});
    for (var row in this.tagpro.map) {
      for (var col in this.tagpro.map[row]) {
        if (vals.indexOf(+this.tagpro.map[row][col]) !== -1) {
          var loc = this._arrayToCoord(+row, +col).add(20);
          var state = tile[this.tagpro.map[row][col]];
          tiles_found.push({location: loc, state: state});
        }
      }
    }
    return tiles_found;
  }

  // Identify the game time, whether capture the flag or yellow flag.
  // Returns either "ctf" or "yf".
  GameState.prototype.gameType = function() {
    if (this.findOwnFlag() && this.findEnemyFlag()) {
      return GameState.GameTypes.ctf;
    } else {
      return GameState.GameTypes.yf;
    }
  }
  return GameState;
});
