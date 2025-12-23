/**
 * ScrollSectionIndicator - Shows current section and navigation dots
 * Helps users understand their position on long pages
 */

import { memo, useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  brandCyan,
  brandPurple,
  colors,
  typography,
  spacing,
  radius,
  shadows,
  transitions,
} from './styles';

interface Section {
  id: string;
  label: { ar: string; en: string };
  icon?: string;
}

interface ScrollSectionIndicatorProps {
  sections: Section[];
  showLabels?: boolean;
  position?: 'left' | 'right';
}

const ScrollSectionIndicator = memo(({
  sections,
  showLabels = true,
  position = 'right',
}: ScrollSectionIndicatorProps) => {
  const { isArabic } = useLanguage();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Show indicator after scrolling a bit
      setIsVisible(window.scrollY > 300);

      // Find the section currently in view
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;

          // Section is in view if its top is in the upper half of the viewport
          if (rect.top <= viewportHeight * 0.5 && rect.bottom >= viewportHeight * 0.3) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  if (!isVisible || sections.length === 0) return null;

  // Adjust position based on RTL
  const actualPosition = isArabic ? (position === 'right' ? 'left' : 'right') : position;

  return (
    <nav
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        top: '50%',
        transform: 'translateY(-50%)',
        [actualPosition]: spacing[4],
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: actualPosition === 'right' ? 'flex-end' : 'flex-start',
        gap: spacing[2],
        padding: spacing[2],
        background: isHovered ? colors.surface.overlay : 'transparent',
        borderRadius: radius.xl,
        border: isHovered ? `1px solid ${colors.border.default}` : '1px solid transparent',
        transition: transitions.normal,
        direction: isArabic ? 'rtl' : 'ltr',
      }}
      aria-label={isArabic ? 'تنقل الأقسام' : 'Section navigation'}
    >
      {sections.map((section, index) => {
        const isActive = activeSection === section.id;

        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              padding: `${spacing[1]}px ${spacing[2]}px`,
              background: isActive ? `${brandCyan}15` : 'transparent',
              border: 'none',
              borderRadius: radius.lg,
              cursor: 'pointer',
              transition: transitions.fast,
              flexDirection: actualPosition === 'right' ? 'row' : 'row-reverse',
            }}
            aria-current={isActive ? 'true' : undefined}
          >
            {/* Label (shown on hover or when active) */}
            {showLabels && (
              <span
                style={{
                  fontSize: typography.size.xs,
                  fontWeight: isActive ? typography.weight.bold : typography.weight.medium,
                  color: isActive ? brandCyan : colors.text.muted,
                  opacity: isHovered || isActive ? 1 : 0,
                  transform: isHovered || isActive ? 'translateX(0)' : `translateX(${actualPosition === 'right' ? '10px' : '-10px'})`,
                  transition: transitions.fast,
                  whiteSpace: 'nowrap',
                  maxWidth: isHovered || isActive ? 120 : 0,
                  overflow: 'hidden',
                }}
              >
                {isArabic ? section.label.ar : section.label.en}
              </span>
            )}

            {/* Dot indicator */}
            <div
              style={{
                width: isActive ? 10 : 6,
                height: isActive ? 10 : 6,
                borderRadius: '50%',
                background: isActive
                  ? `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`
                  : colors.border.emphasis,
                boxShadow: isActive ? `0 0 10px ${brandCyan}50` : 'none',
                transition: transitions.fast,
                flexShrink: 0,
              }}
            />
          </button>
        );
      })}

      {/* Progress line */}
      <div
        style={{
          position: 'absolute',
          [actualPosition]: spacing[2] + 2,
          top: spacing[2],
          bottom: spacing[2],
          width: 2,
          background: colors.border.subtle,
          borderRadius: radius.full,
          zIndex: -1,
        }}
      >
        {/* Active progress */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `${((sections.findIndex((s) => s.id === activeSection) + 1) / sections.length) * 100}%`,
            background: `linear-gradient(180deg, ${brandCyan}, ${brandPurple})`,
            borderRadius: radius.full,
            transition: 'height 0.3s ease',
          }}
        />
      </div>
    </nav>
  );
});

ScrollSectionIndicator.displayName = 'ScrollSectionIndicator';

/**
 * ReadingProgressBar - Shows reading progress at the top of the page
 */
export const ReadingProgressBar = memo(() => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollProgress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: 'transparent',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
          boxShadow: `0 0 10px ${brandCyan}50`,
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
});

ReadingProgressBar.displayName = 'ReadingProgressBar';

/**
 * SectionHighlight - Highlights a section when scrolled into view
 */
interface SectionHighlightProps {
  children: React.ReactNode;
  id: string;
  onEnter?: () => void;
  highlightColor?: string;
}

export const SectionHighlight = memo(({
  children,
  id,
  onEnter,
  highlightColor = brandCyan,
}: SectionHighlightProps) => {
  const [isInView, setIsInView] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          onEnter?.();
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref, onEnter]);

  return (
    <section
      id={id}
      ref={setRef}
      style={{
        position: 'relative',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Highlight border effect */}
      {isInView && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: -2,
            width: 4,
            height: '100%',
            background: `linear-gradient(180deg, transparent, ${highlightColor}, transparent)`,
            opacity: 0.5,
            pointerEvents: 'none',
            animation: 'highlightPulse 2s ease-in-out infinite',
          }}
        />
      )}
      {children}

      <style>{`
        @keyframes highlightPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </section>
  );
});

SectionHighlight.displayName = 'SectionHighlight';

export default ScrollSectionIndicator;
