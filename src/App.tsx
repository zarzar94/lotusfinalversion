import { lazy, Suspense, useEffect, useState } from 'react';

import Header from './components/Header';
import { styles } from './components/styles';
import BackgroundFX from './components/BackgroundFX';
import HeroSection from './components/HeroSection';
import ProgramOverview from './components/ProgramOverview';
import ResultsSection from './components/ResultsSection';
import ComparisonSection from './components/ComparisonSection';
import SchoolPartnershipSection from './components/SchoolPartnershipSection';
import Footer from './components/Footer';
import WhatsAppFab from './components/WhatsAppFab';
import ErrorBoundary from './components/ErrorBoundary';
import { GamificationProvider } from './context/GamificationContext';
import AchievementNotification from './components/AchievementNotification';
import ProgressHUD from './components/ProgressHUD';
import SectionLoader from './components/SectionLoader';
import FadeIn from './components/FadeIn';

const SlideViewer = lazy(() => import('./components/SlideViewer'));
const Checklist = lazy(() => import('./components/Checklist'));
const GameSection = lazy(() => import('./components/GameSection'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const AudioJourney = lazy(() => import('./components/AudioJourney'));

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

          {/* Gamification UI */}
          <AchievementNotification />
          <ProgressHUD />

          <main style={styles.container}>
            {/* HERO with 3D Brain */}
            <FadeIn duration={800}>
              <HeroSection />
            </FadeIn>

            {/* Interactive Audio Journey */}
            <FadeIn delay={100}>
              <Suspense fallback={<SectionLoader label="جارٍ تحميل رحلة الصوت..." height={400} />}>
                <AudioJourney />
              </Suspense>
            </FadeIn>

            <FadeIn delay={50}>
              <ProgramOverview />
            </FadeIn>

            <FadeIn delay={50}>
              <ResultsSection />
            </FadeIn>

            <FadeIn delay={50}>
              <Suspense fallback={<SectionLoader label="جارٍ تحميل عارض الشرائح..." height={500} />}>
                <SlideViewer />
              </Suspense>
            </FadeIn>

            <FadeIn delay={50}>
              <Suspense fallback={<SectionLoader label="جارٍ تحميل قائمة التحقق..." height={400} />}>
                <Checklist />
              </Suspense>
            </FadeIn>

            <FadeIn delay={50}>
              <Suspense fallback={<SectionLoader label="جارٍ تحميل الألعاب..." height={350} />}>
                <GameSection />
              </Suspense>
            </FadeIn>

            <FadeIn delay={50}>
              <ComparisonSection />
            </FadeIn>

            <FadeIn delay={50}>
              <SchoolPartnershipSection />
            </FadeIn>

            <FadeIn delay={50}>
              <Suspense fallback={<SectionLoader label="جارٍ تحميل نموذج التواصل..." height={300} />}>
                <ContactForm />
              </Suspense>
            </FadeIn>

            <FadeIn delay={100}>
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
