/**
 * SmartEngagement - Scroll-based CTAs and engagement milestones
 * Provides contextual prompts and celebrates user progress
 */

import { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useVisitorMode } from '../context/VisitorModeContext';
import { useGamification } from '../context/GamificationContext';
import { renderLabIcon } from './icons/index';
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

interface ScrollMilestone {
  id: string;
  threshold: number; // Percentage of page scrolled
  message: { ar: string; en: string };
  icon: string;
  action?: { path: string; label: { ar: string; en: string } };
  showOnce?: boolean;
  requiresFooter?: boolean;
}

interface EngagementMilestone {
  id: string;
  condition: () => boolean;
  message: { ar: string; en: string };
  icon: string;
  celebrationType: 'confetti' | 'glow' | 'shake' | 'pulse';
}

const ENGAGEMENT_CELEBRATION_MILESTONES = [
    { id: 'first-page', threshold: 1, icon: '🎉', message: { ar: 'بداية رائعة!', en: 'Great start!' } },
    { id: 'explorer', threshold: 3, icon: '🗺️', message: { ar: 'أنت مستكشف!', en: "You're an explorer!" } },
    { id: 'dedicated', threshold: 5, icon: '⭐', message: { ar: 'مستخدم متفاني!', en: 'Dedicated user!' } },
    { id: 'master', threshold: 7, icon: '🏆', message: { ar: 'خبير المنصة!', en: 'Platform master!' } },
  ];

