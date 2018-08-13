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

     console.log('giraffe', data.games[data.games.length-1].player_sb);

     if (currentGame.player_sb) {
       currentGame.playerActions.push({type: 'sb', bet: 5, act_next: true, facing_bet: 5});
       currentGame.player_chips -= 5
       currentGame.computerActions.push({type: 'bb', bet: 10, act_next: false, facing_bet: 0});
       currentGame.computer_chips -= 10;

     } else {
       currentGame.playerActions.push({type: 'bb', bet: 10, act_next: false, facing_bet: 0});
       currentGame.player_chips -= 10;
       currentGame.computerActions.push({type: 'sb', bet: 5, act_next: true, facing_bet: 5});
       currentGame.computer_chips -= 5;

     }

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
    console.log(currentGame.playerCards[currentGame.playerCards.length-1]);
    let gameInfo = {
      player_sb: currentGame.player_sb,
      playerCards: currentGame.playerCards[currentGame.playerCards.length-1],
      playerChips: currentGame.player_chips,
      computerChips: currentGame.computer_chips,
      computerActions: currentGame.computerActions,
      playerActions: currentGame.playerActions,
      computerActions: currentGame.computerActions,
      pot: currentGame.pot,
    }
    res.send(gameInfo);
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
