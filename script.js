unction checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        // MATCH FOUND: You are safe!
        matchesFound++;
        disableCards();
       
        // Check if the board is clear
        if (matchesFound === 6) {
            alert("BOARD CLEAR! Everyone survived... this time.");
            location.reload();
        } else {
            // PASS THE BOMB: It's the other person's turn now
            switchPlayer();
        }
    } else {
        // NO MATCH: You're still in the Hot Seat!
        // We flip them back, but we DON'T switch players.
        unflipCards();
        console.log("No match. Player " + currentPlayer + " must try again.");
    }
}

function switchPlayer() {
    currentPlayer = (currentPlayer === 1) ? 2 : 1;
   
    // Update the UI to show who is currently in danger
    const title = document.querySelector('h1');
    title.innerText = "PLAYER " + currentPlayer + " IS IN THE HOT SEAT!";
    title.style.color = (currentPlayer === 1) ? "#ffcc00" : "#00ffcc";
}

 
