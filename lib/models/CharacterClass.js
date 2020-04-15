const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  hp: {
    type: Number,
    required: true,
    min: 1
  },
  mana: {
    type: Number,
    required: true,
    min: 0
  },
  speed: {
    type: Number,
    required: true,
    min: 1
  },
  strength: {
    type: Number,
    required: true,
    min: 1
  },
  intelligence: {
    type: Number,
    required: true,
    min: 1
  },
  agility: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('CharacterClass', schema);
