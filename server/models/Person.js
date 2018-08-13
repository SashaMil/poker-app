const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Mongoose Schema

const Actions = new Schema({
  type: String,
  bet: Number,
  act_next: Boolean,
});

const Cards = new Schema({
  card1: String,
  card2: String,
});

const Hands = new Schema({
  playerCards: [Cards],
  computerCards: [Cards],
  player_sb: Boolean,
  player_chips: Number,
  computer_chips: Number,
  pot: Number,
  playerActions: [Actions],
  computerActions: [Actions],
  current_hand_completed: Boolean,
  game_completed: Boolean,
});

const PersonSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  games: [Hands],
});

module.exports = mongoose.model('Person', PersonSchema);
