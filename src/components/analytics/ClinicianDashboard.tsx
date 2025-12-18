import { useState, useMemo, useCallback, memo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useUser, usePermission } from '../../context/UserContext';
import { BackNavigation, SectionNav, ResponsiveStyles } from '../shared';
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

interface PatientData {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  age: number;
  startDate: number;
  sessionsCompleted: number;
  totalSessions: number;
  attentionScore: number;
  attentionBaseline: number;
  processingSpeed: number;
  processingBaseline: number;
  auditoryDiscrimination: number;
  auditoryBaseline: number;
  streak: number;
  lastActivity: number;
  treatmentPhase: 'assessment' | 'active' | 'maintenance' | 'completed';
  notes: string[];
  nextAppointment?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const MOCK_PATIENTS: PatientData[] = [
  {
    id: 'patient_1',
    name: 'Ahmed Hassan',
    nameAr: 'أحمد حسن',
    email: 'ahmed@example.com',
    age: 9,
    startDate: Date.now() - 86400000 * 35,
    sessionsCompleted: 14,
    totalSessions: 20,
    attentionScore: 78,
    attentionBaseline: 52,
    processingSpeed: 72,
    processingBaseline: 48,
    auditoryDiscrimination: 75,
    auditoryBaseline: 55,
    streak: 5,
    lastActivity: Date.now() - 86400000,
    treatmentPhase: 'active',
    notes: ['Good progress in Week 3', 'Responding well to high-frequency training'],
    nextAppointment: Date.now() + 86400000 * 2,
  },
  {
    id: 'patient_2',
    name: 'Sara Ali',
    nameAr: 'سارة علي',
    email: 'sara@example.com',
    age: 7,
    startDate: Date.now() - 86400000 * 50,
    sessionsCompleted: 20,
    totalSessions: 20,
    attentionScore: 88,
    attentionBaseline: 45,
    processingSpeed: 85,
    processingBaseline: 42,
    auditoryDiscrimination: 90,
    auditoryBaseline: 50,
    streak: 0,
    lastActivity: Date.now() - 86400000 * 3,
    treatmentPhase: 'completed',
    notes: ['Completed program successfully', 'Recommend follow-up in 3 months'],
  },
  {
    id: 'patient_3',
    name: 'Omar Khalid',
    nameAr: 'عمر خالد',
    email: 'omar@example.com',
    age: 11,
    startDate: Date.now() - 86400000 * 10,
    sessionsCompleted: 4,
    totalSessions: 20,
    attentionScore: 58,
    attentionBaseline: 55,
    processingSpeed: 52,
    processingBaseline: 50,
    auditoryDiscrimination: 54,
    auditoryBaseline: 52,
    streak: 2,
    lastActivity: Date.now() - 86400000 * 2,
    treatmentPhase: 'active',
    notes: ['Initial assessment complete', 'Showing early signs of improvement'],
    nextAppointment: Date.now() + 86400000,
  },
  {
    id: 'patient_4',
    name: 'Fatima Mohammed',
    nameAr: 'فاطمة محمد',
    email: 'fatima@example.com',
    age: 8,
    startDate: Date.now() - 86400000 * 25,
    sessionsCompleted: 10,
    totalSessions: 20,
    attentionScore: 68,
    attentionBaseline: 48,
    processingSpeed: 65,
    processingBaseline: 45,
    auditoryDiscrimination: 70,
    auditoryBaseline: 52,
    streak: 3,
    lastActivity: Date.now(),
    treatmentPhase: 'active',
    notes: ['Midway checkpoint - on track', 'Parents report improved focus at school'],
    nextAppointment: Date.now() + 86400000 * 5,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// PATIENT ROW COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const PatientRow = memo(({
  patient,
  isArabic,
  onSelect,
}: {
  patient: PatientData;
  isArabic: boolean;
  onSelect: () => void;
}) => {
  const progressPercent = Math.round((patient.sessionsCompleted / patient.totalSessions) * 100);

  const phaseConfig = {
    assessment: { color: brandPurple, label: { en: 'Assessment', ar: 'تقييم' } },
    active: { color: brandCyan, label: { en: 'Active', ar: 'نشط' } },
    maintenance: { color: '#f59e0b', label: { en: 'Maintenance', ar: 'صيانة' } },
    completed: { color: '#22c55e', label: { en: 'Completed', ar: 'مكتمل' } },
  };

  const phase = phaseConfig[patient.treatmentPhase];

  const getTimeAgo = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / 86400000);
    if (days === 0) return isArabic ? 'اليوم' : 'Today';
    if (days === 1) return isArabic ? 'أمس' : 'Yesterday';
    return isArabic ? `منذ ${days} أيام` : `${days}d ago`;
  };

  // Calculate improvement
  const attentionImprovement = patient.attentionScore - patient.attentionBaseline;

  return (
    <tr
      onClick={onSelect}
      style={{
        cursor: 'pointer',
        transition: transitions.fast,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(143,211,204,0.05)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLTableRowElement).style.background = 'transparent';
      }}
    >
      <td style={{ padding: spacing[3] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.md,
              background: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}20)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: typography.weight.bold,
              color: brandCyan,
            }}
          >
            {patient.name[0]}
          </div>
          <div>
            <div
              style={{
                fontSize: typography.size.sm,
                fontWeight: typography.weight.semibold,
                color: colors.text.primary,
              }}
            >
              {isArabic ? patient.nameAr : patient.name}
            </div>
            <div
              style={{
                fontSize: typography.size.xs,
                color: colors.text.muted,
              }}
            >
              {patient.age} {isArabic ? 'سنوات' : 'y/o'}
            </div>
          </div>
        </div>
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
          <span
            style={{
              fontSize: typography.size.xs,
              color: colors.text.muted,
            }}
          >
            {patient.sessionsCompleted}/{patient.totalSessions}
          </span>
        </div>
      </td>
      <td style={{ padding: spacing[3], textAlign: 'center' }}>
        <span
          style={{
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            color: patient.attentionScore >= 70 ? '#22c55e' : patient.attentionScore >= 50 ? '#f59e0b' : '#ef4444',
          }}
        >
          {patient.attentionScore}%
        </span>
        {attentionImprovement > 0 && (
          <span
            style={{
              fontSize: typography.size.xs,
              color: '#22c55e',
              marginLeft: spacing[1],
            }}
          >
            +{attentionImprovement}
          </span>
        )}
      </td>
      <td style={{ padding: spacing[3], textAlign: 'center' }}>
        <span
          style={{
            padding: `${spacing[1]}px ${spacing[2.5]}px`,
            background: `${phase.color}15`,
            color: phase.color,
            borderRadius: radius.full,
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
          }}
        >
          {isArabic ? phase.label.ar : phase.label.en}
        </span>
      </td>
      <td
        style={{
          padding: spacing[3],
          fontSize: typography.size.xs,
          color: colors.text.muted,
          textAlign: 'center',
        }}
      >
        {getTimeAgo(patient.lastActivity)}
      </td>
      <td style={{ padding: spacing[3], textAlign: 'center' }}>
        {patient.streak > 0 ? (
          <span style={{ fontSize: typography.size.sm }}>
            🔥 {patient.streak}
          </span>
        ) : (
          <span style={{ color: colors.text.muted }}>-</span>
        )}
      </td>
    </tr>
  );
});
PatientRow.displayName = 'PatientRow';

