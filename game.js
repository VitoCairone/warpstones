console.log("start game.js read");

var Game = new function () {

  var game = {
    winningTeam: undefined,
    runQ: [],
    previousPhaseTime: 0,
  };

  var Phases = {};

  // stage 1: flop

  Phases.revealPhaseStage1 = function () {
    console.log("painter.revealPersonalOrbs([1]);");
    console.log("painter.revealSharedOrbs([0, 1]);");
  };

  // bet, match, and collect phases are repeated for
  // stages 1 - 3

  Phases.betPhase = function () {
    game.inputPhase = 'bet';
    console.log("painter.showBetButtons();");
    for (var i = 1; i <= 8; i++) {
      if (isDeciding(i)) {
        console.log("painter.setDecidingPose(i);");
      }
    }
  };

  Phases.matchPhase = function () {
    game.inputPhase = 'match';
    console.log("painter.showMatchButtons();");
    
  };

  Phases.collectPhase = function () {
    game.inputPhase = 'ignore';
    console.log("painter.greyOutMatchButtons();");
    console.log("painter.collectBetMana();");
  };

  // stage 2: turn

  Phases.revealPhaseStage2 = function () {
    console.log("painter.revealSharedOrbs([2, 3]);");
  };

  // stage 3: river

  Phases.revealPhaseStage3 = function () {
    console.log("painter.revealSharedOrbs([4, 5]);");
  };

  // stage 4: showdown

  Phases.revealPhaseStage4 = function () {
    console.log("painter.revealPersonalOrbs([2, 3, 4, 5, 6, 7, 8]);");
  };

  Phases.winnerPhase = function () {
    console.log("painter.showWinningGestalts();");
  };

  // stage 5: choice

  Phases.choosePhase = function () {
    
  };

  // stage 6: casting

  Phases.castPhase = function () {
    
  };

  function thenRunForTime(callback, time) {

  }

  function thenRun() {

  }

  function runQueue() {
    // runner assumes game.runQ is already populated
    // if not, or if depleted, it will run no-ops continually
    // on a short timer until something is queued
    if (game.runQ.length == 0) {
      window.setTimeout(runQueue, 30)
    } else {
      var phaseTime = game.runQ[0][1];
      window.setTimeout(function () {
        game.runQ[0][0]();
        game.runQ.unshift();
        runQueue();
      }, game.previousPhaseTime);
      game.previousPhaseTime = phaseTime;
    }
  }

  // function repeatWhileNull() {

  // }

  function gameLoop() {

    var p = Phases;

    thenRunForTime(p.test, 500);
    thenRunForTime(p.test2, 1000);
    thenRun(p.test3);
    thenRunForTime(p.test4, 800);
    thenRun(p.test4);

    startRunner();

    // var winner = repeatWhileNull(function () {

    //   // stage 1: flop
    //   thenRunForTime(p.revealPhaseStage1, 800);
    //   thenRunForTime(p.betPhase, 10000);
    //   thenRunForTime(p.matchPhase, 3000);
    //   thenRunForTime(p.collectPhase, 800);

    //   // stage 2: turn
    //   thenRunForTime(p.revealPhaseStage2, 800);
    //   thenRunForTime(p.betPhase, 10000;
    //   thenRunForTime(p.matchPhase, 3000);
    //   thenRunForTime(p.collectPhase, 800);

    //   // stage 3: river
    //   thenRunForTime(p.revealPhaseStage3, 800);
    //   thenRunForTime(p.betPhase, 10000);
    //   thenRunForTime(p.matchPhase, 3000);
    //   thenRunForTime(p.collectPhase, 800);

    //   // stage 4: showdown
    //   thenRunForTime(p.revealPhaseStage4, 800);
    //   thenRunForTime(p.winnerPhase, 800);

    //   // stage 5: choice 
    //   thenRunForTime(p.choosePhase, 5000);

    //   // stage 6: casting
    //   thenRun(p.castPhase);

    //   return getWinningTeam();

    // });

    // // stage 7: victory
    // thenRunForTime(p.victoryPhase, 800);
    // thenRun(p.replayPhase);
  }

  function init() {
    gameLoop();
  }
}

Game.init();

console.log("finished game.js read");