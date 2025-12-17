/**
 * Enhanced Gamification Scoring System
 * Provides points, combos, star ratings, and clinical metrics for the assessment games
 */

import type { GameResult, TestOutcome } from './types';

// ==================== POINTS SYSTEM ====================

/** Points awarded for different actions in attention test */
export const ATTENTION_POINTS = {
  hit: 100,           // Correct target detection
  correctReject: 25,  // Correctly ignoring non-target
  falseAlarm: -50,    // False positive
  miss: -25,          // Missed target
  comboBonus: 50,     // Bonus per streak level
  speedBonus: 25,     // Fast accurate response
} as const;

/** Points for frequency discrimination test */
export const FREQUENCY_POINTS = {
  correct: 100,
  incorrect: -25,
  hardDifficultyBonus: 50,  // When delta < 30Hz
  consistencyBonus: 100,    // For consistent performance
} as const;

/** Points for sequencing test */
export const SEQUENCE_POINTS = {
  correctSequence: 150,
  wrongSequence: -25,
  noReplayBonus: 50,        // Completed without replay
  longSpanBonus: 100,       // For span >= 4
  perfectRoundBonus: 200,   // Perfect accuracy this round
} as const;

// ==================== COMBO SYSTEM ====================

export interface ComboState {
  streak: number;
  maxStreak: number;
  lastAction: 'hit' | 'miss' | 'fa' | 'cr' | null;
  multiplier: number;
}

export const createComboState = (): ComboState => ({
  streak: 0,
  maxStreak: 0,
  lastAction: null,
  multiplier: 1,
});

export const updateCombo = (
  state: ComboState,
  action: 'hit' | 'miss' | 'fa' | 'cr'
): ComboState => {
  const isPositive = action === 'hit' || action === 'cr';

  if (isPositive) {
    const newStreak = state.streak + 1;
    return {
      streak: newStreak,
      maxStreak: Math.max(state.maxStreak, newStreak),
      lastAction: action,
      multiplier: Math.min(3, 1 + Math.floor(newStreak / 5) * 0.5), // 1x -> 1.5x -> 2x -> 2.5x -> 3x
    };
  } else {
    return {
      ...state,
      streak: 0,
      lastAction: action,
      multiplier: 1,
    };
  }
};

// ==================== STAR RATING SYSTEM ====================

export type StarRating = 1 | 2 | 3;

export const getStarRating = (result: GameResult): StarRating => {
  switch (result) {
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
  }
};

export const getStarEmoji = (rating: StarRating): string => {
  return '⭐'.repeat(rating) + '☆'.repeat(3 - rating);
};

// ==================== AUDITORY FATIGUE INDEX ====================

export interface FatigueAnalysis {
  earlyPerformance: {
    hitRate: number;
    avgRt: number;
    trials: number;
  };
  latePerformance: {
    hitRate: number;
    avgRt: number;
    trials: number;
  };
  rtIncrease: number;      // % increase in reaction time
  hitRateDrop: number;     // Drop in hit rate
  fatigueIndex: 'low' | 'moderate' | 'high';
  fatigueScore: number;    // 0-100, higher = more fatigue
}

/**
 * Calculate Auditory Fatigue Index by comparing early vs late trial performance
 * @param trials Array of trial data with isTarget, responseType, rtMs
 * @returns Fatigue analysis with clinical interpretation
 */
