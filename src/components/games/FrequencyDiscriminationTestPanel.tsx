import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPink, brandPurpleDark, styles } from '../styles';
import LabButton from '../labui/LabButton';
import { renderLabIcon } from '../icons/index';
import { ensureAudio, playTone, safeCloseAudio } from './audio';
import { mean, median, stdDev } from './stats';
import type { GameResult, TestOutcome } from './types';
import { FREQUENCY_POINTS, getStarRating, getStarEmoji } from './scoring';
import {
  CalibrationStep,
  CTAResultPanel,
  MetricsSummaryPanel,
  ModuleFrame,
  ModuleHeader,
  PracticeTrialsStep,
} from './ui';

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
  const [summary, setSummary] = useState<{
    result: GameResult;
    thresholdHz: number;
    accuracy: number;
    finalPoints: number;
    consistency: number;
    avgRt: number;
    message: string;
  } | null>(null);

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
        ? '╪¬┘à┘è┘è╪▓ ┘é┘ê┘è ┘ä┘ü╪▒┘ê┘é╪º╪¬ ╪º┘ä╪¬╪▒╪»╪» ╪º┘ä╪╡╪║┘è╪▒╪⌐ (╪╢┘à┘å ┘ç╪░╪º ╪º┘ä┘ü╪¡╪╡).'
        : result === 'medium'
          ? '╪¬┘à┘è┘è╪▓ ┘à╪¬┘ê╪│╪╖ ΓÇö ┘é╪» ╪¬╪╕┘ç╪▒ ╪º┘ä╪╡╪╣┘ê╪¿╪⌐ ╪ú┘â╪½╪▒ ┘à╪╣ ╪º┘ä╪╢┘ê╪╢╪º╪í ╪ú┘ê ╪º┘ä┘â┘ä╪º┘à ╪º┘ä╪│╪▒┘è╪╣.'
          : '╪¬┘à┘è┘è╪▓ ╪╢╪╣┘è┘ü ┘å╪│╪¿┘è┘ï╪º ╪╢┘à┘å ┘ç╪░╪º ╪º┘ä┘ü╪¡╪╡. ╪Ñ╪░╪º ┘â╪º┘å ┘ç┘å╪º┘â ╪╡╪╣┘ê╪¿╪º╪¬ ┘à╪│╪¬┘à╪▒╪⌐ ┘ü┘è ╪º┘ä┘ê╪º┘é╪╣╪î ┘è┘ü╪╢┘ä ╪¬┘é┘è┘è┘à ┘à╪¬╪«╪╡╪╡.';

    const outcome: TestOutcome = {
      key: 'frequency',
      title: '╪º╪«╪¬╪¿╪º╪▒ ╪¬┘à┘è┘è╪▓ ╪º┘ä╪¬╪▒╪»╪» (2IFC Adaptive)',
      result,
      scoreLabel: `${getStarEmoji(starRating)} ThresholdΓëê${thresholdHz}Hz ΓÇó ${accuracy}% ΓÇó ${finalPoints}pts`,
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

    setSummary({
      result,
      thresholdHz,
      accuracy,
      finalPoints,
      consistency,
      avgRt,
      message,
    });
    setStage('done');
    onDone(outcome);
  };

  const canAnswer = played && !busy;
  const summaryTone = summary
    ? summary.result === 'high'
      ? 'success'
      : summary.result === 'medium'
        ? 'warning'
        : 'error'
    : 'neutral';

  return (
    <ModuleFrame>
      <ModuleHeader
        title={'OOrOO"OO OU.USUSO? OU,OOO_O_ (Frequency Discrimination)'}
        subtitle={'OOrOO"OO U.U^OU^O1US O"U+U.O? 2IFC U.O1 O?O1U^O"Oc OU?USU?USOc U,OU,O_USO "O1OO"Oc OU,OU.USUSO?".'}
        tone="cyan"
        status={isArabic ? 'U.U^OU^O1US' : 'Objective'}
        statusTone="cyan"
      />

      {stage === 'intro' ? (
        <CalibrationStep title={t('auto.FrequencyDiscriminationTestPanel.k1', 'Instructions')}>
          <p style={styles.bodyText}>
            ╪│╪¬╪│┘à╪╣ ┘å╪║┘à╪¬┘è┘å (╪º┘ä╪ú┘ê┘ä┘ë ╪½┘à ╪º┘ä╪½╪º┘å┘è╪⌐). ╪º╪«╪¬╪▒ ╪ú┘è┘ç┘à╪º ╪ú╪╣┘ä┘ë ╪¬╪▒╪»╪»┘ï╪º. ╪│┘è╪╢╪¿╪╖ ╪º┘ä┘å╪╕╪º┘à ╪º┘ä╪╡╪╣┘ê╪¿╪⌐ ╪¬┘ä┘é╪º╪ª┘è┘ï╪º ┘ä┘è┘é╪»┘æ╪▒
            <b style={{ color: brandPink }}> ╪ú╪╡╪║╪▒ ┘ü╪▒┘é ┘è┘à┘â┘å ╪¬┘à┘è┘è╪▓┘ç</b> ╪╢┘à┘å ┘ç╪░╪º ╪º┘ä┘ü╪¡╪╡.
          </p>

          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: 12 }}>
            <div style={styles.section}>
              <div style={{ fontWeight: 900 }}>┘à╪½╪º┘ä (┘à╪▒╪¼╪╣)</div>
              <div style={styles.muted}>{REF} Hz</div>
              <LabButton onClick={() => playExample(REF)} style={{ marginTop: 10 }}>
                ╪º╪│╪¬┘à╪╣
              </LabButton>
            </div>
            <div style={styles.section}>
              <div style={{ fontWeight: 900 }}>┘à╪½╪º┘ä (╪ú╪╣┘ä┘ë)</div>
              <div style={styles.muted}>{REF + 80} Hz</div>
              <LabButton variant="ghost" onClick={() => playExample(REF + 80)} style={{ marginTop: 10 }}>
                ╪º╪│╪¬┘à╪╣
              </LabButton>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12, gap: 10, flexWrap: 'wrap' }}>
            <LabButton
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
                setSummary(null);
                setStage('running');
              }}
            >
              ╪º╪¿╪»╪ú ╪º┘ä╪º╪«╪¬╪¿╪º╪▒
            </LabButton>
            {onCancel ? (
              <LabButton variant="ghost" onClick={onCancel}>
                ╪Ñ╪║┘ä╪º┘é
              </LabButton>
            ) : null}
          </div>
        </CalibrationStep>
      ) : null}

      {stage === 'running' ? (
        <PracticeTrialsStep title={isArabic ? `${i}/${TRIALS}` : `Trial ${i}/${TRIALS}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 900 }}>Trial {i}/{TRIALS}</div>
              <div style={styles.muted}>Delta ╪º┘ä╪¡╪º┘ä┘è: {delta} Hz {delta < 30 && '≡ƒÄ»'}</div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{
                ...styles.chip,
                background: 'rgba(143,211,204,0.15)',
                borderColor: 'rgba(143,211,204,0.4)',
              }}>
                {points} pts
              </span>
              <span style={styles.chip}>{isArabic ? '2IFC ΓÇó ╪¬┘â┘è┘ü┘è' : '2IFC ΓÇó Adaptive'}</span>
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
              Difficulty: {delta < 30 ? '≡ƒöÑ Hard' : delta < 60 ? 'ΓÜí Medium' : '≡ƒôè Easy'} ({delta}Hz difference)
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
              {lastFeedback === 'correct' ? `Γ£ô Correct! +${feedbackPoints}` : `Γ£ù Wrong ${feedbackPoints}`}
            </div>
          )}

          <div style={{ marginTop: 12, ...styles.section }}>
            <div style={{ fontWeight: 900, color: brandPurpleDark }}>╪º┘ä╪«╪╖┘ê╪⌐ 1</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>╪º╪╢╪║╪╖ "╪º╪│╪¬┘à╪╣" ┘ä╪¬╪┤╪║┘è┘ä ╪º┘ä┘å╪║┘à╪¬┘è┘å.</p>
            <LabButton onClick={playTrial} disabled={busy}>
              Γû╢∩╕Ä ╪º╪│╪¬┘à╪╣
            </LabButton>
          </div>

          <div style={{ marginTop: 12, ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: brandPurpleDark }}>╪º┘ä╪«╪╖┘ê╪⌐ 2</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>╪º╪«╪¬╪▒: ╪ú┘è┘ç┘à╪º ╪ú╪╣┘ä┘ë╪ƒ</p>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginTop: 10 }}>
              <LabButton onClick={() => answer(1)} disabled={!canAnswer}>
                ╪º┘ä╪ú┘ê┘ä┘ë ╪ú╪╣┘ä┘ë
              </LabButton>
              <LabButton onClick={() => answer(2)} disabled={!canAnswer}>
                ╪º┘ä╪½╪º┘å┘è╪⌐ ╪ú╪╣┘ä┘ë
              </LabButton>
            </div>
            <div style={{ marginTop: 10, ...styles.muted }}>┘ä╪º ╪¬╪╕┘ç╪▒ ╪º┘ä╪Ñ╪¼╪º╪¿╪⌐ ╪º┘ä╪╡╪¡┘è╪¡╪⌐ ╪ú╪½┘å╪º╪í ╪º┘ä╪º╪«╪¬╪¿╪º╪▒ ┘ä╪¬┘é┘ä┘è┘ä ╪º┘ä╪¬╪¡┘è┘æ╪▓.</div>
          </div>

          <style>{`
            @keyframes feedbackPop {
              0% { transform: scale(0.8); opacity: 0; }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </PracticeTrialsStep>
      ) : null}

      {stage === 'done' && summary ? (
        <>
          <MetricsSummaryPanel
            title={summary.message}
            tone={summaryTone}
            metrics={[
              { label: 'Threshold', value: `${summary.thresholdHz} Hz` },
              { label: 'Accuracy', value: `${summary.accuracy}%` },
              { label: 'Points', value: summary.finalPoints },
              { label: 'Consistency', value: summary.consistency },
              { label: 'Avg RT', value: summary.avgRt ? `${summary.avgRt} ms` : '--' },
            ]}
            footer={t('clinical.screeningDisclaimer')}
          />
          <CTAResultPanel
            title={(
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {renderLabIcon('\u2705', { size: 16, tone: 'success' })}
                <span>{isArabic ? 'تم حفظ النتيجة' : 'Result saved'}</span>
              </span>
            )}
            description={isArabic ? 'يمكنك العودة للوحة أو بدء جلسة أخرى.' : 'You can return to the dashboard or start another session.'}
            actions={onCancel ? (
              <LabButton variant="ghost" onClick={onCancel}>
                {isArabic ? 'إغلاق' : 'Close'}
              </LabButton>
            ) : undefined}
          />
        </>
      ) : null}
    </ModuleFrame>
  );
}
