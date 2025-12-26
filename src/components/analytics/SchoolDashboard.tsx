import { useState, useMemo, useEffect, memo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser, usePermission } from '../../context/UserContext';
import { useSessionMetrics } from '../../hooks/useSessionMetrics';
import { getToken, sessionsApi } from '../../services/api';
import type { SchoolSessionsAnalysisResponse } from '../../types/api';
import { getAverageModuleScore, getUniqueSessionStats } from '../../utils/sessionStats';
import {
  BackNavigation,
  SectionNav,
  ResponsiveStyles,
  StatCard,
  PageTransition,
  TipsCard,
  InfoCard,
  LineChart,
} from '../shared';
import {
  Leaderboard,
  GoalSummary,
  MOCK_LEADERBOARD,
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
  shadows,
  transitions,
  dashboardExport,
  analytics,
} from '../../styles';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface StudentData {
  id: string;
  name: string;
  nameAr?: string;
  grade: string;
  gradeAr?: string;
  sessionsCompleted: number;
  totalSessions: number;
  attentionScore: number;
  processingSpeed: number;
  lastActivity: number;
  status: 'on_track' | 'needs_attention' | 'at_risk' | 'completed';
}

interface WeeklyProgress {
  week: string;
  weekAr?: string;
  sessionsCompleted: number;
  averageScore: number;
  activeStudents: number;
}

