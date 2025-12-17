import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  brandCyan,
  brandPurple,
  brandPink,
  brandPurpleDark,
  colors,
  typography,
  spacing,
  radius,
  shadows,
  transitions,
  gradients,
} from './styles';
import { BRAIN_FUNCTIONS, type BrainFunction } from '../data/brainFunctions';
import { useLanguage } from '../context/LanguageContext';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type Pulse = {
  id: string;
  path: 'c1' | 'c2' | 'c3' | 'c4' | 'c5';
  color: string;
  dur: number;
  begin: number;
  r: number;
};

type Ripple = {
  id: string;
  x: number;
  y: number;
  color: string;
};

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = [brandCyan, brandPurple, brandPink];

const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

// Hero translations
const heroText = {
  ar: {
    title: 'استكشف قدرات دماغك',
    subtitle: 'اكتشف كيف يمكن لتدريب Berard AIT أن يُحسّن وظائف الدماغ المختلفة',
    instruction: 'انقر على أي نقطة متوهجة للاستكشاف',
    instructionMobile: 'اضغط على أي نقطة للاستكشاف',
    learnMore: 'تعرف على Berard AIT',
    howItHelps: 'كيف يساعد Berard AIT؟',
    expectedBenefits: 'الفوائد المتوقعة',
    getStarted: 'ابدأ رحلتك مع Berard AIT',
    doYouExperience: 'هل تواجه...',
  },
  en: {
    title: 'Explore Your Brain\'s Potential',
    subtitle: 'Discover how Berard AIT can help optimize different areas of brain function',
    instruction: 'Click any glowing node to explore',
    instructionMobile: 'Tap any node to explore',
    learnMore: 'Learn About Berard AIT',
    howItHelps: 'How Berard AIT Helps',
    expectedBenefits: 'Expected Benefits',
    getStarted: 'Get Started with Berard AIT',
    doYouExperience: 'Do you experience...',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// INFO MODAL COMPONENT - Matches site design patterns
// ═══════════════════════════════════════════════════════════════════════════

const InfoModal = memo(({
  node,
  onClose,
  isArabic,
}: {
  node: BrainFunction | null;
  onClose: () => void;
  isArabic: boolean;
}) => {
  const text = isArabic ? heroText.ar : heroText.en;

  useEffect(() => {
    if (!node) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [node, onClose]);

  if (!node) return null;

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5,6,13,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: spacing[4],
        animation: 'modalFadeIn 0.3s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.surface.overlay,
          borderRadius: radius.xl,
          maxWidth: 680,
          width: '100%',
          maxHeight: '88vh',
          overflow: 'auto',
          position: 'relative',
          border: `1px solid ${colors.border.emphasis}`,
          boxShadow: shadows['2xl'],
          animation: 'modalSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Gradient top border */}
        <div style={{
          height: 3,
          background: `linear-gradient(90deg, ${node.color}, ${brandPurple}, ${brandPink})`,
          borderRadius: `${radius.xl}px ${radius.xl}px 0 0`,
        }} />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="modal-close-btn"
          style={{
            position: 'absolute',
            top: spacing[3],
            [isArabic ? 'left' : 'right']: spacing[3],
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${colors.border.subtle}`,
            fontSize: typography.size.lg,
            cursor: 'pointer',
            color: colors.text.muted,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: radius.md,
            transition: transitions.fast,
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {/* Content */}
        <div style={{ padding: `${spacing[6]}px ${spacing[5]}px` }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[4],
            marginBottom: spacing[5],
            animation: 'contentSlideUp 0.4s ease-out 0.1s both',
          }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: radius.lg,
              background: `linear-gradient(135deg, ${node.color}33, ${node.color}11)`,
              border: `1px solid ${node.color}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              boxShadow: `0 8px 24px ${node.color}22`,
            }}>
              {node.icon}
            </div>
            <div>
              <h2
                id="modal-title"
                style={{
                  margin: 0,
                  fontSize: typography.size['2xl'],
                  fontWeight: typography.weight.black,
                  color: colors.text.primary,
                  fontFamily: typography.fontFamily,
                  lineHeight: typography.lineHeight.tight,
                }}
              >
                {node.content.title}
              </h2>
              <p style={{
                margin: `${spacing[1]}px 0 0`,
                fontSize: typography.size.sm,
                color: node.color,
                fontWeight: typography.weight.semibold,
              }}>
                {node.content.subtitle}
              </p>
            </div>
          </div>

          {/* Questions - Quote style box */}
          <div style={{
            marginBottom: spacing[5],
            padding: spacing[5],
            background: `linear-gradient(135deg, ${node.color}08, ${brandPurple}05)`,
            borderRadius: radius.lg,
            [isArabic ? 'borderRight' : 'borderLeft']: `4px solid ${node.color}`,
            position: 'relative',
            animation: 'contentSlideUp 0.4s ease-out 0.15s both',
          }}>
            <div style={{
              position: 'absolute',
              top: spacing[2],
              [isArabic ? 'right' : 'left']: spacing[3],
              fontSize: 40,
              opacity: 0.15,
              color: node.color,
            }}>
              "
            </div>
            <div style={{
              fontSize: typography.size.xs,
              fontWeight: typography.weight.bold,
              color: colors.text.muted,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: spacing[3],
            }}>
              {text.doYouExperience}
            </div>
            {node.content.questions.map((q, i) => (
              <p
                key={i}
                style={{
                  margin: `0 0 ${spacing[2.5]}px`,
                  fontSize: typography.size.base,
                  lineHeight: typography.lineHeight.relaxed,
                  color: colors.text.secondary,
                }}
              >
                {q}
              </p>
            ))}
          </div>

          {/* Explanation box */}
          <div style={{
            background: `linear-gradient(135deg, ${brandCyan}08, ${brandPurple}05)`,
            borderRadius: radius.lg,
            padding: spacing[5],
            marginBottom: spacing[5],
            border: `1px solid ${brandCyan}22`,
            animation: 'contentSlideUp 0.4s ease-out 0.2s both',
          }}>
            <h3 style={{
              margin: `0 0 ${spacing[2.5]}px`,
              fontSize: typography.size.md,
              fontWeight: typography.weight.bold,
              color: brandCyan,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}>
              <span style={{ fontSize: typography.size.lg }}>💡</span>
              {text.howItHelps}
            </h3>
            <p style={{
              margin: 0,
              fontSize: typography.size.base,
              lineHeight: typography.lineHeight.loose,
              color: colors.text.secondary,
            }}>
              {node.content.explanation}
            </p>
          </div>

          {/* Benefits - Chip style */}
          <div style={{
            marginBottom: spacing[6],
            animation: 'contentSlideUp 0.4s ease-out 0.25s both',
          }}>
            <h3 style={{
              margin: `0 0 ${spacing[3]}px`,
              fontSize: typography.size.md,
              color: colors.text.primary,
              fontWeight: typography.weight.bold,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}>
              <span style={{ fontSize: typography.size.md }}>✨</span>
              {text.expectedBenefits}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2] }}>
              {node.content.benefits.map((benefit, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    padding: `${spacing[2]}px ${spacing[3]}px`,
                    background: `linear-gradient(135deg, ${node.color}15, ${node.color}08)`,
                    border: `1px solid ${node.color}30`,
                    borderRadius: radius.full,
                    fontSize: typography.size.sm,
                    color: colors.text.primary,
                    fontWeight: typography.weight.semibold,
                    animation: `benefitPop 0.3s ease-out ${0.3 + i * 0.05}s both`,
                  }}
                >
                  <span style={{ color: node.color }}>✓</span> {benefit}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Button - Primary style */}
          <div style={{
            textAlign: 'center',
            animation: 'contentSlideUp 0.4s ease-out 0.35s both',
          }}>
            <a
              href="#contact"
              onClick={onClose}
              className="modal-cta-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[2.5],
                padding: `${spacing[3.5]}px ${spacing[6]}px`,
                background: gradients.primary,
                color: colors.surface.base,
                textDecoration: 'none',
                borderRadius: radius.lg,
                fontSize: typography.size.base,
                fontWeight: typography.weight.black,
                fontFamily: typography.fontFamily,
                boxShadow: shadows.glow.cyan,
                transition: transitions.bounce,
                border: 'none',
              }}
            >
              {text.getStarted}
              <span style={{ transform: isArabic ? 'rotate(180deg)' : 'none' }}>→</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(24px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes contentSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes benefitPop {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .modal-close-btn:hover {
          background: rgba(255,255,255,0.12) !important;
          color: ${colors.text.primary} !important;
          transform: rotate(90deg);
        }
        .modal-cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: ${shadows.glow.cyan}, 0 12px 32px rgba(0,0,0,0.3) !important;
        }
        .modal-cta-btn:active {
          transform: translateY(-1px) scale(0.98);
        }
      `}</style>
    </div>
  );
});
InfoModal.displayName = 'InfoModal';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function HeroCircuitBrain() {
  const { isArabic, direction } = useLanguage();
  const text = isArabic ? heroText.ar : heroText.en;

  const [isLoaded, setIsLoaded] = useState(false);
  const [activeNode, setActiveNode] = useState<BrainFunction | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const burstAtNode = useCallback((x: number, y: number) => {
    if (reducedMotion) return;

    const rippleColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const rippleId = uid();
    setRipples((prev) => [...prev.slice(-3), { id: rippleId, x, y, color: rippleColor }]);

    const waves = 2;
    const baseDur = 2;
    const all: Pulse[] = [];
    const paths = ['c1', 'c2', 'c3', 'c4', 'c5'] as const;

    for (let w = 0; w < waves; w++) {
      const waveDelay = w * 0.15;
      paths.forEach((path, i) => {
        const color = COLORS[(w + i) % COLORS.length];
        all.push({
          id: uid(),
          path,
          color,
          dur: baseDur + Math.random() * 1,
          begin: waveDelay + i * 0.05,
          r: 3 + Math.random() * 1.5,
        });
      });
    }

    setPulses((prev) => [...prev.slice(-40), ...all]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);
  }, [reducedMotion]);

  const handleNodeClick = useCallback((node: BrainFunction) => {
    burstAtNode(node.position.x, node.position.y);
    setActiveNode(node);
  }, [burstAtNode]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, node: BrainFunction) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNodeClick(node);
    }
  }, [handleNodeClick]);

  const closeModal = useCallback(() => {
    setActiveNode(null);
  }, []);

  const css = useMemo(() => `
    @keyframes pathFlow {
      0% { stroke-dashoffset: 100; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes brainPulse {
      0%, 100% { filter: drop-shadow(0 0 20px ${brandCyan}40); }
      50% { filter: drop-shadow(0 0 35px ${brandCyan}60); }
    }
    @keyframes scrollHint {
      0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.5; }
      50% { transform: translateX(-50%) translateY(8px); opacity: 1; }
    }
    @keyframes nodeFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
    }
    @keyframes titleEnter {
      from { opacity: 0; transform: translateY(-16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes hintPulse {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    .circuit-brain-container {
      animation: fadeInScale 0.7s ease-out forwards;
    }
    .circuit-brain-svg {
      animation: ${reducedMotion ? 'none' : 'brainPulse 4s ease-in-out infinite'};
    }
    .circuit-node {
      cursor: pointer;
      transition: transform 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .circuit-node:hover, .circuit-node:focus {
      transform: scale(1.12);
    }
    .circuit-node:active {
      transform: scale(0.95);
    }
    .circuit-node:focus {
      outline: none;
    }
    .circuit-node:focus-visible {
      outline: 2px solid ${brandCyan};
      outline-offset: 4px;
    }
    .circuit-path {
      stroke-dasharray: 8 4;
      animation: ${reducedMotion ? 'none' : 'pathFlow 3s linear infinite'};
    }
  `, [reducedMotion]);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: `radial-gradient(ellipse at center, rgba(20,26,45,1) 0%, ${colors.surface.base} 100%)`,
        padding: `${spacing[10]}px ${spacing[4]}px`,
        direction,
      }}
    >
      <style>{css}</style>

      {/* Background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(${brandCyan}08 1px, transparent 1px),
          linear-gradient(90deg, ${brandCyan}08 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
      }} />

      {/* Decorative blurs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        [isArabic ? 'left' : 'right']: '10%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${brandPurple}18, transparent 70%)`,
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        [isArabic ? 'right' : 'left']: '15%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${brandCyan}15, transparent 70%)`,
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />

      {/* Main container */}
      <div
        className="circuit-brain-container"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isLoaded ? 1 : 0,
          zIndex: 1,
        }}
      >
        {/* Hero Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: spacing[4],
          animation: 'titleEnter 0.8s ease-out forwards',
        }}>
          {/* Badge chip */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[1.5]}px ${spacing[4]}px`,
            background: `${brandCyan}12`,
            border: `1px solid ${brandCyan}30`,
            borderRadius: radius.full,
            marginBottom: spacing[3],
          }}>
            <span style={{ fontSize: typography.size.md }}>🧠</span>
            <span style={{
              fontSize: typography.size.xs,
              fontWeight: typography.weight.bold,
              color: brandCyan,
            }}>
              Berard AIT
            </span>
          </div>

          <h1 style={{
            margin: 0,
            fontSize: isMobile ? typography.size['2xl'] : typography.size['4xl'],
            fontWeight: typography.weight.black,
            fontFamily: typography.fontFamily,
            color: colors.text.primary,
            lineHeight: typography.lineHeight.tight,
            letterSpacing: typography.letterSpacing.tight,
          }}>
            {text.title}
          </h1>
          <p style={{
            margin: `${spacing[2]}px auto 0`,
            fontSize: isMobile ? typography.size.base : typography.size.lg,
            color: colors.text.muted,
            fontFamily: typography.fontFamily,
            maxWidth: 480,
            lineHeight: typography.lineHeight.normal,
          }}>
            {text.subtitle}
          </p>
        </div>

        {/* SVG Brain */}
        <svg
          className="circuit-brain-svg"
          width="100%"
          height="auto"
          viewBox="100 70 400 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Interactive brain circuit"
          style={{ maxWidth: 560, touchAction: 'manipulation' }}
        >
          <defs>
            <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={brandCyan} stopOpacity="0.6" />
              <stop offset="50%" stopColor={brandPurple} stopOpacity="0.4" />
              <stop offset="100%" stopColor={brandPink} stopOpacity="0.6" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="blur1" />
              <feGaussianBlur stdDeviation="6" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Brain outline */}
          <path
            d="M300 90 C210 90 140 140 130 210 C120 280 145 350 195 385 C245 420 280 420 300 420 C320 420 355 420 405 385 C455 350 480 280 470 210 C460 140 390 90 300 90Z"
            fill="none"
            stroke="url(#brainGrad)"
            strokeWidth="2"
            opacity="0.15"
          />

          {/* Brain folds */}
          <g stroke={brandCyan} strokeWidth="1" opacity="0.1" fill="none">
            <path d="M160 180 Q230 155 300 175 Q370 195 430 175" />
            <path d="M150 230 Q220 205 300 225 Q380 245 440 225" />
            <path d="M160 280 Q230 255 300 275 Q370 295 430 275" />
            <path d="M180 330 Q250 305 300 325 Q350 345 400 325" />
          </g>

          {/* Circuit paths */}
          <path id="c1" className="circuit-path" d="M160 130 L220 130 L220 150 L270 150" fill="none" stroke={brandCyan} strokeWidth="2" strokeLinecap="round" filter="url(#glow)" />
          <path id="c2" className="circuit-path" d="M270 150 L330 150 L330 120 L380 120" fill="none" stroke={brandPurple} strokeWidth="2" strokeLinecap="round" filter="url(#glow)" style={{ animationDelay: '0.5s' }} />
          <path id="c3" className="circuit-path" d="M380 120 L420 120 L420 180 L440 180 L440 260 L450 260" fill="none" stroke={brandPink} strokeWidth="2" strokeLinecap="round" filter="url(#glow)" style={{ animationDelay: '1s' }} />
          <path id="c4" className="circuit-path" d="M450 260 L450 330 L420 330 L320 350 L220 340 L150 280" fill="none" stroke={brandCyan} strokeWidth="2" strokeLinecap="round" filter="url(#glow)" style={{ animationDelay: '1.5s' }} />
          <path id="c5" className="circuit-path" d="M150 280 L150 200 L180 200" fill="none" stroke={brandPurple} strokeWidth="2" strokeLinecap="round" filter="url(#glow)" style={{ animationDelay: '2s' }} />

          {/* Secondary traces */}
          <g stroke={brandCyan} strokeWidth="1" opacity="0.2" strokeDasharray="4 2">
            <path d="M270 150 L270 200 L180 200" />
            <path d="M380 120 L380 180 L440 180" />
            <path d="M420 330 L420 260 L450 260" />
            <path d="M220 340 L220 280 L150 280" />
          </g>

          {/* Ripples */}
          <g>
            {ripples.map((r) => (
              <circle
                key={r.id}
                cx={r.x}
                cy={r.y}
                r="2"
                fill="transparent"
                stroke={r.color}
                strokeWidth="2"
                style={{ filter: `drop-shadow(0 0 8px ${r.color})` }}
              >
                <animate attributeName="r" values="2;40" dur="0.6s" fill="freeze" />
                <animate attributeName="opacity" values="0.7;0" dur="0.6s" fill="freeze" />
              </circle>
            ))}
          </g>

          {/* Pulses */}
          <g opacity="0.8">
            {pulses.map((p) => (
              <circle
                key={p.id}
                r={p.r}
                fill={p.color}
                style={{ filter: `drop-shadow(0 0 6px ${p.color})` }}
              >
                <animate attributeName="opacity" values="0;1;0.2;0" dur={`${p.dur}s`} begin={`${p.begin}s`} fill="freeze" />
                <animateMotion dur={`${p.dur}s`} begin={`${p.begin}s`} repeatCount="1" fill="freeze">
                  <mpath href={`#${p.path}`} />
                </animateMotion>
              </circle>
            ))}
          </g>

          {/* Interactive nodes */}
          <g filter="url(#nodeGlow)">
            {BRAIN_FUNCTIONS.map((node, index) => {
              const isHovered = hoveredNode === node.id;
              const color = node.color;
              const label = isArabic ? node.labelAr : node.labelEn;

              const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
                e.stopPropagation();
                handleNodeClick(node);
              };

              return (
                <g
                  key={node.id}
                  className="circuit-node"
                  onClick={handleClick}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleClick(e);
                    setTimeout(() => setHoveredNode(null), 100);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, node)}
                  onMouseEnter={() => !isMobile && setHoveredNode(node.id)}
                  onMouseLeave={() => !isMobile && setHoveredNode(null)}
                  onTouchStart={() => setHoveredNode(node.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${label} - ${isArabic ? 'اضغط لمعرفة المزيد' : 'Click to learn more'}`}
                  style={{
                    animation: reducedMotion ? 'none' : `nodeFloat ${2.5 + index * 0.15}s ease-in-out infinite`,
                  }}
                >
                  {/* Hit area */}
                  <circle
                    cx={node.position.x}
                    cy={node.position.y}
                    r={node.position.r + 12}
                    fill="rgba(0,0,0,0.001)"
                    stroke="none"
                    style={{ cursor: 'pointer' }}
                  />
                  {/* Outer ring */}
                  <circle
                    cx={node.position.x}
                    cy={node.position.y}
                    r={node.position.r + 6}
                    fill="none"
                    stroke={color}
                    strokeWidth={isHovered ? 2 : 1}
                    opacity={isHovered ? 0.6 : 0.25}
                    style={{ transition: 'all 0.2s ease', pointerEvents: 'none' }}
                  />
                  {/* Main circle */}
                  <circle
                    cx={node.position.x}
                    cy={node.position.y}
                    r={node.position.r}
                    fill={isHovered ? `${color}40` : `${color}20`}
                    stroke={color}
                    strokeWidth="2"
                    style={{
                      filter: `drop-shadow(0 0 ${isHovered ? 14 : 8}px ${color})`,
                      transition: 'all 0.2s ease',
                    }}
                  />
                  {/* Inner dot */}
                  <circle
                    cx={node.position.x}
                    cy={node.position.y}
                    r={node.position.r * 0.35}
                    fill={color}
                    opacity="0.85"
                  >
                    {!reducedMotion && (
                      <animate
                        attributeName="r"
                        values={`${node.position.r * 0.28};${node.position.r * 0.4};${node.position.r * 0.28}`}
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    )}
                  </circle>
                  {/* Label */}
                  <text
                    x={node.position.x}
                    y={node.position.y + node.position.r + 18}
                    fill={color}
                    fontSize="10"
                    fontWeight="700"
                    textAnchor="middle"
                    style={{
                      fontFamily: typography.fontFamily,
                      pointerEvents: 'none',
                      opacity: isHovered ? 1 : 0.7,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Floating particles */}
          {!reducedMotion && (
            <g opacity="0.35">
              {[0, 1, 2, 3].map((i) => (
                <circle key={`p-${i}`} r="1.5" fill={COLORS[i % COLORS.length]}>
                  <animate attributeName="cx" values={`${150 + i * 70};${190 + i * 50};${150 + i * 70}`} dur={`${5 + i}s`} repeatCount="indefinite" />
                  <animate attributeName="cy" values={`${120 + i * 50};${170 + i * 40};${120 + i * 50}`} dur={`${6 + i}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.25;0.5;0.25" dur={`${4 + i}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
          )}
        </svg>

        {/* Instruction hint */}
        <div
          style={{
            marginTop: spacing[4],
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing[2],
            padding: `${spacing[2.5]}px ${spacing[5]}px`,
            background: `${brandCyan}10`,
            borderRadius: radius.full,
            border: `1px solid ${brandCyan}20`,
          }}
        >
          <span style={{
            display: 'inline-block',
            animation: reducedMotion ? 'none' : 'hintPulse 1.5s ease-in-out infinite',
          }}>
            👆
          </span>
          <p
            style={{
              margin: 0,
              color: colors.text.secondary,
              fontSize: typography.size.sm,
              fontFamily: typography.fontFamily,
              fontWeight: typography.weight.medium,
            }}
          >
            {isMobile ? text.instructionMobile : text.instruction}
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: spacing[6],
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: reducedMotion ? 'none' : 'scrollHint 2s ease-in-out infinite',
        zIndex: 10,
      }}>
        <div style={{
          width: 20,
          height: 32,
          border: `2px solid ${brandCyan}30`,
          borderRadius: 10,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 6,
        }}>
          <div style={{ width: 3, height: 6, background: brandCyan, borderRadius: 2, opacity: 0.6 }} />
        </div>
      </div>

      {/* Info Modal */}
      <InfoModal node={activeNode} onClose={closeModal} isArabic={isArabic} />
    </section>
  );
}
