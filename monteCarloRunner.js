var cards = [];

var elements = ['earth', 'fire', 'air', 'water', 'ice', 'dark', 'light'];

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

function shuffle (array) {
  //Fisher-Yates shuffle
  var i = 0
    , j = 0
    , temp = null;

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

function findWinners() {
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
  var scores = Objects.keys(scoreOccurHash);
  for (var i = 0; i < scores.length; i++) {
    freq = scoreOccurHash[scores[i]] / scoreOccurTotal;
    odds = 1.0 / freq;
    if (odds > 9.9) {
      odds = Math.floor(odds)
    } else {
      odds = Math.floor(odds * 10) / 10;
    }
    console.log(score + ': 1 in ' + odds);
  }
}