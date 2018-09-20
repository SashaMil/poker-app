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
    if (playerAction.bet > computerAction.bet) {
      amountToCall = playerAction.bet - computerAction.bet;
    }

    const decision = computerLogic(amountToCall, playerAction.pot, playerAction.computer_chips, playerAction.player_chips, currentHand.computerCards.card1, currentHand.computerCards.card2, playerAction.street, currentHand.street, playerAction.raiseCounter, playerAction.player_has_acted, playerAction.computer_has_acted, currentHand.player_button, playerAction.type, computerAction.bet);
    switch(decision[0]) {
      case 'FOLD':
        currentHand.hand_status = 'complete';
        currentHand.actions.push(
          { player: false,
            type: decision,
            street: playerAction.street,
            message: {computerMessage: 'Computer Folds' },
            pot: 0,
            player_chips: playerAction.player_chips + playerAction.pot,
            computer_chips: computerAction.computer_chips
        });
        break;
      case 'CHECK':
        if (!playerAction.player_has_acted) {
          currentHand.actions.push(
            { player: false,
              bet: 0,
              type: decision[0],
              player_act_next: true,
              street: playerAction.street,
              player_has_acted: false,
              computer_has_acted: true,
              next_street: false,
              pot: playerAction.pot,
              player_chips: playerAction.player_chips,
              computer_chips: playerAction.computer_chips,
              message: {computerMessage: 'Computer Checks'},
              raiseCounter: 0,
            });
        }
        else {
          currentHand.actions.push(
            { player: false,
              bet: 0,
              type: decision[0],
              player_act_next: currentHand.player_button,
              street: playerAction.street,
              player_has_acted: true,
              computer_has_acted: true,
              next_street: true,
              pot: playerAction.pot,
              player_chips: playerAction.player_chips,
              computer_chips: playerAction.computer_chips,
              message: {computerMessage: 'Computer Checks'},
              raiseCounter: 0,
            });
        }
        break;
      case 'CALL':
        if (!playerAction.player_has_acted) {
          currentHand.actions.push(
            { player: false,
              bet: 0,
              type: decision[0],
              player_act_next: true,
              street: playerAction.street,
              player_has_acted: false,
              computer_has_acted: true,
              next_street: false,
              pot: playerAction.pot + amountToCall,
              player_chips: playerAction.player_chips,
              computer_chips: playerAction.computer_chips - amountToCall,
              message: {computerMessage: `Computer calls ${amountToCall}`},
              raiseCounter: 0
            });
        }
        else {
          currentHand.actions.push(
            { player: false,
              bet: 0,
              type: decision[0],
              player_act_next: currentHand.player_button,
              street: playerAction.street,
              player_has_acted: true,
              computer_has_actd: true,
              next_street: true,
              pot: playerAction.pot + amountToCall,
              player_chips: playerAction.player_chips,
              computer_chips: playerAction.computer_chips - amountToCall,
              message: {computerMessage: `Computer calls ${amountToCall}`},
              raiseCounter: playerAction.raiseCounter
            });
        }
        break;
      case 'BET':
        currentHand.actions.push(
          { player: false,
            bet: decision[1],
            type: decision[0],
            player_act_next: true,
            street: playerAction.street,
            player_has_acted: playerAction.player_has_acted,
            computer_has_acted: true,
            next_street: false,
            pot: playerAction.pot + decision[1],
            player_chips: playerAction.player_chips,
            computer_chips: playerAction.computer_chips - decision[1],
            message: {computerMessage: `Computer bets ${decision[1]}`},
            raiseCounter: 1
          });
        break;
      case 'RAISE':
        currentHand.actions.push(
          { player: false,
            bet: decision[1],
            type: decision[0],
            player_act_next: true,
            street: playerAction.street,
            player_has_acted: playerAction.player_has_acted,
            computer_has_acted: true,
            next_street: false,
            pot: playerAction.pot + (decision[1] - computerAction.bet),
            player_chips: playerAction.player_chips,
            computer_chips: playerAction.computer_chips - (decision[1] - computerAction.bet),
            message: {computerMessage: `Computer raises to ${decision[1]}`},
            raiseCounter: playerAction.raiseCounter + 1
          });
        break;
      default:
        return 'Error';
    }

    data.save(function(err) {
      if (err) throw err;
      res.send('Computer Action Made');
    });

  })

})



module.exports = router;
