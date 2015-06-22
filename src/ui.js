var geo = require('./geometry');
var Point = geo.Point;
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
    this.initCameraMovement();
  }.bind(this));
};

module.exports = UI;

/**
 * Initializes the UI after loading the html.
 */
UI.prototype.init = function() {
  var self = this;
  // Reorganize page.
  var newDiv = $("<div/>", {
    id: "main-container"
  });
  var contents = $("body").children().not("#bot-ui");
  newDiv.appendTo("body");
  contents.detach().appendTo("#main-container");
  var contentDiv = $("<div/>", {
    id: "contents"
  });
  contentDiv.appendTo("body");
  $("#bot-ui").detach().appendTo(contentDiv);
  $("#main-container").detach().appendTo(contentDiv);
  // Change resize behavior.
  $(window).off("resize", tagpro.renderer.resizeAndCenterView);
  $(window).resize(this.resizeAndCenterView);
  
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
  $("#bot-pause").click(function () {
    if (!self.bot.stopped) {
      self.bot.pause();
    }
  });
  $("#do-boost").click(function (e) {
    // Manual boost info for mid-left boost on boombox.
    var info = {
      array_loc: {x: 17, y: 21},
      keys: {right: true},
      v: new Point(1.2928, -0.3072),
      incoming: new Point(667.5558, 862.8337)
    };
    self.bot.setState("boost_test", info);
  });
  $('#stage-toggle').click(function(e) {
    tagpro.renderer.stage.visible = !tagpro.renderer.stage.visible;
    $(this).text("Turn " + (tagpro.renderer.stage.visible ? "off" : "on") + " stage");
  });
  $('#bot-offense').click(function(e) {
    self.bot.setState("position", "offense");
  });
  $('#bot-defense').click(function(e) {
    self.bot.setState("position", "defense");
  });
  $('input:radio[name=bot-control]').click(function() {
    self.bot.setState("control", $(this).val());
  });

  // Overwrite exit link.
  var link = $("#exit").attr("href");
  $("#exit").remove();
  $("#bot-exit").attr("href", link);

  // Initialize control type input state.
  var controlType = this.bot.getState("control");
  $('input:radio[name=bot-control][value='+controlType+']').prop('checked', true);

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
    setTimeout(function () {
      this.resizeAndCenterView();
    }.bind(this), 200);
  }.bind(this), 20);
};

UI.prototype.initCameraMovement = function() {
  var self = this;
  this.camReleased = false;
  var initialSpectator = tagpro.spectator;
  var moving = {
    "x": 0,
    "y": 0
  };
  var direction = {
    "up": -1,
    "down": 1,
    "left": -1,
    "right": 1
  };
  var axis = {
    "up": "y",
    "down": "y",
    "left": "x",
    "right": "x"
  };
  var moveAmount = 20;
  $('#camera-toggle').click(function() {
    if (self.camReleased) {
      self.camReleased = false;
      // Make camera normal.
      $('#camera-toggle').text("Release Camera");
      tagpro.viewport.followPlayer = true;
      tagpro.spectator = initialSpectator;
      for (var dir in moving) {
        moving[dir] = 0;
      }
    } else {
      self.camReleased = true;
      // Make camera movable.
      $('#camera-toggle').text("Follow Player");
      tagpro.viewport.followPlayer = false;
      tagpro.spectator = true;
    }
  });
  var keys = {
    73: "up", // i
    74: "left", // j
    75: "down", // k
    76: "right", // l
    85: "in", // u
    79: "out" // o
  };
  $(document).keydown(function (key) {
    var code = key.which;
    if (keys.hasOwnProperty(code) && self.camReleased) {
      // Zooming.
      if (keys[code] == "in") {
        tagpro.zooming = 0.025;
      } else if (keys[code] == "out") {
        tagpro.zooming = -0.025;
      }/* else {
        var dir = keys[code];
        moving[dir] = direction[dir] * moveAmount;
      }*/
    }
    shift = key.shiftKey;
    ctrl = key.ctrlKey;
    if(key.which>=37 && key.which<=40) {
      adds[key.which-37] = 1;
      tagpro.viewport.followPlayer = false;
    }
  });
  $(document).keyup(function (key) {
    var code = key.which;
    if (keys.hasOwnProperty(code) && self.camReleased) {
      if (keys[code] == "in" || keys[code] == "out") {
        tagpro.zooming = 0;
      }
    }
  });
};

UI.prototype.resizeAndCenterView = function() {
  // Resize.
  var tr = tagpro.renderer,
      main = $("#main-container"),
      sidebar = $("#bot-ui"),
      container = $("#contents"),
      width = container.outerWidth() - sidebar.outerWidth(),
      height = container.outerHeight(),
      adjustedWidth,
      adjustedHeight;
  main.css({
    width: width + 'px',
    height: height
  });
  if (width > tr.canvas_width) {
    width = tr.canvas_width;
  }
  if (height > tr.canvas_height) {
    height = tr.canvas_height;
  }

  adjustedHeight = Math.round((width * tr.canvas_height) / tr.canvas_width);
  adjustedWidth = 0;

  if (adjustedHeight > height) {
    adjustedWidth = Math.round(((height * tr.canvas_width) / tr.canvas_height));
    adjustedHeight = height;
  } else {
    adjustedWidth = width;
  }

  tr.renderer.resize(adjustedWidth, adjustedHeight);

  // Center.
  var viewport = $('#viewport'),
      viewportDiv = $('#viewportDiv'),
      options = $("#options");

  viewport.css({
    position: 'absolute',
    left: (width - viewport.outerWidth()) / 2,
    top: (height - viewport.outerHeight()) / 2
  });
  viewportDiv.css({
    position: 'absolute',
    width: viewport.outerWidth(),
    height: viewport.outerHeight(),
    left: (width - viewport.outerWidth()) / 2,
    top: (height - viewport.outerHeight()) / 2
  });
  options.css({
    position: 'absolute',
    left: (width - options.width()) / 2,
    top: (height - options.height()) / 2
  });

  tagpro.ui.resize(viewport.width(), viewport.height());
  tr.vpWidth = viewport.width();
  tr.vpHeight = viewport.height();
  tagpro.chat.resize();
};
