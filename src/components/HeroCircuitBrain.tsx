import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  brandCyan,
  brandPurple,
  brandPink,
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
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { BrainIcon, CheckCircleIcon, HeadphonesIcon } from './Icons';

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

type Particle = {
  id: string;
  x: number;
  y: number;
  angle: number;
  color: string;
  size: number;
  speed: number;
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
  const navigate = useNavigate();
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

  const content = isArabic && node.contentAr ? node.contentAr : node.content;
  const showArabicLabel = isArabic && !node.contentAr?.title;

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
          aria-label={isArabic ? 'إغلاق' : 'Close'}
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
                {content.title}
              </h2>
              {showArabicLabel && (
                <div
                  style={{
                    margin: `${spacing[1]}px 0 0`,
                    fontSize: typography.size.base,
                    color: colors.text.secondary,
                    fontWeight: typography.weight.bold,
                    direction: 'rtl',
                    unicodeBidi: 'plaintext',
                  }}
                >
                  {node.labelAr}
                </div>
              )}
              <p style={{
                margin: `${isArabic ? spacing[0.5] : spacing[1]}px 0 0`,
                fontSize: typography.size.sm,
                color: node.color,
                fontWeight: typography.weight.semibold,
              }}>
                {content.subtitle}
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
            {content.questions.map((q, i) => (
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
              {content.explanation}
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
              {content.benefits.map((benefit, i) => (
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
            <button
              onClick={() => {
                onClose();
                navigate('/contact');
              }}
              className="modal-cta-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[2.5],
                padding: `${spacing[3.5]}px ${spacing[6]}px`,
                background: gradients.primary,
                color: colors.surface.base,
                borderRadius: radius.lg,
                fontSize: typography.size.base,
                fontWeight: typography.weight.black,
                fontFamily: typography.fontFamily,
                boxShadow: shadows.glow.cyan,
                transition: transitions.bounce,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {text.getStarted}
              <span style={{ transform: isArabic ? 'rotate(180deg)' : 'none' }}>→</span>
            </button>
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

const HeroCircuitBrain = memo(function HeroCircuitBrain() {
  const { isArabic, direction } = useLanguage();
  const navigate = useNavigate();
  const text = isArabic ? heroText.ar : heroText.en;

  const [isLoaded, setIsLoaded] = useState(false);
  const [activeNode, setActiveNode] = useState<BrainFunction | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const reducedMotion = usePrefersReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [tooltipNode, setTooltipNode] = useState<BrainFunction | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const burstAtNode = useCallback((x: number, y: number) => {
    if (reducedMotion) return;

    // Multiple ripple rings for enhanced explosion
    const rippleColors = [brandCyan, brandPurple, brandPink];
    rippleColors.forEach((color, i) => {
      const rippleId = uid();
      setTimeout(() => {
        setRipples((prev) => [...prev.slice(-6), { id: rippleId, x, y, color }]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== rippleId));
        }, 800);
      }, i * 100);
    });

    // Particle explosion - synaptic burst
    const particleCount = 12;
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      newParticles.push({
        id: uid(),
        x,
        y,
        angle,
        color: COLORS[i % COLORS.length],
        size: 2 + Math.random() * 3,
        speed: 30 + Math.random() * 40,
      });
    }
    setParticles((prev) => [...prev.slice(-20), ...newParticles]);

    // Clean up particles after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1000);

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
    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes brainPulse {
      0%, 100% { filter: drop-shadow(0 0 25px ${brandCyan}35); }
      50% { filter: drop-shadow(0 0 40px ${brandCyan}50); }
    }
    @keyframes veinPulse {
      0%, 100% { stroke-opacity: 0.5; }
      50% { stroke-opacity: 0.9; }
    }
    @keyframes scrollHint {
      0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.5; }
      50% { transform: translateX(-50%) translateY(8px); opacity: 1; }
    }
    @keyframes nodeFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    @keyframes titleEnter {
      from { opacity: 0; transform: translateY(-16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes hintPulse {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    @keyframes particleBurst {
      0% { opacity: 1; transform: translate(0, 0) scale(1); }
      100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
    }
    @keyframes tooltipFadeIn {
      from { opacity: 0; transform: translateY(5px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes techRingSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes techRingSpinReverse {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    @keyframes statusPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes dataStream {
      0% { stroke-dashoffset: 100; }
      100% { stroke-dashoffset: 0; }
    }
    .circuit-brain-container {
      animation: fadeInScale 0.7s ease-out forwards;
    }
    .circuit-brain-svg {
      animation: ${reducedMotion ? 'none' : 'brainPulse 5s ease-in-out infinite'};
    }
    .neural-vein {
      animation: ${reducedMotion ? 'none' : 'veinPulse 3s ease-in-out infinite'};
    }
    .circuit-node {
      cursor: pointer;
      transition: transform 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .circuit-node:hover, .circuit-node:focus {
      transform: scale(1.15);
    }
    .circuit-node:active {
      transform: scale(0.92);
    }
    .circuit-node:focus {
      outline: none;
    }
    .circuit-node:focus-visible {
      outline: 2px solid ${brandCyan};
      outline-offset: 4px;
    }
    .floating-tooltip {
      animation: tooltipFadeIn 0.2s ease-out forwards;
    }
    .tech-ring {
      animation: ${reducedMotion ? 'none' : 'techRingSpin 20s linear infinite'};
      transform-origin: center;
    }
    .tech-ring-reverse {
      animation: ${reducedMotion ? 'none' : 'techRingSpinReverse 25s linear infinite'};
      transform-origin: center;
    }
    .status-dot {
      animation: ${reducedMotion ? 'none' : 'statusPulse 2s ease-in-out infinite'};
    }
  `, [reducedMotion]);

  // Platform feature cards data
  const platformFeatures = isArabic ? [
    {
      icon: <HeadphonesIcon size={24} color={brandCyan} />,
      title: '20 ????',
      desc: '?????? ????',
      color: brandCyan,
    },
    {
      icon: <CheckCircleIcon size={24} color={brandPurple} />,
      title: '???? ??????',
      desc: '????? ?????',
      color: brandPurple,
    },
    {
      icon: <BrainIcon size={24} color={brandPink} />,
      title: '10 ?????',
      desc: '????? ????',
      color: brandPink,
    },
  ] : [
    {
      icon: <HeadphonesIcon size={24} color={brandCyan} />,
      title: '20 Sessions',
      desc: 'Intensive Program',
      color: brandCyan,
    },
    {
      icon: <CheckCircleIcon size={24} color={brandPurple} />,
      title: 'Track Progress',
      desc: 'Documented Results',
      color: brandPurple,
    },
    {
      icon: <BrainIcon size={24} color={brandPink} />,
      title: '10 Areas',
      desc: 'Comprehensive',
      color: brandPink,
    },
  ];

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${colors.surface.base} 0%, rgba(15,20,35,1) 50%, ${colors.surface.base} 100%)`,
        padding: `0 ${spacing[4]}px ${spacing[10]}px`,
        direction,
      }}
    >
      <style>{css}</style>

      {/* Background grid - more subtle for platform feel */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(${brandCyan}05 1px, transparent 1px),
          linear-gradient(90deg, ${brandCyan}05 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Decorative gradient orbs */}
      <div style={{
        position: 'absolute',
        top: '5%',
        [isArabic ? 'left' : 'right']: '5%',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${brandPurple}12, transparent 60%)`,
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        [isArabic ? 'right' : 'left']: '10%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${brandCyan}10, transparent 60%)`,
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* ═══════════════════════════════════════════════════════════════
          PLATFORM LAYOUT - Two Column Dashboard Style
          ═══════════════════════════════════════════════════════════════ */}
      <div
        className="circuit-brain-container"
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: spacing[8],
          maxWidth: 1200,
          width: '100%',
          alignItems: 'center',
          opacity: isLoaded ? 1 : 0,
          zIndex: 1,
        }}
      >
        {/* ═══ LEFT PANEL: Platform Info ═══ */}
        <div style={{
          order: isArabic && !isMobile ? 2 : 1,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing[5],
          animation: 'titleEnter 0.8s ease-out forwards',
        }}>
          {/* Platform Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[1.5]}px ${spacing[4]}px`,
            background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
            border: `1px solid ${brandCyan}30`,
            borderRadius: radius.full,
            width: 'fit-content',
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: brandCyan,
              boxShadow: `0 0 10px ${brandCyan}`,
              animation: reducedMotion ? 'none' : 'pulse 2s ease-in-out infinite',
            }} />
            <span style={{
              fontSize: typography.size.xs,
              fontWeight: typography.weight.bold,
              color: brandCyan,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
              {isArabic ? 'منصة التدريب السمعي' : 'Auditory Training Platform'}
            </span>
          </div>

          {/* Main Title */}
          <div>
            <h1 style={{
              margin: 0,
              fontSize: isMobile ? typography.size['3xl'] : typography.size['5xl'],
              fontWeight: typography.weight.black,
              fontFamily: typography.fontFamily,
              color: colors.text.primary,
              lineHeight: typography.lineHeight.tight,
              letterSpacing: typography.letterSpacing.tight,
            }}>
              {isArabic ? 'Lotus' : 'Lotus'}
              <span style={{
                background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {' '}× Bérard
              </span>
              {' '}AIT
            </h1>
            <p style={{
              margin: `${spacing[3]}px 0 0`,
              fontSize: isMobile ? typography.size.base : typography.size.lg,
              color: colors.text.secondary,
              fontFamily: typography.fontFamily,
              lineHeight: typography.lineHeight.relaxed,
              maxWidth: 480,
            }}>
              {isArabic
                ? 'منصة متكاملة لتدريب التكامل السمعي. استكشف مناطق الدماغ واكتشف كيف يمكن للبرنامج تحسين المعالجة السمعية.'
                : 'An integrated platform for auditory integration training. Explore brain regions and discover how the program can improve auditory processing.'}
            </p>
          </div>

          {/* Platform Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: spacing[3],
            marginTop: spacing[2],
          }}>
            {platformFeatures.map((feature, i) => (
              <div
                key={i}
                style={{
                  padding: spacing[3],
                  background: `linear-gradient(135deg, ${feature.color}10, transparent)`,
                  border: `1px solid ${feature.color}25`,
                  borderRadius: radius.lg,
                  textAlign: 'center',
                  transition: transitions.normal,
                }}
              >
                <div style={{ fontSize: 24, marginBottom: spacing[1.5] }}>{feature.icon}</div>
                <div style={{
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.bold,
                  color: feature.color,
                }}>{feature.title}</div>
                <div style={{
                  fontSize: typography.size.xs,
                  color: colors.text.muted,
                  marginTop: 2,
                }}>{feature.desc}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: spacing[3],
            flexWrap: 'wrap',
            marginTop: spacing[2],
          }}>
            <button
              onClick={() => navigate('/contact')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[3]}px ${spacing[5]}px`,
                background: gradients.primary,
                color: colors.surface.base,
                borderRadius: radius.lg,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.black,
                fontFamily: typography.fontFamily,
                boxShadow: shadows.glow.cyan,
                transition: transitions.bounce,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {isArabic ? 'ابدأ الآن' : 'Get Started'}
              <span style={{ transform: isArabic ? 'rotate(180deg)' : 'none' }}>→</span>
            </button>
            <button
              onClick={() => navigate('/assessment')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[3]}px ${spacing[5]}px`,
                background: 'transparent',
                color: colors.text.primary,
                borderRadius: radius.lg,
                border: `1px solid ${colors.border.emphasis}`,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.bold,
                fontFamily: typography.fontFamily,
                transition: transitions.normal,
                cursor: 'pointer',
              }}
            >
              {isArabic ? 'قائمة التقييم' : 'Self Assessment'}
            </button>
          </div>

          {/* Trust Indicators */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[4],
            marginTop: spacing[3],
            paddingTop: spacing[3],
            borderTop: `1px solid ${colors.border.subtle}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1.5] }}>
              <span style={{ color: brandCyan }}>✓</span>
              <span style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
                {isArabic ? 'معتمد دولياً' : 'Internationally Certified'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1.5] }}>
              <span style={{ color: brandPurple }}>✓</span>
              <span style={{ fontSize: typography.size.xs, color: colors.text.muted }}>
                {isArabic ? '+500 حالة ناجحة' : '500+ Success Cases'}
              </span>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT PANEL: Interactive Brain ═══ */}
        <div style={{
          order: isArabic && !isMobile ? 1 : 2,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Brain Container Card */}
          <div style={{
            position: 'relative',
            padding: spacing[4],
            background: `linear-gradient(135deg, rgba(15,20,35,0.8), rgba(20,26,45,0.6))`,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius['2xl'],
            backdropFilter: 'blur(10px)',
          }}>
            {/* Card Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: spacing[3],
              paddingBottom: spacing[3],
              borderBottom: `1px solid ${colors.border.subtle}`,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: radius.md,
                  background: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}20)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                }}>
                  🧠
                </div>
                <div>
                  <div style={{
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.bold,
                    color: colors.text.primary,
                  }}>
                    {isArabic ? 'خريطة الدماغ التفاعلية' : 'Interactive Brain Map'}
                  </div>
                  <div style={{
                    fontSize: typography.size.xs,
                    color: colors.text.muted,
                  }}>
                    {isArabic ? '10 مناطق قابلة للاستكشاف' : '10 explorable regions'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                {/* NEURAL LINK ACTIVE Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[1.5],
                  padding: `${spacing[1]}px ${spacing[2.5]}px`,
                  background: `${brandCyan}15`,
                  border: `1px solid ${brandCyan}30`,
                  borderRadius: radius.full,
                }}>
                  <div
                    className="status-dot"
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: brandCyan,
                      boxShadow: `0 0 8px ${brandCyan}`,
                    }}
                  />
                  <span style={{
                    fontSize: 9,
                    fontWeight: typography.weight.bold,
                    color: brandCyan,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    {isArabic ? 'نشط' : 'NEURAL LINK ACTIVE'}
                  </span>
                </div>
                {/* Traffic light dots */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: brandCyan, opacity: 0.6 }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: brandPurple, opacity: 0.6 }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: brandPink, opacity: 0.6 }} />
                </div>
              </div>
            </div>

            {/* SVG Brain */}
        <svg
          className="circuit-brain-svg"
          width="100%"
          height="auto"
          viewBox="100 50 400 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Interactive brain circuit"
          style={{ maxWidth: 580, touchAction: 'manipulation' }}
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={brandCyan} stopOpacity="0.7" />
              <stop offset="50%" stopColor={brandPurple} stopOpacity="0.5" />
              <stop offset="100%" stopColor={brandPink} stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="veinGradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={brandCyan} stopOpacity="0.3" />
              <stop offset="50%" stopColor={brandCyan} stopOpacity="0.8" />
              <stop offset="100%" stopColor={brandCyan} stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="veinGradPurple" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={brandPurple} stopOpacity="0.3" />
              <stop offset="50%" stopColor={brandPurple} stopOpacity="0.8" />
              <stop offset="100%" stopColor={brandPurple} stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="veinGradPink" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={brandPink} stopOpacity="0.3" />
              <stop offset="50%" stopColor={brandPink} stopOpacity="0.8" />
              <stop offset="100%" stopColor={brandPink} stopOpacity="0.3" />
            </linearGradient>
            <radialGradient id="brainFill" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor={brandPurple} stopOpacity="0.08" />
              <stop offset="100%" stopColor={brandCyan} stopOpacity="0.02" />
            </radialGradient>

            {/* Filters */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="veinGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
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
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ═══════════════════════════════════════════════════════════════
              ROTATING TECH RINGS - HUD Style Enhancement
              ═══════════════════════════════════════════════════════════════ */}
          {!reducedMotion && (
            <g opacity="0.25">
              {/* Outer dashed ring - slow spin */}
              <circle
                className="tech-ring"
                cx="300"
                cy="240"
                r="185"
                fill="none"
                stroke={brandCyan}
                strokeWidth="1"
                strokeDasharray="8 12"
                style={{ transformOrigin: '300px 240px' }}
              />
              {/* Middle ring - reverse spin */}
              <circle
                className="tech-ring-reverse"
                cx="300"
                cy="240"
                r="170"
                fill="none"
                stroke={brandPurple}
                strokeWidth="0.5"
                strokeDasharray="4 8"
                style={{ transformOrigin: '300px 240px' }}
              />
              {/* Inner dotted ring */}
              <circle
                className="tech-ring"
                cx="300"
                cy="240"
                r="155"
                fill="none"
                stroke={brandPink}
                strokeWidth="0.5"
                strokeDasharray="2 6"
                style={{ transformOrigin: '300px 240px' }}
              />
              {/* Corner markers for HUD feel */}
              <g stroke={brandCyan} strokeWidth="1" opacity="0.4">
                <path d="M130 90 L150 90 L150 110" fill="none" />
                <path d="M470 90 L450 90 L450 110" fill="none" />
                <path d="M130 390 L150 390 L150 370" fill="none" />
                <path d="M470 390 L450 390 L450 370" fill="none" />
              </g>
            </g>
          )}

          {/* Anatomical Brain Shape - Left Hemisphere */}
          <path
            d="M295 80
               C240 75 190 95 160 130
               C130 165 120 200 125 240
               C115 260 110 290 120 320
               C130 360 160 390 200 400
               C240 410 280 405 295 400"
            fill="url(#brainFill)"
            stroke="url(#brainGrad)"
            strokeWidth="2"
            opacity="0.6"
            filter="url(#softGlow)"
          />

          {/* Anatomical Brain Shape - Right Hemisphere */}
          <path
            d="M305 80
               C360 75 410 95 440 130
               C470 165 480 200 475 240
               C485 260 490 290 480 320
               C470 360 440 390 400 400
               C360 410 320 405 305 400"
            fill="url(#brainFill)"
            stroke="url(#brainGrad)"
            strokeWidth="2"
            opacity="0.6"
            filter="url(#softGlow)"
          />

          {/* Central fissure */}
          <path
            d="M300 85 Q298 200 300 300 Q302 380 300 395"
            stroke={brandPurple}
            strokeWidth="1.5"
            opacity="0.25"
            fill="none"
          />

          {/* Brain Folds (Sulci) - Left */}
          <g stroke={brandCyan} strokeWidth="1" opacity="0.15" fill="none">
            <path d="M145 180 Q180 160 220 170 Q260 180 290 175" />
            <path d="M130 230 Q170 210 220 220 Q260 235 295 225" />
            <path d="M135 280 Q175 260 220 270 Q260 285 295 275" />
            <path d="M155 330 Q190 315 230 325 Q270 340 295 330" />
          </g>

          {/* Brain Folds (Sulci) - Right */}
          <g stroke={brandCyan} strokeWidth="1" opacity="0.15" fill="none">
            <path d="M305 175 Q340 180 380 170 Q420 160 455 180" />
            <path d="M305 225 Q340 235 380 220 Q430 210 470 230" />
            <path d="M305 275 Q340 285 380 270 Q425 260 465 280" />
            <path d="M305 330 Q330 340 370 325 Q410 315 445 330" />
          </g>

          {/* ═══════════════════════════════════════════════════════════════
              NEURAL VEIN PATHWAYS - Wire-like connections to nodes
              ═══════════════════════════════════════════════════════════════ */}

          {/* Main Brain Stem / Central Artery */}
          <path
            id="stem"
            d="M300 395 Q300 350 300 300 Q300 250 300 200 Q300 150 300 100"
            stroke={brandPurple}
            strokeWidth="3"
            opacity="0.4"
            fill="none"
            strokeLinecap="round"
            filter="url(#veinGlow)"
          />

          {/* === LEFT HEMISPHERE VEINS === */}

          {/* Vein to Auditory (x:160, y:130) */}
          <path
            id="c1"
            className="neural-vein"
            d="M300 120 Q280 115 250 115 Q220 115 190 120 Q175 125 160 130"
            stroke={brandCyan}
            strokeWidth="2"
            opacity="0.7"
            fill="none"
            strokeLinecap="round"
            filter="url(#veinGlow)"
          />

          {/* Vein to Attention (x:180, y:200) */}
          <path
            id="c2"
            className="neural-vein"
            d="M300 200 Q270 195 240 195 Q210 195 180 200"
            stroke={brandPurple}
            strokeWidth="2"
            opacity="0.7"
            fill="none"
            strokeLinecap="round"
            filter="url(#veinGlow)"
          />

          {/* Vein to Sensory (x:150, y:280) */}
          <path
            id="c3"
            className="neural-vein"
            d="M300 280 Q260 275 220 275 Q185 275 150 280"
            stroke={brandCyan}
            strokeWidth="2"
            opacity="0.7"
            fill="none"
            strokeLinecap="round"
            filter="url(#veinGlow)"
          />

          {/* Vein to Learning (x:220, y:340) */}
          <path
            id="c4"
            className="neural-vein"
            d="M300 340 Q280 342 260 340 Q240 338 220 340"
            stroke={brandPurple}
            strokeWidth="2"
            opacity="0.7"
            fill="none"
            strokeLinecap="round"
            filter="url(#veinGlow)"
          />

          {/* === RIGHT HEMISPHERE VEINS === */}

          {/* Vein to Language (x:270, y:150) - branches from stem */}
          <path
            id="c5"
            className="neural-vein"
            d="M300 150 Q285 150 270 150"
            stroke={brandPurple}
            strokeWidth="2"
            opacity="0.7"
            fill="none"
            strokeLinecap="round"
            filter="url(#veinGlow)"
          />

          {/* Vein to Balance (x:380, y:120) */}
          <path
            id="c6"
            className="neural-vein"
            d="M300 120 Q320 115 350 115 Q365 115 380 120"
            stroke={brandPink}
            strokeWidth="2"
            opacity="0.7"
            fill="none"
            strokeLinecap="round"
            filter="url(#veinGlow)"
          />

          {/* Vein to Well Being (x:440, y:180) */}
          <path
            id="c7"
            className="neural-vein"
            d="M300 180 Q340 175 380 175 Q410 175 440 180"
            stroke={brandCyan}
            strokeWidth="2"
            opacity="0.7"
            fill="none"
            strokeLinecap="round"
            filter="url(#veinGlow)"
          />

          {/* Vein to Music (x:450, y:260) */}
          <path
            id="c8"
            className="neural-vein"
            d="M300 260 Q350 255 400 255 Q425 255 450 260"
            stroke={brandPurple}
            strokeWidth="2"
            opacity="0.7"
            fill="none"
            strokeLinecap="round"
            filter="url(#veinGlow)"
          />

          {/* Vein to Memory (x:420, y:330) */}
          <path
            id="c9"
            className="neural-vein"
            d="M300 330 Q340 325 380 325 Q400 325 420 330"
            stroke={brandPink}
            strokeWidth="2"
            opacity="0.7"
            fill="none"
            strokeLinecap="round"
            filter="url(#veinGlow)"
          />

          {/* Vein to Behavior (x:320, y:350) */}
          <path
            id="c10"
            className="neural-vein"
            d="M300 350 Q310 350 320 350"
            stroke={brandCyan}
            strokeWidth="2"
            opacity="0.7"
            fill="none"
            strokeLinecap="round"
            filter="url(#veinGlow)"
          />

          {/* === SECONDARY CAPILLARY NETWORKS === */}
          <g className="capillaries" opacity="0.25" strokeWidth="1" fill="none" strokeDasharray="3 2">
            {/* Left side micro-vessels */}
            <path d="M160 130 Q150 160 155 190" stroke={brandCyan} />
            <path d="M180 200 Q165 230 155 260" stroke={brandPurple} />
            <path d="M150 280 Q160 310 180 330" stroke={brandCyan} />
            <path d="M220 340 Q200 360 185 375" stroke={brandPurple} />

            {/* Right side micro-vessels */}
            <path d="M380 120 Q400 140 420 155" stroke={brandPink} />
            <path d="M440 180 Q455 210 460 240" stroke={brandCyan} />
            <path d="M450 260 Q455 290 445 310" stroke={brandPurple} />
            <path d="M420 330 Q400 355 375 370" stroke={brandPink} />

            {/* Cross-connections */}
            <path d="M270 150 Q250 180 235 200" stroke={brandPurple} />
            <path d="M380 120 Q350 145 320 155" stroke={brandPink} />
            <path d="M220 340 Q260 355 300 360" stroke={brandCyan} />
          </g>

          {/* === PULSING ENERGY ALONG VEINS === */}
          <g className="vein-pulses" opacity="0.6">
            {/* Continuous pulse particles traveling along veins */}
            {!reducedMotion && (
              <>
                {/* Pulse on c1 - to Auditory */}
                <circle r="3" fill={brandCyan} filter="url(#glow)">
                  <animateMotion dur="2.5s" repeatCount="indefinite">
                    <mpath href="#c1" />
                  </animateMotion>
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
                </circle>

                {/* Pulse on c2 - to Attention */}
                <circle r="2.5" fill={brandPurple} filter="url(#glow)">
                  <animateMotion dur="2s" repeatCount="indefinite" begin="0.3s">
                    <mpath href="#c2" />
                  </animateMotion>
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin="0.3s" />
                </circle>

                {/* Pulse on c3 - to Sensory */}
                <circle r="3" fill={brandCyan} filter="url(#glow)">
                  <animateMotion dur="2.8s" repeatCount="indefinite" begin="0.6s">
                    <mpath href="#c3" />
                  </animateMotion>
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2.8s" repeatCount="indefinite" begin="0.6s" />
                </circle>

                {/* Pulse on c6 - to Balance */}
                <circle r="2.5" fill={brandPink} filter="url(#glow)">
                  <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.9s">
                    <mpath href="#c6" />
                  </animateMotion>
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2.2s" repeatCount="indefinite" begin="0.9s" />
                </circle>

                {/* Pulse on c7 - to Well Being */}
                <circle r="3" fill={brandCyan} filter="url(#glow)">
                  <animateMotion dur="3s" repeatCount="indefinite" begin="1.2s">
                    <mpath href="#c7" />
                  </animateMotion>
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" begin="1.2s" />
                </circle>

                {/* Pulse on c8 - to Music */}
                <circle r="2.5" fill={brandPurple} filter="url(#glow)">
                  <animateMotion dur="2.6s" repeatCount="indefinite" begin="1.5s">
                    <mpath href="#c8" />
                  </animateMotion>
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2.6s" repeatCount="indefinite" begin="1.5s" />
                </circle>

                {/* Pulse on c9 - to Memory */}
                <circle r="3" fill={brandPink} filter="url(#glow)">
                  <animateMotion dur="2.4s" repeatCount="indefinite" begin="1.8s">
                    <mpath href="#c9" />
                  </animateMotion>
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="2.4s" repeatCount="indefinite" begin="1.8s" />
                </circle>

                {/* Central stem pulse */}
                <circle r="4" fill={brandPurple} filter="url(#glow)">
                  <animateMotion dur="4s" repeatCount="indefinite">
                    <mpath href="#stem" />
                  </animateMotion>
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="r" values="3;5;3" dur="4s" repeatCount="indefinite" />
                </circle>
              </>
            )}
          </g>

          {/* Ripples - Enhanced multi-ring explosion */}
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
                style={{ filter: `drop-shadow(0 0 12px ${r.color})` }}
              >
                <animate attributeName="r" values="2;50" dur="0.8s" fill="freeze" />
                <animate attributeName="opacity" values="0.8;0" dur="0.8s" fill="freeze" />
                <animate attributeName="stroke-width" values="3;0.5" dur="0.8s" fill="freeze" />
              </circle>
            ))}
          </g>

          {/* Particle Burst - Synaptic Explosion */}
          <g>
            {particles.map((p) => {
              const tx = Math.cos(p.angle) * p.speed;
              const ty = Math.sin(p.angle) * p.speed;
              return (
                <circle
                  key={p.id}
                  cx={p.x}
                  cy={p.y}
                  r={p.size}
                  fill={p.color}
                  style={{
                    filter: `drop-shadow(0 0 6px ${p.color})`,
                    animation: 'particleBurst 0.8s ease-out forwards',
                    ['--tx' as string]: `${tx}px`,
                    ['--ty' as string]: `${ty}px`,
                  }}
                />
              );
            })}
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
              const labelPrimary = node.labelEn;
              const labelSecondary = node.labelAr;

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
                  onMouseEnter={() => {
                    if (!isMobile) {
                      setHoveredNode(node.id);
                      setTooltipNode(node);
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      setHoveredNode(null);
                      setTooltipNode(null);
                    }
                  }}
                  onTouchStart={() => setHoveredNode(node.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={
                    isArabic
                      ? `${labelPrimary} (${labelSecondary}) - اضغط لمعرفة المزيد`
                      : `${labelPrimary} - Click to learn more`
                  }
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
                    {labelPrimary}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Floating neural particles */}
          {!reducedMotion && (
            <g opacity="0.3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <circle
                  key={`neural-p-${i}`}
                  r={1 + (i % 2)}
                  fill={COLORS[i % COLORS.length]}
                  filter="url(#glow)"
                >
                  <animate
                    attributeName="cx"
                    values={`${180 + i * 45};${220 + i * 35};${180 + i * 45}`}
                    dur={`${6 + i * 0.5}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values={`${130 + i * 45};${180 + i * 35};${130 + i * 45}`}
                    dur={`${7 + i * 0.4}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.2;0.6;0.2"
                    dur={`${4 + i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </g>
          )}
        </svg>

        {/* Floating Tooltip - appears on hover */}
        {tooltipNode && !isMobile && (
          <div
            className="floating-tooltip"
            style={{
              position: 'absolute',
              top: Math.min(tooltipNode.position.y - 30, 320),
              left: tooltipNode.position.x > 300
                ? tooltipNode.position.x - 180
                : tooltipNode.position.x + 30,
              width: 200,
              padding: spacing[3],
              background: 'linear-gradient(135deg, rgba(11,15,28,0.98) 0%, rgba(5,6,13,0.98) 100%)',
              border: `1px solid ${tooltipNode.color}40`,
              borderRadius: radius.lg,
              boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${tooltipNode.color}20`,
              backdropFilter: 'blur(12px)',
              pointerEvents: 'none',
              zIndex: 20,
            }}
          >
            {/* Tooltip arrow */}
            <div style={{
              position: 'absolute',
              top: '50%',
              [tooltipNode.position.x > 300 ? 'right' : 'left']: -6,
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              [tooltipNode.position.x > 300 ? 'borderLeft' : 'borderRight']: `6px solid ${tooltipNode.color}40`,
            }} />

            {/* Icon & Title */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              marginBottom: spacing[2],
            }}>
              <span style={{ fontSize: 20 }}>{tooltipNode.icon}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.bold,
                  color: tooltipNode.color,
                }}>
                  {tooltipNode.labelEn}
                </span>
                {isArabic && (
                  <span
                    style={{
                      fontSize: 11,
                      color: colors.text.muted,
                      fontWeight: typography.weight.semibold,
                      direction: 'rtl',
                      unicodeBidi: 'plaintext',
                    }}
                  >
                    {tooltipNode.labelAr}
                  </span>
                )}
              </div>
            </div>

            {/* Description preview */}
            <p style={{
              margin: 0,
              fontSize: typography.size.xs,
              color: colors.text.secondary,
              lineHeight: typography.lineHeight.relaxed,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {(isArabic && tooltipNode.contentAr ? tooltipNode.contentAr : tooltipNode.content).subtitle}
            </p>

            {/* Click hint */}
            <div style={{
              marginTop: spacing[2],
              paddingTop: spacing[2],
              borderTop: `1px solid ${colors.border.subtle}`,
              fontSize: 10,
              color: colors.text.muted,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[1],
            }}>
              <span style={{ color: tooltipNode.color }}>→</span>
              {isArabic ? 'انقر للمزيد' : 'Click to explore'}
            </div>
          </div>
        )}

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
});

export default HeroCircuitBrain;
