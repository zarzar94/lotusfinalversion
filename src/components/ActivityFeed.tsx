/**
 * ActivityFeed - Chat-like activity log showing user progress
 * Displays real-time feedback on user actions and achievements
 */

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useGamification } from '../context/GamificationContext';
import { useLanguage } from '../context/LanguageContext';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import {
  brandCyan,
  brandPurple,
  brandPink,
  typography,
  spacing,
  radius,
  transitions,
  shadows,
  colors,
} from './styles';

// Activity types
interface Activity {
  id: string;
  type: 'achievement' | 'progress' | 'exploration' | 'action' | 'milestone' | 'tip';
  icon: string;
  messageAr: string;
  messageEn: string;
  timestamp: number;
  color: string;
  points?: number;
}

// Pre-defined tips to show periodically
const TIPS = [
  { icon: '💡', messageAr: 'انقر على مناطق الدماغ لاستكشاف وظائفها', messageEn: 'Click brain regions to explore their functions' },
  { icon: '🎧', messageAr: 'استخدم سماعات للحصول على أفضل تجربة صوتية', messageEn: 'Use headphones for the best audio experience' },
  { icon: '📊', messageAr: 'أكمل قائمة التحقق للحصول على تقييم شخصي', messageEn: 'Complete the checklist for a personalized assessment' },
  { icon: '🎮', messageAr: 'جرب ألعاب الفحص السمعي التفاعلية', messageEn: 'Try the interactive auditory screening games' },
  { icon: '📚', messageAr: 'استعرض الشرائح التعليمية لمعرفة المزيد', messageEn: 'Browse educational slides to learn more' },
];

