/**
 * ProgressChart - Data visualization components for clinical progress
 * Provides line charts, bar charts, and progress rings
 */

import { memo, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  brandCyan,
  brandPurple,
  brandPink,
  colors,
  typography,
  spacing,
  radius,
  transitions,
} from '../styles';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface DataPoint {
  label: string;
  labelAr?: string;
  value: number;
  color?: string;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  color?: string;
  gradientColors?: [string, string];
  fillOpacity?: number;
  isArabic?: boolean;
  title?: string;
  titleAr?: string;
  unit?: string;
  maxValue?: number;
}

interface BarChartProps {
  data: DataPoint[];
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  orientation?: 'vertical' | 'horizontal';
  color?: string;
  isArabic?: boolean;
  title?: string;
  titleAr?: string;
  maxValue?: number;
  animate?: boolean;
}

interface ProgressRingProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  gradientColors?: [string, string];
  label?: string;
  labelAr?: string;
  showPercentage?: boolean;
  isArabic?: boolean;
}

interface MultiLineChartProps {
  datasets: {
    label: string;
    labelAr?: string;
    data: number[];
    color: string;
  }[];
  labels: string[];
  labelsAr?: string[];
  height?: number;
  isArabic?: boolean;
  title?: string;
  titleAr?: string;
  maxValue?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// LINE CHART
// ═══════════════════════════════════════════════════════════════════════════

export const LineChart = memo(({
  data,
  height = 200,
  showLabels = true,
  showValues = false,
  color = brandCyan,
  gradientColors = [brandCyan, brandPurple],
  fillOpacity = 0.15,
  isArabic = false,
  title,
  titleAr,
  unit = '',
  maxValue: providedMax,
}: LineChartProps) => {
  const { t } = useLanguage();
  const chartId = useMemo(() => `line-chart-${Math.random().toString(36).slice(2, 9)}`, []);

  const { points, areaPath, linePath, maxValue, minValue } = useMemo(() => {
    const max = providedMax ?? Math.max(...data.map(d => d.value), 100);
    const min = Math.min(...data.map(d => d.value), 0);
    const range = max - min || 1;

    const width = 100;
    const paddingX = 8;
    const paddingY = 20;
    const chartHeight = height - 40;

    const pts = data.map((d, i) => {
      const x = paddingX + (i * (width - paddingX * 2)) / Math.max(data.length - 1, 1);
      const y = paddingY + chartHeight - ((d.value - min) / range) * chartHeight;
      return { x, y, ...d };
    });

    // Create SVG path for line
    const linePathStr = pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    // Create SVG path for area fill
    const areaPathStr = pts.length > 0
      ? `${linePathStr} L ${pts[pts.length - 1].x} ${paddingY + chartHeight} L ${pts[0].x} ${paddingY + chartHeight} Z`
      : '';

    return {
      points: pts,
      linePath: linePathStr,
      areaPath: areaPathStr,
      maxValue: max,
      minValue: min,
    };
  }, [data, height, providedMax]);

  return (
    <div style={{ width: '100%' }}>
      {(title || titleAr) && (
        <h4 style={{
          margin: `0 0 ${spacing[3]}px`,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
        }}>
          {isArabic ? t(titleAr, title) : title}
        </h4>
      )}

      <svg
        width="100%"
        height={height}
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`${chartId}-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
          <linearGradient id={`${chartId}-fill`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={gradientColors[0]} stopOpacity={fillOpacity} />
            <stop offset="100%" stopColor={gradientColors[0]} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((pct) => {
          const y = 20 + ((height - 40) * (100 - pct)) / 100;
          return (
            <line
              key={pct}
              x1="8"
              y1={y}
              x2="92"
              y2={y}
              stroke={colors.border.subtle}
              strokeWidth={0.3}
              strokeDasharray="1,2"
            />
          );
        })}

        {/* Area fill */}
        <path
          d={areaPath}
          fill={`url(#${chartId}-fill)`}
          style={{
            transition: transitions.slow,
          }}
        />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={`url(#${chartId}-gradient)`}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: transitions.slow,
          }}
        />

        {/* Data points */}
        {points.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.y}
              r={2.5}
              fill={colors.surface.base}
              stroke={point.color || color}
              strokeWidth={1.5}
              style={{ transition: transitions.normal }}
            />
            {showValues && (
              <text
                x={point.x}
                y={point.y - 6}
                textAnchor="middle"
                fill={colors.text.secondary}
                style={{ fontSize: 8 }}
              >
                {point.value}{unit}
              </text>
            )}
          </g>
        ))}

        {/* X-axis labels */}
        {showLabels && points.map((point, i) => (
          <text
            key={`label-${i}`}
            x={point.x}
            y={height - 8}
            textAnchor="middle"
            fill={colors.text.muted}
            style={{ fontSize: 7 }}
          >
            {isArabic ? point.labelAr || point.label : point.label}
          </text>
        ))}
      </svg>
    </div>
  );
});
LineChart.displayName = 'LineChart';

