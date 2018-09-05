const express = require('express');
const router = express.Router();
const Deck = require('../modules/deck.js');
const Person = require('../models/Person');
const messageGenerator = require('../modules/messageGenerator.js');
const postFlopEvaluation = require('../modules/postFlopEvaluation.js');
const evaluateShowdown = require('../modules/evaluateShowdown')

router.post('/checkGameStatus', (req, res) => {
  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;
    const lastGame = data.games[data.games.length-1];
    if (lastGame.game_completed) {
      data.games.push({game_completed: false});
      data.save(function(err) {
        if (err) throw err;
        res.send(false);
      });
    }
    else {
      res.send(true);
    }
  })
});

 router.put('/newGame', (req, res) => {
   Person.findById(req.user._id, function(err, data) {
     if (err) throw err;
     console.log('hello',data.games.hands);
     const arr = [true, false];
     let bool = arr[Math.floor(Math.random() * (2))];
     data.games.hands.push({ player_button: bool, hand_status: 'incomplete' })
     data.games.hands.actions.push({player_chips: 1500, computer_chips: 1500, pot: 0})
     res.send('Success');
   })
 })



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
    let currentHand = data.games[data.games.length-1].hands;
     currentHand.playerCards.card1 = playerCard1;
     currentHand.playerCards.card2 = playerCard2;
     currentHand.computerCards.card1 = computerCard1;
     currentHand.computerCards.card2 = computerCard2;

     currentHand.player_button = !currentHand.player_button;
     let playerMessage = '';
     let computerMessage = '';

     if (currentGame.player_sb) {
       currentHand.actions.push({player: true, type: 'SB', , street: 'preflop', bet: 5, player_act_next: true, player_has_acted: false, computer_has_acted: false, next_street: false });
       currentHand.actions.player_chips -= 5;
       playerMessage = messageGenerator(currentGame.actions[currentGame.actions.length-1]);
       currentGame.actions.push({player: false, type: 'BB', bet: 10, player_act_next: true, player_has_acted: false, computer_has_acted: false, street: 'preflop'});
       currentGame.computer_chips -= 10;
       computerMessage = messageGenerator(currentGame.actions[currentGame.actions.length-1]);
       currentGame.currentBet = 10;
       currentHand.messages.push({message: {playerMessage: playerMessage, computerMessage: computerMessage}});

     } else {
       currentGame.actions.push({player: false, type: 'SB', bet: 5, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'preflop'});
       currentGame.computer_chips -= 5;
       computerMessage = messageGenerator(currentGame.actions[currentGame.actions.length-1]);
       currentGame.actions.push({player: true, type: 'BB', bet: 10, player_act_next: false, player_has_acted: false, computer_has_acted: false, street: 'preflop'});
       currentGame.player_chips -= 10;
       currentGame.currentBet = 10;
       playerMessage = messageGenerator(currentGame.actions[currentGame.actions.length-1]);
       currentGame.messages.push({message: {playerMessage: playerMessage, computerMessage: computerMessage}});

     }

     currentGame.street.push({flop1: flopCard1, flop2: flopCard2, flop3: flopCard3, turn: turnCard1, river: riverCard1});

     currentGame.pot = 0;
     currentGame.pot += 15;
     currentGame.current_hand_completed = false;

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
    const currentMessage = currentGame.messages[currentGame.messages.length-1];
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
