/**
 * JourneyProgressIndicator - Visual progress through the user journey
 * Shows users their exploration progress and guides them to next steps
 */

import { memo, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useVisitorMode } from '../context/VisitorModeContext';
import {
  brandCyan,
  brandPurple,
  brandPink,
  brandInk,
  colors,
  typography,
  spacing,
  radius,
  shadows,
  transitions,
} from './styles';
import { renderLabIcon } from './icons/index';

interface JourneyStep {
  id: string;
  path: string;
  icon: string;
  label: { ar: string; en: string };
  description: { ar: string; en: string };
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'home',
    path: '/',
    icon: '🏠',
    label: { ar: 'الرئيسية', en: 'Home' },
    description: { ar: 'تعرف على المنصة', en: 'Discover the platform' },
  },
  {
    id: 'assessment',
    path: '/assessment',
    icon: '🎯',
    label: { ar: 'التقييم', en: 'Assessment' },
    description: { ar: 'قيّم احتياجاتك', en: 'Evaluate your needs' },
  },
  {
    id: 'program',
    path: '/program',
    icon: '📋',
    label: { ar: 'البرنامج', en: 'Program' },
    description: { ar: 'تعرف على العلاج', en: 'Learn the treatment' },
  },
  {
    id: 'science',
    path: '/science',
    icon: '🧠',
    label: { ar: 'العلم', en: 'Science' },
    description: { ar: 'افهم الأساس العلمي', en: 'Understand the science' },
  },
  {
    id: 'results',
    path: '/results',
    icon: '📊',
    label: { ar: 'النتائج', en: 'Results' },
    description: { ar: 'شاهد قصص النجاح', en: 'See success stories' },
  },
  {
    id: 'contact',
    path: '/contact',
    icon: '✉️',
    label: { ar: 'تواصل', en: 'Contact' },
    description: { ar: 'ابدأ رحلتك', en: 'Start your journey' },
  },
];