// ═══════════════════════════════════════════════════════════════════════════
// BAR CHART
// ═══════════════════════════════════════════════════════════════════════════

export const BarChart = memo(({
  data,
  height = 180,
  showLabels = true,
  showValues = true,
  orientation = 'vertical',
  color = brandCyan,
  isArabic = false,
  title,
  titleAr,
  maxValue: providedMax,
  animate = true,
}: BarChartProps) => {
  const { t } = useLanguage();
  const chartId = useMemo(() => `bar-chart-${Math.random().toString(36).slice(2, 9)}`, []);
  const maxValue = providedMax ?? Math.max(...data.map(d => d.value), 100);

  const css = animate ? `
    @keyframes barGrow-${chartId} {
      from { transform: scaleY(0); }
      to { transform: scaleY(1); }
    }
    .bar-${chartId} {
      animation: barGrow-${chartId} 0.6s ease-out forwards;
      transform-origin: bottom;
    }
  ` : '';

  if (orientation === 'horizontal') {
    return (
      <div style={{ width: '100%' }}>
        {(title || titleAr) && (
          <h4 style={{
            margin: `0 0 ${spacing[3]}px`,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
          }}>
            {isArabic ? t(titleAr, title) : title}
          </h4>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
          {data.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
              {showLabels && (
                <div style={{
                  width: 60,
                  fontSize: typography.size.xs,
                  color: colors.text.secondary,
                  textAlign: isArabic ? 'right' : 'left',
                }}>
                  {isArabic ? item.labelAr || item.label : item.label}
                </div>
              )}
              <div style={{
                flex: 1,
                height: 24,
                background: colors.border.subtle,
                borderRadius: radius.sm,
                overflow: 'hidden',
              }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(item.value / maxValue) * 100}%`,
                    background: item.color || `linear-gradient(90deg, ${color}, ${brandPurple})`,
                    borderRadius: radius.sm,
                    transition: animate ? transitions.slow : 'none',
                  }}
                />
              </div>
              {showValues && (
                <div style={{
                  width: 40,
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color: item.color || color,
                  textAlign: isArabic ? 'left' : 'right',
                }}>
                  {item.value}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Vertical bars
  return (
    <div style={{ width: '100%' }}>
      {animate && <style>{css}</style>}

      {(title || titleAr) && (
        <h4 style={{
          margin: `0 0 ${spacing[3]}px`,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
        }}>
          {isArabic ? t(titleAr, title) : title}
        </h4>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height,
        gap: spacing[1],
        paddingTop: spacing[4],
      }}>
        {data.map((item, i) => {
          const barHeight = (item.value / maxValue) * (height - 40);
          return (
            <div
              key={i}
              style={{
                flex: 1,
                maxWidth: 60,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing[1],
              }}
            >
              {showValues && (
                <div style={{
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color: item.color || color,
                }}>
                  {item.value}
                </div>
              )}
              <div
                className={animate ? `bar-${chartId}` : ''}
                style={{
                  width: '100%',
                  height: barHeight,
                  background: item.color || `linear-gradient(180deg, ${color}, ${brandPurple})`,
                  borderRadius: `${radius.sm}px ${radius.sm}px 0 0`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
              {showLabels && (
                <div style={{
                  fontSize: typography.size.xs,
                  color: colors.text.muted,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}>
                  {isArabic ? item.labelAr || item.label : item.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
BarChart.displayName = 'BarChart';

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS RING
// ═══════════════════════════════════════════════════════════════════════════

export const ProgressRing = memo(({
  value,
  maxValue = 100,
  size = 80,
  strokeWidth = 6,
  color = brandCyan,
  gradientColors,
  label,
  labelAr,
  showPercentage = true,
  isArabic = false,
}: ProgressRingProps) => {
  const { t } = useLanguage();
  const chartId = useMemo(() => `ring-${Math.random().toString(36).slice(2, 9)}`, []);
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: spacing[2],
    }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {gradientColors && (
            <defs>
              <linearGradient id={`${chartId}-gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={gradientColors[0]} />
                <stop offset="100%" stopColor={gradientColors[1]} />
              </linearGradient>
            </defs>
          )}

          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.border.default}
            strokeWidth={strokeWidth}
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={gradientColors ? `url(#${chartId}-gradient)` : color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: transitions.slow }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {showPercentage && (
            <span style={{
              fontSize: size * 0.22,
              fontWeight: typography.weight.black,
              color: gradientColors ? gradientColors[0] : color,
              lineHeight: 1,
            }}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>

      {(label || labelAr) && (
        <span style={{
          fontSize: typography.size.xs,
          color: colors.text.secondary,
          textAlign: 'center',
        }}>
          {isArabic ? labelAr || label : label}
        </span>
      )}
    </div>
  );
});
ProgressRing.displayName = 'ProgressRing';

// ═══════════════════════════════════════════════════════════════════════════
// MULTI-LINE CHART
// ═══════════════════════════════════════════════════════════════════════════

export const MultiLineChart = memo(({
  datasets,
  labels,
  labelsAr,
  height = 200,
  isArabic = false,
  title,
  titleAr,
  maxValue: providedMax,
}: MultiLineChartProps) => {
  const { t } = useLanguage();
  const maxValue = providedMax ?? Math.max(...datasets.flatMap(d => d.data), 100);
  const chartHeight = height - 50;
  const paddingX = 10;

  const getPath = (data: number[]) => {
    return data
      .map((value, i) => {
        const x = paddingX + (i * (100 - paddingX * 2)) / Math.max(data.length - 1, 1);
        const y = 15 + chartHeight - (value / maxValue) * chartHeight;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  return (
    <div style={{ width: '100%' }}>
      {(title || titleAr) && (
        <h4 style={{
          margin: `0 0 ${spacing[3]}px`,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
        }}>
          {isArabic ? t(titleAr, title) : title}
        </h4>
      )}

      <svg
        width="100%"
        height={height}
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((pct) => {
          const y = 15 + (chartHeight * (100 - pct)) / 100;
          return (
            <line
              key={pct}
              x1={paddingX}
              y1={y}
              x2={100 - paddingX}
              y2={y}
              stroke={colors.border.subtle}
              strokeWidth={0.3}
              strokeDasharray="1,2"
            />
          );
        })}

        {/* Lines */}
        {datasets.map((dataset, i) => (
          <path
            key={i}
            d={getPath(dataset.data)}
            fill="none"
            stroke={dataset.color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: transitions.slow }}
          />
        ))}

        {/* Data points */}
        {datasets.map((dataset, di) =>
          dataset.data.map((value, i) => {
            const x = paddingX + (i * (100 - paddingX * 2)) / Math.max(dataset.data.length - 1, 1);
            const y = 15 + chartHeight - (value / maxValue) * chartHeight;
            return (
              <circle
                key={`${di}-${i}`}
                cx={x}
                cy={y}
                r={2}
                fill={colors.surface.base}
                stroke={dataset.color}
                strokeWidth={1.5}
              />
            );
          })
        )}

        {/* X-axis labels */}
        {labels.map((label, i) => {
          const x = paddingX + (i * (100 - paddingX * 2)) / Math.max(labels.length - 1, 1);
          return (
            <text
              key={i}
              x={x}
              y={height - 5}
              textAnchor="middle"
              fill={colors.text.muted}
              style={{ fontSize: 7 }}
            >
              {isArabic && labelsAr ? labelsAr[i] : label}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: spacing[4],
        marginTop: spacing[2],
        flexWrap: 'wrap',
      }}>
        {datasets.map((dataset, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[1],
          }}>
            <div style={{
              width: 12,
              height: 3,
              background: dataset.color,
              borderRadius: radius.full,
            }} />
            <span style={{
              fontSize: typography.size.xs,
              color: colors.text.secondary,
            }}>
              {isArabic ? dataset.labelAr || dataset.label : dataset.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
MultiLineChart.displayName = 'MultiLineChart';

// ═══════════════════════════════════════════════════════════════════════════
// WEEKLY ACTIVITY CHART
// ═══════════════════════════════════════════════════════════════════════════

interface WeeklyActivityProps {
  data: number[]; // 7 days of activity (0 = no activity, 1+ = sessions)
  isArabic?: boolean;
  maxSessions?: number;
}

export const WeeklyActivityChart = memo(({
  data,
  isArabic = false,
  maxSessions = 3,
}: WeeklyActivityProps) => {
  const { t } = useLanguage();
  const days = isArabic
    ? ['أح', 'إث', 'ث', 'أر', 'خ', 'ج', 'س']
    : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div style={{
      display: 'flex',
      gap: spacing[1],
      justifyContent: 'space-between',
    }}>
      {data.map((sessions, i) => {
        const intensity = Math.min(sessions / maxSessions, 1);
        return (
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing[1],
            flex: 1,
          }}>
            <div style={{
              width: '100%',
              maxWidth: 32,
              aspectRatio: '1',
              borderRadius: radius.sm,
              background: sessions > 0
                ? `rgba(143,211,204,${0.2 + intensity * 0.6})`
                : colors.border.subtle,
              border: sessions > 0
                ? `1px solid ${brandCyan}40`
                : `1px solid ${colors.border.default}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: typography.size.xs,
              fontWeight: typography.weight.bold,
              color: sessions > 0 ? brandCyan : colors.text.muted,
              transition: transitions.fast,
            }}>
              {sessions > 0 ? sessions : ''}
            </div>
            <span style={{
              fontSize: 10,
              color: colors.text.muted,
            }}>
              {days[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
});
WeeklyActivityChart.displayName = 'WeeklyActivityChart';

// ═══════════════════════════════════════════════════════════════════════════
// SCORE TREND INDICATOR
// ═══════════════════════════════════════════════════════════════════════════

interface ScoreTrendProps {
  current: number;
  previous: number;
  label: string;
  labelAr?: string;
  isArabic?: boolean;
  color?: string;
}

export const ScoreTrend = memo(({
  current,
  previous,
  label,
  labelAr,
  isArabic = false,
  color = brandCyan,
}: ScoreTrendProps) => {
  const { t } = useLanguage();
  const change = current - previous;
  const percentChange = previous > 0 ? Math.round((change / previous) * 100) : 0;
  const isPositive = change >= 0;

  return (
    <div style={{
      padding: spacing[3],
      background: `${color}10`,
      border: `1px solid ${color}20`,
      borderRadius: radius.lg,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: spacing[1],
      }}>
        <span style={{
          fontSize: typography.size['2xl'],
          fontWeight: typography.weight.black,
          color,
        }}>
          {current}
        </span>
        <span style={{
          fontSize: typography.size.xs,
          fontWeight: typography.weight.bold,
          color: isPositive ? '#22c55e' : '#ef4444',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          <span>{isPositive ? '↑' : '↓'}</span>
          {Math.abs(percentChange)}%
        </span>
      </div>
      <div style={{
        fontSize: typography.size.xs,
        color: colors.text.secondary,
      }}>
        {isArabic ? labelAr || label : label}
      </div>
    </div>
  );
});
ScoreTrend.displayName = 'ScoreTrend';

export default LineChart;
