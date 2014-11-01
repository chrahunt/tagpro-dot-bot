// Based on the botscript by CFlakes.

require([], function() {
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
  };

  // Initialize functionality dependent on tagpro provisioning playerId.
  Bot.prototype.init = function() {
    if (!tagpro.playerId) {return setTimeout(this.init.bind(this), 250);}

    // self is your player object.
    this.self = tagpro.players[tagpro.playerId];
    window.self = this.self;
    window.destination = this.destination;
    this.playerId = tagpro.playerId;

    // getAcc function set as an interval loop.
    setInterval(this.getAcc.bind(this), 10);

    // getFC function set as an interval loop.
    setInterval(this.getFC.bind(this), 10);

        // Store tagpro.ui.draw so we can add to it.
    var uiDraw = tagpro.ui.draw;
    
    // Using ui.draw to display where your bot is headed.
    tagpro.ui.draw = function(e) {
      e.save();
      e.globalAlpha = 1;
      e.lineCap = 'round';
      e.lineWidth = 40;
      e.beginPath();
      e.strokeStyle = self.team == 1 ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 0, 255, 0.2)";
      e.moveTo(viewPort.width/2, viewPort.height/2);
      e.lineTo(viewPort.width/2 + (window.destination.x - window.self.x), viewPort.height/2 + (window.destination.y - window.self.y));
      e.stroke();
      e.restore();
      
      // Restore tagpro.ui.draw and apply our changes.
      return uiDraw.apply(this, arguments);
    };
    console.log("Bot loaded!");
  }

  // The sendKey function, use it by calling "sendKey('direction', 'keyState')".
  // direction must be 'right', 'left', 'down' or 'up'. keyState must be 'keydown' or 'keyup'.
  Bot.prototype.sendKey = function(direction, keyState) {      
    // Defining the jQuerry ($) key event as 'e'.
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
          var selfX = self.x + self.lx*60,
            selfY = self.y + self.ly*60;
          
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

  var bot = new Bot();
  bot.init();
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
