/**
 * Science Page - Research & Neuroplasticity
 * Educational content about the science behind AIT
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
import LabCard from '../components/labui/LabCard';
import LabButtonAnchor from '../components/labui/LabButtonAnchor';
import { BrainCircuitIcon } from '../components/icons/index';
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
const SoundLabSimulation = lazy(() => import('../components/treatment/SoundLabSimulation'));

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
        background: `${brandPink}15`,
        borderRadius: radius.full,
        marginBottom: spacing[4],
      }}
    >
      <span style={{ fontSize: 20 }}>
        <BrainCircuitIcon size={20} tone="pink" />
      </span>
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
    <LabShell variant="primary">
      <BackgroundFX />
      <Header />

      <LabShellContent>
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

        {/* Sound Lab Simulation */}
        <FadeIn delay={175} direction="none" scale scaleFrom={0.98}>
          <section
            id="simulation"
            style={{
              marginTop: spacing[5],
              display: 'grid',
              gap: spacing[4],
              direction: isArabic ? 'rtl' : 'ltr',
              textAlign: isArabic ? 'right' : 'left',
            }}
          >
            <LabCard variant="glass" tone="pink">
              <div style={{ display: 'grid', gap: spacing[2] }}>
                <div
                  style={{
                    fontSize: typography.size.lg,
                    fontWeight: typography.weight.bold,
                    color: colors.text.primary,
                  }}
                >
                  {isArabic ? 'محاكاة مختبر الصوت' : t('science.simulationTitle', 'Sound Lab Simulation')}
                </div>
                <p
                  style={{
                    margin: 0,
                    color: colors.text.secondary,
                    fontSize: typography.size.sm,
                    lineHeight: typography.lineHeight.relaxed,
                  }}
                >
                  {isArabic
                    ? 'استكشف الطبقات الطيفية والترددات المستهدفة كما تظهر داخل المختبر.'
                    : t('science.simulationIntro', 'Explore spectrum layers and targeted bands in a live lab-style preview.')}
                </p>
                <div>
                  <LabButtonAnchor href="/lab#modules" variant="primary">
                    {isArabic ? 'استعرض الوحدات' : t('science.simulationCta', 'Browse Modules')}
                  </LabButtonAnchor>
                </div>
              </div>
            </LabCard>

            <Suspense fallback={<SectionLoader label={t('common.loading')} height={320} />}>
              <SoundLabSimulation locale={isArabic ? 'ar' : 'en'} />
            </Suspense>
          </section>
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
      </LabShellContent>

      <WhatsAppFab />
      <ScrollToTopButton />
    </LabShell>
  );
}

export default memo(SciencePage);
