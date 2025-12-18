/**
 * Gamification Components Index
 * Comprehensive gamification system for the Lotus AIT platform
 */

// Narrative System - Story-based progression tied to clinical milestones
export {
  NarrativeCard,
  StoryProgress,
  ChapterUnlockModal,
  StoryMotivation,
  STORY_CHAPTERS,
  getUnlockedChapters,
  getCurrentChapter,
} from './NarrativeSystem';
export type { StoryChapter } from './NarrativeSystem';

// Leaderboard - Real-time rankings and score comparisons
export {
  Leaderboard,
  RankBadge,
  UserRankCard,
  MOCK_LEADERBOARD,
} from './Leaderboard';
export type { LeaderboardEntry } from './Leaderboard';

// Goal Setting - Personal targets and progress tracking
export {
  GoalCard,
  GoalList,
  GoalCreator,
  GoalSummary,
  GoalCelebration,
  GoalProgressRing,
  PRESET_GOALS,
  MOCK_GOALS,
} from './GoalSetting';
export type { Goal } from './GoalSetting';

// Session Summary - Comprehensive post-session feedback
export {
  SessionSummaryCard,
  MetricDisplay,
  PointsBreakdown,
  LevelProgressDisplay,
  QuickSessionStats,
  MOCK_SESSION_RESULT,
} from './SessionSummary';
export type {
  SessionResult,
  SessionMetrics,
  SessionAchievement,
  SessionRecommendation,
} from './SessionSummary';
