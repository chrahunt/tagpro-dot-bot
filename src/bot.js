var NavMesh = require('tagpro-navmesh');

var Brain = require('./behavior/brain');
var geo = require('./geometry');
var ActionManager = require('./actionmanager');
var Mover = require('./mover');
var Steerer = require('./steerer');

// Alias useful classes.
var Point = geo.Point;

/**
 * The Bot sits at the intersection of modules responsibile for
 * decision making, steering, and locomotion. It exposes parameters
 * for these various modules as its own properties, and also tracks
 * information about the state of its execution.
 * @constructor
 * @param {GameState} gamestate - The constructed GameState object,
 *   which provides the bot with information about the game.
 * @param {Logger} [logger] - Optional. An object with a function `log`
 *   that the bot will use for debug output.
 */
var Bot = function(gamestate, logger) {
  if (typeof logger == 'undefined') logger = { log: function() {} };
  this.logger = logger;

  // Holds actions executed on an interval.
  this.actions = new ActionManager();

  this.game = gamestate;

  this.state = {
    position: "offense",
    control: "automatic",
    enemies: false // ids of players to be avoided.
  };

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
  this.logger.log("bot:info", "Initializing Bot.");
  // Ensure that the tagpro global object has initialized and allocated us an id.
  if (!this.game.initialized()) { return setTimeout(this.init.bind(this), 250); }

  this.game.onMap(this.processMap.bind(this));

  this.brain = new Brain(this);
  this.mover = new Mover(this.game);
  this.steerer = new Steerer(this.game);
  this.sense_queue = [];
  this.lastSense = 0;

  this.initializeParameters();

  // Information.
  this.info = {
    updates: 50 // Updates/second default value
  };
  
  // Listen for own player events.
  var events = ["boost", "dead", "alive", "grab", "cap"];
  events.forEach(function (event) {
    this.game.addPlayerListener(event, function () {
      this.touch(event);
    }.bind(this));
  }, this);

  // Listen for powerup information.
  this.game.addPowerupListener(function (event) {
    this.touch(event);
  }.bind(this));
  this.initialized = true;
  this.logger.log("bot:info", "Bot loaded."); // DEBUG
};

/**
 * Initialize the parameters for the bot itself and exposes the
 * parameters for its modules.
 * @private
 */
Bot.prototype.initializeParameters = function() {
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
    think: 500,
    update: 20
  };

  this.parameters.moving = this.mover.parameters;
  this.parameters.steering = this.steerer.parameters;
};

/**
 * Process map and generate navigation mesh.
 * @private
 */
