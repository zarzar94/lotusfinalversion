import type { ReactNode } from 'react';

import BackgroundFX from '../BackgroundFX';
import Footer from '../Footer';
import Header from '../Header';
import LabCard from '../labui/LabCard';
import { LabShell, LabShellContent } from '../labui/LabShell';
import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, colors, radius, spacing, typography } from '../styles';

type DashboardShellProps = {
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  badgeTone?: string;
  children: ReactNode;
};

export default function DashboardShell({
  title,
  subtitle,
  badgeLabel,
  badgeTone = brandCyan,
  children,
}: DashboardShellProps) {
  const { isArabic } = useLanguage();

  return (
    <LabShell variant="primary">
      <BackgroundFX />
      <Header />
      <LabShellContent>
        <div
          style={{
            display: 'grid',
            gap: spacing[4],
            direction: isArabic ? 'rtl' : 'ltr',
            textAlign: isArabic ? 'right' : 'left',
          }}
        >
          <LabCard
            variant="glass"
            padding={spacing[4]}
            style={{
              borderRadius: radius.xl,
              border: `1px solid ${colors.border.emphasis}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing[3],
                flexWrap: 'wrap',
              }}
            >
              <div style={{ minWidth: 220 }}>
                <h1
                  style={{
                    margin: 0,
                    fontSize: typography.size['2xl'],
                    fontWeight: typography.weight.black,
                    color: colors.text.primary,
                  }}
                >
                  {title}
                </h1>
                {subtitle ? (
                  <p
                    style={{
                      margin: `${spacing[1]}px 0 0`,
                      color: colors.text.secondary,
                      fontSize: typography.size.sm,
                      lineHeight: typography.lineHeight.relaxed,
                    }}
                  >
                    {subtitle}
                  </p>
                ) : null}
              </div>
              {badgeLabel ? (
                <span
                  style={{
                    padding: `${spacing[1]}px ${spacing[3]}px`,
                    borderRadius: radius.full,
                    border: `1px solid ${badgeTone}55`,
                    background: `${badgeTone}18`,
                    color: badgeTone,
                    fontSize: typography.size.xs,
                    fontWeight: typography.weight.bold,
                    letterSpacing: 0.4,
                    textTransform: 'uppercase',
                  }}
                >
                  {badgeLabel}
                </span>
              ) : null}
            </div>
          </LabCard>

          <div>{children}</div>

          <Footer />
        </div>
      </LabShellContent>
    </LabShell>
  );
}
