import TEXTS from "./texts.js";
import { evaluatePassword } from "./passwordRules.js";
import { generateStrongPassword } from "./generator.js";
import {
  setActiveTab,
  scaleTextToFit,
  updateProgress,
  updateAttack,
  updateChecklist
} from "./ui.js";
import { HackerGame } from "./game.js";

// ===== i18n apply =====
function applyTexts(){
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (TEXTS[key] != null) el.textContent = TEXTS[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (TEXTS[key] != null) el.setAttribute("placeholder", TEXTS[key]);
  });
}

applyTexts();

// DOM
const passwordInput = document.getElementById("passwordInput");
const feedback = document.getElementById("feedback");
const hint = document.getElementById("hint");
const progressBar = document.getElementById("progressBar");
const strengthLabel = document.getElementById("strengthLabel");

const checklistMap = {
  len: document.getElementById("len"),
  lower: document.getElementById("lower"),
  upper: document.getElementById("upper"),
  digit: document.getElementById("digit"),
  symbol: document.getElementById("symbol")
};

const toggleBtn = document.getElementById("togglePassword");
const generateBtn = document.getElementById("generatePassword");
const clearBtn = document.getElementById("clearPassword");

// Tabs/screens
const tabButtons = Array.from(document.querySelectorAll(".tab"));
const screenTrainer = document.getElementById("screen-trainer");
const screenGame = document.getElementById("screen-game");

// Game meters
const gameMeters = document.getElementById("gameMeters");
const attackBar = document.getElementById("attackBar");
const attackLabel = document.getElementById("attackLabel");
const timeLabel = document.getElementById("timeLabel");
const timePill = document.getElementById("timePill");

// Game controls
const gameStart = document.getElementById("gameStart");
const gameRestart = document.getElementById("gameRestart");
const gameHard = document.getElementById("gameHard");
const gameBadge = document.getElementById("gameBadge");

// Overlay
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const overlayAgain = document.getElementById("overlayAgain");
const overlayToTrainer = document.getElementById("overlayToTrainer");

// State
let currentScreen = "trainer";
let lastEval = { score: 0, results: { len:false, lower:false, upper:false, digit:false, symbol:false } };

function formatMs(ms){
  const s = Math.ceil(ms / 1000);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function getStrengthText(score){
  const key = "s" + String(score);
  return TEXTS[key] ?? TEXTS.s0;
}

function setFeedbackByScore(score){
  if (passwordInput.value.length === 0) {
    feedback.textContent = "🤖";
    feedback.style.color = "#ffffff";
    feedback.style.fontSize = "26px";
    hint.textContent = TEXTS.hintDefault;
    return;
  }

  const { text, color } = getStrengthText(score);
  feedback.textContent = text;
  feedback.style.color = color;
  scaleTextToFit(feedback, 28, 14);

  hint.textContent = (score < 5) ? TEXTS.hintAddMore : TEXTS.hintGreat;
}

function applyEvaluation(pwd){
  lastEval = evaluatePassword(pwd);

  updateChecklist(checklistMap, lastEval.results, { sealedMode: currentScreen === "game" });
  updateProgress(progressBar, strengthLabel, lastEval.score);
  setFeedbackByScore(lastEval.score);
}

// ===== Overlay helpers (FIX) =====
function showOverlay(title, text){
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
}

function hideOverlay(){
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

// Закрытие по клику на фон
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) hideOverlay();
});

// ESC закрывает overlay
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !overlay.classList.contains("hidden")) hideOverlay();
});

// Input listener
passwordInput.addEventListener("input", () => applyEvaluation(passwordInput.value));

// Toggle show/hide
toggleBtn.addEventListener("click", () => {
  const hidden = passwordInput.type === "password";
  passwordInput.type = hidden ? "text" : "password";
  toggleBtn.textContent = hidden ? TEXTS.btnHide : TEXTS.btnShow;
});

// Generate
generateBtn.addEventListener("click", () => {
  const generated = generateStrongPassword(12);
  passwordInput.value = generated;
  passwordInput.dispatchEvent(new Event("input"));
});

// Clear
clearBtn.addEventListener("click", () => {
  passwordInput.value = "";
  passwordInput.dispatchEvent(new Event("input"));
  passwordInput.focus();
});

// Tabs
tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentScreen = btn.dataset.screen;
    setActiveTab(tabButtons, screenTrainer, screenGame, currentScreen);

    gameMeters.classList.toggle("hidden", currentScreen !== "game");
    applyEvaluation(passwordInput.value);

    if (currentScreen !== "game") {
      game.stop();
      gameBadge.textContent = TEXTS.badgeOff;
      hideOverlay();
      updateAttack(attackBar, attackLabel, 0);
      timeLabel.textContent = "—";
      timePill.textContent = "—";
    } else {
      game.reset();
      gameBadge.textContent = TEXTS.badgeOff;
    }
  });
});

// GAME
const game = new HackerGame({
  getScore: () => lastEval.score,
  getSealedCount: () => Object.values(lastEval.results).filter(Boolean).length,

  onTick: ({ timeLeftMs, attack, running, difficulty }) => {
    updateAttack(attackBar, attackLabel, attack);

    const t = formatMs(timeLeftMs);
    timeLabel.textContent = t;
    timePill.textContent = running ? t : "—";

    if (running) {
      gameBadge.textContent = (difficulty === "hard") ? TEXTS.badgeOnHard : TEXTS.badgeOnNormal;
    } else {
      if (currentScreen === "game") gameBadge.textContent = TEXTS.badgeOff;
    }
  },

  onWin: () => {
    showOverlay(TEXTS.winTitle, TEXTS.winText);
    gameBadge.textContent = TEXTS.badgeWin;
  },

  onLose: (reason) => {
    const text = TEXTS.loseText.replace("{reason}", reason);
    showOverlay(TEXTS.loseTitle, text);
    gameBadge.textContent = TEXTS.badgeFail;
  }
});

// Game buttons
gameStart.addEventListener("click", () => {
  hideOverlay();
  game.start();
});

gameRestart.addEventListener("click", () => {
  hideOverlay();
  game.reset();
});

gameHard.addEventListener("click", () => {
  const next = game.difficulty === "hard" ? "normal" : "hard";
  game.setDifficulty(next);
  gameHard.textContent = (next === "hard") ? (TEXTS.btnHard + ": ON") : TEXTS.btnHard;
});

// Overlay buttons (FIX: точно работают)
overlayAgain.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  hideOverlay();
  game.reset();
  game.start();
});

overlayToTrainer.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  hideOverlay();

  currentScreen = "trainer";
  setActiveTab(tabButtons, screenTrainer, screenGame, "trainer");
  gameMeters.classList.add("hidden");
  game.stop();
  gameBadge.textContent = TEXTS.badgeOff;
  applyEvaluation(passwordInput.value);
});

// init
setActiveTab(tabButtons, screenTrainer, screenGame, currentScreen);
gameMeters.classList.add("hidden");
toggleBtn.textContent = TEXTS.btnShow;
applyEvaluation("");
