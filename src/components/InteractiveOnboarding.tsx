/**
 * InteractiveOnboarding - Guided tour system for new users
 * Provides step-by-step introduction to the platform
 */

import { memo, useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

// Tour step definition
interface TourStep {
  id: string;
  target?: string; // CSS selector for highlight
  title: { ar: string; en: string };
  content: { ar: string; en: string };
  icon: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: {
    type: 'navigate' | 'click' | 'scroll';
    value: string;
  };
  highlight?: boolean;
}

// Tour context
interface TourContextType {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
}

const TourContext = createContext<TourContextType | null>(null);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within TourProvider');
  }
  return context;
};

// Define tour steps
const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: { ar: 'مرحباً بك في لوتس!', en: 'Welcome to Lotus!' },
    content: {
      ar: 'دعني أرشدك في جولة سريعة للتعرف على المنصة ومميزاتها',
      en: "Let me guide you through a quick tour to discover the platform's features",
    },
    icon: '👋',
    position: 'center',
  },
  {
    id: 'mode-selector',
    target: '[data-tour="mode-selector"]',
    title: { ar: 'اختر مسارك', en: 'Choose Your Path' },
    content: {
      ar: 'حدد دورك (مدرسة، ولي أمر، أو أخصائي) لتخصيص تجربتك',
      en: 'Select your role (School, Parent, or Clinician) to personalize your experience',
    },
    icon: '🎭',
    position: 'bottom',
    highlight: true,
  },
  {
    id: 'navigation',
    target: '[data-tour="navigation"]',
    title: { ar: 'التنقل السهل', en: 'Easy Navigation' },
    content: {
      ar: 'استخدم القائمة للتنقل بين الأقسام المختلفة',
      en: 'Use the menu to navigate between different sections',
    },
    icon: '🧭',
    position: 'bottom',
    highlight: true,
  },
  {
    id: 'assessment',
    title: { ar: 'التقييم الذاتي', en: 'Self Assessment' },
    content: {
      ar: 'ابدأ بالتقييم الذاتي لفهم احتياجاتك أو احتياجات طفلك',
      en: 'Start with self-assessment to understand your or your child\'s needs',
    },
    icon: '🎯',
    position: 'center',
    action: { type: 'navigate', value: '/lab' },
  },
  {
    id: 'program',
    title: { ar: 'البرنامج العلاجي', en: 'Treatment Program' },
    content: {
      ar: 'تعرف على برنامج بيرار ذو العشرين جلسة وكيف يعمل',
      en: 'Learn about the 20-session Bérard program and how it works',
    },
    icon: '📋',
    position: 'center',
    action: { type: 'navigate', value: '/program' },
  },
  {
    id: 'results',
    title: { ar: 'النتائج والشهادات', en: 'Results & Testimonials' },
    content: {
      ar: 'شاهد قصص النجاح الحقيقية من عائلات استفادت من البرنامج',
      en: 'See real success stories from families who benefited from the program',
    },
    icon: '⭐',
    position: 'center',
    action: { type: 'navigate', value: '/results' },
  },
  {
    id: 'contact',
    title: { ar: 'ابدأ رحلتك', en: 'Start Your Journey' },
    content: {
      ar: 'جاهز للبدء؟ تواصل معنا عبر واتساب أو النموذج',
      en: 'Ready to begin? Contact us via WhatsApp or the form',
    },
    icon: '🚀',
    position: 'center',
    action: { type: 'navigate', value: '/contact' },
  },
  {
    id: 'complete',
    title: { ar: 'أنت جاهز!', en: "You're All Set!" },
    content: {
      ar: 'الآن أنت تعرف طريقك. استكشف المنصة بحرية!',
      en: 'Now you know your way around. Explore the platform freely!',
    },
    icon: '✨',
    position: 'center',
  },
];

const TOUR_STORAGE_KEY = 'lotus_tour_completed';

/**
 * TourProvider - Manages tour state and provides context
 */
export const TourProvider = memo(({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(() => {
    return localStorage.getItem(TOUR_STORAGE_KEY) === 'true';
  });

  // Auto-start tour for new users on home page
  useEffect(() => {
    if (location.pathname === '/' && !hasCompletedTour) {
      const timer = setTimeout(() => {
        // Check if welcome modal has been shown
        const welcomeShown = localStorage.getItem('lotus_welcome_shown');
        if (welcomeShown) {
          setIsActive(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, hasCompletedTour]);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    setHasCompletedTour(true);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  }, []);

  const nextStep = useCallback(() => {
    const step = TOUR_STEPS[currentStep];

    // Execute action if present
    if (step.action) {
      if (step.action.type === 'navigate') {
        navigate(step.action.value);
      }
    }

    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      endTour();
    }
  }, [currentStep, navigate, endTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < TOUR_STEPS.length) {
      setCurrentStep(index);
    }
  }, []);

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        steps: TOUR_STEPS,
        startTour,
        endTour,
        nextStep,
        prevStep,
        goToStep,
      }}
    >
      {children}
      {isActive && <TourOverlay />}
    </TourContext.Provider>
  );
});

TourProvider.displayName = 'TourProvider';

/**
 * TourOverlay - The visual tour overlay
 */
