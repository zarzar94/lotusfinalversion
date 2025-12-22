/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - Feedback System
 * Comprehensive feedback collection for sessions, assessments, and overall experience
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  brand,
  gradients,
  shadows,
  spacing,
  radius,
  typography,
  transitions,
  cards,
  buttons,
  forms,
} from '../styles';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type FeedbackType = 'session' | 'assessment' | 'treatment' | 'general';

interface FeedbackCategory {
  id: string;
  label: string;
  labelAr: string;
  icon: string;
  description: string;
  descriptionAr: string;
}

interface FeedbackData {
  type: FeedbackType;
  overallRating: number;
  categoryRatings: Record<string, number>;
  wouldRecommend: boolean | null;
  improvements: string[];
  comments: string;
  followUpConsent: boolean;
  timestamp: number;
}

interface FeedbackSystemProps {
  type?: FeedbackType;
  sessionId?: string;
  patientName?: string;
  onSubmit?: (feedback: FeedbackData) => void;
  onClose?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const feedbackCategories: Record<FeedbackType, FeedbackCategory[]> = {
  session: [
    { id: 'comfort', label: 'Comfort Level', labelAr: 'مستوى الراحة', icon: '🛋️', description: 'Physical and auditory comfort during session', descriptionAr: 'الراحة الجسدية والسمعية أثناء الجلسة' },
    { id: 'clarity', label: 'Audio Clarity', labelAr: 'وضوح الصوت', icon: '🔊', description: 'How clear was the audio quality', descriptionAr: 'مدى وضوح جودة الصوت' },
    { id: 'duration', label: 'Session Duration', labelAr: 'مدة الجلسة', icon: '⏱️', description: 'Was the session length appropriate', descriptionAr: 'هل كانت مدة الجلسة مناسبة' },
    { id: 'support', label: 'Clinician Support', labelAr: 'دعم المعالج', icon: '👩‍⚕️', description: 'Support received from the clinician', descriptionAr: 'الدعم المقدم من المعالج' },
  ],
  assessment: [
    { id: 'instructions', label: 'Instructions Clarity', labelAr: 'وضوح التعليمات', icon: '📋', description: 'Were the test instructions clear', descriptionAr: 'هل كانت تعليمات الاختبار واضحة' },
    { id: 'difficulty', label: 'Difficulty Level', labelAr: 'مستوى الصعوبة', icon: '📊', description: 'Was the difficulty level appropriate', descriptionAr: 'هل كان مستوى الصعوبة مناسباً' },
    { id: 'pacing', label: 'Test Pacing', labelAr: 'سرعة الاختبار', icon: '🏃', description: 'Was the test paced well', descriptionAr: 'هل كانت سرعة الاختبار مناسبة' },
    { id: 'engagement', label: 'Engagement', labelAr: 'التفاعل', icon: '🎮', description: 'How engaging was the experience', descriptionAr: 'مدى تفاعلية التجربة' },
  ],
  treatment: [
    { id: 'progress', label: 'Perceived Progress', labelAr: 'التقدم المحسوس', icon: '📈', description: 'Do you notice improvement', descriptionAr: 'هل تلاحظ تحسناً' },
    { id: 'scheduling', label: 'Schedule Flexibility', labelAr: 'مرونة الجدولة', icon: '📅', description: 'How convenient is the scheduling', descriptionAr: 'مدى ملاءمة الجدولة' },
    { id: 'communication', label: 'Communication', labelAr: 'التواصل', icon: '💬', description: 'Quality of communication with staff', descriptionAr: 'جودة التواصل مع الموظفين' },
    { id: 'value', label: 'Value for Investment', labelAr: 'قيمة الاستثمار', icon: '💎', description: 'Is the treatment worth the investment', descriptionAr: 'هل العلاج يستحق الاستثمار' },
  ],
  general: [
    { id: 'facility', label: 'Facility', labelAr: 'المرفق', icon: '🏥', description: 'Quality of the facility and environment', descriptionAr: 'جودة المرفق والبيئة' },
    { id: 'staff', label: 'Staff Professionalism', labelAr: 'احترافية الموظفين', icon: '👥', description: 'How professional was the staff', descriptionAr: 'مدى احترافية الموظفين' },
    { id: 'technology', label: 'Technology & Equipment', labelAr: 'التكنولوجيا والمعدات', icon: '🎧', description: 'Quality of technology used', descriptionAr: 'جودة التكنولوجيا المستخدمة' },
    { id: 'overall', label: 'Overall Experience', labelAr: 'التجربة العامة', icon: '⭐', description: 'Your overall experience', descriptionAr: 'تجربتك العامة' },
  ],
};

const improvementSuggestions = [
  { id: 'more_breaks', label: 'More breaks', labelAr: 'استراحات أكثر' },
  { id: 'shorter_sessions', label: 'Shorter sessions', labelAr: 'جلسات أقصر' },
  { id: 'longer_sessions', label: 'Longer sessions', labelAr: 'جلسات أطول' },
  { id: 'more_variety', label: 'More variety in content', labelAr: 'تنوع أكثر في المحتوى' },
  { id: 'clearer_instructions', label: 'Clearer instructions', labelAr: 'تعليمات أوضح' },
  { id: 'more_feedback', label: 'More feedback during sessions', labelAr: 'ملاحظات أكثر أثناء الجلسات' },
  { id: 'progress_reports', label: 'More detailed progress reports', labelAr: 'تقارير تقدم أكثر تفصيلاً' },
  { id: 'flexible_scheduling', label: 'More flexible scheduling', labelAr: 'جدولة أكثر مرونة' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    background: gradients.panel,
    borderRadius: radius.xl,
    border: `1px solid ${brand.cyan}30`,
    padding: spacing[6],
    maxWidth: '700px',
    margin: '0 auto',
  } as React.CSSProperties,

  header: {
    textAlign: 'center' as const,
    marginBottom: spacing[6],
  } as React.CSSProperties,

  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    background: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: spacing[2],
  } as React.CSSProperties,

