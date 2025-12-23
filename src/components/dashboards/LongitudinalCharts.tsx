import { memo, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getAllSessions } from '../../utils/sessionStorage';
import type { LabModuleMetrics } from '../../types/moduleMetrics';
import { brandCyan, brandPurple, colors, spacing, radius, typography, analytics } from '../styles';

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
): { level: ConfidenceLevel; message: string; tone: string; consistencyIndex: number } => {
  const sessionFactor = Math.min(1, sessionCount / 8);
  const normalizedVariability = Math.min(1, stdDev / 25);
  const normalizedOutliers = Math.min(1, outlierRate);

  const variabilityScore = 1 - normalizedVariability; // higher = steadier data
  const outlierScore = 1 - normalizedOutliers; // higher = fewer outliers
  const sessionScore = 0.35 + sessionFactor * 0.65; // nudges score up as count grows

  const weightedScore = variabilityScore * 0.45 + outlierScore * 0.25 + sessionScore * 0.3;
  const consistencyIndex = Math.round(Math.max(0, Math.min(100, weightedScore * 100)));

  let level: ConfidenceLevel = 'medium';
  if (sessionCount < MIN_TREND_SESSIONS || consistencyIndex < 50) {
    level = 'low';
  } else if (consistencyIndex >= 78 && sessionCount >= MIN_TREND_SESSIONS + 1) {
    level = 'high';
  }

  const message = level === 'high'
    ? 'High confidence'
    : level === 'medium'
      ? 'Medium confidence—monitor for changes'
      : sessionCount < MIN_TREND_SESSIONS
        ? `Low confidence—need ${MIN_TREND_SESSIONS}+ sessions`
        : 'Low confidence—data variability';

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
    const stdDev = computeStandardDeviation(scores);
    const outlierRate = computeOutlierRate(scores);
    const { level, message, tone, consistencyIndex } = getConfidenceLevel(
      sessions.length,
      stdDev,
      outlierRate,
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
      variability: stdDev,
      outlierRate,
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

  return (
    <div style={{ display: 'grid', gap: spacing[4] }}>
      <div
        style={analytics.chartContainer}
      >
        <div
          style={{
            marginBottom: spacing[3],
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
            }}
          >
            {title || t('dashboard.scoreTrendTitle', 'Score Trend')}
          </div>
          {stats ? (
            <ConfidenceBadge
              tone={stats.confidenceTone}
              text={t('dashboard.confidenceBadge', stats.confidenceMessage)}
              helper={`${t('dashboard.consistencyIndex', 'Consistency')} ${stats.consistencyIndex}/100`}
            />
          ) : null}
        </div>
        <svg width="100%" height={lineHeight} viewBox={`0 0 100 ${lineHeight}`} preserveAspectRatio="none">
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
