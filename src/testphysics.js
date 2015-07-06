var p = require('./physics');
var damping = 0.5,
    dt = (1/60),
    acc = 0.025,
    df = 1 - damping * dt;
var eps = 0.01;

function epsEql(a, b) {
  return Math.abs(a - b) < eps;
}

function assertEql(a, b) {
  if (!epsEql(a, b)) {
    console.warn("Expected " + a.toFixed(3) + " to equal " + b.toFixed(3) + ".");
  }
}

assertEql(p.getSteps(2.5, -acc, df, 0), 72.888);
assertEql(p.getPosition(2.5, -acc, df, 10), 37.587);
