import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPink, brandPurple, brandPurpleDark, styles } from '../styles';
import { createPdfDoc, PDF_MARGIN_X, writePdfText } from '../../utils/pdf';
import { ensureAudio, playTone, safeCloseAudio, setNoiseLevel, stopNoise, type NoiseRef } from './audio';
import { mean } from './stats';
import type { GameResult, TestOutcome } from './types';
import { SEQUENCE_POINTS, getStarRating, getStarEmoji } from './scoring';

type ShapeId = 'circle' | 'square' | 'triangle';

type RoundRow = {
  round: number;
  length: number;
  target: ShapeId[];
  chosen: ShapeId[];
  correct: boolean;
  noiseLevel: number;
  replayCount: number;
  rtMs: number[]; // per click reaction
};

const SHAPE_META: Record<ShapeId, { freq: number; color: string }> = {
  circle: { freq: 440, color: brandCyan },
  square: { freq: 660, color: brandPurple },
  triangle: { freq: 880, color: brandPink },
};

const SHAPE_IDS: ShapeId[] = ['circle', 'square', 'triangle'];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const seqEqual = (a: ShapeId[], b: ShapeId[]) => a.length === b.length && a.every((x, i) => x === b[i]);

const randomSeq = (len: number): ShapeId[] => {
  const ids = SHAPE_IDS;
  const out: ShapeId[] = [];
  for (let i = 0; i < len; i++) {
    out.push(ids[Math.floor(Math.random() * ids.length)] as ShapeId);
  }
  return out;
};

