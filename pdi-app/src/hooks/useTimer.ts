'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEYS = {
  endTime: 'pdi-timer-end-time',
  left: 'pdi-timer-left',
  running: 'pdi-timer-is-running',
};

export function useTimer(initialSeconds = 7200) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const endTimeStr = localStorage.getItem(STORAGE_KEYS.endTime);
    if (!endTimeStr) return;
    const left = Math.max(0, Math.floor((parseInt(endTimeStr, 10) - Date.now()) / 1000));
    setSecondsLeft(left);
    if (left <= 0) {
      clearTimer();
      setIsRunning(false);
      localStorage.setItem(STORAGE_KEYS.running, 'false');
    }
  }, [clearTimer]);

  // Restore from localStorage on mount
  useEffect(() => {
    const endTimeStr = localStorage.getItem(STORAGE_KEYS.endTime);
    const leftStr = localStorage.getItem(STORAGE_KEYS.left);
    const runningStr = localStorage.getItem(STORAGE_KEYS.running);

    if (endTimeStr && runningStr === 'true') {
      const left = Math.max(0, Math.floor((parseInt(endTimeStr, 10) - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left > 0) {
        setIsRunning(true);
        intervalRef.current = setInterval(tick, 1000);
      }
    } else if (leftStr) {
      setSecondsLeft(parseInt(leftStr, 10));
    }
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = useCallback(() => {
    setIsRunning(true);
    setSecondsLeft((prev) => {
      const secs = prev <= 0 ? initialSeconds : prev;
      const endTime = Date.now() + secs * 1000;
      localStorage.setItem(STORAGE_KEYS.endTime, String(endTime));
      localStorage.setItem(STORAGE_KEYS.running, 'true');
      localStorage.removeItem(STORAGE_KEYS.left);
      return secs;
    });
    clearTimer();
    intervalRef.current = setInterval(tick, 1000);
  }, [clearTimer, tick, initialSeconds]);

  const pause = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setSecondsLeft((prev) => {
      localStorage.setItem(STORAGE_KEYS.running, 'false');
      localStorage.setItem(STORAGE_KEYS.left, String(prev));
      localStorage.removeItem(STORAGE_KEYS.endTime);
      return prev;
    });
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
    localStorage.removeItem(STORAGE_KEYS.endTime);
    localStorage.removeItem(STORAGE_KEYS.left);
    localStorage.setItem(STORAGE_KEYS.running, 'false');
  }, [clearTimer, initialSeconds]);

  const toggle = useCallback(() => {
    if (isRunning) pause();
    else start();
  }, [isRunning, start, pause]);

  return { secondsLeft, isRunning, start, pause, reset, toggle };
}
