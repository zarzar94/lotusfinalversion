/**
 * Partners Page - School & Organization Partnerships
 * Public landing page for institutional collaboration
 */

import { lazy, Suspense, memo } from 'react';
import Header from '../components/Header';
import BackgroundFX from '../components/BackgroundFX';
import Footer from '../components/Footer';
import WhatsAppFab from '../components/WhatsAppFab';
import ScrollToTopButton from '../components/ScrollToTopButton';
import SectionLoader from '../components/SectionLoader';
import FadeIn from '../components/FadeIn';
import { BackNavigation } from '../components/shared';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { LabShell, LabShellContent } from '../components/labui/LabShell';
import { UsersIcon } from '../components/Icons';
import {
  brandCyan,
  colors,
  typography,
  spacing,
  radius,
} from '../components/styles';

const SchoolPartnershipSection = lazy(() => import('../components/SchoolPartnershipSection'));
const PartnerLogos = lazy(() => import('../components/PartnerLogos'));

const PageHeader = memo(({
  title,
  subtitle,
  chipLabel,
}: {
  title: string;
  subtitle: string;
  chipLabel: string;
}) => (
  <div
    style={{
      textAlign: 'center',
      padding: `0 ${spacing[4]}px ${spacing[8]}px`,
      maxWidth: 880,
      margin: '0 auto',
    }}
  >
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[2],
        padding: `${spacing[2]}px ${spacing[4]}px`,
        background: `${brandCyan}15`,
        borderRadius: radius.full,
        marginBottom: spacing[4],
      }}
    >
      <UsersIcon size={16} color={brandCyan} />
      <span
        style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: brandCyan,
        }}
      >
        {chipLabel}
      </span>
    </div>

    <h1
      style={{
        fontSize: typography.size['4xl'],
        fontWeight: typography.weight.black,
        color: colors.text.primary,
        marginBottom: spacing[4],
        lineHeight: 1.2,
      }}
    >
      {title}
    </h1>

    <p
      style={{
        fontSize: typography.size.lg,
        color: colors.text.secondary,
        lineHeight: typography.lineHeight.relaxed,
        maxWidth: 640,
        margin: '0 auto',
      }}
    >
      {subtitle}
    </p>
  </div>
));
PageHeader.displayName = 'PageHeader';

function PartnersPage() {
  const { t } = useLanguage();
  usePageTitle();

  return (
    <LabShell variant="primary">
      <BackgroundFX />
      <Header />

      <LabShellContent>
        <BackNavigation to="/" label={t('nav.home')} />

        <PageHeader
          title={t('partners.title')}
          subtitle={t('partners.subtitle')}
          chipLabel={t('nav.partners')}
        />

        <FadeIn delay={100} direction="right" distance={25}>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={800} />}>
            <SchoolPartnershipSection />
          </Suspense>
        </FadeIn>

        <FadeIn delay={200} direction="none" scale scaleFrom={0.97}>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={260} />}>
            <PartnerLogos />
          </Suspense>
        </FadeIn>

        <FadeIn delay={100} direction="none" scale scaleFrom={0.98}>
          <Footer />
        </FadeIn>
      </LabShellContent>

      <WhatsAppFab />
      <ScrollToTopButton />
    </LabShell>
  );
}

export default memo(PartnersPage);
