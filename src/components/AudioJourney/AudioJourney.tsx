import { useRef, useState, useEffect, useCallback } from 'react';
import { useGamification } from '../../context/GamificationContext';
import { useLanguage } from '../../context/LanguageContext';
import { styles, brandCyan, brandPurple, brandPink, brandPurpleDark, colors } from '../styles';
import LabButton from '../labui/LabButton';
import { renderLabIcon } from '../icons/index';

// Audio journey stages
const JOURNEY_STAGES = [
  {
    id: 'sound_wave',
    title: 'Sound Wave',
    titleAr: 'auto.AudioJourney.k1',
    description: 'Sound travels through the air as vibrations',
    descriptionAr: 'auto.AudioJourney.k2',
    icon: '🔊',
    color: brandCyan,
    frequency: 440, // A4 note
  },
  {
    id: 'ear_canal',
    title: 'Ear Canal',
    titleAr: 'auto.AudioJourney.k3',
    description: 'Vibrations enter the ear and travel through the canal',
    descriptionAr: 'auto.AudioJourney.k4',
    icon: '👂',
    color: brandPurple,
    frequency: 523.25, // C5
  },
  {
    id: 'cochlea',
    title: 'Cochlea',
    titleAr: 'auto.AudioJourney.k5',
    description: 'Hair cells convert vibrations to electrical signals',
    descriptionAr: 'auto.AudioJourney.k6',
    icon: '🐚',
    color: brandPink,
    frequency: 659.25, // E5
  },
  {
    id: 'auditory_nerve',
    title: 'Auditory Nerve',
    titleAr: 'auto.AudioJourney.k7',
    description: 'Signals travel along the auditory nerve to the brain',
    descriptionAr: 'auto.AudioJourney.k8',
    icon: '⚡',
    color: brandCyan,
    frequency: 783.99, // G5
  },
  {
    id: 'brain_processing',
    title: 'Brain Processing',
    titleAr: 'auto.AudioJourney.k9',
    description: 'The auditory cortex interprets the sound',
    descriptionAr: 'auto.AudioJourney.k10',
    icon: '🧠',
    color: brandPurple,
    frequency: 880, // A5
  },
];

interface WaveformVisualizerProps {
  active: boolean;
  color: string;
  frequency: number;
  width?: number;
  height?: number;
}

function WaveformVisualizer({ active, color, frequency, width = 300, height = 80 }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (!active) {
        // Draw flat line when inactive
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        return;
      }

      phaseRef.current += 0.05;

      // Draw waveform
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;

      const amplitude = height * 0.35;
      const wavelength = width / (frequency / 100);

      for (let x = 0; x < width; x++) {
        const normalizedFreq = frequency / 440;
        const y = height / 2 + amplitude * Math.sin((x / wavelength) * Math.PI * 2 + phaseRef.current * normalizedFreq);

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, color, frequency, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width,
        height,
        borderRadius: 12,
        background: 'rgba(0,0,0,0.3)',
        border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
        transition: 'border-color 0.3s ease',
      }}
    />
  );
}

interface AudioJourneyStageProps {
  stage: typeof JOURNEY_STAGES[number];
  index: number;
  active: boolean;
  completed: boolean;
  onActivate: () => void;
}

