import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getAudioContext } from '../utils/audio';
import {
  brandCyan,
  brandPink,
  brandPurple,
  brandPurpleDark,
  styles,
  audioColors,
  soundLabStyles,
  labTech,
  labTechStyles,
} from './styles';

interface FrequencyBand {
  id: string;
  label: string;
  labelEn: string;
  minHz: number;
  maxHz: number;
  color: string;
  description: string;
  descriptionEn: string;
  affected: string[];
  affectedEn: string[];
}

const frequencyBands: FrequencyBand[] = [
  {
    id: 'low',
    label: 'الترددات المنخفضة',
    labelEn: 'Low Frequencies',
    minHz: 20,
    maxHz: 250,
    color: brandPurpleDark,
    description: 'مسؤولة عن إدراك الأصوات العميقة والإيقاع',
    descriptionEn: 'Deep tones (20–250 Hz) associated with rhythm, grounding, and regulation.',
    affected: ['التوازن', 'الإيقاع', 'الحركة'],
    affectedEn: ['Balance', 'Rhythm', 'Movement'],
  },
  {
    id: 'mid-low',
    label: 'الترددات المتوسطة المنخفضة',
    labelEn: 'Mid-Low Frequencies',
    minHz: 250,
    maxHz: 1000,
    color: brandPurple,
    description: 'أساسية لفهم نغمات الكلام الأساسية',
    descriptionEn: 'Foundational speech tones (250–1000 Hz) that support listening and early speech cues.',
    affected: ['الكلام', 'التواصل', 'الاستماع'],
    affectedEn: ['Speech', 'Communication', 'Listening'],
  },
  {
    id: 'mid',
    label: 'الترددات المتوسطة',
    labelEn: 'Mid Frequencies',
    minHz: 1000,
    maxHz: 3000,
    color: brandCyan,
    description: 'منطقة الكلام الرئيسية - أهم ترددات اللغة',
    descriptionEn: 'Primary speech intelligibility band (1–3 kHz) important for language clarity.',
    affected: ['فهم الكلام', 'التعلم', 'القراءة'],
    affectedEn: ['Speech understanding', 'Learning', 'Reading'],
  },
  {
    id: 'mid-high',
    label: 'الترددات المتوسطة العالية',
    labelEn: 'Mid-High Frequencies',
    minHz: 3000,
    maxHz: 8000,
    color: '#22c55e',
    description: 'مهمة للتمييز بين الأصوات المتشابهة',
    descriptionEn: 'Fine-detail band (3–8 kHz) supporting discrimination between similar sounds.',
    affected: ['الوضوح', 'التمييز', 'الانتباه'],
    affectedEn: ['Clarity', 'Discrimination', 'Attention'],
  },
  {
    id: 'high',
    label: 'الترددات العالية',
    labelEn: 'High Frequencies',
    minHz: 8000,
    maxHz: 20000,
    color: brandPink,
    description: 'تضيف الحيوية والوضوح للأصوات',
    descriptionEn: 'High-detail band (8–20 kHz) that adds brightness and crispness to sound.',
    affected: ['الطاقة', 'اليقظة', 'التركيز'],
    affectedEn: ['Energy', 'Alertness', 'Focus'],
  },
];

const presets = [
  { id: 'normal', labelAr: 'سمع طبيعي', labelEn: 'Normal Profile', levels: [0.8, 0.85, 0.9, 0.85, 0.8] },
  { id: 'hypersensitive', labelAr: 'فرط الحساسية', labelEn: 'Hypersensitive Profile', levels: [0.95, 1.0, 0.95, 0.9, 0.95] },
  { id: 'hyposensitive', labelAr: 'نقص الحساسية', labelEn: 'Hyposensitive Profile', levels: [0.4, 0.5, 0.6, 0.5, 0.4] },
  { id: 'mixed', labelAr: 'مختلط', labelEn: 'Mixed Profile', levels: [0.5, 0.9, 0.4, 0.95, 0.6] },
];

type SpectrumAudio = {
  ctx: AudioContext;
  master: GainNode;
  compressor: DynamicsCompressorNode;
  bandGains: GainNode[];
  oscillators: OscillatorNode[];
};

const MASTER_GAIN_TARGET = 0.18;
const BAND_MAX_GAINS = [0.08, 0.07, 0.06, 0.05, 0.04] as const;

const getBandCenterHz = (band: FrequencyBand): number => Math.sqrt(band.minHz * band.maxHz);

