import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  brandCyan,
  brandPink,
  brandPurple,
  brandPurpleDark,
  colors,
  typography,
  spacing,
  radius,
  styles,
} from '../styles';
import { useLanguage } from '../../context/LanguageContext';
import { ensureAudio, playTone, safeCloseAudio } from './audio';

export type HeadphoneCheckResult = {
  supported: boolean;
  passed: boolean;
  correct: number;
  total: number;
  volumeConfirmed?: boolean;
};

const randomSide = (): -1 | 1 => (Math.random() < 0.5 ? -1 : 1);

// Lab-tech styled step indicator
const StepIndicator = ({
  current,
  total,
  isArabic,
}: {
  current: number;
  total: number;
  isArabic: boolean;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: `${spacing[1]}px ${spacing[3]}px`,
      background: 'rgba(13,17,23,0.8)',
      border: `1px solid ${brandCyan}30`,
      borderRadius: radius.full,
    }}
  >
    <div
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: brandCyan,
        boxShadow: `0 0 8px ${brandCyan}`,
        animation: 'statusPulse 2s ease-in-out infinite',
      }}
    />
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: brandCyan,
        fontFamily: 'monospace',
        letterSpacing: 1,
      }}
    >
      {isArabic ? `${current}/${total}` : `STEP ${current}/${total}`}
    </span>
  </div>
);

// Lab-tech styled button
const LabButton = ({
  onClick,
  disabled,
  variant = 'primary',
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'left' | 'right';
  children: React.ReactNode;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getColor = () => {
    switch (variant) {
      case 'left':
        return brandPurple;
      case 'right':
        return brandPink;
      case 'secondary':
        return 'rgba(255,255,255,0.6)';
      default:
        return brandCyan;
    }
  };

  const color = getColor();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: `${spacing[2.5]}px ${spacing[5]}px`,
        background: disabled
          ? 'rgba(255,255,255,0.05)'
          : variant === 'primary'
            ? `linear-gradient(135deg, ${color}, ${color}cc)`
            : isHovered
              ? `${color}20`
              : 'transparent',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.1)' : color}`,
        borderRadius: radius.lg,
        color: disabled ? 'rgba(255,255,255,0.3)' : variant === 'primary' ? '#fff' : color,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.semibold,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: !disabled && isHovered ? `0 4px 16px ${color}30` : 'none',
        transform: !disabled && isHovered ? 'translateY(-2px)' : 'none',
      }}
    >
      {children}
    </button>
  );
};

