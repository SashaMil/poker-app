const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Mongoose Schema

const Actions = new Schema({
  type: String,
  bet: Number,
});

const Hands = new Schema({
  playerCard1: String,
  playerCard2: String,
  computerCard1: String,
  computerCard2: String,
  player_sb: Boolean,
  player_chips: Number,
  computer_chips: Number,
  pot: Number,
  playerActions: [Actions],
  computerActions: [Actions],
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
