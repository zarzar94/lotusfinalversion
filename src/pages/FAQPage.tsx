/**
 * FAQ Page - Frequently asked questions and program comparison
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
import { HelpIcon } from '../components/icons';
import {
  brandPink,
  colors,
  typography,
  spacing,
  radius,
} from '../components/styles';

const ComparisonSection = lazy(() => import('../components/ComparisonSection'));
const FAQSection = lazy(() => import('../components/FAQSection'));

const PageHeader = memo(({ title, subtitle }: { title: string; subtitle: string }) => (
  <div
    style={{
      textAlign: 'center',
      padding: `0 ${spacing[4]}px ${spacing[8]}px`,
      maxWidth: 800,
      margin: '0 auto',
    }}
  >
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[2],
        padding: `${spacing[2]}px ${spacing[4]}px`,
        background: `${brandPink}15`,
        borderRadius: radius.full,
        marginBottom: spacing[4],
      }}
    >
      <HelpIcon size={18} color={brandPink} />
      <span
        style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: brandPink,
        }}
      >
        FAQ
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
        maxWidth: 600,
        margin: '0 auto',
      }}
    >
      {subtitle}
    </p>
  </div>
));
PageHeader.displayName = 'PageHeader';

function FAQPage() {
  const { t } = useLanguage();
  usePageTitle();

  return (
    <LabShell variant="primary">
      <BackgroundFX />
      <Header />

      <LabShellContent>
        <BackNavigation to="/" label={t('nav.home')} />

        <PageHeader title={t('faq.title')} subtitle={t('faq.subtitle')} />

        <FadeIn delay={100} direction="none" scale>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={400} />}>
            <ComparisonSection />
          </Suspense>
        </FadeIn>

        <FadeIn delay={150} direction="none" scale>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={400} />}>
            <FAQSection />
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

export default memo(FAQPage);
