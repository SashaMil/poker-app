const Deck = require('../modules/deck.js');

const preflopEvaluation = (card1, card2) => {
  const values = ['14','13','12','11','10','9','8','7','6','5','4','3','2'];
  let allPossibleHands = [];
  for (let x = 0; x < values.length; x++) {
    var row = [];
    for (let y = 0; y < values.length; y++) {
      if (y >= x) {
        if (values[x] === values[y]) {
          row.push(values[x] + values[y])
        }
        else {
          row.push(values[x] + values[y] + 's');
        }
      }
      else {
        row.push(values[x] + values[y] + 'o');
      }
    }
    allPossibleHands.push(row);
  }
  console.log('hello', allPossibleHands);

};



const model = [
  ['AA', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s'],
  ['AKo', 'KK', 'KQs']
];







module.exports = preflopEvaluation;
