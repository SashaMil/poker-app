const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const messageGenerator = require('../modules/messageGenerator.js');



router.post('/fold', (req, res) => {
 Person.findById(req.user._id, function(err, data) {
   if (err) throw err;
   const currentGame = data.games[data.games.length-1];
   currentGame.actions.push({
     player: true,
     type: 'FOLD',
   });
   currentGame.computer_chips += currentGame.pot;
   currentGame.pot = 0;
   const message = messageGenerator(currentGame.actions[currentGame.actions.length-1]);
   currentGame.messages.push({message: message});
   data.save(function(err) {
     if (err) throw err;
     res.send('Added new game Array');
   });
 });
});

router.post('/call', (req, res) => {
  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;
    const currentGame = data.games[data.games.length-1];
    const currentAction = currentGame.actions[currentGame.actions.length-1];
    const lastAction = currentGame.actions[currentGame.actions.length-2];
    const callAmount = currentGame.currentBet - lastAction.bet;
    console.log(callAmount);
    console.log('computerAction', currentAction);
    console.log('lastPlayerAction', lastAction);
    currentGame.pot += callAmount;
    currentGame.player_chips -= callAmount;
    let playerActNext = null;
    let nextStreet = null;
    if (currentAction.computer_has_acted && currentGame.player_sb) {
      playerActNext = true;
      nextStreet = true;
      currentGame.currentBet = 0;
    }
    else if (currentAction.computer_has_acted && !currentGame.player_sb) {
      playerActNext = false;
      nextStreet = true;
      currentGame.currentBet = 0;
    }
    else {
      playerActNext = false;
      nextStreet = false;
    }
    currentGame.actions.push({
      player: true,
      type: 'CALL',
      bet: callAmount,
      player_act_next: playerActNext,
      street: 'preflop',
      player_has_acted: true,
      computer_has_acted: currentAction.computer_has_acted,
      next_street: nextStreet,
    });

    const message = messageGenerator(currentGame.actions[currentGame.actions.length-1]);
    console.log(message);
    currentGame.messages.push({message: message})

    data.save(function(err) {
      if (err) throw err;
      res.send('Shuffled Cards');
      console.log('Games array updated successfully');
    });
  })
})















module.exports = router;
