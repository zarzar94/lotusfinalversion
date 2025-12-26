/**
 * Explore Page - standalone quick navigation for public visitors
 */

import { memo } from 'react';
import Header from '../components/Header';
import BackgroundFX from '../components/BackgroundFX';
import Footer from '../components/Footer';
import WhatsAppFab from '../components/WhatsAppFab';
import ScrollToTopButton from '../components/ScrollToTopButton';
import FadeIn from '../components/FadeIn';
import PageNavigationCards from '../components/PageNavigationCards';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { LabShell, LabShellContent } from '../components/labui/LabShell';

function ExplorePage() {
  const { isArabic } = useLanguage();
  usePageTitle();

  return (
    <LabShell variant="primary">
      <BackgroundFX />
      <Header />

      <LabShellContent>
        <PageNavigationCards isArabic={isArabic} />

        <FadeIn delay={100} direction="none" scale scaleFrom={0.98}>
          <Footer />
        </FadeIn>
      </LabShellContent>

      <WhatsAppFab />
      <ScrollToTopButton />
    </LabShell>
  );
}

export default memo(ExplorePage);
