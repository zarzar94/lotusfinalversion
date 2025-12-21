import { useState, useMemo, memo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser, usePermission } from '../../context/UserContext';
import {
  BackNavigation,
  SectionNav,
  ResponsiveStyles,
  StatCard,
  PageTransition,
  MilestoneTracker,
  TipsCard,
  InfoCard,
} from '../shared';
import type { Milestone } from '../shared';
import {
  NarrativeCard,
  StoryMotivation,
  GoalList,
  GoalSummary,
  getUnlockedChapters,
  getCurrentChapter,
  MOCK_GOALS,
} from '../gamification';
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
import LongitudinalCharts from '../dashboards/LongitudinalCharts';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface ChildData {
  id: string;
  name: string;
  nameAr: string;
  age: number;
  sessionsCompleted: number;
  totalSessions: number;
  attentionScore: number;
  processingSpeed: number;
  auditoryDiscrimination: number;
  streak: number;
  lastActivity: number;
  treatmentPhase: 'assessment' | 'active' | 'maintenance' | 'completed';
  weeklyProgress: number[];
}

// Milestone type is imported from shared

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const MOCK_CHILDREN: ChildData[] = [
  {
    id: 'child_1',
    name: 'Ahmed',
    nameAr: 'auto.ParentDashboard.k19',
    age: 8,
    sessionsCompleted: 12,
    totalSessions: 20,
    attentionScore: 75,
    processingSpeed: 68,
    auditoryDiscrimination: 72,
    streak: 4,
    lastActivity: Date.now() - 86400000,
    treatmentPhase: 'active',
    weeklyProgress: [2, 3, 2, 3, 2],
  },
  {
    id: 'child_2',
    name: 'Sara',
    nameAr: 'auto.ParentDashboard.k20',
    age: 6,
    sessionsCompleted: 6,
    totalSessions: 20,
    attentionScore: 62,
    processingSpeed: 55,
    auditoryDiscrimination: 58,
    streak: 2,
    lastActivity: Date.now() - 172800000,
    treatmentPhase: 'active',
    weeklyProgress: [1, 2, 1, 2, 0],
  },
];

