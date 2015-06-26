/**
 * Get predicted velocity along one axis.
 * @param {number} v0 - Initial velocity
 * @param {number} a - Acceleration
 * @param {number} d - Dampening factor
 * @param {integer} n - The number of steps ahead.
 * @return {number} - The predicted velocity
 */
function getVelocity(v0, a, d, n) {
  /*
   * Expansion of \sum_{i=0}^{n-1} ad^{n-i}
   * + including initial velocity term.
   */
  return v0 * Math.pow(d, n) + // Initial velocity term
    a * ((d - Math.pow(d, n + 1)) / (1 - d));
}

// TODO: Fix.
/**
 * Get predicted position along one axis.
 * @param {number} v0 - Initial velocity
 * @param {number} a - Acceleration
 * @param {number} d - Dampening factor, 0 < d <= 1
 * @param {integer} n - The number of steps ahead.
 * @return {number} - The predicted position
 */
function getPosition(v0, a, d, n) {
  // Expansion of \sum_{i=1}^n getVelocity
  //return n * v0 * Math.pow(d, n) +
  //  ((a * n * d) / (1 - d)) * (1 - Math.pow(d, n));
  return - ((a * n * Math.pow(d, n + 1)) / ( 1 - d)) + ((a * n * d) / (1 - d)) + n * v0 * Math.pow(d, n);
}

/**
 * Given an initial velocity, target velocity, and acceleration, gives
 * the number of steps necessary to reach that target velocity.
 * @param {number} v0 - Initial velocity. It must be possible to reach
 *   target velocity from initial velocity with given acceleration.
 * @param {number} a - Acceleration, -1 < a < 1, a != 0
 * @param {number} d - Dampening factor, 0 < d <= 1
 * @param {number} v - The target velocity
 * @return {integer?} - The number of steps required to reach the
 *   target velocity, or null if there was a constraint violation.
 */
function getSteps(v0, a, d, v) {
  if (a === 0) {
    if (v0 === v) {
      return 0;
    } else {
      return null;
    }
  }
  if (v0 > v && a >= 0) return null;
  if (v0 < v && a <= 0) return null;
  // Inverse of getVelocity.
  return (Math.log(v * (1 - d) - a * d) - Math.log(v0 * ( 1 - d) - a * d)) /
    Math.log(d);
}

module.exports = {
  getPosition: getPosition,
  getVelocity: getVelocity,
  getSteps: getSteps
};
