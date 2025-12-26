/**
 * Program Page - Treatment Protocol Information
 * Overview, Timeline, Remote Protocol
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
import {
  brandPurple,
  colors,
  typography,
  spacing,
  radius,
} from '../components/styles';

// Lazy load sections
const ProgramOverview = lazy(() => import('../components/ProgramOverview'));
const TreatmentTimeline = lazy(() => import('../components/TreatmentTimeline'));
const RemoteProtocolSection = lazy(() => import('../components/RemoteProtocolSection'));

// Page header component
const PageHeader = memo(({ isArabic }: { isArabic: boolean }) => (
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
        background: `${brandPurple}15`,
        borderRadius: radius.full,
        marginBottom: spacing[4],
      }}
    >
      <span style={{ fontSize: 20 }}>📋</span>
      <span
        style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: brandPurple,
        }}
      >
        {isArabic ? 'البروتوكول العلاجي' : 'Treatment Protocol'}
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
      {isArabic ? 'البرنامج العلاجي' : 'Treatment Program'}
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
      {isArabic
        ? 'تعرف على برنامج Bérard AIT المكثف ذو العشرين جلسة وكيف يمكن أن يساعد في تحسين المعالجة السمعية'
        : 'Learn about the intensive 20-session Bérard AIT program and how it can help improve auditory processing'}
    </p>
  </div>
));
PageHeader.displayName = 'PageHeader';

function ProgramPage() {
  const { isArabic, t } = useLanguage();
  usePageTitle();

  return (
    <LabShell variant="primary">
      <BackgroundFX />
      <Header />

      <LabShellContent>
        <BackNavigation
          to="/"
          label={isArabic ? 'الصفحة الرئيسية' : 'Home'}
        />

        <PageHeader isArabic={isArabic} />

        {/* Program Overview */}
        <FadeIn delay={100} scale scaleFrom={0.96}>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={350} />}>
            <ProgramOverview />
          </Suspense>
        </FadeIn>

        {/* Treatment Timeline */}
        <FadeIn delay={150} direction="left" distance={30} scale>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={300} />}>
            <TreatmentTimeline />
          </Suspense>
        </FadeIn>

        {/* Remote Protocol */}
        <FadeIn delay={200} direction="right" distance={30}>
          <Suspense fallback={<SectionLoader label={t('common.loadingRemote')} height={400} />}>
            <RemoteProtocolSection />
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

export default memo(ProgramPage);
