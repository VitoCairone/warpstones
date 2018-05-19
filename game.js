console.log("start game.js read");

var Game = new function () {

  var game = {
    runQ: [],
    players: [{},{},{},{},{},{},{},{},{}],
    phase: null,
    stage: null,
    elements: ["earth", "fire", "air", "water", "ice", "dark", "light"],
    cards: [],
    warp: {
      mana: 0,
      wager: 0,
      priorRoundMana: 0
    }
  };

  var Phases = {};

  var Players = {};

  Phases.test = function () { console.log("test"); }
  Phases.test2 = function () { console.log("test2"); }
  Phases.test3 = function () { console.log("test3"); }
  Phases.test4 = function () { console.log("test4"); }

  function bet(pNum) {
    if (game.phase != 'bet') return;

    var player = game.players[pNum];
    if (player.folded || player.mana <= 0 || player.vote == 'raise') return;

    player.vote = 'raise';

    var raiseSize = getRaiseSize(pNum);
    var raisedWager = game.previousVoteWager + raiseSize;
    if (raisedWager > game.warp.wager) {
      game.warp.wager = raisedWager;
    }

    var wager = game.warp.wager - player.wager;
    if (wager > player.mana) wager = player.mana;

    player.mana -= wager;
    game.warp.mana += wager;
    player.wager += wager;
    player.handWager += wager;

    console.log(
      "player " + pNum + " bets +" + wager + " (" + player.wager
      + ") with " +  player.mana + " remaining." +
      (player.mana == 0 ? " (all-in)" : ""))
  }

  function allDecided () {
    for (var i = 1; i <= 8; i++) 
      if (isDeciding(i)) return false;
    return true;
  }

  function isDeciding(pNum) {
    return game.players[pNum].vote == 'undecided';
  }

  function calcGestaltData(gestalt, findFormula) {
    if (typeof findFormula === 'undefined') {
      findFormula = true;
    }

    var score = 0;
    var formula = "";
    var hashEls = {};

    for (var i = 0; i < gestalt.length; i++) {
      var el = gestalt[i];
      if (el in hashEls) {
        hashEls[el] += 1;
      } else {
        hashEls[el] = 1;
      }
    }

    var presentEls = Object.keys(hashEls);

    presentEls.sort(function (a, b) {
      return hashEls[b] - hashEls[a];
    })

    if (findFormula) {
      var innerForm = [];
      for (var i = 0; i < presentEls.length; i++) {
        var el = presentEls[i];
        if (hashEls[el] < 2) {
          break;
        }
        innerForm.push(el.charAt(0) + hashEls[el]);
      }
      if (innerForm.length == 0) {
        formula = 'x';
      } else {
        formula = innerForm.join(' ');
      }
    }

    countsArr = [0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < presentEls.length; i++) {
      var el = presentEls[i];
      countsArr[hashEls[el]] += 1;
    }

    var pow10 = 1;
    for (var i = 1; i <= 7; i++) {
      var multiple = countsArr[i];
      score += multiple * pow10;
      pow10 *= 10;
    }

    if ("spirit" in hashEls) {
      score += 1;
      formula = formula + " +S"
    }

    if ("void" in hashEls && hashEls["void"] == 2) {
      formula = "0 " + formula;
      score += 1000000000;
    }

    return {
      formula: formula,
      score: score
    };
  }

  function getCommonCards() {
    return game.cards.slice(0, 5);
  }

  function getPlayerCards(pNum) {
    var idx = pNum - 1;
    return [game.cards[idx * 2 + 5], game.cards[idx * 2 + 6]];
  }

  function setGestaltRanks() {
    for (var i = 1; i <= 8; i++) {
      // skip folded players because they are never eligible,
      // even for side pots
      if (game.players[i].folded) continue;

      var player = game.players[i];
      var gestalt = getCommonCards().concat(getPlayerCards(i));
      var gestalted = calcGestaltData(gestalt);
      var score = gestalted.score;

      player.gestalt = gestalt;
      player.gestaltRank = gestalted.score;
      player.gestaltFormula = gestalted.formula;

      if (true) { // printing all gestalts
        var shortHand = [];
        for (var j = 0; j < gestalt.length; j++) {
          shortHand.push(gestalt[j].charAt(0).toUpperCase())
        }
        console.log("Player " + i + " has " + shortHand.join('') + " worth " + score);
      }
    }
  }

  function findWinners(eligible) {
    if (eligible.length == 0) {
      alert("ERROR: no eligible players in findWinners");
      return [];
    }

    var pNum = null;
    var score = 0;
    var topScore = 0;
    var topScoreNums = [];

    for (var i = 0; i < eligible.length; i++) {
      pNum = eligible[i];

      if (game.players[pNum].folded) {
        continue;
      }

      score = game.players[pNum].gestaltRank;
      if (score > topScore) {
        topScore = score;
        topScoreNums = [pNum];
      } else if (score == topScore) {
        topScoreNums.push(pNum);
      }
    }

    if (topScore === 0) {
      alert("ERROR: all eligible players have folded in findWinners");
    }

    return topScoreNums;
  }

  function sendManaToWinners() {
    var winnings = [null, 0, 0, 0, 0, 0, 0, 0, 0];
    var pNum = null;
    var amount = 0;

    setGestaltRanks();

    var winners = findWinners([1,2,3,4,5,6,7,8]);

    amount = Math.floor(game.warp.mana / winners.length);

    for (var i = 0; i < winners.length; i++) {
      pNum = winners[i];
      winnings[pNum] += amount;
      game.players[pNum].mana += amount;
      game.warp.mana -= amount;
    }

    if (game.warp.amount > 0) {
      shuffle(winners);
      while (game.warp.amount > 0) {
        pNum = winners[i];
        winnings[pNum] += 1;
        game.players[pNum].mana += 1;
        game.warp.mana -= 1;
      }
    }

    for (var i = 0; i < winners.length; i++) {
      console.log("Player " + winners[i] + " won " + winnings[winners[i]] + " mana.")
    }
  }

  function match(pNum) {
    if (game.phase != 'match') return;

    var player = game.players[pNum];
    if (player.folded || player.mana <= 0 || player.vote == 'match') return;

    player.vote = 'match';

    var wager = game.warp.wager - player.wager;
    if (wager > player.mana) wager = player.mana;

    player.mana -= wager;
    game.warp.mana += wager;
    player.wager += wager;
    player.handWager += wager;

    console.log(
      "player " + pNum + " matches +" + wager + " (" + player.wager
      + ") with " +  player.mana + " remaining." + 
      (player.mana == 0 ? " (all-in)" : "")
    )

  }

  function getManaCount(n) {
    return game.players[n].mana;
  }

  function startClock() {
    game.clockMs = 0; // note: only approximates wall time
    window.setInterval(function () {
      game.clockMs += 30;

      // AI press buttons at random
      if (Math.random() < 0.1) {
        var pNum = 1 + Math.floor(Math.random() * 8);
        bet(pNum);
      }

      // todo: don't do this sort here, do it on-modify instead
      game.runQ.sort(function(a, b) { return a[1] - b[1] });
      while (game.runQ.length > 0 && game.runQ[0][1] <= game.clockMs) {
        game.runQ[0][0]();
        //console.log("Shifting from " + game.runQ.length + " => " + game.runQ[0][0]);
        game.runQ.shift();
        // if (game.runQ.length > 0)
        //   console.log("to " + game.runQ.length + " => " + game.runQ[0][0]);
      }
    }, 30);
  }

  function welcome() {
    var name = prompt("What is your name?");
    console.log("Welcome. You are " + name + " on Team 1");
    game.stage = 'flop';
    game.runQ.push([revealOrbs1, game.clockMs + 1]);
  }

  function revealOrbs1() {
    shuffleCards();
    for (var i = 1; i <= 8; i++) {
      game.players[i].handWager = 0;
    }
    console.log("Your orbs are " + game.cards[5] + " and " + game.cards[6]);
    console.log("Flop orbs are " + game.cards[0] + " and " + game.cards[1]);
    game.runQ.push([betPhase, game.clockMs + 300]);
  }

  function revealOrbs2() {
    console.log("Turn orbs are " + game.cards[2] + " and " + game.cards[3]);
    game.runQ.push([betPhase, game.clockMs + 300]);
  }

  function revealOrbs3() {
    console.log("River orb is " + game.cards[4]);
    game.runQ.push([betPhase, game.clockMs + 300]);
  }

  function revealWinner() {
    // ignoring side pots right now, findWinners will discard folded wizards
    // setGestaltRanks();
    // var winners = findWinners([1,2,3,4,5,6,7,8]);
    // console.log("Winners are players " + winners);
    sendManaToWinners();
    game.runQ.push([nextRevealPhase, game.clockMs + 300]);
  }

  function betPhaseDeadline() {
    if (game.phase != 'bet') return;
    endBetPhase();
  }

  function betPhase() {
    game.warp.priorRoundMana = game.warp.mana;
    game.warp.wager = 0;
    game.previousVoteWager = 0;
    game.phase = 'bet';
    game.voteRoundsLeft = 7
    for (var i = 1; i <= 8; i++) {
      game.players[i].betPhaseStartMana = getManaCount(i);
      game.players[i].wager = 0;
    }
    game.runQ.push([nextVote, game.clockMs +     10000 / 7]);
    game.runQ.push([nextVote, game.clockMs + 2 * 10000 / 7]);
    game.runQ.push([nextVote, game.clockMs + 3 * 10000 / 7]);
    game.runQ.push([nextVote, game.clockMs + 4 * 10000 / 7]);
    game.runQ.push([nextVote, game.clockMs + 5 * 10000 / 7]);
    game.runQ.push([nextVote, game.clockMs + 6 * 10000 / 7]);
    game.runQ.push([betPhaseDeadline, game.clockMs + 10000]);
    for (var i = 1; i <= 8; i++) game.players[i].vote = 'undecided';
    console.log("7 votes left");
  }

  function endBetPhase() {
    game.phase = 'match';
    game.runQ.push([matchPhase, game.clockMs]);
  }

  function endMatchPhase() {
    game.phase = 'transfer';
    game.runQ.push([transferPhase, game.clockMs]);
  }

  function transferPhase() {
    var newMana = game.warp.mana - game.warp.priorRoundMana;
    console.log("Warp gained " + newMana + " mana (now has " + game.warp.mana + ")");
    game.runQ.push([nextRevealPhase, game.clockMs + 300]);
  }

  function countMagesRaising() {
    //console.log(game.players);
    var count = 0;
    for (var i = 1; i <= 8; i++)
      if (game.players[i].vote == 'raise')
        count++;
    return count;
  }

  function nextVote() {
    if (game.phase != 'bet') return;

    var magesRaising = countMagesRaising();
    for (var i = 1; i <= 8; i++) {
      var player = game.players[i];
      if (player.mana <= 0) {
        player.vote = 'all-in';
      } else if (player.folded) {
        player.vote = 'defend'
      } else  {
        player.vote = 'undecided';
      }
    }
    console.log(magesRaising + " mages raised. Wager is at " + game.warp.wager)
    if (magesRaising < 2) {
      endBetPhase();
    } else {
      game.previousVoteWager = game.warp.wager;
      game.voteRoundsLeft -= 1;
      console.log(game.voteRoundsLeft + " votes left");
    }
  }

  function nextRevealPhase() {
    switch (game.stage) {
      case 'flop':
        game.stage = 'turn';
        game.runQ.push([revealOrbs2, game.clockMs]);
      break;
      case 'turn':
        game.stage = 'river';
        game.runQ.push([revealOrbs3, game.clockMs]);
      break;
      case 'river':
        game.stage = 'showdown';
        game.runQ.push([revealWinner, game.clockMs]);
      break;
      case 'showdown':
        game.stage = 'flop';
        game.runQ.push([revealOrbs1, game.clockMs]);
      break;
      default:
        console.log("Error: game.stage is not valid -- " + game.stage);
    }
  }

  function getRaiseSize(n) {
      var mana = getManaCount(n);
      var size = Math.floor(mana / game.voteRoundsLeft);
      if (size < 1 && mana > 0) return 1;
      return size;
  }

  function matchPhaseDeadline() {
    if (game.phase != 'match') return;
    for (var i = 1; i <= 8; i++) {
      if (game.players[i].vote == 'undecided')
        match(i);
    }
    endMatchPhase();
  }

  function matchPhase() {
    game.phase = 'match';
    game.runQ.push([matchPhaseDeadline, game.clockMs + 3000]);
  }

  function gameLoop() {
    startClock();
    game.runQ.unshift([welcome, 0]);
  }

  function shuffle (array) {
    //Fisher-Yates shuffle
    var i = 0
      , j = 0
      , temp = null;

    var k = 0;
    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }

    // return a pointer to array for convenience
    // however, array is modified in-place
    return array;
  }

  function shuffleCards() {
    shuffle(game.cards);
  }

  this.init = function () {
    for (var i = 0; i < 7; i++) {
      game.cards = game.cards.concat(game.elements);
    }
    for (var i = 1; i <= 8; i++) {
      game.players[i].mana = 5;
      game.players[i].wager = 0;
      game.players[i].folded = false;
      game.players[i].vote = undefined;
    }
    game.cards = game.cards.concat(["void", "void", "spirit"]);
    gameLoop();
  };

  this.pressBet = function () {
    if (game.phase == "bet") {
      bet(1);
    }
  }
}

Game.init();

console.log("finished game.js read");