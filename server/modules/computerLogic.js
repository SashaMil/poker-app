const postFlopEvaluation = require('../modules/postFlopEvaluation.js');
const preflopEvaluation = require('../modules/preflopEvaluation.js');

function computerLogic (amountToCall, pot, computerChips, playerChips, computerCard1, computerCard2, street, streetCards, raiseCounter, playerHasActed, computerHasActed, playerButton, playerActionType, currentComputerBet) {
  let postFlopHandValue = 0;
  switch(street) {
    case 'preflop':
      // Setting condition for when player calls from the button preflop
      if (playerButton && playerHasActed && playerActionType === 'CALL' && !computerHasActed) {
        if (preflopEvaluation(computerCard1, computerCard2, 11)) {
          return ['RAISE', 30];
        }
        else {
          return ['CHECK'];
        }
      }
      // Setting condition for when player raises from the button preflop
      if (playerButton && playerHasActed && playerActionType === 'RAISE' && !computerHasActed) {
        // If hand is within this threshold, we will 3-bet
        if (preflopEvaluation(computerCard1, computerCard2, 4)) {
          return ['RAISE', amountToCall * 3];
        }
        // If hand is withing this threshold, we will call the raise
        if (preflopEvaluation(computerCard1, computerCard2, 11)) {
          return ['CALL'];
        }
        // If hand is not within this range, we will fold to the player raise
        else {
          return ['FOLD'];
        }
      }
      // Setting condition for when player 4-bets preflop on the button preflop
      if (playerButton && playerHasActed && playerActionType === 'RAISE' && computerHasActed) {
        // If player 4-bets and our hand is within this range, we will shove all-in
        if (preflopEvaluation(computerCard1, computerCard2, 2)) {
          return ['RAISE', computerChips];
        }
        // If our hand is within this range, we will call the 4-bet
        if (preflopEvaluation(computerCard1, computerCard2, 4)) {
          return ['CALL']
        }
        else {
          return ['FOLD'];
        }
      }
      // Setting condition for when the computer is on the button preflop
      if (!playerButton && !playerHasActed) {
        if (preflopEvaluation(computerCard1, computerCard2, 11)) {
          return ['RAISE', 30];
        }
        else {
          return ['FOLD'];
        }
      }
      if (!playerButton && playerActionType === 'RAISE') {
        if (preflopEvaluation(computerCard1, computerCard2, 4)) {
          return ['RAISE', amountToCall * 3];
        }
        // If hand is withing this threshold, we will call the raise
        if (preflopEvaluation(computerCard1, computerCard2, 11)) {
          return ['CALL'];
        }
        // If hand is not within this range, we will fold to the player raise
        else {
          return ['FOLD'];
        }
      }
      // Setting condition for when the player
      if (!playerButton && raiseCounter > 2 && playerActoinType === 'RAISE') {
        // If player 4-bets and our hand is within this range, we will shove all-in
        if (preflopEvaluation(computerCard1, computerCard2, 2)) {
          return ['RAISE', computerChips];
        }
        // If our hand is within this range, we will call the 4-bet
        if (preflopEvaluation(computerCard1, computerCard2, 4)) {
          return ['CALL']
        }
        else {
          return ['FOLD'];
        }
      }
      else {
        return ['FOLD'];
      }

      break;

    // Straight Flush: 8
    // 4 of a Kind: 7
    // FullHouse: 6
    // Flush: 5
    // Straight: 4
    // Three of a Kind: 3
    // Two Pair: 2
    // One Pair: 1
    // * High
    case 'flop':
    postFlopHandValue = postFlopEvaluation([computerCard1, computerCard2, streetCards.flop1, streetCards.flop2, streetCards.flop3]);

    if (postFlopHandValue[0] === 0) {
      if (amountToCall === 0) {
        return ['CHECK'];
      }
      else {
        return ['FOLD'];
      }
    }
    if (postFlopHandValue[0] === 1) {
      if (amountToCall === 0) {
        return ['CHECK'];
      }
      else if (amountToCall <= 5) {
        return ['RAISE', 30];
      }
      else {
        return ['FOLD'];
      }
    }
    if (postFlopHandValue[0] === 2) {
      if (amountToCall === 0) {
        return ['RAISE', 30]
      }
      else if (amountToCall <= 5) {
        return ['RAISE', 30];
      }
      else if (amountToCall <= 40) {
        return ['CALL'];
      }
      else {
        return ['FOLD']
      }
    }
    if (postFlopHandValue[0] === 3) {
      if (amountToCall === 0) {
        return ['RAISE', 30];
      }
      else if (amountToCall <= 5) {
        return ['RAISE', 30];
      }
      else if (amountToCall <= 40) {
        return ['RAISE', 120];
      }
      else if (amountToCall <= 150) {
        return ['FOLD']
      }
    }
    if (postFlopHandValue[0] >= 4) {
      if (amountToCall === 0) {
        return ['RAISE', 30];
      }
      else if (amountToCall <= 5) {
        return ['RAISE', 30];
      }
      else if (amountToCall <= 40) {
        return ['RAISE', 120];
      }
      else if (amountToCall <= 150) {
        return ['RAISE', computerChips];
      }
    }
    else {
      return ['FOLD'];
    }
      break;

    case 'turn':
    postFlopHandValue = postFlopEvaluation([computerCard1, computerCard2, streetCards.flop1, streetCards.flop2, streetCards.flop3, streetCards.turn]);

    if (postFlopHandValue[0] === 0) {
      if (amountToCall === 0) {
        return ['CHECK'];
      }
      else {
        return ['FOLD'];
      }
    }
    if (postFlopHandValue[0] === 1) {
      if (amountToCall === 0) {
        return ['CHECK'];
      }
      else if (amountToCall <= 5) {
        return ['RAISE', 30];
      }
      else {
        return ['FOLD'];
      }
    }
    if (postFlopHandValue[0] === 2) {
      if (amountToCall === 0) {
        return ['RAISE', 30]
      }
      else if (amountToCall <= 5) {
        return ['RAISE', 30];
      }
      else if (amountToCall <= 40) {
        return ['CALL'];
      }
      else {
        return ['FOLD']
      }
    }
    if (postFlopHandValue[0] === 3) {
      if (amountToCall === 0) {
        return ['RAISE', 30];
      }
      else if (amountToCall <= 5) {
        return ['RAISE', 30];
      }
      else if (amountToCall <= 40) {
        return ['RAISE', 120];
      }
      else if (amountToCall <= 150) {
        return ['FOLD']
      }
    }
    if (postFlopHandValue[0] >= 4) {
      if (amountToCall === 0) {
        return ['RAISE', 30];
      }
      else if (amountToCall <= 5) {
        return ['RAISE', 30];
      }
      else if (amountToCall <= 40) {
        return ['RAISE', 120];
      }
      else if (amountToCall <= 150) {
        return ['RAISE', computerChips];
      }
    }
    else {
      return ['FOLD'];
    }
      break;

    case 'river':
    postFlopHandValue = postFlopEvaluation([computerCard1, computerCard2, streetCards.flop1, streetCards.flop2, streetCards.flop3, streetCards.turn, streetCards.river]);

    if (postFlopHandValue[0] === 0) {
      if (amountToCall === 0) {
        return ['CHECK'];
      }
      else {
        return ['FOLD'];
      }
    }
    if (postFlopHandValue[0] === 1) {
      if (amountToCall === 0) {
        return ['CHECK'];
      }
      else if (amountToCall <= 5) {
        return ['RAISE', 30];
      }
      else {
        return ['FOLD'];
      }
    }
    if (postFlopHandValue[0] === 2) {
      if (amountToCall === 0) {
        return ['RAISE', 30]
      }
      else if (amountToCall <= 5) {
        return ['RAISE', 30];
      }
      else if (amountToCall <= 40) {
        return ['CALL'];
      }
      else {
        return ['FOLD']
      }
    }
    if (postFlopHandValue[0] === 3) {
      if (amountToCall === 0) {
        return ['RAISE', 30];
      }
      else if (amountToCall <= 5) {
        return ['RAISE', 30];
      }
      else if (amountToCall <= 40) {
        return ['RAISE', 120];
      }
      else if (amountToCall <= 150) {
        return ['FOLD']
      }
    }
    if (postFlopHandValue[0] >= 4) {
      if (amountToCall === 0) {
        return ['RAISE', 30];
      }
      else if (amountToCall <= 5) {
        return ['RAISE', 30];
      }
      else if (amountToCall <= 40) {
        return ['RAISE', 120];
      }
      else if (amountToCall <= 150) {
        return ['RAISE', computerChips];
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
