/**
 * @module overlay
 */
var Point = require('./geometry').Point;
var Edge = require('./geometry').Edge;

var Utils = {
  convertPolyToPIXIPoly: function (poly) {
    var points = [];
    for (var i = 0; i < poly.points.length; i++) {
      points.push(poly.points[i].x, poly.points[i].y);
    }
    // Add initial point to end of array to resolve PIXI rendering
    // issue.
    points.push(points[0], points[1]);
    return new PIXI.Polygon(points);
  },
  makeText: function (color) {
    if (typeof color == 'undefined') color = "#FFFFFF";
    var text = new PIXI.Text("", {
        font: "bold 10pt Arial",
        fill: color,
        stroke: "#000000",
        strokeThickness: 3,
        align: "center"
    });
    text.anchor = new PIXI.Point(0.5, 0.5);
    text.visible = false;
    return text;
  }
};

// Various drawings.
// Drawing has properties init, update, hide, show.
var drawings = [
  { // Desired velocity.
    init: function (bot, draw) {
      this.bot = bot;
      this.draw = draw;
      this.draw.addVector("desired", 0x0000ff);
    },
    update: function () {
      if (this.bot.desired_vector) this.draw.updateVector("desired", this.bot.desired_vector.mul(10));
    },
    show: function () {
      this.draw.showVector("desired");
    },
    hide: function () {
      this.draw.hideVector("desired");
    }
  }, { // Navigation mesh.
    init: function (bot, draw) {
      this.bot = bot;
      this.draw = draw;
      this.draw.addBackground("mesh", 0x555555);
      this._init();
    },
    _init: function () {
      if (!this.bot.navmesh && !this.bot.navmesh.polys) {
        setTimeout(this._init.bind(this), 50);
        return;
      }
      this.bot.navmesh.onUpdate(function (polys) {
        this.draw.updateBackground("mesh", polys);
      }.bind(this));
      this.draw.updateBackground("mesh", this.bot.navmesh.polys);
    },
    update: function () {},
    show: function () {},
    hide: function () {}
  }, { // Manually-set goal point.
    init: function (bot, draw) {
      this.bot = bot;
      this.draw = draw;
      this.draw.addPoint("manual_target", 0xffff00, "foreground");
    },
    update: function () {
      if (this.bot.getState("control") == "manual") {
        var manual_target = this.bot.getState("manual_target");
        if (manual_target) {
          this.draw.showPoint("manual_target");
          this.draw.updatePoint("manual_target", manual_target);
        } else {
          this.hide();
        }
      }
    },
    show: function () {
      this.draw.showPoint("manual_target");
    },
    hide: function () {
      this.draw.hidePoint("manual_target");
    }
  }, { // Next point when following path.
    init: function (bot, draw) {
      this.bot = bot;
      this.draw = draw;
      this.draw.addPoint("next_point", 0x00ff00, "foreground");
    },
    update: function () {
      var goal = this.bot.getState("target");
      if (goal) {
        this.draw.showPoint("next_point");
        this.draw.updatePoint("next_point", goal.loc);
      } else {
        this.hide();
      }
    },
    show: function () {
      this.draw.showPoint("next_point");
    },
    hide: function () {
      this.draw.hidePoint("next_point");
    }
  }, { // Paths.
    init: function (bot, draw) {
      this.bot = bot;
      this.draw = draw;
      this.original_path_c = new PIXI.Graphics();
      this.path_c = new PIXI.Graphics();
      tagpro.renderer.layers.background.addChild(this.original_path_c);
      tagpro.renderer.layers.background.addChild(this.path_c);
    },
    update: function () {
      var path = this.bot.getState("next_path");
      var original_path = this.bot.getState("original_path");
      if (!this.hasOwnProperty("next_path") || this.next_path !== path) {
        this.next_path = path;
        if (this.next_path) {
          this._drawPath(this.next_path, this.path_c, 0x0000ee);
        } else {
          this.path_c.clear();
          this.path_c.visible = false;
        }
      }
      if (!this.hasOwnProperty("original_path") || this.original_path !== original_path) {
        this.original_path = original_path;
        if (this.original_path) {
          this._drawPath(this.original_path, this.original_path_c, 0x00ff00);
        } else {
          this.original_path_c.clear();
          this.original_path_c.visible = false;
        }
      }
    },
    _drawPath: function (path, container, color) {
      container.clear();
      container.lineStyle(1, color, 1);
      container.beginFill(color, 1);
      for (var i = 0; i < path.length; i++) {
        var point = path[i];
        container.drawCircle(point.x, point.y, 3);
        if (i < path.length - 1) {
          var next = path[i + 1];
          container.moveTo(point.x, point.y);
          container.lineTo(next.x, next.y);
        }
      }
      container.endFill();
    },
    hide: function () {
      this.original_path_c.visible = false;
      this.path_c.visible = false;
    },
    show: function () {
      this.original_path_c.visible = true;
      this.path_c.visible = true;
    }
  }, { // Steering cost vectors.
    init: function (bot, draw) {
      this.bot = bot;
      this.draw = draw;
      this.cost_vector_container = new PIXI.Graphics();
      this.cost_vector_container.x = 20;
      this.cost_vector_container.y = 20;
      this.draw.addSpriteChild(this.cost_vector_container);
    },
    _draw: function (costs, color) {
      this.cost_vector_container.lineStyle(2, color, 1);
      var angle = 2 * Math.PI / costs.length;
      for (var i = 0; i < costs.length; i++) {
        this.cost_vector_container.moveTo(0, 0);
        var cost = costs[i];
        var x = Math.cos(angle * i) * cost;
        var y = Math.sin(angle * i) * cost;
        this.cost_vector_container.lineTo(x, y);
      }
    },
    update: function () {
      this.cost_vector_container.clear();
      if (this.bot.steerer.costs) {
        var colors = {
          static_avoid: 0xEE0000,
          seek: 0x0000EE,
          dynamic_avoid: 0xEEEE00
        };
        var costs = this.bot.steerer.costs;
        if (costs.length == 2) {
          // No dynamic obstacle avoidance.
          this._draw(costs[0], colors.static_avoid);
          this._draw(costs[1], colors.seek);
        } else {
          // Includes dynamic obstacle avoidance.
          this._draw(costs[0], colors.static_avoid);
          this._draw(costs[1], colors.dynamic_avoid);
          this._draw(costs[2], colors.seek);
        }
      }
    },
    show: function () {
      this.cost_vector_container.visible = true;
    },
    hide: function () {
      this.cost_vector_container.visible = false;
    }
  }, { // Powerups.
    init: function (bot, draw) {
      console.log("Initializing powerup overlay.");
      this.bot = bot;
      this.draw = draw;
      
      this.powerup_respawn = 60000;
      var powerups = this.bot.game.powerupTracker.getPowerups();
      this._initIndicators(powerups);
      this._initTiles(powerups);
    },
    _initIndicators: function (powerups) {
      // Offset of indicators from side of window.
      this.indicator_offset = 50;
      this.indicator_ui = new PIXI.DisplayObjectContainer();
      tagpro.renderer.layers.ui.addChild(this.indicator_ui);
      var texture = this._getIndicatorTexture();

      this.indicators = {};
      powerups.forEach(function (powerup) {
        var c = new PIXI.Sprite(texture);
        c.anchor = new PIXI.Point(0.5, 0.5);
        this.indicator_ui.addChild(c);
        var t = Utils.makeText();
        this.indicator_ui.addChild(t);
        this.indicators[powerup.id] = {
          container: c,
          text: t
        };
      }, this);
      $("#viewport").resize(this._onResize.bind(this));
      this._onResize();      
    },
    _initTiles: function (powerups) {
      this.tile_ui = new PIXI.DisplayObjectContainer();
      tagpro.renderer.layers.foreground.addChild(this.tile_ui);
      this.tile_overlays = {};
      powerups.forEach(function (powerup) {
        var t = Utils.makeText();
        this.tile_ui.addChild(t);
        this.tile_overlays[powerup.id] = {
          text: t
        };
      }, this);
    },
    // Function called on viewport resize.
    _onResize: function () {
      var viewport = $("#viewport");
      this.indicator_lines = [];
      // Top.
      this.indicator_lines.push(new Edge([
        this.indicator_offset, this.indicator_offset,
        viewport.width() - this.indicator_offset, this.indicator_offset
      ]));
      // Right.
      this.indicator_lines.push(new Edge([
        viewport.width() - this.indicator_offset, this.indicator_offset,
        viewport.width() - this.indicator_offset, viewport.height() - this.indicator_offset
      ]));
      // Bottom.
      this.indicator_lines.push(new Edge([
        viewport.width() - this.indicator_offset, viewport.height() - this.indicator_offset,
        this.indicator_offset, viewport.height() - this.indicator_offset
      ]));
      // Left.
      this.indicator_lines.push(new Edge([
        this.indicator_offset, viewport.height() - this.indicator_offset,
        this.indicator_offset, this.indicator_offset
      ]));
    },
    update: function () {
      var powerups = this.bot.game.powerupTracker.getPowerups();
      var visible_powerups = [];
      var offscreen_powerups = [];
      for (var i = 0; i < powerups.length; i++) {
        var powerup = powerups[i];
        // TODO: Limit to tile visibility by player.
        if (powerup.visible) {
          visible_powerups.push(powerup);
        } else {
          offscreen_powerups.push(powerup);
        }
      }
      visible_powerups.forEach(this._hideIndicator, this);
      offscreen_powerups.forEach(this._hideTileOverlay, this);
      this._drawIndicators(offscreen_powerups);
      this._drawTileOverlays(visible_powerups);
    },
    // Draw indicators for off-screen powerups.
    _drawIndicators: function (powerups) {
      var scale = tagpro.renderer.gameContainer.scale.x;
      var gameLocation = Point.fromPointLike(tagpro.renderer.gameContainer).div(-scale);
      // Convert indicator lines to game coordinates.
      var indicator_lines = this.indicator_lines.map(function (line) {
        return line.scale(1 / scale).translate(gameLocation);
      });
      var viewport = $("#viewport");
      var center = new Point(viewport.width() / 2, viewport.height() / 2);
      // Center in game coordinates.
      center = center.div(scale).add(gameLocation);

      for (var i = 0; i < powerups.length; i++) {
        var powerup = powerups[i];
        var indicator = this.indicators[powerup.id];
        if (powerup.visible) {
          indicator.container.visible = false;
        } else {
          indicator.container.visible = true;
          indicator.text.visible = true;
          
          var info = {};
          // World coordinates.
          var loc = Point.fromPointLike(powerup).mul(40).add(20);
          // Line pointing to powerup.
          info.dir = loc.sub(center).normalize();
          // Line from center to tile.
          var line = new Edge(center, loc);
          for (var j = 0; j < indicator_lines.length; j++) {
            var indicator_line = indicator_lines[j];
            var intersection = indicator_line.intersection(line);
            if (intersection) {
              // Set draw point.
              info.point = intersection.sub(gameLocation).mul(scale);
              break;
            }
          }
          if (!info.point) {
            console.error("Error finding overlay position for powerup indicator.");
          } else {
            if (powerup.present_known) {
              if (powerup.present) {
                if (powerup.value_known) {
                  //info.icon = powerup.value;
                  info.text = "!";
                } else {
                  info.text = "!";
                }
              } else if (powerup.taken_time_known) {
                var respawn_time = powerup.taken_time + this.powerup_respawn - Date.now();
                info.text = (respawn_time / 1e3).toFixed(1);
              } else {
                info.text = "?";
              }
            } else {
              info.text = "?";
            }
            indicator.container.x = info.point.x;
            indicator.container.y = info.point.y;
            indicator.container.rotation = Math.atan2(info.dir.y, info.dir.x);
            indicator.text.x = info.point.x;
            indicator.text.y = info.point.y;
            indicator.text.setText(info.text);
          }
        }
      }
    },
    // Get indicator texture for sprite.
    _getIndicatorTexture: function () {
      var g = new PIXI.Graphics();
      g.clear();
      g.lineStyle(1, 0xffffff, 0.9);
      var indicator_size = 18;
      var container_size = indicator_size * 2 + 10 * 2;
      // Circle.
      g.beginFill(0xFFFFFF, 0.9);
      g.drawCircle(container_size / 2, container_size / 2, indicator_size);
      // Pointer.
      var triangle_size = 6;
      var pointer_base = container_size / 2 + indicator_size;
      g.drawShape(new PIXI.Polygon([
        pointer_base, container_size / 2 - triangle_size / 2,
        pointer_base + triangle_size, container_size / 2,
        pointer_base, container_size / 2 + triangle_size / 2,
        pointer_base, container_size / 2 - triangle_size / 2,
      ]));
      g.endFill();
      // Invisible line so generated texture is centered on circle.
      g.lineStyle(0, 0, 0);
      g.moveTo(10, container_size / 2);
      g.lineTo(10 - triangle_size, container_size / 2);
      return g.generateTexture();
    },
    // Hide indicator.
    _hideIndicator: function (powerup) {
      var indicator = this.indicators[powerup.id];
      indicator.text.visible = false;
      indicator.container.visible = false;
    },
    // Draw overlays on visible powerups.
    _drawTileOverlays: function (powerups) {
      for (var i = 0; i < powerups.length; i++) {
        var powerup = powerups[i];
        var text = this.tile_overlays[powerup.id].text;
        if (powerup.present_known && powerup.present) {
          text.visible = false;
          continue;
        } else {
          var loc = Point.fromPointLike(powerup).mul(40).add(20);
          text.visible = true;
          text.x = loc.x;
          text.y = loc.y;
          if (powerup.taken_time_known) {
            var respawn_time = powerup.taken_time + this.powerup_respawn - Date.now();
            text.setText((respawn_time / 1e3).toFixed(1));
          } else {
            text.setText("?");
          }
        }
      }
    },
    // Hide overlay.
    _hideTileOverlay: function (powerup) {
      var tile_overlay = this.tile_overlays[powerup.id];
      tile_overlay.text.visible = false;
    },
    show: function () {

    },
    hide: function () {
      // Reset so we see state again.
      this.logged = false;
    }
  }
];

