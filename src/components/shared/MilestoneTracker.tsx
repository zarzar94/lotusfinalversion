/**
 * MilestoneTracker - Treatment milestone visualization components
 * Shows progress through clinical treatment phases with achievement badges
 */

import { memo, useMemo } from 'react';
import {
  brandCyan,
  brandPurple,
  brandPink,
  colors,
  typography,
  spacing,
  radius,
  transitions,
} from '../styles';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Milestone {
  id: string;
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  icon: string;
  achieved: boolean;
  achievedAt?: number;
  points?: number;
  category?: 'clinical' | 'engagement' | 'mastery' | 'exploration';
}

interface MilestoneTrackerProps {
  milestones: Milestone[];
  currentMilestone?: number;
  isArabic?: boolean;
  variant?: 'horizontal' | 'vertical' | 'compact';
  showDescriptions?: boolean;
  title?: string;
  titleAr?: string;
}

interface AchievementBadgeProps {
  icon: string;
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  points?: number;
  unlocked: boolean;
  unlockedAt?: number;
  category?: string;
  isArabic?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onClick?: () => void;
}

interface AchievementGridProps {
  achievements: Milestone[];
  isArabic?: boolean;
  columns?: number;
  showLocked?: boolean;
  title?: string;
  titleAr?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// MILESTONE TRACKER
// ═══════════════════════════════════════════════════════════════════════════

export const MilestoneTracker = memo(({
  milestones,
  currentMilestone,
  isArabic = false,
  variant = 'horizontal',
  showDescriptions = false,
  title,
  titleAr,
}: MilestoneTrackerProps) => {
  const css = `
    @keyframes milestoneUnlock {
      0% { transform: scale(0.8); opacity: 0; }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes milestoneGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(143,211,204,0.4); }
      50% { box-shadow: 0 0 20px 5px rgba(143,211,204,0.3); }
    }
    .milestone-achieved {
      animation: milestoneUnlock 0.5s ease-out;
    }
    .milestone-current {
      animation: milestoneGlow 2s ease-in-out infinite;
    }
  `;

  const completedCount = milestones.filter(m => m.achieved).length;
  const progressPercent = (completedCount / milestones.length) * 100;

  if (variant === 'compact') {
    return (
      <div>
        <style>{css}</style>
        {(title || titleAr) && (
          <h4 style={{
            margin: `0 0 ${spacing[3]}px`,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
          }}>
            {isArabic ? titleAr : title}
          </h4>
        )}
        <div style={{ display: 'flex', gap: spacing[2], flexWrap: 'wrap' }}>
          {milestones.map((milestone, i) => (
            <div
              key={milestone.id}
              className={milestone.achieved ? 'milestone-achieved' : ''}
              style={{
                padding: `${spacing[2]}px ${spacing[3]}px`,
                background: milestone.achieved
                  ? `${brandCyan}15`
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${milestone.achieved ? brandCyan : colors.border.subtle}30`,
                borderRadius: radius.full,
                display: 'flex',
                alignItems: 'center',
                gap: spacing[1.5],
                opacity: milestone.achieved ? 1 : 0.5,
                transition: transitions.fast,
              }}
              title={isArabic ? milestone.titleAr || milestone.title : milestone.title}
            >
              <span style={{ fontSize: 14 }}>{milestone.icon}</span>
              <span
                style={{
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.semibold,
                  color: milestone.achieved ? brandCyan : colors.text.muted,
                }}
              >
                {isArabic ? milestone.titleAr || milestone.title : milestone.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div>
        <style>{css}</style>
        {(title || titleAr) && (
          <h4 style={{
            margin: `0 0 ${spacing[4]}px`,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
          }}>
            {isArabic ? titleAr : title}
          </h4>
        )}
        <div style={{ position: 'relative', paddingLeft: isArabic ? 0 : spacing[8], paddingRight: isArabic ? spacing[8] : 0 }}>
          {/* Progress line */}
          <div style={{
            position: 'absolute',
            [isArabic ? 'right' : 'left']: 19,
            top: 0,
            bottom: 0,
            width: 2,
            background: colors.border.default,
          }}>
            <div style={{
              width: '100%',
              height: `${progressPercent}%`,
              background: `linear-gradient(180deg, ${brandCyan}, ${brandPurple})`,
              transition: transitions.slow,
            }} />
          </div>

          {/* Milestones */}
          {milestones.map((milestone, i) => {
            const isCurrent = currentMilestone === i;
            return (
              <div
                key={milestone.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing[3],
                  marginBottom: i < milestones.length - 1 ? spacing[5] : 0,
                  flexDirection: isArabic ? 'row-reverse' : 'row',
                }}
              >
                {/* Milestone marker */}
                <div
                  className={`${milestone.achieved ? 'milestone-achieved' : ''} ${isCurrent ? 'milestone-current' : ''}`}
                  style={{
                    position: 'absolute',
                    [isArabic ? 'right' : 'left']: 0,
                    width: 40,
                    height: 40,
                    borderRadius: radius.lg,
                    background: milestone.achieved
                      ? `linear-gradient(135deg, ${brandCyan}30, ${brandPurple}30)`
                      : colors.surface.card,
                    border: `2px solid ${milestone.achieved ? brandCyan : colors.border.default}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    opacity: milestone.achieved ? 1 : 0.5,
                    transition: transitions.normal,
                  }}
                >
                  {milestone.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.bold,
                    color: milestone.achieved ? colors.text.primary : colors.text.muted,
                    marginBottom: spacing[1],
                  }}>
                    {isArabic ? milestone.titleAr || milestone.title : milestone.title}
                  </div>
                  {showDescriptions && milestone.description && (
                    <div style={{
                      fontSize: typography.size.xs,
                      color: colors.text.secondary,
                      lineHeight: typography.lineHeight.relaxed,
                    }}>
                      {isArabic ? milestone.descriptionAr || milestone.description : milestone.description}
                    </div>
                  )}
                  {milestone.achieved && milestone.achievedAt && (
                    <div style={{
                      fontSize: typography.size.xs,
                      color: brandCyan,
                      marginTop: spacing[1],
                    }}>
                      {new Date(milestone.achievedAt).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div>
      <style>{css}</style>
      {(title || titleAr) && (
        <h4 style={{
          margin: `0 0 ${spacing[3]}px`,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
        }}>
          {isArabic ? titleAr : title}
        </h4>
      )}

      {/* Progress bar */}
      <div style={{
        height: 4,
        background: colors.border.default,
        borderRadius: radius.full,
        marginBottom: spacing[4],
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${progressPercent}%`,
          background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
          borderRadius: radius.full,
          transition: transitions.slow,
        }} />
      </div>

      {/* Milestone markers */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
      }}>
        {milestones.map((milestone, i) => {
          const isCurrent = currentMilestone === i;
          return (
            <div
              key={milestone.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing[2],
                flex: 1,
              }}
            >
              <div
                className={`${milestone.achieved ? 'milestone-achieved' : ''} ${isCurrent ? 'milestone-current' : ''}`}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radius.lg,
                  background: milestone.achieved
                    ? `linear-gradient(135deg, ${brandCyan}25, ${brandPurple}25)`
                    : colors.surface.card,
                  border: `2px solid ${milestone.achieved ? brandCyan : colors.border.default}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  opacity: milestone.achieved ? 1 : 0.4,
                  filter: milestone.achieved ? 'none' : 'grayscale(0.8)',
                  transition: transitions.normal,
                }}
              >
                {milestone.icon}
              </div>
              <span style={{
                fontSize: typography.size.xs,
                fontWeight: typography.weight.semibold,
                color: milestone.achieved ? colors.text.primary : colors.text.muted,
                textAlign: 'center',
                maxWidth: 80,
              }}>
                {isArabic ? milestone.titleAr || milestone.title : milestone.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
MilestoneTracker.displayName = 'MilestoneTracker';

// ═══════════════════════════════════════════════════════════════════════════
// ACHIEVEMENT BADGE
// ═══════════════════════════════════════════════════════════════════════════

export const AchievementBadge = memo(({
  icon,
  title,
  titleAr,
  description,
  descriptionAr,
  points,
  unlocked,
  unlockedAt,
  category,
  isArabic = false,
  size = 'md',
  showDetails = false,
  onClick,
}: AchievementBadgeProps) => {
  const sizes = {
    sm: { badge: 36, icon: 18, font: typography.size.xs },
    md: { badge: 48, icon: 24, font: typography.size.sm },
    lg: { badge: 64, icon: 32, font: typography.size.base },
  };

  const categoryColors: Record<string, string> = {
    clinical: brandPink,
    engagement: '#f59e0b',
    mastery: brandPurple,
    exploration: brandCyan,
  };

  const color = category ? categoryColors[category] || brandCyan : brandCyan;
  const currentSize = sizes[size];

  const css = `
    @keyframes badgeUnlock {
      0% { transform: scale(0) rotate(-180deg); }
      50% { transform: scale(1.3) rotate(0deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    @keyframes badgeShine {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div
        onClick={onClick}
        style={{
          display: 'flex',
          flexDirection: showDetails ? 'row' : 'column',
          alignItems: 'center',
          gap: showDetails ? spacing[3] : spacing[1],
          padding: showDetails ? spacing[3] : spacing[2],
          background: unlocked
            ? `linear-gradient(135deg, ${color}10, ${color}05)`
            : 'rgba(255,255,255,0.02)',
          border: `1px solid ${unlocked ? color : colors.border.subtle}30`,
          borderRadius: radius.lg,
          cursor: onClick ? 'pointer' : 'default',
          transition: transitions.fast,
          opacity: unlocked ? 1 : 0.5,
        }}
      >
        {/* Badge icon */}
        <div style={{
          width: currentSize.badge,
          height: currentSize.badge,
          borderRadius: radius.lg,
          background: unlocked
            ? `linear-gradient(135deg, ${color}30, ${color}15)`
            : colors.surface.card,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: currentSize.icon,
          filter: unlocked ? 'none' : 'grayscale(1)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Shine effect for unlocked */}
          {unlocked && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
              backgroundSize: '200% 100%',
              animation: 'badgeShine 3s ease-in-out infinite',
            }} />
          )}
          <span style={{ position: 'relative', zIndex: 1 }}>{icon}</span>
        </div>

        {/* Details */}
        {showDetails && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: currentSize.font,
              fontWeight: typography.weight.bold,
              color: unlocked ? colors.text.primary : colors.text.muted,
              marginBottom: 2,
            }}>
              {isArabic ? titleAr || title : title}
            </div>
            {description && (
              <div style={{
                fontSize: typography.size.xs,
                color: colors.text.secondary,
                marginBottom: spacing[1],
              }}>
                {isArabic ? descriptionAr || description : description}
              </div>
            )}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}>
              {points && (
                <span style={{
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color,
                }}>
                  +{points} {isArabic ? 'نقطة' : 'pts'}
                </span>
              )}
              {unlockedAt && (
                <span style={{
                  fontSize: typography.size.xs,
                  color: colors.text.muted,
                }}>
                  {new Date(unlockedAt).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Compact title */}
        {!showDetails && (
          <span style={{
            fontSize: typography.size.xs,
            fontWeight: typography.weight.semibold,
            color: unlocked ? colors.text.primary : colors.text.muted,
            textAlign: 'center',
            maxWidth: 80,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {isArabic ? titleAr || title : title}
          </span>
        )}
      </div>
    </>
  );
});
AchievementBadge.displayName = 'AchievementBadge';

// ═══════════════════════════════════════════════════════════════════════════
// ACHIEVEMENT GRID
// ═══════════════════════════════════════════════════════════════════════════

export const AchievementGrid = memo(({
  achievements,
  isArabic = false,
  columns = 4,
  showLocked = true,
  title,
  titleAr,
}: AchievementGridProps) => {
  const displayedAchievements = useMemo(() => {
    if (showLocked) return achievements;
    return achievements.filter(a => a.achieved);
  }, [achievements, showLocked]);

  const unlockedCount = achievements.filter(a => a.achieved).length;

  return (
    <div>
      {(title || titleAr) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing[4],
        }}>
          <h4 style={{
            margin: 0,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
          }}>
            {isArabic ? titleAr : title}
          </h4>
          <span style={{
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            color: brandCyan,
          }}>
            {unlockedCount}/{achievements.length}
          </span>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: spacing[2],
      }}>
        {displayedAchievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            icon={achievement.icon}
            title={achievement.title}
            titleAr={achievement.titleAr}
            description={achievement.description}
            descriptionAr={achievement.descriptionAr}
            points={achievement.points}
            unlocked={achievement.achieved}
            unlockedAt={achievement.achievedAt}
            category={achievement.category}
            isArabic={isArabic}
            size="sm"
          />
        ))}
      </div>
    </div>
  );
});
AchievementGrid.displayName = 'AchievementGrid';

// ═══════════════════════════════════════════════════════════════════════════
// TREATMENT PHASE INDICATOR
// ═══════════════════════════════════════════════════════════════════════════

interface TreatmentPhaseProps {
  phase: 'assessment' | 'active' | 'maintenance' | 'completed';
  sessionsCompleted: number;
  totalSessions?: number;
  isArabic?: boolean;
}

export const TreatmentPhaseIndicator = memo(({
  phase,
  sessionsCompleted,
  totalSessions = 20,
  isArabic = false,
}: TreatmentPhaseProps) => {
  const phases = [
    { key: 'assessment', label: 'Assessment', labelAr: 'تقييم', icon: '📋', range: [0, 0] },
    { key: 'active', label: 'Active', labelAr: 'نشط', icon: '🎯', range: [1, 14] },
    { key: 'maintenance', label: 'Maintenance', labelAr: 'صيانة', icon: '🔄', range: [15, 19] },
    { key: 'completed', label: 'Completed', labelAr: 'مكتمل', icon: '🎓', range: [20, 20] },
  ];

  const currentPhaseIndex = phases.findIndex(p => p.key === phase);

  return (
    <div style={{
      padding: spacing[4],
      background: `linear-gradient(135deg, ${brandCyan}08, ${brandPurple}05)`,
      border: `1px solid ${colors.border.default}`,
      borderRadius: radius.xl,
    }}>
      {/* Progress bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[1],
        marginBottom: spacing[4],
      }}>
        {phases.map((p, i) => {
          const isActive = i === currentPhaseIndex;
          const isCompleted = i < currentPhaseIndex;
          return (
            <div
              key={p.key}
              style={{
                flex: 1,
                height: 6,
                borderRadius: radius.full,
                background: isCompleted
                  ? `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`
                  : isActive
                  ? brandCyan
                  : colors.border.default,
                opacity: isActive ? 1 : isCompleted ? 0.8 : 0.3,
                transition: transitions.normal,
              }}
            />
          );
        })}
      </div>

      {/* Phase cards */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: spacing[2],
      }}>
        {phases.map((p, i) => {
          const isActive = i === currentPhaseIndex;
          const isCompleted = i < currentPhaseIndex;
          return (
            <div
              key={p.key}
              style={{
                flex: 1,
                padding: spacing[2],
                background: isActive
                  ? `${brandCyan}15`
                  : isCompleted
                  ? `${brandPurple}10`
                  : 'transparent',
                border: `1px solid ${isActive ? brandCyan : isCompleted ? brandPurple : colors.border.subtle}30`,
                borderRadius: radius.lg,
                textAlign: 'center',
                opacity: isActive || isCompleted ? 1 : 0.4,
                transition: transitions.fast,
              }}
            >
              <div style={{ fontSize: 20, marginBottom: spacing[1] }}>{p.icon}</div>
              <div style={{
                fontSize: typography.size.xs,
                fontWeight: isActive ? typography.weight.bold : typography.weight.medium,
                color: isActive ? brandCyan : isCompleted ? brandPurple : colors.text.muted,
              }}>
                {isArabic ? p.labelAr : p.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Session counter */}
      <div style={{
        marginTop: spacing[4],
        textAlign: 'center',
      }}>
        <span style={{
          fontSize: typography.size['2xl'],
          fontWeight: typography.weight.black,
          color: brandCyan,
        }}>
          {sessionsCompleted}
        </span>
        <span style={{
          fontSize: typography.size.sm,
          color: colors.text.secondary,
        }}>
          /{totalSessions} {isArabic ? 'جلسة' : 'sessions'}
        </span>
      </div>
    </div>
  );
});
TreatmentPhaseIndicator.displayName = 'TreatmentPhaseIndicator';

export default MilestoneTracker;
