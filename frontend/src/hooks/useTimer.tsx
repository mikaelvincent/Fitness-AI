// hooks/useTimer.tsx

import { useState, useEffect, useCallback } from "react";

/**
 * useTimer hook manages a countdown timer with the ability to set dynamic durations.
 * @param initialTime - The starting time in seconds.
 * @param onExpire - Callback function to be called when the timer expires.
 * @param storageKey - Key for localStorage to persist the timer.
 * @returns An object containing the remaining time, and functions to start, stop, and reset the timer.
 */
const useTimer = (
  initialTime: number = 0,
  onExpire?: () => void,
  storageKey: string = "useTimerExpiry"
): {
  timeLeft: number;
  start: (duration: number) => void;
  stop: () => void;
  reset: () => void;
} => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [isActive, setIsActive] = useState<boolean>(initialTime > 0);

  const startWith = useCallback(
    (duration: number) => {
      const expiryTime = Date.now() + duration * 1000;
      localStorage.setItem(storageKey, expiryTime.toString());
      setTimeLeft(duration);
      setIsActive(true);
    },
    [storageKey]
  );

  const stop = useCallback(() => {
    setIsActive(false);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  const reset = useCallback(() => {
    setTimeLeft(initialTime);
    setIsActive(initialTime > 0);
    localStorage.removeItem(storageKey);
  }, [initialTime, storageKey]);

  useEffect(() => {
    const storedExpiry = localStorage.getItem(storageKey);
    if (storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      const remainingTime = Math.floor((expiryTime - Date.now()) / 1000);
      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
        setIsActive(true);
      } else {
        localStorage.removeItem(storageKey);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsActive(false);
            localStorage.removeItem(storageKey);
            if (onExpire) onExpire();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft, onExpire, storageKey]);

  return { timeLeft, start: startWith, stop, reset };
};

export default useTimer;
