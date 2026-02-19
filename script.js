const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const streakEl = document.getElementById("streak");
const timerEl = document.getElementById("timer");
const feedbackEl = document.getElementById("feedback");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let score = 0;
let lives = 3;
let streak = 0;
let timer;
let timeLeft = 15;
let currentQuestion;
let acceptingAnswers = false;

const questions = [
    {
        question: "A cell engulfs a bacterium. Which process is this?",
        answers: ["Pinocytosis", "Phagocytosis", "Exocytosis", "Diffusion"],
        correct: "Phagocytosis",
        explanation: "Phagocytosis is used to engulf large particles like bacteria."
    },
    {
        question: "The cell releases a hormone outside. Which process?",
        answers: ["Exocytosis", "Phagocytosis", "Pinocytosis", "Osmosis"],
        correct: "Exocytosis",
        explanation: "Exocytosis exports materials outside the cell."
    },
    {
        question: "Cell takes in extracellular fluid.",
        answers: ["Pinocytosis", "Phagocytosis", "Exocytosis", "Active Transport"],
        correct: "Pinocytosis",
        explanation: "Pinocytosis brings in fluid and small dissolved substances."
    },
    {
        question: "LDL enters using specific membrane receptors.",
        answers: ["Diffusion", "Pinocytosis", "Receptor-Mediated Endocytosis", "Osmosis"],
        correct: "Receptor-Mediated Endocytosis",
        explanation: "This process uses receptors to selectively absorb molecules."
    }
];

function startGame() {
    score = 0;
    lives = 3;
    streak = 0;
    timeLeft = 15;
    updateUI();
    startBtn.classList.add("hidden");
    restartBtn.classList.add("hidden");
    nextQuestion();
}

function nextQuestion() {
    feedbackEl.textContent = "";
    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    questionEl.textContent = currentQuestion.question;
    answersEl.innerHTML = "";

    // create answer buttons and use pointer events for better touch/mouse handling
    acceptingAnswers = true;
    currentQuestion.answers.forEach(answer => {
        const btn = document.createElement("button");
        btn.textContent = answer;
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.classList.add('answer-btn');

        btn.addEventListener('pointerup', (e) => {
            if (!acceptingAnswers) return;
            acceptingAnswers = false;
            checkAnswer(answer);
        });

        answersEl.appendChild(btn);
    });

    startTimer();
}

function checkAnswer(answer) {
    clearInterval(timer);
    // prevent accidental double answers
    acceptingAnswers = false;

    if (answer === currentQuestion.correct) {
        streak++;
        score += 10 + (streak * 2);
        feedbackEl.textContent = "✅ Correct! " + currentQuestion.explanation;
    } else {
        streak = 0;
        lives--;
        feedbackEl.textContent = "❌ Incorrect! " + currentQuestion.explanation;
    }

    updateUI();

    if (lives <= 0) {
        endGame();
    } else {
        setTimeout(nextQuestion, 2000);
    }
}

function startTimer() {
    timeLeft = 15 - Math.min(streak, 10); // difficulty increases
    timerEl.textContent = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            lives--;
            streak = 0;
            updateUI();

            if (lives <= 0) {
                endGame();
            } else {
                nextQuestion();
            }
        }
    }, 1000);
}

function updateUI() {
    scoreEl.textContent = score;
    livesEl.textContent = lives;
    streakEl.textContent = streak;
}

function endGame() {
    questionEl.textContent = "Game Over! Final ATP: " + score;
    answersEl.innerHTML = "";
    restartBtn.classList.remove("hidden");
}

startBtn.onclick = startGame;
restartBtn.onclick = startGame;
