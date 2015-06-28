var geo = require('./geometry');
var Point = geo.Point;

/**
 * @module powerup-tracker
 */

// Parameters, constants.
var TILE_WIDTH = 40;
// Powerup parameters.
var POWERUP_RESPAWN = 60000;

// Max ms between a map update and the corresponding grab event.
var MESSAGE_TIME_BUFFER = 15;

// Maximum distance between a player and powerup tile for a grab.
var MAX_GRAB_DISTANCE = 45;

// Remove the first item in the array that matches the given item.
function arrayRemove(arr, item) {
  var index = arr.indexOf(item);
  if (index !== -1) {
    arr.splice(index, 1);
  }
}

/**
 * The PowerupTracker tracks the state of powerups.
 * @constructor
 * @param {Socket} socket - The TagPro game socket.
 * @param {Map} map - The map as sent over the TagPro game socket.
 * @param {object} players - The object storing player information
 *   from the game socket.
 * @param {integer} id - The id of the current player.
 */
var PowerupTracker = function(gamestate) {//socket, map, players, id) {
  this.gamestate = gamestate;
  this.socket = gamestate.socket;
  this.map = gamestate.map();
  this.events = {
    map_updates: [],
    grabs: []
  };
  this.listeners = {
    spawn: [],
    grab: []
  };
  this.powerups = [];
  this.powerupsById = {};
  this.tileCache = {};
  this.stateCache = {};
  this.check = null;
  this.checkTime = null;
  this.init();
};
module.exports = PowerupTracker;

// Initialize powerups and listeners.
PowerupTracker.prototype.init = function() {
  // Store map update events related to powerups.
  this.socket.on('mapupdate', function (updates) {
    if (!Array.isArray(updates)) {
      updates = [updates];
    }
    var needReconcile = false;
    updates.forEach(function (event) {
      if (Math.floor(event.v) === 6) {
        var e = {
          x: event.x,
          y: event.y,
          v: event.v,
          old_v: this.tileCache[Point.toString(event)],
          time: Date.now(),
          loc: this.gamestate.location(),
          id: Point.toString(event)
        };
        e.visible = this.gamestate.tileVisible(e);
        this.tileCache[e.id] = event.v;
        this.events.map_updates.push(e);
        needReconcile = true;
      }
    }, this);
    if (needReconcile) {
      this.reconcile();
    }
  }.bind(this));

  // s-powerup
  this.socket.on('p', function (event) {
    var updates = event.u || event;
    updates.forEach(function (update) {
      if (update['s-powerups']) {
        var id = update.id;
        var vars = {};
        if (update.hasOwnProperty("draw")) {
          // Player just coming into or just going out of view.
          if (update.draw) {
            // Coming into view, may include specific powerup information if new effect.
          } else {
            // Going out of view, doesn't include specific powerup information.
          }
          // Get location regardless because it's good enough.
          vars.location = this.gamestate.location(id);
          vars.in_view = true;
        } else if (this.gamestate.visible(id)) {
          // Player is in view, definitely includes specific powerup information.
          vars.location = this.gamestate.location(id);
          vars.in_view = true;
        } else {
          // Player is not in view.
          vars.in_view = false;
        }
        var e = {
          player_id: id,
          id: id + "-" + update['s-powerups'],
          time: Date.now()
        };
        for (var prop in vars) {
          e[prop] = vars[prop];
        }
        this.events.grabs.push(e);
        this.reconcile();
      }
    }, this);
  }.bind(this));

  // Wait for tagpro map before this.
  tagpro.map.forEach(function (row, x) {
    row.forEach(function (tile, y) {
      if (Math.floor(tile) !== 6) return;
      var powerup = {
        x: x,
        y: y,
        present_known: true,
        present: (tile !== 6),
        taken_time_known: false,
        taken_time: null,
      };
      powerup.id = Point.toString(powerup);
      this.powerups.push(powerup);
      this.tileCache[powerup.id] = tile;
      this.powerupsById[powerup.id] = powerup;
    }, this);
  }, this);
  this.reconcilePowerups();
};

