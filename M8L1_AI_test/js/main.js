import { render } from "./ui.js";
import { state, steps } from "./state.js";

let actionDone = false;
let isAnimating = false;

// стартовое окно сразу открыто
document.getElementById("startModal").classList.add("show");

/* =====================
   ОБРАБОТКА СТАРТА
===================== */
document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("startModal").classList.remove("show");
  state.step = 1;
  render();
  updateProgress();
});

/* =====================
   ОБРАБОТКА ФИНАЛА
===================== */
document.getElementById("restartBtn").addEventListener("click", () => {
  document.getElementById("endModal").classList.remove("show");
  state.step = 1;
  render();
  updateProgress();
});

/* =====================
   ГЛАВНЫЙ CLICK HANDLER
===================== */
document.body.addEventListener("click", (e) => {

  /* === Кнопка "Действие" === */
  if (e.target.id === "btnTrain") {

    if (isAnimating) return;
    actionDone = true;
    isAnimating = true;

    const s = steps[state.step];
    const aiText = document.getElementById("aiText");
    const aiStatus = document.getElementById("aiStatus");
    const nextBtn = document.getElementById("btnNext");

    // эффект "думает"
    aiText.textContent = "…";
    aiStatus.textContent = "Думаю...";
    aiText.classList.add("ai-thinking");
    aiStatus.classList.add("ai-thinking");

    // через 1 секунду — реальный ответ
    setTimeout(() => {
      aiText.classList.remove("ai-thinking");
      aiStatus.classList.remove("ai-thinking");

      aiText.textContent = s.aiAfter;
      aiStatus.textContent = s.aiStatusAfter;

      nextBtn.style.display = "inline-flex";
      isAnimating = false;
    }, 1000);
  }

  /* === Кнопка "Дальше" === */
  if (e.target.id === "btnNext") {
    if (!actionDone) return;

    state.step++;
    actionDone = false;

    // если конец — показать финальный модал
    if (state.step > 5) {
      document.getElementById("endModal").classList.add("show");
      return;
    }

    render();
    updateProgress();
  }
});

/* =====================
   ОБНОВЛЕНИЕ ПРОГРЕССА
===================== */
function updateProgress() {
  document.getElementById("progressBar").style.width =
    (state.step / 5 * 100) + "%";

  document.getElementById("stepCircle").textContent = state.step;
  document.getElementById("stepTitle").textContent = steps[state.step].title;
}
