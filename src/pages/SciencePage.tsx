/**
 * Science Page - Research & Neuroplasticity
 * Educational content about the science behind AIT
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
  brandPink,
  colors,
  typography,
  spacing,
  radius,
} from '../components/styles';

// Lazy load sections
const NeuroplasticitySection = lazy(() => import('../components/NeuroplasticitySection'));
const AudioJourney = lazy(() => import('../components/AudioJourney'));
const AudioSpectrumDemo = lazy(() => import('../components/AudioSpectrumDemo'));

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
        background: `${brandPink}15`,
        borderRadius: radius.full,
        marginBottom: spacing[4],
      }}
    >
      <span style={{ fontSize: 20 }}>🧠</span>
      <span
        style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: brandPink,
        }}
      >
        {isArabic ? 'العلم والأبحاث' : 'Science & Research'}
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
      {isArabic ? 'المرونة العصبية والصوت' : 'Neuroplasticity & Sound'}
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
        ? 'اكتشف كيف يستخدم الدماغ المرونة العصبية لإعادة توصيل مسارات المعالجة السمعية من خلال التحفيز الصوتي المستهدف'
        : 'Discover how the brain uses neuroplasticity to rewire auditory processing pathways through targeted sound stimulation'}
    </p>
  </div>
));
PageHeader.displayName = 'PageHeader';

function SciencePage() {
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

        {/* Neuroplasticity Section */}
        <FadeIn delay={100} scale blur blurAmount={5}>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={350} />}>
            <NeuroplasticitySection />
          </Suspense>
        </FadeIn>

        {/* Interactive Audio Journey */}
        <FadeIn delay={150} direction="left" distance={40}>
          <Suspense fallback={<SectionLoader label={t('common.loadingAudioJourney')} height={400} />}>
            <AudioJourney />
          </Suspense>
        </FadeIn>

        {/* Audio Spectrum Demo */}
        <FadeIn delay={200} direction="right" distance={40}>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={300} />}>
            <AudioSpectrumDemo />
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

export default memo(SciencePage);
