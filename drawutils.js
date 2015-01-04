define(['map/polypartition'],
function(pp) {
  /**
   * DrawUtils holds canvas-drawing responsibility, including keeping track of
   * what items are to be drawn on the canvas as well as how to actually do it.
   * To add an item to be drawn, simply register it using the register function,
   * passing in the name of the global variable that, when set, will point to your
   * object. Objects must have 'item' and 'color' properties. The item must point
   * to a Poly, Edge, or Point, and the color property must point to a string defining
   * the color to be used in drawing the item.
   */
  DrawUtils = function() {
    this.init();
  };

  // Initialize drawing functions.
  DrawUtils.prototype.init = function() {
    if (typeof tagpro.renderer == "undefined") {
      console.log("Can't handle old canvas!");
      return;
    }

    this.self = tagpro.players[tagpro.playerId];

    // Store items to be drawn.
    this.vectors = {};
    this.backgrounds = {};
    this.points = {};

    // Add vectors container to player sprites object.
    this.self.sprites.vectors = new PIXI.Graphics();
    this.self.sprite.addChild(this.self.sprites.vectors);

    // Center vectors on player.
    this.self.sprites.vectors.position.x = 20;
    this.self.sprites.vectors.position.y = 20;
  }

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
    }
    this.vectors[name] = vector;
    this.self.sprites.vectors.addChild(vector.container);
  }

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
  }

  DrawUtils.prototype.hideVector = function(name) {
    this.vectors[name].container.visible = false;
  }

  DrawUtils.prototype.showVector = function(name) {
    this.vectors[name].container.visible = true;
  }

  /**
   * Add navmesh polys to background.
   */
  DrawUtils.prototype.addBackground = function(name, color) {
    var background = {
      color: color,
      container: new PIXI.Graphics()
    }
    // Add background as child of background layer.
    tagpro.renderer.layers.background.addChild(background.container);
    this.backgrounds[name] = background;
  }

  DrawUtils.prototype.updateBackground = function(name, polys) {
    this.backgrounds[name].polys = polys;
    this._drawBackground(this.backgrounds[name]);
  }

  /**
   * Add a point to be drawn on the screen.
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
    }
    tagpro.renderer.layers[layer].addChild(point.container);
    this.points[name] = point;
  }

  /**
   * Update the location of a point to be drawn on the screen.
   * @param {string} name - The name of the point to update.
   * @param {Point} point - The information about the point.
   */
  DrawUtils.prototype.updatePoint = function(name, point) {
    this.points[name].point = point;
    this._drawPoint(this.points[name]);
  }

  /**
   * Draw a vector, given attributes
   * @param {Vector} vector
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
  }

  /**
   * Redraw background in background container given a background
   * object.
   * @param {Background} background - The background to draw.
   */
  DrawUtils.prototype._drawBackground = function(background) {
    var bg = background;

    var polys = background.polys.map(function(poly) {
      return this._convertPolyToPixiPoly(poly);
    }, this);

    
    bg.container.clear();
    bg.container.lineStyle(1, bg.color, 1);
    polys.forEach(function(shape) {
      bg.container.drawShape(shape);
    });
  }

  /**
   * Draw a point, given a point to draw.
   * @param {PointInfo} point - The point to draw.
   */
  DrawUtils.prototype._drawPoint = function(point) {
    var p = point;

    p.container.clear();
    p.container.lineStyle(1, 0x000000, 1);
    p.container.beginFill(point.color, 1);
    p.container.drawCircle(p.point.x, p.point.y, 3);
    p.container.endFill();
  }

  DrawUtils.prototype._convertPolyToPixiPoly = function(poly) {
    var point_array = poly.points.reduce(function(values, point) {
      return values.concat(point.x + 20, point.y + 20);
    }, []);
    // Add original point back to point array to resolve Pixi.js rendering issue.
    point_array = point_array.concat(point_array[0], point_array[1]);
    return new PIXI.Polygon(point_array);
  }
  return DrawUtils;
});
