import type React from 'react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getAllSessions } from '../../utils/sessionStorage';
import type { LabModuleMetrics } from '../../types/moduleMetrics';
import {
  analytics,
  brandCyan,
  brandPink,
  brandPurple,
  colors,
  performanceBands,
  radius,
  spacing,
  typography,
} from '../styles';

type ChartVariant = 'parent' | 'clinician';

type ChartPoint = {
  x: number;
  y: number;
  value: number;
  label: string;
  tooltip: string;
  band: LabModuleMetrics['band'];
  qualityFlags?: string[];
};

type EarMode = 'combined' | 'left' | 'right' | 'balance';

const bandColors: Record<LabModuleMetrics['band'], string> = {
  high: performanceBands.high.stroke,
  mid: performanceBands.mid.stroke,
  low: performanceBands.low.stroke,
};

const qualityFlagStyles: Record<NonNullable<SessionQualityFlag['severity']>, { fill: string; stroke: string }> = {
  info: { fill: '#38bdf8', stroke: '#0ea5e9' },
  warning: { fill: '#f59e0b', stroke: '#d97706' },
  critical: { fill: '#ef4444', stroke: '#b91c1c' },
};

const getQualityFlagSeverity = (flags?: SessionQualityFlag[]): NonNullable<SessionQualityFlag['severity']> => {
  if (!flags?.length) return 'warning';

  const priority = ['critical', 'warning', 'info'] as const;
  const severities = flags
    .map((flag) => flag.severity)
    .filter((severity): severity is NonNullable<SessionQualityFlag['severity']> => Boolean(severity));

  const match = priority.find((level) => severities.includes(level));
  return match ?? 'warning';
};

const bandBackgrounds = [
  { min: 70, max: 100, color: performanceBands.high.fill },
  { min: 40, max: 70, color: performanceBands.mid.fill },
  { min: 0, max: 40, color: performanceBands.low.fill },
];

const VIEWBOX_W = 100;
const VIEWBOX_PADDING_X = 8;
const VIEWBOX_PADDING_Y = 16;
const VIEWBOX_BOTTOM_OFFSET = 40;
const FATIGUE_VIEWBOX_H = 140;

const MIN_TREND_SESSIONS = 3;
const ROLLING_WINDOW = 3;

const clampScore = (value: number) => Math.max(0, Math.min(100, value));

const computeSlope = (values: number[]): number => {
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

const computeStandardDeviation = (values: number[]): number => {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
};

const computeOutlierRate = (values: number[]): number => {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const stdDev = computeStandardDeviation(values);
  const threshold = Math.max(10, stdDev * 1.5);
  const outliers = values.filter((value) => Math.abs(value - mean) > threshold);
  return outliers.length / values.length;
};

type ConfidenceLevel = 'high' | 'medium' | 'low';

const getConfidenceLevel = (
  sessionCount: number,
  stdDev: number,
  outlierRate: number,
  meanScore: number,
): { level: ConfidenceLevel; message: string; tone: string; consistencyIndex: number } => {
  const normalizedVariability = Math.min(1, meanScore > 0 ? stdDev / Math.max(meanScore, 1) : stdDev / 30);
  const normalizedOutliers = Math.min(1, outlierRate * 1.5);
  const sessionFactor = sessionCount < MIN_TREND_SESSIONS
    ? sessionCount / MIN_TREND_SESSIONS
    : Math.min(1, (sessionCount - MIN_TREND_SESSIONS + 1) / 6);

  const variabilityScore = 1 - normalizedVariability; // higher = steadier data
  const outlierScore = 1 - normalizedOutliers; // higher = fewer outliers
  const sessionScore = 0.25 + sessionFactor * 0.75; // nudges score up as count grows

  const weightedScore = variabilityScore * 0.45 + outlierScore * 0.3 + sessionScore * 0.25;
  const consistencyIndex = Math.round(clampScore(weightedScore * 100));

  const needsMoreSessions = sessionCount < MIN_TREND_SESSIONS;
  const volatileData = normalizedVariability > 0.5 || normalizedOutliers > 0.35;

  let level: ConfidenceLevel = 'medium';
  if (needsMoreSessions || consistencyIndex < 55 || volatileData) {
    level = 'low';
  } else if (consistencyIndex >= 82 && sessionCount >= MIN_TREND_SESSIONS + 1) {
    level = 'high';
  }

  const message = level === 'high'
    ? 'High confidence'
    : level === 'medium'
      ? volatileData
        ? 'Medium confidence—scores show some variability'
        : 'Medium confidence—add a session to confirm the trend'
      : needsMoreSessions
        ? `Low confidence—need ${MIN_TREND_SESSIONS}+ sessions`
        : 'Low confidence—scores fluctuate or include outliers';

  const tone = level === 'high'
    ? colors.success
    : level === 'medium'
      ? colors.warning
      : colors.error;

  return { level, message, tone, consistencyIndex } as const;
};

const formatLabel = (timestamp: string, locale: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
};

const formatTooltip = (
  timestamp: string,
  locale: string,
  value: number,
  unit = '',
  qualityFlags?: SessionQualityFlag[],
) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return `${timestamp}: ${value}${unit}`;
  const datePart = date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  const timePart = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  const base = `${datePart} ${timePart} - ${value}${unit}`;

  if (!qualityFlags?.length) return base;

  const flagLines = qualityFlags.map((flag) => {
    const label = flag.label ?? flag.code;
    const description = flag.description ? `: ${flag.description}` : '';
    return `${label}${description}`;
  });

  return `${base}\n⚠️ ${flagLines.join('\n⚠️ ')}`;
};

