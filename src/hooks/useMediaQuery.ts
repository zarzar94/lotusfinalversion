/**
 * useMediaQuery - Custom hook for responsive breakpoint detection
 * Provides reactive breakpoint states for component-level responsiveness
 */

import { useState, useEffect, useMemo } from 'react';
import { breakpoints } from '../components/styles';

/**
 * Check if a media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Use the appropriate method based on browser support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}

/**
 * Get responsive breakpoint states
 */
export function useBreakpoints() {
  const isXs = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
  const isSm = useMediaQuery(`(max-width: ${breakpoints.sm}px)`);
  const isMd = useMediaQuery(`(max-width: ${breakpoints.md}px)`);
  const isLg = useMediaQuery(`(max-width: ${breakpoints.lg}px)`);
  const isXl = useMediaQuery(`(max-width: ${breakpoints.xl}px)`);

  return useMemo(() => ({
    // Exact breakpoints
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,

    // Convenience aliases
    isMobile: isSm,
    isTablet: !isSm && isMd,
    isDesktop: !isMd,

    // Range checks
    isPhoneOnly: isSm,
    isTabletUp: !isSm,
    isTabletOnly: !isSm && isLg,
    isDesktopUp: !isLg,

    // Current breakpoint name
    current: isXs ? 'xs' : isSm ? 'sm' : isMd ? 'md' : isLg ? 'lg' : isXl ? 'xl' : '2xl',
  }), [isXs, isSm, isMd, isLg, isXl]);
}

/**
 * Get window dimensions with resize listener
 */
export function useWindowSize() {
  const [size, setSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  }));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

/**
 * Check if device supports touch
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    );
  }, []);

  return isTouch;
}

export default useMediaQuery;
