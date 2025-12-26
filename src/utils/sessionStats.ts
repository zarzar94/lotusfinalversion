import type { LabModuleMetrics } from '../types/moduleMetrics';

type SessionAggregate = {
  totalSessions: number;
  averageScore: number;
  sessionDates: string[];
};

const getSessionKey = (entry: LabModuleMetrics): string => entry.sessionId ?? entry.timestamp;

export const getUniqueSessionStats = (sessions: LabModuleMetrics[]): SessionAggregate => {
  const grouped = new Map<string, { sum: number; count: number; latest: number }>();

  sessions.forEach((entry) => {
    const key = getSessionKey(entry);
    const timestamp = new Date(entry.timestamp).getTime();
    const existing = grouped.get(key) ?? { sum: 0, count: 0, latest: timestamp };
    existing.sum += entry.score100;
    existing.count += 1;
    if (Number.isFinite(timestamp) && timestamp > existing.latest) {
      existing.latest = timestamp;
    }
    grouped.set(key, existing);
  });

  const sessionAverages: number[] = [];
  const sessionDates: string[] = [];

  grouped.forEach((group) => {
    sessionAverages.push(group.sum / group.count);
    if (Number.isFinite(group.latest)) {
      sessionDates.push(new Date(group.latest).toDateString());
    }
  });

  const averageScore = sessionAverages.length > 0
    ? Math.round(sessionAverages.reduce((sum, value) => sum + value, 0) / sessionAverages.length)
    : 0;

  return {
    totalSessions: grouped.size,
    averageScore,
    sessionDates,
  };
};

export const getAverageModuleScore = (
  sessions: LabModuleMetrics[],
  moduleId: LabModuleMetrics['moduleId']
): number | null => {
  const moduleSessions = sessions.filter((entry) => entry.moduleId === moduleId);
  if (moduleSessions.length === 0) return null;
  const total = moduleSessions.reduce((sum, entry) => sum + entry.score100, 0);
  return Math.round(total / moduleSessions.length);
};

export const getStreakDays = (sessionDates: string[]): number => {
  if (sessionDates.length === 0) return 0;
  const uniqueDates = Array.from(new Set(sessionDates));
  if (uniqueDates.length === 0) return 0;

  const sortedDates = uniqueDates
    .map((date) => new Date(date).getTime())
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => b - a);

  if (sortedDates.length === 0) return 0;

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const latest = new Date(sortedDates[0]).toDateString();

  if (latest !== today && latest !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i += 1) {
    const diffDays = Math.round((sortedDates[i - 1] - sortedDates[i]) / 86400000);
    if (diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
};
