/**
 * Enhanced Gamification Scoring System
 *
 * This module provides the complete scoring infrastructure for the Bérard AIT
 * auditory processing assessment suite. It includes:
 *
 * - **Points System**: Gamified scoring for each test type (attention, frequency, sequencing)
 * - **Combo System**: Streak-based multipliers to encourage consistent performance
 * - **Star Rating**: Visual feedback mapping clinical results to 1-3 star ratings
 * - **Fatigue Analysis**: Clinical algorithm to detect auditory fatigue during testing
 * - **Session Storage**: LocalStorage persistence for tracking progress across sessions
 * - **Progress Trends**: Analysis of improvement/decline patterns over multiple sessions
 * - **Achievements**: Gamification badges earned for reaching clinical milestones
 *
 * ## Clinical Context
 *
 * The fatigue analysis is particularly important for Auditory Integration Training (AIT)
 * assessments. Individuals with auditory processing difficulties often show:
 * - Increased reaction times as tests progress (RT drift)
 * - Declining accuracy in later portions of tests
 * - High response time variability
 *
 * These patterns are quantified in the `FatigueAnalysis` interface and used to
 * adjust scores and provide clinical insights.
 *
 * @module scoring
 * @see {@link types.ts} for TestOutcome and GameResult type definitions
 * @see {@link stats.ts} for statistical helper functions (mean, stdDev)
 */

import type { GameResult, TestOutcome } from './types';
import { mean, stdDev } from './stats';
import { notifyLocalChange } from '../../utils/sync';

// ==================== POINTS SYSTEM ====================

/**
 * Points awarded for different actions in the Attention Test (Go/No-Go paradigm).
 *
 * The attention test presents target and non-target tones. Participants must
 * respond to targets (Go) and withhold responses to non-targets (No-Go).
 *
 * @property {number} hit - Points for correctly responding to a target tone (+100)
 * @property {number} correctReject - Points for correctly ignoring a non-target (+25)
 * @property {number} falseAlarm - Penalty for responding to a non-target (-50, more severe as it indicates impulsivity)
 * @property {number} miss - Penalty for failing to respond to a target (-25)
 * @property {number} comboBonus - Additional points per streak level (+50)
 * @property {number} speedBonus - Bonus for fast accurate responses under threshold (+25)
 *
 * @example
 * // Calculate score for a hit with speed bonus and 2x combo
 * const basePoints = ATTENTION_POINTS.hit; // 100
 * const withSpeed = basePoints + ATTENTION_POINTS.speedBonus; // 125
 * const withCombo = withSpeed * 2; // 250
 */
export const ATTENTION_POINTS = {
  hit: 100,           // Correct target detection
  correctReject: 25,  // Correctly ignoring non-target
  falseAlarm: -50,    // False positive (penalized more heavily - indicates impulsivity)
  miss: -25,          // Missed target
  comboBonus: 50,     // Bonus per streak level
  speedBonus: 25,     // Fast accurate response (RT < threshold)
} as const;

/**
 * Points awarded in the Frequency Discrimination Test.
 *
 * This test measures the ability to detect differences between two tones
 * of slightly different frequencies - a key auditory processing skill.
 *
 * @property {number} correct - Points for correctly identifying the higher/different tone (+100)
 * @property {number} incorrect - Penalty for wrong answer (-25)
 * @property {number} hardDifficultyBonus - Bonus when discriminating small differences <30Hz (+50)
 * @property {number} consistencyBonus - Bonus for maintaining consistent accuracy across trials (+100)
 *
 * @example
 * // Hard trial with 20Hz difference
 * const deltHz = 20;
 * const points = FREQUENCY_POINTS.correct + (deltaHz < 30 ? FREQUENCY_POINTS.hardDifficultyBonus : 0);
 * // Result: 150 points
 */
export const FREQUENCY_POINTS = {
  correct: 100,
  incorrect: -25,
  hardDifficultyBonus: 50,  // When delta < 30Hz (fine discrimination)
  consistencyBonus: 100,    // For consistent performance across trials
} as const;

/**
 * Points awarded in the Auditory Sequencing Test.
 *
 * This test assesses auditory working memory by requiring participants
 * to recall and reproduce sequences of tones in the correct order.
 * Span length increases adaptively based on performance.
 *
 * @property {number} correctSequence - Points for reproducing a sequence correctly (+150)
 * @property {number} wrongSequence - Penalty for incorrect sequence (-25)
 * @property {number} noReplayBonus - Bonus for completing without using replay function (+50)
 * @property {number} longSpanBonus - Bonus for successfully completing span ≥4 items (+100)
 * @property {number} perfectRoundBonus - Bonus for 100% accuracy in a round (+200)
 *
 * @example
 * // Perfect round with span 5, no replay
 * const points = SEQUENCE_POINTS.correctSequence  // 150
 *              + SEQUENCE_POINTS.noReplayBonus    // +50
 *              + SEQUENCE_POINTS.longSpanBonus    // +100 (span >= 4)
 *              + SEQUENCE_POINTS.perfectRoundBonus; // +200
 * // Total: 500 points
 */
export const SEQUENCE_POINTS = {
  correctSequence: 150,
  wrongSequence: -25,
  noReplayBonus: 50,        // Completed without replay
  longSpanBonus: 100,       // For span >= 4
  perfectRoundBonus: 200,   // Perfect accuracy this round
} as const;

// ==================== COMBO SYSTEM ====================

/**
 * Represents the current state of a player's combo streak.
 *
 * The combo system encourages consistent performance by multiplying points
 * for consecutive correct responses. This gamification element helps maintain
 * engagement during the assessment.
 *
 * @interface ComboState
 * @property {number} streak - Current consecutive correct response count (resets on errors)
 * @property {number} maxStreak - Highest streak achieved during the session (never resets)
 * @property {'hit'|'miss'|'fa'|'cr'|null} lastAction - The most recent response type:
 *   - 'hit': Correct target detection
 *   - 'miss': Missed target
 *   - 'fa': False alarm (responded to non-target)
 *   - 'cr': Correct rejection (ignored non-target)
 * @property {number} multiplier - Current score multiplier (1.0 to 3.0)
 */
export interface ComboState {
  streak: number;
  maxStreak: number;
  lastAction: 'hit' | 'miss' | 'fa' | 'cr' | null;
  multiplier: number;
}

/**
 * Creates a fresh combo state for a new session.
 *
 * @returns {ComboState} Initial combo state with streak=0 and multiplier=1x
 *
 * @example
 * const combo = createComboState();
 * // { streak: 0, maxStreak: 0, lastAction: null, multiplier: 1 }
 */
export const createComboState = (): ComboState => ({
  streak: 0,
  maxStreak: 0,
  lastAction: null,
  multiplier: 1,
});

