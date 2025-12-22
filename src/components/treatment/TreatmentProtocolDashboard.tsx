/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - Treatment Protocol Dashboard
 * Comprehensive 10-day Bérard AIT treatment management interface
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
} from '../styles';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface DaySession {
  id: string;
  dayNumber: number;
  date: string;
  morningSession: SessionDetails;
  afternoonSession: SessionDetails;
  status: 'upcoming' | 'in_progress' | 'completed' | 'rest_day';
  notes: string;
}

interface SessionDetails {
  time: string;
  duration: number;
  completed: boolean;
  audioSettings: {
    volume: number;
    frequencyFilters: number[];
    musicTrack: string;
  };
  observations: {
    attention: number;
    cooperation: number;
    comfort: number;
    notes: string;
  };
}

interface PatientInfo {
  name: string;
  age: number;
  condition: string;
  startDate: string;
  clinician: string;
  phase: 'assessment' | 'treatment' | 'follow_up';
}

interface TreatmentProtocolDashboardProps {
  patientId?: string;
  onSessionStart?: (sessionId: string) => void;
  onSessionComplete?: (sessionId: string, observations: SessionDetails['observations']) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

const mockPatient: PatientInfo = {
  name: 'أحمد محمد',
  age: 8,
  condition: 'APD / ADHD',
  startDate: '2024-01-15',
  clinician: 'د. سارة العتيبي',
  phase: 'treatment',
};

const generateMockSessions = (): DaySession[] => {
  const sessions: DaySession[] = [];
  const baseDate = new Date('2024-01-15');

  for (let day = 1; day <= 10; day++) {
    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + day - 1);

    const isRestDay = day === 6;
    const isCompleted = day <= 3;
    const isToday = day === 4;

    sessions.push({
      id: `day-${day}`,
      dayNumber: day,
      date: currentDate.toISOString().split('T')[0],
      status: isRestDay ? 'rest_day' : isCompleted ? 'completed' : isToday ? 'in_progress' : 'upcoming',
      morningSession: {
        time: '09:00',
        duration: 30,
        completed: isCompleted,
        audioSettings: {
          volume: 65,
          frequencyFilters: [750, 1000, 2000, 4000],
          musicTrack: 'classical_01',
        },
        observations: isCompleted ? {
          attention: 4,
          cooperation: 5,
          comfort: 4,
          notes: 'Good focus during session',
        } : { attention: 0, cooperation: 0, comfort: 0, notes: '' },
      },
      afternoonSession: {
        time: '15:00',
        duration: 30,
        completed: isCompleted,
        audioSettings: {
          volume: 68,
          frequencyFilters: [750, 1000, 2000, 4000],
          musicTrack: 'classical_02',
        },
        observations: isCompleted ? {
          attention: 4,
          cooperation: 4,
          comfort: 5,
          notes: 'Slight fatigue at end',
        } : { attention: 0, cooperation: 0, comfort: 0, notes: '' },
      },
      notes: isCompleted ? 'Day completed successfully' : '',
    });
  }