const TourOverlay = memo(() => {
  const { isArabic } = useLanguage();
  const { currentStep, steps, nextStep, prevStep, endTour } = useTour();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = steps[currentStep];

  // Find and highlight target element
  useEffect(() => {
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [step]);

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (step.position === 'center' || !targetRect) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const margin = 20;
    const tooltipWidth = 340;

    switch (step.position) {
      case 'top':
        return {
          position: 'fixed',
          bottom: window.innerHeight - targetRect.top + margin,
          left: Math.max(margin, Math.min(targetRect.left + targetRect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - margin)),
        };
      case 'bottom':
        return {
          position: 'fixed',
          top: targetRect.bottom + margin,
          left: Math.max(margin, Math.min(targetRect.left + targetRect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - margin)),
        };
      case 'left':
        return {
          position: 'fixed',
          top: targetRect.top + targetRect.height / 2,
          right: window.innerWidth - targetRect.left + margin,
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          position: 'fixed',
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.right + margin,
          transform: 'translateY(-50%)',
        };
      default:
        return {};
    }
  };

  return (
    <>
      {/* Backdrop with spotlight */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          pointerEvents: 'none',
        }}
      >
        {/* Dark overlay with cutout */}
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0 }}
        >
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              {targetRect && step.highlight && (
                <rect
                  x={targetRect.left - 8}
                  y={targetRect.top - 8}
                  width={targetRect.width + 16}
                  height={targetRect.height + 16}
                  rx="12"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.8)"
            mask="url(#spotlight-mask)"
          />
        </svg>

        {/* Highlight border */}
        {targetRect && step.highlight && (
          <div
            style={{
              position: 'fixed',
              left: targetRect.left - 8,
              top: targetRect.top - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
              border: `2px solid ${brandCyan}`,
              borderRadius: radius.xl,
              boxShadow: `0 0 20px ${brandCyan}50, inset 0 0 20px ${brandCyan}20`,
              animation: 'spotlightPulse 2s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div
        style={{
          ...getTooltipStyle(),
          maxWidth: 340,
          width: 'calc(100% - 32px)',
          background: colors.surface.overlay,
          borderRadius: radius['2xl'],
          border: `1px solid ${brandCyan}30`,
          boxShadow: `${shadows['2xl']}, 0 0 60px ${brandCyan}15`,
          zIndex: 1001,
          animation: 'tooltipEnter 0.3s ease-out',
          direction: isArabic ? 'rtl' : 'ltr',
        }}
      >
        {/* Progress bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: colors.border.default,
            borderRadius: `${radius['2xl']}px ${radius['2xl']}px 0 0`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: spacing[5] }}>
          {/* Icon and step indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: spacing[4],
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: radius.xl,
                background: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}15)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
              }}
            >
              {renderLabIcon(step.icon, { size: 20, tone: 'cyan' })}
            </div>
            <span
              style={{
                fontSize: typography.size.xs,
                color: colors.text.muted,
                fontWeight: typography.weight.medium,
              }}
            >
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              margin: 0,
              fontSize: typography.size.xl,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
              marginBottom: spacing[2],
            }}
          >
            {isArabic ? step.title.ar : step.title.en}
          </h3>

          {/* Content */}
          <p
            style={{
              margin: 0,
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: typography.lineHeight.relaxed,
              marginBottom: spacing[5],
            }}
          >
            {isArabic ? step.content.ar : step.content.en}
          </p>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: spacing[3],
            }}
          >
            {/* Skip button */}
            <button
              onClick={endTour}
              style={{
                padding: `${spacing[2]}px ${spacing[3]}px`,
                background: 'transparent',
                border: 'none',
                color: colors.text.muted,
                fontSize: typography.size.sm,
                cursor: 'pointer',
              }}
            >
              {isArabic ? 'تخطي' : 'Skip Tour'}
            </button>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', gap: spacing[2] }}>
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  style={{
                    padding: `${spacing[2]}px ${spacing[4]}px`,
                    background: colors.border.default,
                    border: 'none',
                    borderRadius: radius.lg,
                    color: colors.text.primary,
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.medium,
                    cursor: 'pointer',
                  }}
                >
                  {isArabic ? 'السابق' : 'Back'}
                </button>
              )}
              <button
                onClick={nextStep}
                style={{
                  padding: `${spacing[2]}px ${spacing[5]}px`,
                  background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
                  border: 'none',
                  borderRadius: radius.lg,
                  color: brandInk,
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.bold,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                }}
              >
                <span>
                  {currentStep === steps.length - 1
                    ? isArabic
                      ? 'إنهاء'
                      : 'Finish'
                    : isArabic
                      ? 'التالي'
                      : 'Next'}
                </span>
                <span>{isArabic ? '←' : '→'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Step dots */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: spacing[1],
            paddingBottom: spacing[4],
          }}
        >
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => {}}
              style={{
                width: index === currentStep ? 20 : 8,
                height: 8,
                borderRadius: radius.full,
                background: index === currentStep ? brandCyan : colors.border.emphasis,
                border: 'none',
                cursor: 'default',
                transition: transitions.fast,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spotlightPulse {
          0%, 100% { box-shadow: 0 0 20px ${brandCyan}50, inset 0 0 20px ${brandCyan}20; }
          50% { box-shadow: 0 0 40px ${brandCyan}70, inset 0 0 30px ${brandCyan}30; }
        }
        @keyframes tooltipEnter {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  );
});

TourOverlay.displayName = 'TourOverlay';

/**
 * StartTourButton - Button to manually start the tour
 */
export const StartTourButton = memo(() => {
  const { isArabic } = useLanguage();
  const { startTour, isActive } = useTour();

  if (isActive) return null;

  return (
    <button
      onClick={startTour}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[2],
        padding: `${spacing[2]}px ${spacing[3]}px`,
        background: `${brandPurple}15`,
        border: `1px solid ${brandPurple}30`,
        borderRadius: radius.lg,
        color: brandPurple,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.medium,
        cursor: 'pointer',
        transition: transitions.fast,
      }}
    >
      <span>{renderLabIcon('\u{1F393}', { size: 16, tone: 'cyan' })}</span>
      <span>{isArabic ? 'جولة تعريفية' : 'Take a Tour'}</span>
    </button>
  );
});

StartTourButton.displayName = 'StartTourButton';

export default TourProvider;
