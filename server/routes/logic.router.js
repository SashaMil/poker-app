const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const computerLogic = require('../modules/computerLogic.js')


router.post('/computerDecision', (req, res) => {

  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;
    const currentGame = data.games[data.games.length-1];

    const currentCards = currentGame.computerCards[currentGame.computerCards.length-1];
    const playerAction = currentGame.actions[currentGame.actions.length - 1];
    const computerAction = currentGame.actions[currentGame.actions.length - 2];
    const callAmount = currentGame.pot - computerAction.bet;
    const streetCards = currentGame.street;
    const decision = computerLogic(callAmount, currentGame.pot, currentGame.computer_chips, currentGame.player_chips, currentCards.card1, currentCards.card2, playerAction.street, streetCards)
    console.log(computerAction);
    console.log(playerAction);

    switch(decision) {
      case 'FOLD':
        currentGame.current_hand_completed = true;
        currentGame.player_chips += currentGame.pot;
        currentGame.pot = 0;
        currentGame.actions.push({ player: false, type: decision, street: playerAction.street })

        break;
      case 'CHECK':

        break;
      case 'CALL':
        currentGame.computer_chips -= callAmount;
        currentGame.pot += callAmount;
        if (!playerAction.has_acted) {
          currentGame.actions.push({ player: false, type: decision, player_act_next: true, street: playerAction.street })
        }
        else {
          if (playerAction.street === 'preflop') {
            playerAction.street = 'flop';
          }
          else if (playerAction.street === 'flop') {
            playerAction.street = 'turn';
          }
          else if (playerAction.street === 'turn') {
            playerAction.street = 'river';
          }
          else {
            playerAction.street = 'showdown'
          }
          currentGame.actions.push({ player: false, type: decision, player_act_next: player_sb, next_street: playerAction.street })
        }
        break;
      case 'BET':

        break;
      case 'RAISE':

      default:
        return 'Error';
    }

    data.save(function(err) {
      if (err) throw err;
      res.send('Shuffled Cards');
      console.log('Games array updated successfully');
    });

  })

})



module.exports = router;
