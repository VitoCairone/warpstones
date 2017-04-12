var SpellBook = {

  // Signatures, cost 7 - 21

  'Focus': {
    dtype: 'spell',
    requires: 'any',
    cost: 21,
    target: 'self',
    bonusX: { power: 2 },
    until: 'spellcast'
  }
  'Force Blast': {
    dtype: 'spell',
    requires: 'any',
    cost: 21,
    damageX: 5,
  },

  // Specials, cost around 49

  'Earth': {
    dtype: 'spell',
    requires: 'earth',
    requireCount: 2,
    cost: 49,
    damageX: 7,
  },
  'Fire': {
    dtype: 'spell',
    requires: 'fire',
    requreCount: 2,
    cost: 49,
    damageX: 7
  },
  'Wind': {
    dtype: 'spell',
    requires: 'air',
    requireCount: 2,
    cost: 49,
    damageX: 7
  },
  'Water': {
    dtype: 'spell',
    requires: 'water',
    requireCount: 2,
    cost: 49,
    damageX: 7
  },
  'Ice': {
    dtype: 'spell',
    requires: 'ice',
    requireCount: 2,
    cost: 49,
    damageX: 7
  }
  'Dark': {
    dtype: 'spell',
    requires: 'dark',
    requireCount: 2,
    cost: 49,
    damageX: 7
  },
  'Light': {
    dtype: 'spell',
    target: 'self',
    requires: 'light',
    requireCount: 2,
    cost: 49,
    healX: 7
  },

  // Ultimates, cost around 98 or 147

  'Blaze': {
    dtype: 'spell',
    target: 'all enemies',
    requires: 'fire',
    requireCount: 3,
    cost: 98,
    damageX: 7 / 4,
  },

  'Freeze': {
    dtype: 'spell',
    target: 'all enemies',
    requires: 'ice',
    requireCount: 5,
    cost: 98,
    damageX: 4 / 4,
    convert: { normal: 'ice' },
    convertX: { normal: 2 }
  },

  'Inferno': {
    dtype: 'spell',
    target: 'all everyone',
    requires: 'fire',
    requireCount: 5,
    cost: 119,
    damageX: 20 / 8
  },

  'Death': {
    dtype: 'spell',
    requires: 'dark',
    requireCount: 5,
    cost: 100,
    damageX: 7
  }

};

var SpellList = Object.keys(SpellBook);

for (var i = 0; i < SpellList.length; i++) {
  var spellName = SpellList[i];
  SpellBook[spellName].name = spellName;
}