export default function SequencingTestPanel({
  onDone,
  onCancel,
  enableExports = true,
}: {
  onDone: (outcome: TestOutcome) => void;
  onCancel?: () => void;
  enableExports?: boolean;
}) {
  const { t } = useLanguage();
  const audioRef = useRef<AudioContext | null>(null);
  const noiseRef: NoiseRef = useRef(null);

  const ROUNDS = 8;
  const PRACTICE_ROUNDS = 2;
  const MIN_LENGTH = 2;
  const MAX_LENGTH = 5;

  const [stage, setStage] = useState<'intro' | 'listening' | 'responding' | 'done'>('intro');
  const [mode, setMode] = useState<'practice' | 'test'>('practice');
  const [round, setRound] = useState(1);
  const [length, setLength] = useState(2);
  const [target, setTarget] = useState<ShapeId[]>([]);
  const [chosen, setChosen] = useState<ShapeId[]>([]);
  const [score, setScore] = useState(0);
  const [replays, setReplays] = useState(0);
  const [noiseLevel, setNoiseLevelState] = useState(0.03);
  const [correctStreak, setCorrectStreak] = useState(0);

  // Enhanced gamification state
  const [gamePoints, setGamePoints] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [feedbackPoints, setFeedbackPoints] = useState(0);

  const rowsRef = useRef<RoundRow[]>([]);
  const clickTimesRef = useRef<number[]>([]);
  const feedbackTimerRef = useRef<number | null>(null);

  const ensure = () => ensureAudio(audioRef);
  const shapes = useMemo(() => ([
    { id: 'circle' as const, label: t('sequence.shapeCircle', 'Circle'), ...SHAPE_META.circle },
    { id: 'square' as const, label: t('sequence.shapeSquare', 'Square'), ...SHAPE_META.square },
    { id: 'triangle' as const, label: t('sequence.shapeTriangle', 'Triangle'), ...SHAPE_META.triangle },
  ]), [t]);
  const maxReplays = mode === 'practice' ? 2 : 1;

  const showFeedback = (type: 'correct' | 'incorrect', pts: number) => {
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    setLastFeedback(type);
    setFeedbackPoints(pts);
    feedbackTimerRef.current = window.setTimeout(() => {
      setLastFeedback(null);
      setFeedbackPoints(0);
    }, 800);
  };

  const cleanup = useCallback(() => {
    stopNoise(noiseRef);
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
      safeCloseAudio(audioRef);
    };
  }, [cleanup]);

  const playSequence = useCallback(
    async (seq: ShapeId[], nl: number) => {
      const audio = ensure();
      try {
        await audio.resume();
      } catch {
        // ignore
      }

      setNoiseLevel(audio, noiseRef, nl);

      const t0 = audio.currentTime + 0.05;
      const gap = 0.46;
      const dur = 0.28;

      seq.forEach((id, idx) => {
        const s = SHAPE_META[id];
        playTone(audio, { freq: s.freq, duration: dur, volume: 0.22, when: t0 + idx * gap });
      });

      // Wait for the sequence to finish
      await sleep(Math.round((seq.length * gap + 0.35) * 1000));
    },
    []
  );

  const startRound = useCallback(
    async (r: number, len: number, activeMode: 'practice' | 'test') => {
      const seq = randomSeq(len);
      setTarget(seq);
      setChosen([]);
      clickTimesRef.current = [];

      const baseNoise = activeMode === 'practice'
        ? 0.02 + (len - 2) * 0.01
        : 0.04 + (r / ROUNDS) * 0.14 + (len - 2) * 0.01;
      const nl = Math.min(0.22, Math.max(0.02, baseNoise));
      setNoiseLevelState(Number(nl.toFixed(3)));
      setReplays(0);

      setStage('listening');
      await playSequence(seq, nl);
      setStage('responding');
    },
    [ROUNDS, playSequence]
  );

  const startPractice = async () => {
    rowsRef.current = [];
    setMode('practice');
    setRound(1);
    setLength(MIN_LENGTH);
    setScore(0);
    setGamePoints(0);
    setCorrectStreak(0);
    setLastFeedback(null);
    setFeedbackPoints(0);
    await startRound(1, MIN_LENGTH, 'practice');
  };

  const startTest = async () => {
    rowsRef.current = [];
    setMode('test');
    setRound(1);
    setLength(MIN_LENGTH);
    setScore(0);
    setGamePoints(0);
    setCorrectStreak(0);
    setLastFeedback(null);
    setFeedbackPoints(0);
    await startRound(1, MIN_LENGTH, 'test');
  };

  const replay = async () => {
    if (stage !== 'responding') return;
    if (replays >= maxReplays) return; // limit replays for assessment integrity
    setReplays((x) => x + 1);
    setStage('listening');
    await playSequence(target, noiseLevel);
    setStage('responding');
  };

  const clickShape = (id: ShapeId) => {
    if (stage !== 'responding') return;

    const now = performance.now();
    clickTimesRef.current.push(now);

    const next = [...chosen, id];
    setChosen(next);

    if (next.length < target.length) return;

    // Evaluate
    const correct = seqEqual(target, next);
    const rts: number[] = [];
    for (let i = 0; i < next.length; i++) {
      const t = clickTimesRef.current[i];
      const prev = i === 0 ? clickTimesRef.current[0] : clickTimesRef.current[i - 1];
      const base = i === 0 ? clickTimesRef.current[0] : prev;
      rts.push(Math.round(i === 0 ? 0 : t - base));
    }

    if (mode === 'practice') {
      showFeedback(correct ? 'correct' : 'incorrect', 0);

      if (round >= PRACTICE_ROUNDS) {
        startTest();
        return;
      }

      const nextRoundIndex = round + 1;
      const nextLen = correct
        ? Math.min(MAX_LENGTH, length + 1)
        : Math.max(MIN_LENGTH, length - 1);
      setRound(nextRoundIndex);
      setLength(nextLen);
      setTimeout(() => {
        startRound(nextRoundIndex, nextLen, 'practice');
      }, 520);
      return;
    }

    rowsRef.current.push({
      round,
      length,
      target,
      chosen: next,
      correct,
      noiseLevel,
      replayCount: replays,
      rtMs: rts,
    });

    const nextScore = correct ? score + 1 : score;

    // Calculate points
    let pointChange = 0;
    if (correct) {
      setScore(nextScore);

      pointChange = SEQUENCE_POINTS.correctSequence;

      // Bonus for no replay
      if (replays === 0) {
        pointChange += SEQUENCE_POINTS.noReplayBonus;
      }

      // Bonus for long span
      if (length >= 4) {
        pointChange += SEQUENCE_POINTS.longSpanBonus;
      }

      setGamePoints((p) => p + pointChange);
      showFeedback('correct', pointChange);
    } else {
      pointChange = SEQUENCE_POINTS.wrongSequence;
      setGamePoints((p) => Math.max(0, p + pointChange));
      showFeedback('incorrect', pointChange);
    }

    let nextLen = length;
    let nextStreak = correct ? correctStreak + 1 : 0;
    if (correct && nextStreak >= 2) {
      nextLen = Math.min(MAX_LENGTH, length + 1);
      nextStreak = 0;
    }
    if (!correct) {
      nextLen = Math.max(MIN_LENGTH, length - 1);
    }
    setCorrectStreak(nextStreak);

    if (round >= ROUNDS) {
      finish(nextScore);
      return;
    }

    const nextRoundIndex = round + 1;
    setRound(nextRoundIndex);
    setLength(nextLen);
    setTimeout(() => {
      startRound(nextRoundIndex, nextLen, 'test');
    }, 520);
  };

  const finish = (finalScore: number) => {
    cleanup();
    const rows = rowsRef.current;
    const accuracy = Math.round((finalScore / ROUNDS) * 100);

    const achievedSpans = rows.filter((r) => r.correct).map((r) => r.length);
    const span = achievedSpans.length ? Math.max(...achievedSpans) : 2;

    const allRts = rows.flatMap((r) => r.rtMs).filter((n) => n > 0);
    const avgRt = Math.round(mean(allRts));

    const result: GameResult = span >= 4 && accuracy >= 75 ? 'high' : span >= 3 && accuracy >= 55 ? 'medium' : 'low';
    const starRating = getStarRating(result);

    // Perfect accuracy bonus
    const finalPoints = accuracy === 100 ? gamePoints + SEQUENCE_POINTS.perfectRoundBonus : gamePoints;

    const message =
      result === 'high'
        ? t('sequence.summaryHigh', 'Strong sequencing performance in this screening snapshot.')
        : result === 'medium'
          ? t('sequence.summaryMid', 'Moderate sequencing with room to strengthen working memory.')
          : t('sequence.summaryLow', 'Lower sequencing accuracy; consider repeating in a quiet setting.');

    const outcome: TestOutcome = {
      key: 'sequence',
            title: t('games.sequenceTest', 'Sound Sequence Test'),
      result,
            scoreLabel: `${getStarEmoji(starRating)} ${t('sequence.spanLabel', 'Span')} ${span} | ${accuracy}% | ${finalPoints}pts`,
      message,
      metrics: {
        rounds: ROUNDS,
        correctRounds: finalScore,
        accuracyPct: accuracy,
        maxSpan: span,
        avgReactionMs: avgRt,
        maxNoiseLevel: Math.max(...rows.map((r) => r.noiseLevel)).toFixed(2),
                replayPolicy: t('sequence.replayPolicy', 'one replay max per round'),
        gamePoints: finalPoints,
        starRating,
                workingMemorySpan: span,
        note: t('sequence.note', 'Span is a screening estimate (non-diagnostic).'),
      },
      trials: rows,
    };

    setStage('done');
    onDone(outcome);
  };

  const downloadCsv = () => {
    const rows = rowsRef.current;
    const header = ['round', 'length', 'target', 'chosen', 'correct', 'noise_level', 'replay_count', 'rt_ms'].join(',');
    const lines = rows.map((r) => [
      r.round,
      r.length,
      `"${r.target.join('-')}"`,
      `"${r.chosen.join('-')}"`,
      r.correct ? 1 : 0,
      r.noiseLevel.toFixed(3),
      r.replayCount,
      `"${r.rtMs.join('|')}"`,
    ].join(','));

    const csv = [header, ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Classroom-Sequencing-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadPdf = async () => {
    const rows = rowsRef.current;
    const doc = await createPdfDoc();
    doc.setFont('Cairo', 'normal');

    let y = 62;
    doc.setFontSize(16);
    y = writePdfText(doc, t('sequence.reportTitle', 'Sequence Demo Report'), PDF_MARGIN_X, y, { maxWidth: 520, lineHeight: 20 });

    doc.setFontSize(11);
    y = writePdfText(doc, t('sequence.reportDisclaimer', 'This export is a non-diagnostic screening summary.'), PDF_MARGIN_X, y + 10, { maxWidth: 520, lineHeight: 16 });

    y += 12;
    doc.setFontSize(10);

    for (const r of rows) {
      const line = `#${r.round} | len:${r.length} | target:${r.target.join('-')} | chosen:${r.chosen.join('-')} | ${r.correct ? 'OK' : 'MISS'} | noise:${r.noiseLevel.toFixed(2)} | replay:${r.replayCount}`;
      y = writePdfText(doc, line, PDF_MARGIN_X, y, { maxWidth: 520, lineHeight: 14 });
      if (y > 760) {
        doc.addPage();
        y = 62;
      }
    }

    doc.save(`Classroom-Sequencing-${Date.now()}.pdf`);
  };

  const progressLabel = useMemo(() => (
    mode === 'practice'
      ? `${t('sequence.practiceLabel', 'Practice')} ${round}/${PRACTICE_ROUNDS}`
      : `${t('sequence.roundLabel', 'Round')} ${round}/${ROUNDS}`
  ), [mode, round, PRACTICE_ROUNDS, ROUNDS, t]);

  return (
    <div style={styles.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 900, color: brandCyan }}>{t('games.sequenceTest', 'Sound Sequence Test')}</div>
          <div style={styles.muted}>{t('games.sequenceTestDesc', 'Test your auditory memory and sequence recall ability')}</div>
        </div>
        <span style={styles.chip}>{t('sequence.objective', 'Working memory sequencing')}</span>
      </div>

      {stage === 'intro' ? (
        <div style={{ marginTop: 12 }}>
          <p style={styles.bodyText}>
            {t('sequence.instructions', 'Listen to the sequence and tap the shapes in the same order.')}
            <span style={{ color: brandPink, fontWeight: 700 }}> {t('sequence.instructionsEmphasis', 'Focus on the order you hear.')}</span>{' '}
            {t('sequence.instructionsSuffix', 'Practice first, then the adaptive test begins.')}
          </p>
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(0,0,0,0.2)',
            }}
          >
            <p style={{ ...styles.muted, margin: 0 }}>{t('modules.disclaimer', 'This is a screening tool, not a medical diagnosis.')}</p>
          </div>

          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: 12 }}>
            {shapes.map((s) => (
              <div key={s.id} style={styles.section}>
                <div style={{ fontWeight: 900 }}>{s.label}</div>
                <div style={styles.muted}>{Math.round(s.freq)} Hz</div>
                <button
                  onClick={() => playTone(ensure(), { freq: s.freq, duration: 0.30, volume: 0.22 })}
                  style={{ ...styles.ghostBtn, marginTop: 10, borderColor: 'rgba(143,211,204,0.25)' }}
                >
                  {t('games.play', 'Play')}
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12, gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={startPractice}
              style={{ ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandPink})` }}
            >
              {t('sequence.startPractice', 'Start Practice')}
            </button>
            {onCancel ? <button onClick={onCancel} style={styles.ghostBtn}>{t('games.close', 'Close')}</button> : null}
          </div>
        </div>
      ) : null}

      {stage === 'listening' ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 900 }}>{progressLabel}</div>
              <div style={styles.muted}>
                {t('sequence.lengthLabel', 'Sequence length')}: {length} | {t('sequence.noiseLabel', 'Noise')}: {noiseLevel.toFixed(2)}
              </div>
            </div>
            <span style={styles.chip}>
              {mode === 'practice' ? t('sequence.practiceChip', 'Practice') : t('sequence.listeningChip', 'Listening')}
            </span>
          </div>
          <div style={{ marginTop: 12, ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: brandPurpleDark }}>{t('sequence.listeningTitle', 'Listen to the sequence')}</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>{t('sequence.listeningBody', 'Focus on the order. You will tap the shapes next.')}</p>
          </div>
        </div>
      ) : null}

      {stage === 'responding' ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 900 }}>{progressLabel}</div>
              <div style={styles.muted}>
                {t('sequence.progressLabel', 'Selections')}: {chosen.length}/{target.length} | {t('sequence.noiseLabel', 'Noise')}: {noiseLevel.toFixed(2)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <span
                style={{
                  ...styles.chip,
                  background: 'rgba(143,211,204,0.15)',
                  borderColor: 'rgba(143,211,204,0.4)',
                }}
              >
                {gamePoints} pts
              </span>
              {mode === 'test' ? (
                <span style={styles.chip}>
                  {t('sequence.scoreLabel', 'Score')}: {score}/{Math.max(0, round - 1)}
                </span>
              ) : null}
              <button onClick={replay} disabled={replays >= maxReplays} style={replays >= maxReplays ? styles.disabledBtn : styles.ghostBtn}>
                {t('sequence.replayLabel', 'Replay sequence')} ({Math.max(0, maxReplays - replays)}/{maxReplays})
              </button>
            </div>
          </div>

          {lastFeedback && (
            <div
              style={{
                marginTop: 12,
                textAlign: 'center',
                padding: '10px 16px',
                borderRadius: 12,
                fontWeight: 900,
                fontSize: 18,
                animation: 'feedbackPop 0.3s ease-out',
                background: lastFeedback === 'correct' ? 'rgba(143,211,204,0.2)' : 'rgba(176,18,112,0.2)',
                color: lastFeedback === 'correct' ? brandCyan : brandPink,
              }}
            >
              {lastFeedback === 'correct'
                ? `${t('sequence.feedbackCorrect', 'Correct!')}${feedbackPoints ? ` +${feedbackPoints}` : ''}${mode === 'test' && replays === 0 && feedbackPoints ? ` | ${t('sequence.noReplayBonus', 'No replay bonus')}` : ''}`
                : t('sequence.feedbackIncorrect', 'Try again')}
            </div>
          )}

          <div style={{ marginTop: 12, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {shapes.map((s) => (
              <button
                key={s.id}
                onClick={() => clickShape(s.id)}
                style={{
                  ...styles.section,
                  cursor: 'pointer',
                  minHeight: 150,
                  display: 'grid',
                  placeItems: 'center',
                  borderColor: 'rgba(255,255,255,0.10)',
                }}
              >
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: s.id === 'circle' ? 999 : s.id === 'square' ? 16 : 0,
                    border: s.id === 'triangle' ? 'none' : `4px solid ${s.color}`,
                    background: s.id === 'triangle' ? 'transparent' : 'rgba(255,255,255,0.06)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {s.id === 'triangle' ? (
                    <div style={{ width: 0, height: 0, borderLeft: '42px solid transparent', borderRight: '42px solid transparent', borderBottom: `80px solid ${s.color}` }} />
                  ) : null}
                </div>
                <div style={{ marginTop: 8, fontWeight: 900 }}>{s.label}</div>
              </button>
            ))}
          </div>

          <div style={{ marginTop: 12, ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: brandPurpleDark }}>{t('sequence.reminderTitle', 'Remember the order')}</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>
              {t('sequence.reminderBody', 'Tap the shapes in the same order you heard them.')}
            </p>
          </div>
        </div>
      ) : null}

      {stage === 'done' ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: brandCyan }}>{t('sequence.doneTitle', 'Sequence complete')}</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>
              {t('sequence.doneBody', 'Download the session details for review.')}
            </p>
            <p style={{ ...styles.muted, marginTop: 6 }}>{t('clinical.screeningDisclaimer')}</p>
            {enableExports ? (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                <button onClick={downloadPdf} style={{ ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})` }}>
                  {t('games.exportPdf', 'Export PDF')}
                </button>
                <button onClick={downloadCsv} style={{ ...styles.ghostBtn, borderColor: 'rgba(143,211,204,0.25)' }}>
                  {t('games.exportCsv', 'Export CSV')}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <style>{`
        @keyframes feedbackPop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );

}
