const express = require('express');
const router = express.Router();
const Deck = require('../modules/deck.js');
const Person = require('../models/Person');
const messageGenerator = require('../modules/messageGenerator.js');
const postFlopEvaluation = require('../modules/postFlopEvaluation.js');
const evaluateShowdown = require('../modules/evaluateShowdown');


router.post('/checkGameStatus', (req, res) => {
  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;
    // currentGame constant is the last game in game array
    const currentGame = data.games.slice(-1)[0];
    // if the current/last game we are checking is complete or this is a new account, we will add a new game object to the games array,
    console.log(data);
    console.log(data.games.length);
    if (data.games.length === 0 || currentGame.game_completed) {
      data.games.push({game_completed: false});
      data.save(function(err) {
        if (err) throw err;
        res.send(false);
      });
    }
    // otherwise, we will resume the previous hand and simply call a get request,
    // not doing that currently because we need to finish shuffle route,
    else {
      res.send(true);
    }
  })
});

// New game route which will be called if the previous game has ended/new user
 router.put('/newGame', (req, res) => {
   Person.findById(req.user._id, function(err, data) {
     if (err) throw err;
     const currentGame = data.games.slice(-1)[0];
     // pushing a hands object into the hands array, which is a property of the games object.
     currentGame.hands.push({hand_status: 'incomplete'});
     // currentHand constant is the last hand in a hand array (the one we just added the line above)
     const currentHand = currentGame.hands.slice(-1)[0];
     // Randomizing whether the player/computer will be selected as the button first
     const arr = [true, false];
     let bool = arr[Math.floor(Math.random() * (2))];
     currentHand.player_button = bool;
     // We are pushing the actions object into the array actions which is a property of hands
     currentHand.actions.push({player_chips: 1500, computer_chips: 1500, pot: 0, player_button: bool})
     data.save(function(err) {
       if (err) throw err;
       res.send(false);
     });
   })
 })


// We are dealing the cards, this route is used for new game or simply the next hand in a game
router.put('/shuffle', (req, res) => {
  // using the Deck model to instantiate a new deck
  let deck = new Deck;
  // Method that shuffles deck
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

  // Dealing cards and burning to simulate real world poker
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
    const currentGame = data.games.slice(-1)[0];

    const lastHand = currentGame.hands.slice(-1)[0];
    // Will allow us to set values like player chip, computer chips, position to be based off the last hand
    const lastAction = lastHand.actions.slice(-1)[0];

    let actions = [];

    let playerMessage = '';
    let computerMessage = '';
    // Setting the actions array we will be pushing to the hands object dependent on the last player position
    // Need to add messages as well, not storing messages in a separate array anymore, they will now be attached to each action
    if (lastHand.player_button) {
      actions = [{player: false, type: 'SB', street: 'preflop', bet: 5, player_act_next: false, player_has_acted: false, computer_has_acted: false, next_street: false, player_chips: 1490, computer_chips: 1495, pot: 15, raiseCounter: 0 }, {player: true, type: 'BB', street: 'preflop', bet: 10, player_act_next: false, player_has_acted: false, computer_has_acted: false, next_street: false, player_chips: lastAction.player_chips, computer_chips: lastAction.computer_chips, pot: lastAction.pot, raiseCounter: 0 }];
    } else {
      actions = [{player: true, type: 'SB', street: 'preflop', bet: 5, player_act_next: true, player_has_acted: false, computer_has_acted: false, next_street: false, player_chips: 1495, computer_chips: 1490, pot: 15, raiseCounter: 0 }, {player: false, type: 'BB', street: 'preflop', bet: 10, player_act_next: true, player_has_acted: false, computer_has_acted: false, next_street: false, player_chips: lastAction.player_chips, computer_chips: lastAction.player_chips, pot: lastAction.pot, raiseCounter: 0 }];
    }

    // pushing a new hands object with new cards, position (flipping it from the last), and hand status
    currentGame.hands.push({playerCards: {card1: playerCard1, card2: playerCard2}, computerCards: {card1: computerCard1, card2: computerCard2}, street: {flop1: flopCard1, flop2: flopCard2, flop3: flopCard3, turn: turnCard1, river: riverCard1}, player_button: !lastHand.player_button, hand_status: 'incomplete', actions: actions});


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
      chips: {computerChips: currentGame.computer_chips, playerChips: currentGame.player_chips, pot: currentGame.pot},
      cards: {playerCards: currentGame.playerCards[currentGame.playerCards.length-1]},
      actions: {lastAction: currentGame.actions[currentGame.actions.length - 1], playerButton: currentGame.player_sb},
      message: currentMessage,
    }
    console.log(gameInfo);
    res.send(gameInfo);
  })

})

