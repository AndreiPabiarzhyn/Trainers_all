const generateRandomWord = () => {
  const letters = 'ASDFGHJKL';
  const minLength = 3;
  const maxLength = 4;
  const wordLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  let word = '';
  for (let i = 0; i < wordLength; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    word += letters[randomIndex];
  }

  return word;
};

let timer;
let timeLeft = 60;
let correctCount = 0;
let wrongCount = 0;
let currentIndex = -1;

const words = [];
const numberOfWords = 15;

for (let i = 0; i < numberOfWords; i++) {
  words.push(generateRandomWord());
}

function startGame() {
  const startButton = document.getElementById("startButton");
  startButton.style.display = "none"; // Скрыть кнопку Start
  startButton.style.margin = "auto"; // Установить отступы для центрирования
  document.getElementById("resultModal").style.display = "none"; // Скрыть модальное окно при начале игры
  timer = setInterval(updateTimer, 1000);
  showWord();
}

function updateTimer() {
  timeLeft--;
  document.getElementById("timer").textContent = timeLeft;
  if (timeLeft === 0) {
    clearInterval(timer);
    showModal();
    const startButton = document.getElementById("startButton");
    startButton.style.display = "block"; // Показать кнопку Start
    startButton.style.margin = "auto"; // Установить отступы для центрирования
  }
}

function showModal() {
  const modal = document.querySelector(".modal");
  modal.style.display = "flex";
  modal.style.justifyContent = "center"; // Попробуйте добавить это
  modal.style.alignItems = "center"; // И это
  document.getElementById("resultModal").style.display = "block";
  document.getElementById("modalCorrectCount").textContent = correctCount;
  document.getElementById("modalWrongCount").textContent = wrongCount;
}

function showWord() {
  currentIndex++;
  if (currentIndex === words.length) {
    currentIndex = 0;
  }
  document.getElementById("word").textContent = words[currentIndex];
}

function checkInput(event) {
  const userInput = document.getElementById("userInput").value.trim().toLowerCase();
  const currentWord = words[currentIndex].toLowerCase();

  if (event.inputType === "deleteContentBackward" || event.inputType === "deleteContentForward") {
    return;
  }

  if (event.code === "Backspace" || event.code === "Delete") {
    return;
  }

  if (userInput === currentWord) {
    correctCount++;
    document.getElementById("correctCount").textContent = correctCount;
    showWord();
    document.getElementById("userInput").value = "";
  } else if (currentWord.startsWith(userInput)) {
    // Не начислять ошибку, если ввод пользователя начинается с букв текущего слова
    return;
  } else {
    wrongCount++;
    document.getElementById("wrongCount").textContent = wrongCount;
  }
}


function resetGame() {
  timeLeft = 60;
  correctCount = 0;
  wrongCount = 0;
  currentIndex = -1;
  document.getElementById("timer").textContent = timeLeft;
  document.getElementById("correctCount").textContent = correctCount;
  document.getElementById("wrongCount").textContent = wrongCount;
  document.getElementById("userInput").value = "";
  document.getElementById("startButton").disabled = false;
  document.getElementById("resultModal").style.display = "none";
}

window.onload = function() {
  document.getElementById("resultModal").style.display = "none"; // Скрыть модальное окно при загрузке страницы
  
  document.getElementById("startButton").addEventListener("click", startGame);
  document.getElementById("userInput").addEventListener("input", checkInput);
  document.getElementById("restartButton").addEventListener("click", resetGame);
};
