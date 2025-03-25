
import { useState, useRef, useEffect } from 'react';

export type TimerStatus = 'stopped' | 'running' | 'paused';

export interface Timer {
  id: string;
  name: string;
  timeElapsed: number; // in milliseconds
  status: TimerStatus;
  createdAt: number; // timestamp
  lastUpdated?: number; // timestamp of last update, optional
  color?: string; // timer color, optional
}

export const useTimer = (initialData?: Partial<Timer>) => {
  const [timer, setTimer] = useState<Timer>({
    id: initialData?.id || crypto.randomUUID(),
    name: initialData?.name || 'New Timer',
    timeElapsed: initialData?.timeElapsed || 0,
    status: initialData?.status || 'stopped',
    createdAt: initialData?.createdAt || Date.now(),
    color: initialData?.color || 'blue', // default color
  });

  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    // If already running, do nothing
    if (timer.status === 'running') return;

    // Set the last tick to now
    lastTickRef.current = Date.now();

    // Start the interval
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const elapsed = now - (lastTickRef.current || now);
      
      setTimer(prev => ({
        ...prev,
        timeElapsed: prev.timeElapsed + elapsed,
        status: 'running',
      }));
      
      lastTickRef.current = now;
    }, 100); // Update every 100ms for smoother display

    setTimer(prev => ({
      ...prev,
      status: 'running',
    }));
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setTimer(prev => ({
      ...prev,
      status: 'paused',
    }));
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setTimer(prev => ({
      ...prev,
      timeElapsed: 0,
      status: 'stopped',
    }));
  };

  const resumeTimer = () => {
    startTimer();
  };

  const updateName = (name: string) => {
    setTimer(prev => ({
      ...prev,
      name,
    }));
  };

  const updateColor = (color: string) => {
    setTimer(prev => ({
      ...prev,
      color,
    }));
  };

  return {
    timer,
    startTimer,
    pauseTimer,
    stopTimer,
    resumeTimer,
    updateName,
    updateColor,
  };
};

export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number): string => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
