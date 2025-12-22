/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - Sound Lab Simulation
 * Interactive frequency visualization and audio processing simulation
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  brand,
  gradients,
  shadows,
  spacing,
  radius,
  typography,
  transitions,
  cards,
  buttons,
} from '../styles';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface FrequencyBand {
  id: string;
  label: string;
  labelAr: string;
  minHz: number;
  maxHz: number;
  centerHz: number;
  color: string;
  attenuation: number; // -20 to +10 dB
  description: string;
  descriptionAr: string;
}

interface AudioProfile {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  bands: Record<string, number>;
  icon: string;
}

interface SoundLabSimulationProps {
  onProfileChange?: (profile: AudioProfile) => void;
  readOnly?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const frequencyBands: FrequencyBand[] = [
  {
    id: 'sub_bass',
    label: 'Sub-Bass',
    labelAr: 'تحت الجهير',
    minHz: 20,
    maxHz: 60,
    centerHz: 40,
    color: '#FF6B6B',
    attenuation: 0,
    description: 'Lowest frequencies, felt more than heard',
    descriptionAr: 'أدنى الترددات، يتم الشعور بها أكثر من سماعها',
  },
  {
    id: 'bass',
    label: 'Bass',
    labelAr: 'الجهير',
    minHz: 60,
    maxHz: 250,
    centerHz: 125,
    color: '#FF8E53',
    attenuation: 0,
    description: 'Low frequencies, drums and bass instruments',
    descriptionAr: 'الترددات المنخفضة، الطبول وآلات الباس',
  },
  {
    id: 'low_mid',
    label: 'Low-Mid',
    labelAr: 'منخفض-متوسط',
    minHz: 250,
    maxHz: 500,
    centerHz: 350,
    color: '#FECA57',
    attenuation: 0,
    description: 'Body of most instruments and voices',
    descriptionAr: 'جسم معظم الآلات والأصوات',
  },
  {
    id: 'mid',
    label: 'Mid',
    labelAr: 'المتوسط',
    minHz: 500,
    maxHz: 2000,
    centerHz: 1000,
    color: '#48DBFB',
    attenuation: 0,
    description: 'Critical speech frequencies',
    descriptionAr: 'ترددات الكلام الحرجة',
  },
  {
    id: 'high_mid',
    label: 'High-Mid',
    labelAr: 'عالي-متوسط',
    minHz: 2000,
    maxHz: 4000,
    centerHz: 3000,
    color: '#1DD1A1',
    attenuation: 0,
    description: 'Presence and clarity of speech',
    descriptionAr: 'وضوح وحضور الكلام',
  },
  {
    id: 'presence',
    label: 'Presence',
    labelAr: 'الحضور',
    minHz: 4000,
    maxHz: 6000,
    centerHz: 5000,
    color: '#5F27CD',
    attenuation: 0,
    description: 'Consonants and sibilance',
    descriptionAr: 'الحروف الساكنة والصفير',
  },
  {
    id: 'brilliance',
    label: 'Brilliance',
    labelAr: 'اللمعان',
    minHz: 6000,
    maxHz: 12000,
    centerHz: 8000,
    color: '#A55EEA',
    attenuation: 0,
    description: 'Air and sparkle, cymbals',
    descriptionAr: 'الهواء واللمعان، الصنوج',
  },
  {
    id: 'air',
    label: 'Air',
    labelAr: 'الهواء',
    minHz: 12000,
    maxHz: 20000,
    centerHz: 16000,
    color: '#D980FA',
    attenuation: 0,
    description: 'Highest audible frequencies',
    descriptionAr: 'أعلى الترددات المسموعة',
  },
];

const presetProfiles: AudioProfile[] = [
  {
    id: 'flat',
    name: 'Flat Response',
    nameAr: 'استجابة مسطحة',
    description: 'No filtering applied - baseline',
    descriptionAr: 'بدون تصفية - خط الأساس',
    bands: { sub_bass: 0, bass: 0, low_mid: 0, mid: 0, high_mid: 0, presence: 0, brilliance: 0, air: 0 },
    icon: '➖',
  },
  {
    id: 'hypersensitivity',
    name: 'Hypersensitivity Protocol',
    nameAr: 'بروتوكول فرط الحساسية',
    description: 'Reduces peaks that cause discomfort',
    descriptionAr: 'يقلل القمم التي تسبب عدم الراحة',
    bands: { sub_bass: 0, bass: -3, low_mid: 0, mid: -6, high_mid: -8, presence: -10, brilliance: -12, air: -15 },
    icon: '🔇',
  },
  {
    id: 'speech_clarity',
    name: 'Speech Clarity',
    nameAr: 'وضوح الكلام',
    description: 'Enhances speech frequency range',
    descriptionAr: 'يعزز نطاق تردد الكلام',
    bands: { sub_bass: -6, bass: -3, low_mid: 0, mid: +3, high_mid: +5, presence: +3, brilliance: 0, air: -3 },
    icon: '🗣️',
  },
  {
    id: 'attention',
    name: 'Attention Enhancement',
    nameAr: 'تعزيز الانتباه',
    description: 'Optimized for focus and alertness',
    descriptionAr: 'محسن للتركيز واليقظة',
    bands: { sub_bass: -10, bass: -5, low_mid: 0, mid: +2, high_mid: +4, presence: +2, brilliance: 0, air: -5 },
    icon: '🎯',
  },
  {
    id: 'calming',
    name: 'Calming Profile',
    nameAr: 'ملف مهدئ',
    description: 'Reduces stimulating frequencies',
    descriptionAr: 'يقلل الترددات المحفزة',
    bands: { sub_bass: 0, bass: +2, low_mid: +3, mid: 0, high_mid: -5, presence: -8, brilliance: -10, air: -15 },
    icon: '😌',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    padding: spacing[6],
    background: brand.ink,
    borderRadius: radius.xl,
    border: `1px solid ${brand.cyan}30`,
  } as React.CSSProperties,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
    flexWrap: 'wrap' as const,
    gap: spacing[4],
  } as React.CSSProperties,