  subtitle: {
    fontSize: typography.size.sm,
    color: '#888',
  } as React.CSSProperties,

  section: {
    marginBottom: spacing[6],
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: '#fff',
    marginBottom: spacing[4],
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  } as React.CSSProperties,

  overallRating: {
    display: 'flex',
    justifyContent: 'center',
    gap: spacing[3],
    marginBottom: spacing[6],
  } as React.CSSProperties,

  starButton: {
    fontSize: '2.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: transitions.fast,
    padding: spacing[1],
  } as React.CSSProperties,

  ratingLabel: {
    textAlign: 'center' as const,
    color: '#888',
    fontSize: typography.size.sm,
    marginTop: spacing[2],
  } as React.CSSProperties,

  categoriesGrid: {
    display: 'grid',
    gap: spacing[4],
  } as React.CSSProperties,

  categoryCard: {
    ...cards.glass,
    padding: spacing[4],
  } as React.CSSProperties,

  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[3],
  } as React.CSSProperties,

  categoryIcon: {
    fontSize: '1.5rem',
  } as React.CSSProperties,

  categoryInfo: {
    flex: 1,
  } as React.CSSProperties,

  categoryLabel: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: '#fff',
    marginBottom: spacing[1],
  } as React.CSSProperties,

  categoryDescription: {
    fontSize: typography.size.xs,
    color: '#888',
  } as React.CSSProperties,

  ratingSlider: {
    width: '100%',
    height: '8px',
    borderRadius: radius.full,
    appearance: 'none' as const,
    background: '#333',
    cursor: 'pointer',
    marginTop: spacing[2],
  } as React.CSSProperties,

  sliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: spacing[1],
    fontSize: typography.size.xs,
    color: '#666',
  } as React.CSSProperties,

  recommendSection: {
    ...cards.glass,
    padding: spacing[5],
    textAlign: 'center' as const,
    marginBottom: spacing[6],
  } as React.CSSProperties,

  recommendQuestion: {
    fontSize: typography.size.lg,
    color: '#fff',
    marginBottom: spacing[4],
  } as React.CSSProperties,

  recommendButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: spacing[4],
  } as React.CSSProperties,

  recommendButton: {
    padding: `${spacing[3]} ${spacing[6]}`,
    borderRadius: radius.full,
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    cursor: 'pointer',
    transition: transitions.fast,
    border: '2px solid transparent',
  } as React.CSSProperties,

  recommendYes: {
    background: `${brand.cyan}20`,
    color: brand.cyan,
    border: `2px solid ${brand.cyan}40`,
  } as React.CSSProperties,

  recommendYesActive: {
    background: brand.cyan,
    color: brand.ink,
    border: `2px solid ${brand.cyan}`,
  } as React.CSSProperties,

  recommendNo: {
    background: `${brand.pink}20`,
    color: brand.pink,
    border: `2px solid ${brand.pink}40`,
  } as React.CSSProperties,

  recommendNoActive: {
    background: brand.pink,
    color: '#fff',
    border: `2px solid ${brand.pink}`,
  } as React.CSSProperties,

  improvementsGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: spacing[2],
    marginBottom: spacing[6],
  } as React.CSSProperties,

  improvementChip: {
    padding: `${spacing[2]} ${spacing[3]}`,
    borderRadius: radius.full,
    fontSize: typography.size.sm,
    cursor: 'pointer',
    transition: transitions.fast,
    border: '1px solid #333',
    background: 'transparent',
    color: '#888',
  } as React.CSSProperties,

  improvementChipActive: {
    background: `${brand.purple}20`,
    color: brand.purple,
    border: `1px solid ${brand.purple}`,
  } as React.CSSProperties,

  commentsSection: {
    marginBottom: spacing[6],
  } as React.CSSProperties,

  textarea: {
    ...forms.textarea,
    width: '100%',
    minHeight: '120px',
    resize: 'vertical' as const,
  } as React.CSSProperties,

  consentSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing[3],
    padding: spacing[4],
    background: `${brand.panel}`,
    borderRadius: radius.lg,
    marginBottom: spacing[6],
  } as React.CSSProperties,

  consentCheckbox: {
    width: '24px',
    height: '24px',
    borderRadius: radius.sm,
    border: `2px solid #444`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    marginTop: '2px',
  } as React.CSSProperties,

  consentCheckboxActive: {
    background: brand.cyan,
    borderColor: brand.cyan,
    color: brand.ink,
  } as React.CSSProperties,

  consentText: {
    fontSize: typography.size.sm,
    color: '#888',
    lineHeight: 1.5,
  } as React.CSSProperties,

  actions: {
    display: 'flex',
    gap: spacing[4],
    justifyContent: 'flex-end',
  } as React.CSSProperties,

  cancelButton: {
    ...buttons.ghost,
    padding: `${spacing[3]} ${spacing[6]}`,
  } as React.CSSProperties,

  submitButton: {
    ...buttons.primary,
    padding: `${spacing[3]} ${spacing[8]}`,
    background: gradients.cyanPurple,
  } as React.CSSProperties,

  thankYou: {
    textAlign: 'center' as const,
    padding: spacing[8],
  } as React.CSSProperties,

  thankYouIcon: {
    fontSize: '4rem',
    marginBottom: spacing[4],
  } as React.CSSProperties,

  thankYouTitle: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: brand.cyan,
    marginBottom: spacing[2],
  } as React.CSSProperties,

  thankYouText: {
    color: '#888',
    marginBottom: spacing[6],
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const FeedbackSystem: React.FC<FeedbackSystemProps> = ({
  type = 'general',
  sessionId,
  patientName,
  onSubmit,
  onClose,
}) => {
  const { isArabic } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [overallRating, setOverallRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>({});
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [followUpConsent, setFollowUpConsent] = useState(false);

  const categories = feedbackCategories[type];

  const ratingLabels = useMemo(() => [
    isArabic ? 'سيء جداً' : 'Very Poor',
    isArabic ? 'سيء' : 'Poor',
    isArabic ? 'متوسط' : 'Average',
    isArabic ? 'جيد' : 'Good',
    isArabic ? 'ممتاز' : 'Excellent',
  ], [isArabic]);

  const handleCategoryRating = useCallback((categoryId: string, value: number) => {
    setCategoryRatings(prev => ({ ...prev, [categoryId]: value }));
  }, []);

  const toggleImprovement = useCallback((id: string) => {
    setSelectedImprovements(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const handleSubmit = useCallback(() => {
    const feedback: FeedbackData = {
      type,
      overallRating,
      categoryRatings,
      wouldRecommend,
      improvements: selectedImprovements,
      comments,
      followUpConsent,
      timestamp: Date.now(),
    };
    onSubmit?.(feedback);
    setSubmitted(true);
  }, [type, overallRating, categoryRatings, wouldRecommend, selectedImprovements, comments, followUpConsent, onSubmit]);

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.thankYou}>
          <div style={styles.thankYouIcon}>💜</div>
          <h2 style={styles.thankYouTitle}>
            {isArabic ? 'شكراً لملاحظاتك!' : 'Thank You for Your Feedback!'}
          </h2>
          <p style={styles.thankYouText}>
            {isArabic
              ? 'نقدر وقتك في مشاركة تجربتك. ملاحظاتك تساعدنا على التحسين.'
              : 'We appreciate you taking the time to share your experience. Your feedback helps us improve.'}
          </p>
          <button style={styles.submitButton} onClick={onClose}>
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          💭 {isArabic ? 'شاركنا رأيك' : 'Share Your Feedback'}
        </h2>
        <p style={styles.subtitle}>
          {isArabic
            ? 'ملاحظاتك تساعدنا على تحسين خدماتنا'
            : 'Your feedback helps us improve our services'}
        </p>
      </div>

      {/* Overall Rating */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          ⭐ {isArabic ? 'التقييم العام' : 'Overall Rating'}
        </h3>
        <div style={styles.overallRating}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              style={{
                ...styles.starButton,
                color: star <= overallRating ? '#FFD700' : '#444',
                transform: star <= overallRating ? 'scale(1.1)' : 'scale(1)',
              }}
              onClick={() => setOverallRating(star)}
            >
              ★
            </button>
          ))}
        </div>
        <p style={styles.ratingLabel}>
          {overallRating > 0 ? ratingLabels[overallRating - 1] : (isArabic ? 'اختر تقييمك' : 'Select your rating')}
        </p>
      </div>

      {/* Category Ratings */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          📊 {isArabic ? 'تقييمات تفصيلية' : 'Detailed Ratings'}
        </h3>
        <div style={styles.categoriesGrid}>
          {categories.map(category => (
            <div key={category.id} style={styles.categoryCard}>
              <div style={styles.categoryHeader}>
                <span style={styles.categoryIcon}>{category.icon}</span>
                <div style={styles.categoryInfo}>
                  <div style={styles.categoryLabel}>
                    {isArabic ? category.labelAr : category.label}
                  </div>
                  <div style={styles.categoryDescription}>
                    {isArabic ? category.descriptionAr : category.description}
                  </div>
                </div>
                <span style={{ color: brand.cyan, fontWeight: 'bold' }}>
                  {categoryRatings[category.id] || 0}/5
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={categoryRatings[category.id] || 0}
                onChange={e => handleCategoryRating(category.id, parseInt(e.target.value))}
                style={{
                  ...styles.ratingSlider,
                  accentColor: brand.cyan,
                }}
              />
              <div style={styles.sliderLabels}>
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Would Recommend */}
      <div style={styles.recommendSection}>
        <p style={styles.recommendQuestion}>
          {isArabic
            ? 'هل توصي بـ Lotus Sound Lab لصديق أو أحد أفراد العائلة؟'
            : 'Would you recommend Lotus Sound Lab to a friend or family member?'}
        </p>
        <div style={styles.recommendButtons}>
          <button
            style={{
              ...styles.recommendButton,
              ...(wouldRecommend === true ? styles.recommendYesActive : styles.recommendYes),
            }}
            onClick={() => setWouldRecommend(true)}
          >
            👍 {isArabic ? 'نعم، بالتأكيد' : 'Yes, definitely'}
          </button>
          <button
            style={{
              ...styles.recommendButton,
              ...(wouldRecommend === false ? styles.recommendNoActive : styles.recommendNo),
            }}
            onClick={() => setWouldRecommend(false)}
          >
            👎 {isArabic ? 'ليس بعد' : 'Not yet'}
          </button>
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          💡 {isArabic ? 'ما الذي يمكننا تحسينه؟' : 'What can we improve?'}
        </h3>
        <div style={styles.improvementsGrid}>
          {improvementSuggestions.map(item => (
            <button
              key={item.id}
              style={{
                ...styles.improvementChip,
                ...(selectedImprovements.includes(item.id) ? styles.improvementChipActive : {}),
              }}
              onClick={() => toggleImprovement(item.id)}
            >
              {isArabic ? item.labelAr : item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div style={styles.commentsSection}>
        <h3 style={styles.sectionTitle}>
          ✍️ {isArabic ? 'تعليقات إضافية' : 'Additional Comments'}
        </h3>
        <textarea
          style={styles.textarea}
          value={comments}
          onChange={e => setComments(e.target.value)}
          placeholder={isArabic
            ? 'شاركنا أي ملاحظات أو اقتراحات أخرى...'
            : 'Share any other feedback or suggestions...'}
        />
      </div>

      {/* Follow-up Consent */}
      <div
        style={styles.consentSection}
        onClick={() => setFollowUpConsent(!followUpConsent)}
      >
        <div
          style={{
            ...styles.consentCheckbox,
            ...(followUpConsent ? styles.consentCheckboxActive : {}),
          }}
        >
          {followUpConsent ? '✓' : ''}
        </div>
        <p style={styles.consentText}>
          {isArabic
            ? 'أوافق على أن يتصل بي فريق Lotus Sound Lab لمناقشة ملاحظاتي ومعرفة المزيد عن تجربتي.'
            : 'I agree to be contacted by the Lotus Sound Lab team to discuss my feedback and learn more about my experience.'}
        </p>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        {onClose && (
          <button style={styles.cancelButton} onClick={onClose}>
            {isArabic ? 'إلغاء' : 'Cancel'}
          </button>
        )}
        <button
          style={{
            ...styles.submitButton,
            opacity: overallRating > 0 ? 1 : 0.5,
          }}
          onClick={handleSubmit}
          disabled={overallRating === 0}
        >
          {isArabic ? '📤 إرسال الملاحظات' : '📤 Submit Feedback'}
        </button>
      </div>
    </div>
  );
};

export default FeedbackSystem;