/**
 * @typedef {object} Powerup
 * @property {boolean} visible - Whether the powerup is visible.
 * @property {integer} x - X location of powerup on map.
 * @property {integer} y - Y location of powerup on map.
 * @property {string} id - id of powerup
 * @property {boolean} present_known
 * @property {boolean} present
 * @property {boolean} taken_time_known
 * @property {integer} taken_time - The time the powerup was taken, as
 *   a ms timestamp.
 * @property {integer} taken_by - The id of the player that took a
 *   powerup.
 * @property {boolean} value_known - Whether the value of the powerup
 *   tile is known.
 * @property {number} value - The value of the powerup tile.
 * @property {boolean} known - Whether the powerup is considered known.
 */
/**
 * Retrieve the powerups.
 * @return {Array.<Powerup>} - The powerups in their current state.
 */
PowerupTracker.prototype.getPowerups = function() {
  this.reconcilePowerups();
  return this.powerups.slice();
};

PowerupTracker.prototype.getPowerup = function(id) {
  return this.powerupsById[id];
};

/**
 * @typedef {object} GrabEvent
 * @property {Point} loc - Location of powerup grabbed.
 * @property {integer} id - Id of grabbing player.
 * @property {number} val - Number corresponding to powerup tile value
 *   prior to grab.
 * @property {integer} time - Timestamp of event.
 */
/**
 * Add function to listen for visible powerup grab.
 * @param {Function} fn - Function called when grab occurs, is passed
 *   grab event object.
 */
PowerupTracker.prototype.onGrab = function(fn) {
  this.listeners.grab.push(fn);
};

/**
 * @typedef {object} SpawnEvent
 * @property {Point} loc - Location of powerup spawned.
 * @property {number} val - Number corresponding to new powerup tile
 *   value.
 * @property {integer} time - Timestamp of event.
 */
/**
 * Add function to listen for visible powerup spawn.
 * @param {Function} fn - Function called when spawn occurs, is passed
 *   spawn event object.
 */
PowerupTracker.prototype.onSpawn = function(fn) {
  this.listeners.spawn.push(fn);
};

/**
 * Reconcile powerups after waiting for a brief period.
 * @private
 */
PowerupTracker.prototype.reconcile = function() {
  var waitTime = 50;
  var maxWait = 500;
  function execute() {
    check = null;
    checkTime = null;
    this.reconcilePowerups();
  }
  var now = Date.now();
  if (this.checkTime === null) {
    this.check = setTimeout(function () {
      this.check = null;
      this.checkTime = null;
      this.reconcilePowerups();
    }.bind(this), waitTime);
    this.checkTime = now;
  } else {
    clearTimeout(this.check);
    this.check = null;
    if (now - this.checkTime > maxWait) {
      this.checkTime = null;
      setTimeout(function () {
        this.reconcilePowerups();
      }, 5);
    } else {
      this.check = setTimeout(function () {
        this.check = null;
        this.checkTime = null;
        this.reconcilePowerups();
      }.bind(this), waitTime);
    }
  }
};

/**
 * Consider powerups.
 * @private
 */
