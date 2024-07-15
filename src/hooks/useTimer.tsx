import { useCallback, useRef, useState } from 'react';

export const useTimer = (time?: number) => {
  const timeRef = useRef<any>();
  const secondsRef = useRef<number>(time ?? 0);
  const [seconds, setSeconds] = useState(time ?? 0);

  const onTimer = useCallback(() => {
    timeRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        const newSeconds = prevSeconds + 1;
        secondsRef.current = newSeconds;
        return newSeconds;
      });
    }, 1000);
  }, []);

  const onCountdown = useCallback(() => {
    timeRef.current = setTimeout(() => {
      setSeconds((prevSeconds) => {
        const newSeconds = prevSeconds - 1;
        secondsRef.current = newSeconds;
        return newSeconds;
      });
    }, 1000);
  }, []);

  const clearTimer = useCallback(() => {
    secondsRef.current = 0;
    setSeconds(0);
    clearInterval(timeRef.current);
  }, []);

  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');

  return {
    seconds: !time ? `${hours}:${minutes}:${remainingSeconds}` : `${remainingSeconds}`,
    onTimer,
    onCountdown,
    clearTimer,
  };
};
