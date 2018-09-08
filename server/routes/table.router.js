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

router.get('/gameInfo/:street', (req, res) => {

  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;
    const currentGame = data.games.slice(-1)[0];
    const currentHand = currentGame.hands.slice(-1)[0];
    const currentAction = currentHand.actions.slice(-1)[0];
    console.log(currentAction);
    console.log(currentHand.playerButton);
    console.log(req.params.street);
    // What do I need to send when there is a new hand: chips, pot, (got that),
    // player cards everytime (from hand object), have to send the most recent and second most recent actions.
    let gameInfo = {
      chips: {computerChips: currentAction.computer_chips, playerChips: currentAction.player_chips,
      pot: currentAction.pot},
      cards: {
        playerCards: currentHand.playerCards,
        flop : req.params.street === 'flop' ? [currentHand.street.flop1, currentHand.street.flop2, currentHand.street.flop3] : null,
        turn: req.params.street === 'turn' ? currentHand.street.turn : null,
        river: req.params.street === 'river' ? currentHand.street.river : null,
      },
      action: {currentAction: currentAction, playerButton: currentHand.player_button},
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

    if (currentAction.street === 'preflop') {
      playerplayerBestFiveCards = postFlopEvaluation([currentHand.playerCards.card1, currentHand.playerCards.card2, currentHand.street.flop1, currentHand.street.flop2, currentHand.street.flop3]);

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
          player_best_five_cards: playerBestFiveCards[1],
          player_best_five_cards_value: playerBestFiveCards[0],
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
          player_best_five_cards: playerBestFiveCards[1],
          player_best_five_cards_value: playerBestFiveCards[0],
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
          player_best_five_cards: playerplayerBestFiveCards[1],
          player_best_five_cards_value: playerplayerBestFiveCards[0],
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
          player_best_five_cards: playerplayerBestFiveCards[1],
          player_best_five_cards_value: playerplayerBestFiveCards[0],
        });
      }

      data.save(function(err) {
        if (err) throw err;
        res.send('flop');
        console.log('Games array updated successfully');
      });
    }

    else if (currentHand.street === 'flop') {

      playerplayerBestFiveCards = postFlopEvaluation([currentHand.playerCards.card1, currentHand.playerCards.card2, currentHand.street.flop1, currentHand.street.flop2, currentHand.street.flop3, currentHand.street.turn]);

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
          player_best_five_cards: playerplayerBestFiveCards[1],
          player_best_five_cards_value: playerplayerBestFiveCards[0],
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
          player_best_five_cards: playerplayerBestFiveCards[1],
          player_best_five_cards_value: playerplayerBestFiveCards[0],
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
          player_best_five_cards: playerplayerBestFiveCards[1],
          player_best_five_cards_value: playerplayerBestFiveCards[0],
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
          player_best_five_cards: playerplayerBestFiveCards[1],
          player_best_five_cards_value: playerplayerBestFiveCards[0],
        });
      }

      data.save(function(err) {
        if (err) throw err;
        res.send('turn');
        console.log('Games array updated successfully');
      });
    }

    else if (currentHand.street === 'turn') {

      playerplayerBestFiveCards = postFlopEvaluation([currentHand.playerCards.card1, currentHand.playerCards.card2, currentHand.street.flop1, currentHand.street.flop2, currentHand.street.flop3, currentHand.street.turn]);

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
          player_best_five_cards: playerplayerBestFiveCards[1],
          player_best_five_cards_value: playerplayerBestFiveCards[0],
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
          player_best_five_cards: playerplayerBestFiveCards[1],
          player_best_five_cards_value: playerplayerBestFiveCards[0],
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
          player_best_five_cards: playerplayerBestFiveCards[1],
          player_best_five_cards_value: playerplayerBestFiveCards[0],
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
          player_best_five_cards: playerplayerBestFiveCards[1],
          player_best_five_cards_value: playerplayerBestFiveCards[0],
        });

      }
      data.save(function(err) {
        if (err) throw err;
        res.send('river');
        console.log('Games array updated successfully');
      });
    }

    // else if (currentHand.street === 'river') {
    //   const currentPlayerCard = currentGame.playerCards[currentGame.playerCards.length-1];
    //   const currentComputerCard = currentGame.computerCards[currentGame.computerCards.length-1];
    //   const currentMessage = currentGame.messages[currentGame.messages.length-1];
    //   console.log('look here', currentMessage);
    //   playerplayerBestFiveCards = postFlopEvaluation([currentGame.playerCards[currentGame.playerCards.length-1].card1, currentGame.playerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn, currentStreet.river]);
    //   bestFiveComputerCards = postFlopEvaluation([currentGame.computerCards[currentGame.computerCards.length-1].card1, currentGame.computerCards[currentGame.playerCards.length-1].card2, currentStreet.flop1, currentStreet.flop2, currentStreet.flop3, currentStreet.turn, currentStreet.river]);
    //   console.log(playerplayerBestFiveCards);
    //   console.log(bestFiveComputerCards);
    //
    //   if (evaluateShowdown(currentPlayerCard.card1, currentPlayerCard.card2, currentComputerCard.card1, playerplayerBestFiveCards[0], bestFiveComputerCards[0], currentGame.street[currentGame.street.length-1])) {
    //     currentGame.player_chips += currentGame.pot;
    //     currentGame.messages.push({message: { playerMessage: `Player wins ${currentGame.pot}`}});
    //     gameInfo = {
    //       message: {playerHandValue: `Player wins ${currentGame.pot}`},
    //       currentHandCompleted: true,
    //     }
    //     currentGame.pot = 0;
    //   }
    //   else {
    //     currentGame.computer_chips += currentGame.pot;
    //     currentGame.messages.push({ message: {computerMessage: `Computer wins ${currentGame.pot}`}})
    //     gameInfo = {
    //       message: {playerHandValue: `ComputerWins ${currentGame.pot}`},
    //       currentHandCompleted: true,
    //     }
    //     currentGame.pot = 0;
    //   }
      // currentGame.current_hand_completed = true;
      // data.save(function(err) {
      //   if (err) throw err;
      //   res.send('yay');
      //   console.log('Games array updated successfully');
      // });

    // Showdown Street

  })
})

/**
 * POST route template
 */



module.exports = router;