/**
 * Updates the combo state based on the latest trial response.
 *
 * ## Multiplier Progression
 * The multiplier increases every 5 consecutive correct responses:
 * - Streak 0-4: 1.0x
 * - Streak 5-9: 1.5x
 * - Streak 10-14: 2.0x
 * - Streak 15-19: 2.5x
 * - Streak 20+: 3.0x (maximum)
 *
 * ## Streak Rules
 * - Positive actions (hit, cr) increment the streak
 * - Negative actions (miss, fa) reset the streak to 0 and multiplier to 1x
 * - maxStreak is preserved across resets
 *
 * @param {ComboState} state - Current combo state
 * @param {'hit'|'miss'|'fa'|'cr'} action - The response type from the latest trial
 * @returns {ComboState} Updated combo state
 *
 * @example
 * let combo = createComboState();
 * combo = updateCombo(combo, 'hit');  // streak: 1, multiplier: 1.0x
 * combo = updateCombo(combo, 'hit');  // streak: 2, multiplier: 1.0x
 * // ...after 5 hits...
 * combo = updateCombo(combo, 'hit');  // streak: 5, multiplier: 1.5x
 * combo = updateCombo(combo, 'miss'); // streak: 0, multiplier: 1.0x, maxStreak preserved
 */
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
      // Multiplier formula: 1x -> 1.5x -> 2x -> 2.5x -> 3x (every 5 correct)
      multiplier: Math.min(3, 1 + Math.floor(newStreak / 5) * 0.5),
    };
  } else {
    // Negative action: reset streak and multiplier, preserve maxStreak
    return {
      ...state,
      streak: 0,
      lastAction: action,
      multiplier: 1,
    };
  }
};

// ==================== STAR RATING SYSTEM ====================

/**
 * Numeric star rating mapped from clinical results.
 * Used for visual feedback and gamification display.
 *
 * @typedef {1|2|3} StarRating
 * - 1 star: Low performance (needs attention)
 * - 2 stars: Medium performance (typical)
 * - 3 stars: High performance (above average)
 */
export type StarRating = 1 | 2 | 3;

/**
 * Converts a clinical GameResult to a numeric star rating.
 *
 * @param {GameResult} result - The clinical result classification ('high'|'medium'|'low')
 * @returns {StarRating} Corresponding star rating (3, 2, or 1)
 *
 * @example
 * getStarRating('high');   // Returns 3
 * getStarRating('medium'); // Returns 2
 * getStarRating('low');    // Returns 1
 */
export const getStarRating = (result: GameResult): StarRating => {
  switch (result) {
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
  }
};

/**
 * Generates a visual star emoji representation for display.
 *
 * @param {StarRating} rating - The star rating (1-3)
 * @returns {string} Emoji string with filled stars followed by empty stars
 *
 * @example
 * getStarEmoji(3); // Returns '⭐⭐⭐'
 * getStarEmoji(2); // Returns '⭐⭐☆'
 * getStarEmoji(1); // Returns '⭐☆☆'
 */
export const getStarEmoji = (rating: StarRating): string => {
  return '⭐'.repeat(rating) + '☆'.repeat(3 - rating);
};

// ==================== AUDITORY FATIGUE INDEX ====================

/**
 * Performance metrics for a single quadrant (quarter) of the test session.
 *
 * The test is divided into 4 quadrants (Q1-Q4) to track how performance
 * changes over time. This granular analysis helps identify fatigue patterns.
 *
 * @interface QuadrantPerformance
 * @property {number} hitRate - Proportion of targets correctly detected (0.0-1.0)
 * @property {number} avgRt - Average reaction time in milliseconds for hits
 * @property {number} rtVariability - Coefficient of variation (CV%) of reaction times
 * @property {number} trials - Total number of trials in this quadrant
 */
export interface QuadrantPerformance {
  hitRate: number;
  avgRt: number;
  rtVariability: number;  // Standard deviation of RTs expressed as CV%
  trials: number;
}

/**
 * Comprehensive fatigue analysis results from the attention test.
 *
 * ## Clinical Significance
 *
 * Auditory fatigue is a key indicator in AIT assessments. Individuals with
 * auditory processing difficulties often show:
 * - Declining accuracy in later test portions
 * - Increasing reaction times as the test progresses
 * - Higher response time variability
 *
 * This analysis quantifies these patterns to provide actionable clinical insights.
 *
 * ## Scoring Algorithm
 *
 * The fatigueScore (0-100) is computed from four components, each contributing up to 25 points:
 * 1. **RT Increase Component**: Percentage increase in reaction time (late vs early)
 * 2. **Hit Rate Drop Component**: Decrease in accuracy (late vs early)
 * 3. **Variability Component**: Coefficient of variation of all RTs (penalized if >15%)
 * 4. **Drift Component**: Linear slope trends across quadrants
 *
 * @interface FatigueAnalysis
 * @property {object} earlyPerformance - Performance in first half of test
 * @property {object} latePerformance - Performance in second half of test
 * @property {QuadrantPerformance[]} [quadrants] - Detailed Q1-Q4 breakdown
 * @property {number} rtIncrease - Percentage increase in RT (late vs early). Positive = slowing
 * @property {number} hitRateDrop - Drop in hit rate as percentage points. Positive = declining
 * @property {number} rtVariability - Overall RT coefficient of variation (CV%). Higher = less consistent
 * @property {number} rtDriftSlope - Linear slope of RT across Q1-Q4. Positive = progressive slowing
 * @property {number} accuracyDriftSlope - Linear slope of accuracy across Q1-Q4. Negative = declining
 * @property {'low'|'moderate'|'high'} fatigueIndex - Categorical fatigue classification
 * @property {number} fatigueScore - Composite fatigue score (0-100, higher = more fatigue)
 * @property {'strong'|'moderate'|'weak'} sustainedAttention - Overall attention sustainability rating
 */
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
  /** Quadrant analysis (Q1-Q4) for granular performance tracking */
  quadrants?: QuadrantPerformance[];
  rtIncrease: number;      // % increase in reaction time (late vs early)
  hitRateDrop: number;     // Drop in hit rate as percentage points
  rtVariability: number;   // Overall RT variability as coefficient of variation (CV%)
  rtDriftSlope: number;    // Linear slope of RT across quadrants (ms per quadrant)
  accuracyDriftSlope: number; // Linear slope of accuracy across quadrants
  fatigueIndex: 'low' | 'moderate' | 'high';
  fatigueScore: number;    // 0-100, higher = more fatigue
  sustainedAttention: 'strong' | 'moderate' | 'weak'; // Overall sustained attention rating
}

/**
 * Calculates the Coefficient of Variation (CV) for reaction times.
 *
 * CV is a standardized measure of dispersion that expresses variability
 * relative to the mean. It's useful for comparing variability across
 * individuals with different baseline reaction times.
 *
 * ## Formula
 * CV = (Standard Deviation / Mean) × 100
 *
 * ## Clinical Interpretation
 * - CV < 15%: Consistent performance (good sustained attention)
 * - CV 15-25%: Moderate variability (typical range)
 * - CV > 25%: High variability (may indicate attention difficulties)
 *
 * @param {number[]} rts - Array of reaction times in milliseconds
 * @returns {number} Coefficient of variation as a percentage (0-100+)
 *
 * @example
 * const rts = [350, 380, 360, 370, 355];
 * const cv = calculateRtVariability(rts); // ~3.6% - very consistent
 *
 * const variableRts = [300, 500, 350, 600, 400];
 * const cv2 = calculateRtVariability(variableRts); // ~27% - high variability
 */
