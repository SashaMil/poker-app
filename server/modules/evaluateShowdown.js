const postFlopEvaluation = require('../modules/postFlopEvaluation.js');

const evaluateShowdown = (playerCard1, playerCard2, computerCard1, computerCard2, streetCards) => {
  console.log('dinoboy', playerCard1, playerCard2, computerCard1, computerCard2, streetCards);

  console.log(postFlopEvaluation([computerCard1, computerCard2, streetCards.flop1, streetCards.flop2, streetCards.flop3, streetCards.turn, streetCards.river]))
  const computerHandValue = postFlopEvaluation([computerCard1, computerCard2, streetCards.flop1, streetCards.flop2, streetCards.flop3, streetCards.turn, streetCards.river]);
  const playerHandValue = postFlopEvaluation([playerCard1, playerCard2, streetCards.flop1, streetCards.flop2, streetCards.flop3, streetCards.turn, streetCards.river]);
  if (playerHandValue[0] > computerHandValue[0]) {
    return true;
  }
  if (playerHandValue[0] < computerHandValue[0]) {
    return false;
  }
  else {
    return true;
  }

}














module.exports = evaluateShowdown;
