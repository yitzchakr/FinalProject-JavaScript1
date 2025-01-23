let deck = shuffleDeck(createDeck());
deck = deck.slice(0, 12);
const elementMap = new Map();
let setsFound = 0;
let timer = 0;
let gameOver = false;
let gamePause = false;
let timerId;
import {currentUser}from "./index"

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
    timerUpdate();
    for (let i = 0; i < 12; i++) {
        let card = deck.pop();
        placecardOnBoard(card);
    }
}

function restartGame() {
    //erase all cards and data
    const board = document.getElementById("board");
    board.innerHTML = "";
    deck = shuffleDeck(createDeck());
    let set = document.getElementById("amount-of-sets");
    set.innerHTML = "0";
    setsFound = 0;
    timer = 0;

    //place cards
    for (let i = 0; i < 12; i++) {
        const card = deck.pop();
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
        if (gamePause) return;
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
                setsFound++;
                updateSetsFoundUI();
            } else {
                setTimeout(noSetFound, 1500);
            }
        }
    });
}

function updateSetsFoundUI() {
    let ii = document.getElementById("amount-of-sets");
    ii.textContent = setsFound;
}

function setFound(cardSet) {
    //how many new cards to add to board
    const deckSize = deck.length;
    let amount;
    if (deckSize >= 3 && getAllCardsOnBoard().length === 12) {
        amount = 3;
    } else {
        amount = 0;
    }
    //if no cards left in deck or more than 12 on board
    const newCards = newCardMaker(amount);
    if (newCards.length === 0) {
        for (const card of cardSet) {
            card.remove();
        }
        endGame();
        return;
    }
    //if cards left in deck we replace the new with old card
    const board = document.getElementById("board");

    cardSet.forEach(card => {
        card.style.transition = "transform 1s ease";
        card.style.transform = "rotate(720deg)";
    });

    setTimeout(() => {
        cardSet.forEach(card => {
            board.replaceChild(newCards.pop(), card);
        });
    }, 1000);
    const cards = board.querySelectorAll('.cardClicked');
    cards.forEach(div => div.classList.remove("cardClicked"));
}


function noSetFound() {
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

function noSetsOnBoard(allCardsOnBoard) {
    for (let i = 0; i < allCardsOnBoard.length - 2; i++) {
        for (let j = i + 1; j < allCardsOnBoard.length - 1; j++) {
            for (let k = j + 1; k < allCardsOnBoard.length; k++) {
                const potentialSet = [allCardsOnBoard[i], allCardsOnBoard[j], allCardsOnBoard[k]];
                if (checkIfSet(potentialSet)) {
                    return false;
                }
            }
        }
    }
    return true;
}


function getAllCardsOnBoard() {
    const board = document.getElementById("board");
    const cardElements = board.querySelectorAll(".card");
    const cards = [];

    cardElements.forEach(cardElement => {
        const card = elementMap.get(cardElement);
        if (card) {
            cards.push(card);
        }
    });
    return cards;
}

function addCards() {
    let allCardsOnBoard = getAllCardsOnBoard();
    if (noSetsOnBoard(allCardsOnBoard)) {
        newCardMaker(3);
        console.log("No sets on board");
    } else {
        console.log("There is a set on board");
    }
}


function timerUpdate() {
    let time = document.getElementById("time-used");
    timerId = setInterval(() => {
        timer++;
        time.textContent = timer.toString();
    }, 1000)
}


function pauseTimer() {
    let pauseBtn = document.getElementById("pause");
    let time = document.getElementById("time-used");
    gamePause = !gamePause;


    if (gamePause) {
        clearInterval(timerId);
        timerId = null;
        pauseBtn.textContent = "Resume Game";
    } else {
        timerId = setInterval(() => {
            timer++;
            time.textContent = timer.toString();
        }, 1000)
        pauseBtn.textContent = "Pause Game";
    }
}

function endGame() {
    let cards = getAllCardsOnBoard();
    if (noSetsOnBoard(cards)) {
        pauseTimer();
        console.log("game endded")
    }
}

