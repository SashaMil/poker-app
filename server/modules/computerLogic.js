function computerLogic (callAmount, pot, computerChips, playerChips, computerCard1, computerCard2, street, streetCards) {

  let possibleAces = formatPossibleAces(computerCard1, computerCard2);
  computerCard1 = possibleAces[0];
  computerCard2 = possibleAces[1];
  let startingHandValue = (evaluateStartingHand(computerCard1, computerCard2));

  const handRankings = ['Royal Flush', 'Straight Flush', 'Four of a Kind', 'Full House', 'Flush', 'Straight', 'Three of a Kind', 'Two Pair', 'Pair'];


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


  switch(street) {
    case 'preflop':
      if (startingHandValue >= 0) {
        if (callAmount > 0) {
          return 'CALL';
        } else {
          return 'CHECK';
        }
      }
      break;
    case 'flop':

      break;
    case 'turn':

      break;
    case 'river':

      break;
    default:
      return 'Error';
  }


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

}








module.exports = computerLogic;
