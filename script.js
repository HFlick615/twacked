// 1. Your specific image list
// Note: I'm using 8.webp twice to create the 6th match, 
// and I used 318.webp as the "Safe" card.
const cardsArray = [
    { name: '8', img: '8.webp' },
    { name: '9', img: '9.webp' },
    { name: '11', img: '11.webp' },
    { name: '12', img: '12.webp' },
    { name: '5', img: '5.webp' },
    { name: '1', img: '1.webp' }, // Second pair of 8s to make 6 matches
    { name: 'clown', img: '22.webp' },
    { name: 'safe', img: '18.webp' }
];

// 2. This creates the full 16-card deck (7 pairs + clown + safe)
// It takes your 8 files and doubles them.
let gameGrid = [...cardsArray, ...cardsArray];

// 3. The Shuffle (Fisher-Yates)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
shuffle(gameGrid);

const board = document.getElementById('game-board');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

// 4. Create the cards on the screen
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

    // TWACKED LOGIC
    if (this.dataset.name === 'clown') {
        setTimeout(() => {
            alert("TWACKED! Take a shot!");
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
    isMatch ? disableCards() : unflipCards();
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
    }, 1200);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}