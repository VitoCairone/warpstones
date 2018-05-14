// var Phases = {};

// // stage 1: flop

// Phases.revealPhaseStage1 = function () {
// 	painter.revealPersonalOrbs([1]);
// 	painter.revealSharedOrbs([0, 1]);
// };

// // bet, match, and collect phases are repeated for
// // stages 1 - 3

// Phases.betPhase = function () {
// 	game.inputPhase = 'bet';
// 	painter.showBetButtons();
// 	for (var i = 1; i <= 8; i++) {
// 		if (isDeciding(i)) {
// 			painter.setDecidingPose(i);
// 		}
// 	}
// };

// Phases.matchPhase = function () {
// 	game.inputPhase = 'match';
// 	painter.showMatchButtons();
	
// };

// Phases.collectPhase = function () {
// 	game.inputPhase = 'ignore';
// 	painter.greyOutMatchButtons();
// 	painter.collectBetMana();
// };

// // stage 2: turn

// Phases.revealPhaseStage2 = function () {
// 	painter.revealSharedOrbs([2, 3]);
// };

// // stage 3: river

// Phases.revealPhaseStage3 = function () {
// 	painter.revealSharedOrbs([4, 5]);
// };

// // stage 4: showdown

// Phases.revealPhaseStage4 = function () {
// 	painter.revealPersonalOrbs([2, 3, 4, 5, 6, 7, 8]);
// };

// Phases.winnerPhase = function () {
// 	painter.showWinningGestalts();
// };

// // stage 5: choice

// Phases.choosePhase = function () {
	
// };

// // stage 6: casting

// Phases.castPhase = function () {
	
// };

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