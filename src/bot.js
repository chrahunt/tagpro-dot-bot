var NavMesh = require('tagpro-navmesh');

var Brain = require('./brain');
var DrawUtils = require('./drawutils');
var geo = require('./geometry');
var ActionManager = require('./actionmanager');
var Mover = require('./mover');

/**
 * A Bot is responsible for decision making, navigation (with the aid
 * of map-related modules) and low-level steering/locomotion.
 * @exports Bot
 */
// Alias useful classes.
var Point = geo.Point;
var Poly = geo.Poly;
var PolyUtils = geo.util;

var Stance = {
  offense: 0,
  defense: 1
};

function smoothArray(array, smoothing) {
  var newArray = [];
  for (i = 0; i < array.length; i++) {
    var sum = 0;

    for (index = i - smoothing; index <= i + smoothing; index++) {
      var thisIndex = index < 0 ? index + array.length : index % array.length;
      sum += array[thisIndex];
    }
    newArray[i] = sum / ((smoothing * 2) + 1);
  }

  return newArray;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

/**
 * @constructor
 * @name Bot
 * @param {} state
 * @param {Logger} [logger]
 */
var Bot = function(state, logger) {
  if (typeof logger == 'undefined') logger = { log: function() {} };
  this.logger = logger;

  // Holds actions executed on an interval.
  this.actions = new ActionManager();

  this.game = state;

  this.stance = Stance.offense;

  this.initialized = false;
  this.mapInitialized = false;
  this.stopped = true;
  this.init();
};

module.exports = Bot;

/**
 * Initialize bot.
 * @private
 */
Bot.prototype.init = function() {
  this.logger.log("bot", "Initializing Bot.");
  // Ensure that the tagpro global object has initialized and allocated us an id.
  if (!this.game.initialized()) { return setTimeout(this.init.bind(this), 250); }

  // Self is the TagPro player object.
  this.self = this.game.player();

  this._initializeParameters();

  // Set up drawing.
  this.draw = new DrawUtils();

  // Register items to draw.
  this.draw.addVector("seek", 0x00ff00);
  this.draw.addVector("avoid", 0xff0000);
  this.draw.addVector("desired", 0x0000ff);
  this.draw.addBackground("mesh", 0x555555);
  this.draw.addPoint("goal", 0x00ff00, "foreground");
  this.draw.addPoint("hit", 0xff0000, "foreground");

  this.game.onMap(this._processMap.bind(this));

  this.brain = new Brain(this);

  // Sensed keeps track of sensed states.
  this.sensed = {
    dead: false
  };
  this.lastSense = 0;

  var mover = new Mover(this.game.socket);
  // Hold environment-specific movement and game state objects.
  this.move = mover.move.bind(mover);
  this.press = mover.press.bind(mover);

  this.logger.log("bot", "Bot loaded."); // DEBUG

  this.initialized = true;
};

/**
 * Initialize the parameters for the various variable functions of
 * the bot.
 * @private
 */
Bot.prototype._initializeParameters = function() {
  this.parameters = {};
  
  // Holds information about the game physics parameters.
  this.parameters.game = {
    step: 1e3 / 60, // Physics step size in ms.
    radius: {
      spike: 15,
      ball: 19
    }
  };

  // Holds interval update timers.
  this.parameters.intervals = {
    game: 1000,
    navigate: 10,
    goal: 10
  };

  // Hold steering parameters.
  this.parameters.steering = {};
  this.parameters.steering.seek = {
    max_see_ahead: this.parameters.intervals.navigate
  };

  this.parameters.steering.avoid = {
    max_see_ahead: 200, // Time in ms to look ahead for a collision.
    assumed_difference: 35,
    spike_intersection_radius: this.parameters.game.radius.spike + this.parameters.game.radius.ball
  };
};

/**
 * Process map and generate navigation mesh.
 * @private
 */
Bot.prototype._processMap = function(map) {
  this.navmesh = new NavMesh(map, this.logger);

  // Whether the navigation mesh has been updated.
  this.navUpdate = false;

  // Update navigation mesh visualization and set flag for
  // sense function to pass message to brain.
  this.navmesh.onUpdate(function(polys) {
    this.logger.log("bot", "Navmesh updated.");
    this.navUpdate = true;
  }.bind(this));

  // Add tile id of opposite team tile to navmesh impassable
  if (this.game.team() == this.game.Teams.red) {
    // Blue gate and red speedpad.
    this.navmesh.setImpassable([9.3, 14]);
  } else {
    // Red gate and blue speedpad.
    this.navmesh.setImpassable([9.2, 15]);
  }

  // Set mapUpdate function of navmesh as the callback to the tagpro
  // mapupdate packets.
  this.navmesh.listen(this.game.tagpro.socket);

  this.logger.log("bot", "Navmesh constructed.");

  this.mapInitialized = true;
};

/**
 * Update function that drives the rest of the ongoing bot behavior.
 */
Bot.prototype.update = function() {
  this.brain.process();
  this._move();
  // Sense any real-time, big-implication environment actions and
  // send to brain.
  this._sense();
};

Bot.prototype.attack = function() {
  this.stance = Stance.offense;
};

Bot.prototype.defend = function() {
  this.stance = Stance.defense;
};

Bot.prototype.isOffense = function() {
  return this.stance == Stance.offense;
};

Bot.prototype.isDefense = function() {
  return this.stance == Stance.defense;
};

/**
 * Sense environment changes and send messages to brain if needed.
 * @private
 */
Bot.prototype._sense = function() {
  // Newly dead.
  if (this.self.dead && !this.sensed.dead) {
    this.sensed.dead = true;
    this.brain.handleMessage("dead");
  }
  // Newly living.
  if (this.sensed.dead && !this.self.dead) {
    this.sensed.dead = false;
    this.brain.handleMessage("alive");
  }
  if (this.last_stance && this.last_stance !== this.stance) {
    this.brain.handleMessage("stanceChange");
  }
  this.last_stance = this.stance;
  if (this.navUpdate) {
    this.brain.handleMessage("navUpdate");
    this.navUpdate = false;
  }
  this.lastSense = Date.now();
};

// Do movements.
Bot.prototype._move = function() {
  if (this.goal) {
    this.navigate();
  } else {
    this.allUp();
  }
};

/**
 * Sets the given point as the target for the bot to navigate to.
 * @param {Point} point - The point to navigate to.
 */
Bot.prototype.setTarget = function(point) {
  this.goal = point;
};

// Stops the bot. Sets the stop action which all methods need to check for, and also
// ensures the bot stays still (ish).
Bot.prototype.stop = function() {
  this.logger.log("bot", "Stopping bot.");
  this.stopped = true;
  this.goal = false;
  this.actions.remove("think");
  this.actions.remove("update");

  // Stop thinking.
  this.brain.terminate();

  // Stop moving.
  this.allUp();
  this._removeDraw();
};

// Restarts the bot.
Bot.prototype.start = function() {
  // Don't execute if bot or map isn't initialized.
  if (!this.initialized || !this.mapInitialized) {
    this.logger.log("bot:info", "Bot not initialized. Cancelling start.");
    return;
  } else {
    this.logger.log("bot:info", "Starting bot.");
  }

  this.stopped = false;
  this.brain.think();
  this.actions.add("think", this.brain.think.bind(this.brain), 500);
  this.actions.add("update", this.update.bind(this), 20);
};

/**
 * Navigates a path, assuming the end target is static.
 */
Bot.prototype.navigate = function() {
  // Don't execute function if bot is stopped.
  if (this.stopped) return;

  this.desired_vector = this._steering(32);
  // Apply desired vector after a short delay.
  setTimeout(function() {
    if (!this.stopped) {
      this._update(this.desired_vector.mul(2));
    }
  }.bind(this), 0);
};

/**
 * @param {number} n - The number of vectors to consider.
 */
Bot.prototype._steering = function(n) {
  if (typeof n == 'undefined') n = 8;
  // Generate vectors.
  var angle = 2 * Math.PI / n;
  var vectors = [];
  for (var i = 0; i < n; i++) {
    vectors.push(new Point(Math.cos(angle * i), Math.sin(angle * i)));
  }

  // Calculate costs.
  var costs = [];
  costs.push(this._inv_Avoid(vectors));
  costs.push(this._inv_Seek(vectors));
  this.costs = costs;

  // Do selection.
  var heuristic = function(costs) {
    var w = 1;
    var summedCosts = [];
    for (var i = 0; i < costs[0].length; i++) {
      summedCosts[i] = 0;
    }
    summedCosts = costs.reduce(function(summed, cost) {
      return summed.map(function(sum, i) {
        return sum + cost[i];
      });
    }, summedCosts);
    var min = summedCosts[0];
    var idx = 0;
    for (var i = 1; i < summedCosts.length; i++) {
      if (summedCosts[i] < min) {
        min = summedCosts[i];
        idx = i;
      }
    }
    return idx;
  };

  var idx = heuristic(costs);
  return vectors[idx];
};

// Takes in vectors, associates cost with each.
// Returns vector of costs.
Bot.prototype._inv_Avoid = function(vectors) {
  var costs = vectors.map(function() {
    return 0;
  });
  var params = this.parameters.steering.avoid;

  // For determining intersection and cost of distance.
  var SPIKE_INTERSECTION_RADIUS = params.spike_intersection_radius;
  // For determining how many ms to look ahead for the location to use
  // as the basis for seeing the impact a direction will have.
  var LOOK_AHEAD = params.max_see_ahead;

  // For determining how much difference heading towards a single direction
  // will make.
  var DIR_LOOK_AHEAD = params.assumed_difference;

  // Ray with current position as basis.
  var position = this.game.location();
  // look ahead 20ms
  var ahead = this.game.pLocation(LOOK_AHEAD);
  var ahead_distance = ahead.sub(position).len();

  var relative_location = ahead.sub(position);

  var spikes = this.game.getspikes();

  var bad_directions = [];
  vectors.forEach(function(vector, i) {
    vector = relative_location.add(vector.mul(DIR_LOOK_AHEAD));
    var veclen = vector.len();
    // Put vector relative to predicted position.
    vector = vector.normalize();
    for (var j = 0; j < spikes.length; j++) {
      var spike = spikes[j];
      // Skip spikes that are too far away to matter.
      if (spike.dist(position) - SPIKE_INTERSECTION_RADIUS > veclen) continue;
      collision = PolyUtils.lineCircleIntersection(
        position,
        vector,
        spike,
        SPIKE_INTERSECTION_RADIUS
      );
      if (collision.collides) {
        if (collision.inside) {
          costs[i] += 100;
        } else {
          // Calculate cost.
          costs[i] += SPIKE_INTERSECTION_RADIUS / position.dist(collision.point);
        }
      }
    }
  });
  vectors.forEach(function (vector, i) {
    if (bad_directions.indexOf(i) !== -1) return;

    costs[i] += bad_directions.reduce(function (sum, j) {
      return vector.dot(vectors[j]) * costs[j] + sum;
    }, 0);
  });
  return costs;
};

/**
 * Takes an array of unit vectors and assigns a penalty to each
 * depending on how much they do not align.
 * @param {[type]} vectors [description]
 * @return {[type]} [description]
 */
Bot.prototype._inv_Seek = function(vectors) {
  var costs = vectors.map(function() {
    return 0;
  });

  if (this.goal) {
    var params = this.parameters.steering.seek;
    var p = this.game.location();
    var goal = this.goal.sub(p).normalize();
    
    vectors.forEach(function(vector, i) {
      var val = vector.dot(goal);
      if (val <= 0) {
        // Vector points away from or at 90 degrees to goal.
        costs[i] = 20;
      } else {
        // Vector points towards goal, with less penalty the closer it
        // points.
        costs[i] = clamp(1 / val, 0, 20);
      }
    });
  }
  return costs;
};

Bot.prototype._removeDraw = function() {
  this.draw.hideVector("seek");
  this.draw.hideVector("avoid");
};

/**
 * Scale a vector so that one of the components is maximized.
 * @param {Point} vec - The vector to scale.
 * @param {number} max - The maximum (absolute) value of either component.
 * @return {Point} - The converted vector.
 */
Bot.prototype._scaleVector = function(vec, max) {
  var ratio = 0;
  if (Math.abs(vec.x) >= Math.abs(vec.y) && vec.x !== 0) {
    ratio = Math.abs(max / vec.x);
  } else if (vec.y !== 0) {
    ratio = Math.abs(max / vec.y);
  }
  var scaled = vec.mul(ratio);
  return scaled;
};

/**
 * Takes the desired velocity as a parameter and presses the keys
 * necessary to make it happen.
 * @param {Point} vec - The desired velocity.
 */
Bot.prototype._update = function(vec) {
  if (vec.x === 0 && vec.y === 0) return;
  var params = {
    action_threshold: 0.01,
    top_speed_threshold: 0.1,
    current_vector: 0
  };
  // The cutoff for the difference between a desired velocity and the
  // current velocity is small enough that no action needs to be taken.
  var ACTION_THRESHOLD = params.action_threshold;
  var CURRENT_VECTOR = params.current_vector;
  var TOP_SPEED_THRESHOLD = params.top_speed_threshold;
  var current = this.game.pVelocity(CURRENT_VECTOR);
  var topSpeed = this.self.ms;
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

/**
 * Stop all movement.
 */
Bot.prototype.allUp = function() {
  this.press({});
};

/**
 * Send a chat message to the active game. Truncates messages that
 * are too long. Maximum length for a message is 71.
 * @param {string} message - The message to send.
 * @param {boolean} [all=true] - Whether the chat should be to all
 *   players or just to the team.
 */
Bot.prototype.chat = function(message, all) {
  if (typeof all == 'undefined') all = true;
  if (!this.hasOwnProperty('lastMessage')) this.lastMessage = 0;
  var limit = 500 + 10;
  var now = Date.now();
  var timeDiff = now - this.lastMessage;
  var maxLength = 71;
  if (timeDiff > limit) {
    if (message.length > maxLength) {
      message = message.substr(0, maxLength);
    }
    tagpro.socket.emit("chat", {
      message: message,
      toAll: all ? 1 : 0
    });
    this.lastMessage = Date.now();
  } else if (timeDiff >= 0) {
    setTimeout(function() {
      this.chat(message, all);
    }.bind(this), limit - timeDiff);
  }
};