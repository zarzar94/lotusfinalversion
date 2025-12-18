/**
 * PageTransition - Smooth page and section transitions
 * Provides fade-in, slide, and stagger animations
 */

import { memo, useEffect, useState, useRef, ReactNode } from 'react';
import { transitions } from '../styles';

// Animation CSS keyframes
const animationCSS = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideInUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
  .animate-fade-in-down { animation: fadeInDown 0.4s ease-out forwards; }
  .animate-fade-in-left { animation: fadeInLeft 0.4s ease-out forwards; }
  .animate-fade-in-right { animation: fadeInRight 0.4s ease-out forwards; }
  .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
  .animate-slide-in-up { animation: slideInUp 0.4s ease-out forwards; }
`;

type AnimationType =
  | 'fade-in'
  | 'fade-in-up'
  | 'fade-in-down'
  | 'fade-in-left'
  | 'fade-in-right'
  | 'scale-in'
  | 'slide-in-up';

interface PageTransitionProps {
  children: ReactNode;
  /** Animation type */
  animation?: AnimationType;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Animation duration (ms) */
  duration?: number;
  /** Only animate once when first visible */
  once?: boolean;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * Wraps content with animation on mount
 */
export const PageTransition = memo(({
  children,
  animation = 'fade-in-up',
  delay = 0,
  duration = 400,
  once = true,
  className = '',
  style = {},
}: PageTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
      hasAnimated.current = true;
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  const animationClass = isVisible ? `animate-${animation}` : '';

  return (
    <>
      <style>{animationCSS}</style>
      <div
        ref={ref}
        className={`${animationClass} ${className}`}
        style={{
          opacity: isVisible ? undefined : 0,
          animationDuration: `${duration}ms`,
          ...style,
        }}
      >
        {children}
      </div>
    </>
  );
});
PageTransition.displayName = 'PageTransition';

interface StaggerChildrenProps {
  children: ReactNode[];
  /** Base animation type for all children */
  animation?: AnimationType;
  /** Delay between each child animation (ms) */
  staggerDelay?: number;
  /** Initial delay before first animation (ms) */
  initialDelay?: number;
  /** Animation duration for each child (ms) */
  duration?: number;
  /** Container className */
  className?: string;
  /** Container style */
  style?: React.CSSProperties;
}

/**
 * Animates children with staggered timing
 */
export const StaggerChildren = memo(({
  children,
  animation = 'fade-in-up',
  staggerDelay = 50,
  initialDelay = 0,
  duration = 300,
  className = '',
  style = {},
}: StaggerChildrenProps) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const childArray = Array.isArray(children) ? children : [children];

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleCount(prev => {
          if (prev >= childArray.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, staggerDelay);

      return () => clearInterval(interval);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [childArray.length, staggerDelay, initialDelay]);

  return (
    <>
      <style>{animationCSS}</style>
      <div className={className} style={style}>
        {childArray.map((child, index) => (
          <div
            key={index}
            className={index < visibleCount ? `animate-${animation}` : ''}
            style={{
              opacity: index < visibleCount ? undefined : 0,
              animationDuration: `${duration}ms`,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
});
StaggerChildren.displayName = 'StaggerChildren';

interface FadeOnScrollProps {
  children: ReactNode;
  /** Animation type when element enters viewport */
  animation?: AnimationType;
  /** Threshold for triggering animation (0-1) */
  threshold?: number;
  /** Root margin for IntersectionObserver */
  rootMargin?: string;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * Animates content when it scrolls into view
 */
export const FadeOnScroll = memo(({
  children,
  animation = 'fade-in-up',
  threshold = 0.1,
  rootMargin = '0px',
  className = '',
  style = {},
}: FadeOnScrollProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <>
      <style>{animationCSS}</style>
      <div
        ref={ref}
        className={`${isVisible ? `animate-${animation}` : ''} ${className}`}
        style={{
          opacity: isVisible ? undefined : 0,
          ...style,
        }}
      >
        {children}
      </div>
    </>
  );
});
FadeOnScroll.displayName = 'FadeOnScroll';

export default PageTransition;
