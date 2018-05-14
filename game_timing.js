console.log("start game.js read");

var Game = new function () {

  var game = {
    runQ: [],
    previousPhaseTime: 0,
  };

  var Phases = {};

  Phases.test = function () { console.log("test"); }
  Phases.test2 = function () { console.log("test2"); }
  Phases.test3 = function () { console.log("test3"); }
  Phases.test4 = function () { console.log("test4"); }

  function thenRunForTime(callback, time) {
    game.runQ.push([callback, time]);
  }

  function thenRun(callback) {
    game.runQ.push([callback, 0])
  }

  function thenRunForever(callback) {
    game.runQ.push([callback, Infinity])
  }

  function advanceQueue() {
    game.previousPhaseTime = 0;
  }

  function runQueue() {
    // runner assumes game.runQ is already populated
    // if not, or if depleted, it will run no-ops continually
    // on a short timer until something is queued
    if (game.runQ.length == 0 || game.previousPhaseTime == Infinity) {
      window.setTimeout(runQueue, 30);
    } else {
      var phaseTime = game.runQ[0][1];

      window.setTimeout(function () {
        game.runQ[0][0]();
        game.runQ.shift();
        runQueue();
      }, game.previousPhaseTime);

      game.previousPhaseTime = phaseTime;
    }
  }

  function gameLoop() {

    var p = Phases;

    thenRunForTime(p.test, 500);
    thenRunForTime(p.test2, 1000);
    thenRunForever(p.test3);

    // must call advanceQueue to run on, by pressing the Bet button

    thenRunForTime(p.test4, 800);
    thenRun(p.test4);
    thenRunForTime(p.test, 100);
    thenRunForTime(p.test, 100);
    thenRunForTime(p.test, 100);

    runQueue();

  }

  this.init = function () {
    gameLoop();
  };

  this.pressBet = function () {
    advanceQueue();
  }
}

Game.init();

console.log("finished game.js read");