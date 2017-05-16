var SpellBook = {
  'Blast': {
    costFraction: 3,
    damageX: 5.5
  },

  // EFAWILD
  'Rock': {
    cost: 30,
    damage: 150
    spellStatMods: { power: +25, aim: -25 }
    costGrowth: { 'linear': 18 }
  },
  'Ice': {
    cost: 20,
    damage: 110
    costGrowth: { 'exponential': 4/3 }
  }, 
  'Fire': {
    cost: 25,
    damage: 135
    costGrowth: {'exponential': 4/3}
  },
  'Bolt': {
    cost: 40,
    damage: 220
    costGrowth: {'linear': 20}
  },
  'Water': {
    cost: 16,
    damage: 80,
    costGrowth: {'linear': 14}
  },
  'Cure': {
    cost: 21,
    costGrowth: {'linear': 14}
    heal: 100,
    target: 'ally',
    targetPriority: 'lowestHP'
  },
  'Drain': {
    cost: 25,
    costGrowth: {'linear': 16}
    damage: 50,
    healSelfBy: 'damage'
  },
  
  'Void': {
    cost: 0,
    heal: 0,
    target: 'self'
  }
}

// set keys as .name on each objects as well
var SpellList = Object.keys(SpellBook);
for (var i = 0; i < SpellList.length; i++) {
  var spellName = SpellList[i];
  SpellBook[spellName].name = spellName;
}