export const calculateFatigueIndex = (
  trials: Array<{
    isTarget?: boolean;
    target?: boolean;
    responseType?: 'hit' | 'fa' | 'miss' | 'cr';
    rtMs?: number | null;
  }>
): FatigueAnalysis => {
  const midpoint = Math.floor(trials.length / 2);

  const earlyTrials = trials.slice(0, midpoint);
  const lateTrials = trials.slice(midpoint);

  const getStats = (t: typeof trials) => {
    const targetTrials = t.filter(x => x.isTarget || x.target);
    const hits = targetTrials.filter(x => x.responseType === 'hit');
    const rts = hits.map(x => x.rtMs).filter((rt): rt is number => typeof rt === 'number' && rt > 0);

    return {
      hitRate: targetTrials.length > 0 ? hits.length / targetTrials.length : 0,
      avgRt: rts.length > 0 ? rts.reduce((a, b) => a + b, 0) / rts.length : 0,
      trials: t.length,
    };
  };

  const early = getStats(earlyTrials);
  const late = getStats(lateTrials);

  // Calculate fatigue indicators
  const rtIncrease = early.avgRt > 0
    ? ((late.avgRt - early.avgRt) / early.avgRt) * 100
    : 0;

  const hitRateDrop = (early.hitRate - late.hitRate) * 100;

  // Composite fatigue score (0-100)
  // Higher RT increase and hit rate drop = more fatigue
  const rtComponent = Math.min(50, Math.max(0, rtIncrease));  // 0-50 points from RT
  const hitComponent = Math.min(50, Math.max(0, hitRateDrop * 2)); // 0-50 points from hits
  const fatigueScore = Math.round(rtComponent + hitComponent);

  // Classify fatigue level
  let fatigueIndex: 'low' | 'moderate' | 'high';
  if (fatigueScore < 25) {
    fatigueIndex = 'low';
  } else if (fatigueScore < 50) {
    fatigueIndex = 'moderate';
  } else {
    fatigueIndex = 'high';
  }

  return {
    earlyPerformance: early,
    latePerformance: late,
    rtIncrease: Math.round(rtIncrease * 10) / 10,
    hitRateDrop: Math.round(hitRateDrop * 10) / 10,
    fatigueIndex,
    fatigueScore,
  };
};

// ==================== SESSION STORAGE ====================

const SESSION_STORAGE_KEY = 'berard-ait-sessions';
const MAX_STORED_SESSIONS = 50;

export interface StoredSession {
  id: string;
  date: number;
  outcomes: Partial<Record<string, TestOutcome>>;
  compositeResult?: GameResult;
  totalPoints?: number;
  achievements?: string[];
}

export const saveSession = (session: StoredSession): void => {
  try {
    const existing = getSessions();
    const updated = [session, ...existing].slice(0, MAX_STORED_SESSIONS);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save session:', e);
  }
};

