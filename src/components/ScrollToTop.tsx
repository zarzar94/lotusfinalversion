/**
 * ScrollToTop - Scrolls to top on route change
 * Also provides smooth scroll behavior and logs navigation events
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { brandCyan, brandPurple, colors } from './styles';

interface ScrollToTopProps {
  behavior?: ScrollBehavior;
  enableLogging?: boolean;
}

// Route name mapping for better logging
const ROUTE_NAMES: Record<string, string> = {
  '/': 'Landing Page',
  '/lab': 'Assessment Page',
  '/program': 'Program Page',
  '/science': 'Science Page',
  '/results': 'Results Page',
  '/resources': 'Resources Page',
  '/contact': 'Contact Page',
  '/partners': 'Partners Page',
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

      console.group('%cNavigation', `color: ${brandCyan}; font-weight: bold;`);
      console.log(`%cFrom: ${fromRoute}`, 'color: rgba(255,255,255,0.6);');
      console.log(`%cTo: ${toRoute}`, `color: ${brandPurple}; font-weight: bold;`);
      console.log(`%cPath: ${pathname}${search}${hash}`, 'color: rgba(255,255,255,0.45);');
      console.log(`%cTime: ${navigationTime}ms`, `color: ${colors.success};`);
      console.groupEnd();
    }

    // Update previous path
    prevPathRef.current = pathname;
    navigationStartTime.current = Date.now();

    const prefersReducedMotion = typeof window !== 'undefined'
      && (document.documentElement.dataset.reducedMotion === 'true'
        || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    const resolvedBehavior: ScrollBehavior = prefersReducedMotion
      ? 'auto'
      : behavior === 'auto'
        ? 'smooth'
        : behavior;

    if (hash) {
      // Hash-aware scroll: anchors can mount late with lazy sections, so wait for layout stability.
      let cancelled = false;
      let rafId: number | null = null;
      let stableFrames = 0;
      let targetId = '';
      let fallbackTried = false;
      const maxDurationMs = 4500;
      const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

      try {
        targetId = decodeURIComponent(hash.slice(1));
      } catch {
        targetId = hash.slice(1);
      }

      const isInViewport = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
      };

      const tick = () => {
        if (cancelled) return;

        const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const elapsed = now - startTime;
        const target = targetId ? document.getElementById(targetId) : null;

        if (target) {
          if (isInViewport(target)) {
            stableFrames += 1;
            if (stableFrames >= 2) return;
          } else {
            stableFrames = 0;
            target.scrollIntoView({ behavior: 'auto', block: 'start' });
          }
        } else {
          stableFrames = 0;
        }

        if (elapsed >= maxDurationMs) {
          if (!fallbackTried && targetId === 'modules') {
            fallbackTried = true;
            const fallback = document.getElementById('games');
            if (fallback) {
              fallback.scrollIntoView({ behavior: 'auto', block: 'start' });
            }
          }
          return;
        }

        rafId = window.requestAnimationFrame(tick);
      };

      rafId = window.requestAnimationFrame(tick);
      return () => {
        cancelled = true;
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
        }
      };
    }

    // Scroll to top for non-hash routes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
    });
  }, [pathname, search, hash, behavior, enableLogging]);

  return null;
}
