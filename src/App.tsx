import { lazy, Suspense, useEffect } from 'react';

import Header from './components/Header';
import { styles, brandCyan, brandPink, brandPurpleDark } from './components/styles';
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
            <HeroSection />

            {/* Interactive Audio Journey */}
            <Suspense fallback={<div style={styles.sectionCard}>جارٍ تحميل رحلة الصوت…</div>}>
              <AudioJourney />
            </Suspense>

            <ProgramOverview />
            <ResultsSection />

            <Suspense fallback={<div style={styles.sectionCard}>جارٍ تحميل عارض الشرائح…</div>}>
              <SlideViewer />
            </Suspense>

            <Suspense fallback={<div style={styles.sectionCard}>جارٍ تحميل قائمة التحقق…</div>}>
              <Checklist />
            </Suspense>

            <Suspense fallback={<div style={styles.sectionCard}>جارٍ تحميل الألعاب…</div>}>
              <GameSection />
            </Suspense>

            <ComparisonSection />
            <SchoolPartnershipSection />

            <Suspense fallback={<div style={styles.sectionCard}>جارٍ تحميل نموذج التواصل…</div>}>
              <ContactForm />
            </Suspense>

            <Footer />
          </main>

          <WhatsAppFab />
        </div>
      </GamificationProvider>
    </ErrorBoundary>
  );
}

export default App;
