import { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getAllSessions } from '../utils/sessionStorage';
import type { LabModuleMetrics } from '../types/moduleMetrics';
import { brandCyan, brandPurple, colors, spacing, radius, typography } from '../components/styles';
import { LabShell } from '../components/labui/LabShell';

const formatTimestamp = (timestamp: string, locale: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
};

export default function DebugSessionPage() {
  const { t, isArabic, direction } = useLanguage();
  const [sessions, setSessions] = useState<LabModuleMetrics[]>(() => getAllSessions());

  const json = useMemo(() => JSON.stringify(sessions, null, 2), [sessions]);

  const handleRefresh = () => {
    setSessions(getAllSessions());
  };

  const handleExport = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sblab-session-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <LabShell variant="primary">
      <section
        className="page-container"
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          padding: `${spacing[6]}px ${spacing[4]}px`,
          direction,
        }}
      >
        <div style={{ marginBottom: spacing[5] }}>
          <h1
            style={{
              margin: 0,
              fontSize: typography.size['2xl'],
              fontWeight: typography.weight.black,
              color: colors.text.primary,
            }}
          >
            {t('debug.sessionHistoryTitle', 'Session History (Debug)')}
          </h1>
          <p style={{ margin: `${spacing[1]}px 0 0`, color: colors.text.secondary, fontSize: typography.size.sm }}>
            {t('debug.sessionHistorySubtitle', 'Lab module metrics stored in localStorage.')}
          </p>
        </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: spacing[2],
          alignItems: 'center',
          marginBottom: spacing[4],
        }}
      >
        <div
          style={{
            padding: `${spacing[2]}px ${spacing[3]}px`,
            background: `${brandCyan}15`,
            borderRadius: radius.md,
            border: `1px solid ${brandCyan}30`,
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            color: brandCyan,
          }}
        >
          {t('debug.sessionCount', 'Sessions')}: {sessions.length}
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          style={{
            padding: `${spacing[2]}px ${spacing[3]}px`,
            background: `${brandPurple}15`,
            borderRadius: radius.md,
            border: `1px solid ${brandPurple}40`,
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            color: brandPurple,
            cursor: 'pointer',
          }}
        >
          {t('debug.refresh', 'Refresh')}
        </button>
        <button
          type="button"
          onClick={handleExport}
          style={{
            padding: `${spacing[2]}px ${spacing[3]}px`,
            background: `${brandCyan}25`,
            borderRadius: radius.md,
            border: `1px solid ${brandCyan}50`,
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            color: brandCyan,
            cursor: 'pointer',
          }}
        >
          {t('debug.exportJson', 'Export JSON')}
        </button>
        <span style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
          {t('debug.restricted', 'Restricted')}
        </span>
      </div>

      {sessions.length === 0 ? (
        <div
          style={{
            padding: spacing[5],
            background: colors.surface.card,
            borderRadius: radius.lg,
            border: `1px dashed ${colors.border.default}`,
            color: colors.text.muted,
            textAlign: 'center',
          }}
        >
          {t('debug.empty', 'No sessions stored yet.')}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: spacing[3], marginBottom: spacing[5] }}>
          {sessions.map((session, index) => (
            <div
              key={`${session.moduleId}-${session.timestamp}-${index}`}
              style={{
                padding: spacing[4],
                background: colors.surface.card,
                borderRadius: radius.lg,
                border: `1px solid ${colors.border.default}`,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: spacing[2],
              }}
            >
              <div>
                <div style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
                  {t('debug.module', 'Module')}
                </div>
                <div style={{ fontWeight: typography.weight.bold, color: colors.text.primary }}>
                  {session.moduleId}
                </div>
              </div>
              <div>
                <div style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
                  {t('debug.timestamp', 'Timestamp')}
                </div>
                <div style={{ fontWeight: typography.weight.semibold, color: colors.text.primary }}>
                  {formatTimestamp(session.timestamp, isArabic ? 'ar-SA' : 'en-US')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
                  {t('debug.score', 'Score')}
                </div>
                <div style={{ fontWeight: typography.weight.bold, color: colors.text.primary }}>
                  {session.score100}
                </div>
              </div>
              <div>
                <div style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
                  {t('debug.band', 'Band')}
                </div>
                <div style={{ fontWeight: typography.weight.bold, color: colors.text.primary }}>
                  {session.band}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          background: '#0b0f18',
          borderRadius: radius.lg,
          border: `1px solid ${colors.border.subtle}`,
          padding: spacing[4],
        }}
      >
        <div
          style={{
            marginBottom: spacing[2],
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            color: colors.text.muted,
          }}
        >
          {t('debug.rawJson', 'Raw JSON')}
        </div>
        <pre
          style={{
            margin: 0,
            fontSize: 11,
            lineHeight: 1.6,
            color: '#cbd5f5',
            maxHeight: 360,
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {json}
        </pre>
      </div>
      </section>
    </LabShell>
  );
}
