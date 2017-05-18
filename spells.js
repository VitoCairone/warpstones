var SpellBook = {
  'Blast': {
    cost: 'costFraction',
    damage: 'damageX',
    costFraction: 3,
    damageX: 5.5
  },

  // EFAWILD
  'Rock': {
    cost: 30,
    damage: 150,
    also: ['spellStatMods'],
    spellStatMods: { power: +25, aim: -25 },
    costGrowth: { 'linear': 18 }
  },
  'Fire': {
    cost: 25,
    damage: 135,
    costGrowth: {'exponential': 4/3}
  },
  'Bolt': {
    cost: 40,
    damage: 220,
    costGrowth: {'linear': 20}
  },
  'Water': {
    cost: 16,
    damage: 80,
    costGrowth: {'linear': 14}
  },
  'Ice': {
    cost: 20,
    damage: 110,
    costGrowth: { 'exponential': 4/3 }
  },
  'Cure': {
    cost: 21,
    damage: 'heal',
    heal: 100,
    target: 'ally',
    targetPriority: 'lowestHP',
    costGrowth: {'linear': 14}
  },
  'Drain': {
    cost: 25,
    damage: 50,
    also: ['healSelfBy'],
    costGrowth: {'linear': 16},
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