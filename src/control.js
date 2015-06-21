// control bot with clicks
var geo = require('./geometry');
var Point = geo.Point;

/**
 * Manual controller for bot, allowing various actions.
 * uses tagpro
 * @param {Bot} bot - The bot to control.
 */
var Control = function(bot) {
  this.bot = bot;
  this.init();
};
module.exports = Control;

/**
 * Set control listeners.
 */
Control.prototype.init = function() {
  var bot = this.bot;
  var viewport = document.getElementById("viewport");
  // Click to set destination.
  [document.getElementById("viewport"), document.getElementById("chatHistory")].forEach(function(element) {
    element.addEventListener("mousedown", function(event) {
      // Same for both x and y.
      var scale = tagpro.renderer.gameContainer.scale.x;
      // See map offset in canvas.
      var offset = new Point(tagpro.renderer.gameContainer.x, tagpro.renderer.gameContainer.y).div(scale);
      var elt_offset = $(viewport).offset();
      // Get click location on canvas.
      var click = new Point(event.x - elt_offset.left,
        event.y - elt_offset.top).div(scale);
      bot.setState("manual_target", click.sub(offset));
    }, false);
  });
};