export const getSessions = (): StoredSession[] => {
  try {
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const getSessionById = (id: string): StoredSession | undefined => {
  return getSessions().find(s => s.id === id);
};

export const clearSessions = (): void => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

// ==================== PROGRESS ANALYSIS ====================

export interface ProgressTrend {
  testKey: string;
  sessions: Array<{
    date: number;
    result: GameResult;
    score: number;
  }>;
  improvement: number; // % change from first to last
  trend: 'improving' | 'stable' | 'declining';
  bestResult: GameResult;
  averageScore: number;
}

export const analyzeProgress = (testKey: string): ProgressTrend | null => {
  const sessions = getSessions();
  const relevantSessions = sessions
    .filter(s => s.outcomes[testKey])
    .map(s => ({
      date: s.date,
      result: s.outcomes[testKey]!.result,
      score: extractNumericScore(s.outcomes[testKey]!.scoreLabel),
    }))
    .reverse(); // Oldest first

  if (relevantSessions.length < 2) return null;

  const first = relevantSessions[0];
  const last = relevantSessions[relevantSessions.length - 1];

  const improvement = first.score > 0
    ? ((last.score - first.score) / first.score) * 100
    : 0;

  const resultScores = { high: 3, medium: 2, low: 1 };
  const bestResult = relevantSessions.reduce((best, s) =>
    resultScores[s.result] > resultScores[best] ? s.result : best,
    'low' as GameResult
  );

  const averageScore = relevantSessions.reduce((sum, s) => sum + s.score, 0) / relevantSessions.length;

  let trend: 'improving' | 'stable' | 'declining';
  if (improvement > 10) trend = 'improving';
  else if (improvement < -10) trend = 'declining';
  else trend = 'stable';

  return {
    testKey,
    sessions: relevantSessions,
    improvement: Math.round(improvement),
    trend,
    bestResult,
    averageScore: Math.round(averageScore),
  };
};

const extractNumericScore = (scoreLabel: string): number => {
  // Try to extract first number from score label like "85/100" or "Span=4"
  const match = scoreLabel.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

// ==================== ACHIEVEMENT TRIGGERS ====================

export type GameAchievement = {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  points: number;
  condition: (outcomes: Partial<Record<string, TestOutcome>>) => boolean;
};

export const GAME_ACHIEVEMENTS: GameAchievement[] = [
  {
    id: 'sharp_ears',
    title: 'Sharp Ears',
    titleAr: 'سمع حاد',
    description: 'Achieve High score in frequency discrimination',
    descriptionAr: 'حقق نتيجة عالية في تمييز التردد',
    icon: '👂',
    points: 50,
    condition: (o) => o.frequency?.result === 'high',
  },
  {
    id: 'focused_mind',
    title: 'Focused Mind',
    titleAr: 'عقل مركّز',
    description: 'Achieve High score in attention test',
    descriptionAr: 'حقق نتيجة عالية في اختبار الانتباه',
    icon: '🎯',
    points: 50,
    condition: (o) => o.attention?.result === 'high',
  },
  {
    id: 'memory_master',
    title: 'Memory Master',
    titleAr: 'سيد الذاكرة',
    description: 'Achieve span of 5 in sequencing test',
    descriptionAr: 'حقق تسلسل من 5 في اختبار الذاكرة',
    icon: '🧠',
    points: 75,
    condition: (o) => {
      const span = o.sequence?.metrics?.maxSpan;
      return typeof span === 'number' && span >= 5;
    },
  },
  {
    id: 'triple_crown',
    title: 'Triple Crown',
    titleAr: 'التاج الثلاثي',
    description: 'Achieve High in all three objective tests',
    descriptionAr: 'حقق نتيجة عالية في الاختبارات الثلاثة',
    icon: '👑',
    points: 150,
    condition: (o) =>
      o.attention?.result === 'high' &&
      o.frequency?.result === 'high' &&
      o.sequence?.result === 'high',
  },
  {
    id: 'no_fatigue',
    title: 'Endurance Champion',
    titleAr: 'بطل التحمل',
    description: 'Complete attention test with low fatigue',
    descriptionAr: 'أكمل اختبار الانتباه بإرهاق منخفض',
    icon: '💪',
    points: 50,
    condition: (o) => {
      const fatigue = o.attention?.metrics?.fatigueIndex;
      return fatigue === 'low';
    },
  },
  {
    id: 'speed_demon',
    title: 'Quick Thinker',
    titleAr: 'سريع التفكير',
    description: 'Average reaction time under 400ms in attention test',
    descriptionAr: 'متوسط وقت استجابة أقل من 400مللي ثانية',
    icon: '⚡',
    points: 50,
    condition: (o) => {
      const rt = o.attention?.metrics?.avgReactionMs;
      return typeof rt === 'number' && rt < 400;
    },
  },
  {
    id: 'perfect_sequence',
    title: 'Perfect Memory',
    titleAr: 'ذاكرة مثالية',
    description: '100% accuracy in sequencing test',
    descriptionAr: '100% دقة في اختبار التسلسل',
    icon: '💯',
    points: 100,
    condition: (o) => {
      const acc = o.sequence?.metrics?.accuracyPct;
      return acc === 100;
    },
  },
  {
    id: 'improvement_star',
    title: 'Rising Star',
    titleAr: 'نجم صاعد',
    description: 'Show improvement in any test over 3 sessions',
    descriptionAr: 'أظهر تحسناً في أي اختبار خلال 3 جلسات',
    icon: '📈',
    points: 75,
    condition: () => {
      // Check for improvement trends
      for (const key of ['attention', 'frequency', 'sequence']) {
        const trend = analyzeProgress(key);
        if (trend && trend.sessions.length >= 3 && trend.trend === 'improving') {
          return true;
        }
      }
      return false;
    },
  },
];

export const checkGameAchievements = (
  outcomes: Partial<Record<string, TestOutcome>>
): GameAchievement[] => {
  return GAME_ACHIEVEMENTS.filter(a => a.condition(outcomes));
};