const getMilestones = (sessions: number): Milestone[] => [
  {
    id: 'first_session',
    title: 'First Session',
    titleAr: 'auto.ParentDashboard.k21',
    achieved: sessions >= 1,
    achievedAt: sessions >= 1 ? Date.now() - 86400000 * 10 : undefined,
    icon: '🎯',
    category: 'clinical',
    points: 50,
  },
  {
    id: 'week_one',
    title: '5 Sessions Complete',
    titleAr: 'auto.ParentDashboard.k22',
    achieved: sessions >= 5,
    achievedAt: sessions >= 5 ? Date.now() - 86400000 * 7 : undefined,
    icon: '📅',
    category: 'clinical',
    points: 100,
  },
  {
    id: 'halfway',
    title: 'Halfway There',
    titleAr: 'auto.ParentDashboard.k23',
    achieved: sessions >= 10,
    achievedAt: sessions >= 10 ? Date.now() - 86400000 * 3 : undefined,
    icon: '⭐',
    category: 'clinical',
    points: 150,
  },
  {
    id: 'almost_done',
    title: '15 Sessions',
    titleAr: 'auto.ParentDashboard.k24',
    achieved: sessions >= 15,
    icon: '🚀',
    category: 'mastery',
    points: 200,
  },
  {
    id: 'graduate',
    title: 'Program Graduate',
    titleAr: 'auto.ParentDashboard.k25',
    achieved: sessions >= 20,
    icon: '🎓',
    category: 'mastery',
    points: 300,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CHILD PROGRESS CARD
// ═══════════════════════════════════════════════════════════════════════════

const ChildProgressCard = memo(({
  child,
  isArabic,
  isExpanded,
  onToggle,
}: {
  child: ChildData;
  isArabic: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const progressPercent = Math.round((child.sessionsCompleted / child.totalSessions) * 100);
  const milestones = getMilestones(child.sessionsCompleted);

  const phaseColors = {
    assessment: brandPurple,
    active: brandCyan,
    maintenance: '#f59e0b',
    completed: '#22c55e',
  };

  const phaseLabels = {
    assessment: { en: 'Assessment', ar: 'auto.ParentDashboard.k34' },
    active: { en: 'Active Treatment', ar: 'auto.ParentDashboard.k35' },
    maintenance: { en: 'Maintenance', ar: 'auto.ParentDashboard.k36' },
    completed: { en: 'Completed', ar: 'auto.ParentDashboard.k37' },
  };

  const getTimeAgo = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / 86400000);
    if (days === 0) return t('auto.ParentDashboard.k1', "Today");
    if (days === 1) return t('auto.ParentDashboard.k2', "Yesterday");
    return isArabic ? `منذ ${days} أيام` : `${days} days ago`;
  };

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${brandCyan}08, ${brandPurple}05)`,
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius.xl,
        overflow: 'hidden',
        transition: transitions.normal,
      }}
    >
      {/* Card Header - Always Visible */}
      <div
        onClick={onToggle}
        style={{
          padding: spacing[5],
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[4],
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
          {/* Avatar */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: radius.lg,
              background: `linear-gradient(135deg, ${brandCyan}25, ${brandPurple}25)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}
          >
            {child.name[0]}
          </div>

          {/* Info */}
          <div>
            <div
              style={{
                fontSize: typography.size.xl,
                fontWeight: typography.weight.bold,
                color: colors.text.primary,
              }}
            >
              {isArabic ? t(child.nameAr, child.name) : child.name}
            </div>
            <div
              style={{
                fontSize: typography.size.sm,
                color: colors.text.secondary,
                display: 'flex',
                alignItems: 'center',
                gap: spacing[3],
              }}
            >
              <span>{isArabic ? `${child.age} سنوات` : `${child.age} years old`}</span>
              <span style={{ color: colors.border.default }}>•</span>
              <span style={{ color: phaseColors[child.treatmentPhase] }}>
                {isArabic ? phaseLabels[child.treatmentPhase].ar : phaseLabels[child.treatmentPhase].en}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[6] }}>
          {/* Progress Ring */}
          <div style={{ position: 'relative', width: 60, height: 60 }}>
            <svg width={60} height={60} style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx={30}
                cy={30}
                r={26}
                fill="none"
                stroke={colors.border.default}
                strokeWidth={4}
              />
              <circle
                cx={30}
                cy={30}
                r={26}
                fill="none"
                stroke={brandCyan}
                strokeWidth={4}
                strokeDasharray={`${progressPercent * 1.63} 163`}
                strokeLinecap="round"
                style={{ transition: transitions.slow }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: typography.size.sm,
                fontWeight: typography.weight.bold,
                color: brandCyan,
              }}
            >
              {progressPercent}%
            </div>
          </div>

          {/* Streak */}
          {child.streak > 0 && (
            <div
              style={{
                padding: `${spacing[2]}px ${spacing[3]}px`,
                background: 'rgba(245,158,11,0.15)',
                borderRadius: radius.full,
                display: 'flex',
                alignItems: 'center',
                gap: spacing[1],
              }}
            >
              <span>🔥</span>
              <span
                style={{
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.bold,
                  color: '#f59e0b',
                }}
              >
                {child.streak}
              </span>
            </div>
          )}

          {/* Expand Arrow */}
          <span
            style={{
              fontSize: typography.size.lg,
              color: colors.text.muted,
              transform: isExpanded ? 'rotate(180deg)' : 'none',
              transition: transitions.fast,
            }}
          >
            ▼
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          style={{
            padding: `0 ${spacing[5]}px ${spacing[5]}px`,
            borderTop: `1px solid ${colors.border.subtle}`,
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          {/* Progress Bar */}
          <div style={{ marginTop: spacing[4], marginBottom: spacing[5] }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: typography.size.sm,
                marginBottom: spacing[2],
              }}
            >
              <span style={{ color: colors.text.secondary }}>
                {t('auto.ParentDashboard.k3', "Session Progress")}
              </span>
              <span style={{ color: brandCyan, fontWeight: typography.weight.bold }}>
                {child.sessionsCompleted}/{child.totalSessions}
              </span>
            </div>
            <div
              style={{
                height: 8,
                background: colors.border.default,
                borderRadius: radius.full,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
                  borderRadius: radius.full,
                  transition: transitions.slow,
                }}
              />
            </div>
          </div>

          {/* Scores Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: spacing[3],
              marginBottom: spacing[5],
            }}
          >
            <ScoreCard
              label={t('auto.ParentDashboard.k4', "Attention")}
              value={child.attentionScore}
              icon="🎯"
              color={brandCyan}
            />
            <ScoreCard
              label={t('auto.ParentDashboard.k5', "Processing")}
              value={child.processingSpeed}
              icon="⚡"
              color={brandPurple}
            />
            <ScoreCard
              label={t('auto.ParentDashboard.k6', "Auditory")}
              value={child.auditoryDiscrimination}
              icon="👂"
              color={brandPink}
            />
          </div>

          {/* Milestones - Using shared MilestoneTracker */}
          <div style={{ marginBottom: spacing[4] }}>
            <MilestoneTracker
              milestones={milestones}
              isArabic={isArabic}
              variant="horizontal"
              title="Milestones"
              titleAr="الإنجازات"
            />
          </div>

          {/* Weekly Progress Chart */}
          <div>
            <h4
              style={{
                margin: `0 0 ${spacing[3]}px`,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.bold,
                color: colors.text.primary,
              }}
            >
              {t('auto.ParentDashboard.k7', "Weekly Activity")}
            </h4>
            <div style={{ display: 'flex', gap: spacing[2], alignItems: 'flex-end', height: 60 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                <div key={day} style={{ flex: 1, textAlign: 'center' }}>
                  <div
                    style={{
                      height: Math.max(8, child.weeklyProgress[i] * 20),
                      background:
                        child.weeklyProgress[i] > 0
                          ? `linear-gradient(180deg, ${brandCyan}, ${brandPurple})`
                          : colors.border.subtle,
                      borderRadius: radius.sm,
                      marginBottom: spacing[1],
                      transition: transitions.slow,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      color: colors.text.muted,
                    }}
                  >
                    {isArabic ? ['إث', 'ث', 'أر', 'خ', 'ج'][i] : day[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Last Activity */}
          <div
            style={{
              marginTop: spacing[4],
              fontSize: typography.size.xs,
              color: colors.text.muted,
              textAlign: 'center',
            }}
          >
            {t('auto.ParentDashboard.k8', "Last activity: ")}
            {getTimeAgo(child.lastActivity)}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
});
ChildProgressCard.displayName = 'ChildProgressCard';

// ═══════════════════════════════════════════════════════════════════════════
// SCORE CARD
// ═══════════════════════════════════════════════════════════════════════════

const ScoreCard = memo(({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
}) => (
  <div
    style={{
      padding: spacing[3],
      background: `${color}10`,
      border: `1px solid ${color}20`,
      borderRadius: radius.lg,
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: 20, marginBottom: spacing[1] }}>{icon}</div>
    <div
      style={{
        fontSize: typography.size.xl,
        fontWeight: typography.weight.black,
        color,
      }}
    >
      {value}%
    </div>
    <div
      style={{
        fontSize: typography.size.xs,
        color: colors.text.secondary,
        marginTop: 2,
      }}
    >
      {label}
    </div>
  </div>
));
ScoreCard.displayName = 'ScoreCard';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

export default function ParentDashboard() {
  const { isArabic, direction, t } = useLanguage();
  const { user } = useUser();
  const hasAccess = usePermission('view_child_reports');
  const [expandedChild, setExpandedChild] = useState<string | null>(MOCK_CHILDREN[0]?.id || null);

  const children = useMemo(() => {
    // In production, filter by user.children IDs
    return MOCK_CHILDREN;
  }, []);

  const overallStats = useMemo(() => {
    const totalSessions = children.reduce((sum, c) => sum + c.sessionsCompleted, 0);
    const avgProgress = Math.round(
      children.reduce((sum, c) => sum + (c.sessionsCompleted / c.totalSessions) * 100, 0) / children.length
    );
    const totalStreak = children.reduce((sum, c) => sum + c.streak, 0);
    const activeChildren = children.filter(c => c.treatmentPhase === 'active').length;

    return { totalSessions, avgProgress, totalStreak, activeChildren };
  }, [children]);

  if (!hasAccess) {
    return (
      <div
        style={{
          padding: spacing[10],
          textAlign: 'center',
          color: colors.text.secondary,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: spacing[4] }}>🔒</div>
        <h2 style={{ color: colors.text.primary, marginBottom: spacing[2] }}>
          {t('auto.ParentDashboard.k9', "Access Restricted")}
        </h2>
        <p>
          {t('auto.ParentDashboard.k10', "You must be a parent to access this dashboard")}
        </p>
      </div>
    );
  }

  return (
    <section
      id="parent-dashboard"
      className="page-container"
      style={{
        maxWidth: 900,
        direction,
      }}
    >
      <ResponsiveStyles />
      {/* Back Navigation */}
      <BackNavigation />

      {/* Header */}
      <div style={{ marginBottom: spacing[8] }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[3],
            marginBottom: spacing[2],
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: radius.lg,
              background: `linear-gradient(135deg, ${brandPurple}20, ${brandCyan}20)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            👨‍👩‍👧
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: typography.size['3xl'],
                fontWeight: typography.weight.black,
                color: colors.text.primary,
                fontFamily: typography.fontFamily,
              }}
            >
              {t('auto.ParentDashboard.k11', "Parent Dashboard")}
            </h1>
            <p style={{ margin: 0, color: colors.text.secondary, fontSize: typography.size.sm }}>
              {isArabic
                ? `مرحباً ${user?.nameAr || user?.name || 'ولي الأمر'}`
                : `Welcome, ${user?.name || 'Parent'}`}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <PageTransition animation="fade-in-up" delay={100}>
        <div className="stats-grid" style={{ marginBottom: spacing[8] }}>
          <StatCard
            variant="centered"
            label={t('auto.ParentDashboard.k12', "Total Sessions")}
            value={overallStats.totalSessions}
            icon="📊"
            color={brandCyan}
          />
          <StatCard
            variant="centered"
            label={t('auto.ParentDashboard.k13', "Avg Progress")}
            value={`${overallStats.avgProgress}%`}
            icon="📈"
            color={brandPurple}
          />
          <StatCard
            variant="centered"
            label={t('auto.ParentDashboard.k14', "Active Children")}
            value={overallStats.activeChildren}
            icon="👶"
            color={brandPink}
          />
          <StatCard
            variant="centered"
            label={t('auto.ParentDashboard.k15', "Total Streaks")}
            value={overallStats.totalStreak}
            icon="🔥"
            color="#f59e0b"
          />
        </div>
      </PageTransition>

      {/* Longitudinal Trend */}
      <div style={{ marginBottom: spacing[8] }}>
        <h2
          style={{
            margin: `0 0 ${spacing[4]}px`,
            fontSize: typography.size.xl,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
          }}
        >
          {t('dashboard.trends', 'Trends')}
        </h2>
        <LongitudinalCharts
          moduleId="attention"
          variant="parent"
          title={t('games.attention', 'Attention Test')}
        />
      </div>

      {/* Children List */}
      <div>
        <h2
          style={{
            margin: `0 0 ${spacing[4]}px`,
            fontSize: typography.size.xl,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
          }}
        >
          {t('auto.ParentDashboard.k16', "Children's Progress")}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
          {children.map((child) => (
            <ChildProgressCard
              key={child.id}
              child={child}
              isArabic={isArabic}
              isExpanded={expandedChild === child.id}
              onToggle={() => setExpandedChild(expandedChild === child.id ? null : child.id)}
            />
          ))}
        </div>
      </div>

      {/* Gamification Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: spacing[4],
          marginTop: spacing[6],
        }}
      >
        {/* Story Progress - First child */}
        {children.length > 0 && (() => {
          const firstChild = children[0];
          const chapters = getUnlockedChapters(
            firstChild.sessionsCompleted,
            firstChild.streak,
            firstChild.attentionScore
          );
          const currentIndex = getCurrentChapter(chapters);
          const currentChapter = chapters[currentIndex];
          const nextChapter = chapters[currentIndex + 1];

          return (
            <NarrativeCard
              currentChapter={currentChapter}
              nextChapter={nextChapter}
              totalChapters={chapters.length}
              isArabic={isArabic}
            />
          );
        })()}

        {/* Goals Summary */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[4],
          }}
        >
          <GoalSummary goals={MOCK_GOALS} isArabic={isArabic} />
          <StoryMotivation
            sessionsCompleted={children[0]?.sessionsCompleted || 0}
            currentStreak={children[0]?.streak || 0}
            attentionScore={children[0]?.attentionScore || 0}
            isArabic={isArabic}
          />
        </div>
      </div>

      {/* Active Goals */}
      <div
        style={{
          marginTop: spacing[6],
          padding: spacing[5],
          background: colors.surface.card,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radius.xl,
        }}
      >
        <GoalList
          goals={MOCK_GOALS.slice(0, 3)}
          isArabic={isArabic}
          showCompleted={false}
          variant="compact"
          title="Active Goals"
          titleAr="الأهداف النشطة"
        />
      </div>

      {/* Tips Section - Using shared TipsCard */}
      <TipsCard
        title="Tips for Parents"
        titleAr="نصائح للآباء"
        icon="💡"
        color={brandCyan}
        isArabic={isArabic}
        tips={[
          {
            id: '1',
            title: 'Daily Sessions',
            titleAr: 'auto.ParentDashboard.k26',
            content: 'Encourage your child to complete daily sessions to maintain streaks',
            contentAr: 'auto.ParentDashboard.k27',
          },
          {
            id: '2',
            title: 'Track Improvements',
            titleAr: 'auto.ParentDashboard.k28',
            content: 'Monitor attention and processing scores to track improvement',
            contentAr: 'auto.ParentDashboard.k29',
          },
          {
            id: '3',
            title: 'Reach Out Early',
            titleAr: 'auto.ParentDashboard.k30',
            content: 'Contact the clinician if you notice any regression',
            contentAr: 'auto.ParentDashboard.k31',
          },
          {
            id: '4',
            title: 'Celebrate Milestones',
            titleAr: 'auto.ParentDashboard.k32',
            content: 'Celebrate milestones with your child to keep them motivated',
            contentAr: 'auto.ParentDashboard.k33',
          },
        ]}
      />

      {/* Inactivity Alert */}
      {children.some(c => c.streak === 0 && c.treatmentPhase === 'active') && (
        <div style={{ marginTop: spacing[4] }}>
          <InfoCard
            title={t('auto.ParentDashboard.k17', "Alert: Low Activity")}
            titleAr="تنبيه: نشاط منخفض"
            content={`${children.filter(c => c.streak === 0).length} ${t('auto.ParentDashboard.k18', "children haven\\")t practiced recently'}`}
            contentAr={`${children.filter(c => c.streak === 0).length} أطفال لم يمارسوا مؤخراً`}
            variant="warning"
            isArabic={isArabic}
          />
        </div>
      )}

      {/* Section Navigation */}
      <div
        style={{
          marginTop: spacing[8],
          padding: spacing[5],
          background: colors.surface.card,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radius.xl,
        }}
      >
        <SectionNav
          variant="grid"
          showDescriptions={true}
          title="Explore Platform"
          titleAr="استكشف المنصة"
        />
      </div>
    </section>
  );
}

// StatCard is now imported from ../shared
