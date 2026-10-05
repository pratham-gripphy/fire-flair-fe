import { useCallback, useEffect, useState } from "react";

/** Counts down from `seconds` once started; `restart` begins a fresh
 *  countdown. `canResend` flips true when it reaches zero. */
export function useResendTimer(seconds: number) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = window.setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => window.clearTimeout(id);
  }, [remaining]);

  const restart = useCallback(() => setRemaining(seconds), [seconds]);
  const reset = useCallback(() => setRemaining(0), []);

  return { remaining, canResend: remaining <= 0, restart, reset };
}

/** 65 -> "1:05" */
export const formatCountdown = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
