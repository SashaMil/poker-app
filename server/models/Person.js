const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Mongoose Schema

const Actions = new Schema({
  player: Boolean,
  type: String,
  bet: Number,
  street: String,
  player_act_next: Boolean,
  player_has_acted: Boolean,
  computer_has_acted: Boolean,
  next_street: Boolean,
  best_five_cards: String,
  best_five_cards_value: Number,
  pot: Number,
  player_chips: Number,
  computer_chips: Number,
  message: String,
});

const Hands = new Schema({
  playerCards: {card1: String, card2: String},
  computerCards: {card1: String, card2: String},
  street: {flop1: String, flop2: String, flop3: String, turn: String, river: String},
  player_button: Boolean,
  actions: [Actions],
  hand_status: String,
});

const Games = new Schema({
  hands: [Hands],
  game_completed: Boolean,
});

const PersonSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  games: [Games],
});

module.exports = mongoose.model('Person', PersonSchema);
