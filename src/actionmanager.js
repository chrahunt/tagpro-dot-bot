/**
 * Initialize the action manager.
 */
var ActionManager = function() {
  this.actions = {};
};
module.exports = ActionManager;

/**
 * Clear the interval identified by `name`.
 * @param {string} name - The interval to clear.
 */
ActionManager.prototype.remove = function(name) {
  if (this._exists(name)) {
    clearInterval(this.actions[name]);
    delete this.actions[name];
  }
};

/**
 * Remove all interval-executed actions.
 */
ActionManager.prototype.removeAll = function() {
  for (var name in this.actions) {
    clearInterval(this.actions[name]);
    delete this.actions[name];
  }
};

/**
 * Set the given function as an function executed on an interval
 * given by `time`. Make sure to bind the function appropriately so it
 * executed in the correct context. If an interval function with the
 * given name is already set, the function does nothing.
 * @param {string} name
 * @param {Function} fn
 * @param {integer} time - The time in ms.
 */
ActionManager.prototype.add = function(name, fn, time) {
  if (!this._exists(name)) {
    this.actions[name] = setInterval(fn, time);
  }
};

/**
 * Check whether the interval with the given name is active.
 * @private
 * @param {string} name
 * @return {boolean} - Whether the interval is active.
 */
ActionManager.prototype._exists = function(name) {
  return this.actions.hasOwnProperty(name);
};
