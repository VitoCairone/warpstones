// var Painter = new function () {

//   this.manaDraw = Magnetic;

//   this.animateAllIn = function (pNum) {
//     if (pNum == 1) {
//       document.getElementById('foldButton').classList.add('disabled');
//       document.getElementById('betButton').classList.add('activated');
//       document.getElementById('bet-text').innerHTML = 'ALL IN';
//     }
//     var el = document.getElementById('sprite' + pNum);
//     el.classList.add('raise');
//   }

//   this.animateDamage = function (pNum, amount) {
//     var el = document.getElementById('damage-popup-' + pNum);
//     el.innerHTML = amount;
//     el.classList.add('reporting');
//     window.setTimeout(function () {
//       el.innerHTML = "";
//       el.classList.remove('reporting');
//     }, 500)
//   }

//   // this.animateSprites = function () {
//   //   var sprites = document.getElementsByClassName("sprite");
//   //   for (var i = 0; i < sprites.length; i++) {
//   //     sprites[i].classList.remove('frame-1', 'frame-2', 'frame-3', 'frame-4');
//   //     var frame = parseInt(sprites[i].getAttribute('frame'));
//   //     frame = (frame + 1) % 5 || 1;
//   //     sprites[i].classList.add('frame-' + frame);
//   //     sprites[i].setAttribute('frame', frame);
//   //   };
//   // }

//   this.animateResetTimerBar = function () {
//     // console.log('resetting timer bar');
//     // document.getElementById('progress-bar-fill').style.width = "0%";
//     document.getElementById('progress-bar-fill').classList.remove('bet-stage', 'match-stage');
//     // document.getElementById('progress-bar-fill').classList.add('reset');
//   }

//   this.animateSendWinnings = function (winnings) {
//     Magnetic.distributeParticles(winnings);
//   }

//   this.animateSpellLock = function (num) {
//     document.getElementById('spell-button-' + num).classList.add('activated');
//   }

//   this.animateTransitionPhase = function () {
//     ;
//   }


//   this.animateMeet = function (pNum) {
//     // it is the CALLER's responsibility not to call animateMeet when
//     // the player goes All-In
//     if (pNum == 1) {
//       document.getElementById('foldButton').classList.add('disabled');
//       document.getElementById('betButton').classList.add('activated');
//       document.getElementById('bet-text').innerHTML = 'MATCHED';
//     }
//     var el = document.getElementById('sprite' + pNum);
//     el.classList.add('raise');
//   }

//   this.animateGrantNewParticles = function (pNum, gain) {
//     Magnetic.conjureParticles(pNum, gain);
//     Magnetic.expandParticles(pNum);
//   }

//   this.animateBetTimerBar = function () {
//     // this timeout ensure that at least 1 frame is rendered without
//     // a -stage class, resetting the bar to 0. Prefer a cleaner solution
//     // which can't fail race conditions. requestAnimationFrame appears
//     // insufficient.
//     window.setTimeout(function() {
//       // document.getElementById('progress-bar-fill').classList.remove('reset');
//       document.getElementById('progress-bar-fill').classList.add('bet-stage');
//     }, 50)
//   }

//   this.animateResetPoses = function () {
//     for (var i = 1; i <= 8; i++) {
//       var el = document.getElementById("sprite" + i);
//       el.classList.remove('raise');
//       el.classList.remove('defend');
//     }
//   }

//   this.showBetButton = function (isAllIn) {
//     document.getElementById('actionButtons').classList.remove('match-phase');
//     if (!isAllIn) {
//       document.getElementById('bet-text').innerHTML = "BET";
//     }
//   }

//   this.showMatchButton = function (isMatched, isAllIn, matchAmountPercent) {
//     document.getElementById('actionButtons').classList.add('match-phase');
//     if (!isAllIn) {
//       if (isMatched) {
//         document.getElementById('bet-text').innerHTML = "MATCHED";
//       } else {
//         document.getElementById('bet-text').innerHTML = "MATCH";
//         document.getElementById('match-overlay').style.height = matchAmountPercent + '%';
//       }
//     } 
//   }

//   this.animateMatchTimerBar = function () {
//     document.getElementById('progress-bar-fill').classList.add('match-stage');
//   }

//   this.animateBet = function (pNum, newWagerPercent, betSize) {
//     if (pNum == 1 && newWagerPercent > 0) {
//        document.getElementById('bet-count-overlay').style.height = newWagerPercent + "%";
//       // document.getElementById('bet-count-overlay').classList.add('count-' + betCount);
//     }
//     Magnetic.hiliteMagnetParticles(pNum, betSize);

//     var el = document.getElementById('sprite' + pNum);
//     el.classList.add('raise');
//   }

//   this.animateEnd = function (teamOneWins, teamTwoWins) {
//     var message = 'VICTORY!'
//     if (teamOneWins && teamTwoWins) {
//       message = 'TIED'
//     } else if (teamTwoWins) {
//       message = 'DEFEAT'
//     }
//     document.getElementById('end-game-report').innerHTML = message;
//     document.getElementById('end-game-report-box').classList.add('show');
//   }

//   this.animateContinue = function () {
//     document.getElementById('end-game-report-box').classList.remove('show'); 

//     for (var i = 1; i <= 8; i++) {
//       this.reviveSprite(i);
//     }
    
//     Magnetic.reset();
//   }