/**
 * Visual overlay to display real-time state over the game.
 * @param {Bot} bot - The bot.
 */
var Overlay = function(bot) {
  this.bot = bot;
  this.draw = new DrawUtils();
  drawings.forEach(function (drawing) {
    drawing.init(this.bot, this.draw);
  }, this);
  this.check();
};
module.exports = Overlay;

// Interval to check/update vectors.
Overlay.prototype.update = function() {
  if (this.bot.stopped) {
    this.stopped = true;
    drawings.forEach(function (drawing) {
      drawing.hide();
    });
    // Set loop to check later.
    this.check();
    return;
  } else {
    requestAnimationFrame(this.update.bind(this));
    drawings.forEach(function draw(drawing) {
      drawing.update();
    });
  }
};

// Check if the bot has started and start the animation if so.
Overlay.prototype.check = function() {
  if (!this.bot.stopped) {
    drawings.forEach(function (drawing) {
      drawing.show();
    });
    requestAnimationFrame(this.update.bind(this));
  } else {
    setTimeout(this.check.bind(this), 200);
  }
};

/**
 * DrawUtils holds canvas-drawing responsibility, including keeping track of
 * what items are to be drawn on the canvas as well as how to actually do it.
 * To add an item to be drawn, simply register it using the register function,
 * passing in the name of the global variable that, when set, will point to your
 * object. Objects must have 'item' and 'color' properties. The item must point
 * to a Poly, Edge, or Point, and the color property must point to a string defining
 * the color to be used in drawing the item.
 * @constructor
 */
