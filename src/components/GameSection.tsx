import { useEffect, useMemo, useState, useRef, useCallback, memo } from 'react';

import { brandCyan, brandPink, brandPurple, brandPurpleDark, styles, colors, radius, spacing, typography, transitions } from './styles';

import AssessmentSuiteModal from './games/AssessmentSuiteModal';
import AttentionTestPanel from './games/AttentionTestPanel';
import FrequencyDiscriminationTestPanel from './games/FrequencyDiscriminationTestPanel';
import SequencingTestPanel from './games/SequencingTestPanel';
import QuestionnairePanel from './games/QuestionnairePanel';
import GamePortal from './games/GamePortal';
import PreTestBriefing from './games/PreTestBriefing';
import PostTestSummary from './games/PostTestSummary';
import ScreeningDashboard from './games/ScreeningDashboard';
import type { GameResult, TestOutcome } from './games/types';
import { resultMeta } from './games/types';
import { saveSession, type StoredSession } from './games/scoring';
import { useVisitorMode } from '../context/VisitorModeContext';
import { useLanguage } from '../context/LanguageContext';

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

// Lab tech modal frame component
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
        background: 'rgba(5,6,13,0.92)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      {/* Lab Modal Frame */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 920,
          background: 'linear-gradient(180deg, #1a1f2e 0%, #0d1117 100%)',
          borderRadius: 24,
          padding: 0,
          boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 80px ${waveformColor}15`,
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${waveformColor}22`,
        }}
      >
        {/* Top glow bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${waveformColor}, ${brandCyan}, transparent)`,
          opacity: 0.7,
        }} />

        {/* Modal header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          background: 'rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${waveformColor}22, ${waveformColor}11)`,
              border: `1px solid ${waveformColor}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}>
              🔬
            </div>
            <div>
              <div style={{ fontSize: 14, color: waveformColor, fontWeight: 800 }}>
                LOTUS SCREENING STATION
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>
                {title} • NON-DIAGNOSTIC
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              background: isActive ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isActive ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 8,
            }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isActive ? '#22c55e' : 'rgba(255,255,255,0.3)',
                boxShadow: isActive ? '0 0 8px #22c55e' : 'none',
                animation: isActive ? 'blink 1s ease-in-out infinite' : 'none',
              }} />
              <span style={{
                fontSize: 10,
                color: isActive ? '#22c55e' : 'rgba(255,255,255,0.5)',
                fontWeight: 700,
              }}>
                {statusText}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
                fontSize: 16,
                transition: 'all 0.2s ease',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Signal display area */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 200px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          {/* Waveform display */}
          <div style={{ padding: 20, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
              <span style={{ color: waveformColor, fontSize: 12, fontWeight: 700 }}>
                {title} SIGNAL
              </span>
              <span style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 600,
              }}>
                LIVE PREVIEW
              </span>
            </div>
            <Waveform color={waveformColor} type={waveformType} active={isActive} />
          </div>

          {/* Stats panel */}
          <div style={{ padding: 20, background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 9, color: waveformColor, marginBottom: 3, letterSpacing: '0.5px' }}>STATUS</div>
              <div style={{
                fontSize: 26,
                fontWeight: 900,
                color: '#22c55e',
                fontFamily: 'system-ui',
              }}>
                {statusText}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 3, letterSpacing: '0.5px' }}>MODE</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>SCREENING</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 3, letterSpacing: '0.5px' }}>TYPE</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: waveformColor }}>NON-DIAGNOSTIC</div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div style={{
          padding: 24,
          maxHeight: '50vh',
          overflowY: 'auto',
          direction: 'rtl',
          background: 'linear-gradient(180deg, rgba(26,31,46,0.5) 0%, rgba(13,17,23,0.5) 100%)',
        }}>
          {children}
        </div>

        {/* Bottom status bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          background: 'rgba(0,0,0,0.3)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
              LOTUS SOUND LAB
            </span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>•</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[waveformColor, brandCyan, brandPurple, brandPink].map((color, i) => (
              <div key={i} style={{
                width: 20,
                height: 3,
                borderRadius: 2,
                background: color,
                opacity: 0.6,
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Test card styled as advanced lab module
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
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Start ${title} test`}
      style={{
        background: 'linear-gradient(180deg, rgba(26,31,46,0.95) 0%, rgba(13,17,23,0.98) 100%)',
        borderRadius: 16,
        padding: 0,
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0)',
        boxShadow: isHovered
          ? `0 25px 50px rgba(0,0,0,0.5), 0 0 50px ${waveformColor}22, inset 0 1px 0 rgba(255,255,255,0.05)`
          : '0 8px 25px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)',
        animation: `monitorEnter 0.6s ease-out ${index * 0.1}s backwards`,
        border: `1px solid ${isHovered ? `${waveformColor}44` : 'rgba(255,255,255,0.06)'}`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top glow bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: isHovered
          ? `linear-gradient(90deg, transparent, ${waveformColor}, transparent)`
          : 'transparent',
        transition: 'all 0.3s ease',
      }} />

      {/* Module header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <span style={{
          fontSize: 9,
          color: waveformColor,
          fontWeight: 700,
          letterSpacing: '0.5px',
        }}>MODULE: {tag}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: isHovered ? '#22c55e' : 'rgba(255,255,255,0.3)',
            boxShadow: isHovered ? '0 0 8px #22c55e' : 'none',
            animation: isHovered ? 'blink 1s ease-in-out infinite' : 'none',
          }} />
          <span style={{
            fontSize: 9,
            color: isHovered ? '#22c55e' : 'rgba(255,255,255,0.4)',
            fontWeight: 600,
          }}>{isHovered ? 'READY' : 'STANDBY'}</span>
        </div>
      </div>

      {/* Content area */}
      <div style={{ padding: 14 }}>
        {/* Waveform display */}
        <div style={{ marginBottom: 12 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
            <span style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 600,
            }}>SIGNAL PREVIEW</span>
            <span style={{
              fontSize: 14,
              fontWeight: 900,
              color: isHovered ? '#22c55e' : 'rgba(255,255,255,0.3)',
              fontFamily: 'system-ui',
              transition: 'color 0.3s ease',
            }}>
              {isHovered ? '▶ START' : '○ IDLE'}
            </span>
          </div>
          <Waveform color={waveformColor} type={waveformType} active={isHovered} />
        </div>

        {/* Info */}
        <div style={{ direction: 'rtl', textAlign: 'right' }}>
          <div style={{
            fontWeight: 800,
            fontSize: 14,
            color: '#fff',
            marginBottom: 6,
            lineHeight: 1.4,
          }}>
            {title}
          </div>
          <div style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.6,
          }}>
            {description}
          </div>
        </div>

        {/* Start button */}
        <div style={{
          marginTop: 14,
          padding: '10px 14px',
          background: isHovered
            ? `linear-gradient(135deg, ${waveformColor}25, ${waveformColor}10)`
            : 'rgba(255,255,255,0.03)',
          border: `1px solid ${isHovered ? `${waveformColor}55` : 'rgba(255,255,255,0.06)'}`,
          borderRadius: 10,
          textAlign: 'center',
          transition: 'all 0.3s ease',
        }}>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: isHovered ? waveformColor : 'rgba(255,255,255,0.45)',
          }}>
            {isHovered ? '🔬 ابدأ الفحص' : '○ متاح'}
          </span>
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        display: 'flex',
        gap: 3,
        padding: '6px 14px 10px',
        justifyContent: 'center',
      }}>
        {[waveformColor, brandCyan, brandPurple].map((color, i) => (
          <div key={i} style={{
            width: 24,
            height: 3,
            borderRadius: 2,
            background: isHovered ? color : 'rgba(255,255,255,0.15)',
            transition: 'all 0.3s ease',
            opacity: isHovered ? 0.8 : 0.4,
          }} />
        ))}
      </div>
    </button>
  );
}