export const calculateRtVariability = (rts: number[]): number => {
  if (rts.length < 2) return 0;
  const m = mean(rts);
  const sd = stdDev(rts);
  return m > 0 ? (sd / m) * 100 : 0; // Return as percentage
};

/**
 * Calculates the linear regression slope for a series of values.
 *
 * Used to quantify performance drift across test quadrants. A positive
 * slope for reaction times indicates progressive slowing; a negative
 * slope for accuracy indicates declining performance.
 *
 * ## Algorithm
 * Uses ordinary least squares (OLS) linear regression:
 * - X values are the array indices (0, 1, 2, ...)
 * - Y values are the input array values
 * - Returns the slope (β) of the best-fit line y = α + βx
 *
 * @param {number[]} values - Array of values to fit (typically 4 quadrant values)
 * @returns {number} Slope of the regression line (units per index step)
 *
 * @example
 * // Reaction times increasing across quadrants (fatigue pattern)
 * const rtByQuadrant = [350, 380, 420, 450];
 * linearSlope(rtByQuadrant); // Returns ~33.3 (ms increase per quadrant)
 *
 * // Accuracy declining across quadrants
 * const accByQuadrant = [0.95, 0.90, 0.82, 0.75];
 * linearSlope(accByQuadrant); // Returns ~-0.067 (declining trend)
 */
const linearSlope = (values: number[]): number => {
  if (values.length < 2) return 0;
  const n = values.length;
  const xMean = (n - 1) / 2; // Mean of indices 0, 1, 2, ..., n-1
  const yMean = mean(values);

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (values[i] - yMean);
    denominator += (i - xMean) ** 2;
  }

  return denominator > 0 ? numerator / denominator : 0;
};

/**
 * Calculates the Auditory Fatigue Index from attention test trial data.
 *
 * This is the core clinical algorithm for detecting auditory fatigue patterns.
 * It analyzes performance changes between early and late portions of the test,
 * with additional granularity from quadrant-level analysis.
 *
 * ## Algorithm Overview
 *
 * 1. **Split trials** into halves (early/late) and quadrants (Q1-Q4)
 * 2. **Calculate metrics** for each segment: hit rate, average RT, RT variability
 * 3. **Compute fatigue indicators**:
 *    - RT increase: % change in reaction time (late vs early)
 *    - Hit rate drop: accuracy decrease (early - late)
 *    - RT variability: overall coefficient of variation
 *    - Drift slopes: linear trends across quadrants
 * 4. **Generate composite score** (0-100) from four weighted components
 * 5. **Classify results** into categorical labels
 *
 * ## Fatigue Score Components (each 0-25 points)
 *
 * | Component | Formula | Interpretation |
 * |-----------|---------|----------------|
 * | RT Increase | rtIncrease × 0.5 | +1% RT increase = +0.5 points |
 * | Hit Drop | hitRateDrop × 1.25 | +1% accuracy drop = +1.25 points |
 * | Variability | (CV - 15%) × 0.5 | CV above 15% penalized |
 * | Drift | rtSlope × 0.1 + accSlope × 50 | Combines both trend directions |
 *
 * ## Classification Thresholds
 *
 * - **Low fatigue**: score < 25 (sustained attention maintained)
 * - **Moderate fatigue**: score 25-49 (some degradation)
 * - **High fatigue**: score ≥ 50 (significant performance decline)
 *
 * ## Sustained Attention Rating
 *
 * Computed from: (1 - fatigueScore/100) × 50 + (1 - rtVariability/50) × 25 + (lateHitRate × 25)
 * - **Strong**: ≥ 70 points
 * - **Moderate**: 40-69 points
 * - **Weak**: < 40 points
 *
 * @param {Array<Object>} trials - Array of trial data objects
 * @param {boolean} [trials[].isTarget] - Whether this trial presented a target stimulus
 * @param {boolean} [trials[].target] - Alias for isTarget (for compatibility)
 * @param {'hit'|'fa'|'miss'|'cr'} [trials[].responseType] - The participant's response classification
 * @param {number|null} [trials[].rtMs] - Reaction time in milliseconds (null if no response)
 *
 * @returns {FatigueAnalysis} Complete fatigue analysis with clinical interpretations
 *
 * @example
 * const trials = [
 *   { isTarget: true, responseType: 'hit', rtMs: 350 },
 *   { isTarget: false, responseType: 'cr', rtMs: null },
 *   { isTarget: true, responseType: 'hit', rtMs: 380 },
 *   // ... more trials
 * ];
 *
 * const analysis = calculateFatigueIndex(trials);
 * console.log(analysis.fatigueIndex);      // 'low' | 'moderate' | 'high'
 * console.log(analysis.fatigueScore);      // 0-100
 * console.log(analysis.sustainedAttention); // 'strong' | 'moderate' | 'weak'
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
  const quarterPoint = Math.floor(trials.length / 4);

  const earlyTrials = trials.slice(0, midpoint);
  const lateTrials = trials.slice(midpoint);

  // Quadrant splits for more granular analysis
  const q1 = trials.slice(0, quarterPoint);
  const q2 = trials.slice(quarterPoint, midpoint);
  const q3 = trials.slice(midpoint, midpoint + quarterPoint);
  const q4 = trials.slice(midpoint + quarterPoint);

  const getStats = (t: typeof trials): QuadrantPerformance => {
    const targetTrials = t.filter(x => x.isTarget || x.target);
    const hits = targetTrials.filter(x => x.responseType === 'hit');
    const rts = hits.map(x => x.rtMs).filter((rt): rt is number => typeof rt === 'number' && rt > 0);

    return {
      hitRate: targetTrials.length > 0 ? hits.length / targetTrials.length : 0,
      avgRt: rts.length > 0 ? mean(rts) : 0,
      rtVariability: calculateRtVariability(rts),
      trials: t.length,
    };
  };

  const early = getStats(earlyTrials);
  const late = getStats(lateTrials);

  // Quadrant analysis
  const quadrants = [q1, q2, q3, q4].map(getStats);

  // Calculate fatigue indicators
  const rtIncrease = early.avgRt > 0
    ? ((late.avgRt - early.avgRt) / early.avgRt) * 100
    : 0;

  const hitRateDrop = (early.hitRate - late.hitRate) * 100;

  // Overall RT variability across all trials
  const allRts = trials
    .filter(x => x.responseType === 'hit')
    .map(x => x.rtMs)
    .filter((rt): rt is number => typeof rt === 'number' && rt > 0);
  const rtVariability = calculateRtVariability(allRts);

  // Calculate drift slopes
  const quadrantRts = quadrants.map(q => q.avgRt).filter(rt => rt > 0);
  const quadrantAccuracy = quadrants.map(q => q.hitRate);
  const rtDriftSlope = linearSlope(quadrantRts);
  const accuracyDriftSlope = linearSlope(quadrantAccuracy);

  // Composite fatigue score (0-100)
  // Components: RT increase, hit rate drop, RT variability, drift slopes
  const rtComponent = Math.min(25, Math.max(0, rtIncrease * 0.5));  // 0-25 points from RT increase
  const hitComponent = Math.min(25, Math.max(0, hitRateDrop * 1.25)); // 0-25 points from hit drop
  const variabilityComponent = Math.min(25, Math.max(0, (rtVariability - 15) * 0.5)); // 0-25 from variability (>15% CV penalized)
  const driftComponent = Math.min(25, Math.max(0, rtDriftSlope * 0.1 + Math.abs(accuracyDriftSlope) * 50)); // 0-25 from drift
  const fatigueScore = Math.round(rtComponent + hitComponent + variabilityComponent + driftComponent);

  // Classify fatigue level
  let fatigueIndex: 'low' | 'moderate' | 'high';
  if (fatigueScore < 25) {
    fatigueIndex = 'low';
  } else if (fatigueScore < 50) {
    fatigueIndex = 'moderate';
  } else {
    fatigueIndex = 'high';
  }

  // Sustained attention rating
  let sustainedAttention: 'strong' | 'moderate' | 'weak';
  const sustainScore = (1 - fatigueScore / 100) * 50 + (1 - rtVariability / 50) * 25 + (late.hitRate * 25);
  if (sustainScore >= 70) {
    sustainedAttention = 'strong';
  } else if (sustainScore >= 40) {
    sustainedAttention = 'moderate';
  } else {
    sustainedAttention = 'weak';
  }

  return {
    earlyPerformance: { hitRate: early.hitRate, avgRt: early.avgRt, trials: early.trials },
    latePerformance: { hitRate: late.hitRate, avgRt: late.avgRt, trials: late.trials },
    quadrants,
    rtIncrease: Math.round(rtIncrease * 10) / 10,
    hitRateDrop: Math.round(hitRateDrop * 10) / 10,
    rtVariability: Math.round(rtVariability * 10) / 10,
    rtDriftSlope: Math.round(rtDriftSlope * 100) / 100,
    accuracyDriftSlope: Math.round(accuracyDriftSlope * 1000) / 1000,
    fatigueIndex,
    fatigueScore,
    sustainedAttention,
  };
};

/**
 * Calculates a fatigue-adjusted score to reward or penalize sustained performance.
 *
 * This function adjusts the raw game score based on the participant's fatigue
 * analysis results. Maintaining attention throughout the test is rewarded,
 * while significant fatigue is penalized.
 *
 * ## Multiplier Rules
 *
 * | Fatigue Level | Multiplier | Effect |
 * |---------------|------------|--------|
 * | Low | 1.15 | +15% bonus for sustained performance |
 * | Moderate | 1.0 | No adjustment |
 * | High | 0.9 | -10% penalty for fatigue |
 *
 * ## Bonus Points
 *
 * - **Low fatigue**: +50 bonus points
 * - **Strong sustained attention**: Additional +25 bonus points
 *
 * @param {number} baseScore - The raw score before fatigue adjustment
 * @param {FatigueAnalysis} fatigueAnalysis - Results from calculateFatigueIndex()
 *
 * @returns {Object} Adjustment details
 * @returns {number} returns.adjustedScore - Final score after applying multiplier and bonuses
 * @returns {number} returns.multiplier - The multiplier applied (0.9, 1.0, or 1.15)
 * @returns {number} returns.bonus - Total bonus points awarded
 *
 * @example
 * const baseScore = 1000;
 * const fatigueAnalysis = { fatigueIndex: 'low', sustainedAttention: 'strong', ... };
 *
 * const result = getFatigueAdjustedScore(baseScore, fatigueAnalysis);
 * // result.multiplier = 1.15
 * // result.bonus = 75 (50 for low fatigue + 25 for strong attention)
 * // result.adjustedScore = Math.round(1000 * 1.15) + 75 = 1225
 */
