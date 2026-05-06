// 1. We define the 7 normal matching pairs (14 cards total)
// Note: I repurposed 'clown.webp' as a normal matching pair since '22.png' is the real threat now!
const regularCards = [
    { name: 'match_8', img: '8.webp' },
    { name: 'match_5', img: '5.webp' },
    { name: 'match_9', img: '9.webp' },
    { name: 'match_11', img: '11.webp' },
    { name: 'match_12', img: '12.webp' },
    { name: 'match_18', img: '18.webp' },
    { name: 'match_22', img: '22.webp' }, 
    { name: 'match_1', img: '1.webp' } // Duplicate of 8 to fill the 7th slot. Replace if you have a 7th image!
];

// Variables
let gameGrid = [];
const board = document.getElementById('game-board');
const statusText = document.getElementById('status-text');
const overlay = document.getElementById('overlay');
const soundClick = document.getElementById('sound-click');
const soundLaugh = document.getElementById('sound-laugh');

let currentPlayer = 1;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchesFound = 0;

// Initializes the game (Called on start and reset)
function initGame() {
    board.innerHTML = ''; 
    matchesFound = 0;
    currentPlayer = 1;
    updateUIForPlayer(1);
    
    // THE BUG FIX: We must explicitly unlock the board when resetting!
    lockBoard = false;
    hasFlippedCard = false;
    firstCard = null;
    secondCard = null;
    
    // 2. Build the 16-card deck: 7 pairs (14 cards) + 2 Clowns (22.png)
    gameGrid = [
        ...regularCards, 
        ...regularCards, 
        { name: '22', img: '22.webp' }, 
        { name: '22', img: '22.webp' }
    ];

    shuffle(gameGrid);

    // Build the HTML for the cards
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
}

// Fisher-Yates Shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    // Play click sound (ignore errors if audio file is missing)
    if(soundClick) {
        soundClick.currentTime = 0;
        soundClick.play().catch(e => console.log("Audio not loaded"));
    }

    this.classList.add('flipped');

    // --- THE BULLETPROOF CLOWN LOGIC ---
    // If the card is EITHER of the two "22.png" danger clowns, game over!
    if (this.dataset.name === '22') {
        lockBoard = true; // Lock the board so they can't click anything else
        
        if(soundLaugh) soundLaugh.play().catch(e => console.log("Audio not loaded"));
        
        // Wait 1.2 seconds so they can see the clown, then show Game Over screen
        setTimeout(() => {
            showEndScreen("TWACKED!", `Player ${currentPlayer} hit the Clown and takes a shot!`, "var(--danger)");
        }, 1200);
        return;
    }

    // Normal matching logic
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
        // If they find all 7 pairs, they win!
        if (matchesFound === 7) {
            setTimeout(() => {
                showEndScreen("SURVIVED!", "The board is clear. Everyone wins!", "var(--p2-color)");
            }, 800);
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
    resetBoardVariables();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoardVariables();
    }, 1000);
}

function resetBoardVariables() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function switchPlayer() {
    currentPlayer = (currentPlayer === 1) ? 2 : 1;
    updateUIForPlayer(currentPlayer);
}

function updateUIForPlayer(playerNum) {
    const body = document.body;
    if (playerNum === 1) {
        statusText.innerText = "PLAYER 1: YOUR TURN!";
        body.className = 'p1-turn';
    } else {
        statusText.innerText = "PLAYER 2: YOUR TURN!";
        body.className = 'p2-turn';
    }
}

// --- UI Controls for Modal ---
function startGame() {
    overlay.classList.add('fade-out');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
    
    // Only init if the board is empty (first time playing)
    if (board.innerHTML === '') {
        initGame();
    }
}

function showEndScreen(titleText, subtitleText, titleColor) {
    document.getElementById('modal-title').innerText = titleText;
    document.getElementById('modal-title').style.color = titleColor;
    document.getElementById('modal-content').innerHTML = `<h2>${subtitleText}</h2>`;
    document.getElementById('modal-btn').innerText = "PLAY AGAIN";
    
    overlay.style.display = 'flex';
    setTimeout(() => { overlay.classList.remove('fade-out'); }, 50);
    
    // Reset the game board silently behind the menu overlay so it's ready when they click Play Again
    initGame();
}

function triggerReset() {
    showEndScreen("RESETTING", "Shuffling the deck...", "white");
}
