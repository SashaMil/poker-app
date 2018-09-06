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
  console.log(formatPossibleAces(card1, card2));


};

function formatPossibleAces(str1, str2) {
  let result = [];
  let newString1 = ''
  let newString2 = '';

  if (str1.length === 2 && str1[0] === '1') {
    newString1 += '14' + str1[str1.length - 1];
    result.push(newString1);
  } else {
    result.push(str1);
  }
  if (str2.length === 2 && str2[0] === '1') {
    newString2 += '14' + str2[str2.length - 1];
    result.push(newString2);
  } else {
    result.push(str2);
  }
  return result;
}

// function cardFormatter(card1, card2) {
//   if (card1.length === 3) {
//
//   }
//   else {
//     card1
//   }
// }





const model = [
  ['AA', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s'],
  ['AKo', 'KK', 'KQs']
];







module.exports = preflopEvaluation;
