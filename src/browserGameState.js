var PowerupTracker = require('./powerup-tracker');
var physics = require('./physics');
var Maps = require('./maps');

/**
 * @module gamestate
 */
/**
 * The GameState object is responsible for providing information
 * about the environment, including the player's location within it.
 * @constructor
 * @alias module:gamestate
 * @param {TagPro} tagpro - The initialized tagpro object available
 *   in the browser client execution environment.
 */
function GameState(tagpro) {
  // Initialization
  this.tagpro = tagpro;
  this.parameters = {};
  // Holds information about the game physics parameters.
  this.parameters.game = {
    step: 1e3 / 60, // Physics step size in ms.
    radius: {
      spike: 15,
      ball: 19
    },
    respawn: {
      powerup: 60e3 // powerup respawn time, in ms.
    }
  };
  this._initialized = false;
  this.onInitialized(this.init.bind(this));
}

module.exports = GameState;

/**
 * Initialization method called when the tagpro game state has
 * been initialized.
 * @private
 */
GameState.prototype.init = function() {
  this.self = this.player();
  this.socket = this.tagpro.socket;
  this.optimizations();
  this.initEventListener();
  this.initPowerupTracker();
  this.initMapInformation();
  this._initialized = true;
};

/**
 * Initialize event listeners that get sent to the bot.
 * @private
 */
GameState.prototype.initEventListener = function() {
  var self = this;
  function callListeners(id, name, val) {
    if (typeof val == "undefined") val = true;
    if (self.listeners.hasOwnProperty(name) && self.listeners[name][id]) {
      self.listeners[name][id].forEach(function (fn) {
        fn(val);
      });
    }
  }
  this.listeners = {
    boost: {},
    dead: {},
    alive: {},
    flag: {}
  };
  this.socket.on('p', function (updates) {
    updates = updates.u || updates;
    updates.forEach(function (update) {
      var id = update.id;
      // Boost listener.
      // boost velocity magnitude is 7.44 by default or 7.41 with pressing in 
      // the opposite direction
      if (Math.abs(update.lx) >= 7.41 || Math.abs(update.ly) >= 7.41) {
        callListeners(id, "boost");
      }

      // Life listener.
      if (update.hasOwnProperty("dead")) {
        if (update.dead) {
          callListeners(id, "dead");
        } else {
          callListeners(id, "alive");
        }
      }

      // Flag listener.
      if (update.hasOwnProperty("flag")) {
        if (update.flag) {
          callListeners(id, "grab");
        }
      }

      if (update.hasOwnProperty("s-captures")) {
        callListeners(id, "cap");
      }
    });
  });
};

GameState.prototype.initPowerupTracker = function() {
  if (!tagpro.map) {
    setTimeout(this.initPowerupTracker.bind(this), 20);
    return;
  }
  this.listeners.powerup = [];
  var params = this.parameters.powerups = {
    interval: 2e3
  };
  console.log("Initializing powerup tracker.");
  this.powerupTracker = new PowerupTracker(this);
  this.powerupTracker.onGrab(function (event) {
    this.listeners.powerup.forEach(function (fn) {
      fn(event);
    });
  }.bind(this));

  this.powerupTracker.onSpawn(function (event) {
    this.listeners.powerup.forEach(function (fn) {
      fn(event);
    });
  }.bind(this));
  // Loop to get powerup information and send it to the bot.
  this.pupLoop = setInterval(function () {
    var powerupData = this.powerupTracker.getPowerups();
    var powerups = {
      respawning: powerupData.filter(function (powerup) {
        return powerup.present_known && !powerup.present && powerup.taken_time_known;
      }),
      unknown: powerupData.filter(function (powerup) {
        return !powerup.present_known || (!powerup.present && !powerup.taken_time_known);
      }),
      spawned: powerupData.filter(function (powerup) {
        return powerup.present_known && powerup.present;
      }),
      name: "powerups"
    };
    this.listeners.powerup.forEach(function (fn) {
      fn(powerups);
    });
  }.bind(this), params.interval);
};

/**
 * Initialize map-specific information.
 */
GameState.prototype.initMapInformation = function() {
  if (!tagpro.map) {
    setTimeout(function () {
      this.initMapInformation();
    }.bind(this), 100);
    return;
  }
  var text = $("#mapInfo").text();
  var identifiers = text.match(/Map: (.+) by (.+)/);
  if (identifiers.length !== 3) {
    console.warn("Map information not found 1.");
    this.map_info = null;
  } else {
    var name = identifiers[1];
    var author = identifiers[2];
    var map = Maps.get(name, author);
    if (map) {
      console.log("Map information found.");
      this.map_info = map;
    } else {
      console.warn("Map information not found 2.");
      console.log("Name: '%s'; Author: '%s'.", name, author);
      this.map_info = null;
    }
  }
};