//   this.animateEndMatchStage = function () {
//     for (var i = 1; i <= 8; i++) {
//       Magnetic.transferMarkedParticles(i, 0);
//       var el = document.getElementById('sprite' + i);
//       el.classList.remove('raise');
//     }
//   }

//   this.animateFold = function (pNum) {
//     var el = document.getElementById('sprite' + pNum);
//     el.classList.remove('raise');
//     el.classList.add('defend');
//     if (pNum == 1) {
//       document.getElementById('foldButton').classList.add('activated');
//       document.getElementById('betButton').classList.add('disabled');
//     }
//     Magnetic.contractParticles(pNum);
//   }

//   this.animateForceBlast = function (pNum, targNum) {
//     var el = document.getElementById('spellshot' + pNum);
//     el.classList.add('inflight');
//     el.classList.add('target' + targNum);
//   }

//   this.animateMatch = function (pNum) {
    
//   }

//   this.destructParticles = function (pNum, loss) {
//     Magnetic.destructParticles(pNum, loss);
//   }

//   this.animateRaise = function(pNum) {
//     var el = document.getElementById('sprite' + pNum);  
//     el.classList.add('raise');
//   }

//   this.disableSpellButtons = function () {
//     var els = document.getElementsByClassName("spell-button");
//     for (var i = 0; i < els.length; i++) {
//       els[i].classList.remove('activated');
//       els[i].classList.add('disabled');
//     }
//   }

//   this.enableSpellButtons = function () {
//     var els = document.getElementsByClassName("spell-button");
//     for (var i = 0; i < els.length; i++) {
//       els[i].classList.remove('disabled');
//     }
//   }

//   this.hideAllCards = function () {
//     var orbClasses = [
//       'light-orb',
//       'dark-orb',
//       'earth-orb',
//       'fire-orb',
//       'water-orb',
//       'air-orb',
//       'ice-orb',
//       'void-orb',
//       'spirit-orb'
//     ]

//     // clearing any -orb class from every card-el element,
//     // which includes board and personal cards.
//     // Sidenote: this lazy method runs up to (5+16) * 9 tests
//     // but it could be possible insead to just clear -orb
//     // from .class using regexp ?? anyway, probably not a bottleneck
//     var cardEls = document.getElementsByClassName("card-el");
//     for (var i = 0; i < cardEls.length; i++) {
//       var cardEl = cardEls[i];
//       for (var j = 0; j < orbClasses.length; j++) {
//         cardEl.classList.remove(orbClasses[j]);
//       }
//     }
//   }

//   this.setMessage = function (msg) {
//     document.getElementById("message-box").innerHTML = msg;
//   }

//   this.showFlopCards = function (cards) { revealElements([1, 2], cards); }

//   this.showTurnCards = function (cards) { revealElements([3, 4], cards); }

//   this.showRiverCard = function (cards) { revealElements([5], cards); }

//   this.faintSprite = function (pNum) {
//     var el = document.getElementById('sprite' + pNum);
//     el.classList.add('fainted');
//   }

//   this.reviveSprite = function (pNum) {
//     var el = document.getElementById('sprite' + pNum);
//     el.classList.remove('fainted');
//   }

//   this.resetMaxMarked = function () {
//     Magnetic.resetMaxMarked();
//   }

//   this.showPersonalCardsFor = function (nums, cards) {
//     for (var i = 0; i < nums.length; i++) {
//       var n = nums[i];
//       var id1 = n * 2 - 1;
//       var id2 = n * 2;
//       var slot1 = n * 2 - 2;
//       var slot2 = n * 2 - 1;
//       document.getElementById("player-element-" + id1).classList.add(cards[slot1] + '-orb');
//       document.getElementById("player-element-" + id2).classList.add(cards[slot2] + '-orb');
//     }
//   }

//   this.unhiliteAllParticles = function () {
//     Magnetic.unhiliteAllParticles();
//   };

//   this.updateHealthReadout = function (players) {
//     var readout = "";

//     for (var i = 1; i <= 4; i++) {
//       var left = i;
//       var right = 4 + i;
//       var player = players[left];
//       readout += player.name + ': ' + player.hp + '       ';
//       player = players[right];
//       readout += player.name + ': ' + player.hp;
//       readout += '<br/>';
//     }

//     document.getElementById('healthReadout').innerHTML = readout;
//   }

//   this.setSpellButtonText = function (num, text) {
//     var el = document.getElementById('spell-text-' + num);
//     el.innerHTML = text;
//   }

//   this.stageStartEnableButtons = function () {
//     var btnEls = ['foldButton', 'betButton']
//     for (var i = 0; i < btnEls.length; i++) {
//       document.getElementById(btnEls[i]).classList.remove('disabled', 'activated');
//     }
//   }

//   this.zeroBetOverlay = function () {
//     // document.getElementById('bet-count-overlay').className = "";
//     document.getElementById('bet-count-overlay').style.height = "0%";
//     document.getElementById('match-overlay').style.height = "0%";
//     // document.getElementById('bet-text').innerHTML = 'BET';
//   }

//   function revealElements(nums, cards) {
//     for (var i = 0; i < nums.length; i++) {
//       var n = nums[i];
//       var elId = 'rev-element-' + n;
//       var elClass = cards[15+n] + '-orb';
//       document.getElementById(elId).classList.add(elClass);
//     }
//   }
// }

// Game.setPainter(Painter);