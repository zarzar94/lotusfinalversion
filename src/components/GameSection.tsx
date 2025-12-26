import { useEffect, useMemo, useState, useRef, useCallback, memo } from 'react';

import { brandCyan, brandPink, brandPurple, brandPurpleDark, styles, colors, radius, spacing, typography, transitions, modalScale } from './styles';
import LabCard from './labui/LabCard';
import LabButton from './labui/LabButton';
import LabButtonAnchor from './labui/LabButtonAnchor';
import {
  BrainCircuitIcon,
  WaveformIcon,
  SpectrogramIcon,
  HeadsetIcon,
  ReportIcon,
  SchoolIcon,
  ShieldMedicalIcon,
  PlayIcon,
  CircleIcon,
  MicroscopeIcon,
  XIcon,
} from './icons/index';

import AssessmentSuiteModal from './games/AssessmentSuiteModal';
import AttentionTestPanel from './games/AttentionTestPanel';
import FocusedAttentionTestPanel from './games/FocusedAttentionTestPanel';
import FrequencyDiscriminationTestPanel from './games/FrequencyDiscriminationTestPanel';
import SequencingTestPanel from './games/SequencingTestPanel';
import DichoticListeningTestPanel from './games/DichoticListeningTestPanel';
import SpeechInNoiseTestPanel from './games/SpeechInNoiseTestPanel';
import QuestionnairePanel from './games/QuestionnairePanel';
import GamePortal from './games/GamePortal';
import PreTestBriefing from './games/PreTestBriefing';
import PostTestSummary from './games/PostTestSummary';
import ScreeningDashboard from './games/ScreeningDashboard';
import type { GameResult, TestOutcome } from './games/types';
import { resultMeta } from './games/types';
import { saveSession, type StoredSession } from './games/scoring';
import { saveSession as saveLabSession } from '../utils/sessionStorage';
import { buildLabMetrics } from '../utils/labMetrics';
import { useVisitorMode } from '../context/VisitorModeContext';
import { useLanguage } from '../context/LanguageContext';

type GameMode =
  | 'suite'
  | 'attention'
  | 'focused_attention'
  | 'frequency'
  | 'sequence'
  | 'dichotic_listening'
  | 'speech_in_noise'
  | 'questionnaire';

const nextStepFrom = (r: GameResult, t: (key: string) => string) => {
  if (r === 'low') return { label: t('games.nextStep.low'), hash: '/contact#contact', tone: brandPink };
  if (r === 'medium') return { label: t('games.nextStep.medium'), hash: '#games', tone: brandPurple };
  return { label: t('games.nextStep.high'), hash: '/partners#schools', tone: brandCyan };
};

