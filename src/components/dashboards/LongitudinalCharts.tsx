import { memo, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getAllSessions } from '../../utils/sessionStorage';
import type { LabModuleMetrics } from '../../types/moduleMetrics';
import { brandCyan, brandPurple, colors, spacing, radius, typography, analytics, shadows } from '../styles';

type ChartVariant = 'parent' | 'clinician';

type ChartPoint = {
  x: number;
  y: number;
  value: number;
  label: string;
  tooltip: string;
  band: LabModuleMetrics['band'];
};

const bandColors: Record<LabModuleMetrics['band'], string> = {
  high: '#22c55e',
  mid: '#f59e0b',
  low: '#ef4444',
};

const bandBackgrounds = [
  { min: 70, max: 100, color: 'rgba(34, 197, 94, 0.08)' },
  { min: 40, max: 70, color: 'rgba(245, 158, 11, 0.08)' },
  { min: 0, max: 40, color: 'rgba(239, 68, 68, 0.08)' },
];

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

  const sessions = useMemo(() => {
    const allSessions = getAllSessions();
    return allSessions
      .filter((session) => session.moduleId === moduleId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [moduleId]);

  const lineHeight = variant === 'parent' ? 160 : 190;
  const trendReady = sessions.length >= MIN_TREND_SESSIONS;
  const baselineScore = sessions.length ? clampScore(sessions[0].score100) : null;

  const rollingScores = useMemo(() => {
    if (!sessions.length) return [];
    return sessions.map((session, index) => {
      const start = Math.max(0, index - (ROLLING_WINDOW - 1));
      const window = sessions.slice(start, index + 1);
      const avg = window.reduce((sum, entry) => sum + clampScore(entry.score100), 0) / window.length;
      return Math.round(avg);
    });
  }, [sessions]);

  const scorePoints = useMemo<ChartPoint[]>(() => {
    const paddingX = 8;
    const paddingY = 16;
    const chartHeight = lineHeight - 40;
    const width = 100;
    const safeSessions = sessions.map((session) => ({
      ...session,
      score100: clampScore(session.score100),
    }));

    return safeSessions.map((session, index) => {
      const x = safeSessions.length === 1
        ? 50
        : paddingX + (index * (width - paddingX * 2)) / Math.max(safeSessions.length - 1, 1);
      const y = paddingY + chartHeight - (session.score100 / 100) * chartHeight;
      return {
        x,
        y,
        value: session.score100,
        label: formatLabel(session.timestamp, locale),
        tooltip: formatTooltip(session.timestamp, locale, session.score100, '%'),
        band: session.band,
      };
    });
  }, [sessions, locale, lineHeight]);

  const scorePath = useMemo(() => {
    if (scorePoints.length === 0) return '';
    return scorePoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  }, [scorePoints]);

  const rollingPoints = useMemo(() => {
    if (!rollingScores.length) return [];
    const paddingX = 8;
    const paddingY = 16;
    const chartHeight = lineHeight - 40;
    const width = 100;

    return rollingScores.map((value, index) => {
      const x = rollingScores.length === 1
        ? 50
        : paddingX + (index * (width - paddingX * 2)) / Math.max(rollingScores.length - 1, 1);
      const y = paddingY + chartHeight - (value / 100) * chartHeight;
      return { x, y, value };
    });
  }, [rollingScores, lineHeight]);

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
    if (sessions.length === 0) {
      return null;
    }

    const scores = sessions.map((session) => clampScore(session.score100));
    const average = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    const best = Math.max(...scores);
    const slope = computeSlope(scores);
    const baseline = baselineScore ?? scores[0];
    const recentAverage = rollingScores.length ? rollingScores[rollingScores.length - 1] : null;

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
      fatigueDirection,
    };
  }, [baselineScore, rollingScores, sessions]);

  if (sessions.length === 0) {
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
  const valueToY = (value: number, height: number) => {
    const paddingY = 16;
    const chartHeight = height - 40;
    return paddingY + chartHeight - (value / 100) * chartHeight;
  };

  const updateActivePoint = (point: ChartPoint | null) => {
    if (!point || !svgRef.current) {
      setActivePoint(null);
      return;
    }

    const rect = svgRef.current.getBoundingClientRect();
    const xPx = (point.x / 100) * rect.width;
    const yPx = (point.y / lineHeight) * rect.height;
    const clampedX = Math.min(Math.max(xPx, spacing[4]), rect.width - spacing[4]);
    const clampedY = Math.min(Math.max(yPx, spacing[4]), rect.height - spacing[4]);

    setActivePoint({ ...point, xPx: clampedX, yPx: clampedY });
  };

  const handleHoverPoint = (point: ChartPoint) => {
    if (isPinned) {
      if (activePoint && activePoint.x === point.x && activePoint.y === point.y) {
        updateActivePoint(point);
      }
      return;
    }

    updateActivePoint(point);
  };

  const handleLeavePoint = () => {
    if (!isPinned) {
      setActivePoint(null);
    }
  };

  const handlePointClick = (point: ChartPoint) => {
    if (activePoint && isPinned && activePoint.x === point.x && activePoint.y === point.y) {
      setActivePoint(null);
      setIsPinned(false);
      return;
    }

    updateActivePoint(point);
    setIsPinned(true);
  };

  const handleChartLeave = () => {
    if (!isPinned) {
      setActivePoint(null);
    }
  };

  const handlePointKeyDown = (event: KeyboardEvent<SVGCircleElement>, point: ChartPoint) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePointClick(point);
    }
  };

  return (
    <div style={{ display: 'grid', gap: spacing[4] }}>
      <div
        style={analytics.chartContainer}
      >
        <div
          style={{
            marginBottom: spacing[3],
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
          }}
        >
          {title || t('dashboard.scoreTrendTitle', 'Score Trend')}
        </div>
        <div style={{ position: 'relative' }}>
          <svg
            ref={svgRef}
            width="100%"
            height={lineHeight}
            viewBox={`0 0 100 ${lineHeight}`}
            preserveAspectRatio="none"
            onMouseLeave={handleChartLeave}
          >
          {bandBackgrounds.map((band) => {
            const top = valueToY(band.max, lineHeight);
            const bottom = valueToY(band.min, lineHeight);
            return (
              <rect
                key={`${band.min}-${band.max}`}
                x={0}
                y={top}
                width={100}
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
                x1={8}
                y1={y}
                x2={92}
                y2={y}
                stroke={colors.border.subtle}
                strokeWidth={0.4}
                strokeDasharray="2,2"
              />
            );
          })}

          {baselineScore !== null ? (
            <line
              x1={8}
              y1={valueToY(baselineScore, lineHeight)}
              x2={92}
              y2={valueToY(baselineScore, lineHeight)}
              stroke={brandPurple}
              strokeWidth={1}
              strokeDasharray="4,4"
              opacity={0.7}
            />
          ) : null}

          {rollingPoints.length > 1 ? (
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

          {scorePoints.map((point, index) => (
            <circle
              key={`${point.x}-${index}`}
              cx={point.x}
              cy={point.y}
              r={2.8}
              fill={colors.surface.base}
              stroke={bandColors[point.band]}
              strokeWidth={1.4}
              tabIndex={0}
              onMouseEnter={() => handleHoverPoint(point)}
              onMouseLeave={handleLeavePoint}
              onFocus={() => handleHoverPoint(point)}
              onBlur={() => { if (!isPinned) setActivePoint(null); }}
              onClick={() => handlePointClick(point)}
              onKeyDown={(event) => handlePointKeyDown(event, point)}
            >
              <title>{point.tooltip}</title>
            </circle>
          ))}

          {scorePoints.map((point, index) => (
            index % labelStep === 0 ? (
              <text
                key={`label-${index}`}
                x={point.x}
                y={lineHeight - 8}
                textAnchor="middle"
                fill={colors.text.muted}
                style={{ fontSize: 7 }}
              >
                {point.label}
              </text>
            ) : null
          ))}
          </svg>
          {activePoint ? (
            <div
              style={{
                position: 'absolute',
                left: activePoint.xPx,
                top: activePoint.yPx,
                transform: 'translate(-50%, -110%)',
                background: colors.surface.overlay,
                color: colors.text.primary,
                border: `1px solid ${colors.border.emphasis}`,
                borderRadius: radius.lg,
                boxShadow: shadows.md,
                padding: `${spacing[2]}px ${spacing[3]}px`,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.medium,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  fontSize: typography.size.xs,
                  color: colors.text.muted,
                  marginBottom: spacing[0.5],
                  fontWeight: typography.weight.normal,
                }}
              >
                {activePoint.label}
              </div>
              <div style={{ fontWeight: typography.weight.bold }}>{activePoint.tooltip}</div>
            </div>
          ) : null}
        </div>
        {!trendReady ? (
          <div style={{ marginTop: spacing[2], fontSize: typography.size.xs, color: colors.text.muted }}>
            {t('dashboard.trendNeedsMore', 'Complete more sessions to see trend insights.')} ({MIN_TREND_SESSIONS}+)
          </div>
        ) : null}
      </div>

      {variant === 'clinician' && fatiguePoints.length > 0 && (
        <div
          style={analytics.fatigueZone}
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
          <svg width="100%" height={140} viewBox="0 0 100 140" preserveAspectRatio="none">
            {[0, 25, 50, 75, 100].map((pct) => {
              const y = valueToY(pct, 140);
              return (
                <line
                  key={pct}
                  x1={8}
                  y1={y}
                  x2={92}
                  y2={y}
                  stroke={colors.border.subtle}
                  strokeWidth={0.4}
                  strokeDasharray="2,2"
                />
              );
            })}

            {fatiguePoints.map((point, index) => {
              const paddingX = 8;
              const chartWidth = 100 - paddingX * 2;
              const barWidth = chartWidth / fatiguePoints.length;
              const barGap = Math.min(2, barWidth * 0.25);
              const barX = paddingX + index * barWidth + barGap / 2;
              const barHeight = (point.value / 100) * (140 - 40);
              const barY = valueToY(point.value, 140);
              return (
                <rect
                  key={`bar-${index}`}
                  x={barX}
                  y={barY}
                  width={Math.max(1, barWidth - barGap)}
                  height={barHeight}
                  rx={1.6}
                  fill={brandPurple}
                >
                  <title>{point.tooltip}</title>
                </rect>
              );
            })}

            {fatiguePoints.map((point, index) => {
              const paddingX = 8;
              const chartWidth = 100 - paddingX * 2;
              const barWidth = chartWidth / fatiguePoints.length;
              const barX = paddingX + index * barWidth + barWidth / 2;
              return (
                <text
                  key={`fatigue-label-${index}`}
                  x={barX}
                  y={132}
                  textAnchor="middle"
                  fill={colors.text.muted}
                  style={{ fontSize: 7 }}
                >
                  {point.label}
                </text>
              );
            })}
          </svg>
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
            tone={trendReady ? (stats.slope >= 0 ? '#22c55e' : '#ef4444') : colors.text.muted}
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
            tone={stats.fatigueDirection === 'worsening' ? '#ef4444' : brandCyan}
          />
        </div>
      )}
    </div>
  );
});

export default LongitudinalCharts;
