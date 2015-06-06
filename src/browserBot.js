var Logger = require('bragi');
var Bot = require('./bot');
var Mover = require('./browserMover');
var GameState = require('./browserGameState');

/**
 * The Browser Agent is an implementation of the TagPro agent meant
 * to run in the browser.
 *
 * @module agent/browser
 */
function waitForTagproPlayer(fn) {
  if (typeof tagpro !== "undefined" && tagpro.players && tagpro.playerId) {
    fn();
  } else {
    setTimeout(function() {
      waitForTagproPlayer(fn);
    });
  }
}

waitForTagproPlayer(function() {
  // Initialize browser-specific state and action utilities.
  var state = new GameState(tagpro);
  var mover = new Mover();

  // Start.
  var bot = new Bot(state, mover, Logger);

  var baseUrl = "http://localhost:8000/src/";

  // Set up UI.
  $.get(baseUrl + "ui.html", function(data) {
    $('body').append(data);
  });

  // For debugging.
  global.myBot = bot;
});
