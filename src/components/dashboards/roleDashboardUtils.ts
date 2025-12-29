import type { LabModuleMetrics } from '../../types/moduleMetrics';
import { brandCyan, brandPink, brandPurple, colors, moduleColors } from '../styles';

export const MODULE_ORDER = [
  'attention',
  'focused_attention',
  'frequency',
  'sequence',
  'dichotic_listening',
  'speech_in_noise',
  'questionnaire',
] as const;

const MODULE_LABELS: Record<string, { en: string; ar: string }> = {
  attention: { en: 'Attention', ar: 'الانتباه' },
  focused_attention: { en: 'Focused Attention', ar: 'الانتباه المركز' },
  frequency: { en: 'Frequency', ar: 'التمييز الترددي' },
  sequence: { en: 'Sequencing', ar: 'الذاكرة التسلسلية' },
  dichotic_listening: { en: 'Dichotic Listening', ar: 'الاستماع الثنائي' },
  speech_in_noise: { en: 'Speech in Noise', ar: 'الكلام وسط الضوضاء' },
  questionnaire: { en: 'Questionnaire', ar: 'الاستبيان' },
};

const MODULE_COLORS: Record<string, string> = {
  attention: moduleColors.attention,
  focused_attention: moduleColors.focusedAttention,
  frequency: moduleColors.frequency,
  sequence: moduleColors.sequence,
  dichotic_listening: moduleColors.dichotic,
  speech_in_noise: moduleColors.speechInNoise,
  questionnaire: brandPink,
};

const BAND_META: Record<LabModuleMetrics['band'], {
  label: string;
  labelAr: string;
  summary: string;
  summaryAr: string;
  color: string;
}> = {
  high: {
    label: 'High',
    labelAr: 'عالٍ',
    summary: 'Strong performance in this module.',
    summaryAr: 'أداء قوي في هذا المحور.',
    color: colors.success,
  },
  mid: {
    label: 'Moderate',
    labelAr: 'متوسط',
    summary: 'Stable performance with room to grow.',
    summaryAr: 'أداء مستقر مع مجال للتحسن.',
    color: colors.warning,
  },
  low: {
    label: 'Needs Review',
    labelAr: 'بحاجة لمراجعة',
    summary: 'Consider a quiet re-check.',
    summaryAr: 'قد يفيد إعادة الاختبار في مكان هادئ.',
    color: colors.error,
  },
};

export const getModuleLabel = (moduleId: string, isArabic: boolean) => {
  const fallback = { en: moduleId.replace(/_/g, ' '), ar: moduleId.replace(/_/g, ' ') };
  const label = MODULE_LABELS[moduleId] ?? fallback;
  return isArabic ? label.ar : label.en;
};

export const getModuleColor = (moduleId: string) => MODULE_COLORS[moduleId] ?? brandCyan;

export const getBandMeta = (band: LabModuleMetrics['band']) => BAND_META[band];

export const formatTimestamp = (timestamp: string, locale: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
};

export const formatShortDate = (timestamp: string, locale: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
};

