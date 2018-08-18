const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Mongoose Schema

const Actions = new Schema({
  player: Boolean,
  type: String,
  bet: Number,
  player_act_next: Boolean,
  street: String,
  next_street: String,
  has_acted: Boolean,
});

const Cards = new Schema({
  card1: String,
  card2: String,
});

const Street = new Schema({
  flop1: String,
  flop2: String,
  flop3: String,
  turn: String,
  river: String,
})

const Hands = new Schema({
  playerCards: [Cards],
  computerCards: [Cards],
  street: [Street],
  player_sb: Boolean,
  player_chips: Number,
  computer_chips: Number,
  pot: Number,
  actions: [Actions],
  current_hand_completed: Boolean,
  game_completed: Boolean,
  message: String,
});

const PersonSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  games: [Hands],
});

module.exports = mongoose.model('Person', PersonSchema);
