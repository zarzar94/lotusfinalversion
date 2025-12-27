/**
 * NarrativeSystem - Story-based progression tied to clinical milestones
 * Provides narrative context for therapeutic journey
 */

import { memo, useMemo, useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
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
import { renderLabIcon } from '../icons/index';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface StoryChapter {
  id: string;
  number: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  unlockCondition: {
    type: 'sessions' | 'score' | 'streak' | 'achievement' | 'phase';
    value: number | string;
  };
  unlocked: boolean;
  completedAt?: number;
  icon: string;
  reward?: {
    type: 'badge' | 'theme' | 'avatar' | 'title';
    name: string;
    nameAr: string;
    icon: string;
  };
}

interface NarrativeCardProps {
  currentChapter: StoryChapter;
  nextChapter?: StoryChapter;
  totalChapters: number;
  isArabic?: boolean;
  onViewStory?: () => void;
}

interface StoryProgressProps {
  chapters: StoryChapter[];
  currentChapterIndex: number;
  isArabic?: boolean;
  variant?: 'compact' | 'full' | 'timeline';
}

interface ChapterUnlockModalProps {
  chapter: StoryChapter;
  isArabic?: boolean;
  onClose: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// STORY DATA - The Sonic Hero's Journey
// ═══════════════════════════════════════════════════════════════════════════

export const STORY_CHAPTERS: Omit<StoryChapter, 'unlocked' | 'completedAt'>[] = [
  {
    id: 'awakening',
    number: 1,
    title: 'The Awakening',
    titleAr: 'auto.NarrativeSystem.k11',
    description: 'You discover you have the gift of Sonic Sense - the ability to hear what others cannot. Your journey to master this power begins.',
    descriptionAr: 'auto.NarrativeSystem.k12',
    unlockCondition: { type: 'sessions', value: 1 },
    icon: '✨',
    reward: { type: 'title', name: 'Sonic Initiate', nameAr: 'auto.NarrativeSystem.k13', icon: '🎵' },
  },
  {
    id: 'training_begins',
    number: 2,
    title: 'Training Begins',
    titleAr: 'auto.NarrativeSystem.k14',
    description: 'The Sound Masters of Lotus Academy take you under their wing. Each session strengthens your sonic abilities.',
    descriptionAr: 'auto.NarrativeSystem.k15',
    unlockCondition: { type: 'sessions', value: 5 },
    icon: '🎯',
    reward: { type: 'badge', name: 'Dedicated Trainee', nameAr: 'auto.NarrativeSystem.k16', icon: '📚' },
  },
  {
    id: 'first_challenge',
    number: 3,
    title: 'The First Challenge',
    titleAr: 'auto.NarrativeSystem.k17',
    description: 'A mysterious fog of confusion descends upon the kingdom. Only your growing Sonic Sense can pierce through it.',
    descriptionAr: 'auto.NarrativeSystem.k18',
    unlockCondition: { type: 'streak', value: 3 },
    icon: '🌫️',
  },
  {
    id: 'halfway_hero',
    number: 4,
    title: 'Halfway Hero',
    titleAr: 'auto.NarrativeSystem.k19',
    description: 'Your powers have grown remarkably! The kingdom notices your progress. The Sound Masters are proud.',
    descriptionAr: 'auto.NarrativeSystem.k20',
    unlockCondition: { type: 'sessions', value: 10 },
    icon: '⭐',
    reward: { type: 'avatar', name: 'Sonic Warrior', nameAr: 'auto.NarrativeSystem.k21', icon: '🦸' },
  },
  {
    id: 'dark_silence',
    number: 5,
    title: 'The Dark Silence',
    titleAr: 'auto.NarrativeSystem.k22',
    description: 'An ancient entity threatens to steal all sound from the world. Your training intensifies.',
    descriptionAr: 'auto.NarrativeSystem.k23',
    unlockCondition: { type: 'score', value: 70 },
    icon: '🌑',
  },
  {
    id: 'breakthrough',
    number: 6,
    title: 'The Breakthrough',
    titleAr: 'auto.NarrativeSystem.k24',
    description: 'Something clicks! Your mind processes sounds with crystal clarity. Even the masters are impressed.',
    descriptionAr: 'auto.NarrativeSystem.k25',
    unlockCondition: { type: 'sessions', value: 15 },
    icon: '💎',
    reward: { type: 'theme', name: 'Crystal Resonance', nameAr: 'auto.NarrativeSystem.k26', icon: '🔮' },
  },
  {
    id: 'final_trial',
    number: 7,
    title: 'The Final Trial',
    titleAr: 'auto.NarrativeSystem.k27',
    description: 'The ultimate test awaits. Can you use all you\'ve learned to restore harmony to the kingdom?',
    descriptionAr: 'auto.NarrativeSystem.k28',
    unlockCondition: { type: 'sessions', value: 18 },
    icon: '⚔️',
  },
  {
    id: 'sonic_master',
    number: 8,
    title: 'Sonic Master',
    titleAr: 'auto.NarrativeSystem.k29',
    description: 'You have completed your training and become a true Sonic Master! The kingdom celebrates your achievement.',
    descriptionAr: 'auto.NarrativeSystem.k30',
    unlockCondition: { type: 'sessions', value: 20 },
    icon: '🎓',
    reward: { type: 'title', name: 'Sonic Master', nameAr: 'auto.NarrativeSystem.k31', icon: '👑' },
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function getUnlockedChapters(
  sessionsCompleted: number,
  currentStreak: number,
  attentionScore: number
): StoryChapter[] {
  return STORY_CHAPTERS.map((chapter) => {
    let unlocked = false;
    const condition = chapter.unlockCondition;

    switch (condition.type) {
      case 'sessions':
        unlocked = sessionsCompleted >= (condition.value as number);
        break;
      case 'streak':
        unlocked = currentStreak >= (condition.value as number);
        break;
      case 'score':
        unlocked = attentionScore >= (condition.value as number);
        break;
      default:
        unlocked = false;
    }

    return {
      ...chapter,
      unlocked,
      completedAt: unlocked ? Date.now() - Math.random() * 86400000 * 10 : undefined,
    };
  });
}

export function getCurrentChapter(chapters: StoryChapter[]): number {
  const lastUnlocked = chapters.reduce((acc, ch, idx) => (ch.unlocked ? idx : acc), 0);
  return lastUnlocked;
}

// ═══════════════════════════════════════════════════════════════════════════
// NARRATIVE CARD
// ═══════════════════════════════════════════════════════════════════════════

export const NarrativeCard = memo(({
  currentChapter,
  nextChapter,
  totalChapters,
  isArabic = false,
  onViewStory,
}: NarrativeCardProps) => {
  const { t } = useLanguage();
  const progress = ((currentChapter.number) / totalChapters) * 100;

  return (
    <div
      style={{
        padding: spacing[5],
        background: `linear-gradient(135deg, ${brandPurple}15, ${brandCyan}08)`,
        border: `1px solid ${brandPurple}30`,
        borderRadius: radius.xl,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative stars */}
      <div style={{
        position: 'absolute',
        top: spacing[3],
        right: spacing[3],
        opacity: 0.3,
        fontSize: 40,
      }}>
        {renderLabIcon('\u2728', { size: 40, tone: 'pink', glow: true })}
      </div>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[3],
        marginBottom: spacing[4],
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: radius.lg,
          background: `linear-gradient(135deg, ${brandPurple}30, ${brandCyan}20)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
        }}>
          {currentChapter.icon}
        </div>
        <div>
          <div style={{
            fontSize: typography.size.xs,
            color: brandPurple,
            fontWeight: typography.weight.bold,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            {isArabic ? `الفصل ${currentChapter.number}` : `Chapter ${currentChapter.number}`}
          </div>
          <h3 style={{
            margin: 0,
            fontSize: typography.size.xl,
            fontWeight: typography.weight.black,
            color: colors.text.primary,
          }}>
            {isArabic ? t(currentChapter.titleAr, currentChapter.title) : currentChapter.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p style={{
        margin: `0 0 ${spacing[4]}px`,
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        lineHeight: typography.lineHeight.relaxed,
      }}>
        {isArabic ? t(currentChapter.descriptionAr, currentChapter.description) : currentChapter.description}
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: spacing[4] }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: typography.size.xs,
          color: colors.text.muted,
          marginBottom: spacing[1],
        }}>
          <span>{t('auto.NarrativeSystem.k1', "Story Progress")}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{
          height: 6,
          background: colors.border.default,
          borderRadius: radius.full,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${brandPurple}, ${brandCyan})`,
            borderRadius: radius.full,
            transition: transitions.slow,
          }} />
        </div>
      </div>

      {/* Next chapter preview */}
      {nextChapter && !nextChapter.unlocked && (
        <div style={{
          padding: spacing[3],
          background: 'rgba(255,255,255,0.03)',
          border: `1px dashed ${colors.border.subtle}`,
          borderRadius: radius.lg,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[3],
          opacity: 0.7,
        }}>
          <span style={{ fontSize: 24, filter: 'grayscale(1)' }}>{renderLabIcon('\U0001F512', { size: 20, tone: 'muted' })}</span>
          <div>
            <div style={{
              fontSize: typography.size.xs,
              color: colors.text.muted,
            }}>
              {t('auto.NarrativeSystem.k2', "Next Chapter")}
            </div>
            <div style={{
              fontSize: typography.size.sm,
              color: colors.text.secondary,
            }}>
              {isArabic ? t(nextChapter.titleAr, nextChapter.title) : nextChapter.title}
            </div>
          </div>
        </div>
      )}

      {/* Reward display */}
      {currentChapter.reward && (
        <div style={{
          marginTop: spacing[4],
          padding: spacing[3],
          background: `${brandCyan}10`,
          border: `1px solid ${brandCyan}30`,
          borderRadius: radius.lg,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
        }}>
          <span style={{ fontSize: 20 }}>{currentChapter.reward.icon}</span>
          <div>
            <div style={{
              fontSize: typography.size.xs,
              color: brandCyan,
              fontWeight: typography.weight.bold,
            }}>
              {t('auto.NarrativeSystem.k3', "Reward Unlocked")}
            </div>
            <div style={{
              fontSize: typography.size.sm,
              color: colors.text.primary,
            }}>
              {isArabic ? t(currentChapter.reward.nameAr, currentChapter.reward.name) : currentChapter.reward.name}
            </div>
          </div>
        </div>
      )}

      {/* View full story button */}
      {onViewStory && (
        <button
          onClick={onViewStory}
          style={{
            marginTop: spacing[4],
            width: '100%',
            padding: `${spacing[3]}px`,
            background: 'transparent',
            border: `1px solid ${brandPurple}40`,
            borderRadius: radius.lg,
            color: brandPurple,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            cursor: 'pointer',
            transition: transitions.fast,
          }}
        >
          {t('auto.NarrativeSystem.k4', "View Full Story")}
        </button>
      )}
    </div>
  );
});
NarrativeCard.displayName = 'NarrativeCard';

// ═══════════════════════════════════════════════════════════════════════════
// STORY PROGRESS (Timeline View)
// ═══════════════════════════════════════════════════════════════════════════

export const StoryProgress = memo(({
  chapters,
  currentChapterIndex,
  isArabic = false,
  variant = 'compact',
}: StoryProgressProps) => {
  const { t } = useLanguage();
  if (variant === 'compact') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[1],
        padding: spacing[3],
        background: colors.surface.card,
        borderRadius: radius.lg,
        border: `1px solid ${colors.border.default}`,
      }}>
        {chapters.map((chapter, i) => (
          <div
            key={chapter.id}
            style={{
              width: 24,
              height: 24,
              borderRadius: radius.sm,
              background: chapter.unlocked
                ? i === currentChapterIndex
                  ? `linear-gradient(135deg, ${brandPurple}, ${brandCyan})`
                  : `${brandCyan}30`
                : colors.border.default,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              transition: transitions.fast,
            }}
            title={isArabic ? t(chapter.titleAr, chapter.title) : chapter.title}
          >
            {renderLabIcon(chapter.unlocked ? chapter.icon : '\U0001F512', { size: 14, tone: chapter.unlocked ? 'cyan' : 'muted' })}
          </div>
        ))}
      </div>
    );
  }

  // Full timeline view
  return (
    <div style={{
      padding: spacing[5],
      background: colors.surface.card,
      borderRadius: radius.xl,
      border: `1px solid ${colors.border.default}`,
    }}>
      <h3 style={{
        margin: `0 0 ${spacing[4]}px`,
        fontSize: typography.size.lg,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
      }}>
        {t('auto.NarrativeSystem.k5', "Your Journey")}
      </h3>

      <div style={{
        position: 'relative',
        paddingLeft: isArabic ? 0 : spacing[6],
        paddingRight: isArabic ? spacing[6] : 0,
      }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute',
          [isArabic ? 'right' : 'left']: 15,
          top: 0,
          bottom: 0,
          width: 2,
          background: colors.border.default,
        }}>
          <div style={{
            width: '100%',
            height: `${((currentChapterIndex + 1) / chapters.length) * 100}%`,
            background: `linear-gradient(180deg, ${brandPurple}, ${brandCyan})`,
            transition: transitions.slow,
          }} />
        </div>

        {/* Chapters */}
        {chapters.map((chapter, i) => {
          const isCurrent = i === currentChapterIndex;
          const isPast = chapter.unlocked && i < currentChapterIndex;

          return (
            <div
              key={chapter.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: spacing[3],
                marginBottom: i < chapters.length - 1 ? spacing[4] : 0,
                opacity: chapter.unlocked ? 1 : 0.4,
              }}
            >
              {/* Chapter marker */}
              <div style={{
                position: 'absolute',
                [isArabic ? 'right' : 'left']: 0,
                width: 32,
                height: 32,
                borderRadius: radius.full,
                background: isCurrent
                  ? `linear-gradient(135deg, ${brandPurple}, ${brandCyan})`
                  : isPast
                  ? brandCyan
                  : colors.surface.card,
                border: `2px solid ${chapter.unlocked ? brandCyan : colors.border.default}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                boxShadow: isCurrent ? shadows.glow.cyan : 'none',
              }}>
                {renderLabIcon(chapter.unlocked ? chapter.icon : '\U0001F512', { size: 14, tone: chapter.unlocked ? 'cyan' : 'muted' })}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: typography.size.xs,
                  color: isCurrent ? brandPurple : colors.text.muted,
                  fontWeight: typography.weight.bold,
                  marginBottom: 2,
                }}>
                  {isArabic ? `الفصل ${chapter.number}` : `Chapter ${chapter.number}`}
                </div>
                <div style={{
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.semibold,
                  color: chapter.unlocked ? colors.text.primary : colors.text.muted,
                }}>
                  {isArabic ? t(chapter.titleAr, chapter.title) : chapter.title}
                </div>
                {chapter.reward && chapter.unlocked && (
                  <div style={{
                    marginTop: spacing[1],
                    fontSize: typography.size.xs,
                    color: brandCyan,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[1],
                  }}>
                    <span>{chapter.reward.icon}</span>
                    {isArabic ? t(chapter.reward.nameAr, chapter.reward.name) : chapter.reward.name}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
StoryProgress.displayName = 'StoryProgress';

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER UNLOCK MODAL
// ═══════════════════════════════════════════════════════════════════════════

export const ChapterUnlockModal = memo(({
  chapter,
  isArabic = false,
  onClose,
}: ChapterUnlockModalProps) => {
  const { t } = useLanguage();
  const css = `
    @keyframes chapterReveal {
      0% { opacity: 0; transform: scale(0.8) rotate(-10deg); }
      50% { transform: scale(1.1) rotate(5deg); }
      100% { opacity: 1; transform: scale(1) rotate(0deg); }
    }
    @keyframes sparkle {
      0%, 100% { opacity: 0; transform: scale(0); }
      50% { opacity: 1; transform: scale(1); }
    }
  `;

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
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: `linear-gradient(135deg, ${colors.surface.overlay}, ${brandPurple}10)`,
            borderRadius: radius['2xl'],
            maxWidth: 400,
            width: '100%',
            padding: spacing[8],
            textAlign: 'center',
            position: 'relative',
            border: `1px solid ${brandPurple}30`,
            animation: 'chapterReveal 0.6s ease-out',
          }}
        >
          {/* Sparkles */}
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                fontSize: 20,
                animation: `sparkle 1.5s ease-in-out ${i * 0.2}s infinite`,
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
              }}
            >
              {renderLabIcon('\u2728', { size: 20, tone: 'pink' })}
            </span>
          ))}

          {/* Chapter icon */}
          <div style={{
            width: 100,
            height: 100,
            margin: '0 auto',
            marginBottom: spacing[4],
            borderRadius: radius.xl,
            background: `linear-gradient(135deg, ${brandPurple}30, ${brandCyan}20)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            boxShadow: shadows.glow.purple,
          }}>
            {renderLabIcon(chapter.icon, { size: 48, tone: 'purple', glow: true })}
          </div>

          {/* Title */}
          <div style={{
            fontSize: typography.size.sm,
            color: brandPurple,
            fontWeight: typography.weight.bold,
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginBottom: spacing[2],
          }}>
            {t('auto.NarrativeSystem.k6', "New Chapter Unlocked!")}
          </div>
          <h2 style={{
            margin: `0 0 ${spacing[3]}px`,
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
          }}>
            {isArabic ? t(chapter.titleAr, chapter.title) : chapter.title}
          </h2>
          <p style={{
            margin: `0 0 ${spacing[5]}px`,
            fontSize: typography.size.sm,
            color: colors.text.secondary,
            lineHeight: typography.lineHeight.relaxed,
          }}>
            {isArabic ? t(chapter.descriptionAr, chapter.description) : chapter.description}
          </p>

          {/* Reward */}
          {chapter.reward && (
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
                {renderLabIcon('\U0001F381', { size: 16, tone: 'pink' })} {t('auto.NarrativeSystem.k7', "Special Reward")}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing[2],
              }}>
                <span style={{ fontSize: 24 }}>{renderLabIcon(chapter.reward.icon, { size: 24, tone: 'cyan' })}</span>
                <span style={{
                  fontSize: typography.size.lg,
                  fontWeight: typography.weight.bold,
                  color: colors.text.primary,
                }}>
                  {isArabic ? t(chapter.reward.nameAr, chapter.reward.name) : chapter.reward.name}
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
              background: `linear-gradient(135deg, ${brandPurple}, ${brandCyan})`,
              border: 'none',
              borderRadius: radius.lg,
              color: colors.surface.base,
              fontSize: typography.size.base,
              fontWeight: typography.weight.bold,
              cursor: 'pointer',
              transition: transitions.fast,
            }}
          >
            {t('auto.NarrativeSystem.k8', "Continue Adventure")}
          </button>
        </div>
      </div>
    </>
  );
});
ChapterUnlockModal.displayName = 'ChapterUnlockModal';

