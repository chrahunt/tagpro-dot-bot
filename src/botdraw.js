var DrawUtils = require('./drawutils');

// Takes bot and draws things about it.
var BotDraw = function(bot) {
  this.bot = bot;
  this.draw = new DrawUtils();
  this.draw.addVector("desired", 0x0000ff);
  this.draw.addBackground("mesh", 0x555555);
  this.draw.addPoint("next_point", 0x00ff00, "foreground");
  this.draw.addPoint("manual_target", 0xffff00, "foreground");
  this.draw.addPoint("hit", 0xff0000, "foreground");
  this.cost_vector_container = new PIXI.Graphics();
  this.cost_vector_container.x = 20;
  this.cost_vector_container.y = 20;
  this.draw.addSpriteChild(this.cost_vector_container);
  this.meshInit();
  this.check();
};
module.exports = BotDraw;

BotDraw.prototype.meshInit = function() {
  if (!this.bot.navmesh && !this.bot.navmesh.polys) {
    setTimeout(this.meshInit.bind(this), 50);
    return;
  }
  this.bot.navmesh.onUpdate(function (polys) {
    this.draw.updateBackground("mesh", polys);
  }.bind(this));
  this.draw.updateBackground("mesh", this.bot.navmesh.polys);
};

// Interval to check/update vectors.
BotDraw.prototype.update = function() {
  if (this.bot.stopped) {
    this.stopped = true;
    this.draw.hideVector("desired");
    this.draw.hidePoint("next_point");
    this.cost_vector_container.visible = false;
    this.check();
    return;
  } else {
    requestAnimationFrame(this.update.bind(this));
  }
  // Desired vector.
  if (this.bot.desired_vector) this.draw.updateVector("desired", this.bot.desired_vector.mul(10));
  // Manual goal point.
  if (this.bot.getState("control") == "manual") {
    var manual_target = this.bot.getState("manual_target");
    if (manual_target) {
      this.draw.showPoint("manual_target");
      this.draw.updatePoint("manual_target", manual_target);
    } else {
      this.draw.hidePoint("manual_target");
    }
  }
  // Next point on path.
  var goal = this.bot.getState("target");
  if (goal) {
    this.draw.showPoint("next_point");
    this.draw.updatePoint("next_point", goal.loc);
  } else {
    this.draw.hidePoint("next_point");
  }
  // Cost vectors for steering.
  this.cost_vector_container.clear();
  var self = this;
  function drawCosts(costs, color) {
    self.cost_vector_container.lineStyle(2, color, 1);
    var angle = 2 * Math.PI / costs.length;
    for (var i = 0; i < costs.length; i++) {
      self.cost_vector_container.moveTo(0, 0);
      var cost = costs[i];
      var x = Math.cos(angle * i) * cost;
      var y = Math.sin(angle * i) * cost;
      self.cost_vector_container.lineTo(x, y);
    }
  }
  if (this.bot.steerer.costs) {
    var colors = {
      static_avoid: 0xEE0000,
      seek: 0x0000EE,
      dynamic_avoid: 0xEEEE00
    };
    var costs = this.bot.steerer.costs;
    if (costs.length == 2) {
      // No dynamic obstacle avoidance.
      drawCosts(costs[0], colors.static_avoid);
      drawCosts(costs[1], colors.seek);
    } else {
      // Includes dynamic obstacle avoidance.
      drawCosts(costs[0], colors.static_avoid);
      drawCosts(costs[1], colors.dynamic_avoid);
      drawCosts(costs[2], colors.seek);
    }
  }
};

// Check if the bot has started and start the animation if so.
BotDraw.prototype.check = function() {
  if (!this.bot.stopped) {
    this.cost_vector_container.visible = true;
    this.draw.showVector("desired");
    requestAnimationFrame(this.update.bind(this));
  } else {
    setTimeout(this.check.bind(this), 200);
  }
};
