import { memo, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getAllSessions } from '../../utils/sessionStorage';
import type { LabModuleMetrics } from '../../types/moduleMetrics';
import { brandCyan, brandPurple, colors, spacing, radius, typography } from '../styles';

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
      padding: spacing[3],
      borderRadius: radius.lg,
      background: `${tone}12`,
      border: `1px solid ${tone}30`,
    }}
  >
    <div style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
      {label}
    </div>
    <div style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold, color: tone }}>
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
      fatigueDirection,
    };
  }, [sessions]);

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
        style={{
          padding: spacing[4],
          borderRadius: radius.xl,
          border: `1px solid ${colors.border.default}`,
          background: colors.surface.card,
        }}
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
      </div>

      {variant === 'clinician' && fatiguePoints.length > 0 && (
        <div
          style={{
            padding: spacing[4],
            borderRadius: radius.xl,
            border: `1px solid ${colors.border.default}`,
            background: colors.surface.card,
          }}
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
            label={t('dashboard.bestScore', 'Best Score')}
            value={`${stats.best}`}
            tone={brandPurple}
          />
          <MetricCard
            label={t('dashboard.scoreSlope', 'Score Slope')}
            value={`${stats.slope >= 0 ? '+' : ''}${stats.slope.toFixed(1)} ${t('dashboard.perSession', 'per session')}`}
            tone={stats.slope >= 0 ? '#22c55e' : '#ef4444'}
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
