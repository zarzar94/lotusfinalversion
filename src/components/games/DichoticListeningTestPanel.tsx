import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPurpleDark, styles } from '../../styles';
import LabButton from '../labui/LabButton';
import { renderLabIcon } from '../icons/index';
import { ensureAudio, playTone, safeCloseAudio } from './audio';
import type { GameResult, TestOutcome } from './types';
import {
  CalibrationStep,
  CTAResultPanel,
  MetricsSummaryPanel,
  ModuleFrame,
  ModuleHeader,
  PracticeTrialsStep,
} from './ui';

type Stimulus = {
  label: string;
  freq: number;
  group: 'syllable' | 'number';
};

type Trial = {
  i: number;
  mode: 'integration' | 'separation';
  focus?: 'left' | 'right';
  left: Stimulus;
  right: Stimulus;
  responseLeft?: string;
  responseRight?: string;
  responseSingle?: string;
  correctLeft?: boolean;
  correctRight?: boolean;
  correctSingle?: boolean;
  intrusion?: boolean;
  rtMs?: number;
};

const SYLLABLES: Stimulus[] = [
  { label: 'ba', freq: 410, group: 'syllable' },
  { label: 'da', freq: 460, group: 'syllable' },
  { label: 'ga', freq: 520, group: 'syllable' },
  { label: 'ka', freq: 580, group: 'syllable' },
  { label: 'pa', freq: 640, group: 'syllable' },
  { label: 'ta', freq: 700, group: 'syllable' },
];

const NUMBERS: Stimulus[] = [
  { label: '1', freq: 760, group: 'number' },
  { label: '2', freq: 820, group: 'number' },
  { label: '3', freq: 880, group: 'number' },
  { label: '4', freq: 940, group: 'number' },
];

const STIMULI: Stimulus[] = [...SYLLABLES, ...NUMBERS];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const randomPair = (): { left: Stimulus; right: Stimulus } => {
  const pool = Math.random() < 0.5 ? SYLLABLES : NUMBERS;
  const options = shuffle(pool);
  return { left: options[0], right: options[1] };
};

const buildTrials = (integrationCount: number, separationCount: number): Trial[] => {
  const trials: Trial[] = [];
  for (let i = 0; i < integrationCount; i++) {
    const { left, right } = randomPair();
    trials.push({ i: i + 1, mode: 'integration', left, right });
  }
  const focusPool: Array<'left' | 'right'> = [];
  const pairs = Math.floor(separationCount / 2);
  for (let i = 0; i < pairs; i++) {
    focusPool.push('left', 'right');
  }
  if (separationCount % 2) {
    focusPool.push(Math.random() < 0.5 ? 'left' : 'right');
  }
  const focusOrder = shuffle(focusPool);
  for (let i = 0; i < separationCount; i++) {
    const { left, right } = randomPair();
    const focus = focusOrder[i] ?? (Math.random() < 0.5 ? 'left' : 'right');
    trials.push({ i: integrationCount + i + 1, mode: 'separation', focus, left, right });
  }
  return shuffle(trials).map((t, idx) => ({ ...t, i: idx + 1 }));
};

