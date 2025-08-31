const suits = ['♠', '♥', '♣', '♦']

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

function prettyHand(hand) {
    return hand.map(([val, suit]) => `${val}${suit}`).join(" ");
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function calculateValue(array) {
    let sum = 0;
    let aces = 0;

    for (let [a] of array) {
        sum += values[a];
        if (a === 'A') aces++;
    }

    while (sum > 21 && aces > 0) {
        sum -= 10;
        aces--;
    }

    return sum;
}

class Deck {
    constructor() {
        this.deck = []
        for (let num of deck) {
            for (let m of suits) {
                this.deck.push([num, m])
            }
        }
        return shuffle(this.deck)
    }
}

class Table {
    constructor(balance = 1000) {
        this.balance = balance
        this.deck = new Deck()
        this.dealer_hand = []
        this.players_hand = []
        this.bet = 0
        this.state = "idle"
    }

    placeBet(amount) {
        if (this.state !== "idle" && this.state !== "roundOver") {
            throw new Error("Can't place bet right now!")
        }
        if (amount > this.balance) {
            throw new Error("Not enough chips!")
        }

        this.bet = amount
        this.balance -= amount
        this.state = "playing"

        this.players_hand.push(this.deck.pop(), this.deck.pop())
        this.dealer_hand.push(this.deck.pop(), this.deck.pop())

        console.log(`Your hand: ${prettyHand(this.players_hand)} (${calculateValue(this.players_hand)})`)
        console.log(`Dealer shows: ${prettyHand([this.dealer_hand[0]])}`)
    }

    async draw() {
        if (this.state !== "playing") {
            console.log("You can't draw right now!")
            return
        }

        await delay(1000)
        this.players_hand.push(this.deck.pop())
        let total = calculateValue(this.players_hand)
        console.log(`You draw: ${prettyHand(this.players_hand)} (${total})`)

        if (total > 21) {
            console.log("Bust! Over 21.")
            await this.lost()
            return
        } else if (total === 21) {
            console.log("21! Stay automatically.")
            await this.stay()
            return
        }
    }

    async stay() {
        if (this.state !== "playing") {
            console.log("You can't stay right now!")
            return
        }
        this.state = "dealer"

        console.log(`Dealer's hand: ${prettyHand(this.dealer_hand)} (${calculateValue(this.dealer_hand)})`)

        while (calculateValue(this.dealer_hand) < 17) {
            await delay(1500)
            this.dealer_hand.push(this.deck.pop())
            console.log(`Dealer draws: ${prettyHand(this.dealer_hand)} (${calculateValue(this.dealer_hand)})`)
        }

        let playerTotal = calculateValue(this.players_hand)
        let dealerTotal = calculateValue(this.dealer_hand)

        if (dealerTotal > 21 || playerTotal > dealerTotal) {
            await this.win()
        } else if (dealerTotal === playerTotal) {
            await this.push()
        } else {
            await this.lost()
        }
    }

    async doubleDown() {
        if (this.state !== "playing") {
            console.log("You can't double down right now!")
            return
        }
        if (this.balance < this.bet) {
            console.log("Not enough chips to double down!")
            return
        }
        this.balance -= this.bet
        this.bet *= 2
        console.log("You doubled down!")
        await this.draw()
        if (calculateValue(this.players_hand) <= 21) {
            await this.stay()
        }
    }

    async win() {
        console.log("You won!")
        this.balance += this.bet * 2
        this.reset()
    }

    async lost() {
        console.log("You lost! Better luck next time!")
        this.reset()
    }

    async push() {
        console.log("It's a push! Bet returned.")
        this.balance += this.bet
        this.reset()
    }

    reset() {
        console.log(`Balance: ${this.balance}`)
        this.bet = 0
        this.dealer_hand = []
        this.players_hand = []
        this.deck = new Deck()
        this.state = "roundOver"
    }
}

const game1 = new Table(500)
game1.placeBet(100)