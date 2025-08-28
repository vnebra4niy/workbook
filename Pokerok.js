function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {

    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];

    }

    return array
}

const mast = ['♠', '♥', '♣', '♦']

const deck = [2,3,4,5,6,7,8,9,10,'J','Q','K','A']


class Deck {
    constructor() {
        this.deck = []
        for (let num of deck) {
            for (let m of mast) {
                this.deck.push([num, m])
            }
        }
        return shuffle(this.deck)
    }
}

class Table {
    constructor (balance = 1000) {
        this.balance=balance
        this.deck = new Deck()
        this.dealer_hand = []
        this.players_hand = []
        this.bet = 0
    }

    placeBet(amount) {
        if (amount > this.balance) {
            throw new Error('Not enough chips!')
        }
        this.bet = amount
        this.balance -= amount
    }
}


const hand1 = new Deck()

console.log(hand1[0])