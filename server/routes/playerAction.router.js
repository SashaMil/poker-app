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
   currentGame.messages.push({message: {playerMessage: message}});
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
    const computerAction = currentGame.actions[currentGame.actions.length-1];
    const playerAction = currentGame.actions[currentGame.actions.length-2];
    const callAmount = computerAction.bet - playerAction.bet;
    currentGame.pot += callAmount;
    currentGame.player_chips -= callAmount;
    let playerActNext = null;
    let nextStreet = null;
    if (computerAction.computer_has_acted && currentGame.player_sb) {
      playerActNext = true;
      nextStreet = true;
      currentGame.currentBet = 0;
    }
    else if (computerAction.computer_has_acted && !currentGame.player_sb) {
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
      bet: 0,
      callAmount: callAmount,
      player_act_next: playerActNext,
      street: computerAction.street,
      player_has_acted: true,
      computer_has_acted: computerAction.computer_has_acted,
      next_street: nextStreet,
    });

    const message = messageGenerator(currentGame.actions[currentGame.actions.length-1]);
    currentGame.messages.push({message: {playerMessage: message}})

    data.save(function(err) {
      if (err) throw err;
      res.send('Shuffled Cards');
      console.log('Games array updated successfully');
    });
  })
})

router.post('/check', (req, res) => {
 Person.findById(req.user._id, function(err, data) {
   if (err) throw err;
   const currentGame = data.games[data.games.length-1];
   const computerAction = currentGame.actions[currentGame.actions.length-1];
   const playerAction = currentGame.actions[currentGame.actions.length-2];

   let playerActNext = null;
   let nextStreet = null;

   if (computerAction.computer_has_acted && currentGame.player_sb) {
     playerActNext = true;
     nextStreet = true;
     currentGame.currentBet = 0;
   }
   else if (computerAction.computer_has_acted && !currentGame.player_sb) {
     playerActNext = false;
     nextStreet = true;
     currentGame.currentBet = 0;
   }
   else {
     playerActNext = false;
     nextStreet = false;
   }

   console.log('wolverine', computerAction.street);

   currentGame.actions.push({
     player: true,
     type: 'CHECK',
     bet: 0,
     player_act_next: playerActNext,
     street: computerAction.street,
     player_has_acted: true,
     computer_has_acted: computerAction.computer_has_acted,
     next_street: nextStreet,
   });

   const message = messageGenerator(currentGame.actions[currentGame.actions.length-1]);
   currentGame.messages.push({message: {playerMessage: message}});

   data.save(function(err) {
     if (err) throw err;
     res.send('Added new game Array');
   });
 });
});

router.post('/bet', (req, res) => {
 Person.findById(req.user._id, function(err, data) {
   if (err) throw err;
   const currentGame = data.games[data.games.length-1];
   currentGame.pot += req.body.betSize;
   currentGame.player_chips -= req.body.betSize;
   console.log(req.body.betSize);
   currentGame.actions.push({
     player: true,
     type: 'BET',
     bet: req.body.betSize,
     player_act_next: false,
     street: currentGame.actions[currentGame.actions.length-1].street,
     player_has_acted: true,
     computer_has_acted: false,
     next_street: false,
   });

   const message = messageGenerator(currentGame.actions[currentGame.actions.length-1]);
   currentGame.messages.push({message: {playerMessage: message}});

   data.save(function(err) {
     if (err) throw err;
     res.send('Added new game Array');
   });
 });
});

router.post('/raise', (req, res) => {
 Person.findById(req.user._id, function(err, data) {
   if (err) throw err;
   const currentGame = data.games[data.games.length-1];
   currentGame.pot += req.body.betSize;
   currentGame.player_chips -= req.body.betSize;
   console.log(req.body.betSize);
   currentGame.actions.push({
     player: true,
     type: 'RAISE',
     bet: req.body.betSize,
     player_act_next: false,
     street: currentGame.actions[currentGame.actions.length-1].street,
     player_has_acted: true,
     computer_has_acted: false,
     next_street: false,
   });

   const message = messageGenerator(currentGame.actions[currentGame.actions.length-1]);
   currentGame.messages.push({message: {playerMessage: message}});

   data.save(function(err) {
     if (err) throw err;
     res.send('Added new game Array');
   });
 });
});















module.exports = router;
