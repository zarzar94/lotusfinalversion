import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPink, brandPurpleDark, styles } from '../styles';
import { ensureAudio, playTone, safeCloseAudio } from './audio';
import { mean, median, stdDev } from './stats';
import type { GameResult, TestOutcome } from './types';
import { FREQUENCY_POINTS, getStarRating, getStarEmoji } from './scoring';

type TrialRow = {
  i: number;
  deltaHz: number;
  order: 'ref-first' | 'hi-first';
  correct: boolean;
  answer: 1 | 2;
  rtMs: number;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function FrequencyDiscriminationTestPanel({
  onDone,
  onCancel,
}: {
  onDone: (outcome: TestOutcome) => void;
  onCancel?: () => void;
}) {
  const { t } = useLanguage();
  const audioRef = useRef<AudioContext | null>(null);
  const ensure = () => ensureAudio(audioRef);

  const TRIALS = 20;
  const PRACTICE_TRIALS = 3;
  const PRACTICE_DELTA = 120;
  const REF = 500;

  const [stage, setStage] = useState<'intro' | 'practice' | 'running' | 'done'>('intro');
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [i, setI] = useState(1);
  const [delta, setDelta] = useState(120);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState<'ref-first' | 'hi-first'>(() => (Math.random() < 0.5 ? 'ref-first' : 'hi-first'));
  const [played, setPlayed] = useState(false);

  // Enhanced gamification state
  const [points, setPoints] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [feedbackPoints, setFeedbackPoints] = useState(0);

  const deltasRef = useRef<number[]>([]);
  const rowsRef = useRef<TrialRow[]>([]);
  const trialStartRef = useRef<number>(0);
  const feedbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
      safeCloseAudio(audioRef);
    };
  }, []);

  const showFeedback = (type: 'correct' | 'incorrect', pointChange: number) => {
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    setLastFeedback(type);
    setFeedbackPoints(pointChange);
    feedbackTimerRef.current = window.setTimeout(() => {
      setLastFeedback(null);
      setFeedbackPoints(0);
    }, 600);
  };

  const playExample = (hz: number) => {
    const audio = ensure();
    playTone(audio, { freq: hz, duration: 0.35, volume: 0.24 });
  };

  const startPractice = () => {
    rowsRef.current = [];
    deltasRef.current = [];
    setPracticeIndex(0);
    setI(1);
    setDelta(PRACTICE_DELTA);
    setCorrectStreak(0);
    setOrder(nextOrder());
    setPlayed(false);
    setPoints(0);
    setLastFeedback(null);
    setFeedbackPoints(0);
    setStage('practice');
  };

  const startTest = () => {
    rowsRef.current = [];
    deltasRef.current = [];
    setPracticeIndex(0);
    setI(1);
    setDelta(PRACTICE_DELTA);
    setCorrectStreak(0);
    setOrder(nextOrder());
    setPlayed(false);
    setPoints(0);
    setLastFeedback(null);
    setFeedbackPoints(0);
    setStage('running');
  };

  const playTrial = useCallback(async () => {
    const audio = ensure();
    try {
      await audio.resume();
    } catch {
      // ignore
    }

    setBusy(true);
    setPlayed(false);

    const hi = REF + delta;

    // two-interval forced-choice (2IFC)
    if (order === 'ref-first') {
      playTone(audio, { freq: REF, duration: 0.30, volume: 0.22 });
      await sleep(420);
      playTone(audio, { freq: hi, duration: 0.30, volume: 0.22 });
    } else {
      playTone(audio, { freq: hi, duration: 0.30, volume: 0.22 });
      await sleep(420);
      playTone(audio, { freq: REF, duration: 0.30, volume: 0.22 });
    }

    await sleep(380);
    setBusy(false);
    setPlayed(true);
    trialStartRef.current = performance.now();
  }, [delta, order]);

  const nextOrder = () => (Math.random() < 0.5 ? 'ref-first' : 'hi-first') as 'ref-first' | 'hi-first';

  const answer = (choice: 1 | 2) => {
    if (!played) return;

    const rt = Math.round(performance.now() - trialStartRef.current);
    const correct = (order === 'ref-first' && choice === 2) || (order === 'hi-first' && choice === 1);

    if (stage === 'practice') {
      showFeedback(correct ? 'correct' : 'incorrect', 0);
      const nextPractice = practiceIndex + 1;
      if (nextPractice >= PRACTICE_TRIALS) {
        startTest();
        return;
      }
      setPracticeIndex(nextPractice);
      setOrder(nextOrder());
      setPlayed(false);
      return;
    }

    rowsRef.current.push({ i, deltaHz: delta, order, correct, answer: choice, rtMs: rt });
    deltasRef.current.push(delta);

    // Calculate points
    let pointChange = 0;
    if (correct) {
      pointChange = FREQUENCY_POINTS.correct;
      // Bonus for hard difficulty (small delta)
      if (delta < 30) {
        pointChange += FREQUENCY_POINTS.hardDifficultyBonus;
      }
      setPoints((p) => p + pointChange);
      showFeedback('correct', pointChange);
    } else {
      pointChange = FREQUENCY_POINTS.incorrect;
      setPoints((p) => Math.max(0, p + pointChange));
      showFeedback('incorrect', pointChange);
    }

    // 2-down 1-up staircase: decrease after 2 correct in a row, increase after any wrong
    let nextDelta = delta;
    let nextStreak = correct ? correctStreak + 1 : 0;

    if (correct) {
      if (nextStreak >= 2) {
        nextDelta = Math.max(6, Math.round(delta * 0.85));
        nextStreak = 0;
      }
    } else {
      nextDelta = Math.min(250, Math.round(delta * 1.25));
    }

    setCorrectStreak(nextStreak);

    // next trial
    if (i >= TRIALS) {
      finish();
      return;
    }

    setI((x) => x + 1);
    setDelta(nextDelta);
    setOrder(nextOrder());
    setPlayed(false);
  };

  const finish = () => {
    const rows = rowsRef.current;
    const correctCount = rows.filter((r) => r.correct).length;
    const accuracy = Math.round((correctCount / Math.max(1, rows.length)) * 100);

    // threshold estimate: median of last 8 deltas (simple, robust)
    const last = deltasRef.current.slice(-8);
    const thresholdHz = Math.round(median(last));
    const thresholdPct = Number(((thresholdHz / REF) * 100).toFixed(2));

    const consistency = Number(stdDev(last).toFixed(1));
    const avgRt = Math.round(mean(rows.map((r) => r.rtMs)));

    const result: GameResult = thresholdHz <= 20 ? 'high' : thresholdHz <= 50 ? 'medium' : 'low';
    const starRating = getStarRating(result);

    // Add consistency bonus to final points
    let finalPoints = points;
    if (consistency < 15) {
      finalPoints += FREQUENCY_POINTS.consistencyBonus;
    }

    const message =
      result === 'high'
        ? t('frequency.summaryHigh', 'Strong tone discrimination in this screening snapshot.')
        : result === 'medium'
          ? t('frequency.summaryMid', 'Moderate discrimination with room to refine.')
          : t('frequency.summaryLow', 'Lower discrimination detected; consider repeating in a quiet setting.');

    const outcome: TestOutcome = {
      key: 'frequency',
      title: t('games.frequencyTest', 'Frequency Discrimination Test'),
      result,
      scoreLabel: `${getStarEmoji(starRating)} Threshold ${thresholdHz}Hz | ${accuracy}% | ${finalPoints}pts`,
      message,
      metrics: {
        referenceHz: REF,
        trials: rows.length,
        accuracyPct: accuracy,
        thresholdHz,
        thresholdPercent: thresholdPct,
        consistencyStdHz: consistency,
        avgReactionMs: avgRt,
        gamePoints: finalPoints,
        starRating,
        note: t('frequency.note', 'Threshold here is a screening estimate (no normative calibration).'),
      },
      trials: rows,
    };

    setStage('done');
    onDone(outcome);
  };

  const canAnswer = played && !busy;

  return (
    <div style={styles.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 900, color: brandCyan }}>
            {t('games.frequencyTest', 'Frequency Discrimination Test')}
          </div>
          <div style={styles.muted}>
            {t('games.frequencyTestDesc', 'Test your ability to distinguish between different frequencies')}
          </div>
        </div>
        <span style={styles.chip}>{t('frequency.objective', 'Adaptive 2IFC')}</span>
      </div>

      {stage === 'intro' ? (
        <div style={{ marginTop: 12 }}>
          <p style={styles.bodyText}>
            {t(
              'frequency.instructions',
              'Listen to two tones and choose which interval had the higher pitch. The difference adapts based on your answers.'
            )}
          </p>
          <div style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.2)',
          }}>
            <p style={{ ...styles.muted, margin: 0 }}>
              {t('modules.disclaimer', 'This is a screening tool, not a medical diagnosis.')}
            </p>
          </div>

          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: 12 }}>
            <div style={styles.section}>
              <div style={{ fontWeight: 900 }}>{t('frequency.referenceTone', 'Reference tone')}</div>
              <div style={styles.muted}>{REF} Hz</div>
              <button onClick={() => playExample(REF)} style={{ ...styles.primaryBtn, marginTop: 10 }}>
                {t('games.play', 'Play')}
              </button>
            </div>
            <div style={styles.section}>
              <div style={{ fontWeight: 900 }}>{t('frequency.higherTone', 'Higher tone')}</div>
              <div style={styles.muted}>{REF + 80} Hz</div>
              <button
                onClick={() => playExample(REF + 80)}
                style={{ ...styles.ghostBtn, marginTop: 10, borderColor: 'rgba(143,211,204,0.25)' }}
              >
                {t('games.play', 'Play')}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12, gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={startPractice}
              style={{ ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandPink})` }}
            >
              {t('frequency.startPractice', 'Start Practice')}
            </button>
            {onCancel ? (
              <button onClick={onCancel} style={styles.ghostBtn}>{t('games.close', 'Close')}</button>
            ) : null}
          </div>
        </div>
      ) : null}

      {stage === 'practice' || stage === 'running' ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 900 }}>
                {stage === 'practice'
                  ? `${t('frequency.practiceLabel', 'Practice')} ${practiceIndex + 1}/${PRACTICE_TRIALS}`
                  : `${t('frequency.trialLabel', 'Trial')} ${i}/${TRIALS}`}
              </div>
              <div style={styles.muted}>
                {t('frequency.deltaLabel', 'Difference')}: {delta} Hz
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{
                ...styles.chip,
                background: 'rgba(143,211,204,0.15)',
                borderColor: 'rgba(143,211,204,0.4)',
              }}>
                {points} pts
              </span>
              <span style={styles.chip}>{t('frequency.objective', 'Adaptive 2IFC')}</span>
            </div>
          </div>

          {/* Difficulty indicator */}
          <div style={{
            marginTop: 12,
            padding: '8px 12px',
            borderRadius: 8,
            background: delta < 30 ? 'rgba(143,211,204,0.15)' : delta < 60 ? 'rgba(175,132,186,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${delta < 30 ? 'rgba(143,211,204,0.3)' : delta < 60 ? 'rgba(175,132,186,0.3)' : 'rgba(255,255,255,0.1)'}`,
            textAlign: 'center',
          }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              {t('frequency.difficultyLabel', 'Difficulty')}: {delta < 30
                ? t('frequency.difficultyHard', 'Hard')
                : delta < 60
                  ? t('frequency.difficultyMedium', 'Medium')
                  : t('frequency.difficultyEasy', 'Easy')} ({delta}Hz)
            </span>
          </div>

          {/* Real-time feedback */}
          {lastFeedback && (
            <div style={{
              marginTop: 12,
              textAlign: 'center',
              padding: '10px 16px',
              borderRadius: 12,
              fontWeight: 900,
              fontSize: 18,
              animation: 'feedbackPop 0.3s ease-out',
              background: lastFeedback === 'correct' ? 'rgba(143,211,204,0.2)' : 'rgba(176,18,112,0.2)',
              color: lastFeedback === 'correct' ? brandCyan : brandPink,
            }}>
              {lastFeedback === 'correct'
                ? `${t('frequency.feedbackCorrect', 'Correct')} ${feedbackPoints ? `+${feedbackPoints}` : ''}`
                : t('frequency.feedbackIncorrect', 'Try again')}
            </div>
          )}

          <div style={{ marginTop: 12, ...styles.section }}>
            <div style={{ fontWeight: 900, color: brandPurpleDark }}>{t('frequency.intervalOne', 'Interval 1')}</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>{t('frequency.playPrompt', 'Press play to hear the tones.')}</p>
            <button
              onClick={playTrial}
              disabled={busy}
              style={busy ? styles.disabledBtn : { ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})` }}
            >
              {t('frequency.playTones', 'Play tones')}
            </button>
          </div>

          <div style={{ marginTop: 12, ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: brandPurpleDark }}>{t('frequency.intervalTwo', 'Interval 2')}</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>{t('frequency.whichHigher', 'Which interval had the higher pitch?')}</p>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginTop: 10 }}>
              <button onClick={() => answer(1)} disabled={!canAnswer} style={!canAnswer ? styles.disabledBtn : styles.primaryBtn}>
                {t('frequency.choiceFirst', 'First tone')}
              </button>
              <button onClick={() => answer(2)} disabled={!canAnswer} style={!canAnswer ? styles.disabledBtn : styles.primaryBtn}>
                {t('frequency.choiceSecond', 'Second tone')}
              </button>
            </div>
            <div style={{ marginTop: 10, ...styles.muted }}>
              {t('frequency.adaptiveHint', 'The difficulty adapts based on your answers.')}
            </div>
          </div>

          <style>{`
            @keyframes feedbackPop {
              0% { transform: scale(0.8); opacity: 0; }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      ) : null}

      {stage === 'done' ? (
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <div style={{ fontWeight: 900 }}>{t('frequency.summaryTitle', 'Frequency discrimination complete')}</div>
          <p style={{ ...styles.muted, marginTop: 6 }}>{t('clinical.screeningDisclaimer')}</p>
        </div>
      ) : null}

    </div>
  );
}
