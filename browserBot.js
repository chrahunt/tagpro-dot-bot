requirejs.config({
  map: {
    '*': {
      'bragi': 'bragi-browser',
      // For build.
      //'navmesh': 'map/build/navmesh.min',
      // For development.
      'navmesh': 'map/navmesh/navmesh',
      'polypartition': 'map/navmesh/polypartition'
    }
  },
  config: {
    requirejsUrl: '../../require.js',
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
require(['bot', 'browserMover', 'browserGameState', 'bragi'],
function( Bot,   Mover,          GameState,          Logger) {
  // Initialize browser-specific state and action utilities.
  var state = new GameState(tagpro);
  var mover = new Mover();

  // Start.
  var bot = new Bot(state, mover, Logger);

  var baseUrl = "http://localhost:8000/";
  
  // Set up UI.
  $.get(baseUrl + "ui.html", function(data) {
    $('body').append(data);
  });
  window.myBot = bot;
});
