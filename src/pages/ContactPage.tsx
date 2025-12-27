/**
 * Contact Page - Get Started
 * Intake Form, Contact Form, Partnerships
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
import { RocketIcon } from '../components/icons';
import {
  brandCyan,
  colors,
  typography,
  spacing,
  radius,
} from '../components/styles';

// Lazy load sections
const IntakeForm = lazy(() => import('../components/IntakeForm'));
const ContactForm = lazy(() => import('../components/ContactForm'));

// Page header component
const PageHeader = memo(() => {
  const { t } = useLanguage();
  return (
    <div
      style={{
        textAlign: 'center',
        padding: `${spacing[12]}px ${spacing[4]}px ${spacing[8]}px`,
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
          background: `${brandCyan}15`,
          borderRadius: radius.full,
        marginBottom: spacing[4],
      }}
    >
      <span style={{ fontSize: 20 }} aria-hidden="true">
        <RocketIcon size={20} tone="cyan" />
      </span>
        <span
          style={{
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            color: brandCyan,
          }}
        >
          {t('contactPage.badge')}
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
        {t('contactPage.title')}
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
        {t('contactPage.description')}
      </p>
    </div>
  );
});
PageHeader.displayName = 'PageHeader';

function ContactPage() {
  const { t } = useLanguage();
  usePageTitle();

  return (
    <LabShell variant="primary">
      <BackgroundFX />
      <Header />

      <LabShellContent>
        <BackNavigation
          to="/"
          label={t('nav.home')}
        />

        <PageHeader />

        {/* Intake Form */}
        <FadeIn delay={100} scale blur blurAmount={4}>
          <Suspense fallback={<SectionLoader label={t('common.loadingIntake')} height={500} />}>
            <IntakeForm />
          </Suspense>
        </FadeIn>

        {/* Contact Form */}
        <FadeIn delay={150} scale blur blurAmount={4}>
          <Suspense fallback={<SectionLoader label={t('common.loadingContact')} height={700} />}>
            <ContactForm />
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

export default memo(ContactPage);
