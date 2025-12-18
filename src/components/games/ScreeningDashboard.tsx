/**
 * ScreeningDashboard - Medical-style results visualization
 * Shows user's screening history with gauges, trends, and insights
 */

import { memo, useMemo, useState, useCallback, useEffect } from 'react';
import { useVisitorMode } from '../../context/VisitorModeContext';
import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPink, brandPurple, colors, radius, spacing, typography, transitions, shadows, brandPurpleDark } from '../styles';
import { getSessions, type StoredSession } from './scoring';
import { resultMeta, type GameResult, type TestOutcome } from './types';

// ═══════════════════════════════════════════════════════════════════════════
// GAUGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface GaugeProps {
  value: number; // 0-100
  label: string;
  color: string;
  size?: number;
  thickness?: number;
}

const Gauge = memo(function Gauge({
  value,
  label,
  color,
  size = 120,
  thickness = 10,
}: GaugeProps) {
  const circumference = (size - thickness) * Math.PI;
  const progress = Math.min(100, Math.max(0, value));
  const offset = circumference - (progress / 100) * circumference;

  const getResultLevel = (v: number): { label: string; emoji: string } => {
    if (v >= 70) return { label: 'Strong', emoji: '⭐' };
    if (v >= 40) return { label: 'Moderate', emoji: '◐' };
    return { label: 'Needs Attention', emoji: '○' };
  };

  const level = getResultLevel(value);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size / 2 + 20, margin: '0 auto' }}>
        <svg
          width={size}
          height={size / 2 + 10}
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${size / 2}px ${size / 2}px` }}
        >
          {/* Background arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size - thickness) / 2}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={circumference / 2}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size - thickness) / 2}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={offset + circumference / 2}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${color}60)`,
              transition: 'stroke-dashoffset 1s ease-out',
            }}
          />
        </svg>
        {/* Center value */}
        <div style={{
          position: 'absolute',
          top: size / 2 - 20,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: typography.size['3xl'],
            fontWeight: typography.weight.black,
            color,
            fontFamily: 'monospace',
          }}>
            {Math.round(value)}%
          </div>
          <div style={{
            fontSize: typography.size.xs,
            color: colors.text.muted,
          }}>
            {level.emoji} {level.label}
          </div>
        </div>
      </div>
      <div style={{
        marginTop: spacing[2],
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
      }}>
        {label}
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// MINI TREND CHART
// ═══════════════════════════════════════════════════════════════════════════

interface TrendChartProps {
  data: number[];
  color: string;
  height?: number;
  label: string;
}

const TrendChart = memo(function TrendChart({
  data,
  color,
  height = 60,
  label,
}: TrendChartProps) {
  if (data.length < 2) {
    return (
      <div style={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.text.muted,
        fontSize: typography.size.xs,
      }}>
        More data needed
      </div>
    );
  }

  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const width = 200;
  const padding = 10;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const trend = data[data.length - 1] - data[0];
  const trendIcon = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
  const trendColor = trend > 0 ? '#22c55e' : trend < 0 ? '#ef4444' : colors.text.muted;

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing[2],
      }}>
        <span style={{
          fontSize: typography.size.xs,
          color: colors.text.muted,
        }}>
          {label}
        </span>
        <span style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: trendColor,
        }}>
          {trendIcon} {Math.abs(trend).toFixed(0)}%
        </span>
      </div>
      <svg width={width} height={height} style={{ display: 'block' }}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((v) => {
          const y = height - padding - ((v - min) / range) * (height - padding * 2);
          return (
            <line
              key={v}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="4,4"
            />
          );
        })}
        {/* Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth={2}
          points={points}
          style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
        />
        {/* Points */}
        {data.map((v, i) => {
          const x = padding + (i / (data.length - 1)) * (width - padding * 2);
          const y = height - padding - ((v - min) / range) * (height - padding * 2);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={4}
              fill={color}
              style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
            />
          );
        })}
      </svg>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// RESULT CARD
// ═══════════════════════════════════════════════════════════════════════════

interface ResultCardProps {
  icon: string;
  title: string;
  titleAr: string;
  value: string;
  subtext: string;
  color: string;
  result?: GameResult;
}

