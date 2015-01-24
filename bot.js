/**
 * A Bot is responsible for decision making, navigation (with the aid
 * of map-related modules) and low-level steering/locomotion.
 * @module bot
 */
define(['map/parse-map', 'map/navmesh', 'map/polypartition', 'drawutils', 'bragi'],
function(mapParser,       NavMesh,       pp,                  DrawUtils,   Logger) {
  // Alias useful classes.
  var Point = pp.Point;
  var Poly = pp.Poly;
  var Edge = pp.Edge;
  var PolyUtils = pp.PolyUtils;

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

    this.initialized = false;
    this.mapInitialized = false;
    this.init();

    setTimeout(this.processMap.bind(this), 50);
  };

  // Initialize functionality dependent on tagpro provisioning playerId.
  Bot.prototype.init = function() {
    Logger.log("bot", "Initializing Bot.");
    // Ensure that the tagpro global object has initialized and allocated us an id.
    if (!this.game.initialized()) {return setTimeout(this.init.bind(this), 250);}

    // Self is the TagPro player object.
    this.self = this.game.player();
    
    // Get game type, either ctf or yf.
    this.game_type = this.game.gameType();

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

    this.parameters.steering["field"] = {
      repulsive_force: 1,
      dissipation: 4,
      attractive_force: 10,
      force_scale: 100
    }
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
    this._clearInterval("game");
    this._clearInterval("navigate");
    this._clearInterval("path");
    this._clearInterval("goal");
    this.allUp();
    this._removeDraw();
  }

  // Restarts the bot.
  Bot.prototype.start = function() {
    Logger.log("bot", "Starting bot.");
    this.stopped = false;
    this._setInterval("game", this._gameUpdate, 1000);
    this.draw.showVector("seek");
    this.draw.showVector("avoid");
  }

  /**
   * Navigates a path, assuming the end target is static.
   */
  Bot.prototype.navigate = function() {
    // Don't execute function if bot is stopped.
    if (this.stopped) return;

    var desired_vector = this._potentialFieldSteering();
    this.draw.updateVector("desired", desired_vector.mul(10));
    // Apply desired vector after a short delay.
    setTimeout(function() {
      if (!this.stopped) {
        this._update(desired_vector);
      }
    }.bind(this), 0);
  }

  // Navigate using weighted steering behaviors.
  Bot.prototype._weightedSteering = function() {
    var weights = {
      avoid: 2,
      seek: 1
    };

    var me = this.game.location();
    
    var steering_behaviors = [
      "avoid",
      "seek"
    ];

    var vectors = {};

    // Get desired vectors.
    if (this.goal) {
      vectors.seek = this._seek(this.goal);
    } else {
      vectors.seek = new Point(0, 0);
    }
    
    vectors.avoid = this._avoid();
    /*if (this.path.length > 1) {
      nav_vec = this._navpath(goal, this.path[1]);
    } else {
      nav_vec = new Point(0, 0);
    }*/
    
    // Calculate desired vector.
    return this.combinedSteering(steering_behaviors, vectors, weights);
  }

  // Navigate using potential fields.
  Bot.prototype._potentialFieldSteering = function() {
    // Using potential fields around obstacles.
    var predictedLocation = this.game.pLocation(20);
    var params = this.parameters.steering.field;

    // Initialize desired vector.
    var desired_vector = new Point(0, 0);
    if (this.goal) {
      var goal = this.goal.sub(predictedLocation);
      var goalDist2 = goal.dist2(new Point(0, 0));
      var attractive_vector = goal.mul(params.attractive_force / goalDist2);

      var repulsive_vector = new Point(0, 0);
      var spikes = this.game.getspikes();
      spikes.forEach(function(spike) {
        var v = spike.sub(predictedLocation);
        var len = v.len();
        // Highest power at point of intersection around obstacle.
        var dissipation = Math.pow(len - 55, params.dissipation);
        repulsive_vector = repulsive_vector.add(v.mul(params.repulsive_force / dissipation));
      });
      // Make a repulsive force.
      repulsive_vector = repulsive_vector.mul(-1);
      // Add together.
      desired_vector = attractive_vector.add(repulsive_vector).mul(params.force_scale);
    }
    return desired_vector;
  }

  /**
   * Combines the vectors into a single vector by summing after
   * multiplying each by their associated weight.
   * @param {Array.<string>} names - An array specifying the names
   *   of the vectors.
   * @param {object.<string, point>} vectors - The calculated vectors.
   */
  Bot.prototype.combinedSteering = function(names, vectors, weights) {
    var desired_vector = new Point(0, 0);
    names.forEach(function(name) {
      var weighted_vector = vectors[name].mul(weights[name]);
      desired_vector = desired_vector.add(weighted_vector);
      this.draw.updateVector(name, weighted_vector.mul(10));
    }, this);
    return this._scaleVector(desired_vector, this.self.ms);
  }

  /**
   * Combines the vectors according to their order in names.
   * Only the first vector with any value returns a value.
   */
  Bot.prototype.prioritySteering = function(names, vectors) {
    var zero = new Point(0, 0);
    var desired_vector = false;
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      var vector = vectors[name];
      if (!vector.zero() && !desired_vector) {
        desired_vector = vector;
        this.draw.updateVector(name, vector.mul(10));
      } else {
        this.draw.updateVector(name, zero);
      }
    }
    if (!desired_vector) {
      desired_vector = zero;
    }
    return desired_vector;
  }

  /**
   * This function updates the state of the bot in response to changes
   * in the game. This includes changing tactics, calculating a new path
   * and removing recurring functions.
   */
  Bot.prototype._gameUpdate = function() {
    // Don't execute updates if bot is stopped.
    if (this.stopped) return;

    // Don't execute if bot or map isn't initialized.
    if (!this.initialized || !this.mapInitialized) return;

    // Dead bots don't navigate.
    if (this.self.dead) {
      this._clearInterval('navigate');
      this._clearInterval('path');
      this._clearInterval('goal');
      // Nor do they press buttons.
      this.allUp();
      return;
    }

    // Normal capture-the-flag game.
    if (this.game_type == this.game.GameTypes.ctf) {
      var start = this.game.location();

      // Get possible destinations.
      var enemyFlagPoint = this.game.findEnemyFlag();
      var ownFlagPoint = this.game.findOwnFlag();

      var destination;
      // Check if I have flag.
      var iHaveFlag = this.self.flag;
      // Set destination and end condition.
      if (iHaveFlag) {
        destination = ownFlagPoint.location;
      } else {
        destination = enemyFlagPoint.location;
      }

      this.navmesh.calculatePath(start, destination, function(path) {
        this._updatePath(path);
        this._setInterval('navigate', this.navigate, 10);
        //this._setInterval('path', this._pathUpdate, 500);
        this._setInterval('goal', this._goalUpdate, 20);
      }.bind(this));
    } else {
      // Yellow center flag game.
      this.chat_all("I don't know how to play this type of game!");
    }
  }

  /**
   * This function updates `this.goal` to the next specific point that
   * should be approached by the bot on its navigation path.
   * @private
   */
  Bot.prototype._goalUpdate = function() {
    var goal = false;
    var me = this.game.location();
    if (!this.path)
      return;

    var path = this.path.slice();
    // Find next location to seek out in path.
    if (path.length > 0) {
      goal = path[0];
      var cut = false;
      var last_index = 0;

      // Get point furthest along path that is visible from current
      // location.
      for (var i = 0; i < path.length; i++) {
        if (this.navmesh.checkVisible(me, path[i])) {
          goal = path[i];
          if (i !== 0) {
            last_index = i;
            cut = true;
          }
        } else {
          break;
        }
      }

      if (cut) {
        path.splice(0, last_index - 1);
      }

      if (path.length == 1) {
        goal = path[0];
        if (me.dist(goal) < 20) {
          goal = false;
        }
      }
    }

    // Update bot state.
    this.goal = goal;
    this.draw.updatePoint("goal", goal);
    this.path = path;
  }

  /**
   * This function updates `this.path` to reflect a (potentially) new
   * set of points needed to reach the end goal of the current path.
   * @private
   */
  Bot.prototype._pathUpdate = function() {
    if (!this.path)
      return;

    var start = this.game.location();
    var end = this.path[this.path.length - 1];
    this.navmesh.calculatePath(start, end, this._updatePath.bind(this));
  }

  /**
   * This function is used as the callback to navmesh.calculatePath,
   * to update the bot's view of the path if found.
   * @private
   */
  Bot.prototype._updatePath = function(path) {
    if (path) {
      this.path = this._postProcessPath(path);
    }
  }

  /**
   * Post-process a path to move it away from obstacles.
   * @param {Array.<Point>} path - The path to process.
   * @return {Array.<Point>} - The processed path.
   */
  Bot.prototype._postProcessPath = function(path) {
    var spikes = this.game.getspikes();
    // The additional buffer to give the obstacles.
    var buffer = this.spike_buffer || 20;
    // The threshold for determining points which are 'close' to
    // obstacles.
    var threshold = this.spike_threshold || 60;
    var spikesByPoint = new Map();
    path.forEach(function(point) {
      var closeSpikes = [];
      spikes.forEach(function(spike) {
        if (spike.dist(point) < threshold) {
          closeSpikes.push(spike);
        }
      });
      if (closeSpikes.length > 0) {
        spikesByPoint.set(point, closeSpikes);
      }
    });
    for (var i = 0; i < path.length; i++) {
      var point = path[i];
      if (spikesByPoint.has(point)) {
        var obstacles = spikesByPoint.get(point);
        if (obstacles.length == 1) {
          // Move away from the single point.
          var obstacle = obstacles[0];
          var v = point.sub(obstacle);
          var len = v.len();
          var newPoint = obstacle.add(v.mul(1 + buffer / len));
          path[i] = newPoint;
        } else if (obstacles.length == 2) {
          // Move away from both obstacles.
          var center = obstacles[1].add(obstacles[0].sub(obstacles[1]).mul(0.5));
          var v = point.sub(center);
          var len = v.len();
          var newPoint = center.add(v.mul(1 + (buffer + threshold) / len));
          path[i] = newPoint;
        }
      }
    }
    return path;
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
   * Given a target, returns a vector representing the desired velocity
   * for approaching that target. Assumes a clear path to target exists.
   * @param {Point}  target - The target location to approach.
   * @returns {Point} - The desired velocity, after accounting for the
   *   current velocity.
   */
  Bot.prototype._seek = function(target) {
    var params = this.parameters.steering["seek"];
    var MAX_SEE_AHEAD = params.max_see_ahead;
    var MAX_VELOCITY = this.self.ms;

    // Get the predicted position.
    var prediction = this.game.pLocation(MAX_SEE_AHEAD);

    var steering = new Point(0, 0);
    var desired_velocity = target.sub(prediction).normalize();
    return this._scaleVector(desired_velocity, MAX_VELOCITY);
  }

  // Move such that it is more likely the next point along the path will appear.
  // Takes in the current goal and the next point.
  Bot.prototype._navpath = function(goal, next) {
    var WEIGHT = 10;
    var desired = new Point(0, 0);
    var current = this.game.location();
    var offsets = [
      new Point(5, 0), // right
      new Point(0, 5), // down
      new Point(-5, 0), // left
      new Point(0, -5) // up
    ];
    var goal_offsets = offsets.map(goal.add);
    for (var i = 0; i < goal_offsets.length; i++) {
      var offset = goal_offsets[i];
      // Next point is visible from this new point.
      if (this.navmesh.checkVisible(offset, next)) {
        desired = desired.add(offsets[i].mul(WEIGHT));
      }
    }
    return desired;
  }

  // Returns a desired direction vector for avoiding spikes.
  Bot.prototype._avoid = function() {
    /**
     * Holds the properties of a collision, if one occurred.
     * @typedef Collision
     * @type {object}
     * @property {boolean} collides - Whether there is a collision.
     * @property {boolean} inside - Whether one object is inside the other.
     * @property {?Point} point - The point of collision, if collision
     *   occurs, and if `inside` is false.
     * @property {?Point} normal - A unit vector normal to the point
     *   of collision, if it occurs and if `inside` is false.
     */
    /**
     * If the ray intersects the circle, the distance to the intersection
     * along the ray is returned, otherwise false is returned.
     * @param {Point} p - The start of the ray.
     * @param {Point} ray - Unit vector extending from `p`.
     * @param {Point} c - The center of the circle for the object being
     *   checked for intersection.
     * @param {number} [radius=55] - The radius of the circle.
     * @return {Collision} - The collision information.
     */
    var lineIntersectsCircle = function(p, ray, c, radius) {
      // spike radius + ball radius + 1
      if (typeof radius == 'undefined') radius = 55;
      var collision = {
        collides: false,
        inside: false,
        point: null,
        normal: null
      }
      var vpc = c.sub(p);

      if (vpc.len() <= radius) {
        // Point is inside obstacle.
        collision.collides = true;
        collision.inside = (vpc.len() !== radius);
      } else if (ray.dot(vpc) >= 0) {
        // Circle is ahead of point.
        // Projection of center point onto ray.
        var pc = p.add(ray.mul(ray.dot(vpc)));
        // Length from c to its projection on the ray.
        var len_c_pc = c.sub(pc).len();

        if (len_c_pc <= radius) {
          collision.collides = true;

          // Distance from projected point to intersection.
          var len_intersection = Math.sqrt(len_c_pc * len_c_pc + radius * radius);
          collision.point = pc.sub(ray.mul(len_intersection));
          collision.normal = collision.point.sub(c).normalize();
        }
      }
      return collision;
    }.bind(this);

    var params = this.parameters.steering["avoid"];
    // Number of ms to look ahead.
    var MAX_SEE_AHEAD = params.max_see_ahead;
    var MAX_VELOCITY = this.self.ms;
    var BUFFER = params.buffer;
    var BALL_DIAMETER = 38;
    var SPIKE_INTERSECTION_RADIUS = params.spike_intersection_radius;

    // Ray with current position as basis.
    var position = this.game.location();
    var ahead = this.game.pLocation(MAX_SEE_AHEAD);
    var ahead_distance = ahead.sub(position).len();

    var ray = ahead.sub(position).normalize();

    var inside = false;
    var minDist2 = Infinity;
    var spikes = this.game.getspikes();
    var spike, collision, minCollision, dist;
    for (var i = 0; i < spikes.length; i++) {
      spike = spikes[i];
      if (spike.dist(position) - SPIKE_INTERSECTION_RADIUS > ahead_distance) continue;
      collision = lineIntersectsCircle(position, ray, spike, SPIKE_INTERSECTION_RADIUS);
      if (collision.collides) {
        if (collision.inside) {
          inside = true;
          break;
        } else {
          var tmpDist2 = position.dist2(collision.point);
          if (tmpDist2 < minDist2) {
            minCollision = collision;
            minDist2 = tmpDist2;
          }
        }
      }
    }

    var avoidance = new Point(0, 0);
    var minDist = Math.sqrt(minDist2);
    if (!inside && minDist < ahead_distance) {
      avoidance = minCollision.point
        .add(minCollision.normal.mul((this.parameters.game.radius.ball) + BUFFER))
        .sub(position)
        .normalize();
      //MAX_VELOCITY = 1 - minDist / ahead_distance;
      this.draw.updatePoint("hit", minCollision.point);
    } else {
      this.draw.hidePoint("hit");
    }
    if (minCollision) { // DEBUG
      var currentVelocity = this.velocity().mul(100);
      var diff = minCollision.point.sub(position);
      var timeToImpact = Math.min(diff.x / currentVelocity.x, diff.y / currentVelocity.y);
      Logger.log("bot:debug", "Time to impact:", timeToImpact);
    }
    return this._scaleVector(avoidance, MAX_VELOCITY);
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
