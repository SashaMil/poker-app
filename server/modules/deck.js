class Deck {
    constructor() {

        this.deck = [];

        const suits = ['H', 'S', 'C', 'D'];
         const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

         for (let suit in suits) {
             for (let value in values) {
                 this.deck.push(`${values[value]}${suits[suit]}`);
             }
         }
    }

    shuffle() {
        const { deck } = this;
        let m = deck.length, i;

        // While there remain elements to shuffle…
        while (m) {
            i = Math.floor(Math.random() * m--);
            // And swap it with the current element.
            [deck[m], deck[i]] = [deck[i], deck[m]];
        }

        return this;
    }

    deal(){
        return this.deck.pop();
    }
}

module.exports = Deck;
