const postFlopEvaluation = (handAndStreet) => {
  console.log('wolverinedjfkdjfkd', handAndStreet);

  let numberValues = extractNumberValues(handAndStreet);
  let suitValues = extractSuitValues(handAndStreet);
  // Case for each potential hand ranking, starting at the strongest hand possible (straight flush),
  // then works its way down

  // Four of a Kind
  // For Check Pairs function, I am checking the first element in array
  // to distinguish between different kinds of pairs
  if (checkForPairs(numberValues)[0] === 5) {
    return [7, checkForPairs(numberValues)];
  }
  // FullHouse
  else if (checkForPairs(numberValues)[0] === 4) {
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

// Function to change ace values form 1 to 14
function changeAceValues(numberValues) {
  for (let x = 0; x < numberValues.length; x++) {
    if (numberValues[x] === 1) {
      numberValues[x] = 14;
    }
  }
  return numberValues;
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
  console.log('suitValues', suitValues, 'handAndStreet', handAndStreet);
  // going to write a quick loop to change aces to value of 14, should do this to encompass all functions later
  for (card of handAndStreet) {
    if (card.length === 3) {
      suitsAndValuesSorted.push([parseInt(card[0] + card[1]), card[2]]);
    }
    else {
      console.log(card[0]);
      if (card[0] === '1') {
        console.log('ace found?');
        card[0] = '14';
        suitsAndValuesSorted.push([14, card[1]]);
      }
      else {
        suitsAndValuesSorted.push([parseInt(card[0]), card[1]]);
      }
    }
  }
  console.log('look here this time', suitsAndValuesSorted);

  // Creating an array of arrays that looks like this [ [ 8, 'H' ], [ 6, 'H' ], [ 5, 'H' ], [ 5, 'D' ], [ 5, 'H' ] ]

  suitsAndValuesSorted = suitsAndValuesSorted.sort(function(a,b){return b[0]-a[0]});
  console.log('flush checker here!', suitsAndValuesSorted);

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
      if (flush[0] === 11) {
        return 'Jack High Flush';
      }
      else if (flush[0] === 12) {
        return 'Queen High Flush';
      }
      else if (flush[0] === 13) {
        return 'King High Flush';
      }
      else if (flush[0] === 1) {
        return 'Ace High Flush';
      }
      else {
        return `${flush[0]} High flush`;
      }
    }
  }
  return false;
}

/**
 * Created by sashamilenkovic on 9/12/18.
 */
// Used to find the occurences of all present integer values
function checkForPairs(numberValues) {
  changeAceValues(numberValues);
  let sortedNumberValues = numberValues.sort(function(a,b){return b-a});
    for (let x = 0; x < numberValues.length; x++) {
        if (numberValues[x] === 11) {
            numberValues[x] = 'Jack';
        }
        if (numberValues[x] === 12) {
            numberValues[x] = 'Queen';
        }
        if (numberValues[x] === 13) {
            numberValues[x] = 'King';
        }
        if (numberValues[x] === 14) {
            numberValues[x] = 'Ace';
        }
    }
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
            return [5, `4 of a Kind with ${key}s`];
        }
    }
    for (let key in pairOccurences) {
        if (pairOccurences[key] === 3) {
            for (let props in pairOccurences) {
                if (pairOccurences[props] === 2) {
                    return [4, `Full House, ${key}s full of ${props}`];
                }
            }
            return [3, `3 of a Kind with ${key}s`];
        }
    }
    for (let key in pairOccurences) {
      if (pairOccurences[key] === 2) {
          for (let props in pairOccurences) {
              if (pairOccurences[props] === 2 && key !== props) {
                  return [2, `Two Pair, ${key}s and ${props}s`];
              }
          }
          return [1, `Pair of ${key}s`];
      }
    }
    return [0, `${sortedNumberValues[0]} High`]

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
