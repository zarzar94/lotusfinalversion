/**
 * usePageTitle - Hook to set dynamic page titles
 * Updates document.title based on current page and language
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Page title mapping
const PAGE_TITLES: Record<string, { en: string; ar: string }> = {
  '/': {
    en: 'Lotus × Bérard AIT - Auditory Integration Training',
    ar: 'Lotus × Bérard AIT - تدريب التكامل السمعي',
  },
  '/assessment': {
    en: 'Self Assessment - Lotus × Bérard AIT',
    ar: 'التقييم الذاتي - Lotus × Bérard AIT',
  },
  '/program': {
    en: 'Treatment Program - Lotus × Bérard AIT',
    ar: 'البرنامج العلاجي - Lotus × Bérard AIT',
  },
  '/science': {
    en: 'Science & Research - Lotus × Bérard AIT',
    ar: 'العلم والأبحاث - Lotus × Bérard AIT',
  },
  '/results': {
    en: 'Results & Testimonials - Lotus × Bérard AIT',
    ar: 'النتائج والشهادات - Lotus × Bérard AIT',
  },
  '/resources': {
    en: 'Resources - Lotus × Bérard AIT',
    ar: 'الموارد - Lotus × Bérard AIT',
  },
  '/contact': {
    en: 'Contact Us - Lotus × Bérard AIT',
    ar: 'تواصل معنا - Lotus × Bérard AIT',
  },
  '/partners': {
    en: 'Partners - Lotus Ã BÃ©rard AIT',
    ar: 'Ø§ÙØ´Ø±ÙØ§Ø¡ - Lotus Ã BÃ©rard AIT',
  },
  '/school-dashboard': {
    en: 'School Dashboard - Lotus × Bérard AIT',
    ar: 'لوحة المدرسة - Lotus × Bérard AIT',
  },
  '/parent-dashboard': {
    en: 'Parent Dashboard - Lotus × Bérard AIT',
    ar: 'لوحة الأولياء - Lotus × Bérard AIT',
  },
  '/clinician-dashboard': {
    en: 'Clinician Dashboard - Lotus × Bérard AIT',
    ar: 'لوحة الأخصائي - Lotus × Bérard AIT',
  },
  '/settings': {
    en: 'Settings - Lotus × Bérard AIT',
    ar: 'الإعدادات - Lotus × Bérard AIT',
  },
};

const DEFAULT_TITLE = {
  en: 'Lotus × Bérard AIT',
  ar: 'Lotus × Bérard AIT',
};

export function usePageTitle(customTitle?: string) {
  const location = useLocation();
  const { isArabic } = useLanguage();

  useEffect(() => {
    // If custom title provided, use it
    if (customTitle) {
      document.title = customTitle;
      return;
    }

    // Get title from mapping
    const pageTitle = PAGE_TITLES[location.pathname];

    if (pageTitle) {
      document.title = isArabic ? pageTitle.ar : pageTitle.en;
    } else if (location.pathname.startsWith('/function/')) {
      // Handle dynamic brain function pages
      const slug = location.pathname.replace('/function/', '');
      const formattedSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      document.title = isArabic
        ? `${formattedSlug} - Lotus × Bérard AIT`
        : `${formattedSlug} - Lotus × Bérard AIT`;
    } else {
      // Fallback to default
      document.title = isArabic ? DEFAULT_TITLE.ar : DEFAULT_TITLE.en;
    }
  }, [location.pathname, isArabic, customTitle]);
}

export default usePageTitle;