router.get('/street', (req, res) => {
  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;
    const currentGame = data.games[data.games.length-1];
    const currentAction = currentGame.actions[currentGame.actions.length - 1];
    const currentStreet = currentGame.street[currentGame.street.length-1];
    console.log('dinosaur bones', currentAction);
    console.log(currentStreet);
    console.log('howdy', currentAction.street);
    let gameInfo = '';
    let playerBestFiveCards = '';
    let bestFiveComputerCards = '';
    if (currentAction.street === 'preflop') {
      playerBestFiveCards = postFlopEvaluation([currentGame.playerCards[currentGame.playerCards.length-1].card1, currentGame.playerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3]);
      bestFiveComputerCards = postFlopEvaluation([currentGame.computerCards[currentGame.computerCards.length-1].card1, currentGame.computerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3]);

      if (currentGame.player_sb) {
        currentGame.actions.push({type: 'flopSB', player: true, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'flop', next_street: false});
        currentGame.actions.push({type: 'flopBB', player: false, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'flop', next_street: false, player_best_five_cards: playerBestFiveCards[1], player_best_five_cards_value: playerBestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
      }
      else {
        currentGame.actions.push({type: 'flopBB', player: true, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'flop', next_street: false});
        currentGame.actions.push({type: 'flopSB', player: false, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'flop', next_street: false, player_best_five_cards: playerBestFiveCards[1], player_best_five_cards_value: playerBestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0]});
      }
      gameInfo = {
        cards: {flop: [currentStreet.flop1, currentStreet.flop2, currentStreet.flop3]},
        message: {playerHandValue: playerBestFiveCards[1]},
      }
      data.save(function(err) {
        if (err) throw err;
        res.send(gameInfo);
        console.log('Games array updated successfully');
      });
    }
    else if (currentAction.street === 'flop') {
      playerBestFiveCards = postFlopEvaluation([currentGame.playerCards[currentGame.playerCards.length-1].card1, currentGame.playerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn]);
      bestFiveComputerCards = postFlopEvaluation([currentGame.computerCards[currentGame.computerCards.length-1].card1, currentGame.computerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn]);

      if (currentGame.player_sb) {
        currentGame.actions.push({type: 'turnSB', player: true, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'turn', next_street: false, player_best_five_cards: playerBestFiveCards[1], player_best_five_cards_value: playerBestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
        currentGame.actions.push({type: 'turnBB', player: false, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'turn', next_street: false, player_best_five_cards: playerBestFiveCards[1], player_best_five_cards_value: playerBestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
      }
      else {
        currentGame.actions.push({type: 'turnBB', player: true, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'turn', next_street: false, player_best_five_cards: playerBestFiveCards[1], player_best_five_cards_value: playerBestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
        currentGame.actions.push({type: 'turnSB', player: false, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'turn', next_street: false, player_best_five_cards: playerBestFiveCards[1], player_best_five_cards_value: playerBestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
      }
      gameInfo = {
        cards: {turn: currentStreet.turn},
        message: {playerHandValue: playerBestFiveCards[1]},
      }
      data.save(function(err) {
        if (err) throw err;
        res.send(gameInfo);
        console.log('Games array updated successfully');
      });
    }
    else if (currentAction.street === 'turn') {
      playerBestFiveCards = postFlopEvaluation([currentGame.playerCards[currentGame.playerCards.length-1].card1, currentGame.playerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn, currentStreet.river]);
      bestFiveComputerCards = postFlopEvaluation([currentGame.computerCards[currentGame.computerCards.length-1].card1, currentGame.computerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn, currentStreet.river]);

      if (currentGame.player_sb) {
        currentGame.actions.push({type: 'riverSB', player: true, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'river', next_street: false, player_best_five_cards: playerBestFiveCards[1], player_best_five_cards_value: playerBestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
        currentGame.actions.push({type: 'riverBB', player: false, bet: 0, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'river', next_street: false, player_best_five_cards: playerBestFiveCards[1], player_best_five_cards_value: playerBestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
      }
      else {
        currentGame.actions.push({type: 'riverBB', player: true, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'river', next_street: false, player_best_five_cards: playerBestFiveCards[1], player_best_five_cards_value: playerBestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
        currentGame.actions.push({type: 'riverSB', player: false, bet: 0, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'river', next_street: false, player_best_five_cards: playerBestFiveCards[1], player_best_five_cards_value: playerBestFiveCards[0], computer_best_five_cards: bestFiveComputerCards[1], computer_best_five_cards_value: bestFiveComputerCards[0] });
      }
      gameInfo = {
        cards: {river: currentStreet.river},
        message: {playerHandValue: playerBestFiveCards[1]},
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
      const currentComputerCard = currentGame.computerCards[currentGame.computerCards.length-1];
      const currentMessage = currentGame.messages[currentGame.messages.length-1];
      console.log('look here', currentMessage);
      playerBestFiveCards = postFlopEvaluation([currentGame.playerCards[currentGame.playerCards.length-1].card1, currentGame.playerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn, currentStreet.river]);
      bestFiveComputerCards = postFlopEvaluation([currentGame.computerCards[currentGame.computerCards.length-1].card1, currentGame.computerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn, currentStreet.river]);
      console.log(playerBestFiveCards);
      console.log(bestFiveComputerCards);

      if (evaluateShowdown(currentPlayerCard.card1, currentPlayerCard.card2, currentComputerCard.card1, playerBestFiveCards[0], bestFiveComputerCards[0], currentGame.street[currentGame.street.length-1])) {
        currentGame.player_chips += currentGame.pot;
        currentGame.messages.push({message: { playerMessage: `Player wins ${currentGame.pot}`}});
        gameInfo = {
          message: {playerHandValue: `Player wins ${currentGame.pot}`},
          currentHandCompleted: true,
        }
        currentGame.pot = 0;
      }
      else {
        currentGame.computer_chips += currentGame.pot;
        currentGame.messages.push({ message: {computerMessage: `Computer wins ${currentGame.pot}`}})
        gameInfo = {
          message: {playerHandValue: `ComputerWins ${currentGame.pot}`},
          currentHandCompleted: true,
        }
        currentGame.pot = 0;
      }
      currentGame.current_hand_completed = true;
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



module.exports = router;
