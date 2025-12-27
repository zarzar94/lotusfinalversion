import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPink, brandPurple, brandPurpleDark, styles } from '../styles';
import LabButton from '../labui/LabButton';
import { createPdfDoc, PDF_MARGIN_X, writePdfText } from '../../utils/pdf';
import { ensureAudio, playTone, safeCloseAudio, setNoiseLevel, stopNoise, type NoiseRef } from './audio';
import { mean } from './stats';
import type { GameResult, TestOutcome } from './types';
import { SEQUENCE_POINTS, getStarRating, getStarEmoji } from './scoring';
import {
  CalibrationStep,
  CTAResultPanel,
  MetricsSummaryPanel,
  ModuleFrame,
  ModuleHeader,
  PracticeTrialsStep,
} from './ui';

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

const shapes: Array<{ id: ShapeId; label: string; freq: number; color: string }> = [
  { id: 'circle', label: 'دائرة', freq: 440, color: brandCyan },
  { id: 'square', label: 'مربع', freq: 660, color: brandPurple },
  { id: 'triangle', label: 'مثلث', freq: 880, color: brandPink },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const seqEqual = (a: ShapeId[], b: ShapeId[]) => a.length === b.length && a.every((x, i) => x === b[i]);

const randomSeq = (len: number): ShapeId[] => {
  const ids = shapes.map((s) => s.id);
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
  const { isArabic, t } = useLanguage();
  const audioRef = useRef<AudioContext | null>(null);
  const noiseRef: NoiseRef = useRef(null);

  const ROUNDS = 8;

  const [stage, setStage] = useState<'intro' | 'listening' | 'responding' | 'done'>('intro');
  const [round, setRound] = useState(1);
  const [length, setLength] = useState(2);
  const [target, setTarget] = useState<ShapeId[]>([]);
  const [chosen, setChosen] = useState<ShapeId[]>([]);
  const [score, setScore] = useState(0);
  const [replays, setReplays] = useState(0);
  const [maxSpan, setMaxSpan] = useState(0);
  const [noiseLevel, setNoiseLevelState] = useState(0.03);

  // Enhanced gamification state
  const [gamePoints, setGamePoints] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [feedbackPoints, setFeedbackPoints] = useState(0);
  const [summary, setSummary] = useState<{
    result: GameResult;
    span: number;
    accuracy: number;
    finalPoints: number;
    avgRt: number;
    maxNoise: string;
    message: string;
  } | null>(null);

  const rowsRef = useRef<RoundRow[]>([]);
  const clickTimesRef = useRef<number[]>([]);
  const feedbackTimerRef = useRef<number | null>(null);

  const ensure = () => ensureAudio(audioRef);

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
        const s = shapes.find((x) => x.id === id)!;
        playTone(audio, { freq: s.freq, duration: dur, volume: 0.22, when: t0 + idx * gap });
      });

      // Wait for the sequence to finish
      await sleep(Math.round((seq.length * gap + 0.35) * 1000));
    },
    []
  );

  const startRound = useCallback(
    async (r: number, len: number) => {
      const seq = randomSeq(len);
      setTarget(seq);
      setChosen([]);
      clickTimesRef.current = [];

      const nl = 0.04 + (r / ROUNDS) * 0.14 + (len - 2) * 0.01;
      setNoiseLevelState(Number(nl.toFixed(3)));
      setReplays(0);

      setStage('listening');
      await playSequence(seq, nl);
      setStage('responding');
    },
    [ROUNDS, playSequence]
  );

  const begin = async () => {
    rowsRef.current = [];
    setRound(1);
    setLength(2);
    setScore(0);
    setMaxSpan(0);
    setGamePoints(0);
    setLastFeedback(null);
    setSummary(null);
    await startRound(1, 2);
  };

  const replay = async () => {
    if (stage !== 'responding') return;
    if (replays >= 1) return; // limit replays for assessment integrity
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
      setMaxSpan((m) => Math.max(m, length));

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

    const nextLen = correct ? Math.min(5, length + 1) : Math.max(2, length - 1);

    if (round >= ROUNDS) {
      finish(nextScore);
      return;
    }

    const nextRoundIndex = round + 1;
    setRound(nextRoundIndex);
    setLength(nextLen);
    setTimeout(() => {
      startRound(nextRoundIndex, nextLen);
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
        ? 'ذاكرة/تسلسل سمعي قوي حتى مع ضوضاء متزايدة (ضمن هذا الفحص).'
        : result === 'medium'
          ? 'تسلسل سمعي متوسط — قد تتأثر الذاكرة السمعية عند زيادة الضوضاء أو طول التعليمات.'
          : 'تسلسل سمعي منخفض ضمن هذا الفحص. إذا كان ذلك ينعكس على اتباع التعليمات داخل الصف، ننصح بتقييم متخصص.';

    const maxNoise = rows.length ? Math.max(...rows.map((r) => r.noiseLevel)).toFixed(2) : '0.00';

    const outcome: TestOutcome = {
      key: 'sequence',
      title: 'اختبار التسلسل/الذاكرة السمعية تحت الضوضاء (Classroom Sequencing)',
      result,
      scoreLabel: `${getStarEmoji(starRating)} Span=${span} • ${accuracy}% • ${finalPoints}pts`,
      message,
      metrics: {
        rounds: ROUNDS,
        correctRounds: finalScore,
        accuracyPct: accuracy,
        maxSpan: span,
        avgReactionMs: avgRt,
        maxNoiseLevel: maxNoise,
        replayPolicy: 'one replay max per round',
        gamePoints: finalPoints,
        starRating,
        workingMemorySpan: span,
      },
      trials: rows,
    };

    setSummary({
      result,
      span,
      accuracy,
      finalPoints,
      avgRt,
      maxNoise,
      message,
    });
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
    y = writePdfText(doc, 'تقرير Demo — اختبار التسلسل/الذاكرة السمعية', PDF_MARGIN_X, y, { maxWidth: 520, lineHeight: 20 });

    doc.setFontSize(11);
    y = writePdfText(doc, 'ملاحظة: التقرير توضيحي وغير تشخيصي. يُستخدم للعرض داخل المدرسة بدون بيانات شخصية.', PDF_MARGIN_X, y + 10, { maxWidth: 520, lineHeight: 16 });

    y += 12;
    doc.setFontSize(10);

    for (const r of rows) {
      const line = `#${r.round} | len:${r.length} | target:${r.target.join('-')} | chosen:${r.chosen.join('-')} | ${r.correct ? '✓' : '✗'} | noise:${r.noiseLevel.toFixed(2)} | replay:${r.replayCount}`;
      y = writePdfText(doc, line, PDF_MARGIN_X, y, { maxWidth: 520, lineHeight: 14 });
      if (y > 760) {
        doc.addPage();
        y = 62;
      }
    }

    doc.save(`Classroom-Sequencing-${Date.now()}.pdf`);
  };

  const roundProgress = useMemo(() => `${round}/${ROUNDS}`, [round, ROUNDS]);
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
        title={'اختبار التسلسل/الذاكرة السمعية تحت الضوضاء'}
        subtitle={'اختبار موضوعي يحاكي اتباع تعليمات متعددة داخل الصف مع ضوضاء متزايدة.'}
        tone="cyan"
        status={isArabic ? 'موضوعي • عرض مدرسي' : 'Objective • School Demo'}
        statusTone="cyan"
      />

      {stage === 'intro' ? (
        <CalibrationStep title={isArabic ? 'موضوعي • عرض مدرسي' : 'Objective • School Demo'}>
          <p style={styles.bodyText}>
            ستسمع سلسلة من النغمات (تمثل أوامر/أشكال). بعد ذلك اضغط الأشكال <b style={{ color: brandPink }}>بالترتيب نفسه</b>. سيزداد طول السلسلة تدريجياً.
          </p>

          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: 12 }}>
            {shapes.map((s) => (
              <div key={s.id} style={styles.section}>
                <div style={{ fontWeight: 900 }}>{s.label}</div>
                <div style={styles.muted}>{Math.round(s.freq)} Hz</div>
                <LabButton variant="ghost" onClick={() => playTone(ensure(), { freq: s.freq, duration: 0.30, volume: 0.22 })} style={{ marginTop: 10 }}>
                  استمع
                </LabButton>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12, gap: 10, flexWrap: 'wrap' }}>
            <LabButton onClick={begin}>
              ابدأ الاختبار
            </LabButton>
            {onCancel ? (
              <LabButton variant="ghost" onClick={onCancel}>
                إغلاق
              </LabButton>
            ) : null}
          </div>
        </CalibrationStep>
      ) : null}

      {stage === 'listening' ? (
        <PracticeTrialsStep
          title={`Round ${roundProgress}`}
          description={`الطول الحالي: ${length} • Noise: ${noiseLevel.toFixed(2)}`}
          status="استمع…"
          statusTone="purple"
        >
          
          <div style={{ marginTop: 12, ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: brandPurpleDark }}>تشغيل السلسلة</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>استمع جيدًا. ستظهر أزرار الإدخال بعد انتهاء التشغيل.</p>
          </div>
        </PracticeTrialsStep>
      ) : null}

      {stage === 'responding' ? (
        <PracticeTrialsStep
          title={`Round ${roundProgress}`}
          description={`أدخل التسلسل: ${chosen.length}/${target.length} • Noise: ${noiseLevel.toFixed(2)}`}
        >
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{
                ...styles.chip,
                background: 'rgba(143,211,204,0.15)',
                borderColor: 'rgba(143,211,204,0.4)',
              }}>
                {gamePoints} pts
              </span>
              <span style={styles.chip}>✅ {score}/{round - 1}</span>
              <LabButton variant="ghost" onClick={replay} disabled={replays >= 1}>
                🔁 إعادة تشغيل (مرة واحدة)
              </LabButton>
            </div>
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
              {lastFeedback === 'correct'
                ? `✓ Correct! +${feedbackPoints}${replays === 0 ? ' (No Replay Bonus!)' : ''}`
                : `✗ Wrong sequence ${feedbackPoints}`}
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
            <div style={{ fontWeight: 900, color: brandPurpleDark }}>ملاحظة جودة</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>
              إعادة التشغيل تقلل من دقة القياس. تم السماح بها مرة واحدة لكل جولة فقط.
            </p>
          </div>
        </PracticeTrialsStep>
      ) : null}

      
      {stage === 'done' && summary ? (
        <>
          <MetricsSummaryPanel
            title={summary.message}
            tone={summaryTone}
            metrics={[
              { label: 'Span', value: summary.span },
              { label: 'Accuracy', value: `${summary.accuracy}%` },
              { label: 'Points', value: summary.finalPoints },
              { label: 'Avg RT', value: summary.avgRt ? `${summary.avgRt} ms` : '--' },
              { label: 'Max Noise', value: summary.maxNoise },
            ]}
            footer={t('clinical.screeningDisclaimer')}
          />
          <CTAResultPanel
            title={'تم حفظ النتيجة ✅'}
            description={'يمكنك تنزيل تقرير المدارس (PDF/CSV) أو الانتقال للخلاصة.'}
            actions={enableExports ? (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                <LabButton onClick={downloadPdf}>
                  تنزيل PDF
                </LabButton>
                <LabButton variant="ghost" onClick={downloadCsv}>
                  تنزيل CSV
                </LabButton>
              </div>
            ) : undefined}
          />
        </>
      ) : null}

      <style>{`
        @keyframes feedbackPop {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </ModuleFrame>
  );
}
