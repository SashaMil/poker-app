const postFlopEvaluation = (handAndStreet) => {
  let cards = cardObject(handAndStreet);
  console.log('cardObjects', cards)
  console.log('testing three of a kind', checkForPairs([{integer: 6, name: '6', suit: 'S'}, {integer: 6, name: '6', suit: 'H'}, {integer: 13, name: 'King', suit: 'D'}, {integer: 9, name: '9', suit: 'S'}, {integer: 9, name: '9', suit: 'D'}]));
  // Case for each potential hand ranking, starting at the strongest hand possible (straight flush),
  // then works its way down

  // Four of a Kind
  // For Check Pairs function, I am checking the first element in array
  // to distinguish between different kinds of pairs
  if (checkForPairs(cards).rank === 7) {
    return checkForPairs;
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
    return [1, checkForPairs(numberValues)[1], checkForPairs(numberValues)[2]];
  }
  // X High
  else {
    return [0, checkForPairs(numberValues)[1], checkForPairs(numberValues)[2]];
  }

}
// Creating objects from string values ['14H', '3H', etc] => [{integer: 14, suit: 'H', name: 'ACE'}, {...}]
function cardObject (handAndStreet) {
  console.log('unicorn', handAndStreet);
  handAndStreet = handAndStreet.map(x => {
    let newObj = {};
    if (x.length === 3) {
      switch(x[0]+x[1]) {
        case '10':
          newObj.name = 'Ten';
        break;
        case '11':
          newObj.name = 'Jack';
        break;
        case '12':
          newObj.name = 'Queen';
        break;
        case '13':
          newObj.name = 'King';
        break;
        case '14':
          newObj.name = 'Ace';
        break;
        default:
          return 'error';
      }
    }
    else {
      newObj.name = x[0];
    }
    newObj.suit = x[x.length - 1];
    newObj.integer = parseInt(x.slice(0, x.length-1));
    return newObj;
  })
  return handAndStreet;
}

// Converting cardObjects back to strings
function cardStrings(cards) {
  cards = cards.map(x => x.integer + x.suit);
  return cards;
}

// Used to find  the occurences of all present suits.
function checkForFlush(cards) {

  // Creating an array of arrays that looks like this [ [ 8, 'H' ], [ 6, 'H' ], [ 5, 'H' ], [ 5, 'D' ], [ 5, 'H' ] ]

  cards = cards.sort(function(a,b){return b[0]-a[0]});

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
        return ['Jack High Flush', flush];
      }
      else if (flush[0] === 12) {
        return ['Queen High Flush', flush];
      }
      else if (flush[0] === 13) {
        return ['King High Flush', flush];
      }
      else if (flush[0] === 14) {
        return ['Ace High Flush', flush];
      }
      else {
        return [`${flush[0]} High flush`, flush];
      }
    }
  }
  return false;
}

/**
 * Created by sashamilenkovic on 9/12/18.
 */
