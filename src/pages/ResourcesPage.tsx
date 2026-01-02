/**
 * Resources Page - Educational Materials
 * Videos, Presentations, FAQ
 */

import { lazy, Suspense, memo } from 'react';
import Header from '../components/Header';
import BackgroundFX from '../components/BackgroundFX';
import Footer from '../components/Footer';
import WhatsAppFab from '../components/WhatsAppFab';
import ScrollToTopButton from '../components/ScrollToTopButton';
import SectionLoader from '../components/SectionLoader';
import FadeIn from '../components/FadeIn';
import { BackNavigation } from '../components/shared';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { LabShell, LabShellContent } from '../components/labui/LabShell';
import LabCard from '../components/labui/LabCard';
import LabButtonAnchor from '../components/labui/LabButtonAnchor';
import { BookIcon } from '../components/icons/index';
import {
  colors,
  typography,
  spacing,
  radius,
} from '../components/styles';

// Lazy load sections
const SlideViewer = lazy(() => import('../components/SlideViewer'));
const VideoSection = lazy(() => import('../components/VideoSection'));

// Page header component
const PageHeader = memo(({ isArabic }: { isArabic: boolean }) => (
  <div
    style={{
      textAlign: 'center',
      padding: `0 ${spacing[4]}px ${spacing[8]}px`,
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
        background: colors.warningLight,
        borderRadius: radius.full,
        marginBottom: spacing[4],
      }}
    >
      <span style={{ fontSize: 20 }}>
        <BookIcon size={20} tone="warning" />
      </span>
      <span
        style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: colors.warning,
        }}
      >
        {isArabic ? 'مصادر التعلم' : 'Learning Resources'}
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
      {isArabic ? 'الموارد والمواد التعليمية' : 'Resources & Educational Materials'}
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
        ? 'استكشف مكتبتنا من الفيديوهات التعليمية والعروض التقديمية والأسئلة الشائعة'
        : 'Explore our library of educational videos, presentations, and frequently asked questions'}
    </p>
  </div>
));
PageHeader.displayName = 'PageHeader';

function ResourcesPage() {
  const { isArabic, t } = useLanguage();
  usePageTitle();

  return (
    <LabShell variant="primary">
      <BackgroundFX />
      <Header />

      <LabShellContent>
        <BackNavigation
          to="/"
          label={t('nav.home')}
        />

        <PageHeader isArabic={isArabic} />

        {/* Slide Viewer */}
        <FadeIn delay={100} scale>
          <Suspense fallback={<SectionLoader label={t('common.loadingSlides')} height={500} />}>
            <SlideViewer />
          </Suspense>
        </FadeIn>

        {/* Video Section */}
        <FadeIn delay={150} direction="right" distance={30} scale scaleFrom={0.98}>
          <Suspense fallback={<SectionLoader label={t('common.loadingVideos')} height={400} />}>
            <VideoSection />
          </Suspense>
        </FadeIn>

        {/* FAQ Preview */}
        <FadeIn delay={200} direction="left" distance={30}>
          <LabCard
            variant="glass"
            tone="warning"
            style={{
              display: 'grid',
              gap: spacing[3],
              direction: isArabic ? 'rtl' : 'ltr',
              textAlign: isArabic ? 'right' : 'left',
            }}
          >
            <div
              style={{
                fontSize: typography.size.lg,
                fontWeight: typography.weight.bold,
                color: colors.text.primary,
              }}
            >
              {isArabic ? 'الأسئلة الشائعة' : t('resources.faqPreviewTitle', 'Frequently Asked Questions')}
            </div>
            <p
              style={{
                margin: 0,
                color: colors.text.secondary,
                fontSize: typography.size.sm,
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              {isArabic
                ? 'إجابات سريعة على أكثر الأسئلة شيوعاً قبل بدء التقييم.'
                : t('resources.faqPreviewIntro', 'Quick answers to the most common questions before you begin.')}
            </p>
            <ul
              style={{
                margin: 0,
                paddingInlineStart: isArabic ? 0 : spacing[4],
                paddingInlineEnd: isArabic ? spacing[4] : 0,
                color: colors.text.secondary,
                fontSize: typography.size.sm,
                lineHeight: typography.lineHeight.relaxed,
                display: 'grid',
                gap: spacing[2],
              }}
            >
              {(isArabic
                ? [
                  'ما الفرق بين الفحص والتشخيص؟',
                  'هل يحتاج طفلي سماعات خاصة؟',
                  'متى تظهر النتائج؟',
                ]
                : [
                  'What is the difference between screening and diagnosis?',
                  'Do we need special headphones?',
                  'When do results appear?',
                ]
              ).map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
            <div>
              <LabButtonAnchor href="/faq" variant="primary">
                {isArabic ? 'عرض صفحة الأسئلة' : t('resources.faqPreviewCta', 'View the full FAQ')}
              </LabButtonAnchor>
            </div>
          </LabCard>
        </FadeIn>

        <FadeIn delay={100} direction="none" scale scaleFrom={0.98}>
          <Footer />
        </FadeIn>
      </LabShellContent>

      <WhatsAppFab />
      <ScrollToTopButton />
    </LabShell>
  );
}

export default memo(ResourcesPage);