// ═══════════════════════════════════════════════════════════════════════════
// PATIENT DETAIL MODAL
// ═══════════════════════════════════════════════════════════════════════════

const PatientDetailModal = memo(({
  patient,
  isArabic,
  onClose,
}: {
  patient: PatientData;
  isArabic: boolean;
  onClose: () => void;
}) => {
  const progressPercent = Math.round((patient.sessionsCompleted / patient.totalSessions) * 100);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5,6,13,0.88)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: spacing[4],
        animation: 'modalFadeIn 0.3s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.surface.overlay,
          borderRadius: radius.xl,
          maxWidth: 700,
          width: '100%',
          maxHeight: '88vh',
          overflow: 'auto',
          position: 'relative',
          border: `1px solid ${colors.border.emphasis}`,
          boxShadow: shadows['2xl'],
          animation: 'modalSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Gradient top border */}
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple}, ${brandPink})`,
            borderRadius: `${radius.xl}px ${radius.xl}px 0 0`,
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: spacing[3],
            [isArabic ? 'left' : 'right']: spacing[3],
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${colors.border.subtle}`,
            fontSize: typography.size.lg,
            cursor: 'pointer',
            color: colors.text.muted,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: radius.md,
            transition: transitions.fast,
          }}
        >
          ✕
        </button>

        <div style={{ padding: spacing[6] }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[4],
              marginBottom: spacing[6],
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: radius.lg,
                background: `linear-gradient(135deg, ${brandCyan}25, ${brandPurple}25)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: typography.weight.bold,
                color: brandCyan,
              }}
            >
              {patient.name[0]}
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: typography.size['2xl'],
                  fontWeight: typography.weight.black,
                  color: colors.text.primary,
                }}
              >
                {isArabic ? patient.nameAr : patient.name}
              </h2>
              <p
                style={{
                  margin: `${spacing[1]}px 0 0`,
                  fontSize: typography.size.sm,
                  color: colors.text.secondary,
                }}
              >
                {patient.age} {isArabic ? 'سنوات' : 'years old'} • {patient.email}
              </p>
              <p
                style={{
                  margin: `${spacing[1]}px 0 0`,
                  fontSize: typography.size.xs,
                  color: colors.text.muted,
                }}
              >
                {isArabic ? 'بدأ العلاج: ' : 'Started: '}
                {formatDate(patient.startDate)}
              </p>
            </div>
          </div>

          {/* Progress Overview */}
          <div
            style={{
              padding: spacing[4],
              background: `linear-gradient(135deg, ${brandCyan}08, ${brandPurple}05)`,
              borderRadius: radius.lg,
              marginBottom: spacing[5],
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: spacing[2],
              }}
            >
              <span style={{ fontSize: typography.size.sm, color: colors.text.secondary }}>
                {isArabic ? 'تقدم العلاج' : 'Treatment Progress'}
              </span>
              <span
                style={{
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.bold,
                  color: brandCyan,
                }}
              >
                {patient.sessionsCompleted}/{patient.totalSessions} {isArabic ? 'جلسات' : 'sessions'}
              </span>
            </div>
            <div
              style={{
                height: 10,
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
          </div>

          {/* Scores Comparison */}
          <h3
            style={{
              margin: `0 0 ${spacing[3]}px`,
              fontSize: typography.size.md,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
            }}
          >
            {isArabic ? 'تحسن الدرجات' : 'Score Improvement'}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: spacing[3],
              marginBottom: spacing[5],
            }}
          >
            <ScoreComparisonCard
              label={isArabic ? 'الانتباه' : 'Attention'}
              baseline={patient.attentionBaseline}
              current={patient.attentionScore}
              color={brandCyan}
            />
            <ScoreComparisonCard
              label={isArabic ? 'سرعة المعالجة' : 'Processing'}
              baseline={patient.processingBaseline}
              current={patient.processingSpeed}
              color={brandPurple}
            />
            <ScoreComparisonCard
              label={isArabic ? 'التمييز السمعي' : 'Auditory'}
              baseline={patient.auditoryBaseline}
              current={patient.auditoryDiscrimination}
              color={brandPink}
            />
          </div>

          {/* Clinical Notes */}
          {patient.notes.length > 0 && (
            <div style={{ marginBottom: spacing[5] }}>
              <h3
                style={{
                  margin: `0 0 ${spacing[3]}px`,
                  fontSize: typography.size.md,
                  fontWeight: typography.weight.bold,
                  color: colors.text.primary,
                }}
              >
                {isArabic ? 'ملاحظات سريرية' : 'Clinical Notes'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                {patient.notes.map((note, i) => (
                  <div
                    key={i}
                    style={{
                      padding: spacing[3],
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${colors.border.subtle}`,
                      borderRadius: radius.md,
                      fontSize: typography.size.sm,
                      color: colors.text.secondary,
                      [isArabic ? 'borderRight' : 'borderLeft']: `3px solid ${brandCyan}`,
                    }}
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Appointment */}
          {patient.nextAppointment && (
            <div
              style={{
                padding: spacing[4],
                background: `${brandPurple}10`,
                border: `1px solid ${brandPurple}25`,
                borderRadius: radius.lg,
                display: 'flex',
                alignItems: 'center',
                gap: spacing[3],
              }}
            >
              <span style={{ fontSize: 24 }}>📅</span>
              <div>
                <div
                  style={{
                    fontSize: typography.size.xs,
                    color: colors.text.muted,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {isArabic ? 'الموعد القادم' : 'Next Appointment'}
                </div>
                <div
                  style={{
                    fontSize: typography.size.base,
                    fontWeight: typography.weight.bold,
                    color: brandPurple,
                  }}
                >
                  {formatDate(patient.nextAppointment)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(24px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
});
PatientDetailModal.displayName = 'PatientDetailModal';

// ═══════════════════════════════════════════════════════════════════════════
// SCORE COMPARISON CARD
// ═══════════════════════════════════════════════════════════════════════════

const ScoreComparisonCard = memo(({
  label,
  baseline,
  current,
  color,
}: {
  label: string;
  baseline: number;
  current: number;
  color: string;
}) => {
  const improvement = current - baseline;

  return (
    <div
      style={{
        padding: spacing[3],
        background: `${color}08`,
        border: `1px solid ${color}20`,
        borderRadius: radius.lg,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: typography.size['2xl'],
          fontWeight: typography.weight.black,
          color,
        }}
      >
        {current}%
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
      <div
        style={{
          marginTop: spacing[2],
          padding: `${spacing[1]}px ${spacing[2]}px`,
          background: improvement > 0 ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
          borderRadius: radius.full,
          fontSize: typography.size.xs,
          fontWeight: typography.weight.bold,
          color: improvement > 0 ? '#22c55e' : colors.text.muted,
          display: 'inline-block',
        }}
      >
        {improvement > 0 ? '+' : ''}{improvement}% from baseline
      </div>
    </div>
  );
});
ScoreComparisonCard.displayName = 'ScoreComparisonCard';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

export default function ClinicianDashboard() {
  const { isArabic, direction } = useLanguage();
  const { user } = useUser();
  const hasAccess = usePermission('view_patient_reports');
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPhase, setFilterPhase] = useState<string>('all');

  const filteredPatients = useMemo(() => {
    return MOCK_PATIENTS.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.nameAr.includes(searchTerm);
      const matchesPhase = filterPhase === 'all' || patient.treatmentPhase === filterPhase;
      return matchesSearch && matchesPhase;
    });
  }, [searchTerm, filterPhase]);

  const stats = useMemo(() => {
    const total = MOCK_PATIENTS.length;
    const active = MOCK_PATIENTS.filter((p) => p.treatmentPhase === 'active').length;
    const completed = MOCK_PATIENTS.filter((p) => p.treatmentPhase === 'completed').length;
    const avgImprovement = Math.round(
      MOCK_PATIENTS.reduce((sum, p) => sum + (p.attentionScore - p.attentionBaseline), 0) / total
    );
    return { total, active, completed, avgImprovement };
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
            ? 'يجب أن تكون طبيباً للوصول إلى هذه اللوحة'
            : 'You must be a clinician to access this dashboard'}
        </p>
      </div>
    );
  }

  return (
    <section
      id="clinician-dashboard"
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
              background: `linear-gradient(135deg, ${brandPurple}20, ${brandCyan}20)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            👨‍⚕️
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
              {isArabic ? 'لوحة الطبيب' : 'Clinician Dashboard'}
            </h1>
            <p style={{ margin: 0, color: colors.text.secondary, fontSize: typography.size.sm }}>
              {user?.clinic || (isArabic ? 'مركز لوتس AIT' : 'Lotus AIT Center')}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: spacing[8] }}>
        <StatCard
          label={isArabic ? 'إجمالي المرضى' : 'Total Patients'}
          value={stats.total}
          icon="👥"
          color={brandCyan}
        />
        <StatCard
          label={isArabic ? 'علاج نشط' : 'Active Treatment'}
          value={stats.active}
          icon="🏥"
          color={brandPurple}
        />
        <StatCard
          label={isArabic ? 'أكملوا البرنامج' : 'Completed'}
          value={stats.completed}
          icon="✅"
          color="#22c55e"
        />
        <StatCard
          label={isArabic ? 'متوسط التحسن' : 'Avg Improvement'}
          value={`+${stats.avgImprovement}%`}
          icon="📈"
          color="#f59e0b"
        />
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: spacing[3],
          marginBottom: spacing[4],
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder={isArabic ? 'بحث عن مريض...' : 'Search patients...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            padding: `${spacing[2.5]}px ${spacing[4]}px`,
            background: colors.surface.input,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.lg,
            color: colors.text.primary,
            fontSize: typography.size.sm,
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: spacing[2] }}>
          {['all', 'active', 'completed', 'assessment'].map((phase) => {
            const labels: Record<string, { en: string; ar: string }> = {
              all: { en: 'All', ar: 'الكل' },
              active: { en: 'Active', ar: 'نشط' },
              completed: { en: 'Completed', ar: 'مكتمل' },
              assessment: { en: 'Assessment', ar: 'تقييم' },
            };
            const isActive = filterPhase === phase;

            return (
              <button
                key={phase}
                onClick={() => setFilterPhase(phase)}
                style={{
                  padding: `${spacing[2]}px ${spacing[3]}px`,
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
                {isArabic ? labels[phase].ar : labels[phase].en}
              </button>
            );
          })}
        </div>
      </div>

      {/* Patients Table */}
      <div
        style={{
          background: colors.surface.card,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radius.xl,
          overflow: 'hidden',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${colors.border.default}`,
                background: 'rgba(143,211,204,0.05)',
              }}
            >
              <th
                style={{
                  padding: spacing[3],
                  textAlign: isArabic ? 'right' : 'left',
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color: colors.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {isArabic ? 'المريض' : 'Patient'}
              </th>
              <th
                style={{
                  padding: spacing[3],
                  textAlign: isArabic ? 'right' : 'left',
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color: colors.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {isArabic ? 'التقدم' : 'Progress'}
              </th>
              <th
                style={{
                  padding: spacing[3],
                  textAlign: 'center',
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color: colors.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {isArabic ? 'الانتباه' : 'Attention'}
              </th>
              <th
                style={{
                  padding: spacing[3],
                  textAlign: 'center',
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color: colors.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {isArabic ? 'الحالة' : 'Status'}
              </th>
              <th
                style={{
                  padding: spacing[3],
                  textAlign: 'center',
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color: colors.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {isArabic ? 'آخر نشاط' : 'Last Active'}
              </th>
              <th
                style={{
                  padding: spacing[3],
                  textAlign: 'center',
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color: colors.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {isArabic ? 'الاستمرارية' : 'Streak'}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <PatientRow
                key={patient.id}
                patient={patient}
                isArabic={isArabic}
                onSelect={() => setSelectedPatient(patient)}
              />
            ))}
          </tbody>
        </table>

        {filteredPatients.length === 0 && (
          <div
            style={{
              padding: spacing[10],
              textAlign: 'center',
              color: colors.text.muted,
            }}
          >
            {isArabic ? 'لا يوجد مرضى مطابقين' : 'No matching patients'}
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          isArabic={isArabic}
          onClose={() => setSelectedPatient(null)}
        />
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
          variant="pills"
          title="Quick Access"
          titleAr="وصول سريع"
        />
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════════════════════════════

const StatCard = memo(({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}) => (
  <div
    style={{
      padding: spacing[4],
      background: `linear-gradient(135deg, ${color}10, transparent)`,
      border: `1px solid ${color}25`,
      borderRadius: radius.lg,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: radius.md,
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: typography.size.xs,
            color: colors.text.muted,
            marginTop: 2,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  </div>
));
StatCard.displayName = 'StatCard';
