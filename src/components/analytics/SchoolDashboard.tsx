import { useState, useMemo, memo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser, usePermission } from '../../context/UserContext';
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
} from '../styles';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface StudentData {
  id: string;
  name: string;
  nameAr: string;
  grade: string;
  sessionsCompleted: number;
  totalSessions: number;
  attentionScore: number;
  processingSpeed: number;
  lastActivity: number;
  status: 'on_track' | 'needs_attention' | 'at_risk' | 'completed';
}

interface WeeklyProgress {
  week: string;
  weekAr: string;
  sessionsCompleted: number;
  averageScore: number;
  activeStudents: number;
}

interface GradeDistribution {
  grade: string;
  gradeAr: string;
  count: number;
  averageProgress: number;
  color: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const MOCK_STUDENTS: StudentData[] = [
  { id: '1', name: 'Ahmed Hassan', nameAr: 'أحمد حسن', grade: 'Grade 3', sessionsCompleted: 18, totalSessions: 20, attentionScore: 85, processingSpeed: 78, lastActivity: Date.now() - 86400000, status: 'on_track' },
  { id: '2', name: 'Sara Ali', nameAr: 'سارة علي', grade: 'Grade 4', sessionsCompleted: 20, totalSessions: 20, attentionScore: 92, processingSpeed: 88, lastActivity: Date.now() - 172800000, status: 'completed' },
  { id: '3', name: 'Omar Khalid', nameAr: 'عمر خالد', grade: 'Grade 2', sessionsCompleted: 8, totalSessions: 20, attentionScore: 62, processingSpeed: 55, lastActivity: Date.now() - 604800000, status: 'at_risk' },
  { id: '4', name: 'Fatima Mohammed', nameAr: 'فاطمة محمد', grade: 'Grade 3', sessionsCompleted: 14, totalSessions: 20, attentionScore: 75, processingSpeed: 72, lastActivity: Date.now() - 259200000, status: 'needs_attention' },
  { id: '5', name: 'Yusuf Ibrahim', nameAr: 'يوسف إبراهيم', grade: 'Grade 5', sessionsCompleted: 16, totalSessions: 20, attentionScore: 88, processingSpeed: 82, lastActivity: Date.now() - 86400000, status: 'on_track' },
  { id: '6', name: 'Layla Ahmad', nameAr: 'ليلى أحمد', grade: 'Grade 4', sessionsCompleted: 12, totalSessions: 20, attentionScore: 70, processingSpeed: 68, lastActivity: Date.now() - 432000000, status: 'needs_attention' },
  { id: '7', name: 'Khaled Nasser', nameAr: 'خالد ناصر', grade: 'Grade 2', sessionsCompleted: 6, totalSessions: 20, attentionScore: 58, processingSpeed: 52, lastActivity: Date.now() - 864000000, status: 'at_risk' },
  { id: '8', name: 'Noor Saleh', nameAr: 'نور صالح', grade: 'Grade 5', sessionsCompleted: 19, totalSessions: 20, attentionScore: 90, processingSpeed: 85, lastActivity: Date.now(), status: 'on_track' },
];

const MOCK_WEEKLY: WeeklyProgress[] = [
  { week: 'Week 1', weekAr: 'الأسبوع 1', sessionsCompleted: 24, averageScore: 65, activeStudents: 8 },
  { week: 'Week 2', weekAr: 'الأسبوع 2', sessionsCompleted: 32, averageScore: 68, activeStudents: 8 },
  { week: 'Week 3', weekAr: 'الأسبوع 3', sessionsCompleted: 28, averageScore: 72, activeStudents: 7 },
  { week: 'Week 4', weekAr: 'الأسبوع 4', sessionsCompleted: 35, averageScore: 75, activeStudents: 8 },
  { week: 'Week 5', weekAr: 'الأسبوع 5', sessionsCompleted: 30, averageScore: 78, activeStudents: 6 },
  { week: 'Week 6', weekAr: 'الأسبوع 6', sessionsCompleted: 38, averageScore: 80, activeStudents: 8 },
];

const MOCK_GRADES: GradeDistribution[] = [
  { grade: 'Grade 2', gradeAr: 'الصف الثاني', count: 2, averageProgress: 35, color: brandPink },
  { grade: 'Grade 3', gradeAr: 'الصف الثالث', count: 2, averageProgress: 80, color: brandCyan },
  { grade: 'Grade 4', gradeAr: 'الصف الرابع', count: 2, averageProgress: 80, color: brandPurple },
  { grade: 'Grade 5', gradeAr: 'الصف الخامس', count: 2, averageProgress: 87, color: '#22c55e' },
];

// ═══════════════════════════════════════════════════════════════════════════
// METRIC CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const MetricCard = memo(({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  trend?: { value: number; isPositive: boolean };
}) => (
  <div
    style={{
      padding: spacing[5],
      background: `linear-gradient(135deg, ${color}08, transparent)`,
      border: `1px solid ${color}25`,
      borderRadius: radius.xl,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Decorative gradient */}
    <div
      style={{
        position: 'absolute',
        top: -30,
        right: -30,
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}15, transparent 70%)`,
        pointerEvents: 'none',
      }}
    />

    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <div
          style={{
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            color: colors.text.muted,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginBottom: spacing[2],
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: typography.size['3xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: typography.size.sm,
              color: colors.text.secondary,
              marginTop: spacing[1],
            }}
          >
            {subtitle}
          </div>
        )}
        {trend && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing[1],
              marginTop: spacing[2],
              padding: `${spacing[1]}px ${spacing[2]}px`,
              background: trend.isPositive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
              borderRadius: radius.full,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.bold,
              color: trend.isPositive ? '#22c55e' : '#ef4444',
            }}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: radius.lg,
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
        }}
      >
        {icon}
      </div>
    </div>
  </div>
));
MetricCard.displayName = 'MetricCard';

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
  const maxSessions = Math.max(...data.map(d => d.sessionsCompleted));

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
            {isArabic ? week.weekAr : week.week}
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
              {week.sessionsCompleted} {isArabic ? 'جلسة' : 'sessions'}
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
  const statusColors: Record<StudentData['status'], { bg: string; text: string; label: string; labelAr: string }> = {
    on_track: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', label: 'On Track', labelAr: 'على المسار' },
    completed: { bg: 'rgba(143,211,204,0.15)', text: brandCyan, label: 'Completed', labelAr: 'مكتمل' },
    needs_attention: { bg: 'rgba(234,179,8,0.15)', text: '#eab308', label: 'Needs Attention', labelAr: 'يحتاج انتباه' },
    at_risk: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', label: 'At Risk', labelAr: 'معرض للخطر' },
  };

  const getTimeAgo = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / 86400000);
    if (days === 0) return isArabic ? 'اليوم' : 'Today';
    if (days === 1) return isArabic ? 'أمس' : 'Yesterday';
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
              {isArabic ? 'الاسم' : 'Name'}
            </th>
            <th style={{ padding: spacing[3], fontWeight: typography.weight.bold, color: colors.text.secondary }}>
              {isArabic ? 'الصف' : 'Grade'}
            </th>
            <th style={{ padding: spacing[3], fontWeight: typography.weight.bold, color: colors.text.secondary }}>
              {isArabic ? 'التقدم' : 'Progress'}
            </th>
            <th style={{ padding: spacing[3], fontWeight: typography.weight.bold, color: colors.text.secondary }}>
              {isArabic ? 'الانتباه' : 'Attention'}
            </th>
            <th style={{ padding: spacing[3], fontWeight: typography.weight.bold, color: colors.text.secondary }}>
              {isArabic ? 'آخر نشاط' : 'Last Active'}
            </th>
            <th style={{ padding: spacing[3], fontWeight: typography.weight.bold, color: colors.text.secondary }}>
              {isArabic ? 'الحالة' : 'Status'}
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => {
            const status = statusColors[student.status];
            const progressPercent = Math.round((student.sessionsCompleted / student.totalSessions) * 100);

            return (
              <tr
                key={student.id}
                style={{
                  borderBottom: `1px solid ${colors.border.subtle}`,
                  transition: transitions.fast,
                }}
              >
                <td style={{ padding: spacing[3], color: colors.text.primary, fontWeight: typography.weight.semibold }}>
                  {isArabic ? student.nameAr : student.name}
                </td>
                <td style={{ padding: spacing[3], color: colors.text.secondary }}>
                  {student.grade}
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
                    {isArabic ? status.labelAr : status.label}
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
  const { isArabic, direction } = useLanguage();
  const { user } = useUser();
  const hasAccess = usePermission('school_analytics');
  const [filter, setFilter] = useState<'all' | 'at_risk' | 'on_track' | 'completed'>('all');

  const filteredStudents = useMemo(() => {
    if (filter === 'all') return MOCK_STUDENTS;
    return MOCK_STUDENTS.filter(s => s.status === filter);
  }, [filter]);

  const metrics = useMemo(() => {
    const totalStudents = MOCK_STUDENTS.length;
    const completed = MOCK_STUDENTS.filter(s => s.status === 'completed').length;
    const atRisk = MOCK_STUDENTS.filter(s => s.status === 'at_risk').length;
    const avgAttention = Math.round(MOCK_STUDENTS.reduce((sum, s) => sum + s.attentionScore, 0) / totalStudents);
    const avgProgress = Math.round(MOCK_STUDENTS.reduce((sum, s) => sum + (s.sessionsCompleted / s.totalSessions) * 100, 0) / totalStudents);

    return { totalStudents, completed, atRisk, avgAttention, avgProgress };
  }, []);

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
          {isArabic ? 'الوصول مقيد' : 'Access Restricted'}
        </h2>
        <p>
          {isArabic
            ? 'يجب أن تكون مسؤول مدرسة للوصول إلى هذه اللوحة'
            : 'You must be a school administrator to access this dashboard'}
        </p>
      </div>
    );
  }

  return (
    <section
      id="school-dashboard"
      style={{
        padding: `${spacing[10]}px ${spacing[4]}px`,
        maxWidth: 1200,
        margin: '0 auto',
        direction,
      }}
    >
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
                fontFamily: typography.fontFamily,
              }}
            >
              {isArabic ? 'لوحة تحكم المدرسة' : 'School Analytics Dashboard'}
            </h1>
            <p style={{ margin: 0, color: colors.text.secondary, fontSize: typography.size.sm }}>
              {user?.school || (isArabic ? 'الأكاديمية الدولية' : 'International Academy')}
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: spacing[4],
          marginBottom: spacing[8],
        }}
      >
        <MetricCard
          title={isArabic ? 'إجمالي الطلاب' : 'Total Students'}
          value={metrics.totalStudents}
          subtitle={isArabic ? 'مسجلين في البرنامج' : 'Enrolled in program'}
          icon="👥"
          color={brandCyan}
        />
        <MetricCard
          title={isArabic ? 'متوسط التقدم' : 'Avg. Progress'}
          value={`${metrics.avgProgress}%`}
          subtitle={isArabic ? 'من الجلسات المكتملة' : 'Sessions completed'}
          icon="📈"
          color={brandPurple}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title={isArabic ? 'مكتملون' : 'Completed'}
          value={metrics.completed}
          subtitle={isArabic ? 'أنهوا البرنامج' : 'Finished program'}
          icon="✅"
          color="#22c55e"
        />
        <MetricCard
          title={isArabic ? 'يحتاجون انتباه' : 'Need Attention'}
          value={metrics.atRisk}
          subtitle={isArabic ? 'طلاب معرضون للخطر' : 'At-risk students'}
          icon="⚠️"
          color="#ef4444"
        />
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: spacing[6],
          marginBottom: spacing[8],
        }}
      >
        {/* Weekly Progress Chart */}
        <div
          style={{
            padding: spacing[5],
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
            {isArabic ? 'التقدم الأسبوعي' : 'Weekly Progress'}
          </h3>
          <ProgressBarChart data={MOCK_WEEKLY} isArabic={isArabic} />
        </div>

        {/* Grade Distribution */}
        <div
          style={{
            padding: spacing[5],
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
            {isArabic ? 'توزيع الصفوف' : 'Grade Distribution'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {MOCK_GRADES.map(grade => (
              <div key={grade.grade} style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                <div
                  style={{
                    width: 90,
                    fontSize: typography.size.sm,
                    color: colors.text.secondary,
                  }}
                >
                  {isArabic ? grade.gradeAr : grade.grade}
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
                      {grade.count} {isArabic ? 'طلاب' : 'students'} • {grade.averageProgress}%
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
            {isArabic ? 'قائمة الطلاب' : 'Student List'}
          </h3>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: spacing[2] }}>
            {(['all', 'on_track', 'at_risk', 'completed'] as const).map(f => {
              const labels = {
                all: { en: 'All', ar: 'الكل' },
                on_track: { en: 'On Track', ar: 'على المسار' },
                at_risk: { en: 'At Risk', ar: 'معرض' },
                completed: { en: 'Completed', ar: 'مكتمل' },
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
    </section>
  );
}
