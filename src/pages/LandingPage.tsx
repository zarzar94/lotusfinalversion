/**
 * Landing Page - Hero + Credentials Only
 * Clean, focused entry point to the platform
 */

import { lazy, Suspense, memo, useCallback, useEffect, useState } from 'react';
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
import ClinicalProtocolSection from '../components/ClinicalProtocolSection';
import { styles } from '../components/styles';

// Lazy load credentials
const CredentialsBanner = lazy(() => import('../components/CredentialsBanner'));
const QuickActionsPanel = lazy(() => import('../components/QuickActionsPanel'));
const WhatIsAIT = lazy(() => import('../components/WhatIsAIT'));
const TrustSignals = lazy(() => import('../components/TrustSignals'));



function LandingPage() {
  const { isArabic } = useLanguage();
  const [isCertificationsOpen, setIsCertificationsOpen] = useState(false);

  const openCertifications = useCallback(() => setIsCertificationsOpen(true), []);
  const closeCertifications = useCallback(() => setIsCertificationsOpen(false), []);

  useEffect(() => {
    if (!isCertificationsOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCertifications();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCertificationsOpen, closeCertifications]);
  useClinicalSync();
  usePageTitle();

  return (
    <div style={styles.page}>
      <BackgroundFX />
      <Header />

      <main style={styles.container}>
        {/* HERO - Interactive Brain Dashboard */}
        <FadeIn duration={1000} scale blur blurAmount={8}>
          <HeroCircuitBrain onOpenCertifications={openCertifications} />
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

      {isCertificationsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isArabic ? 'الاعتمادات والشهادات' : 'Certifications & Credentials'}
          onClick={closeCertifications}
          style={{
            ...styles.modalBackdrop,
            zIndex: 1000,
            background: 'rgba(5,6,13,0.88)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              ...styles.modal,
              maxWidth: 1100,
              width: '100%',
              padding: 0,
              background: 'transparent',
              border: 'none',
            }}
          >
            <div style={{ position: 'relative' }}>
              <button
                onClick={closeCertifications}
                aria-label={isArabic ? 'إغلاق' : 'Close'}
                style={{
                  position: 'absolute',
                  top: 12,
                  [isArabic ? 'left' : 'right']: 12,
                  zIndex: 2,
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(0,0,0,0.4)',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                X
              </button>
              <Suspense fallback={<SectionLoader label={isArabic ? 'جارٍ التحميل...' : 'Loading...'} height={200} />}>
                <CredentialsBanner />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(LandingPage);
