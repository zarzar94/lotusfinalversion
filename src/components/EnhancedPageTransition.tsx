/**
 * EnhancedPageTransition - Smooth page transitions with loading states
 * Provides a polished experience when navigating between pages
 */

import { memo, useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  brandCyan,
  brandPurple,
  brandPink,
  brandInk,
  colors,
  typography,
  spacing,
  radius,
} from './styles';

interface EnhancedPageTransitionProps {
  children: React.ReactNode;
}

const EnhancedPageTransition = memo(({ children }: EnhancedPageTransitionProps) => {
  const location = useLocation();
  const { isArabic } = useLanguage();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'exit' | 'enter'>('idle');

  useEffect(() => {
    // Brief transition effect on page change
    setTransitionPhase('enter');
    setShowContent(true);

    const timer = setTimeout(() => {
      setTransitionPhase('idle');
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      style={{
        opacity: transitionPhase === 'enter' ? 1 : 1,
        transform: transitionPhase === 'enter' ? 'translateY(0)' : 'translateY(0)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
});

EnhancedPageTransition.displayName = 'EnhancedPageTransition';

/**
 * PageLoadingOverlay - Full-page loading overlay with brand styling
 */
export const PageLoadingOverlay = memo(({ isLoading }: { isLoading: boolean }) => {
  const { isArabic } = useLanguage();

  if (!isLoading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: brandInk,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: spacing[6],
        zIndex: 9999,
        animation: 'overlayFadeIn 0.3s ease-out',
      }}
    >
      {/* Animated loader */}
      <div
        style={{
          position: 'relative',
          width: 80,
          height: 80,
        }}
      >
        {/* Outer ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: `3px solid ${colors.border.default}`,
            borderRadius: '50%',
          }}
        />
        {/* Spinning ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: '3px solid transparent',
            borderTopColor: brandCyan,
            borderRightColor: brandPurple,
            borderRadius: '50%',
            animation: 'loaderSpin 1s linear infinite',
          }}
        />
        {/* Inner glow */}
        <div
          style={{
            position: 'absolute',
            inset: 15,
            background: `radial-gradient(circle, ${brandCyan}30 0%, transparent 70%)`,
            borderRadius: '50%',
            animation: 'loaderPulse 1.5s ease-in-out infinite',
          }}
        />
        {/* Center dot */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 12,
            height: 12,
            background: brandCyan,
            borderRadius: '50%',
            boxShadow: `0 0 20px ${brandCyan}`,
          }}
        />
      </div>

      {/* Loading text */}
      <div
        style={{
          fontSize: typography.size.base,
          fontWeight: typography.weight.medium,
          color: colors.text.secondary,
          fontFamily: typography.fontFamily,
        }}
      >
        {isArabic ? 'جارٍ التحميل...' : 'Loading...'}
      </div>

      <style>{`
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes loaderSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes loaderPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
});

PageLoadingOverlay.displayName = 'PageLoadingOverlay';

/**
 * SectionReveal - Reveals sections as they scroll into view
 */
interface SectionRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
  className?: string;
}

export const SectionReveal = memo(({
  children,
  delay = 0,
  direction = 'up',
  threshold = 0.1,
  className = '',
}: SectionRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: '50px' }
    );

    observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref, threshold, delay]);

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';

    switch (direction) {
      case 'up':
        return 'translate(0, 30px)';
      case 'down':
        return 'translate(0, -30px)';
      case 'left':
        return 'translate(30px, 0)';
      case 'right':
        return 'translate(-30px, 0)';
      case 'none':
      default:
        return 'translate(0, 0)';
    }
  };

  return (
    <div
      ref={setRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
});

SectionReveal.displayName = 'SectionReveal';

/**
 * StaggeredList - Reveals list items with staggered animation
 */
interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  initialDelay?: number;
}

export const StaggeredList = memo(({
  children,
  staggerDelay = 100,
  initialDelay = 0,
}: StaggeredListProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, initialDelay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref, initialDelay]);

  return (
    <div ref={setRef}>
      {children.map((child, index) => (
        <div
          key={index}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.4s ease-out ${index * staggerDelay}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
});

StaggeredList.displayName = 'StaggeredList';

/**
 * ParallaxSection - Subtle parallax effect for sections
 */
interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number; // 0.1 to 1, lower = slower parallax
}

export const ParallaxSection = memo(({ children, speed = 0.3 }: ParallaxSectionProps) => {
  const [offset, setOffset] = useState(0);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const handleScroll = () => {
      const rect = ref.getBoundingClientRect();
      const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      setOffset((clampedProgress - 0.5) * 50 * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, speed]);

  return (
    <div
      ref={setRef}
      style={{
        transform: `translateY(${offset}px)`,
        transition: 'transform 0.1s linear',
      }}
    >
      {children}
    </div>
  );
});

ParallaxSection.displayName = 'ParallaxSection';

export default EnhancedPageTransition;
