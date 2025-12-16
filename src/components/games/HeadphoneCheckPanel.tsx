import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { brandCyan, brandPink, brandPurpleDark, styles } from '../styles';
import { ensureAudio, playTone, safeCloseAudio } from './audio';

export type HeadphoneCheckResult = {
  supported: boolean;
  passed: boolean;
  correct: number;
  total: number;
};

const randomSide = (): -1 | 1 => (Math.random() < 0.5 ? -1 : 1);

export default function HeadphoneCheckPanel({
  onDone,
  onSkip,
}: {
  onDone: (res: HeadphoneCheckResult) => void;
  onSkip?: () => void;
}) {
  const audioRef = useRef<AudioContext | null>(null);
  const supported = useMemo(() => {
    try {
      const tmp = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ok = Boolean((tmp as any).createStereoPanner);
      tmp.close();
      return ok;
    } catch {
      return false;
    }
  }, []);

  const trials = useMemo(() => [randomSide(), randomSide(), randomSide()] as (-1 | 1)[], []);
  const TOTAL = trials.length;

  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [lastSide, setLastSide] = useState<-1 | 1 | null>(null);

  const playTrial = useCallback(async () => {
    if (!supported) return;
    setPlaying(true);
    const audio = ensureAudio(audioRef);
    try {
      // Resume required on some browsers
      await audio.resume();
    } catch {
      // ignore
    }

    const side = trials[step];
    setLastSide(side);

    // 600Hz tone, short
    playTone(audio, { freq: 600, duration: 0.35, volume: 0.22, pan: side });

    // small delay for UX
    setTimeout(() => setPlaying(false), 420);
  }, [step, supported, trials]);

  useEffect(() => {
    return () => {
      safeCloseAudio(audioRef);
    };
  }, []);

  const answer = (choice: -1 | 1) => {
    if (lastSide === null) return;
    const isCorrect = choice === lastSide;
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    setCorrect(nextCorrect);

    const nextStep = step + 1;
    if (nextStep >= TOTAL) {
      const passed = nextCorrect >= TOTAL - 1; // allow 1 mistake
      onDone({ supported: true, passed, correct: nextCorrect, total: TOTAL });
      return;
    }

    setStep(nextStep);
    setLastSide(null);
  };

  if (!supported) {
    return (
      <div style={styles.section}>
        <div style={{ fontWeight: 900, color: brandPink }}>تنبيه</div>
        <p style={{ ...styles.bodyText, marginTop: 8 }}>
          متصفحك لا يدعم اختبار "يمين/يسار" (Stereo Panning). يمكنك المتابعة، لكن يفضّل استخدام سماعات للحصول على نتيجة أدق.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
          <button
            style={{ ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})` }}
            onClick={() => onDone({ supported: false, passed: false, correct: 0, total: 0 })}
          >
            متابعة
          </button>
          {onSkip ? (
            <button style={styles.ghostBtn} onClick={onSkip}>
              إغلاق
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 900, color: brandCyan }}>اختبار السماعات (يمين / يسار)</div>
          <p style={{ ...styles.muted, marginTop: 6 }}>
            الهدف: التأكد أن الصوت يعمل عبر سماعات (ستسمع النغمة في أذن واحدة فقط).
          </p>
        </div>
        <span style={styles.chip}>Step {step + 1}/{TOTAL}</span>
      </div>

      <div style={{ marginTop: 12, padding: 14, borderRadius: 14, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(0,0,0,0.18)' }}>
        <div style={{ fontWeight: 900 }}>اضغط "تشغيل" ثم اختر أين سمعت النغمة</div>
        <p style={{ ...styles.muted, marginTop: 6 }}>💡 إذا كنت على مكبر الصوت قد تسمع النغمة في المنتصف — هذا طبيعي.</p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
          <button
            onClick={playTrial}
            disabled={playing}
            style={playing ? styles.disabledBtn : { ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})` }}
          >
            ▶︎ تشغيل
          </button>
          <button
            onClick={() => answer(-1)}
            disabled={lastSide === null || playing}
            style={lastSide === null || playing ? styles.disabledBtn : styles.ghostBtn}
          >
            اليسار
          </button>
          <button
            onClick={() => answer(1)}
            disabled={lastSide === null || playing}
            style={lastSide === null || playing ? styles.disabledBtn : styles.ghostBtn}
          >
            اليمين
          </button>
        </div>

        <div style={{ marginTop: 10, ...styles.muted }}>النتيجة الحالية: {correct} صحيحة</div>
      </div>

      <div style={{ marginTop: 12, ...styles.muted }}>
        هذا اختبار تهيئة (Calibration) لتحسين جودة الفحص — ليس جزءًا من التقييم بحد ذاته.
      </div>
    </div>
  );
}
