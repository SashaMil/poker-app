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
    console.log('howdy', data.games);
    console.log(data.games.length);
    if (data.games.length === 0 || currentGame.game_completed) {
      data.games.push({game_completed: false});
      data.save(function(err) {
        if (err) throw err;
        res.send(true);
      });
    }
    // otherwise, we will resume the previous hand and simply call a get request,
    // not doing that currently because we need to finish shuffle route,
    else {
      res.send(false);
    }
  })
});

// We are dealing the cards, this route is used for new game or simply the next hand in a game
router.put('/shuffle/:newGame', (req, res) => {
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

    let actions = [];

    // If it is a New Game, I am hardcoding starting chip amounts based on position here.
    // If it is not a new game, the computer and player will have the same chips from the last action
    if (req.params.newGame === 'newGame') {
      // determining who goes first when new game starts
      console.log('in here');
      const arr = [true, false];
      let bool = arr[Math.floor(Math.random() * (2))];
      if (!bool) {
        actions = [
          {player: false, type: 'Button', street: 'preflop', bet: 5, player_act_next: false, player_has_acted: false, computer_has_acted: false, next_street: false, player_chips: 1490, computer_chips: 1495, pot: 15, raiseCounter: 0 },

          {player: true, type: 'BB', street: 'preflop', bet: 10, player_act_next: false, player_has_acted: false, computer_has_acted: false, next_street: false, player_chips: 1490, computer_chips: 1495, pot: 15, raiseCounter: 0, message: {playerMessage: 'Player on BB', computerMessage: 'Computer on Button'} }
      ];
      } else {
        actions = [
          {player: false, type: 'BB', street: 'preflop', bet: 10, player_act_next: true, player_has_acted: false, computer_has_acted: false, next_street: false, player_chips: 1490, computer_chips: 1495, pot: 15, raiseCounter: 0 },

          {player: true, type: 'Button', street: 'preflop', bet: 5, player_act_next: true, player_has_acted: false, computer_has_acted: false, next_street: false, player_chips: 1495, computer_chips: 1490, pot: 15, raiseCounter: 0, message: {playerMessage: 'Player on Button', computerMessage: 'Computer on BB'}  },
      ];

      }

      currentGame.hands.push({playerCards: {card1: playerCard1, card2: playerCard2}, computerCards: {card1: computerCard1, card2: computerCard2}, street: {flop1: flopCard1, flop2: flopCard2, flop3: flopCard3, turn: turnCard1, river: riverCard1}, player_button: bool, hand_status: 'incomplete', actions: actions});

    }
    else {
      const lastAction = lastHand.actions.slice(-1)[0];
      if (lastHand.player_button) {
        actions = [
          {player: false, type: 'Button', street: 'preflop', bet: 5, player_act_next: false, player_has_acted: false, computer_has_acted: false, next_street: false, player_chips: lastAction.player_chips, computer_chips: lastAction.computer_chips, pot: 15, raiseCounter: 0 },

          {player: true, type: 'BB', street: 'preflop', bet: 10, player_act_next: false, player_has_acted: false, computer_has_acted: false, next_street: false, player_chips: lastAction.player_chips, computer_chips: lastAction.computer_chips, pot: 15, raiseCounter: 0, message: {playerMessage: 'Player on BB', computerMessage: 'Computer on Button'} }
      ];
      } else {
        actions = [
          {player: false, type: 'BB', street: 'preflop', bet: 10, player_act_next: true, player_has_acted: false, computer_has_acted: false, next_street: false, player_chips: lastAction.player_chips, computer_chips: lastAction.player_chips, pot: 15, raiseCounter: 0 },

          {player: true, type: 'Button', street: 'preflop', bet: 5, player_act_next: true, player_has_acted: false, computer_has_acted: false, next_street: false, player_chips: lastAction.player_chips, computer_chips: lastAction.computer_chips, pot: 15, raiseCounter: 0, message: {playerMessage: 'Player on Button', computerMessage: 'Computer on BB'} }
        ];

      }

      currentGame.hands.push({playerCards: {card1: playerCard1, card2: playerCard2}, computerCards: {card1: computerCard1, card2: computerCard2}, street: {flop1: flopCard1, flop2: flopCard2, flop3: flopCard3, turn: turnCard1, river: riverCard1}, player_button: !lastHand.player_button, hand_status: 'incomplete', actions: actions});

    }

    // pushing a new hands object with new cards, position (flipping it from the last), and hand status


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
    const currentGame = data.games.slice(-1)[0];
    const currentHand = currentGame.hands.slice(-1)[0];
    const currentAction = currentHand.actions.slice(-1)[0];
    console.log(currentAction);
    console.log(currentHand.playerButton);
    console.log(currentAction);

    let street = {};
    if (currentAction.street === 'flop') {
      street.flop = [currentHand.street.flop1, currentHand.street.flop2, currentHand.street.flop3]
    }
    else if (currentAction.street === 'turn') {
      street.flop = [currentHand.street.flop1, currentHand.street.flop2, currentHand.street.flop3];
      street.turn = currentHand.street.turn;
    }
    else if (currentAction.street === 'river') {
      street.flop = [currentHand.street.flop1, currentHand.street.flop2, currentHand.street.flop3];
      street.turn = currentHand.street.turn;
      street.river = currentHand.street.river;
    }
    // What do I need to send when there is a new hand: chips, pot, (got that),
    // player cards everytime (from hand object), have to send the most recent and second most recent actions.
    let gameInfo = {
      chips: {computerChips: currentAction.computer_chips, playerChips: currentAction.player_chips,
      pot: currentAction.pot},
      cards: {
        playerCards: currentHand.playerCards,
        street: street
      },
      action: {currentAction: currentAction, playerButton: currentHand.player_button},
      currentHandCompleted: currentHand.game_completed,
    }


    res.send(gameInfo);
  })

})

