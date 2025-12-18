import { useEffect, useMemo, useState, useRef, useCallback, memo } from 'react';

import { brandCyan, brandPink, brandPurple, brandPurpleDark, styles } from './styles';

import AssessmentSuiteModal from './games/AssessmentSuiteModal';
import AttentionTestPanel from './games/AttentionTestPanel';
import FrequencyDiscriminationTestPanel from './games/FrequencyDiscriminationTestPanel';
import SequencingTestPanel from './games/SequencingTestPanel';
import QuestionnairePanel from './games/QuestionnairePanel';
import GamePortal from './games/GamePortal';
import type { GameResult, TestOutcome } from './games/types';
import { resultMeta } from './games/types';
import { saveSession, type StoredSession } from './games/scoring';

type GameMode = 'suite' | 'attention' | 'frequency' | 'sequence' | 'questionnaire';

const nextStepFrom = (r: GameResult) => {
  if (r === 'low') return { label: 'احجز تقييماً / تواصل الآن', hash: '#contact', tone: brandPink };
  if (r === 'medium') return { label: 'ابدأ بالاستبيان + أكمل الفحص', hash: '#games', tone: brandPurple };
  return { label: 'خيار المدارس/الجامعات', hash: '#schools', tone: brandCyan };
};

// Animated waveform component
function Waveform({ color, type, active }: { color: string; type: 'ecg' | 'spo2' | 'resp' | 'audio'; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;

      ctx.fillStyle = 'rgba(30, 35, 45, 0.3)';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      offsetRef.current += active ? 2 : 0.5;

      for (let x = 0; x < width; x++) {
        let y = midY;
        const t = (x + offsetRef.current) * 0.05;

        if (type === 'ecg') {
          // ECG-like pattern
          const phase = (x + offsetRef.current) % 80;
          if (phase < 5) y = midY;
          else if (phase < 10) y = midY - 25;
          else if (phase < 15) y = midY + 35;
          else if (phase < 20) y = midY - 5;
          else y = midY + Math.sin(t) * 2;
        } else if (type === 'spo2') {
          // SpO2 pulse wave
          y = midY - Math.sin(t * 1.5) * 20 - Math.sin(t * 3) * 5;
        } else if (type === 'resp') {
          // Respiratory wave
          y = midY - Math.sin(t * 0.8) * 15;
        } else if (type === 'audio') {
          // Audio spectrum
          y = midY - Math.sin(t * 2) * 18 * Math.sin(t * 0.3) - Math.random() * (active ? 8 : 2);
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();

      // Add glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = active ? 10 : 5;

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [color, type, active]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={60}
      aria-label={`${type} waveform visualization`}
      role="img"
      style={{
        width: '100%',
        height: 60,
        borderRadius: 4,
        background: 'rgba(30, 35, 45, 0.8)',
      }}
    />
  );
}

// Medical monitor frame component
function MedicalMonitor({
  title,
  children,
  open,
  onClose,
  waveformColor,
  waveformType,
  statusText,
  isActive,
}: {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  waveformColor: string;
  waveformType: 'ecg' | 'spo2' | 'resp' | 'audio';
  statusText: string;
  isActive: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      {/* Monitor Frame */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 900,
          background: 'linear-gradient(180deg, #E8E4DC 0%, #D4CFC5 50%, #C8C3B9 100%)',
          borderRadius: 20,
          padding: 20,
          boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.5)',
          position: 'relative',
        }}
      >
        {/* Monitor bezel top */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
          padding: '0 10px',
        }}>
          <div style={{ fontSize: 12, color: '#666', fontWeight: 600 }}>BERARD AIT SCREENING</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: '#666' }}>MENU</span>
            <span style={{ fontSize: 11, color: '#666' }}>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            <div style={{ width: 30, height: 12, background: '#4a4', borderRadius: 2, border: '1px solid #383' }} />
          </div>
        </div>

        {/* Monitor Screen */}
        <div style={{
          background: 'linear-gradient(180deg, #2A2F3A 0%, #1E232C 100%)',
          borderRadius: 8,
          overflow: 'hidden',
          border: '3px solid #1a1a1a',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
        }}>
          {/* Screen header with waveform */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 180px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}>
            {/* Left side - Waveform display */}
            <div style={{ padding: 15, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}>
                <span style={{ color: waveformColor, fontSize: 14, fontWeight: 700 }}>{title}</span>
                <span style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  background: isActive ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  color: isActive ? '#22c55e' : 'rgba(255,255,255,0.5)',
                }}>
                  {isActive ? '● ACTIVE' : '○ STANDBY'}
                </span>
              </div>
              <Waveform color={waveformColor} type={waveformType} active={isActive} />
            </div>

            {/* Right side - Stats */}
            <div style={{ padding: 15, background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ marginBottom: 15 }}>
                <div style={{ fontSize: 10, color: waveformColor, marginBottom: 2 }}>STATUS</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#22c55e', fontFamily: 'monospace' }}>
                  {statusText}
                </div>
              </div>
              <div style={{ marginBottom: 15 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>MODE</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>SCREENING</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>TYPE</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: waveformColor }}>NON-DIAGNOSTIC</div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div style={{
            padding: 20,
            maxHeight: '50vh',
            overflowY: 'auto',
            direction: 'rtl',
          }}>
            {children}
          </div>
        </div>

        {/* Monitor buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 15,
          padding: '0 10px',
        }}>
          {/* Left buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            {/* Orange button */}
            <button
              type="button"
              style={{
                width: 50,
                height: 20,
                borderRadius: 4,
                background: 'linear-gradient(180deg, #F59E0B, #D97706)',
                border: '1px solid #B45309',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            />
            {/* Blue buttons */}
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                type="button"
                style={{
                  width: 50,
                  height: 20,
                  borderRadius: 4,
                  background: 'linear-gradient(180deg, #3B82F6, #2563EB)',
                  border: '1px solid #1D4ED8',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              />
            ))}
            {/* Red close button */}
            <button
              type="button"
              onClick={onClose}
              style={{
                width: 50,
                height: 20,
                borderRadius: 4,
                background: 'linear-gradient(180deg, #EF4444, #DC2626)',
                border: '1px solid #B91C1C',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            />
          </div>

          {/* Dial */}
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #5a5a5a, #3a3a3a)',
            border: '2px solid #2a2a2a',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 6,
              height: 15,
              background: '#888',
              borderRadius: 2,
              transform: 'rotate(-30deg)',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Test card styled as monitor display
function TestCard({
  title,
  description,
  tag,
  waveformColor,
  waveformType,
  onClick,
  index,
}: {
  title: string;
  description: string;
  tag: string;
  waveformColor: string;
  waveformType: 'ecg' | 'spo2' | 'resp' | 'audio';
  onClick: () => void;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'linear-gradient(180deg, #E8E4DC 0%, #D4CFC5 100%)',
        borderRadius: 16,
        padding: 12,
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0)',
        boxShadow: isHovered
          ? `0 25px 50px rgba(0,0,0,0.4), 0 0 40px ${waveformColor}22`
          : '0 8px 25px rgba(0,0,0,0.3)',
        animation: `monitorEnter 0.6s ease-out ${index * 0.1}s backwards`,
      }}
    >
      {/* Mini monitor header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        fontSize: 9,
        color: '#666',
      }}>
        <span>BERARD SCREENING</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: isHovered ? '#22c55e' : '#888',
            animation: isHovered ? 'blink 1s ease-in-out infinite' : 'none',
          }} />
          <span>{isHovered ? 'READY' : 'STANDBY'}</span>
        </div>
      </div>

      {/* Mini screen */}
      <div style={{
        background: 'linear-gradient(180deg, #2A2F3A 0%, #1E232C 100%)',
        borderRadius: 8,
        padding: 12,
        border: '2px solid #1a1a1a',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
      }}>
        {/* Waveform display */}
        <div style={{ marginBottom: 10 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}>
            <span style={{ color: waveformColor, fontSize: 11, fontWeight: 700 }}>{tag}</span>
            <span style={{
              fontSize: 16,
              fontWeight: 900,
              color: '#22c55e',
              fontFamily: 'monospace',
            }}>
              {isHovered ? 'START' : '--'}
            </span>
          </div>
          <Waveform color={waveformColor} type={waveformType} active={isHovered} />
        </div>

        {/* Info */}
        <div style={{ direction: 'rtl', textAlign: 'right' }}>
          <div style={{
            fontWeight: 800,
            fontSize: 13,
            color: '#fff',
            marginBottom: 6,
            lineHeight: 1.4,
          }}>
            {title}
          </div>
          <div style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.5,
          }}>
            {description}
          </div>
        </div>

        {/* Start indicator */}
        <div style={{
          marginTop: 12,
          padding: '8px 12px',
          background: isHovered
            ? `linear-gradient(135deg, ${waveformColor}33, ${waveformColor}11)`
            : 'rgba(255,255,255,0.05)',
          border: `1px solid ${isHovered ? waveformColor : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 8,
          textAlign: 'center',
          transition: 'all 0.3s ease',
        }}>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: isHovered ? waveformColor : 'rgba(255,255,255,0.5)',
          }}>
            {isHovered ? '▶ اضغط للبدء' : '○ متاح'}
          </span>
        </div>
      </div>

      {/* Mini buttons */}
      <div style={{
        display: 'flex',
        gap: 4,
        marginTop: 8,
        justifyContent: 'center',
      }}>
        <div style={{ width: 20, height: 8, borderRadius: 2, background: '#F59E0B' }} />
        <div style={{ width: 20, height: 8, borderRadius: 2, background: '#3B82F6' }} />
        <div style={{ width: 20, height: 8, borderRadius: 2, background: '#3B82F6' }} />
        <div style={{ width: 20, height: 8, borderRadius: 2, background: '#EF4444' }} />
      </div>
    </div>
  );
}

const GameSection = memo(function GameSection() {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [lastOutcome, setLastOutcome] = useState<TestOutcome | null>(null);
  const [modalOutcome, setModalOutcome] = useState<TestOutcome | null>(null);
  const [isTestActive, setIsTestActive] = useState(false);
  const [showPortal, setShowPortal] = useState(true);
  const sessionIdRef = useRef<string>(Date.now().toString(36) + Math.random().toString(36).slice(2));
  const outcomesRef = useRef<Partial<Record<string, TestOutcome>>>({});

  useEffect(() => {
    setModalOutcome(null);
    setIsTestActive(false);
  }, [mode]);

  // Save session when outcome changes
  const handleOutcome = useCallback((outcome: TestOutcome) => {
    setLastOutcome(outcome);
    setModalOutcome(outcome);
    setIsTestActive(false);

    // Track outcomes for this session
    outcomesRef.current[outcome.key] = outcome;

    // Calculate total points from all outcomes
    const totalPoints = Object.values(outcomesRef.current)
      .reduce((sum, o) => sum + (typeof o?.metrics?.gamePoints === 'number' ? o.metrics.gamePoints : 0), 0);

    // Save session to localStorage
    const session: StoredSession = {
      id: sessionIdRef.current,
      date: Date.now(),
      outcomes: outcomesRef.current,
      compositeResult: outcome.result,
      totalPoints,
    };
    saveSession(session);
  }, []);

  const cards = useMemo(
    () => [
      {
        mode: 'suite' as const,
        title: 'معمل الفحص السمعي الشامل',
        fullTitle: '🧪 معمل الفحص السمعي (3 اختبارات) — تقرير PDF/CSV',
        desc: 'جلسة تفاعلية لقياس مؤشرات الانتباه + تمييز التردد + التسلسل',
        tag: 'FULL SUITE',
        color: '#22c55e',
        waveType: 'ecg' as const,
      },
      {
        mode: 'attention' as const,
        title: 'اختبار الانتباه السمعي',
        fullTitle: '🎯 اختبار الانتباه السمعي تحت الضوضاء (Go/No-Go)',
        desc: 'قياس الانتباه الانتقائي + الاندفاعية وزمن الاستجابة',
        tag: 'ATTENTION',
        color: '#3B82F6',
        waveType: 'spo2' as const,
      },
      {
        mode: 'frequency' as const,
        title: 'اختبار تمييز التردد',
        fullTitle: '🎚️ اختبار تمييز التردد (Adaptive 2IFC)',
        desc: 'تقدير عتبة تمييز فروقات التردد عبر صعوبة تكيفية',
        tag: 'FREQUENCY',
        color: '#8B5CF6',
        waveType: 'audio' as const,
      },
      {
        mode: 'sequence' as const,
        title: 'محاكاة الصف الدراسي — ذاكرة سمعية',
        fullTitle: '🏫 محاكاة الصف الدراسي — تسلسل/ذاكرة سمعية تحت الضوضاء',
        desc: 'اتباع سلسلة أوامر صوتية مع ضوضاء متزايدة',
        tag: 'SEQUENCE',
        color: '#F59E0B',
        waveType: 'resp' as const,
      },
      {
        mode: 'questionnaire' as const,
        title: 'استبيان مؤشرات للأهل',
        fullTitle: '📝 استبيان مؤشرات للأهل (غير تشخيصي)',
        desc: 'يعطي سياقاً ذاتياً مع الاختبارات الموضوعية',
        tag: 'SURVEY',
        color: brandPink,
        waveType: 'ecg' as const,
      },
    ],
    []
  );

  const activeCard = cards.find(c => c.mode === mode);
  const lastMeta = lastOutcome ? resultMeta[lastOutcome.result] : null;
  const lastNext = lastOutcome ? nextStepFrom(lastOutcome.result) : null;

  const handleTestStart = useCallback(() => {
    setIsTestActive(true);
  }, []);

  return (
    <section id="games" style={styles.sectionCard}>
      <style>{`
        @keyframes monitorEnter {
          from { opacity: 0; transform: translateY(40px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @media (max-width: 640px) {
          .test-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .test-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        @media (min-width: 1280px) {
          .test-cards-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 20px !important;
          }
        }
      `}</style>

      {/* Section Header */}
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>🏥 معمل الفحص السمعي</h2>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={() => setShowPortal(!showPortal)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                background: showPortal
                  ? `linear-gradient(135deg, ${brandCyan}22, ${brandPink}22)`
                  : 'rgba(255,255,255,0.08)',
                border: `1px solid ${showPortal ? brandCyan : 'rgba(255,255,255,0.2)'}`,
                color: showPortal ? brandCyan : 'rgba(255,255,255,0.7)',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {showPortal ? '🎮 Portal' : '📟 Classic'}
            </button>
            <span style={{
              ...styles.chip,
              background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(59,130,246,0.2))',
              borderColor: 'rgba(34,197,94,0.4)',
            }}>
              SCREENING LAB
            </span>
          </div>
        </div>
        <p style={styles.lead}>
          هذه <b style={{ color: brandCyan }}>اختبارات تفاعلية منظمة</b> تعطي مؤشرات قابلة للقياس.{' '}
          <b style={{ color: brandPink }}>ليست تشخيصاً طبياً</b> ولا تغني عن تقييم أخصائي.
        </p>
      </div>

      {/* Game Portal - Special Delivery Design */}
      {showPortal && (
        <div style={{ marginTop: 20 }}>
          <GamePortal
            onSelectMode={(m) => setMode(m as GameMode)}
            lastOutcome={lastOutcome}
          />
        </div>
      )}

      {/* Medical Monitor Visual Header - Classic View */}
      {!showPortal && (
      <div style={{
        marginTop: 20,
        padding: 20,
        background: 'linear-gradient(180deg, #E8E4DC 0%, #D4CFC5 100%)',
        borderRadius: 20,
        boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
      }}>
        {/* Monitor top bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          padding: '0 10px',
        }}>
          <div style={{ fontSize: 11, color: '#666', fontWeight: 600 }}>
            BERARD AIT SOUND LAB — SCREENING STATION
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: '#666' }}>5 TESTS AVAILABLE</span>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
              animation: 'blink 2s ease-in-out infinite',
            }} />
          </div>
        </div>

        {/* Main monitor display */}
        <div style={{
          background: 'linear-gradient(180deg, #2A2F3A 0%, #1E232C 100%)',
          borderRadius: 12,
          padding: 20,
          border: '3px solid #1a1a1a',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Scanline effect */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.1) 50%)',
            backgroundSize: '100% 4px',
            pointerEvents: 'none',
            opacity: 0.3,
          }} />

          {/* Best experience notice */}
          <div style={{
            marginBottom: 20,
            padding: 12,
            background: 'rgba(143,211,204,0.1)',
            border: '1px solid rgba(143,211,204,0.3)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ fontSize: 24 }}>🎧</span>
            <div style={{ flex: 1, direction: 'rtl', textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: brandCyan }}>أفضل تجربة</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                استخدم سماعات + ارفع الصوت لمستوى مريح + مكان هادئ
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: 4,
            }}>
              {['🔊', '🎧', '🤫'].map((emoji, i) => (
                <span key={i} style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                }}>
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          {/* Test Cards Grid */}
          <div className="test-cards-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: 16,
          }}>
            {cards.map((c, i) => (
              <TestCard
                key={c.mode}
                title={c.title}
                description={c.desc}
                tag={c.tag}
                waveformColor={c.color}
                waveformType={c.waveType}
                onClick={() => setMode(c.mode)}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Monitor bottom buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 15,
          gap: 8,
        }}>
          {[
            { color: '#F59E0B', label: 'SUITE' },
            { color: '#3B82F6', label: 'ATTENTION' },
            { color: '#8B5CF6', label: 'FREQ' },
            { color: '#F59E0B', label: 'SEQ' },
            { color: brandPink, label: 'SURVEY' },
          ].map((btn, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setMode(cards[i].mode)}
              style={{
                padding: '6px 16px',
                borderRadius: 4,
                background: `linear-gradient(180deg, ${btn.color}, ${btn.color}cc)`,
                border: `1px solid ${btn.color}88`,
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                fontSize: 10,
                fontWeight: 700,
                color: '#fff',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* Last Result Display */}
      {lastOutcome && lastMeta && lastNext ? (
        <div style={{
          marginTop: 20,
          padding: 16,
          background: 'linear-gradient(180deg, #E8E4DC 0%, #D4CFC5 100%)',
          borderRadius: 16,
          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
        }}>
          <div style={{
            background: 'linear-gradient(180deg, #2A2F3A 0%, #1E232C 100%)',
            borderRadius: 8,
            padding: 16,
            border: '2px solid #1a1a1a',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
              alignItems: 'center',
              direction: 'rtl',
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: lastMeta.color,
                    animation: 'blink 1.5s ease-in-out infinite',
                  }} />
                  <span style={{ fontWeight: 900, color: lastMeta.color, fontSize: 16 }}>
                    آخر نتيجة: {lastOutcome.title}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>
                  {lastOutcome.scoreLabel}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                  {lastOutcome.message}
                </div>
              </div>
              <a
                href={lastNext.hash}
                style={{
                  ...styles.primaryBtn,
                  textDecoration: 'none',
                  background: `linear-gradient(135deg, ${brandPurpleDark}, ${lastNext.tone})`,
                  boxShadow: `0 4px 15px ${lastNext.tone}44`,
                }}
              >
                {lastNext.label}
              </a>
            </div>
          </div>
        </div>
      ) : null}

      {/* Suite Modal */}
      <AssessmentSuiteModal open={mode === 'suite'} onClose={() => setMode(null)} />

      {/* Individual Test Modals with Medical Monitor Frame */}
      <MedicalMonitor
        open={mode === 'attention'}
        onClose={() => setMode(null)}
        title="🎯 ATTENTION TEST"
        waveformColor="#3B82F6"
        waveformType="spo2"
        statusText={isTestActive ? 'TESTING' : 'READY'}
        isActive={isTestActive}
      >
        <AttentionTestPanel
          onDone={handleOutcome}
        />
        {modalOutcome ? (
          <div style={{
            marginTop: 16,
            padding: 12,
            background: `${resultMeta[modalOutcome.result].color}22`,
            border: `1px solid ${resultMeta[modalOutcome.result].color}44`,
            borderRadius: 8,
          }}>
            <div style={{ fontWeight: 900, color: resultMeta[modalOutcome.result].color }}>
              النتيجة: {resultMeta[modalOutcome.result].label}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              {modalOutcome.scoreLabel}
            </div>
          </div>
        ) : null}
      </MedicalMonitor>

      <MedicalMonitor
        open={mode === 'frequency'}
        onClose={() => setMode(null)}
        title="🎚️ FREQUENCY TEST"
        waveformColor="#8B5CF6"
        waveformType="audio"
        statusText={isTestActive ? 'TESTING' : 'READY'}
        isActive={isTestActive}
      >
        <FrequencyDiscriminationTestPanel
          onDone={handleOutcome}
        />
        {modalOutcome ? (
          <div style={{
            marginTop: 16,
            padding: 12,
            background: `${resultMeta[modalOutcome.result].color}22`,
            border: `1px solid ${resultMeta[modalOutcome.result].color}44`,
            borderRadius: 8,
          }}>
            <div style={{ fontWeight: 900, color: resultMeta[modalOutcome.result].color }}>
              النتيجة: {resultMeta[modalOutcome.result].label}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              {modalOutcome.scoreLabel}
            </div>
          </div>
        ) : null}
      </MedicalMonitor>

      <MedicalMonitor
        open={mode === 'sequence'}
        onClose={() => setMode(null)}
        title="🏫 SEQUENCE TEST"
        waveformColor="#F59E0B"
        waveformType="resp"
        statusText={isTestActive ? 'TESTING' : 'READY'}
        isActive={isTestActive}
      >
        <SequencingTestPanel
          onDone={handleOutcome}
        />
        {modalOutcome ? (
          <div style={{
            marginTop: 16,
            padding: 12,
            background: `${resultMeta[modalOutcome.result].color}22`,
            border: `1px solid ${resultMeta[modalOutcome.result].color}44`,
            borderRadius: 8,
          }}>
            <div style={{ fontWeight: 900, color: resultMeta[modalOutcome.result].color }}>
              النتيجة: {resultMeta[modalOutcome.result].label}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              {modalOutcome.scoreLabel}
            </div>
          </div>
        ) : null}
      </MedicalMonitor>

      <MedicalMonitor
        open={mode === 'questionnaire'}
        onClose={() => setMode(null)}
        title="📝 QUESTIONNAIRE"
        waveformColor={brandPink}
        waveformType="ecg"
        statusText={isTestActive ? 'ACTIVE' : 'READY'}
        isActive={isTestActive}
      >
        <QuestionnairePanel
          onDone={handleOutcome}
        />
        {modalOutcome ? (
          <div style={{
            marginTop: 16,
            padding: 12,
            background: `${resultMeta[modalOutcome.result].color}22`,
            border: `1px solid ${resultMeta[modalOutcome.result].color}44`,
            borderRadius: 8,
          }}>
            <div style={{ fontWeight: 900, color: resultMeta[modalOutcome.result].color }}>
              النتيجة: {resultMeta[modalOutcome.result].label}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              {modalOutcome.scoreLabel}
            </div>
          </div>
        ) : null}
      </MedicalMonitor>
    </section>
  );
});

export default GameSection;
