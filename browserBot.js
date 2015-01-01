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

require(['bot', 'browserMover'],
function( Bot,   Mover) {
  // Start.
  var bot = new Bot();

  // Set bot to use browser-specific movement handled by this Mover.
  var browserMover = new Mover();
  bot.setMove(browserMover);
  
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
