/**
 * Results Page - Evidence & Testimonials
 * Success stories and social proof
 */

import { lazy, Suspense, memo } from 'react';
import Header from '../components/Header';
import { styles } from '../components/styles';
import BackgroundFX from '../components/BackgroundFX';
import Footer from '../components/Footer';
import WhatsAppFab from '../components/WhatsAppFab';
import ScrollToTopButton from '../components/ScrollToTopButton';
import SectionLoader from '../components/SectionLoader';
import FadeIn from '../components/FadeIn';
import { BackNavigation } from '../components/shared';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  colors,
  typography,
  spacing,
  radius,
} from '../components/styles';

// Lazy load sections
const ResultsSection = lazy(() => import('../components/ResultsSection'));
const TestimonialsSection = lazy(() => import('../components/TestimonialsSection'));
const TrustSignals = lazy(() => import('../components/TrustSignals'));

// Page header component
const PageHeader = memo(({ isArabic }: { isArabic: boolean }) => (
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
        background: 'rgba(34,197,94,0.15)',
        borderRadius: radius.full,
        marginBottom: spacing[4],
      }}
    >
      <span style={{ fontSize: 20 }}>📊</span>
      <span
        style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: '#22c55e',
        }}
      >
        {isArabic ? 'الأدلة والنتائج' : 'Evidence & Results'}
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
      {isArabic ? 'قصص النجاح والشهادات' : 'Success Stories & Testimonials'}
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
        ? 'اكتشف كيف ساعد برنامج Bérard AIT مئات العائلات في تحسين قدرات المعالجة السمعية لأطفالهم'
        : 'Discover how Bérard AIT has helped hundreds of families improve their children\'s auditory processing abilities'}
    </p>
  </div>
));
PageHeader.displayName = 'PageHeader';

function ResultsPage() {
  const { isArabic, t } = useLanguage();
  usePageTitle();

  return (
    <div style={styles.page}>
      <BackgroundFX />
      <Header />

      <main style={styles.container}>
        <BackNavigation
          to="/"
          label={isArabic ? 'الصفحة الرئيسية' : 'Home'}
        />

        <PageHeader isArabic={isArabic} />

        {/* Results Section */}
        <FadeIn delay={100} scale scaleFrom={0.97} blur blurAmount={4}>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={350} />}>
            <ResultsSection />
          </Suspense>
        </FadeIn>

        {/* Testimonials */}
        <FadeIn delay={150} direction="left" distance={35}>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={350} />}>
            <TestimonialsSection />
          </Suspense>
        </FadeIn>

        {/* Trust Signals */}
        <FadeIn delay={200} direction="none" scale scaleFrom={0.98}>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={250} />}>
            <TrustSignals />
          </Suspense>
        </FadeIn>

        <FadeIn delay={100} direction="none" scale scaleFrom={0.98}>
          <Footer />
        </FadeIn>
      </main>

      <WhatsAppFab />
      <ScrollToTopButton />
    </div>
  );
}

export default memo(ResultsPage);
