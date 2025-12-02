let score = 0;

function generateProblem() {
  let num1 = Math.floor(Math.random() * 10) + 1; // числа от 1 до 10
  let num2 = Math.floor(Math.random() * num1); // числа от 0 до num1-1
  document.getElementById("num1").innerText = num1;
  document.getElementById("num2").innerText = num2;
  renderSquares(num1, "visual1");
  renderSquares(num2, "visual2");
  document.getElementById("visual3").innerHTML = "= ?";
  document.getElementById("answer").value = "";
}

function renderSquares(number, elementId) {
  var container = document.getElementById(elementId);
  container.innerHTML = ""; // Очистить контейнер
  for (var i = 0; i < number; i++) {
    var square = document.createElement("div");
    square.className = "square";
    container.appendChild(square);
  }
}

function showModal(imageSrc) {
  var modal = document.getElementById("modal");
  var modalImg = document.getElementById("modal-image");
  modal.style.display = "flex";
  modalImg.src = imageSrc;
  setTimeout(function() {
    closeModal();
  }, 3000);
}

function closeModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";
}

function checkAnswer() {
  var answer = parseInt(document.getElementById("answer").value);
  var num1 = parseInt(document.getElementById("num1").innerText);
  var num2 = parseInt(document.getElementById("num2").innerText);
  var correctAnswer = num1 - num2;

  if (answer === correctAnswer) {
    renderSquares(num1 - num2, "visual3");
    showModal("images/win.gif"); // замените на ссылку на изображение для правильного ответа
    score++;
    document.getElementById("score").innerText = "🧮: " + score;
    setTimeout(generateProblem, 3000);
  } else {
    showModal("images/lose.gif"); // замените на ссылку на изображение для неправильного ответа
  }
}

window.onload = function() {
  generateProblem();
  closeModal();
};
