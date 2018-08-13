const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Mongoose Schema

const Actions = new Schema({
  type: String,
  bet: Number,
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
});

const PersonSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  games: [Hands],
  current_game_completed: Boolean,
});



module.exports = mongoose.model('Person', PersonSchema);

// hands: [],
// player_sb: bool,
// player_chips: 1500,
// computer_chips: 1500,
// game_completed: false,
// pot: 0,
