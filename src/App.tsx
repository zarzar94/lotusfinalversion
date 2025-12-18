import { lazy, Suspense, useEffect, memo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import { styles } from './components/styles';
import BackgroundFX from './components/BackgroundFX';
import HeroCircuitBrain from './components/HeroCircuitBrain';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';
import StickyCTA from './components/StickyCTA';
import ErrorBoundary from './components/ErrorBoundary';
import { GamificationProvider } from './context/GamificationContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import SectionLoader from './components/SectionLoader';
import FadeIn from './components/FadeIn';
import ScrollProgressBar from './components/ScrollProgressBar';
import AchievementToast from './components/AchievementToast';
import ProgressDashboard from './components/ProgressDashboard';
import ScrollProgressTracker from './components/ScrollProgressTracker';
import ActivityFeed from './components/ActivityFeed';

// Lazy load pages
const BrainFunctionPage = lazy(() => import('./pages/BrainFunctionPage'));

// Lazy load all non-critical sections for better initial load
const PlatformNav = lazy(() => import('./components/PlatformNav'));
const SectionDivider = lazy(() => import('./components/SectionDivider'));
const ProgramOverview = lazy(() => import('./components/ProgramOverview'));
const ResultsSection = lazy(() => import('./components/ResultsSection'));
const ComparisonSection = lazy(() => import('./components/ComparisonSection'));
const SchoolPartnershipSection = lazy(() => import('./components/SchoolPartnershipSection'));
const NeuroplasticitySection = lazy(() => import('./components/NeuroplasticitySection'));
const FAQSection = lazy(() => import('./components/FAQSection'));
const TestimonialsSection = lazy(() => import('./components/TestimonialsSection'));
const TrustSignals = lazy(() => import('./components/TrustSignals'));
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

// Home page content
function HomePage() {
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
    <div style={styles.page}>
      <BackgroundFX />
      <Header />
      <ScrollProgressBar />

      <main style={styles.container}>
        {/* ═══════════════════════════════════════════════════════════════════
            LANDING SECTION - First Viewport
            ═══════════════════════════════════════════════════════════════════ */}

        {/* HERO - Interactive Brain Dashboard */}
        <FadeIn duration={1000} scale blur blurAmount={8}>
          <HeroCircuitBrain />
        </FadeIn>

        {/* Credentials Banner - Trust signals */}
        <LazySection labelKey="common.loading" height={100} fadeProps={{ direction: 'none', scale: true, scaleFrom: 0.98 }}>
          <CredentialsBanner />
        </LazySection>

        {/* Platform Navigation - Medical Dashboard Style */}
        <LazySection labelKey="common.loading" height={350} fadeProps={{ scale: true, scaleFrom: 0.97 }}>
          <PlatformNav />
        </LazySection>

        {/* ═══════════════════════════════════════════════════════════════════
            DIAGNOSTIC TOOLS - Assessment & Interactive
            ═══════════════════════════════════════════════════════════════════ */}

        {/* Section Divider - Diagnostic */}
        <Suspense fallback={null}>
          <SectionDivider category="diagnostic" number={1} />
        </Suspense>

        {/* Checklist - Self Assessment */}
        <LazySection labelKey="common.loadingChecklist" height={400} fadeProps={{ blur: true, blurAmount: 6, scale: true }}>
          <Checklist />
        </LazySection>

        {/* GameSection - Interactive Tools */}
        <LazySection labelKey="common.loadingGames" height={350} fadeProps={{ direction: 'left', distance: 40, scale: true, scaleFrom: 0.95 }}>
          <GameSection />
        </LazySection>

        {/* ═══════════════════════════════════════════════════════════════════
            TREATMENT PROTOCOL - Program Information
            ═══════════════════════════════════════════════════════════════════ */}

        {/* Section Divider - Protocol */}
        <Suspense fallback={null}>
          <SectionDivider category="protocol" number={2} />
        </Suspense>

        {/* Program Overview */}
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

        {/* Comparison */}
        <LazySection labelKey="common.loading" height={350} fadeProps={{ scale: true, blur: true, blurAmount: 5 }}>
          <ComparisonSection />
        </LazySection>

        {/* ═══════════════════════════════════════════════════════════════════
            RESEARCH & SCIENCE - Educational Content
            ═══════════════════════════════════════════════════════════════════ */}

        {/* Section Divider - Science */}
        <Suspense fallback={null}>
          <SectionDivider category="science" number={3} />
        </Suspense>

        {/* Neuroplasticity - Science Section */}
        <LazySection labelKey="common.loading" height={350} fadeProps={{ scale: true, blur: true, blurAmount: 5 }}>
          <NeuroplasticitySection />
        </LazySection>

        {/* Interactive Audio Journey */}
        <LazySection labelKey="common.loadingAudioJourney" height={400} fadeProps={{ direction: 'left', distance: 40 }}>
          <AudioJourney />
        </LazySection>

        {/* Audio Spectrum Demo */}
        <LazySection labelKey="common.loading" height={300} fadeProps={{ direction: 'right', distance: 40 }}>
          <AudioSpectrumDemo />
        </LazySection>

        {/* ═══════════════════════════════════════════════════════════════════
            RESULTS & EVIDENCE - Social Proof
            ═══════════════════════════════════════════════════════════════════ */}

        {/* Section Divider - Evidence */}
        <Suspense fallback={null}>
          <SectionDivider category="evidence" number={4} />
        </Suspense>

        {/* Results Section */}
        <LazySection labelKey="common.loading" height={350} fadeProps={{ scale: true, scaleFrom: 0.97, blur: true, blurAmount: 4 }}>
          <ResultsSection />
        </LazySection>

        {/* Testimonials */}
        <LazySection labelKey="common.loading" height={350} fadeProps={{ direction: 'left', distance: 35 }}>
          <TestimonialsSection />
        </LazySection>

        {/* Trust Signals */}
        <LazySection labelKey="common.loading" height={250} fadeProps={{ direction: 'none', scale: true, scaleFrom: 0.98 }}>
          <TrustSignals />
        </LazySection>

        {/* ═══════════════════════════════════════════════════════════════════
            LEARNING RESOURCES - Educational Materials
            ═══════════════════════════════════════════════════════════════════ */}

        {/* Section Divider - Resources */}
        <Suspense fallback={null}>
          <SectionDivider category="resources" number={5} />
        </Suspense>

        {/* SlideViewer - Presentations */}
        <LazySection labelKey="common.loadingSlides" height={500} fadeProps={{ scale: true }}>
          <SlideViewer />
        </LazySection>

        {/* Video Section */}
        <LazySection labelKey="common.loadingVideos" height={400} fadeProps={{ direction: 'right', distance: 30, scale: true, scaleFrom: 0.98 }}>
          <VideoSection />
        </LazySection>

        {/* FAQ Section */}
        <LazySection labelKey="common.loading" height={400} fadeProps={{ direction: 'left', distance: 30 }}>
          <FAQSection />
        </LazySection>

        {/* ═══════════════════════════════════════════════════════════════════
            PARTNERSHIPS & NETWORK
            ═══════════════════════════════════════════════════════════════════ */}

        {/* Section Divider - Network */}
        <Suspense fallback={null}>
          <SectionDivider category="network" number={6} />
        </Suspense>

        {/* School Partnership */}
        <LazySection labelKey="common.loading" height={300} fadeProps={{ direction: 'right', distance: 25 }}>
          <SchoolPartnershipSection />
        </LazySection>

        {/* Partner Logos */}
        <LazySection labelKey="common.loading" height={150} fadeProps={{ direction: 'none', scale: true, scaleFrom: 0.97 }}>
          <PartnerLogos />
        </LazySection>

        {/* ═══════════════════════════════════════════════════════════════════
            CONNECT & CONVERSION - Contact & Intake
            ═══════════════════════════════════════════════════════════════════ */}

        {/* Section Divider - Connect */}
        <Suspense fallback={null}>
          <SectionDivider category="connect" number={7} />
        </Suspense>

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
      <StickyCTA />

      {/* Gamification UI */}
      <AchievementToast />
      <ProgressDashboard />
      <ScrollProgressTracker />
      <ActivityFeed />
    </div>
  );
}

// Page loading fallback
function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#05060d',
      color: '#8FD3CC',
      fontSize: 18,
      fontFamily: 'Cairo, sans-serif',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 50,
          height: 50,
          border: '3px solid rgba(143,211,204,0.2)',
          borderTopColor: '#8FD3CC',
          borderRadius: '50%',
          margin: '0 auto 16px',
          animation: 'spin 1s linear infinite',
        }} />
        Loading...
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <LanguageProvider>
          <GamificationProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/function/:slug"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <BrainFunctionPage />
                  </Suspense>
                }
              />
            </Routes>
          </GamificationProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default memo(App);