  return sessions;
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    padding: spacing[6],
    background: brand.ink,
    minHeight: '100vh',
  } as React.CSSProperties,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[8],
    flexWrap: 'wrap' as const,
    gap: spacing[4],
  } as React.CSSProperties,

  patientCard: {
    ...cards.glass,
    padding: spacing[5],
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
    flex: '1',
    minWidth: '300px',
  } as React.CSSProperties,

  patientAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: gradients.cyanPurple,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    flexShrink: 0,
  } as React.CSSProperties,

  patientInfo: {
    flex: 1,
  } as React.CSSProperties,

  patientName: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: '#fff',
    marginBottom: spacing[1],
  } as React.CSSProperties,

  patientMeta: {
    display: 'flex',
    gap: spacing[4],
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  metaItem: {
    fontSize: typography.size.sm,
    color: '#888',
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  } as React.CSSProperties,

  progressCard: {
    ...cards.glass,
    padding: spacing[5],
    minWidth: '250px',
  } as React.CSSProperties,

  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  } as React.CSSProperties,

  progressLabel: {
    fontSize: typography.size.sm,
    color: '#888',
  } as React.CSSProperties,

  progressValue: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    background: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  } as React.CSSProperties,

  progressBar: {
    height: '8px',
    background: '#333',
    borderRadius: radius.full,
    overflow: 'hidden',
  } as React.CSSProperties,

  progressFill: {
    height: '100%',
    background: gradients.cyanPurple,
    borderRadius: radius.full,
    transition: 'width 0.5s ease',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: '#fff',
    marginBottom: spacing[6],
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  } as React.CSSProperties,

  timelineContainer: {
    display: 'flex',
    gap: spacing[3],
    overflowX: 'auto' as const,
    paddingBottom: spacing[4],
    marginBottom: spacing[8],
  } as React.CSSProperties,

  dayCard: {
    ...cards.glass,
    padding: spacing[4],
    minWidth: '140px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: transitions.normal,
    position: 'relative' as const,
    flexShrink: 0,
  } as React.CSSProperties,

  dayCardActive: {
    border: `2px solid ${brand.cyan}`,
    boxShadow: shadows.glow.cyan,
  } as React.CSSProperties,

  dayCardCompleted: {
    border: `2px solid ${brand.purple}40`,
    background: `${brand.purple}10`,
  } as React.CSSProperties,

  dayCardRest: {
    background: `${brand.pink}10`,
    border: `2px dashed ${brand.pink}40`,
  } as React.CSSProperties,

  dayNumber: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    marginBottom: spacing[1],
  } as React.CSSProperties,

  dayDate: {
    fontSize: typography.size.xs,
    color: '#666',
    marginBottom: spacing[2],
  } as React.CSSProperties,

  dayStatus: {
    fontSize: typography.size.xs,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: radius.full,
    display: 'inline-block',
  } as React.CSSProperties,

  sessionIndicators: {
    display: 'flex',
    justifyContent: 'center',
    gap: spacing[2],
    marginTop: spacing[2],
  } as React.CSSProperties,

  sessionDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#333',
  } as React.CSSProperties,

  sessionDotCompleted: {
    background: brand.cyan,
  } as React.CSSProperties,

  sessionDotInProgress: {
    background: brand.pink,
    animation: 'pulse 2s infinite',
  } as React.CSSProperties,

  detailsPanel: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: spacing[6],
    marginBottom: spacing[8],
  } as React.CSSProperties,

  sessionCard: {
    ...cards.glass,
    padding: spacing[5],
  } as React.CSSProperties,

  sessionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
    paddingBottom: spacing[3],
    borderBottom: '1px solid #333',
  } as React.CSSProperties,

  sessionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  } as React.CSSProperties,

  sessionTime: {
    fontSize: typography.size.sm,
    color: brand.cyan,
    background: `${brand.cyan}20`,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: radius.md,
  } as React.CSSProperties,

  settingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: spacing[4],
    marginBottom: spacing[4],
  } as React.CSSProperties,

  settingItem: {
    background: `${brand.ink}`,
    padding: spacing[3],
    borderRadius: radius.md,
  } as React.CSSProperties,

  settingLabel: {
    fontSize: typography.size.xs,
    color: '#666',
    marginBottom: spacing[1],
  } as React.CSSProperties,

  settingValue: {
    fontSize: typography.size.base,
    color: '#fff',
    fontWeight: typography.weight.bold,
  } as React.CSSProperties,

  observationsSection: {
    marginTop: spacing[4],
    paddingTop: spacing[4],
    borderTop: '1px solid #333',
  } as React.CSSProperties,

  observationsTitle: {
    fontSize: typography.size.sm,
    color: '#888',
    marginBottom: spacing[3],
  } as React.CSSProperties,

  ratingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing[2]} 0`,
  } as React.CSSProperties,

  ratingLabel: {
    fontSize: typography.size.sm,
    color: '#aaa',
  } as React.CSSProperties,

  ratingStars: {
    display: 'flex',
    gap: spacing[1],
  } as React.CSSProperties,

  star: {
    fontSize: typography.size.lg,
    cursor: 'pointer',
  } as React.CSSProperties,

  notesTextarea: {
    width: '100%',
    minHeight: '80px',
    background: `${brand.ink}`,
    border: '1px solid #333',
    borderRadius: radius.md,
    padding: spacing[3],
    color: '#fff',
    fontSize: typography.size.sm,
    resize: 'vertical' as const,
    marginTop: spacing[3],
  } as React.CSSProperties,

  actionButtons: {
    display: 'flex',
    gap: spacing[3],
    marginTop: spacing[4],
  } as React.CSSProperties,

  startButton: {
    ...buttons.primary,
    flex: 1,
    padding: spacing[3],
    background: gradients.cyanPurple,
  } as React.CSSProperties,

  completeButton: {
    ...buttons.primary,
    flex: 1,
    padding: spacing[3],
    background: brand.purple,
  } as React.CSSProperties,

  frequencyVisualizer: {
    background: `${brand.ink}`,
    borderRadius: radius.lg,
    padding: spacing[4],
    marginTop: spacing[4],
    height: '100px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    gap: spacing[1],
  } as React.CSSProperties,

  frequencyBar: {
    width: '30px',
    borderRadius: `${radius.md} ${radius.md} 0 0`,
    transition: 'height 0.3s ease',
  } as React.CSSProperties,

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing[4],
  } as React.CSSProperties,

  statCard: {
    ...cards.glass,
    padding: spacing[4],
    textAlign: 'center' as const,
  } as React.CSSProperties,

  statValue: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    background: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: spacing[1],
  } as React.CSSProperties,

  statLabel: {
    fontSize: typography.size.sm,
    color: '#888',
  } as React.CSSProperties,

  phaseIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[2]} ${spacing[4]}`,
    borderRadius: radius.full,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const StarRating: React.FC<{
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}> = ({ value, onChange, readonly = false }) => (
  <div style={styles.ratingStars}>
    {[1, 2, 3, 4, 5].map(star => (
      <span
        key={star}
        style={{
          ...styles.star,
          color: star <= value ? '#FFD700' : '#333',
          cursor: readonly ? 'default' : 'pointer',
        }}
        onClick={() => !readonly && onChange?.(star)}
      >
        ★
      </span>
    ))}
  </div>
);

