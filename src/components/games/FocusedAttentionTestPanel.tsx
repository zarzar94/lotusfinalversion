import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPink, brandPurpleDark, styles } from '../styles';
import { mean, stdDev } from './stats';
import type { GameResult, TestOutcome } from './types';
import { calculateFatigueIndex, getStarEmoji, getStarRating } from './scoring';

type Trial = {
  i: number;
  isTarget: boolean;
  stimulus: string;
  responded: boolean;
  responseType?: 'hit' | 'fa' | 'miss' | 'cr';
  rtMs?: number;
};

const TARGET = 'X';
const DISTRACTORS = ['O', '+', '#', '%', '*', '='];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildTrials = (total: number, targetCount: number): Trial[] => {
  const flags = shuffle(
    [...Array(targetCount)].map(() => true).concat([...Array(total - targetCount)].map(() => false))
  );
  return flags.map((isTarget, idx) => {
    const stimulus = isTarget ? TARGET : DISTRACTORS[Math.floor(Math.random() * DISTRACTORS.length)];
    return { i: idx + 1, isTarget, stimulus, responded: false };
  });
};

export default function FocusedAttentionTestPanel({
  onDone,
  onCancel,
}: {
  onDone: (outcome: TestOutcome) => void;
  onCancel?: () => void;
}) {
  const { isArabic, t } = useLanguage();
  const [stage, setStage] = useState<'intro' | 'practice' | 'running' | 'done'>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [stimulus, setStimulus] = useState<string | null>(null);
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

  useEffect(() => cleanup, [cleanup]);

  const showFeedback = (text: string) => {
    setFeedback(text);
    window.setTimeout(() => setFeedback(null), 500);
  };

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
    practiceRef.current = buildTrials(PRACTICE_TRIALS, PRACTICE_TARGETS);
    setPracticeIndex(0);
    setStage('practice');
    runTrial(0, true);
  };

  const startTest = () => {
    cleanup();
    trialsRef.current = buildTrials(TOTAL_TRIALS, TARGET_TRIALS);
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
    const fatigueSlope = Math.round(fatigue.rtIncrease);

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
      title: isArabic ? 'الانتباه المركز (CPT)' : 'Focused Auditory Attention (CPT)',
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
        consistencyScore: consistency,
        fatigueScore: fatigue.fatigueScore,
        fatigueIndex: fatigue.fatigueIndex,
        score100: score,
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
          <div style={styles.muted}>
            {isArabic
              ? 'استجب فقط عندما يظهر الرمز المستهدف.'
              : 'Respond only when the target symbol appears.'}
          </div>
        </div>
        {progressLabel ? <span style={styles.chip}>{progressLabel}</span> : null}
      </div>

      {stage === 'intro' ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900 }}>{isArabic ? 'التعليمات' : 'Instructions'}</div>
            <p style={{ ...styles.bodyText, marginTop: 8 }}>
              {isArabic
                ? 'اضغط على المسافة أو زر الاستجابة عندما ترى الرمز المستهدف. تجاهل الرموز الأخرى.'
                : 'Press Space or the response button when you see the target. Ignore other symbols.'}
            </p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
              <div style={{ ...styles.chip, borderColor: brandCyan, color: brandCyan }}>
                {t('attention.target')} {TARGET}
              </div>
              <div style={styles.muted}>{isArabic ? 'رموز مشتتة' : 'Distractors'}: {DISTRACTORS.join(' ')}</div>
            </div>
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
              {stimulusVisible ? stimulus : '·'}
            </div>
            <div style={{ marginTop: 12, ...styles.muted }}>
              {isArabic ? 'اضغط المسافة أو زر الاستجابة' : 'Press Space or the response button'}
            </div>
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
