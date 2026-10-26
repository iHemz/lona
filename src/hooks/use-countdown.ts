import { useEffect, useState } from "react";

/** Counts down once a second from `seconds` to 0. `restart` starts it again. */
export function useCountdown(seconds: number): { remaining: number; restart: () => void } {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  return { remaining, restart: () => setRemaining(seconds) };
}

/** 28 → "0:28" */
export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}
