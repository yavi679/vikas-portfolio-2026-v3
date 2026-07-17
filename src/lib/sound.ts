/* Tiny Web Audio UI-sound engine — soft pure-sine blips (from the previous
   portfolio, quieter with a gentle attack). Three gestures:
   - playTick(): scroll detent — the lower, quieter "navigate" tick
   - playOpen(): open a project
   - playTap():  button tap
   Synthesized (no files), always on. Each call resumes the AudioContext, so
   sound plays on every interaction (browsers still require one first gesture
   before any audio can start — that's a platform rule, not a setting here). */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

/* A soft pure-sine blip: gentle attack (no hard click), exponential decay. */
function emit(ac: AudioContext, freq: number, dur: number, vol: number) {
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.connect(g);
  g.connect(ac.destination);
  osc.type = "sine";
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.006); // soft attack takes the edge off
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

/* Play now if the context is running; if it's still suspended (e.g. the very
   first interaction), resume first and play once it's actually running — so
   interaction #1 is audible instead of being swallowed by the async resume. */
function tone(freq: number, dur: number, vol: number) {
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === "suspended") {
    ac.resume().then(() => emit(ac, freq, dur, vol)).catch(() => {});
  } else {
    emit(ac, freq, dur, vol);
  }
}

/* Scroll detent — the lightest of the three. */
export function playTick() {
  tone(700, 0.04, 0.028);
}

/* Open a project. */
export function playOpen() {
  tone(900, 0.05, 0.04);
}

/* Button tap. */
export function playTap() {
  tone(900, 0.05, 0.04);
}
