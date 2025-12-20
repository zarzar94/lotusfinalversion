import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPink, brandPurpleDark, styles } from '../styles';
import { ensureAudio, playTone, safeCloseAudio } from './audio';
import { mean, stdDev } from './stats';
import type { GameResult, TestOutcome } from './types';
import { calculateFatigueIndex, getStarEmoji, getStarRating } from './scoring';

type StimulusMode = 'visual' | 'audio';

type Stimulus = {
  mode: StimulusMode;
  label: string;
  freq?: number;
};

type Trial = {
  i: number;
  isTarget: boolean;
  stimulus: Stimulus;
  responded: boolean;
  responseType?: 'hit' | 'fa' | 'miss' | 'cr';
  rtMs?: number;
};

const VISUAL_TARGET = 'X';
const VISUAL_DISTRACTORS = ['O', '+', '#', '%', '*', '='];
const AUDIO_TARGET_FREQ = 880;
const AUDIO_DISTRACTORS = [440, 520, 600, 660, 720];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const createStimulus = (isTarget: boolean, mode: StimulusMode): Stimulus => {
  if (mode === 'audio') {
    const freq = isTarget ? AUDIO_TARGET_FREQ : AUDIO_DISTRACTORS[Math.floor(Math.random() * AUDIO_DISTRACTORS.length)];
    return { mode, label: 'TONE', freq };
  }
  const symbol = isTarget ? VISUAL_TARGET : VISUAL_DISTRACTORS[Math.floor(Math.random() * VISUAL_DISTRACTORS.length)];
  return { mode, label: symbol };
};

const buildTrials = (total: number, targetCount: number, mode: StimulusMode): Trial[] => {
  const flags = shuffle(
    [...Array(targetCount)].map(() => true).concat([...Array(total - targetCount)].map(() => false))
  );
  return flags.map((isTarget, idx) => ({
    i: idx + 1,
    isTarget,
    stimulus: createStimulus(isTarget, mode),
    responded: false,
  }));
};

