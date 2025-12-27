/**
 * GoalSetting - Personal goal-setting and progress tracking
 * Allows users/guardians/clinicians to set targets and track progress
 * Supports daily, weekly, monthly, and custom goals
 */

import { memo, useMemo, useState, useCallback } from 'react';
import {
  brandCyan,
  brandPurple,
  brandPink,
  colors,
  typography,
  spacing,
  radius,
  transitions,
  shadows,
} from '../styles';
import { useLanguage } from '../../context/LanguageContext';
import { renderLabIcon } from '../icons/index';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Goal {
  id: string;
  type: 'points' | 'sessions' | 'streak' | 'score' | 'time' | 'custom';
  title: string;
  titleAr: string;
  description?: string;
  descriptionAr?: string;
  target: number;
  current: number;
  unit: string;
  unitAr: string;
  period: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: number;
  endDate?: number;
  createdBy: 'self' | 'parent' | 'clinician';
  status: 'active' | 'completed' | 'failed' | 'paused';
  completedAt?: number;
  reward?: {
    type: 'points' | 'badge' | 'title';
    value: number | string;
    icon: string;
  };
  icon: string;
  color?: string;
}

interface GoalCardProps {
  goal: Goal;
  isArabic?: boolean;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

interface GoalListProps {
  goals: Goal[];
  isArabic?: boolean;
  showCompleted?: boolean;
  variant?: 'list' | 'grid' | 'compact';
  onEditGoal?: (goal: Goal) => void;
  onDeleteGoal?: (goalId: string) => void;
  title?: string;
  titleAr?: string;
}

interface GoalCreatorProps {
  onCreateGoal: (goal: Omit<Goal, 'id' | 'status' | 'current'>) => void;
  isArabic?: boolean;
  creatorRole?: 'self' | 'parent' | 'clinician';
  existingGoals?: Goal[];
}

interface GoalProgressRingProps {
  current: number;
  target: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showPercentage?: boolean;
  icon?: string;
}

interface GoalSummaryProps {
  goals: Goal[];
  isArabic?: boolean;
}

interface GoalCelebrationProps {
  goal: Goal;
  isArabic?: boolean;
  onClose: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// PRESET GOALS
// ═══════════════════════════════════════════════════════════════════════════

export const PRESET_GOALS: Omit<Goal, 'id' | 'status' | 'current' | 'startDate' | 'createdBy'>[] = [
  {
    type: 'points',
    title: 'Point Collector',
    titleAr: 'auto.GoalSetting.k22',
    description: 'Earn 500 points this week',
    descriptionAr: 'auto.GoalSetting.k23',
    target: 500,
    unit: 'points',
    unitAr: 'auto.GoalSetting.k24',
    period: 'weekly',
    icon: '⭐',
    reward: { type: 'points', value: 50, icon: '🎁' },
  },
  {
    type: 'sessions',
    title: 'Daily Champion',
    titleAr: 'auto.GoalSetting.k25',
    description: 'Complete 1 session today',
    descriptionAr: 'auto.GoalSetting.k26',
    target: 1,
    unit: 'sessions',
    unitAr: 'auto.GoalSetting.k27',
    period: 'daily',
    icon: '🎯',
    reward: { type: 'points', value: 10, icon: '✨' },
  },
  {
    type: 'sessions',
    title: 'Weekly Warrior',
    titleAr: 'auto.GoalSetting.k28',
    description: 'Complete 5 sessions this week',
    descriptionAr: 'auto.GoalSetting.k29',
    target: 5,
    unit: 'sessions',
    unitAr: 'auto.GoalSetting.k30',
    period: 'weekly',
    icon: '⚔️',
    reward: { type: 'badge', value: 'Weekly Warrior', icon: '🏅' },
  },
  {
    type: 'streak',
    title: 'Streak Builder',
    titleAr: 'auto.GoalSetting.k31',
    description: 'Maintain a 7-day streak',
    descriptionAr: 'auto.GoalSetting.k32',
    target: 7,
    unit: 'days',
    unitAr: 'auto.GoalSetting.k33',
    period: 'weekly',
    icon: '🔥',
    reward: { type: 'badge', value: 'Fire Keeper', icon: '🔥' },
  },
  {
    type: 'score',
    title: 'Score Improver',
    titleAr: 'auto.GoalSetting.k34',
    description: 'Reach 80% attention score',
    descriptionAr: 'auto.GoalSetting.k35',
    target: 80,
    unit: '%',
    unitAr: '%',
    period: 'monthly',
    icon: '📈',
    reward: { type: 'title', value: 'Sharp Mind', icon: '🧠' },
  },
  {
    type: 'points',
    title: 'Monthly Master',
    titleAr: 'auto.GoalSetting.k36',
    description: 'Earn 2000 points this month',
    descriptionAr: 'auto.GoalSetting.k37',
    target: 2000,
    unit: 'points',
    unitAr: 'auto.GoalSetting.k38',
    period: 'monthly',
    icon: '👑',
    reward: { type: 'badge', value: 'Monthly Master', icon: '👑' },
  },
  {
    type: 'time',
    title: 'Practice Pro',
    titleAr: 'auto.GoalSetting.k39',
    description: 'Practice for 30 minutes daily',
    descriptionAr: 'auto.GoalSetting.k40',
    target: 30,
    unit: 'min',
    unitAr: 'auto.GoalSetting.k41',
    period: 'daily',
    icon: '⏱️',
    reward: { type: 'points', value: 25, icon: '⏱️' },
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

export const MOCK_GOALS: Goal[] = [
  {
    id: 'goal_1',
    type: 'points',
    title: 'Weekly Points',
    titleAr: 'auto.GoalSetting.k42',
    description: 'Earn 1000 points this week',
    descriptionAr: 'auto.GoalSetting.k43',
    target: 1000,
    current: 720,
    unit: 'points',
    unitAr: 'auto.GoalSetting.k44',
    period: 'weekly',
    startDate: Date.now() - 86400000 * 3,
    createdBy: 'self',
    status: 'active',
    icon: '⭐',
    color: brandCyan,
    reward: { type: 'points', value: 100, icon: '🎁' },
  },
  {
    id: 'goal_2',
    type: 'sessions',
    title: 'Daily Session',
    titleAr: 'auto.GoalSetting.k45',
    target: 1,
    current: 1,
    unit: 'session',
    unitAr: 'auto.GoalSetting.k46',
    period: 'daily',
    startDate: Date.now(),
    createdBy: 'self',
    status: 'completed',
    completedAt: Date.now() - 3600000,
    icon: '🎯',
    color: colors.success,
    reward: { type: 'points', value: 20, icon: '✨' },
  },
  {
    id: 'goal_3',
    type: 'streak',
    title: '7-Day Streak',
    titleAr: 'auto.GoalSetting.k47',
    target: 7,
    current: 5,
    unit: 'days',
    unitAr: 'auto.GoalSetting.k48',
    period: 'weekly',
    startDate: Date.now() - 86400000 * 5,
    createdBy: 'parent',
    status: 'active',
    icon: '🔥',
    color: colors.warning,
  },
  {
    id: 'goal_4',
    type: 'score',
    title: 'Attention Target',
    titleAr: 'auto.GoalSetting.k49',
    description: 'Reach 85% attention score',
    descriptionAr: 'auto.GoalSetting.k50',
    target: 85,
    current: 78,
    unit: '%',
    unitAr: '%',
    period: 'monthly',
    startDate: Date.now() - 86400000 * 14,
    createdBy: 'clinician',
    status: 'active',
    icon: '🧠',
    color: brandPurple,
    reward: { type: 'badge', value: 'Sharp Mind', icon: '🧠' },
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// GOAL PROGRESS RING
// ═══════════════════════════════════════════════════════════════════════════

export const GoalProgressRing = memo(({
  current,
  target,
  size = 80,
  strokeWidth = 6,
  color = brandCyan,
  showPercentage = true,
  icon,
}: GoalProgressRingProps) => {
  const percentage = Math.min((current / target) * 100, 100);
  const circumference = 2 * Math.PI * ((size - strokeWidth) / 2);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isComplete = current >= target;
  const iconSize = Math.max(12, Math.round(size * 0.25));

  const css = `
    @keyframes progressRingFill {
      from { stroke-dashoffset: ${circumference}; }
      to { stroke-dashoffset: ${strokeDashoffset}; }
    }
    @keyframes goalComplete {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div style={{
        position: 'relative',
        width: size,
        height: size,
        animation: isComplete ? 'goalComplete 1s ease-in-out' : 'none',
      }}>
        <svg
          width={size}
          height={size}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size - strokeWidth) / 2}
            fill="none"
            stroke={colors.border.default}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size - strokeWidth) / 2}
            fill="none"
            stroke={isComplete ? colors.success : color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: transitions.slow,
              filter: isComplete ? `drop-shadow(0 0 6px ${color})` : 'none',
            }}
          />
        </svg>
        {/* Center content */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {icon && (
            <span style={{ marginBottom: 2 }}>
              {renderLabIcon(icon, { size: iconSize, tone: 'cyan' })}
            </span>
          )}
          {showPercentage && (
            <span style={{
              fontSize: size * 0.18,
              fontWeight: typography.weight.black,
              color: isComplete ? colors.success : colors.text.primary,
            }}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
    </>
  );
});
GoalProgressRing.displayName = 'GoalProgressRing';

// ═══════════════════════════════════════════════════════════════════════════
// GOAL CARD
// ═══════════════════════════════════════════════════════════════════════════

export const GoalCard = memo(({
  goal,
  isArabic = false,
  onEdit,
  onDelete,
  variant = 'default',
}: GoalCardProps) => {
  const { t } = useLanguage();
  const progress = Math.min((goal.current / goal.target) * 100, 100);
  const isComplete = goal.status === 'completed' || goal.current >= goal.target;
  const color = goal.color || brandCyan;

  const periodLabels = {
    daily: { en: 'Today', ar: 'auto.GoalSetting.k51' },
    weekly: { en: 'This Week', ar: 'auto.GoalSetting.k52' },
    monthly: { en: 'This Month', ar: 'auto.GoalSetting.k53' },
    custom: { en: 'Custom', ar: 'auto.GoalSetting.k54' },
  };

  const creatorLabels = {
    self: { en: 'Personal', ar: 'auto.GoalSetting.k55' },
    parent: { en: 'Set by Parent', ar: 'auto.GoalSetting.k56' },
    clinician: { en: 'Clinical Target', ar: 'auto.GoalSetting.k57' },
  };

  if (variant === 'compact') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[3],
        padding: spacing[3],
        background: isComplete ? `${color}10` : colors.surface.card,
        border: `1px solid ${isComplete ? color : colors.border.default}30`,
        borderRadius: radius.lg,
      }}>
        <GoalProgressRing
          current={goal.current}
          target={goal.target}
          size={48}
          strokeWidth={4}
          color={color}
          icon={goal.icon}
          showPercentage={false}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            color: isComplete ? color : colors.text.primary,
          }}>
            {isArabic ? t(goal.titleAr, goal.title) : goal.title}
          </div>
          <div style={{
            fontSize: typography.size.xs,
            color: colors.text.muted,
          }}>
            {goal.current}/{goal.target} {isArabic ? t(goal.unitAr, goal.unit) : goal.unit}
          </div>
        </div>
        {isComplete && (
          <span style={{ fontSize: 20 }}>{renderLabIcon('\u2705', { size: 18, tone: 'success' })}</span>
        )}
      </div>
    );
  }

  return (
    <div style={{
      padding: spacing[4],
      background: colors.surface.card,
      border: `1px solid ${isComplete ? color : colors.border.default}`,
      borderRadius: radius.xl,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Completed overlay */}
      {isComplete && (
        <div style={{
          position: 'absolute',
          top: spacing[2],
          right: spacing[2],
          padding: `${spacing[1]}px ${spacing[2]}px`,
          background: colors.success,
          borderRadius: radius.full,
          fontSize: typography.size.xs,
          fontWeight: typography.weight.bold,
          color: 'white',
        }}>
          {renderLabIcon('\u2713', { size: 14, style: { color: 'white' } })} {t('auto.GoalSetting.k1', "Complete")}
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing[3],
        marginBottom: spacing[4],
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: radius.lg,
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
        }}>
          {renderLabIcon(goal.icon, { size: 24, style: { color } })}
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{
            margin: 0,
            fontSize: typography.size.base,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
          }}>
            {isArabic ? t(goal.titleAr, goal.title) : goal.title}
          </h4>
          {goal.description && (
            <p style={{
              margin: `${spacing[1]}px 0 0`,
              fontSize: typography.size.xs,
              color: colors.text.secondary,
            }}>
              {isArabic ? t(goal.descriptionAr, goal.description) : goal.description}
            </p>
          )}
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: spacing[3] }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: spacing[1],
        }}>
          <span style={{
            fontSize: typography.size.lg,
            fontWeight: typography.weight.black,
            color: isComplete ? colors.success : color,
          }}>
            {goal.current}
          </span>
          <span style={{
            fontSize: typography.size.sm,
            color: colors.text.muted,
          }}>
            / {goal.target} {isArabic ? t(goal.unitAr, goal.unit) : goal.unit}
          </span>
        </div>
        <div style={{
          height: 8,
          background: colors.border.default,
          borderRadius: radius.full,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: isComplete
              ? colors.success
              : `linear-gradient(90deg, ${color}, ${brandPurple})`,
            borderRadius: radius.full,
            transition: transitions.slow,
          }} />
        </div>
      </div>

      {/* Meta info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: spacing[3],
        borderTop: `1px solid ${colors.border.subtle}`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
        }}>
          <span style={{
            padding: `${spacing[1]}px ${spacing[2]}px`,
            background: `${color}10`,
            borderRadius: radius.sm,
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            color,
          }}>
            {isArabic ? periodLabels[goal.period].ar : periodLabels[goal.period].en}
          </span>
          {goal.createdBy !== 'self' && (
            <span style={{
              fontSize: typography.size.xs,
              color: colors.text.muted,
            }}>
              {isArabic ? creatorLabels[goal.createdBy].ar : creatorLabels[goal.createdBy].en}
            </span>
          )}
        </div>

        {/* Reward preview */}
        {goal.reward && !isComplete && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[1],
            fontSize: typography.size.xs,
            color: colors.text.muted,
          }}>
            <span>{goal.reward.icon}</span>
            <span>
              {goal.reward.type === 'points'
                ? `+${goal.reward.value}`
                : t('auto.GoalSetting.k2', "Reward")}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {variant === 'detailed' && (onEdit || onDelete) && (
        <div style={{
          display: 'flex',
          gap: spacing[2],
          marginTop: spacing[3],
        }}>
          {onEdit && (
            <button
              onClick={() => onEdit(goal)}
              style={{
                flex: 1,
                padding: spacing[2],
                background: 'transparent',
                border: `1px solid ${colors.border.default}`,
                borderRadius: radius.md,
                fontSize: typography.size.xs,
                color: colors.text.secondary,
                cursor: 'pointer',
              }}
            >
              {t('auto.GoalSetting.k3', "Edit")}
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
              style={{
                padding: spacing[2],
                background: 'transparent',
                border: `1px solid rgba(239,68,68,0.3)`,
                borderRadius: radius.md,
                fontSize: typography.size.xs,
                color: colors.error,
                cursor: 'pointer',
              }}
            >
              {t('auto.GoalSetting.k4', "Delete")}
            </button>
          )}
        </div>
      )}
    </div>
  );
});
GoalCard.displayName = 'GoalCard';

// ═══════════════════════════════════════════════════════════════════════════
// GOAL LIST
// ═══════════════════════════════════════════════════════════════════════════

export const GoalList = memo(({
  goals,
  isArabic = false,
  showCompleted = true,
  variant = 'list',
  onEditGoal,
  onDeleteGoal,
  title,
  titleAr,
}: GoalListProps) => {
  const { t } = useLanguage();
  const filteredGoals = useMemo(() => {
    if (showCompleted) return goals;
    return goals.filter(g => g.status !== 'completed');
  }, [goals, showCompleted]);

  const activeGoals = filteredGoals.filter(g => g.status === 'active');
  const completedGoals = filteredGoals.filter(g => g.status === 'completed');

  if (variant === 'compact') {
    return (
      <div>
        {(title || titleAr) && (
          <h4 style={{
            margin: `0 0 ${spacing[3]}px`,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>{isArabic ? t(titleAr, title) : title}</span>
            <span style={{
              fontSize: typography.size.xs,
              fontWeight: typography.weight.normal,
              color: brandCyan,
            }}>
              {completedGoals.length}/{goals.length}
            </span>
          </h4>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
          {filteredGoals.slice(0, 4).map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isArabic={isArabic}
              variant="compact"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {(title || titleAr) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing[4],
        }}>
          <h3 style={{
            margin: 0,
            fontSize: typography.size.lg,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
          }}>
            {renderLabIcon('\U0001F3AF', { size: 18, tone: 'cyan' })} {isArabic ? t(titleAr, title) : title}
          </h3>
          <span style={{
            fontSize: typography.size.sm,
            color: brandCyan,
            fontWeight: typography.weight.bold,
          }}>
            {completedGoals.length}/{goals.length} {t('auto.GoalSetting.k5', "completed")}
          </span>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div style={{ marginBottom: spacing[5] }}>
          <h4 style={{
            margin: `0 0 ${spacing[3]}px`,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            color: colors.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            {t('auto.GoalSetting.k6', "Active Goals")}
          </h4>
          <div style={{
            display: variant === 'grid' ? 'grid' : 'flex',
            gridTemplateColumns: variant === 'grid' ? 'repeat(auto-fit, minmax(280px, 1fr))' : undefined,
            flexDirection: variant === 'list' ? 'column' : undefined,
            gap: spacing[3],
          }}>
            {activeGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                isArabic={isArabic}
                onEdit={onEditGoal}
                onDelete={onDeleteGoal}
                variant="default"
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {showCompleted && completedGoals.length > 0 && (
        <div>
          <h4 style={{
            margin: `0 0 ${spacing[3]}px`,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            color: colors.text.muted,
          }}>
            {renderLabIcon('\u2705', { size: 16, tone: 'success' })} {t('auto.GoalSetting.k7', "Completed")}
          </h4>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[2],
            opacity: 0.7,
          }}>
            {completedGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                isArabic={isArabic}
                variant="compact"
              />
            ))}
          </div>
        </div>
      )}

      {filteredGoals.length === 0 && (
        <div style={{
          padding: spacing[8],
          textAlign: 'center',
          color: colors.text.muted,
        }}>
          <div style={{ fontSize: 48, marginBottom: spacing[3] }}>{renderLabIcon('\U0001F3AF', { size: 48, tone: 'muted' })}</div>
          <p style={{ margin: 0 }}>
            {t('auto.GoalSetting.k8', "No goals yet. Create one to get started!")}
          </p>
        </div>
      )}
    </div>
  );
});
GoalList.displayName = 'GoalList';

// ═══════════════════════════════════════════════════════════════════════════
// GOAL CREATOR
// ═══════════════════════════════════════════════════════════════════════════

export const GoalCreator = memo(({
  onCreateGoal,
  isArabic = false,
  creatorRole = 'self',
}: GoalCreatorProps) => {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<typeof PRESET_GOALS[0] | null>(null);
  const [customTarget, setCustomTarget] = useState('');

  const handleSelectPreset = useCallback((preset: typeof PRESET_GOALS[0]) => {
    setSelectedPreset(preset);
    setCustomTarget(preset.target.toString());
  }, []);

  const handleCreate = useCallback(() => {
    if (!selectedPreset) return;

    onCreateGoal({
      ...selectedPreset,
      target: parseInt(customTarget) || selectedPreset.target,
      startDate: Date.now(),
      createdBy: creatorRole,
    });

    setShowForm(false);
    setSelectedPreset(null);
    setCustomTarget('');
  }, [selectedPreset, customTarget, creatorRole, onCreateGoal]);

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        style={{
          width: '100%',
          padding: spacing[4],
          background: `linear-gradient(135deg, ${brandCyan}10, ${brandPurple}08)`,
          border: `2px dashed ${brandCyan}40`,
          borderRadius: radius.xl,
          color: brandCyan,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[2],
          transition: transitions.fast,
        }}
      >
        <span style={{ fontSize: 20 }}>{renderLabIcon('\U0001F3AF', { size: 18, tone: 'cyan' })}</span>
        {t('auto.GoalSetting.k9', "Create New Goal")}
      </button>
    );
  }

  return (
    <div style={{
      padding: spacing[5],
      background: colors.surface.card,
      border: `1px solid ${colors.border.default}`,
      borderRadius: radius.xl,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing[4],
      }}>
        <h4 style={{
          margin: 0,
          fontSize: typography.size.lg,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
        }}>
          {t('auto.GoalSetting.k10', "Choose a Goal")}
        </h4>
        <button
          onClick={() => {
            setShowForm(false);
            setSelectedPreset(null);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: 20,
            color: colors.text.muted,
            cursor: 'pointer',
          }}
        >
          {renderLabIcon('\u2715', { size: 16, tone: 'muted' })}
        </button>
      </div>

      {/* Preset goals */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: spacing[2],
        marginBottom: spacing[4],
      }}>
        {PRESET_GOALS.map((preset, i) => {
          const isSelected = selectedPreset?.title === preset.title;
          return (
            <button
              key={i}
              onClick={() => handleSelectPreset(preset)}
              style={{
                padding: spacing[3],
                background: isSelected ? `${brandCyan}15` : 'rgba(255,255,255,0.02)',
                border: `2px solid ${isSelected ? brandCyan : colors.border.subtle}`,
                borderRadius: radius.lg,
                cursor: 'pointer',
                textAlign: 'center',
                transition: transitions.fast,
              }}
            >
              <div style={{ fontSize: 24, marginBottom: spacing[1] }}>{renderLabIcon(preset.icon, { size: 24, tone: isSelected ? 'cyan' : 'muted' })}</div>
              <div style={{
                fontSize: typography.size.xs,
                fontWeight: typography.weight.bold,
                color: isSelected ? brandCyan : colors.text.primary,
              }}>
                {isArabic ? t(preset.titleAr, preset.title) : preset.title}
              </div>
              <div style={{
                fontSize: typography.size.xs,
                color: colors.text.muted,
                marginTop: 2,
              }}>
                {preset.target} {isArabic ? t(preset.unitAr, preset.unit) : preset.unit}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom target input */}
      {selectedPreset && (
        <div style={{ marginBottom: spacing[4] }}>
          <label style={{
            display: 'block',
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            color: colors.text.secondary,
            marginBottom: spacing[2],
          }}>
            {t('auto.GoalSetting.k11', "Customize Target")}
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}>
            <input
              type="number"
              value={customTarget}
              onChange={(e) => setCustomTarget(e.target.value)}
              style={{
                flex: 1,
                padding: spacing[3],
                background: colors.surface.base,
                border: `1px solid ${colors.border.default}`,
                borderRadius: radius.md,
                color: colors.text.primary,
                fontSize: typography.size.base,
              }}
            />
            <span style={{
              fontSize: typography.size.sm,
              color: colors.text.muted,
            }}>
              {isArabic ? t(selectedPreset.unitAr, selectedPreset.unit) : selectedPreset.unit}
            </span>
          </div>
        </div>
      )}

      {/* Create button */}
      <button
        onClick={handleCreate}
        disabled={!selectedPreset}
        style={{
          width: '100%',
          padding: spacing[3],
          background: selectedPreset
            ? `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`
            : colors.border.default,
          border: 'none',
          borderRadius: radius.lg,
          color: selectedPreset ? colors.surface.base : colors.text.muted,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          cursor: selectedPreset ? 'pointer' : 'not-allowed',
          transition: transitions.fast,
        }}
      >
        {t('auto.GoalSetting.k12', "Create Goal")}
      </button>
    </div>
  );
});
GoalCreator.displayName = 'GoalCreator';

// ═══════════════════════════════════════════════════════════════════════════
// GOAL SUMMARY (Quick Overview)
// ═══════════════════════════════════════════════════════════════════════════

export const GoalSummary = memo(({
  goals,
  isArabic = false,
}: GoalSummaryProps) => {
  const { t } = useLanguage();
  const stats = useMemo(() => {
    const active = goals.filter(g => g.status === 'active');
    const completed = goals.filter(g => g.status === 'completed');
    const totalProgress = active.reduce((sum, g) => sum + (g.current / g.target) * 100, 0);
    const avgProgress = active.length > 0 ? totalProgress / active.length : 0;

    return {
      active: active.length,
      completed: completed.length,
      avgProgress: Math.round(avgProgress),
      nearComplete: active.filter(g => (g.current / g.target) >= 0.8).length,
    };
  }, [goals]);

  return (
    <div style={{
      padding: spacing[4],
      background: `linear-gradient(135deg, ${brandCyan}10, ${brandPurple}08)`,
      border: `1px solid ${brandCyan}30`,
      borderRadius: radius.xl,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[2],
        marginBottom: spacing[3],
      }}>
        <span style={{ fontSize: 20 }}>{renderLabIcon('\U0001F3AF', { size: 20, tone: 'cyan' })}</span>
        <h4 style={{
          margin: 0,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
        }}>
          {t('auto.GoalSetting.k13', "Goal Summary")}
        </h4>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: spacing[3],
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.black,
            color: brandCyan,
          }}>
            {stats.active}
          </div>
          <div style={{
            fontSize: typography.size.xs,
            color: colors.text.muted,
          }}>
            {t('auto.GoalSetting.k14', "Active")}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.black,
            color: colors.success,
          }}>
            {stats.completed}
          </div>
          <div style={{
            fontSize: typography.size.xs,
            color: colors.text.muted,
          }}>
            {t('auto.GoalSetting.k15', "Done")}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.black,
            color: brandPurple,
          }}>
            {stats.avgProgress}%
          </div>
          <div style={{
            fontSize: typography.size.xs,
            color: colors.text.muted,
          }}>
            {t('auto.GoalSetting.k16', "Avg Progress")}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.black,
            color: colors.warning,
          }}>
            {stats.nearComplete}
          </div>
          <div style={{
            fontSize: typography.size.xs,
            color: colors.text.muted,
          }}>
            {t('auto.GoalSetting.k17', "Almost Done")}
          </div>
        </div>
      </div>
    </div>
  );
});
GoalSummary.displayName = 'GoalSummary';

// ═══════════════════════════════════════════════════════════════════════════
// GOAL CELEBRATION MODAL
// ═══════════════════════════════════════════════════════════════════════════

export const GoalCelebration = memo(({
  goal,
  isArabic = false,
  onClose,
}: GoalCelebrationProps) => {
  const { t } = useLanguage();
  const css = `
    @keyframes goalCelebrate {
      0% { opacity: 0; transform: scale(0.5) rotate(-10deg); }
      50% { transform: scale(1.1) rotate(5deg); }
      100% { opacity: 1; transform: scale(1) rotate(0deg); }
    }
    @keyframes confetti {
      0% { transform: translateY(-100%) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes starBurst {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.5); opacity: 1; }
    }
  `;

  const confettiColors = [brandCyan, brandPurple, brandPink, colors.success, colors.warning];

  return (
    <>
      <style>{css}</style>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5,6,13,0.92)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: spacing[4],
        }}
      >
        {/* Confetti */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 10,
              height: 10,
              background: confettiColors[i % confettiColors.length],
              borderRadius: i % 2 === 0 ? radius.full : radius.sm,
              left: `${Math.random() * 100}%`,
              top: -20,
              animation: `confetti ${2 + Math.random() * 2}s linear ${Math.random() * 0.5}s infinite`,
            }}
          />
        ))}

        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: colors.surface.overlay,
            borderRadius: radius['2xl'],
            maxWidth: 400,
            width: '100%',
            padding: spacing[8],
            textAlign: 'center',
            position: 'relative',
            border: `1px solid ${brandCyan}30`,
            animation: 'goalCelebrate 0.6s ease-out',
          }}
        >
          {/* Stars */}
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                fontSize: 24,
                animation: `starBurst 1.5s ease-in-out ${i * 0.3}s infinite`,
                top: `${20 + i * 30}%`,
                left: i === 1 ? '80%' : '10%',
              }}
            >
              ⭐
            </span>
          ))}

          {/* Trophy */}
          <div style={{
            width: 100,
            height: 100,
            margin: '0 auto',
            marginBottom: spacing[4],
            borderRadius: radius.full,
            background: `linear-gradient(135deg, ${brandCyan}30, ${brandPurple}20)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            boxShadow: `0 0 40px ${brandCyan}40`,
          }}>
            {renderLabIcon('\U0001F3C6', { size: 48, tone: 'warning', glow: true })}
          </div>

          {/* Title */}
          <div style={{
            fontSize: typography.size.sm,
            color: brandCyan,
            fontWeight: typography.weight.bold,
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginBottom: spacing[2],
          }}>
            {renderLabIcon('\U0001F389', { size: 16, tone: 'pink' })} {t('auto.GoalSetting.k18', "Goal Complete!")}
          </div>
          <h2 style={{
            margin: `0 0 ${spacing[3]}px`,
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
          }}>
            {isArabic ? t(goal.titleAr, goal.title) : goal.title}
          </h2>
          <p style={{
            margin: `0 0 ${spacing[5]}px`,
            fontSize: typography.size.sm,
            color: colors.text.secondary,
          }}>
            {isArabic
              ? `حققت ${goal.target} ${goal.unitAr}!`
              : `You achieved ${goal.target} ${goal.unit}!`}
          </p>

          {/* Reward */}
          {goal.reward && (
            <div style={{
              padding: spacing[4],
              background: `${brandCyan}15`,
              border: `1px solid ${brandCyan}30`,
              borderRadius: radius.lg,
              marginBottom: spacing[5],
            }}>
              <div style={{
                fontSize: typography.size.xs,
                color: brandCyan,
                fontWeight: typography.weight.bold,
                marginBottom: spacing[2],
              }}>
                {renderLabIcon('\U0001F381', { size: 16, tone: 'pink' })} {t('auto.GoalSetting.k19', "Your Reward")}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[2],
              }}>
                <span style={{ fontSize: 28 }}>{renderLabIcon(goal.reward.icon, { size: 28, tone: 'pink' })}</span>
                <span style={{
                  fontSize: typography.size.lg,
                  fontWeight: typography.weight.bold,
                  color: colors.text.primary,
                }}>
                  {goal.reward.type === 'points'
                    ? `+${goal.reward.value} ${t('auto.GoalSetting.k20', "points")}`
                    : goal.reward.value}
                </span>
              </div>
            </div>
          )}

          {/* Continue button */}
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: `${spacing[4]}px`,
              background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
              border: 'none',
              borderRadius: radius.lg,
              color: colors.surface.base,
              fontSize: typography.size.base,
              fontWeight: typography.weight.bold,
              cursor: 'pointer',
              transition: transitions.fast,
            }}
          >
            {t('auto.GoalSetting.k21', "Keep Going!")}
          </button>
        </div>
      </div>
    </>
  );
});
GoalCelebration.displayName = 'GoalCelebration';

export default GoalCard;