export default function AudioSpectrumDemo() {
  const { isArabic, direction } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioStarting, setIsAudioStarting] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState('normal');
  const [levels, setLevels] = useState<number[]>([0.8, 0.85, 0.9, 0.85, 0.8]);
  const [hoveredBand, setHoveredBand] = useState<string | null>(null);
  const [animatedLevels, setAnimatedLevels] = useState<number[]>([0, 0, 0, 0, 0]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const spectrumAudioRef = useRef<SpectrumAudio | null>(null);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate levels on visibility
  useEffect(() => {
    if (!isVisible) return;

    let frame = 0;
    const targetLevels = levels;
    const animate = () => {
      frame++;
      if (frame <= 60) {
        const progress = frame / 60;
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedLevels(targetLevels.map(level => level * eased));
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animate();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible, levels]);

  // Apply preset
  const applyPreset = useCallback((presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(presetId);
      setLevels(preset.levels);
    }
  }, []);

  const applyLevelsToAudio = useCallback((audio: SpectrumAudio, nextLevels: number[]) => {
    const now = audio.ctx.currentTime;
    for (let i = 0; i < audio.bandGains.length; i++) {
      const level = Math.max(0, Math.min(1, nextLevels[i] ?? 0));
      const maxGain = BAND_MAX_GAINS[i] ?? BAND_MAX_GAINS[BAND_MAX_GAINS.length - 1];
      const target = Math.max(0.0001, level * maxGain);
      const gain = audio.bandGains[i];
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(target, now, 0.06);
    }
  }, []);

  const stopSpectrumAudio = useCallback(() => {
    const audio = spectrumAudioRef.current;
    if (!audio) return;

    const now = audio.ctx.currentTime;
    audio.master.gain.cancelScheduledValues(now);
    audio.master.gain.setTargetAtTime(0.0001, now, 0.04);

    for (const g of audio.bandGains) {
      g.gain.cancelScheduledValues(now);
      g.gain.setTargetAtTime(0.0001, now, 0.04);
    }

    const stopAt = now + 0.12;
    for (const osc of audio.oscillators) {
      try {
        osc.stop(stopAt);
      } catch {
        // ignore
      }
    }

    setTimeout(() => {
      try {
        audio.master.disconnect();
      } catch {
        // ignore
      }
      try {
        audio.compressor.disconnect();
      } catch {
        // ignore
      }
      for (const g of audio.bandGains) {
        try {
          g.disconnect();
        } catch {
          // ignore
        }
      }
      for (const osc of audio.oscillators) {
        try {
          osc.disconnect();
        } catch {
          // ignore
        }
      }
    }, 250);

    spectrumAudioRef.current = null;
  }, []);

  const startSpectrumAudio = useCallback(async (levelsSnapshot: number[]): Promise<boolean> => {
    const ctx = await getAudioContext();
    if (!ctx) return false;

    // Context can be suspended on some browsers until the first user gesture.
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        return false;
      }
    }

    if (spectrumAudioRef.current && spectrumAudioRef.current.ctx !== ctx) {
      stopSpectrumAudio();
    }

    if (!spectrumAudioRef.current) {
      const master = ctx.createGain();
      master.gain.value = 0.0001;

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -20;
      compressor.knee.value = 24;
      compressor.ratio.value = 6;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;

      master.connect(compressor);
      compressor.connect(ctx.destination);

      const bandGains: GainNode[] = [];
      const oscillators: OscillatorNode[] = [];

      for (const band of frequencyBands) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = getBandCenterHz(band);

        const gain = ctx.createGain();
        gain.gain.value = 0.0001;

        osc.connect(gain);
        gain.connect(master);
        osc.start();

        bandGains.push(gain);
        oscillators.push(osc);
      }

      spectrumAudioRef.current = { ctx, master, compressor, bandGains, oscillators };
    }

    const audio = spectrumAudioRef.current;
    if (!audio) return false;

    const now = audio.ctx.currentTime;
    audio.master.gain.cancelScheduledValues(now);
    audio.master.gain.setTargetAtTime(MASTER_GAIN_TARGET, now, 0.06);
    applyLevelsToAudio(audio, levelsSnapshot);
    return true;
  }, [applyLevelsToAudio, stopSpectrumAudio]);

  const handleToggleAudio = useCallback(() => {
    void (async () => {
      if (isAudioStarting) return;
      if (isPlaying) {
        stopSpectrumAudio();
        setIsPlaying(false);
        return;
      }

      setAudioError(null);
      setIsAudioStarting(true);
      const ok = await startSpectrumAudio(levels);
      setIsAudioStarting(false);

      if (ok) {
        setIsPlaying(true);
        return;
      }

      setAudioError(isArabic
        ? 'تعذر تشغيل الصوت. تحقق من مستوى الصوت وإعدادات المتصفح.'
        : 'Audio unavailable. Check device volume and browser settings.');
    })();
  }, [isArabic, isAudioStarting, isPlaying, levels, startSpectrumAudio, stopSpectrumAudio]);

  useEffect(() => {
    const audio = spectrumAudioRef.current;
    if (!audio) return;
    applyLevelsToAudio(audio, levels);
  }, [applyLevelsToAudio, levels]);

  useEffect(() => {
    return () => {
      stopSpectrumAudio();
    };
  }, [stopSpectrumAudio]);

  // Canvas spectrum visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;
    const draw = () => {
      frameCount++;
      const width = canvas.width;
      const height = canvas.height;

      // Clear
      ctx.fillStyle = 'rgba(11,15,28,0.95)';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const x = (width / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let i = 0; i <= 5; i++) {
        const y = (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw frequency bands
      const bandWidth = width / frequencyBands.length;
      frequencyBands.forEach((band, index) => {
        const x = index * bandWidth;
        const level = animatedLevels[index] || 0;
        const barHeight = level * height * 0.8;

        // Animated variation
        const variation = isPlaying
          ? Math.sin(frameCount * 0.1 + index) * 10 + Math.random() * 5
          : 0;
        const finalHeight = Math.max(0, barHeight + variation);

        // Gradient fill
        const gradient = ctx.createLinearGradient(x, height, x, height - finalHeight);
        gradient.addColorStop(0, `${band.color}22`);
        gradient.addColorStop(0.5, `${band.color}88`);
        gradient.addColorStop(1, band.color);

        ctx.fillStyle = gradient;
        ctx.fillRect(x + 4, height - finalHeight, bandWidth - 8, finalHeight);

        // Glow effect
        if (hoveredBand === band.id) {
          ctx.shadowColor = band.color;
          ctx.shadowBlur = 20;
          ctx.fillRect(x + 4, height - finalHeight, bandWidth - 8, finalHeight);
          ctx.shadowBlur = 0;
        }

        // Peak indicator
        ctx.fillStyle = band.color;
        ctx.fillRect(x + 4, height - finalHeight - 4, bandWidth - 8, 3);
      });

      // Draw frequency labels
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      frequencyBands.forEach((band, index) => {
        const x = index * bandWidth + bandWidth / 2;
        ctx.fillText(`${band.minHz}Hz`, x, height - 5);
      });

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animatedLevels, isPlaying, hoveredBand]);

  const css = `
    @keyframes spectrumEnter {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes soundWave {
      0% { transform: scaleY(0.3); }
      50% { transform: scaleY(1); }
      100% { transform: scaleY(0.3); }
    }
    @keyframes hudPulse {
      0%, 100% { opacity: 0.5; box-shadow: 0 0 4px ${brandCyan}; }
      50% { opacity: 1; box-shadow: 0 0 10px ${brandCyan}; }
    }
    @keyframes scanLine {
      0% { left: -20%; opacity: 0; }
      10% { opacity: 0.6; }
      90% { opacity: 0.6; }
      100% { left: 120%; opacity: 0; }
    }
    @keyframes dataStream {
      0% { transform: translateY(100%); opacity: 0; }
      10% { opacity: 0.6; }
      90% { opacity: 0.6; }
      100% { transform: translateY(-100%); opacity: 0; }
    }
    @keyframes frequencyPulse {
      0%, 100% { opacity: 0.8; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.02); }
    }
    .hud-corner {
      position: absolute;
      width: 14px;
      height: 14px;
      border-color: ${brandCyan};
      border-style: solid;
      animation: hudPulse 3s ease-in-out infinite;
    }
    .spectrum-scan-line {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 80px;
      background: linear-gradient(90deg, transparent, ${brandCyan}30, transparent);
      animation: scanLine 3s linear infinite;
      pointer-events: none;
    }
    .data-particle {
      position: absolute;
      width: 2px;
      height: 8px;
      background: ${audioColors.mid};
      opacity: 0.5;
      animation: dataStream 2.5s linear infinite;
    }
    @media (max-width: 900px) {
      .spectrum-grid {
        grid-template-columns: 1fr !important;
      }
      .spectrum-bands-grid {
        grid-template-columns: repeat(3, 1fr) !important;
      }
    }
    @media (max-width: 600px) {
      .spectrum-bands-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
  `;

  return (
    <section ref={sectionRef} id="spectrum" dir={direction} style={{
      ...styles.sectionCard,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{css}</style>

      {/* HUD Corner Brackets */}
      <div className="hud-corner" style={{ top: 8, left: 8, borderWidth: '2px 0 0 2px' }} />
      <div className="hud-corner" style={{ top: 8, right: 8, borderWidth: '2px 2px 0 0' }} />
      <div className="hud-corner" style={{ bottom: 8, left: 8, borderWidth: '0 0 2px 2px' }} />
      <div className="hud-corner" style={{ bottom: 8, right: 8, borderWidth: '0 2px 2px 0' }} />

      {/* Scan Line Effect */}
      <div className="spectrum-scan-line" />

      {/* Data Stream Particles */}
      <div className="data-particle" style={{ right: '10%', animationDelay: '0s' }} />
      <div className="data-particle" style={{ right: '25%', animationDelay: '0.8s' }} />
      <div className="data-particle" style={{ right: '40%', animationDelay: '1.6s' }} />

      {/* Header with Lab Tech Styling */}
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${brandCyan}22, ${brandPurple}22)`,
              border: `1px solid ${brandCyan}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              boxShadow: `0 0 20px ${brandCyan}15`,
            }}>
              🎛️
            </div>
            <div>
              <h2 style={{ ...styles.h2, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                {isArabic ? 'محلل الطيف الصوتي' : 'Audio Spectrum Analyzer'}
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: isPlaying ? audioColors.active : audioColors.inactive,
                  boxShadow: isPlaying ? `0 0 8px ${audioColors.active}` : 'none',
                }} />
              </h2>
              <div style={{
                fontSize: 10,
                fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: 1,
                marginTop: 4,
              }}>
                LOTUS SOUND LAB // FREQUENCY ANALYSIS MODULE
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              ...styles.chip,
              background: `linear-gradient(135deg, ${audioColors.mid}20, ${brandPurple}20)`,
              borderColor: `${audioColors.mid}40`,
            }}>
              <span style={{ color: audioColors.mid, fontWeight: 700 }}>BÉRARD AIT</span>
            </span>
            <span style={{
              padding: '6px 12px',
              background: isPlaying ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isPlaying ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 8,
              fontSize: 10,
              fontWeight: 700,
              color: isPlaying ? '#22c55e' : 'rgba(255,255,255,0.5)',
              fontFamily: 'monospace',
              letterSpacing: 0.5,
            }}>
              {isPlaying ? '● ACTIVE' : '○ STANDBY'}
            </span>
          </div>
        </div>
        <p style={{ ...styles.bodyText, marginTop: 8 }}>
          {isArabic
            ? 'استكشف كيف يعالج Berard AIT مختلف نطاقات الترددات لتحسين المعالجة السمعية'
            : 'Explore how Berard AIT works across frequency bands to support auditory processing.'}
        </p>
        {audioError ? (
          <div
            style={{
              marginTop: 10,
              padding: '10px 12px',
              borderRadius: 12,
              border: '1px solid rgba(239,68,68,0.35)',
              background: 'rgba(239,68,68,0.10)',
              color: '#fecaca',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {audioError}
          </div>
        ) : null}
      </div>

      {/* Main Content */}
      <div className="spectrum-grid" style={{
        marginTop: 24,
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: 20,
      }}>
        {/* Spectrum Visualizer */}
        <div style={{
          background: labTech.backgrounds.card,
          borderRadius: 20,
          border: `1px solid ${labTech.borders.default}`,
          overflow: 'hidden',
          animation: isVisible ? 'spectrumEnter 0.6s ease-out' : 'none',
          position: 'relative',
          boxShadow: `0 0 40px ${brandCyan}10`,
        }}>
          {/* Top glow bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${audioColors.low}, ${audioColors.mid}, ${audioColors.high}, transparent)`,
            opacity: 0.7,
          }} />
          {/* Canvas Header - Lab Monitor Style */}
          <div style={{
            padding: '14px 18px',
            borderBottom: `1px solid ${labTech.borders.subtle}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${audioColors.mid}22, ${brandPurple}22)`,
                border: `1px solid ${audioColors.mid}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}>
                📊
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: isPlaying ? audioColors.active : audioColors.inactive,
                    boxShadow: isPlaying ? `0 0 10px ${audioColors.active}` : 'none',
                    animation: isPlaying ? 'pulse 1s ease-in-out infinite' : 'none',
                  }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: isPlaying ? audioColors.active : 'rgba(255,255,255,0.6)' }}>
                    {isPlaying ? 'ANALYZING' : 'STANDBY'}
                  </span>
                </div>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: 0.5 }}>
                  BÉRARD AIT FREQUENCY SPECTRUM
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Frequency Range Indicator */}
              <div style={{
                display: 'flex',
                gap: 3,
                padding: '6px 10px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 6,
                border: `1px solid ${labTech.borders.subtle}`,
              }}>
                {[audioColors.low, audioColors.lowMid, audioColors.mid, audioColors.midHigh, audioColors.high].map((color, i) => (
                  <div key={i} style={{
                    width: 4,
                    height: isPlaying ? 12 + Math.sin(Date.now() / 200 + i) * 4 : 8,
                    background: color,
                    borderRadius: 2,
                    transition: 'height 0.1s ease',
                  }} />
                ))}
              </div>
              <button
                onClick={handleToggleAudio}
                disabled={isAudioStarting}
                style={{
                  padding: '8px 16px',
                  background: isPlaying
                    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                    : `linear-gradient(135deg, ${audioColors.mid}, ${brandPurple})`,
                  border: 'none',
                  borderRadius: 10,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: isAudioStarting ? 'not-allowed' : 'pointer',
                  opacity: isAudioStarting ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: isPlaying ? '0 0 15px rgba(239,68,68,0.3)' : `0 0 15px ${audioColors.mid}30`,
                  transition: 'all 0.3s ease',
                }}
              >
                <span style={{ fontSize: 14 }}>{isPlaying ? '⏹' : '▶'}</span>
                {isAudioStarting
                  ? (isArabic ? 'تشغيل...' : 'Starting…')
                  : isPlaying
                    ? (isArabic ? 'إيقاف' : 'Stop')
                    : (isArabic ? 'تشغيل' : 'Play')}
              </button>
            </div>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={600}
            height={250}
            style={{ width: '100%', height: 250, display: 'block' }}
          />

          {/* Band Labels */}
          <div style={{
            display: 'flex',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}>
            {frequencyBands.map((band, index) => (
              <div
                key={band.id}
                onMouseEnter={() => setHoveredBand(band.id)}
                onMouseLeave={() => setHoveredBand(null)}
                style={{
                  flex: 1,
                  padding: '10px 6px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: hoveredBand === band.id ? `${band.color}15` : 'transparent',
                  borderLeft: index > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{
                  fontSize: 18,
                  marginBottom: 4,
                }}>
                  {/* Sound wave indicator */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    height: 20,
                  }}>
                    {[0.3, 0.6, 1, 0.6, 0.3].map((h, i) => (
                      <div
                        key={i}
                        style={{
                          width: 3,
                          height: `${h * 100}%`,
                          background: band.color,
                          borderRadius: 2,
                          animation: isPlaying ? `soundWave ${0.3 + i * 0.1}s ease-in-out infinite ${i * 0.1}s` : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{
                  fontSize: 10,
                  color: band.color,
                  fontWeight: 700,
                }}>
                  {band.labelEn.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls Panel */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {/* Presets */}
          <div style={{
            padding: 16,
            background: 'rgba(15,22,41,0.8)',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.1)',
            animation: isVisible ? 'spectrumEnter 0.6s ease-out 0.1s backwards' : 'none',
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: 800,
              color: brandCyan,
              marginBottom: 12,
            }}>
              {isArabic ? '🎚️ أنماط السمع' : '🎚️ Hearing Profiles'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  style={{
                    padding: '10px 14px',
                    background: selectedPreset === preset.id
                      ? `linear-gradient(135deg, ${brandCyan}33, ${brandPurple}33)`
                      : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${selectedPreset === preset.id ? brandCyan : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 10,
                    color: selectedPreset === preset.id ? brandCyan : 'rgba(255,255,255,0.7)',
                    fontSize: 13,
                    fontWeight: selectedPreset === preset.id ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: isArabic ? 'right' : 'left',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isArabic ? preset.labelAr : preset.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Band Info */}
          {hoveredBand && (
            <div style={{
              padding: 16,
              background: `linear-gradient(135deg, ${frequencyBands.find(b => b.id === hoveredBand)?.color}15, rgba(15,22,41,0.95))`,
              borderRadius: 16,
              border: `1px solid ${frequencyBands.find(b => b.id === hoveredBand)?.color}44`,
              animation: 'spectrumEnter 0.3s ease-out',
            }}>
              {(() => {
                const band = frequencyBands.find(b => b.id === hoveredBand);
                if (!band) return null;
                return (
                  <>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: band.color,
                      marginBottom: 8,
                    }}>
                      {isArabic ? band.label : band.labelEn}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.6)',
                      marginBottom: 8,
                    }}>
                      {band.minHz} - {band.maxHz} Hz
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: 1.6,
                      marginBottom: 10,
                    }}>
                      {isArabic ? band.description : band.descriptionEn}
                    </div>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                    }}>
                      {(isArabic ? band.affected : band.affectedEn).map((item) => (
                        <span key={item} style={{
                          padding: '4px 10px',
                          background: `${band.color}22`,
                          border: `1px solid ${band.color}44`,
                          borderRadius: 6,
                          fontSize: 10,
                          color: band.color,
                        }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Info Card */}
          <div style={{
            padding: 16,
            background: 'rgba(15,22,41,0.8)',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.1)',
            animation: isVisible ? 'spectrumEnter 0.6s ease-out 0.2s backwards' : 'none',
          }}>
            <div style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.7,
            }}>
              <strong style={{ color: brandCyan }}>
                {isArabic ? 'كيف يعمل Berard AIT:' : 'How Berard AIT Works:'}
              </strong>
              <br />
              {isArabic
                ? 'يقوم بتعديل الترددات المحددة بناءً على اختبار السمع الفردي لتحسين المعالجة السمعية في الدماغ.'
                : 'It adapts specific frequency bands based on an individual listening profile to support auditory processing.'}
            </div>
          </div>
        </div>
      </div>

      {/* Frequency Band Details */}
      <div className="spectrum-bands-grid" style={{
        marginTop: 24,
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 12,
      }}>
        {frequencyBands.map((band, index) => (
          <div
            key={band.id}
            style={{
              padding: 14,
              background: hoveredBand === band.id
                ? `linear-gradient(135deg, ${band.color}22, ${band.color}11)`
                : 'rgba(15,22,41,0.6)',
              borderRadius: 14,
              border: `1px solid ${hoveredBand === band.id ? band.color : 'rgba(255,255,255,0.08)'}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              animation: isVisible ? `spectrumEnter 0.5s ease-out ${0.3 + index * 0.1}s backwards` : 'none',
            }}
            onMouseEnter={() => setHoveredBand(band.id)}
            onMouseLeave={() => setHoveredBand(null)}
          >
            {/* Level indicator */}
            <div style={{
              height: 4,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              marginBottom: 10,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${(animatedLevels[index] || 0) * 100}%`,
                background: band.color,
                borderRadius: 2,
                transition: 'width 0.3s ease',
              }} />
            </div>

            <div style={{
              fontSize: 11,
              color: band.color,
              fontWeight: 700,
              marginBottom: 4,
            }}>
              {band.minHz}-{band.maxHz}Hz
            </div>
            <div style={{
              fontSize: 20,
              fontWeight: 900,
              color: '#fff',
              fontFamily: 'monospace',
            }}>
              {Math.round((animatedLevels[index] || 0) * 100)}%
            </div>
          </div>
        ))}
      </div>

      {/* System Status Footer */}
      <div style={{
        marginTop: 24,
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
        border: `1px solid ${labTech.borders.subtle}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            fontSize: 9,
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: 1,
          }}>
            LOTUS SOUND LAB // SPECTRUM ANALYZER v2.0
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: audioColors.active,
              boxShadow: `0 0 6px ${audioColors.active}`,
            }} />
            <span style={{
              fontSize: 9,
              fontFamily: 'monospace',
              color: audioColors.active,
              letterSpacing: 0.5,
            }}>
              SYSTEM READY
            </span>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          {/* Frequency Range Display */}
          <span style={{
            fontSize: 9,
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: 0.5,
          }}>
            20Hz — 20kHz
          </span>
          {/* Color legend */}
          <div style={{ display: 'flex', gap: 3 }}>
            {[audioColors.low, audioColors.lowMid, audioColors.mid, audioColors.midHigh, audioColors.high].map((color, i) => (
              <div key={i} style={{
                width: 16,
                height: 4,
                borderRadius: 2,
                background: color,
                opacity: 0.7,
              }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
