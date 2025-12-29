import { useState, useMemo, useEffect, useCallback, memo, type ReactNode } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser, usePermission } from '../../context/UserContext';
import { useSessionMetrics } from '../../hooks/useSessionMetrics';
import { getToken, sessionsApi } from '../../services/api';
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
  dashboardExport,
  analytics,
} from '../../styles';
import LongitudinalCharts from '../dashboards/LongitudinalCharts';
import { downloadCsvRows, downloadParentReportPdf } from '../dashboards/roleDashboardExports';
import { formatTimestamp, getLatestByModule, getModuleLabel } from '../dashboards/roleDashboardUtils';
import { getStreakDays, getUniqueSessionStats } from '../../utils/sessionStats';
import LabButton from '../labui/LabButton';
import LabCard from '../labui/LabCard';
import LabPill from '../labui/LabPill';
import {
  ParentIcon,
  ReportIcon,
  WaveformIcon,
  StarIcon,
  BrainCircuitIcon,
  HeadsetIcon,
  ShieldMedicalIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DownloadIcon,
} from '../icons/index';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface ChildData {
  id: string;
  name: string;
  nameAr?: string;
  age?: number | null;
  sessionsCompleted: number;
  totalSessions: number;
  attentionScore: number;
  processingSpeed: number;
  auditoryDiscrimination: number;
  streak: number;
  lastActivity: number;
  treatmentPhase: 'assessment' | 'active' | 'maintenance' | 'completed';
  weeklyProgress?: number[];
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
    icon: <ReportIcon size={16} tone="cyan" />,
    category: 'clinical',
    points: 50,
  },
  {
    id: 'week_one',
    title: '5 Sessions Complete',
    titleAr: 'auto.ParentDashboard.k22',
    achieved: sessions >= 5,
    achievedAt: sessions >= 5 ? Date.now() - 86400000 * 7 : undefined,
    icon: <WaveformIcon size={16} tone="purple" />,
    category: 'clinical',
    points: 100,
  },
  {
    id: 'halfway',
    title: 'Halfway There',
    titleAr: 'auto.ParentDashboard.k23',
    achieved: sessions >= 10,
    achievedAt: sessions >= 10 ? Date.now() - 86400000 * 3 : undefined,
    icon: <BrainCircuitIcon size={16} tone="pink" />,
    category: 'clinical',
    points: 150,
  },
  {
    id: 'almost_done',
    title: '15 Sessions',
    titleAr: 'auto.ParentDashboard.k24',
    achieved: sessions >= 15,
    icon: <CheckCircleIcon size={16} tone="warning" />,
    category: 'mastery',
    points: 200,
  },
  {
    id: 'graduate',
    title: 'Program Graduate',
    titleAr: 'auto.ParentDashboard.k25',
    achieved: sessions >= 20,
    icon: <StarIcon size={16} tone="success" />,
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
  const { t } = useLanguage();
  const totalSessions = child.totalSessions > 0 ? child.totalSessions : 0;
  const progressPercent = totalSessions > 0
    ? Math.round((child.sessionsCompleted / totalSessions) * 100)
    : 0;
  const milestones = getMilestones(child.sessionsCompleted);
  const weeklyProgress = Array.isArray(child.weeklyProgress)
    ? [...child.weeklyProgress, 0, 0, 0, 0, 0].slice(0, 5)
    : [0, 0, 0, 0, 0];
  const nameAr = child.nameAr || child.name;
  const ageLabel = Number.isFinite(child.age) ? child.age : '--';

  const phaseColors = {
    assessment: brandPurple,
    active: brandCyan,
    maintenance: colors.warning,
    completed: colors.success,
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
              {isArabic ? t(nameAr, child.name) : child.name}
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
              <span>{isArabic ? `${ageLabel} سنوات` : `${ageLabel} years old`}</span>
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
              <span><StarIcon size={14} tone="warning" /></span>
              <span
                style={{
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.bold,
                  color: colors.warning,
                }}
              >
                {child.streak}
              </span>
            </div>
          )}

          {/* Expand Arrow */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              transform: isExpanded ? 'rotate(180deg)' : 'none',
              transition: transitions.fast,
            }}
          >
            <ChevronDownIcon size={18} tone="muted" style={{ color: colors.text.muted }} />
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
              icon={<BrainCircuitIcon size={18} tone="cyan" />}
              color={brandCyan}
            />
            <ScoreCard
              label={t('auto.ParentDashboard.k5', "Processing")}
              value={child.processingSpeed}
              icon={<WaveformIcon size={18} tone="purple" />}
              color={brandPurple}
            />
            <ScoreCard
              label={t('auto.ParentDashboard.k6', "Auditory")}
              value={child.auditoryDiscrimination}
              icon={<HeadsetIcon size={18} tone="pink" />}
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
                      height: Math.max(8, weeklyProgress[i] * 20),
                      background:
                        weeklyProgress[i] > 0
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
  icon: ReactNode;
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
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: spacing[1] }}>
      {icon}
    </div>
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
  const { user, isAuthenticated, isOnline } = useUser();
  const permissionName = 'view_child_reports';
  const hasAccess = usePermission(permissionName);
  const {
    sessions: sessionMetrics,
    source: sessionSource,
    isLoading: sessionsLoading,
  } = useSessionMetrics();
  const [childrenData, setChildrenData] = useState<ChildData[] | null>(null);
  const [expandedChild, setExpandedChild] = useState<string | null>(MOCK_CHILDREN[0]?.id || null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const token = getToken();
  const hasToken = Boolean(token);
  const canFetch = Boolean(token && isAuthenticated && isOnline && hasAccess && user?.role === 'parent');
  const isE2E = import.meta.env.VITE_E2E === 'true';
  const debugAttrs = isE2E
    ? {
        'data-e2e-can-fetch': String(canFetch),
        'data-e2e-role': user?.role ?? 'guest',
        'data-e2e-online': String(isOnline),
        'data-e2e-auth': String(isAuthenticated),
        'data-e2e-permission': permissionName,
        'data-e2e-permission-granted': String(hasAccess),
        'data-e2e-token': String(hasToken),
        'data-e2e-error': analysisError ?? '',
      }
    : {};

  useEffect(() => {
    let cancelled = false;

    if (!canFetch) {
      setChildrenData(null);
      setAnalysisError(null);
      return () => {
        cancelled = true;
      };
    }

    setAnalysisError(null);
    sessionsApi.getChildrenAnalysis()
      .then((response) => {
        if (cancelled) return;
        if (response.success && Array.isArray(response.children)) {
          const normalized = response.children.map((child) => ({
            ...child,
            nameAr: child.nameAr || child.name,
            age: Number.isFinite(child.age) ? child.age : null,
            weeklyProgress: Array.isArray(child.weeklyProgress)
              ? [...child.weeklyProgress, 0, 0, 0, 0, 0].slice(0, 5)
              : [0, 0, 0, 0, 0],
          }));
          setChildrenData(normalized);
          return;
        }
        setAnalysisError('children analysis failed');
        setChildrenData([]);
      })
      .catch((error) => {
        if (cancelled) return;
        setAnalysisError(error instanceof Error ? error.message : 'children analysis failed');
        setChildrenData([]);
      });

    return () => {
      cancelled = true;
    };
  }, [canFetch, user?.id, user?.role]);

  const children = useMemo(() => {
    if (childrenData !== null) return childrenData;
    return MOCK_CHILDREN;
  }, [childrenData]);
  const hasApiChildren = childrenData !== null;
  const latestByModule = useMemo(() => getLatestByModule(sessionMetrics), [sessionMetrics]);
  const exportLocale = isArabic ? 'ar-SA' : 'en-US';
  const sessionSourceTone = sessionSource === 'api'
    ? 'success'
    : sessionSource === 'local'
      ? 'purple'
      : sessionSource === 'demo'
        ? 'warning'
        : 'neutral';
  const sessionSourceLabel = sessionSource === 'api'
    ? t('auto.ParentDashboard.k38', 'API')
    : sessionSource === 'local'
      ? t('auto.ParentDashboard.k39', 'Local Cache')
      : sessionSource === 'demo'
        ? t('auto.ParentDashboard.k40', 'Demo')
        : t('auto.ParentDashboard.k41', 'No Data');
  const exportDisabled = sessionMetrics.length === 0;

  const overallStats = useMemo(() => {
    if (!hasApiChildren && sessionMetrics.length > 0) {
      const sessionStats = getUniqueSessionStats(sessionMetrics);
      const totalSessions = sessionStats.totalSessions;
      const avgProgress = sessionStats.averageScore;
      const totalStreak = getStreakDays(sessionStats.sessionDates);
      const activeChildren = children.filter(c => c.treatmentPhase === 'active').length;

      return { totalSessions, avgProgress, totalStreak, activeChildren };
    }

    const totalSessions = children.reduce((sum, c) => sum + c.sessionsCompleted, 0);
    const avgProgress = children.length > 0
      ? Math.round(
        children.reduce((sum, c) => {
          const progress = c.totalSessions > 0 ? (c.sessionsCompleted / c.totalSessions) * 100 : 0;
          return sum + progress;
        }, 0) / children.length
      )
      : 0;
    const totalStreak = children.reduce((sum, c) => sum + c.streak, 0);
    const activeChildren = children.filter(c => c.treatmentPhase === 'active').length;

    return { totalSessions, avgProgress, totalStreak, activeChildren };
  }, [children, hasApiChildren, sessionMetrics]);

  const handleExportPdf = useCallback(() => {
    if (!sessionMetrics.length) return;
    void downloadParentReportPdf({
      sessions: sessionMetrics,
      latestByModule,
      isArabic,
    });
  }, [isArabic, latestByModule, sessionMetrics]);

  const handleExportCsv = useCallback(() => {
    if (!sessionMetrics.length) return;
    const headers = [
      t('auto.ParentDashboard.k42', 'Module'),
      t('auto.ParentDashboard.k43', 'Score'),
      t('auto.ParentDashboard.k44', 'Band'),
      t('auto.ParentDashboard.k45', 'Session Date'),
    ];
    const rows = sessionMetrics.map((session) => ([
      getModuleLabel(String(session.moduleId), isArabic),
      session.score100,
      session.band,
      formatTimestamp(session.timestamp, exportLocale),
    ]));
    downloadCsvRows([headers, ...rows], 'parent-sessions.csv');
  }, [exportLocale, isArabic, sessionMetrics, t]);

  if (!hasAccess) {
    return (
      <div
        style={{
          padding: spacing[10],
          textAlign: 'center',
          color: colors.text.secondary,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: spacing[4] }}><ShieldMedicalIcon size={48} tone="warning" /></div>
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
      {...debugAttrs}
      style={{
        maxWidth: 900,
        direction,
      }}
    >
      <ResponsiveStyles />
      {isE2E && (
        <div
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1100,
            padding: '8px 10px',
            background: 'rgba(0,0,0,0.75)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            color: colors.text.primary,
            fontSize: 11,
            lineHeight: 1.4,
            pointerEvents: 'none',
            maxWidth: 260,
          }}
        >
          <div>canFetch: {String(canFetch)}</div>
          <div>role: {user?.role ?? 'guest'}</div>
          <div>online: {String(isOnline)} auth: {String(isAuthenticated)}</div>
          <div>permission: {permissionName} ({String(hasAccess)})</div>
          <div>token: {String(hasToken)}</div>
          <div>error: {analysisError ? analysisError.slice(0, 160) : 'none'}</div>
        </div>
      )}
      {/* Back Navigation */}
      <BackNavigation />

      {/* Header */}
      <LabCard variant="panel" style={{ marginBottom: spacing[8] }}>
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
            }}
          >
            <ParentIcon size={26} tone="purple" />
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: typography.size['3xl'],
                fontWeight: typography.weight.black,
                color: colors.text.primary,
                fontFamily: typography.fontFamily.primary,
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
      </LabCard>

      {/* Lab HUD Header */}
      <LabCard variant="panel" style={{ marginBottom: spacing[6] }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: spacing[4],
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: typography.size.xs,
                color: colors.text.muted,
                letterSpacing: typography.letterSpacing.wide,
                textTransform: 'uppercase',
                marginBottom: spacing[2],
              }}
            >
              {t('auto.ParentDashboard.k46', 'Status')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2] }}>
              <LabPill tone={isOnline ? 'success' : 'warning'}>
                {isOnline ? t('auto.ParentDashboard.k47', 'Online') : t('auto.ParentDashboard.k48', 'Offline')}
              </LabPill>
              <LabPill tone={isAuthenticated ? 'cyan' : 'warning'}>
                {isAuthenticated ? t('auto.ParentDashboard.k49', 'Authenticated') : t('auto.ParentDashboard.k50', 'Guest')}
              </LabPill>
              <LabPill tone={hasAccess ? 'success' : 'error'}>
                {hasAccess ? t('auto.ParentDashboard.k51', 'Access OK') : t('auto.ParentDashboard.k52', 'Access Blocked')}
              </LabPill>
              <LabPill tone={hasApiChildren ? 'success' : 'warning'}>
                {hasApiChildren
                  ? t('auto.ParentDashboard.k53', 'Children: API')
                  : t('auto.ParentDashboard.k54', 'Children: Mock')}
              </LabPill>
              <LabPill tone={sessionSourceTone}>
                {t('auto.ParentDashboard.k55', 'Sessions')}: {sessionSourceLabel}
              </LabPill>
              {sessionsLoading && (
                <LabPill tone="warning">{t('auto.ParentDashboard.k56', 'Syncing')}</LabPill>
              )}
              {analysisError && (
                <LabPill tone="error">{t('auto.ParentDashboard.k57', 'Analysis Error')}</LabPill>
              )}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: typography.size.xs,
                color: colors.text.muted,
                letterSpacing: typography.letterSpacing.wide,
                textTransform: 'uppercase',
                marginBottom: spacing[2],
              }}
            >
              {t('auto.ParentDashboard.k58', 'Filters')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2] }}>
              <LabPill tone="neutral">{t('auto.ParentDashboard.k59', 'Scope: All Children')}</LabPill>
              <LabPill tone="neutral">{t('auto.ParentDashboard.k60', 'Phase: All')}</LabPill>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isArabic ? 'flex-start' : 'flex-end',
              gap: spacing[2],
            }}
          >
            <div
              style={{
                fontSize: typography.size.xs,
                color: colors.text.muted,
                letterSpacing: typography.letterSpacing.wide,
                textTransform: 'uppercase',
              }}
            >
              {t('auto.ParentDashboard.k61', 'Export')}
            </div>
            <div
              style={{
                display: 'flex',
                gap: spacing[2],
                flexWrap: 'wrap',
                justifyContent: isArabic ? 'flex-start' : 'flex-end',
              }}
            >
              <LabButton
                size="sm"
                variant="ghost"
                onClick={handleExportCsv}
                disabled={exportDisabled}
                leftIcon={<DownloadIcon size={16} tone="cyan" />}
              >
                {t('auto.ParentDashboard.k62', 'CSV')}
              </LabButton>
              <LabButton
                size="sm"
                variant="primary"
                onClick={handleExportPdf}
                disabled={exportDisabled}
                leftIcon={<ReportIcon size={16} tone="cyan" />}
              >
                {t('auto.ParentDashboard.k63', 'PDF Report')}
              </LabButton>
            </div>
            {exportDisabled && (
              <div style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
                {t('auto.ParentDashboard.k64', 'No session data yet')}
              </div>
            )}
          </div>
        </div>
      </LabCard>

      {/* Quick Stats */}
      <PageTransition animation="fade-in-up" delay={100}>
        <div className="stats-grid" style={{ marginBottom: spacing[8] }}>
          <StatCard
            variant="centered"
            label={t('auto.ParentDashboard.k12', "Total Sessions")}
            value={overallStats.totalSessions}
            icon={<ReportIcon size={20} tone="cyan" />}
            color={brandCyan}
          />
          <StatCard
            variant="centered"
            label={t('auto.ParentDashboard.k13', "Avg Progress")}
            value={`${overallStats.avgProgress}%`}
            icon={<WaveformIcon size={20} tone="purple" />}
            color={brandPurple}
          />
          <StatCard
            variant="centered"
            label={t('auto.ParentDashboard.k14', "Active Children")}
            value={overallStats.activeChildren}
            icon={<ParentIcon size={20} tone="pink" />}
            color={brandPink}
          />
          <StatCard
            variant="centered"
            label={t('auto.ParentDashboard.k15', "Total Streaks")}
            value={overallStats.totalStreak}
            icon={<StarIcon size={20} tone="warning" />}
            color={colors.warning}
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
        icon={<ParentIcon size={20} tone="cyan" />}
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
            content={`${children.filter(c => c.streak === 0).length} ${t('auto.ParentDashboard.k18', "children haven't practiced recently")}`}
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
