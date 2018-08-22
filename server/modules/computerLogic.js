function computerLogic (callAmount, pot, computerChips, playerChips, computerCard1, computerCard2, street, streetCards) {


  const handRankings = ['Straight Flush', 'Four of a Kind', 'Full House', 'Flush', 'Straight', 'Three of a Kind', 'Two Pair', 'Pair', 'X High'];

  const evaluatePostFlopHand = (handAndStreet) => {
    let numberValues = extractNumberValues(handAndStreet);
    let suitValues = extractSuitValues(handAndStreet);

    console.log(handAndStreet);
    console.log(checkForPairs(numberValues));
    console.log(checkForFlush(suitValues, handAndStreet));
    console.log('omgimnuts', checkForFlush(extractSuitValues(['2D', '13D', '4H', '6D', '7D', '10D']), ['2D', '13D', '4H', '6D', '7D', '10D']));







  }
  switch(street) {
    case 'preflop':
      let possibleAces = formatPossibleAces(computerCard1, computerCard2);
      computerCard1 = possibleAces[0];
      computerCard2 = possibleAces[1];
      const startingHandValue = (evaluateStartingHand(computerCard1, computerCard2));
      if (startingHandValue >= 0) {
        if (callAmount > 0) {
          return 'CALL';
        }
        else {
          return 'CHECK';
        }
      }
      break;
    case 'flop':
      evaluatePostFlopHand([computerCard1, computerCard2, streetCards.flop1, streetCards.flop2, streetCards.flop3]);
      break;
    case 'turn':
      if (startingHandValue >= 0) {
        if (callAmount > 0) {
          return 'CALL';
        }
        else {
          return 'CHECK';
        }
      }
      break;
    case 'river':
      if (startingHandValue >= 0) {
        if (callAmount > 0) {
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

//


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

// PostFlop Methods

// Used to extract just the integer values of cards, getting rid of the suit character
function extractNumberValues(valuesAndSuits) {
  let justValues = [];
  for (card of valuesAndSuits) {
    if (card.length === 3) {
      justValues.push(parseInt(card[0] += card[1]));
    }
    else {
      justValues.push(parseInt(card[0]));
    }
  }
  return justValues;
}

// Used to extract just the suit character, getting rid of the integer values
function extractSuitValues(valuesAndSuits) {
  let justSuits = [];
  for (card of valuesAndSuits) {
    justSuits.push(card[card.length-1]);
  }
  return justSuits;
}

// Used to find  the occurences of all present suits.
function checkForFlush(suitValues, handAndStreet) {
  let suitsAndValuesSorted = [];
  for (card of handAndStreet) {
    if (card.length === 3) {
      suitsAndValuesSorted.push([parseInt(card[0] + card[1]), card[2]]);
    }
    else {
      suitsAndValuesSorted.push([parseInt(card[0]), card[1]]);
    }
  }

  suitsAndValuesSorted = suitsAndValuesSorted.sort(function(a,b){return b[0]-a[0]});



  console.log('omg', suitsAndValuesSorted);


  let suitOccurences = {};
  for (suit of suitValues) {
    if (suitOccurences[suit] === undefined) {
      suitOccurences[suit] = 1;
    }
    else {
      suitOccurences[suit]++;
    }
  }
  for (let key in suitOccurences) {
    if (suitOccurences[key] === 5) {
      for (let x = 0; x < suitsAndValuesSorted.length; x++) {
        if (suitsAndValuesSorted[x][1] === key) {
          return `${suitsAndValuesSorted[x][0]} High Flush`;
        }
      }
    }
  }
}

// Used to find the occurences of all present integer values
function checkForPairs(numberValues) {
    let sortedNumberValues = numberValues.sort(function(a,b){return b-a});
    let pairOccurences = {};
    for (number of sortedNumberValues) {
        if (pairOccurences[number] === undefined) {
            pairOccurences[number] = 1;
        }
        else {
            pairOccurences[number]++;
        }
    }
    for (let key in pairOccurences) {
        if (pairOccurences[key] === 4) {
            return `4 of a kind with ${key}s`
        }
    }
    for (let key in pairOccurences) {
        if (pairOccurences[key] === 3) {
            for (let props in pairOccurences) {
                if (pairOccurences[props] === 2) {
                    return `Full House, ${key}s full of ${props}`
                }
            }
            return `3 of a kind with ${key}s`
        }
    }
    for (let key in pairOccurences) {
      if (pairOccurences[key] === 2) {
        for (let props in pairOccurences) {
          if (pairOccurences[props] === 2 && pairOccurences[key] !== pairOccurences[props]) {
            return `Two Pair, ${key}s and ${props}`
          }
        }
        return `Pair of ${key}s`
      }
    }
    return `${sortedNumberValues[0]} High`;
}

function checkForStraight(numberValues) {
    let sortedNumberValues = numberValues.sort(function(a,b){return b-a});

    let chance = 0;
    if (sortedNumberValues.length === 5) {
        chance = 0;
    }
    else if (sortedNumberValues.length === 6) {
        chance = 1;
    }
    else {
        chance = 2;
    }

    for (let x = 0; x < sortedNumberValues.length; x++) {
        if (sortedNumberValues[x] - 1 !== sortedNumberValues[x+1] && sortedNumberValues[x+1] !== undefined) {
            chance--;
            if (chance < 0) {
                return false;
            }

        }
    }
    return sortedNumberValues[0];

}








module.exports = computerLogic;