const MetricCard = memo(({
  label,
  value,
  tone = brandCyan,
}: {
  label: string;
  value: string;
  tone?: string;
}) => (
  <div
    style={{
      ...analytics.metricCard,
      background: `${tone}12`,
      border: `1px solid ${tone}30`,
    }}
  >
    <div style={analytics.metricLabel}>
      {label}
    </div>
    <div style={{ ...analytics.metricValue, color: tone }}>
      {value}
    </div>
  </div>
));
MetricCard.displayName = 'MetricCard';

const ConfidenceBadge = memo(({ tone, text, helper }: { tone: string; text: string; helper?: string }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: spacing[1],
      padding: `${spacing[1]}px ${spacing[2]}px`,
      borderRadius: radius.full,
      background: `${tone}1f`,
      border: `1px solid ${tone}40`,
      color: tone,
      fontSize: typography.size.xs,
      fontWeight: typography.weight.bold,
      letterSpacing: typography.letterSpacing.tight,
    }}
  >
    <span>{text}</span>
    {helper ? <span style={{ color: colors.text.muted, fontWeight: typography.weight.medium }}>{helper}</span> : null}
  </div>
));
ConfidenceBadge.displayName = 'ConfidenceBadge';

const LongitudinalCharts = memo(function LongitudinalCharts({
  moduleId,
  title,
  variant = 'clinician',
}: {
  moduleId: string;
  title?: string;
  variant?: ChartVariant;
}) {
  const { t, isArabic } = useLanguage();
  const locale = isArabic ? 'ar-SA' : 'en-US';
  const [tooltip, setTooltip] = useState<{
    left: number;
    top: number;
    content: string;
    label?: string;
    key: string;
    container: 'score' | 'fatigue';
    flags?: string[];
  } | null>(null);
  const scoreChartRef = useRef<HTMLDivElement>(null);
  const fatigueChartRef = useRef<HTMLDivElement>(null);
  const [showBaseline, setShowBaseline] = useState(true);
  const [showRolling, setShowRolling] = useState(true);
  const [showBestMarker, setShowBestMarker] = useState(true);
  const [earMode, setEarMode] = useState<EarMode>('combined');

  const sessions = useMemo(() => {
    const allSessions = getAllSessions();
    return allSessions
      .filter((session) => session.moduleId === moduleId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [moduleId]);

  const earCapabilities = useMemo(() => {
    const hasLeft = sessions.some((session) => typeof (session.metrics as Record<string, unknown>).leftAccuracyPct === 'number');
    const hasRight = sessions.some((session) => typeof (session.metrics as Record<string, unknown>).rightAccuracyPct === 'number');
    const hasBalance = sessions.some((session) => typeof (session.metrics as Record<string, unknown>).balanceIndex === 'number');
    return { hasLeft, hasRight, hasBalance };
  }, [sessions]);

  const availableEarModes = useMemo(() => {
    const modes: EarMode[] = ['combined'];
    if (earCapabilities.hasLeft) modes.push('left');
    if (earCapabilities.hasRight) modes.push('right');
    if (earCapabilities.hasBalance) modes.push('balance');
    return modes;
  }, [earCapabilities]);

  useEffect(() => {
    if (!availableEarModes.includes(earMode)) {
      setEarMode('combined');
    }
  }, [availableEarModes, earMode]);

  const lineHeight = variant === 'parent' ? 160 : 190;

  const scoredSessions = useMemo(() => {
    const deriveScore = (session: LabModuleMetrics) => {
      const metrics = session.metrics as Record<string, unknown>;
      if (earMode === 'left' && typeof metrics.leftAccuracyPct === 'number') {
        return clampScore(metrics.leftAccuracyPct);
      }
      if (earMode === 'right' && typeof metrics.rightAccuracyPct === 'number') {
        return clampScore(metrics.rightAccuracyPct);
      }
      if (earMode === 'balance' && typeof metrics.balanceIndex === 'number') {
        const balanceScore = 100 - Math.min(100, Math.abs(metrics.balanceIndex as number));
        return clampScore(balanceScore);
      }
      return clampScore(session.score100);
    };

    return sessions
      .map((session) => ({
        ...session,
        scoreForMode: deriveScore(session),
      }))
      .filter((session) => session.scoreForMode !== null && typeof session.scoreForMode === 'number');
  }, [earMode, sessions]);

  const trendReady = scoredSessions.length >= MIN_TREND_SESSIONS;
  const baselineScore = scoredSessions.length ? clampScore(scoredSessions[0].scoreForMode as number) : null;

  const rollingScores = useMemo(() => {
    if (!scoredSessions.length) return [];
    return scoredSessions.map((session, index) => {
      const start = Math.max(0, index - (ROLLING_WINDOW - 1));
      const window = scoredSessions.slice(start, index + 1);
      const avg = window.reduce((sum, entry) => sum + clampScore(entry.scoreForMode as number), 0) / window.length;
      return Math.round(avg);
    });
  }, [scoredSessions]);

  const scorePoints = useMemo<ChartPoint[]>(() => {
    const chartHeight = lineHeight - VIEWBOX_BOTTOM_OFFSET;
    const safeSessions = scoredSessions.map((session) => ({
      ...session,
      scoreForMode: clampScore(session.scoreForMode as number),
    }));

    const normalizedPoints = safeSessions.map((session, index) => {
      const x = safeSessions.length === 1
        ? VIEWBOX_W / 2
        : VIEWBOX_PADDING_X + (index * (VIEWBOX_W - VIEWBOX_PADDING_X * 2)) / Math.max(safeSessions.length - 1, 1);
      const y = VIEWBOX_PADDING_Y + chartHeight - ((session.scoreForMode as number) / 100) * chartHeight;
      return {
        x,
        y,
        value: session.scoreForMode as number,
        label: formatLabel(session.timestamp, locale),
        tooltip: formatTooltip(session.timestamp, locale, session.scoreForMode as number, '%'),
        band: session.band,
        qualityFlags: session.qualityFlags,
      };
    });

    if (!isArabic) return normalizedPoints;
    return normalizedPoints.map((point) => ({ ...point, x: VIEWBOX_W - point.x }));
  }, [scoredSessions, locale, lineHeight, isArabic]);

  const scorePath = useMemo(() => {
    if (scorePoints.length === 0) return '';
    return scorePoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  }, [scorePoints]);

  const bestPoint = useMemo(() => {
    if (!scorePoints.length) return null;
    const bestValue = Math.max(...scorePoints.map((point) => point.value));
    let bestIndex = -1;
    for (let i = scorePoints.length - 1; i >= 0; i -= 1) {
      if (scorePoints[i].value === bestValue) {
        bestIndex = i;
        break;
      }
    }
    return bestIndex >= 0 ? scorePoints[bestIndex] : null;
  }, [scorePoints]);

  const rollingPoints = useMemo(() => {
    if (!rollingScores.length) return [];
    const chartHeight = lineHeight - VIEWBOX_BOTTOM_OFFSET;

    const points = rollingScores.map((value, index) => {
      const x = rollingScores.length === 1
        ? VIEWBOX_W / 2
        : VIEWBOX_PADDING_X + (index * (VIEWBOX_W - VIEWBOX_PADDING_X * 2)) / Math.max(rollingScores.length - 1, 1);
      const y = VIEWBOX_PADDING_Y + chartHeight - (value / 100) * chartHeight;
      return { x, y, value };
    });

    if (!isArabic) return points;
    return points.map((point) => ({ ...point, x: VIEWBOX_W - point.x }));
  }, [rollingScores, lineHeight, isArabic]);

  const rollingPath = useMemo(() => {
    if (rollingPoints.length === 0) return '';
    return rollingPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  }, [rollingPoints]);

  const fatiguePoints = useMemo(() => {
    return sessions
      .filter((session) => typeof session.fatigueIndex === 'number')
      .map((session) => ({
        value: clampScore(session.fatigueIndex ?? 0),
        label: formatLabel(session.timestamp, locale),
        tooltip: formatTooltip(session.timestamp, locale, clampScore(session.fatigueIndex ?? 0)),
      }));
  }, [sessions, locale]);

  const stats = useMemo(() => {
    if (scoredSessions.length === 0) {
      return null;
    }

    const scores = scoredSessions.map((session) => clampScore(session.scoreForMode as number));
    const average = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    const best = Math.max(...scores);
    const slope = computeSlope(scores);
    const baseline = baselineScore ?? scores[0];
    const recentAverage = rollingScores.length ? rollingScores[rollingScores.length - 1] : null;
    const variability = computeStandardDeviation(scores);
    const outlierRate = computeOutlierRate(scores);
    const { level, message, tone, consistencyIndex } = getConfidenceLevel(
      sessions.length,
      variability,
      outlierRate,
      average,
    );

    const fatigueValues = sessions
      .filter((session) => typeof session.fatigueIndex === 'number')
      .map((session) => clampScore(session.fatigueIndex ?? 0));
    const fatigueSlope = fatigueValues.length > 1 ? computeSlope(fatigueValues) : 0;

    let fatigueDirection: 'improving' | 'worsening' | 'stable' = 'stable';
    if (fatigueSlope < -0.5) fatigueDirection = 'improving';
    if (fatigueSlope > 0.5) fatigueDirection = 'worsening';

    return {
      average,
      best,
      slope,
      baseline,
      recentAverage,
      consistencyIndex,
      confidenceLevel: level,
      confidenceMessage: message,
      confidenceTone: tone,
      variability,
      outlierRate,
      fatigueDirection,
      fatigueSlope,
    };
  }, [baselineScore, rollingScores, scoredSessions, sessions]);

  if (scoredSessions.length === 0) {
    return (
      <div
        style={{
          padding: spacing[5],
          borderRadius: radius.xl,
          border: `1px dashed ${colors.border.default}`,
          background: colors.surface.card,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: colors.text.primary }}>
          {t('dashboard.noHistoryTitle', 'No history yet.')}
        </div>
        <div style={{ fontSize: typography.size.sm, color: colors.text.muted, marginTop: spacing[1] }}>
          {t('dashboard.noHistoryBody', 'Complete a module to begin tracking progress.')}
        </div>
      </div>
    );
  }

  const labelStep = scorePoints.length > 6 ? Math.ceil(scorePoints.length / 6) : 1;
  const labelPoints = scorePoints;

  const fatigueChartWidth = VIEWBOX_W - VIEWBOX_PADDING_X * 2;
  const fatigueBarWidth = fatiguePoints.length ? fatigueChartWidth / fatiguePoints.length : 0;
  const fatigueBarGap = Math.min(2, fatigueBarWidth * 0.25);

  const getFatigueBarStart = (index: number) => {
    const effectiveIndex = isArabic ? fatiguePoints.length - 1 - index : index;
    return VIEWBOX_PADDING_X + effectiveIndex * fatigueBarWidth + fatigueBarGap / 2;
  };

  const getFatigueBarCenter = (index: number) => {
    const effectiveIndex = isArabic ? fatiguePoints.length - 1 - index : index;
    return VIEWBOX_PADDING_X + effectiveIndex * fatigueBarWidth + fatigueBarWidth / 2;
  };

  const valueToY = (value: number, height: number) => {
    const chartHeight = height - VIEWBOX_BOTTOM_OFFSET;
    return VIEWBOX_PADDING_Y + chartHeight - (value / 100) * chartHeight;
  };

  const computeTooltipState = (
    event: React.MouseEvent<SVGElement, MouseEvent> | React.FocusEvent<SVGElement>,
    content: string,
    label: string | undefined,
    key: string,
    container: 'score' | 'fatigue',
    flags?: string[],
  ) => {
    const containerRef = container === 'score' ? scoreChartRef : fatigueChartRef;
    const wrapper = containerRef.current?.getBoundingClientRect();
    const target = (event.currentTarget as SVGElement).getBoundingClientRect();
    if (!wrapper) return null;

    return {
      left: target.x - wrapper.x + target.width / 2,
      top: target.y - wrapper.y - 8,
      content,
      label,
      key,
      container,
      flags,
    } as const;
  };

  const setTooltipFromEvent = (
    event: React.MouseEvent<SVGElement, MouseEvent> | React.FocusEvent<SVGElement>,
    content: string,
    label: string | undefined,
    key: string,
    container: 'score' | 'fatigue',
    flags?: string[],
  ) => {
    const next = computeTooltipState(event, content, label, key, container, flags);
    if (!next) return;
    setTooltip(next);
  };

  const clearTooltip = () => setTooltip(null);

  const chipStyle = (active: boolean) => ({
    padding: `${spacing[0.5]}px ${spacing[2]}px`,
    borderRadius: radius.md,
    border: `1px solid ${active ? colors.info : colors.border.default}`,
    background: active ? `${colors.info}22` : colors.surface.card,
    color: colors.text.primary,
    fontSize: typography.size.xs,
    cursor: 'pointer',
  });

  return (
    <div style={{ display: 'grid', gap: spacing[4] }}>
      <div
        ref={scoreChartRef}
        style={{ ...analytics.chartContainer, position: 'relative' as const }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: spacing[2],
            flexWrap: 'wrap',
            marginBottom: spacing[3],
          }}
        >
          <div
            style={{
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <span>{title || t('dashboard.scoreTrendTitle', 'Score Trend')}</span>
            {stats ? (
              <span
                style={{
                  padding: `${spacing[0.5]}px ${spacing[2]}px`,
                  borderRadius: radius.md,
                  background:
                    stats.confidenceLevel === 'high'
                      ? `${colors.success}22`
                      : stats.confidenceLevel === 'medium'
                        ? `${colors.warning}22`
                        : `${colors.error}22`,
                  color:
                    stats.confidenceLevel === 'high'
                      ? colors.success
                      : stats.confidenceLevel === 'medium'
                        ? colors.warning
                        : colors.error,
                  fontSize: typography.size.xs,
                  border: `1px solid ${colors.border.default}`,
                }}
              >
                {stats.confidenceLevel === 'high'
                  ? t('dashboard.confidenceHigh', 'High confidence')
                  : stats.confidenceLevel === 'medium'
                    ? t('dashboard.confidenceMedium', 'Medium confidence')
                    : t('dashboard.confidenceLow', 'Low confidence — need more sessions')}
              </span>
            ) : null}
          </div>
          {variant === 'clinician' ? (
            <div style={{ display: 'flex', gap: spacing[2], flexWrap: 'wrap', alignItems: 'center' }}>
              {availableEarModes.length > 1 ? (
                <div style={{ display: 'flex', gap: spacing[1], alignItems: 'center' }}>
                  {availableEarModes.map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      style={chipStyle(earMode === mode)}
                      onClick={() => setEarMode(mode)}
                    >
                      {mode === 'combined'
                        ? t('dashboard.earCombined', 'Combined')
                        : mode === 'left'
                          ? t('dashboard.earLeft', 'Left')
                          : mode === 'right'
                            ? t('dashboard.earRight', 'Right')
                            : t('dashboard.earBalance', 'Balance')}
                    </button>
                  ))}
                </div>
              ) : null}
              <div style={{ display: 'flex', gap: spacing[1] }}>
                <button
                  type="button"
                  style={chipStyle(showBaseline)}
                  onClick={() => setShowBaseline((prev) => !prev)}
                >
                  {t('dashboard.toggleBaseline', 'Baseline')}
                </button>
                <button
                  type="button"
                  style={chipStyle(showRolling)}
                  onClick={() => setShowRolling((prev) => !prev)}
                >
                  {t('dashboard.toggleRolling', 'Rolling')}
                </button>
                <button
                  type="button"
                  style={chipStyle(showBestMarker)}
                  onClick={() => setShowBestMarker((prev) => !prev)}
                >
                  {t('dashboard.toggleBest', 'Best')}
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <svg width="100%" height={lineHeight} viewBox={`0 0 ${VIEWBOX_W} ${lineHeight}`} preserveAspectRatio="none">
          {bandBackgrounds.map((band) => {
            const top = valueToY(band.max, lineHeight);
            const bottom = valueToY(band.min, lineHeight);
            return (
              <rect
                key={`${band.min}-${band.max}`}
                x={0}
                y={top}
                width={VIEWBOX_W}
                height={bottom - top}
                fill={band.color}
              />
            );
          })}

          {[0, 25, 50, 75, 100].map((pct) => {
            const y = valueToY(pct, lineHeight);
            return (
              <line
                key={pct}
                x1={VIEWBOX_PADDING_X}
                y1={y}
                x2={VIEWBOX_W - VIEWBOX_PADDING_X}
                y2={y}
                stroke={colors.border.subtle}
                strokeWidth={0.4}
                strokeDasharray="2,2"
              />
            );
          })}

          {showBaseline && baselineScore !== null ? (
            <line
              x1={VIEWBOX_PADDING_X}
              y1={valueToY(baselineScore, lineHeight)}
              x2={VIEWBOX_W - VIEWBOX_PADDING_X}
              y2={valueToY(baselineScore, lineHeight)}
              stroke={brandPurple}
              strokeWidth={1}
              strokeDasharray="4,4"
              opacity={0.7}
            />
          ) : null}

          {showRolling && rollingPoints.length > 1 ? (
            <path
              d={rollingPath}
              fill="none"
              stroke={brandPurple}
              strokeWidth={1.4}
              strokeDasharray="5,4"
              opacity={0.85}
            />
          ) : null}

          <path
            d={scorePath}
            fill="none"
            stroke={brandCyan}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {showBestMarker && bestPoint ? (
            <g>
              <circle
                cx={bestPoint.x}
                cy={bestPoint.y}
                r={4}
                fill={`${colors.info}22`}
                stroke={colors.info}
                strokeWidth={1}
              />
              <text
                x={bestPoint.x}
                y={bestPoint.y - 6}
                textAnchor="middle"
                fill={colors.info}
                style={{ fontSize: typography.size.xxs, fontWeight: typography.weight.bold }}
              >
                ★
              </text>
            </g>
          ) : null}

          {scorePoints.map((point, index) => (
            <g key={`${point.x}-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r={2.8}
                fill={colors.surface.base}
                stroke={bandColors[point.band]}
                strokeWidth={1.4}
                onMouseEnter={(event) => setTooltipFromEvent(event, point.tooltip, point.label, `score-${index}`, 'score', point.qualityFlags)}
                onFocus={(event) => setTooltipFromEvent(event, point.tooltip, point.label, `score-${index}`, 'score', point.qualityFlags)}
                onMouseLeave={clearTooltip}
                onBlur={clearTooltip}
                onClick={(event) => {
                  event.stopPropagation();
                  const key = `score-${index}`;
                  const next = computeTooltipState(event, point.tooltip, point.label, key, 'score', point.qualityFlags);
                  setTooltip((current) => {
                    if (current?.key === key) return null;
                    return next ?? current;
                  });
                }}
              >
                <title>{point.tooltip}</title>
              </circle>
              {point.qualityFlags?.length ? (
                <text
                  x={point.x}
                  y={point.y - 5}
                  textAnchor="middle"
                  fontSize={typography.size.xxs}
                  fill={colors.warning}
                >
                  ⚠
                </text>
              ) : null}
            </g>
          ))}

          {labelPoints.map((point, index) => (
            index % labelStep === 0 ? (
              <text
                key={`label-${index}`}
                x={point.x}
                y={lineHeight - 8}
                textAnchor="middle"
                fill={colors.text.muted}
                style={{ fontSize: typography.size.xxs }}
              >
                {point.label}
              </text>
            ) : null
          ))}
        </svg>
        {tooltip && tooltip.container === 'score' ? (
          <div
            style={{
              position: 'absolute',
              left: tooltip.left,
              top: tooltip.top,
              transform: 'translate(-50%, -100%)',
              padding: `${spacing[1]}px ${spacing[2]}px`,
              background: colors.surface.overlay,
              color: colors.text.primary,
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.md,
              fontSize: typography.size.xs,
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            {tooltip.label ? (
              <div style={{ fontWeight: typography.weight.bold, marginBottom: 2 }}>
                {tooltip.label}
              </div>
            ) : null}
            <div>{tooltip.content}</div>
            {tooltip.flags?.length ? (
              <div style={{ marginTop: 4, color: colors.warning }}>
                {tooltip.flags.map((flag) => (
                  <div key={flag}>⚠ {flag}</div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
        {!trendReady ? (
          <div style={{ marginTop: spacing[2], fontSize: typography.size.xs, color: colors.text.muted }}>
            {t('dashboard.trendNeedsMore', 'Complete more sessions to see trend insights.')} ({MIN_TREND_SESSIONS}+)
          </div>
        ) : null}
      </div>

      {variant === 'clinician' && fatiguePoints.length > 0 && (
        <div
          ref={fatigueChartRef}
          style={{ ...analytics.fatigueZone, position: 'relative' as const }}
        >
          <div
            style={{
              marginBottom: spacing[3],
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
            }}
          >
            {t('dashboard.fatigueTrendTitle', 'Fatigue Index')}
          </div>
          <svg width="100%" height={FATIGUE_VIEWBOX_H} viewBox={`0 0 ${VIEWBOX_W} ${FATIGUE_VIEWBOX_H}`} preserveAspectRatio="none">
            {[0, 25, 50, 75, 100].map((pct) => {
              const y = valueToY(pct, FATIGUE_VIEWBOX_H);
              return (
                <line
                  key={pct}
                  x1={VIEWBOX_PADDING_X}
                  y1={y}
                  x2={VIEWBOX_W - VIEWBOX_PADDING_X}
                  y2={y}
                  stroke={colors.border.subtle}
                  strokeWidth={0.4}
                  strokeDasharray="2,2"
                />
              );
            })}

            {fatiguePoints.map((point, index) => {
              const barWidth = Math.max(1, fatigueBarWidth - fatigueBarGap);
              const barX = getFatigueBarStart(index);
              const barHeight = (point.value / 100) * (FATIGUE_VIEWBOX_H - VIEWBOX_BOTTOM_OFFSET);
              const barY = valueToY(point.value, FATIGUE_VIEWBOX_H);
              return (
                <rect
                  key={`bar-${index}`}
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  rx={1.6}
                  fill={brandPurple}
                  onMouseEnter={(event) => setTooltipFromEvent(event, point.tooltip, point.label, `fatigue-${index}`, 'fatigue')}
                  onFocus={(event) => setTooltipFromEvent(event, point.tooltip, point.label, `fatigue-${index}`, 'fatigue')}
                  onMouseLeave={clearTooltip}
                  onBlur={clearTooltip}
                  onClick={(event) => {
                    event.stopPropagation();
                    const key = `fatigue-${index}`;
                    const next = computeTooltipState(event, point.tooltip, point.label, key, 'fatigue');
                    setTooltip((current) => {
                      if (current?.key === key) return null;
                      return next ?? current;
                    });
                  }}
                >
                  <title>{point.tooltip}</title>
                </rect>
              );
            })}

            {fatiguePoints.map((point, index) => {
              const barX = getFatigueBarCenter(index);
              return (
                <text
                  key={`fatigue-label-${index}`}
                  x={barX}
                  y={FATIGUE_VIEWBOX_H - 8}
                  textAnchor="middle"
                  fill={colors.text.muted}
                  style={{ fontSize: typography.size.xxs }}
                >
                  {point.label}
                </text>
              );
            })}
          </svg>
          {tooltip && tooltip.container === 'fatigue' ? (
            <div
              style={{
                position: 'absolute',
                left: tooltip.left,
                top: tooltip.top,
                transform: 'translate(-50%, -100%)',
                padding: `${spacing[1]}px ${spacing[2]}px`,
                background: colors.surface.overlay,
                color: colors.text.primary,
                border: `1px solid ${colors.border.default}`,
                borderRadius: radius.md,
                fontSize: typography.size.xs,
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              {tooltip.label ? (
                <div style={{ fontWeight: typography.weight.bold, marginBottom: 2 }}>
                  {tooltip.label}
                </div>
              ) : null}
              <div>{tooltip.content}</div>
            </div>
          ) : null}
        </div>
      )}

      {variant === 'clinician' && stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: spacing[3],
          }}
        >
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing[2],
              alignItems: 'center',
            }}
          >
            <ConfidenceBadge
              tone={stats.confidenceTone}
              text={t('dashboard.confidenceBadge', stats.confidenceMessage)}
              helper={`${t('dashboard.sessions', 'Sessions')}: ${sessions.length}`}
            />
            <ConfidenceBadge
              tone={colors.info}
              text={`${t('dashboard.consistencyIndex', 'Consistency')}: ${stats.consistencyIndex}`}
              helper={`${t('dashboard.variability', 'Variability')} ${stats.variability.toFixed(1)} | ${t('dashboard.outliers', 'Outliers')} ${(stats.outlierRate * 100).toFixed(0)}%`}
            />
          </div>
          <MetricCard
            label={t('dashboard.avgScore', 'Average Score')}
            value={`${stats.average}`}
          />
          <MetricCard
            label={`${t('dashboard.baselineScore', 'Baseline Score')}`}
            value={stats.baseline === null ? '--' : `${stats.baseline}`}
            tone={brandPurple}
          />
          <MetricCard
            label={`${t('dashboard.rollingAverage', 'Rolling Avg')} (${ROLLING_WINDOW})`}
            value={stats.recentAverage === null ? '--' : `${stats.recentAverage}`}
          />
          <MetricCard
            label={t('dashboard.consistencyIndex', 'Consistency Index')}
            value={`${stats.consistencyIndex ?? '--'}`}
            tone={brandCyan}
          />
          <MetricCard
            label={t('dashboard.bestScore', 'Best Score')}
            value={`${stats.best}`}
            tone={brandPurple}
          />
          <MetricCard
            label={t('dashboard.scoreSlope', 'Score Slope')}
            value={
              trendReady
                ? `${stats.slope >= 0 ? '+' : ''}${stats.slope.toFixed(1)} ${t('dashboard.perSession', 'per session')}`
                : '--'
            }
            tone={trendReady ? (stats.slope >= 0 ? colors.success : colors.error) : colors.text.muted}
          />
          <MetricCard
            label={t('dashboard.confidenceLevel', 'Confidence Level')}
            value={
              stats.confidenceLevel === 'high'
                ? t('dashboard.confidenceHigh', 'High')
                : stats.confidenceLevel === 'medium'
                  ? t('dashboard.confidenceMedium', 'Medium')
                  : t('dashboard.confidenceLow', 'Low')
            }
            tone={
              stats.confidenceLevel === 'high'
                ? colors.success
                : stats.confidenceLevel === 'medium'
                  ? colors.warning
                  : colors.error
            }
          />
          <MetricCard
            label={t('dashboard.fatigueSlope', 'Fatigue Slope')}
            value={
              trendReady
                ? `${stats.fatigueSlope >= 0 ? '+' : ''}${stats.fatigueSlope.toFixed(1)} ${t('dashboard.perSession', 'per session')}`
                : '--'
            }
            tone={trendReady ? (stats.fatigueSlope >= 0 ? brandPink : brandCyan) : colors.text.muted}
          />
          <MetricCard
            label={t('dashboard.fatigueDirection', 'Fatigue Direction')}
            value={
              stats.fatigueDirection === 'improving'
                ? t('dashboard.fatigueImproving', 'Improving')
                : stats.fatigueDirection === 'worsening'
                  ? t('dashboard.fatigueWorsening', 'Worsening')
                  : t('dashboard.fatigueStable', 'Stable')
            }
            tone={stats.fatigueDirection === 'worsening' ? colors.error : brandCyan}
          />
        </div>
      )}
    </div>
  );
});

export default LongitudinalCharts;
