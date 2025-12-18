/**
 * PageTransitionWrapper - Wraps pages with transition animations
 * Provides smooth fade-in effect when navigating between pages
 */

import { memo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { transitions } from './styles';

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

const PageTransitionWrapper = memo(({ children }: PageTransitionWrapperProps) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Start transition
    setIsVisible(false);

    // Small delay before showing new content
    const showTimer = setTimeout(() => {
      setDisplayChildren(children);
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(showTimer);
  }, [location.pathname, children]);

  const css = `
    @keyframes pageEnter {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .page-transition-enter {
      animation: pageEnter 0.4s ease-out forwards;
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div
        className={isVisible ? 'page-transition-enter' : ''}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: `opacity 0.3s ease-out`,
        }}
      >
        {displayChildren}
      </div>
    </>
  );
});

PageTransitionWrapper.displayName = 'PageTransitionWrapper';

export default PageTransitionWrapper;