router.get('/street', (req, res) => {
  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;

    const currentGame = data.games.slice(-1)[0];
    const currentHand = currentGame.hands.slice(-1)[0];
    const currentAction = currentHand.actions.slice(-1)[0];

    let gameInfo = '';
    let playerBestFiveCards = '';

    console.log('streetAction', currentAction);

    if (currentAction.street === 'preflop') {
      playerBestFiveCards = postFlopEvaluation([currentHand.playerCards.card1, currentHand.playerCards.card2, currentHand.street.flop1, currentHand.street.flop2, currentHand.street.flop3]);


    console.log('pinnochio', playerBestFiveCards);

      if (currentHand.player_button) {
        currentHand.actions.push({
          type: 'flopBB',
          player: false,
          bet: 0,
          player_act_next: true,
          player_has_acted: false,
          computer_has_acted: false,
          street: 'flop',
          next_street: false,
          pot: currentAction.pot,
          player_chips: currentAction.player_chips,
          computer_chips: currentAction.computer_chips,
          raiseCounter: 0,
          player_best_five_cards: playerBestFiveCards[0],
          player_best_five_cards_name: playerBestFiveCards[1],
        });

        currentHand.actions.push({
          type: 'flopButton',
          player: true,
          bet: 0,
          player_act_next: true,
          player_has_acted: false,
          computer_has_acted: false,
          street: 'flop',
          next_street: false,
          pot: currentAction.pot,
          player_chips: currentAction.player_chips,
          computer_chips: currentAction.computer_chips,
          raiseCounter: 0,
          player_best_five_cards: playerBestFiveCards[0],
          player_best_five_cards_name: playerBestFiveCards[1],
        });

      }

      else {
        currentHand.actions.push({
          type: 'flopButton',
          player: false,
          bet: 0,
          player_act_next: false,
          player_has_acted: false,
          computer_has_acted: false,
          street: 'flop',
          next_street: false,
          pot: currentAction.pot,
          player_chips: currentAction.player_chips,
          computer_chips: currentAction.computer_chips,
          raiseCounter: 0,
          player_best_five_cards: playerBestFiveCards[0],
          player_best_five_cards_name: playerBestFiveCards[1],
        });

        currentHand.actions.push({
          type: 'flopBB',
          player: true,
          bet: 0,
          player_act_next: false,
          player_has_acted: false,
          computer_has_acted: false,
          street: 'flop',
          next_street: false,
          pot: currentAction.pot,
          player_chips: currentAction.player_chips,
          computer_chips: currentAction.computer_chips,
          raiseCounter: 0,
          player_best_five_cards: playerBestFiveCards[0],
          player_best_five_cards_name: playerBestFiveCards[1],
        });
      }

      data.save(function(err) {
        if (err) throw err;
        res.send('flop');
        console.log('Games array updated successfully');
      });
    }

    else if (currentAction.street === 'flop') {

      playerBestFiveCards = postFlopEvaluation([currentHand.playerCards.card1, currentHand.playerCards.card2, currentHand.street.flop1, currentHand.street.flop2, currentHand.street.flop3, currentHand.street.turn]);

      if (currentGame.player_button) {

        currentHand.actions.push({
          type: 'turnBB',
          player: false,
          bet: 0,
          player_act_next: true,
          player_has_acted: false,
          computer_has_acted: false,
          street: 'turn',
          next_street: false,
          pot: currentAction.pot,
          player_chips: currentAction.player_chips,
          computer_chips: currentAction.computer_chips,
          raiseCounter: 0,
          player_best_five_cards: playerBestFiveCards[0],
          player_best_five_cards_name: playerBestFiveCards[1],
        });

        currentHand.actions.push({
          type: 'turnButton',
          player: true,
          bet: 0,
          player_act_next: true,
          player_has_acted: false,
          computer_has_acted: false,
          street: 'turn',
          next_street: false,
          pot: currentAction.pot,
          player_chips: currentAction.player_chips,
          computer_chips: currentAction.computer_chips,
          raiseCounter: 0,
          player_best_five_cards: playerBestFiveCards[0],
          player_best_five_cards_name: playerBestFiveCards[1],
        });
      }
      else {

        currentHand.actions.push({
          type: 'turnBB',
          player: true,
          bet: 0,
          player_act_next: false,
          player_has_acted: false,
          computer_has_acted: false,
          street: 'turn',
          next_street: false,
          pot: currentAction.pot,
          player_chips: currentAction.player_chips,
          computer_chips: currentAction.computer_chips,
          raiseCounter: 0,
          player_best_five_cards: playerBestFiveCards[0],
          player_best_five_cards_name: playerBestFiveCards[1],
        });

        currentHand.actions.push({
          type: 'turnSB',
          player: false,
          bet: 0,
          player_act_next: false,
          player_has_acted: false,
          computer_has_acted: false,
          street: 'turn',
          next_street: false,
          pot: currentAction.pot,
          player_chips: currentAction.player_chips,
          computer_chips: currentAction.computer_chips,
          raiseCounter: 0,
          player_best_five_cards: playerBestFiveCards[0],
          player_best_five_cards_name: playerBestFiveCards[1],
        });
      }

      data.save(function(err) {
        if (err) throw err;
        res.send('turn');
        console.log('Games array updated successfully');
      });
    }

    else if (currentAction.street === 'turn') {

      playerBestFiveCards = postFlopEvaluation([currentHand.playerCards.card1, currentHand.playerCards.card2, currentHand.street.flop1, currentHand.street.flop2, currentHand.street.flop3, currentHand.street.turn]);

      if (currentHand.player_button) {

        currentHand.actions.push({
          type: 'riverBB',
          player: false,
          bet: 0,
          player_act_next: true,
          player_has_acted: false,
          computer_has_acted: false,
          street: 'river',
          next_street: false,
          pot: currentAction.pot,
          player_chips: currentAction.player_chips,
          computer_chips: currentAction.computer_chips,
          raiseCounter: 0,
          player_best_five_cards: playerBestFiveCards[0],
          player_best_five_cards_name: playerBestFiveCards[1],
        });

        currentHand.actions.push({
          type: 'riverSB',
          player: true,
          bet: 0,
          player_act_next: true,
          player_has_acted: false,
          computer_has_acted: false,
          street: 'river',
          next_street: false,
          pot: currentAction.pot,
          player_chips: currentAction.player_chips,
          computer_chips: currentAction.computer_chips,
          raiseCounter: 0,
          player_best_five_cards: playerBestFiveCards[0],
          player_best_five_cards_name: playerBestFiveCards[1],
        });
      }

      else {

        currentHand.actions.push({
          type: 'riverSB',
          player: false,
          bet: 0,
          player_act_next: false,
          player_has_acted: false,
          computer_has_acted: false,
          street: 'river',
          next_street: false,
          pot: currentAction.pot,
          player_chips: currentAction.player_chips,
          computer_chips: currentAction.computer_chips,
          raiseCounter: 0,
          player_best_five_cards: playerBestFiveCards[0],
          player_best_five_cards_name: playerBestFiveCards[1],
        });

        currentHand.actions.push({
          type: 'riverBB',
          player: true,
          bet: 0,
          player_act_next: false,
          player_has_acted: false,
          computer_has_acted: false,
          street: 'river',
          next_street: false,
          pot: currentAction.pot,
          player_chips: currentAction.player_chips,
          computer_chips: currentAction.computer_chips,
          raiseCounter: 0,
          player_best_five_cards: playerBestFiveCards[0],
          player_best_five_cards_name: playerBestFiveCards[1],
        });

      }
      data.save(function(err) {
        if (err) throw err;
        res.send('river');
        console.log('Games array updated successfully');
      });
    }

    else if (currentAction.street === 'river') {
      const playerCard1 = currentHand.playerCards.card1;
      const playerCard2 = currentHand.playerCards.card2;
      const computerCard1 = currentHand.playerCards.card2;
      const computerCard2 = currentHand.computerCards.card2;
      const playerWon = evaluateShowdown(playerCard1, playerCard2, computerCard1, computerCard2, currentHand.street);

      if (playerWon) {
        currentHand.actions.push({
          type: 'showdown',
          player: false,
          bet: 0,
          street: 'showdown',
          next_street: false,
          pot: 0,
          player_chips: currentAction.player_chips + currentAction.pot,
          computer_chips: currentAction.computer_chips,
          raiseCounter: 0,
          message: `Player wins ${currentAction.player_chips + currentAction.pot}`,
        });
      }
      else {
        currentHand.actions.push({
          type: 'showdown',
          player: false,
          bet: 0,
          street: 'showdown',
          next_street: false,
          pot: 0,
          computer_chips: currentAction.computer_chips + currentAction.pot,
          player_chips: currentAction.player_chips,
          raiseCounter: 0,
          message: `Computer wins ${currentAction.computer_chips + currentAction.pot}`,
        });
      }

      currentHand.game_completed = true;


      data.save(function(err) {
        if (err) throw err;
        res.send('yay');
        console.log('Games array updated successfully');
      });
    }
  })
})




module.exports = router;
