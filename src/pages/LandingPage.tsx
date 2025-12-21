/**
 * Landing Page - Hero + Credentials Only
 * Clean, focused entry point to the platform
 */

import { lazy, Suspense, memo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import LabModeSelector from '../components/LabModeSelector';
import ExperienceJourney from '../components/ExperienceJourney';
import CircuitDecoration from '../components/CircuitDecoration';
import { brandCyan, brandPink, brandPurple, colors, radius, spacing, styles, typography } from '../components/styles';

// Lazy load credentials
const CredentialsBanner = lazy(() => import('../components/CredentialsBanner'));
const QuickActionsPanel = lazy(() => import('../components/QuickActionsPanel'));
const WhatIsAIT = lazy(() => import('../components/WhatIsAIT'));
const TrustSignals = lazy(() => import('../components/TrustSignals'));

// Enhanced Navigation Card Component
const NavigationCard = memo(({
  page,
  isArabic,
  onClick,
}: {
  page: {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    path: string;
  };
  isArabic: boolean;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        padding: spacing[6],
        background: isHovered
          ? `linear-gradient(135deg, ${colors.surface.card}, ${page.color}08)`
          : colors.surface.card,
        border: `1px solid ${isHovered ? page.color : colors.border.default}`,
        borderRadius: radius.xl,
        cursor: 'pointer',
        textAlign: 'start',
        direction: isArabic ? 'rtl' : 'ltr',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative',
        overflow: 'hidden',
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered
          ? `0 16px 40px ${page.color}25, 0 0 0 1px ${page.color}30`
          : 'none',
      }}
    >
      {/* Animated gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${isArabic ? 'right' : 'left'} top, ${page.color}12 0%, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Animated corner accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          [isArabic ? 'left' : 'right']: 0,
          width: 80,
          height: 80,
          background: `linear-gradient(135deg, transparent 50%, ${page.color}15 50%)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: radius.lg,
          background: isHovered
            ? `linear-gradient(135deg, ${page.color}25, ${page.color}15)`
            : `${page.color}15`,
          border: `1px solid ${isHovered ? `${page.color}40` : 'transparent'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
          marginBottom: spacing[4],
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.1) rotate(-3deg)' : 'scale(1) rotate(0)',
          boxShadow: isHovered ? `0 8px 20px ${page.color}30` : 'none',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {page.icon}
      </div>

      {/* Title */}
      <h3
        style={{
          margin: 0,
          fontSize: typography.size.lg,
          fontWeight: typography.weight.bold,
          color: isHovered ? page.color : colors.text.primary,
          marginBottom: spacing[2],
          transition: 'color 0.3s ease',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {page.title}
      </h3>

      {/* Description */}
      <p
        style={{
          margin: 0,
          fontSize: typography.size.sm,
          color: colors.text.secondary,
          lineHeight: typography.lineHeight.relaxed,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {page.description}
      </p>

      {/* Arrow indicator with animation */}
      <div
        style={{
          position: 'absolute',
          bottom: spacing[4],
          [isArabic ? 'left' : 'right']: spacing[4],
          color: page.color,
          fontSize: 22,
          opacity: isHovered ? 1 : 0.5,
          transition: 'all 0.3s ease',
          transform: isHovered
            ? `translateX(${isArabic ? '-8px' : '8px'})`
            : 'translateX(0)',
          zIndex: 1,
        }}
      >
        {isArabic ? '←' : '→'}
      </div>

      {/* Pulse ring on hover */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: 28,
            [isArabic ? 'right' : 'left']: 28,
            width: 64,
            height: 64,
            borderRadius: radius.lg,
            border: `2px solid ${page.color}`,
            animation: 'navCardPulse 1.5s ease-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}
    </button>
  );
});
NavigationCard.displayName = 'NavigationCard';

// Quick Navigation Cards to other pages
const PageNavigationCards = memo(() => {
  const navigate = useNavigate();
  const { isArabic, t } = useLanguage();

  const pages = [
    {
      id: 'assessment',
      title: t('landing.cards.assessment.title'),
      description: t('landing.cards.assessment.description'),
      icon: '🎯',
      color: brandCyan,
      path: '/assessment',
    },
    {
      id: 'program',
      title: t('landing.cards.program.title'),
      description: t('landing.cards.program.description'),
      icon: '📋',
      color: brandPurple,
      path: '/program',
    },
    {
      id: 'science',
      title: t('landing.cards.science.title'),
      description: t('landing.cards.science.description'),
      icon: '🧠',
      color: brandPink,
      path: '/science',
    },
    {
      id: 'results',
      title: t('landing.cards.results.title'),
      description: t('landing.cards.results.description'),
      icon: '📊',
      color: '#22c55e',
      path: '/results',
    },
    {
      id: 'resources',
      title: t('landing.cards.resources.title'),
      description: t('landing.cards.resources.description'),
      icon: '📚',
      color: '#f59e0b',
      path: '/resources',
    },
    {
      id: 'about',
      title: t('landing.cards.about.title'),
      description: t('landing.cards.about.description'),
      icon: '🏛️',
      color: brandPurple,
      path: '/about',
    },
    {
      id: 'contact',
      title: t('landing.cards.contact.title'),
      description: t('landing.cards.contact.description'),
      icon: '✉️',
      color: brandCyan,
      path: '/contact',
    },
  ];

  const css = `
    @keyframes navCardPulse {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(1.5); opacity: 0; }
    }
    @keyframes sectionGlow {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.5; }
    }
    @media (max-width: 640px) {
      .nav-section {
        padding: ${spacing[6]}px ${spacing[3]}px !important;
      }
      .nav-section-title {
        font-size: ${typography.size['2xl']}px !important;
      }
      .nav-cards-grid {
        gap: ${spacing[3]}px !important;
      }
    }
  `;

  return (
    <section
      id="navigate"
      className="nav-section"
      style={{
        padding: `${spacing[10]}px ${spacing[4]}px`,
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <style>{css}</style>

      {/* Circuit decoration for this section */}
      <CircuitDecoration variant="sparse" opacity={0.1} />

      {/* Section header with enhanced styling */}
      <div style={{ textAlign: 'center', marginBottom: spacing[10], position: 'relative' }}>
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[1.5]}px ${spacing[4]}px`,
            background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
            border: `1px solid ${brandCyan}25`,
            borderRadius: radius.full,
            marginBottom: spacing[4],
          }}
        >
          <span style={{ fontSize: 14 }}>🧭</span>
          <span
            style={{
              fontSize: typography.size.xs,
              fontWeight: typography.weight.bold,
              color: brandCyan,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {t('landing.quickNavigationBadge')}
          </span>
        </div>

        <h2
          className="nav-section-title"
          style={{
            fontSize: typography.size['3xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
            marginBottom: spacing[3],
            background: `linear-gradient(135deg, ${colors.text.primary}, ${brandCyan})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {t('landing.quickNavigationTitle')}
        </h2>
        <p
          style={{
            fontSize: typography.size.lg,
            color: colors.text.secondary,
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          {t('landing.quickNavigationSubtitle')}
        </p>
      </div>

      {/* Cards grid */}
      <div
        className="nav-cards-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: spacing[5],
        }}
      >
        {pages.map((page, index) => (
          <FadeIn key={page.id} delay={index * 100} direction="up" distance={40}>
            <NavigationCard
              page={page}
              isArabic={isArabic}
              onClick={() => navigate(page.path)}
            />
          </FadeIn>
        ))}
      </div>

      {/* Bottom decorative element */}
      <div
        style={{
          marginTop: spacing[10],
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[3],
            padding: `${spacing[3]}px ${spacing[5]}px`,
            background: colors.surface.card,
            border: `1px solid ${colors.border.subtle}`,
            borderRadius: radius.full,
          }}
        >
          <span style={{ fontSize: 16 }}>💡</span>
          <span
            style={{
              fontSize: typography.size.sm,
              color: colors.text.muted,
            }}
          >
            {t('landing.quickNavigationTip')}
          </span>
        </div>
      </div>
    </section>
  );
});
PageNavigationCards.displayName = 'PageNavigationCards';

function LandingPage() {
  const { isArabic, t } = useLanguage();
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

        {/* MODE SELECTOR - Choose Your Path */}
        <FadeIn delay={300} direction="up" distance={30}>
          <LabModeSelector />
        </FadeIn>

        {/* Credentials Banner - Trust signals */}
        <FadeIn delay={200} direction="none" scale scaleFrom={0.98}>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={100} />}>
            <CredentialsBanner />
          </Suspense>
        </FadeIn>

        {/* Guided journey section */}
        <FadeIn delay={200} direction="none" scale>
          <ExperienceJourney isArabic={isArabic} />
        </FadeIn>

        {/* Quick Actions Panel - Role-specific CTAs */}
        <FadeIn delay={300} direction="up" distance={30}>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={200} />}>
            <QuickActionsPanel />
          </Suspense>
        </FadeIn>

        {/* Clinical Protocol - Trust Kit */}
        <FadeIn delay={350} direction="up" distance={20}>
          <ClinicalProtocolSection />
        </FadeIn>

        {/* What is AIT - Medical trust content */}
        <FadeIn delay={400} direction="up" distance={30}>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={400} />}>
            <WhatIsAIT />
          </Suspense>
        </FadeIn>

        {/* Trust Signals - Role-aware metrics */}
        <FadeIn delay={500} direction="up" distance={30}>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={300} />}>
            <TrustSignals />
          </Suspense>
        </FadeIn>

        {/* Page Navigation Cards */}
        <PageNavigationCards />

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