const canonicalizePath = (path: string) => {
  if (!path) return path;
  const cutIndex = path.search(/[?#]/);
  const basePath = cutIndex === -1 ? path : path.slice(0, cutIndex);
  const trimmed = basePath.replace(/\/+$/, '');
  const normalized = trimmed === '' ? '/' : trimmed;
  return normalized === '/assessment' ? '/lab' : normalized;
};

const normalizeVisitedPages = (pages: unknown[]) => {
  const normalized = pages
    .filter((page): page is string => typeof page === 'string')
    .map(canonicalizePath)
    .filter(Boolean);
  return Array.from(new Set(normalized));
};

/**
 * ScrollBasedCTA - Shows contextual CTAs based on scroll position
 */
export const ScrollBasedCTA = memo(() => {
  const { isArabic } = useLanguage();
  const { mode } = useVisitorMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentMilestone, setCurrentMilestone] = useState<ScrollMilestone | null>(null);
  const [shownMilestones, setShownMilestones] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('lotus_scroll_milestones');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [isDismissed, setIsDismissed] = useState(false);

  // Define scroll-based milestones per page
  const getMilestones = useCallback((): ScrollMilestone[] => {
    const baseMilestones: ScrollMilestone[] = [];

    switch (location.pathname) {
      case '/':
        baseMilestones.push(
          {
            id: 'home-50',
            threshold: 50,
            requiresFooter: true,
            message: {
              ar: 'اكتشف كيف يعمل البرنامج',
              en: 'Discover how the program works',
            },
            icon: '📋',
            action: { path: '/program', label: { ar: 'تعرف على البرنامج', en: 'Learn About Program' } },
          },
          {
            id: 'home-90',
            threshold: 90,
            requiresFooter: true,
            message: {
              ar: 'شاهد قصص النجاح الملهمة',
              en: 'See inspiring success stories',
            },
            icon: '⭐',
            action: { path: '/results', label: { ar: 'شاهد النتائج', en: 'View Results' } },
          }
        );
        break;

      case '/lab':
        baseMilestones.push(
          {
            id: 'assessment-50',
            threshold: 50,
            message: {
              ar: 'أكملت نصف التقييم! استمر',
              en: "You're halfway through! Keep going",
            },
            icon: '💪',
          },
          {
            id: 'assessment-90',
            threshold: 90,
            message: {
              ar: 'تعرف على البرنامج العلاجي بعد التقييم',
              en: 'Learn about treatment after assessment',
            },
            icon: '📋',
            action: { path: '/program', label: { ar: 'البرنامج العلاجي', en: 'Treatment Program' } },
            showOnce: true,
          }
        );
        break;

      case '/program':
        baseMilestones.push(
          {
            id: 'program-60',
            threshold: 60,
            message: {
              ar: 'هل لديك أسئلة؟ تواصل معنا',
              en: 'Have questions? Contact us',
            },
            icon: '💬',
            action: { path: '/contact', label: { ar: 'تواصل معنا', en: 'Contact Us' } },
          }
        );
        break;

      case '/science':
        baseMilestones.push(
          {
            id: 'science-70',
            threshold: 70,
            message: {
              ar: 'شاهد الأدلة العلمية والنتائج',
              en: 'See the scientific evidence and results',
            },
            icon: '📊',
            action: { path: '/results', label: { ar: 'النتائج', en: 'Results' } },
          }
        );
        break;

      case '/results':
        baseMilestones.push(
          {
            id: 'results-80',
            threshold: 80,
            message: {
              ar: 'مستعد للخطوة التالية؟',
              en: 'Ready for the next step?',
            },
            icon: '🚀',
            action: { path: '/contact', label: { ar: 'ابدأ الآن', en: 'Get Started' } },
          }
        );
        break;
    }

    return baseMilestones;
  }, [location.pathname]);

  // Track scroll and show milestones
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      const footer = document.querySelector<HTMLElement>('.footer-main, footer');
      const footerTop = footer ? footer.getBoundingClientRect().top + window.scrollY : null;
      const viewportBottom = scrollTop + window.innerHeight;
      const isNearFooter = footerTop === null
        ? scrollPercent >= 50
        : viewportBottom >= footerTop - window.innerHeight * 0.5;

      const milestones = getMilestones();

      // Find the highest milestone that has been reached
      for (let i = milestones.length - 1; i >= 0; i--) {
        const milestone = milestones[i];
        if (scrollPercent >= milestone.threshold) {
          if (milestone.requiresFooter && !isNearFooter) {
            continue;
          }
          // Check if already shown (for showOnce milestones)
          if (milestone.showOnce && shownMilestones.has(milestone.id)) {
            continue;
          }

          // Only show if different from current
          if (currentMilestone?.id !== milestone.id && !isDismissed) {
            setCurrentMilestone(milestone);

            if (milestone.showOnce) {
              const newShown = new Set(shownMilestones);
              newShown.add(milestone.id);
              setShownMilestones(newShown);
              localStorage.setItem('lotus_scroll_milestones', JSON.stringify([...newShown]));
            }
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [getMilestones, currentMilestone, shownMilestones, isDismissed]);

  // Reset on page change
  useEffect(() => {
    setCurrentMilestone(null);
    setIsDismissed(false);
  }, [location.pathname]);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    setCurrentMilestone(null);
  }, []);

  const handleAction = useCallback((path: string) => {
    handleDismiss();
    navigate(path);
  }, [handleDismiss, navigate]);

  if (!currentMilestone) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 100,
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 400,
        width: 'calc(100% - 32px)',
        padding: spacing[4],
        background: colors.surface.overlay,
        borderRadius: radius.xl,
        border: `1px solid ${brandCyan}25`,
        boxShadow: `${shadows.xl}, 0 0 40px ${brandCyan}10`,
        zIndex: 50,
        animation: 'slideUpBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        style={{
          position: 'absolute',
          top: spacing[2],
          [isArabic ? 'left' : 'right']: spacing[2],
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'transparent',
          border: 'none',
          color: colors.text.muted,
          cursor: 'pointer',
        }}
      >
        {renderLabIcon('✕', { size: 12, tone: 'muted' })}
      </button>

      {/* Content */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.lg,
            background: `${brandCyan}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            flexShrink: 0,
          }}
        >
          {renderLabIcon(currentMilestone.icon, { size: 24, style: { color: brandCyan } })}
        </div>
        <p
          style={{
            margin: 0,
            fontSize: typography.size.base,
            fontWeight: typography.weight.medium,
            color: colors.text.primary,
            flex: 1,
          }}
        >
          {isArabic ? currentMilestone.message.ar : currentMilestone.message.en}
        </p>
      </div>

      {/* Action button */}
      {currentMilestone.action && (
        <button
          onClick={() => handleAction(currentMilestone.action!.path)}
          style={{
            width: '100%',
            marginTop: spacing[3],
            padding: `${spacing[3]}px ${spacing[4]}px`,
            background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
            border: 'none',
            borderRadius: radius.lg,
            color: brandInk,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            cursor: 'pointer',
            transition: transitions.bounce,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[2],
          }}
        >
          <span>
            {isArabic ? currentMilestone.action.label.ar : currentMilestone.action.label.en}
          </span>
          <span>{isArabic ? '←' : '→'}</span>
        </button>
      )}

      <style>{`
        @keyframes slideUpBounce {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
});

ScrollBasedCTA.displayName = 'ScrollBasedCTA';

/**
 * EngagementCelebration - Celebrates user milestones
 */
export const EngagementCelebration = memo(() => {
  const { isArabic } = useLanguage();
  const { state } = useGamification();
  const { totalPoints: points, level, achievements } = state;
  const [celebration, setCelebration] = useState<{
    message: string;
    icon: string;
    type: string;
  } | null>(null);
  const [celebratedMilestones, setCelebratedMilestones] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('lotus_celebrated');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });


  // Check for new milestones
  useEffect(() => {
    const visitedPages = localStorage.getItem('lotus_visited_pages');
    const parsed = visitedPages ? JSON.parse(visitedPages) : [];
    const normalized = normalizeVisitedPages(Array.isArray(parsed) ? parsed : []);
    if (visitedPages && JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      localStorage.setItem('lotus_visited_pages', JSON.stringify(normalized));
    }
    const pageCount = visitedPages ? normalized.length : 0;

    for (const milestone of ENGAGEMENT_CELEBRATION_MILESTONES) {
      if (pageCount >= milestone.threshold && !celebratedMilestones.has(milestone.id)) {
        setCelebration({
          message: isArabic ? milestone.message.ar : milestone.message.en,
          icon: milestone.icon,
          type: 'confetti',
        });

        // Mark as celebrated
        const newCelebrated = new Set(celebratedMilestones);
        newCelebrated.add(milestone.id);
        setCelebratedMilestones(newCelebrated);
        localStorage.setItem('lotus_celebrated', JSON.stringify([...newCelebrated]));

        // Auto-dismiss after 3 seconds
        setTimeout(() => setCelebration(null), 3000);
        break;
      }
    }
  }, [isArabic, celebratedMilestones]);

  if (!celebration) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          pointerEvents: 'none',
        }}
      >
        {/* Celebration burst */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing[3],
            animation: 'celebrationPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${brandCyan}30, ${brandPurple}30)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 50,
              boxShadow: `0 0 60px ${brandCyan}50`,
          }}
        >
          {renderLabIcon(celebration.icon, { size: 48, style: { color: brandCyan } })}
        </div>
          <div
            style={{
              padding: `${spacing[2]}px ${spacing[5]}px`,
              background: colors.surface.overlay,
              borderRadius: radius.full,
              boxShadow: shadows.xl,
            }}
          >
            <span
              style={{
                fontSize: typography.size.lg,
                fontWeight: typography.weight.bold,
                color: colors.text.primary,
              }}
            >
              {celebration.message}
            </span>
          </div>
        </div>
      </div>

      {/* Confetti effect */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999 }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 10,
              height: 10,
              borderRadius: i % 2 === 0 ? '50%' : '2px',
              background: [brandCyan, brandPurple, brandPink, colors.warning, colors.success][i % 5],
              animation: `confetti-${i % 4} 1s ease-out forwards`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes celebrationPop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes confetti-0 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(100px, -150px) rotate(360deg); opacity: 0; }
        }
        @keyframes confetti-1 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(-120px, -100px) rotate(-360deg); opacity: 0; }
        }
        @keyframes confetti-2 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(80px, 120px) rotate(270deg); opacity: 0; }
        }
        @keyframes confetti-3 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(-100px, 80px) rotate(-270deg); opacity: 0; }
        }
      `}</style>
    </>
  );
});

EngagementCelebration.displayName = 'EngagementCelebration';

/**
 * TimeOnPageTracker - Tracks and rewards time spent
 */
export const TimeOnPageTracker = memo(() => {
  const { isArabic } = useLanguage();
  const [timeSpent, setTimeSpent] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [hasShownReward, setHasShownReward] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Show reward after 60 seconds of engagement
  useEffect(() => {
    if (timeSpent >= 60 && !hasShownReward) {
      setShowReward(true);
      setHasShownReward(true);
      setTimeout(() => setShowReward(false), 4000);
    }
  }, [timeSpent, hasShownReward]);

  if (!showReward) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 100,
        [isArabic ? 'left' : 'right']: spacing[4],
        padding: spacing[4],
        background: `linear-gradient(135deg, ${brandPurple}20, ${brandCyan}15)`,
        border: `1px solid ${brandPurple}30`,
        borderRadius: radius.xl,
        boxShadow: shadows.lg,
        zIndex: 60,
        animation: 'slideIn 0.5s ease-out',
        direction: isArabic ? 'rtl' : 'ltr',
        maxWidth: 280,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
        <span style={{ fontSize: 28 }}>
          {renderLabIcon('⏱️', { size: 24, tone: 'purple' })}
        </span>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
              color: brandPurple,
            }}
          >
            {isArabic ? 'مستخدم متفاعل!' : 'Engaged User!'}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: typography.size.xs,
              color: colors.text.secondary,
            }}
          >
            {isArabic
              ? 'شكراً لقضائك وقتاً معنا'
              : 'Thanks for spending time with us'}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(${isArabic ? '-20px' : '20px'});
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
});

TimeOnPageTracker.displayName = 'TimeOnPageTracker';

export default ScrollBasedCTA;
