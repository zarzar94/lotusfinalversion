/**
 * SessionSummary - Comprehensive post-session feedback and analytics
 * Provides real-time feedback loop with motivational elements
 * Integrates clinical scoring with gamification
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

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SessionMetrics {
  attentionScore: number;
  previousAttentionScore?: number;
  processingSpeed: number;
  previousProcessingSpeed?: number;
  auditoryDiscrimination: number;
  previousAuditoryDiscrimination?: number;
  accuracy: number;
  responseTime: number;
  previousResponseTime?: number;
  consistency: number;
}

export interface SessionResult {
  id: string;
  date: number;
  duration: number;
  gameType: string;
  gameTypeAr?: string;
  pointsEarned: number;
  bonusPoints: number;
  metrics: SessionMetrics;
  achievements: SessionAchievement[];
  streakInfo: {
    current: number;
    isNewRecord: boolean;
    streakBonus?: number;
  };
  levelProgress: {
    currentLevel: number;
    currentXP: number;
    xpForNextLevel: number;
    leveledUp: boolean;
    newLevel?: number;
  };
  goalProgress?: {
    goalId: string;
    goalTitle: string;
    goalTitleAr: string;
    beforeSession: number;
    afterSession: number;
    target: number;
    completed: boolean;
  }[];
  recommendations?: SessionRecommendation[];
  motivationalMessage?: {
    message: string;
    messageAr: string;
    icon: string;
  };
}

export interface SessionAchievement {
  id: string;
  title: string;
  titleAr: string;
  description?: string;
  descriptionAr?: string;
  icon: string;
  points: number;
  isNew: boolean;
  category: 'performance' | 'streak' | 'milestone' | 'mastery' | 'special';
}

export interface SessionRecommendation {
  id: string;
  type: 'improvement' | 'strength' | 'tip' | 'challenge';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  priority: number;
}

interface SessionSummaryCardProps {
  session: SessionResult;
  isArabic?: boolean;
  onClose?: () => void;
  onPlayAgain?: () => void;
  onViewDetails?: () => void;
  variant?: 'modal' | 'inline' | 'compact';
}

interface MetricDisplayProps {
  label: string;
  labelAr: string;
  value: number;
  previousValue?: number;
  maxValue?: number;
  unit?: string;
  unitAr?: string;
  icon: string;
  color: string;
  isArabic?: boolean;
  showChange?: boolean;
}

interface PointsBreakdownProps {
  basePoints: number;
  bonusPoints: number;
  streakBonus?: number;
  achievements: SessionAchievement[];
  isArabic?: boolean;
}

interface LevelProgressDisplayProps {
  levelProgress: SessionResult['levelProgress'];
  isArabic?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOTIVATIONAL MESSAGES
// ═══════════════════════════════════════════════════════════════════════════

const MOTIVATIONAL_MESSAGES = {
  excellent: [
    { message: "Outstanding performance! You're a true Sonic Master!", messageAr: "أداء متميز! أنت أستاذ صوتي حقيقي!", icon: "🌟" },
    { message: "Incredible work! Your brain is getting stronger!", messageAr: "عمل رائع! عقلك يصبح أقوى!", icon: "🧠" },
    { message: "Amazing! You're reaching new heights!", messageAr: "مذهل! أنت تصل لآفاق جديدة!", icon: "🚀" },
  ],
  good: [
    { message: "Great job! Keep up the excellent work!", messageAr: "عمل رائع! استمر!", icon: "⭐" },
    { message: "Well done! You're making steady progress!", messageAr: "أحسنت! تحرز تقدماً ثابتاً!", icon: "📈" },
    { message: "Nice work! Your dedication is paying off!", messageAr: "عمل جيد! تفانيك يؤتي ثماره!", icon: "💪" },
  ],
  improving: [
    { message: "Good effort! Every session makes you stronger!", messageAr: "مجهود جيد! كل جلسة تجعلك أقوى!", icon: "💫" },
    { message: "Keep going! Progress takes time!", messageAr: "استمر! التقدم يحتاج وقتاً!", icon: "🌱" },
    { message: "You're on the right track! Don't give up!", messageAr: "أنت على الطريق الصحيح! لا تستسلم!", icon: "🎯" },
  ],
  needsWork: [
    { message: "Every session counts! Keep practicing!", messageAr: "كل جلسة مهمة! استمر بالتدريب!", icon: "💪" },
    { message: "Practice makes perfect! You've got this!", messageAr: "التدريب يصنع الكمال! يمكنك فعلها!", icon: "🌟" },
    { message: "Don't worry! Growth happens step by step!", messageAr: "لا تقلق! النمو يحدث خطوة بخطوة!", icon: "🪜" },
  ],
};

function getMotivationalMessage(score: number): typeof MOTIVATIONAL_MESSAGES.excellent[0] {
  const category = score >= 85 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'improving' : 'needsWork';
  const messages = MOTIVATIONAL_MESSAGES[category];
  return messages[Math.floor(Math.random() * messages.length)];
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

export const MOCK_SESSION_RESULT: SessionResult = {
  id: 'session_123',
  date: Date.now(),
  duration: 25,
  gameType: 'Sound Detective',
  gameTypeAr: 'محقق الأصوات',
  pointsEarned: 180,
  bonusPoints: 45,
  metrics: {
    attentionScore: 82,
    previousAttentionScore: 78,
    processingSpeed: 75,
    previousProcessingSpeed: 72,
    auditoryDiscrimination: 88,
    previousAuditoryDiscrimination: 85,
    accuracy: 85,
    responseTime: 1.2,
    previousResponseTime: 1.4,
    consistency: 78,
  },
  achievements: [
    { id: 'ach_1', title: 'Sharp Ears', titleAr: 'آذان حادة', description: '85%+ accuracy in a session', descriptionAr: 'دقة 85%+ في جلسة', icon: '👂', points: 50, isNew: true, category: 'performance' },
    { id: 'ach_2', title: '5-Day Streak', titleAr: 'استمرارية 5 أيام', icon: '🔥', points: 100, isNew: true, category: 'streak' },
  ],
  streakInfo: {
    current: 5,
    isNewRecord: true,
    streakBonus: 25,
  },
  levelProgress: {
    currentLevel: 4,
    currentXP: 820,
    xpForNextLevel: 1000,
    leveledUp: false,
  },
  goalProgress: [
    { goalId: 'g1', goalTitle: 'Weekly Points', goalTitleAr: 'نقاط الأسبوع', beforeSession: 520, afterSession: 745, target: 1000, completed: false },
    { goalId: 'g2', goalTitle: 'Daily Session', goalTitleAr: 'جلسة اليوم', beforeSession: 0, afterSession: 1, target: 1, completed: true },
  ],
  recommendations: [
    { id: 'r1', type: 'strength', title: 'Auditory Star', titleAr: 'نجم السمع', description: 'Your auditory discrimination is exceptional!', descriptionAr: 'تمييزك السمعي استثنائي!', icon: '⭐', priority: 1 },
    { id: 'r2', type: 'improvement', title: 'Speed Training', titleAr: 'تدريب السرعة', description: 'Try Quick Response games to improve processing speed', descriptionAr: 'جرب ألعاب الاستجابة السريعة لتحسين سرعة المعالجة', icon: '⚡', priority: 2 },
    { id: 'r3', type: 'challenge', title: 'New Challenge', titleAr: 'تحدي جديد', description: 'Ready for Frequency Master? It will challenge your skills!', descriptionAr: 'مستعد لـ Frequency Master؟ سيتحدى مهاراتك!', icon: '🎯', priority: 3 },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// METRIC DISPLAY COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const MetricDisplay = memo(({
  label,
  labelAr,
  value,
  previousValue,
  maxValue = 100,
  unit = '%',
  unitAr,
  icon,
  color,
  isArabic = false,
  showChange = true,
}: MetricDisplayProps) => {
  const change = previousValue !== undefined ? value - previousValue : 0;
  const percentage = (value / maxValue) * 100;

  return (
    <div style={{
      padding: spacing[3],
      background: `${color}08`,
      border: `1px solid ${color}20`,
      borderRadius: radius.lg,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing[2],
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
        }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span style={{
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            color: colors.text.secondary,
          }}>
            {isArabic ? labelAr : label}
          </span>
        </div>
        {showChange && change !== 0 && (
          <span style={{
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            color: change > 0 ? '#22c55e' : '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}{unit}
          </span>
        )}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: spacing[1],
        marginBottom: spacing[2],
      }}>
        <span style={{
          fontSize: typography.size.xl,
          fontWeight: typography.weight.black,
          color,
        }}>
          {value}
        </span>
        <span style={{
          fontSize: typography.size.sm,
          color: colors.text.muted,
        }}>
          {isArabic ? unitAr || unit : unit}
        </span>
      </div>
      {/* Progress bar */}
      <div style={{
        height: 4,
        background: colors.border.default,
        borderRadius: radius.full,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          background: color,
          borderRadius: radius.full,
          transition: transitions.slow,
        }} />
      </div>
    </div>
  );
});
MetricDisplay.displayName = 'MetricDisplay';

