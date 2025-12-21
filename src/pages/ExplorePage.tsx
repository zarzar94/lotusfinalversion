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
import { styles } from '../components/styles';

function ExplorePage() {
  const { isArabic } = useLanguage();
  usePageTitle();

  return (
    <div style={styles.page}>
      <BackgroundFX />
      <Header />

      <main style={styles.container}>
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

export default memo(ExplorePage);
