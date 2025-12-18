/**
 * Contact Page - Get Started
 * Intake Form, Contact Form, Partnerships
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
  colors,
  typography,
  spacing,
  radius,
} from '../components/styles';

// Lazy load sections
const IntakeForm = lazy(() => import('../components/IntakeForm'));
const ContactForm = lazy(() => import('../components/ContactForm'));
const SchoolPartnershipSection = lazy(() => import('../components/SchoolPartnershipSection'));
const PartnerLogos = lazy(() => import('../components/PartnerLogos'));

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
      <span style={{ fontSize: 20 }}>✉️</span>
      <span
        style={{
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: brandCyan,
        }}
      >
        {isArabic ? 'تواصل معنا' : 'Get in Touch'}
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
      {isArabic ? 'ابدأ رحلتك اليوم' : 'Start Your Journey Today'}
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
        ? 'املأ نموذج القبول أو تواصل معنا مباشرة. نحن هنا للإجابة على جميع استفساراتك'
        : 'Fill out our intake form or contact us directly. We\'re here to answer all your questions'}
    </p>
  </div>
));
PageHeader.displayName = 'PageHeader';

function ContactPage() {
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

        {/* Intake Form */}
        <FadeIn delay={100} scale blur blurAmount={4}>
          <Suspense fallback={<SectionLoader label={t('common.loadingIntake')} height={500} />}>
            <IntakeForm />
          </Suspense>
        </FadeIn>

        {/* Contact Form */}
        <FadeIn delay={150} scale blur blurAmount={4}>
          <Suspense fallback={<SectionLoader label={t('common.loadingContact')} height={700} />}>
            <ContactForm />
          </Suspense>
        </FadeIn>

        {/* School Partnership */}
        <FadeIn delay={200} direction="right" distance={25}>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={300} />}>
            <SchoolPartnershipSection />
          </Suspense>
        </FadeIn>

        {/* Partner Logos */}
        <FadeIn delay={250} direction="none" scale scaleFrom={0.97}>
          <Suspense fallback={<SectionLoader label={t('common.loading')} height={150} />}>
            <PartnerLogos />
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

export default memo(ContactPage);
