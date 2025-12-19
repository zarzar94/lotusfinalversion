/**
 * PersonalizedGreeting - Time-based and mode-aware greeting
 * Provides a personalized welcome message based on time of day and visitor mode
 */

import { memo, useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useVisitorMode } from '../context/VisitorModeContext';
import { useUser } from '../context/UserContext';
import {
  brandCyan,
  brandPurple,
  brandPink,
  colors,
  typography,
  spacing,
  radius,
} from './styles';

interface PersonalizedGreetingProps {
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PersonalizedGreeting = memo(({
  showSubtitle = true,
  size = 'md',
  className = '',
}: PersonalizedGreetingProps) => {
  const { isArabic } = useLanguage();
  const { mode, config } = useVisitorMode();
  const { user, isAuthenticated } = useUser();
  const [greeting, setGreeting] = useState<{ main: string; sub: string }>({ main: '', sub: '' });

  useEffect(() => {
    const hour = new Date().getHours();
    let timeGreeting: { ar: string; en: string };
    let emoji: string;

    // Time-based greeting
    if (hour >= 5 && hour < 12) {
      timeGreeting = { ar: 'صباح الخير', en: 'Good morning' };
      emoji = '🌅';
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = { ar: 'مساء الخير', en: 'Good afternoon' };
      emoji = '☀️';
    } else if (hour >= 17 && hour < 21) {
      timeGreeting = { ar: 'مساء النور', en: 'Good evening' };
      emoji = '🌆';
    } else {
      timeGreeting = { ar: 'مساء الخير', en: 'Good evening' };
      emoji = '🌙';
    }

    // Personalize with name if authenticated
    const name = isAuthenticated && user?.name ? user.name.split(' ')[0] : '';

    // Mode-specific subtitle
    let subtitle: { ar: string; en: string };
    switch (mode) {
      case 'school':
        subtitle = {
          ar: 'نحن سعداء بشراكتكم معنا',
          en: "We're glad you're exploring partnership opportunities",
        };
        break;
      case 'parent':
        subtitle = {
          ar: 'نحن هنا لمساعدتك في رحلة طفلك',
          en: "We're here to help with your child's journey",
        };
        break;
      case 'clinician':
        subtitle = {
          ar: 'استكشف أحدث الأبحاث والبروتوكولات',
          en: 'Explore the latest research and protocols',
        };
        break;
      default:
        subtitle = {
          ar: 'مرحباً بك في منصة لوتس',
          en: 'Welcome to Lotus platform',
        };
    }

    // Build greeting
    const greetingText = isArabic
      ? name
        ? `${timeGreeting.ar}، ${name} ${emoji}`
        : `${timeGreeting.ar} ${emoji}`
      : name
        ? `${timeGreeting.en}, ${name} ${emoji}`
        : `${timeGreeting.en} ${emoji}`;

    setGreeting({
      main: greetingText,
      sub: isArabic ? subtitle.ar : subtitle.en,
    });
  }, [isArabic, mode, user, isAuthenticated]);

  // Size configurations
  const sizes = {
    sm: {
      main: typography.size.lg,
      sub: typography.size.sm,
      gap: spacing[1],
    },
    md: {
      main: typography.size.xl,
      sub: typography.size.base,
      gap: spacing[2],
    },
    lg: {
      main: typography.size['2xl'],
      sub: typography.size.lg,
      gap: spacing[3],
    },
  };

  const sizeConfig = sizes[size];

  // Mode colors
  const modeColors = {
    school: '#f59e0b',
    parent: brandPurple,
    clinician: brandPink,
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: sizeConfig.gap,
        direction: isArabic ? 'rtl' : 'ltr',
        textAlign: isArabic ? 'right' : 'left',
      }}
    >
      {/* Main greeting */}
      <h2
        style={{
          margin: 0,
          fontSize: sizeConfig.main,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
        }}
      >
        {greeting.main}
      </h2>

      {/* Subtitle with mode indicator */}
      {showSubtitle && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            flexWrap: 'wrap',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: sizeConfig.sub,
              color: colors.text.secondary,
              lineHeight: typography.lineHeight.relaxed,
            }}
          >
            {greeting.sub}
          </p>

