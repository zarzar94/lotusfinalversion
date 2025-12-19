/**
 * ContextualHint - Contextual tooltips and guidance system
 * Provides helpful hints based on user actions and page context
 */

import { memo, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
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

interface ContextualHintProps {
  children: ReactNode;
  hint: { ar: string; en: string };
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  showOnce?: boolean;
  storageKey?: string;
  icon?: string;
  trigger?: 'hover' | 'focus' | 'click' | 'auto';
  autoShowDelay?: number;
  maxWidth?: number;
}

const ContextualHint = memo(({
  children,
  hint,
  position = 'top',
  delay = 500,
  showOnce = false,
  storageKey,
  icon = '💡',
  trigger = 'hover',
  autoShowDelay = 3000,
  maxWidth = 240,
}: ContextualHintProps) => {
  const { isArabic } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if hint was already shown (for showOnce)
  useEffect(() => {
    if (showOnce && storageKey) {
      const shown = localStorage.getItem(`lotus_hint_${storageKey}`);
      if (shown) {
        setHasShown(true);
      }
    }
  }, [showOnce, storageKey]);

  // Auto-show trigger
  useEffect(() => {
    if (trigger === 'auto' && !hasShown) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        if (showOnce && storageKey) {
          localStorage.setItem(`lotus_hint_${storageKey}`, 'true');
          setHasShown(true);
        }
        // Auto-hide after 5 seconds
        setTimeout(() => setIsVisible(false), 5000);
      }, autoShowDelay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [trigger, hasShown, showOnce, storageKey, autoShowDelay]);

  const showHint = useCallback(() => {
    if (hasShown && showOnce) return;

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      if (showOnce && storageKey) {
        localStorage.setItem(`lotus_hint_${storageKey}`, 'true');
        setHasShown(true);
      }
    }, delay);
  }, [delay, hasShown, showOnce, storageKey]);

  const hideHint = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  const handleClick = useCallback(() => {
    if (trigger === 'click') {
      setIsVisible((prev) => !prev);
    }
  }, [trigger]);

  // Get position styles
  const getPositionStyles = () => {
    const base = {
      position: 'absolute' as const,
      zIndex: 100,
    };

    switch (position) {
      case 'top':
        return {
          ...base,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: spacing[2],
        };
      case 'bottom':
        return {
          ...base,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: spacing[2],
        };
      case 'left':
        return {
          ...base,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: spacing[2],
        };
      case 'right':
        return {
          ...base,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: spacing[2],
        };
      default:
        return base;
    }
  };

  // Get arrow styles
  const getArrowStyles = () => {
    const base = {
      position: 'absolute' as const,
      width: 0,
      height: 0,
      borderStyle: 'solid',
    };

    switch (position) {
      case 'top':
        return {
          ...base,
          bottom: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '6px 6px 0 6px',
          borderColor: `${colors.surface.overlay} transparent transparent transparent`,
        };
      case 'bottom':
        return {
          ...base,
          top: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '0 6px 6px 6px',
          borderColor: `transparent transparent ${colors.surface.overlay} transparent`,
        };
      case 'left':
        return {
          ...base,
          right: -6,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: '6px 0 6px 6px',
          borderColor: `transparent transparent transparent ${colors.surface.overlay}`,
        };
      case 'right':
        return {
          ...base,
          left: -6,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: '6px 6px 6px 0',
          borderColor: `transparent ${colors.surface.overlay} transparent transparent`,
        };
      default:
        return base;
    }
  };

  const hintText = isArabic ? hint.ar : hint.en;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
      onMouseEnter={trigger === 'hover' ? showHint : undefined}
      onMouseLeave={trigger === 'hover' ? hideHint : undefined}
      onFocus={trigger === 'focus' ? showHint : undefined}
      onBlur={trigger === 'focus' ? hideHint : undefined}
      onClick={handleClick}
    >
      {children}

      {/* Tooltip */}
      {isVisible && (
        <div
          style={{
            ...getPositionStyles(),
            maxWidth,
            padding: `${spacing[2]}px ${spacing[3]}px`,
            background: colors.surface.overlay,
            borderRadius: radius.lg,
            border: `1px solid ${brandCyan}30`,
            boxShadow: `${shadows.lg}, 0 0 20px ${brandCyan}10`,
            animation: 'hintFadeIn 0.2s ease-out',
            direction: isArabic ? 'rtl' : 'ltr',
          }}
          role="tooltip"
        >
          {/* Arrow */}
          <div style={getArrowStyles()} />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: spacing[2],
            }}
          >
            {icon && (
              <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
            )}
            <span
              style={{
                fontSize: typography.size.sm,
                color: colors.text.secondary,
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              {hintText}
            </span>
          </div>

          {/* Dismiss button for click trigger */}
          {trigger === 'click' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
              }}
              style={{
                position: 'absolute',
                top: spacing[1],
                [isArabic ? 'left' : 'right']: spacing[1],
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                color: colors.text.muted,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={isArabic ? 'إغلاق' : 'Close'}
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes hintFadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
});

ContextualHint.displayName = 'ContextualHint';

/**
 * PageHint - Full-page contextual hints
 * Shows floating hints at specific positions on the page
 */
interface PageHintProps {
  hints: Array<{
    id: string;
    message: { ar: string; en: string };
    position: { top?: string; bottom?: string; left?: string; right?: string };
    icon?: string;
    delay?: number;
    showOnce?: boolean;
  }>;
}

export const PageHints = memo(({ hints }: PageHintProps) => {
  const { isArabic } = useLanguage();
  const [visibleHints, setVisibleHints] = useState<Set<string>>(new Set());
  const [dismissedHints, setDismissedHints] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('lotus_dismissed_hints');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    hints.forEach((hint) => {
      if (hint.showOnce && dismissedHints.has(hint.id)) return;

      const timer = setTimeout(() => {
        setVisibleHints((prev) => new Set(prev).add(hint.id));
      }, hint.delay || 2000);

      return () => clearTimeout(timer);
    });
  }, [hints, dismissedHints]);

  const dismissHint = useCallback((id: string, permanent: boolean) => {
    setVisibleHints((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });

    if (permanent) {
      setDismissedHints((prev) => {
        const newSet = new Set(prev);
        newSet.add(id);
        localStorage.setItem('lotus_dismissed_hints', JSON.stringify([...newSet]));
        return newSet;
      });
    }
  }, []);

  return (
    <>
      {hints
        .filter((hint) => visibleHints.has(hint.id))
        .map((hint) => (
          <div
            key={hint.id}
            style={{
              position: 'fixed',
              ...hint.position,
              zIndex: 50,
              maxWidth: 280,
              padding: spacing[4],
              background: colors.surface.overlay,
              borderRadius: radius.xl,
              border: `1px solid ${brandCyan}25`,
              boxShadow: `${shadows.lg}, 0 0 30px ${brandCyan}10`,
              animation: 'pageHintSlide 0.4s ease-out',
              direction: isArabic ? 'rtl' : 'ltr',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: spacing[3],
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.lg,
                  background: `${brandCyan}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {hint.icon || '💡'}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: typography.size.sm,
                    color: colors.text.secondary,
                    lineHeight: typography.lineHeight.relaxed,
                  }}
                >
                  {isArabic ? hint.message.ar : hint.message.en}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: spacing[2],
                marginTop: spacing[3],
              }}
            >
              <button
                onClick={() => dismissHint(hint.id, false)}
                style={{
                  padding: `${spacing[1]}px ${spacing[3]}px`,
                  background: 'transparent',
                  border: `1px solid ${colors.border.default}`,
                  borderRadius: radius.md,
                  color: colors.text.muted,
                  fontSize: typography.size.xs,
                  cursor: 'pointer',
                  transition: transitions.fast,
                }}
              >
                {isArabic ? 'حسناً' : 'Got it'}
              </button>
              {hint.showOnce && (
                <button
                  onClick={() => dismissHint(hint.id, true)}
                  style={{
                    padding: `${spacing[1]}px ${spacing[3]}px`,
                    background: `${brandCyan}15`,
                    border: `1px solid ${brandCyan}30`,
                    borderRadius: radius.md,
                    color: brandCyan,
                    fontSize: typography.size.xs,
                    cursor: 'pointer',
                    transition: transitions.fast,
                  }}
                >
                  {isArabic ? 'لا تظهر مجدداً' : "Don't show again"}
                </button>
              )}
            </div>
          </div>
        ))}

      <style>{`
        @keyframes pageHintSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
});

PageHints.displayName = 'PageHints';

export default ContextualHint;
