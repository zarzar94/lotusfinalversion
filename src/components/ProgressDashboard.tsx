import { useState, useMemo, useCallback, useEffect } from 'react';
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

export default function ProgressDashboard() {
  const { state, getUnlockedAchievements, getNextAchievements } = useGamification();
  const { t, isArabic } = useLanguage();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAttention, setShowAttention] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-pulse attention for first 10 seconds if user hasn't interacted
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAttention(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const unlockedCount = getUnlockedAchievements().length;
  const totalAchievements = state.achievements.length;
  const progressPercent = Math.round((unlockedCount / totalAchievements) * 100);

  // Level progress
  const levelThresholds = [0, 50, 150, 300, 500, 999];
  const currentThreshold = levelThresholds[state.level - 1] || 0;
  const nextThreshold = levelThresholds[state.level] || levelThresholds[levelThresholds.length - 1];
  const levelProgress = ((state.totalPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

  const nextAchievements = getNextAchievements();

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
    setHasInteracted(true);
    setShowAttention(false);
  }, []);

  const css = useMemo(() => `
    @keyframes dashboardPulse {
      0%, 100% { box-shadow: ${shadows.glow.cyan}; }
      50% { box-shadow: 0 0 25px rgba(143,211,204,0.4); }
    }
    @keyframes progressFill {
      from { width: 0; }
    }
    @keyframes attentionBounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }
    @keyframes attentionGlow {
      0%, 100% {
        box-shadow: 0 0 20px ${brandCyan}40, ${shadows.lg};
        border-color: ${brandCyan};
      }
      50% {
        box-shadow: 0 0 40px ${brandCyan}60, ${shadows.lg};
        border-color: ${brandPurple};
      }
    }
    @keyframes labelSlideIn {
      from { opacity: 0; transform: translateX(${isArabic ? '10px' : '-10px'}); }
      to { opacity: 1; transform: translateX(0); }
    }
    .progress-dashboard {
      transition: ${transitions.bounce};
    }
    .progress-dashboard:hover {
      transform: scale(1.05) !important;
    }
    .progress-dashboard:active {
      transform: scale(0.98) !important;
    }
    .progress-bar-fill {
      animation: progressFill 1s ease-out;
    }
    .achievement-preview {
      transition: ${transitions.fast};
    }
    .achievement-preview:hover {
      background: rgba(255,255,255,0.1) !important;
      transform: scale(1.05);
    }
    .attention-label {
      animation: labelSlideIn 0.5s ease-out 1s backwards;
    }
    @media (prefers-reduced-motion: reduce) {
      .progress-dashboard,
      .progress-dashboard * {
        animation: none !important;
        transition: none !important;
      }
      .progress-dashboard:hover,
      .progress-dashboard:active,
      .achievement-preview:hover {
        transform: none !important;
      }
    }
  `, [isArabic]);

  return (
    <>
      <style>{css}</style>
      <div
        className="progress-dashboard"
        style={{
          position: 'fixed',
          top: spacing[20],
          [isArabic ? 'right' : 'left']: spacing[4],
          zIndex: 70,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          flexDirection: isArabic ? 'row-reverse' : 'row',
        }}
      >
        {/* Main Dashboard Button */}
        <div
          onClick={toggleExpand}
          style={{
            background: 'linear-gradient(135deg, rgba(11,15,28,0.98) 0%, rgba(5,6,13,0.98) 100%)',
            border: `2px solid ${showAttention && !hasInteracted ? brandCyan : colors.border.emphasis}`,
            borderRadius: radius.xl,
            backdropFilter: 'blur(16px)',
            overflow: 'hidden',
            width: isExpanded ? 300 : 64,
            cursor: 'pointer',
            boxShadow: shadows.lg,
            animation:
              showAttention && !hasInteracted && !prefersReducedMotion
                ? 'attentionGlow 2s ease-in-out infinite'
                : undefined,
            transition: prefersReducedMotion
              ? 'none'
              : `width ${transitions.bounce}, border-color 0.3s ease`,
          }}
        >
          {/* Collapsed view - enhanced */}
          {!isExpanded && (
            <div style={{
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              animation:
                showAttention && !hasInteracted && !prefersReducedMotion
                  ? 'attentionBounce 2s ease-in-out infinite'
                  : undefined,
            }}>
              {/* Circular progress */}
              <svg width={56} height={56} style={{ position: 'absolute' }}>
                {/* Background circle */}
                <circle
                  cx={28}
                  cy={28}
                  r={24}
                  fill="none"
                  stroke={colors.border.default}
                  strokeWidth={3}
                />
                {/* Progress circle */}
                <circle
                  cx={28}
                  cy={28}
                  r={24}
                  fill="none"
                  stroke={`url(#progressGradient)`}
                  strokeWidth={4}
                  strokeDasharray={`${progressPercent * 1.51} 151`}
                  strokeLinecap="round"
                  transform="rotate(-90 28 28)"
                  style={{ transition: prefersReducedMotion ? 'none' : transitions.slow }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={brandCyan} />
                    <stop offset="100%" stopColor={brandPurple} />
                  </linearGradient>
                </defs>
              </svg>
              {/* Level badge */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 1,
              }}>
                <span style={{
                  fontSize: typography.size.xl,
                  fontWeight: typography.weight.black,
                  background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1,
                }}>
                  {state.level}
                </span>
                <span style={{
                  fontSize: 9,
                  fontWeight: typography.weight.bold,
                  color: colors.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}>
                  LVL
                </span>
              </div>
              {/* XP indicator */}
              <div style={{
                position: 'absolute',
                bottom: 2,
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '2px 8px',
                background: `${brandCyan}25`,
                borderRadius: radius.full,
                fontSize: 9,
                fontWeight: typography.weight.bold,
                color: brandCyan,
              }}>
                {state.totalPoints}XP
              </div>
            </div>
          )}

        {/* Expanded view */}
        {isExpanded && (
          <div style={{ padding: spacing[4] }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: spacing[4],
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.lg,
                  background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: typography.size.lg,
                  fontWeight: typography.weight.black,
                  color: colors.surface.base,
                }}>
                  {state.level}
                </div>
                <div>
                  <div style={{
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.extrabold,
                    color: colors.text.primary,
                  }}>
                    {isArabic ? `المستوى ${state.level}` : `Level ${state.level}`}
                  </div>
                  <div style={{
                    fontSize: typography.size.xs,
                    color: colors.text.secondary,
                  }}>
                    {state.totalPoints} {isArabic ? 'نقطة' : 'pts'}
                  </div>
                </div>
              </div>

              {/* Close hint */}
              <div style={{
                fontSize: typography.size.xs,
                color: colors.text.muted,
              }}>
                ✕
              </div>
            </div>

            {/* Level progress bar */}
            <div style={{ marginBottom: spacing[4] }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: typography.size.xs,
                color: colors.text.secondary,
                marginBottom: spacing[1],
              }}>
                <span>{isArabic ? 'التقدم للمستوى التالي' : 'Next Level'}</span>
                <span>{nextThreshold - state.totalPoints} {isArabic ? 'نقطة متبقية' : 'pts left'}</span>
              </div>
              <div style={{
                height: 6,
                background: colors.border.default,
                borderRadius: radius.full,
                overflow: 'hidden',
              }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    height: '100%',
                    width: `${Math.min(100, levelProgress)}%`,
                    background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
                    borderRadius: radius.full,
                  }}
                />
              </div>
            </div>

            {/* Achievements progress */}
            <div style={{
              padding: spacing[3],
              background: 'rgba(143,211,204,0.08)',
              borderRadius: radius.lg,
              marginBottom: spacing[3],
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: spacing[2],
              }}>
                <span style={{
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.bold,
                  color: colors.text.primary,
                }}>
                  {isArabic ? 'الإنجازات' : 'Achievements'}
                </span>
                <span style={{
                  fontSize: typography.size.xs,
                  color: brandCyan,
                  fontWeight: typography.weight.extrabold,
                }}>
                  {unlockedCount}/{totalAchievements}
                </span>
              </div>

              {/* Achievement icons row */}
              <div style={{
                display: 'flex',
                gap: spacing[1],
                flexWrap: 'wrap',
              }}>
                {state.achievements.slice(0, 8).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="achievement-preview"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: radius.sm,
                      background: achievement.unlocked
                        ? 'rgba(143,211,204,0.2)'
                        : 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: typography.size.sm,
                      opacity: achievement.unlocked ? 1 : 0.4,
                      filter: achievement.unlocked ? 'none' : 'grayscale(1)',
                    }}
                    title={isArabic ? achievement.titleAr : achievement.title}
                  >
                    {achievement.icon}
                  </div>
                ))}
                {totalAchievements > 8 && (
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: radius.sm,
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: typography.size.xs,
                    color: colors.text.muted,
                  }}>
                    +{totalAchievements - 8}
                  </div>
                )}
              </div>
            </div>

            {/* Next achievements */}
            {nextAchievements.length > 0 && (
              <div>
                <div style={{
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color: colors.text.secondary,
                  marginBottom: spacing[2],
                  textTransform: 'uppercase',
                  letterSpacing: typography.letterSpacing.wide,
                }}>
                  {isArabic ? 'التالي' : 'Up Next'}
                </div>
                {nextAchievements.slice(0, 2).map((achievement) => (
                  <div
                    key={achievement.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[2],
                      padding: spacing[2],
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: radius.md,
                      marginBottom: spacing[1],
                    }}
                  >
                    <span style={{ fontSize: typography.size.lg, opacity: 0.5 }}>
                      {achievement.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: typography.size.xs,
                        fontWeight: typography.weight.bold,
                        color: colors.text.primary,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {isArabic ? achievement.titleAr : achievement.title}
                      </div>
                      <div style={{
                        fontSize: 10,
                        color: colors.text.muted,
                      }}>
                        +{achievement.points} {isArabic ? 'نقطة' : 'pts'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div>

        {/* Attention Label - shows when collapsed and not interacted */}
        {!isExpanded && showAttention && !hasInteracted && (
          <div
            className="attention-label"
            style={{
              padding: `${spacing[2]}px ${spacing[3]}px`,
              background: 'linear-gradient(135deg, rgba(11,15,28,0.95) 0%, rgba(5,6,13,0.95) 100%)',
              border: `1px solid ${brandCyan}40`,
              borderRadius: radius.lg,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.bold,
              color: brandCyan,
              whiteSpace: 'nowrap',
              boxShadow: shadows.md,
            }}
          >
            {isArabic ? '👆 انقر لمشاهدة تقدمك' : '👆 Click to see progress'}
          </div>
        )}
      </div>
    </>
  );
}