function DrawUtils() {
  this.init();
}

// Initialize drawing functions.
DrawUtils.prototype.init = function() {
  this.self = tagpro.players[tagpro.playerId];

  // Store items to be drawn.
  this.vectors = {};
  this.backgrounds = {};
  this.points = {};

  // Guard against properties not being created.
  tagpro.renderer.updatePlayer(this.self);

  // Add vectors container to player sprites object.
  this.self.sprites.vectors = new PIXI.Graphics();
  this.self.sprite.addChild(this.self.sprites.vectors);

  // Center vectors on player.
  this.self.sprites.vectors.position.x = 20;
  this.self.sprites.vectors.position.y = 20;
};

/**
 * Adds a vector to be drawn over the current player.
 * @param {string} name - The name used to refer to the vector.
 * @param {number} [color=0x000000] - The color used when drawing the
 *   vector.
 */
DrawUtils.prototype.addVector = function(name, color) {
  var vector = {
    name: name,
    container: new PIXI.Graphics(),
    color: color || 0x000000
  };
  this.vectors[name] = vector;
  this.self.sprites.vectors.addChild(vector.container);
};

/**
 * Updates the vector identified with `name` with the values from
 * point `p`.
 * @param {string} name - The name of the vector to update.
 * @param {Point} p - The point to use to update the vector.
 */