const ResultCard = memo(function ResultCard({
  icon,
  title,
  titleAr,
  value,
  subtext,
  color,
  result,
}: ResultCardProps) {
  const { isArabic } = useLanguage();

  return (
    <div style={{
      padding: spacing[4],
      background: `${color}08`,
      border: `1px solid ${color}20`,
      borderRadius: radius.xl,
      display: 'flex',
      alignItems: 'center',
      gap: spacing[3],
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: radius.lg,
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: typography.size.xs,
          color: colors.text.muted,
          marginBottom: spacing[0.5],
        }}>
          {isArabic ? titleAr : title}
        </div>
        <div style={{
          fontSize: typography.size.xl,
          fontWeight: typography.weight.black,
          color,
          fontFamily: 'monospace',
        }}>
          {value}
        </div>
        <div style={{
          fontSize: typography.size.xs,
          color: colors.text.muted,
          marginTop: spacing[0.5],
        }}>
          {subtext}
        </div>
      </div>
      {result && (
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: resultMeta[result].color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 16,
          fontWeight: typography.weight.bold,
          flexShrink: 0,
        }}>
          {result === 'high' ? '⭐' : result === 'medium' ? '◐' : '○'}
        </div>
      )}
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

interface ScreeningDashboardProps {
  compact?: boolean;
}

const ScreeningDashboard = memo(function ScreeningDashboard({
  compact = false,
}: ScreeningDashboardProps) {
  const { config, isSchool, isParent, isClinician } = useVisitorMode();
  const { isArabic } = useLanguage();
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'trends'>('overview');

  // Load sessions
  useEffect(() => {
    setSessions(getSessions());
  }, []);

  // Calculate metrics
  const metrics = useMemo(() => {
    if (sessions.length === 0) return null;

    const allOutcomes = sessions.flatMap(s => Object.values(s.outcomes).filter(Boolean) as TestOutcome[]);
    const totalTests = allOutcomes.length;
    const totalPoints = sessions.reduce((sum, s) => sum + (s.totalPoints || 0), 0);

    // Calculate average scores per test type
    const testTypes = ['attention', 'frequency', 'sequence', 'questionnaire'];
    const averages: Record<string, { scores: number[]; avg: number }> = {};

    testTypes.forEach(type => {
      const outcomes = allOutcomes.filter(o => o.key === type);
      if (outcomes.length > 0) {
        const scores = outcomes.map(o => {
          // Convert result to numeric score
          if (o.result === 'high') return 85;
          if (o.result === 'medium') return 55;
          return 25;
        });
        averages[type] = {
          scores,
          avg: scores.reduce((a, b) => a + b, 0) / scores.length,
        };
      }
    });

    // Overall composite score
    const allScores = Object.values(averages).flatMap(a => a.scores);
    const overallAvg = allScores.length > 0
      ? allScores.reduce((a, b) => a + b, 0) / allScores.length
      : 0;

    // Result distribution
    const distribution = {
      high: allOutcomes.filter(o => o.result === 'high').length,
      medium: allOutcomes.filter(o => o.result === 'medium').length,
      low: allOutcomes.filter(o => o.result === 'low').length,
    };

    return {
      totalTests,
      totalPoints,
      totalSessions: sessions.length,
      averages,
      overallAvg,
      distribution,
      latestSession: sessions[0],
    };
  }, [sessions]);

  // Visitor-specific insights
  const insights = useMemo(() => {
    if (!metrics) return [];

    const baseInsights: Array<{ icon: string; textEn: string; textAr: string; priority: 'info' | 'warning' | 'success' }> = [];

    if (metrics.overallAvg >= 70) {
      baseInsights.push({
        icon: '⭐',
        textEn: 'Strong auditory processing indicators across tests.',
        textAr: 'مؤشرات قوية للمعالجة السمعية عبر الاختبارات.',
        priority: 'success',
      });
    } else if (metrics.overallAvg >= 40) {
      baseInsights.push({
        icon: '◐',
        textEn: 'Mixed results suggest targeted evaluation may be beneficial.',
        textAr: 'النتائج المختلطة تشير إلى أن التقييم المستهدف قد يكون مفيداً.',
        priority: 'info',
      });
    } else if (metrics.totalTests > 0) {
      baseInsights.push({
        icon: '⚠️',
        textEn: 'Results suggest professional auditory processing evaluation is recommended.',
        textAr: 'النتائج تشير إلى أن التقييم المهني للمعالجة السمعية موصى به.',
        priority: 'warning',
      });
    }

    // Add visitor-specific insights
    if (isSchool) {
      baseInsights.push({
        icon: '🏫',
        textEn: 'School screening data can be aggregated for classroom-level insights.',
        textAr: 'يمكن تجميع بيانات الفحص المدرسي للحصول على رؤى على مستوى الفصل.',
        priority: 'info',
      });
    }

    if (isParent && metrics.overallAvg < 50) {
      baseInsights.push({
        icon: '📅',
        textEn: 'Consider booking a professional screening with our team.',
        textAr: 'فكر في حجز فحص مهني مع فريقنا.',
        priority: 'warning',
      });
    }

    if (isClinician) {
      baseInsights.push({
        icon: '📊',
        textEn: 'Raw data and detailed metrics available for clinical documentation.',
        textAr: 'البيانات الخام والمقاييس التفصيلية متاحة للتوثيق السريري.',
        priority: 'info',
      });
    }

    return baseInsights;
  }, [metrics, isSchool, isParent, isClinician]);

  const css = useMemo(() => `
    .dashboard-tab {
      transition: all 0.2s ease;
    }
    .dashboard-tab:hover {
      background: rgba(255,255,255,0.06) !important;
    }
    .dashboard-tab.active {
      background: ${config.color}15 !important;
      color: ${config.color} !important;
      border-color: ${config.color} !important;
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 20px ${config.color}30; }
      50% { box-shadow: 0 0 40px ${config.color}50; }
    }
  `, [config.color]);

  if (!metrics || metrics.totalTests === 0) {
    return (
      <div style={{
        padding: spacing[6],
        background: colors.surface.card,
        borderRadius: radius['2xl'],
        border: `1px solid ${colors.border.default}`,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: spacing[4] }}>📊</div>
        <h3 style={{
          margin: `0 0 ${spacing[2]}px`,
          fontSize: typography.size.xl,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
        }}>
          {isArabic ? 'لا توجد نتائج بعد' : 'No Results Yet'}
        </h3>
        <p style={{
          margin: 0,
          fontSize: typography.size.sm,
          color: colors.text.muted,
          lineHeight: typography.lineHeight.relaxed,
        }}>
          {isArabic
            ? 'أكمل اختبارات الفحص لمشاهدة نتائجك هنا'
            : 'Complete screening tests to see your results here'}
        </p>
        <a
          href="#games"
          style={{
            display: 'inline-block',
            marginTop: spacing[4],
            padding: `${spacing[3]}px ${spacing[5]}px`,
            background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
            borderRadius: radius.lg,
            color: '#fff',
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            textDecoration: 'none',
            boxShadow: `0 4px 20px ${config.color}30`,
          }}
        >
          {isArabic ? 'ابدأ الفحص' : 'Start Screening'}
        </a>
      </div>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div style={{
        background: colors.surface.card,
        borderRadius: radius['2xl'],
        border: `1px solid ${colors.border.default}`,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: spacing[4],
          background: `linear-gradient(135deg, ${config.color}08, transparent)`,
          borderBottom: `1px solid ${colors.border.subtle}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: spacing[3],
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: radius.lg,
              background: `${config.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              animation: 'pulseGlow 3s ease-in-out infinite',
            }}>
              📈
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: typography.size.lg,
                fontWeight: typography.weight.bold,
                color: colors.text.primary,
              }}>
                {isArabic ? 'لوحة نتائج الفحص' : 'Screening Dashboard'}
              </h3>
              <div style={{
                fontSize: typography.size.xs,
                color: colors.text.muted,
                marginTop: 2,
              }}>
                {isArabic
                  ? `${metrics.totalSessions} جلسات • ${metrics.totalTests} اختبارات`
                  : `${metrics.totalSessions} sessions • ${metrics.totalTests} tests`}
              </div>
            </div>
          </div>

          {/* Tabs */}
          {!compact && (
            <div style={{ display: 'flex', gap: spacing[1] }}>
              {(['overview', 'history', 'trends'] as const).map((tab) => (
                <button
                  key={tab}
                  className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: `${spacing[2]}px ${spacing[3]}px`,
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${colors.border.subtle}`,
                    borderRadius: radius.md,
                    fontSize: typography.size.xs,
                    fontWeight: typography.weight.bold,
                    color: colors.text.secondary,
                    cursor: 'pointer',
                  }}
                >
                  {tab === 'overview' && (isArabic ? 'نظرة عامة' : 'Overview')}
                  {tab === 'history' && (isArabic ? 'السجل' : 'History')}
                  {tab === 'trends' && (isArabic ? 'الاتجاهات' : 'Trends')}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: spacing[4] }}>
          {activeTab === 'overview' && (
            <>
              {/* Gauges Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: spacing[4],
                marginBottom: spacing[5],
              }}>
                <Gauge
                  value={metrics.overallAvg}
                  label={isArabic ? 'المعدل الكلي' : 'Overall Score'}
                  color={metrics.overallAvg >= 70 ? brandCyan : metrics.overallAvg >= 40 ? brandPurple : brandPink}
                />
                {metrics.averages['attention'] && (
                  <Gauge
                    value={metrics.averages['attention'].avg}
                    label={isArabic ? 'الانتباه' : 'Attention'}
                    color="#3B82F6"
                    size={100}
                  />
                )}
                {metrics.averages['frequency'] && (
                  <Gauge
                    value={metrics.averages['frequency'].avg}
                    label={isArabic ? 'التردد' : 'Frequency'}
                    color="#8B5CF6"
                    size={100}
                  />
                )}
                {metrics.averages['sequence'] && (
                  <Gauge
                    value={metrics.averages['sequence'].avg}
                    label={isArabic ? 'التسلسل' : 'Sequence'}
                    color="#F59E0B"
                    size={100}
                  />
                )}
              </div>

              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: spacing[3],
                marginBottom: spacing[5],
              }}>
                <ResultCard
                  icon="⭐"
                  title="Points Earned"
                  titleAr="النقاط المكتسبة"
                  value={metrics.totalPoints.toLocaleString()}
                  subtext={isArabic ? 'إجمالي النقاط' : 'Total points'}
                  color={brandCyan}
                />
                <ResultCard
                  icon="🧪"
                  title="Tests Completed"
                  titleAr="الاختبارات المكتملة"
                  value={metrics.totalTests.toString()}
                  subtext={isArabic ? `${metrics.totalSessions} جلسات` : `${metrics.totalSessions} sessions`}
                  color={brandPurple}
                />
                <ResultCard
                  icon="📊"
                  title="Result Distribution"
                  titleAr="توزيع النتائج"
                  value={`${metrics.distribution.high}/${metrics.distribution.medium}/${metrics.distribution.low}`}
                  subtext={isArabic ? 'قوي / متوسط / ضعيف' : 'High / Med / Low'}
                  color={brandPink}
                />
              </div>

              {/* Insights */}
              {insights.length > 0 && (
                <div style={{
                  padding: spacing[4],
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: radius.xl,
                  border: `1px solid ${colors.border.subtle}`,
                }}>
                  <h4 style={{
                    margin: `0 0 ${spacing[3]}px`,
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.bold,
                    color: config.color,
                  }}>
                    {isArabic ? '💡 رؤى مخصصة' : '💡 Personalized Insights'}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                    {insights.map((insight, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: spacing[3],
                          padding: spacing[3],
                          background: insight.priority === 'warning'
                            ? 'rgba(245,158,11,0.08)'
                            : insight.priority === 'success'
                              ? 'rgba(34,197,94,0.08)'
                              : 'rgba(255,255,255,0.03)',
                          borderRadius: radius.lg,
                        }}
                      >
                        <span style={{ fontSize: 18 }}>{insight.icon}</span>
                        <p style={{
                          margin: 0,
                          fontSize: typography.size.sm,
                          color: colors.text.secondary,
                          lineHeight: typography.lineHeight.relaxed,
                        }}>
                          {isArabic ? insight.textAr : insight.textEn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
              {sessions.slice(0, 10).map((session, i) => {
                const outcomes = Object.values(session.outcomes).filter(Boolean) as TestOutcome[];
                const date = new Date(session.date);
                return (
                  <div
                    key={session.id}
                    style={{
                      padding: spacing[3],
                      background: i === 0 ? `${config.color}08` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${i === 0 ? config.color + '30' : colors.border.subtle}`,
                      borderRadius: radius.lg,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: spacing[3],
                    }}
                  >
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing[2],
                        marginBottom: spacing[1],
                      }}>
                        {i === 0 && (
                          <span style={{
                            padding: `${spacing[0.5]}px ${spacing[2]}px`,
                            background: `${config.color}20`,
                            borderRadius: radius.sm,
                            fontSize: typography.size.xs,
                            fontWeight: typography.weight.bold,
                            color: config.color,
                          }}>
                            {isArabic ? 'الأخيرة' : 'Latest'}
                          </span>
                        )}
                        <span style={{
                          fontSize: typography.size.sm,
                          fontWeight: typography.weight.bold,
                          color: colors.text.primary,
                        }}>
                          {outcomes.length} {isArabic ? 'اختبارات' : 'tests'}
                        </span>
                      </div>
                      <div style={{
                        fontSize: typography.size.xs,
                        color: colors.text.muted,
                      }}>
                        {date.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')} • {date.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: spacing[1] }}>
                      {outcomes.map((o, j) => (
                        <div
                          key={j}
                          title={o.title}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: radius.md,
                            background: `${resultMeta[o.result].color}20`,
                            border: `1px solid ${resultMeta[o.result].color}40`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                          }}
                        >
                          {o.result === 'high' ? '⭐' : o.result === 'medium' ? '◐' : '○'}
                        </div>
                      ))}
                    </div>
                    {session.totalPoints && session.totalPoints > 0 && (
                      <div style={{
                        padding: `${spacing[1.5]}px ${spacing[3]}px`,
                        background: `${brandCyan}15`,
                        borderRadius: radius.md,
                        fontSize: typography.size.sm,
                        fontWeight: typography.weight.bold,
                        color: brandCyan,
                      }}>
                        {session.totalPoints} pts
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'trends' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: spacing[4],
            }}>
              {Object.entries(metrics.averages).map(([key, data]) => (
                <div
                  key={key}
                  style={{
                    padding: spacing[4],
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: radius.lg,
                    border: `1px solid ${colors.border.subtle}`,
                  }}
                >
                  <TrendChart
                    data={data.scores}
                    color={
                      key === 'attention' ? '#3B82F6' :
                      key === 'frequency' ? '#8B5CF6' :
                      key === 'sequence' ? '#F59E0B' :
                      brandPink
                    }
                    label={
                      key === 'attention' ? (isArabic ? 'الانتباه' : 'Attention') :
                      key === 'frequency' ? (isArabic ? 'التردد' : 'Frequency') :
                      key === 'sequence' ? (isArabic ? 'التسلسل' : 'Sequence') :
                      isArabic ? 'الاستبيان' : 'Questionnaire'
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div style={{
          padding: spacing[4],
          borderTop: `1px solid ${colors.border.subtle}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: spacing[3],
        }}>
          <p style={{
            margin: 0,
            fontSize: typography.size.xs,
            color: colors.text.muted,
          }}>
            {isArabic
              ? '⚕️ هذه نتائج فحص غير تشخيصية'
              : '⚕️ These are non-diagnostic screening results'}
          </p>
          <a
            href={config.ctaPath}
            style={{
              padding: `${spacing[2]}px ${spacing[4]}px`,
              background: `${config.color}15`,
              border: `1px solid ${config.color}40`,
              borderRadius: radius.lg,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.bold,
              color: config.color,
              textDecoration: 'none',
              transition: transitions.fast,
            }}
          >
            {isArabic ? config.ctaLabelAr : config.ctaLabel}
          </a>
        </div>
      </div>
    </>
  );
});

export default ScreeningDashboard;
