/**
 * @module gamestate/browser
 */
define(function() {
  /**
   * The GameState object is responsible for providing information
   * about the environment, including the player's location within it.
   * @constructor
   * @alias module:gamestate/browser
   * @param {TagPro} tagpro - The initialized tagpro object available
   *   in the browser client execution environment.
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
   * @private
   * @param {integer} row - The row of the tile.
   * @param {integer} col - The column of the tile.
   * @return {Point} - The x, y coordinates of the tile.
   */
  GameState.prototype._arrayToCoord = function(row, col) {
    return new Point(40 * row, 40 * col);
  }

  /**
   * Indicates whether a player with the given id is visible to the
   * current player.
   * @param {integer} id - The id of the player to check visibility
   *   for.
   * @return {boolean} - Whether the player is visible.
   */
  GameState.prototype.visible = function(id) {
    return !!this.player(id).draw;
  };

  /**
   * Locates the enemy flag. If found and not taken, the `state` of the
   * returned search result will be true, and false otherwise. If not
   * found, then null is returned.
   * @return {?TileSearchResult} - The search result for the enemy flag,
   *   if found.
   */
  GameState.prototype.findEnemyFlag = function() {
    // Get flag value.
    var tile = (this.self.team == GameState.Teams.blue ? GameState.Tiles.redflag : GameState.Tiles.blueflag);
    return this.findTile(tile);
  }

  /**
   * Locates the team flag for the current player. If found and not
   * taken, the `state` of the returned search result will be true, and
   * false otherwise. If not found, then null is returned.
   * @return {?TileSearchResult} - The search result for the flag, if
   *   found.
   */
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

  /**
   * Find players that are on the team of the current player.
   * @return {Array.<Player>} - The teammates.
   */
  GameState.prototype.teammates = function() {
    var teammates = [];
    for (id in this.tagpro.players) {
      var player = this.tagpro.players[id];
      if (player.team == this.self.team) {
        teammates.push(player);
      }
    }
    return teammates;
  };

  /**
   * Find players that are not on the team of the current player.
   * @return {Array.<Player>} - The non-teammate players.
   */
  GameState.prototype.enemies = function() {
    var enemies = [];
    for (id in this.tagpro.players) {
      var player = this.tagpro.players[id];
      if (player.team !== this.self.team) {
        enemies.push(player);
      }
    }
    return enemies;
  };

  /**
   * Check if any of the given players are within a given circular
   * area. Limits to visible players.
   * @param {Array.<Player>} players - The players to look for.
   * @param {Point} center - The center of the point to look for
   *   players within.
   * @param {number} radius - The radius to search within.
   * @return {Array.<Player>} - The players found within the area.
   */
  GameState.prototype.playersWithinArea = function(players, center, radius) {
    var found = players.filter(function(player) {
      return this.playerWithinArea(player, center, radius);
    }, this);
    return found;
  };

  /**
   * Check if a given player is within a certain range of a point. If
   * the player is not visible, then returns false.
   * @param {Player} player - The player to check the location of.
   * @param {Point} center - The center of the area to use for location
   *   determination.
   * @param {number} radius - The radius of the area centered at the
   *   point to search within.
   * @return {boolean} - Whether the player is in the area.
   */
  GameState.prototype.playerWithinArea = function(player, center, radius) {
    if (!this.visible(player.id)) return false;
    var loc = this.location(player.id);
    return loc.sub(center).len() < radius;
  };

  /**
   * Determines which enemies are in the current player's base.
   * @return {Aray.<Player>} - The enemies in base.
   */
  GameState.prototype.enemiesInBase = function() {
    var enemies = this.enemies();
    var base = this.base();
    var found = this.playersWithinArea(enemies, base.location, base.radius);
    return found;
  };

  /**
   * Determines whether the current player is in-base or not.
   * @return {boolean} - Whether the current player is in-base.
   */
  GameState.prototype.inBase = function() {
    var base = this.base();
    return this.playerWithinArea(this.self, base.location, base.radius);
  };

  /**
   * Holds information about what is considered the 'base' for the
   * current player. Defines a circular area centered on the current
   * player's flag.
   * @typedef Base
   * @type {object}
   * @property {?Point} location - The location of the center of the
   *   base. If no flag for the current player is found, then this is
   *   null.
   * @property {number} radius - The distance away from the center
   *   point that the base extends.
   */
  /**
   * Returns information about the current player's base that can be
   * used for determining the number of players/items in base.
   * @return {Base} - The base location/extent information.
   */
  GameState.prototype.base = function(first_argument) {
    var base = {};
    // Radius used to determine whether something is in-base.
    base.radius = 200;
    base.location = this.findOwnFlag().location;
    return base;
  };

  /**
   * Determines whether or not the current player is within `margin`
   * of the line between two points.
   * @param {Point} p - The point to check between the two points.
   * @param {Point} p1 - The first point.
   * @param {Point} p2 - The second point.
   * @param {number} [margin=20] - the distance from the line between p1 and
   *   p2 that the current player may be to be considered 'between'
   *   them.
   * @return {boolean} - Whether the player is between the given points.
   */
  GameState.prototype.isInterposed = function(p, p1, p2, margin) {
    if (typeof margin == 'undefined') margin = 20;
    return Math.abs(p1.dist(p) + p2.dist(p) - p1.dist(p2)) < margin;
  };

  return GameState;
});