interface GradeDistribution {
  grade: string;
  gradeAr?: string;
  count: number;
  averageProgress: number;
  color: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const MOCK_STUDENTS: StudentData[] = [
  { id: '1', name: 'Ahmed Hassan', nameAr: 'auto.SchoolDashboard.k29', grade: 'Grade 3', sessionsCompleted: 18, totalSessions: 20, attentionScore: 85, processingSpeed: 78, lastActivity: Date.now() - 86400000, status: 'on_track' },
  { id: '2', name: 'Sara Ali', nameAr: 'auto.SchoolDashboard.k30', grade: 'Grade 4', sessionsCompleted: 20, totalSessions: 20, attentionScore: 92, processingSpeed: 88, lastActivity: Date.now() - 172800000, status: 'completed' },
  { id: '3', name: 'Omar Khalid', nameAr: 'auto.SchoolDashboard.k31', grade: 'Grade 2', sessionsCompleted: 8, totalSessions: 20, attentionScore: 62, processingSpeed: 55, lastActivity: Date.now() - 604800000, status: 'at_risk' },
  { id: '4', name: 'Fatima Mohammed', nameAr: 'auto.SchoolDashboard.k32', grade: 'Grade 3', sessionsCompleted: 14, totalSessions: 20, attentionScore: 75, processingSpeed: 72, lastActivity: Date.now() - 259200000, status: 'needs_attention' },
  { id: '5', name: 'Yusuf Ibrahim', nameAr: 'auto.SchoolDashboard.k33', grade: 'Grade 5', sessionsCompleted: 16, totalSessions: 20, attentionScore: 88, processingSpeed: 82, lastActivity: Date.now() - 86400000, status: 'on_track' },
  { id: '6', name: 'Layla Ahmad', nameAr: 'auto.SchoolDashboard.k34', grade: 'Grade 4', sessionsCompleted: 12, totalSessions: 20, attentionScore: 70, processingSpeed: 68, lastActivity: Date.now() - 432000000, status: 'needs_attention' },
  { id: '7', name: 'Khaled Nasser', nameAr: 'auto.SchoolDashboard.k35', grade: 'Grade 2', sessionsCompleted: 6, totalSessions: 20, attentionScore: 58, processingSpeed: 52, lastActivity: Date.now() - 864000000, status: 'at_risk' },
  { id: '8', name: 'Noor Saleh', nameAr: 'auto.SchoolDashboard.k36', grade: 'Grade 5', sessionsCompleted: 19, totalSessions: 20, attentionScore: 90, processingSpeed: 85, lastActivity: Date.now(), status: 'on_track' },
];

const MOCK_WEEKLY: WeeklyProgress[] = [
  { week: 'Week 1', weekAr: 'auto.SchoolDashboard.k37', sessionsCompleted: 24, averageScore: 65, activeStudents: 8 },
  { week: 'Week 2', weekAr: 'auto.SchoolDashboard.k38', sessionsCompleted: 32, averageScore: 68, activeStudents: 8 },
  { week: 'Week 3', weekAr: 'auto.SchoolDashboard.k39', sessionsCompleted: 28, averageScore: 72, activeStudents: 7 },
  { week: 'Week 4', weekAr: 'auto.SchoolDashboard.k40', sessionsCompleted: 35, averageScore: 75, activeStudents: 8 },
  { week: 'Week 5', weekAr: 'auto.SchoolDashboard.k41', sessionsCompleted: 30, averageScore: 78, activeStudents: 6 },
  { week: 'Week 6', weekAr: 'auto.SchoolDashboard.k42', sessionsCompleted: 38, averageScore: 80, activeStudents: 8 },
];

const MOCK_GRADES: GradeDistribution[] = [
  { grade: 'Grade 2', gradeAr: 'auto.SchoolDashboard.k43', count: 2, averageProgress: 35, color: brandPink },
  { grade: 'Grade 3', gradeAr: 'auto.SchoolDashboard.k44', count: 2, averageProgress: 80, color: brandCyan },
  { grade: 'Grade 4', gradeAr: 'auto.SchoolDashboard.k45', count: 2, averageProgress: 80, color: brandPurple },
  { grade: 'Grade 5', gradeAr: 'auto.SchoolDashboard.k46', count: 2, averageProgress: 87, color: '#22c55e' },
];

// MetricCard replaced with StatCard from ../shared

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS BAR CHART
// ═══════════════════════════════════════════════════════════════════════════

const ProgressBarChart = memo(({
  data,
  isArabic,
}: {
  data: WeeklyProgress[];
  isArabic: boolean;
}) => {
  const { t } = useLanguage();
  const maxSessions = Math.max(1, ...data.map(d => d.sessionsCompleted));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
      {data.map((week, index) => (
        <div key={week.week} style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
          <div
            style={{
              width: 80,
              fontSize: typography.size.xs,
              color: colors.text.secondary,
              textAlign: isArabic ? 'right' : 'left',
            }}
          >
            {isArabic ? t(week.weekAr || week.week, week.week) : week.week}
          </div>
          <div
            style={{
              flex: 1,
              height: 24,
              background: colors.border.subtle,
              borderRadius: radius.md,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                [isArabic ? 'right' : 'left']: 0,
                height: '100%',
                width: `${(week.sessionsCompleted / maxSessions) * 100}%`,
                background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
                borderRadius: radius.md,
                transition: `width 0.5s ease ${index * 0.1}s`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                [isArabic ? 'right' : 'left']: spacing[2],
                fontSize: typography.size.xs,
                fontWeight: typography.weight.bold,
                color: colors.text.primary,
              }}
            >
              {week.sessionsCompleted} {t('auto.SchoolDashboard.k1', "sessions")}
            </div>
          </div>
          <div
            style={{
              width: 50,
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
              color: brandCyan,
              textAlign: 'center',
            }}
          >
            {week.averageScore}%
          </div>
        </div>
      ))}
    </div>
  );
});
ProgressBarChart.displayName = 'ProgressBarChart';

// ═══════════════════════════════════════════════════════════════════════════
// STUDENT TABLE
// ═══════════════════════════════════════════════════════════════════════════

