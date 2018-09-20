const Deck = require('../modules/deck.js');

const preflopEvaluation = (card1, card2, range) => {
    const values = ['14','13','12','11','10','9','8','7','6','5','4','3','2'];
    let allPossibleHands = [];
    // First I am creating an array of array of all possible hands. The value of each row of hands will be in descending order
    for (let x = 0; x < values.length; x++) {
        var row = [];
        for (let y = 0; y < values.length; y++) {
            if (y >= x) {
                if (values[x] === values[y]) {
                    row.push(values[x] + values[y])
                }
                else {
                    row.push(values[x] + values[y] + 's');
                }
            }
            else {
                row.push(values[x] + values[y] + 'o');
            }
        }
        allPossibleHands.push(row);
    }
    console.log('All Possible Hands', allPossibleHands);
    // Now I am going to take that array of all possible hands and reduce it by the chosen proportion to arrive at an array of hand which I would perform an action,
    // I will also be adding an array of all pairs (because pairs are valuable)
    const allPairs = ['1414', '1313', '1212', '1111', '1010', '99', '88', '77', '66', '55', '44', '33', '22'];
    let possibleRange = [];
    possibleRange.push(allPairs);
    for (let x = 0; x < range; x++) {
        possibleRange.push(allPossibleHands[x].slice(0, 10));
    }
    // Here I am formatting the given cards to match the values I have produced above
    let hand = formatHand(card1, card2);

    // I am iterating over the formatted hand to see if it matches any two cards in the given range.
    for (let x = 0; x < possibleRange.length; x++) {
        for (let y = 0; y < possibleRange[x].length; y++) {
            if (possibleRange[x][y] === hand[0]) {
                return true;
            }
        }
    }
    // I am doing this twice because card order matters due to how I produced the possible hands
    for (let x = 0; x < possibleRange.length; x++) {
        for (let y = 0; y < possibleRange[x].length; y++) {
            if (possibleRange[x][y] === hand[1]) {
                return true;
            }
        }
    }
    return false;
};

// Helper function that will format cards so I can compare them
function formatHand(card1, card2) {
    // First want to check if the suits are the same, store true or false in var suited for later use
    let suited = null;
    if (card1[card1.length - 1] === card2[card2.length - 1]) {
        suited = true
    }
    else {
        suited = false;
    }
    // Slice off suit from each hand
    card1 = card1.slice(0, -1);
    card2 = card2.slice(0, -1);

    // Check is either card is an ace
    if (card1.length === 1 && card1[0] === '1') {
        card1 = '14'
    }
    if (card2.length === 1 && card2[0] === '1') {
        card2 = '14';
    }
    // Add both combos of hands with a suit or not a suit
    if (suited) {
        return [card1+card2+'s', card2+card1+'s'];
    }
    else {
        return [card1+card2+'o', card2+card1+'o'];
    }
}

module.exports = preflopEvaluation;
