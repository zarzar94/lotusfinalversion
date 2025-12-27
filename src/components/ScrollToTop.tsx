/**
 * ScrollToTop - Scrolls to top on route change
 * Also provides smooth scroll behavior and logs navigation events
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { colors } from './styles';

interface ScrollToTopProps {
  behavior?: ScrollBehavior;
  enableLogging?: boolean;
}

// Route name mapping for better logging
const ROUTE_NAMES: Record<string, string> = {
  '/': 'Landing Page',
  '/assessment': 'Assessment Page',
  '/program': 'Program Page',
  '/science': 'Science Page',
  '/results': 'Results Page',
  '/resources': 'Resources Page',
  '/contact': 'Contact Page',
  '/partners': 'Partners Page',
  '/school-dashboard': 'School Dashboard',
  '/parent-dashboard': 'Parent Dashboard',
  '/clinician-dashboard': 'Clinician Dashboard',
  '/dashboard/parent': 'Parent Dashboard (Role)',
  '/dashboard/educator': 'Educator Dashboard',
  '/dashboard/clinician': 'Clinician Dashboard (Role)',
  '/settings': 'Settings',
};

function getRouteName(pathname: string): string {
  // Check for exact match
  if (ROUTE_NAMES[pathname]) {
    return ROUTE_NAMES[pathname];
  }

  // Check for dynamic routes
  if (pathname.startsWith('/function/')) {
    const slug = pathname.replace('/function/', '');
    return `Brain Function: ${slug}`;
  }

  return `Unknown Route: ${pathname}`;
}

export default function ScrollToTop({
  behavior = 'auto',
  enableLogging = import.meta.env.DEV,
}: ScrollToTopProps) {
  const { pathname, search, hash } = useLocation();
  const prevPathRef = useRef<string | null>(null);
  const navigationStartTime = useRef<number>(Date.now());

  useEffect(() => {
    // Log navigation in development
    if (enableLogging && prevPathRef.current !== null) {
      const navigationTime = Date.now() - navigationStartTime.current;
      const fromRoute = getRouteName(prevPathRef.current);
      const toRoute = getRouteName(pathname);

      console.group('%cNavigation', 'color: #8FD3CC; font-weight: bold;');
      console.log(`%cFrom: ${fromRoute}`, 'color: #999;');
      console.log(`%cTo: ${toRoute}`, 'color: #AF84BA; font-weight: bold;');
      console.log(`%cPath: ${pathname}${search}${hash}`, 'color: #666;');
      console.log(`%cTime: ${navigationTime}ms`, `color: ${colors.success};`);
      console.groupEnd();
    }

    // Update previous path
    prevPathRef.current = pathname;
    navigationStartTime.current = Date.now();

    // Scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
    });
  }, [pathname, search, hash, behavior, enableLogging]);

  return null;
}
