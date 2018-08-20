const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const computerLogic = require('../modules/computerLogic.js');
const messageGenerator = require('../modules/messageGenerator.js');



router.post('/', (req, res) => {

  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;
    const currentGame = data.games[data.games.length-1];

    const currentCards = currentGame.computerCards[currentGame.computerCards.length-1];
    const playerAction = currentGame.actions[currentGame.actions.length - 1];
    const computerAction = currentGame.actions[currentGame.actions.length - 2];
    const callAmount = playerAction.bet - computerAction.bet;
    console.log(currentGame.pot);
    console.log(computerAction)
    console.log(playerAction);
    console.log('hello', callAmount);
    const streetCards = currentGame.street;
    const decision = computerLogic(callAmount, currentGame.pot, currentGame.computer_chips, currentGame.player_chips, currentCards.card1, currentCards.card2, playerAction.street, streetCards);

    switch(decision) {
      case 'FOLD':
        currentGame.current_hand_completed = true;
        currentGame.player_chips += currentGame.pot;
        currentGame.pot = 0;
        currentGame.actions.push({ player: false, type: decision, street: playerAction.street })

        break;
      case 'CHECK':
        if (!playerAction.player_has_acted) {
          currentGame.actions.push({ player: false, bet: 0, type: decision, player_act_next: true, street: playerAction.street, player_has_acted: false, computer_has_acted: true, next_street: false });
        }
        else {
          currentGame.actions.push({ player: false, bet: 0, type: decision, player_act_next: currentGame.player_sb, street: playerAction.street, player_has_acted: true, computer_has_acted: true, next_street: true });
        }
        break;
      case 'CALL':
        currentGame.computer_chips -= callAmount;
        currentGame.pot += callAmount;
        if (!playerAction.player_has_acted) {
          currentGame.actions.push({ player: false, bet: 0, callAmount: callAmount, type: decision, player_act_next: true, street: playerAction.street, player_has_acted: false, computer_has_acted: true, next_street: false });
        }
        else {
          currentGame.actions.push({ player: false, bet: 0, callAmount, callAmount, type: decision, player_act_next: currentGame.player_sb, street: playerAction.street, player_has_acted: true, computer_has_actd: true, next_street: true });
        }
        break;
      case 'BET':

        break;
      case 'RAISE':

      default:
        return 'Error';
    }

    const message = messageGenerator(currentGame.actions[currentGame.actions.length-1]);
    currentGame.messages.push({message: message})

    data.save(function(err) {
      if (err) throw err;
      res.send('Shuffled Cards');
      console.log('Games array updated successfully');
    });

  })

})



module.exports = router;
