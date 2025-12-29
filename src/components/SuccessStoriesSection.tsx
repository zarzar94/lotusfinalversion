/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - Success Stories Section
 * Showcase of patient outcomes, testimonials, and case studies
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { renderLabIcon } from './icons/index';
import {
  brand,
  colors,
  gradients,
  shadows,
  spacing,
  radius,
  typography,
  transitions,
  cards,
  buttons,
} from '../styles';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface SuccessStory {
  id: string;
  type: 'video' | 'written' | 'metrics';
  category: 'attention' | 'academic' | 'behavioral' | 'sensory' | 'general';
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  ageRange: string;
  condition: string;
  conditionAr: string;
  outcomes: { label: string; labelAr: string; before: number; after: number }[];
  testimonial?: {
    quote: string;
    quoteAr: string;
    author: string;
    authorAr: string;
    relationship: string;
    relationshipAr: string;
  };
  treatmentDuration: string;
  treatmentDurationAr: string;
  featured: boolean;
  icon: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const successStories: SuccessStory[] = [
  {
    id: '1',
    type: 'metrics',
    category: 'attention',
    title: 'ADHD Focus Improvement',
    titleAr: 'تحسن التركيز - اضطراب فرط الحركة',
    summary: 'Remarkable improvement in sustained attention and classroom behavior after 10-day AIT program.',
    summaryAr: 'تحسن ملحوظ في الانتباه المستمر والسلوك الصفي بعد برنامج AIT لمدة 10 أيام.',
    ageRange: '8-10',
    condition: 'ADHD',
    conditionAr: 'اضطراب فرط الحركة ونقص الانتباه',
    outcomes: [
      { label: 'Sustained Attention', labelAr: 'الانتباه المستمر', before: 35, after: 78 },
      { label: 'Task Completion', labelAr: 'إكمال المهام', before: 40, after: 85 },
      { label: 'Listening Skills', labelAr: 'مهارات الاستماع', before: 30, after: 75 },
    ],
    testimonial: {
      quote: 'My son can now sit through an entire class without getting distracted. His teachers are amazed!',
      quoteAr: 'يمكن لابني الآن الجلوس طوال الحصة دون أن يتشتت انتباهه. معلموه مندهشون!',
      author: 'Parent of Ahmad',
      authorAr: 'والدة أحمد',
      relationship: 'Mother',
      relationshipAr: 'الأم',
    },
    treatmentDuration: '10 days',
    treatmentDurationAr: '10 أيام',
    featured: true,
    icon: '🎯',
  },
  {
    id: '2',
    type: 'written',
    category: 'academic',
    title: 'Reading & Comprehension Gains',
    titleAr: 'تحسن القراءة والفهم',
    summary: 'Significant improvement in reading fluency and comprehension following auditory integration training.',
    summaryAr: 'تحسن كبير في طلاقة القراءة والفهم بعد تدريب التكامل السمعي.',
    ageRange: '7-9',
    condition: 'Reading Difficulties',
    conditionAr: 'صعوبات القراءة',
    outcomes: [
      { label: 'Reading Speed', labelAr: 'سرعة القراءة', before: 45, after: 72 },
      { label: 'Comprehension', labelAr: 'الفهم', before: 50, after: 80 },
      { label: 'Phonemic Awareness', labelAr: 'الوعي الصوتي', before: 40, after: 85 },
    ],
    testimonial: {
      quote: 'She went from struggling to read simple words to reading chapter books in just 3 months after treatment.',
      quoteAr: 'انتقلت من صعوبة قراءة الكلمات البسيطة إلى قراءة كتب الفصول في 3 أشهر فقط بعد العلاج.',
      author: 'Parent of Sara',
      authorAr: 'والد سارة',
      relationship: 'Father',
      relationshipAr: 'الأب',
    },
    treatmentDuration: '10 days + 3 month follow-up',
    treatmentDurationAr: '10 أيام + متابعة 3 أشهر',
    featured: true,
    icon: '📚',
  },
  {
    id: '3',
    type: 'metrics',
    category: 'sensory',
    title: 'Sound Sensitivity Reduction',
    titleAr: 'تقليل الحساسية الصوتية',
    summary: 'Dramatic decrease in sound sensitivity and improved tolerance to everyday noises.',
    summaryAr: 'انخفاض كبير في الحساسية الصوتية وتحسن تحمل الأصوات اليومية.',
    ageRange: '6-8',
    condition: 'Hyperacusis / SPD',
    conditionAr: 'فرط السمع / اضطراب المعالجة الحسية',
    outcomes: [
      { label: 'Noise Tolerance', labelAr: 'تحمل الضوضاء', before: 20, after: 70 },
      { label: 'Social Comfort', labelAr: 'الراحة الاجتماعية', before: 30, after: 75 },
      { label: 'Anxiety Levels', labelAr: 'مستويات القلق', before: 85, after: 35 },
    ],
    testimonial: {
      quote: 'He no longer covers his ears in crowded places. We can finally go to restaurants as a family!',
      quoteAr: 'لم يعد يغطي أذنيه في الأماكن المزدحمة. يمكننا أخيراً الذهاب إلى المطاعم كعائلة!',
      author: 'Parent of Mohammed',
      authorAr: 'والدة محمد',
      relationship: 'Mother',
      relationshipAr: 'الأم',
    },
    treatmentDuration: '10 days',
    treatmentDurationAr: '10 أيام',
    featured: true,
    icon: '🔇',
  },
  {
    id: '4',
    type: 'written',
    category: 'behavioral',
    title: 'Autism Spectrum Communication',
    titleAr: 'التواصل في طيف التوحد',
    summary: 'Improved verbal communication and social interaction in a child on the autism spectrum.',
    summaryAr: 'تحسن التواصل اللفظي والتفاعل الاجتماعي لطفل في طيف التوحد.',
    ageRange: '5-7',
    condition: 'ASD',
    conditionAr: 'اضطراب طيف التوحد',
    outcomes: [
      { label: 'Verbal Communication', labelAr: 'التواصل اللفظي', before: 25, after: 55 },
      { label: 'Eye Contact', labelAr: 'التواصل البصري', before: 20, after: 60 },
      { label: 'Social Engagement', labelAr: 'المشاركة الاجتماعية', before: 30, after: 65 },
    ],
    testimonial: {
      quote: 'He started using more words and even initiated conversations with his siblings for the first time.',
      quoteAr: 'بدأ باستخدام المزيد من الكلمات وحتى بادر بالمحادثات مع إخوته لأول مرة.',
      author: 'Parent of Khalid',
      authorAr: 'والد خالد',
      relationship: 'Father',
      relationshipAr: 'الأب',
    },
    treatmentDuration: '10 days + ongoing therapy',
    treatmentDurationAr: '10 أيام + علاج مستمر',
    featured: false,
    icon: '🗣️',
  },
  {
    id: '5',
    type: 'metrics',
    category: 'general',
    title: 'Overall Processing Speed',
    titleAr: 'سرعة المعالجة العامة',
    summary: 'Comprehensive improvement in auditory processing speed and accuracy across multiple domains.',
    summaryAr: 'تحسن شامل في سرعة ودقة المعالجة السمعية عبر مجالات متعددة.',
    ageRange: '9-11',
    condition: 'APD',
    conditionAr: 'اضطراب المعالجة السمعية',
    outcomes: [
      { label: 'Processing Speed', labelAr: 'سرعة المعالجة', before: 35, after: 70 },
      { label: 'Following Directions', labelAr: 'اتباع التعليمات', before: 40, after: 80 },
      { label: 'Memory Retention', labelAr: 'الاحتفاظ بالذاكرة', before: 45, after: 75 },
    ],
    treatmentDuration: '10 days',
    treatmentDurationAr: '10 أيام',
    featured: false,
    icon: '⚡',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  section: {
    padding: `${spacing[16]} ${spacing[4]}`,
    background: brand.ink,
    position: 'relative' as const,
  } as React.CSSProperties,

  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  } as React.CSSProperties,

  header: {
    textAlign: 'center' as const,
    marginBottom: spacing[10],
  } as React.CSSProperties,

  sectionLabel: {
    fontSize: typography.size.sm,
    color: brand.cyan,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginBottom: spacing[2],
  } as React.CSSProperties,

  title: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    background: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: spacing[3],
  } as React.CSSProperties,

  subtitle: {
    fontSize: typography.size.lg,
    color: colors.text.muted,
    maxWidth: '600px',
    margin: '0 auto',
  } as React.CSSProperties,

  filterTabs: {
    display: 'flex',
    justifyContent: 'center',
    gap: spacing[2],
    marginBottom: spacing[8],
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  filterTab: {
    padding: `${spacing[2]} ${spacing[4]}`,
    borderRadius: radius.full,
    fontSize: typography.size.sm,
    cursor: 'pointer',
    transition: transitions.fast,
    border: '1px solid transparent',
  } as React.CSSProperties,

  filterTabActive: {
    background: `${brand.cyan}20`,
    color: brand.cyan,
    border: `1px solid ${brand.cyan}40`,
  } as React.CSSProperties,

  filterTabInactive: {
    background: 'transparent',
    color: colors.text.disabled,
    border: `1px solid ${colors.border.emphasis}`,
  } as React.CSSProperties,

  storiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: spacing[6],
  } as React.CSSProperties,

  storyCard: {
    ...cards.glass,
    padding: spacing[6],
    position: 'relative' as const,
    overflow: 'hidden',
    transition: transitions.normal,
  } as React.CSSProperties,

  storyCardFeatured: {
    border: `2px solid ${brand.cyan}40`,
    boxShadow: shadows.glow.cyan,
  } as React.CSSProperties,

  featuredBadge: {
    position: 'absolute' as const,
    top: spacing[3],
    right: spacing[3],
    background: gradients.cyanPurple,
    color: colors.text.primary,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: radius.full,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  } as React.CSSProperties,

  storyHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing[3],
    marginBottom: spacing[4],
  } as React.CSSProperties,

  storyIcon: {
    fontSize: '2.5rem',
    lineHeight: 1,
  } as React.CSSProperties,

  storyMeta: {
    flex: 1,
  } as React.CSSProperties,

  storyTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  } as React.CSSProperties,

  storyCondition: {
    fontSize: typography.size.sm,
    color: brand.purple,
    marginBottom: spacing[1],
  } as React.CSSProperties,

  storyAge: {
    fontSize: typography.size.xs,
    color: colors.text.disabled,
  } as React.CSSProperties,

  storySummary: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: 1.6,
    marginBottom: spacing[4],
  } as React.CSSProperties,

  outcomesGrid: {
    display: 'grid',
    gap: spacing[3],
    marginBottom: spacing[4],
  } as React.CSSProperties,

  outcomeItem: {
    background: `${brand.ink}`,
    borderRadius: radius.md,
    padding: spacing[3],
  } as React.CSSProperties,

  outcomeLabel: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    marginBottom: spacing[2],
  } as React.CSSProperties,

  outcomeBar: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  } as React.CSSProperties,

  outcomeBarTrack: {
    flex: 1,
    height: '8px',
    background: colors.surface.input,
    borderRadius: radius.full,
    overflow: 'hidden',
    position: 'relative' as const,
  } as React.CSSProperties,

  outcomeBarBefore: {
    position: 'absolute' as const,
    left: 0,
    top: 0,
    height: '100%',
    background: colors.text.disabled,
    borderRadius: radius.full,
    transition: 'width 1s ease-out',
  } as React.CSSProperties,

  outcomeBarAfter: {
    position: 'absolute' as const,
    left: 0,
    top: 0,
    height: '100%',
    background: gradients.cyanPurple,
    borderRadius: radius.full,
    transition: 'width 1s ease-out 0.5s',
  } as React.CSSProperties,

  outcomeValues: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: typography.size.xs,
    marginTop: spacing[1],
  } as React.CSSProperties,

  outcomeValueBefore: {
    color: colors.text.disabled,
  } as React.CSSProperties,

  outcomeValueAfter: {
    color: brand.cyan,
    fontWeight: typography.weight.bold,
  } as React.CSSProperties,

  testimonialBox: {
    background: `${brand.purple}10`,
    borderRadius: radius.lg,
    padding: spacing[4],
    borderLeft: `3px solid ${brand.purple}`,
    marginTop: spacing[4],
  } as React.CSSProperties,

  testimonialQuote: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 1.6,
    marginBottom: spacing[2],
  } as React.CSSProperties,

  testimonialAuthor: {
    fontSize: typography.size.xs,
    color: brand.purple,
  } as React.CSSProperties,

  storyFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[4],
    paddingTop: spacing[4],
    borderTop: `1px solid ${colors.border.emphasis}`,
  } as React.CSSProperties,

  duration: {
    fontSize: typography.size.xs,
    color: colors.text.disabled,
  } as React.CSSProperties,

  readMore: {
    ...buttons.ghost,
    padding: `${spacing[1]} ${spacing[3]}`,
    fontSize: typography.size.xs,
    borderRadius: radius.full,
  } as React.CSSProperties,

  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: spacing[4],
    marginTop: spacing[12],
    padding: spacing[6],
    background: `${brand.panel}80`,
    borderRadius: radius.xl,
    border: `1px solid ${brand.cyan}20`,
  } as React.CSSProperties,

  statItem: {
    textAlign: 'center' as const,
  } as React.CSSProperties,

  statValue: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    background: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  } as React.CSSProperties,

  statLabel: {
    fontSize: typography.size.sm,
    color: colors.text.muted,
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const SuccessStoriesSection: React.FC = () => {
  const { isArabic } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterCategories = useMemo(() => [
    { id: 'all', label: isArabic ? 'الكل' : 'All' },
    { id: 'attention', label: isArabic ? 'الانتباه' : 'Attention' },
    { id: 'academic', label: isArabic ? 'أكاديمي' : 'Academic' },
    { id: 'behavioral', label: isArabic ? 'سلوكي' : 'Behavioral' },
    { id: 'sensory', label: isArabic ? 'حسي' : 'Sensory' },
  ], [isArabic]);

  const filteredStories = useMemo(() => {
    if (activeFilter === 'all') return successStories;
    return successStories.filter(s => s.category === activeFilter);
  }, [activeFilter]);

  const stats = useMemo(() => [
    { value: '500+', label: isArabic ? 'مريض' : 'Patients Treated' },
    { value: '92%', label: isArabic ? 'نسبة التحسن' : 'Improvement Rate' },
    { value: '15+', label: isArabic ? 'سنة خبرة' : 'Years Experience' },
    { value: '4.9', label: isArabic ? 'تقييم الآباء' : 'Parent Rating' },
  ], [isArabic]);

  const handleFilterClick = useCallback((id: string) => {
    setActiveFilter(id);
  }, []);

  return (
    <section id="success-stories" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <p style={styles.sectionLabel}>
            {isArabic ? 'قصص النجاح' : 'Success Stories'}
          </p>
          <h2 style={styles.title}>
            {isArabic ? 'نتائج حقيقية، تغييرات حقيقية' : 'Real Results, Real Changes'}
          </h2>
          <p style={styles.subtitle}>
            {isArabic
              ? 'اكتشف كيف غيّر علاج Bérard AIT حياة الأطفال والعائلات'
              : 'Discover how Bérard AIT has transformed the lives of children and families'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={styles.filterTabs}>
          {filterCategories.map(cat => (
            <button
              key={cat.id}
              style={{
                ...styles.filterTab,
                ...(activeFilter === cat.id
                  ? styles.filterTabActive
                  : styles.filterTabInactive),
              }}
              onClick={() => handleFilterClick(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div style={styles.storiesGrid}>
          {filteredStories.map(story => (
            <div
              key={story.id}
              style={{
                ...styles.storyCard,
                ...(story.featured ? styles.storyCardFeatured : {}),
              }}
            >
              {story.featured && (
                <span style={styles.featuredBadge}>
                  {isArabic ? '⭐ مميز' : '⭐ Featured'}
                </span>
              )}

              <div style={styles.storyHeader}>
                <span style={styles.storyIcon}>
                  {renderLabIcon(story.icon, { size: 32, tone: 'cyan' })}
                </span>
                <div style={styles.storyMeta}>
                  <h3 style={styles.storyTitle}>
                    {isArabic ? story.titleAr : story.title}
                  </h3>
                  <p style={styles.storyCondition}>
                    {isArabic ? story.conditionAr : story.condition}
                  </p>
                  <p style={styles.storyAge}>
                    {isArabic ? `العمر: ${story.ageRange} سنوات` : `Age: ${story.ageRange} years`}
                  </p>
                </div>
              </div>

              <p style={styles.storySummary}>
                {isArabic ? story.summaryAr : story.summary}
              </p>

              {/* Outcome Metrics */}
              <div style={styles.outcomesGrid}>
                {story.outcomes.map((outcome, idx) => (
                  <div key={idx} style={styles.outcomeItem}>
                    <div style={styles.outcomeLabel}>
                      {isArabic ? outcome.labelAr : outcome.label}
                    </div>
                    <div style={styles.outcomeBar}>
                      <div style={styles.outcomeBarTrack}>
                        <div
                          style={{
                            ...styles.outcomeBarBefore,
                            width: `${outcome.before}%`,
                          }}
                        />
                        <div
                          style={{
                            ...styles.outcomeBarAfter,
                            width: `${outcome.after}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div style={styles.outcomeValues}>
                      <span style={styles.outcomeValueBefore}>
                        {isArabic ? 'قبل' : 'Before'}: {outcome.before}%
                      </span>
                      <span style={styles.outcomeValueAfter}>
                        {isArabic ? 'بعد' : 'After'}: {outcome.after}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              {story.testimonial && (
                <div style={styles.testimonialBox}>
                  <p style={styles.testimonialQuote}>
                    "{isArabic ? story.testimonial.quoteAr : story.testimonial.quote}"
                  </p>
                  <p style={styles.testimonialAuthor}>
                    — {isArabic ? story.testimonial.authorAr : story.testimonial.author}
                  </p>
                </div>
              )}

              <div style={styles.storyFooter}>
                <span style={styles.duration}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {renderLabIcon('\u{1F5D3}', { size: 14, tone: 'muted' })}
                    {isArabic ? story.treatmentDurationAr : story.treatmentDuration}
                  </span>
                </span>
                <button style={styles.readMore}>
                  {isArabic ? 'قراءة المزيد' : 'Read More'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div style={styles.stats}>
          {stats.map((stat, idx) => (
            <div key={idx} style={styles.statItem}>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