export default function FocusedAttentionTestPanel({
  onDone,
  onCancel,
  stimulusMode = 'visual',
}: {
  onDone: (outcome: TestOutcome) => void;
  onCancel?: () => void;
  stimulusMode?: StimulusMode;
}) {
  const { isArabic, t } = useLanguage();
  const isAudioMode = stimulusMode === 'audio';
  const audioRef = useRef<AudioContext | null>(null);

  const [stage, setStage] = useState<'intro' | 'practice' | 'running' | 'done'>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [stimulus, setStimulus] = useState<Stimulus | null>(null);
  const [stimulusVisible, setStimulusVisible] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    score100: number;
    result: GameResult;
    accuracy: number;
    avgRt: number;
    lapses: number;
    consistency: number;
    fatigueSlope: number;
    message: string;
  } | null>(null);

  const trialsRef = useRef<Trial[]>([]);
  const practiceRef = useRef<Trial[]>([]);
  const currentRef = useRef<{ idx: number; practice: boolean; onset: number } | null>(null);
  const rtsRef = useRef<number[]>([]);
  const timerRef = useRef<number | null>(null);
  const stimulusTimerRef = useRef<number | null>(null);

  const TOTAL_TRIALS = 30;
  const TARGET_TRIALS = 8;
  const PRACTICE_TRIALS = 3;
  const PRACTICE_TARGETS = 1;
  const STIMULUS_MS = 650;
  const INTER_TRIAL_MS = 1000;
  const RESPONSE_MIN = 150;

  const introInstruction = isAudioMode
    ? (isArabic
      ? 'اضغط على المسافة أو زر الاستجابة عند سماع النغمة المستهدفة. تجاهل النغمات الأخرى.'
      : 'Press Space or the response button when you hear the target tone. Ignore other tones.')
    : isArabic
      ? 'اضغط على المسافة أو زر الاستجابة عندما ترى الرمز المستهدف. تجاهل الرموز الأخرى.'
      : 'Press Space or the response button when you see the target. Ignore other symbols.';
  const shortInstruction = isAudioMode
    ? (isArabic ? 'استجب فقط عند سماع النغمة المستهدفة.' : 'Respond only when the target tone plays.')
    : isArabic
      ? 'استجب فقط عندما يظهر الرمز المستهدف.'
      : 'Respond only when the target symbol appears.';
  const responsePrompt = isAudioMode
    ? (isArabic ? 'اضغط المسافة أو زر الاستجابة عند سماع النغمة المستهدفة.' : 'Press Space or the response button when you hear the target tone.')
    : isArabic
      ? 'اضغط المسافة أو زر الاستجابة'
      : 'Press Space or the response button';

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (stimulusTimerRef.current) {
      window.clearTimeout(stimulusTimerRef.current);
      stimulusTimerRef.current = null;
    }
    currentRef.current = null;
    setStimulusVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
      safeCloseAudio(audioRef);
    };
  }, [cleanup]);

  const showFeedback = (text: string) => {
    setFeedback(text);
    window.setTimeout(() => setFeedback(null), 500);
  };

  const prepareAudio = useCallback(() => {
    if (!isAudioMode) return;
    const audio = ensureAudio(audioRef);
    audio.resume().catch(() => {});
  }, [isAudioMode]);

  const playExample = useCallback((freq: number) => {
    if (!isAudioMode) return;
    const audio = ensureAudio(audioRef);
    audio.resume().catch(() => {});
    playTone(audio, { freq, duration: 0.35, volume: 0.24 });
  }, [isAudioMode]);

  const runTrial = (idx: number, practice: boolean) => {
    const trials = practice ? practiceRef.current : trialsRef.current;
    if (idx >= trials.length) {
      if (practice) {
        startTest();
      } else {
        finish();
      }
      return;
    }

    const t = trials[idx];
    currentRef.current = { idx, practice, onset: performance.now() };
    setStimulus(t.stimulus);
    setStimulusVisible(true);
    if (t.stimulus.mode === 'audio' && t.stimulus.freq) {
      const audio = ensureAudio(audioRef);
      playTone(audio, { freq: t.stimulus.freq, duration: 0.22, volume: 0.22 });
    }
    if (practice) setPracticeIndex(idx + 1);
    else setTrialIndex(idx + 1);

    if (stimulusTimerRef.current) window.clearTimeout(stimulusTimerRef.current);
    stimulusTimerRef.current = window.setTimeout(() => setStimulusVisible(false), STIMULUS_MS);

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const cur = currentRef.current;
      if (cur && cur.idx === idx) {
        if (t.isTarget && !t.responded) t.responseType = 'miss';
        if (!t.isTarget && !t.responded) t.responseType = 'cr';
        currentRef.current = null;
      }
      runTrial(idx + 1, practice);
    }, INTER_TRIAL_MS);
  };

  const startPractice = () => {
    cleanup();
    prepareAudio();
    practiceRef.current = buildTrials(PRACTICE_TRIALS, PRACTICE_TARGETS, stimulusMode);
    setPracticeIndex(0);
    setStage('practice');
    runTrial(0, true);
  };

  const startTest = () => {
    cleanup();
    prepareAudio();
    trialsRef.current = buildTrials(TOTAL_TRIALS, TARGET_TRIALS, stimulusMode);
    rtsRef.current = [];
    setTrialIndex(0);
    setSummary(null);
    setStage('running');
    runTrial(0, false);
  };

  const respond = useCallback(() => {
    if (stage !== 'practice' && stage !== 'running') return;
    const cur = currentRef.current;
    if (!cur) return;
    const trials = cur.practice ? practiceRef.current : trialsRef.current;
    const t = trials[cur.idx];
    if (t.responded) return;

    const now = performance.now();
    const rt = Math.round(now - cur.onset);
    if (rt < RESPONSE_MIN) return;

    t.responded = true;
    t.rtMs = rt;
    t.responseType = t.isTarget ? 'hit' : 'fa';

    if (!cur.practice && t.isTarget) rtsRef.current.push(rt);

    if (cur.practice) {
      showFeedback(t.isTarget ? (isArabic ? 'صحيح' : 'Correct') : (isArabic ? 'تنبيه خاطئ' : 'False alarm'));
    }
  }, [isArabic, stage]);

  useEffect(() => {
    if (stage !== 'practice' && stage !== 'running') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        respond();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [respond, stage]);

  const finish = () => {
    cleanup();
    const trials = trialsRef.current;
    const targets = trials.filter((t) => t.isTarget);
    const nonTargets = trials.filter((t) => !t.isTarget);
    const hits = targets.filter((t) => t.responseType === 'hit').length;
    const misses = targets.filter((t) => t.responseType === 'miss').length;
    const falseAlarms = nonTargets.filter((t) => t.responseType === 'fa').length;
    const correctRejects = nonTargets.filter((t) => t.responseType === 'cr').length;

    const accuracy = Math.round(((hits + correctRejects) / Math.max(1, trials.length)) * 100);
    const avgRt = Math.round(mean(rtsRef.current));
    const rtStd = Math.round(stdDev(rtsRef.current));

    const fatigue = calculateFatigueIndex(trials);
    const consistency = Math.max(0, Math.round(100 - fatigue.rtVariability));
    const slopeBase = rtsRef.current.length >= 2 ? fatigue.rtIncrease : fatigue.hitRateDrop;
    const fatigueSlope = Math.round(slopeBase * 10) / 10;

    let score = accuracy;
    if (avgRt > 0) {
      const speedScore = Math.max(0, 100 - Math.max(0, avgRt - 350) * 0.1);
      score = Math.round(accuracy * 0.7 + speedScore * 0.3 - falseAlarms * 2);
    }
    score = Math.max(0, Math.min(100, score));

    const result: GameResult = score >= 85 ? 'high' : score >= 70 ? 'medium' : 'low';
    const starRating = getStarRating(result);

    const message =
      result === 'high'
        ? t('attention.summaryHigh')
        : result === 'medium'
          ? t('attention.summaryMid')
          : t('attention.summaryLow');

    const outcome: TestOutcome = {
      key: 'focused_attention',
      title: isArabic ? 'الانتباه المركز (CPT)' : 'Focused Auditory Attention (CPT / Odd-One-Out)',
      result,
      scoreLabel: `${getStarEmoji(starRating)} Score ${score}/100 · ${accuracy}% · ${avgRt || '--'}ms`,
      message,
      metrics: {
        trials: trials.length,
        targets: targets.length,
        hits,
        misses,
        falseAlarms,
        correctRejects,
        accuracyPct: accuracy,
        avgReactionMs: avgRt,
        rtStdMs: rtStd,
        lapses: misses,
        rtVariability: fatigue.rtVariability,
        consistencyScore: consistency,
        fatigueScore: fatigue.fatigueScore,
        fatigueIndex: fatigue.fatigueIndex,
        fatigueSlope,
        score100: score,
        stimulusMode,
      },
      trials,
    };

    setSummary({
      score100: score,
      result,
      accuracy,
      avgRt,
      lapses: misses,
      consistency,
      fatigueSlope,
      message,
    });
    setStage('done');
    onDone(outcome);
  };

  const progressLabel = useMemo(() => {
    if (stage === 'practice') return `${practiceIndex}/${PRACTICE_TRIALS}`;
    if (stage === 'running') return `${trialIndex}/${TOTAL_TRIALS}`;
    return '';
  }, [practiceIndex, stage, trialIndex]);

  return (
    <div style={styles.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 900, color: brandCyan }}>
            {isArabic ? 'اختبار الانتباه المركز' : 'Focused Auditory Attention'}
          </div>
          <div style={styles.muted}>{shortInstruction}</div>
        </div>
        {progressLabel ? <span style={styles.chip}>{progressLabel}</span> : null}
      </div>

      {stage === 'intro' ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900 }}>{isArabic ? 'التعليمات' : 'Instructions'}</div>
            <p style={{ ...styles.bodyText, marginTop: 8 }}>{introInstruction}</p>
            {isAudioMode ? (
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ ...styles.chip, borderColor: brandCyan, color: brandCyan }}>
                    {isArabic ? 'النغمة المستهدفة' : `${t('attention.target')} Tone`}
                  </div>
                  <div style={styles.muted}>{isArabic ? 'مشتتات: نغمات أخرى' : 'Distractors: Other tones'}</div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                  <button onClick={() => playExample(AUDIO_TARGET_FREQ)} style={styles.primaryBtn}>
                    {isArabic ? 'تشغيل النغمة المستهدفة' : 'Play target tone'}
                  </button>
                  <button onClick={() => playExample(AUDIO_DISTRACTORS[0])} style={styles.ghostBtn}>
                    {isArabic ? 'تشغيل نغمة مشتتة' : 'Play distractor'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
                <div style={{ ...styles.chip, borderColor: brandCyan, color: brandCyan }}>
                  {t('attention.target')} {VISUAL_TARGET}
                </div>
                <div style={styles.muted}>{isArabic ? 'رموز مشتتة' : 'Distractors'}: {VISUAL_DISTRACTORS.join(' ')}</div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              <button onClick={startPractice} style={{ ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})` }}>
                {isArabic ? 'ابدأ التدريب' : 'Start Practice'}
              </button>
              {onCancel ? (
                <button onClick={onCancel} style={styles.ghostBtn}>
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {stage === 'practice' || stage === 'running' ? (
        <div style={{ marginTop: 16 }}>
          <div style={{
            padding: 18,
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(0,0,0,0.18)',
            textAlign: 'center',
          }}>
            <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
              {stage === 'practice' ? (isArabic ? 'تجربة تدريب' : 'Practice Trial') : (isArabic ? 'جولة الاختبار' : 'Test Trial')}
            </div>
            <div style={{ fontSize: 56, fontWeight: 900, marginTop: 12, minHeight: 68, color: stimulusVisible ? '#fff' : 'rgba(255,255,255,0.2)' }}>
              {stimulusVisible ? (stimulus?.label ?? '--') : '--'}
            </div>
            <div style={{ marginTop: 12, ...styles.muted }}>{responsePrompt}</div>
          </div>

          <div style={{ marginTop: 12, padding: 16, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
            <button
              onClick={respond}
              style={{
                ...styles.primaryBtn,
                width: '100%',
                padding: '16px 14px',
                fontSize: 16,
                background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})`,
              }}
            >
              {isArabic ? 'استجابة' : 'Respond'}
            </button>
            {feedback ? (
              <div style={{ marginTop: 8, color: brandCyan, fontWeight: 700, textAlign: 'center' }}>
                {feedback}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {stage === 'done' && summary ? (
        <div style={{ marginTop: 16 }}>
          <div style={{ ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: summary.result === 'high' ? brandCyan : summary.result === 'medium' ? brandPurpleDark : brandPink }}>
              {summary.message}
            </div>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: 12 }}>
              {[
                { label: t('attention.performance'), value: `${summary.score100}/100` },
                { label: t('attention.consistency'), value: `${summary.consistency}/100` },
                { label: t('attention.lapses'), value: summary.lapses },
                { label: t('attention.avgReaction'), value: summary.avgRt ? `${summary.avgRt} ms` : '--' },
                { label: t('attention.fatigueSlope'), value: `${summary.fatigueSlope}%` },
              ].map((item) => (
                <div key={item.label} style={{ padding: 10, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{item.label}</div>
                  <div style={{ fontWeight: 800, marginTop: 4 }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, ...styles.muted }}>
              {t('clinical.screeningDisclaimer')}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
