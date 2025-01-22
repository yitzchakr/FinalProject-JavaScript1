let deck = shuffleDeck(createDeck());
const elementMap = new Map();


// Function to create a of 81 cards
function createDeck() {
    const deck = [];
    const numbers = [1, 2, 3];
    const shapes = ["circle", "rectangle", "square"];
    const colors = ["red", "green", "purple"];
    const fillings = ["solid", "striped", "empty"];

    let cardId = 1;
    // Generate all 81 cards
    for (const number of numbers) {
        for (const shape of shapes) {
            for (const color of colors) {
                for (const filling of fillings) {
                    deck.push({id: cardId++, number, shape, color, filling});
                }
            }
        }
    }
    return deck;
}

//shuffle function
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swaps those two indexes with each other
    }
    return deck;
}

function initializeGame() {
    const startButton = document.getElementById('startButton');
    startButton.disabled = true;

    for (let i = 0; i < 12; i++) {
        let card = deck.pop();
        placecardOnBoard(card);
    }
}

function newCardMaker(amount) {
    let newCards = [];
    for (let i = 0; i < amount; i++) {
        let card = deck.pop();
        newCards[i] = createCardElement(card)
    }
    return newCards;
}

function createCardElement(card) {
    const cardDiv = document.createElement("div");
    cardDiv.id = `card-${card.id}`;
    cardDiv.className = "card";
    elementMap.set(cardDiv, card);

    document.getElementById("board").appendChild(cardDiv);

    for (let i = 0; i < card.number; i++) {
        let pic = document.createElement("div");
        let properties = Object.values(card);
        pic.className = properties.slice(2,).join(" ");
        cardDiv.appendChild(pic);
    }
    addCardClickBehavior(cardDiv, card);

    return cardDiv;
}

function placecardOnBoard(card) {
    const cardDiv = createCardElement(card);
    document.getElementById("board").appendChild(cardDiv);
}


function addCardClickBehavior(cardDiv, card) {
    let isClicked = false;
    let board = document.getElementById("board");
    cardDiv.addEventListener("click", () => {
        isClicked = !isClicked;
        if (isClicked) {
            cardDiv.classList.add('cardClicked');
        } else {
            cardDiv.classList.remove('cardClicked');
        }
        let listClickedElements = board.querySelectorAll('.cardClicked');
        if (listClickedElements.length === 3) {
            let cards = getSetOfClickedCards(listClickedElements);
            let isSet = checkIfSet(cards);
            console.log(isSet);
            if (isSet) {
                setFound(listClickedElements);
            } else {
                setTimeout(noSetfound, 1500);
            }
        }
    });
}

function setFound(cardSet) {
    const deckSize = deck.length;
    let amount;
    if (deckSize >= 3) {
        amount = 3;
    } else {
        amount = deckSize;
    }

    const newcards = newCardMaker(amount);
    if (newcards.length === 0) {
        for (const card of cardSet) {
            card.remove();
        }
        return;
    }
    const board = document.getElementById("board");
    for (const card of cardSet) {
        board.replaceChild(newcards.pop(), card)
    }

    const cards = board.querySelectorAll('.cardClicked');
    cards.forEach(div => div.classList.remove("cardClicked"));
}

function noSetfound() {
    const board = document.getElementById("board");
    const cards = board.querySelectorAll('.cardClicked');
    cards.forEach(div => div.classList.remove("cardClicked"));
}

function getSetOfClickedCards(list) {
    const cards = [];
    for (let i = 0; i < list.length; i++) {
        cards.push(elementMap.get(list[i]));
    }
    return cards;
}


// Function to check if 3 cards form a set (replace with your logic)
function checkIfSet(cards) {
    // Implement your logic to check if the three cards in the `cards` array form a set based on their properties (number, shape, color, filling)
    // This example provides a placeholder logic (replace with your actual set checking)
    const numberSet = new Set(cards.map(card => card.number));
    const shapeSet = new Set(cards.map(card => card.shape));
    const colorSet = new Set(cards.map(card => card.color));
    const fillingSet = new Set(cards.map(card => card.filling));
    return (numberSet.size === 1 || numberSet.size === 3) &&
        (shapeSet.size === 1 || shapeSet.size === 3) &&
        (colorSet.size === 1 || colorSet.size === 3) &&
        (fillingSet.size === 1 || fillingSet.size === 3);
}

