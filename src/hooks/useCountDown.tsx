import { useCallback, useEffect, useRef, useState } from 'react';

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};

export const useCountdown = (time: number) => {
  const [countdown, setCountdown] = useState(time);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }

    const startTime = Date.now();
    setIsCountdownActive(true);

    const tick = () => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const remainingTime = time - elapsedTime;

      setCountdown(remainingTime);

      if (remainingTime > 0) {
        intervalRef.current = requestAnimationFrame(tick);
      } else {
        stop();
      }
    };

    intervalRef.current = requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      cancelAnimationFrame(intervalRef.current);
      intervalRef.current = null;
      setIsCountdownActive(false);
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setCountdown(time);
  }, [stop, time]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    countdown,
    isCountdownActive,
    formattedTime: formatTime(countdown),
    start,
    stop,
    reset,
  };
};
