define(['map/polypartition'],
function(pp) {
  // Drawing functions.
  // Remap a coordinate relative to the current player position, so it looks static relative
  // to the background tiles.
  remap = function(p, context) {
    return {
      x: p.x * (1 / tagpro.zoom) - (this.self.x - context.canvas.width / 2),
      y: p.y * (1 / tagpro.zoom) - (this.self.y - context.canvas.height / 2)
    }
  }
  
  // Given a polygon, context, and color, draw the outline of the polygon.
  // color is optional and if not provided, will be black.
  drawPoly = function(poly, context, color) {
    if (typeof color == 'undefined') color = 'black';
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

  // Draw a point on the context with a given color. If no color
  // is provided then black is used.
  drawPoint = function(point, context, color) {
    if (color == 'undefined') color = 'black';
    point = remap(point, context);
    var radius = 5;
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = color;
    context.stroke();
  }

  // Draw an edge on the context with a given color. If no color is
  // provided then black is used.
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

  // Takes in an item, item can be an array, in which case all of the
  // contained elements will be drawn.
  // Types of contained elements can be Poly, Edge, or Point.
  draw = function(item, color) {
    if (item instanceof Array) {
      item.forEach(function(i) {
        draw(i);
      });
    } else if (item instanceof Poly) {
      drawPoly
    }
  }

  /*
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
    // Set current player information so drawings can be done relative
    // to player position.
    this.self = tagpro.players[tagpro.playerId];

    // Store original draw function.
    this.ui_draw = tagpro.ui.draw;

    // Store items to be drawn.
    this.drawings = new Set();

    // Holds a set of strings defining the properties under which 
    window.BotDrawings = this.drawings;

    // Handle Pixi possibility.
    if (typeof tagpro.renderer !== 'undefined') {
      console.log("Pixi located.");
      this.pixi();
      return;
    } else {
      // Actually set everything up.
      this._setDraw();
    }
  }

  // Register another window property to look for.
  DrawUtils.prototype.register = function(name) {
    this.drawings.add(name);
  }

  // Remove an item from being drawn.
  DrawUtils.prototype.unregister = function(name) {
    this.drawings.delete(name);
  }

  DrawUtils.prototype._setDraw = function() {
    drawItem = function(item, context, color) {
      if (item instanceof Poly) {
        drawPoly(item, context, color);
      } else if (item instanceof Point) {
        drawPoint(item, context, color);
      } else if (item instanceof Edge) {
        drawLine(item, context, color);
      }
    }

    var ui_draw = this.ui_draw;
    
    tagpro.ui.draw = function(context) {
      var color, item;
      context.save();
      context.globalAlpha = 1;

      if (window.hasOwnProperty('BotDrawings')) {
        window.BotDrawings.forEach(function(drawing) {
          if (window.hasOwnProperty(drawing)) {
            drawing = window[drawing];
            if (typeof drawing == 'undefined') return;
            if (drawing instanceof Array) {
              drawing.forEach(function(d) {
                color = d.color;
                item = d.item;
                drawItem(item, context, color);
              });
            } else {
              color = drawing.color;
              item = drawing.item;
              drawItem(item, context, color);
            }
          }
        });
      }
      
      // Restore tagpro.ui.draw and apply our changes.
      return ui_draw.apply(this, arguments);
    };
  }

  // Handle PIXI.js renderer
  DrawUtils.prototype.pixi = function() {
    // navmesh rendering.
    // Create initial graphics from navmesh, create texture from it, set as child of tagpro background renderer.
    var mesh_polys = window.BotMeshShapes;
    if (typeof mesh_polys == 'undefined') {
      // Try again later.
      setTimeout(this.pixi.bind(this), 50);
      return;
    }
    var mesh_shapes = mesh_polys.map(function(poly_info) {
      return this._convertPolyToPixiPoly(poly_info.item);
    }, this);

    var mesh = new PIXI.Graphics();
    mesh.lineStyle(1, 0x000000, 1);
    console.log("Test");
    mesh_shapes.forEach(function(shape) {
      mesh.drawShape(shape);
    });
    console.log(mesh);
    console.log("Test");
    tagpro.renderer.gameContainer.addChild(mesh);
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
