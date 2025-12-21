/**
 * usePageTitle - Hook to set dynamic page titles
 * Updates document.title based on current page and language
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Page title mapping
const PAGE_TITLE_KEYS: Record<string, string> = {
  '/': 'pageTitles.home',
  '/assessment': 'pageTitles.assessment',
  '/program': 'pageTitles.program',
  '/science': 'pageTitles.science',
  '/results': 'pageTitles.results',
  '/resources': 'pageTitles.resources',
  '/contact': 'pageTitles.contact',
  '/partners': 'pageTitles.partners',
  '/school-dashboard': 'pageTitles.schoolDashboard',
  '/parent-dashboard': 'pageTitles.parentDashboard',
  '/clinician-dashboard': 'pageTitles.clinicianDashboard',
  '/dashboard/parent': 'pageTitles.parentRoleDashboard',
  '/dashboard/educator': 'pageTitles.educatorDashboard',
  '/dashboard/clinician': 'pageTitles.clinicianRoleDashboard',
  '/settings': 'pageTitles.settings',
};

const DEFAULT_TITLE_KEY = 'pageTitles.default';

export function usePageTitle(customTitle?: string) {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    // If custom title provided, use it
    if (customTitle) {
      document.title = customTitle;
      return;
    }

    // Get title from mapping
    const pageTitleKey = PAGE_TITLE_KEYS[location.pathname];

    if (pageTitleKey) {
      document.title = t(pageTitleKey, 'Lotus × Bérard AIT');
    } else if (location.pathname.startsWith('/function/')) {
      // Handle dynamic brain function pages
      const slug = location.pathname.replace('/function/', '');
      const formattedSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      document.title = `${formattedSlug} - ${t(DEFAULT_TITLE_KEY, 'Lotus × Bérard AIT')}`;
    } else {
      // Fallback to default
      document.title = t(DEFAULT_TITLE_KEY, 'Lotus × Bérard AIT');
    }
  }, [location.pathname, t, customTitle]);
}

export default usePageTitle;
