import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPink, brandPurpleDark, styles, snrModule } from '../styles';
import { ensureAudio, safeCloseAudio, setBabbleNoiseLevel, stopNoise, type NoiseRef } from './audio';
import type { GameResult, SpeechInNoiseMetrics, TestOutcome } from './types';
import { calculateFatigueIndex } from './scoring';
import { mean } from './stats';

type Sentence = {
  text: string;
  keywords: string[];
};

type Trial = {
  i: number;
  snrDb: number;
  sentence: Sentence;
  options: string[];
  selected: string[];
  correct: boolean;
  rtMs: number;
  reversal?: boolean;
  stepDb?: number;
};

const SENTENCES: Sentence[] = [
  { text: 'The yellow bus stops at noon', keywords: ['yellow', 'bus', 'noon'] },
  { text: 'She packed lunch for the trip', keywords: ['packed', 'lunch', 'trip'] },
  { text: 'The quiet room feels very calm', keywords: ['quiet', 'room', 'calm'] },
  { text: 'Rain fell softly on the roof', keywords: ['rain', 'softly', 'roof'] },
  { text: 'He wrote a note to mom', keywords: ['wrote', 'note', 'mom'] },
  { text: 'We found the key near the door', keywords: ['key', 'near', 'door'] },
  { text: 'The small cat slept on the chair', keywords: ['cat', 'slept', 'chair'] },
  { text: 'They walked home after the movie', keywords: ['walked', 'home', 'movie'] },
  { text: 'Please turn off the bright light', keywords: ['turn', 'bright', 'light'] },
  { text: 'Her friend called late last night', keywords: ['friend', 'called', 'night'] },
  { text: 'The farmer watered the green plants', keywords: ['farmer', 'watered', 'plants'] },
  { text: 'My brother plays soccer every weekend', keywords: ['brother', 'soccer', 'weekend'] },
];

const DISTRACTORS = [
  'blue',
  'glass',
  'river',
  'music',
  'paper',
  'window',
  'stone',
  'cloud',
  'garden',
  'pencil',
  'table',
  'train',
  'apple',
  'market',
  'clock',
];

const MIN_SNR_DB = -10;
const MAX_SNR_DB = 15;
const START_SNR_DB = 8;
const PRACTICE_SNR_DB = 10;
const STEP_LARGE_DB = 4;
const STEP_SMALL_DB = 2;
const MAX_REVERSALS = 6;
const MAX_TRIALS = 20;
const REVERSAL_AVG_COUNT = 4;
const LONG_SESSION_TRIALS = 16;
const PRACTICE_TRIALS = 3;

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const snrToNoise = (snrDb: number): number => {
  const clamped = Math.max(MIN_SNR_DB, Math.min(MAX_SNR_DB, snrDb));
  const norm = (clamped - MIN_SNR_DB) / (MAX_SNR_DB - MIN_SNR_DB);
  const noise = 0.2 - norm * 0.18;
  return Math.max(0.02, Math.min(0.2, noise));
};

const formatSnr = (value: number): string => `${value > 0 ? '+' : ''}${value} dB`;

