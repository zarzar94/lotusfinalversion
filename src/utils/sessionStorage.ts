import type { LabModuleMetrics } from '../types/moduleMetrics';
import type { TestMetrics, TestTrial } from '../components/games/types';

const SESSION_HISTORY_KEY = 'SBLAB_SESSION_HISTORY';
const MAX_HISTORY = 200;

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeBand = (value: unknown, score100: number | null): LabModuleMetrics['band'] => {
  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    if (normalized === 'high') return 'high';
    if (normalized === 'mid') return 'mid';
    if (normalized === 'low') return 'low';
    if (normalized === 'medium') return 'mid';
  }
  if (score100 !== null) {
    if (score100 >= 70) return 'high';
    if (score100 >= 40) return 'mid';
    return 'low';
  }
  return 'mid';
};

const normalizeRawMetrics = (value: unknown): Record<string, number> => {
  if (!value || typeof value !== 'object') return {};
  const raw = value as Record<string, unknown>;
  const normalized: Record<string, number> = {};
  Object.entries(raw).forEach(([key, metric]) => {
    const parsed = toNumber(metric);
    if (parsed !== null) {
      normalized[key] = parsed;
    }
  });
  return normalized;
};

const normalizeMetrics = (value: unknown, rawMetrics: Record<string, number>): LabModuleMetrics['metrics'] => {
  if (value && typeof value === 'object') {
    return value as LabModuleMetrics['metrics'];
  }
  return rawMetrics as unknown as LabModuleMetrics['metrics'];
};

const normalizeTrials = (value: unknown): LabModuleMetrics['trials'] => {
  if (Array.isArray(value)) {
    return value as TestTrial[];
  }
  return undefined;
};

const normalizeSession = (value: unknown): LabModuleMetrics | null => {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const moduleId = (typeof raw.moduleId === 'string' ? raw.moduleId : 'unknown') as LabModuleMetrics['moduleId'];
  const timestamp = typeof raw.timestamp === 'string' ? raw.timestamp : new Date().toISOString();
  const scoreValue = toNumber(raw.score100);
  const score100 = scoreValue !== null ? clampScore(scoreValue) : 0;
  const band = normalizeBand(raw.band, scoreValue);
  const fatigueValue = toNumber(raw.fatigueIndex);
  const fatigueSlope = toNumber(raw.fatigueSlope);
  const consistencyValue = toNumber(raw.consistency);
  const notes = typeof raw.notes === 'string' ? raw.notes : undefined;
  const rawMetrics = normalizeRawMetrics(raw.rawMetrics);
  const metrics = normalizeMetrics(raw.metrics, rawMetrics);
  const trials = normalizeTrials(raw.trials);

  return {
    moduleId,
    timestamp,
    rawMetrics,
    metrics,
    trials,
    score100,
    band,
    fatigueIndex: fatigueValue === null ? undefined : fatigueValue,
    fatigueSlope: fatigueSlope === null ? undefined : fatigueSlope,
    consistency: consistencyValue === null ? undefined : consistencyValue,
    notes,
  };
};

const buildDemoMetrics = (moduleId: LabModuleMetrics['moduleId'], raw: Record<string, number>): TestMetrics => {
  switch (moduleId) {
    case 'attention': {
      const trials = 24;
      const targets = 6;
      const hitRate = raw.hitRate ?? 0.7;
      const falseAlarmRate = raw.falseAlarmRate ?? 0.18;
      const hits = Math.round(targets * Math.min(1, hitRate));
      const falseAlarms = Math.round((trials - targets) * Math.min(1, falseAlarmRate));
      return {
        trials,
        targets,
        hits,
        falseAlarms,
        impulsiveTaps: Math.max(0, falseAlarms - 1),
        hitRate: hitRate.toFixed(2),
        falseAlarmRate: falseAlarmRate.toFixed(2),
        dPrime: '1.2',
        avgReactionMs: 420,
        impulsePenaltyPoints: 6,
        fatigueIndex: 'moderate',
        fatigueScore: 45,
        sustainedAttention: 'moderate',
        rtVariability: 18,
        gamePoints: 220,
        starRating: 3,
        maxComboStreak: 4,
      };
    }
    case 'focused_attention': {
      const accuracyPct = raw.accuracyPct ?? 68;
      return {
        trials: 30,
        targets: 8,
        hits: Math.round((accuracyPct / 100) * 8),
        misses: 8 - Math.round((accuracyPct / 100) * 8),
        falseAlarms: 2,
        correctRejects: 20,
        accuracyPct,
        avgReactionMs: 430,
        rtStdMs: 90,
        lapses: 2,
        rtVariability: 18,
        consistencyScore: 78,
        fatigueScore: 32,
        fatigueIndex: 'moderate',
        fatigueSlope: -1.2,
        score100: accuracyPct,
        stimulusMode: 'audio',
      };
    }
    case 'frequency': {
      const thresholdHz = raw.discriminationHz ?? 12;
      return {
        referenceHz: 500,
        trials: 20,
        accuracyPct: 62,
        thresholdHz,
        thresholdPercent: Number(((thresholdHz / 500) * 100).toFixed(2)),
        consistencyStdHz: 6,
        avgReactionMs: 520,
        gamePoints: 180,
        starRating: 3,
        note: 'Threshold is a screening estimate.',
      };
    }
    case 'sequence': {
      const maxSpan = raw.sequenceCorrect ?? 3;
      return {
        rounds: 8,
        correctRounds: 4,
        accuracyPct: 50,
        maxSpan,
        avgReactionMs: 560,
        maxNoiseLevel: '0.12',
        replayPolicy: 'one replay max per round',
        gamePoints: 140,
        starRating: 2,
        workingMemorySpan: maxSpan,
        note: 'Span is a screening estimate.',
      };
    }
    case 'dichotic_listening': {
      const left = raw.leftScore ?? 60;
      const right = raw.rightScore ?? 65;
      return {
        trials: 20,
        leftAccuracyPct: left,
        rightAccuracyPct: right,
        separationAccuracyPct: 58,
        balanceIndex: Math.round(Math.abs(left - right)),
        intrusions: 1,
        score100: Math.round((left + right) / 2),
      };
    }
    case 'speech_in_noise': {
      const snr = raw.snrThresholdDb ?? 8;
      return {
        trials: 16,
        accuracyPct: raw.accuracyPct ?? 42,
        snrThresholdDb: snr,
        snrScore: 48,
        reversals: 4,
        score100: 40,
        fatigueScore: 60,
      };
    }
    case 'questionnaire':
    default:
      return {
        totalQuestions: 10,
        totalScore: raw.totalScore ?? 18,
        note: 'Parent questionnaire screening.',
      };
  }
};

