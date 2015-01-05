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
  var Bot = function() {
    // Holds interval ids.
    this.actions = {};

    this.initialized = false;
    this.mapInitialized = false;
    this.init();

    setTimeout(this.processMap.bind(this), 50);
  };

  /**
   * Sets the bot's move functionality.
   * @param {object} mover - An object with a `move` method that the bot
   *   will adopt as its own.
   */
  Bot.prototype.setMove = function(mover) {
    this.move = mover.move.bind(mover);
  }

  // Initialize functionality dependent on tagpro provisioning playerId.
  Bot.prototype.init = function() {
    Logger.log("bot", "Initializing Bot.");
    // Ensure that the tagpro global object has initialized and allocated us an id.
    if (typeof tagpro !== 'object' || !tagpro.playerId) {return setTimeout(this.init.bind(this), 250);}

    // Self is the TagPro player object.
    this.self = tagpro.players[tagpro.playerId];
    this.playerId = tagpro.playerId;

    // getAcc function set as an interval loop.
    this.actions['accInterval'] = setInterval(this.getAcc.bind(this), 10);
    
    // Get game type, either ctf or yf.
    this.game_type = this._getGameType();

    Logger.log("bot", "Bot loaded."); // DEBUG
    
    // Set up drawing.
    this.draw = new DrawUtils();

    // Register items to draw.
    this.draw.addVector("seek", 0x00ff00);
    this.draw.addVector("avoid", 0xff0000);
    this.draw.addBackground("mesh", 0x00dd00);
    this.draw.addPoint("goal", 0x00ff00, "foreground");
    this.draw.addPoint("hit", 0xff0000, "foreground");

    // Configurable parameters for various aspects of operation.
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
      buffer: 5,
      spike_intersection_radius: this.parameters.game.radius.spike + this.parameters.game.radius.ball
    };
    this.parameters.steering["update"] = {
      action_threshold: 0.01,
      top_speed_threshold: 0.1,
      current_vector: 0
    };

    this.initialized = true;
  }

  // Process map-related things.
  Bot.prototype.processMap = function() {
    // Ensure that the tagpro global object has initialized and allocated us an id.
    if (typeof tagpro !== 'object' || !tagpro.map) {return setTimeout(this.processMap.bind(this), 250);}
    this.mapTiles = tagpro.map;
    var polys = mapParser.parse(this.mapTiles);
    polys = mapParser.convertShapesToPolys(polys);
    this.navmesh = new NavMesh(polys);
    this.mapInitialized = true;

    this.draw.updateBackground("mesh", this.navmesh.polys);
    Logger.log("bot", "Navmesh constructed.");
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

    var me = this._getLocation();
    
    // Get desired vectors.
    var seek_vec, avoid_vec;//, nav_vec;

    if (this.goal) {
      seek_vec = this._seek(this.goal);
    } else {
      seek_vec = new Point(0, 0);
    }
    
    avoid_vec = this._avoid();
    /*if (this.path.length > 1) {
      nav_vec = this._navpath(goal, this.path[1]);
    } else {
      nav_vec = new Point(0, 0);
    }*/
    
    // Calculate desired vector.
    var desired_vector = new Point(0, 0);
    desired_vector = desired_vector.add(seek_vec);
    desired_vector = desired_vector.add(avoid_vec);
    //desired_vector = desired_vector.add(nav_vec);

    // Update vector visuals, scaling from physics units to screen size.
    this.draw.updateVector("seek", seek_vec.mul(10));
    this.draw.updateVector("avoid", avoid_vec.mul(10));
    //this.draw.updateVector("nav", nev_vec);

    // Apply desired vector after a short delay.
    setTimeout(function() {
      if (!this.stopped)
        this._update(desired_vector);
    }.bind(this), 0);
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
    if (this.game_type == "ctf") {
      var start = this._getLocation();

      // Get possible destinations.
      var enemyFlagPoint = this.findEnemyFlag();
      var ownFlagPoint = this.findOwnFlag();

      var destination, finish_fn;
      // Check if I have flag.
      var iHaveFlag = this.self.flag;
      // Set destination and end condition.
      if (iHaveFlag) {
        destination = ownFlagPoint.point;
      } else {
        destination = enemyFlagPoint.point;
      }

      this.navmesh.calculatePath(start, destination, function(path) {
        this._updatePath(path);
        this._setInterval('navigate', this.navigate, 10);
        //this._setInterval('path', this._pathUpdate, 500);
        this._setInterval('goal', this._goalUpdate, 20);
      }.bind(this));
    } else { // Yellow center flag game.
      this.chat_all("I don't know how to play this type of game!");
      var iHaveFlag = this.self.flag;
      if (!iHaveFlag) {
        var yellow_flag = this.findYellowFlag();
        if (yellow_flag.present) {
          var destination = yellow_flag.point;
          finish_fn = function(bot) {
            return !bot.self.flag;
          }
        }
      } else {

      }
    }
  }

  /**
   * This function updates `this.goal` to the next specific point that
   * should be approached by the bot on its navigation path.
   * @private
   */
  Bot.prototype._goalUpdate = function() {
    var goal = false;
    var me = this._getLocation();
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

    var start = this._getLocation();
    var end = this.path[this.path.length - 1];
    this.navmesh.calculatePath(start, end, this._updatePath.bind(this));
  }

  /**
   * This function is used as the callback to navmesh.calculatePath,
   * to update the bot's view of the path if found.
   * @private
   */
  Bot.prototype._updatePath = function(path) {
    if (typeof path !== "undefined") {
      // Map path to location of ball center.
      this.path = path.map(function(p) {return p.add(20);});
    }
  }

  /*
   * Update acceleration of players for better tracking.
   */
  Bot.prototype.getAcc = function() {
    // 'for in' loop to loop through players.
    for (var id in tagpro.players) {
      if (tagpro.players.hasOwnProperty(id)) {
        
        // Defining player to make things easy to read.
        var player = tagpro.players[id];
        
        // Don't get keypresses for yourself, it's not needed.
        if (player !== this.self) {
          
          // Define new variables in the players object.
          if (player.accX === undefined) {player.accX = 0;}
          if (player.accY === undefined) {player.accY = 0;}
          
          // Get half the distance you are away from other players.
          var difX = Math.abs((self.x+self.lx*60)-(player.x+player.lx*60))/2,
            difY = Math.abs((self.y+self.ly*60)-(player.y+player.ly*60))/2;
          
          // Add half the y distance to right and left keypresses.
          if (player.right || player.left) {
            if (player.right) {player.accX = difY;}
            if (player.left) {player.accX = -difY;}
          } else {player.accX = 0;}
          
          // Add half the x distance to down and up keypresses.
          if (player.down || player.up) {
            if (player.down) {player.accY = difX;}
            if (player.up) {player.accY = -difX;}
          } else {player.accY = 0;}
        }
      }
    }
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
   * Get predicted location based on current position and velocity.
   * @param {number} [steps=60] - How many steps into the future the
   *   prediction will be.
   * @returns {Point} - The predicted x, y coordinates.
   */
  Bot.prototype._getPredictedLocation = function(steps) {
    if (typeof steps == 'undefined') steps = 60;
    var time = (1 / 60) * steps;
    var cv = this._getPredictedVelocity(0);
    // Bound the predicted velocity 
    var pv = this._getPredictedVelocity(1);
    var current_location = this._getLocation();
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
    dl = dl.mul(40); // WHAT?

    return current_location.add(dl);
  }

  // Get current location as a point.
  Bot.prototype._getLocation = function() {
    return new Point(this.self.x + 20, this.self.y + 20);
  }

  /**
   * Get predicted velocity a number of steps into the future based on
   * current velocity, acceleration, max velocity, and the keys being
   * pressed.
   * @param {number} [steps=0] - How many steps in the future to predict
   *   the velocity for. A value of 0 returns the current velocity bounded
   *   by the maximum velocity.
   * @returns {Point} - The predicted velocity.
   */
  Bot.prototype._getPredictedVelocity = function(steps) {
    if (typeof steps == 'undefined') steps = 0;
    var plx, ply;
    var change_x = 0, change_y = 0;
    if (this.self.pressing.up) {
      change_y = -1;
    } else if (this.self.pressing.down) {
      change_y = 1;
    }
    if (this.self.pressing.left) {
      change_x = -1;
    } else if (this.self.pressing.right) {
      change_x = 1;
    }
    plx = this.self.lx + this.self.ac * steps * change_x;
    plx = Math.sign(plx) * Math.min(Math.abs(plx), this.self.ms);
    ply = this.self.ly + this.self.ac * steps * change_y;
    ply = Math.sign(ply) * Math.min(Math.abs(ply), this.self.ms);

    return new Point(plx, ply);
  }

  /**
   * Scale a vector so that one of the components is maximized.
   * @param {Point} vec - The vector to scale.
   * @param {number} max - The maximum (absolute) value of either component.
   * @return {Point} - The converted vector.
   */
  Bot.prototype._scaleVector = function(vec, max) {
    var ratio = 0;
    if (vec.x >= vec.y && vec.x !== 0) {
      ratio = Math.abs(max / vec.x);
    } else if (vec.y !== 0) {
      ratio = Math.abs(max / vec.y);
    }
    var scaled = vec.mul(ratio);
    return scaled;
  }

  /**
   * Given a time in ms, return the number of steps needed to represent
   * that time.
   * @param {integer} ms - The number of ms.
   * @return {integer} - The number of steps.
   */
  Bot.prototype._msToSteps = function(ms) {
    return ms / this.parameters.game.step;
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
    var prediction = this._getPredictedLocation(this._msToSteps(MAX_SEE_AHEAD));

    var steering = new Point(0, 0);
    var desired_velocity = target.sub(prediction).normalize();
    return this._scaleVector(desired_velocity, MAX_VELOCITY);
  }

  // Move such that it is more likely the next point along the path will appear.
  // Takes in the current goal and the next point.
  Bot.prototype._navpath = function(goal, next) {
    var WEIGHT = 10;
    var desired = new Point(0, 0);
    var current = this._getLocation();
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
      } else {
        // Circle is ahead of or in-line with point.
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
    var position = this._getLocation();
    var ahead = this._getPredictedLocation(this._msToSteps(MAX_SEE_AHEAD));
    var ahead_distance = ahead.sub(position).len();

    var ray = ahead.sub(position).normalize();

    var inside = false;
    var minDist2 = Infinity;
    var spikes = this.getspikes();
    var spike, collision, minCollision, dist;
    for (var i = 0; i < spikes.length; i++) {
      spike = spikes[i];
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

    if (!inside && Math.sqrt(minDist2) < ahead_distance) {
      avoidance = minCollision.point
        .add(minCollision.normal.mul((this.parameters.game.radius.ball) + BUFFER))
        .sub(position)
        .normalize();
      this.draw.updatePoint("hit", minCollision.point);
    } else {
      this.draw.hidePoint("hit");
    }
    return this._scaleVector(avoidance, MAX_VELOCITY);
  }

  /**
   * Returns an array of Points that specifies the coordinates of any
   * spikes on the map.
   * @return {Array.<Point>} - An array of Point objects representing the
   *   coordinates of the spikes.
   */
  Bot.prototype.getspikes = function() {
    if (this.hasOwnProperty('spikes')) {
      return this.spikes;
    } else {
      var spikes = new Array();
      for (column in tagpro.map) {
        for (tile in tagpro.map[column]) {
          if (tagpro.map[column][tile] == 7) {
            spikes.push(new Point(40 * column + 20, 40 * tile + 20));
          }
        }
      }
      this.spikes = spikes;
      window.spikes = spikes;
      return spikes;
    }
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
    var current = this._getPredictedVelocity(CURRENT_VECTOR);
    var topSpeed = this.self.ms;
    var isTopSpeed = {};
    // actual speed can vary +- 0.02 of top speed/
    isTopSpeed.x = Math.abs(topSpeed - Math.abs(current.x)) < TOP_SPEED_THRESHOLD;
    isTopSpeed.y = Math.abs(topSpeed - Math.abs(current.y)) < TOP_SPEED_THRESHOLD;
    var dirs = {};
    if (Math.abs(current.x - vec.x) < ACTION_THRESHOLD) {
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

    if (Math.abs(current.y - vec.y) < ACTION_THRESHOLD && !isTopSpeed.y) {
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

  // Get enemy flag coordinates. An object is returned with properties 'point' and 'present'.
  // if flag is present at point then it will be set to true. If no flag is found, then
  // null is returned.
  Bot.prototype.findEnemyFlag = function() {
    // Get flag value.
    var flagval = (this.self.team + 2 == 4) ? 3 : 4;
    for (column in tagpro.map) {
      for (tile in tagpro.map[column]) {
        if (tagpro.map[column][tile] == flagval || tagpro.map[column][tile] == flagval+0.1) {
          var point = new Point(40 * column, 40 * tile);
          var present = (tagpro.map[column][tile] == flagval);
          return {point: point, present: present};
        }
      }
    }
    return null;
  }

  // Get own flag coordinates. See #findEnemyFlag for details.
  Bot.prototype.findOwnFlag = function() {
    var flagval = this.self.team + 2;
    for (column in tagpro.map) {
      for (tile in tagpro.map[column]) {
        if (tagpro.map[column][tile] == flagval || tagpro.map[column][tile] == flagval+0.1) {
          var point = new Point(40 * column, 40 * tile);
          var present = (tagpro.map[column][tile] == flagval);
          return {point: point, present: present};
        }
      }
    }
    return null;
  }

  // Get yellow flag coordinates. See #findEnemyFlag for details.
  Bot.prototype.findYellowFlag = function() {
    var flagval = 16;
    for (column in tagpro.map) {
      for (tile in tagpro.map[column]) {
        if (tagpro.map[column][tile] == flagval || tagpro.map[column][tile] == flagval+0.1) {
          var point = new Point(40 * column, 40 * tile);
          var present = (tagpro.map[column][tile] == flagval);
          return {point: point, present: present};
        }
      }
    }
    return null;
  }

  // Identify the game time, whether capture the flag or yellow flag.
  // Returns either "ctf" or "yf".
  Bot.prototype._getGameType = function() {
    if (this.findOwnFlag() && this.findEnemyFlag()) {
      return "ctf";
    } else {
      return "yf";
    }
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