  title: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    background: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  } as React.CSSProperties,

  controls: {
    display: 'flex',
    gap: spacing[3],
  } as React.CSSProperties,

  controlButton: {
    ...buttons.ghost,
    padding: `${spacing[2]} ${spacing[4]}`,
    borderRadius: radius.full,
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  } as React.CSSProperties,

  controlButtonActive: {
    background: `${brand.cyan}20`,
    color: brand.cyan,
    border: `1px solid ${brand.cyan}`,
  } as React.CSSProperties,

  visualizerContainer: {
    background: `${brand.panel}`,
    borderRadius: radius.xl,
    padding: spacing[6],
    marginBottom: spacing[6],
    position: 'relative' as const,
    overflow: 'hidden',
  } as React.CSSProperties,

  gridLines: {
    position: 'absolute' as const,
    top: spacing[6],
    left: spacing[6],
    right: spacing[6],
    bottom: spacing[6],
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    pointerEvents: 'none' as const,
  } as React.CSSProperties,

  gridLine: {
    height: '1px',
    background: '#333',
    position: 'relative' as const,
  } as React.CSSProperties,

  gridLabel: {
    position: 'absolute' as const,
    left: '-40px',
    top: '-8px',
    fontSize: typography.size.xs,
    color: '#666',
  } as React.CSSProperties,

  barsContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '300px',
    padding: `0 ${spacing[4]}`,
    position: 'relative' as const,
    zIndex: 1,
  } as React.CSSProperties,

  bandColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: spacing[2],
    flex: 1,
    maxWidth: '100px',
  } as React.CSSProperties,

  barContainer: {
    width: '100%',
    height: '200px',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-end',
    alignItems: 'center',
  } as React.CSSProperties,

  bar: {
    width: '60%',
    borderRadius: `${radius.md} ${radius.md} 0 0`,
    transition: 'height 0.2s ease, opacity 0.2s ease',
    position: 'relative' as const,
    cursor: 'pointer',
  } as React.CSSProperties,

  barValue: {
    position: 'absolute' as const,
    top: '-25px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: '#fff',
    background: 'rgba(0,0,0,0.7)',
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: radius.md,
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,

  bandLabel: {
    fontSize: typography.size.xs,
    color: '#888',
    textAlign: 'center' as const,
    maxWidth: '80px',
  } as React.CSSProperties,

  bandFreq: {
    fontSize: '10px',
    color: '#666',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  sliderContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: spacing[1],
  } as React.CSSProperties,

  slider: {
    WebkitAppearance: 'slider-vertical' as const,
    width: '30px',
    height: '150px',
    background: '#333',
    borderRadius: radius.full,
    cursor: 'pointer',
  } as React.CSSProperties,

  profilesSection: {
    marginBottom: spacing[6],
  } as React.CSSProperties,

  profilesTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: '#fff',
    marginBottom: spacing[4],
  } as React.CSSProperties,

  profilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: spacing[3],
  } as React.CSSProperties,

  profileCard: {
    ...cards.glass,
    padding: spacing[4],
    cursor: 'pointer',
    transition: transitions.fast,
    textAlign: 'center' as const,
  } as React.CSSProperties,

  profileCardActive: {
    border: `2px solid ${brand.cyan}`,
    boxShadow: shadows.glow.cyan,
  } as React.CSSProperties,

  profileIcon: {
    fontSize: '2rem',
    marginBottom: spacing[2],
  } as React.CSSProperties,

  profileName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: '#fff',
    marginBottom: spacing[1],
  } as React.CSSProperties,

  profileDescription: {
    fontSize: typography.size.xs,
    color: '#888',
  } as React.CSSProperties,

  infoSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing[4],
  } as React.CSSProperties,

  infoCard: {
    ...cards.glass,
    padding: spacing[4],
  } as React.CSSProperties,

  infoTitle: {
    fontSize: typography.size.sm,
    color: brand.cyan,
    marginBottom: spacing[2],
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  } as React.CSSProperties,

  infoContent: {
    fontSize: typography.size.sm,
    color: '#aaa',
    lineHeight: 1.6,
  } as React.CSSProperties,

  waveformCanvas: {
    width: '100%',
    height: '80px',
    background: `${brand.ink}`,
    borderRadius: radius.md,
    marginTop: spacing[4],
  } as React.CSSProperties,

  frequencyLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `0 ${spacing[4]}`,
    marginTop: spacing[2],
  } as React.CSSProperties,

  frequencyLabel: {
    fontSize: '10px',
    color: '#666',
  } as React.CSSProperties,

  playbackControls: {
    display: 'flex',
    justifyContent: 'center',
    gap: spacing[4],
    marginTop: spacing[6],
    padding: spacing[4],
    background: `${brand.panel}`,
    borderRadius: radius.lg,
  } as React.CSSProperties,

  playButton: {
    ...buttons.primary,
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    background: gradients.cyanPurple,
  } as React.CSSProperties,

  volumeControl: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  } as React.CSSProperties,

  volumeSlider: {
    width: '100px',
    height: '6px',
    borderRadius: radius.full,
    background: '#333',
    appearance: 'none' as const,
    cursor: 'pointer',
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const SoundLabSimulation: React.FC<SoundLabSimulationProps> = ({
  onProfileChange,
  readOnly = false,
}) => {
  const { isArabic } = useLanguage();
  const [bands, setBands] = useState<Record<string, number>>(() =>
    Object.fromEntries(frequencyBands.map(b => [b.id, 0]))
  );
  const [selectedProfile, setSelectedProfile] = useState<string>('flat');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [animationValues, setAnimationValues] = useState<Record<string, number>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Animation for bars when playing
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setAnimationValues(prev => {
          const next: Record<string, number> = {};
          frequencyBands.forEach(band => {
            const base = bands[band.id];
            const noise = (Math.random() - 0.5) * 10;
            next[band.id] = base + noise;
          });
          return next;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setAnimationValues({});
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, bands]);

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.fillStyle = brand.ink;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        ctx.strokeStyle = brand.cyan;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const sliceWidth = canvas.width / 100;
        let x = 0;

        for (let i = 0; i < 100; i++) {
          const amplitude = 30 + Math.sin(i * 0.1 + Date.now() * 0.005) * 20;
          const y = canvas.height / 2 + Math.sin(i * 0.3 + Date.now() * 0.01) * amplitude;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.stroke();
      }

      if (isPlaying) {
        requestAnimationFrame(draw);
      }
    };

    draw();
  }, [isPlaying]);

  const handleBandChange = useCallback((bandId: string, value: number) => {
    if (readOnly) return;
    setBands(prev => ({ ...prev, [bandId]: value }));
    setSelectedProfile('custom');
  }, [readOnly]);

  const handleProfileSelect = useCallback((profile: AudioProfile) => {
    setSelectedProfile(profile.id);
    setBands(profile.bands);
    onProfileChange?.(profile);
  }, [onProfileChange]);

  const getBarHeight = useCallback((bandId: string): number => {
    const base = isPlaying ? (animationValues[bandId] ?? bands[bandId]) : bands[bandId];
    return Math.max(10, 50 + base * 5);
  }, [bands, animationValues, isPlaying]);

  const currentProfile = useMemo(
    () => presetProfiles.find(p => p.id === selectedProfile),
    [selectedProfile]
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          🎧 {isArabic ? 'محاكي مختبر الصوت' : 'Sound Lab Simulator'}
        </h2>
        <div style={styles.controls}>
          <button
            style={{
              ...styles.controlButton,
              ...(isPlaying ? styles.controlButtonActive : {}),
            }}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? '⏸️' : '▶️'} {isArabic ? (isPlaying ? 'إيقاف' : 'تشغيل') : (isPlaying ? 'Pause' : 'Play')}
          </button>
          <button
            style={styles.controlButton}
            onClick={() => handleProfileSelect(presetProfiles[0])}
          >
            🔄 {isArabic ? 'إعادة تعيين' : 'Reset'}
          </button>
        </div>
      </div>

      {/* Frequency Visualizer */}
      <div style={styles.visualizerContainer}>
        {/* Grid Lines */}
        <div style={styles.gridLines}>
          {['+10dB', '0dB', '-10dB', '-20dB'].map((label, idx) => (
            <div key={label} style={styles.gridLine}>
              <span style={styles.gridLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* Frequency Bars */}
        <div style={styles.barsContainer}>
          {frequencyBands.map(band => (
            <div key={band.id} style={styles.bandColumn}>
              <div style={styles.barContainer}>
                <div
                  style={{
                    ...styles.bar,
                    height: `${getBarHeight(band.id)}%`,
                    background: `linear-gradient(180deg, ${band.color}, ${band.color}80)`,
                    boxShadow: isPlaying ? `0 0 20px ${band.color}50` : 'none',
                  }}
                  onClick={() => handleBandChange(band.id, bands[band.id] === 0 ? -10 : 0)}
                >
                  <span style={styles.barValue}>
                    {bands[band.id] > 0 ? '+' : ''}{bands[band.id]}dB
                  </span>
                </div>
              </div>
              <div style={styles.bandLabel}>
                {isArabic ? band.labelAr : band.label}
              </div>
              <div style={styles.bandFreq}>
                {band.centerHz >= 1000 ? `${band.centerHz / 1000}kHz` : `${band.centerHz}Hz`}
              </div>

              {/* Slider for each band */}
              {!readOnly && (
                <input
                  type="range"
                  min="-20"
                  max="+10"
                  value={bands[band.id]}
                  onChange={e => handleBandChange(band.id, parseInt(e.target.value))}
                  style={{
                    width: '80px',
                    height: '6px',
                    marginTop: spacing[2],
                    accentColor: band.color,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Waveform Display */}
        <canvas
          ref={canvasRef}
          width={800}
          height={80}
          style={styles.waveformCanvas}
        />

        {/* Frequency Labels */}
        <div style={styles.frequencyLabels}>
          <span style={styles.frequencyLabel}>20Hz</span>
          <span style={styles.frequencyLabel}>100Hz</span>
          <span style={styles.frequencyLabel}>1kHz</span>
          <span style={styles.frequencyLabel}>10kHz</span>
          <span style={styles.frequencyLabel}>20kHz</span>
        </div>
      </div>

      {/* Preset Profiles */}
      <div style={styles.profilesSection}>
        <h3 style={styles.profilesTitle}>
          📋 {isArabic ? 'ملفات تعريف مسبقة' : 'Preset Profiles'}
        </h3>
        <div style={styles.profilesGrid}>
          {presetProfiles.map(profile => (
            <div
              key={profile.id}
              style={{
                ...styles.profileCard,
                ...(selectedProfile === profile.id ? styles.profileCardActive : {}),
              }}
              onClick={() => handleProfileSelect(profile)}
            >
              <div style={styles.profileIcon}>{profile.icon}</div>
              <div style={styles.profileName}>
                {isArabic ? profile.nameAr : profile.name}
              </div>
              <div style={styles.profileDescription}>
                {isArabic ? profile.descriptionAr : profile.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Playback Controls */}
      <div style={styles.playbackControls}>
        <div style={styles.volumeControl}>
          <span>🔈</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={e => setVolume(parseInt(e.target.value))}
            style={styles.volumeSlider}
          />
          <span>🔊</span>
          <span style={{ color: '#888', fontSize: typography.size.sm, marginLeft: spacing[2] }}>
            {volume}%
          </span>
        </div>

        <button
          style={styles.playButton}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>

        <div style={{ color: '#888', fontSize: typography.size.sm }}>
          {currentProfile && (
            <span>
              {isArabic ? 'الملف الحالي:' : 'Current:'} {isArabic ? currentProfile.nameAr : currentProfile.name}
            </span>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div style={styles.infoSection}>
        <div style={styles.infoCard}>
          <div style={styles.infoTitle}>
            🎵 {isArabic ? 'حول تصفية الصوت' : 'About Audio Filtering'}
          </div>
          <div style={styles.infoContent}>
            {isArabic
              ? 'يستخدم علاج Bérard AIT تصفية الصوت الديناميكية لتعديل الترددات التي قد تسبب عدم الراحة أو صعوبات في المعالجة.'
              : 'Bérard AIT uses dynamic audio filtering to modulate frequencies that may cause discomfort or processing difficulties.'}
          </div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.infoTitle}>
            🧠 {isArabic ? 'كيف يعمل' : 'How It Works'}
          </div>
          <div style={styles.infoContent}>
            {isArabic
              ? 'يتم تخصيص كل ملف تعريف بناءً على اختبار السمع الفردي. الأشرطة تمثل مستوى التضخيم أو التخفيف لكل نطاق تردد.'
              : 'Each profile is customized based on individual hearing tests. The bars represent the amplification or attenuation level for each frequency band.'}
          </div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.infoTitle}>
            ⚙️ {isArabic ? 'تخصيص العلاج' : 'Treatment Customization'}
          </div>
          <div style={styles.infoContent}>
            {isArabic
              ? 'يمكن للمعالج تعديل هذه الإعدادات أثناء جلسات العلاج بناءً على استجابة المريض وراحته.'
              : 'The therapist can adjust these settings during treatment sessions based on the patient\'s response and comfort level.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundLabSimulation;