// ═══════════════════════════════════════════════════════════════════════════
// POINTS BREAKDOWN
// ═══════════════════════════════════════════════════════════════════════════

export const PointsBreakdown = memo(({
  basePoints,
  bonusPoints,
  streakBonus,
  achievements,
  isArabic = false,
}: PointsBreakdownProps) => {
  const achievementPoints = achievements.reduce((sum, a) => sum + a.points, 0);
  const totalPoints = basePoints + bonusPoints + (streakBonus || 0) + achievementPoints;

  const rows = [
    { label: isArabic ? 'نقاط الجلسة' : 'Session Points', value: basePoints, icon: '🎮' },
    { label: isArabic ? 'مكافأة الأداء' : 'Performance Bonus', value: bonusPoints, icon: '⭐' },
  ];

  if (streakBonus) {
    rows.push({ label: isArabic ? 'مكافأة الاستمرارية' : 'Streak Bonus', value: streakBonus, icon: '🔥' });
  }

  if (achievementPoints > 0) {
    rows.push({ label: isArabic ? 'إنجازات جديدة' : 'New Achievements', value: achievementPoints, icon: '🏆' });
  }

  return (
    <div style={{
      padding: spacing[4],
      background: colors.surface.card,
      border: `1px solid ${colors.border.default}`,
      borderRadius: radius.lg,
    }}>
      <h4 style={{
        margin: `0 0 ${spacing[3]}px`,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        display: 'flex',
        alignItems: 'center',
        gap: spacing[2],
      }}>
        💰 {isArabic ? 'تفصيل النقاط' : 'Points Breakdown'}
      </h4>

      <div style={{ marginBottom: spacing[3] }}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${spacing[2]}px 0`,
              borderBottom: i < rows.length - 1 ? `1px solid ${colors.border.subtle}` : 'none',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}>
              <span style={{ fontSize: 14 }}>{row.icon}</span>
              <span style={{
                fontSize: typography.size.sm,
                color: colors.text.secondary,
              }}>
                {row.label}
              </span>
            </div>
            <span style={{
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
              color: brandCyan,
            }}>
              +{row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: spacing[3],
        borderTop: `2px solid ${brandCyan}40`,
      }}>
        <span style={{
          fontSize: typography.size.base,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
        }}>
          {isArabic ? 'المجموع' : 'Total'}
        </span>
        <span style={{
          fontSize: typography.size.xl,
          fontWeight: typography.weight.black,
          color: brandCyan,
        }}>
          +{totalPoints}
        </span>
      </div>
    </div>
  );
});
PointsBreakdown.displayName = 'PointsBreakdown';

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL PROGRESS DISPLAY
// ═══════════════════════════════════════════════════════════════════════════

export const LevelProgressDisplay = memo(({
  levelProgress,
  isArabic = false,
}: LevelProgressDisplayProps) => {
  const { currentLevel, currentXP, xpForNextLevel, leveledUp, newLevel } = levelProgress;
  const percentage = (currentXP / xpForNextLevel) * 100;

  const css = `
    @keyframes levelUpPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    @keyframes levelUpGlow {
      0%, 100% { box-shadow: 0 0 0 0 ${brandPurple}40; }
      50% { box-shadow: 0 0 20px 10px ${brandPurple}40; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div style={{
        padding: spacing[4],
        background: leveledUp
          ? `linear-gradient(135deg, ${brandPurple}15, ${brandCyan}10)`
          : colors.surface.card,
        border: `1px solid ${leveledUp ? brandPurple : colors.border.default}`,
        borderRadius: radius.lg,
        animation: leveledUp ? 'levelUpGlow 2s ease-in-out infinite' : 'none',
      }}>
        {leveledUp && (
          <div style={{
            textAlign: 'center',
            marginBottom: spacing[3],
            animation: 'levelUpPulse 1s ease-in-out infinite',
          }}>
            <span style={{
              fontSize: 32,
              display: 'inline-block',
            }}>
              🎉
            </span>
            <div style={{
              fontSize: typography.size.sm,
              fontWeight: typography.weight.black,
              color: brandPurple,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}>
              {isArabic ? 'ارتقيت للمستوى!' : 'Level Up!'}
            </div>
          </div>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[3],
          marginBottom: spacing[3],
        }}>
          {/* Level badge */}
          <div style={{
            width: 56,
            height: 56,
            borderRadius: radius.full,
            background: `linear-gradient(135deg, ${brandPurple}30, ${brandCyan}20)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${brandPurple}`,
          }}>
            <span style={{
              fontSize: typography.size.xl,
              fontWeight: typography.weight.black,
              color: brandPurple,
            }}>
              {leveledUp ? newLevel : currentLevel}
            </span>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
              marginBottom: spacing[1],
            }}>
              {isArabic ? `المستوى ${leveledUp ? newLevel : currentLevel}` : `Level ${leveledUp ? newLevel : currentLevel}`}
            </div>
            <div style={{
              fontSize: typography.size.xs,
              color: colors.text.muted,
            }}>
              {currentXP.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
            </div>
          </div>
        </div>

        {/* XP Progress bar */}
        <div style={{
          height: 8,
          background: colors.border.default,
          borderRadius: radius.full,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${brandPurple}, ${brandCyan})`,
            borderRadius: radius.full,
            transition: transitions.slow,
          }} />
        </div>

        {/* XP to next level */}
        <div style={{
          marginTop: spacing[2],
          fontSize: typography.size.xs,
          color: colors.text.muted,
          textAlign: 'center',
        }}>
          {isArabic
            ? `${(xpForNextLevel - currentXP).toLocaleString()} نقطة خبرة للمستوى التالي`
            : `${(xpForNextLevel - currentXP).toLocaleString()} XP to next level`}
        </div>
      </div>
    </>
  );
});
LevelProgressDisplay.displayName = 'LevelProgressDisplay';

// ═══════════════════════════════════════════════════════════════════════════
// SESSION ACHIEVEMENTS
// ═══════════════════════════════════════════════════════════════════════════

const SessionAchievements = memo(({
  achievements,
  isArabic = false,
}: {
  achievements: SessionAchievement[];
  isArabic: boolean;
}) => {
  const newAchievements = achievements.filter(a => a.isNew);

  if (newAchievements.length === 0) return null;

  const css = `
    @keyframes achievementPop {
      0% { transform: scale(0) rotate(-180deg); opacity: 0; }
      50% { transform: scale(1.2) rotate(10deg); }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
  `;

  const categoryColors: Record<string, string> = {
    performance: brandCyan,
    streak: '#f59e0b',
    milestone: brandPurple,
    mastery: brandPink,
    special: '#22c55e',
  };

  return (
    <>
      <style>{css}</style>
      <div style={{
        padding: spacing[4],
        background: `linear-gradient(135deg, ${brandCyan}08, ${brandPurple}05)`,
        border: `1px solid ${brandCyan}30`,
        borderRadius: radius.lg,
      }}>
        <h4 style={{
          margin: `0 0 ${spacing[3]}px`,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
        }}>
          🏆 {isArabic ? 'إنجازات جديدة!' : 'New Achievements!'}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
          {newAchievements.map((achievement, i) => {
            const color = categoryColors[achievement.category] || brandCyan;
            return (
              <div
                key={achievement.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[3],
                  padding: spacing[3],
                  background: `${color}10`,
                  border: `1px solid ${color}30`,
                  borderRadius: radius.lg,
                  animation: `achievementPop 0.5s ease-out ${i * 0.15}s both`,
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: radius.lg,
                  background: `${color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                }}>
                  {achievement.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.bold,
                    color: colors.text.primary,
                  }}>
                    {isArabic ? achievement.titleAr : achievement.title}
                  </div>
                  {achievement.description && (
                    <div style={{
                      fontSize: typography.size.xs,
                      color: colors.text.secondary,
                    }}>
                      {isArabic ? achievement.descriptionAr : achievement.description}
                    </div>
                  )}
                </div>
                <div style={{
                  padding: `${spacing[1]}px ${spacing[2]}px`,
                  background: color,
                  borderRadius: radius.full,
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color: 'white',
                }}>
                  +{achievement.points}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
});
SessionAchievements.displayName = 'SessionAchievements';

// ═══════════════════════════════════════════════════════════════════════════
// GOAL PROGRESS SECTION
// ═══════════════════════════════════════════════════════════════════════════

const GoalProgressSection = memo(({
  goalProgress,
  isArabic = false,
}: {
  goalProgress: SessionResult['goalProgress'];
  isArabic: boolean;
}) => {
  if (!goalProgress || goalProgress.length === 0) return null;

  return (
    <div style={{
      padding: spacing[4],
      background: colors.surface.card,
      border: `1px solid ${colors.border.default}`,
      borderRadius: radius.lg,
    }}>
      <h4 style={{
        margin: `0 0 ${spacing[3]}px`,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        display: 'flex',
        alignItems: 'center',
        gap: spacing[2],
      }}>
        🎯 {isArabic ? 'تقدم الأهداف' : 'Goal Progress'}
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
        {goalProgress.map((goal) => {
          const progressBefore = (goal.beforeSession / goal.target) * 100;
          const progressAfter = (goal.afterSession / goal.target) * 100;
          const gained = goal.afterSession - goal.beforeSession;

          return (
            <div key={goal.goalId}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: spacing[1],
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                }}>
                  <span style={{
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.bold,
                    color: goal.completed ? '#22c55e' : colors.text.primary,
                  }}>
                    {isArabic ? goal.goalTitleAr : goal.goalTitle}
                  </span>
                  {goal.completed && (
                    <span style={{
                      padding: `${spacing[0.5]}px ${spacing[1.5]}px`,
                      background: '#22c55e',
                      borderRadius: radius.full,
                      fontSize: typography.size.xs,
                      fontWeight: typography.weight.bold,
                      color: 'white',
                    }}>
                      ✓
                    </span>
                  )}
                </div>
                <span style={{
                  fontSize: typography.size.xs,
                  color: '#22c55e',
                  fontWeight: typography.weight.bold,
                }}>
                  +{gained}
                </span>
              </div>
              <div style={{
                height: 6,
                background: colors.border.default,
                borderRadius: radius.full,
                overflow: 'hidden',
                position: 'relative',
              }}>
                {/* Previous progress (lighter) */}
                <div style={{
                  position: 'absolute',
                  height: '100%',
                  width: `${Math.min(progressBefore, 100)}%`,
                  background: brandCyan,
                  opacity: 0.3,
                  borderRadius: radius.full,
                }} />
                {/* Current progress */}
                <div style={{
                  height: '100%',
                  width: `${Math.min(progressAfter, 100)}%`,
                  background: goal.completed ? '#22c55e' : brandCyan,
                  borderRadius: radius.full,
                  transition: transitions.slow,
                }} />
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: spacing[1],
                fontSize: typography.size.xs,
                color: colors.text.muted,
              }}>
                <span>{goal.afterSession}/{goal.target}</span>
                <span>{Math.round(progressAfter)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
GoalProgressSection.displayName = 'GoalProgressSection';

// ═══════════════════════════════════════════════════════════════════════════
// RECOMMENDATIONS SECTION
// ═══════════════════════════════════════════════════════════════════════════

const RecommendationsSection = memo(({
  recommendations,
  isArabic = false,
}: {
  recommendations?: SessionRecommendation[];
  isArabic: boolean;
}) => {
  if (!recommendations || recommendations.length === 0) return null;

  const typeStyles: Record<string, { color: string; bg: string }> = {
    strength: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    improvement: { color: brandPurple, bg: `${brandPurple}10` },
    tip: { color: brandCyan, bg: `${brandCyan}10` },
    challenge: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  };

  return (
    <div style={{
      padding: spacing[4],
      background: colors.surface.card,
      border: `1px solid ${colors.border.default}`,
      borderRadius: radius.lg,
    }}>
      <h4 style={{
        margin: `0 0 ${spacing[3]}px`,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        display: 'flex',
        alignItems: 'center',
        gap: spacing[2],
      }}>
        💡 {isArabic ? 'نصائح لك' : 'Recommendations'}
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
        {recommendations.slice(0, 3).map((rec) => {
          const style = typeStyles[rec.type] || typeStyles.tip;
          return (
            <div
              key={rec.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: spacing[3],
                padding: spacing[3],
                background: style.bg,
                borderRadius: radius.lg,
              }}
            >
              <span style={{ fontSize: 20 }}>{rec.icon}</span>
              <div>
                <div style={{
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.bold,
                  color: style.color,
                  marginBottom: 2,
                }}>
                  {isArabic ? rec.titleAr : rec.title}
                </div>
                <div style={{
                  fontSize: typography.size.xs,
                  color: colors.text.secondary,
                  lineHeight: typography.lineHeight.relaxed,
                }}>
                  {isArabic ? rec.descriptionAr : rec.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
RecommendationsSection.displayName = 'RecommendationsSection';

// ═══════════════════════════════════════════════════════════════════════════
// STREAK DISPLAY
// ═══════════════════════════════════════════════════════════════════════════

const StreakDisplay = memo(({
  streakInfo,
  isArabic = false,
}: {
  streakInfo: SessionResult['streakInfo'];
  isArabic: boolean;
}) => {
  const { current, isNewRecord, streakBonus } = streakInfo;

  if (current <= 0) return null;

  const css = `
    @keyframes streakFlame {
      0%, 100% { transform: scale(1) rotate(-5deg); }
      50% { transform: scale(1.1) rotate(5deg); }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div style={{
        padding: spacing[4],
        background: isNewRecord
          ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))'
          : `rgba(245,158,11,0.1)`,
        border: `1px solid ${isNewRecord ? '#f59e0b' : 'rgba(245,158,11,0.3)'}`,
        borderRadius: radius.lg,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 36,
          marginBottom: spacing[2],
          animation: 'streakFlame 1s ease-in-out infinite',
        }}>
          🔥
        </div>
        <div style={{
          fontSize: typography.size['2xl'],
          fontWeight: typography.weight.black,
          color: '#f59e0b',
          marginBottom: spacing[1],
        }}>
          {current} {isArabic ? 'أيام' : 'Days'}
        </div>
        <div style={{
          fontSize: typography.size.xs,
          color: colors.text.secondary,
        }}>
          {isNewRecord
            ? (isArabic ? '🎉 رقم قياسي جديد!' : '🎉 New Record!')
            : (isArabic ? 'استمر هكذا!' : 'Keep it up!')}
        </div>
        {streakBonus && (
          <div style={{
            marginTop: spacing[2],
            padding: `${spacing[1]}px ${spacing[2]}px`,
            background: '#f59e0b',
            borderRadius: radius.full,
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            color: 'white',
            display: 'inline-block',
          }}>
            +{streakBonus} {isArabic ? 'مكافأة' : 'bonus'}
          </div>
        )}
      </div>
    </>
  );
});
StreakDisplay.displayName = 'StreakDisplay';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SESSION SUMMARY CARD
// ═══════════════════════════════════════════════════════════════════════════

export const SessionSummaryCard = memo(({
  session,
  isArabic = false,
  onClose,
  onPlayAgain,
  onViewDetails,
  variant = 'modal',
}: SessionSummaryCardProps) => {
  const motivationalMessage = session.motivationalMessage || getMotivationalMessage(session.metrics.attentionScore);

  const css = `
    @keyframes summaryEnter {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  const content = (
    <>
      <style>{css}</style>
      <div style={{
        background: variant === 'modal' ? colors.surface.overlay : colors.surface.card,
        borderRadius: radius['2xl'],
        maxWidth: variant === 'modal' ? 500 : '100%',
        width: '100%',
        maxHeight: variant === 'modal' ? '90vh' : 'auto',
        overflow: 'auto',
        animation: 'summaryEnter 0.4s ease-out',
      }}>
        {/* Header */}
        <div style={{
          padding: spacing[5],
          background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
          borderBottom: `1px solid ${colors.border.default}`,
          textAlign: 'center',
          position: 'relative',
        }}>
          {variant === 'modal' && onClose && (
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: spacing[3],
                right: spacing[3],
                background: 'transparent',
                border: 'none',
                fontSize: 20,
                color: colors.text.muted,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          )}

          {/* Motivational message */}
          <div style={{
            fontSize: 48,
            marginBottom: spacing[2],
          }}>
            {motivationalMessage.icon}
          </div>
          <h2 style={{
            margin: `0 0 ${spacing[2]}px`,
            fontSize: typography.size.xl,
            fontWeight: typography.weight.black,
            color: colors.text.primary,
          }}>
            {isArabic ? 'جلسة مكتملة!' : 'Session Complete!'}
          </h2>
          <p style={{
            margin: 0,
            fontSize: typography.size.sm,
            color: colors.text.secondary,
            maxWidth: 300,
            marginInline: 'auto',
          }}>
            {isArabic ? motivationalMessage.messageAr : motivationalMessage.message}
          </p>

          {/* Quick stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: spacing[6],
            marginTop: spacing[4],
          }}>
            <div>
              <div style={{
                fontSize: typography.size['2xl'],
                fontWeight: typography.weight.black,
                color: brandCyan,
              }}>
                +{session.pointsEarned + session.bonusPoints}
              </div>
              <div style={{
                fontSize: typography.size.xs,
                color: colors.text.muted,
              }}>
                {isArabic ? 'نقاط' : 'Points'}
              </div>
            </div>
            <div>
              <div style={{
                fontSize: typography.size['2xl'],
                fontWeight: typography.weight.black,
                color: brandPurple,
              }}>
                {session.duration}
              </div>
              <div style={{
                fontSize: typography.size.xs,
                color: colors.text.muted,
              }}>
                {isArabic ? 'دقائق' : 'Minutes'}
              </div>
            </div>
            <div>
              <div style={{
                fontSize: typography.size['2xl'],
                fontWeight: typography.weight.black,
                color: '#22c55e',
              }}>
                {session.metrics.accuracy}%
              </div>
              <div style={{
                fontSize: typography.size.xs,
                color: colors.text.muted,
              }}>
                {isArabic ? 'دقة' : 'Accuracy'}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{
          padding: spacing[5],
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[4],
        }}>
          {/* Metrics Grid */}
          {variant !== 'compact' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: spacing[3],
            }}>
              <MetricDisplay
                label="Attention"
                labelAr="الانتباه"
                value={session.metrics.attentionScore}
                previousValue={session.metrics.previousAttentionScore}
                icon="🧠"
                color={brandCyan}
                isArabic={isArabic}
              />
              <MetricDisplay
                label="Processing"
                labelAr="المعالجة"
                value={session.metrics.processingSpeed}
                previousValue={session.metrics.previousProcessingSpeed}
                icon="⚡"
                color={brandPurple}
                isArabic={isArabic}
              />
              <MetricDisplay
                label="Auditory"
                labelAr="التمييز السمعي"
                value={session.metrics.auditoryDiscrimination}
                previousValue={session.metrics.previousAuditoryDiscrimination}
                icon="👂"
                color={brandPink}
                isArabic={isArabic}
              />
              <MetricDisplay
                label="Response Time"
                labelAr="وقت الاستجابة"
                value={session.metrics.responseTime}
                previousValue={session.metrics.previousResponseTime}
                maxValue={3}
                unit="s"
                unitAr="ث"
                icon="⏱️"
                color="#22c55e"
                isArabic={isArabic}
              />
            </div>
          )}

          {/* Achievements */}
          <SessionAchievements
            achievements={session.achievements}
            isArabic={isArabic}
          />

          {/* Streak and Level Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: session.streakInfo.current > 0 ? '1fr 1fr' : '1fr',
            gap: spacing[3],
          }}>
            {session.streakInfo.current > 0 && (
              <StreakDisplay
                streakInfo={session.streakInfo}
                isArabic={isArabic}
              />
            )}
            <LevelProgressDisplay
              levelProgress={session.levelProgress}
              isArabic={isArabic}
            />
          </div>

          {/* Points Breakdown */}
          {variant !== 'compact' && (
            <PointsBreakdown
              basePoints={session.pointsEarned}
              bonusPoints={session.bonusPoints}
              streakBonus={session.streakInfo.streakBonus}
              achievements={session.achievements}
              isArabic={isArabic}
            />
          )}

          {/* Goal Progress */}
          <GoalProgressSection
            goalProgress={session.goalProgress}
            isArabic={isArabic}
          />

          {/* Recommendations */}
          {variant !== 'compact' && (
            <RecommendationsSection
              recommendations={session.recommendations}
              isArabic={isArabic}
            />
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: spacing[5],
          borderTop: `1px solid ${colors.border.default}`,
          display: 'flex',
          gap: spacing[3],
        }}>
          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              style={{
                flex: 1,
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
              {isArabic ? 'العب مرة أخرى' : 'Play Again'}
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              style={{
                flex: 1,
                padding: `${spacing[4]}px`,
                background: 'transparent',
                border: `1px solid ${colors.border.default}`,
                borderRadius: radius.lg,
                color: colors.text.secondary,
                fontSize: typography.size.base,
                fontWeight: typography.weight.bold,
                cursor: 'pointer',
                transition: transitions.fast,
              }}
            >
              {isArabic ? 'عرض التفاصيل' : 'View Details'}
            </button>
          )}
          {variant === 'modal' && onClose && !onPlayAgain && !onViewDetails && (
            <button
              onClick={onClose}
              style={{
                flex: 1,
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
              {isArabic ? 'متابعة' : 'Continue'}
            </button>
          )}
        </div>
      </div>
    </>
  );

  if (variant === 'modal') {
    return (
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
        <div onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return content;
});
SessionSummaryCard.displayName = 'SessionSummaryCard';

// ═══════════════════════════════════════════════════════════════════════════
// QUICK SESSION STATS (Compact inline display)
// ═══════════════════════════════════════════════════════════════════════════

export const QuickSessionStats = memo(({
  session,
  isArabic = false,
  onClick,
}: {
  session: SessionResult;
  isArabic?: boolean;
  onClick?: () => void;
}) => {
  const totalPoints = session.pointsEarned + session.bonusPoints + (session.streakInfo.streakBonus || 0);

  return (
    <div
      onClick={onClick}
      style={{
        padding: spacing[4],
        background: colors.surface.card,
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius.xl,
        cursor: onClick ? 'pointer' : 'default',
        transition: transitions.fast,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing[3],
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
        }}>
          <span style={{ fontSize: 20 }}>🎮</span>
          <div>
            <div style={{
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
            }}>
              {isArabic ? session.gameTypeAr : session.gameType}
            </div>
            <div style={{
              fontSize: typography.size.xs,
              color: colors.text.muted,
            }}>
              {new Date(session.date).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
            </div>
          </div>
        </div>
        <div style={{
          fontSize: typography.size.lg,
          fontWeight: typography.weight.black,
          color: brandCyan,
        }}>
          +{totalPoints}
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: spacing[4],
      }}>
        <div style={{
          fontSize: typography.size.xs,
          color: colors.text.secondary,
        }}>
          <span style={{ color: brandCyan, fontWeight: typography.weight.bold }}>
            {session.metrics.attentionScore}%
          </span> {isArabic ? 'انتباه' : 'attention'}
        </div>
        <div style={{
          fontSize: typography.size.xs,
          color: colors.text.secondary,
        }}>
          <span style={{ color: brandPurple, fontWeight: typography.weight.bold }}>
            {session.duration}
          </span> {isArabic ? 'دقائق' : 'min'}
        </div>
        {session.streakInfo.current > 0 && (
          <div style={{
            fontSize: typography.size.xs,
            color: '#f59e0b',
          }}>
            🔥 {session.streakInfo.current}
          </div>
        )}
      </div>
    </div>
  );
});
QuickSessionStats.displayName = 'QuickSessionStats';

export default SessionSummaryCard;
