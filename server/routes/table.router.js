const express = require('express');
const router = express.Router();
const Deck = require('../modules/deck.js');
const Person = require('../models/Person');
const messageGenerator = require('../modules/messageGenerator.js');

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
     let message = '';

     if (currentGame.player_sb) {
       currentGame.actions.push({player: true, type: 'SB', bet: 5, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'preflop'});
       currentGame.player_chips -= 5;
       message = messageGenerator(currentGame.actions[currentGame.actions.length-1]);
       currentGame.messages.push({message: message});
       currentGame.actions.push({player: false, type: 'BB', bet: 10, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'preflop'});
       currentGame.computer_chips -= 10;
       message = messageGenerator(currentGame.actions[currentGame.actions.length-1]);
       currentGame.currentBet = 10;
       currentGame.messages.push({message: message});

     } else {
       currentGame.actions.push({player: false, type: 'SB', bet: 5, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'preflop'});
       currentGame.computer_chips -= 5;
       message = messageGenerator(currentGame.actions[currentGame.actions.length-1]);
       currentGame.messages.push({message: message});
       currentGame.actions.push({player: true, type: 'BB', bet: 10, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'preflop'});
       currentGame.player_chips -= 10;
       currentGame.currentBet = 10;
       message = messageGenerator(currentGame.actions[currentGame.actions.length-1]);
       currentGame.messages.push({message: message});

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
    let gameInfo = {
      player_sb: currentGame.player_sb,
      playerCards: currentGame.playerCards[currentGame.playerCards.length-1],
      playerChips: currentGame.player_chips,
      computerChips: currentGame.computer_chips,
      actions: currentGame.actions[currentGame.actions.length - 1],
      pot: currentGame.pot,
      message: currentGame.messages,
    }
    res.send(gameInfo);
  })

})

router.get('/street', (req, res) => {
  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;
    const currentGame = data.games[data.games.length-1];
    const currentAction = currentGame.actions[currentGame.actions.length - 1];
    const currentStreet = currentGame.street[currentGame.street.length-1];
    let gameInfo = '';
    if (currentAction.street === 'preflop') {
      if (currentGame.player_sb) {
        currentGame.actions.push({type: 'flopSB', player: true, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'flop', next_street: false });
        currentGame.actions.push({type: 'flopBB', player: false, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'flop', next_street: false});
      }
      else {
        currentGame.actions.push({type: 'flopBB', player: true, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'flop', next_street: false});
        currentGame.actions.push({type: 'flopSB', player: false, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'flop', next_street: false});
      }
      gameInfo = {
        player_sb: currentGame.player_sb,
        playerCards: currentGame.playerCards[currentGame.playerCards.length-1],
        playerChips: currentGame.player_chips,
        computerChips: currentGame.computer_chips,
        actions: currentGame.actions[currentGame.actions.length - 1],
        pot: currentGame.pot,
        message: currentGame.messages,
        street: [currentStreet.flop1, currentStreet.flop2, currentStreet.flop3],
      }
      res.send(gameInfo);
    }
    else if (currentAction.street === 'flop') {
      if (currentGame.player_sb) {
        currentGame.actions.push({type: 'turnSB', player: true, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'turn', next_street: false });
        currentGame.actions.push({type: 'flopBB', player: false, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'turn', next_street: false });
      }
      else {
        currentGame.actions.push({type: 'turnBB', player: true, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'turn', next_street: false });
        currentGame.actions.push({type: 'turnSB', player: false, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'turn', next_street: false });
      }
      gameInfo = {
        player_sb: currentGame.player_sb,
        playerCards: currentGame.playerCards[currentGame.playerCards.length-1],
        playerChips: currentGame.player_chips,
        computerChips: currentGame.computer_chips,
        actions: currentGame.actions[currentGame.actions.length - 1],
        pot: currentGame.pot,
        message: currentGame.messages,
        street: [currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn],
      }
      res.send(gameInfo);
    }
    else if (currentAction.street === 'turn') {
      if (currentGame.player_sb) {
        currentGame.actions.push({type: 'riverSB', player: true, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'river', next_street: false });
        currentGame.actions.push({type: 'riverBB', player: false, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'river', next_street: false });
      }
      else {
        currentGame.actions.push({type: 'riverBB', player: true, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'river', next_street: false });
        currentGame.actions.push({type: 'riverSB', player: false, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'river', next_street: false });
      }
      gameInfo = {
        player_sb: currentGame.player_sb,
        playerCards: currentGame.playerCards[currentGame.playerCards.length-1],
        playerChips: currentGame.player_chips,
        computerChips: currentGame.computer_chips,
        actions: currentGame.actions[currentGame.actions.length - 1],
        pot: currentGame.pot,
        message: currentGame.messages,
        street: [currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn, currentStreet.river],
      }
      res.send(gameInfo);
    }

    // Showdown Street
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
      const message = messageGenerator(bool);
      data.games.push({
        player_sb: bool,
        player_chips: 1500,
        computer_chips: 1500,
        pot: 0,
        game_completed: false,
        message: message,
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
