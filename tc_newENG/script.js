let correctAnswer = 0;

// Тексты на английском
const t = {
  title: "Emoji Math Game",
  startText: "Solve the problem to find out how many stickers are needed for the rocket 🚀",
  startBtn: "Start",
  checkBtn: "Check",
  restartBtn: "Restart",
  correct: (n) => `This is how many stickers to put on the rocket 🚀: ${n}`,
  tryAgain: "Try again 😉"
};

// Устанавливаем тексты
function setTexts() {
  const title = document.getElementById("game-title");
  const startText = document.getElementById("start-text");
  const startBtn = document.getElementById("start-btn");
  const checkBtn = document.getElementById("check-btn");
  const restartBtn = document.getElementById("restart-btn");

  if (title) title.textContent = t.title;
  if (startText) startText.textContent = t.startText;
  if (startBtn) startBtn.textContent = t.startBtn;
  if (checkBtn) checkBtn.textContent = t.checkBtn;
  if (restartBtn) restartBtn.textContent = t.restartBtn;
}

const emojis = ["🍎","🍌","🍒","🍇","🍉","🍓","🥕","🌸","⭐","⚽"];

function randomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function generateNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateGame() {
  const leftCard = document.getElementById("left");
  const rightCard = document.getElementById("right");
  const operatorEl = document.getElementById("operator");

  leftCard.innerHTML = "";
  rightCard.innerHTML = "";

  let leftCount, rightCount, operator, result;

  do {
    leftCount = generateNumber(1, 5);
    rightCount = generateNumber(1, 5);
    operator = Math.random() < 0.5 ? "+" : "-";
    result = operator === "+" ? leftCount + rightCount : leftCount - rightCount;
  } while (result < 2 || result > 6);

  correctAnswer = result;

  for (let i = 0; i < leftCount; i++) {
    const span = document.createElement("span");
    span.className = "emoji";
    span.textContent = randomEmoji();
    leftCard.appendChild(span);
  }

  for (let i = 0; i < rightCount; i++) {
    const span = document.createElement("span");
    span.className = "emoji";
    span.textContent = randomEmoji();
    rightCard.appendChild(span);
  }

  operatorEl.textContent = operator;
}

function checkAnswer() {
  const input = document.getElementById("answer");
  const value = Number(input.value);

  if (value === correctAnswer) {
    document.getElementById("modal-text").textContent = t.correct(correctAnswer);
    document.getElementById("result-modal").classList.add("active");
  } else {
    alert(t.tryAgain);
  }
}

function restartGame() {
  document.getElementById("result-modal").classList.remove("active");
  document.getElementById("answer").value = "";
  generateGame();
}

function startGame() {
  document.getElementById("start-screen").classList.remove("active");
  generateGame();
}

setTexts();

function closeApp() {
  document.body.innerHTML = "<h2 style='text-align:center; margin-top:40px;'>🚀</h2>";
}
