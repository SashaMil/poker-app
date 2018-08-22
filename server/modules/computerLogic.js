const postFlopEvaluation = require('../modules/postFlopEvaluation.js');

function computerLogic (facingBet, pot, computerChips, playerChips, computerCard1, computerCard2, street, streetCards) {

  switch(street) {
    case 'preflop':
      let possibleAces = formatPossibleAces(computerCard1, computerCard2);
      computerCard1 = possibleAces[0];
      computerCard2 = possibleAces[1];
      const startingHandValue = (evaluateStartingHand(computerCard1, computerCard2));
      console.log('whatsGoingOnHere', facingBet, pot, computerChips, playerChips, computerCard1, computerCard2, street, streetCards);
      if (startingHandValue === 0) {
        if (facingBet === 0) {
          return ['CHECK'];
        }
        else {
          return ['FOLD'];
        }
      }
      if (startingHandValue === 1) {
        if (facingBet === 0) {
          return ['CHECK'];
        }
        else if (facingBet <= 5) {
          return ['RAISE', 30];
        }
        else {
          return ['FOLD'];
        }
      }
      if (startingHandValue === 2) {
        if (facingBet === 0) {
          return ['RAISE', 30]
        }
        else if (facingBet <= 5) {
          return ['RAISE', 30];
        }
        else if (facingBet <= 40) {
          return ['CALL'];
        }
        else {
          return ['FOLD']
        }
      }
      if (startingHandValue === 3) {
        if (facingBet === 0) {
          return ['RAISE', 30];
        }
        else if (facingBet <= 5) {
          return ['RAISE', 30];
        }
        else if (facingBet <= 40) {
          return ['RAISE', 120];
        }
        else if (facingBet <= 150) {
          return ['FOLD']
        }
      }
      if (startingHandValue >= 4) {
        if (facingBet === 0) {
          return ['RAISE', 30];
        }
        else if (facingBet <= 5) {
          return ['RAISE', 30];
        }
        else if (facingBet <= 40) {
          return ['RAISE', 120];
        }
        else if (facingBet <= 150) {
          return ['RAISE', computerChips];
        }
      }
      break;
    case 'flop':
      console.log(postFlopEvaluation([computerCard1, computerCard2, streetCards.flop1, streetCards.flop2, streetCards.flop3]));
      break;
    case 'turn':
      if (startingHandValue >= 0) {
        if (facingBet > 0) {
          return 'CALL';
        }
        else {
          return 'CHECK';
        }
      }
      break;
    case 'river':
      if (startingHandValue >= 0) {
        if (facingBet > 0) {
          return 'CALL';
        }
        else {
          return 'CHECK';
        }
      }
      break;
    default:
      return 'Error';
  }

}

// Preflop Methods

// Used to convert Aces to higher value (From 1 to 14, in order to determine hand strength)
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

// Used to determine starting hand strength based on different parameters
function evaluateStartingHand(str1, str2) {
  let handValue = 0;
  // At least Queen and Ace/King/Queen
  if (parseInt(str1.slice(0, -1)) + parseInt(str2.slice(0,-1)) > 24) {
    handValue += 6;
  }
  // At least Ten and Ace/King/Queen/Jack/Ten
  else if (parseInt(str1.slice(0, -1)) + parseInt(str2.slice(0,-1)) > 20) {
    handValue += 3;
  }

  else if (parseInt(str1.slice(0,-1)) + parseInt(str2.slice(0,-1)) > 12) {
    handValue += 1;
  }
  // Cards Match
  if (str1.slice(0, -1) === str2.slice(0, -1)) {
    handValue += 4;
  }
  // Suits Match
  if (str1[str1.length - 1] === str2[str2.length - 1]) {
    handValue += 1;
  }
  // Difference of only one
  if (parseInt(str1.slice(0, -1)) - parseInt(str2.slice(0, -1)) === 1 || parseInt(str2.slice(0, -1)) - parseInt(str1.slice(0, -1)) === 1) {
    handValue += 1;
  }


  return handValue;
}

module.exports = computerLogic;
