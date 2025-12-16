import { lazy, Suspense, useEffect } from 'react';

import Header from './components/Header';
import { styles } from './components/styles';
import BackgroundFX from './components/BackgroundFX';
import HeroSection from './components/HeroSection';
import ProgramOverview from './components/ProgramOverview';
import ResultsSection from './components/ResultsSection';
import ComparisonSection from './components/ComparisonSection';
import SchoolPartnershipSection from './components/SchoolPartnershipSection';
import NeuroplasticitySection from './components/NeuroplasticitySection';
import FAQSection from './components/FAQSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';
import ErrorBoundary from './components/ErrorBoundary';
import { GamificationProvider } from './context/GamificationContext';
import AchievementNotification from './components/AchievementNotification';
import ProgressHUD from './components/ProgressHUD';
import SectionLoader from './components/SectionLoader';
import FadeIn from './components/FadeIn';
import CredentialsBanner from './components/CredentialsBanner';
import TreatmentTimeline from './components/TreatmentTimeline';
import AudioSpectrumDemo from './components/AudioSpectrumDemo';
import PartnerLogos from './components/PartnerLogos';
import ScrollProgressBar from './components/ScrollProgressBar';

const SlideViewer = lazy(() => import('./components/SlideViewer'));
const Checklist = lazy(() => import('./components/Checklist'));
const GameSection = lazy(() => import('./components/GameSection'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const AudioJourney = lazy(() => import('./components/AudioJourney'));
const VideoSection = lazy(() => import('./components/VideoSection'));
const RemoteProtocolSection = lazy(() => import('./components/RemoteProtocolSection'));

function App() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (!el) return;
      // Delay helps when loading directly into a section (React mounts after initial HTML parse)
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
      <GamificationProvider>
        <div style={styles.page}>
          <BackgroundFX />
          <Header />
          <ScrollProgressBar />

          {/* Gamification UI */}
          <AchievementNotification />
          <ProgressHUD />

          <main style={styles.container}>
            {/* HERO with 3D Brain */}
            <FadeIn duration={1000} scale blur blurAmount={8}>
              <HeroSection />
            </FadeIn>

            {/* Credentials Banner */}
            <FadeIn delay={50} direction="none" scale scaleFrom={0.98}>
              <CredentialsBanner />
            </FadeIn>

            {/* Interactive Audio Journey */}
            <FadeIn delay={100} direction="left" distance={40}>
              <Suspense fallback={<SectionLoader label="جارٍ تحميل رحلة الصوت..." height={400} />}>
                <AudioJourney />
              </Suspense>
            </FadeIn>

            {/* Neuroplasticity - Science Section */}
            <FadeIn delay={50} scale blur blurAmount={5}>
              <NeuroplasticitySection />
            </FadeIn>

            {/* Audio Spectrum Demo */}
            <FadeIn delay={50} direction="right" distance={40}>
              <AudioSpectrumDemo />
            </FadeIn>

            <FadeIn delay={50} scale scaleFrom={0.96}>
              <ProgramOverview />
            </FadeIn>

            {/* Treatment Timeline */}
            <FadeIn delay={50} direction="left" distance={30} scale>
              <TreatmentTimeline />
            </FadeIn>

            {/* Remote Protocol */}
            <FadeIn delay={50} direction="right" distance={30}>
              <Suspense fallback={<SectionLoader label="جارٍ تحميل البرنامج عن بُعد..." height={400} />}>
                <RemoteProtocolSection />
              </Suspense>
            </FadeIn>

            <FadeIn delay={50} scale scaleFrom={0.97} blur blurAmount={4}>
              <ResultsSection />
            </FadeIn>

            {/* Testimonials / Success Stories */}
            <FadeIn delay={50} direction="left" distance={35}>
              <TestimonialsSection />
            </FadeIn>

            <FadeIn delay={50} scale>
              <Suspense fallback={<SectionLoader label="جارٍ تحميل عارض الشرائح..." height={500} />}>
                <SlideViewer />
              </Suspense>
            </FadeIn>

            {/* Video Section */}
            <FadeIn delay={50} direction="right" distance={30} scale scaleFrom={0.98}>
              <Suspense fallback={<SectionLoader label="جارٍ تحميل الفيديوهات..." height={400} />}>
                <VideoSection />
              </Suspense>
            </FadeIn>

            <FadeIn delay={50} blur blurAmount={6} scale>
              <Suspense fallback={<SectionLoader label="جارٍ تحميل قائمة التحقق..." height={400} />}>
                <Checklist />
              </Suspense>
            </FadeIn>

            <FadeIn delay={50} direction="left" distance={40} scale scaleFrom={0.95}>
              <Suspense fallback={<SectionLoader label="جارٍ تحميل الألعاب..." height={350} />}>
                <GameSection />
              </Suspense>
            </FadeIn>

            <FadeIn delay={50} scale blur blurAmount={5}>
              <ComparisonSection />
            </FadeIn>

            <FadeIn delay={50} direction="right" distance={25}>
              <SchoolPartnershipSection />
            </FadeIn>

            {/* Partner Logos */}
            <FadeIn delay={50} direction="none" scale scaleFrom={0.97}>
              <PartnerLogos />
            </FadeIn>

            {/* FAQ Section */}
            <FadeIn delay={50} direction="left" distance={30}>
              <FAQSection />
            </FadeIn>

            <FadeIn delay={50} scale blur blurAmount={4}>
              <Suspense fallback={<SectionLoader label="جارٍ تحميل نموذج التواصل..." height={300} />}>
                <ContactForm />
              </Suspense>
            </FadeIn>

            <FadeIn delay={100} direction="none" scale scaleFrom={0.98}>
              <Footer />
            </FadeIn>
          </main>

          <WhatsAppFab />
        </div>
      </GamificationProvider>
    </ErrorBoundary>
  );
}

export default App;
