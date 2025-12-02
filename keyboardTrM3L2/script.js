document.addEventListener('DOMContentLoaded', function() {
  const keyboardContainer = document.getElementById('keys');
  const gameContainer = document.getElementById('app');
  const prompt = document.getElementById('prompt');
  const timerDisplay = document.getElementById('timer');
  const correctDisplay = document.getElementById('score');
  const startStopBtn = document.getElementById('startStopBtn');
  const winningGifContainer = document.getElementById('winningGifContainer');
  const layoutWarning = document.getElementById('layoutWarning');
  const englishBtn = document.getElementById('englishBtn');
  const russianBtn = document.getElementById('russianBtn');

  let correctCount = 0;
  let activeWord = '';
  let countdown;
  let gameStarted = false;
  let timeLeft = 0;
  let currentLanguage = 'EN';

  function generateWord() {
    const minLength = 4;
    const maxLength = 6;
    const randomLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    const alphabet = currentLanguage === 'EN' ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "АБВГДЕЖЗИЙКЛМНОПРСТУФЦЧШЩЫЬЭЮЯ";
    let generatedWord = '';
    for (let i = 0; i < randomLength; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      generatedWord += alphabet[randomIndex];
    }

    activeWord = generatedWord.toUpperCase();
    prompt.textContent = currentLanguage === 'EN' ? `Print the letters: ${activeWord}` : `Введите буквы: ${activeWord}`;
    highlightNextKey();  // Highlight the next key to be pressed
  }

  function startGame() {
    // Reset and start the game
    gameStarted = true;
    correctCount = 0;
    correctDisplay.textContent = currentLanguage === 'EN' ? 'Correct: 0' : 'Правильно: 0';
    startStopBtn.textContent = 'НАЧАТЬ';
    keyboardContainer.innerHTML = '';
    createKeyboard();
    generateWord();
    gameContainer.classList.remove('hidden');
    resetTimer();
  }

  function endGame() {
    gameStarted = false;
    clearInterval(countdown);
    winningGifContainer.querySelector('#winningGif').src = 'images/win2.gif';
    winningGifContainer.querySelector('#winningText').textContent = currentLanguage === 'EN' ? `You typed ${correctCount} words!` : `Вы набрали ${correctCount} слов!`;
    winningGifContainer.classList.remove('hidden');
    winningGifContainer.style.display = 'block';

    setTimeout(() => {
      winningGifContainer.style.display = 'none';
      startGame(); // Restart the game automatically
    }, 2000);
  }

  function createKeyboard() {
    const keyboardLayout = currentLanguage === 'EN' ?
      [['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M']] :
      [['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х'],
      ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
      ['Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю']];

    keyboardLayout.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.classList.add('key-row');
      row.forEach(key => {
        const keyElement = document.createElement('div');
        keyElement.textContent = key;
        keyElement.classList.add('key');
        keyElement.dataset.key = key; // Set a data attribute for easy reference
        rowDiv.appendChild(keyElement);
      });
      keyboardContainer.appendChild(rowDiv);
    });
  }

  function resetTimer() {
    clearInterval(countdown);
    timeLeft = 70;
    timerDisplay.textContent = `Timer: ${timeLeft} sec`;

    countdown = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `Timer: ${timeLeft} sec`;
      if (timeLeft <= 0) {
        clearInterval(countdown);
        endGame();
      }
    }, 1000);
  }

  function highlightNextKey() {
    const nextLetter = activeWord[0];
    const keyElements = keyboardContainer.getElementsByClassName('key');

    // Remove previous highlights
    Array.from(keyElements).forEach(key => {
      key.classList.remove('active', 'wrong');
    });

    // Highlight the next correct key in green
    const nextKeyElement = Array.from(keyElements).find(key => key.textContent === nextLetter);
    if (nextKeyElement) {
      nextKeyElement.classList.add('active');
    }
  }

  function handleKeyInput(typedLetter) {
    if (!gameStarted) return;

    const isCorrect = typedLetter === activeWord[0];
    updateScore(isCorrect);

    // Find the corresponding virtual key
    const keyElements = keyboardContainer.getElementsByClassName('key');
    const keyElement = Array.from(keyElements).find(key => key.textContent === typedLetter);

    if (keyElement) {
      if (isCorrect) {
        keyElement.classList.add('active'); // Keep it green if correct
      } else {
        keyElement.classList.add('wrong'); // Highlight the key red if wrong
        setTimeout(() => {
          keyElement.classList.remove('wrong'); // Remove the red highlight after 1 second
        }, 1000);
      }
    }

    if (isCorrect) {
      activeWord = activeWord.substring(1);
      if (activeWord === '') {
        generateWord();
      } else {
        prompt.textContent = currentLanguage === 'EN' ? `Print the letters: ${activeWord}` : `Введите буквы: ${activeWord}`;
        highlightNextKey();  // Highlight the next key to be pressed
      }
    }
  }

  function updateScore(isCorrect) {
    if (isCorrect) {
      correctCount++;
      correctDisplay.textContent = currentLanguage === 'EN' ? `Correct: ${correctCount}` : `Правильно: ${correctCount}`;
    }
  }

  document.addEventListener('keydown', (event) => {
    if (!gameStarted) return; // Exit if the game is not started

    const pressedKey = event.key.toUpperCase();
    const validKeys = currentLanguage === 'EN' ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЫЬЭЮЯ";

    if (validKeys.includes(pressedKey)) {
      handleKeyInput(pressedKey);
    } else {
      layoutWarning.classList.remove('hidden');
      layoutWarning.style.display = 'block';
      setTimeout(() => {
        layoutWarning.classList.add('hidden');
        layoutWarning.style.display = 'none';
      }, 2000);
    }
  });

  englishBtn.addEventListener('click', () => {
    currentLanguage = 'EN';
    englishBtn.classList.add('active');
    russianBtn.classList.remove('active');
  });

  russianBtn.addEventListener('click', () => {
    currentLanguage = 'RU';
    russianBtn.classList.add('active');
    englishBtn.classList.remove('active');
  });

  startStopBtn.addEventListener('click', startGame); // Directly starts the game
});
