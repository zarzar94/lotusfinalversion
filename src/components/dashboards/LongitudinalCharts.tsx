import type React from 'react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getAllSessions } from '../../utils/sessionStorage';
import type { LabModuleMetrics } from '../../types/moduleMetrics';
import {
  analytics,
  brandCyan,
  brandPurple,
  colors,
  performanceBands,
  radius,
  spacing,
  typography,
} from '../styles';

const VIEWBOX_W = 100;

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
  high: colors.success,
  mid: colors.warning,
  low: colors.error,
};

const bandBackgrounds = [
  { min: 70, max: 100, color: colors.successLight },
  { min: 40, max: 70, color: colors.warningLight },
  { min: 0, max: 40, color: colors.errorLight },
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

const formatLabel = (timestamp: string, locale: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
};

const formatTooltip = (timestamp: string, locale: string, value: number, unit = '') => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return `${timestamp}: ${value}${unit}`;
  const datePart = date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  const timePart = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  return `${datePart} ${timePart} - ${value}${unit}`;
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
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [activePoint, setActivePoint] = useState<(ChartPoint & { xPx: number; yPx: number }) | null>(null);
  const [isPinned, setIsPinned] = useState(false);

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
    if (translatedScorePoints.length === 0) return '';
    return translatedScorePoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  }, [translatedScorePoints]);

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
    if (translatedRollingPoints.length === 0) return '';
    return translatedRollingPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  }, [translatedRollingPoints]);

  const bestPoint = useMemo(() => {
    if (scorePoints.length === 0) return null;
    const bestValue = Math.max(...scorePoints.map((point) => point.value));
    const bestIndex = scorePoints.findIndex((point) => point.value === bestValue);
    if (bestIndex === -1) return null;
    return scorePoints[bestIndex];
  }, [scorePoints]);

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

    const mean = scores.reduce((sum, value) => sum + value, 0) / scores.length;
    const variance = scores.reduce((sum, value) => sum + (value - mean) ** 2, 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    const outlierRate = scores.filter((value) => Math.abs(value - mean) > 20).length / scores.length;
    const consistencyIndex = Math.max(0, Math.min(100, Math.round(100 - stdDev)));
    let confidenceLevel: 'low' | 'medium' | 'high' = 'high';
    if (scores.length < 3) {
      confidenceLevel = 'low';
    } else if (stdDev > 15 || outlierRate > 0.25) {
      confidenceLevel = 'medium';
    }

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
      confidenceLevel,
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
              const chartWidth = VIEWBOX_W - VIEWBOX_PADDING_X * 2;
              const barWidth = chartWidth / fatiguePoints.length;
              const barGap = Math.min(2, barWidth * 0.25);
              const barX = VIEWBOX_PADDING_X + index * barWidth + barGap / 2;
              const barHeight = (point.value / 100) * (FATIGUE_VIEWBOX_H - VIEWBOX_BOTTOM_OFFSET);
              const barY = valueToY(point.value, FATIGUE_VIEWBOX_H);
              return (
                <rect
                  key={`bar-${index}`}
                  x={barX}
                  y={barY}
                  width={Math.max(1, barWidth - barGap)}
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
              const chartWidth = VIEWBOX_W - VIEWBOX_PADDING_X * 2;
              const barWidth = chartWidth / fatiguePoints.length;
              const barX = VIEWBOX_PADDING_X + index * barWidth + barWidth / 2;
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
          <MetricCard
            label={t('dashboard.fatigueSlope', 'Fatigue Slope')}
            value={`${stats.fatigueSlope >= 0 ? '+' : ''}${stats.fatigueSlope.toFixed(1)} ${t('dashboard.perSession', 'per session')}`}
            tone={stats.fatigueSlope >= 0 ? colors.warning : colors.success}
          />
          <MetricCard
            label={t('dashboard.fatigueSlope', 'Fatigue Slope')}
            value={`${stats.fatigueSlope >= 0 ? '+' : ''}${stats.fatigueSlope.toFixed(1)} ${t('dashboard.perSession', 'per session')}`}
            tone={stats.fatigueSlope >= 0 ? colors.warning : colors.success}
          />
        </div>
      )}
    </div>
  );
});

export default LongitudinalCharts;
