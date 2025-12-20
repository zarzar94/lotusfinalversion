import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPink, brandPurpleDark, styles } from '../styles';
import {
  ensureAudio,
  playTone,
  safeCloseAudio,
  setNoiseLevel,
  stopNoise,
  type AudioRef,
  type NoiseRef,
} from './audio';
import { clamp01, dPrime, mean } from './stats';
import type { GameResult, TestOutcome } from './types';
import {
  ATTENTION_POINTS,
  type ComboState,
  createComboState,
  updateCombo,
  calculateFatigueIndex,
  getStarRating,
  getStarEmoji,
} from './scoring';
import ModuleFlowShell, { useModuleFlow } from './ModuleFlowShell';

type Trial = {
  i: number;
  isTarget: boolean;
  freq: number;
  noise: number;
  responded: boolean;
  responseType?: 'hit' | 'fa' | 'miss' | 'cr';
  rtMs?: number;
};

type FeedbackType = 'hit' | 'miss' | 'fa' | 'combo' | null;

const TARGET_FREQ = 880;
const NON_TARGET_FREQS = [440, 520, 600, 660, 720];

const TOTAL = 36;
const TARGETS = 9;
const PRACTICE_TOTAL = 3;
const PRACTICE_TARGETS = 1;
const RESPONSE_MIN = 140; // ms
const RESPONSE_MAX = 1100; // ms
const INTER_TRIAL = 1250; // ms between tones

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildTrials = (total = TOTAL, targetCount = TARGETS): Trial[] => {
  const flags = shuffle([...Array(targetCount)].map(() => true).concat([...Array(total - targetCount)].map(() => false)));
  const trials: Trial[] = flags.map((isTarget, idx) => {
    const noise = 0.02 + (idx / Math.max(1, total - 1)) * 0.14; // 0.02 + 0.16
    const freq = isTarget ? TARGET_FREQ : NON_TARGET_FREQS[Math.floor(Math.random() * NON_TARGET_FREQS.length)];
    return { i: idx + 1, isTarget, freq, noise, responded: false };
  });
  // Light constraint: avoid 3 targets in a row
  for (let k = 2; k < trials.length; k++) {
    if (trials[k].isTarget && trials[k - 1].isTarget && trials[k - 2].isTarget) {
      const j = trials.findIndex((t, idx) => idx > k && !t.isTarget);
      if (j > -1) {
        const tmp = trials[k];
        trials[k] = trials[j];
        trials[j] = tmp;
      }
    }
  }
  return trials;
};

type SharedAudioProps = {
  audioRef: AudioRef;
  noiseRef: NoiseRef;
};

function AttentionHeader({ chipLabel }: { chipLabel?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 900, color: brandCyan }}>OOrO¦O"OOñ OU,OU+O¦O"OUØ OU,O3U.O1US O¦O-O¦ OU,OU^OOO­</div>
        <div style={styles.muted}>U?O-Oæ U.U^OU^O1US U,OæUSOñ (Go/No-Go) U,U,USOO3 OU,OU+O¦O"OUØ OU,OU+O¦U,OOÝUS U^OU,OU+O_U?OO1USOc.</div>
      </div>
      {chipLabel ? <span style={styles.chip}>{chipLabel}</span> : null}
    </div>
  );
}

