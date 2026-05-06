const cardsArray = [
    { name: '8', img: '8.webp' },
    { name: '9', img: '9.webp' },
    { name: '11', img: '11.webp' },
    { name: '12', img: '12.webp' },
    { name: '22', img: '22.webp' },
    { name: '18', img: '18.webp' },
    { name: '1', img: '1.webp' },
    { name: '15', img: '15.webp' }
];

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
    board.innerHTML = ''; // Clears the board completely
    matchesFound = 0;
    currentPlayer = 1;
    updateUIForPlayer(1);
    
    // Create the 15 card deck
    gameGrid = [
        ...cardsArray, ...cardsArray, 
    
        { name: '22', img: '22.webp' },
        
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

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    // Play click sound (if file exists)
    soundClick.currentTime = 0;
    soundClick.play().catch(e => console.log("Audio not loaded yet"));

    this.classList.add('flipped');

    // --- CLOWN LOGIC ---
    if (this.dataset.name === '22') {
        lockBoard = true;
        soundLaugh.play().catch(e => console.log("Audio not loaded yet"));
        
        // Wait 1 second so they can see the clown, then show Game Over screen
        setTimeout(() => {
            showEndScreen("TWACKED!", `Player ${currentPlayer} takes a shot!`, "var(--danger)");
        }, 1200);
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

// UI Controls for Modal
function startGame() {
    overlay.classList.add('fade-out');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
    // If it's the first time playing, init the game
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
    
    // Reset the game board silently in the background
    initGame();
}

function triggerReset() {
    showEndScreen("RESET", "The board has been shuffled.", "white");
}
