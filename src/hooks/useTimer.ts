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
  jiraTaskId?: string; // Jira task ID, optional
  jiraTaskUrl?: string; // Jira task URL, optional
  archived?: boolean; // Whether the timer is archived
}

export const useTimer = (initialData?: Partial<Timer>) => {
  const [timer, setTimer] = useState<Timer>({
    id: initialData?.id || crypto.randomUUID(),
    name: initialData?.name || 'New Timer',
    timeElapsed: initialData?.timeElapsed || 0,
    status: initialData?.status || 'stopped',
    createdAt: initialData?.createdAt || Date.now(),
    color: initialData?.color || 'blue', // default color
    jiraTaskId: initialData?.jiraTaskId || '',
    jiraTaskUrl: initialData?.jiraTaskUrl || '',
    archived: initialData?.archived || false,
  });

  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (timer.status === 'running') return;

    lastTickRef.current = Date.now();

    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const elapsed = now - (lastTickRef.current || now);
      
      setTimer(prev => ({
        ...prev,
        timeElapsed: prev.timeElapsed + elapsed,
        status: 'running',
      }));
      
      lastTickRef.current = now;
    }, 100);

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

  const updateJiraTask = (taskId: string, taskUrl: string) => {
    setTimer(prev => ({
      ...prev,
      jiraTaskId: taskId,
      jiraTaskUrl: taskUrl,
    }));
  };

  const removeJiraTask = () => {
    setTimer(prev => ({
      ...prev,
      jiraTaskId: '',
      jiraTaskUrl: '',
    }));
  };

  const toggleArchived = () => {
    setTimer(prev => ({
      ...prev,
      archived: !prev.archived,
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
    updateJiraTask,
    removeJiraTask,
    toggleArchived,
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