export const getFatigueAdjustedScore = (
  baseScore: number,
  fatigueAnalysis: FatigueAnalysis
): { adjustedScore: number; multiplier: number; bonus: number } => {
  // Reward low fatigue, penalize high fatigue
  let multiplier: number;
  let bonus = 0;

  switch (fatigueAnalysis.fatigueIndex) {
    case 'low':
      multiplier = 1.15; // 15% bonus for sustained performance
      bonus = 50;
      break;
    case 'moderate':
      multiplier = 1.0; // No change
      break;
    case 'high':
      multiplier = 0.9; // 10% penalty for fatigue
      break;
  }

  // Additional bonus for strong sustained attention
  if (fatigueAnalysis.sustainedAttention === 'strong') {
    bonus += 25;
  }

  const adjustedScore = Math.round(baseScore * multiplier) + bonus;

  return { adjustedScore, multiplier, bonus };
};

// ==================== SESSION STORAGE ====================

/**
 * LocalStorage key for persisting assessment sessions.
 * @constant {string}
 */
const SESSION_STORAGE_KEY = 'berard-ait-sessions';

/**
 * Maximum number of sessions to retain in storage.
 * Older sessions are pruned when this limit is exceeded.
 * @constant {number}
 */
const MAX_STORED_SESSIONS = 50;

/**
 * Represents a saved assessment session for progress tracking.
 *
 * Sessions are stored in localStorage and used to track improvement
 * over time, unlock achievements, and generate progress reports.
 *
 * @interface StoredSession
 * @property {string} id - Unique session identifier (typically UUID or timestamp-based)
 * @property {number} date - Unix timestamp (ms) when the session was completed
 * @property {Partial<Record<string, TestOutcome>>} outcomes - Map of test keys to their results
 * @property {GameResult} [compositeResult] - Overall session result ('high'|'medium'|'low')
 * @property {number} [totalPoints] - Cumulative gamification points earned
 * @property {string[]} [achievements] - IDs of achievements unlocked during this session
 */
export interface StoredSession {
  id: string;
  date: number;
  outcomes: Partial<Record<string, TestOutcome>>;
  compositeResult?: GameResult;
  totalPoints?: number;
  achievements?: string[];
}

/**
 * Saves a completed session to localStorage.
 *
 * Sessions are prepended to the list (most recent first). If a session with the same
 * `id` already exists, it is replaced (upsert) to avoid duplicates during multi-test runs.
 * If the list exceeds MAX_STORED_SESSIONS, oldest sessions are pruned.
 *
 * @param {StoredSession} session - The session data to save
 *
 * @example
 * saveSession({
 *   id: 'session-2024-01-15-1',
 *   date: Date.now(),
 *   outcomes: {
 *     attention: { result: 'high', scoreLabel: '92/100', ... },
 *     frequency: { result: 'medium', scoreLabel: '75/100', ... },
 *   },
 *   compositeResult: 'high',
 *   totalPoints: 2500,
 *   achievements: ['sharp_ears', 'focused_mind'],
 * });
 */
