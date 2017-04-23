var cards = [];

var elements = ['earth', 'fire', 'air', 'water', 'ice', 'dark', 'light'];

var scoreOccurHash = {};
var scoreOccurTotal = 0;

for (var i = 0; i < 7; i++) {
  cards = cards.concat(elements);
}

cards = cards.concat(['void', 'void', 'gold']);

function gestaltRank(gestalt) {
  var score = 0;
  var hashEls = {};
  var presentEls = [];

  for (var i = 0; i < gestalt.length; i++) {
    var el = gestalt[i];
    if (el in hashEls) {
      hashEls[el] += 1;
    } else {
      hashEls[el] = 1;
      presentEls.push(el);
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

  if ('gold' in hashEls) {
    score += 1;
  }

  if ('void' in hashEls && hashEls['void'] == 2) {
    score += 1000000000;
  }

  return score;
}

function shuffle () {
  //Fisher-Yates shuffle
  var i = 0
    , j = 0
    , temp = null;

  for (i = cards.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = cards[i]
    cards[i] = cards[j]
    cards[j] = temp
  }
}

function findTopScore() {
  var score = 0;
  var topScore = 0;
  for (var i = 1; i <= 8; i++) {
    var gestalt = cards.slice(0,5).concat([cards[i*2+4], cards[i*2+5]]);
    score = gestaltRank(gestalt);
    if (score > topScore) {
      topScore = score;
    }
  }
  return topScore;
}

function getVisibleScores(pNum) {
  var stageResults = [];
  for (var stage = 0; stage < 3; stage++) {
    var boardG = null;
    var combineSs = [null];
    var combineGs = [null];
    switch (stage) {
      case 0: boardG = cards.slice(0, 4); break;
      case 1: boardG = cards.slice(0, 6); break;
      case 2: boardG = cards.slice(0, 7); break;
    }
    var boardS = gestaltRank(boardG);
    for (var i = 1; i <= 8; i++) {
      combineGs.push(boardG.concat([cards[i*2+4], cards[i*2+5]]));
      combineSs.push(gestaltRank(combineGs[i]));
    }
    var result = [boardS, combineSs]
    stageResults.push(result);
  }
  return stageResults;
}

function getWinners(topScore) {
  if (typeof topScore === 'undefined') {
    topScore = findTopScore();
  }
  var winners = [];
  for (var i = 1; i <= 8; i++) {
    var gestalt = cards.slice(0,5).concat([cards[i*2+4], cards[i*2+5]]);
    var score = gestaltRank(gestalt);
    if (score == topScore) {
      winners.push(i);
    }
  }
  return winners;
}

function printOutOdds() {
  var scores = Object.keys(scoreOccurHash);

  scores.sort(function (a, b) {
    return scoreOccurHash[b] - scoreOccurHash[a];
  });

  for (var i = 0; i < scores.length; i++) {
    freq = scoreOccurHash[scores[i]] / scoreOccurTotal;
    odds = 1.0 / freq;
    if (odds > 9.9) {
      odds = Math.floor(odds)
    } else {
      odds = Math.floor(odds * 10) / 10;
    }
    console.log(scores[i] + ': 1 in ' + odds);
  }
}

/*
100,000,000 runNoFoldWinner results, w/ builtin rand
Winning gestalts
Some quick notes:
  60% are Full House, Trips, or Two Pair
  4s about 1/8 = about 3 each game;
  Void about 1/14 = about 1.5 each game;
  5s about 1/150 = about 1 in 7 games (1 hour);
  6s about 1/8000 = about 1 in 365 games (45 hours);
  7s about 1/2.7M = about 1 in 120,000 games (1.7 player-years);

#1
Full House
112: 1 in 3.1     to 0.32

#2
Trips
104: 1 in 5.8     to 0.49

#3
Two Pair
23: 1 in 9.4      to 0.60

#4
Fours
1003: 1 in 15     to 0.67

#5
Four and Pair     
1011: 1 in 20     to 0.72

#6
Trips two Pair    
120: 1 in 22      to 0.76

#7
Trips +Spirit   
105: 1 in 27      to 0.80

#8
Void over Pair
1000000023: 1 in 30

#9
Full House +Spirit
113: 1 in 34

#10
Two Pair +Spirit
24: 1 in 39

#11
Two Trips 
201: 1 in 39

#12
Three Pair
31: 1 in 44

#13
Void over Two Pair
1000000031: 1 in 80

#14
Void alone
1000000015: 1 in 90

#15
Void over Trips
1000000112: 1 in 121

#16
Fours +Spirit
1004: 1 in 134

#17
Fives
10002: 1 in 179

#18
Pair +Spirit
16: 1 in 212

#19
Void over Pair +Spirit
1000000024: 1 in 261

#20
Void +Spirit
1000000016: 1 in 380

#21
Fours and Trips
1100: 1 in 396

#22
Pair
15: 1 in 425

#23
Void over Full House
1000000120: 1 in 604

#24
Fours and Pair
1012: 1 in 666

#25
Three Pair +Spirit
32: 1 in 826

#26
Fives and Pair
10010: 1 in 958

#27
Two Trips +Spirit
202: 1 in 1,351

#28
Void over Fours
1000001011: 1 in 1,764

#29
Void over Trips +Spirit
1000000113: 1 in 1,952

#30
Void over Two Pair +Spirit
1000000032: 1 in 2,554

#31
Fives +Spirit
10003: 1 in 3,031

#32
Sixes
100001: 1 in 8,231

#33
Void over Fours +Spirit
1000001012: 1 in 71,787

#34
Void over Fives 
1000010010: 1 in 112,107

#35
Sixes +Spirit
100002: 1 in 332,225

#36
Sevens
1000000: 1 in 2,702,702

#37
Rainbow
7: nearly impossible without folds
*/

function runNoFoldWinner() {
  var t = 1000;
  for (var i = 0; i < t; i++) {
    if (i > 0 && i % 10000 == 0) {
      console.log("Ran " + i);
    }
    shuffle();
    var score = findTopScore();
    if (score in scoreOccurHash) {
      scoreOccurHash[score]++;
    } else {
      scoreOccurHash[score] = 1;
    }
    scoreOccurTotal++;
  }

  printOutOdds();
};

function runNoFoldPrediction() {
  var t = 15000000;

  var partialsOccur = {};
  var partialsWins = {};
  for (var i = 0; i < t; i++) {
    if (i > 0 && i % 10000 == 0) {
      console.log("Ran " + i);
    }
    shuffle();
    // only stage 0 right now
    var visibleScores = getVisibleScores()[0];
    var boardS = visibleScores[0];
    var playerSs = visibleScores[1];
    var winners = getWinners();
    var wonArr = [null, false, false, false, false, false, false, false, false];
    for (var j = 0; j < winners.length; j++) {
      wonArr[winners[j]] = true;
    }
    for (var j = 1; j <= 8; j++) {
      var keyStr = playerSs[j] + "_" + boardS;
      if (keyStr in partialsOccur) {
        partialsOccur[keyStr] += 1;
      } else {
        partialsOccur[keyStr] = 1;
      }
      if (wonArr[j]) {
        if (keyStr in partialsWins) {
          partialsWins[keyStr] += 8 / winners.length;
        } else {
          partialsWins[keyStr] = 8 / winners.length;
        }
      } else {
        if (!(keyStr in partialsWins)) {
          partialsWins[keyStr] = 0;
        }
      }
    }
  }

  // done running, print out odds

  var keys = Object.keys(partialsWins);

  keys.sort(function (a, b) {
    return partialsWins[b]/partialsOccur[b] - partialsWins[a]/partialsOccur[a];
  });

  for (var i = 0; i < keys.length; i++) {
    var winning = partialsWins[keys[i]] / partialsOccur[keys[i]];
    console.log(keys[i] + ': ' + Math.round(winning * 100) / 100);
  }

  return;
}

/*

runNoFoldPrediction 1,000,000 trial results
w/ builtin Rand

no-voids 
100000_1000: 8
10002_102: 8
10001_101: 7.73
1003_13: 7.64
1010_20: 7.48
1002_12: 7.45
10002_1000: 7.17
1010_101: 6.94
200_20: 6.9
104_5: 6.27
112_13: 5.82
10001_1000: 5.79
1003_101: 5.73
103_4: 5.6
111_12: 5.13
1003_102: 4.88
1002_101: 4.37
112_20: 3.64
104_12: 3.3
23_5: 3.21
104_13: 3.03
103_12: 2.28
22_4: 2.16
200_101: 1.99
111_20: 1.86
30_12: 1.57
112_101: 1.27
-- fold-pt!
1010_1000: 0.97
15_5: 0.75
23_12: 0.69
112_102: 0.68
23_13: 0.58
30_20: 0.54
15_4: 0.53
14_4: 0.47
111_101: 0.44
1003_1000: 0.37
22_12: 0.31
1002_1000: 0.22
104_102: 0.15
104_101: 0.14
103_101: 0.07
7_5: 0.06
15_13: 0.06
15_12: 0.04
7_4: 0.04
14_12: 0.03
6_4: 0.03
23_20: 0.03
22_20: 0.03

voids
1000000111_12: 8
1000001010_1000: 8
1000000112_102: 8
1000001010_1000000020: 8
1000000112_13: 8
1000000112_101: 8
1000001010_101: 8
1000000030_20: 8
1000000023_13: 8
1000000023_5: 8
1000000023_12: 8
1000000015_5: 8
1000000015_4: 8
1000000030_12: 8
1000000022_4: 8
1000000111_101: 8
1000000022_12: 8
1000000014_4: 8
1000000112_1000000013: 7.64
1000000111_1000000012: 7.15
1000000112_1000000020: 7.06
1000000030_1000000012: 5.01
1000000111_1000000020: 3.89
1000000023_1000000012: 2.32
1000000023_1000000013: 2.11
1000000022_1000000012: 1.21
1000000030_1000000020: 1.16
-- fold-pt!
1000000015_1000000013: 0.34
1000000015_1000000012: 0.33
1000000023_1000000020: 0.29
1000000014_1000000012: 0.11
1000000022_1000000020: 0.1

*/

(function main() {
  runNoFoldPrediction();
})();