import { memo, useEffect, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useVisitorMode } from '../context/VisitorModeContext';
import { useUser } from '../context/UserContext';
import { getSessionsOrDemo } from '../utils/sessionStorage';
import { colors, spacing, radius, typography, brandCyan, brandPurple } from '../components/styles';
import {
  average,
  formatTimestamp,
  getBandMeta,
  getSessionMetric,
  normalizeFatigue01,
  sortSessionsByTime,
} from '../components/dashboards/roleDashboardUtils';
import { downloadCsvRows } from '../components/dashboards/roleDashboardExports';

const cardStyle: CSSProperties = {
  background: colors.surface.card,
  border: `1px solid ${colors.border.default}`,
  borderRadius: radius.lg,
  padding: spacing[4],
};

type StudentRow = {
  token: string;
  lastSessionLabel: string;
  averageScore: number | null;
  latestBandLabel: string;
  fatigueLabel: string;
  avgAccuracy: number | null;
  avgThresholdHz: number | null;
  avgSpan: number | null;
  avgSnrThreshold: number | null;
  modulesCovered: number;
  flagged: boolean;
};

const buildTokens = (count: number) => {
  return Array.from({ length: count }, (_, index) => `STU-${String(index + 1).padStart(2, '0')}`);
};

const EducatorDashboard = memo(function EducatorDashboard() {
  const { t, isArabic } = useLanguage();
  const { mode, setMode } = useVisitorMode();
  const { isAuthenticated } = useUser();
  const location = useLocation();
  const locale = isArabic ? 'ar-SA' : 'en-US';
  const flagIcon = String.fromCodePoint(0x1f534);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (!roleParam) return;
    const normalized = roleParam.toLowerCase();
    let target: typeof mode | null = null;
    if (normalized === 'parent') target = 'parent';
    if (normalized === 'clinician') target = 'clinician';
    if (normalized === 'educator' || normalized === 'school') target = 'school';
    if (target && target !== mode) {
      setMode(target);
    }
  }, [location.search, mode, setMode]);

  const allowDemoSessions = !isAuthenticated;
  const sessions = useMemo(
    () => sortSessionsByTime(getSessionsOrDemo(allowDemoSessions)),
    [allowDemoSessions]
  );

  const studentRows = useMemo<StudentRow[]>(() => {
    if (!sessions.length) return [];
    const tokenCount = Math.min(8, Math.max(4, Math.ceil(sessions.length / 2)));
    const tokens = buildTokens(tokenCount);
    const grouped: Record<string, typeof sessions> = {};
    tokens.forEach((token) => {
      grouped[token] = [];
    });
    sessions.forEach((session, index) => {
      const token = tokens[index % tokens.length];
      grouped[token].push(session);
    });

    return tokens.map((token) => {
      const entries = grouped[token] ?? [];
      const sorted = sortSessionsByTime(entries);
      const latest = sorted[sorted.length - 1];
      const scores = sorted.map((session) => session.score100);
      const averageScore = scores.length ? Math.round(average(scores)) : null;
      const fatigueValues = sorted
        .map((session) => normalizeFatigue01(session.fatigueIndex))
        .filter((value): value is number => value !== null);
      const fatigueNormalized = fatigueValues.length ? average(fatigueValues) : null;
      const fatigueLabel = fatigueNormalized === null
        ? '--'
        : `${Math.round(fatigueNormalized * 100)}%`;
      const metricValues = (key: string) => sorted
        .map((session) => getSessionMetric(session, key))
        .filter((value): value is number => typeof value === 'number');
      const avgAccuracyValues = metricValues('accuracyPct');
      const avgThresholdValues = metricValues('thresholdHz');
      const avgSpanValues = metricValues('workingMemorySpan');
      const avgSnrValues = metricValues('snrThresholdDb');
      const bandLabel = latest ? getBandMeta(latest.band)[isArabic ? 'labelAr' : 'label'] : '--';
      const lastSessionLabel = latest
        ? formatTimestamp(latest.timestamp, locale)
        : t('dashboard.noHistoryTitle', 'No history yet.');
      const flagged = (averageScore !== null && averageScore < 40)
        || (fatigueNormalized !== null && fatigueNormalized > 0.7);
      const modulesCovered = new Set(sorted.map((session) => session.moduleId)).size;

      return {
        token,
        lastSessionLabel,
        averageScore,
        latestBandLabel: bandLabel,
        fatigueLabel,
        avgAccuracy: avgAccuracyValues.length ? Math.round(average(avgAccuracyValues)) : null,
        avgThresholdHz: avgThresholdValues.length ? Math.round(average(avgThresholdValues)) : null,
        avgSpan: avgSpanValues.length ? Math.round(average(avgSpanValues)) : null,
        avgSnrThreshold: avgSnrValues.length ? Math.round(average(avgSnrValues)) : null,
        modulesCovered,
        flagged,
      };
    });
  }, [sessions, isArabic, locale, t]);

  const handleExportCsv = useMemo(() => () => {
    if (!studentRows.length) return;
    const rows = [
      [
        'token',
        'last_session',
        'average_score',
        'latest_band',
        'fatigue_index',
        'avg_accuracy_pct',
        'avg_threshold_hz',
        'avg_span',
        'avg_snr_threshold_db',
        'modules_covered',
        'flagged',
      ],
      ...studentRows.map((row) => ([
        row.token,
        row.lastSessionLabel,
        row.averageScore ?? '',
        row.latestBandLabel,
        row.fatigueLabel,
        row.avgAccuracy ?? '',
        row.avgThresholdHz ?? '',
        row.avgSpan ?? '',
        row.avgSnrThreshold ?? '',
        row.modulesCovered,
        row.flagged ? '1' : '0',
      ])),
    ];
    downloadCsvRows(rows, `class-report-${Date.now()}.csv`);
  }, [studentRows]);

  return (
    <main
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: spacing[6],
        display: 'grid',
        gap: spacing[6],
        direction: isArabic ? 'rtl' : 'ltr',
        textAlign: isArabic ? 'right' : 'left',
      }}
    >
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[3],
        }}
      >
        <div>
          <div style={{ fontSize: typography.size['2xl'], fontWeight: typography.weight.black }}>
            {t('dashboard.educatorTitle', 'Educator Dashboard')}
          </div>
          <div style={{ color: colors.text.muted, marginTop: spacing[1] }}>
            {t('dashboard.educatorSubtitle', 'Classroom summary with anonymized student tokens.')}
          </div>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          disabled={!studentRows.length}
          style={{
            padding: '10px 16px',
            borderRadius: radius.full,
            border: `1px solid ${brandCyan}55`,
            background: studentRows.length ? `linear-gradient(135deg, ${brandCyan}30, ${brandPurple}20)` : 'rgba(255,255,255,0.08)',
            color: studentRows.length ? brandCyan : colors.text.disabled,
            fontWeight: 700,
            cursor: studentRows.length ? 'pointer' : 'not-allowed',
          }}
        >
          {t('dashboard.exportClassCsv', 'Export Class CSV')}
        </button>
      </header>

      <section style={{ ...cardStyle, display: 'grid', gap: spacing[2] }}>
        <div style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold }}>
          {t('dashboard.classRoster', 'Class Roster')}
        </div>
        <div style={{ color: colors.text.muted, fontSize: typography.size.sm }}>
          {t('dashboard.noPii', 'No student PII is shown. Tokens are anonymized.')}
        </div>

        {studentRows.length ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: typography.size.sm }}>
              <thead>
                <tr style={{ textAlign: isArabic ? 'right' : 'left', color: colors.text.muted }}>
                  <th style={{ padding: '10px 8px' }}>{t('dashboard.studentToken', 'Student Token')}</th>
                  <th style={{ padding: '10px 8px' }}>{t('dashboard.lastSession', 'Last Session')}</th>
                  <th style={{ padding: '10px 8px' }}>{t('dashboard.avgScore', 'Average Score')}</th>
                  <th style={{ padding: '10px 8px' }}>{t('dashboard.latestBand', 'Latest Band')}</th>
                  <th style={{ padding: '10px 8px' }}>{t('dashboard.fatigueIndex', 'Fatigue Index')}</th>
                  <th style={{ padding: '10px 8px' }}>{t('dashboard.modulesCovered', 'Modules')}</th>
                  <th style={{ padding: '10px 8px' }}>{t('dashboard.flag', 'Flag')}</th>
                </tr>
              </thead>
              <tbody>
                {studentRows.map((row) => (
                  <tr key={row.token} style={{ borderTop: `1px solid ${colors.border.subtle}` }}>
                    <td style={{ padding: '10px 8px', fontWeight: 700 }}>{row.token}</td>
                    <td style={{ padding: '10px 8px' }}>{row.lastSessionLabel}</td>
                    <td style={{ padding: '10px 8px' }}>{row.averageScore === null ? '--' : `${row.averageScore}/100`}</td>
                    <td style={{ padding: '10px 8px' }}>{row.latestBandLabel}</td>
                    <td style={{ padding: '10px 8px' }}>{row.fatigueLabel}</td>
                    <td style={{ padding: '10px 8px' }}>{row.modulesCovered}</td>
                    <td style={{ padding: '10px 8px', color: row.flagged ? '#ef4444' : colors.text.muted }}>
                      {row.flagged ? flagIcon : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ color: colors.text.muted }}>{t('dashboard.noHistoryBody', 'Complete a module to begin tracking progress.')}</div>
        )}
      </section>
    </main>
  );
});

export default EducatorDashboard;
