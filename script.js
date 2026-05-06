:root {
    --p1-gold: #ffcc00;
    --p2-neon: #00ffcc;
    --danger: #ff0055;
}

body {
    background-color: #050505;
    background-image: radial-gradient(circle at center, #1a1a1a 0%, #000 100%);
    color: white;
    font-family: 'Montserrat', sans-serif;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    border: 8px solid var(--p1-gold);
    transition: border 0.5s ease;
    box-sizing: border-box;
}

body.p2-turn { border-color: var(--p2-neon); }

/* Rules Modal / Overlay */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.5s ease;
}

.modal {
    background: rgba(255, 255, 255, 0.05);
    padding: 40px;
    border-radius: 30px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
    max-width: 400px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.logo-text {
    font-family: 'Bangers', cursive;
    font-size: 5rem;
    color: var(--p1-gold);
    text-shadow: 0 0 20px rgba(255, 204, 0, 0.8);
    margin: 0 0 20px 0;
    letter-spacing: 5px;
    transform: rotate(-3deg);
}

.rules-container h2 { font-size: 1.2rem; letter-spacing: 2px; margin-bottom: 20px; color: #aaa; }
.rules-container ul { list-style: none; padding: 0; text-align: left; }
.rules-container li { margin-bottom: 15px; font-size: 0.9rem; display: flex; align-items: center; }

.rules-container span.num {
    background: var(--p1-gold);
    color: black;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 15px;
    font-weight: bold;
}

/* Game Elements */
.turn-indicator {
    font-family: 'Bangers', cursive;
    font-size: 2.5rem;
    letter-spacing: 2px;
    transition: all 0.4s ease;
    margin-top: 20px;
}

body.p1-turn .turn-indicator { color: var(--p1-gold); text-shadow: 0 0 15px var(--p1-gold); }
body.p2-turn .turn-indicator { color: var(--p2-neon); text-shadow: 0 0 15px var(--p2-neon); }

#game-board {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 20px;
    max-width: 450px;
    perspective: 1000px;
}

.card {
    width: 100%;
    aspect-ratio: 2.5 / 3.5;
    /* Updated with quotes for the space in the filename */
    background-image: url("card back.webp");
    background-size: cover;
    border-radius: 12px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
    cursor: pointer;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
}

.card:hover { transform: scale(1.05) translateY(-5px); border-color: rgba(255, 255, 255, 0.5); }

.card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: none;
    border-radius: 10px;
}

.card.flipped {
    background-image: none;
    background-color: white;
    transform: rotateY(0deg);
}

.card.flipped img { display: block; }

/* Buttons */
.start-btn, .control-btn {
    background: var(--p1-gold);
    color: black;
    border: none;
    padding: 15px 40px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    border-radius: 50px;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.3s ease;
    margin-top: 20px;
}

.start-btn:hover, .control-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 0 25px var(--p1-gold);
}

.fade-out { opacity: 0; pointer-events: none; }
