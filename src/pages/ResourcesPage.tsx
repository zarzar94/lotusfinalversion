/**
 * Resources Page - Educational Materials
 * Videos, Presentations, FAQ
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
const SlideViewer = lazy(() => import('../components/SlideViewer'));
const VideoSection = lazy(() => import('../components/VideoSection'));
const FAQSection = lazy(() => import('../components/FAQSection'));

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
        background: 'rgba(245,158,11,0.15)',
        borderRadius: radius.full,
        marginBottom: spacing[4],
      }}
    >
      <span style={{ fontSize: 20 }}>📚</span>
      <span
        style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: '#f59e0b',
        }}
      >
        {isArabic ? 'مصادر التعلم' : 'Learning Resources'}
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
      {isArabic ? 'الموارد والمواد التعليمية' : 'Resources & Educational Materials'}
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
        ? 'استكشف مكتبتنا من الفيديوهات التعليمية والعروض التقديمية والأسئلة الشائعة'
        : 'Explore our library of educational videos, presentations, and frequently asked questions'}
    </p>
  </div>
));
PageHeader.displayName = 'PageHeader';

function ResourcesPage() {
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

        {/* Slide Viewer */}
        <FadeIn delay={100} scale>
          <Suspense fallback={<SectionLoader label={t('common.loadingSlides')} height={500} />}>
            <SlideViewer />
          </Suspense>
        </FadeIn>

        {/* Video Section */}
        <FadeIn delay={150} direction="right" distance={30} scale scaleFrom={0.98}>
          <Suspense fallback={<SectionLoader label={t('common.loadingVideos')} height={400} />}>
            <VideoSection />
          </Suspense>
        </FadeIn>

        {/* FAQ Section */}
        <FadeIn delay={200} direction="left" distance={30}>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={400} />}>
            <FAQSection />
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

export default memo(ResourcesPage);
