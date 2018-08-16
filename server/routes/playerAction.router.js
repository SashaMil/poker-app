const express = require('express');
const router = express.Router();
const Person = require('../models/Person');


router.post('/fold', (req, res) => {
 Person.findById(req.user._id, function(err, data) {
   if (err) throw err;
   const currentGame = data.games[data.games.length-1];
   currentGame.actions.push({
     player_sb: !currentGame.player_sb,
     player_chips: currentGame.player_chips,
     computer_chips: currentGame.computer_chips + currentGame.pot,
     pot: 0,
     game_completed: false,
   })
   data.save(function(err) {
     if (err) throw err;
     res.send('Added new game Array');
   });
 });
});















module.exports = router;
