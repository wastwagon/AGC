/** Short UI beep for scanner outcomes (best-effort; may be blocked by browser autoplay policy). */
export function playCheckInTone(outcome: "success" | "duplicate" | "error") {
  if (typeof window === "undefined") return;
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = outcome === "success" ? 920 : outcome === "duplicate" ? 520 : 200;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
    osc.onended = () => void ctx.close().catch(() => {});
  } catch {
    /* ignore */
  }
}

export function vibrateCheckIn(outcome: "success" | "duplicate" | "error") {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  if (outcome === "success") navigator.vibrate(35);
  else if (outcome === "duplicate") navigator.vibrate([30, 45, 30]);
  else navigator.vibrate([50, 70, 50]);
}
