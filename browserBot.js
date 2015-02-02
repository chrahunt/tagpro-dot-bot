requirejs.config({
  shim: {
    'map/lib/clipper': {
      exports: 'ClipperLib'
    }
  },
  map: {
    '*': {
      'bragi': 'bragi-browser'
    }
  },
  config: {
    requirejsUrl: '../require.js',
    baseUrl: '.'
  },
  waitSeconds: 20
});

/**
 * The Browser Agent is an implementation of the TagPro agent meant
 * to run in the browser.
 *
 * @module agent/browser
 */
require(['bot', 'browserMover', 'browserGameState'],
function( Bot,   Mover,          GameState) {
  // Initialize browser-specific state and action utilities.
  var state = new GameState(tagpro);
  var mover = new Mover();

  // Start.
  var bot = new Bot(state, mover);

  var baseUrl = "http://localhost:8000/";
  
  // Set up UI.
  $.get(baseUrl + "ui.html", function(data) {
    $('body').append(data);
  });
  window.myBot = bot;
});