const ActivityItem = memo(function ActivityItem({
  activity,
  isArabic,
  isNew,
  prefersReducedMotion,
}: {
  activity: Activity;
  isArabic: boolean;
  isNew: boolean;
  prefersReducedMotion: boolean;
}) {
  const message = isArabic ? activity.messageAr : activity.messageEn;
  const timeAgo = getTimeAgo(activity.timestamp, isArabic);

  return (
    <div
      style={{
        display: 'flex',
        gap: spacing[2.5],
        padding: spacing[2.5],
        background: isNew ? `${activity.color}12` : 'rgba(255,255,255,0.02)',
        borderRadius: radius.lg,
        border: `1px solid ${isNew ? `${activity.color}30` : colors.border.subtle}`,
        animation: isNew && !prefersReducedMotion ? 'activitySlideIn 0.4s ease-out' : undefined,
        transition: transitions.normal,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: radius.md,
          background: `${activity.color}18`,
          border: `1px solid ${activity.color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {activity.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: typography.size.sm,
            color: colors.text.primary,
            lineHeight: typography.lineHeight.snug,
            marginBottom: spacing[0.5],
          }}
        >
          {message}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            fontSize: typography.size.xs,
            color: colors.text.muted,
          }}
        >
          <span>{timeAgo}</span>
          {activity.points && (
            <span
              style={{
                color: activity.color,
                fontWeight: typography.weight.bold,
              }}
            >
              +{activity.points} {isArabic ? 'نقطة' : 'pts'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

function getTimeAgo(timestamp: number, isArabic: boolean): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 10) return isArabic ? 'الآن' : 'Just now';
  if (seconds < 60) return isArabic ? `منذ ${seconds} ثانية` : `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return isArabic ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  return isArabic ? `منذ ${hours} ساعة` : `${hours}h ago`;
}

export default function ActivityFeed() {
  const { state, recentUnlock, getUnlockedAchievements } = useGamification();
  const { isArabic, t } = useLanguage();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasNewActivity, setHasNewActivity] = useState(false);
  const lastStateRef = useRef(state);
  const tipIndexRef = useRef(0);
  const newActivityTimeoutRef = useRef<number | null>(null);

  // Add a new activity
  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 20)); // Keep last 20
    setHasNewActivity(true);

    if (typeof window === 'undefined') return;

    if (newActivityTimeoutRef.current !== null) {
      window.clearTimeout(newActivityTimeoutRef.current);
    }

    newActivityTimeoutRef.current = window.setTimeout(() => {
      newActivityTimeoutRef.current = null;
      setHasNewActivity(false);
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window === 'undefined') return;
      if (newActivityTimeoutRef.current !== null) {
        window.clearTimeout(newActivityTimeoutRef.current);
        newActivityTimeoutRef.current = null;
      }
    };
  }, []);

  // Track state changes and generate activities
  useEffect(() => {
    const prev = lastStateRef.current;

    // Check for new brain region exploration
    if (state.exploredBrainRegions.length > prev.exploredBrainRegions.length) {
      const newRegions = state.exploredBrainRegions.filter(
        r => !prev.exploredBrainRegions.includes(r)
      );
      newRegions.forEach(region => {
        addActivity({
          type: 'exploration',
          icon: '🧠',
          messageAr: `تم استكشاف منطقة جديدة في الدماغ`,
          messageEn: `Explored a new brain region`,
          color: brandCyan,
          points: 5,
        });
      });
    }

    // Check for slides viewed
    if (state.slidesViewed.length > prev.slidesViewed.length) {
      addActivity({
        type: 'action',
        icon: '📊',
        messageAr: `تمت مشاهدة شريحة تعليمية جديدة`,
        messageEn: `Viewed a new educational slide`,
        color: brandPurple,
      });
    }

    // Check for checklist completion
    if (state.checklistCompleted && !prev.checklistCompleted) {
      addActivity({
        type: 'milestone',
        icon: '✅',
        messageAr: `تم إكمال قائمة التحقق بنجاح!`,
        messageEn: `Successfully completed the checklist!`,
        color: '#22c55e',
        points: 40,
      });
    }

    // Check for games completed
    if (state.gamesCompleted.length > prev.gamesCompleted.length) {
      addActivity({
        type: 'action',
        icon: '🎮',
        messageAr: `تم إكمال اختبار في معمل الفحص`,
        messageEn: `Completed a test in the Sound Lab`,
        color: brandPink,
        points: 25,
      });
    }

    // Check for level up
    if (state.level > prev.level) {
      addActivity({
        type: 'milestone',
        icon: '🎉',
        messageAr: `تهانينا! وصلت للمستوى ${state.level}`,
        messageEn: `Congratulations! Reached Level ${state.level}`,
        color: '#f59e0b',
        points: 50,
      });
    }

    // Check for scroll progress milestones
    if (state.maxScrollProgress >= 50 && prev.maxScrollProgress < 50) {
      addActivity({
        type: 'progress',
        icon: '📜',
        messageAr: `تم تصفح 50% من المحتوى`,
        messageEn: `Scrolled through 50% of content`,
        color: brandCyan,
      });
    }

    if (state.maxScrollProgress >= 100 && prev.maxScrollProgress < 100) {
      addActivity({
        type: 'milestone',
        icon: '🏁',
        messageAr: `تم تصفح الصفحة بالكامل!`,
        messageEn: `Scrolled through the entire page!`,
        color: '#22c55e',
        points: 25,
      });
    }

    // Check for video watching
    if (state.videosWatched.length > prev.videosWatched.length) {
      addActivity({
        type: 'action',
        icon: '🎬',
        messageAr: `تمت مشاهدة فيديو تعليمي`,
        messageEn: `Watched an educational video`,
        color: brandPurple,
        points: 20,
      });
    }

    lastStateRef.current = state;
  }, [state, addActivity]);

  // Track achievement unlocks
  useEffect(() => {
    if (recentUnlock) {
      addActivity({
        type: 'achievement',
        icon: recentUnlock.icon,
        messageAr: `إنجاز جديد: ${recentUnlock.titleAr}`,
        messageEn: `Achievement: ${recentUnlock.title}`,
        color: brandCyan,
        points: recentUnlock.points,
      });
    }
  }, [recentUnlock, addActivity]);

  // Add periodic tips
  useEffect(() => {
    // Initial tip after 5 seconds
    const initialTimer = setTimeout(() => {
      const tip = TIPS[0];
      addActivity({
        type: 'tip',
        icon: tip.icon,
        messageAr: tip.messageAr,
        messageEn: tip.messageEn,
        color: '#f59e0b',
      });
      tipIndexRef.current = 1;
    }, 5000);

    // Subsequent tips every 60 seconds
    const tipInterval = setInterval(() => {
      if (tipIndexRef.current < TIPS.length) {
        const tip = TIPS[tipIndexRef.current];
        addActivity({
          type: 'tip',
          icon: tip.icon,
          messageAr: tip.messageAr,
          messageEn: tip.messageEn,
          color: '#f59e0b',
        });
        tipIndexRef.current++;
      }
    }, 60000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(tipInterval);
    };
  }, [addActivity]);

  // Add welcome message on mount
  useEffect(() => {
    addActivity({
      type: 'action',
      icon: '👋',
      messageAr: 'مرحباً بك في منصة Lotus × Bérard AIT',
      messageEn: 'Welcome to Lotus × Bérard AIT platform',
      color: brandCyan,
    });
  }, []);

  const unlockedCount = getUnlockedAchievements().length;

  return (
    <>
      <style>{`
        @keyframes activitySlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes activityPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes newActivityGlow {
          0%, 100% { box-shadow: ${shadows.lg}; }
          50% { box-shadow: 0 0 30px ${brandCyan}40, ${shadows.lg}; }
        }
        .activity-feed-btn:hover {
          transform: scale(1.05) !important;
        }
        .activity-feed-btn:active {
          transform: scale(0.98) !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .activity-feed,
          .activity-feed * {
            animation: none !important;
            transition: none !important;
          }
          .activity-feed-btn:hover,
          .activity-feed-btn:active {
            transform: none !important;
          }
        }
      `}</style>

      <div
        className="activity-feed"
        style={{
          position: 'fixed',
          bottom: spacing[4],
          [isArabic ? 'left' : 'right']: spacing[4],
          zIndex: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: isArabic ? 'flex-start' : 'flex-end',
          gap: spacing[2],
        }}
      >
        {/* Expanded Feed */}
        {isExpanded && (
          <div
            style={{
              width: 320,
              maxHeight: 400,
              background: 'linear-gradient(135deg, rgba(11,15,28,0.98) 0%, rgba(5,6,13,0.98) 100%)',
              border: `1px solid ${colors.border.emphasis}`,
               borderRadius: radius.xl,
               backdropFilter: 'blur(16px)',
               boxShadow: shadows['2xl'],
               overflow: 'hidden',
               animation: prefersReducedMotion ? undefined : 'activitySlideIn 0.3s ease-out',
             }}
           >
            {/* Header */}
            <div
              style={{
                padding: spacing[3],
                borderBottom: `1px solid ${colors.border.default}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(143,211,204,0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                <span style={{ fontSize: 18 }}>💬</span>
                <span
                  style={{
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.bold,
                    color: colors.text.primary,
                  }}
                >
                  {isArabic ? 'سجل النشاط' : 'Activity Feed'}
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: radius.md,
                  padding: `${spacing[1]}px ${spacing[2]}px`,
                  color: colors.text.muted,
                  cursor: 'pointer',
                  fontSize: typography.size.sm,
                  transition: transitions.fast,
                }}
              >
                ✕
              </button>
            </div>

            {/* Activity List */}
            <div
              style={{
                padding: spacing[2],
                maxHeight: 320,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[2],
              }}
            >
              {activities.length === 0 ? (
                <div
                  style={{
                    padding: spacing[6],
                    textAlign: 'center',
                    color: colors.text.muted,
                    fontSize: typography.size.sm,
                  }}
                >
                  {isArabic ? 'لا يوجد نشاط بعد...' : 'No activity yet...'}
                </div>
              ) : (
                activities.map((activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    isArabic={isArabic}
                    isNew={index === 0 && hasNewActivity}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          className="activity-feed-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[2.5]}px ${spacing[4]}px`,
            background: 'linear-gradient(135deg, rgba(11,15,28,0.98) 0%, rgba(5,6,13,0.98) 100%)',
            border: `1px solid ${hasNewActivity ? brandCyan : colors.border.emphasis}`,
            borderRadius: radius.full,
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            boxShadow: hasNewActivity ? `0 0 20px ${brandCyan}30, ${shadows.lg}` : shadows.lg,
            transition: prefersReducedMotion ? 'none' : transitions.bounce,
            animation:
              hasNewActivity && !prefersReducedMotion
                ? 'newActivityGlow 2s ease-in-out infinite'
                : undefined,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${brandCyan}30, ${brandPurple}30)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              position: 'relative',
            }}
          >
            💬
            {hasNewActivity && (
              <div
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: brandCyan,
                  border: '2px solid #05060d',
                  animation: prefersReducedMotion ? undefined : 'activityPulse 1s ease-in-out infinite',
                }}
              />
            )}
          </div>
          <div style={{ textAlign: isArabic ? 'right' : 'left' }}>
            <div
              style={{
                fontSize: typography.size.sm,
                fontWeight: typography.weight.bold,
                color: colors.text.primary,
              }}
            >
              {isArabic ? 'النشاط' : 'Activity'}
            </div>
            <div
              style={{
                fontSize: typography.size.xs,
                color: colors.text.secondary,
              }}
            >
              {activities.length} {isArabic ? 'حدث' : 'events'} • Lv.{state.level}
            </div>
          </div>
          <div
            style={{
              padding: `${spacing[1]}px ${spacing[2]}px`,
              background: `${brandCyan}20`,
              borderRadius: radius.full,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.bold,
              color: brandCyan,
            }}
          >
            {state.totalPoints} XP
          </div>
        </button>
      </div>
    </>
  );
}