Bot.prototype.processMap = function(map) {
  this.navmesh = new NavMesh(map, this.logger);

  // Whether the navigation mesh has been updated.
  this.navUpdate = false;

  // Update navigation mesh visualization and set flag for
  // sense function to pass message to brain.
  this.navmesh.onUpdate(function(polys) {
    this.logger.log("bot:info", "Navmesh updated.");
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

  this.logger.log("bot:info", "Navmesh constructed.");

  this.mapInitialized = true;
};

/**
 * Update function that drives the rest of the ongoing bot behavior.
 * @private
 */
Bot.prototype.update = function() {
  // Sense any real-time, big-implication environment actions and
  // send to brain.
  this.sense();
  this.brain.process();
  this.move();
  // Track rate of update call.
  var now = performance.now();
  if (!this.lastUpdate) {
    this.lastUpdate = now;
  } else {
    var diff = this.lastUpdate - now;
    var persecond = 1e3 / diff;
    this.info.update = this.info.update * 0.9 + persecond * 0.1;
  }
};

/**
 * Sense environment changes and send messages to brain if needed.
 * @private
 */
Bot.prototype.sense = function() {
  var self = this.game.player();

  // Navmesh updated.
  if (this.navUpdate) {
    this.brain.handleMessage("navUpdate");
    this.navUpdate = false;
  }
  // Defense/Offense position changed.
  if (this.state.last_position && this.state.last_position !== this.state.position) {
    this.brain.handleMessage("positionChange");
  }
  this.state.last_position = this.state.position;
  // Manual position changed
  if (this.state.manual_target && this.state.last_manual_target !== this.state.manual_target) {
    this.brain.handleMessage("manual_target_changed");
  }
  this.state.last_manual_target = this.state.manual_target;
  while (this.sense_queue.length > 0) {
    var event = this.sense_queue.shift();
    this.brain.handleMessage(event);
  }
  this.lastSense = Date.now();
};

/**
 * Get steering and take actions.
 * @private
 */
Bot.prototype.move = function() {
  this.desired_vector = this.steerer.steer(this.state);
  this.mover.move(this.desired_vector);
};

/**
 * Set bot state. This function can be called one of two ways
 * @example <caption>Setting a single value</caption>
 *   bot.setState("target", new Point(0, 0))
 * @example <caption>Setting multiple values</caption>
 *   bot.setState({
 *     target: new Point(0, 0),
 *     approach: "arrive"
 *   })
 */
Bot.prototype.setState = function(name, value) {
  if (typeof name == "object") {
    var obj = name;
    for (var prop in obj) {
      this.state[prop] = obj[prop];
    }
  } else {
    this.state[name] = value;
  }
};

/**
 * Get bot state identified by `name`. If no value is found, then
 * undefined is returned.
 * @param {string} name - The bot state value to return.
 * @return {*} - The retrieved value.
 */
Bot.prototype.getState = function(name) {
  return this.state[name];
};

/**
 * Stops the bot.
 */
Bot.prototype.stop = function() {
  this.logger.log("bot", "Stopping bot.");
  this.stopped = true;
  this.actions.remove("think");
  this.actions.remove("update");

  // Stop thinking.
  this.brain.terminate();

  // Stop moving.
  var stopping = setTimeout(function stop() {
    // Don't continue trying to stop if restarted.
    if (!this.stopped) return;
    var cutoff = 0.01;
    var v = this.game.velocity();
    var zero = new Point(0, 0);
    if (v.dist(zero) > cutoff) {
      this.mover.move(new Point(0, 0));
      stopping = setTimeout(stop.bind(this), 20);
    } else {
      this.mover.press({});
    }
  }.bind(this), 20);
};

/**
 * Pause bot, but preserve state.
 */
Bot.prototype.pause = function() {
  this.logger.log("bot", "Pausing bot.");
  this.stopped = true;
  this.actions.remove("think");
  this.actions.remove("update");
  // Stop moving.
  var stopping = setTimeout(function stop() {
    // Don't continue trying to stop if restarted.
    if (!this.stopped) return;
    var cutoff = 0.01;
    var v = this.game.velocity();
    var zero = new Point(0, 0);
    if (v.dist(zero) > cutoff) {
      this.mover.move(new Point(0, 0));
      stopping = setTimeout(stop.bind(this), 20);
    } else {
      this.mover.press({});
    }
  }.bind(this), 20);
};
/**
 * Starts the bot.
 */
Bot.prototype.start = function() {
  // Don't execute if bot or map isn't initialized.
  if (!this.initialized || !this.mapInitialized) {
    this.logger.log("bot:info", "Bot not initialized. Cancelling start.");
    return;
  } else {
    this.logger.log("bot:info", "Starting bot.");
    this.stopped = false;
  }

  this.brain.think();
  //this.actions.add("think", this.brain.think.bind(this.brain), this.parameters.intervals.think);
  this.actions.add("update", this.update.bind(this), this.parameters.intervals.update);
};

/**
 * Add an event to the bot's sensations, to be processed in the next tick.
 * Does nothing if the bot is stopped.
 * @param {*} event - The sensation.
 */
Bot.prototype.touch = function(event) {
  // DEBUG: should not have manual.
  if (this.stopped) return;// || this.state.control == "manual") return;
  this.sense_queue.push(event);
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