DrawUtils.prototype.updateVector = function(name, p) {
  this.vectors[name].x = p.x;
  this.vectors[name].y = p.y;
  this._drawVector(this.vectors[name]);
};

DrawUtils.prototype.hideVector = function(name) {
  this.vectors[name].container.visible = false;
};

DrawUtils.prototype.showVector = function(name) {
  this.vectors[name].container.visible = true;
};

/**
 * Add navmesh polys to background.
 */
DrawUtils.prototype.addBackground = function(name, color) {
  var background = {
    color: color,
    container: new PIXI.Graphics()
  };
  // Add background as child of background layer.
  tagpro.renderer.layers.background.addChild(background.container);
  this.backgrounds[name] = background;
};

DrawUtils.prototype.updateBackground = function(name, polys) {
  this.backgrounds[name].polys = polys;
  this._drawBackground(this.backgrounds[name]);
};

/**
 * Represents a point to be drawn on the screen, along with information
 * about how to draw it.
 * @typedef PointInfo
 * @type {object}
 * @property {number} color - The fill color for the point.
 * @property {PIXI.Graphics} container - The container on which to
 *   draw the point.
 * @property {string} layer - The layer on which to draw the point,
 *   can be any layer identified in `tagpro.renderer.layers`.
 * @property {?Point} point - The location to draw the point. May
 *   be null as it is not initially set.
 */

