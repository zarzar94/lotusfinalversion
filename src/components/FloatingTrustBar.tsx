/**
 * FloatingTrustBar - Social proof and trust signals
 * Shows real-time activity, testimonials, and trust metrics
 */

import { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface TrustNotification {
  id: string;
  type: 'activity' | 'testimonial' | 'metric';
  icon: string;
  message: { ar: string; en: string };
  detail?: { ar: string; en: string };
  action?: { path: string; label: { ar: string; en: string } };
}

// Simulated trust notifications (in production, these would come from a backend)
const TRUST_NOTIFICATIONS: TrustNotification[] = [
  {
    id: '1',
    type: 'activity',
    icon: '👨‍👩‍👧',
    message: { ar: 'عائلة من جدة بدأت البرنامج', en: 'A family from Jeddah started the program' },
    detail: { ar: 'منذ 5 دقائق', en: '5 minutes ago' },
  },
  {
    id: '2',
    type: 'metric',
    icon: '📊',
    message: { ar: '+500 عائلة استفادت هذا العام', en: '500+ families helped this year' },
    action: { path: '/results', label: { ar: 'شاهد النتائج', en: 'See Results' } },
  },
  {
    id: '3',
    type: 'testimonial',
    icon: '⭐',
    message: { ar: '"تحسن ملحوظ في التركيز والاستماع"', en: '"Notable improvement in focus and listening"' },
    detail: { ar: '- أم أحمد، الرياض', en: '- Ahmed\'s mother, Riyadh' },
    action: { path: '/results', label: { ar: 'المزيد من الشهادات', en: 'More testimonials' } },
  },
  {
    id: '4',
    type: 'activity',
    icon: '🏫',
    message: { ar: 'مدرسة جديدة انضمت للشراكة', en: 'New school joined the partnership' },
    detail: { ar: 'منذ 15 دقيقة', en: '15 minutes ago' },
  },
  {
    id: '5',
    type: 'metric',
    icon: '✅',
    message: { ar: '95% معدل رضا الأهالي', en: '95% parent satisfaction rate' },
    action: { path: '/results', label: { ar: 'اقرأ المزيد', en: 'Read more' } },
  },
  {
    id: '6',
    type: 'testimonial',
    icon: '💬',
    message: { ar: '"أخيراً وجدنا الحل المناسب"', en: '"Finally found the right solution"' },
    detail: { ar: '- والد سارة، الدمام', en: "- Sara's father, Dammam" },
  },
  {
    id: '7',
    type: 'activity',
    icon: '🎯',
    message: { ar: 'شخص ما أكمل التقييم الذاتي', en: 'Someone completed the self-assessment' },
    detail: { ar: 'الآن', en: 'Just now' },
    action: { path: '/assessment', label: { ar: 'جرب التقييم', en: 'Try Assessment' } },
  },
  {
    id: '8',
    type: 'metric',
    icon: '🧠',
    message: { ar: '+20 سنة من الخبرة في AIT', en: '20+ years of AIT experience' },
    action: { path: '/about', label: { ar: 'تعرف علينا', en: 'About us' } },
  },
];

const FloatingTrustBar = memo(() => {
  const { isArabic } = useLanguage();
  const { mode } = useVisitorMode();
  const navigate = useNavigate();
  const [currentNotification, setCurrentNotification] = useState<TrustNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [notificationIndex, setNotificationIndex] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Track scroll to show after some engagement
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycle through notifications
  useEffect(() => {
    if (isDismissed || !hasScrolled) return;

    // Initial delay before showing first notification
    const initialDelay = setTimeout(() => {
      setCurrentNotification(TRUST_NOTIFICATIONS[0]);
      setIsVisible(true);
    }, 8000);

    return () => clearTimeout(initialDelay);
  }, [isDismissed, hasScrolled]);

  // Auto-rotate notifications
  useEffect(() => {
    if (!isVisible || isDismissed) return;

    const rotateInterval = setInterval(() => {
      // Hide current
      setIsVisible(false);

      // Show next after a pause
      setTimeout(() => {
        const nextIndex = (notificationIndex + 1) % TRUST_NOTIFICATIONS.length;
        setNotificationIndex(nextIndex);
        setCurrentNotification(TRUST_NOTIFICATIONS[nextIndex]);
        setIsVisible(true);
      }, 1000);
    }, 12000); // Show each for 12 seconds

    return () => clearInterval(rotateInterval);
  }, [isVisible, isDismissed, notificationIndex]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('lotus_trust_dismissed', Date.now().toString());
  }, []);

  const handleAction = useCallback((path: string) => {
    setIsVisible(false);
    navigate(path);
  }, [navigate]);

  // Check if previously dismissed (reset after 1 hour)
  useEffect(() => {
    const dismissed = localStorage.getItem('lotus_trust_dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const hourAgo = Date.now() - 60 * 60 * 1000;
      if (dismissedTime > hourAgo) {
        setIsDismissed(true);
      }
    }
  }, []);

  if (!currentNotification || !isVisible) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: spacing[4],
          [isArabic ? 'right' : 'left']: spacing[4],
          maxWidth: 340,
          width: 'calc(100% - 32px)',
          background: colors.surface.overlay,
          borderRadius: radius.xl,
          border: `1px solid ${brandCyan}20`,
          boxShadow: `${shadows.xl}, 0 0 40px ${brandCyan}08`,
          padding: spacing[4],
          zIndex: 45,
          animation: 'trustSlideIn 0.5s ease-out',
          direction: isArabic ? 'rtl' : 'ltr',
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
            borderRadius: `${radius.xl}px ${radius.xl}px 0 0`,
          }}
        />

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
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: transitions.fast,
          }}
          aria-label={isArabic ? 'إغلاق' : 'Close'}
        >
          ✕
        </button>

        {/* Content */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[3] }}>
          {/* Icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: radius.lg,
              background:
                currentNotification.type === 'activity'
                  ? `${brandCyan}15`
                  : currentNotification.type === 'testimonial'
                    ? `${brandPurple}15`
                    : `${brandPink}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {currentNotification.icon}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.medium,
                color: colors.text.primary,
                lineHeight: typography.lineHeight.relaxed,
                marginBottom: currentNotification.detail ? spacing[1] : 0,
              }}
            >
              {isArabic ? currentNotification.message.ar : currentNotification.message.en}
            </p>

            {currentNotification.detail && (
              <p
                style={{
                  margin: 0,
                  fontSize: typography.size.xs,
                  color: colors.text.muted,
                }}
              >
                {isArabic ? currentNotification.detail.ar : currentNotification.detail.en}
              </p>
            )}
          </div>
        </div>

        {/* Action button */}
        {currentNotification.action && (
          <button
            onClick={() => handleAction(currentNotification.action!.path)}
            style={{
              width: '100%',
              marginTop: spacing[3],
              padding: `${spacing[2]}px ${spacing[3]}px`,
              background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
              border: `1px solid ${brandCyan}25`,
              borderRadius: radius.lg,
              color: brandCyan,
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
              {isArabic ? currentNotification.action.label.ar : currentNotification.action.label.en}
            </span>
            <span>{isArabic ? '←' : '→'}</span>
          </button>
        )}

        {/* Progress dots */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: spacing[1],
            marginTop: spacing[3],
          }}
        >
          {TRUST_NOTIFICATIONS.slice(0, 5).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === notificationIndex % 5 ? 16 : 6,
                height: 6,
                borderRadius: radius.full,
                background: i === notificationIndex % 5 ? brandCyan : colors.border.emphasis,
                transition: transitions.normal,
              }}
            />
          ))}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes trustSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
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

FloatingTrustBar.displayName = 'FloatingTrustBar';

export default FloatingTrustBar;