GameState.prototype.getMapInfo = function() {
  if (this.map_info) return this.map_info;
  return null;
};

/**
 * Add a listener for a player event.
 * @param {integer} [id]- The id of the player to listen for an event
 *   for. If not provided then it defaults to the id of the current
 *   player.
 * @param {string} name - The name of the event to listen for.
 * @param {Function} callback - The function that receives notification
 *   of the event that occurred.
 */
GameState.prototype.addPlayerListener = function(id, name, callback) {
  if (typeof callback == "undefined") {
    callback = name;
    name = id;
    id = tagpro.playerId;
  }
  if (!this.listeners.hasOwnProperty(name)) {
    this.listeners[name] = {};
  }
  if (!this.listeners[name].hasOwnProperty(id)) {
    this.listeners[name][id] = [];
  }
  this.listeners[name][id].push(callback);
};

/**
 * Add a listener for powerup events, including the main powerup event,
 * spawns, and grabs.
 * @param {Function} callback - The function to be called with the
 *   above events.
 */
GameState.prototype.addPowerupListener = function(callback) {
  this.listeners.powerup.push(callback);
};

/**
 * Get list of powerups, same as is sent in message.
 */
GameState.prototype.getPowerups = function() {
  var powerupData = this.powerupTracker.getPowerups();
  var powerups = {
    respawning: powerupData.filter(function (powerup) {
      return powerup.present_known && !powerup.present && powerup.taken_time_known;
    }),
    unknown: powerupData.filter(function (powerup) {
      return !powerup.present_known || (!powerup.present && !powerup.taken_time_known);
    }),
    spawned: powerupData.filter(function (powerup) {
      return powerup.present_known && powerup.present;
    })
  };
  return powerups;
};

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
};

/**
 * Ensure that the game is initialized, including a playerId
 * provisioned, players set, and renderer started.
 * @return {boolean} - Whether the game has been initialized.
 */
GameState.prototype.initialized = function() {
  return this._initialized;
};

/**
 * Call function when map has been initialized. Callback is called with
 * the map as an argument. Doesn't assume the floor and walltile arrays
 * have been constructed.
 * @param {Function} callback - The callback for the map.
 */
GameState.prototype.onMap = function(callback) {
  if (this.initialized() && tagpro.map) {
    callback(tagpro.map);
  } else {
    this.socket.on('map', function(e) {
      callback(e.tiles);
    });
  }
};

/**
 * Call function once the game has been initialized.
 * @param {Function} callback - The function to call
 */
GameState.prototype.onInitialized = function(callback) {
  if (typeof tagpro !== "undefined" &&
    tagpro.playerId &&
    tagpro.players &&
    tagpro.renderer.renderer) {
    callback();
  } else {
    setTimeout(function() {
      this.onInitialized(callback);
    }.bind(this), 50);
  }
};

/**
 * Register a function to listen for a socket event.
 */
GameState.prototype.on = function(eventName, fn) {
  this.socket.on(eventName, fn);
};

/**
 * Get player given by id, or `null` if no such player exists. If id
 * is not provided, then the current player is returned.
 */
GameState.prototype.player = function(id) {
  if (typeof id == 'undefined') id = tagpro.playerId;
  return tagpro.players[id] || null;
};

/**
 * Get team of player given by id, or `null` if no such player
 * exists. If id is not provided, then the id of the current
 * player is used.
 */
GameState.prototype.team = function(id) {
  var player = this.player(id);
  if (player) {
    return player.team;
  } else {
    return null;
  }
};

/**
 * Returns the array of map tiles, or `null` if not initialized.
 */
GameState.prototype.map = function() {
  if (typeof tagpro !== 'object' || !tagpro.map) return null;
  return tagpro.map;
};

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
};

/**
 * Get predicted location based on current position and velocity.
 * @param {integer} [id] - The id of the player to get the predicted
 *   location for. Defaults to id of current player.
 * @param {number} ahead - The amount to look ahead to determine the
 *   predicted location. Default interpretation is in ms.
 * @param {boolean} [timeInSteps=false] - Whether to interpret `ahead`
 *   as the number of steps in the physics simulation.
 * @return {Point} - The predicted location of the player.
 */
