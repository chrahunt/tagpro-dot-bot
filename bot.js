// Based on the botscript by CFlakes.
requirejs.config({
  shim: {
    'map/clipper': {
      exports: 'ClipperLib'
    }
  },
  waitSeconds: 15
});

require(['map/parse-map', 'map/navmesh', 'map/polypartition', 'drawutils'],
function( mapParser,       NavMesh,       pp,                  DrawUtils) {
  // Alias useful classes.
  var Point = pp.Point;
  var Poly = pp.Poly;
  var Edge = pp.Edge;

  // A Bot is responsible for decision making, navigation (with the aid of map-related modules)
  // and low-level steering/locomotion.
  var Bot = function() {
    // simPressed will be used to detect if the bot is pressing any keys: right, left, down and up. We define the object (simPressed) here and set the variables to false.
    // keyWait will be used to check when the last keydown event was sent. This is usefull so the server won't kick you. The wait is separated for x and y keys.
    this.simPressed = {r: false, l: false, d: false, u: false};
    this.keyWait = {x: false, y: false};

    // This is to detect key presses. Both real key presses and the bots. This is needed so we don't mess up the simPressed object.
    document.onkeydown = this._keyUpdateFunc(true);

    // This is to detect key releases. Both real key releases and the bots. This is needed so we don't mess up the simPressed object.
    document.onkeyup = this._keyUpdateFunc(false);

    // Holds interval ids.
    this.actions = {};

    this.initialized = false;
    this.mapInitialized = false;
    this.init();
    setTimeout(this.processMap.bind(this), 50);
    //setTimeout(this.consider.bind(this), 150);
  };

  // Initialize functionality dependent on tagpro provisioning playerId.
  Bot.prototype.init = function() {
    console.log("Trying init.");
    // Ensure that the tagpro global object has initialized and allocated us an id.
    if (typeof tagpro !== 'object' || !tagpro.playerId) {return setTimeout(this.init.bind(this), 250);}

    // self is your player object.
    this.self = tagpro.players[tagpro.playerId];
    window.self = this.self;
    this.playerId = tagpro.playerId;

    // getAcc function set as an interval loop.
    this.actions['accInterval'] = setInterval(this.getAcc.bind(this), 10);
    
    console.log("Bot loaded!");
    
    // Set up drawing.
    this.draw = new DrawUtils();

    // Register items to draw.
    this.draw.register("BotMeshShapes");
    this.draw.register("BotGoal");
    this.draw.register("BotEdge2");
    this.draw.register("BotVectors");
    this.draw.register("BotEdge");

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

    // For drawing mesh.
    var mesh_items = this.navmesh.polys.map(function(poly) {
      return {item: poly, color: 'black'}
    });
    window.BotMeshShapes = mesh_items;
    console.log("Navmesh constructed.");
  }

  // Stops the bot. Sets the stop action which all methods need to check for, and also
  // ensures the bot stays still (ish).
  Bot.prototype.stop = function() {
    this.stopped = true;
    this.allUp();
    this._removeDraw();
  }

  // Restarts the bot.
  Bot.prototype.start = function() {
    this.stopped = false;
    this.consider();
  }

  // Consider the game and take necessary actions.
  Bot.prototype.consider = function() {
    // Don't execute function if bot is stopped.
    if (this.stopped) return;

    // Ensure everything is initialized.
    if (!this.initialized || !this.mapInitialized || this.self.dead) { return setTimeout(function() { this.consider() }.bind(this), 50); }

    // First, just get enemy flag location, set it as destination, find path to it, go get it, return to base
    var enemyFlagPoint = this.findEnemyFlag();
    var ownFlagPoint = this.findOwnFlag();

    var destination, finish_fn;
    // Check if I have flag.
    var iHaveFlag = this.self.flag;
    // Set destination and end condition.
    if (iHaveFlag) {
      destination = ownFlagPoint;
      finish_fn = function(bot) {
        return !bot.self.flag;
      }
    } else {
      destination = enemyFlagPoint;
      finish_fn = function(bot) {
        return bot.self.flag;
      }
    }

    // Get path.
    var path = this.navmesh.calculatePath(this._getLocation(), destination);

    // Retry if path not found.
    if (typeof path == 'undefined') {
      setTimeout(function() { this.consider(); }.bind(this), 1500);
      return;
    }

    // Navigate the path.
    this.navigate(path, finish_fn);
  }

  // Takes a path and navigates it, assuming a static target right now.
  // Path is an array of points representing points that the bot must get to
  // reconsider is a function that, when true, stops the current navigation
  // cycle and calls consider. It should be called with 'this'
  // iteration is a parameter used by the function itself to track how many
  // cycles have been completed, used for recomputing the path.
  Bot.prototype.navigate = function(path, reconsider, iteration) {
    // Don't execute function if bot is stopped.
    if (this.stopped) return;

    // Set iteration
    if (typeof iteration == 'undefined') iteration = 0;
    iteration++;

    var goal = false;
    var me = this._getLocation();
    // todo: use _getPLocation but remove or handle the possibility of getting points outside of walkable range.
    if (this.self.dead) {
      //this._clearInterval('navigateInterval');
      // Consider again after waiting until respawn.
      setTimeout(function() { this.consider();}.bind(this), 500);
      return;
    }

    if (reconsider(this)) {
      setTimeout(function() { this.consider();}.bind(this), 10);
      return;
    }

    // Find next location to seek out in path.
    if (path.length > 0) {
      goal = path[0];
      var cut = false;
      var last_index = 0;
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
    
    // If goal found.
    if (goal) {
      window.BotGoal = goal;
      window.BotVectors = [];

      // Sum result of each behavior.
      var desired_vector = new Point(0, 0);
      var seek_vec = this._seek(goal);
      desired_vector = desired_vector.add(seek_vec);
      var avoid_vec = this._avoid();
      desired_vector = desired_vector.add(avoid_vec);
      /*if (path.length > 1) {
        var nav_vec = this._navpath(goal, path[1]);
        desired_vector = desired_vector.add(nav_vec);
        window.BotVectors.push({edge: new Edge(me, me.add(nav_vec)), color: 'blue'});
      }*/
      window.BotVectors.push({item: new Edge(me, me.add(seek_vec)), color: 'green'});
      window.BotVectors.push({item: new Edge(me, me.add(avoid_vec)), color: 'red'});

      // Apply desired vector after a short delay.
      setTimeout(function() {this._update(desired_vector);}.bind(this), 0);
      if (iteration >= 50) {
        path = this.navmesh.calculatePath(this._getLocation(), path[path.length - 1]);
        timeout = 0;
        if (typeof path == 'undefined') {
          setTimeout(function() { this.consider(); }.bind(this), 1500);
          return;
        }
        iteration = 0;
      } else {
        timeout = 0;
      }
      setTimeout(function() {this.navigate(path, reconsider, iteration);}.bind(this), timeout)
    } else { // goal not found. clean up
      // Break interval and remove property.
      //this._clearInterval('navigateInterval');
      // Todo: notify listeners that goal has been reached.
      setTimeout(function() { this.consider();}.bind(this), 500);
    }
  }

  // The sendKey function, use it by calling "sendKey('direction', 'keyState')".
  // direction must be 'right', 'left', 'down' or 'up'. keyState must be 'keydown' or 'keyup'.
  Bot.prototype.sendKey = function(direction, keyState) {      
    // Defining the jQuery ($) key event as 'e'.
    var e = $.Event(keyState);
    
    // This switch statement will first check what direction was sent.
    // Then the if statement under that will check if keyWait is false.
    // If keyWait is false and a keydown event was sent while that key was not pressed,
    // or a keyup event was sent while that key was pressed,
    // assign the correct keycode for the key event and set keyWait to true for 25 miliseconds.
    switch (direction) {
      case 'right':
        if (!this.keyWait.x && ((keyState == 'keydown' && !this.simPressed.r) || (keyState == 'keyup' && this.simPressed.r))) {
          e.keyCode = 100;
          this.keyWait.x = true;
          setTimeout(function() {this.keyWait.x = false;}.bind(this), 25);
        }
        break;
        
      case 'left':
        if (!this.keyWait.x && ((keyState == 'keydown' && !this.simPressed.l) || (keyState == 'keyup' && this.simPressed.l))) {
          e.keyCode = 97;
          this.keyWait.x = true;
          setTimeout(function() {this.keyWait.x = false;}.bind(this), 25);
        }
        break;
        
      case 'down':
        if (!this.keyWait.y && ((keyState == 'keydown' && !this.simPressed.d) || (keyState == 'keyup' && this.simPressed.d))) {
          e.keyCode = 115;
          this.keyWait.y = true;
          setTimeout(function() {this.keyWait.y = false;}.bind(this), 25);
        }
        break;
        
      case 'up':
        if (!this.keyWait.y && ((keyState == 'keydown' && !this.simPressed.u) || (keyState == 'keyup' && this.simPressed.u))) {
          e.keyCode = 119;
          this.keyWait.y = true;
          setTimeout(function() {this.keyWait.y = false;}.bind(this), 25);
        }
        break;
    }
    
    // Do the key event, if keyCode was not defined (if the conditions aren't met), nothing will happen.
    $('#viewPort').trigger(e);
  }

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

  // Clear the interval given by function name.
  Bot.prototype._clearInterval = function(name) {
    if (this.actions.hasOwnProperty(name)) {
      clearInterval(this.actions[name]);
      delete this.actions[name];
    }
  }

  Bot.prototype._removeDraw = function() {
    delete window.BotGoal;
    delete window.BotEdge;
    delete window.BotEdge2;
    delete window.BotVectors;
  }

  // Get predicted location based on current position and velocity. Returns a Point object.
  // The multiplier argument is optional and specifies how many time steps into the future
  // the prediction will be.
  Bot.prototype._getPLocation = function(multiplier) {
    if (typeof multiplier == 'undefined') multiplier = 60;
    var selfX = this.self.x + this.self.lx * multiplier;
    var selfY = this.self.y + this.self.ly * multiplier;
    return new Point(selfX, selfY);
  }

  // Get current location as a point.
  Bot.prototype._getLocation = function() {
    return new Point(this.self.x, this.self.y);
  }

  // Get current velocity as a point vector.
  Bot.prototype._getVector = function(multiplier) {
    if (typeof multiplier == 'undefined') multiplier = 60;
    return new Point(this.self.lx * multiplier, this.self.ly * multiplier);
  }

  // Function for approaching a static target from the current position.
  Bot.prototype._seek = function(target) {
    var MAX_VELOCITY = 30;

    // Get your predicted position using location + speed * 60.
    var prediction = this._getPLocation(5);

    var steering = new Point(0, 0);
    var desired_velocity = target.sub(prediction).normalize().mul(MAX_VELOCITY);
    steering = desired_velocity.sub(this._getVector(5));
    return steering;
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
    // If the ray intersects the circle, the distance to the intersection
    // along the ray is returned, otherwise false is returned.
    // p - point defining start of ray
    // ray - unit vector extending from p
    // c - point defining center of circle
    // radius [optional] - radius of circle
    lineIntersectsCircle = function(p, ray, c, radius) {
      if (typeof radius == 'undefined') radius = 55;//45; // spike radius + ball radius + 1
      var vpc = c.sub(p);
      if (c.dot(ray) < 0) { // circle behind p
        if (vpc.len() > radius) {
          return false;
        } else {
          return true;
        }
      } else { // circle ahead of p
        // Projection of center point onto ray.
        var pc = p.add(ray.mul(ray.dot(vpc) / ray.len()));
        // Length from c to its projection on the ray.
        var len_c_pc = c.sub(pc).len();
        console.log("Distance: " + len_c_pc);
        if (len_c_pc > radius) {
          return false;
        } else { // It intersects, but where?
          var len_intersection = Math.sqrt(len_c_pc * len_c_pc + radius * radius);
          return pc.dist(p) - len_intersection;
        }
      }
    }.bind(this);

    // Takes a position and a vector looking ahead of the position. Returns
    // the closest obstacle that intersects with lookahead.
    findMostThreateningObstacle = function(pos, lookahead) {
      var mostThreatening = null;
      var spikelocations = this.getspikes();
      var ray = lookahead.sub(pos).normalize();
      // Length looking ahead.
      var dist_ahead = lookahead.dist(pos);
      for (var i = 0; i < spikelocations.length; i++) {
        var spike = spikelocations[i];
        var collision = lineIntersectsCircle(pos, ray, spike);

        if (collision && collision < dist_ahead && (mostThreatening == null || pos.dist(spike) < pos.dist(mostThreatening))) {
          mostThreatening = spike;
        }
      }
      return mostThreatening;
    }.bind(this);

    var MAX_SEE_AHEAD = 30;
    var MAX_AVOID_FORCE = 75;
    // Ray with current position as basis.
    var position = this._getLocation();
    var ahead = this._getPLocation(MAX_SEE_AHEAD);
    window.BotEdge2 = new Edge(position, ahead);
    var mostThreatening = findMostThreateningObstacle(position, ahead);
    var avoidance = new Point(0, 0);

    if (mostThreatening) {
      avoidance.x = ahead.x - mostThreatening.x;
      avoidance.y = ahead.y - mostThreatening.y;
      avoidance = avoidance.normalize();
      avoidance = avoidance.mul(MAX_AVOID_FORCE);
    }
    return avoidance;
  }

  Bot.prototype.getspikes = function() {
    if (this.hasOwnProperty('spikes')) {
      return this.spikes;
    } else {
      var spikes = new Array();
      for (column in tagpro.map) {
        for (tile in tagpro.map[column]) {
          if (tagpro.map[column][tile] == 7) {
            spikes.push(new Point(40 * column, 40 * tile));
          }
        }
      }
      this.spikes = spikes;
      window.spikes = spikes;
      return spikes;
    }
  }

  // This function takes in a point representing a desired direction vector and presses
  // the keys necessary to meet that vector, if needed.
  // todo: add threshold for more fine-grained control, 
  Bot.prototype._update = function(vec) {
    var current = this._getVector(1);
    if (vec.x < current.x) {
      this.sendKey('right', 'keyup');
      this.sendKey('left', 'keydown');
    } else {
      this.sendKey('left', 'keyup');
      this.sendKey('right', 'keydown');
    }

    if (vec.y < current.y) {
      this.sendKey('down', 'keyup');
      this.sendKey('up', 'keydown');
    } else {
      this.sendKey('up', 'keyup');
      this.sendKey('down', 'keydown');
    }
  }

  Bot.prototype.allUp = function() {
    this.sendKey('up', 'keyup');
    this.sendKey('down', 'keyup');
    this.sendKey('right', 'keyup');
    this.sendKey('left', 'keyup');
  }

  // This returns a callback function to update keys being pressed for document key listener event.
  Bot.prototype._keyUpdateFunc = function(newState) {
    return function(d) {
      d = d || window.event;
      switch(d.keyCode) {
        case 39: case 68: case 100: this.simPressed.r = newState; break;
        case 37: case 65: case 97: this.simPressed.l = newState; break;
        case 40: case 83: case 115: this.simPressed.d = newState; break;
        case 38: case 87: case 119: this.simPressed.u = newState; break;
      }
    }.bind(this);
  }

  // Get enemy flag coordinates. An object is returned with properties point and present.
  // if flag is present at point then it will be set to true. If no flag is found, then
  // 
  Bot.prototype.findEnemyFlag = function() {
    // Get flag value.
    var flagval = (this.self.team + 2 == 4) ? 3 : 4;
    for (column in tagpro.map) {
      for (tile in tagpro.map[column]) {
        if (tagpro.map[column][tile] == flagval || tagpro.map[column][tile] == flagval+0.1) {
          return new Point(40 * column, 40 * tile);;
        }
      }
    }
    return null;
  }

  // Get own flag coordinates. todo: differentiate between present and non-present flag.
  Bot.prototype.findOwnFlag = function() {
    var flagval = this.self.team + 2;
    for (column in tagpro.map) {
      for (tile in tagpro.map[column]) {
        if (tagpro.map[column][tile] == flagval || tagpro.map[column][tile] == flagval+0.1) {
          return new Point(40 * column, 40 * tile);
        }
      }
    }
    return null;
  }

  Bot.prototype.findYellowFlag = function() {
    var flagval = 16;
    for (column in tagpro.map) {
      for (tile in tagpro.map[column]) {
        if (tagpro.map[column][tile] == flagval || tagpro.map[column][tile] == flagval+0.1) {
          return new Point(40 * column, 40 * tile);;
        }
      }
    }
    return null;
  }

  // Identify the game time, whether capture the flag or yellow flag.
  // Returns either "ctf" or "yf".
  Bot.prototype._getGameType = function() {
    if (this.findOwnFlag && this.findEnemyFlag) return "ctf";

  }

  // Start.
  var bot = new Bot();
  // Set up UI.
  $('body').append('<div id="bot-ui"></div>');
  $('#bot-ui').append('<button id="bot-stop">Stop</button>');
  $('#bot-ui').append('<button id="bot-start">Start</button>');
  $('#bot-ui').css('position', 'absolute');
  $('#bot-ui').css('top', '45px');
  $('#bot-ui').css('left', '25px');

  $('#bot-stop').click(function(e) {
    bot.stop();
  });
  $('#bot-start').click(function(e) {
    bot.start();
  });
  window.myBot = bot;

});


// Here is a list of player values:
//
// a: Unknown.
// ac: Acceleration from pressing arrow keys. Changes with Juke Juice or if on team tiles.
// angle: Rotation angle.
// auth: If using registered name.
// bomb: If player has rolling bomb.
// cache: Player cache object.
// dead: If player is dead.
// degree: Player's degree.
// degreeCache: Player degree cache object.
// den: Unknown.
// directSet: Unknown.
// down: If player is pressing down.
// draw: If player is drawn in your view.
// flag: If player has any flag.
// flair: Player's flair object.
// grip: If player has Juke Juice.
// id: The players ID number. The player can be called directly by using: tagpro.players["ID number"].
// lastSync: Unknown object.
// left: If player is pressing left.
// lx: Player's X axis speed.
// ly: Player's Y axis speed.
// mongoId: Unknown.
// ms: Top speed a player can go under his own power. Changes with Top Speed power-up and team tiles.
// name: Player's name.
// points: Unknown.
// pressing: Unknown object.
// ra: Unknown.
// right: If player is pressing right.
// rx: Player's X axis pixel location divided by 10. Not as accurate as 'x'.
// ry: Player's Y axis pixel location divided by 10. Not as accurate as 'y'.
// s-captures: Number of captures player has.
// s-drops: Number of drops player has.
// s-grabs: Number of grabs player has.
// s-hold: Amount of hold time player has.
// s-pops: Number of times player has been popped.
// s-prevent: Amount of prevent player has.
// s-returns: Number of returns player has.
// s-support: Amount of support player has.
// s-tags: Number of tags player has.
// score: Total player score.
// speed: If player has Top Speed.
// sync: Unknown.
// tagpro: If player has TagPro.
// team: What team player is on. 1 = red, 2 = blue.
// up: If player is pressing up.
// x: Player's X location.
// y: Player's Y location.
