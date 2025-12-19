import type { LabModuleMetrics } from '../types/moduleMetrics';

const SESSION_HISTORY_KEY = 'SBLAB_SESSION_HISTORY';
const MAX_HISTORY = 200;

export const saveSession = (metrics: LabModuleMetrics): void => {
  try {
    const existing = getAllSessions();
    const updated = [metrics, ...existing].slice(0, MAX_HISTORY);
    localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save lab module metrics:', error);
  }
};

export const getAllSessions = (): LabModuleMetrics[] => {
  try {
    const data = localStorage.getItem(SESSION_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn('Failed to load lab module metrics:', error);
    return [];
  }
};
