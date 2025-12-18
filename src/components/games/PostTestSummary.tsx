/**
 * PostTestSummary - Results summary with visitor-mode-specific recommendations
 * Displays test outcomes and next steps based on user type
 */

import { memo, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useVisitorMode } from '../../context/VisitorModeContext';
import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPink, brandPurple, colors, radius, spacing, typography, transitions, shadows } from '../styles';
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
        titleAr: 'جدولة تقييم فردي',
        descriptionEn: 'This student may benefit from a comprehensive auditory processing evaluation.',
        descriptionAr: 'قد يستفيد هذا الطالب من تقييم شامل للمعالجة السمعية.',
        actionEn: 'Request Evaluation',
        actionAr: 'طلب تقييم',
        actionPath: '/contact?mode=school&type=evaluation',
        icon: '📋',
        priority: 'high',
      },
      {
        titleEn: 'Classroom Accommodations',
        titleAr: 'تعديلات الفصل الدراسي',
        descriptionEn: 'Consider preferential seating and reduced background noise during instruction.',
        descriptionAr: 'فكر في الجلوس المفضل وتقليل الضوضاء أثناء التدريس.',
        actionEn: 'View Accommodations Guide',
        actionAr: 'عرض دليل التعديلات',
        actionPath: '/resources#accommodations',
        icon: '🏫',
        priority: 'medium',
      },
    ],
    parent: [
      {
        titleEn: 'Book Professional Screening',
        titleAr: 'احجز فحصاً مهنياً',
        descriptionEn: 'These results suggest your child may benefit from a professional auditory processing evaluation.',
        descriptionAr: 'تشير هذه النتائج إلى أن طفلك قد يستفيد من تقييم مهني للمعالجة السمعية.',
        actionEn: 'Book Screening',
        actionAr: 'احجز فحصاً',
        actionPath: '/contact?mode=parent',
        icon: '📅',
        priority: 'high',
      },
      {
        titleEn: 'Learn About Bérard AIT',
        titleAr: 'تعرف على Bérard AIT',
        descriptionEn: 'Auditory Integration Training may help improve auditory processing abilities.',
        descriptionAr: 'تدريب التكامل السمعي قد يساعد في تحسين قدرات المعالجة السمعية.',
        actionEn: 'View Program Details',
        actionAr: 'عرض تفاصيل البرنامج',
        actionPath: '/program',
        icon: '🎧',
        priority: 'medium',
      },
    ],
    clinician: [
      {
        titleEn: 'Access Clinical Protocol',
        titleAr: 'الوصول للبروتوكول السريري',
        descriptionEn: 'Results indicate potential auditory processing concerns warranting clinical evaluation.',
        descriptionAr: 'تشير النتائج إلى مخاوف محتملة في المعالجة السمعية تستدعي تقييماً سريرياً.',
        actionEn: 'View Protocol',
        actionAr: 'عرض البروتوكول',
        actionPath: '/clinician-dashboard',
        icon: '📊',
        priority: 'high',
      },
      {
        titleEn: 'Export Data for Records',
        titleAr: 'تصدير البيانات للسجلات',
        descriptionEn: 'Download raw data and detailed metrics for clinical documentation.',
        descriptionAr: 'تحميل البيانات الخام والمقاييس التفصيلية للتوثيق السريري.',
        actionEn: 'Export Data',
        actionAr: 'تصدير البيانات',
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
        titleAr: 'متابعة التقدم',
        descriptionEn: 'Consider periodic re-screening to track changes over time.',
        descriptionAr: 'فكر في إعادة الفحص الدوري لتتبع التغييرات مع الوقت.',
        actionEn: 'Schedule Follow-up',
        actionAr: 'جدولة متابعة',
        actionPath: '/contact?mode=school&type=followup',
        icon: '📈',
        priority: 'medium',
      },
      {
        titleEn: 'Explore School Partnership',
        titleAr: 'استكشف الشراكة المدرسية',
        descriptionEn: 'Learn how our school screening program can benefit your students.',
        descriptionAr: 'تعرف على كيف يمكن لبرنامج الفحص المدرسي أن يفيد طلابك.',
        actionEn: 'View Partnership Details',
        actionAr: 'عرض تفاصيل الشراكة',
        actionPath: '/contact?mode=school',
        icon: '🤝',
        priority: 'low',
      },
    ],
    parent: [
      {
        titleEn: 'Complete Full Assessment',
        titleAr: 'أكمل التقييم الكامل',
        descriptionEn: 'Try the complete screening suite for a more comprehensive picture.',
        descriptionAr: 'جرب مجموعة الفحص الكاملة للحصول على صورة أشمل.',
        actionEn: 'Start Full Suite',
        actionAr: 'ابدأ المجموعة الكاملة',
        actionPath: '#games',
        icon: '🧪',
        priority: 'medium',
      },
      {
        titleEn: 'Review Checklist',
        titleAr: 'راجع قائمة التحقق',
        descriptionEn: 'Complete our APD checklist for additional behavioral indicators.',
        descriptionAr: 'أكمل قائمة التحقق من APD للحصول على مؤشرات سلوكية إضافية.',
        actionEn: 'View Checklist',
        actionAr: 'عرض القائمة',
        actionPath: '#checklist',
        icon: '✅',
        priority: 'low',
      },
    ],
    clinician: [
      {
        titleEn: 'Review Detailed Metrics',
        titleAr: 'مراجعة المقاييس التفصيلية',
        descriptionEn: 'Access granular performance data for clinical interpretation.',
        descriptionAr: 'الوصول إلى بيانات الأداء الدقيقة للتفسير السريري.',
        actionEn: 'View Metrics',
        actionAr: 'عرض المقاييس',
        actionPath: '/clinician-dashboard',
        icon: '📊',
        priority: 'medium',
      },
      {
        titleEn: 'Compare with Norms',
        titleAr: 'المقارنة مع المعايير',
        descriptionEn: 'Results fall within variable range - consider context factors.',
        descriptionAr: 'النتائج تقع ضمن النطاق المتغير - ضع في الاعتبار عوامل السياق.',
        actionEn: 'View Normative Data',
        actionAr: 'عرض البيانات المعيارية',
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
        titleAr: 'نتائج رائعة!',
        descriptionEn: 'This student shows strong auditory processing abilities.',
        descriptionAr: 'يُظهر هذا الطالب قدرات قوية في المعالجة السمعية.',
        actionEn: 'Continue Screening',
        actionAr: 'متابعة الفحص',
        actionPath: '#games',
        icon: '⭐',
        priority: 'low',
      },
    ],
    parent: [
      {
        titleEn: 'Excellent Performance',
        titleAr: 'أداء ممتاز',
        descriptionEn: 'Your child demonstrated strong auditory processing skills in this test.',
        descriptionAr: 'أظهر طفلك مهارات قوية في المعالجة السمعية في هذا الاختبار.',
        actionEn: 'Try Other Tests',
        actionAr: 'جرب اختبارات أخرى',
        actionPath: '#games',
        icon: '🎉',
        priority: 'low',
      },
    ],
    clinician: [
      {
        titleEn: 'Within Normal Limits',
        titleAr: 'ضمن الحدود الطبيعية',
        descriptionEn: 'Results indicate typical auditory processing abilities for this measure.',
        descriptionAr: 'تشير النتائج إلى قدرات معالجة سمعية نموذجية لهذا المقياس.',
        actionEn: 'Document Results',
        actionAr: 'توثيق النتائج',
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
  const { isArabic } = useLanguage();

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
            {outcome.result === 'high' ? '⭐' : outcome.result === 'medium' ? '◐' : '○'}
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
                  {emoji}
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
              {isArabic ? 'النتيجة' : 'SCORE'}
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
                {isArabic ? 'النقاط المكتسبة' : 'POINTS EARNED'}
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
              {isArabic ? `📌 توصيات لـ${config.labelAr}` : `📌 RECOMMENDATIONS FOR ${config.label.toUpperCase()}`}
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
                    {rec.icon}
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
                        {isArabic ? rec.titleAr : rec.titleEn}
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
                          {isArabic ? 'مُوصى به' : 'RECOMMENDED'}
                        </span>
                      )}
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: typography.size.sm,
                      color: colors.text.secondary,
                      lineHeight: typography.lineHeight.relaxed,
                    }}>
                      {isArabic ? rec.descriptionAr : rec.descriptionEn}
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
                    {isArabic ? rec.actionAr : rec.actionEn}
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
            {isArabic
              ? '⚕️ هذه نتائج فحص غير تشخيصية. استشر أخصائياً للتقييم السريري الكامل.'
              : '⚕️ These are non-diagnostic screening results. Consult a specialist for complete clinical evaluation.'}
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
            🔄 {isArabic ? 'أعد الاختبار' : 'Retry Test'}
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
              color: '#fff',
              cursor: 'pointer',
              transition: transitions.bounce,
              boxShadow: `0 4px 20px ${meta.color}30`,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            ✓ {isArabic ? 'تم' : 'Done'}
          </button>
        </div>
      </div>
    </>
  );
});

export default PostTestSummary;
