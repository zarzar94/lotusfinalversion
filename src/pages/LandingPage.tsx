/**
 * Landing Page - Hero + Credentials Only
 * Clean, focused entry point to the platform
 */

import { lazy, Suspense, memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BackgroundFX from '../components/BackgroundFX';
import HeroCircuitBrain from '../components/HeroCircuitBrain';
import CircuitDecoration from '../components/CircuitDecoration';
import Footer from '../components/Footer';
import WhatsAppFab from '../components/WhatsAppFab';
import ScrollToTopButton from '../components/ScrollToTopButton';
import SectionLoader from '../components/SectionLoader';
import FadeIn from '../components/FadeIn';
import { useLanguage } from '../context/LanguageContext';
import { useClinicalSync } from '../hooks/useClinicalSync';
import { usePageTitle } from '../hooks/usePageTitle';
import ExperienceJourney from '../components/ExperienceJourney';
import {
  brandCyan,
  brandPurple,
  brandPink,
  colors,
  typography,
  spacing,
  radius,
  styles,
} from '../components/styles';

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
    titleAr: string;
    description: string;
    descriptionAr: string;
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
        textAlign: isArabic ? 'right' : 'left',
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
        {isArabic ? page.titleAr : page.title}
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
        {isArabic ? page.descriptionAr : page.description}
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
const PageNavigationCards = memo(({ isArabic }: { isArabic: boolean }) => {
  const navigate = useNavigate();

  const pages = [
    {
      id: 'assessment',
      title: 'Self Assessment',
      titleAr: 'التقييم الذاتي',
      description: 'Interactive diagnostic tools and games',
      descriptionAr: 'أدوات التشخيص التفاعلية والألعاب',
      icon: '🎯',
      color: brandCyan,
      path: '/assessment',
    },
    {
      id: 'program',
      title: 'Treatment Program',
      titleAr: 'البرنامج العلاجي',
      description: 'Learn about our 20-session protocol',
      descriptionAr: 'تعرف على برنامجنا ذو العشرين جلسة',
      icon: '📋',
      color: brandPurple,
      path: '/program',
    },
    {
      id: 'science',
      title: 'Science & Research',
      titleAr: 'العلم والأبحاث',
      description: 'Neuroplasticity and audio processing',
      descriptionAr: 'المرونة العصبية ومعالجة الصوت',
      icon: '🧠',
      color: brandPink,
      path: '/science',
    },
    {
      id: 'results',
      title: 'Results & Evidence',
      titleAr: 'النتائج والأدلة',
      description: 'Success stories and testimonials',
      descriptionAr: 'قصص النجاح والشهادات',
      icon: '📊',
      color: '#22c55e',
      path: '/results',
    },
    {
      id: 'resources',
      title: 'Resources',
      titleAr: 'الموارد',
      description: 'Videos, presentations, and FAQs',
      descriptionAr: 'الفيديوهات والعروض والأسئلة الشائعة',
      icon: '📚',
      color: '#f59e0b',
      path: '/resources',
    },
    {
      id: 'about',
      title: 'About Us',
      titleAr: 'من نحن',
      description: 'Meet our specialist and learn about the centre',
      descriptionAr: 'تعرف على الأخصائي والمركز',
      icon: '🏛️',
      color: brandPurple,
      path: '/about',
    },
    {
      id: 'contact',
      title: 'Get Started',
      titleAr: 'ابدأ الآن',
      description: 'Contact us or fill out intake form',
      descriptionAr: 'تواصل معنا أو املأ نموذج القبول',
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
            {isArabic ? 'التنقل السريع' : 'Quick Navigation'}
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
          {isArabic ? 'استكشف المنصة' : 'Explore the Platform'}
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
          {isArabic
            ? 'اختر القسم الذي يناسب احتياجاتك واستكشف جميع الموارد المتاحة'
            : 'Choose the section that fits your needs and explore all available resources'}
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
            {isArabic
              ? 'نصيحة: ابدأ بالتقييم الذاتي لفهم احتياجاتك'
              : 'Tip: Start with Self Assessment to understand your needs'}
          </span>
        </div>
      </div>
    </section>
  );
});
PageNavigationCards.displayName = 'PageNavigationCards';

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

        {/* Page Navigation Cards */}
        <PageNavigationCards isArabic={isArabic} />

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