const JourneyProgressIndicator = memo(() => {
  const { isArabic } = useLanguage();
  const { mode } = useVisitorMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Track visited pages in localStorage
  const [visitedPages, setVisitedPages] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('lotus_visited_pages');
    return saved ? new Set(JSON.parse(saved)) : new Set(['/']);
  });

  // Update visited pages when location changes
  useEffect(() => {
    setVisitedPages((prev) => {
      const newSet = new Set(prev);
      newSet.add(location.pathname);
      localStorage.setItem('lotus_visited_pages', JSON.stringify([...newSet]));
      return newSet;
    });
  }, [location.pathname]);

  // Show after scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 300;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate progress
  const currentStepIndex = JOURNEY_STEPS.findIndex((step) => step.path === location.pathname);
  const visitedCount = JOURNEY_STEPS.filter((step) => visitedPages.has(step.path)).length;
  const progressPercent = Math.round((visitedCount / JOURNEY_STEPS.length) * 100);

  // Get recommended next step
  const getNextStep = useCallback(() => {
    // Prioritize based on visitor mode
    const priorityOrder: Record<string, string[]> = {
      school: ['/assessment', '/results', '/program', '/science', '/contact'],
      parent: ['/program', '/assessment', '/results', '/science', '/contact'],
      clinician: ['/science', '/program', '/results', '/assessment', '/contact'],
    };

    const priority = priorityOrder[mode] || priorityOrder.parent;
    for (const path of priority) {
      if (!visitedPages.has(path)) {
        return JOURNEY_STEPS.find((step) => step.path === path);
      }
    }
    return null;
  }, [mode, visitedPages]);

  const nextStep = getNextStep();

  const handleStepClick = useCallback(
    (path: string) => {
      setHasInteracted(true);
      navigate(path);
      setIsExpanded(false);
    },
    [navigate]
  );

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
    setHasInteracted(true);
  }, []);

  // Don't show on certain pages
  if (['/settings', '/school-dashboard', '/parent-dashboard', '/clinician-dashboard'].includes(location.pathname)) {
    return null;
  }

  if (!isVisible) return null;

  return (
    <>
      {/* Main indicator */}
      <div
        style={{
          position: 'fixed',
          [isArabic ? 'left' : 'right']: spacing[4],
          bottom: 100,
          zIndex: 40,
          direction: isArabic ? 'rtl' : 'ltr',
        }}
      >
        {/* Expanded panel */}
        {isExpanded && (
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              [isArabic ? 'left' : 'right']: 0,
              width: 280,
              background: colors.surface.overlay,
              borderRadius: radius.xl,
              border: `1px solid ${colors.border.emphasis}`,
              boxShadow: `${shadows['2xl']}, 0 0 40px ${brandCyan}10`,
              overflow: 'hidden',
              animation: 'slideUp 0.3s ease-out',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: spacing[4],
                background: `linear-gradient(135deg, ${brandCyan}10, ${brandPurple}10)`,
                borderBottom: `1px solid ${colors.border.default}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: spacing[2],
                }}
              >
                <span
                  style={{
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.bold,
                    color: colors.text.primary,
                  }}
                >
                  {isArabic ? 'رحلتك' : 'Your Journey'}
                </span>
                <span
                  style={{
                    fontSize: typography.size.xs,
                    fontWeight: typography.weight.bold,
                    color: brandCyan,
                    background: `${brandCyan}20`,
                    padding: `${spacing[0.5]}px ${spacing[2]}px`,
                    borderRadius: radius.full,
                  }}
                >
                  {progressPercent}%
                </span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: 4,
                  background: colors.border.default,
                  borderRadius: radius.full,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progressPercent}%`,
                    background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
                    borderRadius: radius.full,
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>

            {/* Steps */}
            <div style={{ padding: spacing[2], maxHeight: 300, overflow: 'auto' }}>
              {JOURNEY_STEPS.map((step, index) => {
                const isVisited = visitedPages.has(step.path);
                const isCurrent = step.path === location.pathname;
                const isNext = step.path === nextStep?.path;

                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.path)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[3],
                      padding: spacing[3],
                      background: isCurrent
                        ? `${brandCyan}15`
                        : isNext
                          ? `${brandPurple}10`
                          : 'transparent',
                      border: 'none',
                      borderRadius: radius.lg,
                      cursor: 'pointer',
                      textAlign: isArabic ? 'right' : 'left',
                      transition: transitions.fast,
                      position: 'relative',
                    }}
                  >
                    {/* Step number/status */}
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: isCurrent
                          ? `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`
                          : isVisited
                            ? `${brandCyan}30`
                            : colors.border.default,
                        border: isNext ? `2px dashed ${brandPurple}` : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {renderLabIcon(
                        isVisited ? (isCurrent ? step.icon : '\u2713') : step.icon,
                        {
                          size: 16,
                          style: {
                            color: isCurrent ? brandCyan : isVisited ? colors.success : colors.text.muted,
                          },
                        }
                      )}
                    </div>

                    {/* Label */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: typography.size.sm,
                          fontWeight: isCurrent ? typography.weight.bold : typography.weight.medium,
                          color: isCurrent ? brandCyan : isVisited ? colors.text.primary : colors.text.muted,
                          marginBottom: 2,
                        }}
                      >
                        {isArabic ? step.label.ar : step.label.en}
                      </div>
                      <div
                        style={{
                          fontSize: typography.size.xs,
                          color: colors.text.muted,
                        }}
                      >
                        {isArabic ? step.description.ar : step.description.en}
                      </div>
                    </div>

                    {/* Next badge */}
                    {isNext && (
                      <span
                        style={{
                          fontSize: typography.size.xs,
                          fontWeight: typography.weight.bold,
                          color: brandPurple,
                          background: `${brandPurple}20`,
                          padding: `${spacing[0.5]}px ${spacing[2]}px`,
                          borderRadius: radius.full,
                          flexShrink: 0,
                        }}
                      >
                        {isArabic ? 'التالي' : 'Next'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer tip */}
            {nextStep && (
              <div
                style={{
                  padding: spacing[3],
                  background: `${brandPurple}08`,
                  borderTop: `1px solid ${colors.border.subtle}`,
                }}
              >
                <button
                  onClick={() => handleStepClick(nextStep.path)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: spacing[2],
                    padding: `${spacing[2]}px ${spacing[3]}px`,
                    background: `linear-gradient(135deg, ${brandPurple}, ${brandPink})`,
                    border: 'none',
                    borderRadius: radius.lg,
                    color: 'white',
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.bold,
                    cursor: 'pointer',
                    transition: transitions.bounce,
                  }}
                >
                  <span>{isArabic ? 'الخطوة التالية' : 'Next Step'}</span>
                  <span>{isArabic ? '←' : '→'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={toggleExpanded}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: isExpanded
              ? `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`
              : colors.surface.overlay,
            border: `2px solid ${isExpanded ? 'transparent' : colors.border.emphasis}`,
            boxShadow: `${shadows.lg}, 0 0 20px ${brandCyan}15`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transition: transitions.bounce,
          }}
          aria-label={isArabic ? 'عرض تقدم الرحلة' : 'Show journey progress'}
        >
          {/* Progress ring */}
          <svg
            width="52"
            height="52"
            style={{
              position: 'absolute',
              top: -2,
              left: -2,
              transform: 'rotate(-90deg)',
            }}
          >
            <circle
              cx="26"
              cy="26"
              r="23"
              fill="none"
              stroke={colors.border.default}
              strokeWidth="3"
            />
            <circle
              cx="26"
              cy="26"
              r="23"
              fill="none"
              stroke={brandCyan}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(progressPercent / 100) * 144.5} 144.5`}
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          </svg>

          {/* Icon */}
          <span
            style={{
              fontSize: 20,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {renderLabIcon(isExpanded ? '✕' : '🧭', { size: 16, tone: 'muted' })}
          </span>

          {/* Notification dot for next step */}
          {!hasInteracted && nextStep && (
            <div
              style={{
                position: 'absolute',
                top: -2,
                [isArabic ? 'left' : 'right']: -2,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: brandPink,
                border: `2px solid ${brandInk}`,
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          )}
        </button>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
      `}</style>
    </>
  );
});

JourneyProgressIndicator.displayName = 'JourneyProgressIndicator';

export default JourneyProgressIndicator;
