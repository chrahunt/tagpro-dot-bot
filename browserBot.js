requirejs.config({
  shim: {
    'map/clipper': {
      exports: 'ClipperLib'
    }
  },
  map: {
    '*': {
      'bragi': 'bragi-browser'
    }
  },
  waitSeconds: 20
});

/**
 * The Browser Agent is an implementation of the TagPro agent meant
 * to run in the browser.
 *
 * @module agent/browser
 */
require(['bot', 'browserMover'],
function( Bot,   Mover) {
  // Overriding this function to grab the parent caller ("this").
  Box2D.Dynamics.b2Body.prototype.GetPosition = function() {
    var player = tagpro.players[this.player.id];
    
    player.body = player.body || this; // Assign "this" to "player.body".
    
    return this.m_xf.position;         // Original instruction of this function.
  };

  // Start.
  var bot = new Bot();

  // Set bot to use browser-specific movement handled by this Mover.
  var browserMover = new Mover();
  bot.setMove(browserMover);

  var baseUrl = "http://localhost:8000/";
  
  // Set up UI.
  $.get(baseUrl + "ui.html", function(data) {
    $('body').append(data);
  });
  window.myBot = bot;
});
