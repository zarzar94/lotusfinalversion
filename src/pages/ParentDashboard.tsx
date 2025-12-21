import { memo, useEffect, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useVisitorMode } from '../context/VisitorModeContext';
import { useUser } from '../context/UserContext';
import { getSessionsOrDemo } from '../utils/sessionStorage';
import { LineChart } from '../components/shared/ProgressChart';
import { colors, spacing, radius, typography, brandCyan, brandPurple, brandPink } from '../components/styles';
import {
  MODULE_ORDER,
  average,
  buildScoreTrendSeries,
  formatTimestamp,
  getBandMeta,
  getLatestByModule,
  getLatestSession,
  getModuleColor,
  getModuleLabel,
  sortSessionsByTime,
} from '../components/dashboards/roleDashboardUtils';
import { downloadParentReportPdf } from '../components/dashboards/roleDashboardExports';

const cardStyle: CSSProperties = {
  background: colors.surface.card,
  border: `1px solid ${colors.border.default}`,
  borderRadius: radius.lg,
  padding: spacing[4],
};

const ParentDashboard = memo(function ParentDashboard() {
  const { t, isArabic } = useLanguage();
  const { mode, setMode } = useVisitorMode();
  const { isAuthenticated } = useUser();
  const location = useLocation();
  const locale = isArabic ? 'ar-SA' : 'en-US';

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
  const sessions = useMemo(() => getSessionsOrDemo(allowDemoSessions), [allowDemoSessions]);
  const sortedSessions = useMemo(() => sortSessionsByTime(sessions), [sessions]);
  const latestSession = useMemo(() => getLatestSession(sortedSessions), [sortedSessions]);
  const latestByModule = useMemo(() => getLatestByModule(sortedSessions), [sortedSessions]);

  const averageScore = useMemo(() => {
    if (!sortedSessions.length) return null;
    return Math.round(average(sortedSessions.map((session) => session.score100)));
  }, [sortedSessions]);

  const trendData = useMemo(() => {
    if (!sortedSessions.length) return [];
    return buildScoreTrendSeries(sortedSessions, locale);
  }, [sortedSessions, locale]);

  const nextStep = useMemo(() => {
    if (!sortedSessions.length) {
      return t('dashboard.nextStepStart', 'Start with a full screening session to establish a baseline.');
    }
    if (averageScore !== null && averageScore < 40) {
      return t('dashboard.nextStepConsult', 'Consider a clinician consult for a targeted plan.');
    }
    if (averageScore !== null && averageScore < 70) {
      return t('dashboard.nextStepPractice', 'Continue practice modules and monitor progress weekly.');
    }
    return t('dashboard.nextStepMaintain', 'Maintain the routine and track month-over-month gains.');
  }, [sortedSessions.length, averageScore, t]);

  const handleDownload = useMemo(() => () => {
    if (!sessions.length) return;
    downloadParentReportPdf({ sessions, latestByModule, isArabic });
  }, [sessions, latestByModule, isArabic]);

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
            {t('dashboard.parentTitle', 'Parent Dashboard')}
          </div>
          <div style={{ color: colors.text.muted, marginTop: spacing[1] }}>
            {t('dashboard.parentSubtitle', 'Latest screening snapshots and next-step guidance.')}
          </div>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={!sessions.length}
          style={{
            padding: '10px 16px',
            borderRadius: radius.full,
            border: `1px solid ${brandCyan}55`,
            background: sessions.length ? `linear-gradient(135deg, ${brandCyan}30, ${brandPurple}20)` : 'rgba(255,255,255,0.08)',
            color: sessions.length ? brandCyan : colors.text.disabled,
            fontWeight: 700,
            cursor: sessions.length ? 'pointer' : 'not-allowed',
          }}
        >
          {t('dashboard.downloadParentReport', 'Download Parent Report PDF')}
        </button>
      </header>

      <section style={{ display: 'grid', gap: spacing[3], gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div style={{ ...cardStyle, borderColor: `${brandCyan}40` }}>
          <div style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
            {t('dashboard.lastSession', 'Last Session')}
          </div>
          <div style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold, marginTop: spacing[1] }}>
            {latestSession ? formatTimestamp(latestSession.timestamp, locale) : t('dashboard.noHistoryTitle', 'No history yet.')}
          </div>
        </div>
        <div style={{ ...cardStyle, borderColor: `${brandPurple}40` }}>
          <div style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
            {t('dashboard.avgScore', 'Average Score')}
          </div>
          <div style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold, marginTop: spacing[1] }}>
            {averageScore === null ? '--' : `${averageScore}/100`}
          </div>
        </div>
        <div style={{ ...cardStyle, borderColor: `${brandPink}40` }}>
          <div style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
            {t('dashboard.sessions', 'Sessions')}
          </div>
          <div style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold, marginTop: spacing[1] }}>
            {sortedSessions.length}
          </div>
        </div>
      </section>

      <section style={{ display: 'grid', gap: spacing[3] }}>
        <div style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold }}>
          {t('dashboard.moduleSnapshots', 'Module Snapshots')}
        </div>
        <div style={{ display: 'grid', gap: spacing[3], gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {MODULE_ORDER.map((moduleId) => {
            const session = latestByModule[moduleId];
            const bandMeta = session ? getBandMeta(session.band) : null;
            const tone = getModuleColor(moduleId);
            return (
              <div
                key={moduleId}
                style={{
                  ...cardStyle,
                  borderColor: `${tone}35`,
                }}
              >
                <div style={{ fontWeight: 700, color: tone }}>
                  {getModuleLabel(moduleId, isArabic)}
                </div>
                <div style={{ fontSize: typography.size['2xl'], fontWeight: typography.weight.black, marginTop: spacing[2] }}>
                  {session ? `${session.score100}/100` : '--'}
                </div>
                <div style={{ fontSize: typography.size.sm, color: colors.text.muted, marginTop: spacing[1] }}>
                  {session && bandMeta
                    ? `${isArabic ? bandMeta.labelAr : bandMeta.label} - ${isArabic ? bandMeta.summaryAr : bandMeta.summary}`
                    : t('dashboard.noHistoryBody', 'Complete a module to begin tracking progress.')}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ ...cardStyle }}>
        <div style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold, marginBottom: spacing[2] }}>
          {t('dashboard.scoreTrendTitle', 'Score Trend')}
        </div>
        {trendData.length ? (
          <LineChart
            data={trendData}
            height={200}
            isArabic={isArabic}
            showValues={false}
            color={brandCyan}
            gradientColors={[brandCyan, brandPurple]}
          />
        ) : (
          <div style={{ color: colors.text.muted }}>{t('dashboard.noHistoryBody', 'Complete a module to begin tracking progress.')}</div>
        )}
      </section>

      <section style={{ ...cardStyle, borderColor: `${brandPurple}55`, display: 'grid', gap: spacing[2] }}>
        <div style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold }}>
          {t('dashboard.nextStep', 'Next Step')}
        </div>
        <div style={{ color: colors.text.secondary }}>{nextStep}</div>
        <div>
          <Link
            to="/contact?mode=parent"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: radius.full,
              border: `1px solid ${brandPurple}55`,
              color: brandPurple,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            {t('common.contactUs', 'Contact Us')}
          </Link>
        </div>
      </section>
    </main>
  );
});

export default ParentDashboard;
