/**
 * Landing Page - Hero + Credentials Only
 * Clean, focused entry point to the platform
 */

import { lazy, Suspense, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { styles } from '../components/styles';
import BackgroundFX from '../components/BackgroundFX';
import HeroCircuitBrain from '../components/HeroCircuitBrain';
import Footer from '../components/Footer';
import WhatsAppFab from '../components/WhatsAppFab';
import SectionLoader from '../components/SectionLoader';
import FadeIn from '../components/FadeIn';
import { useLanguage } from '../context/LanguageContext';
import { useClinicalSync } from '../hooks/useClinicalSync';
import {
  brandCyan,
  brandPurple,
  brandPink,
  colors,
  typography,
  spacing,
  radius,
  transitions,
} from '../components/styles';

// Lazy load credentials
const CredentialsBanner = lazy(() => import('../components/CredentialsBanner'));

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

  return (
    <section
      id="navigate"
      style={{
        padding: `${spacing[10]}px ${spacing[4]}px`,
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: spacing[8] }}>
        <h2
          style={{
            fontSize: typography.size['3xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
            marginBottom: spacing[3],
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
          }}
        >
          {isArabic
            ? 'اختر القسم الذي يناسب احتياجاتك'
            : 'Choose the section that fits your needs'}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: spacing[4],
        }}
      >
        {pages.map((page, index) => (
          <FadeIn key={page.id} delay={index * 80} direction="up" distance={30}>
            <button
              onClick={() => navigate(page.path)}
              style={{
                width: '100%',
                padding: spacing[6],
                background: colors.surface.card,
                border: `1px solid ${colors.border.default}`,
                borderRadius: radius.xl,
                cursor: 'pointer',
                textAlign: isArabic ? 'right' : 'left',
                transition: transitions.normal,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = page.color;
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 30px ${page.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.border.default;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: radius.lg,
                  background: `${page.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  marginBottom: spacing[4],
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
                  color: colors.text.primary,
                  marginBottom: spacing[2],
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
                }}
              >
                {isArabic ? page.descriptionAr : page.description}
              </p>

              {/* Arrow indicator */}
              <div
                style={{
                  position: 'absolute',
                  bottom: spacing[4],
                  [isArabic ? 'left' : 'right']: spacing[4],
                  color: page.color,
                  fontSize: 20,
                  opacity: 0.6,
                  transition: transitions.fast,
                }}
              >
                {isArabic ? '←' : '→'}
              </div>
            </button>
          </FadeIn>
        ))}
      </div>
    </section>
  );
});
PageNavigationCards.displayName = 'PageNavigationCards';

function LandingPage() {
  const { isArabic } = useLanguage();
  useClinicalSync();

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
          <Suspense fallback={<SectionLoader label="Loading..." height={100} />}>
            <CredentialsBanner />
          </Suspense>
        </FadeIn>

        {/* Page Navigation Cards */}
        <PageNavigationCards isArabic={isArabic} />

        <FadeIn delay={100} direction="none" scale scaleFrom={0.98}>
          <Footer />
        </FadeIn>
      </main>

      <WhatsAppFab />
    </div>
  );
}

export default memo(LandingPage);
