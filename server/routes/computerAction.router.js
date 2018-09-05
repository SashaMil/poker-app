const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const computerLogic = require('../modules/computerLogic.js');
const messageGenerator = require('../modules/messageGenerator.js');



router.post('/', (req, res) => {

  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;
    // Player Action will always be the most recent action (because i am adding two dummy actions for each street)
    const currentGame = data.games.slice(-1)[0];
    const currentHand = currentGame.hands.slice(-1)[0];
    const playerAction = currentHand.actions.slice(-1)[0];
    const computerAction = currentHand.actions.slice(-2)[0];
    let amountToCall = 0;

    console.log('waterbuffalo', playerAction);
    console.log('frog', computerAction);

    if (playerAction.bet > computerAction.bet) {
      amountToCall = playerAction.bet - computerAction.bet;
    }

    console.log(amountToCall);

    const decision = computerLogic(amountToCall, playerAction.pot, playerAction.computer_chips, playerAction.player_chips, currentHand.computerCards.card1, currentHand.computerCards.card2, playerAction.street, currentHand.street);
    console.log(decision);
    switch(decision[0]) {
      case 'FOLD':
        currentGame.current_hand_completed = true;
        currentGame.player_chips += currentGame.pot;
        currentGame.pot = 0;
        currentGame.actions.push({ player: false, type: decision, street: playerAction.street })

        break;
      case 'CHECK':
        if (!playerAction.player_has_acted) {
          currentGame.actions.push({ player: false, bet: 0, type: decision[0], player_act_next: true, street: playerAction.street, player_has_acted: false, computer_has_acted: true, next_street: false });
        }
        else {
          currentGame.actions.push({ player: false, bet: 0, type: decision[0], player_act_next: currentGame.player_sb, street: playerAction.street, player_has_acted: true, computer_has_acted: true, next_street: true });
        }
        break;
      case 'CALL':
        currentGame.computer_chips -= facingBet;
        currentGame.pot += facingBet;
        if (!playerAction.player_has_acted) {
          currentGame.actions.push({ player: false, bet: 0, callAmount: facingBet, type: decision[0], player_act_next: true, street: playerAction.street, player_has_acted: false, computer_has_acted: true, next_street: false });
        }
        else {
          currentGame.actions.push({ player: false, bet: 0, callAmount: facingBet, type: decision[0], player_act_next: currentGame.player_sb, street: playerAction.street, player_has_acted: true, computer_has_actd: true, next_street: true });
        }
        break;
      case 'BET':
        currentGame.computer_chips -= decision[1];
        currentGame.pot += decision[1];
        currentGame.actions.push({ player: false, bet: decision[1], type: decision[0], player_act_next: true, street: playerAction.street, player_has_acted: playerAction.player_has_acted, computer_has_acted: true, next_street: false });

        break;
      case 'RAISE':
        console.log('doggy', decision);
        currentGame.computer_chips -= decision[1];
        currentGame.pot += decision[1];
        currentGame.actions.push({ player: false, bet: decision[1], type: decision[0], player_act_next: true, street: playerAction.street, player_has_acted: playerAction.player_has_acted, computer_has_acted: true, next_street: false });
        break;

      default:
        return 'Error';
    }

    console.log(playerAction);
    const message = messageGenerator(currentGame.actions[currentGame.actions.length-1]);
    currentGame.messages.push({message: {computerMessage: message}})

    data.save(function(err) {
      if (err) throw err;
      res.send('Computer Action Made');
    });

  })

})



module.exports = router;
