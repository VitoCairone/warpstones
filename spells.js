var SpellBook = {
  'Blast': {
    costFraction: 3,
    damageX: 5.5
  },

  // EFAWILD
  'Rock': {
    cost: 30,
    damage: 150
    selfStatMods: { power: +25, aim: -25 }
    selfStatModOn: 'cast'
    selfStatModFor: 'spell'
  },
  'Ice': {
    cost: 20,
    damage: 110
  }, 
  'Fire': {
    cost: 25,
    damage: 135
  },
  'Bolt': {
    cost: 40,
    damage: 220
  },
  'Water': {
    cost: 16,
    damage: 80
  },
  'Cure': {
    cost: 21,
    heal: 100,
    target: 'ally',
    targetPriority: 'lowestHP'
  },
  'Drain': {
    cost: 25,
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