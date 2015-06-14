var DrawUtils = require('./drawutils');

// Takes bot and draws things about it.
var BotDraw = function(bot) {
  this.bot = bot;
  this.draw = new DrawUtils();
  this.draw.addVector("desired", 0x0000ff);
  this.draw.addBackground("mesh", 0x555555);
  this.draw.addPoint("goal", 0x00ff00, "foreground");
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
    this.draw.hidePoint("goal");
    this.cost_vector_container.visible = false;
    this.check();
    return;
  } else {
    requestAnimationFrame(this.update.bind(this));
  }
  if (this.bot.desired_vector) this.draw.updateVector("desired", this.bot.desired_vector.mul(10));
  var goal = this.bot.getState("target");
  if (goal) {
    this.draw.showPoint("goal");
    this.draw.updatePoint("goal", goal);
  } else {
    this.draw.hidePoint("goal");
  }
  this.cost_vector_container.clear();
  if (this.bot.steerer.costs) {
    this.cost_vector_container.lineStyle(2, 0xEE0000, 1);
    var costs = this.bot.steerer.costs;
    var angle = 2 * Math.PI / costs[0].length;
    var cost_vectors = [];
    for (var i = 0; i < costs[0].length; i++) {
      this.cost_vector_container.moveTo(0, 0);
      var cost = costs[0][i];
      var x = Math.cos(angle * i) * cost;
      var y = Math.sin(angle * i) * cost;
      this.cost_vector_container.lineTo(x, y);
    }
    this.cost_vector_container.lineStyle(2, 0x0000EE, 1);
    for (i = 0; i < costs[1].length; i++) {
      this.cost_vector_container.moveTo(0, 0);
      var cost = costs[1][i];
      var x = Math.cos(angle * i) * cost;
      var y = Math.sin(angle * i) * cost;
      this.cost_vector_container.lineTo(x, y);
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
