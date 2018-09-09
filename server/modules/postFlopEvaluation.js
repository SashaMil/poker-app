const postFlopEvaluation = (handAndStreet) => {
  console.log('wolverinedjfkdjfkd', handAndStreet);

  let numberValues = extractNumberValues(handAndStreet);
  console.log('numberValues', numberValues);
  let suitValues = extractSuitValues(handAndStreet);
  console.log('suitValues', suitValues);

  console.log(checkForFlush(suitValues, handAndStreet));




  // Case for each potential hand ranking, starting at the strongest hand possible (straight flush),
  // then works its way down

  // Four of a Kind
  if (checkForPairs(numberValues)[0] === 7) {
    return [7, checkForPairs(numberValues)];
  }
  // FullHouse
  else if (checkForPairs(numberValues)[0] === 6) {
    return checkForPairs(numberValues);
  }
  // Flush
  else if (checkForFlush(suitValues, handAndStreet) !== false) {
    return [5, checkForFlush(suitValues, handAndStreet)];
  }
  // Straight
  else if (checkForStraight(numberValues) !== false) {
    return [4, checkForStraight(numberValues)];
  }
  // Three of a Kind
  else if (checkForPairs(numberValues)[0] === 3) {
    return [3, checkForPairs(numberValues)[1]];
  }
  // Two Pair
  else if (checkForPairs(numberValues)[0] === 2) {
    return [2, checkForPairs(numberValues)[1]];
  }
  // Pair
  else if (checkForPairs(numberValues)[0] === 1) {
    return [1, checkForPairs(numberValues)[1]];
  }
  // X High
  else {
    return [0, checkForPairs(numberValues)[1]];
  }

}

// Helper function to extract just the integer values from an array of cards
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
  // Creating an array of arrays that looks like this [ [ 8, 'H' ], [ 6, 'H' ], [ 5, 'H' ], [ 5, 'D' ], [ 5, 'H' ] ]

  suitsAndValuesSorted = suitsAndValuesSorted.sort(function(a,b){return b[0]-a[0]});

  let suitOccurences = {};
  // Counting instances of each suit
  for (suit of suitValues) {
    if (suitOccurences[suit] === undefined) {
      suitOccurences[suit] = 1;
    }
    else {
      suitOccurences[suit]++;
    }
  }
  // If there is a suit that occurs five times, we are iterating over the array of arrays we created earlier
  // Since it is in descending order, each time we find a card that makes a flush, that creates our array of best
  // five cards

  for (let key in suitOccurences) {
    if (suitOccurences[key] === 5) {
      let flush = [];
      for (let x = 0; x < suitsAndValuesSorted.length; x++) {
        if (suitsAndValuesSorted[x][1] === key && flush.length < 5) {
          flush.push(suitsAndValuesSorted[x][0])
        }
      }
      return `${flush[0]} High flush`;
    }
  }
  return false;
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
            return [4, `4 of a kind with ${key}s`];
        }
    }
    for (let key in pairOccurences) {
        if (pairOccurences[key] === 3) {
            for (let props in pairOccurences) {
                if (pairOccurences[props] === 2) {
                    return [3, `Full House, ${key}s full of ${props}`];
                }
            }
            return [3, `3 of a kind with ${key}s`];
        }
    }
    for (let key in pairOccurences) {
      if (pairOccurences[key] === 2) {
        for (let props in pairOccurences) {
          if (pairOccurences[props] === 2 && pairOccurences[key] !== pairOccurences[props]) {
            return [2, `Two Pair, ${key}s and ${props}`];
          }
        }
        return [1, `Pair of ${key}s`];
      }
    }
    if (sortedNumberValues[0] === 11) {
      return [0, `$Jack High`];
    }
    if (sortedNumberValues[0] === 12) {
      return [0, `Queen High`];
    }
    if (sortedNumberValues[0] === 13) {
      return [0, 'King High'];
    }
    if (sortedNumberValues[0] === 14) {
      return [0, 'Ace High'];
    }
    else {
      return [0, `${sortedNumberValues[0]} High`]
    }
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

    let possibleStraight = [];

    for (let x = 0; x < sortedNumberValues.length; x++) {
        if (possibleStraight.length === 5) {
            console.log(possibleStraight)
            return `${possibleStraight[0]} High Straight`;
        }
        else if (sortedNumberValues[x] - 1 === sortedNumberValues[x + 1]) {
            if (possibleStraight.length === 0) {
                possibleStraight.push(sortedNumberValues[x], sortedNumberValues[x+1]);
            }
            else {
                possibleStraight.push(sortedNumberValues[x+1])
            }
        }
        else if (sortedNumberValues[x] - 1 !== sortedNumberValues[x + 1]) {
            possibleStraight = [];
            chance--;
            if (chance < 0) {
                return false;
            }
        }


    }

}










module.exports = postFlopEvaluation;
