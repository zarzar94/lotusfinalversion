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
  const { isArabic, t } = useLanguage();
  const audioRef = useRef<AudioContext | null>(null);
  const ensure = () => ensureAudio(audioRef);

  const TRIALS = 20;
  const REF = 500;

  const [stage, setStage] = useState<'intro' | 'running' | 'done'>('intro');
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
        ? 'تمييز قوي لفروقات التردد الصغيرة (ضمن هذا الفحص).'
        : result === 'medium'
          ? 'تمييز متوسط — قد تظهر الصعوبة أكثر مع الضوضاء أو الكلام السريع.'
          : 'تمييز ضعيف نسبيًا ضمن هذا الفحص. إذا كان هناك صعوبات مستمرة في الواقع، يفضل تقييم متخصص.';

    const outcome: TestOutcome = {
      key: 'frequency',
      title: 'اختبار تمييز التردد (2IFC Adaptive)',
      result,
      scoreLabel: `${getStarEmoji(starRating)} Threshold≈${thresholdHz}Hz • ${accuracy}% • ${finalPoints}pts`,
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
        note: 'Threshold here is a rough estimate (no normative calibration).',
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
          <div style={{ fontWeight: 900, color: brandCyan }}>اختبار تمييز التردد (Frequency Discrimination)</div>
          <div style={styles.muted}>اختبار موضوعي بنمط 2IFC مع صعوبة تكيفية لتقدير "عتبة التمييز".</div>
        </div>
        <span style={styles.chip}>{t('auto.FrequencyDiscriminationTestPanel.k1', "Objective")}</span>
      </div>

      {stage === 'intro' ? (
        <div style={{ marginTop: 12 }}>
          <p style={styles.bodyText}>
            ستسمع نغمتين (الأولى ثم الثانية). اختر أيهما أعلى ترددًا. سيضبط النظام الصعوبة تلقائيًا ليقدّر
            <b style={{ color: brandPink }}> أصغر فرق يمكن تمييزه</b> ضمن هذا الفحص.
          </p>

          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: 12 }}>
            <div style={styles.section}>
              <div style={{ fontWeight: 900 }}>مثال (مرجع)</div>
              <div style={styles.muted}>{REF} Hz</div>
              <button onClick={() => playExample(REF)} style={{ ...styles.primaryBtn, marginTop: 10 }}>استمع</button>
            </div>
            <div style={styles.section}>
              <div style={{ fontWeight: 900 }}>مثال (أعلى)</div>
              <div style={styles.muted}>{REF + 80} Hz</div>
              <button onClick={() => playExample(REF + 80)} style={{ ...styles.ghostBtn, marginTop: 10, borderColor: 'rgba(143,211,204,0.25)' }}>استمع</button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12, gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                rowsRef.current = [];
                deltasRef.current = [];
                setI(1);
                setDelta(120);
                setCorrectStreak(0);
                setOrder(nextOrder());
                setPlayed(false);
                setPoints(0);
                setLastFeedback(null);
                setStage('running');
              }}
              style={{ ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandPink})` }}
            >
              ابدأ الاختبار
            </button>
            {onCancel ? (
              <button onClick={onCancel} style={styles.ghostBtn}>إغلاق</button>
            ) : null}
          </div>
        </div>
      ) : null}

      {stage === 'running' ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 900 }}>Trial {i}/{TRIALS}</div>
              <div style={styles.muted}>Delta الحالي: {delta} Hz {delta < 30 && '🎯'}</div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{
                ...styles.chip,
                background: 'rgba(143,211,204,0.15)',
                borderColor: 'rgba(143,211,204,0.4)',
              }}>
                {points} pts
              </span>
              <span style={styles.chip}>{t('auto.FrequencyDiscriminationTestPanel.k2', "2IFC • Adaptive")}</span>
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
              Difficulty: {delta < 30 ? '🔥 Hard' : delta < 60 ? '⚡ Medium' : '📊 Easy'} ({delta}Hz difference)
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
              {lastFeedback === 'correct' ? `✓ Correct! +${feedbackPoints}` : `✗ Wrong ${feedbackPoints}`}
            </div>
          )}

          <div style={{ marginTop: 12, ...styles.section }}>
            <div style={{ fontWeight: 900, color: brandPurpleDark }}>الخطوة 1</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>اضغط "استمع" لتشغيل النغمتين.</p>
            <button
              onClick={playTrial}
              disabled={busy}
              style={busy ? styles.disabledBtn : { ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})` }}
            >
              ▶︎ استمع
            </button>
          </div>

          <div style={{ marginTop: 12, ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: brandPurpleDark }}>الخطوة 2</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>اختر: أيهما أعلى؟</p>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginTop: 10 }}>
              <button onClick={() => answer(1)} disabled={!canAnswer} style={!canAnswer ? styles.disabledBtn : styles.primaryBtn}>
                الأولى أعلى
              </button>
              <button onClick={() => answer(2)} disabled={!canAnswer} style={!canAnswer ? styles.disabledBtn : styles.primaryBtn}>
                الثانية أعلى
              </button>
            </div>
            <div style={{ marginTop: 10, ...styles.muted }}>لا تظهر الإجابة الصحيحة أثناء الاختبار لتقليل التحيّز.</div>
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
          <div style={{ fontWeight: 900 }}>تم حفظ النتيجة ✅</div>
          <p style={{ ...styles.muted, marginTop: 6 }}>يمكنك الآن الانتقال للاختبار التالي.</p>
        </div>
      ) : null}
    </div>
  );
}
