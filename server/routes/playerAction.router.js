const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const messageGenerator = require('../modules/messageGenerator.js');



router.post('/fold', (req, res) => {
 Person.findById(req.user._id, function(err, data) {
   if (err) throw err;

   const currentGame = data.games.slice(-1)[0];
   const currentHand = currentGame.hands.slice(-1)[0];
   const computerAction = currentHand.actions.slice(-1)[0];
   const playerAction = currentHand.actions.slice(-2)[0];

   currentHand.actions.push({
     player: true,
     type: 'FOLD',
     street: playerAction.street,
     message: {playerMessage: 'Player Folds'},
     pot: 0,
     computer_chips: computerAction.computer_chips + playerAction.pot,
     player_chips: computerAction.player_chips,
   });

   data.save(function(err) {
     if (err) throw err;
     res.send('Added new game Array');
   });
 });
});

router.post('/check', (req, res) => {
 Person.findById(req.user._id, function(err, data) {
   if (err) throw err;

   const currentGame = data.games.slice(-1)[0];
   const currentHand = currentGame.hands.slice(-1)[0];
   const computerAction = currentHand.actions.slice(-1)[0];
   const playerAction = currentHand.actions.slice(-2)[0];

   let playerActNext = null;
   let nextStreet = null;

   if (computerAction.computer_has_acted && currentHand.player_sb) {
     playerActNext = true;
     nextStreet = true;
   }
   else if (computerAction.computer_has_acted && !currentGame.player_sb) {
     playerActNext = false;
     nextStreet = true;
   }
   else {
     playerActNext = false;
     nextStreet = false;
   }

   currentHand.actions.push({
     player: true,
     type: 'CHECK',
     bet: 0,
     player_act_next: playerActNext,
     street: computerAction.street,
     player_has_acted: true,
     computer_has_acted: computerAction.computer_has_acted,
     next_street: nextStreet,
     pot: computerAction.pot,
     player_chips: computerAction.player_chips,
     computer_chips: computerAction.computer_chips,
     message: {playerMessage: 'Player Checks'},
     raiseCounter: 0,
   });

   data.save(function(err) {
     if (err) throw err;
     res.send('Added new game Array');
   });
 });
});

router.post('/call', (req, res) => {
  Person.findById(req.user._id, function(err, data) {
    if (err) throw err;

    const currentGame = data.games.slice(-1)[0];
    const currentHand = currentGame.hands.slice(-1)[0];
    const computerAction = currentHand.actions.slice(-1)[0];
    const playerAction = currentHand.actions.slice(-2)[0];

    let playerActNext = null;
    let nextStreet = null;
    if (computerAction.computer_has_acted && currentGame.player_sb) {
      playerActNext = true;
      nextStreet = true;
    }
    else if (computerAction.computer_has_acted && !currentGame.player_sb) {
      playerActNext = false;
      nextStreet = true;
    }
    else {
      playerActNext = false;
      nextStreet = false;
    }

    let amountToCall = 0;

    if (computerAction.bet > playerAction.bet) {
      amountToCall = computerAction.bet - playerAction.bet;
    }

    currentHand.actions.push({
      player: true,
      type: 'CALL',
      bet: 0,
      player_act_next: playerActNext,
      street: computerAction.street,
      player_has_acted: true,
      computer_has_acted: computerAction.computer_has_acted,
      pot: computerAction.pot + amountToCall,
      player_chips: computerAction.player_chips - amountToCall,
      computer_chips: computerAction.computer_chips,
      message: {playerMessage: `Player calls ${amountToCall}`},
      raiseCounter: computerAction.raiseCounter,
      next_street: nextStreet,
    });

    data.save(function(err) {
      if (err) throw err;
      res.send('Shuffled Cards');
      console.log('Games array updated successfully');
    });
  })
})

router.post('/bet', (req, res) => {
 Person.findById(req.user._id, function(err, data) {
   if (err) throw err;

   const currentGame = data.games.slice(-1)[0];
   const currentHand = currentGame.hands.slice(-1)[0];
   const computerAction = currentHand.actions.slice(-1)[0];
   const playerAction = currentHand.actions.slice(-2)[0];

   console.log(req.body.betSize);
   currentHand.actions.push({
     player: true,
     type: 'BET',
     bet: req.body.betSize,
     player_act_next: false,
     street: computerAction.street,
     player_has_acted: true,
     computer_has_acted: false,
     next_street: false,
     pot: computerAction.pot + req.body.betSize,
     player_chips: computerAction.player_chips - req.body.betSize,
     computer_chips: computerAction.computer_chips,
     message: {playerMessage: `Player bets ${req.body.betSize}`},
     raiseCounter: 1,
   });

   data.save(function(err) {
     if (err) throw err;
     res.send('Added new game Array');
   });
 });
});

router.post('/raise', (req, res) => {
 Person.findById(req.user._id, function(err, data) {
   if (err) throw err;

   const currentGame = data.games.slice(-1)[0];
   const currentHand = currentGame.hands.slice(-1)[0];
   const computerAction = currentHand.actions.slice(-1)[0];
   const playerAction = currentHand.actions.slice(-2)[0];

   console.log(req.body.betSize);
   currentHand.actions.push({
     player: true,
     type: 'RAISE',
     bet: req.body.betSize,
     player_act_next: false,
     street: computerAction.street,
     player_has_acted: true,
     computer_has_acted: false,
     next_street: false,
     pot: computerAction.pot + req.body.betSize,
     player_chips: computerAction.player_chips - req.body.betSize,
     computer_chips: computerAction.computer_chips,
     message: {playerMessage: `Player raises to ${req.body.betSize}`},
     raiseCounter: computerAction.raiseCounter + 1,
   });

   data.save(function(err) {
     if (err) throw err;
     res.send('Added new game Array');
   });
 });
});















module.exports = router;
