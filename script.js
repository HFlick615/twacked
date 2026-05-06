// 1. Updated for your specific file names
const cardsArray = [
    { name: '8', img: '8.webp' },
    { name: '9', img: '9.webp' },
    { name: '11', img: '11.webp' },
    { name: '12', img: '12.webp' },
    { name: '22', img: '22.png' },     // Corrected to .png
    { name: '18', img: '18.webp' }     // Corrected to 18.webp
];

// 2. Create the deck: 6 pairs + 2 Clowns + 1 Safe card = 15 total
let gameGrid = [
    ...cardsArray, ...cardsArray, 
    { name: 'clown', img: 'clown.webp' }, 
    { name: 'clown', img: 'clown.webp' },
    { name: 'safe', img: '18.webp' }   // Corrected to 18.webp
];

// Fisher-Yates Shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
shuffle(gameGrid);

const board = document.getElementById('game-board');
const statusText = document.getElementById('status-text');
let currentPlayer = 1;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchesFound = 0;

// Create the cards
gameGrid.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = item.name; 

    const img = document.createElement('img');
    img.src = item.img;
    
    card.appendChild(img);
    board.appendChild(card);

    card.addEventListener('click', flipCard);
});

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (this.dataset.name === 'clown') {
        lockBoard = true;
        setTimeout(() => {
            alert("TWACKED! Player " + currentPlayer + " takes a shot!");
            location.reload(); 
        }, 500);
        return;
    }

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        matchesFound++;
        disableCards();
        if (matchesFound === 6) {
            setTimeout(() => {
                alert("SURVIVED! The board is clear.");
                location.reload();
            }, 500);
        } else {
            switchPlayer(); 
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function switchPlayer() {
    currentPlayer = (currentPlayer === 1) ? 2 : 1;
    const body = document.body;

    if (currentPlayer === 1) {
        statusText.innerText = "PLAYER 1: FIND A MATCH!";
        body.className = 'p1-turn';
    } else {
        statusText.innerText = "PLAYER 2: FIND A MATCH!";
        body.className = 'p2-turn';
    }
}
