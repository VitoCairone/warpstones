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
100,000,000 run results, w/ builtin rand
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

(function main() {
  for (var i = 0; i < 22; i++) {
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
})();