import { lazy, Suspense, useEffect, memo } from 'react';

import Header from './components/Header';
import { styles } from './components/styles';
import BackgroundFX from './components/BackgroundFX';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';
import ErrorBoundary from './components/ErrorBoundary';
import { GamificationProvider } from './context/GamificationContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import SectionLoader from './components/SectionLoader';
import FadeIn from './components/FadeIn';
import ScrollProgressBar from './components/ScrollProgressBar';

// Lazy load all non-critical sections for better initial load
const ProgramOverview = lazy(() => import('./components/ProgramOverview'));
const ResultsSection = lazy(() => import('./components/ResultsSection'));
const ComparisonSection = lazy(() => import('./components/ComparisonSection'));
const SchoolPartnershipSection = lazy(() => import('./components/SchoolPartnershipSection'));
const NeuroplasticitySection = lazy(() => import('./components/NeuroplasticitySection'));
const FAQSection = lazy(() => import('./components/FAQSection'));
const TestimonialsSection = lazy(() => import('./components/TestimonialsSection'));
const CredentialsBanner = lazy(() => import('./components/CredentialsBanner'));
const TreatmentTimeline = lazy(() => import('./components/TreatmentTimeline'));
const AudioSpectrumDemo = lazy(() => import('./components/AudioSpectrumDemo'));
const PartnerLogos = lazy(() => import('./components/PartnerLogos'));

// Heavy components - lazy loaded
const SlideViewer = lazy(() => import('./components/SlideViewer'));
const Checklist = lazy(() => import('./components/Checklist'));
const GameSection = lazy(() => import('./components/GameSection'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const AudioJourney = lazy(() => import('./components/AudioJourney'));
const VideoSection = lazy(() => import('./components/VideoSection'));
const RemoteProtocolSection = lazy(() => import('./components/RemoteProtocolSection'));
const IntakeForm = lazy(() => import('./components/IntakeForm'));

// Memoized section wrapper for consistent loading
const LazySection = memo(({
  children,
  labelKey,
  height = 300,
  fadeProps = {}
}: {
  children: React.ReactNode;
  labelKey: string;
  height?: number;
  fadeProps?: Record<string, unknown>;
}) => {
  const { t } = useLanguage();
  return (
    <FadeIn delay={50} {...fadeProps}>
      <Suspense fallback={<SectionLoader label={t(labelKey)} height={height} />}>
        {children}
      </Suspense>
    </FadeIn>
  );
});
LazySection.displayName = 'LazySection';

function App() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (!el) return;
      window.setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <GamificationProvider>
          <div style={styles.page}>
            <BackgroundFX />
            <Header />
            <ScrollProgressBar />

            <main style={styles.container}>
              {/* HERO - Critical, loads immediately */}
              <FadeIn duration={1000} scale blur blurAmount={8}>
                <HeroSection />
              </FadeIn>

              {/* Credentials Banner */}
              <LazySection labelKey="common.loading" height={100} fadeProps={{ direction: 'none', scale: true, scaleFrom: 0.98 }}>
                <CredentialsBanner />
              </LazySection>

              {/* Interactive Audio Journey */}
              <LazySection labelKey="common.loadingAudioJourney" height={400} fadeProps={{ direction: 'left', distance: 40 }}>
                <AudioJourney />
              </LazySection>

              {/* Neuroplasticity - Science Section */}
              <LazySection labelKey="common.loading" height={350} fadeProps={{ scale: true, blur: true, blurAmount: 5 }}>
                <NeuroplasticitySection />
              </LazySection>

              {/* Audio Spectrum Demo */}
              <LazySection labelKey="common.loading" height={300} fadeProps={{ direction: 'right', distance: 40 }}>
                <AudioSpectrumDemo />
              </LazySection>

              <LazySection labelKey="common.loading" height={350} fadeProps={{ scale: true, scaleFrom: 0.96 }}>
                <ProgramOverview />
              </LazySection>

              {/* Treatment Timeline */}
              <LazySection labelKey="common.loading" height={300} fadeProps={{ direction: 'left', distance: 30, scale: true }}>
                <TreatmentTimeline />
              </LazySection>

              {/* Remote Protocol */}
              <LazySection labelKey="common.loadingRemote" height={400} fadeProps={{ direction: 'right', distance: 30 }}>
                <RemoteProtocolSection />
              </LazySection>

              <LazySection labelKey="common.loading" height={350} fadeProps={{ scale: true, scaleFrom: 0.97, blur: true, blurAmount: 4 }}>
                <ResultsSection />
              </LazySection>

              {/* Testimonials */}
              <LazySection labelKey="common.loading" height={350} fadeProps={{ direction: 'left', distance: 35 }}>
                <TestimonialsSection />
              </LazySection>

              {/* SlideViewer */}
              <LazySection labelKey="common.loadingSlides" height={500} fadeProps={{ scale: true }}>
                <SlideViewer />
              </LazySection>

              {/* Video Section */}
              <LazySection labelKey="common.loadingVideos" height={400} fadeProps={{ direction: 'right', distance: 30, scale: true, scaleFrom: 0.98 }}>
                <VideoSection />
              </LazySection>

              {/* Checklist */}
              <LazySection labelKey="common.loadingChecklist" height={400} fadeProps={{ blur: true, blurAmount: 6, scale: true }}>
                <Checklist />
              </LazySection>

              {/* GameSection */}
              <LazySection labelKey="common.loadingGames" height={350} fadeProps={{ direction: 'left', distance: 40, scale: true, scaleFrom: 0.95 }}>
                <GameSection />
              </LazySection>

              <LazySection labelKey="common.loading" height={350} fadeProps={{ scale: true, blur: true, blurAmount: 5 }}>
                <ComparisonSection />
              </LazySection>

              <LazySection labelKey="common.loading" height={300} fadeProps={{ direction: 'right', distance: 25 }}>
                <SchoolPartnershipSection />
              </LazySection>

              {/* Partner Logos */}
              <LazySection labelKey="common.loading" height={150} fadeProps={{ direction: 'none', scale: true, scaleFrom: 0.97 }}>
                <PartnerLogos />
              </LazySection>

              {/* FAQ Section */}
              <LazySection labelKey="common.loading" height={400} fadeProps={{ direction: 'left', distance: 30 }}>
                <FAQSection />
              </LazySection>

              {/* Intake Form */}
              <LazySection labelKey="common.loadingIntake" height={500} fadeProps={{ scale: true, blur: true, blurAmount: 4 }}>
                <IntakeForm />
              </LazySection>

              {/* Contact Form */}
              <LazySection labelKey="common.loadingContact" height={700} fadeProps={{ scale: true, blur: true, blurAmount: 4 }}>
                <ContactForm />
              </LazySection>

              <FadeIn delay={100} direction="none" scale scaleFrom={0.98}>
                <Footer />
              </FadeIn>
            </main>

            <WhatsAppFab />
          </div>
        </GamificationProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default memo(App);