function AudioJourneyStage({ stage, index, active, completed, onActivate }: AudioJourneyStageProps) {
  const { isArabic, t } = useLanguage();
  const stageRef = useRef<HTMLDivElement>(null);
  const title = isArabic ? t(stage.titleAr, stage.title) : stage.title;
  const description = isArabic ? t(stage.descriptionAr, stage.description) : stage.description;

  return (
    <div
      ref={stageRef}
      onClick={onActivate}
      className="audio-stage"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: 24,
        background: active
          ? `linear-gradient(135deg, rgba(${stage.color === brandCyan ? '143,211,204' : stage.color === brandPurple ? '175,132,186' : '176,18,112'},0.15), transparent)`
          : 'rgba(11,15,28,0.5)',
        border: `2px solid ${active ? stage.color : completed ? 'rgba(143,211,204,0.3)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 20,
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: active ? 'scale(1.02)' : 'scale(1)',
        boxShadow: active ? `0 20px 60px rgba(${stage.color === brandCyan ? '143,211,204' : '175,132,186'},0.2)` : 'none',
        flexWrap: 'wrap',
      }}
    >
      {/* Stage number */}
      <div style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: completed ? `linear-gradient(135deg, ${brandCyan}, ${brandPurple})` : active ? stage.color : 'rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        fontWeight: 900,
        color: completed || active ? colors.text.primary : colors.text.muted,
        flexShrink: 0,
        transition: 'all 0.3s ease',
        boxShadow: active ? `0 0 30px ${stage.color}` : 'none',
      }}>
        {completed
          ? renderLabIcon('✓', { size: 18, tone: 'success' })
          : renderLabIcon(stage.icon, { size: 18, style: { color: stage.color } })}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{
            fontSize: 11,
            fontWeight: 800,
            color: stage.color,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            {isArabic ? `المرحلة ${index + 1}` : `Stage ${index + 1}`}
          </span>
          {completed && (
            <span style={{
              fontSize: 10,
              background: 'rgba(143,211,204,0.2)',
              color: brandCyan,
              padding: '2px 8px',
              borderRadius: 6,
              fontWeight: 800,
            }}>
              {isArabic ? 'مكتمل' : 'COMPLETED'}
            </span>
          )}
        </div>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: colors.text.primary }}>
          {title}
        </h3>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
          {description}
        </p>
      </div>

      {/* Waveform */}
      <div style={{ flexShrink: 0 }}>
        <WaveformVisualizer
          active={active}
          color={stage.color}
          frequency={stage.frequency}
          width={160}
          height={60}
        />
      </div>
    </div>
  );
}

export default function AudioJourney() {
  const { updateAudioJourneyProgress, state } = useGamification();
  const { isArabic, direction } = useLanguage();
  const [activeStage, setActiveStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<Set<number>>(new Set());
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;

      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch {
          // ignore
        }
        try {
          oscillatorRef.current.disconnect();
        } catch {
          // ignore
        }
        oscillatorRef.current = null;
      }

      if (gainRef.current) {
        try {
          gainRef.current.disconnect();
        } catch {
          // ignore
        }
        gainRef.current = null;
      }

      void audioContext?.close().catch(() => {});
    };
  }, [audioContext]);

  // Initialize audio context on first interaction
  const initAudio = useCallback((): AudioContext | null => {
    if (!audioContext || audioContext.state === 'closed') {
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        setAudioContext(ctx);
        return ctx;
      } catch {
        return null;
      }
    }
    return audioContext;
  }, [audioContext]);

  // Play stage sound
  const playStageSound = useCallback(async (frequency: number) => {
    const ctx = initAudio();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // ignore resume failures
      }
    }

    // Stop previous sound
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch {
        // Already stopped
      }
      try {
        oscillatorRef.current.disconnect();
      } catch {
        // ignore
      }
      oscillatorRef.current = null;
    }
    if (gainRef.current) {
      try {
        gainRef.current.disconnect();
      } catch {
        // ignore
      }
      gainRef.current = null;
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 1.5);

    oscillatorRef.current = oscillator;
    gainRef.current = gain;

    oscillator.onended = () => {
      try {
        oscillator.disconnect();
      } catch {
        // ignore
      }
      try {
        gain.disconnect();
      } catch {
        // ignore
      }
      if (oscillatorRef.current === oscillator) oscillatorRef.current = null;
      if (gainRef.current === gain) gainRef.current = null;
    };
  }, [initAudio]);

  const handleStageActivate = useCallback((index: number) => {
    setActiveStage(index);
    playStageSound(JOURNEY_STAGES[index].frequency);

    // Mark as completed
    setCompletedStages(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });

    // Update progress
    const progress = ((index + 1) / JOURNEY_STAGES.length) * 100;
    updateAudioJourneyProgress(progress);
  }, [playStageSound, updateAudioJourneyProgress]);

  // Auto-advance through stages
  const [isPlaying, setIsPlaying] = useState(false);

  const playAllStages = useCallback(() => {
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    advanceTimeoutRef.current = null;
    setIsPlaying(true);
    let currentIndex = 0;

    const playNext = () => {
      if (currentIndex >= JOURNEY_STAGES.length) {
        setIsPlaying(false);
        advanceTimeoutRef.current = null;
        return;
      }

      handleStageActivate(currentIndex);
      currentIndex++;
      advanceTimeoutRef.current = setTimeout(playNext, 2000);
    };

    playNext();
  }, [handleStageActivate]);

  return (
    <section id="audio-journey" style={styles.sectionCard} ref={containerRef} dir={direction}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {renderLabIcon('🎧', { size: 18, tone: 'cyan' })}
              <span>{isArabic ? 'رحلة الصوت التفاعلية' : 'Interactive Sound Journey'}</span>
            </span>
          </h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{
              ...styles.chip,
              background: 'rgba(143,211,204,0.12)',
              borderColor: 'rgba(143,211,204,0.25)',
            }}>
              {isArabic
                ? `${completedStages.size}/${JOURNEY_STAGES.length} مراحل`
                : `${completedStages.size}/${JOURNEY_STAGES.length} stages`}
            </span>
          </div>
        </div>
        <p style={styles.lead}>
          {isArabic
            ? 'اكتشف كيف ينتقل الصوت من الهواء إلى دماغك. انقر على كل مرحلة لسماع الصوت ومشاهدة الموجة.'
            : 'Explore how sound travels from the air to your brain. Click each stage to hear a tone and see its waveform.'}
        </p>

        {/* Play All Button */}
        <LabButton
          variant="primary"
          onClick={playAllStages}
          disabled={isPlaying}
          style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {isPlaying ? (
            <>
              <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
              {isArabic ? 'جارٍ التشغيل...' : 'Playing…'}
            </>
          ) : (
            <>
              <span>▶</span>
              {isArabic ? 'تشغيل الرحلة الكاملة' : 'Play full journey'}
            </>
          )}
        </LabButton>
      </div>

      {/* Journey Progress Bar */}
      <div style={{
        marginTop: 24,
        marginBottom: 24,
        height: 8,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${(completedStages.size / JOURNEY_STAGES.length) * 100}%`,
          background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple}, ${brandPink})`,
          borderRadius: 4,
          transition: 'width 0.5s ease',
        }} />

        {/* Stage markers */}
        {JOURNEY_STAGES.map((_, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: '50%',
              left: `${((index + 0.5) / JOURNEY_STAGES.length) * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: completedStages.has(index) ? 16 : 10,
              height: completedStages.has(index) ? 16 : 10,
              borderRadius: '50%',
              background: completedStages.has(index) ? brandCyan : 'rgba(255,255,255,0.3)',
              border: activeStage === index ? `2px solid ${brandPink}` : 'none',
              transition: 'all 0.3s ease',
              boxShadow: activeStage === index ? `0 0 15px ${brandPink}` : 'none',
            }}
          />
        ))}
      </div>

      {/* Journey Stages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {JOURNEY_STAGES.map((stage, index) => (
          <AudioJourneyStage
            key={stage.id}
            stage={stage}
            index={index}
            active={activeStage === index}
            completed={completedStages.has(index)}
            onActivate={() => handleStageActivate(index)}
          />
        ))}
      </div>

      {/* Completion message */}
      {completedStages.size === JOURNEY_STAGES.length && (
        <div style={{
          marginTop: 24,
          padding: 20,
          background: `linear-gradient(135deg, rgba(143,211,204,0.15), rgba(175,132,186,0.15))`,
          border: `2px solid ${brandCyan}`,
          borderRadius: 16,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>
            {renderLabIcon('🎉', { size: 40, tone: 'pink' })}
          </div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: brandCyan }}>
            {isArabic ? 'أحسنت! أكملت رحلة الصوت' : 'Nice! You completed the sound journey'}
          </h3>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
            {isArabic ? 'الآن أنت تفهم كيف يعالج الدماغ الأصوات' : 'Now you understand how the brain processes sound'}
          </p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .audio-stage {
            flex-direction: column !important;
            text-align: center !important;
            gap: 16px !important;
            padding: 16px !important;
          }
          .audio-stage > div:first-child {
            margin: 0 auto;
          }
          .audio-stage > div:nth-child(2) {
            order: -1;
          }
          .audio-stage canvas {
            width: 100% !important;
            max-width: 200px !important;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
