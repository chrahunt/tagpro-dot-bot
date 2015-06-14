// Initialize the user interface
// Set up the UI for toggle-able parameter values
// Add normal controls.

/**
 * Initialize UI for controlling bot.
 * @param {Bot} bot - The bot.
 */
var UI = function(bot) {
  this.bot = bot;
  var baseUrl = "http://localhost:8080/src/";
  // Set up UI.
  $.get(baseUrl + "ui.html", function(data) {
    $('body').append(data);
    this.init();
  }.bind(this));
};

module.exports = UI;

/**
 * Initializes the UI after loading the html.
 */
UI.prototype.init = function() {
  var self = this;
  // Button listeners.
  $('#bot-power').click(function (e) {
    if (self.bot.stopped) {
      self.bot.start();
      $(this).text("Stop Bot");
    } else {
      self.bot.stop();
      $(this).text("Start Bot");
    }
  });

  function parseParameters() {
    // Helper function.
    function parse(info, value) {
      if (typeof value == "object") {
        info.children = [];
        for (var name in value) {
          info.children.push(parse({
            name: name,
            object_parent: value,
            node_parent: info
          }, value[name]));
        }
      } else {
        info.value = value;
      }
      return info;
    }
    var parameters = self.bot.parameters;
    var root = parse({
      name: "bot-parameters",
      object_parent: null,
      node_parent: null
    }, parameters);

    function createSection(node, context) {
      var elt;
      if (node.children) {
        elt = $("<div/>", {
          class: 'param-section'
        }).appendTo(context);
        $("<div/>", {
          class: 'section-header'
        })
          .text(node.name)
          .appendTo(elt);
        // Section.
        // Get child elements.
        node.children.forEach(function (child) {
          return createSection(child, elt);
        });
      } else if (node.hasOwnProperty("value") && typeof node.value == "number") {
        // Control field.
        elt = $("<div/>", {
          class: 'param-control'
        }).appendTo(context);
        var label = $("<label/>").text(node.name).appendTo(elt);
        $("<input/>", { type: "number" })
          .val(node.value)
          .on("keyup input", function () {
            var value = $(this).val();
            node.object_parent[node.name] = value;
          })
          .appendTo(label);
      }
    }
    root.children.forEach(function (child) {
      createSection(child, $("#bot-parameters > .bot-ui-content"));
    });
  }

  function parseInfo() {
    var container = $("#bot-values > .bot-ui-content");
    var info = self.bot.info;
    for (var prop in info) {
      $("<div/>", { class: 'bot-value' })
        .text(prop)
        .append($("<span/>", {
          id: 'bot-value-' + prop
        }).text(info[prop]))
        .appendTo(container);
    }
    setInterval(function () {
      for (var prop in info) {
        $("#bot-value-" + prop).text(info[prop]);
      }
    }, 100);
  }

  // Parse bot parameters and make controls.
  setTimeout(function botInitialize() {
    if (!this.bot.initialized) {
      setTimeout(botInitialize, 20);
      return;
    }
    parseParameters();
    parseInfo();
  }.bind(this), 20);
};
