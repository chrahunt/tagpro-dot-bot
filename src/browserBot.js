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
function waitForDeps(fn) {
  if (typeof tagpro !== "undefined" && tagpro.socket) {
    fn();
  } else {
    setTimeout(function () {
      waitForDeps(fn);
    }, 50);
  }
}

var baseUrl = "http://localhost:8000/src/";
// Set up UI.
$.get(baseUrl + "ui.html", function(data) {
  $('body').append(data);
});

waitForDeps(function () {
  // Initialize browser-specific state and action utilities.
  var state = new GameState(tagpro);
  var mover = new Mover(tagpro.socket);

  // Start.
  var bot = new Bot(state, mover, Logger);

  // For debugging.
  global.myBot = bot;
});
