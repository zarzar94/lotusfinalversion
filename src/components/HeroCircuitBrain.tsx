import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { brandCyan, brandPurple, brandPink, brandInk } from './styles';
import { BRAIN_FUNCTIONS, type BrainFunction } from '../data/brainFunctions';

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

// ═══════════════════════════════════════════════════════════════════════════
// INFO MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const InfoModal = memo(({
  node,
  onClose,
}: {
  node: BrainFunction | null;
  onClose: () => void;
}) => {
  // Close on escape key
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
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
        animation: 'modalFadeIn 0.25s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, #f5ebe0 0%, #ede0d4 100%)',
          borderRadius: 20,
          maxWidth: 680,
          width: '100%',
          maxHeight: '85vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
          animation: 'modalSlideIn 0.3s ease-out',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(0,0,0,0.08)',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
            color: '#555',
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
            transition: 'background 0.2s',
            zIndex: 10,
          }}
        >
          ×
        </button>

        {/* Content */}
        <div style={{ padding: '28px 28px 32px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <span style={{ fontSize: 40 }}>{node.icon}</span>
            <h2
              id="modal-title"
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 700,
                color: '#1a5f7a',
                fontFamily: 'Cairo, system-ui, sans-serif',
              }}
            >
              {node.content.title}
            </h2>
          </div>

          {/* Questions */}
          <div style={{ marginBottom: 24 }}>
            {node.content.questions.map((q, i) => (
              <p
                key={i}
                style={{
                  margin: '0 0 14px 0',
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: '#333',
                  fontFamily: 'system-ui, sans-serif',
                  paddingRight: 8,
                }}
              >
                {q}
              </p>
            ))}
          </div>

          {/* Explanation */}
          <div style={{
            background: 'rgba(26,95,122,0.08)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            borderLeft: '4px solid #1a5f7a',
          }}>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                lineHeight: 1.8,
                color: '#444',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {node.content.explanation}
            </p>
          </div>

          {/* Benefits */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 16, color: '#1a5f7a', fontWeight: 600 }}>
              Expected Benefits:
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {node.content.benefits.map((benefit, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    background: 'rgba(26,95,122,0.1)',
                    borderRadius: 20,
                    fontSize: 13,
                    color: '#1a5f7a',
                    fontWeight: 500,
                  }}
                >
                  ✓ {benefit}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div style={{ textAlign: 'center' }}>
            <a
              href="#contact"
              onClick={onClose}
              style={{
                display: 'inline-block',
                padding: '14px 36px',
                background: 'linear-gradient(135deg, #1a5f7a 0%, #2a7f9a 100%)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 30,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: 'Cairo, system-ui, sans-serif',
                boxShadow: '0 4px 20px rgba(26,95,122,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              Learn About Berard AIT Protocol
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
            transform: scale(0.92) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeNode, setActiveNode] = useState<BrainFunction | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for reduced motion and mobile
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

  // Burst explosion when clicking a node
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

  // CSS keyframes - memoized
  const css = useMemo(() => `
    @keyframes pathFlow {
      0% { stroke-dashoffset: 100; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes brainPulse {
      0%, 100% {
        filter: drop-shadow(0 0 25px rgba(143,211,204,0.25));
      }
      50% {
        filter: drop-shadow(0 0 40px rgba(143,211,204,0.4));
      }
    }
    @keyframes scrollHint {
      0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.6; }
      50% { transform: translateX(-50%) translateY(8px); opacity: 1; }
    }
    @keyframes nodeFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
    }
    .circuit-brain-container {
      animation: fadeInScale 0.8s ease-out forwards;
    }
    .circuit-brain-svg {
      animation: ${reducedMotion ? 'none' : 'brainPulse 4s ease-in-out infinite'};
    }
    .circuit-node {
      cursor: pointer;
      transition: transform 0.15s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .circuit-node:hover, .circuit-node:focus {
      transform: scale(1.15);
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
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at center, rgba(20,26,45,1) 0%, rgba(8,10,18,1) 100%)',
        padding: '40px 16px',
      }}
    >
      <style>{css}</style>

      {/* Grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(143,211,204,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(143,211,204,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
      }} />

      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(143,211,204,0.1) 0%, transparent 70%)',
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
        }}
      >
        <svg
          className="circuit-brain-svg"
          width="100%"
          height="auto"
          viewBox="100 70 400 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Interactive brain circuit - tap nodes to learn more"
          style={{ maxWidth: 600, touchAction: 'manipulation' }}
        >
          <defs>
            <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={brandCyan} stopOpacity="0.7" />
              <stop offset="50%" stopColor={brandPurple} stopOpacity="0.5" />
              <stop offset="100%" stopColor={brandPink} stopOpacity="0.7" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
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
            opacity="0.2"
          />

          {/* Brain folds */}
          <g stroke={brandCyan} strokeWidth="1" opacity="0.12" fill="none">
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
          <g stroke={brandCyan} strokeWidth="1" opacity="0.25" strokeDasharray="4 2">
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
                style={{ filter: `drop-shadow(0 0 10px ${r.color})` }}
              >
                <animate attributeName="r" values="2;45" dur="0.6s" fill="freeze" />
                <animate attributeName="opacity" values="0.8;0" dur="0.6s" fill="freeze" />
              </circle>
            ))}
          </g>

          {/* Pulses */}
          <g opacity="0.85">
            {pulses.map((p) => (
              <circle
                key={p.id}
                r={p.r}
                fill={p.color}
                style={{ filter: `drop-shadow(0 0 8px ${p.color})` }}
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
              return (
                <g
                  key={node.id}
                  className="circuit-node"
                  onClick={() => handleNodeClick(node)}
                  onKeyDown={(e) => handleKeyDown(e, node)}
                  onMouseEnter={() => !isMobile && setHoveredNode(node.id)}
                  onMouseLeave={() => !isMobile && setHoveredNode(null)}
                  onTouchStart={() => setHoveredNode(node.id)}
                  onTouchEnd={() => setTimeout(() => setHoveredNode(null), 100)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.labelEn} - Tap to learn more`}
                  style={{
                    animation: reducedMotion ? 'none' : `nodeFloat ${2.5 + index * 0.15}s ease-in-out infinite`,
                  }}
                >
                  {/* Outer ring */}
                  <circle
                    cx={node.position.x}
                    cy={node.position.y}
                    r={node.position.r + 8}
                    fill="transparent"
                    stroke={color}
                    strokeWidth={isHovered ? 2 : 1}
                    opacity={isHovered ? 0.7 : 0.3}
                    style={{ transition: 'all 0.15s ease' }}
                  />
                  {/* Main circle */}
                  <circle
                    cx={node.position.x}
                    cy={node.position.y}
                    r={node.position.r}
                    fill={isHovered ? `${color}50` : `${color}25`}
                    stroke={color}
                    strokeWidth="2"
                    style={{
                      filter: `drop-shadow(0 0 ${isHovered ? 16 : 10}px ${color})`,
                      transition: 'all 0.15s ease',
                    }}
                  />
                  {/* Inner dot */}
                  <circle
                    cx={node.position.x}
                    cy={node.position.y}
                    r={node.position.r * 0.35}
                    fill={color}
                    opacity="0.9"
                  >
                    {!reducedMotion && (
                      <animate
                        attributeName="r"
                        values={`${node.position.r * 0.3};${node.position.r * 0.42};${node.position.r * 0.3}`}
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    )}
                  </circle>
                  {/* Label */}
                  <text
                    x={node.position.x}
                    y={node.position.y + node.position.r + 20}
                    fill={color}
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="middle"
                    style={{
                      fontFamily: 'Cairo, sans-serif',
                      pointerEvents: 'none',
                      opacity: isHovered ? 1 : 0.75,
                      transition: 'opacity 0.15s',
                    }}
                  >
                    {node.labelEn}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Floating particles - reduced for performance */}
          {!reducedMotion && (
            <g opacity="0.4">
              {[0, 1, 2, 3].map((i) => (
                <circle key={`p-${i}`} r="1.5" fill={COLORS[i % COLORS.length]}>
                  <animate attributeName="cx" values={`${150 + i * 70};${190 + i * 50};${150 + i * 70}`} dur={`${5 + i}s`} repeatCount="indefinite" />
                  <animate attributeName="cy" values={`${120 + i * 50};${170 + i * 40};${120 + i * 50}`} dur={`${6 + i}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.6;0.3" dur={`${4 + i}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
          )}
        </svg>

        {/* Instruction */}
        <p
          style={{
            marginTop: 20,
            color: 'rgba(255,255,255,0.55)',
            fontSize: 14,
            fontFamily: 'Cairo, sans-serif',
            textAlign: 'center',
          }}
        >
          {isMobile ? 'Tap on a node to learn more' : 'Click on a node to learn more'}
        </p>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: reducedMotion ? 'none' : 'scrollHint 2s ease-in-out infinite',
        zIndex: 10,
      }}>
        <div style={{
          width: 22,
          height: 34,
          border: '2px solid rgba(143,211,204,0.25)',
          borderRadius: 11,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 6,
        }}>
          <div style={{ width: 3, height: 7, background: brandCyan, borderRadius: 2, opacity: 0.7 }} />
        </div>
      </div>

      {/* Info Modal */}
      <InfoModal node={activeNode} onClose={closeModal} />
    </section>
  );
}
