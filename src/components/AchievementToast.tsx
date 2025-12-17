import { useEffect, useState, useMemo } from 'react';
import { useGamification, type Achievement } from '../context/GamificationContext';
import { useLanguage } from '../context/LanguageContext';
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

export default function AchievementToast() {
  const { recentUnlock, clearRecentUnlock, state } = useGamification();
  const { isArabic } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (recentUnlock) {
      setIsVisible(true);
      setIsExiting(false);

      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          clearRecentUnlock();
        }, 400);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [recentUnlock, clearRecentUnlock]);

  const css = useMemo(() => `
    @keyframes achievementSlideIn {
      from {
        transform: translateX(${isArabic ? '-120%' : '120%'}) scale(0.8);
        opacity: 0;
      }
      to {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
    }
    @keyframes achievementSlideOut {
      from {
        transform: translateX(0) scale(1);
        opacity: 1;
      }
      to {
        transform: translateX(${isArabic ? '-120%' : '120%'}) scale(0.8);
        opacity: 0;
      }
    }
    @keyframes achievementGlow {
      0%, 100% { box-shadow: ${shadows.glow.cyan}, ${shadows.lg}; }
      50% { box-shadow: 0 0 40px rgba(143,211,204,0.5), ${shadows.lg}; }
    }
    @keyframes achievementBounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    @keyframes confetti {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .achievement-toast {
      animation: ${isExiting ? 'achievementSlideOut' : 'achievementSlideIn'} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    .achievement-icon {
      animation: achievementBounce 0.6s ease-in-out 0.3s;
    }
    .achievement-glow {
      animation: achievementGlow 2s ease-in-out infinite;
    }
    .points-badge {
      background: linear-gradient(90deg, ${brandCyan}40, ${brandPurple}40, ${brandCyan}40);
      background-size: 200% 100%;
      animation: shimmer 2s linear infinite;
    }
  `, [isArabic, isExiting]);

  if (!isVisible || !recentUnlock) return null;

  const categoryColor = {
    exploration: brandCyan,
    learning: brandPurple,
    mastery: '#f59e0b',
    engagement: brandPink,
  }[recentUnlock.category];

  return (
    <>
      <style>{css}</style>
      <div
        className="achievement-toast achievement-glow"
        style={{
          position: 'fixed',
          top: spacing[20],
          [isArabic ? 'left' : 'right']: spacing[4],
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[3],
          padding: spacing[4],
          background: 'linear-gradient(135deg, rgba(11,15,28,0.98) 0%, rgba(5,6,13,0.98) 100%)',
          border: `2px solid ${categoryColor}50`,
          borderRadius: radius.xl,
          minWidth: 280,
          maxWidth: 360,
          cursor: 'pointer',
        }}
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsVisible(false);
            clearRecentUnlock();
          }, 400);
        }}
      >
        {/* Confetti particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 8,
              height: 8,
              background: [brandCyan, brandPurple, brandPink, '#f59e0b', '#22c55e', '#fff'][i],
              borderRadius: radius.full,
              animation: `confetti 1s ease-out ${i * 0.1}s forwards`,
              transform: `rotate(${i * 60}deg) translateX(${30 + i * 10}px)`,
            }}
          />
        ))}

        {/* Icon */}
        <div
          className="achievement-icon"
          style={{
            width: 56,
            height: 56,
            borderRadius: radius.lg,
            background: `${categoryColor}20`,
            border: `2px solid ${categoryColor}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            flexShrink: 0,
          }}
        >
          {recentUnlock.icon}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{
            fontSize: typography.size.xs,
            fontWeight: typography.weight.extrabold,
            color: categoryColor,
            textTransform: 'uppercase',
            letterSpacing: typography.letterSpacing.wider,
            marginBottom: spacing[1],
          }}>
            {isArabic ? 'إنجاز جديد!' : 'Achievement Unlocked!'}
          </div>

          {/* Title */}
          <div style={{
            fontSize: typography.size.lg,
            fontWeight: typography.weight.black,
            color: colors.text.primary,
            marginBottom: spacing[1],
            lineHeight: typography.lineHeight.tight,
          }}>
            {isArabic ? recentUnlock.titleAr : recentUnlock.title}
          </div>

          {/* Description */}
          <div style={{
            fontSize: typography.size.sm,
            color: colors.text.secondary,
            marginBottom: spacing[2],
          }}>
            {isArabic ? recentUnlock.descriptionAr : recentUnlock.description}
          </div>

          {/* Points badge */}
          <div
            className="points-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing[1],
              padding: `${spacing[1]}px ${spacing[2]}px`,
              borderRadius: radius.full,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.extrabold,
              color: colors.text.primary,
            }}
          >
            +{recentUnlock.points} {isArabic ? 'نقطة' : 'pts'}
          </div>
        </div>

        {/* Level indicator */}
        <div style={{
          position: 'absolute',
          top: -8,
          [isArabic ? 'left' : 'right']: spacing[3],
          padding: `${spacing[1]}px ${spacing[2.5]}px`,
          background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
          borderRadius: radius.full,
          fontSize: typography.size.xs,
          fontWeight: typography.weight.extrabold,
          color: colors.surface.base,
        }}>
          Lv.{state.level}
        </div>
      </div>
    </>
  );
}