export const sortSessionsByTime = (sessions: LabModuleMetrics[]) => {
  return [...sessions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const getLatestSession = (sessions: LabModuleMetrics[]) => {
  if (sessions.length === 0) return null;
  const sorted = sortSessionsByTime(sessions);
  return sorted[sorted.length - 1] ?? null;
};

export const average = (values: number[]) => {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export const getLatestByModule = (sessions: LabModuleMetrics[]) => {
  const grouped: Record<string, LabModuleMetrics[]> = {};
  sessions.forEach((session) => {
    if (!grouped[session.moduleId]) grouped[session.moduleId] = [];
    grouped[session.moduleId].push(session);
  });
  Object.values(grouped).forEach((list) => {
    list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  });

  const latest: Record<string, LabModuleMetrics | null> = {};
  Object.entries(grouped).forEach(([moduleId, list]) => {
    latest[moduleId] = list[list.length - 1] ?? null;
  });
  return latest;
};

export const normalizeFatigue01 = (value?: number | null) => {
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  const normalized = value > 1 ? value / 100 : value;
  return clamp01(normalized);
};

export const computeSlope = (values: number[]) => {
  if (values.length < 2) return 0;
  const n = values.length;
  const xMean = (n - 1) / 2;
  const yMean = values.reduce((sum, v) => sum + v, 0) / n;
  let numerator = 0;
  let denominator = 0;

  values.forEach((value, index) => {
    const x = index - xMean;
    numerator += x * (value - yMean);
    denominator += x * x;
  });

  return denominator === 0 ? 0 : numerator / denominator;
};

const FATIGUE_SLOPE_THRESHOLD_SCORE = 0.5;
const FATIGUE_SLOPE_THRESHOLD_NORMALIZED = FATIGUE_SLOPE_THRESHOLD_SCORE / 100;

export const getFatigueDirection = (
  slope: number,
  scale: 'score' | 'normalized' = 'score',
): 'improving' | 'worsening' | 'stable' => {
  const threshold = scale === 'normalized'
    ? FATIGUE_SLOPE_THRESHOLD_NORMALIZED
    : FATIGUE_SLOPE_THRESHOLD_SCORE;
  if (slope < -threshold) return 'improving';
  if (slope > threshold) return 'worsening';
  return 'stable';
};

export const buildScoreTrendSeries = (
  sessions: LabModuleMetrics[],
  locale: string,
) => {
  return sessions.map((session) => ({
    label: formatShortDate(session.timestamp, locale),
    value: Math.round(session.score100),
    color: BAND_META[session.band]?.color ?? brandPurple,
  }));
};

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const bandToValue = (band: LabModuleMetrics['band']) => {
  if (band === 'high') return 3;
  if (band === 'mid') return 2;
  return 1;
};

export const buildBandTrendSeries = (sessions: LabModuleMetrics[], locale: string) => {
  return sessions.map((session) => ({
    label: formatShortDate(session.timestamp, locale),
    value: bandToValue(session.band),
    color: BAND_META[session.band]?.color ?? brandPurple,
  }));
};

export const buildFatigueTrendSeries = (sessions: LabModuleMetrics[], locale: string) => {
  return sessions
    .map((session) => ({
      session,
      normalized: normalizeFatigue01(session.fatigueIndex),
    }))
    .filter((entry) => entry.normalized !== null)
    .map((entry) => ({
      label: formatShortDate(entry.session.timestamp, locale),
      value: Math.round((entry.normalized ?? 0) * 100),
      color: brandPink,
    }));
};

export const buildConsistencyTrendSeries = (sessions: LabModuleMetrics[], locale: string) => {
  return sessions
    .filter((session) => typeof session.consistency === 'number')
    .map((session) => ({
      label: formatShortDate(session.timestamp, locale),
      value: Math.round(session.consistency ?? 0),
      color: brandCyan,
    }));
};

const extractDirectionalValues = (rawMetrics: Record<string, number>) => {
  const left: number[] = [];
  const right: number[] = [];
  Object.entries(rawMetrics).forEach(([key, value]) => {
    const lower = key.toLowerCase();
    if (lower.includes('left')) left.push(value);
    if (lower.includes('right')) right.push(value);
  });
  return { left, right };
};

export const getLatestLeftRightSplit = (sessions: LabModuleMetrics[]) => {
  const sorted = sortSessionsByTime(sessions);
  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    const session = sorted[i];
    const { left, right } = extractDirectionalValues(session.rawMetrics);
    if (left.length || right.length) {
      const leftAvg = left.length ? Math.round(average(left)) : null;
      const rightAvg = right.length ? Math.round(average(right)) : null;
      return {
        session,
        leftAvg,
        rightAvg,
      };
    }
  }
  return null;
};

export const getSessionMetric = (
  session: LabModuleMetrics,
  key: string,
): string | number | null => {
  const metrics = session.metrics as Record<string, unknown>;
  const metricValue = metrics?.[key];
  if (typeof metricValue === 'number' || typeof metricValue === 'string') {
    return metricValue;
  }
  const rawValue = session.rawMetrics?.[key];
  if (typeof rawValue === 'number') {
    return rawValue;
  }
  return null;
};
