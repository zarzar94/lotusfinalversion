import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { brandCyan, brandPink, brandPurpleDark, styles } from '../styles';
import { ensureAudio, playTone, safeCloseAudio, setNoiseLevel, stopNoise } from './audio';
import { clamp01, dPrime, mean } from './stats';
import type { GameResult, TestOutcome } from './types';

type Trial = {
  i: number;
  isTarget: boolean;
  freq: number;
  noise: number;
  responded: boolean;
  responseType?: 'hit' | 'fa' | 'miss' | 'cr';
  rtMs?: number;
};

const TARGET_FREQ = 880;
const NON_TARGET_FREQS = [440, 520, 600, 660, 720];

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildTrials = (total = 36, targetCount = 9): Trial[] => {
  const flags = shuffle([...Array(targetCount)].map(() => true).concat([...Array(total - targetCount)].map(() => false)));
  const trials: Trial[] = flags.map((isTarget, idx) => {
    const noise = 0.02 + (idx / Math.max(1, total - 1)) * 0.14; // 0.02 → 0.16
    const freq = isTarget ? TARGET_FREQ : NON_TARGET_FREQS[Math.floor(Math.random() * NON_TARGET_FREQS.length)];
    return { i: idx + 1, isTarget, freq, noise, responded: false };
  });
  // Light constraint: avoid 3 targets in a row
  for (let k = 2; k < trials.length; k++) {
    if (trials[k].isTarget && trials[k - 1].isTarget && trials[k - 2].isTarget) {
      // swap with a later non-target if possible
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

export default function AttentionTestPanel({
  onDone,
  onCancel,
}: {
  onDone: (outcome: TestOutcome) => void;
  onCancel?: () => void;
}) {
  const audioRef = useRef<AudioContext | null>(null);
  const noiseRef = useRef<any>(null);

  const [stage, setStage] = useState<'intro' | 'practice' | 'running' | 'done'>('intro');
  const [trialIndex, setTrialIndex] = useState(0);
  const [hits, setHits] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);

  const trialsRef = useRef<Trial[]>([]);
  const currentRef = useRef<{ idx: number; onset: number } | null>(null);
  const rtsRef = useRef<number[]>([]);
  const timerRef = useRef<number | null>(null);

  const TOTAL = 36;
  const TARGETS = 9;
  const RESPONSE_MIN = 140; // ms
  const RESPONSE_MAX = 1100; // ms
  const INTER_TRIAL = 1250; // ms between tones

  const ensure = () => ensureAudio(audioRef);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    stopNoise(noiseRef);
    currentRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
      safeCloseAudio(audioRef);
    };
  }, [cleanup]);

  const playExample = (freq: number) => {
    const audio = ensure();
    playTone(audio, { freq, duration: 0.35, volume: 0.24 });
  };

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
    setMsg(null);
    setTrialIndex(0);
    setStage('running');

    cleanup();
    runTrial(0);
  };

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

    // Play the tone
    playTone(audio, { freq: t.freq, duration: 0.22, volume: 0.22, type: 'sine' });

    // Close trial window and move on
    timerRef.current = window.setTimeout(() => {
      const cur = currentRef.current;
      if (cur && cur.idx === idx) {
        // mark miss / correct rejection
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
      // no active trial
      setFalseAlarms((x) => x + 1);
      return;
    }

    const t = trials[cur.idx];
    const dt = now - cur.onset;

    // Too early/late => treat as false alarm
    if (dt < RESPONSE_MIN || dt > RESPONSE_MAX) {
      setFalseAlarms((x) => x + 1);
      return;
    }

    if (t.responded) {
      // double tap within same trial -> impulsive false alarm
      setFalseAlarms((x) => x + 1);
      return;
    }

    t.responded = true;
    t.rtMs = Math.round(dt);

    if (t.isTarget) {
      t.responseType = 'hit';
      setHits((h) => h + 1);
      rtsRef.current.push(dt);
    } else {
      t.responseType = 'fa';
      setFalseAlarms((f) => f + 1);
    }
  };

  const finish = () => {
    cleanup();

    const trials = trialsRef.current;
    const targetTrials = trials.filter((t) => t.isTarget).length;
    const nonTargetTrials = Math.max(1, trials.length - targetTrials);

    const h = hits;
    const fa = falseAlarms;

    const hitRate = clamp01(h / Math.max(1, targetTrials));
    const faRate = clamp01(fa / nonTargetTrials);

    const dp = dPrime(hitRate, faRate);
    const avgRt = Math.round(mean(rtsRef.current));

    // Convert to a friendly 0–100 score (not normative)
    const dpClamped = Math.max(0, Math.min(3, dp));
    const score100 = Math.round((dpClamped / 3) * 100);

    const result: GameResult = dp >= 1.2 && hitRate >= 0.7 && faRate <= 0.25 ? 'high' : dp >= 0.65 ? 'medium' : 'low';

    const message =
      result === 'high'
        ? 'استجابة قوية للمثيرات السمعية المستهدفة مع ضوضاء متزايدة (انتباه انتقائي جيد ضمن هذا الفحص).'
        : result === 'medium'
          ? 'ظهرت بعض الأخطاء/الاندفاعية تحت الضوضاء. من المفيد تجربة اختبار التردد + التسلسل السمعي للحصول على صورة أدق.'
          : 'ظهرت صعوبة واضحة في تمييز المثير المستهدف أو ضبط الاستجابة تحت الضوضاء. إذا كان هذا ينعكس على الأداء الدراسي/السلوكي، ننصح بتقييم متخصص.';

    const outcome: TestOutcome = {
      key: 'attention',
      title: 'اختبار الانتباه السمعي تحت الضوضاء (Go/No-Go)',
      result,
      scoreLabel: `${score100}/100 • d'=${dp.toFixed(2)} • RT≈${avgRt}ms`,
      message,
      metrics: {
        trials: trials.length,
        targets: targetTrials,
        hits: h,
        falseAlarms: fa,
        hitRate: hitRate.toFixed(2),
        falseAlarmRate: faRate.toFixed(2),
        dPrime: dp.toFixed(2),
        avgReactionMs: avgRt,
        maxNoiseLevel: Math.max(...trials.map((t) => t.noise)).toFixed(2),
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
    <div style={styles.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 900, color: brandCyan }}>اختبار الانتباه السمعي تحت الضوضاء</div>
          <div style={styles.muted}>فحص موضوعي قصير (Go/No-Go) لقياس الانتباه الانتقائي والاندفاعية.</div>
        </div>
        <span style={styles.chip}>Objective</span>
      </div>

      {stage === 'intro' ? (
        <div style={{ marginTop: 12 }}>
          <p style={styles.bodyText}>
            ستسمع سلسلة من النغمات. <b>اضغط زر الاستجابة فقط</b> عندما تسمع <b style={{ color: brandPink }}>النغمة العالية جداً</b>.
            ستزداد الضوضاء تدريجياً.
          </p>

          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: 12 }}>
            <div style={styles.section}>
              <div style={{ fontWeight: 900 }}>النغمة المستهدفة</div>
              <div style={styles.muted}>High tone (Target)</div>
              <button onClick={() => playExample(TARGET_FREQ)} style={{ ...styles.primaryBtn, marginTop: 10 }}>
                استمع
              </button>
            </div>
            <div style={styles.section}>
              <div style={{ fontWeight: 900 }}>مثال غير مستهدف</div>
              <div style={styles.muted}>Do NOT tap</div>
              <button onClick={() => playExample(NON_TARGET_FREQS[0])} style={{ ...styles.ghostBtn, marginTop: 10, borderColor: 'rgba(143,211,204,0.25)' }}>
                استمع
              </button>
            </div>
          </div>

          <div style={{ marginTop: 12, ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: brandPurpleDark }}>ملاحظة</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>
              هذا فحص تفاعلي إرشادي (Screening) وليس تشخيصاً طبياً. لتحويله لاختبار معياري نحتاج معايرة سماعات ومعايير عمرية.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12, gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => setStage('practice')} style={{ ...styles.ghostBtn, borderColor: 'rgba(175,132,186,0.25)' }}>
              تدريب سريع
            </button>
            <button onClick={start} style={{ ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandPink})` }}>
              ابدأ الاختبار
            </button>
            {onCancel ? (
              <button onClick={onCancel} style={styles.ghostBtn}>
                إغلاق
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {stage === 'practice' ? (
        <div style={{ marginTop: 12 }}>
          <div style={styles.section}>
            <div style={{ fontWeight: 900, color: brandCyan }}>تدريب (10 ثوانٍ)</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>
              جرّب الآن: اضغط فقط مع النغمة العالية جداً.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
              <button onClick={() => playExample(TARGET_FREQ)} style={styles.primaryBtn}>تشغيل Target</button>
              <button onClick={() => playExample(NON_TARGET_FREQS[2])} style={styles.ghostBtn}>تشغيل Non‑Target</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              <button onClick={start} style={{ ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandPink})` }}>
                ابدأ الاختبار الحقيقي
              </button>
              <button onClick={() => setStage('intro')} style={styles.ghostBtn}>رجوع</button>
            </div>
          </div>
        </div>
      ) : null}

      {stage === 'running' ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 900 }}>التقدم: {trialIndex}/{TOTAL} ({progressPct}%)</div>
              <div style={styles.muted}>اضغط فقط عند سماع النغمة العالية جداً.</div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={styles.chip}>Hits ✅ {hits}</span>
              <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.14)', borderColor: 'rgba(176,18,112,0.25)' }}>False Alarms ✖ {falseAlarms}</span>
            </div>
          </div>

          <div style={{ marginTop: 12, padding: 18, borderRadius: 16, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(0,0,0,0.18)' }}>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>زر الاستجابة</div>
            <button
              onClick={respond}
              style={{
                ...styles.primaryBtn,
                width: '100%',
                padding: '18px 16px',
                fontSize: 18,
                background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})`,
              }}
            >
              👆 اضغط عند سماع Target
            </button>
            <div style={{ marginTop: 10, ...styles.muted }}>
              نصيحة: لا تضغط بسرعة. الضغط العشوائي يزيد "False Alarms".
            </div>
          </div>

          {msg ? <div style={{ marginTop: 10, ...styles.muted }}>{msg}</div> : null}
        </div>
      ) : null}

      {stage === 'done' ? (
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <div style={{ fontWeight: 900 }}>تم حفظ النتيجة ✅</div>
          <p style={{ ...styles.muted, marginTop: 6 }}>يمكنك الآن الانتقال للاختبار التالي.</p>
        </div>
      ) : null}
    </div>
  );
}
