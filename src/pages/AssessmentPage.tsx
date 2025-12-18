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
import SectionLoader from '../components/SectionLoader';
import FadeIn from '../components/FadeIn';
import { BackNavigation } from '../components/shared';
import { useLanguage } from '../context/LanguageContext';
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

// Page header component
const PageHeader = memo(({ isArabic }: { isArabic: boolean }) => (
  <div
    style={{
      textAlign: 'center',
      padding: `${spacing[12]}px ${spacing[4]}px ${spacing[8]}px`,
      maxWidth: 800,
      margin: '0 auto',
    }}
  >
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[2],
        padding: `${spacing[2]}px ${spacing[4]}px`,
        background: `${brandCyan}15`,
        borderRadius: radius.full,
        marginBottom: spacing[4],
      }}
    >
      <span style={{ fontSize: 20 }}>🎯</span>
      <span
        style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: brandCyan,
        }}
      >
        {isArabic ? 'أدوات التشخيص' : 'Diagnostic Tools'}
      </span>
    </div>

    <h1
      style={{
        fontSize: typography.size['4xl'],
        fontWeight: typography.weight.black,
        color: colors.text.primary,
        marginBottom: spacing[4],
        lineHeight: 1.2,
      }}
    >
      {isArabic ? 'التقييم الذاتي' : 'Self Assessment'}
    </h1>

    <p
      style={{
        fontSize: typography.size.lg,
        color: colors.text.secondary,
        lineHeight: typography.lineHeight.relaxed,
        maxWidth: 600,
        margin: '0 auto',
      }}
    >
      {isArabic
        ? 'استخدم أدواتنا التفاعلية لتقييم قدرات المعالجة السمعية واكتشاف المجالات التي قد تحتاج إلى دعم'
        : 'Use our interactive tools to assess auditory processing abilities and discover areas that may need support'}
    </p>
  </div>
));
PageHeader.displayName = 'PageHeader';

function AssessmentPage() {
  const { isArabic, t } = useLanguage();

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
    </div>
  );
}

export default memo(AssessmentPage);
