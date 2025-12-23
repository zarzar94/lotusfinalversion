/**
 * PersonalizedGreeting - Enhanced time-based and mode-aware greeting
 * Provides rich personalized experience with streaks, recommendations, and celebrations
 */

import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useVisitorMode } from '../context/VisitorModeContext';
import { useUser } from '../context/UserContext';
import { useGamification } from '../context/GamificationContext';
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

// Storage keys
const VISIT_STATS_KEY = 'lotus_visit_stats';
const STREAK_KEY = 'lotus_engagement_streak';
const VISITED_PAGES_KEY = 'lotus_visited_pages';

// Streak data interface
interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string;
  totalVisits: number;
  weeklyVisits: number[];
}

interface PersonalizedGreetingProps {
  showSubtitle?: boolean;
  showStats?: boolean;
  showStreak?: boolean;
  showRecommendations?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'hero' | 'compact';
  className?: string;
}

const PersonalizedGreeting = memo(({
  showSubtitle = true,
  showStats = false,
  showStreak = true,
  showRecommendations = false,
  size = 'md',
  variant = 'default',
  className = '',
}: PersonalizedGreetingProps) => {
  const { isArabic } = useLanguage();
  const { mode, config } = useVisitorMode();
  const { user, isAuthenticated } = useUser();
  const { state } = useGamification();
  const { totalPoints: points, level } = state;
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState<{
    main: string;
    sub: string;
    emoji: string;
    specialMessage?: string;
  }>({ main: '', sub: '', emoji: '' });

  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastVisitDate: '',
    totalVisits: 0,
    weeklyVisits: [0, 0, 0, 0, 0, 0, 0],
  });

  const [isStreakCelebration, setIsStreakCelebration] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Update streak on mount
  useEffect(() => {
    const updateStreak = () => {
      const saved = localStorage.getItem(STREAK_KEY);
      const today = new Date().toDateString();
      const dayOfWeek = new Date().getDay();

      let data: StreakData = saved
        ? JSON.parse(saved)
        : {
            currentStreak: 0,
            longestStreak: 0,
            lastVisitDate: '',
            totalVisits: 0,
            weeklyVisits: [0, 0, 0, 0, 0, 0, 0],
          };

      // Check if this is a new day
      if (data.lastVisitDate !== today) {
        const lastVisit = data.lastVisitDate ? new Date(data.lastVisitDate) : null;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastVisit && lastVisit.toDateString() === yesterday.toDateString()) {
          // Consecutive day - increase streak
          data.currentStreak += 1;
          if (data.currentStreak > data.longestStreak) {
            data.longestStreak = data.currentStreak;
          }
          // Celebrate milestone streaks
          if ([3, 7, 14, 30].includes(data.currentStreak)) {
            setIsStreakCelebration(true);
            setTimeout(() => setIsStreakCelebration(false), 3000);
          }
        } else if (!lastVisit || lastVisit.toDateString() !== today) {
          // Streak broken or first visit
          data.currentStreak = 1;
        }

        data.lastVisitDate = today;
        data.totalVisits += 1;

        // Update weekly visits
        data.weeklyVisits[dayOfWeek] = (data.weeklyVisits[dayOfWeek] || 0) + 1;
      }

      localStorage.setItem(STREAK_KEY, JSON.stringify(data));
      setStreakData(data);
    };

    updateStreak();
  }, []);

  // Generate greeting based on time, mode, and user data
  useEffect(() => {
    const hour = new Date().getHours();
    const dayOfWeek = new Date().getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let timeGreeting: { ar: string; en: string };
    let emoji: string;
    let specialMessage: { ar: string; en: string } | undefined;

    // Time-based greeting with more variety
    if (hour >= 5 && hour < 12) {
      const morningGreetings = [
        { ar: 'صباح الخير', en: 'Good morning', emoji: '🌅' },
        { ar: 'صباح النور', en: 'Rise and shine', emoji: '☀️' },
        { ar: 'أسعد الله صباحك', en: 'Have a wonderful morning', emoji: '🌞' },
      ];
      const selected = morningGreetings[Math.floor(Math.random() * morningGreetings.length)];
      timeGreeting = { ar: selected.ar, en: selected.en };
      emoji = selected.emoji;
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = { ar: 'مساء الخير', en: 'Good afternoon' };
      emoji = '☀️';
    } else if (hour >= 17 && hour < 21) {
      timeGreeting = { ar: 'مساء النور', en: 'Good evening' };
      emoji = '🌆';
    } else {
      timeGreeting = { ar: 'مساء الخير', en: 'Good night' };
      emoji = '🌙';
    }

    // Special messages based on context
    if (isWeekend) {
      specialMessage = {
        ar: 'نهاية أسبوع سعيدة! 🎉',
        en: 'Happy weekend! 🎉',
      };
    } else if (streakData.currentStreak >= 7) {
      specialMessage = {
        ar: `${streakData.currentStreak} أيام متتالية! 🔥`,
        en: `${streakData.currentStreak} day streak! 🔥`,
      };
    } else if (streakData.totalVisits === 1) {
      specialMessage = {
        ar: 'مرحباً بك لأول مرة! ✨',
        en: 'Welcome for the first time! ✨',
      };
    } else if (streakData.totalVisits === 10) {
      specialMessage = {
        ar: 'زيارتك العاشرة! أنت رائع! 🌟',
        en: '10th visit! You\'re awesome! 🌟',
      };
    }

    // Personalize with name
    const name = isAuthenticated && user?.name ? user.name.split(' ')[0] : '';

    // Mode-specific subtitle with variety
    const modeSubtitles: Record<string, { ar: string[]; en: string[] }> = {
      school: {
        ar: [
          'نحن سعداء بشراكتكم معنا',
          'معاً نبني مستقبلاً أفضل للطلاب',
          'اكتشف حلولنا التعليمية المتميزة',
        ],
        en: [
          "We're glad you're exploring partnership opportunities",
          'Together we build a better future for students',
          'Discover our exceptional educational solutions',
        ],
      },
      parent: {
        ar: [
          'نحن هنا لمساعدتك في رحلة طفلك',
          'معاً نساعد طفلك على التألق',
          'كل طفل يستحق فرصة للتحسن',
        ],
        en: [
          "We're here to help with your child's journey",
          'Together we help your child shine',
          'Every child deserves a chance to improve',
        ],
      },
      clinician: {
        ar: [
          'استكشف أحدث الأبحاث والبروتوكولات',
          'معاً نطور ممارساتنا السريرية',
          'العلم والخبرة في خدمة المريض',
        ],
        en: [
          'Explore the latest research and protocols',
          'Together we advance clinical practice',
          'Science and expertise serving patients',
        ],
      },
    };

    const subtitles = modeSubtitles[mode] || modeSubtitles.parent;
    const subtitleIndex = Math.floor(Math.random() * subtitles.ar.length);

    // Build greeting
    const greetingText = isArabic
      ? name
        ? `${timeGreeting.ar}، ${name}`
        : timeGreeting.ar
      : name
        ? `${timeGreeting.en}, ${name}`
        : timeGreeting.en;

    setGreeting({
      main: greetingText,
      sub: isArabic ? subtitles.ar[subtitleIndex] : subtitles.en[subtitleIndex],
      emoji,
      specialMessage: specialMessage
        ? isArabic
          ? specialMessage.ar
          : specialMessage.en
        : undefined,
    });

    // Animate in
    setAnimationPhase(1);
  }, [isArabic, mode, user, isAuthenticated, streakData]);

  // Size configurations
  const sizes = {
    sm: {
      main: typography.size.lg,
      sub: typography.size.sm,
      gap: spacing[1],
      iconSize: 20,
    },
    md: {
      main: typography.size.xl,
      sub: typography.size.base,
      gap: spacing[2],
      iconSize: 24,
    },
    lg: {
      main: typography.size['2xl'],
      sub: typography.size.lg,
      gap: spacing[3],
      iconSize: 28,
    },
    xl: {
      main: typography.size['3xl'],
      sub: typography.size.xl,
      gap: spacing[4],
      iconSize: 36,
    },
  };

  const sizeConfig = sizes[size];

  // Mode colors
  const modeColors = {
    school: '#f59e0b',
    parent: brandPurple,
    clinician: brandPink,
  };

  // Personalized recommendations based on behavior
  const recommendations = useMemo(() => {
    const visited = JSON.parse(localStorage.getItem(VISITED_PAGES_KEY) || '[]');
    const recs: Array<{ path: string; label: { ar: string; en: string }; icon: string }> = [];

    if (!visited.includes('/assessment')) {
      recs.push({
        path: '/assessment',
        label: { ar: 'جرب التقييم الذاتي', en: 'Try Self-Assessment' },
        icon: '🎯',
      });
    }
    if (!visited.includes('/program') && mode === 'parent') {
      recs.push({
        path: '/program',
        label: { ar: 'تعرف على البرنامج', en: 'Learn About Program' },
        icon: '📋',
      });
    }
    if (!visited.includes('/results')) {
      recs.push({
        path: '/results',
        label: { ar: 'شاهد النتائج', en: 'See Results' },
        icon: '⭐',
      });
    }

    return recs.slice(0, 2);
  }, [mode]);

  if (variant === 'compact') {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[3],
          direction: isArabic ? 'rtl' : 'ltr',
        }}
      >
        <span style={{ fontSize: sizeConfig.iconSize }}>{greeting.emoji}</span>
        <span
          style={{
            fontSize: sizeConfig.main,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
          }}
        >
          {greeting.main}
        </span>
        {showStreak && streakData.currentStreak > 1 && (
          <span
            style={{
              padding: `${spacing[1]}px ${spacing[2]}px`,
              background: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}15)`,
              borderRadius: radius.full,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.bold,
              color: brandCyan,
            }}
          >
            🔥 {streakData.currentStreak}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        direction: isArabic ? 'rtl' : 'ltr',
        textAlign: isArabic ? 'right' : 'left',
        opacity: animationPhase > 0 ? 1 : 0,
        transform: animationPhase > 0 ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.5s ease-out',
      }}
    >
      {/* Hero variant */}
      {variant === 'hero' && (
        <div
          style={{
            padding: spacing[6],
            background: `linear-gradient(135deg, ${modeColors[mode]}10, ${brandCyan}08)`,
            borderRadius: radius['2xl'],
            border: `1px solid ${modeColors[mode]}20`,
            marginBottom: spacing[4],
          }}
        >
          {/* Top row with greeting and streak */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: spacing[4],
            }}
          >
            <div>
              {/* Emoji with animation */}
              <div
                style={{
                  fontSize: 48,
                  marginBottom: spacing[2],
                  animation: 'greetingBounce 1s ease-out',
                }}
              >
                {greeting.emoji}
              </div>

              {/* Main greeting */}
              <h1
                style={{
                  margin: 0,
                  fontSize: typography.size['4xl'],
                  fontWeight: typography.weight.black,
                  color: colors.text.primary,
                  marginBottom: spacing[2],
                  background: `linear-gradient(135deg, ${colors.text.primary}, ${modeColors[mode]})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {greeting.main}
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  margin: 0,
                  fontSize: typography.size.lg,
                  color: colors.text.secondary,
                  lineHeight: typography.lineHeight.relaxed,
                }}
              >
                {greeting.sub}
              </p>

              {/* Special message */}
              {greeting.specialMessage && (
                <div
                  style={{
                    marginTop: spacing[3],
                    padding: `${spacing[2]}px ${spacing[4]}px`,
                    background: `${brandCyan}15`,
                    borderRadius: radius.full,
                    display: 'inline-block',
                    animation: 'fadeIn 0.5s ease-out 0.3s both',
                  }}
                >
                  <span
                    style={{
                      fontSize: typography.size.sm,
                      fontWeight: typography.weight.bold,
                      color: brandCyan,
                    }}
                  >
                    {greeting.specialMessage}
                  </span>
                </div>
              )}
            </div>

            {/* Streak display */}
            {showStreak && streakData.currentStreak > 0 && (
              <div
                style={{
                  padding: spacing[4],
                  background: colors.surface.card,
                  borderRadius: radius.xl,
                  border: `1px solid ${brandCyan}20`,
                  textAlign: 'center',
                  minWidth: 120,
                  animation: isStreakCelebration ? 'streakCelebrate 0.5s ease-out' : 'none',
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    marginBottom: spacing[1],
                  }}
                >
                  🔥
                </div>
                <div
                  style={{
                    fontSize: typography.size['2xl'],
                    fontWeight: typography.weight.black,
                    color: brandCyan,
                  }}
                >
                  {streakData.currentStreak}
                </div>
                <div
                  style={{
                    fontSize: typography.size.xs,
                    color: colors.text.muted,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  {isArabic ? 'يوم متتالي' : 'day streak'}
                </div>
              </div>
            )}
          </div>

          {/* Mode badge and quick stats */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              flexWrap: 'wrap',
            }}
          >
            {/* Mode badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[2]}px ${spacing[4]}px`,
                background: `${modeColors[mode]}15`,
                border: `1px solid ${modeColors[mode]}25`,
                borderRadius: radius.full,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.bold,
                color: modeColors[mode],
              }}
            >
              {config.icon}
              <span>{isArabic ? config.labelAr : config.label}</span>
            </span>

            {/* Level badge */}
            {level > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing[1],
                  padding: `${spacing[2]}px ${spacing[3]}px`,
                  background: `${brandPurple}15`,
                  borderRadius: radius.full,
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.bold,
                  color: brandPurple,
                }}
              >
                ⭐ {isArabic ? `المستوى ${level}` : `Level ${level}`}
              </span>
            )}

            {/* Points */}
            {points > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing[1],
                  padding: `${spacing[2]}px ${spacing[3]}px`,
                  background: `${brandCyan}10`,
                  borderRadius: radius.full,
                  fontSize: typography.size.sm,
                  color: colors.text.secondary,
                }}
              >
                💎 {points} {isArabic ? 'نقطة' : 'pts'}
              </span>
            )}
          </div>

          {/* Recommendations */}
          {showRecommendations && recommendations.length > 0 && (
            <div
              style={{
                marginTop: spacing[5],
                paddingTop: spacing[4],
                borderTop: `1px solid ${colors.border.subtle}`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  marginBottom: spacing[3],
                  fontSize: typography.size.sm,
                  color: colors.text.muted,
                }}
              >
                {isArabic ? 'مقترح لك:' : 'Suggested for you:'}
              </p>
              <div style={{ display: 'flex', gap: spacing[2], flexWrap: 'wrap' }}>
                {recommendations.map((rec) => (
                  <button
                    key={rec.path}
                    onClick={() => navigate(rec.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[2],
                      padding: `${spacing[2]}px ${spacing[3]}px`,
                      background: colors.surface.card,
                      border: `1px solid ${colors.border.default}`,
                      borderRadius: radius.lg,
                      color: colors.text.primary,
                      fontSize: typography.size.sm,
                      cursor: 'pointer',
                      transition: transitions.fast,
                    }}
                  >
                    <span>{rec.icon}</span>
                    <span>{isArabic ? rec.label.ar : rec.label.en}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Default variant */}
      {variant === 'default' && (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              marginBottom: sizeConfig.gap,
            }}
          >
            {/* Emoji */}
            <span style={{ fontSize: sizeConfig.iconSize }}>{greeting.emoji}</span>

            {/* Main greeting */}
            <h2
              style={{
                margin: 0,
                fontSize: sizeConfig.main,
                fontWeight: typography.weight.bold,
                color: colors.text.primary,
              }}
            >
              {greeting.main}
            </h2>

            {/* Streak badge */}
            {showStreak && streakData.currentStreak > 1 && (
              <span
                style={{
                  padding: `${spacing[1]}px ${spacing[2]}px`,
                  background: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}15)`,
                  borderRadius: radius.full,
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color: brandCyan,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[1],
                }}
              >
                🔥 {streakData.currentStreak}
              </span>
            )}
          </div>

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

          {/* Special message */}
          {greeting.specialMessage && (
            <div
              style={{
                marginTop: spacing[2],
                padding: `${spacing[1]}px ${spacing[3]}px`,
                background: `${brandCyan}10`,
                borderRadius: radius.lg,
                display: 'inline-block',
              }}
            >
              <span
                style={{
                  fontSize: typography.size.sm,
                  color: brandCyan,
                }}
              >
                {greeting.specialMessage}
              </span>
            </div>
          )}
        </>
      )}

      {/* Celebration animation */}
      {isStreakCelebration && (
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
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: [brandCyan, brandPurple, brandPink, '#f59e0b'][i % 4],
                animation: `confetti-burst 1s ease-out ${i * 0.05}s forwards`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes greetingBounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes streakCelebrate {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes confetti-burst {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(
              ${Math.cos(Math.random() * Math.PI * 2) * 100}px,
              ${Math.sin(Math.random() * Math.PI * 2) * 100}px
            ) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
});

PersonalizedGreeting.displayName = 'PersonalizedGreeting';

/**
 * QuickStats - Enhanced personalized quick stats
 */
interface QuickStatsProps {
  showVisitCount?: boolean;
  showLastVisit?: boolean;
  showProgress?: boolean;
  showStreak?: boolean;
  variant?: 'horizontal' | 'grid';
}

export const QuickStats = memo(({
  showVisitCount = true,
  showLastVisit = true,
  showProgress = true,
  showStreak = true,
  variant = 'horizontal',
}: QuickStatsProps) => {
  const { isArabic } = useLanguage();
  const [stats, setStats] = useState({
    visitCount: 1,
    lastVisit: null as Date | null,
    pagesExplored: 0,
    streak: 0,
    totalTimeMinutes: 0,
  });

  useEffect(() => {
    // Load visit stats
    const raw = localStorage.getItem(VISIT_STATS_KEY);
    const existing = raw ? JSON.parse(raw) : { count: 0, lastVisit: null, totalTime: 0 };

    const newStats = {
      count: existing.count + 1,
      lastVisit: new Date().toISOString(),
      totalTime: existing.totalTime || 0,
    };

    localStorage.setItem(VISIT_STATS_KEY, JSON.stringify(newStats));

    // Get pages explored
    const visitedPages = localStorage.getItem(VISITED_PAGES_KEY);
    const pagesCount = visitedPages ? JSON.parse(visitedPages).length : 1;

    // Get streak
    const streakRaw = localStorage.getItem(STREAK_KEY);
    const streakData = streakRaw ? JSON.parse(streakRaw) : { currentStreak: 0 };

    setStats({
      visitCount: newStats.count,
      lastVisit: existing.lastVisit ? new Date(existing.lastVisit) : null,
      pagesExplored: pagesCount,
      streak: streakData.currentStreak || 0,
      totalTimeMinutes: Math.round((existing.totalTime || 0) / 60),
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

  const statItems = [
    showVisitCount && stats.visitCount > 1 && {
      icon: '👋',
      label: isArabic ? `زيارتك رقم ${stats.visitCount}` : `Visit #${stats.visitCount}`,
      color: brandCyan,
    },
    showStreak && stats.streak > 1 && {
      icon: '🔥',
      label: isArabic ? `${stats.streak} أيام متتالية` : `${stats.streak} day streak`,
      color: '#f59e0b',
    },
    showLastVisit && stats.lastVisit && {
      icon: '🕐',
      label: `${isArabic ? 'آخر زيارة: ' : 'Last: '}${formatLastVisit(stats.lastVisit)}`,
      color: brandPurple,
    },
    showProgress && stats.pagesExplored > 1 && {
      icon: '📚',
      label: isArabic ? `${stats.pagesExplored} صفحات` : `${stats.pagesExplored} pages`,
      color: brandPink,
    },
  ].filter(Boolean) as Array<{ icon: string; label: string; color: string }>;

  if (statItems.length === 0) return null;

  return (
    <div
      style={{
        display: variant === 'grid' ? 'grid' : 'flex',
        gridTemplateColumns: variant === 'grid' ? 'repeat(2, 1fr)' : undefined,
        gap: spacing[3],
        flexWrap: variant === 'horizontal' ? 'wrap' : undefined,
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      {statItems.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[2]}px ${spacing[3]}px`,
            background: `${item.color}10`,
            borderRadius: radius.lg,
            border: `1px solid ${item.color}15`,
          }}
        >
          <span style={{ fontSize: 16 }}>{item.icon}</span>
          <span
            style={{
              fontSize: typography.size.sm,
              color: colors.text.secondary,
              fontWeight: typography.weight.medium,
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
});

QuickStats.displayName = 'QuickStats';

/**
 * ReturningUserBanner - Enhanced banner for returning visitors
 */
export const ReturningUserBanner = memo(() => {
  const { isArabic } = useLanguage();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [bannerData, setBannerData] = useState({
    visitCount: 1,
    streak: 0,
    milestone: '',
  });

  useEffect(() => {
    const raw = localStorage.getItem(VISIT_STATS_KEY);
    const stats = raw ? JSON.parse(raw) : { count: 0 };
    const streakRaw = localStorage.getItem(STREAK_KEY);
    const streakData = streakRaw ? JSON.parse(streakRaw) : { currentStreak: 0 };

    // Determine milestone
    let milestone = '';
    if (stats.count === 5) milestone = isArabic ? 'زائر منتظم! 🌟' : 'Regular visitor! 🌟';
    else if (stats.count === 10) milestone = isArabic ? 'عضو نشط! 💎' : 'Active member! 💎';
    else if (stats.count === 25) milestone = isArabic ? 'متميز! 🏆' : 'Outstanding! 🏆';
    else if (streakData.currentStreak === 7) milestone = isArabic ? 'أسبوع كامل! 🔥' : 'Full week streak! 🔥';

    if ((stats.count > 1 && stats.count <= 10) || milestone) {
      setBannerData({
        visitCount: stats.count,
        streak: streakData.currentStreak || 0,
        milestone,
      });
      setIsVisible(true);

      // Auto-hide after 6 seconds
      const timer = setTimeout(() => setIsVisible(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [isArabic]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 420,
        width: 'calc(100% - 32px)',
        padding: spacing[4],
        background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
        border: `1px solid ${brandCyan}25`,
        borderRadius: radius.xl,
        boxShadow: `${shadows.xl}, 0 0 40px ${brandCyan}10`,
        zIndex: 50,
        animation: 'bannerSlideDown 0.5s ease-out',
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      <button
        onClick={() => setIsVisible(false)}
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
        ✕
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.lg,
            background: `${brandCyan}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}
        >
          🎉
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: 0,
              fontSize: typography.size.base,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
              marginBottom: 4,
            }}
          >
            {isArabic
              ? `مرحباً بعودتك! زيارتك رقم ${bannerData.visitCount}`
              : `Welcome back! Visit #${bannerData.visitCount}`}
          </p>
          {bannerData.milestone && (
            <p
              style={{
                margin: 0,
                fontSize: typography.size.sm,
                color: brandCyan,
                fontWeight: typography.weight.medium,
              }}
            >
              {bannerData.milestone}
            </p>
          )}
          {bannerData.streak > 1 && !bannerData.milestone && (
            <p
              style={{
                margin: 0,
                fontSize: typography.size.sm,
                color: colors.text.secondary,
              }}
            >
              🔥 {isArabic ? `${bannerData.streak} أيام متتالية` : `${bannerData.streak} day streak`}
            </p>
          )}
        </div>
      </div>

      {/* Quick action */}
      <button
        onClick={() => {
          setIsVisible(false);
          navigate('/assessment');
        }}
        style={{
          width: '100%',
          marginTop: spacing[3],
          padding: `${spacing[2]}px ${spacing[3]}px`,
          background: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}15)`,
          border: `1px solid ${brandCyan}30`,
          borderRadius: radius.lg,
          color: brandCyan,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[2],
        }}
      >
        <span>{isArabic ? 'تابع استكشافك' : 'Continue exploring'}</span>
        <span>{isArabic ? '←' : '→'}</span>
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

/**
 * EngagementStreak - Visual streak display widget
 */
export const EngagementStreak = memo(() => {
  const { isArabic } = useLanguage();
  const [streakData, setStreakData] = useState<StreakData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STREAK_KEY);
    if (saved) {
      setStreakData(JSON.parse(saved));
    }
  }, []);

  if (!streakData || streakData.currentStreak < 2) return null;

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const daysAr = ['أ', 'ا', 'ث', 'ر', 'خ', 'ج', 'س'];

  return (
    <div
      style={{
        padding: spacing[4],
        background: colors.surface.card,
        borderRadius: radius.xl,
        border: `1px solid ${brandCyan}20`,
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing[4],
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          <span style={{ fontSize: 24 }}>🔥</span>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: typography.size.lg,
                fontWeight: typography.weight.bold,
                color: colors.text.primary,
              }}
            >
              {streakData.currentStreak} {isArabic ? 'يوم' : 'days'}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: typography.size.xs,
                color: colors.text.muted,
              }}
            >
              {isArabic ? 'سلسلة حالية' : 'Current streak'}
            </p>
          </div>
        </div>
        <div
          style={{
            padding: `${spacing[1]}px ${spacing[3]}px`,
            background: `${brandPurple}15`,
            borderRadius: radius.full,
          }}
        >
          <span
            style={{
              fontSize: typography.size.xs,
              color: brandPurple,
              fontWeight: typography.weight.bold,
            }}
          >
            {isArabic ? `أفضل: ${streakData.longestStreak}` : `Best: ${streakData.longestStreak}`}
          </span>
        </div>
      </div>

      {/* Weekly activity */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: spacing[1],
        }}
      >
        {(isArabic ? daysAr : days).map((day, i) => {
          const hasActivity = (streakData.weeklyVisits[i] || 0) > 0;
          const isToday = new Date().getDay() === i;

          return (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: radius.md,
                  background: hasActivity
                    ? `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`
                    : colors.border.default,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  border: isToday ? `2px solid ${brandCyan}` : 'none',
                }}
              >
                {hasActivity && <span style={{ color: 'white', fontSize: 12 }}>✓</span>}
              </div>
              <span
                style={{
                  fontSize: typography.size.xs,
                  color: isToday ? brandCyan : colors.text.muted,
                  fontWeight: isToday ? typography.weight.bold : typography.weight.normal,
                }}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

EngagementStreak.displayName = 'EngagementStreak';

export default PersonalizedGreeting;
