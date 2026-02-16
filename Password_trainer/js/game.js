export class HackerGame {
  constructor(opts){
    this.onTick = opts.onTick;       // ({timeLeftMs, attack, running, difficulty})
    this.onWin = opts.onWin;         // ()
    this.onLose = opts.onLose;       // (reason)
    this.getScore = opts.getScore;   // () => number 0..5
    this.getSealedCount = opts.getSealedCount; // () => number 0..5

    this.running = false;
    this.timerId = null;

    this.difficulty = "normal"; // normal | hard
    this.totalMs = 30000;       // 30s
    this.timeLeftMs = this.totalMs;

    this.attack = 0;            // 0..100
    this.lastTs = null;
  }

  setDifficulty(mode){
    this.difficulty = (mode === "hard") ? "hard" : "normal";
  }

  reset(){
    this.stop();
    this.timeLeftMs = this.totalMs;
    this.attack = 0;
    this.lastTs = null;
    this.onTick?.(this.snapshot());
  }

  start(){
    if (this.running) return;
    this.running = true;
    this.lastTs = performance.now();
    this.timerId = requestAnimationFrame(this.loop);
    this.onTick?.(this.snapshot());
  }

  stop(){
    this.running = false;
    if (this.timerId) cancelAnimationFrame(this.timerId);
    this.timerId = null;
  }

  snapshot(){
    return {
      timeLeftMs: this.timeLeftMs,
      attack: this.attack,
      running: this.running,
      difficulty: this.difficulty
    };
  }

  loop = (ts) => {
    if (!this.running) return;

    const dt = ts - (this.lastTs ?? ts);
    this.lastTs = ts;

    // таймер
    this.timeLeftMs = Math.max(0, this.timeLeftMs - dt);

    // скорость атаки зависит от сложности и от "защиты"
    // чем больше выполненных пунктов, тем медленнее атака
    const sealed = this.getSealedCount(); // 0..5
    const baseSpeed = (this.difficulty === "hard") ? 6.0 : 4.0; // % в секунду
    const defenseFactor = 1 - (sealed * 0.12); // до -60%
    const speed = Math.max(1.2, baseSpeed * defenseFactor);

    this.attack = Math.min(100, this.attack + (speed * (dt / 1000)));

    // победа: стал 5/5
    if (this.getScore() >= 5) {
      this.stop();
      this.onTick?.(this.snapshot());
      this.onWin?.();
      return;
    }

    // поражение: атака 100 или время 0
    if (this.attack >= 100) {
      this.stop();
      this.onTick?.(this.snapshot());
      this.onLose?.("Атака достигла 100%");
      return;
    }

    if (this.timeLeftMs <= 0) {
      this.stop();
      this.onTick?.(this.snapshot());
      this.onLose?.("Время вышло");
      return;
    }

    this.onTick?.(this.snapshot());
    this.timerId = requestAnimationFrame(this.loop);
  }
}
