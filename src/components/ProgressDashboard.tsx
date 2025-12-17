import { useState, useMemo, useCallback } from 'react';
import { useGamification } from '../context/GamificationContext';
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
import { StarIcon, ChartIcon } from './Icons';

export default function ProgressDashboard() {
  const { state, getUnlockedAchievements, getNextAchievements } = useGamification();
  const { t, isArabic } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

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
  }, []);

  const css = useMemo(() => `
    @keyframes dashboardPulse {
      0%, 100% { box-shadow: ${shadows.glow.cyan}; }
      50% { box-shadow: 0 0 25px rgba(143,211,204,0.4); }
    }
    @keyframes progressFill {
      from { width: 0; }
    }
    .progress-dashboard {
      transition: ${transitions.bounce};
    }
    .progress-dashboard:hover {
      transform: scale(1.02);
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
  `, []);

  return (
    <>
      <style>{css}</style>
      <div
        className="progress-dashboard"
        style={{
          position: 'fixed',
          top: spacing[20],
          [isArabic ? 'right' : 'left']: spacing[4],
          zIndex: 60,
          background: 'linear-gradient(135deg, rgba(11,15,28,0.95) 0%, rgba(5,6,13,0.95) 100%)',
          border: `1px solid ${colors.border.emphasis}`,
          borderRadius: radius.xl,
          backdropFilter: 'blur(12px)',
          overflow: 'hidden',
          width: isExpanded ? 280 : 56,
          cursor: 'pointer',
          boxShadow: shadows.lg,
        }}
        onClick={toggleExpand}
      >
        {/* Collapsed view - just icon */}
        {!isExpanded && (
          <div style={{
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            {/* Circular progress */}
            <svg width={48} height={48} style={{ position: 'absolute' }}>
              <circle
                cx={24}
                cy={24}
                r={20}
                fill="none"
                stroke={colors.border.default}
                strokeWidth={3}
              />
              <circle
                cx={24}
                cy={24}
                r={20}
                fill="none"
                stroke={brandCyan}
                strokeWidth={3}
                strokeDasharray={`${progressPercent * 1.26} 126`}
                strokeLinecap="round"
                transform="rotate(-90 24 24)"
                style={{ transition: transitions.slow }}
              />
            </svg>
            <span style={{ fontSize: typography.size.lg, zIndex: 1 }}>
              Lv.{state.level}
            </span>
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
    </>
  );
}
