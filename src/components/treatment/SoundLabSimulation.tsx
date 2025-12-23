import { useMemo, useState } from 'react';
import { styles, brandCyan, brandPink, brandPurple } from '../styles';

const bandLabels = [
  'Sub-bass',
  'Bass',
  'Low mid',
  'Mid',
  'High mid',
  'Presence',
  'Brilliance',
  'Air',
];

const presets: Record<string, number[]> = {
  neutral: [25, 35, 45, 50, 45, 35, 25, 15],
  focus: [15, 25, 40, 60, 70, 55, 35, 20],
  calm: [35, 45, 35, 25, 20, 18, 15, 12],
  sparkle: [20, 30, 35, 45, 55, 65, 70, 60],
};

const translations = {
  ar: {
    title: 'مختبر الصوت التفاعلي',
    subtitle: '٨ نطاقات ترددية (من تحت الجهير حتى الهواء) مع معاينة الموجة',
    preset: 'الضبط المسبق',
    waveform: 'موجة الصوت',
  },
  en: {
    title: 'Sound Lab Simulation',
    subtitle: '8-band spectrum (sub-bass to air) with waveform preview',
    preset: 'Preset',
    waveform: 'Waveform',
  },
};

const SoundLabSimulation = ({ locale = 'ar' }: { locale?: 'ar' | 'en' }) => {
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof presets>('neutral');
  const [levels, setLevels] = useState<number[]>(presets.neutral);
  const t = translations[locale];

  const waveformPoints = useMemo(() =>
    levels.map((value, idx) => ({
      x: idx,
      y: Math.sin(idx * 0.8) * 0.4 + value / 100,
    })), [levels],
  );

  const handlePresetChange = (preset: keyof typeof presets) => {
    setSelectedPreset(preset);
    setLevels(presets[preset]);
  };

  return (
    <section style={{ ...styles.sectionCard, display: 'grid', gap: 16 }}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>{t.title}</h2>
          <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.18)' }}>8 bands</span>
        </div>
        <p style={styles.bodyText}>{t.subtitle}</p>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '2fr 1fr' }}>
        <div style={{ ...styles.section, minHeight: 240 }}>
          <div style={{ ...styles.sectionHeaderRow, marginBottom: 10 }}>
            <span style={styles.kicker}>{t.preset}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {Object.keys(presets).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetChange(preset as keyof typeof presets)}
                  style={{
                    ...styles.ghostBtn,
                    padding: '8px 12px',
                    borderColor: selectedPreset === preset ? brandCyan : 'rgba(255,255,255,0.08)',
                    background: selectedPreset === preset ? 'rgba(143,211,204,0.12)' : 'transparent',
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' }}>
            {levels.map((level, idx) => (
              <div key={bandLabels[idx]} style={{ display: 'grid', gap: 8, alignItems: 'end' }}>
                <div
                  style={{
                    height: 160,
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: '80%',
                      height: `${level + 10}%`,
                      background: `linear-gradient(180deg, ${brandPurple}, ${brandPink})`,
                      borderRadius: 8,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                    }}
                  />
                  <div style={{ position: 'absolute', top: 8, right: 8, ...styles.kicker }}>{level}%</div>
                </div>
                <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{bandLabels[idx]}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...styles.section, minHeight: 240 }}>
          <div style={{ ...styles.sectionHeaderRow, marginBottom: 10 }}>
            <span style={styles.kicker}>{t.waveform}</span>
            <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.12)', color: brandPink }}>Canvas preview</span>
          </div>
          <div style={{ height: 200, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', padding: 12 }}>
            <svg viewBox="0 0 320 160" width="100%" height="100%" preserveAspectRatio="none">
              <defs>
                <linearGradient id="wave" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor={brandCyan} />
                  <stop offset="50%" stopColor={brandPurple} />
                  <stop offset="100%" stopColor={brandPink} />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke="url(#wave)"
                strokeWidth="3"
                points={waveformPoints
                  .map((point, idx) => {
                    const x = (idx / (waveformPoints.length - 1)) * 320;
                    const y = 80 - point.y * 60;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            </svg>
          </div>
          <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
            {levels.map((level, idx) => (
              <div key={`band-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={styles.bodyText}>{bandLabels[idx]}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={level}
                  onChange={(e) => {
                    const next = [...levels];
                    next[idx] = Number(e.target.value);
                    setLevels(next);
                  }}
                  style={{ flex: 1, marginInline: 12 }}
                />
                <span style={styles.kicker}>{level}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SoundLabSimulation;
