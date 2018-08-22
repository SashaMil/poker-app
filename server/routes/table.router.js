const express = require('express');
const router = express.Router();
const Deck = require('../modules/deck.js');
const Person = require('../models/Person');
const messageGenerator = require('../modules/messageGenerator.js');
const postFlopEvaluation = require('../modules/postFlopEvaluation.js');
const evaluateShowdown = require('../modules/evaluateShowdown')

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
       console.log('hello');
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
       console.log('there');
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
    const currentGame = data.games[data.games.length-1];
    const currentStreet = currentGame.street[currentGame.street.length-1];
    let gameInfo = {
      player_sb: currentGame.player_sb,
      playerCards: currentGame.playerCards[currentGame.playerCards.length-1],
      playerChips: currentGame.player_chips,
      computerChips: currentGame.computer_chips,
      actions: currentGame.actions[currentGame.actions.length - 1],
      pot: currentGame.pot,
      message: currentGame.messages,
      street: currentStreet[0],
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
    let bestFiveCards = '';
    let bestFiveComputerCards = '';
    if (currentAction.street === 'preflop') {
      bestFiveCards = postFlopEvaluation([currentGame.playerCards[currentGame.playerCards.length-1].card1, currentGame.playerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3]);
      bestFiveComputerCards = postFlopEvaluation([currentGame.computerCards[currentGame.computerCards.length-1].card1, currentGame.computerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3]);

      if (currentGame.player_sb) {
        currentGame.actions.push({type: 'flopSB', player: true, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'flop', next_street: false});
        currentGame.actions.push({type: 'flopBB', player: false, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'flop', next_street: false, player_best_five_cards: bestFiveCards[1], player_best_five_cards_value: bestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
      }
      else {
        currentGame.actions.push({type: 'flopBB', player: true, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'flop', next_street: false});
        currentGame.actions.push({type: 'flopSB', player: false, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'flop', next_street: false, player_best_five_cards: bestFiveCards[1], player_best_five_cards_value: bestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0]});
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
        best_five_cards: bestFiveCards,
      }
      data.save(function(err) {
        if (err) throw err;
        res.send(gameInfo);
        console.log('Games array updated successfully');
      });
    }
    else if (currentAction.street === 'flop') {
      bestFiveCards = postFlopEvaluation([currentGame.playerCards[currentGame.playerCards.length-1].card1, currentGame.playerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn]);
      bestFiveComputerCards = postFlopEvaluation([currentGame.computerCards[currentGame.computerCards.length-1].card1, currentGame.computerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn]);

      if (currentGame.player_sb) {
        currentGame.actions.push({type: 'turnSB', player: true, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'turn', next_street: false, player_best_five_cards: bestFiveCards[1], player_best_five_cards_value: bestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
        currentGame.actions.push({type: 'flopBB', player: false, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'turn', next_street: false, player_best_five_cards: bestFiveCards[1], player_best_five_cards_value: bestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
      }
      else {
        currentGame.actions.push({type: 'turnBB', player: true, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'turn', next_street: false, player_best_five_cards: bestFiveCards[1], player_best_five_cards_value: bestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
        currentGame.actions.push({type: 'turnSB', player: false, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'turn', next_street: false, player_best_five_cards: bestFiveCards[1], player_best_five_cards_value: bestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
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
      data.save(function(err) {
        if (err) throw err;
        res.send(gameInfo);
        console.log('Games array updated successfully');
      });
    }
    else if (currentAction.street === 'turn') {
      bestFiveCards = postFlopEvaluation([currentGame.playerCards[currentGame.playerCards.length-1].card1, currentGame.playerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn, currentStreet.river]);
      bestFiveComputerCards = postFlopEvaluation([currentGame.computerCards[currentGame.computerCards.length-1].card1, currentGame.computerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn, currentStreet.river]);

      if (currentGame.player_sb) {
        currentGame.actions.push({type: 'riverSB', player: true, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'river', next_street: false, player_best_five_cards: bestFiveCards[1], player_best_five_cards_value: bestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
        currentGame.actions.push({type: 'riverBB', player: false, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'river', next_street: false, player_best_five_cards: bestFiveCards[1], player_best_five_cards_value: bestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
      }
      else {
        currentGame.actions.push({type: 'riverBB', player: true, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'river', next_street: false, player_best_five_cards: bestFiveCards[1], player_best_five_cards_value: bestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
        currentGame.actions.push({type: 'riverSB', player: false, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'river', next_street: false, player_best_five_cards: bestFiveCards[1], player_best_five_cards_value: bestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
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
      console.log(gameInfo.street);
      data.save(function(err) {
        if (err) throw err;
        res.send(gameInfo);
        console.log('Games array updated successfully');
      });
    }
    else if (currentAction.street === 'river') {
      const currentPlayerCard = currentGame.playerCards[currentGame.playerCards.length-1];
      const currentComputerCard = currentGame.computerCards[currentGame.computerCards.length-1]
      bestFiveCards = postFlopEvaluation([currentGame.playerCards[currentGame.playerCards.length-1].card1, currentGame.playerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn, currentStreet.river]);
      bestFiveComputerCards = postFlopEvaluation([currentGame.computerCards[currentGame.computerCards.length-1].card1, currentGame.computerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn, currentStreet.river]);
      console.log(bestFiveCards);
      console.log(bestFiveComputerCards);
      if (evaluateShowdown(currentPlayerCard.card1, currentPlayerCard.card2, currentComputerCard.card1, bestFiveCards[0], bestFiveComputerCards[0], currentGame.street[currentGame.street.length-1])) {
        currentGame.player_chips += currentGame.pot;
        currentGame.messages.push({ message: `Player wins ${currentGame.pot}`})
        gameInfo = {
          player_sb: currentGame.player_sb,
          playerCards: currentGame.playerCards[currentGame.playerCards.length-1],
          current_hand_completed: true,
          actions: currentGame.actions[currentGame.actions.length - 1],
          message: currentGame.messages,
          pot: currentGame.pot,
          street: [currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn, currentStreet.river],
        }
        currentGame.pot = 0;
      }
      else {
        currentGame.computer_chips += currentGame.pot;
        currentGame.messages.push({ message: `Computer wins ${currentGame.pot}`})
        gameInfo = {
          player_sb: currentGame.player_sb,
          playerCards: currentGame.playerCards[currentGame.playerCards.length-1],
          actions: currentGame.actions[currentGame.actions.length - 1],
          current_hand_completed: true,
          message: currentGame.messages,
          pot: currentGame.pot,
          street: [currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn, currentStreet.river],
        }
        currentGame.pot = 0;
      }
      data.save(function(err) {
        if (err) throw err;
        res.send(gameInfo);
        console.log('Games array updated successfully');
      });
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

router.get('/history', (req, res) => {
  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;
    let objToSend = {};
    objToSend.actions = data.games[0].actions;
    objToSend.messages = data.games[0].messages;
    objToSend.playerCards = data.games[0].playerCards;
    objToSend.street = data.games[0].street;

    res.send(objToSend);

  })
});


module.exports = router;
