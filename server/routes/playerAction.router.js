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
   console.log('dinosaur', message);
   currentGame.messages.push({message: message});
   data.save(function(err) {
     if (err) throw err;
     res.send('Added new game Array');
   });
 });
});















module.exports = router;
