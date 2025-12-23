import { memo, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getAllSessions } from '../../utils/sessionStorage';
import type { LabModuleMetrics } from '../../types/moduleMetrics';
import { brandCyan, brandPurple, colors, spacing, radius, typography, analytics } from '../styles';

type ChartVariant = 'parent' | 'clinician';

type ChartSeriesKey = 'overall' | 'left' | 'right' | 'balance';

type ChartPoint = {
  x: number;
  y: number;
  value: number;
  label: string;
  tooltip: string;
  color: string;
  band?: LabModuleMetrics['band'];
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

const buildPath = (points: Array<{ x: number; y: number }>) => {
  if (!points.length) return '';
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
};

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

  const sessions = useMemo(() => {
    const allSessions = getAllSessions();
    return allSessions
      .filter((session) => session.moduleId === moduleId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [moduleId]);

  const lineHeight = variant === 'parent' ? 160 : 190;
  const trendReady = sessions.length >= MIN_TREND_SESSIONS;

  const normalizedSessions = useMemo(() => {
    return sessions.map((session) => ({
      ...session,
      score100: clampScore(session.score100),
      leftScore: typeof (session.rawMetrics as Record<string, number | undefined>)?.leftScore === 'number'
        ? clampScore((session.rawMetrics as Record<string, number>).leftScore)
        : typeof (session.metrics as { leftAccuracyPct?: number }).leftAccuracyPct === 'number'
          ? clampScore((session.metrics as { leftAccuracyPct?: number }).leftAccuracyPct ?? 0)
          : null,
      rightScore: typeof (session.rawMetrics as Record<string, number | undefined>)?.rightScore === 'number'
        ? clampScore((session.rawMetrics as Record<string, number>).rightScore)
        : typeof (session.metrics as { rightAccuracyPct?: number }).rightAccuracyPct === 'number'
          ? clampScore((session.metrics as { rightAccuracyPct?: number }).rightAccuracyPct ?? 0)
          : null,
      balanceIndex: typeof (session.rawMetrics as Record<string, number | undefined>)?.balanceIndex === 'number'
        ? clampScore((session.rawMetrics as Record<string, number>).balanceIndex)
        : typeof (session.metrics as { balanceIndex?: number }).balanceIndex === 'number'
          ? clampScore((session.metrics as { balanceIndex?: number }).balanceIndex ?? 0)
          : null,
    }));
  }, [sessions]);

  const rollingScores = useMemo(() => {
    if (!normalizedSessions.length) return [];
    return normalizedSessions.map((session, index) => {
      const start = Math.max(0, index - (ROLLING_WINDOW - 1));
      const window = normalizedSessions.slice(start, index + 1);
      const avg = window.reduce((sum, entry) => sum + entry.score100, 0) / window.length;
      return Math.round(avg);
    });
  }, [normalizedSessions]);

  const baselineScore = useMemo(() => (normalizedSessions.length ? normalizedSessions[0].score100 : null), [normalizedSessions]);

  const xPositions = useMemo(() => {
    const paddingX = 8;
    const width = 100;
    return normalizedSessions.map((_, index) => (
      normalizedSessions.length === 1
        ? 50
        : paddingX + (index * (width - paddingX * 2)) / Math.max(normalizedSessions.length - 1, 1)
    ));
  }, [normalizedSessions]);

  const valueToY = (value: number, height: number) => {
    const paddingY = 16;
    const chartHeight = height - 40;
    return paddingY + chartHeight - (value / 100) * chartHeight;
  };

  const chartSeries = useMemo(() => {
    const buildSeriesPoints = (key: ChartSeriesKey, label: string, color: string) => {
      const values = normalizedSessions.map((session) => {
        if (key === 'overall') return session.score100;
        if (key === 'left') return session.leftScore;
        if (key === 'right') return session.rightScore;
        return session.balanceIndex;
      });

      const points = values
        .map((value, index) => {
          if (value === null || value === undefined) return null;
          const y = valueToY(value, lineHeight);
          return {
            x: xPositions[index],
            y,
            value,
            label: formatLabel(normalizedSessions[index].timestamp, locale),
            tooltip: `${label} - ${formatTooltip(normalizedSessions[index].timestamp, locale, value, '%')}`,
            color,
            band: key === 'overall' ? normalizedSessions[index].band : undefined,
          } as ChartPoint;
        })
        .filter((point): point is ChartPoint => point !== null);

      return {
        key,
        label,
        color,
        points,
        path: buildPath(points),
      };
    };

    const allSeries = [
      buildSeriesPoints('overall', t('dashboard.overallScore', 'Overall Score'), brandCyan),
      buildSeriesPoints('left', t('dashboard.leftEar', 'Left Ear'), '#22c55e'),
      buildSeriesPoints('right', t('dashboard.rightEar', 'Right Ear'), '#f97316'),
      buildSeriesPoints('balance', t('dashboard.balance', 'Balance'), brandPurple),
    ];

    const visibleSeries = variant === 'clinician' ? allSeries : allSeries.filter((series) => series.key === 'overall');

    return visibleSeries.filter((series) => series.points.length > 0);
  }, [brandCyan, brandPurple, lineHeight, locale, normalizedSessions, t, variant, xPositions]);

  const [activeSeries, setActiveSeries] = useState<ChartSeriesKey[]>(() => chartSeries.map((series) => series.key));

  useEffect(() => {
    setActiveSeries((prev) => {
      const nextKeys = chartSeries.map((series) => series.key);
      const filtered = prev.filter((key) => nextKeys.includes(key));
      if (filtered.length) return filtered as ChartSeriesKey[];
      return nextKeys as ChartSeriesKey[];
    });
  }, [chartSeries]);

  const activeChartSeries = useMemo(() => chartSeries.filter((series) => activeSeries.includes(series.key)), [activeSeries, chartSeries]);

  const rollingPoints = useMemo(() => {
    if (!rollingScores.length) return [];
    const paddingY = 16;
    const chartHeight = lineHeight - 40;

    return rollingScores.map((value, index) => {
      const y = paddingY + chartHeight - (value / 100) * chartHeight;
      return { x: xPositions[index], y, value };
    });
  }, [rollingScores, lineHeight, xPositions]);

  const rollingPath = useMemo(() => buildPath(rollingPoints), [rollingPoints]);

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
    if (normalizedSessions.length === 0) {
      return null;
    }

    const scores = normalizedSessions.map((session) => session.score100);
    const average = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    const best = Math.max(...scores);
    const slope = computeSlope(scores);
    const baseline = baselineScore ?? scores[0];
    const recentAverage = rollingScores.length ? rollingScores[rollingScores.length - 1] : null;

    const fatigueValues = normalizedSessions
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
  }, [baselineScore, normalizedSessions, rollingScores]);

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

  const primarySeries = chartSeries.find((series) => series.key === 'overall') ?? chartSeries[0];
  const labelPoints = primarySeries?.points.length ? primarySeries.points : (activeChartSeries[0]?.points ?? []);
  const labelStep = labelPoints.length > 6
    ? Math.ceil(labelPoints.length / 6)
    : 1;

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
        {variant === 'clinician' && chartSeries.length > 1 ? (
          <div style={{ display: 'flex', gap: spacing[2], flexWrap: 'wrap', marginBottom: spacing[2] }}>
            {chartSeries.map((series) => {
              const isActive = activeSeries.includes(series.key);
              return (
                <button
                  key={series.key}
                  type="button"
                  onClick={() => {
                    setActiveSeries((prev) => {
                      const exists = prev.includes(series.key);
                      if (exists && prev.length === 1) return prev; // Keep at least one series active
                      if (exists) return prev.filter((key) => key !== series.key) as ChartSeriesKey[];
                      return [...prev, series.key];
                    });
                  }}
                  aria-pressed={isActive}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[1],
                    padding: `${spacing[1]}px ${spacing[2]}px`,
                    borderRadius: radius.md,
                    border: `1px solid ${isActive ? series.color : colors.border.default}`,
                    background: isActive ? `${series.color}12` : colors.surface.base,
                    color: colors.text.primary,
                    fontSize: typography.size.xs,
                    fontWeight: typography.weight.bold,
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 4,
                      background: series.color,
                      display: 'inline-block',
                    }}
                  />
                  {series.label}
                </button>
              );
            })}
          </div>
        ) : null}
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

          {activeChartSeries.map((series) => (
            <path
              key={series.key}
              d={series.path}
              fill="none"
              stroke={series.color}
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {activeChartSeries.map((series) => (
            series.points.map((point, index) => (
              <circle
                key={`${series.key}-${point.x}-${index}`}
                cx={point.x}
                cy={point.y}
                r={2.8}
                fill={colors.surface.base}
                stroke={point.band ? bandColors[point.band] : series.color}
                strokeWidth={1.4}
              >
                <title>{point.tooltip}</title>
              </circle>
            ))
          ))}

          {labelPoints.map((point, index) => (
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
