import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, styles } from '../../styles';
import LabButton from '../labui/LabButton';
import { renderLabIcon } from '../icons/index';
import { ensureAudio, playTone, safeCloseAudio } from './audio';
import { mean, stdDev } from './stats';
import type { GameResult, TestOutcome } from './types';
import { calculateFatigueIndex, getStarEmoji, getStarRating } from './scoring';
import {
  CalibrationStep,
  CTAResultPanel,
  MetricsSummaryPanel,
  ModuleFrame,
  ModuleHeader,
  PracticeTrialsStep,
} from './ui';

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
    ? (t('auto.FocusedAttentionTestPanel.k1', "Press Space or the response button when you hear the target tone. Ignore other tones."))
    : t('auto.FocusedAttentionTestPanel.k2', "Press Space or the response button when you see the target. Ignore other symbols.");
  const shortInstruction = isAudioMode
    ? (t('auto.FocusedAttentionTestPanel.k3', "Respond only when the target tone plays."))
    : t('auto.FocusedAttentionTestPanel.k4', "Respond only when the target symbol appears.");
  const responsePrompt = isAudioMode
    ? (t('auto.FocusedAttentionTestPanel.k5', "Press Space or the response button when you hear the target tone."))
    : t('auto.FocusedAttentionTestPanel.k6', "Press Space or the response button");

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

  const showFeedback = useCallback((text: string) => {
    setFeedback(text);
    window.setTimeout(() => setFeedback(null), 500);
  }, []);

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
    const trial = trials[cur.idx];
    if (trial.responded) return;

    const now = performance.now();
    const rt = Math.round(now - cur.onset);
    if (rt < RESPONSE_MIN) return;

    trial.responded = true;
    trial.rtMs = rt;
    trial.responseType = trial.isTarget ? 'hit' : 'fa';

    if (!cur.practice && trial.isTarget) rtsRef.current.push(rt);

    if (cur.practice) {
      showFeedback(trial.isTarget ? t('auto.FocusedAttentionTestPanel.k7', "Correct") : t('auto.FocusedAttentionTestPanel.k8', "False alarm"));
    }
  }, [stage, t, showFeedback]);

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
      title: t('auto.FocusedAttentionTestPanel.k9', "Focused Auditory Attention (CPT / Odd-One-Out)"),
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
        title={t('auto.FocusedAttentionTestPanel.k10', "Focused Auditory Attention")}
        subtitle={shortInstruction}
        tone="cyan"
        status={progressLabel || undefined}
        statusTone="cyan"
      />

      {stage === 'intro' ? (
        <CalibrationStep
          title={t('auto.FocusedAttentionTestPanel.k11', "Instructions")}
          description={introInstruction}
        >
            {isAudioMode ? (
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ ...styles.chip, borderColor: brandCyan, color: brandCyan }}>
                    {isArabic ? 'النغمة المستهدفة' : `${t('attention.target')} Tone`}
                  </div>
                  <div style={styles.muted}>{t('auto.FocusedAttentionTestPanel.k12', "Distractors: Other tones")}</div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                  <LabButton onClick={() => playExample(AUDIO_TARGET_FREQ)}>
                    {t('auto.FocusedAttentionTestPanel.k13', "Play target tone")}
                  </LabButton>
                  <LabButton variant="ghost" onClick={() => playExample(AUDIO_DISTRACTORS[0])}>
                    {t('auto.FocusedAttentionTestPanel.k14', "Play distractor")}
                  </LabButton>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
                <div style={{ ...styles.chip, borderColor: brandCyan, color: brandCyan }}>
                  {t('attention.target')} {VISUAL_TARGET}
                </div>
                <div style={styles.muted}>{t('auto.FocusedAttentionTestPanel.k15', "Distractors")}: {VISUAL_DISTRACTORS.join(' ')}</div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              <LabButton onClick={startPractice}>
                {t('auto.FocusedAttentionTestPanel.k16', "Start Practice")}
              </LabButton>
              {onCancel ? (
                <LabButton variant="ghost" onClick={onCancel}>
                  {t('auto.FocusedAttentionTestPanel.k17', "Cancel")}
                </LabButton>
              ) : null}
            </div>
        </CalibrationStep>
      ) : null}

      {stage === 'practice' || stage === 'running' ? (
        <PracticeTrialsStep
          title={stage === 'practice'
            ? t('auto.FocusedAttentionTestPanel.k18', "Practice Trial")
            : t('auto.FocusedAttentionTestPanel.k19', "Test Trial")}
          status={progressLabel || undefined}
          statusTone="purple"
        >
          <div style={{
            padding: 18,
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(0,0,0,0.18)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 56, fontWeight: 900, marginTop: 12, minHeight: 68, color: stimulusVisible ? '#fff' : 'rgba(255,255,255,0.2)' }}>
              {stimulusVisible ? (stimulus?.label ?? '--') : '--'}
            </div>
            <div style={{ marginTop: 12, ...styles.muted }}>{responsePrompt}</div>
          </div>

          <div style={{ padding: 16, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
            <LabButton
              onClick={respond}
              fullWidth
              size="lg"
              style={{ padding: '16px 14px', fontSize: 16 }}
            >
              {t('auto.FocusedAttentionTestPanel.k20', "Respond")}
            </LabButton>
            {feedback ? (
              <div style={{ marginTop: 8, color: brandCyan, fontWeight: 700, textAlign: 'center' }}>
                {feedback}
              </div>
            ) : null}
          </div>
        </PracticeTrialsStep>
      ) : null}

      {stage === 'done' && summary ? (
        <>
          <MetricsSummaryPanel
            title={summary.message}
            tone={summaryTone}
            metrics={[
              { label: t('attention.performance'), value: `${summary.score100}/100` },
              { label: t('attention.consistency'), value: `${summary.consistency}/100` },
              { label: t('attention.lapses'), value: summary.lapses },
              { label: t('attention.avgReaction'), value: summary.avgRt ? `${summary.avgRt} ms` : '--' },
              { label: t('attention.fatigueSlope'), value: `${summary.fatigueSlope}%` },
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