const buildDemoSessions = (): LabModuleMetrics[] => {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const make = (daysAgo: number, session: Omit<LabModuleMetrics, 'timestamp'>): LabModuleMetrics => ({
    ...session,
    metrics: session.metrics ?? buildDemoMetrics(session.moduleId, session.rawMetrics),
    timestamp: new Date(now - daysAgo * dayMs).toISOString(),
  });

  return [
    make(20, {
      moduleId: 'attention',
      rawMetrics: { hitRate: 0.72, falseAlarmRate: 0.18 },
      metrics: buildDemoMetrics('attention', { hitRate: 0.72, falseAlarmRate: 0.18 }),
      score100: 55,
      band: 'mid',
      fatigueIndex: 35,
      consistency: 78,
    }),
    make(18, {
      moduleId: 'frequency',
      rawMetrics: { discriminationHz: 12 },
      metrics: buildDemoMetrics('frequency', { discriminationHz: 12 }),
      score100: 42,
      band: 'mid',
      fatigueIndex: 72,
      consistency: 65,
    }),
    make(16, {
      moduleId: 'sequence',
      rawMetrics: { sequenceCorrect: 3 },
      metrics: buildDemoMetrics('sequence', { sequenceCorrect: 3 }),
      score100: 32,
      band: 'low',
      fatigueIndex: 80,
      consistency: 52,
    }),
    make(14, {
      moduleId: 'dichotic_listening',
      rawMetrics: { leftScore: 58, rightScore: 64 },
      metrics: buildDemoMetrics('dichotic_listening', { leftScore: 58, rightScore: 64 }),
      score100: 60,
      band: 'mid',
      fatigueIndex: 25,
      consistency: 70,
    }),
    make(12, {
      moduleId: 'focused_attention',
      rawMetrics: { accuracyPct: 68 },
      metrics: buildDemoMetrics('focused_attention', { accuracyPct: 68 }),
      score100: 68,
      band: 'mid',
      fatigueIndex: 30,
      consistency: 82,
    }),
    make(10, {
      moduleId: 'speech_in_noise',
      rawMetrics: { snrThresholdDb: 8, accuracyPct: 42 },
      metrics: buildDemoMetrics('speech_in_noise', { snrThresholdDb: 8, accuracyPct: 42 }),
      score100: 38,
      band: 'low',
      fatigueIndex: 85,
      consistency: 58,
    }),
    make(8, {
      moduleId: 'questionnaire',
      rawMetrics: { totalScore: 18, totalQuestions: 10 },
      metrics: buildDemoMetrics('questionnaire', { totalScore: 18, totalQuestions: 10 }),
      score100: 76,
      band: 'high',
      fatigueIndex: 18,
      consistency: 90,
    }),
    make(6, {
      moduleId: 'sequence',
      rawMetrics: { sequenceCorrect: 2 },
      metrics: buildDemoMetrics('sequence', { sequenceCorrect: 2 }),
      score100: 28,
      band: 'low',
      fatigueIndex: 88,
      consistency: 48,
    }),
    make(4, {
      moduleId: 'frequency',
      rawMetrics: { discriminationHz: 10 },
      metrics: buildDemoMetrics('frequency', { discriminationHz: 10 }),
      score100: 48,
      band: 'mid',
      fatigueIndex: 40,
      consistency: 66,
    }),
    make(2, {
      moduleId: 'dichotic_listening',
      rawMetrics: { leftScore: 62, rightScore: 79 },
      metrics: buildDemoMetrics('dichotic_listening', { leftScore: 62, rightScore: 79 }),
      score100: 74,
      band: 'high',
      fatigueIndex: 28,
      consistency: 76,
    }),
  ];
};

const DEMO_SESSIONS = buildDemoSessions();

const cloneSessions = (sessions: LabModuleMetrics[]) => sessions.map((session) => ({
  ...session,
  rawMetrics: { ...session.rawMetrics },
  metrics: { ...session.metrics },
  trials: session.trials ? [...session.trials] : undefined,
}));

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
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => normalizeSession(entry))
      .filter((entry): entry is LabModuleMetrics => entry !== null);
  } catch (error) {
    console.warn('Failed to load lab module metrics:', error);
    return [];
  }
};

export const getSessionsOrDemo = (allowDemo = false): LabModuleMetrics[] => {
  const sessions = getAllSessions();
  if (sessions.length) return sessions;
  return allowDemo ? cloneSessions(DEMO_SESSIONS) : [];
};
