const evaluateShowdown = (playerCard1, playerCard2, computerCard1, computerCard2, playerHandValue, computerHandValue, street) => {
  console.log('catboy', playerCard1, playerCard2, computerCard1, computerCard2, playerHandValue, computerHandValue, );
  if (playerHandValue === playerHandValue) {
    if (playerCard1 > computerCard1 && computerCard2) {
      return true;
    }
    if (playerCard2 > computerCard1 && computerCard2) {
      return true;
    }
  }
  else {
    return false;
  }

}














module.exports = evaluateShowdown;
