export function setActiveTab(tabButtons, screenTrainer, screenGame, target){
  tabButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.screen === target));
  screenTrainer.classList.toggle("hidden", target !== "trainer");
  screenGame.classList.toggle("hidden", target !== "game");
}

export function scaleTextToFit(element, maxFontSize = 28, minFontSize = 14){
  let fontSize = maxFontSize;
  element.style.fontSize = fontSize + "px";
  while (element.scrollWidth > element.clientWidth && fontSize > minFontSize) {
    fontSize--;
    element.style.fontSize = fontSize + "px";
  }
}

export function updateProgress(progressBarEl, strengthLabelEl, value /*0..5*/){
  const pct = Math.max(0, Math.min(5, value)) * 20;
  progressBarEl.style.width = pct + "%";
  strengthLabelEl.textContent = `${value}/5`;
  const barWrap = progressBarEl.parentElement;
  if (barWrap && barWrap.getAttribute("role") === "progressbar") {
    barWrap.setAttribute("aria-valuenow", String(value));
  }
}

export function updateAttack(attackBarEl, attackLabelEl, value /*0..100*/){
  const pct = Math.max(0, Math.min(100, value));
  attackBarEl.style.width = pct + "%";
  attackLabelEl.textContent = `${Math.round(pct)}%`;
  const barWrap = attackBarEl.parentElement;
  if (barWrap && barWrap.getAttribute("role") === "progressbar") {
    barWrap.setAttribute("aria-valuenow", String(Math.round(pct)));
  }
}

export function updateChecklist(checklistMap, results, { sealedMode = false } = {}){
  // checklistMap: {len: liEl, ...}
  for (const [id, el] of Object.entries(checklistMap)){
    const ok = Boolean(results[id]);
    el.classList.toggle("valid", ok);

    // В режиме игры: выполненный пункт "запечатывается"
    if (sealedMode) {
      el.classList.toggle("sealed", ok);
      const seal = el.querySelector(".seal");
      if (seal) seal.textContent = ok ? "✅" : "⛔";
    } else {
      const seal = el.querySelector(".seal");
      if (seal) seal.textContent = ok ? "✅" : "⛔";
      el.classList.remove("sealed");
    }
  }
}