PowerupTracker.prototype.reconcilePowerups = function() {
  // Copy existing information.
  var newPowerups = this.powerups.map(function (powerup) {
    return {
      x: powerup.x,
      y: powerup.y,
      id: powerup.id
    };
  });

  var playerLocation = this.gamestate.location();
  var now = Date.now();

  // Set visible powerups.
  newPowerups.forEach(function (powerup) {
    powerup.visible = this.gamestate.tileVisible(powerup);
  }, this);

  // Set presence and value if directly observable.
  newPowerups.forEach(function (powerup) {
    if (powerup.visible) {
      powerup.present_known = true;
      powerup.present = (this.tileCache[powerup.id] !== 6);
      if (powerup.present) {
        powerup.value_known = true;
        powerup.value = this.tileCache[powerup.id];
      }
    }
  }, this);

  // Update whether present is known based on known taken time.
  newPowerups.forEach(function (powerup, i) {
    // Skip known present powerups.
    if (powerup.visible && powerup.present) return;
    var originalPowerup = this.powerups[i];
    if (originalPowerup.taken_time_known) {
      if (originalPowerup.taken_time + POWERUP_RESPAWN < now) {
        // Powerups that respawned but may have been taken in the
        // meantime.
        powerup.present_known = false;
        powerup.present = null;
        powerup.taken_time_known = false;
        powerup.taken_time = null;
        powerup.taken_time_lower_bound = powerup.taken_time + POWERUP_RESPAWN;
      } else {
        // Powerups that have not respawned yet.
        powerup.present_known = true;
        powerup.present = false;
        powerup.taken_time_known = true;
        powerup.taken_time = originalPowerup.taken_time;
      }
    } else {
      if (!powerup.visible) {
        // Unknown state.
        powerup.present_known = false;
        powerup.present = null;
      }
      // Unknown taken time.
      powerup.taken_time_known = false;
      powerup.taken_time = null;
    }
  }, this);

  // Get rid of old mapupdate events or ones for respawns.
  this.events.map_updates = this.events.map_updates.filter(function (event) {
    return now - event.time < POWERUP_RESPAWN || event.v !== 6;
  });
  
  // Get rid of old s-powerup events.
  this.events.grabs = this.events.grabs.filter(function (event) {
    return now - event.time < POWERUP_RESPAWN;
  });

  // Reorganize mapupdate events.
  var map_updates = this.events.map_updates.reduce(function (obj, event) {
    obj[event.id] = event;
    return obj;
  }, {});

  // Try to match map update events with grab events.
  // This handles cases where we saw both the grab and the tile that was
  // grabbed from, or at least sets an upper bound on when a tile could
  // have been taken.
  newPowerups.forEach(function (powerup, i) {
    // Skip tiles that are present or known to have been taken at a specific time.
    if (powerup.present || powerup.taken_time_known) return;
    var mapUpdate = map_updates[powerup.id];
    if (mapUpdate) {
      // The tile was in view when the powerup was taken, so we know
      // the time.
      if (mapUpdate.visible) {
        // Check for corresponding s-powerup events based on time.
        // Assumes mapupdate may come before or after spowerup, but in practice
        // they always come after.
        var index = null;
        var grabs = this.events.grabs.filter(function (event) {
          return Math.abs(event.time - mapUpdate.time) < MESSAGE_TIME_BUFFER;
        });
        var grab;
        if (grabs.length === 1) {
          grab = grabs[0];
          // Only one, this is our event.
          // TODO: Associate individual that last grabbed the powerup at this tile.
          powerup.present_known = true;
          powerup.present = false;
          powerup.taken_time_known = true;
          powerup.taken_time = mapUpdate.time;
          powerup.taken_by = grab.player_id;
          // Set for removal from events.
          arrayRemove(this.events.grabs, grab);
        } else if (grabs.length === 0) {
          // Shouldn't happen.
          console.error("No grab event associated with a visible mapupdate.");
        } else {
          // Multiple grabs occurred within 15ms of this visible mapupdate event.
          var mapupdate_world_loc = {
            x: mapUpdate.x * TILE_WIDTH,
            y: mapUpdate.y * TILE_WIDTH
          };
          grabs = grabs.filter(function (event) {
            // TODO: Filter based on visibility and distance to mapupdate
            // location.
            // This will rule out grabs that occurred
          });
          if (grabs.length === 1) {
            // Only 1 in range, this is our event (assuming the powerups are spaced out sufficiently)
            grab = grabs[0];
            // TODO: Associate individual that last grabbed the powerup at this tile.
            powerup.present_known = true;
            powerup.present = false;
            powerup.taken_time_known = true;
            powerup.taken_time = mapUpdate.time;
            // Set for removal from spowerup events.
            arrayRemove(this.events.grabs, grab);
          } else {
            // All out of view or none in-view that correspond spatially to our powerup tile.
            powerup.taken_time_upper_bound = mapUpdate.time;
          }
        }
      } else {
        // Set upper bound on taken time based on when we saw this tile.
        powerup.taken_time_upper_bound = mapUpdate.time;
      }

      // Set for removal from map update events.
      arrayRemove(this.events.map_updates, mapUpdate);
    } // else No update found. At best we don't know when it was picked up,
    // at worst we don't know when it was picked up nor if it is 
    // present.
  }, this);

  // Set powerups as 'known' based on a few criteria. These will be
  // disregarded in some further processing.
  newPowerups.forEach(function (powerup) {
    powerup.known = (powerup.present_known && powerup.present) ||
      (powerup.present_known && !powerup.present && powerup.taken_time_known);
    // TODO: Move this somewhere more appropriate? Adjacent grab events for matching
    // to mapupdates will already have occured in the block above.
    if (!powerup.known) {
      var tileLocation = new Point(powerup.x * TILE_WIDTH, powerup.y * TILE_WIDTH);
      // Look for a nearby visible grab event.
      for (var i = 0, l = this.events.grabs.length; i < l; i++) {
        var event = this.events.grabs[i];
        // Skip non-visible grab events.
        if (!event.in_view) continue;
        if (tileLocation.dist(event.location) < MAX_GRAB_DISTANCE) {
          powerup.known = true;
          powerup.present_known = true;
          powerup.present = false;
          powerup.taken_time_known = true;
          powerup.taken_time = event.time;
          arrayRemove(this.events.grabs, event);
          break;
        }
      }
    }
  }, this);

  var unknownPowerups = newPowerups.filter(function (powerup) {
    return !powerup.known;
  });

  var matched = {
    powerups: {},
    events: {}
  };
  this.events.grabs.forEach(function (event) {
    matched.events[event.id] = [];
  });

  // Simultaneously sort:
  // * Unknown powerups by the grab events that may be related
  // * Grab events by the unknown powerups they may related to
  unknownPowerups.forEach(function (powerup) {
    var possibleGrabs = this.events.grabs.slice();
    if (powerup.taken_time_upper_bound || powerup.taken_time_lower_bound) {
      var upper_bound, lower_bound;
      if (powerup.taken_time_lower_bound && powerup.taken_time_upper_bound) {
        upper_bound = powerup.taken_time_upper_bound + MESSAGE_TIME_BUFFER;
        lower_bound = powerup.taken_time_lower_bound - MESSAGE_TIME_BUFFER;
      } else if (powerup.taken_time_lower_bound) {
        upper_bound = Infinity;
        lower_bound = powerup.taken_time_lower_bound;
      } else {
        upper_bound = powerup.taken_time_upper_bound;
        lower_bound = 0;
      }
      possibleGrabs = possibleGrabs.filter(function (event) {
        return event.time < upper_bound && event.time > lower_bound;
      });
    } // else No bounds.
    possibleGrabs.forEach(function (event) {
      matched.events[event.id].push(powerup);
    });
    matched.powerups[powerup.id] = possibleGrabs;
  }, this);

  // Do inference on the rest, looping until there's a loop without additional information.
  /*
  var inferred;
  do {
    inferred = false;
    var counts = {
      powerups: {},
      events: {}
    };
    unknownPowerups.forEach(function (powerup) {
      counts.powerups[powerup.id] = 0;
    });
    this.events.grabs.forEach(function (event) {
      counts.events[event.id] = 0;
    });
  } while (inferred);
  /*
  // Update state after that?
  // At this point the powerups with present_known set to true are those that have been reconciled.
  var knownPups = newPowerups.filter(function (powerup) {
    return powerup.present_known && powerup.present;
  });
  var knownRespawnPups = newPowerups.filter(function (powerup) {
    return powerup.present_known && !powerup.present && powerup.taken_time_known;
  });
  console.log("Known powerups: %d\nKnown respawn times: %d", knownPups.length, knownRespawnPups.length);
  */
  newPowerups.forEach(function (powerup) {
    if (!powerup.present_known) return;
    var isPresent = powerup.present_known && powerup.present;
    if (!this.stateCache.hasOwnProperty(powerup.id)) {
      this.stateCache[powerup.id] = isPresent;
    } else {
      var wasPresent = this.stateCache[powerup.id];
      if (wasPresent && !isPresent) {
        this.listeners.grab.forEach(function (fn) {
          fn({
            name: "powerup_grabbed",
            id: powerup.id
          });
        });
      } else if (!wasPresent && isPresent) {
        this.listeners.spawn.forEach(function (fn) {
          fn({
            name: "powerup_spawned",
            id: powerup.id
          });
        });
      }
      this.stateCache[powerup.id] = isPresent;
    }
  }, this);
  this.powerups = newPowerups;
  this.powerups.forEach(function (powerup) {
    this.powerupsById[powerup.id] = powerup;
  }, this);
};