GameState.prototype.pLocation = function(id, ahead, timeInSteps) {
  if (arguments.length == 1) {
    id = this.tagpro.playerId;
    ahead = arguments[0];
    timeInSteps = false;
  } else if (arguments.length == 2) {
    if (typeof arguments[1] == 'boolean') {
      id = this.tagpro.playerId;
      ahead = arguments[0];
      timeInSteps = arguments[1];
    } else {
      timeInSteps = false;
    }
  }
  var steps = timeInSteps ? this._msToSteps(ahead) : ahead;
  var player = this.player(id);
  var v = this.velocity(id);
  // Formula parameters.
  var damping = 0.5;
  var dt = (1.0 / 60);
  // Initial velocity.
  var v_x = v.x,
      v_y = v.y;
  // Holds displacement.
  var d_x = 0,
      d_y = 0;
  var change_x = 0,
      change_y = 0;
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
  // Change in acceleration each step.
  var acc_term_x = player.ac * change_x,
      acc_term_y = player.ac * change_y;
  // Max speed check each step.
  var ms_x = player.ms,
      ms_y = player.ms;
  var damping_factor = 1 - damping * dt;

  for (var step = 0; step < steps; step++) {
    if (Math.abs(v_x) < ms_x) v_x += acc_term_x;
    if (Math.abs(v_y) < ms_y) v_y += acc_term_y;
    v_x *= damping_factor;
    v_y *= damping_factor;
    d_x += v_x * dt;
    d_y += v_y * dt;
  }
  var coord_scale = 100;
  // Convert from physics units to x, y coordinates.
  var d = new Point(d_x * coord_scale, d_y * coord_scale);

  var current_location = this.location(id);

  return current_location.add(d);
};

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
};

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
GameState.prototype.pVelocity = function(id, ahead, timeInSteps) {
  if (arguments.length == 1) {
    id = this.tagpro.playerId;
    ahead = arguments[0];
    timeInSteps = false;
  } else if (arguments.length == 2) {
    if (typeof arguments[1] == 'boolean') {
      id = this.tagpro.playerId;
      ahead = arguments[0];
      timeInSteps = arguments[1];
    } else {
      timeInSteps = false;
    }
  }
  var steps = timeInSteps ? this._msToSteps(ahead) : ahead;
  var player = this.player(id);
  var v = this.velocity(id);
  // Formula parameters.
  var damping = 0.5;
  var dt = (1.0 / 60);
  // Initial velocity.
  var v_x = v.x,
      v_y = v.y;
  var change_x = 0,
      change_y = 0;
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
  // Change in acceleration each step.
  var acc_term_x = player.ac * change_x,
      acc_term_y = player.ac * change_y;
  // Max speed check each step.
  var ms_x = player.ms * change_x,
      ms_y = player.ms * change_y;
  var damping_factor = 1 - damping * dt;
  for (var step = 0; step < steps; step++) {
    if (v_x < ms_x) v_x += acc_term_x;
    if (v_y < ms_y) v_y += acc_term_y;
    v_x *= damping_factor;
    v_y *= damping_factor;
  }

  return new Point(v_x, v_y);
};

/**
 * Given a player id, get the steps required to stop along each axis.
 * @param {[type]} first_argument [description]
 * @return {[type]} [description]
 */
GameState.prototype.stoppingDistance = function(id) {
  if (typeof id == "undefined") id = this.tagpro.playerId;
  var player = this.player(id);
};
/**
 * Given a time in ms, return the number of steps needed to represent
 * that time.
 * @private
 * @param {integer} ms - The number of ms.
 * @return {integer} - The number of steps.
 */
GameState.prototype._msToSteps = function(ms) {
  return Math.ceil(ms / this.parameters.game.step);
};

/**
 * Translate an array location from `tagpro.map` into a point
 * representing the x, y coordinates of the top left of the tile.
 * @private
 * @param {integer} row - The row of the tile.
 * @param {integer} col - The column of the tile.
 * @return {Point} - The x, y coordinates of the tile.
 */
GameState.prototype._arrayToCoord = function(row, col) {
  return new Point(40 * row, 40 * col);
};

/**
 * Indicates whether a player with the given id is visible to the
 * current player.
 * @param {integer} id - The id of the player to check visibility
 *   for.
 * @return {boolean} - Whether the player is visible.
 */
GameState.prototype.visible = function(id) {
  var player = this.player(id);
  return player && player.draw;
};

/**
 * Indicates whether a player with the given id is alive.
 * @param {integer} id - The id of the player to check for
 *   liveliness.
 * @return {boolean} - Whether the player is alive.
 */
GameState.prototype.alive = function(id) {
  return !this.player(id).dead;
};

