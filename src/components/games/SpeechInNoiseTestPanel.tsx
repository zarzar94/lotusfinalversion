import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPink, brandPurpleDark, styles } from '../styles';
import { ensureAudio, safeCloseAudio, setNoiseLevel, stopNoise, type NoiseRef } from './audio';
import type { GameResult, TestOutcome } from './types';
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
};

const SENTENCES: Sentence[] = [
  { text: 'The blue bird flew away', keywords: ['blue', 'bird', 'flew'] },
  { text: 'Open the door and sit', keywords: ['open', 'door', 'sit'] },
  { text: 'The child plays with blocks', keywords: ['child', 'plays', 'blocks'] },
  { text: 'She drinks water every day', keywords: ['drinks', 'water', 'day'] },
  { text: 'The dog runs in the park', keywords: ['dog', 'runs', 'park'] },
  { text: 'We will meet after lunch', keywords: ['meet', 'after', 'lunch'] },
];

const DISTRACTORS = ['green', 'cat', 'jump', 'chair', 'night', 'book', 'river', 'quiet', 'small', 'glass'];
const SNR_LEVELS = [15, 10, 5, 0, -5, -10];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const snrToNoise = (snrDb: number): number => {
  const min = -10;
  const max = 15;
  const clamped = Math.max(min, Math.min(max, snrDb));
  const norm = (clamped - min) / (max - min);
  const noise = 0.2 - norm * 0.18;
  return Math.max(0.02, Math.min(0.2, noise));
};

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

  const [stage, setStage] = useState<'intro' | 'practice' | 'running' | 'done'>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [current, setCurrent] = useState<Trial | null>(null);
  const [snrIndex, setSnrIndex] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [played, setPlayed] = useState(false);
  const [summary, setSummary] = useState<{
    score100: number;
    result: GameResult;
    snrThreshold: number;
    accuracy: number;
    noiseTolerance: string;
    message: string;
  } | null>(null);

  const TRIALS = 12;
  const PRACTICE_TRIALS = 3;

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
    setNoiseLevel(audio, noiseRef, noise);
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
      window.setTimeout(() => {
        stopNoise(noiseRef);
        onsetRef.current = performance.now();
        setPlayed(true);
      }, 1200);
    }
  }, []);

  const runTrial = (idx: number, practice: boolean, nextSnrIndex: number) => {
    const sentence = SENTENCES[idx % SENTENCES.length];
    const snrDb = SNR_LEVELS[nextSnrIndex];
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
    runTrial(0, true, snrIndex);
  };

  const startTest = () => {
    resultsRef.current = [];
    setTrialIndex(0);
    setStage('running');
    runTrial(0, false, snrIndex);
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

    const trial: Trial = {
      ...current,
      selected,
      correct,
      rtMs: rt,
    };

    if (stage === 'running') resultsRef.current.push(trial);

    const nextIndex = stage === 'practice' ? practiceIndex : trialIndex;
    const nextSnrIndex = correct
      ? Math.min(SNR_LEVELS.length - 1, snrIndex + 1)
      : Math.max(0, snrIndex - 1);

    setSnrIndex(nextSnrIndex);

    if (stage === 'practice') {
      if (nextIndex >= PRACTICE_TRIALS) {
        startTest();
        return;
      }
      runTrial(nextIndex, true, nextSnrIndex);
      return;
    }

    if (nextIndex >= TRIALS) {
      finish();
      return;
    }

    runTrial(nextIndex, false, nextSnrIndex);
  };

  const finish = () => {
    const results = resultsRef.current;
    const accuracy = Math.round((results.filter((r) => r.correct).length / Math.max(1, results.length)) * 100);
    const snrValues = results.map((r) => r.snrDb);
    const threshold = snrValues.length ? Number(mean(snrValues.slice(-4)).toFixed(1)) : SNR_LEVELS[snrIndex];

    const snrScore = Math.max(0, Math.min(100, Math.round(100 - ((threshold + 10) / 25) * 100)));
    let score = Math.round(accuracy * 0.6 + snrScore * 0.4);
    score = Math.max(0, Math.min(100, score));

    const fatigue = calculateFatigueIndex(
      results.map((r) => ({
        target: true,
        responseType: r.correct ? 'hit' : 'miss',
        rtMs: r.rtMs,
      }))
    );

    const result: GameResult = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
    const message =
      result === 'high'
        ? t('speechInNoise.summaryHigh')
        : result === 'medium'
          ? t('speechInNoise.summaryMid')
          : t('speechInNoise.summaryLow');

    const noiseTolerance =
      threshold <= 0 ? t('speechInNoise.noiseStrong') : threshold <= 8 ? t('speechInNoise.noiseModerate') : t('speechInNoise.noiseNeedsQuiet');

    const outcome: TestOutcome = {
      key: 'speech_in_noise',
      title: isArabic ? 'الكلام وسط الضجيج' : 'Speech in Noise',
      result,
      scoreLabel: `SNR ${threshold} dB · ${accuracy}% · Score ${score}/100`,
      message,
      metrics: {
        trials: results.length,
        accuracyPct: accuracy,
        snrThresholdDb: threshold,
        snrScore,
        fatigueScore: fatigue.fatigueScore,
        score100: score,
      },
      trials: results,
    };

    setSummary({
      score100: score,
      result,
      snrThreshold: threshold,
      accuracy,
      noiseTolerance,
      message,
    });
    setStage('done');
    onDone(outcome);
  };

  const progressLabel = useMemo(() => {
    if (stage === 'practice') return `${practiceIndex}/${PRACTICE_TRIALS}`;
    if (stage === 'running') return `${trialIndex}/${TRIALS}`;
    return '';
  }, [practiceIndex, stage, trialIndex]);

  return (
    <div style={styles.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 900, color: brandCyan }}>
            {isArabic ? 'اختبار الكلام وسط الضجيج' : 'Speech-in-Noise'}
          </div>
          <div style={styles.muted}>
            {isArabic
              ? 'استمع للجملة واختر الكلمات التي سمعتها.'
              : 'Listen to the sentence and select the words you heard.'}
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
                ? 'ستسمع جملة مع ضجيج خلفي متغير. اختر الكلمات الصحيحة بعد الاستماع.'
                : 'You will hear a sentence with background noise. Select the correct words after listening.'}
            </p>
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
              {isArabic ? 'اختر الكلمات التي سمعتها' : 'Select the words you heard'}
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
            {isArabic ? 'تأكيد الإجابة' : 'Submit Response'}
          </button>
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
                { label: t('speechInNoise.snrThreshold'), value: `${summary.snrThreshold} dB` },
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
