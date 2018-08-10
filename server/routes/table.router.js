const express = require('express');
const router = express.Router();
const Deck = require('../modules/deck.js');
const Person = require('../models/Person');



/**
 * GET route template
 */
router.get('/shuffle', (req, res) => {
  console.log('hello');
  let deck = new Deck;
  deck.shuffle();
  console.log(deck);
  deck.deal();
  deck.deal();
  console.log(deck);
  Person.find()
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      res.sendStatus(500);
    })
});

/**
 * POST route template
 */
router.post('/checkGame', (req, res) => {
  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;
    data.games =     {
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
              },
              actions: {
                computerActions: [
                  {
                    preflop: [
                      {
                        action: {
                          type: String,
                          bet: Number,
                        }
                      }
                    ],
                    flop: [
                      {
                        action: {
                          type: String,
                          bet: Number,
                        }
                      }
                    ],
                    turn: [
                      {
                        action: {
                          type: String,
                          bet: Number,
                        }
                      }
                    ],
                    river: [
                      {
                        action: {
                          type: String,
                          bet: Number,
                        }
                      }
                    ]
                  }
                ],
                playerActions: [
                  {
                    preflop: [
                      {
                        action: {
                          type: String,
                          bet: Number,
                        }
                      }
                    ],
                    flop: [
                      {
                        action: {
                          type: String,
                          bet: Number,
                        }
                      }
                    ],
                    turn: [
                      {
                        action: {
                          type: String,
                          bet: Number,
                        }
                      }
                    ],
                    river: [
                      {
                        action: {
                          type: String,
                          bet: Number,
                        }
                      }
                    ]
                  }
                ]
              },
              player_sb: Boolean,
              createdAt: Date,
              updatedAt: Date
            },
            {
              pot: Number
            }

          ],
          player_chips: Number,
          computer_chips: Number,
          game_completed: Boolean,

        };

      data.save(function(err) {
        if (err) throw err;

        console.log('Games array updated successfully');
      });
  })
});

module.exports = router;