/**
 * Checks whether a tile is currently visible to a player with the
 * given id.
 * @param {integer} [id] - The id of the player to check tile visibility
 *   for.
 * @param {Point} tile - Array location of tile.
 * @param {number} [buffer] - The distance from the edge of the actual
 *   view area a tile must be to be considered "in-view". Default is
 *   80.
 * @return {boolean}
 */
GameState.prototype.tileVisible = function(id, tile, buffer) {
  var TILE_WIDTH = 40;
  if (typeof id !== "number") {
    player = this.player();
    if (typeof tile !== "undefined") {
      buffer = tile;
    }
    tile = id;
  } else {
    player = this.player(id);
  }
  if (typeof buffer == "undefined") buffer = 80;
  var diff = {
    x: Math.abs(tile.x * TILE_WIDTH - player.x),
    y: Math.abs(tile.y * TILE_WIDTH - player.y)
  };
  var max = {
    x: 660,
    y: 420
  };
  if (diff.x < (max.x - buffer) && diff.y < (max.y - buffer)) {
    return true;
  } else {
    return false;
  }
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
};

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
};

/**
 * Find yellow flag.
 */
GameState.prototype.findYellowFlag = function() {
  return this.findTile(GameState.Tiles.yellowflag);
};

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
    return spikes;
  }
};

// Get visible, active, and same or yellow-colored boost tiles. Returns
// array of array location points.
GameState.prototype.getBoosts = function() {
  var locations;
  if (this.hasOwnProperty("boost_locations")) {
    locations = this.boost_locations;
  } else {
    locations = [];
    for (var x = 0; x < tagpro.map.length; x++) {
      for (var y = 0; y < tagpro.map[0].length; y++) {
        var val = tagpro.map[x][y];
        if (GameState.Tiles.boosts.hasOwnProperty(val)) {
          locations.push({
            x: x,
            y: y,
            state: GameState.Tiles.boosts[Math.floor(val)]
          });
        }
      }
    }
    this.boost_locations = locations;
  }
  var wrongColor = (this.self.team == GameState.Teams.blue ? "red" : "blue");
  locations = locations.filter(function (tile) {
    return this.tileVisible(tile, 0) &&
      tile.state !== wrongColor &&
      GameState.Tiles.boosts[tagpro.map[tile.x][tile.y]];
  }, this);
  return locations;
};

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
  spike: {7: true},
  boosts: {5: true, "5.1": false, 14: "red", "14.1": false, 15: "blue", "15.1": false}
};

GameState.Teams = {
  red: 1,
  blue: 2
};

GameState.GameTypes = {
  ctf: 1, // Capture-the-flag
  yf: 2 // Yellow flag
};

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
};

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
};

/**
 * Takes an array location and gives the traversable tiles adjacent to
 * that tile.
 * @param {Point} loc - The array location to search adjacent to.
 * @return {Array.<point>} - The array locations next to the tile.
 */
GameState.prototype.getTraversableTilesNextTo = function(loc) {
  var bad_tiles = [7];
  var traversableTiles = [];
  var offsets = [-1, 0, 1];
  var x = loc.x;
  var y = loc.y;
  for (var i = 0; i < offsets.length; i++) {
    for (var j = 0; j < offsets.length; j++) {
      var thisX = x + offsets[i],
          thisY = y + offsets[j];
      if ((thisX < 0 || thisX > tagpro.map.length - 1) ||
        (thisY < 0 || thisY > tagpro.map.length - 1) ||
        (thisX === x && thisY === y)) {
        continue;
      } else {
        var val = tagpro.map[thisX][thisY];
        if (bad_tiles.indexOf(val) === -1) {
          traversableTiles.push(new Point(thisX, thisY));
        }
      }
    }
  }
  return traversableTiles;
};

// Identify the game time, whether capture the flag or yellow flag.
// Returns either "ctf" or "yf".
GameState.prototype.gameType = function() {
  if (this.findOwnFlag() && this.findEnemyFlag()) {
    return GameState.GameTypes.ctf;
  } else {
    return GameState.GameTypes.yf;
  }
};

/**
 * Find players that are on the team of the current player, including
 * the current player.
 * @return {Array.<Player>} - The teammates.
 */
GameState.prototype.teammates = function() {
  var teammates = [];
  for (var id in this.tagpro.players) {
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
  for (var id in this.tagpro.players) {
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
 * See if current player is within enemy base.
 */
GameState.prototype.inEnemyBase = function() {
  var base = this.enemyBase();
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
GameState.prototype.base = function() {
  var base = {};
  // Radius used to determine whether something is in-base.
  base.radius = 200;
  base.location = this.findOwnFlag().location;
  return base;
};

GameState.prototype.enemyBase = function() {
  return {
    radius: 200,
    location: this.findEnemyFlag().location
  };
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