export default function SpeechInNoiseTestPanel({
  onDone,
  onCancel,
}: {
  onDone: (outcome: TestOutcome) => void;
  onCancel?: () => void;
}) {
  const { isArabic, t } = useLanguage();
  const audioRef = useRef<AudioContext | null>(null);
  const noiseRef: NoiseRef = useRef(null);
  const resultsRef = useRef<Trial[]>([]);
  const onsetRef = useRef<number>(0);
  const directionRef = useRef<'up' | 'down' | null>(null);
  const reversalsRef = useRef(0);
  const reversalSnrsRef = useRef<number[]>([]);

  const [stage, setStage] = useState<'intro' | 'practice' | 'running' | 'done'>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [current, setCurrent] = useState<Trial | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [played, setPlayed] = useState(false);
  const [summary, setSummary] = useState<{
    score100: number;
    result: GameResult;
    snrThreshold: number;
    accuracy: number;
    noiseTolerance: string;
    message: string;
    interpretation: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      stopNoise(noiseRef);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      safeCloseAudio(audioRef);
    };
  }, []);

  const buildOptions = (sentence: Sentence): string[] => {
    const extras = shuffle(DISTRACTORS).slice(0, 3);
    return shuffle([...sentence.keywords, ...extras]);
  };

  const playSentence = useCallback(async (sentence: Sentence, snrDb: number) => {
    const audio = ensureAudio(audioRef);
    try {
      await audio.resume();
    } catch {
      // ignore
    }
    const noise = snrToNoise(snrDb);
    setBabbleNoiseLevel(audio, noiseRef, noise);
    setPlayed(false);
    setSelected([]);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(sentence.text);
      utter.rate = 1;
      utter.pitch = 1;
      utter.volume = 1;
      utter.onend = () => {
        stopNoise(noiseRef);
        onsetRef.current = performance.now();
        setPlayed(true);
      };
      utter.onerror = () => {
        stopNoise(noiseRef);
        onsetRef.current = performance.now();
        setPlayed(true);
      };
      window.speechSynthesis.speak(utter);
    } else {
      setTimeout(() => {
        stopNoise(noiseRef);
        onsetRef.current = performance.now();
        setPlayed(true);
      }, 1200);
    }
  }, []);

  const runTrial = (idx: number, practice: boolean, snrDb: number) => {
    const sentence = SENTENCES[idx % SENTENCES.length];
    const options = buildOptions(sentence);
    const trial: Trial = {
      i: idx + 1,
      snrDb,
      sentence,
      options,
      selected: [],
      correct: false,
      rtMs: 0,
    };
    setCurrent(trial);
    if (practice) setPracticeIndex(idx + 1);
    else setTrialIndex(idx + 1);
    playSentence(sentence, snrDb);
  };

  const startPractice = () => {
    resultsRef.current = [];
    setStage('practice');
    setPracticeIndex(0);
    runTrial(0, true, PRACTICE_SNR_DB);
  };

  const startTest = () => {
    resultsRef.current = [];
    setTrialIndex(0);
    setStage('running');
    directionRef.current = null;
    reversalsRef.current = 0;
    reversalSnrsRef.current = [];
    runTrial(0, false, START_SNR_DB);
  };

  const toggleWord = (word: string) => {
    setSelected((prev) => {
      if (prev.includes(word)) return prev.filter((w) => w !== word);
      return [...prev, word];
    });
  };

  const submit = () => {
    if (!current || !played) return;
    const rt = Math.round(performance.now() - onsetRef.current);
    const keywordSet = new Set(current.sentence.keywords);
    const selectedSet = new Set(selected);
    const correct = keywordSet.size === selectedSet.size && [...keywordSet].every((k) => selectedSet.has(k));

    let reversal = false;
    let stepDb = STEP_LARGE_DB;
    if (stage === 'running') {
      const nextDirection: 'up' | 'down' = correct ? 'down' : 'up';
      const prevDirection = directionRef.current;
      if (prevDirection && prevDirection !== nextDirection) {
        reversalsRef.current += 1;
        reversalSnrsRef.current.push(current.snrDb);
        reversal = true;
      }
      directionRef.current = nextDirection;
      stepDb = reversalsRef.current >= 2 ? STEP_SMALL_DB : STEP_LARGE_DB;
    }

    const trial: Trial = {
      ...current,
      selected,
      correct,
      rtMs: rt,
      reversal: stage === 'running' ? reversal : undefined,
      stepDb: stage === 'running' ? stepDb : undefined,
    };

    if (stage === 'running') resultsRef.current.push(trial);

    if (stage === 'practice') {
      if (practiceIndex >= PRACTICE_TRIALS) {
        startTest();
        return;
      }
      runTrial(practiceIndex, true, PRACTICE_SNR_DB);
      return;
    }

    const nextSnrDb = Math.max(
      MIN_SNR_DB,
      Math.min(MAX_SNR_DB, current.snrDb + (correct ? -stepDb : stepDb))
    );

    if (resultsRef.current.length >= MAX_TRIALS || reversalsRef.current >= MAX_REVERSALS) {
      finish();
      return;
    }

    runTrial(trialIndex, false, nextSnrDb);
  };

  const finish = () => {
    const results = resultsRef.current;
    const accuracy = Math.round((results.filter((r) => r.correct).length / Math.max(1, results.length)) * 100);
    const reversalSnrs = reversalSnrsRef.current;
    const thresholdSamples =
      reversalSnrs.length >= 2
        ? reversalSnrs.slice(-REVERSAL_AVG_COUNT)
        : results.slice(-4).map((r) => r.snrDb);
    const threshold = thresholdSamples.length ? Number(mean(thresholdSamples).toFixed(1)) : START_SNR_DB;

    const snrScore = Math.max(
      0,
      Math.min(100, Math.round(100 - ((threshold - MIN_SNR_DB) / (MAX_SNR_DB - MIN_SNR_DB)) * 100))
    );
    let score = Math.round(accuracy * 0.6 + snrScore * 0.4);
    score = Math.max(0, Math.min(100, score));

    const fatigue = results.length >= LONG_SESSION_TRIALS
      ? calculateFatigueIndex(
        results.map((r) => ({
          target: true,
          responseType: r.correct ? 'hit' : 'miss',
          rtMs: r.rtMs,
        }))
      )
      : null;

    const result: GameResult = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
    const interpretation =
      result === 'high'
        ? t('speechInNoise.summaryHigh')
        : result === 'medium'
          ? t('speechInNoise.summaryMid')
          : t('speechInNoise.summaryLow');
    const neutralSummary = t('speechInNoise.neutralSummary').replace('{snr}', formatSnr(threshold));

    const noiseTolerance =
      threshold <= 0 ? t('speechInNoise.noiseStrong') : threshold <= 8 ? t('speechInNoise.noiseModerate') : t('speechInNoise.noiseNeedsQuiet');

    const metrics: SpeechInNoiseMetrics = {
      trials: results.length,
      accuracyPct: accuracy,
      snrThresholdDb: threshold,
      snrScore,
      reversals: reversalsRef.current,
      score100: score,
    };
    if (fatigue) metrics.fatigueScore = fatigue.fatigueScore;

    const outcome: TestOutcome = {
      key: 'speech_in_noise',
      title: t('auto.SpeechInNoiseTestPanel.k1', "Speech in Noise"),
      result,
      scoreLabel: `SNR ${formatSnr(threshold)} | ${accuracy}% | Score ${score}/100`,
      message: neutralSummary,
      metrics,
      trials: results,
    };

    setSummary({
      score100: score,
      result,
      snrThreshold: threshold,
      accuracy,
      noiseTolerance,
      message: neutralSummary,
      interpretation,
    });
    setStage('done');
    onDone(outcome);
  };

  const progressLabel = useMemo(() => {
    if (stage === 'practice') return `${practiceIndex}/${PRACTICE_TRIALS}`;
    if (stage === 'running') return `${trialIndex}/${MAX_TRIALS}`;
    return '';
  }, [practiceIndex, stage, trialIndex]);

  return (
    <div style={styles.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 900, color: brandCyan }}>
            {t('auto.SpeechInNoiseTestPanel.k2', "Speech-in-Noise")}
          </div>
          <div style={styles.muted}>
            {t('auto.SpeechInNoiseTestPanel.k3', "Listen to the sentence and select the words you heard.")}
          </div>
        </div>
        {progressLabel ? <span style={styles.chip}>{progressLabel}</span> : null}
      </div>

      {stage === 'intro' ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900 }}>{t('auto.SpeechInNoiseTestPanel.k4', "Instructions")}</div>
            <p style={{ ...styles.bodyText, marginTop: 8 }}>
              {t('auto.SpeechInNoiseTestPanel.k5', "You will hear a sentence with background noise. Select the correct words after listening.")}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              <button onClick={startPractice} style={{ ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})` }}>
                {t('auto.SpeechInNoiseTestPanel.k6', "Start Practice")}
              </button>
              {onCancel ? (
                <button onClick={onCancel} style={styles.ghostBtn}>
                  {t('auto.SpeechInNoiseTestPanel.k7', "Cancel")}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {(stage === 'practice' || stage === 'running') && current ? (
        <div style={{ marginTop: 16 }}>
          <div style={{
            padding: 16,
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(0,0,0,0.18)',
            marginBottom: 12,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              {t('auto.SpeechInNoiseTestPanel.k8', "Select the words you heard")}
            </div>
            {!('speechSynthesis' in window) && (
              <div style={{ ...styles.muted, marginBottom: 8 }}>
                {isArabic ? `اقرأ الجملة: ${current.sentence.text}` : `Read sentence: ${current.sentence.text}`}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {current.options.map((word) => (
                <button
                  key={word}
                  onClick={() => toggleWord(word)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 10,
                    border: `1px solid ${selected.includes(word) ? brandCyan : 'rgba(255,255,255,0.1)'}`,
                    background: selected.includes(word) ? `${brandCyan}20` : 'rgba(255,255,255,0.04)',
                    color: selected.includes(word) ? brandCyan : '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={submit}
            disabled={!played}
            style={{
              ...styles.primaryBtn,
              width: '100%',
              background: played ? `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})` : 'rgba(255,255,255,0.2)',
              cursor: played ? 'pointer' : 'not-allowed',
            }}
          >
            {t('auto.SpeechInNoiseTestPanel.k9', "Submit Response")}
          </button>
        </div>
      ) : null}

      {stage === 'done' && summary ? (
        <div style={{ marginTop: 16 }}>
          <div style={{ ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: summary.result === 'high' ? brandCyan : summary.result === 'medium' ? brandPurpleDark : brandPink }}>
              {summary.message}
            </div>
            <div style={{ marginTop: 6, ...styles.muted }}>
              {summary.interpretation}
            </div>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: 12 }}>
              {[
                { label: t('speechInNoise.snrThreshold'), value: formatSnr(summary.snrThreshold) },
                { label: t('speechInNoise.recognitionAccuracy'), value: `${summary.accuracy}%` },
                { label: t('speechInNoise.noiseTolerance'), value: summary.noiseTolerance },
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
