const mast = ['♠', '♥', '♣', '♦']

const deck = [2,3,4,5,6,7,8,9,10,'J','Q','K','A']

const values = {
    '2' :   2,
    '3' :   3,
    '4' :   4,
    '5' :   5,
    '6' :   6,
    '7' :   7,
    '8' :   8,
    '9' :   9,
    '10':   10,
    'J' :   10,
    'Q' :   10,
    'K' :   10,
    'A' :   11
}

function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {

    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];

    }

    return array
}

function calculateValue(array) {
    let sum = 0

    for (let [a,b] of array) {
        sum+=values[a]
    }

    return sum
}


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
        this.bet += amount
        this.balance -= amount
    }

    draw() {
        this.players_hand.push(this.deck.pop())
        if (calculateValue(this.players_hand)>21) {
            console.log(`${this.players_hand} \nOver the limit! Total sum is ${calculateValue(this.players_hand)}`) 
            this.lost()
        } else if (calculateValue(this.players_hand)==21) {
            console.log(`${this.players_hand} Total sum is ${calculateValue(this.players_hand)}`)
            this.stay()
        } else {
            console.log(`${this.players_hand} Total sum is ${calculateValue(this.players_hand)}`)
        }
    }

    stay() {
        while (calculateValue(this.dealer_hand)<16) {
            this.dealer_hand.push(this.deck.pop())
        }
        if (calculateValue(this.dealer_hand)>calculateValue(this.players_hand) && calculateValue(this.dealer_hand)<22) {
            this.lost()
        } else this.win()
    }

    win() {
        console.log('You won!')
        this.balance+=this.bet
        this.bet=0
        this.dealer_hand = []
        this.players_hand = []
        this.deck = new Deck()
    }

    lost() {
        console.log('You lost! Better luck next time!')
        this.bet=0
        this.dealer_hand = []
        this.players_hand = []
        this.deck = new Deck()
    }
}


const hand1 = new Deck()
const game1 = new Table(500)
game1.placeBet(499)
game1.draw()
console.log(game1)
game1.draw()
console.log(game1)
game1.draw()
console.log(game1)
console.log(game1,game1.balance)

console.log(hand1[0])