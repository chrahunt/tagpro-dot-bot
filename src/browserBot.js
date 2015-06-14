var Logger = require('bragi');
var Bot = require('./bot');
var GameState = require('./browserGameState');
var BotDraw = require('./botdraw');

/**
 * The Browser Agent is an implementation of the TagPro agent meant
 * to run in the browser.
 *
 * @module agent/browser
 */
function waitForDeps(fn) {
  if (typeof tagpro !== "undefined" &&
    tagpro.socket &&
    tagpro.renderer.renderer &&
    tagpro.players && tagpro.players[tagpro.playerId] &&
    tagpro.players[tagpro.playerId].sprites) {
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

  // Start.
  var bot = new Bot(state, Logger);
  var botdraw = new BotDraw(bot);

  // For debugging.
  global.myBot = bot;
});