          {/* Mode badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing[1],
              padding: `${spacing[0.5]}px ${spacing[2]}px`,
              background: `${modeColors[mode]}15`,
              border: `1px solid ${modeColors[mode]}25`,
              borderRadius: radius.full,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.bold,
              color: modeColors[mode],
            }}
          >
            {config.icon}
            <span>{isArabic ? config.labelAr : config.label}</span>
          </span>
        </div>
      )}
    </div>
  );
});

PersonalizedGreeting.displayName = 'PersonalizedGreeting';

/**
 * QuickStats - Show personalized quick stats
 */
interface QuickStatsProps {
  showVisitCount?: boolean;
  showLastVisit?: boolean;
  showProgress?: boolean;
}

export const QuickStats = memo(({
  showVisitCount = true,
  showLastVisit = true,
  showProgress = true,
}: QuickStatsProps) => {
  const { isArabic } = useLanguage();
  const [stats, setStats] = useState({
    visitCount: 1,
    lastVisit: null as Date | null,
    pagesExplored: 0,
  });

  useEffect(() => {
    // Load and update visit stats
    const raw = localStorage.getItem('lotus_visit_stats');
    const existing = raw ? JSON.parse(raw) : { count: 0, lastVisit: null };

    const newStats = {
      count: existing.count + 1,
      lastVisit: new Date().toISOString(),
    };

    localStorage.setItem('lotus_visit_stats', JSON.stringify(newStats));

    // Get pages explored
    const visitedPages = localStorage.getItem('lotus_visited_pages');
    const pagesCount = visitedPages ? JSON.parse(visitedPages).length : 1;

    setStats({
      visitCount: newStats.count,
      lastVisit: existing.lastVisit ? new Date(existing.lastVisit) : null,
      pagesExplored: pagesCount,
    });
  }, []);

  const formatLastVisit = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return isArabic ? 'اليوم' : 'Today';
    } else if (diffDays === 1) {
      return isArabic ? 'أمس' : 'Yesterday';
    } else if (diffDays < 7) {
      return isArabic ? `منذ ${diffDays} أيام` : `${diffDays} days ago`;
    } else {
      return isArabic ? `منذ ${Math.floor(diffDays / 7)} أسابيع` : `${Math.floor(diffDays / 7)} weeks ago`;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: spacing[4],
        flexWrap: 'wrap',
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      {showVisitCount && stats.visitCount > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[2]}px ${spacing[3]}px`,
            background: `${brandCyan}10`,
            borderRadius: radius.lg,
          }}
        >
          <span style={{ fontSize: 16 }}>👋</span>
          <span
            style={{
              fontSize: typography.size.sm,
              color: colors.text.secondary,
            }}
          >
            {isArabic
              ? `زيارتك رقم ${stats.visitCount}`
              : `Visit #${stats.visitCount}`}
          </span>
        </div>
      )}

      {showLastVisit && stats.lastVisit && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[2]}px ${spacing[3]}px`,
            background: `${brandPurple}10`,
            borderRadius: radius.lg,
          }}
        >
          <span style={{ fontSize: 16 }}>🕐</span>
          <span
            style={{
              fontSize: typography.size.sm,
              color: colors.text.secondary,
            }}
          >
            {isArabic ? 'آخر زيارة: ' : 'Last visit: '}
            {formatLastVisit(stats.lastVisit)}
          </span>
        </div>
      )}

      {showProgress && stats.pagesExplored > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[2]}px ${spacing[3]}px`,
            background: `${brandPink}10`,
            borderRadius: radius.lg,
          }}
        >
          <span style={{ fontSize: 16 }}>📚</span>
          <span
            style={{
              fontSize: typography.size.sm,
              color: colors.text.secondary,
            }}
          >
            {isArabic
              ? `استكشفت ${stats.pagesExplored} صفحات`
              : `Explored ${stats.pagesExplored} pages`}
          </span>
        </div>
      )}
    </div>
  );
});

QuickStats.displayName = 'QuickStats';

/**
 * ReturningUserBanner - Special banner for returning visitors
 */
export const ReturningUserBanner = memo(() => {
  const { isArabic } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [visitCount, setVisitCount] = useState(1);

  useEffect(() => {
    const raw = localStorage.getItem('lotus_visit_stats');
    const stats = raw ? JSON.parse(raw) : { count: 0 };

    if (stats.count > 1 && stats.count <= 5) {
      setVisitCount(stats.count);
      setIsVisible(true);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 400,
        width: 'calc(100% - 32px)',
        padding: `${spacing[3]}px ${spacing[4]}px`,
        background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
        border: `1px solid ${brandCyan}25`,
        borderRadius: radius.xl,
        boxShadow: `0 8px 32px ${brandCyan}10`,
        zIndex: 50,
        animation: 'bannerSlideDown 0.5s ease-out',
        direction: isArabic ? 'rtl' : 'ltr',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing[3],
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
        <span style={{ fontSize: 24 }}>🎉</span>
        <span
          style={{
            fontSize: typography.size.sm,
            color: colors.text.primary,
          }}
        >
          {isArabic
            ? `مرحباً بعودتك! هذه زيارتك رقم ${visitCount}`
            : `Welcome back! This is visit #${visitCount}`}
        </span>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        style={{
          background: 'transparent',
          border: 'none',
          color: colors.text.muted,
          cursor: 'pointer',
          padding: spacing[1],
        }}
      >
        ✕
      </button>

      <style>{`
        @keyframes bannerSlideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
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

ReturningUserBanner.displayName = 'ReturningUserBanner';

export default PersonalizedGreeting;
