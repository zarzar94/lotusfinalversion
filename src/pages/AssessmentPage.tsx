/**
 * Assessment Page - Diagnostic Tools
 * Checklist and Interactive Games
 */

import { lazy, Suspense, memo } from 'react';
import Header from '../components/Header';
import { styles } from '../components/styles';
import BackgroundFX from '../components/BackgroundFX';
import Footer from '../components/Footer';
import WhatsAppFab from '../components/WhatsAppFab';
import ScrollToTopButton from '../components/ScrollToTopButton';
import SectionLoader from '../components/SectionLoader';
import FadeIn from '../components/FadeIn';
import { BackNavigation } from '../components/shared';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  brandCyan,
  brandPurple,
  colors,
  typography,
  spacing,
  radius,
} from '../components/styles';

// Lazy load sections
const Checklist = lazy(() => import('../components/Checklist'));
const GameSection = lazy(() => import('../components/GameSection'));

// Page header component with lab-tech aesthetic
const PageHeader = memo(({ isArabic }: { isArabic: boolean }) => (
  <div
    style={{
      textAlign: 'center',
      padding: `0 ${spacing[4]}px ${spacing[8]}px`,
      maxWidth: 900,
      margin: '0 auto',
      position: 'relative',
    }}
  >
    {/* Lab tech badge */}
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[3],
        padding: `${spacing[2.5]}px ${spacing[5]}px`,
        background: 'linear-gradient(135deg, rgba(143,211,204,0.12), rgba(175,132,186,0.08))',
        border: `1px solid ${brandCyan}33`,
        borderRadius: radius.xl,
        marginBottom: spacing[5],
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: radius.md,
          background: `linear-gradient(135deg, ${brandCyan}22, ${brandPurple}22)`,
          border: `1px solid ${brandCyan}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
        }}
      >
        🔬
      </div>
      <span
        style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: brandCyan,
          letterSpacing: 0.5,
        }}
      >
        {isArabic ? 'معمل الفحص السمعي' : 'SCREENING LAB'}
      </span>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#22c55e',
          boxShadow: '0 0 8px #22c55e',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />
    </div>

    <h1
      style={{
        fontSize: typography.size['4xl'],
        fontWeight: typography.weight.black,
        color: colors.text.primary,
        marginBottom: spacing[4],
        lineHeight: 1.2,
        background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {isArabic ? 'التقييم الذاتي' : 'Self Assessment'}
    </h1>

    <p
      style={{
        fontSize: typography.size.lg,
        color: colors.text.secondary,
        lineHeight: typography.lineHeight.relaxed,
        maxWidth: 650,
        margin: '0 auto',
      }}
    >
      {isArabic
        ? 'استخدم أدواتنا التفاعلية لتقييم قدرات المعالجة السمعية واكتشاف المجالات التي قد تحتاج إلى دعم'
        : 'Use our interactive tools to assess auditory processing abilities and discover areas that may need support'}
    </p>

    {/* Quick stats bar */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[4],
        marginTop: spacing[6],
        flexWrap: 'wrap',
      }}
    >
      {[
        { icon: '📋', label: isArabic ? 'قائمة المراجعة' : 'Checklist', color: brandCyan },
        { icon: '🧪', label: isArabic ? '5 اختبارات' : '5 Tests', color: brandPurple },
        { icon: '📊', label: isArabic ? 'تقارير PDF' : 'PDF Reports', color: '#22c55e' },
      ].map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[2]}px ${spacing[3]}px`,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: radius.lg,
          }}
        >
          <span style={{ fontSize: 16 }}>{item.icon}</span>
          <span style={{ fontSize: typography.size.xs, color: item.color, fontWeight: 700 }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>

    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(0.9); }
      }
    `}</style>
  </div>
));
PageHeader.displayName = 'PageHeader';

function AssessmentPage() {
  const { isArabic, t } = useLanguage();
  usePageTitle();

  return (
    <div style={styles.page}>
      <BackgroundFX />
      <Header />

      <main style={styles.container}>
        <BackNavigation
          to="/"
          label={isArabic ? 'الصفحة الرئيسية' : 'Home'}
        />

        <PageHeader isArabic={isArabic} />

        {/* Checklist Section */}
        <FadeIn delay={100} blur blurAmount={6} scale>
          <Suspense fallback={<SectionLoader label={t('common.loadingChecklist')} height={400} />}>
            <Checklist />
          </Suspense>
        </FadeIn>

        {/* Games Section */}
        <FadeIn delay={200} direction="left" distance={40} scale scaleFrom={0.95}>
          <Suspense fallback={<SectionLoader label={t('common.loadingGames')} height={350} />}>
            <GameSection />
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

export default memo(AssessmentPage);
