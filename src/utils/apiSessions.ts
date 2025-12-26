import type { AssessmentSession, TestOutcome as ApiTestOutcome } from '../types/api';
import type { TestKey } from '../components/games/types';
import type { LabModuleMetrics } from '../types/moduleMetrics';
import { buildLabMetricsFromApiOutcome } from './labMetrics';

const MODULE_IDS: TestKey[] = [
  'attention',
  'focused_attention',
  'frequency',
  'sequence',
  'dichotic_listening',
  'speech_in_noise',
  'questionnaire',
];

const toModuleId = (key: string): LabModuleMetrics['moduleId'] => {
  if ((MODULE_IDS as string[]).includes(key)) {
    return key as TestKey;
  }
  return 'unknown';
};

const getSessionTimestamp = (session: AssessmentSession): number => {
  if (typeof session.createdAt === 'number') return session.createdAt;
  if (typeof session.date === 'number') return session.date;
  return Date.now();
};

export const mapApiSessionToLabMetrics = (session: AssessmentSession): LabModuleMetrics[] => {
  if (!session?.outcomes || typeof session.outcomes !== 'object') return [];

  const timestamp = getSessionTimestamp(session);
  return Object.entries(session.outcomes)
    .map(([key, outcome]) => {
      if (!outcome || typeof outcome !== 'object') return null;
      return buildLabMetricsFromApiOutcome(
        toModuleId(key),
        outcome as ApiTestOutcome,
        timestamp,
      );
    })
    .filter((entry): entry is LabModuleMetrics => entry !== null);
};

export const mapApiSessionsToLabMetrics = (sessions: AssessmentSession[]): LabModuleMetrics[] => {
  if (!Array.isArray(sessions)) return [];
  return sessions.flatMap((session) => mapApiSessionToLabMetrics(session));
};
