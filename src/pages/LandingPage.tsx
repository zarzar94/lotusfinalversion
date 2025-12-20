/**
 * Landing Page - Hero + Credentials Only
 * Clean, focused entry point to the platform
 */

import { lazy, Suspense, memo } from 'react';
import Header from '../components/Header';
import BackgroundFX from '../components/BackgroundFX';
import HeroCircuitBrain from '../components/HeroCircuitBrain';
import Footer from '../components/Footer';
import WhatsAppFab from '../components/WhatsAppFab';
import ScrollToTopButton from '../components/ScrollToTopButton';
import SectionLoader from '../components/SectionLoader';
import FadeIn from '../components/FadeIn';
import { useLanguage } from '../context/LanguageContext';
import { useClinicalSync } from '../hooks/useClinicalSync';
import { usePageTitle } from '../hooks/usePageTitle';
import ExperienceJourney from '../components/ExperienceJourney';
import LabModeSelector from '../components/LabModeSelector';
import ClinicalProtocolSection from '../components/ClinicalProtocolSection';
import { styles } from '../components/styles';

// Lazy load credentials
const CredentialsBanner = lazy(() => import('../components/CredentialsBanner'));
const QuickActionsPanel = lazy(() => import('../components/QuickActionsPanel'));
const WhatIsAIT = lazy(() => import('../components/WhatIsAIT'));
const TrustSignals = lazy(() => import('../components/TrustSignals'));



function LandingPage() {
  const { isArabic } = useLanguage();
  useClinicalSync();
  usePageTitle();

  return (
    <div style={styles.page}>
      <BackgroundFX />
      <Header />

      <main style={styles.container}>
        {/* HERO - Interactive Brain Dashboard */}
        <FadeIn duration={1000} scale blur blurAmount={8}>
          <HeroCircuitBrain />
        </FadeIn>

        {/* MODE SELECTOR - Choose Your Path */}
        <FadeIn delay={300} direction="up" distance={30}>
          <LabModeSelector />
        </FadeIn>

        {/* Credentials Banner - Trust signals */}
        <FadeIn delay={200} direction="none" scale scaleFrom={0.98}>
          <Suspense fallback={<SectionLoader label={isArabic ? 'جارٍ التحميل...' : 'Loading...'} height={100} />}>
            <CredentialsBanner />
          </Suspense>
        </FadeIn>

        {/* Guided journey section */}
        <FadeIn delay={200} direction="none" scale>
          <ExperienceJourney isArabic={isArabic} />
        </FadeIn>

        {/* Quick Actions Panel - Role-specific CTAs */}
        <FadeIn delay={300} direction="up" distance={30}>
          <Suspense fallback={<SectionLoader label={isArabic ? 'جارٍ التحميل...' : 'Loading...'} height={200} />}>
            <QuickActionsPanel />
          </Suspense>
        </FadeIn>

        {/* Clinical Protocol - Trust Kit */}
        <FadeIn delay={350} direction="up" distance={20}>
          <ClinicalProtocolSection />
        </FadeIn>

        {/* What is AIT - Medical trust content */}
        <FadeIn delay={400} direction="up" distance={30}>
          <Suspense fallback={<SectionLoader label={isArabic ? 'جارٍ التحميل...' : 'Loading...'} height={400} />}>
            <WhatIsAIT />
          </Suspense>
        </FadeIn>

        {/* Trust Signals - Role-aware metrics */}
        <FadeIn delay={500} direction="up" distance={30}>
          <Suspense fallback={<SectionLoader label={isArabic ? 'جارٍ التحميل...' : 'Loading...'} height={300} />}>
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

export default memo(LandingPage);
