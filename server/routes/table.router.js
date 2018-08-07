const express = require('express');
const router = express.Router();
const Deck = require('../modules/deck.js');
const Person = require('../models/Person');



/**
 * GET route template
 */
router.get('/shuffle', (req, res) => {
  console.log('hello');
  let deck = new Deck;
  deck.shuffle();
  console.log(deck);
  deck.deal();
  deck.deal();
  console.log(deck);
  Person.find()
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      res.sendStatus(500);
    })
});

/**
 * POST route template
 */
router.post('/', (req, res) => {

});

module.exports = router;
