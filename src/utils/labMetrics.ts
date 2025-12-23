import type { GameResult, TestOutcome } from '../components/games/types';
import type { LabModuleMetrics, SessionQualityFlag } from '../types/moduleMetrics';
import { normalizeQualityFlagCollection } from './qualityFlags';

const clampScore = (value: number): number => Math.max(0, Math.min(100, Math.round(value)));

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

const getNumericMetric = (metrics: Record<string, unknown>, key: string): number | null => {
  if (!Object.prototype.hasOwnProperty.call(metrics, key)) return null;
  return toNumber(metrics[key]);
};

const extractNumericMetrics = (metrics: Record<string, unknown>): Record<string, number> => {
  const numeric: Record<string, number> = {};
  Object.entries(metrics).forEach(([key, value]) => {
    const parsed = toNumber(value);
    if (parsed !== null) {
      numeric[key] = parsed;
    }
  });
  return numeric;
};

const extractQualityFlags = (metrics: Record<string, unknown>): SessionQualityFlag[] | undefined => {
  const source = (metrics.qualityFlags || metrics.quality_flags || metrics.flags) as unknown;

  if (!source) return undefined;

  return normalizeQualityFlagCollection(source);
};

const extractScoreFromLabel = (scoreLabel: string): number | null => {
  const byHundred = scoreLabel.match(/(\d+(?:\.\d+)?)\s*\/\s*100/);
  if (byHundred) return Number(byHundred[1]);

  const scoreMatch = scoreLabel.match(/Score\s*=?\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/i);
  if (scoreMatch) {
    const earned = Number(scoreMatch[1]);
    const total = Number(scoreMatch[2]);
    if (Number.isFinite(earned) && Number.isFinite(total) && total > 0) {
      return (earned / total) * 100;
    }
  }

  const percentMatch = scoreLabel.match(/(\d+(?:\.\d+)?)\s*%/);
  if (percentMatch) return Number(percentMatch[1]);

  return null;
};

const deriveScore100 = (outcome: TestOutcome): number => {
  const metrics = outcome.metrics as Record<string, unknown>;

  const direct = getNumericMetric(metrics, 'score100');
  if (direct !== null) return clampScore(direct);

  const fromLabel = extractScoreFromLabel(outcome.scoreLabel);
  if (fromLabel !== null && Number.isFinite(fromLabel)) {
    return clampScore(fromLabel);
  }

  const accuracy = getNumericMetric(metrics, 'accuracyPct');
  if (accuracy !== null) return clampScore(accuracy);

  const hitRate = getNumericMetric(metrics, 'hitRate');
  if (hitRate !== null) return clampScore(hitRate <= 1 ? hitRate * 100 : hitRate);

  const totalScore = getNumericMetric(metrics, 'totalScore');
  const totalQuestions = getNumericMetric(metrics, 'totalQuestions');
  if (totalScore !== null && totalQuestions !== null && totalQuestions > 0) {
    const maxScore = totalQuestions * 2;
    return clampScore((totalScore / maxScore) * 100);
  }

  return 0;
};

const deriveConsistency = (metrics: Record<string, unknown>): number | undefined => {
  const rtVariability = getNumericMetric(metrics, 'rtVariability');
  if (rtVariability !== null) {
    return clampScore(100 - rtVariability);
  }

  const consistencyStdHz = getNumericMetric(metrics, 'consistencyStdHz');
  if (consistencyStdHz !== null) {
    return clampScore(100 - consistencyStdHz);
  }

  return undefined;
};

const resultToBand = (result: GameResult): LabModuleMetrics['band'] => {
  if (result === 'high') return 'high';
  if (result === 'medium') return 'mid';
  return 'low';
};

export const buildLabMetrics = (outcome: TestOutcome): LabModuleMetrics => {
  const metrics = outcome.metrics as Record<string, unknown>;
  const rawMetrics = extractNumericMetrics(metrics);
  const fatigueScore = getNumericMetric(metrics, 'fatigueScore');
  const fatigueSlope = getNumericMetric(metrics, 'fatigueSlope');
  const notes = typeof metrics.note === 'string' ? metrics.note : undefined;
  const qualityFlags = extractQualityFlags(metrics);

  return {
    moduleId: outcome.key,
    timestamp: new Date().toISOString(),
    rawMetrics,
    metrics: outcome.metrics,
    trials: outcome.trials,
    score100: deriveScore100(outcome),
    band: resultToBand(outcome.result),
    fatigueIndex: fatigueScore !== null ? clampScore(fatigueScore) : undefined,
    fatigueSlope: fatigueSlope !== null ? fatigueSlope : undefined,
    consistency: deriveConsistency(metrics),
    notes,
    qualityFlags,
  };
};
