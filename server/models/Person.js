const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Mongoose Schema
const PersonSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  games: [
    {
      hands: [
        {
          cards: {
            computerCards: {
              card1: String,
              card2: String
            },
            playerCards: {
              card1: String,
              card2: String
            }
          },
          actions: {
            computerActions: [],
            playerActions: []
          },
          flop: {
            card1: String,
            card2: String,
            card3: String
          },
          turn: {
            card1: String,
          },
          river: {
            card1: String,
          },
          createdAt: Date,
          updatedAt: Date
        },
        {
          pot: Number
        }

      ]
    }
  ]
});

module.exports = mongoose.model('Person', PersonSchema);
