/**
 * PostTestSummary - Results summary with visitor-mode-specific recommendations
 * Displays test outcomes and next steps based on user type
 */

import { memo, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useVisitorMode } from '../../context/VisitorModeContext';
import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPink, brandPurple, colors, radius, spacing, typography, transitions, shadows } from '../styles';
import { renderLabIcon } from '../icons/index';
import type { TestOutcome, GameResult } from './types';
import { resultMeta } from './types';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface PostTestSummaryProps {
  outcome: TestOutcome;
  onClose: () => void;
  onRetry: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// RECOMMENDATIONS BY RESULT AND VISITOR MODE
// ═══════════════════════════════════════════════════════════════════════════

interface Recommendation {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  actionEn: string;
  actionAr: string;
  actionPath: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

const RECOMMENDATIONS: Record<GameResult, Record<string, Recommendation[]>> = {
  low: {
    school: [
      {
        titleEn: 'Schedule Individual Assessment',
        titleAr: 'auto.PostTestSummary.k7',
        descriptionEn: 'This student may benefit from a comprehensive auditory processing evaluation.',
        descriptionAr: 'auto.PostTestSummary.k8',
        actionEn: 'Request Evaluation',
        actionAr: 'auto.PostTestSummary.k9',
        actionPath: '/contact?mode=school&type=evaluation',
        icon: '📋',
        priority: 'high',
      },
      {
        titleEn: 'Classroom Accommodations',
        titleAr: 'auto.PostTestSummary.k10',
        descriptionEn: 'Consider preferential seating and reduced background noise during instruction.',
        descriptionAr: 'auto.PostTestSummary.k11',
        actionEn: 'View Accommodations Guide',
        actionAr: 'auto.PostTestSummary.k12',
        actionPath: '/resources#accommodations',
        icon: '🏫',
        priority: 'medium',
      },
    ],
    parent: [
      {
        titleEn: 'Book Professional Screening',
        titleAr: 'auto.PostTestSummary.k13',
        descriptionEn: 'These results suggest your child may benefit from a professional auditory processing evaluation.',
        descriptionAr: 'auto.PostTestSummary.k14',
        actionEn: 'Book Screening',
        actionAr: 'auto.PostTestSummary.k15',
        actionPath: '/contact?mode=parent',
        icon: '📅',
        priority: 'high',
      },
      {
        titleEn: 'Learn About Bérard AIT',
        titleAr: 'auto.PostTestSummary.k16',
        descriptionEn: 'Auditory Integration Training may help improve auditory processing abilities.',
        descriptionAr: 'auto.PostTestSummary.k17',
        actionEn: 'View Program Details',
        actionAr: 'auto.PostTestSummary.k18',
        actionPath: '/program',
        icon: '🎧',
        priority: 'medium',
      },
    ],
    clinician: [
      {
        titleEn: 'Access Clinical Protocol',
        titleAr: 'auto.PostTestSummary.k19',
        descriptionEn: 'Results indicate potential auditory processing concerns warranting clinical evaluation.',
        descriptionAr: 'auto.PostTestSummary.k20',
        actionEn: 'View Protocol',
        actionAr: 'auto.PostTestSummary.k21',
        actionPath: '/clinician-dashboard',
        icon: '📊',
        priority: 'high',
      },
      {
        titleEn: 'Export Data for Records',
        titleAr: 'auto.PostTestSummary.k22',
        descriptionEn: 'Download raw data and detailed metrics for clinical documentation.',
        descriptionAr: 'auto.PostTestSummary.k23',
        actionEn: 'Export Data',
        actionAr: 'auto.PostTestSummary.k24',
        actionPath: '#export',
        icon: '💾',
        priority: 'medium',
      },
    ],
  },
  medium: {
    school: [
      {
        titleEn: 'Monitor Progress',
        titleAr: 'auto.PostTestSummary.k25',
        descriptionEn: 'Consider periodic re-screening to track changes over time.',
        descriptionAr: 'auto.PostTestSummary.k26',
        actionEn: 'Schedule Follow-up',
        actionAr: 'auto.PostTestSummary.k27',
        actionPath: '/contact?mode=school&type=followup',
        icon: '📈',
        priority: 'medium',
      },
      {
        titleEn: 'Explore School Partnership',
        titleAr: 'auto.PostTestSummary.k28',
        descriptionEn: 'Learn how our school screening program can benefit your students.',
        descriptionAr: 'auto.PostTestSummary.k29',
        actionEn: 'View Partnership Details',
        actionAr: 'auto.PostTestSummary.k30',
        actionPath: '/contact?mode=school',
        icon: '🤝',
        priority: 'low',
      },
    ],
    parent: [
      {
        titleEn: 'Complete Full Assessment',
        titleAr: 'auto.PostTestSummary.k31',
        descriptionEn: 'Try the complete screening suite for a more comprehensive picture.',
        descriptionAr: 'auto.PostTestSummary.k32',
        actionEn: 'Start Full Suite',
        actionAr: 'auto.PostTestSummary.k33',
        actionPath: '#games',
        icon: '🧪',
        priority: 'medium',
      },
      {
        titleEn: 'Review Checklist',
        titleAr: 'auto.PostTestSummary.k34',
        descriptionEn: 'Complete our APD checklist for additional behavioral indicators.',
        descriptionAr: 'auto.PostTestSummary.k35',
        actionEn: 'View Checklist',
        actionAr: 'auto.PostTestSummary.k36',
        actionPath: '#checklist',
        icon: '✅',
        priority: 'low',
      },
    ],
    clinician: [
      {
        titleEn: 'Review Detailed Metrics',
        titleAr: 'auto.PostTestSummary.k37',
        descriptionEn: 'Access granular performance data for clinical interpretation.',
        descriptionAr: 'auto.PostTestSummary.k38',
        actionEn: 'View Metrics',
        actionAr: 'auto.PostTestSummary.k39',
        actionPath: '/clinician-dashboard',
        icon: '📊',
        priority: 'medium',
      },
      {
        titleEn: 'Compare with Norms',
        titleAr: 'auto.PostTestSummary.k40',
        descriptionEn: 'Results fall within variable range - consider context factors.',
        descriptionAr: 'auto.PostTestSummary.k41',
        actionEn: 'View Normative Data',
        actionAr: 'auto.PostTestSummary.k42',
        actionPath: '/science#norms',
        icon: '📐',
        priority: 'low',
      },
    ],
  },
  high: {
    school: [
      {
        titleEn: 'Great Results!',
        titleAr: 'auto.PostTestSummary.k43',
        descriptionEn: 'This student shows strong auditory processing abilities.',
        descriptionAr: 'auto.PostTestSummary.k44',
        actionEn: 'Continue Screening',
        actionAr: 'auto.PostTestSummary.k45',
        actionPath: '#games',
        icon: '⭐',
        priority: 'low',
      },
    ],
    parent: [
      {
        titleEn: 'Excellent Performance',
        titleAr: 'auto.PostTestSummary.k46',
        descriptionEn: 'Your child demonstrated strong auditory processing skills in this test.',
        descriptionAr: 'auto.PostTestSummary.k47',
        actionEn: 'Try Other Tests',
        actionAr: 'auto.PostTestSummary.k48',
        actionPath: '#games',
        icon: '🎉',
        priority: 'low',
      },
    ],
    clinician: [
      {
        titleEn: 'Within Normal Limits',
        titleAr: 'auto.PostTestSummary.k49',
        descriptionEn: 'Results indicate typical auditory processing abilities for this measure.',
        descriptionAr: 'auto.PostTestSummary.k50',
        actionEn: 'Document Results',
        actionAr: 'auto.PostTestSummary.k51',
        actionPath: '/clinician-dashboard',
        icon: '✓',
        priority: 'low',
      },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const PostTestSummary = memo(function PostTestSummary({
  outcome,
  onClose,
  onRetry,
}: PostTestSummaryProps) {
  const { mode, config } = useVisitorMode();
  const { isArabic, t } = useLanguage();

  const meta = resultMeta[outcome.result];
  const recommendations = RECOMMENDATIONS[outcome.result][mode] || [];

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high': return brandPink;
      case 'medium': return brandPurple;
      default: return brandCyan;
    }
  }, []);

  const css = useMemo(() => `
    .summary-enter {
      animation: summarySlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes summarySlideIn {
      from { opacity: 0; transform: translateY(30px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .recommendation-card {
      transition: all 0.3s ease;
    }
    .recommendation-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.3) !important;
    }
    .action-btn:hover {
      transform: scale(1.02);
    }
    @keyframes resultPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes confetti {
      0% { transform: translateY(0) rotate(0); opacity: 1; }
      100% { transform: translateY(-50px) rotate(180deg); opacity: 0; }
    }
  `, []);

  return (
    <>
      <style>{css}</style>
      <div
        className="summary-enter"
        style={{
          padding: spacing[5],
          background: colors.surface.overlay,
          borderRadius: radius['2xl'],
          border: `1px solid ${meta.color}30`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${meta.color}10`,
          direction: isArabic ? 'rtl' : 'ltr',
        }}
      >
        {/* Result Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: spacing[5],
          paddingBottom: spacing[5],
          borderBottom: `1px solid ${colors.border.subtle}`,
        }}>
          {/* Result indicator */}
          <div style={{
            width: 80,
            height: 80,
            margin: '0 auto',
            borderRadius: '50%',
            background: `${meta.color}20`,
            border: `3px solid ${meta.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            animation: outcome.result === 'high' ? 'resultPulse 2s ease-in-out infinite' : undefined,
            boxShadow: `0 0 30px ${meta.color}40`,
          }}>
            {outcome.result === 'high'
              ? renderLabIcon('\u2B50', { size: 28, tone: 'warning' })
              : outcome.result === 'medium'
                ? renderLabIcon('\u25D0', { size: 28, tone: 'cyan' })
                : renderLabIcon('\u25CB', { size: 28, tone: 'muted' })}
          </div>

          {/* Confetti for high results */}
          {outcome.result === 'high' && (
            <div style={{ position: 'relative', height: 0 }}>
              {['🎉', '⭐', '✨', '🎊'].map((emoji, i) => (
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    top: -40,
                    left: `${25 + i * 20}%`,
                    fontSize: 24,
                    animation: `confetti 1.5s ease-out ${i * 0.2}s`,
                    animationIterationCount: 1,
                    opacity: 0,
                  }}
                >
                  {renderLabIcon(emoji, { size: 22, tone: 'pink' })}
                </span>
              ))}
            </div>
          )}

          <h2 style={{
            margin: `${spacing[4]}px 0 ${spacing[2]}px`,
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.black,
            color: meta.color,
          }}>
            {outcome.title}
          </h2>

          <div style={{
            fontSize: typography.size.lg,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
            marginBottom: spacing[2],
          }}>
            {meta.label}
          </div>

          <p style={{
            margin: 0,
            fontSize: typography.size.base,
            color: colors.text.secondary,
            lineHeight: typography.lineHeight.relaxed,
          }}>
            {outcome.message}
          </p>
        </div>

        {/* Score Display */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: spacing[3],
          marginBottom: spacing[5],
        }}>
          <div style={{
            padding: spacing[4],
            background: `${meta.color}10`,
            borderRadius: radius.xl,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: typography.size.xs,
              color: colors.text.muted,
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: spacing[1],
            }}>
              {t('auto.PostTestSummary.k1', "SCORE")}
            </div>
            <div style={{
              fontSize: typography.size['3xl'],
              fontWeight: typography.weight.black,
              color: meta.color,
            }}>
              {outcome.scoreLabel}
            </div>
          </div>

          {outcome.metrics?.gamePoints !== undefined && (
            <div style={{
              padding: spacing[4],
              background: `${brandCyan}10`,
              borderRadius: radius.xl,
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: typography.size.xs,
                color: colors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: spacing[1],
              }}>
                {t('auto.PostTestSummary.k2', "POINTS EARNED")}
              </div>
              <div style={{
                fontSize: typography.size['3xl'],
                fontWeight: typography.weight.black,
                color: brandCyan,
              }}>
                +{outcome.metrics.gamePoints}
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div style={{ marginBottom: spacing[5] }}>
            <h3 style={{
              margin: `0 0 ${spacing[3]}px`,
              fontSize: typography.size.sm,
              fontWeight: typography.weight.black,
              color: config.color,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[1] }}>
                {renderLabIcon('\U0001F4CC', { size: 16, tone: 'cyan' })}
                <span>{isArabic ? `توصيات لـ${config.labelAr}` : `RECOMMENDATIONS FOR ${config.label.toUpperCase()}`}</span>
              </span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
              {recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="recommendation-card"
                  style={{
                    padding: spacing[4],
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${getPriorityColor(rec.priority)}30`,
                    borderRadius: radius.xl,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[4],
                    boxShadow: shadows.md,
                  }}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: radius.lg,
                    background: `${getPriorityColor(rec.priority)}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    flexShrink: 0,
                  }}>
                    {renderLabIcon(rec.icon, { size: 24, style: { color: getPriorityColor(rec.priority) } })}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[2],
                      marginBottom: spacing[1],
                    }}>
                      <span style={{
                        fontSize: typography.size.sm,
                        fontWeight: typography.weight.bold,
                        color: colors.text.primary,
                      }}>
                        {isArabic ? t(rec.titleAr, rec.titleEn) : rec.titleEn}
                      </span>
                      {rec.priority === 'high' && (
                        <span style={{
                          padding: `${spacing[0.5]}px ${spacing[2]}px`,
                          background: `${brandPink}20`,
                          borderRadius: radius.sm,
                          fontSize: typography.size.xs,
                          fontWeight: typography.weight.bold,
                          color: brandPink,
                        }}>
                          {t('auto.PostTestSummary.k3', "RECOMMENDED")}
                        </span>
                      )}
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: typography.size.sm,
                      color: colors.text.secondary,
                      lineHeight: typography.lineHeight.relaxed,
                    }}>
                      {isArabic ? t(rec.descriptionAr, rec.descriptionEn) : rec.descriptionEn}
                    </p>
                  </div>

                  <Link
                    to={rec.actionPath}
                    className="action-btn"
                    style={{
                      padding: `${spacing[2]}px ${spacing[4]}px`,
                      background: `${getPriorityColor(rec.priority)}15`,
                      border: `1px solid ${getPriorityColor(rec.priority)}40`,
                      borderRadius: radius.lg,
                      fontSize: typography.size.xs,
                      fontWeight: typography.weight.bold,
                      color: getPriorityColor(rec.priority),
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      transition: transitions.fast,
                    }}
                  >
                    {isArabic ? t(rec.actionAr, rec.actionEn) : rec.actionEn}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          padding: spacing[3],
          background: 'rgba(255,255,255,0.02)',
          borderRadius: radius.lg,
          marginBottom: spacing[5],
        }}>
          <p style={{
            margin: 0,
            fontSize: typography.size.xs,
            color: colors.text.muted,
            textAlign: 'center',
            lineHeight: typography.lineHeight.relaxed,
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[1] }}>
              {renderLabIcon('\u2695', { size: 16, tone: 'muted' })}
              <span>{t('auto.PostTestSummary.k4', "These are non-diagnostic screening results. Consult a specialist for complete clinical evaluation.")}</span>
            </span>
          </p>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: spacing[3],
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={onRetry}
            style={{
              padding: `${spacing[3]}px ${spacing[5]}px`,
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.lg,
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
              color: colors.text.secondary,
              cursor: 'pointer',
              transition: transitions.fast,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            {renderLabIcon('\U0001F504', { size: 16, tone: 'cyan' })} {t('auto.PostTestSummary.k5', "Retry Test")}
          </button>

          <button
            onClick={onClose}
            style={{
              padding: `${spacing[3]}px ${spacing[6]}px`,
              background: `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)`,
              border: 'none',
              borderRadius: radius.lg,
              fontSize: typography.size.sm,
              fontWeight: typography.weight.black,
              color: colors.text.primary,
              cursor: 'pointer',
              transition: transitions.bounce,
              boxShadow: `0 4px 20px ${meta.color}30`,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            {renderLabIcon('\u2713', { size: 16, style: { color: colors.text.primary } })} {t('auto.PostTestSummary.k6', "Done")}
          </button>
        </div>
      </div>
    </>
  );
});

export default PostTestSummary;