const GameSection = memo(function GameSection() {
  const { mode: visitorMode, config: visitorConfig, isSchool, isParent, isClinician } = useVisitorMode();
  const { isArabic } = useLanguage();

  const [mode, setMode] = useState<GameMode | null>(null);
  const [briefingMode, setBriefingMode] = useState<GameMode | null>(null);
  const [lastOutcome, setLastOutcome] = useState<TestOutcome | null>(null);
  const [modalOutcome, setModalOutcome] = useState<TestOutcome | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isTestActive, setIsTestActive] = useState(false);
  const [showPortal, setShowPortal] = useState(false); // Default to Screening Station view
  const sessionIdRef = useRef<string>(Date.now().toString(36) + Math.random().toString(36).slice(2));
  const outcomesRef = useRef<Partial<Record<string, TestOutcome>>>({});

  useEffect(() => {
    setModalOutcome(null);
    setIsTestActive(false);
    setShowSummary(false);
  }, [mode]);

  // Handle mode selection - show briefing first
  const handleModeSelect = useCallback((selectedMode: GameMode) => {
    setBriefingMode(selectedMode);
  }, []);

  // Start test after briefing
  const handleBriefingStart = useCallback(() => {
    if (briefingMode) {
      setMode(briefingMode);
      setBriefingMode(null);
    }
  }, [briefingMode]);

  // Close briefing
  const handleBriefingClose = useCallback(() => {
    setBriefingMode(null);
  }, []);

  // Save session when outcome changes
  const handleOutcome = useCallback((outcome: TestOutcome) => {
    setLastOutcome(outcome);
    setModalOutcome(outcome);
    setIsTestActive(false);
    setShowSummary(true);

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

  // Handle retry from summary
  const handleRetry = useCallback(() => {
    setShowSummary(false);
    setModalOutcome(null);
  }, []);

  // Handle close summary and test modal
  const handleCloseSummary = useCallback(() => {
    setShowSummary(false);
    setMode(null);
    setModalOutcome(null);
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
              aria-label={showPortal ? 'Switch to Screening Station view' : 'Switch to Portal view'}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                background: !showPortal
                  ? `linear-gradient(135deg, ${brandCyan}22, ${brandPink}22)`
                  : 'rgba(255,255,255,0.08)',
                border: `1px solid ${!showPortal ? brandCyan : 'rgba(255,255,255,0.2)'}`,
                color: !showPortal ? brandCyan : 'rgba(255,255,255,0.7)',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {showPortal ? '🔬 Screening Station' : '🎮 Portal View'}
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
            onSelectMode={(m) => handleModeSelect(m as GameMode)}
            lastOutcome={lastOutcome}
          />
        </div>
      )}

      {/* Screening Station - Advanced Lab Tech View */}
      {!showPortal && (
      <div style={{
        marginTop: 20,
        padding: 20,
        background: 'linear-gradient(180deg, #1a1f2e 0%, #0d1117 100%)',
        borderRadius: 20,
        boxShadow: '0 15px 40px rgba(0,0,0,0.4), 0 0 60px rgba(143,211,204,0.08)',
        border: '1px solid rgba(143,211,204,0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Lab tech glow effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${brandCyan}, ${brandPink}, ${brandPurple}, transparent)`,
          opacity: 0.6,
        }} />

        {/* Monitor top bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          padding: '8px 16px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${brandCyan}22, ${brandPink}22)`,
              border: `1px solid ${brandCyan}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}>
              🔬
            </div>
            <div>
              <div style={{ fontSize: 13, color: brandCyan, fontWeight: 800, letterSpacing: '0.5px' }}>
                LOTUS SCREENING STATION
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>
                BERARD AIT SOUND LAB • PROFESSIONAL GRADE
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 8,
            }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#22c55e',
                animation: 'blink 2s ease-in-out infinite',
                boxShadow: '0 0 8px #22c55e',
              }} />
              <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>SYSTEM READY</span>
            </div>
            <div style={{
              padding: '6px 12px',
              background: 'rgba(143,211,204,0.08)',
              border: '1px solid rgba(143,211,204,0.2)',
              borderRadius: 8,
              fontSize: 10,
              color: brandCyan,
              fontWeight: 700,
            }}>
              5 MODULES
            </div>
          </div>
        </div>

        {/* Main monitor display */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(26,31,46,0.9) 0%, rgba(13,17,23,0.95) 100%)',
          borderRadius: 16,
          padding: 24,
          border: '1px solid rgba(143,211,204,0.1)',
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.4)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Grid pattern overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(143,211,204,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(143,211,204,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
            opacity: 0.5,
          }} />

          {/* Best experience notice - Lab Tech Style */}
          <div style={{
            marginBottom: 24,
            padding: 16,
            background: 'linear-gradient(135deg, rgba(143,211,204,0.08), rgba(175,132,186,0.05))',
            border: '1px solid rgba(143,211,204,0.2)',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Animated border glow */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${brandCyan}66, transparent)`,
            }} />
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${brandCyan}22, ${brandPurple}22)`,
              border: `1px solid ${brandCyan}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}>
              🎧
            </div>
            <div style={{ flex: 1, direction: 'rtl', textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: brandCyan, marginBottom: 4 }}>
                بيئة الفحص المثالية
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                سماعات عالية الجودة • مستوى صوت مريح • مكان هادئ
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: 8,
            }}>
              {[
                { emoji: '🔊', label: 'صوت' },
                { emoji: '🎧', label: 'سماعات' },
                { emoji: '🤫', label: 'هدوء' },
              ].map((item, i) => (
                <div key={i} style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  transition: 'all 0.2s ease',
                }}>
                  <span style={{ fontSize: 16 }}>{item.emoji}</span>
                  <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                    {item.label}
                  </span>
                </div>
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
                onClick={() => handleModeSelect(c.mode)}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Quick Access Bar */}
        <div style={{
          marginTop: 20,
          padding: 16,
          background: 'rgba(0,0,0,0.3)',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.5px' }}>
              QUICK ACCESS
            </span>
            <span style={{ fontSize: 10, color: brandCyan, fontWeight: 600 }}>
              5 MODULES AVAILABLE
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}>
            {[
              { color: '#22c55e', label: 'FULL SUITE', icon: '🧪' },
              { color: '#3B82F6', label: 'ATTENTION', icon: '🎯' },
              { color: '#8B5CF6', label: 'FREQUENCY', icon: '🎚️' },
              { color: '#F59E0B', label: 'SEQUENCE', icon: '🏫' },
              { color: brandPink, label: 'SURVEY', icon: '📝' },
            ].map((btn, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleModeSelect(cards[i].mode)}
                aria-label={`Start ${btn.label} test`}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${btn.color}44`,
                  cursor: 'pointer',
                  boxShadow: 'none',
                  fontSize: 10,
                  fontWeight: 700,
                  color: btn.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${btn.color}18`;
                  e.currentTarget.style.borderColor = btn.color;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = `${btn.color}44`;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>{btn.icon}</span>
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Screening Results Dashboard */}
      <div style={{ marginTop: spacing[5] }}>
        <ScreeningDashboard />
      </div>

      {/* Last Result Display - Lab Tech Style */}
      {lastOutcome && lastMeta && lastNext ? (
        <div style={{
          marginTop: 24,
          padding: 20,
          background: 'linear-gradient(180deg, #1a1f2e 0%, #0d1117 100%)',
          borderRadius: 18,
          boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(143,211,204,0.12)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Top glow */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${lastMeta.color}, transparent)`,
            opacity: 0.6,
          }} />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            alignItems: 'center',
            direction: 'rtl',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 12,
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `${lastMeta.color}18`,
                  border: `1px solid ${lastMeta.color}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: lastMeta.color,
                    animation: 'blink 1.5s ease-in-out infinite',
                    boxShadow: `0 0 12px ${lastMeta.color}`,
                  }} />
                </div>
                <div>
                  <div style={{
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    marginBottom: 2,
                  }}>
                    LAST RESULT
                  </div>
                  <span style={{ fontWeight: 900, color: lastMeta.color, fontSize: 18 }}>
                    {lastOutcome.title}
                  </span>
                </div>
              </div>
              <div style={{
                padding: '12px 16px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                  {lastOutcome.scoreLabel}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4, lineHeight: 1.5 }}>
                  {lastOutcome.message}
                </div>
              </div>
            </div>
            <a
              href={lastNext.hash}
              style={{
                ...styles.primaryBtn,
                textDecoration: 'none',
                background: `linear-gradient(135deg, ${brandPurpleDark}, ${lastNext.tone})`,
                boxShadow: `0 8px 24px ${lastNext.tone}33`,
                padding: '14px 24px',
                fontSize: 14,
                borderRadius: 12,
              }}
            >
              {lastNext.label}
            </a>
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
        {modalOutcome && showSummary ? (
          <PostTestSummary
            outcome={modalOutcome}
            onClose={handleCloseSummary}
            onRetry={handleRetry}
          />
        ) : modalOutcome ? (
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
        {modalOutcome && showSummary ? (
          <PostTestSummary
            outcome={modalOutcome}
            onClose={handleCloseSummary}
            onRetry={handleRetry}
          />
        ) : modalOutcome ? (
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
        {modalOutcome && showSummary ? (
          <PostTestSummary
            outcome={modalOutcome}
            onClose={handleCloseSummary}
            onRetry={handleRetry}
          />
        ) : modalOutcome ? (
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
        {modalOutcome && showSummary ? (
          <PostTestSummary
            outcome={modalOutcome}
            onClose={handleCloseSummary}
            onRetry={handleRetry}
          />
        ) : modalOutcome ? (
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

      {/* Pre-Test Briefing Modal */}
      {briefingMode && (
        <PreTestBriefing
          testType={briefingMode}
          open={!!briefingMode}
          onClose={handleBriefingClose}
          onStart={handleBriefingStart}
        />
      )}

      {/* Visitor Mode Indicator */}
      <div style={{
        marginTop: spacing[4],
        padding: spacing[4],
        background: `${visitorConfig.color}08`,
        border: `1px solid ${visitorConfig.color}20`,
        borderRadius: radius.xl,
        display: 'flex',
        alignItems: 'center',
        gap: spacing[4],
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: radius.lg,
          background: `${visitorConfig.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
        }}>
          {visitorConfig.icon}
        </div>
        <div style={{ flex: 1, direction: isArabic ? 'rtl' : 'ltr' }}>
          <div style={{
            fontSize: typography.size.sm,
            fontWeight: typography.weight.bold,
            color: visitorConfig.color,
            marginBottom: spacing[1],
          }}>
            {isArabic
              ? `أنت تستعرض كـ${visitorConfig.labelAr}`
              : `Viewing as ${visitorConfig.label}`}
          </div>
          <div style={{
            fontSize: typography.size.xs,
            color: colors.text.muted,
          }}>
            {isArabic
              ? 'النتائج والتوصيات مخصصة لاحتياجاتك'
              : 'Results and recommendations personalized for your needs'}
          </div>
        </div>
        <a
          href={visitorConfig.ctaPath}
          style={{
            padding: `${spacing[2]}px ${spacing[4]}px`,
            background: `${visitorConfig.color}15`,
            border: `1px solid ${visitorConfig.color}40`,
            borderRadius: radius.lg,
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            color: visitorConfig.color,
            textDecoration: 'none',
            transition: transitions.fast,
          }}
        >
          {isArabic ? visitorConfig.ctaLabelAr : visitorConfig.ctaLabel}
        </a>
      </div>
    </section>
  );
});

export default GameSection;