// ═══════════════════════════════════════════════════════════════════════════
// STORY MOTIVATION MESSAGE
// ═══════════════════════════════════════════════════════════════════════════

interface StoryMotivationProps {
  sessionsCompleted: number;
  currentStreak: number;
  attentionScore: number;
  isArabic?: boolean;
}

export const StoryMotivation = memo(({
  sessionsCompleted,
  currentStreak,
  attentionScore,
  isArabic = false,
}: StoryMotivationProps) => {
  const { t } = useLanguage();
  const chapters = getUnlockedChapters(sessionsCompleted, currentStreak, attentionScore);
  const currentIndex = getCurrentChapter(chapters);
  const nextChapter = chapters[currentIndex + 1];

  if (!nextChapter) {
    return (
      <div style={{
        padding: spacing[3],
        background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
        borderRadius: radius.lg,
        border: `1px solid ${brandCyan}30`,
        fontSize: typography.size.sm,
        color: colors.text.secondary,
        textAlign: 'center',
      }}>
        {renderLabIcon('\U0001F393', { size: 16, tone: 'warning' })} {t('auto.NarrativeSystem.k9', "You're a true Sonic Master! Keep training to maintain your powers.")}
      </div>
    );
  }

  // Calculate what's needed for next chapter
  const condition = nextChapter.unlockCondition;
  let message = '';

  switch (condition.type) {
    case 'sessions': {
      const sessionsNeeded = (condition.value as number) - sessionsCompleted;
      message = isArabic
        ? `${sessionsNeeded} جلسات أخرى لفتح "${nextChapter.titleAr}"`
        : `${sessionsNeeded} more session${sessionsNeeded > 1 ? 's' : ''} to unlock "${nextChapter.title}"`;
      break;
    }
    case 'streak': {
      const streakNeeded = (condition.value as number) - currentStreak;
      message = isArabic
        ? `حافظ على استمراريتك لـ ${streakNeeded} أيام أخرى!`
        : `Keep your streak going for ${streakNeeded} more day${streakNeeded > 1 ? 's' : ''}!`;
      break;
    }
    case 'score': {
      const scoreNeeded = (condition.value as number) - attentionScore;
      message = isArabic
        ? `تحسين درجة الانتباه بمقدار ${scoreNeeded} نقطة`
        : `Improve attention score by ${scoreNeeded} points`;
      break;
    }
  }

  return (
    <div style={{
      padding: spacing[3],
      background: `linear-gradient(135deg, ${brandPurple}10, ${brandCyan}05)`,
      borderRadius: radius.lg,
      border: `1px dashed ${brandPurple}30`,
      display: 'flex',
      alignItems: 'center',
      gap: spacing[3],
    }}>
      <span style={{ fontSize: 24, opacity: 0.5 }}>{nextChapter.icon}</span>
      <div>
        <div style={{
          fontSize: typography.size.xs,
          color: brandPurple,
          fontWeight: typography.weight.bold,
          marginBottom: 2,
        }}>
          {t('auto.NarrativeSystem.k10', "Next Chapter")}
        </div>
        <div style={{
          fontSize: typography.size.sm,
          color: colors.text.secondary,
        }}>
          {message}
        </div>
      </div>
    </div>
  );
});
StoryMotivation.displayName = 'StoryMotivation';

export default NarrativeCard;
