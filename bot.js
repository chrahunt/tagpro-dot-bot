/**
 * A Bot is responsible for decision making, navigation (with the aid
 * of map-related modules) and low-level steering/locomotion.
 * @module bot
 */
define(['map/parse-map', 'map/navmesh', 'map/polypartition', 'drawutils', 'bragi', 'goals'],
function(mapParser,       NavMesh,       pp,                  DrawUtils,   Logger,  Brain) {
  // Alias useful classes.
  var Point = pp.Point;
  var Poly = pp.Poly;
  var PolyUtils = pp.PolyUtils;

  var Stance = {
    offense: 0,
    defence: 1
  };

  /**
   * @constructor
   * @alias module:bot
   */
  var Bot = function(state, mover) {
    // Holds interval ids.
    this.actions = {};

    // Hold environment-specific movement and game state objects.
    this.move = mover.move.bind(mover);
    this.game = state;

    this.stance = Stance.offense;

    this.initialized = false;
    this.mapInitialized = false;
    this.init();

    this.brain = new Brain(this);

    setTimeout(this.processMap.bind(this), 50);
  };

  // Initialize functionality dependent on tagpro provisioning playerId.
  Bot.prototype.init = function() {
    Logger.log("bot", "Initializing Bot.");
    // Ensure that the tagpro global object has initialized and allocated us an id.
    if (!this.game.initialized()) {return setTimeout(this.init.bind(this), 250);}

    // Self is the TagPro player object.
    this.self = this.game.player();

    Logger.log("bot", "Bot loaded."); // DEBUG
    
    this._initializeParameters();

    // Set up drawing.
    this.draw = new DrawUtils();

    // Register items to draw.
    this.draw.addVector("seek", 0x00ff00);
    this.draw.addVector("avoid", 0xff0000);
    this.draw.addVector("desired", 0x0000ff);
    this.draw.addBackground("mesh", 0x00dd00);
    this.draw.addPoint("goal", 0x00ff00, "foreground");
    this.draw.addPoint("hit", 0xff0000, "foreground");

    this.initialized = true;
  }

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
    this.stance = Stance.defence;
  };

  Bot.prototype.isOffense = function() {
    return this.stance == Stance.offense;
  };

  Bot.prototype.isDefence = function() {
    return this.stance == Stance.defence;
  };

  /**
   * Sense environment changes and send messages to brain if needed.
   */
  Bot.prototype._sense = function() {
    if (this.self.dead) {
      this.brain.handleMessage("dead");
    }
    if (this.last_stance && this.last_stance !== this.stance) {
      this.brain.handleMessage("stanceChange");
    }
    this.last_stance = this.stance;
  };

  // Do movements.
  Bot.prototype._move = function() {
    if (this.goal) {
      this.navigate();
    }
  };

  /**
   * Sets the given point as the target for the bot to navigate to.
   * @param {Point} point - The point to navigate to.
   */
  Bot.prototype.setTarget = function(point) {
    this.goal = point;
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
        spike: 14,
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
    this.parameters.steering["seek"] = {
      max_see_ahead: this.parameters.intervals.navigate
    };

    this.parameters.steering["avoid"] = {
      max_see_ahead: 2e3, // Time in ms to look ahead for a collision.
      max_avoid_force: 35,
      buffer: 25,
      spike_intersection_radius: this.parameters.game.radius.spike + this.parameters.game.radius.ball
    };

    this.parameters.steering["update"] = {
      action_threshold: 0.01,
      top_speed_threshold: 0.1,
      current_vector: 0
    };
  }

  /**
   * Process map and generate navigation mesh.
   */
  Bot.prototype.processMap = function() {
    var map = this.game.map();
    if (!map) {
      setTimeout(this.processMap.bind(this), 250);
    } else {
      var parsedMap = mapParser.parse(map);
      
      this.navmesh = new NavMesh(parsedMap);
      this.mapInitialized = true;

      this.draw.updateBackground("mesh", this.navmesh.polys);
      Logger.log("bot", "Navmesh constructed.");
    }
  }

  // Stops the bot. Sets the stop action which all methods need to check for, and also
  // ensures the bot stays still (ish).
  Bot.prototype.stop = function() {
    Logger.log("bot", "Stopping bot.");
    this.stopped = true;
    this._clearInterval("think");
    this._clearInterval("update");

    // Stop thinking.
    this.brain.terminate();

    // Stop moving.
    this.allUp();
    this._removeDraw();
  }

  // Restarts the bot.
  Bot.prototype.start = function() {
    // Don't execute if bot or map isn't initialized.
    if (!this.initialized || !this.mapInitialized) {
      Logger.log("bot:info", "Bot not initialized. Cancelling start.");
      return;
    } else {
      Logger.log("bot:info", "Starting bot.");
    }

    this.stopped = false;
    this.brain.think();
    this._setInterval("think", this.brain.think.bind(this.brain), 500);
    this._setInterval("update", this.update, 20);
    this.draw.showVector("seek");
    this.draw.showVector("avoid");
  }

  /**
   * Navigates a path, assuming the end target is static.
   */
  Bot.prototype.navigate = function() {
    // Don't execute function if bot is stopped.
    if (this.stopped) return;

    var desired_vector = this._steering(32);
    this.draw.updateVector("desired", desired_vector.mul(10));
    // Apply desired vector after a short delay.
    setTimeout(function() {
      if (!this.stopped) {
        this._update(desired_vector.mul(2));
      }
    }.bind(this), 0);
  }

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
    }

    var idx = heuristic(costs);
    return vectors[idx];
  }

  // Takes in vectors, associates cost with each.
  // Returns vector of costs.
  Bot.prototype._inv_Avoid = function(vectors) {
    var costs = vectors.map(function() {
      return 0;
    });

    var BALL_DIAMETER = 38;
    // For determining intersection and cost of distance.
    var SPIKE_INTERSECTION_RADIUS = 55;
    // For determining how many ms to look ahead for the location to use
    // as the basis for seeing the impact a direction will have.
    var LOOK_AHEAD = 40;

    // For determining how much difference heading towards a single direction
    // will make.
    var DIR_LOOK_AHEAD = 40;

    // Ray with current position as basis.
    var position = this.game.location();
    // look ahead 20ms
    var ahead = this.game.pLocation(LOOK_AHEAD);
    var ahead_distance = ahead.sub(position).len();

    var relative_location = ahead.sub(position);

    var spikes = this.game.getspikes();

    vectors.forEach(function(vector, i) {
      vector = relative_location.add(vector.mul(DIR_LOOK_AHEAD));
      var veclen = vector.len();
      // Put vector relative to predicted position.
      vector = vector.normalize();
      for (var j = 0; j < spikes.length; j++) {
        var spike = spikes[j];
        // Skip spikes that are too far away to matter.
        if (spike.dist(position) - SPIKE_INTERSECTION_RADIUS > veclen) continue;
        collision = PolyUtils.lineCircleIntersection(position, vector, spike, SPIKE_INTERSECTION_RADIUS);
        if (collision.collides) {
          if (collision.inside) {
            costs[i] += 100;
          } else {
            // Calculate cost.
            costs[i] += SPIKE_INTERSECTION_RADIUS / position.dist(collision.point);
            /*var tmpDist2 = position.dist2(collision.point);
            if (tmpDist2 < minDist2) {
              minCollision = collision;
              minDist2 = tmpDist2;
            }*/
          }
        }
      }
    });
    return costs;
  }

  Bot.prototype._inv_Seek = function(vectors) {
    var costs = vectors.map(function() {
      return 0;
    });
    var params = this.parameters.steering["seek"];
    var p = this.game.location();
    if (this.goal) {
      var goal = this.goal.sub(p).normalize();
    } else {
      var goal = false;
    }
    vectors.forEach(function(vector, i) {
      if (goal) {
        var val = vector.dot(goal);
        if (val < 0) {
          costs[i] = 20;
        } else {
          costs[i] = 1 / val;
        }
      }
    });
    return costs;
  }

  /**
   * Clear the interval identified by `name`.
   * @private
   * @param {string} name - The interval to clear.
   */
  Bot.prototype._clearInterval = function(name) {
    if (this._isInterval(name)) {
      clearInterval(this.actions[name]);
      delete this.actions[name];
    }
  }

  /**
   * Set the given function as an function executed on an interval
   * given by `time`. Function is bound to `this`, and can be removed
   * using `_clearInterval`. If an interval function with the given name
   * is already set, the function does nothing.
   * @private
   * @param {string} name
   * @param {Function} fn
   * @param {integer} time - The time in ms.
   */
  Bot.prototype._setInterval = function(name, fn, time) {
    if (!this._isInterval(name)) {
      this.actions[name] = setInterval(fn.bind(this), time);
    }
  }

  /**
   * Check whether the interval with the given name is active.
   * @private
   * @param {string} name
   * @return {boolean} - Whether the interval is active.
   */
  Bot.prototype._isInterval = function(name) {
    return this.actions.hasOwnProperty(name);
  }

  Bot.prototype._removeDraw = function() {
    this.draw.hideVector("seek");
    this.draw.hideVector("avoid");
  }

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
  }

  /**
   * Takes the desired velocity as a parameter and presses the keys
   * necessary to make it happen.
   * @param {Point} vec - The desired velocity.
   */
  Bot.prototype._update = function(vec) {
    if (vec.x == 0 && vec.y == 0) return;
    var params = this.parameters.steering["update"];
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
    this.move(dirs);
  }

  /**
   * Stop all movement.
   */
  Bot.prototype.allUp = function() {
    this.move({});
  }

  Bot.prototype.chat_all = function(chatMessage) {
    if (!this.hasOwnProperty('lastMessage')) this.lastMessage = 0;
    var limit = 500 + 10;
    var now = new Date();
    var timeDiff = now - this.lastMessage;
    if (timeDiff > limit) {
      tagpro.socket.emit("chat", {
        message: chatMessage,
        toAll: 1
      });
      this.lastMessage = new Date();
    } else if (timeDiff >= 0) {
      setTimeout(chat_all, limit - timeDiff, chatMessage);
    }
  }

  return Bot;
});