export const saveSession = (session: StoredSession): void => {
  try {
    const existing = getSessions();
    const updated = [session, ...existing.filter((s) => s.id !== session.id)].slice(0, MAX_STORED_SESSIONS);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    notifyLocalChange();
  } catch (e) {
    console.warn('Failed to save session:', e);
  }
};

/**
 * Retrieves all stored sessions from localStorage.
 *
 * @returns {StoredSession[]} Array of sessions, most recent first. Empty array if none exist or on error.
 *
 * @example
 * const sessions = getSessions();
 * console.log(`Found ${sessions.length} stored sessions`);
 * const latestResult = sessions[0]?.compositeResult;
 */
export const getSessions = (): StoredSession[] => {
  try {
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Retrieves a specific session by its ID.
 *
 * @param {string} id - The session ID to look up
 * @returns {StoredSession|undefined} The matching session, or undefined if not found
 *
 * @example
 * const session = getSessionById('session-2024-01-15-1');
 * if (session) {
 *   console.log(`Session from ${new Date(session.date)}`);
 * }
 */
export const getSessionById = (id: string): StoredSession | undefined => {
  return getSessions().find(s => s.id === id);
};

/**
 * Clears all stored sessions from localStorage.
 *
 * ⚠️ This action is irreversible. All progress history will be lost.
 *
 * @example
 * if (confirm('Clear all session history?')) {
 *   clearSessions();
 * }
 */
export const clearSessions = (): void => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

// ==================== PROGRESS ANALYSIS ====================

/**
 * Represents a longitudinal progress trend for a specific test type.
 *
 * Used to track improvement or decline across multiple assessment sessions,
 * enabling clinicians and users to visualize progress over time.
 *
 * @interface ProgressTrend
 * @property {string} testKey - The test identifier (e.g., 'attention', 'frequency', 'sequence')
 * @property {Array<{date: number, result: GameResult, score: number}>} sessions - Chronological session data
 * @property {number} improvement - Percentage change from first to most recent session
 * @property {'improving'|'stable'|'declining'} trend - Categorized trend direction
 * @property {GameResult} bestResult - Highest result achieved across all sessions
 * @property {number} averageScore - Mean numeric score across all sessions
 */
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

/**
 * Analyzes progress trends for a specific test across all stored sessions.
 *
 * This function examines historical performance data to identify whether
 * the user is improving, declining, or maintaining stable performance
 * on a particular assessment.
 *
 * ## Trend Classification
 *
 * Based on percentage improvement from first to most recent session:
 * - **Improving**: > +10% improvement
 * - **Stable**: Between -10% and +10%
 * - **Declining**: < -10% decline
 *
 * @param {string} testKey - The test to analyze (e.g., 'attention', 'frequency', 'sequence')
 * @returns {ProgressTrend|null} Trend analysis, or null if fewer than 2 sessions exist
 *
 * @example
 * const attentionTrend = analyzeProgress('attention');
 * if (attentionTrend) {
 *   console.log(`Trend: ${attentionTrend.trend}`);           // 'improving'
 *   console.log(`Improvement: ${attentionTrend.improvement}%`); // 25
 *   console.log(`Best result: ${attentionTrend.bestResult}`);   // 'high'
 *   console.log(`Average score: ${attentionTrend.averageScore}`); // 82
 * } else {
 *   console.log('Need at least 2 sessions to analyze trends');
 * }
 */
export const analyzeProgress = (testKey: string): ProgressTrend | null => {
  const sessions = getSessions();
  const relevantSessions = sessions
    .filter(s => s.outcomes[testKey])
    .map(s => ({
      date: s.date,
      result: s.outcomes[testKey]!.result,
      score: extractNumericScore(s.outcomes[testKey]!.scoreLabel),
    }))
    .reverse(); // Oldest first for chronological analysis

  if (relevantSessions.length < 2) return null;

  const first = relevantSessions[0];
  const last = relevantSessions[relevantSessions.length - 1];

  // Calculate percentage improvement from first to last session
  const improvement = first.score > 0
    ? ((last.score - first.score) / first.score) * 100
    : 0;

  // Find best result achieved across all sessions
  const resultScores = { high: 3, medium: 2, low: 1 };
  const bestResult = relevantSessions.reduce((best, s) =>
    resultScores[s.result] > resultScores[best] ? s.result : best,
    'low' as GameResult
  );

  // Calculate average numeric score
  const averageScore = relevantSessions.reduce((sum, s) => sum + s.score, 0) / relevantSessions.length;

  // Classify trend based on improvement percentage
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

/**
 * Extracts the first numeric value from a score label string.
 *
 * Score labels come in various formats (e.g., "85/100", "Span=4", "92%").
 * This helper extracts the primary numeric value for comparison.
 *
 * @param {string} scoreLabel - The score label to parse
 * @returns {number} The extracted numeric value, or 0 if no number found
 *
 * @example
 * extractNumericScore('85/100');  // Returns 85
 * extractNumericScore('Span=4');  // Returns 4
 * extractNumericScore('92%');     // Returns 92
 * extractNumericScore('N/A');     // Returns 0
 */
const extractNumericScore = (scoreLabel: string): number => {
  const match = scoreLabel.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

// ==================== ACHIEVEMENT TRIGGERS ====================

/**
 * Represents an unlockable achievement in the gamification system.
 *
 * Achievements provide additional motivation and recognition for reaching
 * clinical milestones or demonstrating specific skills during assessment.
 *
 * @typedef GameAchievement
 * @property {string} id - Unique identifier for the achievement (used for storage/deduplication)
 * @property {string} title - English display name
 * @property {string} titleAr - Arabic display name (RTL support)
 * @property {string} description - English description of how to unlock
 * @property {string} descriptionAr - Arabic description
 * @property {string} icon - Emoji icon for visual display
 * @property {number} points - Bonus points awarded when unlocked
 * @property {Function} condition - Predicate function that checks if achievement criteria are met
 */
export type GameAchievement = {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  points: number;
  /** Evaluates whether the achievement conditions are met based on test outcomes */
  condition: (outcomes: Partial<Record<string, TestOutcome>>) => boolean;
};

/**
 * Master list of all available achievements in the assessment suite.
 *
 * ## Achievement Categories
 *
 * | Category | Achievements | Description |
 * |----------|--------------|-------------|
 * | Test Excellence | sharp_ears, focused_mind, memory_master | High scores in specific tests |
 * | Overall Performance | triple_crown | Excellence across all tests |
 * | Sustained Attention | no_fatigue, sustained_focus, low_variability | Consistency metrics |
 * | Speed | speed_demon | Fast reaction times |
 * | Accuracy | perfect_sequence | 100% accuracy |
 * | Progress | improvement_star | Improvement over time |
 *
 * ## Points Distribution
 *
 * - Basic achievements: 50 points
 * - Advanced achievements: 75-100 points
 * - Ultimate achievements: 150 points
 *
 * @constant {GameAchievement[]}
 *
 * @example
 * // Display all available achievements
 * GAME_ACHIEVEMENTS.forEach(achievement => {
 *   console.log(`${achievement.icon} ${achievement.title}: ${achievement.description}`);
 * });
 */
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
  {
    id: 'sustained_focus',
    title: 'Sustained Focus',
    titleAr: 'تركيز مستدام',
    description: 'Maintain strong sustained attention throughout the test',
    descriptionAr: 'حافظ على انتباه مستدام قوي طوال الاختبار',
    icon: '🔬',
    points: 75,
    condition: (o) => {
      const sustainedAttention = o.attention?.metrics?.sustainedAttention;
      return sustainedAttention === 'strong';
    },
  },
  {
    id: 'low_variability',
    title: 'Consistent Performer',
    titleAr: 'أداء متسق',
    description: 'Low reaction time variability (CV < 15%)',
    descriptionAr: 'تباين منخفض في وقت الاستجابة (أقل من 15%)',
    icon: '📊',
    points: 50,
    condition: (o) => {
      const rtVariability = o.attention?.metrics?.rtVariability;
      return typeof rtVariability === 'number' && rtVariability < 15;
    },
  },
];

/**
 * Evaluates all achievements against the current session outcomes.
 *
 * Call this function after completing tests to determine which achievements
 * were earned in the current session. The returned achievements can be
 * displayed to the user and stored in the session record.
 *
 * @param {Partial<Record<string, TestOutcome>>} outcomes - Map of test keys to their outcomes
 * @returns {GameAchievement[]} Array of achievements whose conditions are satisfied
 *
 * @example
 * const outcomes = {
 *   attention: { result: 'high', metrics: { fatigueIndex: 'low', avgReactionMs: 380 }, ... },
 *   frequency: { result: 'high', ... },
 *   sequence: { result: 'medium', metrics: { maxSpan: 4 }, ... },
 * };
 *
 * const earned = checkGameAchievements(outcomes);
 * // Returns: [
 * //   { id: 'sharp_ears', title: 'Sharp Ears', points: 50, ... },
 * //   { id: 'focused_mind', title: 'Focused Mind', points: 50, ... },
 * //   { id: 'no_fatigue', title: 'Endurance Champion', points: 50, ... },
 * // ]
 *
 * const totalBonusPoints = earned.reduce((sum, a) => sum + a.points, 0);
 * console.log(`Earned ${earned.length} achievements worth ${totalBonusPoints} points!`);
 */
export const checkGameAchievements = (
  outcomes: Partial<Record<string, TestOutcome>>
): GameAchievement[] => {
  return GAME_ACHIEVEMENTS.filter(a => a.condition(outcomes));
};

// ==================== TYPE-SAFE TEST KEYS ====================

/**
 * Valid test identifiers used throughout the scoring system.
 * Using this type instead of raw strings provides better type safety.
 *
 * @typedef {'attention'|'frequency'|'sequence'|'questionnaire'|'headphone'} TestKey
 */
export type TestKey = 'attention' | 'frequency' | 'sequence' | 'questionnaire' | 'headphone';

/**
 * Array of all valid test keys for iteration.
 * @constant {readonly TestKey[]}
 */
export const TEST_KEYS: readonly TestKey[] = ['attention', 'frequency', 'sequence', 'questionnaire', 'headphone'] as const;

/**
 * Clinical test keys (excludes questionnaire and headphone check).
 * These are the tests that contribute to the composite score.
 * @constant {readonly TestKey[]}
 */
export const CLINICAL_TEST_KEYS: readonly TestKey[] = ['attention', 'frequency', 'sequence'] as const;

// ==================== OPTIMIZED SESSION CACHE ====================

/**
 * Simple in-memory cache for session data to avoid repeated localStorage reads.
 * Cache is invalidated on any write operation.
 */
let _sessionCache: StoredSession[] | null = null;
let _sessionCacheTime = 0;
const SESSION_CACHE_TTL = 5000; // 5 seconds

/**
 * Retrieves sessions with in-memory caching for better performance.
 *
 * This optimized version caches the parsed sessions for 5 seconds,
 * reducing JSON.parse overhead when multiple functions access sessions
 * in rapid succession (e.g., checking achievements + analyzing progress).
 *
 * @returns {StoredSession[]} Cached or freshly loaded sessions
 *
 * @example
 * // These calls within 5 seconds use cached data
 * const trend1 = analyzeProgressCached('attention');
 * const trend2 = analyzeProgressCached('frequency');
 * const trend3 = analyzeProgressCached('sequence');
 */
export const getSessionsCached = (): StoredSession[] => {
  const now = Date.now();
  if (_sessionCache && (now - _sessionCacheTime) < SESSION_CACHE_TTL) {
    return _sessionCache;
  }
  _sessionCache = getSessions();
  _sessionCacheTime = now;
  return _sessionCache;
};

/**
 * Invalidates the session cache.
 * Call this after saving a new session to ensure fresh data.
 */
export const invalidateSessionCache = (): void => {
  _sessionCache = null;
  _sessionCacheTime = 0;
};

/**
 * Saves a session and invalidates the cache.
 * Use this instead of saveSession for cache-aware operations.
 *
 * @param {StoredSession} session - The session to save
 */
export const saveSessionCached = (session: StoredSession): void => {
  saveSession(session);
  invalidateSessionCache();
};

// ==================== BATCH PROGRESS ANALYSIS ====================

/**
 * Analyzes progress trends for all clinical tests in a single call.
 *
 * More efficient than calling analyzeProgress() multiple times because
 * sessions are loaded only once from localStorage/cache.
 *
 * @param {StoredSession[]} [sessions] - Optional pre-loaded sessions (uses cache if not provided)
 * @returns {Map<TestKey, ProgressTrend>} Map of test keys to their progress trends
 *
 * @example
 * const allTrends = analyzeAllProgress();
 * for (const [testKey, trend] of allTrends) {
 *   console.log(`${testKey}: ${trend.trend} (${trend.improvement}%)`);
 * }
 */
export const analyzeAllProgress = (
  sessions?: StoredSession[]
): Map<TestKey, ProgressTrend> => {
  const data = sessions ?? getSessionsCached();
  const results = new Map<TestKey, ProgressTrend>();

  for (const testKey of CLINICAL_TEST_KEYS) {
    const relevantSessions = data
      .filter(s => s.outcomes[testKey])
      .map(s => ({
        date: s.date,
        result: s.outcomes[testKey]!.result,
        score: extractNumericScore(s.outcomes[testKey]!.scoreLabel),
      }))
      .reverse();

    if (relevantSessions.length < 2) continue;

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

    results.set(testKey, {
      testKey,
      sessions: relevantSessions,
      improvement: Math.round(improvement),
      trend,
      bestResult,
      averageScore: Math.round(averageScore),
    });
  }

  return results;
};

// ==================== SCORE CALCULATION HELPERS ====================

/**
 * Calculates the total points for an attention test trial.
 *
 * Convenience function that applies all relevant bonuses and penalties
 * based on the response type, reaction time, and combo state.
 *
 * @param {Object} params - Trial parameters
 * @param {'hit'|'miss'|'fa'|'cr'} params.responseType - The response classification
 * @param {number} [params.rtMs] - Reaction time in milliseconds (for speed bonus)
 * @param {number} [params.speedThreshold=500] - RT threshold for speed bonus (default 500ms)
 * @param {number} [params.multiplier=1] - Combo multiplier to apply
 * @returns {number} Total points for this trial
 *
 * @example
 * const points = calculateAttentionTrialPoints({
 *   responseType: 'hit',
 *   rtMs: 380,
 *   speedThreshold: 500,
 *   multiplier: 1.5
 * });
 * // Returns: (100 + 25) * 1.5 = 187.5 -> 188
 */
export const calculateAttentionTrialPoints = (params: {
  responseType: 'hit' | 'miss' | 'fa' | 'cr';
  rtMs?: number;
  speedThreshold?: number;
  multiplier?: number;
}): number => {
  const { responseType, rtMs, speedThreshold = 500, multiplier = 1 } = params;

  let basePoints: number;
  switch (responseType) {
    case 'hit':
      basePoints = ATTENTION_POINTS.hit;
      // Apply speed bonus for fast hits
      if (rtMs && rtMs < speedThreshold) {
        basePoints += ATTENTION_POINTS.speedBonus;
      }
      break;
    case 'cr':
      basePoints = ATTENTION_POINTS.correctReject;
      break;
    case 'fa':
      basePoints = ATTENTION_POINTS.falseAlarm;
      break;
    case 'miss':
      basePoints = ATTENTION_POINTS.miss;
      break;
  }

  return Math.round(basePoints * multiplier);
};

/**
 * Calculates total points for a frequency discrimination trial.
 *
 * @param {Object} params - Trial parameters
 * @param {boolean} params.correct - Whether the response was correct
 * @param {number} [params.deltaHz] - Frequency difference in Hz (for hard difficulty bonus)
 * @returns {number} Total points for this trial
 *
 * @example
 * const points = calculateFrequencyTrialPoints({ correct: true, deltaHz: 25 });
 * // Returns: 100 + 50 = 150 (includes hard difficulty bonus)
 */
export const calculateFrequencyTrialPoints = (params: {
  correct: boolean;
  deltaHz?: number;
}): number => {
  const { correct, deltaHz } = params;

  if (!correct) {
    return FREQUENCY_POINTS.incorrect;
  }

  let points = FREQUENCY_POINTS.correct;
  if (deltaHz !== undefined && deltaHz < 30) {
    points += FREQUENCY_POINTS.hardDifficultyBonus;
  }

  return points;
};

/**
 * Calculates total points for a sequencing trial.
 *
 * @param {Object} params - Trial parameters
 * @param {boolean} params.correct - Whether the sequence was reproduced correctly
 * @param {number} params.span - Current span length
 * @param {boolean} [params.usedReplay=false] - Whether replay was used
 * @param {boolean} [params.isPerfectRound=false] - Whether this completes a perfect round
 * @returns {number} Total points for this trial
 *
 * @example
 * const points = calculateSequenceTrialPoints({
 *   correct: true,
 *   span: 5,
 *   usedReplay: false,
 *   isPerfectRound: true
 * });
 * // Returns: 150 + 50 + 100 + 200 = 500
 */
export const calculateSequenceTrialPoints = (params: {
  correct: boolean;
  span: number;
  usedReplay?: boolean;
  isPerfectRound?: boolean;
}): number => {
  const { correct, span, usedReplay = false, isPerfectRound = false } = params;

  if (!correct) {
    return SEQUENCE_POINTS.wrongSequence;
  }

  let points = SEQUENCE_POINTS.correctSequence;

  if (!usedReplay) {
    points += SEQUENCE_POINTS.noReplayBonus;
  }

  if (span >= 4) {
    points += SEQUENCE_POINTS.longSpanBonus;
  }

  if (isPerfectRound) {
    points += SEQUENCE_POINTS.perfectRoundBonus;
  }

  return points;
};

// ==================== ACHIEVEMENT PROGRESS ====================

/**
 * Represents progress toward an achievement.
 */
export interface AchievementProgress {
  achievement: GameAchievement;
  unlocked: boolean;
  /** Progress percentage (0-100). 100 means unlocked. */
  progress: number;
  /** Human-readable progress description */
  progressLabel: string;
}

/**
 * Calculates progress toward each achievement based on current outcomes.
 *
 * This is useful for displaying achievement progress in UI, showing users
 * how close they are to unlocking each achievement.
 *
 * @param {Partial<Record<string, TestOutcome>>} outcomes - Current session outcomes
 * @returns {AchievementProgress[]} Array of progress for each achievement
 *
 * @example
 * const progress = getAchievementProgress(outcomes);
 * progress.forEach(p => {
 *   console.log(`${p.achievement.icon} ${p.achievement.title}: ${p.progress}%`);
 *   if (!p.unlocked) {
 *     console.log(`  ${p.progressLabel}`);
 *   }
 * });
 */
export const getAchievementProgress = (
  outcomes: Partial<Record<string, TestOutcome>>
): AchievementProgress[] => {
  return GAME_ACHIEVEMENTS.map(achievement => {
    const unlocked = achievement.condition(outcomes);

    if (unlocked) {
      return {
        achievement,
        unlocked: true,
        progress: 100,
        progressLabel: 'Unlocked!',
      };
    }

    // Calculate progress based on achievement type
    let progress = 0;
    let progressLabel = '';

    switch (achievement.id) {
      case 'sharp_ears': {
        const result = outcomes.frequency?.result;
        if (result === 'medium') {
          progress = 66;
          progressLabel = 'Achieve High (currently Medium)';
        } else if (result === 'low') {
          progress = 33;
          progressLabel = 'Achieve High (currently Low)';
        } else {
          progress = 0;
          progressLabel = 'Complete frequency test with High score';
        }
        break;
      }
      case 'focused_mind': {
        const result = outcomes.attention?.result;
        if (result === 'medium') {
          progress = 66;
          progressLabel = 'Achieve High (currently Medium)';
        } else if (result === 'low') {
          progress = 33;
          progressLabel = 'Achieve High (currently Low)';
        } else {
          progress = 0;
          progressLabel = 'Complete attention test with High score';
        }
        break;
      }
      case 'memory_master': {
        const span = outcomes.sequence?.metrics?.maxSpan;
        if (typeof span === 'number') {
          progress = Math.min(100, (span / 5) * 100);
          progressLabel = `Reach span 5 (currently ${span})`;
        } else {
          progress = 0;
          progressLabel = 'Complete sequencing test with span 5+';
        }
        break;
      }
      case 'triple_crown': {
        const scores = { high: 1, medium: 0.5, low: 0 };
        let sum = 0;
        if (outcomes.attention?.result) sum += scores[outcomes.attention.result];
        if (outcomes.frequency?.result) sum += scores[outcomes.frequency.result];
        if (outcomes.sequence?.result) sum += scores[outcomes.sequence.result];
        progress = Math.round((sum / 3) * 100);
        progressLabel = 'Achieve High in all three tests';
        break;
      }
      case 'speed_demon': {
        const rt = outcomes.attention?.metrics?.avgReactionMs;
        if (typeof rt === 'number') {
          // Progress from 600ms to 400ms
          progress = Math.min(100, Math.max(0, ((600 - rt) / 200) * 100));
          progressLabel = `Achieve <400ms (currently ${Math.round(rt)}ms)`;
        } else {
          progress = 0;
          progressLabel = 'Complete attention test with avg RT <400ms';
        }
        break;
      }
      case 'perfect_sequence': {
        const acc = outcomes.sequence?.metrics?.accuracyPct;
        if (typeof acc === 'number') {
          progress = acc;
          progressLabel = `Achieve 100% accuracy (currently ${acc}%)`;
        } else {
          progress = 0;
          progressLabel = 'Complete sequencing test with 100% accuracy';
        }
        break;
      }
      default:
        progress = 0;
        progressLabel = achievement.description;
    }

    return {
      achievement,
      unlocked: false,
      progress: Math.round(progress),
      progressLabel,
    };
  });
};

// ==================== COMPOSITE SESSION SUMMARY ====================

/**
 * Comprehensive summary of a user's assessment history.
 */
export interface SessionSummary {
  totalSessions: number;
  totalPoints: number;
  averagePoints: number;
  bestCompositeResult: GameResult | null;
  allAchievements: string[];
  uniqueAchievementsCount: number;
  progressTrends: Map<TestKey, ProgressTrend>;
  lastSessionDate: Date | null;
  streakDays: number;
}

/**
 * Generates a comprehensive summary of all stored sessions.
 *
 * This is a convenience function that aggregates multiple analyses
 * into a single summary object, optimized to read sessions only once.
 *
 * @returns {SessionSummary} Complete summary of user's assessment history
 *
 * @example
 * const summary = getSessionSummary();
 * console.log(`Total sessions: ${summary.totalSessions}`);
 * console.log(`Total points: ${summary.totalPoints}`);
 * console.log(`Unique achievements: ${summary.uniqueAchievementsCount}`);
 * console.log(`Current streak: ${summary.streakDays} days`);
 */
export const getSessionSummary = (): SessionSummary => {
  const sessions = getSessionsCached();

  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalPoints: 0,
      averagePoints: 0,
      bestCompositeResult: null,
      allAchievements: [],
      uniqueAchievementsCount: 0,
      progressTrends: new Map(),
      lastSessionDate: null,
      streakDays: 0,
    };
  }

  // Aggregate statistics
  const totalPoints = sessions.reduce((sum, s) => sum + (s.totalPoints ?? 0), 0);
  const averagePoints = Math.round(totalPoints / sessions.length);

  // Find best composite result
  const resultScores = { high: 3, medium: 2, low: 1 };
  let bestCompositeResult: GameResult | null = null;
  let bestScore = 0;
  for (const session of sessions) {
    if (session.compositeResult) {
      const score = resultScores[session.compositeResult];
      if (score > bestScore) {
        bestScore = score;
        bestCompositeResult = session.compositeResult;
      }
    }
  }

  // Collect all unique achievements
  const achievementSet = new Set<string>();
  for (const session of sessions) {
    if (session.achievements) {
      for (const id of session.achievements) {
        achievementSet.add(id);
      }
    }
  }

  // Calculate streak (consecutive days with sessions)
  let streakDays = 0;
  const sortedDates = sessions
    .map(s => new Date(s.date).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i); // unique dates

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (sortedDates[0] === today || sortedDates[0] === yesterday) {
    streakDays = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / 86400000);
      if (diffDays === 1) {
        streakDays++;
      } else {
        break;
      }
    }
  }

  return {
    totalSessions: sessions.length,
    totalPoints,
    averagePoints,
    bestCompositeResult,
    allAchievements: Array.from(achievementSet),
    uniqueAchievementsCount: achievementSet.size,
    progressTrends: analyzeAllProgress(sessions),
    lastSessionDate: new Date(sessions[0].date),
    streakDays,
  };
};

