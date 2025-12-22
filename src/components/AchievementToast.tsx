import { useEffect, useState, useMemo } from 'react';
import { useGamification, type Achievement } from '../context/GamificationContext';
import { useLanguage } from '../context/LanguageContext';
import { positionInlineStart } from '../utils/rtl';
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
  const { isArabic, t } = useLanguage();
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
        filter: blur(8px);
      }
      to {
        transform: translateX(0) scale(1);
        opacity: 1;
        filter: blur(0);
      }
    }
    @keyframes achievementSlideOut {
      from {
        transform: translateX(0) scale(1);
        opacity: 1;
        filter: blur(0);
      }
      to {
        transform: translateX(${isArabic ? '-120%' : '120%'}) scale(0.8);
        opacity: 0;
        filter: blur(8px);
      }
    }
    @keyframes achievementGlow {
      0%, 100% {
        box-shadow: 0 0 30px ${brandCyan}30, 0 0 60px ${brandCyan}15, ${shadows.lg};
      }
      50% {
        box-shadow: 0 0 50px ${brandCyan}50, 0 0 100px ${brandCyan}25, ${shadows.lg};
      }
    }
    @keyframes achievementBounce {
      0%, 100% { transform: scale(1); }
      30% { transform: scale(1.2); }
      50% { transform: scale(0.95); }
      70% { transform: scale(1.05); }
    }
    @keyframes confetti {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes toastScanLine {
      0% { left: -20%; opacity: 0; }
      10% { opacity: 0.8; }
      90% { opacity: 0.8; }
      100% { left: 120%; opacity: 0; }
    }
    @keyframes toastHudPulse {
      0%, 100% { opacity: 0.5; box-shadow: 0 0 4px ${brandCyan}; }
      50% { opacity: 1; box-shadow: 0 0 10px ${brandCyan}; }
    }
    @keyframes energyRing {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(1.5); opacity: 0; }
    }
    @keyframes dataFlow {
      0% { transform: translateY(100%); opacity: 0; }
      10% { opacity: 0.8; }
      90% { opacity: 0.8; }
      100% { transform: translateY(-100%); opacity: 0; }
    }
    .achievement-toast {
      animation: ${isExiting ? 'achievementSlideOut' : 'achievementSlideIn'} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    .achievement-icon {
      animation: achievementBounce 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s;
    }
    .achievement-glow {
      animation: achievementGlow 2.5s ease-in-out infinite;
    }
    .points-badge {
      background: linear-gradient(90deg, ${brandCyan}50, ${brandPurple}50, ${brandPink}50, ${brandCyan}50);
      background-size: 300% 100%;
      animation: shimmer 2s linear infinite;
    }
    .toast-scan-line {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 60px;
      background: linear-gradient(90deg, transparent, ${brandCyan}40, transparent);
      animation: toastScanLine 2.5s linear infinite;
      pointer-events: none;
    }
    .toast-hud-corner {
      position: absolute;
      width: 14px;
      height: 14px;
      border-color: ${brandCyan};
      border-style: solid;
      animation: toastHudPulse 3s ease-in-out infinite;
    }
    .toast-energy-ring {
      position: absolute;
      top: 50%;
      left: 28px;
      width: 70px;
      height: 70px;
      border: 2px solid ${brandCyan}40;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: energyRing 1.5s ease-out infinite;
      pointer-events: none;
    }
    .toast-data-particle {
      position: absolute;
      width: 2px;
      height: 6px;
      background: ${brandCyan};
      opacity: 0.5;
      animation: dataFlow 2s linear infinite;
    }
  `, [isArabic, isExiting]);

  if (!isVisible || !recentUnlock) return null;

  const categoryColor = {
    exploration: brandCyan,
    learning: brandPurple,
    mastery: '#f59e0b',
    engagement: brandPink,
    clinical: '#22c55e',
  }[recentUnlock.category];

  return (
    <>
      <style>{css}</style>
      <div
        className="achievement-toast achievement-glow"
        style={{
          position: 'fixed',
          top: spacing[20],
          ...positionInlineStart(isArabic, spacing[4]),
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[4],
          padding: `${spacing[5]}px ${spacing[5]}px ${spacing[5]}px ${spacing[4]}px`,
          background: 'linear-gradient(135deg, rgba(0,5,15,0.98) 0%, rgba(10,20,40,0.95) 100%)',
          border: `1px solid ${categoryColor}50`,
          borderRadius: 6,
          minWidth: 300,
          maxWidth: 380,
          cursor: 'pointer',
          backdropFilter: 'blur(20px)',
        }}
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsVisible(false);
            clearRecentUnlock();
          }, 400);
        }}
      >
        {/* HUD Corners */}
        <div className="toast-hud-corner" style={{ top: 6, left: 6, borderWidth: '2px 0 0 2px' }} />
        <div className="toast-hud-corner" style={{ top: 6, right: 6, borderWidth: '2px 2px 0 0' }} />
        <div className="toast-hud-corner" style={{ bottom: 6, left: 6, borderWidth: '0 0 2px 2px' }} />
        <div className="toast-hud-corner" style={{ bottom: 6, right: 6, borderWidth: '0 2px 2px 0' }} />

        {/* Scan Line Effect */}
        <div className="toast-scan-line" />

        {/* Data Stream Particles */}
        <div className="toast-data-particle" style={{ right: '15%', animationDelay: '0s' }} />
        <div className="toast-data-particle" style={{ right: '35%', animationDelay: '0.5s' }} />
        <div className="toast-data-particle" style={{ right: '55%', animationDelay: '1s' }} />

        {/* Confetti particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 6,
              height: 6,
              background: [brandCyan, brandPurple, brandPink, '#f59e0b', '#22c55e', '#fff', brandCyan, brandPurple][i],
              borderRadius: radius.full,
              animation: `confetti 1.2s ease-out ${i * 0.08}s forwards`,
              transform: `rotate(${i * 45}deg) translateX(${35 + i * 8}px)`,
              boxShadow: `0 0 6px ${[brandCyan, brandPurple, brandPink, '#f59e0b', '#22c55e', '#fff', brandCyan, brandPurple][i]}`,
            }}
          />
        ))}

        {/* Energy Ring Effect */}
        <div className="toast-energy-ring" />
        <div className="toast-energy-ring" style={{ animationDelay: '0.5s' }} />

        {/* Icon */}
        <div
          className="achievement-icon"
          style={{
            width: 60,
            height: 60,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${categoryColor}25, ${categoryColor}10)`,
            border: `2px solid ${categoryColor}60`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            flexShrink: 0,
            boxShadow: `0 0 25px ${categoryColor}30, inset 0 0 20px ${categoryColor}10`,
            position: 'relative',
          }}
        >
          <span style={{ filter: `drop-shadow(0 0 10px ${categoryColor})` }}>
            {recentUnlock.icon}
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header with status indicator */}
          <div style={{
            fontSize: 10,
            fontWeight: 800,
            color: categoryColor,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            marginBottom: spacing[1.5],
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textShadow: `0 0 10px ${categoryColor}60`,
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: categoryColor,
              boxShadow: `0 0 8px ${categoryColor}`,
              animation: 'toastHudPulse 1s ease-in-out infinite',
            }} />
            {isArabic ? 'إنجاز جديد!' : 'Achievement Unlocked!'}
          </div>

          {/* Title */}
          <div style={{
            fontSize: typography.size.lg,
            fontWeight: typography.weight.black,
            color: colors.text.primary,
            marginBottom: spacing[1],
            lineHeight: typography.lineHeight.tight,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}>
            {isArabic ? t(recentUnlock.titleAr, recentUnlock.title) : recentUnlock.title}
          </div>

          {/* Description */}
          <div style={{
            fontSize: typography.size.sm,
            color: colors.text.secondary,
            marginBottom: spacing[2.5],
            lineHeight: 1.4,
          }}>
            {isArabic ? t(recentUnlock.descriptionAr, recentUnlock.description) : recentUnlock.description}
          </div>

          {/* Points badge with XP display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              className="points-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[1.5],
                padding: `${spacing[1.5]}px ${spacing[3]}px`,
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 900,
                color: colors.text.primary,
                border: `1px solid ${brandCyan}30`,
              }}
            >
              <span style={{ color: brandCyan, textShadow: `0 0 8px ${brandCyan}` }}>+{recentUnlock.points}</span>
              <span style={{ opacity: 0.7 }}>{isArabic ? 'نقطة' : 'XP'}</span>
            </div>

            {/* Category badge */}
            <div style={{
              fontSize: 9,
              fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}>
              [{recentUnlock.category}]
            </div>
          </div>
        </div>

        {/* Level indicator with HUD styling */}
        <div style={{
          position: 'absolute',
          top: -10,
          [isArabic ? 'left' : 'right']: spacing[4],
          padding: `${spacing[1.5]}px ${spacing[3]}px`,
          background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 900,
          color: '#fff',
          letterSpacing: 0.5,
          boxShadow: `0 0 15px ${brandCyan}50, 0 4px 10px rgba(0,0,0,0.3)`,
          border: `1px solid ${brandCyan}60`,
        }}>
          LV.{state.level}
        </div>

        {/* System status footer */}
        <div style={{
          position: 'absolute',
          bottom: 8,
          left: 12,
          right: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            fontSize: 8,
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: 1,
          }}>
            LOTUS // ACHIEVEMENT SYS
          </div>
          <div style={{
            fontSize: 8,
            fontFamily: 'monospace',
            color: '#22c55e',
            letterSpacing: 1,
          }}>
            ✓ UNLOCKED
          </div>
        </div>
      </div>
    </>
  );
}
