const postFlopEvaluation = (handAndStreet) => {
  console.log(handAndStreet);

  let numberValues = extractNumberValues(handAndStreet);
  let suitValues = extractSuitValues(handAndStreet);

  if (checkForFlush(suitValues, handAndStreet) !== false && checkForStraight(numberValues) !== false) {
    return [8, 'Straight Flush'];
  }
  else if (checkForPairs(numberValues)[0] === 7) {
    return [7, checkForPairs(numberValues)[1]];
  }
  else if (checkForPairs(numberValues)[0] === 6) {
    console.log(checkForPairs(numberValues)[1]);
    return [6, checkForPairs(numberValues)[1]];
  }
  else if (checkForFlush(suitValues, handAndStreet) !== false) {
    console.log(checkForFlush(suitValues, handAndStreet));
    return [5, checkForFlush(suitValues, handAndStreet)];
  }
  else if (checkForStraight(numberValues) !== false) {
    console.log(checkForStraight(numberValues));
    return [4, checkForStraight(numberValues)];
  }
  else if (checkForPairs(numberValues)[0] === 3) {
    console.log(checkForPairs(numberValues)[1]);
    return [3, checkForPairs(numberValues)[1]];
  }
  else if (checkForPairs(numberValues)[0] === 2) {
    console.log(checkForPairs(numberValues)[1]);
    return [2, checkForPairs(numberValues)[1]];
  }
  else if (checkForPairs(numberValues)[0] === 1) {
    console.log(checkForPairs(numberValues)[1]);
    return [1, checkForPairs(numberValues)[1]];
  }
  else {
    console.log(checkForPairs(numberValues));
    return [0, checkForPairs(numberValues)];
  }

}

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
            return [7, `4 of a kind with ${key}s`]
        }
    }
    for (let key in pairOccurences) {
        if (pairOccurences[key] === 3) {
            for (let props in pairOccurences) {
                if (pairOccurences[props] === 2) {
                    return [6, `Full House, ${key}s full of ${props}`]
                }
            }
            return [3, `3 of a kind with ${key}s`]
        }
    }
    for (let key in pairOccurences) {
      if (pairOccurences[key] === 2) {
        for (let props in pairOccurences) {
          if (pairOccurences[props] === 2 && pairOccurences[key] !== pairOccurences[props]) {
            return [2, `Two Pair, ${key}s and ${props}`]
          }
        }
        return [1, `Pair of ${key}s`]
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
    return `${sortedNumberValues[0]} High Straight`;

}










module.exports = postFlopEvaluation;