// ==================== RESULT UTILITIES ====================

/**
 * Maps a numeric score percentage to a GameResult category.
 *
 * Thresholds:
 * - High: >= 80%
 * - Medium: >= 50%
 * - Low: < 50%
 *
 * @param {number} percentage - Score as percentage (0-100)
 * @returns {GameResult} The corresponding result category
 *
 * @example
 * percentageToResult(85); // 'high'
 * percentageToResult(65); // 'medium'
 * percentageToResult(40); // 'low'
 */
export const percentageToResult = (percentage: number): GameResult => {
  if (percentage >= 80) return 'high';
  if (percentage >= 50) return 'medium';
  return 'low';
};

/**
 * Calculates a composite result from multiple test outcomes.
 *
 * Uses weighted averaging of result scores:
 * - high = 3 points
 * - medium = 2 points
 * - low = 1 point
 *
 * @param {Partial<Record<TestKey, TestOutcome>>} outcomes - Map of test outcomes
 * @param {Partial<Record<TestKey, number>>} [weights] - Optional weights for each test (default: equal)
 * @returns {GameResult} The weighted composite result
 *
 * @example
 * const outcomes = {
 *   attention: { result: 'high', ... },
 *   frequency: { result: 'medium', ... },
 *   sequence: { result: 'high', ... },
 * };
 * calculateCompositeResult(outcomes); // 'high' (average: 2.67 -> rounds to high)
 */
export const calculateCompositeResult = (
  outcomes: Partial<Record<TestKey, TestOutcome>>,
  weights?: Partial<Record<TestKey, number>>
): GameResult => {
  const resultScores = { high: 3, medium: 2, low: 1 };
  let totalScore = 0;
  let totalWeight = 0;

  for (const key of CLINICAL_TEST_KEYS) {
    const outcome = outcomes[key];
    if (outcome?.result) {
      const weight = weights?.[key] ?? 1;
      totalScore += resultScores[outcome.result] * weight;
      totalWeight += weight;
    }
  }

  if (totalWeight === 0) return 'low';

  const average = totalScore / totalWeight;
  if (average >= 2.5) return 'high';
  if (average >= 1.5) return 'medium';
  return 'low';
};
