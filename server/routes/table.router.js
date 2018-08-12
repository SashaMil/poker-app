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
    console.log('elephant', data.games[data.games.length-1]);
     data.games[data.games.length-1].playerCard1 = playerCard1;
     data.games[data.games.length-1].playerCard2 = playerCard2;
     data.games[data.games.length-1].computerCard1 = computerCard1;
     data.games[data.games.length-1].computerCard2 = computerCard2;

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
    console.log('yaayy', data.games[data.games.length-1]);
    let gameInfo = {
      player_sb: currentGame.player_sb,
      playerCard1: currentGame.playerCard1,
      playerCard2: currentGame.playerCard2,
      playerChips: currentGame.player_chips,
      computerChips: currentGame.computer_chips,
      computerActions: currentGame.computerActions,
      playerActions: currentGame.playerActions,
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
    if (data.games.length === 0 || data.current_game_completed) {
      let arr = [true, false];
      let bool = arr[Math.floor(Math.random() * (2))];
      data.games.push({
        player_sb: bool,
        player_chips: 1500,
        computer_chips: 1500,
        pot: 0
      });
      data.save(function(err) {
        if (err) throw err;
        res.send('Added new game Array');
      });
    }
    else {
      res.send('Game still active');
    }
    // if (data.games.length === 0 || data.games[data.games.length-1].game_completed) {
    //   let arr = [true, false];
    //   let bool = arr[Math.floor(Math.random() * (2))];
    //   data.games.push({
    //     hands: [],
    //     player_sb: bool,
    //     player_chips: 1500,
    //     computer_chips: 1500,
    //     game_completed: false,
    //     pot: 0,
    //   });
    //
    //
    //   data.save(function(err) {
    //     if (err) throw err;
    //     res.send('Added new Game Array');
    //     console.log('Games array updated successfully');
    //   });
    // }
    // else {
    //   res.send('Game still active');
    // }
  })
});

module.exports = router;
