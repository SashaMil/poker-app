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
    const streetCards = currentGame.street[currentGame.street.length-1];
    let facingBet = 0;
    if (playerAction.bet > computerAction.bet) {
      facingBet = playerAction.bet - computerAction.bet;
    }
    const decision = computerLogic(facingBet, currentGame.pot, currentGame.computer_chips, currentGame.player_chips, currentCards.card1, currentCards.card2, playerAction.street, streetCards);

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
    currentGame.messages.push({message: message})

    data.save(function(err) {
      if (err) throw err;
      res.send('Shuffled Cards');
      console.log('Games array updated successfully');
    });

  })

})



module.exports = router;