/**
 * Represents a set of points to be drawn on the screen, along with
 * information about how to draw them.
 * @typedef PointsInfo
 * @type {object}
 * @property {number} color - The fill color for the point.
 * @property {PIXI.Graphics} container - The container on which to
 *   draw the point.
 * @property {string} layer - The layer on which to draw the point,
 *   can be any layer identified in `tagpro.renderer.layers`.
 */

/**
 * Add an identifier for a point or set of points to be drawn on the
 * screen.
 * @param {string} name - The name to identify the point.
 * @param {integer} color - The number identifying the color to use.
 * @param {string} [layer="background"] - A string identifying the
 *   layer to draw the point on.
 */
DrawUtils.prototype.addPoint = function(name, color, layer) {
  if (typeof layer == "undefined") layer = "background";
  var point = {
    color: color,
    container: new PIXI.Graphics(),
    layer: layer
  };
  tagpro.renderer.layers[layer].addChild(point.container);
  this.points[name] = point;
};

/**
 * Update the location of a point to be drawn on the screen.
 * @param {string} name - The name of the point to update.
 * @param {Point} point - The information about the point.
 */
DrawUtils.prototype.updatePoint = function(name, point) {
  this.points[name].point = point;
  this._drawPoint(this.points[name]);
};

DrawUtils.prototype.hidePoint = function(name) {
  this.points[name].container.visible = false;
};

DrawUtils.prototype.showPoint = function(name) {
  this.points[name].container.visible = true;
};

