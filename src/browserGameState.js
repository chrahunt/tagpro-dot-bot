var PowerupTracker = require('./powerup-tracker');
var physics = require('./physics');
var Maps = require('./maps');
var QuadTree = require('d3').geom.quadtree();

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
    physics: {
      dt: 1.0 / 60, // Length of single step in simulation.
      damping: 0.5
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
  this.tileSearchCache = {};
  this.optimizations();
  this.initEventListener();
  this.initPowerupTracker();
  this.onMap(function (tiles) {
    this.initMapInformation();
    this.initSpatialInformation();
  }.bind(this));
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
      this.map_info = {
        name: name,
        author: author
      };
    }
  }
};

// Initialize spatial information like spikes and wall vertices for querying.
GameState.prototype.initSpatialInformation = function() {
  // Set extent to total map size.
  QuadTree = QuadTree.extent([[0, 0], [tagpro.map.length * 40 + 40, tagpro.map[0].length * 40 + 40]]);
  // Set up wall quadtree.
  var walls = this.getTiles("wall");
  var vertices = [];
  walls.forEach(function (wall) {
    var l = 40,
        x = wall.x * l,
        y = wall.y * l;

    switch (wall.v) {
      case 1:
        vertices.push(
          [x, y],
          [x + l, y],
          [x + l, y + l],
          [x, y + l]);
        break;
      case 1.1:
        vertices.push(
          [x + l, y],
          [x + l, y + l],
          [x, y + l]);
        break;
      case 1.2:
        vertices.push(
          [x, y],
          [x + l, y],
          [x + l, y + l]);
        break;
      case 1.3:
        vertices.push(
          [x, y],
          [x + l, y],
          [x, y + l]);
        break;
      case 1.4:
        vertices.push(
          [x, y],
          [x + l, y + l],
          [x, y + l]);
        break;
    }
  });
  this.wallVertices = QuadTree(vertices);

  // Set up spike quadree.
  var spikes = this.getTiles("spike");
  var spikePoints = spikes.map(function (spike) {
    return [spike.x * 40 + 20, spike.y * 40 + 20];
  });
  this.spikeVertices = QuadTree(spikePoints);
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
    setTimeout(function () {
      this.onMap(callback);
    }.bind(this), 50);
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
 * Returns the array of map tiles, or `null` if not initialized.
 */
GameState.prototype.map = function() {
  if (typeof tagpro !== 'object' || !tagpro.map) return null;
  return tagpro.map;
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
  var ms = this.player(id).ms;
  var v0 = this.velocity(id);
  var acc = this.acceleration(id);
  // Handle case where we get up to max speed.
  var step_end_x = steps;
  if (acc.x !== 0) {
    var max_x = acc.x < 0 ? -ms : ms;
    var stop_x = Math.floor(physics.getSteps(v0.x, acc.x, max_x));
    if (stop_x < steps) {
      step_end_x = stop_x;
    }
  }
  var step_end_y = steps;
  if (acc.y !== 0) {
    var max_y = acc.y < 0 ? -ms : ms;
    var stop_y = Math.floor(physics.getSteps(v0.y, acc.y, max_y));
    if (stop_y < steps) {
      step_end_y = stop_y;
    }
  }
  var d_x = physics.getPosition(v0.x, acc.x, step_end_x),
      d_y = physics.getPosition(v0.y, acc.y, step_end_y);
  var left_x = step_end_x - steps,
      left_y = step_end_y - steps;
  if (left_x > 0) {
    var v_x = acc.x < 0 ? -ms : ms;
    d_x += v_x * (1.0 / 60) * v_x * 100;
  }
  if (left_y > 0) {
    var v_y = acc.y < 0 ? -ms : ms;
    d_y += v_y * (1.0 / 60) * v_y * 100;
  }

  var d = new Point(d_x, d_y);

  var current_location = this.location(id);

  return current_location.add(d);
};

/**
 * Gets velocity of player with given id.
 * @param {integer} [id] - The id of the player to get the velocity
 *   for. Default is the id of current player.
 * @return {Point} - The velocity of the player.
 */
GameState.prototype.velocity = function(id) {
  var player = this.player(id);
  var v_x, v_y;
  if (player.body) {
    var vel = player.body.GetLinearVelocity();
    v_x = vel.x;
    v_y = vel.y;
  } else {
    v_x = player.lx;
    v_y = player.ly;
  }
  return new Point(v_x, v_y);
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
  var ms = this.player(id).ms; // Player max speed.
  var v0 = this.velocity(id);
  var acc = this.acceleration(id);
  
  var v_x = physics.getVelocity(v0.x, acc.x, steps),
      v_y = physics.getVelocity(v0.y, acc.y, steps);
  return new Point(Math.min(Math.max(-ms, v_x), ms), Math.min(Math.max(-ms, v_y), ms));
};

/**
 * Get acceleration applied to a player based on the buttons they are
 * pressing.
 * @param {integer} [id] - The id of the player to get acceleration
 *   for, defaults to the id of the current player.
 * @return {Point} - The x and y acceleration being applied to the
 *   player.
 */
GameState.prototype.acceleration = function(id) {
  var player = this.player(id);
  var acc = player.ac;
  var acc_x = 0,
      acc_y = 0;
  if (player.up && !player.down) {
    acc_y = -acc;
  } else if (player.down && !player.up) {
    acc_y = acc;
  }
  if (player.left && !player.right) {
    acc_x = -acc;
  } else if (player.right && !player.left) {
    acc_x = acc;
  }
  return new Point(acc_x, acc_y);
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

GameState.TileIds = {
  yellow_flag: [16, 16.1],
  red_flag: [3, 3.1],
  blue_flag: [4, 4.1],
  powerup: [6, 6.1, 6.2, 6.3, 6.4],
  bomb: [10, 10.1],
  spike: [7],
  boost: [5, 5.1],
  red_boost: [14, 14.1],
  blue_boost: [15, 15.1],
  wall: [1, 1.1, 1.2, 1.3, 1.4]
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
 * Get locations of tiles with ids in array.
 * @param {string} type - The type of tile to retrieve.
 * @return {Array.<object>} - List of locations corresponding to tiles. Null if type wasn't found.
 */
GameState.prototype.getTiles = function(type) {
  if (this.tileSearchCache.hasOwnProperty(type)) {
    return this.tileSearchCache[type].slice();
  } else {
    var locations = [];
    var ids = GameState.TileIds[type];
    if (!ids) return null;
    for (var x in this.tagpro.map) {
      for (var y in this.tagpro.map[x]) {
        var v = Number(this.tagpro.map[x][y]);
        if (ids.indexOf(v) !== -1) {
          locations.push({
            x: x,
            y: y,
            v: v
          });
        }
      }
    }

    this.tileSearchCache[type] = locations.slice();
    return locations;
  }
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

/**
 * Get wall vertex nearest to the point.
 * @param {Point} p - The point to get the nearest wall vertex to.
 * @return {Point} - The nearest wall vertex.
 */
GameState.prototype.getNearestWallVertex = function(p) {
  var point = [p.x, p.y];
  var result = this.wallVertices.find(point);
  return new Point(result[0], result[1]);
};

GameState.prototype.getNearbyWallVertices = function(point, radius) {
  return this._getPointsInRadius(this.wallVertices, point, radius);
};

GameState.prototype.getNearbySpikes = function(point, radius) {
  return this._getPointsInRadius(this.spikeVertices, point, radius);
};

/**
 * Search the provided quad tree for all points within a given radius
 * @private
 * @param {QuadTree} tree - The quadtree to search.
 * @param {Point} point - The point to use as the basis for the search.
 * @param {number} radius - The distance from the point to search.
 * @return {Aray.<Point>} - The points within the given radius.
 */
GameState.prototype._getPointsInRadius = function(tree, point, radius) {
  function dist2(x1, y1, x2, y2) {
    return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
  }

  function inRect(x, y, x1, y1, x2, y2) {
    var dx1 = x - x1,
      dx2 = x - x2,
      dy1 = y - y1,
      dy2 = y - y2;
    return dx1 * dx2 < 0 && dy1 * dy2 < 0;
  }

  var r = radius;
  var r2 = r * r;
  var x = point.x,
      y = point.y;
  var results = [];
  tree.visit(function getNeighbors(node, x1, y1, x2, y2) {
    if (node.leaf) {
      if (dist2(x, y, node.x, node.y) < r2) {
        results.push([node.x, node.y]);
      }
    } else {
      return !inRect(x, y, x1 - r, y1 - r, x2 + r, y2 + r);
    }
  });
  return results.map(function (p) {
    return new Point(p[0], p[1]);
  });
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