const StudentTable = memo(({
  students,
  isArabic,
}: {
  students: StudentData[];
  isArabic: boolean;
}) => {
  const { t } = useLanguage();
  const statusColors: Record<StudentData['status'], { bg: string; text: string; label: string; labelAr: string }> = {
    on_track: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', label: 'On Track', labelAr: 'auto.SchoolDashboard.k47' },
    completed: { bg: 'rgba(143,211,204,0.15)', text: brandCyan, label: 'Completed', labelAr: 'auto.SchoolDashboard.k48' },
    needs_attention: { bg: 'rgba(234,179,8,0.15)', text: '#eab308', label: 'Needs Attention', labelAr: 'auto.SchoolDashboard.k49' },
    at_risk: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', label: 'At Risk', labelAr: 'auto.SchoolDashboard.k50' },
  };

  const getTimeAgo = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / 86400000);
    if (days === 0) return t('auto.SchoolDashboard.k2', "Today");
    if (days === 1) return t('auto.SchoolDashboard.k3', "Yesterday");
    return isArabic ? `منذ ${days} أيام` : `${days} days ago`;
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: typography.size.sm,
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: `1px solid ${colors.border.default}`,
              textAlign: isArabic ? 'right' : 'left',
            }}
          >
            <th style={{ padding: spacing[3], fontWeight: typography.weight.bold, color: colors.text.secondary }}>
              {t('auto.SchoolDashboard.k4', "Name")}
            </th>
            <th style={{ padding: spacing[3], fontWeight: typography.weight.bold, color: colors.text.secondary }}>
              {t('auto.SchoolDashboard.k5', "Grade")}
            </th>
            <th style={{ padding: spacing[3], fontWeight: typography.weight.bold, color: colors.text.secondary }}>
              {t('auto.SchoolDashboard.k6', "Progress")}
            </th>
            <th style={{ padding: spacing[3], fontWeight: typography.weight.bold, color: colors.text.secondary }}>
              {t('auto.SchoolDashboard.k7', "Attention")}
            </th>
            <th style={{ padding: spacing[3], fontWeight: typography.weight.bold, color: colors.text.secondary }}>
              {t('auto.SchoolDashboard.k8', "Last Active")}
            </th>
            <th style={{ padding: spacing[3], fontWeight: typography.weight.bold, color: colors.text.secondary }}>
              {t('auto.SchoolDashboard.k9', "Status")}
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => {
            const status = statusColors[student.status];
            const progressPercent = student.totalSessions > 0
              ? Math.round((student.sessionsCompleted / student.totalSessions) * 100)
              : 0;
            const nameAr = student.nameAr || student.name;
            const gradeLabel = student.gradeAr || student.grade;

            return (
              <tr
                key={student.id}
                style={{
                  borderBottom: `1px solid ${colors.border.subtle}`,
                  transition: transitions.fast,
                }}
              >
                <td style={{ padding: spacing[3], color: colors.text.primary, fontWeight: typography.weight.semibold }}>
                  {isArabic ? t(nameAr, student.name) : student.name}
                </td>
                <td style={{ padding: spacing[3], color: colors.text.secondary }}>
                  {isArabic ? t(gradeLabel, student.grade) : student.grade}
                </td>
                <td style={{ padding: spacing[3] }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                    <div
                      style={{
                        width: 60,
                        height: 6,
                        background: colors.border.default,
                        borderRadius: radius.full,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${progressPercent}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
                          borderRadius: radius.full,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
                      {student.sessionsCompleted}/{student.totalSessions}
                    </span>
                  </div>
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span
                    style={{
                      fontWeight: typography.weight.bold,
                      color: student.attentionScore >= 80 ? '#22c55e' : student.attentionScore >= 60 ? '#eab308' : '#ef4444',
                    }}
                  >
                    {student.attentionScore}%
                  </span>
                </td>
                <td style={{ padding: spacing[3], color: colors.text.muted, fontSize: typography.size.xs }}>
                  {getTimeAgo(student.lastActivity)}
                </td>
                <td style={{ padding: spacing[3] }}>
                  <span
                    style={{
                      padding: `${spacing[1]}px ${spacing[2.5]}px`,
                      background: status.bg,
                      color: status.text,
                      borderRadius: radius.full,
                      fontSize: typography.size.xs,
                      fontWeight: typography.weight.bold,
                    }}
                  >
                    {isArabic ? t(status.labelAr, status.label) : status.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
StudentTable.displayName = 'StudentTable';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function SchoolDashboard() {
  const { isArabic, direction, t } = useLanguage();
  const { user, isAuthenticated, isOnline } = useUser();
  const hasAccess = usePermission('school_analytics');
  const { sessions: sessionMetrics } = useSessionMetrics();
  const [filter, setFilter] = useState<'all' | 'at_risk' | 'on_track' | 'completed'>('all');
  const [schoolAnalysis, setSchoolAnalysis] = useState<SchoolSessionsAnalysisResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    const token = getToken();
    const role = user?.role;
    const canFetch = Boolean(
      token && isAuthenticated && isOnline && role && ['school_admin', 'super_admin', 'clinician'].includes(role)
    );

    if (!canFetch) {
      setSchoolAnalysis(null);
      return () => {
        cancelled = true;
      };
    }

    if (role !== 'school_admin' && !user?.school) {
      setSchoolAnalysis(null);
      return () => {
        cancelled = true;
      };
    }

    sessionsApi.getSchoolAnalysis(role === 'school_admin' ? undefined : user?.school)
      .then((response) => {
        if (cancelled) return;
        setSchoolAnalysis(response.success ? response : null);
      })
      .catch(() => {
        if (cancelled) return;
        setSchoolAnalysis(null);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isOnline, user?.role, user?.school]);

  const hasSchoolData = schoolAnalysis !== null;
  const schoolSummary = schoolAnalysis?.summary ?? null;

  const students = useMemo(() => {
    if (!hasSchoolData) return MOCK_STUDENTS;
    const apiStudents = schoolAnalysis?.students ?? [];
    return apiStudents.map((student) => ({
      ...student,
      nameAr: student.nameAr || student.name,
      grade: student.grade || '--',
      gradeAr: student.gradeAr || student.grade || '--',
    }));
  }, [hasSchoolData, schoolAnalysis]);

  const weeklyProgress = useMemo(() => {
    if (!hasSchoolData) return MOCK_WEEKLY;
    const apiWeekly = schoolAnalysis?.weekly ?? [];
    return apiWeekly.map((week) => ({
      ...week,
      weekAr: week.weekAr || week.week,
    }));
  }, [hasSchoolData, schoolAnalysis]);

  const gradeDistribution = useMemo(() => {
    if (!hasSchoolData) return MOCK_GRADES;
    const apiGrades = schoolAnalysis?.gradeDistribution ?? [];
    const palette = [brandPink, brandCyan, brandPurple, '#22c55e', '#f59e0b', '#ef4444'];
    return apiGrades.map((grade, index) => ({
      grade: grade.grade,
      gradeAr: grade.gradeAr || grade.grade,
      count: grade.count,
      averageProgress: grade.averageProgress,
      color: palette[index % palette.length],
    }));
  }, [hasSchoolData, schoolAnalysis]);

  const filteredStudents = useMemo(() => {
    if (filter === 'all') return students;
    return students.filter(s => s.status === filter);
  }, [filter, students]);

  const metrics = useMemo(() => {
    const totalStudents = students.length;
    const completed = students.filter(s => s.status === 'completed').length;
    const atRisk = students.filter(s => s.status === 'at_risk').length;
    const sessionStats = getUniqueSessionStats(sessionMetrics);
    const avgAttentionFromSessions = getAverageModuleScore(sessionMetrics, 'attention');
    const avgProgressFromSessions = sessionStats.totalSessions > 0 ? sessionStats.averageScore : null;
    const avgAttention = schoolSummary?.moduleAverages?.attention ?? avgAttentionFromSessions ?? (
      totalStudents > 0
        ? Math.round(students.reduce((sum, s) => sum + s.attentionScore, 0) / totalStudents)
        : 0
    );
    const avgProgress = schoolSummary?.averageScore ?? avgProgressFromSessions ?? (
      totalStudents > 0
        ? Math.round(
          students.reduce((sum, s) => sum + (s.totalSessions > 0 ? (s.sessionsCompleted / s.totalSessions) * 100 : 0), 0)
          / totalStudents
        )
        : 0
    );

    return { totalStudents, completed, atRisk, avgAttention, avgProgress };
  }, [schoolSummary, sessionMetrics, students]);

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
          {t('auto.SchoolDashboard.k10', "Access Restricted")}
        </h2>
        <p>
          {t('auto.SchoolDashboard.k11', "You must be a school administrator to access this dashboard")}
        </p>
      </div>
    );
  }

  return (
    <section
      id="school-dashboard"
      className="page-container"
      style={{
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
              background: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}20)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            🏫
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
              {t('auto.SchoolDashboard.k12', "School Analytics Dashboard")}
            </h1>
            <p style={{ margin: 0, color: colors.text.secondary, fontSize: typography.size.sm }}>
              {user?.school || (t('auto.SchoolDashboard.k13', "International Academy"))}
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <PageTransition animation="fade-in-up" delay={100}>
        <div className="stats-grid" style={{ marginBottom: spacing[8] }}>
          <StatCard
            label={t('auto.SchoolDashboard.k14', "Total Students")}
            value={metrics.totalStudents}
            subtitle={t('auto.SchoolDashboard.k15', "Enrolled in program")}
            icon="👥"
            color={brandCyan}
          />
          <StatCard
            label={t('auto.SchoolDashboard.k16', "Avg. Progress")}
            value={`${metrics.avgProgress}%`}
            subtitle={t('auto.SchoolDashboard.k17', "Sessions completed")}
            icon="📈"
            color={brandPurple}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            label={t('auto.SchoolDashboard.k18', "Completed")}
            value={metrics.completed}
            subtitle={t('auto.SchoolDashboard.k19', "Finished program")}
            icon="✅"
            color="#22c55e"
          />
          <StatCard
            label={t('auto.SchoolDashboard.k20', "Need Attention")}
            value={metrics.atRisk}
            subtitle={t('auto.SchoolDashboard.k21', "At-risk students")}
            icon="⚠️"
            color="#ef4444"
          />
        </div>
      </PageTransition>

      {/* Charts Row */}
      <div className="panels-grid" style={{ marginBottom: spacing[8] }}>
        {/* Weekly Progress Chart */}
        <div
          className="card"
          style={{
            background: colors.surface.card,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.xl,
          }}
        >
          <h3
            style={{
              margin: `0 0 ${spacing[4]}px`,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
            }}
          >
            {t('auto.SchoolDashboard.k22', "Weekly Progress")}
          </h3>
          <ProgressBarChart data={weeklyProgress} isArabic={isArabic} />
        </div>

        {/* Grade Distribution */}
        <div
          className="card"
          style={{
            background: colors.surface.card,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.xl,
          }}
        >
          <h3
            style={{
              margin: `0 0 ${spacing[4]}px`,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
            }}
          >
            {t('auto.SchoolDashboard.k23', "Grade Distribution")}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {gradeDistribution.map(grade => (
              <div key={grade.grade} style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                <div
                  style={{
                    width: 90,
                    fontSize: typography.size.sm,
                    color: colors.text.secondary,
                  }}
                >
                  {isArabic ? t(grade.gradeAr || grade.grade, grade.grade) : grade.grade}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 32,
                    background: colors.border.subtle,
                    borderRadius: radius.md,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      width: `${grade.averageProgress}%`,
                      background: grade.color,
                      borderRadius: radius.md,
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: spacing[2],
                    }}
                  >
                    <span
                      style={{
                        fontSize: typography.size.xs,
                        fontWeight: typography.weight.bold,
                        color: '#fff',
                      }}
                    >
                      {grade.count} {t('auto.SchoolDashboard.k24', "students")} • {grade.averageProgress}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div
        style={{
          padding: spacing[5],
          background: colors.surface.card,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radius.xl,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing[4],
            flexWrap: 'wrap',
            gap: spacing[3],
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
            }}
          >
            {t('auto.SchoolDashboard.k25', "Student List")}
          </h3>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: spacing[2] }}>
            {(['all', 'on_track', 'at_risk', 'completed'] as const).map(f => {
              const labels = {
                all: { en: 'All', ar: 'auto.SchoolDashboard.k58' },
                on_track: { en: 'On Track', ar: 'auto.SchoolDashboard.k59' },
                at_risk: { en: 'At Risk', ar: 'auto.SchoolDashboard.k60' },
                completed: { en: 'Completed', ar: 'auto.SchoolDashboard.k61' },
              };
              const isActive = filter === f;

              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: `${spacing[1.5]}px ${spacing[3]}px`,
                    background: isActive ? `${brandCyan}20` : 'transparent',
                    border: `1px solid ${isActive ? brandCyan : colors.border.default}`,
                    borderRadius: radius.md,
                    color: isActive ? brandCyan : colors.text.secondary,
                    fontSize: typography.size.xs,
                    fontWeight: typography.weight.bold,
                    cursor: 'pointer',
                    transition: transitions.fast,
                  }}
                >
                  {isArabic ? labels[f].ar : labels[f].en}
                </button>
              );
            })}
          </div>
        </div>

        <StudentTable students={filteredStudents} isArabic={isArabic} />
      </div>

      {/* Insights Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: spacing[4],
          marginTop: spacing[6],
        }}
      >
        {/* Score Trend Chart */}
        <div
          style={{
            padding: spacing[5],
            background: colors.surface.card,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.xl,
          }}
        >
          <LineChart
            title={t('auto.SchoolDashboard.k26', "Weekly Score Trend")}
            titleAr="اتجاه الدرجات الأسبوعي"
            data={weeklyProgress.map(w => ({
              label: w.week.replace('Week ', 'W'),
              labelAr: (w.weekAr || w.week).replace('الأسبوع ', 'أ'),
              value: w.averageScore,
            }))}
            isArabic={isArabic}
            height={160}
            showValues
            unit="%"
            gradientColors={[brandCyan, brandPurple]}
          />
        </div>

        {/* Tips Card */}
        <TipsCard
          title="School Admin Tips"
          titleAr="نصائح للمشرف"
          icon="🏫"
          color={brandPurple}
          isArabic={isArabic}
          tips={[
            {
              id: '1',
              title: 'Monitor At-Risk Students',
              titleAr: 'auto.SchoolDashboard.k51',
              content: 'Students inactive for 5+ days need immediate follow-up with parents.',
              contentAr: 'auto.SchoolDashboard.k52',
            },
            {
              id: '2',
              title: 'Weekly Reports',
              titleAr: 'auto.SchoolDashboard.k53',
              content: 'Share weekly progress reports with teachers to coordinate classroom support.',
              contentAr: 'auto.SchoolDashboard.k54',
            },
            {
              id: '3',
              title: 'Celebrate Success',
              titleAr: 'auto.SchoolDashboard.k55',
              content: 'Recognize students who complete the program in school assemblies.',
              contentAr: 'auto.SchoolDashboard.k56',
            },
          ]}
          variant="carousel"
        />
      </div>

      {/* At-Risk Alert */}
      {metrics.atRisk > 0 && (
        <div style={{ marginTop: spacing[4] }}>
          <InfoCard
            title={t('auto.SchoolDashboard.k27', "Alert: At-Risk Students")}
            titleAr="تنبيه: طلاب معرضون للخطر"
            content={`${metrics.atRisk} ${t('auto.SchoolDashboard.k28', "students need immediate intervention. Contact their parents.")}`}
            contentAr={`${metrics.atRisk} طلاب يحتاجون تدخلاً فورياً. تواصل مع أولياء أمورهم.`}
            variant="warning"
            isArabic={isArabic}
            actions={[
              {
                label: 'View At-Risk',
                labelAr: 'auto.SchoolDashboard.k57',
                onClick: () => setFilter('at_risk'),
              },
            ]}
          />
        </div>
      )}

      {/* Student Performance & Goals */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: spacing[4],
          marginTop: spacing[6],
        }}
      >
        {/* Student Leaderboard */}
        <Leaderboard
          entries={MOCK_LEADERBOARD.slice(0, 5)}
          isArabic={isArabic}
          variant="mini"
          title="Top Students"
          titleAr="أفضل الطلاب"
          showPoints
          maxDisplay={5}
        />

        {/* School Goals Summary */}
        <GoalSummary
          goals={MOCK_GOALS}
          isArabic={isArabic}
        />
      </div>

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