// Used to find the occurences of all present integer values
function checkForPairs(cards) {
  // Sorting the array of card objects by descending order by integer property
  cards.sort(function(a,b){return b.integer-a.integer});

  console.log('checkForPairs', cards);
  let bestFiveCards = [];

  // Here I need to iterate over array of card objects and determine if there are matching pairs
  // I wanna keep this object data
  // Need to decide what the shape of the data is going to look like
  // Creating an object with key values being arrays of cards with matching integer
  // {'6': [{}, {}, {}], '5': [{}]}
  // checking card.name because card.integer will actually reverse order
  let pairOccurences = {};
  for (card of cards) {
    if (pairOccurences[card.name] === undefined) {
      pairOccurences[card.name] = [card];
    }
    else {
      pairOccurences[card.name].push(card)
    }
  }
  console.log('pairOccurences', pairOccurences);
  for (let key in pairOccurences) {
    // 4 of a Kind
    if (pairOccurences[key].length === 4) {
      console.log('made it here');
      for (let prop in pairOccurences) {
        if (pairOccurences[prop] !== pairOccurences[key]) {
          pairOccurences[key].push(pairOccurences[prop][0]);
          // Converting card objects back to cardStrings
          bestFiveCards = cardStrings(pairOccurences[key])
          return {rank: 7, name: `Four of a Kind with ${pairOccurences[key][0].name}s`, bestFiveCards: bestFiveCards}
        }
      }
    }
    // FullHouse/Three of a Kind
    if (pairOccurences[key].length === 3) {
      for (let props in pairOccurences) {
          if (pairOccurences[props].length === 2) {
            pairOccurences[key].push(pairOccurences[props][0], pairOccurences[props][1]);
            bestFiveCards = cardStrings(pairOccurences[key]);
            return {rank: 6, name: `Full House, ${pairOccurences[key][0].name}s full of ${pairOccurences[props][0].name}s`, bestFiveCards: bestFiveCards};
          }
      }
      return {rank: 3, name: `3 of a Kind with ${pairOccurences[key][0].name}s`, bestFiveCards: bestFiveCards};
    }
    if (pairOccurences[key].length === 2) {
      for (let props in pairOccurences) {
        if (pairOccurences[props].length === 2 && pairOccurences[props][0].integer !== pairOccurences[key][0].integer) {
          pairOccurences[key].push(pairOccurences[props][0], pairOccurences[props][1]);
          for (let kicker in pairOccurences) {
            if (pairOccurences[kicker] !== pairOccurences[key] && pairOccurences[kicker] !== pairOccurences[props]) {
              pairOccurences[key].push(pairOccurences[kicker][0]);
            }
          }
          bestFiveCards = cardStrings(pairOccurences[key]);
          return {rank: 2, name: `Two Pair with ${pairOccurences[key][0].name}s and ${pairOccurences[props][0].name}s`, bestFiveCards: bestFiveCards};
        }
      }
    }
  }


    // for (let key in pairOccurences) {
    //     if (pairOccurences[key] === 4) {
    //       for (let x = 0; x < cards.length; x++) {
    //         if (cards[x].integer !== parseInt(key)) {
    //           bestFiveCards.push(sortedNumberValues[x]);
    //           return [2, `Two Pair, ${key}s and ${props}s`, bestFiveCards];
    //         }
    //       }
    //       return {rank: 5, name: `4 of a Kind with ${key}s`, bestFiveCards: }
    //         return [5, `4 of a Kind with ${key}s`];
    //     }
    // }
    // for (let key in pairOccurences) {
    //     if (pairOccurences[key] === 3) {
    //         for (let props in pairOccurences) {
    //             if (pairOccurences[props] === 2) {
    //                 return [4, `Full House, ${key}s full of ${props}`];
    //             }
    //         }
    //         return [3, `3 of a Kind with ${key}s`];
    //     }
    // }
    // for (let key in pairOccurences) {
    //   if (pairOccurences[key] === 2) {
    //       for (let props in pairOccurences) {
    //           if (pairOccurences[props] === 2 && key !== props) {
    //             console.log(key, props);
    //             for (let x = 0; x < sortedNumberValues.length; x++) {
    //               if (sortedNumberValues[x] !== key) {
    //                 bestFiveCards.push(sortedNumberValues[x]);
    //                 return [2, `Two Pair, ${key}s and ${props}s`, bestFiveCards];
    //               }
    //             }
    //           }
    //       }
    //
    //       for (let x = 0; x < sortedNumberValues.length; x++) {
    //         if (sortedNumberValues[x] !== key) {
    //           bestFiveCards.push(sortedNumberValues[x]);
    //         }
    //         if (bestFiveCards.length === 3) {
    //           bestFiveCards.unshift(key);
    //           bestFiveCards.unshift(key);
    //           return [1, `Pair of ${key}s`, bestFiveCards];
    //         }
    //       }
    //   }
    // }
    // return [0, `${sortedNumberValues[0]} High`, [sortedNumberValues.slice(0,5)]]

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
