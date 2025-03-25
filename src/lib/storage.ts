
import { Timer } from "@/hooks/useTimer";

const STORAGE_KEY = 'friendly-timers';

export const saveTimers = (timers: Timer[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
    return true;
  } catch (error) {
    console.error('Error saving timers to localStorage:', error);
    return false;
  }
};

export const loadTimers = (): Timer[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsedData = JSON.parse(data);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error('Error loading timers from localStorage:', error);
    return [];
  }
};