export default function DichoticListeningTestPanel({
  onDone,
  onCancel,
}: {
  onDone: (outcome: TestOutcome) => void;
  onCancel?: () => void;
}) {
  const { isArabic, t } = useLanguage();
  const audioRef = useRef<AudioContext | null>(null);
  const trialsRef = useRef<Trial[]>([]);
  const practiceRef = useRef<Trial[]>([]);
  const resultsRef = useRef<Trial[]>([]);
  const onsetRef = useRef<number>(0);

  const [stage, setStage] = useState<'intro' | 'practice' | 'running' | 'done'>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [current, setCurrent] = useState<Trial | null>(null);
  const [leftChoice, setLeftChoice] = useState<string | null>(null);
  const [rightChoice, setRightChoice] = useState<string | null>(null);
  const [singleChoice, setSingleChoice] = useState<string | null>(null);
  const [played, setPlayed] = useState(false);
  const [summary, setSummary] = useState<{
    score100: number;
    result: GameResult;
    leftPct: number;
    rightPct: number;
    separationPct: number;
    balanceIndex: number;
    intrusions: number;
    message: string;
  } | null>(null);

  const INTEGRATION_TRIALS = 10;
  const SEPARATION_TRIALS = 10;
  const PRACTICE_TRIALS = 3;

  useEffect(() => {
    return () => {
      safeCloseAudio(audioRef);
    };
  }, []);

  const playStimuli = useCallback(async (trial: Trial) => {
    const audio = ensureAudio(audioRef);
    try {
      await audio.resume();
    } catch {
      // ignore
    }
    setPlayed(false);
    const when = audio.currentTime + 0.05;
    playTone(audio, { freq: trial.left.freq, pan: -0.8, duration: 0.32, when });
    playTone(audio, { freq: trial.right.freq, pan: 0.8, duration: 0.32, when });
    onsetRef.current = performance.now();
    setTimeout(() => setPlayed(true), 360);
  }, []);

  const startPractice = () => {
    practiceRef.current = buildTrials(2, 1).slice(0, PRACTICE_TRIALS);
    resultsRef.current = [];
    setPracticeIndex(0);
    setStage('practice');
    runTrial(0, true);
  };

  const startTest = () => {
    trialsRef.current = buildTrials(INTEGRATION_TRIALS, SEPARATION_TRIALS);
    resultsRef.current = [];
    setTrialIndex(0);
    setStage('running');
    runTrial(0, false);
  };

  const runTrial = (idx: number, practice: boolean) => {
    const list = practice ? practiceRef.current : trialsRef.current;
    if (idx >= list.length) {
      if (practice) startTest();
      else finish();
      return;
    }

    const trial = list[idx];
    setCurrent(trial);
    setLeftChoice(null);
    setRightChoice(null);
    setSingleChoice(null);
    if (practice) setPracticeIndex(idx + 1);
    else setTrialIndex(idx + 1);
    playStimuli(trial);
  };

  const submit = () => {
    if (!current || !played) return;
    const now = performance.now();
    const rt = Math.round(now - onsetRef.current);

    const trial: Trial = { ...current, rtMs: rt };
    if (current.mode === 'integration') {
      if (!leftChoice || !rightChoice) return;
      trial.responseLeft = leftChoice;
      trial.responseRight = rightChoice;
      trial.correctLeft = leftChoice === current.left.label;
      trial.correctRight = rightChoice === current.right.label;
    } else {
      if (!singleChoice) return;
      trial.responseSingle = singleChoice;
      const targetLabel = current.focus === 'left' ? current.left.label : current.right.label;
      const otherLabel = current.focus === 'left' ? current.right.label : current.left.label;
      trial.correctSingle = singleChoice === targetLabel;
      trial.intrusion = singleChoice === otherLabel;
    }

    resultsRef.current.push(trial);

    const list = stage === 'practice' ? practiceRef.current : trialsRef.current;
    const nextIndex = (stage === 'practice' ? practiceIndex : trialIndex);
    runTrial(nextIndex, stage === 'practice');
  };

  const finish = () => {
    const results = resultsRef.current;
    const integration = results.filter((t) => t.mode === 'integration');
    const separation = results.filter((t) => t.mode === 'separation');

    const leftCorrect = integration.filter((t) => t.correctLeft).length;
    const rightCorrect = integration.filter((t) => t.correctRight).length;
    const leftPct = integration.length ? Math.round((leftCorrect / integration.length) * 100) : 0;
    const rightPct = integration.length ? Math.round((rightCorrect / integration.length) * 100) : 0;
    const balanceIndex = Math.round(Math.abs(leftPct - rightPct));

    const separationCorrect = separation.filter((t) => t.correctSingle).length;
    const separationPct = separation.length ? Math.round((separationCorrect / separation.length) * 100) : 0;
    const intrusions = separation.filter((t) => t.intrusion).length;

    const balancePenalty = Math.max(0, balanceIndex - 10) * 0.5;
    let score = Math.round((leftPct + rightPct + separationPct) / 3 - balancePenalty - intrusions * 2);
    score = Math.max(0, Math.min(100, score));

    const result: GameResult = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
    const message =
      result === 'high'
        ? t('dichotic.summaryHigh')
        : result === 'medium'
          ? t('dichotic.summaryMid')
          : t('dichotic.summaryLow');

    const outcome: TestOutcome = {
      key: 'dichotic_listening',
      title: t('auto.DichoticListeningTestPanel.k1', "Dichotic Listening - Integration + Separation"),
      result,
      scoreLabel: `Score ${score}/100 · L ${leftPct}% R ${rightPct}% · Sep ${separationPct}%`,
      message,
      metrics: {
        trials: results.length,
        leftAccuracyPct: leftPct,
        rightAccuracyPct: rightPct,
        separationAccuracyPct: separationPct,
        balanceIndex,
        intrusions,
        score100: score,
      },
      trials: results,
    };

    setSummary({
      score100: score,
      result,
      leftPct,
      rightPct,
      separationPct,
      balanceIndex,
      intrusions,
      message,
    });
    setStage('done');
    onDone(outcome);
  };

  const progressLabel = useMemo(() => {
    if (stage === 'practice') return `${practiceIndex}/${PRACTICE_TRIALS}`;
    if (stage === 'running') return `${trialIndex}/${INTEGRATION_TRIALS + SEPARATION_TRIALS}`;
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
        title={t('auto.DichoticListeningTestPanel.k2', "Dichotic Listening")}
        subtitle={t('auto.DichoticListeningTestPanel.k3', "Syllables or numbers are presented to each ear.")}
        tone="cyan"
        status={progressLabel || undefined}
        statusTone="cyan"
      />

      {stage === 'intro' ? (
        <CalibrationStep
          title={t('auto.DichoticListeningTestPanel.k4', "Instructions")}
          description={t('auto.DichoticListeningTestPanel.k5', "You will hear different syllables or numbers in each ear. In integration, report both ears. In separation, focus on the instructed ear.")}
          actions={(
            <>
              <LabButton onClick={startPractice}>
                {t('auto.DichoticListeningTestPanel.k6', "Start Practice")}
              </LabButton>
              {onCancel ? (
                <LabButton variant="ghost" onClick={onCancel}>
                  {t('auto.DichoticListeningTestPanel.k7', "Cancel")}
                </LabButton>
              ) : null}
            </>
          )}
        />
      ) : null}

      {(stage === 'practice' || stage === 'running') && current ? (
        <PracticeTrialsStep
          title={stage === 'practice'
            ? t('auto.DichoticListeningTestPanel.k13', "Practice Trial")
            : t('auto.DichoticListeningTestPanel.k14', "Test Trial")}
          status={progressLabel || undefined}
          statusTone="purple"
        >
          <div style={{
            padding: 16,
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(0,0,0,0.18)',
            marginBottom: 12,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              {current.mode === 'integration'
                ? (t('auto.DichoticListeningTestPanel.k8', "Integration: report both ears"))
                : (isArabic ? `فصل: ركّز على الأذن ${current.focus === 'left' ? 'اليسرى' : 'اليمنى'}` : `Separation: focus ${current.focus === 'left' ? t('games.left') : t('games.right')}`)}
            </div>
            <div style={styles.muted}>
              {t('auto.DichoticListeningTestPanel.k9', "Listen, then choose the response.")}
            </div>
          </div>

          {current.mode === 'integration' ? (
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              <div style={{ padding: 12, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{t('auto.DichoticListeningTestPanel.k10', "Left ear")}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {STIMULI.map((s) => (
                    <button
                      key={`l-${s.label}`}
                      onClick={() => setLeftChoice(s.label)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 10,
                        border: `1px solid ${leftChoice === s.label ? brandCyan : 'rgba(255,255,255,0.1)'}`,
                        background: leftChoice === s.label ? `${brandCyan}20` : 'rgba(255,255,255,0.04)',
                        color: leftChoice === s.label ? brandCyan : '#fff',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ padding: 12, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>{t('auto.DichoticListeningTestPanel.k11', "Right ear")}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {STIMULI.map((s) => (
                    <button
                      key={`r-${s.label}`}
                      onClick={() => setRightChoice(s.label)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 10,
                        border: `1px solid ${rightChoice === s.label ? brandCyan : 'rgba(255,255,255,0.1)'}`,
                        background: rightChoice === s.label ? `${brandCyan}20` : 'rgba(255,255,255,0.04)',
                        color: rightChoice === s.label ? brandCyan : '#fff',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: 12, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {STIMULI.map((s) => (
                  <button
                    key={`s-${s.label}`}
                    onClick={() => setSingleChoice(s.label)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 10,
                      border: `1px solid ${singleChoice === s.label ? brandCyan : 'rgba(255,255,255,0.1)'}`,
                      background: singleChoice === s.label ? `${brandCyan}20` : 'rgba(255,255,255,0.04)',
                      color: singleChoice === s.label ? brandCyan : '#fff',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <LabButton
            onClick={submit}
            disabled={!played}
            fullWidth
            style={{
              marginTop: 12,
              background: played ? `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})` : 'rgba(255,255,255,0.2)',
            }}
          >
            {t('auto.DichoticListeningTestPanel.k12', "Submit Response")}
          </LabButton>
        </PracticeTrialsStep>
      ) : null}

      {stage === 'done' && summary ? (
        <>
          <MetricsSummaryPanel
            title={summary.message}
            tone={summaryTone}
            metrics={[
              { label: t('dichotic.leftEarRecall'), value: `${summary.leftPct}%` },
              { label: t('dichotic.rightEarRecall'), value: `${summary.rightPct}%` },
              { label: t('dichotic.balanceIndex'), value: `${summary.balanceIndex}` },
              { label: t('dichotic.separationAccuracy'), value: `${summary.separationPct}%` },
              { label: t('dichotic.intrusions'), value: summary.intrusions },
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