/**
 * Represents a 2d vector emanating from the center of the player,
 * along with attributes for drawing.
 * @typedef VectorInfo
 * @type {object}
 * @property {string} name - An identifier for the vector (unique
 *   relative to the other vectors.)
 * @property {PIXI.Graphics} container - The graphics container to
 *   draw the vector on.
 * @property {integer} color - Number representing color to use (e.g.
 *   0x000000.)
 * @property {?number} [x] - Number representing the x coordinate of
 *   the vector, relative to the center of the player.
 * @property {?number} [y] - Number representing the y coordinate of
 *   the vector, relative to the center of the player.
 */
/**
 * Draw a vector as a small arrow based at the center of the current
 * player.
 * @private
 * @param {VectorInfo} vector
 */
DrawUtils.prototype._drawVector = function(vector) {
  var v = new Point(vector.x, vector.y);
  var v_n = v.normalize();
  if (v.len() < 2) {
    this.hideVector(vector.name);
    return;
  } else {
    this.showVector(vector.name);
  }
  var vectorWidth = 4;
  // For arrowhead.
  var vectorAngle = Math.atan2(v.y, v.x);
  var headAngle = Math.PI / 6;
  var headLength = 10;
  var leftHead = (new Point(
    Math.cos((Math.PI - headAngle + vectorAngle) % (2 * Math.PI)),
    Math.sin((Math.PI - headAngle + vectorAngle) % (2 * Math.PI))));
  leftHead = leftHead.mul(headLength).add(v);
  var rightHead = (new Point(
    Math.cos((Math.PI + headAngle + vectorAngle) % (2 * Math.PI)),
    Math.sin((Math.PI + headAngle + vectorAngle) % (2 * Math.PI))));
  rightHead = rightHead.mul(headLength).add(v);
  // For fat vector body.
  var leftBase = (new Point(
    Math.cos((Math.PI / 2 + vectorAngle) % (2 * Math.PI)),
    Math.sin((Math.PI / 2 + vectorAngle) % (2 * Math.PI))));
  var rightBase = leftBase.mul(-1);

  leftBase = leftBase.mul(vectorWidth / 2);
  rightBase = rightBase.mul(vectorWidth / 2);
  var end = v_n.mul(v_n.dot(leftHead));
  var leftTop = leftBase.add(end);
  var rightTop = rightBase.add(end);

  // Add shapes to container.
  var c = vector.container;
  c.clear();
  c.lineStyle(2, 0x000000, 1);
  c.beginFill(vector.color, 1);
  c.moveTo(leftBase.x, leftBase.y);
  c.lineTo(leftTop.x, leftTop.y);
  c.lineTo(leftHead.x, leftHead.y);
  c.lineTo(v.x, v.y);
  c.lineTo(rightHead.x, rightHead.y);
  c.lineTo(rightTop.x, rightTop.y);
  c.lineTo(rightBase.x, rightBase.y);
  var v_n_l = v_n.mul(vectorWidth / 2);
  var cp1 = rightBase.sub(v_n_l);
  var cp2 = leftBase.sub(v_n_l);
  c.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, leftBase.x, leftBase.y);
  c.endFill();
};

/**
 * Redraw background in background container given a background
 * object.
 * @param {BackgroundInfo} background - The background to draw.
 */
DrawUtils.prototype._drawBackground = function(background) {
  var bg = background;

  var polys = background.polys.map(function(poly) {
    return Utils.convertPolyToPIXIPoly(poly);
  }, this);

  
  bg.container.clear();
  bg.container.lineStyle(1, bg.color, 1);
  polys.forEach(function(shape) {
    bg.container.drawShape(shape);
  });
};

/**
 * Draw a point, given a point to draw.
 * @private
 * @param {PointInfo} point - The point to draw.
 */
DrawUtils.prototype._drawPoint = function(point) {
  var p = point;

  p.container.clear();
  p.container.lineStyle(1, 0x000000, 1);
  p.container.beginFill(point.color, 1);
  p.container.drawCircle(p.point.x, p.point.y, 3);
  p.container.endFill();
  p.container.visible = true;
};

/**
 * Add child to main ball sprite.
 * @param {PIXI.Container} container - The container to add.
 */
DrawUtils.prototype.addSpriteChild = function(container) {
  this.self.sprite.addChild(container);
};
