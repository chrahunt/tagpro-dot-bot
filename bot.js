// Based on the botscript by CFlakes.
requirejs.config({
  shim: {
    'map/clipper': {
      exports: 'ClipperLib'
    }
  }
});

require(['map/parse-map', 'map/navmesh', 'map/polypartition'],
function( mapParser,       NavMesh,       pp) {
  // Alias useful classes.
  var Point = pp.Point;
  var Poly = pp.Poly;
  console.log("Bot Loading.");

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

    this.destination = {x: undefined, y: undefined};
    this.actions = {};

    this.initialized = false;
    this.mapInitialized = false;
    this.init();
    setTimeout(this.processMap.bind(this), 50);
    setTimeout(this.consider.bind(this), 150);
  };

  // Initialize functionality dependent on tagpro provisioning playerId.
  Bot.prototype.init = function() {
    console.log("Trying init.");
    if (typeof tagpro !== 'object' || !tagpro.playerId) {return setTimeout(this.init.bind(this), 250);}

    // self is your player object.
    this.self = tagpro.players[tagpro.playerId];
    window.self = this.self;
    window.destination = this.destination;
    this.playerId = tagpro.playerId;

    // getAcc function set as an interval loop.
    this.actions['accInterval'] = setInterval(this.getAcc.bind(this), 10);

    // getFC function set as an interval loop.
    this.actions['getFCInterval'] = setInterval(this.getFC.bind(this), 10);
    
    console.log("Bot loaded!");
    // Set up drawing.
    this._setDraw();
    this.initialized = true;
  }

  // Process map-related things.
  Bot.prototype.processMap = function() {
    if (typeof tagpro !== 'object' || !tagpro.map) {return setTimeout(this.processMap.bind(this), 250);}
    this.mapTiles = tagpro.map;
    var polys = mapParser.parse(this.mapTiles);
    polys = mapParser.convertShapesToPolys(polys);
    this.navmesh = new NavMesh(polys);
    this.mapInitialized = true;
    // for writing on map
    window.BotMeshShapes = this.navmesh.polys;
    console.log("Navmesh constructed.");
  }

  // Consider the game and take necessary actions.
  Bot.prototype.consider = function() {
    // Ensure everything is initialized.
    if (!this.initialized || !this.mapInitialized || this.self.dead) { return setTimeout(function() { this.consider() }.bind(this), 50); }
    console.log("Considering."); // DEBUG
    // Remove getFC.
    if (this.actions.hasOwnProperty('getFC')) {
      clearInterval(this.actions['getFCInterval'])
      delete this.actions['getFCInterval'];
    }

    // First, just get enemy flag location, set it as destination, find path to it, go get it, return to base
    var enemyFlagPoint = this.findEnemyFlag();
    var ownFlagPoint = this.findOwnFlag();

    var destination;
    // Check if I have the flag.
    var iHaveFlag = this.self.flag;
    if (iHaveFlag) {
      destination = ownFlagPoint;
    } else {
      destination = enemyFlagPoint;
    }

    // Get path.
    var path = this.navmesh.calculatePath(this._getLocation(), destination);
    if (typeof path == 'undefined') {
      setTimeout(function() { this.consider(); }.bind(this), 1500);
      return;
    }

    // get to it!
    this.navigate(path);
  }

  // Takes a path and navigates it, assuming a static target right now.
  Bot.prototype.navigate = function(path, iteration) {
    console.log("Navigating."); // DEBUG
    if (typeof iteration == 'undefined') iteration = 0;
    iteration++;
    if (iteration >= 10) {
      path = this.navmesh.calculatePath(this._getPLocation(), path[path.length - 1]);
      if (typeof path == 'undefined') {
        setTimeout(function() { this.consider(); }.bind(this), 1500);
        return;
      }
    }
    var goal = false;
    var me = this._getLocation();
    // todo: use _getPLocation but remove or handle the possibility of getting points outside of walkable range.
    if (this.self.dead) {
      this._clearInterval('navigateInterval');
      // Consider again after waiting until respawn.
      setTimeout(function() { this.consider();}.bind(this), 500);
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

      // Sum result of each behavior.
      var desired_vector = new Point(0, 0);
      desired_vector = desired_vector.add(this._seek(goal));
      desired_vector = desired_vector.add(this._avoid());
      if (path.length > 1) {
        desired_vector = desired_vector.add(this._navpath(goal, path[1]));
      }

      // Apply desired vector after a short delay.
      setTimeout(function() {this._update(desired_vector);}.bind(this), 0);
      setTimeout(function() {this.navigate(path, iteration);}.bind(this), 25)
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

  // Set up drawing functions.
  Bot.prototype._setDraw = function() {
    var self = tagpro.players[tagpro.playerId];
    
    // Remap a coordinate so that it looks static, similar to the map tiles.
    function remap(e, context) {
      return {
        x: e.x * (1 / tagpro.zoom) - (self.x - context.canvas.width / 2),
        y: e.y * (1 / tagpro.zoom) - (self.y - context.canvas.height / 2)
      }
    }
    
    // Given a polygon, context, and color, draw its outline.
    drawPoly = function(poly, context, color) {
      if (typeof color == 'undefined') color = 'black';
      // Resize relative to canvas offset and position.
      // Values from global-game
      var a = {x: 0, y: 0};
      var e = 40 / 2; // from tile size 40.
      context.beginPath();
      var start = remap(poly.getPoint(0), context);
      context.moveTo(start.x, start.y);
      for (var i = 1; i < poly.numpoints; i++) {
        var nextPoint = remap(poly.getPoint(i), context);
        context.lineTo(nextPoint.x, nextPoint.y);
      }
      context.lineTo(start.x, start.y);
      context.lineWidth = 1;
      context.strokeStyle = color;
      context.stroke();
      context.closePath();
    }

    // Draw multiple shape/polygons on canvas.
    drawOutline = function(shapes, context) {
      for (var i = 0; i < shapes.length; i++) {
        if (shapes[i] instanceof Poly) {
          drawPoly(shapes[i], context);
        } else {
          drawShape(shapes[i], context);
        }
      }
    }

    // Draw a green dot.
    drawPoint = function(point, context) {
      point = remap(point, context);
      var radius = 5;
      context.beginPath();
      context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
      context.fillStyle = 'green';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#003300';
      context.stroke();
    }

    // Draw an edge on the canvas.
    drawLine = function(edge, context, color) {
      if (typeof color == 'undefined') color = 'black';
      var p1 = remap(edge.p1, context);
      var p2 = remap(edge.p2, context);
      var radius = 5;
      context.beginPath();
      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      context.lineWidth = 3;
      context.strokeStyle = color;
      context.stroke();
      context.closePath();
    }

    // Store tagpro.ui.draw so we can add to it.
    var uiDraw = tagpro.ui.draw;
    
    // Using ui.draw to display where your bot is headed.
    tagpro.ui.draw = function(e) {
      e.save();
      e.globalAlpha = 1;

      if (window.hasOwnProperty('BotMeshShapes')) {
        drawOutline(window.BotMeshShapes, e);
      }

      if (window.hasOwnProperty('BotGoal')) {
        drawPoint(window.BotGoal, e);
      }

      if (window.hasOwnProperty('BotEdge')) {
        drawLine(window.BotEdge, e, 'red');
      }

      if (window.hasOwnProperty('BotEdge2')) {
        drawLine(window.BotEdge2, e, 'green');
      }
      
      // Restore tagpro.ui.draw and apply our changes.
      return uiDraw.apply(this, arguments);
    };
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
  // Does not handle obstacles.
  Bot.prototype._seek = function(target) {
    // Get your predicted position using location + speed * 60.
    var prediction = this._getPLocation();

    var vector = new Point(0, 0);
    
    // If their predicted x location is less than yours, move left. Else move right.
    if (target.x < prediction.x) {
      vector.x = -10;
    } else {
      vector.x = 10;
    }
    
    // If their predicted y location is less than yours, move up. Else move down.
    if (target.y < prediction.y) {
      vector.y = -10;
    } else {
      vector.y = 10;
    }
    return vector;
  }

  // Move such that it is more likely the next point along the path will appear.
  // Takes in the current goal and the next point.
  Bot.prototype._navpath = function(goal, next) {
    var WEIGHT = 10;
    var desired = new Point(0, 0);
    var current = this._getLocation();
    var diff = current.sub(goal).normalize();
    if (Math.abs(diff.y) > Math.abs(diff.x)) {
      desired.x = diff.x * WEIGHT;
    } else {
      desired.y = diff.y * WEIGHT;
    }
    return desired;
  }

  // Returns a desired direction vector for avoiding spikes.
  Bot.prototype._avoid = function() {
    lineIntersectsCircle = function(ahead, ahead2, p, radius) {
      if (typeof radius == 'undefined') radius = 24; // spike radius + ball radius + 1
      return (ahead.dist(p) <= radius || ahead2.dist(p) <= radius);
    }.bind(this);

    findMostThreateningObstacle = function() {
      var mostThreatening = null;
      var spikelocations = this.getspikes();
      for (var i = 0; i < spikelocations.length; i++) {
        var spike = spikelocations[i];
        var collision = lineIntersectsCircle(ahead, ahead2, spike);

        if (collision && (mostThreatening == null || position.dist(spike) < position.dist(mostThreatening))) {
          mostThreatening = spike;
        }
      }
      return mostThreatening;
    }.bind(this);

    var MAX_SEE_AHEAD = 5;
    var MAX_AVOID_FORCE = 10;
    var ahead = this._getPLocation(MAX_SEE_AHEAD);
    var ahead2 = ahead.mul(0.5);
    var position = this._getLocation();
    var mostThreatening = findMostThreateningObstacle();
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
    if (this.hasOwnProperty(spikes)) {
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

  // The brain, this holds all your math variables and commands used to chase the enemy FC.
  Bot.prototype.getFC = function() {
    // 'for in' loop to loop through players.
    for (var id in tagpro.players) {
      if (tagpro.players.hasOwnProperty(id)) {
        
        // Defining player to make things easy to read.
        var player = tagpro.players[id];
        
        // If a player is in view and not on your team and has the yellow flag...
        if (player.draw && player.team !== this.self.team && player.flag == 3) {
          
          // Get your predicted position using location + speed * 60.
          var selfX = this.self.x + this.self.lx*60,
            selfY = this.self.y + this.self.ly*60;
          
          // Get enemy's predicted position using location + speed * 60 + keypresses.
          this.destination = {x: player.x + player.lx*60 + player.accX, y: player.y + player.ly*60 + player.accY};
          
          // If their predicted x location is less than yours, move left. Else move right.
          if (this.destination.x < selfX) {
            this.sendKey('right', 'keyup');
            this.sendKey('left', 'keydown');
          } else {
            this.sendKey('left', 'keyup');
            this.sendKey('right', 'keydown');
          }
          
          // If their predicted y location is less than yours, move up. Else move down.
          if (this.destination.y < selfY) {
            this.sendKey('down', 'keyup');
            this.sendKey('up', 'keydown');
          } else {
            this.sendKey('up', 'keyup');
            this.sendKey('down', 'keydown');
          }
        }
      }
    }
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

  // Get enemy flag coordinates. todo: differentiate between present and non-present flag.
  Bot.prototype.findEnemyFlag = function() {
    // Get flag value.
    var flagval = (this.self.team + 2 == 4) ? 3 : 4;
    for (column in tagpro.map) {
      for (tile in tagpro.map[column]) {
        if (tagpro.map[column][tile] == flagval || tagpro.map[column][tile] == flagval+0.1) {
          return new Point(40 * column, 40 * tile);
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

  // Start.
  var bot = new Bot();
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
