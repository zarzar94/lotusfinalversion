import { memo, useEffect, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useVisitorMode } from '../context/VisitorModeContext';
import { useUser } from '../context/UserContext';
import { getSessionsOrDemo } from '../utils/sessionStorage';
import { LineChart, BarChart } from '../components/shared/ProgressChart';
import { colors, spacing, radius, typography, brandCyan, brandPurple, brandPink } from '../components/styles';
import {
  MODULE_ORDER,
  average,
  buildBandTrendSeries,
  buildConsistencyTrendSeries,
  buildFatigueTrendSeries,
  computeSlope,
  formatTimestamp,
  getBandMeta,
  getLatestByModule,
  getLatestLeftRightSplit,
  getModuleLabel,
  normalizeFatigue01,
  sortSessionsByTime,
} from '../components/dashboards/roleDashboardUtils';
import { downloadClinicianReportPdf, downloadCsvRows } from '../components/dashboards/roleDashboardExports';

const cardStyle: CSSProperties = {
  background: colors.surface.card,
  border: `1px solid ${colors.border.default}`,
  borderRadius: radius.lg,
  padding: spacing[4],
};

const ClinicianDashboard = memo(function ClinicianDashboard() {
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
  const sessions = useMemo(
    () => sortSessionsByTime(getSessionsOrDemo(allowDemoSessions)),
    [allowDemoSessions]
  );
  const latestByModule = useMemo(() => getLatestByModule(sessions), [sessions]);

  const averageScore = useMemo(() => {
    if (!sessions.length) return null;
    return Math.round(average(sessions.map((session) => session.score100)));
  }, [sessions]);

  const fatigueSeries = useMemo(() => buildFatigueTrendSeries(sessions, locale), [sessions, locale]);
  const consistencySeries = useMemo(() => buildConsistencyTrendSeries(sessions, locale), [sessions, locale]);
  const bandSeries = useMemo(() => buildBandTrendSeries(sessions, locale), [sessions, locale]);

  const fatigueSlope = useMemo(() => {
    if (fatigueSeries.length < 2) return 0;
    const normalizedValues = fatigueSeries.map((point) => point.value / 100);
    return computeSlope(normalizedValues);
  }, [fatigueSeries]);

  const consistencyAverage = useMemo(() => {
    const values = sessions
      .map((session) => session.consistency)
      .filter((value): value is number => typeof value === 'number');
    if (!values.length) return null;
    return average(values);
  }, [sessions]);

  const leftRightSplit = useMemo(() => getLatestLeftRightSplit(sessions), [sessions]);

  const moduleRows = useMemo(() => {
    return MODULE_ORDER.map((moduleId) => {
      const latest = latestByModule[moduleId];
      const bandMeta = latest ? getBandMeta(latest.band) : null;
      const fatigueNormalized = latest ? normalizeFatigue01(latest.fatigueIndex) : null;
      return {
        moduleId,
        label: getModuleLabel(moduleId, isArabic),
        score: latest ? `${latest.score100}/100` : '--',
        band: latest && bandMeta ? (isArabic ? bandMeta.labelAr : bandMeta.label) : '--',
        fatigue: fatigueNormalized === null ? '--' : `${Math.round(fatigueNormalized * 100)}%`,
        consistency: typeof latest?.consistency === 'number' ? `${Math.round(latest.consistency)}%` : '--',
        date: latest ? formatTimestamp(latest.timestamp, locale) : '--',
      };
    });
  }, [latestByModule, isArabic, locale]);

  const recentSessions = useMemo(() => {
    if (!sessions.length) return [];
    return [...sessions].slice(-6).reverse();
  }, [sessions]);

  const handleDownloadPdf = useMemo(() => () => {
    if (!sessions.length) return;
    downloadClinicianReportPdf({
      sessions,
      latestByModule,
      isArabic,
      fatigueSlope,
      consistencyAverage,
    });
  }, [sessions, latestByModule, isArabic, fatigueSlope, consistencyAverage]);

  const handleExportCsv = useMemo(() => () => {
    if (!sessions.length) return;
    const rows = [
      ['timestamp', 'module', 'score100', 'band', 'fatigue_index', 'consistency', 'notes', 'raw_metrics'],
      ...sessions.map((session) => ([
        session.timestamp,
        session.moduleId,
        session.score100,
        session.band,
        session.fatigueIndex ?? '',
        session.consistency ?? '',
        session.notes ?? '',
        JSON.stringify(session.rawMetrics),
      ])),
    ];
    downloadCsvRows(rows, `clinician-report-${Date.now()}.csv`);
  }, [sessions]);

  const emptyState = (
    <div style={{ color: colors.text.muted }}>{t('dashboard.noHistoryBody', 'Complete a module to begin tracking progress.')}</div>
  );

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
            {t('dashboard.clinicianTitle', 'Clinician Dashboard')}
          </div>
          <div style={{ color: colors.text.muted, marginTop: spacing[1] }}>
            {t('dashboard.clinicianSubtitle', 'Longitudinal screening insights for follow-up.')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: spacing[2], flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleDownloadPdf}
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
            {t('dashboard.downloadClinicianReport', 'Download Clinician Report PDF')}
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!sessions.length}
            style={{
              padding: '10px 16px',
              borderRadius: radius.full,
              border: `1px solid ${brandPurple}55`,
              background: sessions.length ? 'rgba(175,132,186,0.15)' : 'rgba(255,255,255,0.08)',
              color: sessions.length ? brandPurple : colors.text.disabled,
              fontWeight: 700,
              cursor: sessions.length ? 'pointer' : 'not-allowed',
            }}
          >
            {t('dashboard.exportFullCsv', 'Export Full CSV')}
          </button>
        </div>
      </header>

      <section style={{ display: 'grid', gap: spacing[3], gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div style={{ ...cardStyle, borderColor: `${brandCyan}40` }}>
          <div style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
            {t('dashboard.sessions', 'Sessions')}
          </div>
          <div style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold, marginTop: spacing[1] }}>
            {sessions.length}
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
            {t('dashboard.fatigueSlope', 'Fatigue Slope')}
          </div>
          <div style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold, marginTop: spacing[1] }}>
            {sessions.length ? `${(fatigueSlope * 100).toFixed(2)}%` : '--'}
          </div>
        </div>
        <div style={{ ...cardStyle, borderColor: `${brandCyan}35` }}>
          <div style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
            {t('dashboard.consistency', 'Consistency')}
          </div>
          <div style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold, marginTop: spacing[1] }}>
            {consistencyAverage === null ? '--' : `${Math.round(consistencyAverage)}%`}
          </div>
        </div>
      </section>

      <section style={{ display: 'grid', gap: spacing[3], gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div style={{ ...cardStyle }}>
          <div style={{ fontSize: typography.size.sm, fontWeight: typography.weight.bold, marginBottom: spacing[2] }}>
            {t('dashboard.fatigueTrendTitle', 'Fatigue Index')}
          </div>
          {fatigueSeries.length ? (
            <LineChart
              data={fatigueSeries}
              height={200}
              isArabic={isArabic}
              showValues={false}
              color={brandPink}
              gradientColors={[brandPink, brandPurple]}
              maxValue={100}
            />
          ) : (
            emptyState
          )}
        </div>
        <div style={{ ...cardStyle }}>
          <div style={{ fontSize: typography.size.sm, fontWeight: typography.weight.bold, marginBottom: spacing[2] }}>
            {t('dashboard.consistencyTrend', 'Consistency Trend')}
          </div>
          {consistencySeries.length ? (
            <LineChart
              data={consistencySeries}
              height={200}
              isArabic={isArabic}
              showValues={false}
              color={brandCyan}
              gradientColors={[brandCyan, brandPurple]}
              maxValue={100}
            />
          ) : (
            emptyState
          )}
        </div>
        <div style={{ ...cardStyle }}>
          <div style={{ fontSize: typography.size.sm, fontWeight: typography.weight.bold, marginBottom: spacing[2] }}>
            {t('dashboard.bandOverTime', 'Band Over Time')}
          </div>
          {bandSeries.length ? (
            <>
              <BarChart
                data={bandSeries}
                height={180}
                showValues={false}
                isArabic={isArabic}
                maxValue={3}
                animate={false}
              />
              <div style={{ marginTop: spacing[2], fontSize: typography.size.xs, color: colors.text.muted }}>
                {t('dashboard.bandLegend', 'High = 3, Mid = 2, Low = 1')}
              </div>
            </>
          ) : (
            emptyState
          )}
        </div>
      </section>

      <section style={{ ...cardStyle, display: 'grid', gap: spacing[3] }}>
        <div style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold }}>
          {t('dashboard.moduleComparisons', 'Module Comparisons')}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: typography.size.sm }}>
            <thead>
              <tr style={{ textAlign: isArabic ? 'right' : 'left', color: colors.text.muted }}>
                <th style={{ padding: '10px 8px' }}>{t('dashboard.modules', 'Module')}</th>
                <th style={{ padding: '10px 8px' }}>{t('dashboard.latestScore', 'Latest Score')}</th>
                <th style={{ padding: '10px 8px' }}>{t('dashboard.latestBand', 'Latest Band')}</th>
                <th style={{ padding: '10px 8px' }}>{t('dashboard.fatigueIndex', 'Fatigue Index')}</th>
                <th style={{ padding: '10px 8px' }}>{t('dashboard.consistency', 'Consistency')}</th>
                <th style={{ padding: '10px 8px' }}>{t('dashboard.lastSession', 'Last Session')}</th>
              </tr>
            </thead>
            <tbody>
              {moduleRows.map((row) => (
                <tr key={row.moduleId} style={{ borderTop: `1px solid ${colors.border.subtle}` }}>
                  <td style={{ padding: '10px 8px', fontWeight: 700 }}>{row.label}</td>
                  <td style={{ padding: '10px 8px' }}>{row.score}</td>
                  <td style={{ padding: '10px 8px' }}>{row.band}</td>
                  <td style={{ padding: '10px 8px' }}>{row.fatigue}</td>
                  <td style={{ padding: '10px 8px' }}>{row.consistency}</td>
                  <td style={{ padding: '10px 8px' }}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ display: 'grid', gap: spacing[3], gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div style={{ ...cardStyle }}>
          <div style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold, marginBottom: spacing[2] }}>
            {t('dashboard.leftRightSplits', 'Left/Right Splits')}
          </div>
          {leftRightSplit ? (
            <div style={{ display: 'grid', gap: spacing[2] }}>
              <div style={{ color: colors.text.muted }}>
                {getModuleLabel(leftRightSplit.session.moduleId, isArabic)} - {formatTimestamp(leftRightSplit.session.timestamp, locale)}
              </div>
              <div style={{ display: 'flex', gap: spacing[3], flexWrap: 'wrap' }}>
                <div style={{ padding: '10px 12px', borderRadius: radius.md, background: 'rgba(143,211,204,0.12)' }}>
                  {t('dashboard.leftLabel', 'Left')}: {leftRightSplit.leftAvg ?? '--'}
                </div>
                <div style={{ padding: '10px 12px', borderRadius: radius.md, background: 'rgba(175,132,186,0.12)' }}>
                  {t('dashboard.rightLabel', 'Right')}: {leftRightSplit.rightAvg ?? '--'}
                </div>
              </div>
            </div>
          ) : (
            emptyState
          )}
        </div>
        <div style={{ ...cardStyle }}>
          <div style={{ fontSize: typography.size.lg, fontWeight: typography.weight.bold, marginBottom: spacing[2] }}>
            {t('dashboard.sessionTimeline', 'Recent Sessions')}
          </div>
          {recentSessions.length ? (
            <div style={{ display: 'grid', gap: spacing[2] }}>
              {recentSessions.map((session) => {
                const bandMeta = getBandMeta(session.band);
                const bandLabel = isArabic ? bandMeta.labelAr : bandMeta.label;
                return (
                  <div key={`${session.moduleId}-${session.timestamp}`} style={{ display: 'flex', justifyContent: 'space-between', gap: spacing[2] }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{getModuleLabel(session.moduleId, isArabic)}</div>
                      <div style={{ fontSize: typography.size.xs, color: colors.text.muted }}>{formatTimestamp(session.timestamp, locale)}</div>
                    </div>
                    <div style={{ color: bandMeta.color }}>{bandLabel}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            emptyState
          )}
        </div>
      </section>
    </main>
  );
});

export default ClinicianDashboard;