type CardLabels = {
  moduleLabel: string;
  signalPreview: string;
  statusReady: string;
  statusStandby: string;
  statusActive: string;
  statusIdle: string;
  outputsLabel: string;
  disclaimer: string;
  startModule: string;
  available: string;
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
  const { t, direction } = useLanguage();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
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
      <div style={{ width: '100%', maxWidth: 920, transform: `scale(${modalScale})`, transformOrigin: 'center' }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxHeight: '90vh',
            background: 'linear-gradient(180deg, #1a1f2e 0%, #0d1117 100%)',
            borderRadius: 24,
            padding: 0,
            boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 80px ${waveformColor}15`,
            position: 'relative',
            overflow: 'hidden',
            border: `1px solid ${waveformColor}22`,
            display: 'flex',
            flexDirection: 'column',
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
              <ShieldMedicalIcon size={20} tone="muted" style={{ color: waveformColor }} />
            </div>
            <div>
              <div style={{ fontSize: 14, color: waveformColor, fontWeight: 800 }}>
                {t('games.lab.screeningStation')}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>
                {title} • {t('games.lab.nonDiagnostic')}
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
              aria-label={t('games.close')}
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
              <XIcon size={16} tone="error" />
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
                {title} {t('games.lab.signalLabel')}
              </span>
              <span style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 600,
              }}>
                {t('games.lab.livePreview')}
              </span>
            </div>
            <Waveform color={waveformColor} type={waveformType} active={isActive} />
          </div>

          {/* Stats panel */}
          <div style={{ padding: 20, background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 9, color: waveformColor, marginBottom: 3, letterSpacing: '0.5px' }}>{t('games.lab.statusLabel')}</div>
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
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 3, letterSpacing: '0.5px' }}>{t('games.lab.modeLabel')}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{t('games.lab.screeningMode')}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 3, letterSpacing: '0.5px' }}>{t('games.lab.typeLabel')}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: waveformColor }}>{t('games.lab.nonDiagnostic')}</div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div style={{
          padding: 24,
          flex: '1 1 auto',
          minHeight: 0,
          overflowY: 'auto',
          direction,
          textAlign: direction === 'rtl' ? 'right' : 'left',
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
              {t('games.lab.soundLab')}
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
    </div>
  );
}

// Test card styled as advanced lab module
function TestCard({
  title,
  description,
  tag,
  outputs,
  labels,
  waveformColor,
  waveformType,
  onClick,
  index,
}: {
  title: string;
  description: string;
  tag: string;
  outputs: string[];
  labels: CardLabels;
  waveformColor: string;
  waveformType: 'ecg' | 'spo2' | 'resp' | 'audio';
  onClick: () => void;
  index: number;
}) {
  const { isArabic, t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`${labels.startModule}: ${title}`}
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
        }}>{labels.moduleLabel}: {tag}</span>
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
          }}>{isHovered ? labels.statusReady : labels.statusStandby}</span>
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
            }}>{labels.signalPreview}</span>
            <span style={{
              fontSize: 14,
              fontWeight: 900,
              color: isHovered ? '#22c55e' : 'rgba(255,255,255,0.3)',
              fontFamily: 'system-ui',
              transition: 'color 0.3s ease',
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {isHovered ? (
                  <PlayIcon size={12} tone="muted" style={{ color: '#22c55e' }} />
                ) : (
                  <CircleIcon size={12} tone="muted" style={{ color: 'rgba(255,255,255,0.3)' }} />
                )}
                <span>{isHovered ? labels.statusActive : labels.statusIdle}</span>
              </span>
            </span>
          </div>
          <Waveform color={waveformColor} type={waveformType} active={isHovered} />
        </div>

        {/* Info */}
        <div style={{ direction: isArabic ? 'rtl' : 'ltr', textAlign: 'start' }}>
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

        {/* Outputs + disclaimer */}
        <div style={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          direction: isArabic ? 'rtl' : 'ltr',
          textAlign: 'start',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}>
            <span style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 700,
            }}>
              {labels.outputsLabel}
            </span>
            {outputs.map((output) => (
              <span
                key={output}
                style={{
                  padding: '4px 8px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.75)',
                }}
              >
                {output}
              </span>
            ))}
          </div>
          <span style={{
            alignSelf: isArabic ? 'flex-end' : 'flex-start',
            padding: '4px 10px',
            borderRadius: 999,
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.3)',
            fontSize: 10,
            fontWeight: 700,
            color: '#fecaca',
          }}>
            {labels.disclaimer}
          </span>
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
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {isHovered ? (
                <MicroscopeIcon size={14} tone="muted" style={{ color: waveformColor }} />
              ) : (
                <CircleIcon size={12} tone="muted" style={{ color: 'rgba(255,255,255,0.45)' }} />
              )}
              <span>{isHovered ? labels.startModule : labels.available}</span>
            </span>
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
  const { isArabic, t } = useLanguage();

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

    const labMetrics = buildLabMetrics(outcome, sessionIdRef.current);
    saveLabSession(labMetrics);
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

  const cardLabels = useMemo(() => ({
    moduleLabel: t('games.moduleLabel'),
    signalPreview: t('games.signalPreview'),
    statusReady: t('games.moduleStatusReady'),
    statusStandby: t('games.moduleStatusStandby'),
    statusActive: t('games.moduleStatusActive'),
    statusIdle: t('games.moduleStatusIdle'),
    outputsLabel: t('games.outputsLabel'),
    disclaimer: t('games.nonDiagnostic'),
    startModule: t('games.startModule'),
    available: t('games.available'),
  }), [t]);

  const outputLabels = useMemo(() => ({
    rt: t('games.outputs.rt'),
    accuracy: t('games.outputs.accuracy'),
    threshold: t('games.outputs.threshold'),
    span: t('games.outputs.span'),
    score: t('games.outputs.score'),
    profile: t('games.outputs.profile'),
  }), [t]);

  const resultLabels = useMemo(() => ({
    high: t('games.resultMeta.high.label'),
    medium: t('games.resultMeta.medium.label'),
    low: t('games.resultMeta.low.label'),
  }), [t]);

  const cards = useMemo(
    () => [
      {
        mode: 'suite' as const,
        title: t('games.modules.suite.name'),
        fullTitle: t('games.cards.suite.fullTitle'),
        desc: t('games.modules.suite.measure'),
        outputs: [outputLabels.rt, outputLabels.accuracy, outputLabels.threshold, outputLabels.span],
        tag: t('games.tags.suite'),
        color: '#22c55e',
        waveType: 'ecg' as const,
      },
      {
        mode: 'attention' as const,
        title: t('games.modules.attention.name'),
        fullTitle: t('games.cards.attention.fullTitle'),
        desc: t('games.modules.attention.measure'),
        outputs: [outputLabels.rt, outputLabels.accuracy],
        tag: t('games.tags.attention'),
        color: '#3B82F6',
        waveType: 'spo2' as const,
      },
      {
        mode: 'focused_attention' as const,
        title: t('games.cards.focusedAttention.title', 'Focused Attention Test'),
        fullTitle: t('games.cards.focusedAttention.fullTitle', 'Focused Attention Test (CPT / Odd-One-Out)'),
        desc: t('games.cards.focusedAttention.desc', 'Measures sustained attention consistency over time'),
        outputs: [outputLabels.rt, outputLabels.accuracy],
        tag: t('games.focusedAttention'),
        color: '#0EA5E9',
        waveType: 'spo2' as const,
      },
      {
        mode: 'frequency' as const,
        title: t('games.modules.frequency.name'),
        fullTitle: t('games.cards.frequency.fullTitle'),
        desc: t('games.modules.frequency.measure'),
        outputs: [outputLabels.threshold, outputLabels.accuracy, outputLabels.rt],
        tag: t('games.tags.frequency'),
        color: '#8B5CF6',
        waveType: 'audio' as const,
      },
      {
        mode: 'sequence' as const,
        title: t('games.modules.sequence.name'),
        fullTitle: t('games.cards.sequence.fullTitle'),
        desc: t('games.modules.sequence.measure'),
        outputs: [outputLabels.span, outputLabels.accuracy, outputLabels.rt],
        tag: t('games.tags.sequence'),
        color: '#F59E0B',
        waveType: 'resp' as const,
      },
      {
        mode: 'dichotic_listening' as const,
        title: t('games.cards.dichotic.title', 'Dichotic Listening Test'),
        fullTitle: t('games.cards.dichotic.fullTitle', 'Dichotic listening + integration/separation'),
        desc: t('games.cards.dichotic.desc', 'Assesses ear balance and separation accuracy'),
        outputs: [outputLabels.accuracy, outputLabels.profile],
        tag: t('games.dichoticListening'),
        color: '#10B981',
        waveType: 'audio' as const,
      },
      {
        mode: 'speech_in_noise' as const,
        title: t('games.cards.speechInNoise.title', 'Speech in Noise'),
        fullTitle: t('games.cards.speechInNoise.fullTitle', 'Speech-in-noise + adaptive SNR'),
        desc: t('games.cards.speechInNoise.desc', 'Measures speech understanding with changing noise'),
        outputs: [outputLabels.threshold, outputLabels.accuracy],
        tag: t('games.speechInNoise'),
        color: '#F97316',
        waveType: 'resp' as const,
      },
      {
        mode: 'questionnaire' as const,
        title: t('games.modules.questionnaire.name'),
        fullTitle: t('games.cards.questionnaire.fullTitle'),
        desc: t('games.modules.questionnaire.measure'),
        outputs: [outputLabels.score, outputLabels.profile],
        tag: t('games.tags.questionnaire'),
        color: brandPink,
        waveType: 'ecg' as const,
      },
    ],
    [outputLabels, t]
  );
  const activeCard = cards.find(c => c.mode === mode);
  const lastMeta = lastOutcome ? resultMeta[lastOutcome.result] : null;
  const lastNext = lastOutcome ? nextStepFrom(lastOutcome.result, t) : null;
  const modulesAvailableLabel = t('gameSection.modulesAvailable', '{count} Modules Available');

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
          <h2 style={styles.h2}>{t('games.labModulesTitle')}</h2>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={() => setShowPortal(!showPortal)}
              aria-label={showPortal ? t('games.labToggleAriaStation') : t('games.labToggleAriaPortal')}
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
              {showPortal ? t('games.labToggleStation') : t('games.labTogglePortal')}
            </button>
            <span style={{
              ...styles.chip,
              background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(59,130,246,0.2))',
              borderColor: 'rgba(34,197,94,0.4)',
            }}>
              {t('games.labBadge')}
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
              <ShieldMedicalIcon size={18} tone="cyan" />
            </div>
            <div>
              <div style={{ fontSize: 13, color: brandCyan, fontWeight: 800, letterSpacing: '0.5px' }}>
                {t('games.lab.screeningStation')}
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>
                {t('games.lab.professionalGrade')}
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
              <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>{t('games.lab.systemReady')}</span>
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
              {t('games.lab.modulesCount')}
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
              <HeadsetIcon size={24} tone="cyan" />
            </div>
            <div style={{ flex: 1, direction: isArabic ? 'rtl' : 'ltr', textAlign: 'start' }}>
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
              {([
                { Icon: WaveformIcon, label: 'صوت', tone: 'cyan' },
                { Icon: HeadsetIcon, label: 'سماعات', tone: 'purple' },
                { Icon: ShieldMedicalIcon, label: 'هدوء', tone: 'pink' },
              ] as const).map((item, i) => (
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
                  <item.Icon size={16} tone={item.tone} />
                  <span style={{ fontSize: typography.size.xxs, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Full suite CTA */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
            <LabButton
              onClick={() => {
                setBriefingMode(null);
                setMode('suite');
              }}
              style={{
                background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
                padding: `${spacing[3]}px ${spacing[4]}px`,
              }}
            >
              {t('games.startFullSuite')}
            </LabButton>
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
                outputs={c.outputs}
                labels={cardLabels}
                waveformColor={c.color}
                waveformType={c.waveType}
                onClick={() => handleModeSelect(c.mode)}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Quick Access Bar */}
        <LabCard
          variant="panel"
          padding={spacing[4]}
          style={{
            marginTop: spacing[5],
            background: colors.surface.overlay,
            border: `1px solid ${colors.border.subtle}`,
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.5px' }}>
              {t('games.quickAccessLabel')}
            </span>
            <span style={{ fontSize: 10, color: brandCyan, fontWeight: 600 }}>
              {modulesAvailableLabel.replace('{count}', String(cards.length))}
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
              {
                mode: 'suite',
                color: '#22c55e',
                label: t('games.tags.suite'),
                icon: <BrainCircuitIcon size={14} tone="muted" style={{ color: '#22c55e' }} />,
              },
              {
                mode: 'attention',
                color: '#3B82F6',
                label: t('games.tags.attention'),
                icon: <WaveformIcon size={14} tone="muted" style={{ color: '#3B82F6' }} />,
              },
              {
                mode: 'focused_attention',
                color: '#0EA5E9',
                label: t('games.focusedAttention'),
                icon: <BrainCircuitIcon size={14} tone="muted" style={{ color: '#0EA5E9' }} />,
              },
              {
                mode: 'frequency',
                color: '#8B5CF6',
                label: t('games.tags.frequency'),
                icon: <SpectrogramIcon size={14} tone="muted" style={{ color: '#8B5CF6' }} />,
              },
              {
                mode: 'sequence',
                color: '#F59E0B',
                label: t('games.tags.sequence'),
                icon: <SchoolIcon size={14} tone="muted" style={{ color: '#F59E0B' }} />,
              },
              {
                mode: 'dichotic_listening',
                color: '#10B981',
                label: t('games.dichoticListening'),
                icon: <HeadsetIcon size={14} tone="muted" style={{ color: '#10B981' }} />,
              },
              {
                mode: 'speech_in_noise',
                color: '#F97316',
                label: t('games.speechInNoise'),
                icon: <WaveformIcon size={14} tone="muted" style={{ color: '#F97316' }} />,
              },
              {
                mode: 'questionnaire',
                color: brandPink,
                label: t('games.tags.questionnaire'),
                icon: <ReportIcon size={14} tone="muted" style={{ color: brandPink }} />,
              },
            ].map((btn) => (
              <button
                key={btn.mode}
                type="button"
                onClick={() => handleModeSelect(btn.mode as GameMode)}
                aria-label={`${t('games.startModule')}: ${btn.label}`}
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
        </LabCard>
      </div>
      )}

      {/* Screening Results Dashboard */}
      <div style={{ marginTop: spacing[5] }}>
        <ScreeningDashboard />
      </div>

      {/* Last Result Display - Lab Tech Style */}
      {lastOutcome && lastMeta && lastNext ? (
        <LabCard
          variant="panel"
          padding={spacing[4]}
          style={{
            marginTop: spacing[6],
            background: 'linear-gradient(180deg, #1a1f2e 0%, #0d1117 100%)',
            border: '1px solid rgba(143,211,204,0.12)',
            boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
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
            direction: isArabic ? 'rtl' : 'ltr',
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
                    {t('games.lastResultLabel')}
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
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
                  {t('clinical.disclaimer')}
                </div>
              </div>
            </div>
            <LabButtonAnchor
              href={lastNext.hash}
              variant="primary"
              style={{
                background: `linear-gradient(135deg, ${brandPurpleDark}, ${lastNext.tone})`,
                boxShadow: `0 8px 24px ${lastNext.tone}33`,
                padding: '14px 24px',
                fontSize: 14,
                borderRadius: 12,
              }}
            >
              {lastNext.label}
            </LabButtonAnchor>
          </div>
        </LabCard>
      ) : null}

      {/* Suite Modal */}
      <AssessmentSuiteModal open={mode === 'suite'} onClose={() => setMode(null)} />

      {/* Individual Test Modals with Medical Monitor Frame */}
      <MedicalMonitor
        open={mode === 'attention'}
        onClose={() => setMode(null)}
        title={t('games.cards.attention.fullTitle')}
        waveformColor="#3B82F6"
        waveformType="spo2"
        statusText={isTestActive ? t('games.lab.statusTesting') : t('games.moduleStatusReady')}
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
              {t('games.resultLabel')} {resultLabels[modalOutcome.result]}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              {modalOutcome.scoreLabel}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              {t('clinical.disclaimer')}
            </div>
          </div>
        ) : null}
      </MedicalMonitor>

      <MedicalMonitor
        open={mode === 'frequency'}
        onClose={() => setMode(null)}
        title={t('games.cards.frequency.fullTitle')}
        waveformColor="#8B5CF6"
        waveformType="audio"
        statusText={isTestActive ? t('games.lab.statusTesting') : t('games.moduleStatusReady')}
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
              {t('games.resultLabel')} {resultLabels[modalOutcome.result]}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              {modalOutcome.scoreLabel}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              {t('clinical.disclaimer')}
            </div>
          </div>
        ) : null}
      </MedicalMonitor>

      <MedicalMonitor
        open={mode === 'sequence'}
        onClose={() => setMode(null)}
        title={t('games.cards.sequence.fullTitle')}
        waveformColor="#F59E0B"
        waveformType="resp"
        statusText={isTestActive ? t('games.lab.statusTesting') : t('games.moduleStatusReady')}
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
              {t('games.resultLabel')} {resultLabels[modalOutcome.result]}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              {modalOutcome.scoreLabel}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              {t('clinical.disclaimer')}
            </div>
          </div>
        ) : null}
      </MedicalMonitor>

      <MedicalMonitor
        open={mode === 'questionnaire'}
        onClose={() => setMode(null)}
        title={t('games.cards.questionnaire.fullTitle')}
        waveformColor={brandPink}
        waveformType="ecg"
        statusText={isTestActive ? t('games.lab.statusActive') : t('games.moduleStatusReady')}
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
              {t('games.resultLabel')} {resultLabels[modalOutcome.result]}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              {modalOutcome.scoreLabel}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              {t('clinical.disclaimer')}
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
      <LabCard
        variant="surface"
        padding={spacing[4]}
        style={{
          marginTop: spacing[4],
          background: `${visitorConfig.color}08`,
          border: `1px solid ${visitorConfig.color}20`,
          display: 'flex',
          alignItems: 'center',
          gap: spacing[4],
        }}
      >
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
            {t('auto.GameSection.k30', "Results and recommendations personalized for your needs")}
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
          {isArabic ? t(visitorConfig.ctaLabelAr, visitorConfig.ctaLabel) : visitorConfig.ctaLabel}
        </a>
      </LabCard>
    </section>
  );
});

export default GameSection;
