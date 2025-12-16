import { useState, useEffect, useRef, useCallback } from 'react';
import { brandCyan, brandPink, brandPurple, brandPurpleDark, styles } from './styles';

interface FrequencyBand {
  id: string;
  label: string;
  labelEn: string;
  minHz: number;
  maxHz: number;
  color: string;
  description: string;
  affected: string[];
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
    affected: ['التوازن', 'الإيقاع', 'الحركة'],
  },
  {
    id: 'mid-low',
    label: 'الترددات المتوسطة المنخفضة',
    labelEn: 'Mid-Low Frequencies',
    minHz: 250,
    maxHz: 1000,
    color: brandPurple,
    description: 'أساسية لفهم نغمات الكلام الأساسية',
    affected: ['الكلام', 'التواصل', 'الاستماع'],
  },
  {
    id: 'mid',
    label: 'الترددات المتوسطة',
    labelEn: 'Mid Frequencies',
    minHz: 1000,
    maxHz: 3000,
    color: brandCyan,
    description: 'منطقة الكلام الرئيسية - أهم ترددات اللغة',
    affected: ['فهم الكلام', 'التعلم', 'القراءة'],
  },
  {
    id: 'mid-high',
    label: 'الترددات المتوسطة العالية',
    labelEn: 'Mid-High Frequencies',
    minHz: 3000,
    maxHz: 8000,
    color: '#22c55e',
    description: 'مهمة للتمييز بين الأصوات المتشابهة',
    affected: ['الوضوح', 'التمييز', 'الانتباه'],
  },
  {
    id: 'high',
    label: 'الترددات العالية',
    labelEn: 'High Frequencies',
    minHz: 8000,
    maxHz: 20000,
    color: brandPink,
    description: 'تضيف الحيوية والوضوح للأصوات',
    affected: ['الطاقة', 'اليقظة', 'التركيز'],
  },
];

const presets = [
  { id: 'normal', label: 'سمع طبيعي', levels: [0.8, 0.85, 0.9, 0.85, 0.8] },
  { id: 'hypersensitive', label: 'فرط الحساسية', levels: [0.95, 1.0, 0.95, 0.9, 0.95] },
  { id: 'hyposensitive', label: 'نقص الحساسية', levels: [0.4, 0.5, 0.6, 0.5, 0.4] },
  { id: 'mixed', label: 'مختلط', levels: [0.5, 0.9, 0.4, 0.95, 0.6] },
];

export default function AudioSpectrumDemo() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('normal');
  const [levels, setLevels] = useState<number[]>([0.8, 0.85, 0.9, 0.85, 0.8]);
  const [hoveredBand, setHoveredBand] = useState<string | null>(null);
  const [animatedLevels, setAnimatedLevels] = useState<number[]>([0, 0, 0, 0, 0]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

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

  return (
    <section ref={sectionRef} id="spectrum" style={styles.sectionCard}>
      <style>{`
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
      `}</style>

      {/* Header */}
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>🎛️ محلل الطيف الصوتي</h2>
          <span style={{
            ...styles.chip,
            background: 'linear-gradient(135deg, rgba(143,211,204,0.2), rgba(175,132,186,0.2))',
            borderColor: 'rgba(143,211,204,0.4)',
          }}>
            Audio Spectrum Analyzer
          </span>
        </div>
        <p style={styles.bodyText}>
          استكشف كيف يعالج Berard AIT مختلف نطاقات الترددات لتحسين المعالجة السمعية
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        marginTop: 24,
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: 20,
      }}>
        {/* Spectrum Visualizer */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(11,15,28,0.98), rgba(25,30,50,0.98))',
          borderRadius: 20,
          border: '1px solid rgba(143,211,204,0.2)',
          overflow: 'hidden',
          animation: isVisible ? 'spectrumEnter 0.6s ease-out' : 'none',
        }}>
          {/* Canvas Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isPlaying ? '#22c55e' : '#666',
                boxShadow: isPlaying ? '0 0 10px #22c55e' : 'none',
              }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
                {isPlaying ? 'تشغيل' : 'متوقف'} | Berard AIT Spectrum
              </span>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                padding: '6px 14px',
                background: isPlaying
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                  : `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {isPlaying ? '⏹ إيقاف' : '▶ تشغيل'}
            </button>
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
              🎚️ أنماط السمع
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
                    textAlign: 'right',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {preset.label}
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
                      {band.label}
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
                      {band.description}
                    </div>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                    }}>
                      {band.affected.map((item) => (
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
              <strong style={{ color: brandCyan }}>كيف يعمل Berard AIT:</strong>
              <br />
              يقوم بتعديل الترددات المحددة بناءً على اختبار السمع الفردي لتحسين المعالجة السمعية في الدماغ.
            </div>
          </div>
        </div>
      </div>

      {/* Frequency Band Details */}
      <div style={{
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
    </section>
  );
}
