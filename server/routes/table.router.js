const express = require('express');
const router = express.Router();
const Deck = require('../modules/deck.js');
const Person = require('../models/Person');



/**
 * GET route template
 */
router.put('/shuffle', (req, res) => {

  let deck = new Deck;
  deck.shuffle();
  let playerCard1 = '';
  let playerCard2 = '';
  let computerCard1 = '';
  let computerCard2 = '';
  let flopCard1 = '';
  let flopCard2 = '';
  let flopCard3 = '';
  let turnCard1 = '';
  let riverCard1 = '';

  playerCard1 = deck.deal();
  computerCard1 = deck.deal();
  playerCard2 = deck.deal();
  computerCard2 = deck.deal();
  deck.deal();
  flopCard1 = deck.deal();
  flopCard2 = deck.deal();
  flopCard3 = deck.deal();
  deck.deal();
  turnCard1 = deck.deal();
  deck.deal();
  riverCard1 = deck.deal();

  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;
    let currentGame = data.games[data.games.length-1];
     currentGame.playerCards.push({card1: playerCard1, card2: playerCard2});
     currentGame.computerCards.push({card1: computerCard1, card2: computerCard2});

     currentGame.player_sb = !currentGame.player_sb;

     if (currentGame.player_sb) {
       currentGame.actions.push({player: true, type: 'SB', bet: 5, player_act_next: true, has_acted: false, street: 'preflop'});
       currentGame.player_chips -= 5
       currentGame.actions.push({player: false, type: 'BB', bet: 10, player_act_next: true, has_acted: false, street: 'preflop'});
       currentGame.computer_chips -= 10;

     } else {
       currentGame.actions.push({player: false, type: 'SB', bet: 5, player_act_next: false, has_acted: false, street: 'preflop'});
       currentGame.computer_chips -= 5;
       currentGame.actions.push({player: true, type: 'BB', bet: 10, player_act_next: false, has_acted: false, street: 'preflop'});
       currentGame.player_chips -= 10;

     }

     currentGame.street.push({flop1: flopCard1, flop2: flopCard2, flop3: flopCard3, turn: turnCard1, river: riverCard1});



     currentGame.pot = 0;
     currentGame.pot += 15;


     data.save(function(err) {
       if (err) throw err;
       res.send('Shuffled Cards');
       console.log('Games array updated successfully');
     });
  });

});

router.get('/gameInfo', (req, res) => {

  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;
    let currentGame = data.games[data.games.length-1];
    console.log(currentGame.actions[currentGame.actions.length - 1])
    let gameInfo = {
      player_sb: currentGame.player_sb,
      playerCards: currentGame.playerCards[currentGame.playerCards.length-1],
      playerChips: currentGame.player_chips,
      computerChips: currentGame.computer_chips,
      actions: currentGame.actions[currentGame.actions.length - 1],
      computerActions: currentGame.computerActions,
      pot: currentGame.pot,
    }
    res.send(gameInfo);
  })

})

router.get('/street', (req, res) => {
  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;
    const currentGame = data.games[data.games.length-1];
    const playerAction = currentGame.actions[currentGame.actions.length - 1];
    if (playerAction.street === 'flop') {
      res.send([currentGame.street.flop1, currentGame.street.flop2, currentGame.street.flop3]);
    }
    else if (playerAction.street === 'turn') {
      res.send([currentGame.street.flop1, currentGame.street.flop2, currentGame.street.flop3, currentGame.street.turn])
    }
    else if (playerAction.street === 'river') {
      res.send([currentGame.street.flop1, currentGame.street.flop2, currentGame.street.flop3, currentGame.street.turn, currentGame.street.river])
    }
  })
})

/**
 * POST route template
 */
router.post('/checkGameStatus', (req, res) => {
  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;
    if (data.games.length === 0 || data.games[data.games.length-1].game_completed) {
      let arr = [true, false];
      let bool = arr[Math.floor(Math.random() * (2))];
      data.games.push({
        player_sb: bool,
        player_chips: 1500,
        computer_chips: 1500,
        pot: 0,
        game_completed: false,
      });
      data.save(function(err) {
        if (err) throw err;
        res.send('Added new game Array');
      });
    }
    else {
      res.send('Game still active');
    }

  })
});

module.exports = router;
