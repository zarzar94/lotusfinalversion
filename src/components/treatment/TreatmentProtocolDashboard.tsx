import { useMemo } from 'react';
import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from '../styles';

export type SessionStatus = 'pending' | 'scheduled' | 'completed';

interface Session {
  timeOfDay: 'am' | 'pm';
  focus: string;
  frequencyHz: number;
  status: SessionStatus;
  stars: number;
}

interface DayPlan {
  day: number;
  dateLabel: string;
  sessions: Session[];
}

interface TreatmentProtocolDashboardProps {
  locale?: 'ar' | 'en';
  plan?: DayPlan[];
}

const defaultPlan: DayPlan[] = Array.from({ length: 10 }).map((_, idx) => {
  const day = idx + 1;
  return {
    day,
    dateLabel: `Day ${day}`,
    sessions: [
      {
        timeOfDay: 'am',
        focus: day % 2 === 0 ? 'Attention' : 'Auditory filtering',
        frequencyHz: 320 + day * 20,
        status: day < 3 ? 'completed' : day === 3 ? 'scheduled' : 'pending',
        stars: Math.min(5, 2 + day % 4),
      },
      {
        timeOfDay: 'pm',
        focus: day % 2 === 0 ? 'Sequencing' : 'Spatial',
        frequencyHz: 520 + day * 18,
        status: day < 2 ? 'completed' : day === 2 ? 'scheduled' : 'pending',
        stars: Math.min(5, 1 + (day % 3)),
      },
    ],
  };
});

const translations = {
  ar: {
    title: 'لوحة بروتوكول العلاج (10 أيام)',
    subtitle: 'إدارة جلسات الصباح/المساء، تتبع التقدم، وتصور الترددات',
    morning: 'جلسة صباحية',
    afternoon: 'جلسة مسائية',
    frequency: 'التردد (هرتز)',
    progress: 'التقدم',
    day: 'اليوم',
    completed: 'مكتملة',
    scheduled: 'مجدولة',
    pending: 'قيد الانتظار',
    bandCount: 'جلسة',
  },
  en: {
    title: 'Treatment Protocol Dashboard (10 days)',
    subtitle: 'Manage AM/PM sessions, progress, and frequency focus',
    morning: 'Morning Session',
    afternoon: 'Afternoon Session',
    frequency: 'Frequency (Hz)',
    progress: 'Progress',
    day: 'Day',
    completed: 'completed',
    scheduled: 'scheduled',
    pending: 'pending',
    bandCount: 'session',
  },
};

const pillStyle = {
  ...styles.chip,
  background: 'rgba(143,211,204,0.1)',
  borderColor: 'rgba(143,211,204,0.25)',
};

const TreatmentProtocolDashboard = ({ locale = 'ar', plan = defaultPlan }: TreatmentProtocolDashboardProps) => {
  const t = translations[locale];

  const summary = useMemo(() => {
    const allSessions = plan.flatMap((d) => d.sessions);
    const completed = allSessions.filter((s) => s.status === 'completed').length;
    const scheduled = allSessions.filter((s) => s.status === 'scheduled').length;
    return {
      completed,
      scheduled,
      pending: allSessions.length - completed - scheduled,
    };
  }, [plan]);

  return (
    <section style={{ ...styles.sectionCard, border: '1px solid rgba(255,255,255,0.08)', display: 'grid', gap: 18 }}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>{t.title}</h2>
          <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.15)' }}>10 {t.day}</span>
        </div>
        <p style={styles.bodyText}>{t.subtitle}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span style={pillStyle}>✅ {summary.completed} {t.completed}</span>
          <span style={{ ...pillStyle, background: 'rgba(175,132,186,0.12)', borderColor: 'rgba(175,132,186,0.25)' }}>
            🗓️ {summary.scheduled} {t.scheduled}
          </span>
          <span style={{ ...pillStyle, background: 'rgba(176,18,112,0.12)', borderColor: 'rgba(176,18,112,0.25)' }}>
            ⏳ {summary.pending} {t.pending}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {plan.map((day) => (
          <div key={day.day} style={{ ...styles.section, minHeight: 220 }}>
            <div style={{ ...styles.sectionHeaderRow, alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ ...styles.kicker, opacity: 0.7 }}>{t.day} {day.day}</div>
                <div style={{ ...styles.h3, margin: 0 }}>{day.dateLabel}</div>
              </div>
              <div style={{ ...styles.chip, background: 'rgba(5,6,13,0.6)', borderColor: 'rgba(255,255,255,0.08)' }}>
                {(day.sessions.filter((s) => s.status === 'completed').length / day.sessions.length * 100).toFixed(0)}%
              </div>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {day.sessions.map((session, idx) => {
                const isMorning = session.timeOfDay === 'am';
                return (
                  <div
                    key={`${day.day}-${session.timeOfDay}`}
                    style={{
                      display: 'grid',
                      gap: 10,
                      gridTemplateColumns: '1fr 1.2fr',
                      alignItems: 'center',
                      padding: 12,
                      borderRadius: 12,
                      border: '1px solid rgba(255,255,255,0.07)',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                    }}
                  >
                    <div style={{ display: 'grid', gap: 6 }}>
                      <div style={{ ...styles.chip, width: 'fit-content', background: isMorning ? 'rgba(143,211,204,0.12)' : 'rgba(176,18,112,0.12)', borderColor: 'rgba(255,255,255,0.09)' }}>
                        {isMorning ? t.morning : t.afternoon}
                      </div>
                      <div style={{ ...styles.bodyText, margin: 0 }}>{session.focus}</div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={styles.kicker}>{t.frequency}</span>
                        <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)', flex: 1, position: 'relative' }}>
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: `${Math.min(100, session.frequencyHz / 10)}%`,
                              background: `linear-gradient(90deg, ${brandCyan}, ${brandPink})`,
                              borderRadius: 999,
                              opacity: 0.8,
                            }}
                          />
                        </div>
                        <span style={{ ...styles.kicker, color: brandCyan }}>{session.frequencyHz}Hz</span>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gap: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={styles.kicker}>{t.progress}</span>
                        <span style={{ ...styles.chip, background: 'rgba(255,255,255,0.05)' }}>
                          {session.status === 'completed' && t.completed}
                          {session.status === 'scheduled' && t.scheduled}
                          {session.status === 'pending' && t.pending}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <span key={starIdx}>{starIdx < session.stars ? '⭐' : '☆'}</span>
                        ))}
                      </div>
                      <div style={{ display: 'grid', gap: 4 }}>
                        <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.08)', position: 'relative' }}>
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: `${(session.stars / 5) * 100}%`,
                              background: `linear-gradient(90deg, ${brandPurple}, ${brandPurpleDark})`,
                              borderRadius: 999,
                            }}
                          />
                        </div>
                        <div style={{ height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: `${Math.min(100, session.frequencyHz / 12)}%`,
                              background: `linear-gradient(90deg, ${brandPink}, ${brandCyan})`,
                              borderRadius: 999,
                              opacity: 0.65,
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ ...styles.kicker, opacity: 0.7 }}>#{idx + 1} • {session.focus}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TreatmentProtocolDashboard;
