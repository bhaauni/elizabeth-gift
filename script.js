// CHANGE BETWEEN PAGES

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");
}


// MEMORY PUZZLE GAME

const puzzlePictures = ["🌸", "🧸", "💗", "🌸", "🧸", "💗"];

let firstCard = null;
let secondCard = null;
let lockPuzzle = false;
let matchedPairs = 0;

// Shuffle the cards
function shufflePuzzle() {
    const shuffled = [...puzzlePictures];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const cards = document.querySelectorAll(".memory-card");

    cards.forEach((card, index) => {
        card.textContent = "?";
        card.dataset.picture = shuffled[index];
        card.classList.remove("matched");
        card.disabled = false;
    });
}

function flipCard(card) {
    if (lockPuzzle || card.classList.contains("matched")) {
        return;
    }

    if (card === firstCard) {
        return;
    }

    card.textContent = card.dataset.picture;

    if (firstCard === null) {
        firstCard = card;
        return;
    }

    secondCard = card;
    lockPuzzle = true;

    if (firstCard.dataset.picture === secondCard.dataset.picture) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard.disabled = true;
        secondCard.disabled = true;

        matchedPairs++;

        firstCard = null;
        secondCard = null;
        lockPuzzle = false;

        if (matchedPairs === 3) {
            document.getElementById("puzzleMessage").textContent =
                "You did it! All pairs matched! 🎉";

            document.getElementById("puzzleNext").classList.remove("hidden");
        }
    } else {
        setTimeout(() => {
            firstCard.textContent = "?";
            secondCard.textContent = "?";

            firstCard = null;
            secondCard = null;
            lockPuzzle = false;
        }, 800);
    }
}

shufflePuzzle();


// MOVING HEART GAMES

let heartTimer = null;
let spawnTimer = null;
let currentGame = null;
let score = 0;
let timeLeft = 0;
let gameRunning = false;

function startHeartGame(gameNumber) {
    // Stop any previous game
    clearInterval(heartTimer);
    clearInterval(spawnTimer);

    currentGame = gameNumber;
    score = 0;
    gameRunning = true;

    // Game 1: 5 hearts in 30 seconds
    // Game 2: 10 hearts in 20 seconds

    const target = gameNumber === 1 ? 5 : 10;
    timeLeft = gameNumber === 1 ? 30 : 20;

    const gameArea = document.getElementById(
        gameNumber === 1 ? "heartGameOne" : "heartGameTwo"
    );

    const scoreDisplay = document.getElementById(
        gameNumber === 1 ? "scoreOne" : "scoreTwo"
    );

    const timeDisplay = document.getElementById(
        gameNumber === 1 ? "timeOne" : "timeTwo"
    );

    const message = document.getElementById(
        gameNumber === 1 ? "messageOne" : "messageTwo"
    );

    const startButton = document.getElementById(
        gameNumber === 1 ? "startOne" : "startTwo"
    );

    const nextButton = document.getElementById(
        gameNumber === 1 ? "nextOne" : "nextTwo"
    );

    const retryButton = document.getElementById(
        gameNumber === 1 ? "retryOne" : "retryTwo"
    );

    gameArea.innerHTML = "";
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    message.textContent = "";

    startButton.classList.add("hidden");
    nextButton.classList.add("hidden");
    retryButton.classList.add("hidden");

    // Create a new moving heart
    function createHeart() {
        if (!gameRunning) return;

        const heart = document.createElement("button");

        heart.className = "moving-heart";
        heart.textContent = ["💗", "💖", "💕", "💘"][
            Math.floor(Math.random() * 4)
        ];

        // Random horizontal position
        const maxLeft = Math.max(0, gameArea.clientWidth - 45);
        heart.style.left = Math.random() * maxLeft + "px";

        // Hearts start just above the game area
        heart.style.top = "-45px";

        // Each heart falls at a slightly different speed
        const duration = 2.8 + Math.random() * 1.5;

        heart.style.animationDuration = "1.4s";
        heart.style.transition = `top ${duration}s linear`;

        gameArea.appendChild(heart);

        // Let the heart fall
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                heart.style.top = gameArea.clientHeight + "px";
            });
        });

        // Catching a heart
        heart.addEventListener("click", () => {
            if (!gameRunning) return;

            score++;
            scoreDisplay.textContent = score;

            // Little pop effect
            heart.textContent = "✨";
            heart.style.transform = "scale(1.5)";

            setTimeout(() => heart.remove(), 150);

            if (score >= target) {
                endHeartGame(true);
            }
        });

        // Remove hearts that reach the bottom
        setTimeout(() => {
            if (heart.parentElement) {
                heart.remove();
            }
        }, duration * 1000 + 200);
    }

    // Make hearts appear continuously
    createHeart();

    spawnTimer = setInterval(createHeart, 650);

    // Countdown
    heartTimer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endHeartGame(false);
        }
    }, 1000);
}


// END A HEART GAME

function endHeartGame(won) {
    if (!gameRunning) return;

    gameRunning = false;

    clearInterval(heartTimer);
    clearInterval(spawnTimer);

    const gameArea = document.getElementById(
        currentGame === 1 ? "heartGameOne" : "heartGameTwo"
    );

    const message = document.getElementById(
        currentGame === 1 ? "messageOne" : "messageTwo"
    );

    const nextButton = document.getElementById(
        currentGame === 1 ? "nextOne" : "nextTwo"
    );

    const retryButton = document.getElementById(
        currentGame === 1 ? "retryOne" : "retryTwo"
    );

    // Remove all remaining hearts
    gameArea.innerHTML = "";

    if (won) {
        message.textContent = "YOU DID IT!! 🎉💗";

        nextButton.classList.remove("hidden");
    } else {
        message.textContent = "Awww! Time's up! Try again! 💕";

        retryButton.classList.remove("hidden");
    }
}