// Volume calibration component
const VolumeCalibration = ({
  onConfirm,
  onSkip,
  isArabic,
}: {
  onConfirm: () => void;
  onSkip?: () => void;
  isArabic: boolean;
}) => {
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  const playTestTone = useCallback(async () => {
    setIsPlaying(true);
    const audio = ensureAudio(audioRef);
    try {
      await audio.resume();
    } catch {
      // ignore
    }

    // Play a comfortable calibration tone
    playTone(audio, { freq: 1000, duration: 1.0, volume: volume / 200, pan: 0 });

    setTimeout(() => setIsPlaying(false), 1100);
  }, [volume]);

  useEffect(() => {
    return () => {
      safeCloseAudio(audioRef);
    };
  }, []);

  const text = isArabic
    ? {
        title: 'معايرة مستوى الصوت',
        subtitle: 'اضبط مستوى الصوت ليكون مريحاً وواضحاً',
        instruction: 'اضغط "تشغيل" واضبط الصوت حتى تسمعه بوضوح دون إزعاج',
        playBtn: 'تشغيل',
        confirmBtn: 'الصوت مريح - متابعة',
        skipBtn: 'تخطي',
        volumeLabel: 'مستوى الصوت',
      }
    : {
        title: 'Volume Calibration',
        subtitle: 'Adjust volume to a comfortable and clear level',
        instruction: 'Click "Play" and adjust until you hear clearly without discomfort',
        playBtn: 'Play Test Tone',
        confirmBtn: 'Volume OK - Continue',
        skipBtn: 'Skip',
        volumeLabel: 'Volume Level',
      };

  return (
    <div
      style={{
        padding: spacing[5],
        background: 'linear-gradient(135deg, rgba(26,31,46,0.95), rgba(13,17,23,0.95))',
        border: `1px solid ${brandCyan}20`,
        borderRadius: radius.xl,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Scan line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${brandCyan}60, transparent)`,
          animation: 'scanLineHorizontal 3s linear infinite',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexDirection: isArabic ? 'row-reverse' : 'row',
          marginBottom: spacing[4],
        }}
      >
        <div style={{ textAlign: isArabic ? 'right' : 'left' }}>
          <h3
            style={{
              margin: 0,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.bold,
              color: brandCyan,
              marginBottom: spacing[1],
            }}
          >
            🎚️ {text.title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: typography.size.sm,
              color: colors.text.muted,
            }}
          >
            {text.subtitle}
          </p>
        </div>
        <StepIndicator current={1} total={2} isArabic={isArabic} />
      </div>

      {/* Volume control */}
      <div
        style={{
          padding: spacing[4],
          background: 'rgba(0,0,0,0.3)',
          borderRadius: radius.lg,
          border: `1px solid ${colors.border.subtle}`,
          marginBottom: spacing[4],
        }}
      >
        <p
          style={{
            margin: 0,
            marginBottom: spacing[4],
            fontSize: typography.size.sm,
            color: colors.text.secondary,
            textAlign: isArabic ? 'right' : 'left',
          }}
        >
          💡 {text.instruction}
        </p>

        <div style={{ marginBottom: spacing[4] }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing[2],
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: colors.text.muted,
                fontFamily: 'monospace',
                textTransform: 'uppercase',
              }}
            >
              {text.volumeLabel}
            </span>
            <span
              style={{
                fontSize: 12,
                color: brandCyan,
                fontFamily: 'monospace',
                fontWeight: 700,
              }}
            >
              {volume}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: brandCyan,
              height: 8,
              borderRadius: 4,
              cursor: 'pointer',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            gap: spacing[3],
            flexWrap: 'wrap',
            justifyContent: isArabic ? 'flex-end' : 'flex-start',
          }}
        >
          <LabButton onClick={playTestTone} disabled={isPlaying}>
            {isPlaying ? '🔊' : '▶︎'} {text.playBtn}
          </LabButton>
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          gap: spacing[3],
          justifyContent: 'flex-end',
          flexDirection: isArabic ? 'row-reverse' : 'row',
        }}
      >
        {onSkip && (
          <LabButton onClick={onSkip} variant="secondary">
            {text.skipBtn}
          </LabButton>
        )}
        <LabButton onClick={onConfirm}>
          ✓ {text.confirmBtn}
        </LabButton>
      </div>

      <style>{`
        @keyframes scanLineHorizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default function HeadphoneCheckPanel({
  onDone,
  onSkip,
}: {
  onDone: (res: HeadphoneCheckResult) => void;
  onSkip?: () => void;
}) {
  const { isArabic, t } = useLanguage();
  const audioRef = useRef<AudioContext | null>(null);
  const [phase, setPhase] = useState<'volume' | 'headphone'>('volume');

  const supported = useMemo(() => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const tmp = new AudioContextClass();
      const ok = typeof tmp.createStereoPanner === 'function';
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
  const [volumeConfirmed, setVolumeConfirmed] = useState(false);

  const text = isArabic
    ? {
        headphoneTitle: 'اختبار السماعات (يمين / يسار)',
        headphoneSubtitle: 'التأكد من أن الصوت يعمل عبر سماعات (ستسمع النغمة في أذن واحدة فقط)',
        playInstruction: 'اضغط "تشغيل" ثم اختر أين سمعت النغمة',
        speakerNote: 'إذا كنت على مكبر الصوت قد تسمع النغمة في المنتصف — هذا طبيعي',
        playBtn: 'تشغيل',
        leftBtn: 'اليسار',
        rightBtn: 'اليمين',
        currentScore: 'النتيجة الحالية',
        correctLabel: 'صحيحة',
        calibrationNote: 'هذا اختبار تهيئة لتحسين جودة الفحص — ليس جزءًا من التقييم',
        unsupportedTitle: 'تنبيه',
        unsupportedMsg: 'متصفحك لا يدعم اختبار "يمين/يسار" (Stereo Panning). يمكنك المتابعة، لكن يفضّل استخدام سماعات.',
        continueBtn: 'متابعة',
        closeBtn: 'إغلاق',
      }
    : {
        headphoneTitle: 'Headphone Check (Left / Right)',
        headphoneSubtitle: 'Verify headphones are working (you will hear the tone in one ear only)',
        playInstruction: 'Click "Play" then choose which side you heard the tone',
        speakerNote: 'If using speakers, you may hear the tone in the center — this is normal',
        playBtn: 'Play',
        leftBtn: 'Left',
        rightBtn: 'Right',
        currentScore: 'Current score',
        correctLabel: 'correct',
        calibrationNote: 'This is a calibration test to improve assessment quality — not part of the evaluation',
        unsupportedTitle: 'Notice',
        unsupportedMsg: 'Your browser does not support stereo panning tests. You can continue, but using headphones is recommended.',
        continueBtn: 'Continue',
        closeBtn: 'Close',
      };

  const playTrial = useCallback(async () => {
    if (!supported) return;
    setPlaying(true);
    const audio = ensureAudio(audioRef);
    try {
      await audio.resume();
    } catch {
      // ignore
    }

    const side = trials[step];
    setLastSide(side);

    // 600Hz tone, short
    playTone(audio, { freq: 600, duration: 0.35, volume: 0.22, pan: side });

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
      const passed = nextCorrect >= TOTAL - 1;
      onDone({ supported: true, passed, correct: nextCorrect, total: TOTAL, volumeConfirmed });
      return;
    }

    setStep(nextStep);
    setLastSide(null);
  };

  // Volume calibration phase
  if (phase === 'volume') {
    return (
      <VolumeCalibration
        onConfirm={() => {
          setVolumeConfirmed(true);
          setPhase('headphone');
        }}
        onSkip={onSkip}
        isArabic={isArabic}
      />
    );
  }

  // Unsupported browser
  if (!supported) {
    return (
      <div
        style={{
          padding: spacing[5],
          background: 'linear-gradient(135deg, rgba(26,31,46,0.95), rgba(13,17,23,0.95))',
          border: `1px solid ${brandPink}30`,
          borderRadius: radius.xl,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            marginBottom: spacing[3],
          }}
        >
          <span style={{ fontSize: 20 }}>⚠️</span>
          <span
            style={{
              fontWeight: 900,
              color: brandPink,
              fontSize: typography.size.lg,
            }}
          >
            {text.unsupportedTitle}
          </span>
        </div>
        <p
          style={{
            color: colors.text.secondary,
            marginBottom: spacing[4],
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          {text.unsupportedMsg}
        </p>
        <div style={{ display: 'flex', gap: spacing[3], flexWrap: 'wrap' }}>
          <LabButton
            onClick={() => onDone({ supported: false, passed: false, correct: 0, total: 0, volumeConfirmed })}
          >
            {text.continueBtn}
          </LabButton>
          {onSkip && (
            <LabButton onClick={onSkip} variant="secondary">
              {text.closeBtn}
            </LabButton>
          )}
        </div>
      </div>
    );
  }

  // Headphone check phase
  return (
    <div
      style={{
        padding: spacing[5],
        background: 'linear-gradient(135deg, rgba(26,31,46,0.95), rgba(13,17,23,0.95))',
        border: `1px solid ${brandPurple}20`,
        borderRadius: radius.xl,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Scan line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${brandPurple}60, transparent)`,
          animation: 'scanLineHorizontal 3s linear infinite',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexDirection: isArabic ? 'row-reverse' : 'row',
          marginBottom: spacing[4],
        }}
      >
        <div style={{ textAlign: isArabic ? 'right' : 'left' }}>
          <h3
            style={{
              margin: 0,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.bold,
              color: brandPurple,
              marginBottom: spacing[1],
            }}
          >
            🎧 {text.headphoneTitle}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: typography.size.sm,
              color: colors.text.muted,
            }}
          >
            {text.headphoneSubtitle}
          </p>
        </div>
        <StepIndicator current={2} total={2} isArabic={isArabic} />
      </div>

      {/* Test area */}
      <div
        style={{
          padding: spacing[4],
          background: 'rgba(0,0,0,0.3)',
          borderRadius: radius.lg,
          border: `1px solid ${colors.border.subtle}`,
          marginBottom: spacing[4],
        }}
      >
        <p
          style={{
            margin: 0,
            marginBottom: spacing[2],
            fontWeight: 700,
            color: colors.text.primary,
            textAlign: isArabic ? 'right' : 'left',
          }}
        >
          {text.playInstruction}
        </p>
        <p
          style={{
            margin: 0,
            marginBottom: spacing[4],
            fontSize: typography.size.sm,
            color: colors.text.muted,
            textAlign: isArabic ? 'right' : 'left',
          }}
        >
          💡 {text.speakerNote}
        </p>

        <div
          style={{
            display: 'flex',
            gap: spacing[3],
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: spacing[4],
          }}
        >
          <LabButton onClick={playTrial} disabled={playing}>
            {playing ? '🔊' : '▶︎'} {text.playBtn}
          </LabButton>
          <LabButton
            onClick={() => answer(-1)}
            disabled={lastSide === null || playing}
            variant="left"
          >
            ← {text.leftBtn}
          </LabButton>
          <LabButton
            onClick={() => answer(1)}
            disabled={lastSide === null || playing}
            variant="right"
          >
            {text.rightBtn} →
          </LabButton>
        </div>

        {/* Progress */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: `${spacing[2]}px ${spacing[3]}px`,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: radius.md,
          }}
        >
          <span
            style={{
              fontSize: typography.size.sm,
              color: colors.text.muted,
            }}
          >
            {text.currentScore}:
          </span>
          <span
            style={{
              fontSize: typography.size.sm,
              fontWeight: 700,
              color: brandCyan,
            }}
          >
            {correct}/{step} {text.correctLabel}
          </span>
        </div>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: typography.size.xs,
          color: colors.text.muted,
          textAlign: 'center',
          fontFamily: 'monospace',
        }}
      >
        ℹ️ {text.calibrationNote}
      </p>

      <style>{`
        @keyframes scanLineHorizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