function AttentionPractice({ audioRef, noiseRef }: SharedAudioProps) {
  const { isArabic } = useLanguage();
  const { setNextEnabled } = useModuleFlow();
  const [stage, setStage] = useState<'idle' | 'running' | 'done'>('idle');
  const [trialIndex, setTrialIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackType>(null);

  const trialsRef = useRef<Trial[]>([]);
  const currentRef = useRef<{ idx: number; onset: number } | null>(null);
  const timerRef = useRef<number | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
    stopNoise(noiseRef);
    currentRef.current = null;
  }, [noiseRef]);

  useEffect(() => {
    setNextEnabled(false);
    return () => {
      cleanup();
    };
  }, [cleanup, setNextEnabled]);

  const showFeedback = useCallback((type: FeedbackType) => {
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    setFeedback(type);
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback(null);
    }, 400);
  }, []);

  const runTrial = (idx: number) => {
    const trials = trialsRef.current;
    if (idx >= trials.length) {
      finish();
      return;
    }

    const t = trials[idx];
    setTrialIndex(idx + 1);

    const audio = ensureAudio(audioRef);
    setNoiseLevel(audio, noiseRef, t.noise);

    currentRef.current = { idx, onset: performance.now() };

    playTone(audio, { freq: t.freq, duration: 0.22, volume: 0.22, type: 'sine' });

    timerRef.current = window.setTimeout(() => {
      const cur = currentRef.current;
      if (cur && cur.idx === idx) {
        if (t.isTarget && !t.responded) t.responseType = 'miss';
        if (!t.isTarget && !t.responded) t.responseType = 'cr';
        currentRef.current = null;
      }
      runTrial(idx + 1);
    }, INTER_TRIAL);
  };

  const startPractice = async () => {
    const audio = ensureAudio(audioRef);
    try {
      await audio.resume();
    } catch {
      // ignore
    }

    trialsRef.current = buildTrials(PRACTICE_TOTAL, PRACTICE_TARGETS);
    setTrialIndex(0);
    setFeedback(null);
    setStage('running');

    cleanup();
    runTrial(0);
  };

  const respond = () => {
    if (stage !== 'running') return;
    const cur = currentRef.current;
    const trials = trialsRef.current;
    const now = performance.now();

    if (!cur || !trials[cur.idx]) {
      showFeedback('fa');
      return;
    }

    const t = trials[cur.idx];
    const dt = now - cur.onset;

    if (dt < RESPONSE_MIN || dt > RESPONSE_MAX) {
      showFeedback('fa');
      return;
    }

    if (t.responded) {
      showFeedback('fa');
      return;
    }

    t.responded = true;
    t.rtMs = Math.round(dt);

    if (t.isTarget) {
      t.responseType = 'hit';
      showFeedback('hit');
    } else {
      t.responseType = 'fa';
      showFeedback('fa');
    }
  };

  const finish = () => {
    cleanup();
    setStage('done');
    setNextEnabled(true);
  };

  const progressLabel = stage === 'running' ? `${trialIndex}/${PRACTICE_TOTAL}` : '';

  return (
    <div style={{ marginTop: 12 }}>
      <AttentionHeader chipLabel={progressLabel} />

      {stage === 'idle' ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: brandCyan }}>
              {isArabic ? 'U.O1OñU? O¦O_OñUSO"' : 'Quick Practice'}
            </div>
            <p style={{ ...styles.muted, marginTop: 6 }}>
              {isArabic
                ? 'O3O¦O3U.O1 3 OO3O¦OªO"Oc O¦O_OñUSO" UU?Oñ. OOO§Oú U?U,Oú O1U+O_ O3U.OO1.'
                : 'You will hear 3 short practice tones. Tap only for the high target tone.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
              <button
                onClick={startPractice}
                style={{ ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})` }}
              >
                {isArabic ? 'OO"O_Oœ O¦O_OñUSO"' : 'Start Practice'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {stage === 'running' ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ marginTop: 12, padding: 18, borderRadius: 16, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(0,0,0,0.18)' }}>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>OýOñ OU,OO3O¦OªOO"Oc</div>
            <button
              onClick={respond}
              style={{
                ...styles.primaryBtn,
                width: '100%',
                padding: '18px 16px',
                fontSize: 18,
                background: feedback === 'hit'
                  ? `linear-gradient(135deg, ${brandCyan}, #4ECCA3)`
                  : feedback === 'fa'
                    ? `linear-gradient(135deg, ${brandPink}, #8B1538)`
                    : `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})`,
                transition: 'background 0.2s ease',
              }}
            >
              dY`+ OOO§Oú O1U+O_ O3U.OO1 Target
            </button>
            <div style={{ marginTop: 10, ...styles.muted }}>
              U+OæUSO-Oc: U,O O¦OO§Oú O"O3OñO1Oc. OU,OO§Oú OU,O1O'U^OOÝUS USOýUSO_ OU,OU+O_U?OO1 U^USOO®Oñ O1U,U% OU,U+O¦USOªOc.
            </div>
            {feedback ? (
              <div style={{ marginTop: 10, color: feedback === 'hit' ? brandCyan : brandPink, fontWeight: 700, textAlign: 'center' }}>
                {feedback === 'hit' ? (isArabic ? 'OæO-USO-' : 'Correct') : (isArabic ? 'O¦U+O"USUØ OrOOúOÝ' : 'False alarm')}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {stage === 'done' ? (
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <div style={{ fontWeight: 900 }}>{isArabic ? 'OœO-O3U+O¦!' : 'Practice complete.'}</div>
          <p style={{ ...styles.muted, marginTop: 6 }}>
            {isArabic ? 'OOO§Oú O3OñUSO1 OU,OOrO¦O"OOñ.' : 'Click Next to begin the main test.'}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function AttentionMain({ audioRef, noiseRef, onDone }: SharedAudioProps & { onDone: (outcome: TestOutcome) => void }) {
  const { isArabic } = useLanguage();

  const [stage, setStage] = useState<'running' | 'done'>('running');
  const [trialIndex, setTrialIndex] = useState(0);
  const [hits, setHits] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [impulsiveTaps, setImpulsiveTaps] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);

  const [points, setPoints] = useState(0);
  const [combo, setCombo] = useState<ComboState>(createComboState);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [lastPointChange, setLastPointChange] = useState(0);

  const trialsRef = useRef<Trial[]>([]);
  const currentRef = useRef<{ idx: number; onset: number } | null>(null);
  const rtsRef = useRef<number[]>([]);
  const timerRef = useRef<number | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  const ensure = () => ensureAudio(audioRef);

  const showFeedback = useCallback((type: FeedbackType, pointChange: number) => {
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    setFeedback(type);
    setLastPointChange(pointChange);
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback(null);
      setLastPointChange(0);
    }, 400);
  }, []);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
    stopNoise(noiseRef);
    currentRef.current = null;
  }, [noiseRef]);

  const start = async () => {
    const audio = ensure();
    try {
      await audio.resume();
    } catch {
      // ignore
    }

    trialsRef.current = buildTrials(TOTAL, TARGETS);
    rtsRef.current = [];

    setHits(0);
    setFalseAlarms(0);
    setImpulsiveTaps(0);
    setMsg(null);
    setTrialIndex(0);
    setPoints(0);
    setCombo(createComboState());
    setFeedback(null);
    setLastPointChange(0);
    setStage('running');

    cleanup();
    runTrial(0);
  };

  useEffect(() => {
    start();
    return () => {
      cleanup();
    };
  }, []);

  const runTrial = (idx: number) => {
    const trials = trialsRef.current;
    if (idx >= trials.length) {
      finish();
      return;
    }

    const t = trials[idx];
    setTrialIndex(idx + 1);

    const audio = ensure();
    setNoiseLevel(audio, noiseRef, t.noise);

    currentRef.current = { idx, onset: performance.now() };

    playTone(audio, { freq: t.freq, duration: 0.22, volume: 0.22, type: 'sine' });

    timerRef.current = window.setTimeout(() => {
      const cur = currentRef.current;
      if (cur && cur.idx === idx) {
        if (t.isTarget && !t.responded) t.responseType = 'miss';
        if (!t.isTarget && !t.responded) t.responseType = 'cr';
        currentRef.current = null;
      }
      runTrial(idx + 1);
    }, INTER_TRIAL);
  };

  const respond = () => {
    if (stage !== 'running') return;
    const cur = currentRef.current;
    const trials = trialsRef.current;
    const now = performance.now();

    if (!cur || !trials[cur.idx]) {
      setImpulsiveTaps((x) => x + 1);
      const newCombo = updateCombo(combo, 'fa');
      setCombo(newCombo);
      setPoints((p) => Math.max(0, p + ATTENTION_POINTS.falseAlarm));
      showFeedback('fa', ATTENTION_POINTS.falseAlarm);
      return;
    }

    const t = trials[cur.idx];
    const dt = now - cur.onset;

    if (dt < RESPONSE_MIN || dt > RESPONSE_MAX) {
      setImpulsiveTaps((x) => x + 1);
      const newCombo = updateCombo(combo, 'fa');
      setCombo(newCombo);
      setPoints((p) => Math.max(0, p + ATTENTION_POINTS.falseAlarm));
      showFeedback('fa', ATTENTION_POINTS.falseAlarm);
      return;
    }

    if (t.responded) {
      setImpulsiveTaps((x) => x + 1);
      const newCombo = updateCombo(combo, 'fa');
      setCombo(newCombo);
      setPoints((p) => Math.max(0, p + ATTENTION_POINTS.falseAlarm));
      showFeedback('fa', ATTENTION_POINTS.falseAlarm);
      return;
    }

    t.responded = true;
    t.rtMs = Math.round(dt);

    if (t.isTarget) {
      t.responseType = 'hit';
      setHits((h) => h + 1);
      rtsRef.current.push(dt);

      const newCombo = updateCombo(combo, 'hit');
      setCombo(newCombo);

      let pointsGained = Math.round(ATTENTION_POINTS.hit * newCombo.multiplier);

      if (dt < 500) {
        pointsGained += ATTENTION_POINTS.speedBonus;
      }

      if (newCombo.streak > 0 && newCombo.streak % 5 === 0) {
        pointsGained += ATTENTION_POINTS.comboBonus * (newCombo.streak / 5);
        showFeedback('combo', pointsGained);
      } else {
        showFeedback('hit', pointsGained);
      }

      setPoints((p) => p + pointsGained);
    } else {
      t.responseType = 'fa';
      setFalseAlarms((f) => f + 1);
      const newCombo = updateCombo(combo, 'fa');
      setCombo(newCombo);
      setPoints((p) => Math.max(0, p + ATTENTION_POINTS.falseAlarm));
      showFeedback('fa', ATTENTION_POINTS.falseAlarm);
    }
  };

  const finish = () => {
    cleanup();

    const trials = trialsRef.current;
    const targetTrials = trials.filter((t) => t.isTarget).length;
    const nonTargetTrials = Math.max(1, trials.length - targetTrials);

    const h = hits;
    const fa = falseAlarms;
    const impulsive = impulsiveTaps;

    const hitRate = clamp01(h / Math.max(1, targetTrials));
    const faRate = clamp01(fa / nonTargetTrials);

    const dp = dPrime(hitRate, faRate);
    const avgRt = Math.round(mean(rtsRef.current));

    const dpClamped = Math.max(0, Math.min(3, dp));
    const impulsePenalty = Math.min(30, impulsive * 3);
    const score100 = Math.max(0, Math.min(100, Math.round((dpClamped / 3) * 100 - impulsePenalty)));

    const fatigueAnalysis = calculateFatigueIndex(trials);

    const result: GameResult =
      dp >= 1.2 && hitRate >= 0.7 && faRate <= 0.25 && impulsive <= 5 ? 'high'
        : dp >= 0.65 && impulsive <= 12 ? 'medium'
          : 'low';

    let message =
      result === 'high'
        ? 'OO3O¦OªOO"Oc U,U^USOc U,U,U.O®USOñOO¦ OU,O3U.O1USOc OU,U.O3O¦UØO_U?Oc U.O1 OU^OOO­ U.O¦OýOUSO_Oc (OU+O¦O"OUØ OU+O¦U,OOÝUS OªUSO_ OU.U+ UØOøO OU,U?O-Oæ).'
        : result === 'medium'
          ? 'O,UØOñO¦ O"O1O OU,OœOrOúOO­/OU,OU+O_U?OO1USOc O¦O-O¦ OU,OU^OOO­. U.U+ OU,U.U?USO_ O¦OªOñO"Oc OOrO¦O"OOñ OU,O¦OñO_O_ + OU,O¦O3U,O3U, OU,O3U.O1US U,U,O-OæU^U, O1U,U% OæU^OñOc OœO_U,.'
          : 'O,UØOñO¦ OæO1U^O"Oc U^OOO-Oc U?US O¦U.USUSOý OU,U.O®USOñ OU,U.O3O¦UØO_U? OœU^ OO"Oú OU,OO3O¦OªOO"Oc O¦O-O¦ OU,OU^OOO­. OOøO UŸOU+ UØOøO USU+O1UŸO3 O1U,U% OU,OœO_OO­ OU,O_OñOO3US/OU,O3U,U^UŸUSOO U+U+OæO- O"O¦U,USUSU. U.O¦OrOæOæ.';

    if (fatigueAnalysis.fatigueIndex === 'high') {
      message += ' ƒsÿ‹,? U,U^O-O, OU+OrU?OO U?US OU,OœO_OO­ U+O-U^ U+UØOUSOc OU,OOrO¦O"OOñOO U.U.O U,O_ USO\'USOñ OU,U% OOñUØOU, O3U.O1US.';
    } else if (fatigueAnalysis.fatigueIndex === 'moderate') {
      message += ' O¦OñOOªO1 OúU?USU? U?US OU,OœO_OO­ U+O-U^ OU,U+UØOUSOc.';
    }

    const starRating = getStarRating(result);

    const outcome: TestOutcome = {
      key: 'attention',
      title: 'OOrO¦O"OOñ OU,OU+O¦O"OUØ OU,O3U.O1US O¦O-O¦ OU,OU^OOO­ (Go/No-Go)',
      result,
      scoreLabel: `${getStarEmoji(starRating)} ${score100}/100 ƒ?› d'=${dp.toFixed(2)} ƒ?› RTƒ%^${avgRt}ms ƒ?› ${points}pts ƒ?› OU+O_U?OO1=${impulsive}`,
      message,
      metrics: {
        trials: trials.length,
        targets: targetTrials,
        hits: h,
        falseAlarms: fa,
        impulsiveTaps: impulsive,
        hitRate: hitRate.toFixed(2),
        falseAlarmRate: faRate.toFixed(2),
        dPrime: dp.toFixed(2),
        avgReactionMs: avgRt,
        impulsePenaltyPoints: impulsePenalty,
        maxNoiseLevel: Math.max(...trials.map((t) => t.noise)).toFixed(2),
        gamePoints: points,
        maxComboStreak: combo.maxStreak,
        starRating,
        fatigueIndex: fatigueAnalysis.fatigueIndex,
        fatigueScore: fatigueAnalysis.fatigueScore,
        earlyHitRate: fatigueAnalysis.earlyPerformance.hitRate.toFixed(2),
        lateHitRate: fatigueAnalysis.latePerformance.hitRate.toFixed(2),
        earlyAvgRt: Math.round(fatigueAnalysis.earlyPerformance.avgRt),
        lateAvgRt: Math.round(fatigueAnalysis.latePerformance.avgRt),
        rtIncreasePercent: fatigueAnalysis.rtIncrease,
      },
      trials: trials.map((t) => ({
        i: t.i,
        target: t.isTarget,
        freq: t.freq,
        noise: Number(t.noise.toFixed(3)),
        responded: t.responded,
        responseType: t.responseType ?? (t.isTarget ? 'miss' : 'cr'),
        rtMs: t.rtMs ?? null,
      })),
    };

    setStage('done');
    onDone(outcome);
  };

  const progressPct = useMemo(() => Math.round((trialIndex / TOTAL) * 100), [trialIndex]);

  return (
    <div style={{ marginTop: 12 }}>
      <AttentionHeader chipLabel={isArabic ? 'U.U^OU^O1US' : 'Objective'} />

      {stage === 'running' ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 900 }}>OU,O¦U,O_U.: {trialIndex}/{TOTAL} ({progressPct}%)</div>
              <div style={styles.muted}>OOO§Oú U?U,Oú O1U+O_ O3U.OO1 OU,U+O§U.Oc OU,O1OU,USOc OªO_OU&lt;.</div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={styles.chip}>Hits ƒo. {hits}</span>
              <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.14)', borderColor: 'rgba(176,18,112,0.25)' }}>FA ƒo- {falseAlarms}</span>
              <span style={{ ...styles.chip, background: 'rgba(143,132,186,0.14)', borderColor: 'rgba(143,132,186,0.25)' }}>OU+O_U?OO1 ƒs­ {impulsiveTaps}</span>
            </div>
          </div>

          <div style={{
            marginTop: 12,
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}>
            <div style={{
              ...styles.section,
              padding: '12px 20px',
              textAlign: 'center',
              minWidth: 120,
              background: 'rgba(143,211,204,0.1)',
              borderColor: 'rgba(143,211,204,0.3)',
            }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>POINTS</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: brandCyan }}>{points}</div>
            </div>
            <div style={{
              ...styles.section,
              padding: '12px 20px',
              textAlign: 'center',
              minWidth: 120,
              background: combo.streak >= 5 ? 'rgba(175,132,186,0.2)' : 'rgba(175,132,186,0.1)',
              borderColor: combo.streak >= 5 ? 'rgba(175,132,186,0.5)' : 'rgba(175,132,186,0.3)',
              transition: 'all 0.2s ease',
            }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>COMBO</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: brandPurpleDark }}>
                {combo.streak}dY"
                {combo.multiplier > 1 && <span style={{ fontSize: 14, marginLeft: 4 }}>A-{combo.multiplier.toFixed(1)}</span>}
              </div>
            </div>
          </div>

          {feedback && (
            <div style={{
              marginTop: 12,
              textAlign: 'center',
              padding: '8px 16px',
              borderRadius: 12,
              fontWeight: 900,
              fontSize: 18,
              animation: 'feedbackPop 0.3s ease-out',
              background: feedback === 'hit' ? 'rgba(143,211,204,0.2)'
                : feedback === 'combo' ? 'rgba(255,215,0,0.2)'
                : 'rgba(176,18,112,0.2)',
              color: feedback === 'hit' ? brandCyan
                : feedback === 'combo' ? '#FFD700'
                : brandPink,
            }}>
              {feedback === 'hit' && `ƒo" +${lastPointChange}`}
              {feedback === 'combo' && `dY" COMBO! +${lastPointChange}`}
              {feedback === 'fa' && `ƒo- ${lastPointChange}`}
              {feedback === 'miss' && `ƒS~ Missed`}
            </div>
          )}

          <div style={{ marginTop: 12, padding: 18, borderRadius: 16, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(0,0,0,0.18)' }}>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>OýOñ OU,OO3O¦OªOO"Oc</div>
            <button
              onClick={respond}
              style={{
                ...styles.primaryBtn,
                width: '100%',
                padding: '18px 16px',
                fontSize: 18,
                background: feedback === 'hit' || feedback === 'combo'
                  ? `linear-gradient(135deg, ${brandCyan}, #4ECCA3)`
                  : feedback === 'fa'
                    ? `linear-gradient(135deg, ${brandPink}, #8B1538)`
                    : `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})`,
                transition: 'background 0.2s ease',
              }}
            >
              dY`+ OOO§Oú O1U+O_ O3U.OO1 Target
            </button>
            <div style={{ marginTop: 10, ...styles.muted }}>
              U+OæUSO-Oc: U,O O¦OO§Oú O"O3OñO1Oc. OU,OO§Oú OU,O1O'U^OOÝUS USOýUSO_ OU,OU+O_U?OO1 U^USOO®Oñ O1U,U% OU,U+O¦USOªOc.
            </div>
          </div>

          {msg ? <div style={{ marginTop: 10, ...styles.muted }}>{msg}</div> : null}

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
          <div style={{ fontWeight: 900 }}>O¦U. O-U?O, OU,U+O¦USOªOc ƒo.</div>
          <p style={{ ...styles.muted, marginTop: 6 }}>USU.UŸU+UŸ OU,O›U+ OU,OU+O¦U,OU, U,U,OOrO¦O"OOñ OU,O¦OU,US.</p>
        </div>
      ) : null}
    </div>
  );
}

export default function AttentionTestPanel({
  onDone,
  onCancel,
}: {
  onDone: (outcome: TestOutcome) => void;
  onCancel?: () => void;
}) {
  const audioRef = useRef<AudioContext | null>(null);
  const noiseRef: NoiseRef = useRef(null);

  useEffect(() => {
    return () => {
      stopNoise(noiseRef);
      safeCloseAudio(audioRef);
    };
  }, []);

  const instructions = {
    ar: 'استمع للنغمة العالية الهدف واضغط عند سماعها. تجاهل النغمات الأخرى قدر الإمكان.',
    en: 'Listen for the high-pitched target tone and tap when you hear it. Ignore the other tones.',
  };

  return (
    <ModuleFlowShell
      moduleId="attention"
      instructions={instructions}
      practiceTrials={[<AttentionPractice key="attention-practice" audioRef={audioRef} noiseRef={noiseRef} />]}
      realTrials={[<AttentionMain key="attention-main" audioRef={audioRef} noiseRef={noiseRef} onDone={onDone} />]}
      onCancel={onCancel}
    />
  );
}
