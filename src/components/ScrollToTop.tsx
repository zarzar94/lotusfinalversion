/**
 * ScrollToTop - Scrolls to top on route change
 * Also provides smooth scroll behavior
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  behavior?: ScrollBehavior;
}

export default function ScrollToTop({ behavior = 'instant' }: ScrollToTopProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
    });
  }, [pathname, behavior]);

  return null;
}