const FrequencyVisualizer: React.FC<{ frequencies: number[]; active?: boolean }> = ({
  frequencies,
  active = false,
}) => {
  const colors = [brand.cyan, brand.purple, brand.pink, '#FFD700', '#00CED1'];

  return (
    <div style={styles.frequencyVisualizer}>
      {frequencies.map((freq, idx) => {
        const height = active ? 30 + Math.random() * 50 : 20;
        return (
          <div
            key={freq}
            style={{
              ...styles.frequencyBar,
              height: `${height}%`,
              background: colors[idx % colors.length],
              opacity: active ? 1 : 0.5,
            }}
            title={`${freq} Hz`}
          />
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const TreatmentProtocolDashboard: React.FC<TreatmentProtocolDashboardProps> = ({
  onSessionStart,
  onSessionComplete,
}) => {
  const { isArabic } = useLanguage();
  const [sessions] = useState<DaySession[]>(generateMockSessions);
  const [selectedDay, setSelectedDay] = useState<number>(4);
  const [activeSession, setActiveSession] = useState<'morning' | 'afternoon' | null>(null);

  const selectedDayData = useMemo(
    () => sessions.find(s => s.dayNumber === selectedDay),
    [sessions, selectedDay]
  );

  const completedSessions = useMemo(
    () => sessions.filter(s => s.status === 'completed').length * 2,
    [sessions]
  );

  const totalSessions = 20; // 10 days × 2 sessions
  const progressPercent = (completedSessions / totalSessions) * 100;

  const getStatusStyle = (status: DaySession['status']) => {
    switch (status) {
      case 'completed':
        return { background: `${brand.purple}30`, color: brand.purple };
      case 'in_progress':
        return { background: `${brand.cyan}30`, color: brand.cyan };
      case 'rest_day':
        return { background: `${brand.pink}30`, color: brand.pink };
      default:
        return { background: '#333', color: '#888' };
    }
  };

  const getStatusLabel = (status: DaySession['status']) => {
    const labels = {
      completed: isArabic ? 'مكتمل' : 'Completed',
      in_progress: isArabic ? 'جاري' : 'In Progress',
      rest_day: isArabic ? 'يوم راحة' : 'Rest Day',
      upcoming: isArabic ? 'قادم' : 'Upcoming',
    };
    return labels[status];
  };

  const handleStartSession = useCallback((period: 'morning' | 'afternoon') => {
    setActiveSession(period);
    onSessionStart?.(`day-${selectedDay}-${period}`);
  }, [selectedDay, onSessionStart]);

  const handleCompleteSession = useCallback(() => {
    if (activeSession && selectedDayData) {
      const session = activeSession === 'morning'
        ? selectedDayData.morningSession
        : selectedDayData.afternoonSession;
      onSessionComplete?.(`day-${selectedDay}-${activeSession}`, session.observations);
      setActiveSession(null);
    }
  }, [activeSession, selectedDay, selectedDayData, onSessionComplete]);

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.patientCard}>
          <div style={styles.patientAvatar}>👤</div>
          <div style={styles.patientInfo}>
            <h1 style={styles.patientName}>{mockPatient.name}</h1>
            <div style={styles.patientMeta}>
              <span style={styles.metaItem}>🎂 {mockPatient.age} {isArabic ? 'سنوات' : 'years'}</span>
              <span style={styles.metaItem}>🏥 {mockPatient.condition}</span>
              <span style={styles.metaItem}>👩‍⚕️ {mockPatient.clinician}</span>
            </div>
          </div>
          <div
            style={{
              ...styles.phaseIndicator,
              background: `${brand.cyan}20`,
              color: brand.cyan,
            }}
          >
            🎧 {isArabic ? 'مرحلة العلاج' : 'Treatment Phase'}
          </div>
        </div>

        <div style={styles.progressCard}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>
              {isArabic ? 'التقدم الكلي' : 'Overall Progress'}
            </span>
            <span style={styles.progressValue}>
              {completedSessions}/{totalSessions}
            </span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* 10-Day Timeline */}
      <h2 style={styles.sectionTitle}>
        📅 {isArabic ? 'جدول العلاج - 10 أيام' : '10-Day Treatment Schedule'}
      </h2>
      <div style={styles.timelineContainer}>
        {sessions.map(day => (
          <div
            key={day.id}
            style={{
              ...styles.dayCard,
              ...(selectedDay === day.dayNumber ? styles.dayCardActive : {}),
              ...(day.status === 'completed' ? styles.dayCardCompleted : {}),
              ...(day.status === 'rest_day' ? styles.dayCardRest : {}),
            }}
            onClick={() => setSelectedDay(day.dayNumber)}
          >
            <div
              style={{
                ...styles.dayNumber,
                color: day.status === 'completed' ? brand.purple :
                       day.status === 'in_progress' ? brand.cyan :
                       day.status === 'rest_day' ? brand.pink : '#666',
              }}
            >
              {isArabic ? `يوم ${day.dayNumber}` : `Day ${day.dayNumber}`}
            </div>
            <div style={styles.dayDate}>
              {new Date(day.date).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </div>
            <span style={{ ...styles.dayStatus, ...getStatusStyle(day.status) }}>
              {getStatusLabel(day.status)}
            </span>
            {day.status !== 'rest_day' && (
              <div style={styles.sessionIndicators}>
                <div
                  style={{
                    ...styles.sessionDot,
                    ...(day.morningSession.completed ? styles.sessionDotCompleted : {}),
                    ...(day.status === 'in_progress' && !day.morningSession.completed
                      ? styles.sessionDotInProgress : {}),
                  }}
                  title={isArabic ? 'صباحي' : 'Morning'}
                />
                <div
                  style={{
                    ...styles.sessionDot,
                    ...(day.afternoonSession.completed ? styles.sessionDotCompleted : {}),
                  }}
                  title={isArabic ? 'مسائي' : 'Afternoon'}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Session Details */}
      {selectedDayData && selectedDayData.status !== 'rest_day' && (
        <>
          <h2 style={styles.sectionTitle}>
            🎧 {isArabic ? `جلسات اليوم ${selectedDay}` : `Day ${selectedDay} Sessions`}
          </h2>
          <div style={styles.detailsPanel}>
            {/* Morning Session */}
            <div style={styles.sessionCard}>
              <div style={styles.sessionHeader}>
                <span style={styles.sessionTitle}>
                  ☀️ {isArabic ? 'الجلسة الصباحية' : 'Morning Session'}
                </span>
                <span style={styles.sessionTime}>
                  {selectedDayData.morningSession.time} • {selectedDayData.morningSession.duration} {isArabic ? 'دقيقة' : 'min'}
                </span>
              </div>

              <div style={styles.settingsGrid}>
                <div style={styles.settingItem}>
                  <div style={styles.settingLabel}>🔊 {isArabic ? 'مستوى الصوت' : 'Volume'}</div>
                  <div style={styles.settingValue}>{selectedDayData.morningSession.audioSettings.volume}%</div>
                </div>
                <div style={styles.settingItem}>
                  <div style={styles.settingLabel}>🎵 {isArabic ? 'المقطوعة' : 'Track'}</div>
                  <div style={styles.settingValue}>{selectedDayData.morningSession.audioSettings.musicTrack}</div>
                </div>
              </div>

              <FrequencyVisualizer
                frequencies={selectedDayData.morningSession.audioSettings.frequencyFilters}
                active={activeSession === 'morning'}
              />

              {selectedDayData.morningSession.completed ? (
                <div style={styles.observationsSection}>
                  <div style={styles.observationsTitle}>
                    {isArabic ? 'ملاحظات الجلسة' : 'Session Observations'}
                  </div>
                  <div style={styles.ratingRow}>
                    <span style={styles.ratingLabel}>{isArabic ? 'الانتباه' : 'Attention'}</span>
                    <StarRating value={selectedDayData.morningSession.observations.attention} readonly />
                  </div>
                  <div style={styles.ratingRow}>
                    <span style={styles.ratingLabel}>{isArabic ? 'التعاون' : 'Cooperation'}</span>
                    <StarRating value={selectedDayData.morningSession.observations.cooperation} readonly />
                  </div>
                  <div style={styles.ratingRow}>
                    <span style={styles.ratingLabel}>{isArabic ? 'الراحة' : 'Comfort'}</span>
                    <StarRating value={selectedDayData.morningSession.observations.comfort} readonly />
                  </div>
                </div>
              ) : (
                <div style={styles.actionButtons}>
                  {activeSession === 'morning' ? (
                    <button style={styles.completeButton} onClick={handleCompleteSession}>
                      ✓ {isArabic ? 'إنهاء الجلسة' : 'Complete Session'}
                    </button>
                  ) : (
                    <button
                      style={styles.startButton}
                      onClick={() => handleStartSession('morning')}
                      disabled={activeSession !== null}
                    >
                      ▶️ {isArabic ? 'بدء الجلسة' : 'Start Session'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Afternoon Session */}
            <div style={styles.sessionCard}>
              <div style={styles.sessionHeader}>
                <span style={styles.sessionTitle}>
                  🌙 {isArabic ? 'الجلسة المسائية' : 'Afternoon Session'}
                </span>
                <span style={styles.sessionTime}>
                  {selectedDayData.afternoonSession.time} • {selectedDayData.afternoonSession.duration} {isArabic ? 'دقيقة' : 'min'}
                </span>
              </div>

              <div style={styles.settingsGrid}>
                <div style={styles.settingItem}>
                  <div style={styles.settingLabel}>🔊 {isArabic ? 'مستوى الصوت' : 'Volume'}</div>
                  <div style={styles.settingValue}>{selectedDayData.afternoonSession.audioSettings.volume}%</div>
                </div>
                <div style={styles.settingItem}>
                  <div style={styles.settingLabel}>🎵 {isArabic ? 'المقطوعة' : 'Track'}</div>
                  <div style={styles.settingValue}>{selectedDayData.afternoonSession.audioSettings.musicTrack}</div>
                </div>
              </div>

              <FrequencyVisualizer
                frequencies={selectedDayData.afternoonSession.audioSettings.frequencyFilters}
                active={activeSession === 'afternoon'}
              />

              {selectedDayData.afternoonSession.completed ? (
                <div style={styles.observationsSection}>
                  <div style={styles.observationsTitle}>
                    {isArabic ? 'ملاحظات الجلسة' : 'Session Observations'}
                  </div>
                  <div style={styles.ratingRow}>
                    <span style={styles.ratingLabel}>{isArabic ? 'الانتباه' : 'Attention'}</span>
                    <StarRating value={selectedDayData.afternoonSession.observations.attention} readonly />
                  </div>
                  <div style={styles.ratingRow}>
                    <span style={styles.ratingLabel}>{isArabic ? 'التعاون' : 'Cooperation'}</span>
                    <StarRating value={selectedDayData.afternoonSession.observations.cooperation} readonly />
                  </div>
                  <div style={styles.ratingRow}>
                    <span style={styles.ratingLabel}>{isArabic ? 'الراحة' : 'Comfort'}</span>
                    <StarRating value={selectedDayData.afternoonSession.observations.comfort} readonly />
                  </div>
                </div>
              ) : (
                <div style={styles.actionButtons}>
                  {activeSession === 'afternoon' ? (
                    <button style={styles.completeButton} onClick={handleCompleteSession}>
                      ✓ {isArabic ? 'إنهاء الجلسة' : 'Complete Session'}
                    </button>
                  ) : (
                    <button
                      style={styles.startButton}
                      onClick={() => handleStartSession('afternoon')}
                      disabled={activeSession !== null || !selectedDayData.morningSession.completed}
                    >
                      ▶️ {isArabic ? 'بدء الجلسة' : 'Start Session'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Rest Day Message */}
      {selectedDayData?.status === 'rest_day' && (
        <div style={{ ...cards.glass, padding: spacing[8], textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: spacing[4] }}>😌</div>
          <h2 style={{ color: brand.pink, fontSize: typography.size['2xl'], marginBottom: spacing[2] }}>
            {isArabic ? 'يوم راحة' : 'Rest Day'}
          </h2>
          <p style={{ color: '#888', maxWidth: '400px', margin: '0 auto' }}>
            {isArabic
              ? 'اليوم السادس هو يوم راحة في بروتوكول Bérard AIT. لا توجد جلسات استماع مجدولة.'
              : 'Day 6 is a rest day in the Bérard AIT protocol. No listening sessions are scheduled.'}
          </p>
        </div>
      )}

      {/* Summary Stats */}
      <h2 style={{ ...styles.sectionTitle, marginTop: spacing[8] }}>
        📊 {isArabic ? 'إحصائيات العلاج' : 'Treatment Statistics'}
      </h2>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{completedSessions}</div>
          <div style={styles.statLabel}>{isArabic ? 'جلسات مكتملة' : 'Sessions Completed'}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{Math.round(progressPercent)}%</div>
          <div style={styles.statLabel}>{isArabic ? 'نسبة الإكمال' : 'Completion Rate'}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{10 - sessions.filter(s => s.status === 'completed').length}</div>
          <div style={styles.statLabel}>{isArabic ? 'أيام متبقية' : 'Days Remaining'}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>4.2</div>
          <div style={styles.statLabel}>{isArabic ? 'متوسط الانتباه' : 'Avg. Attention'}</div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentProtocolDashboard;
