import { useState, useEffect, useMemo, useCallback } from 'react';
import { brandCyan, brandPurple, brandPink } from './styles';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type Pulse = {
  id: string;
  path: 'c1' | 'c2' | 'c3';
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

type Node = {
  id: string;
  x: number;
  y: number;
  r: number;
  label: string;
};

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = [brandCyan, brandPurple, brandPink];

const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

// Interactive nodes positioned along the brain circuit
const NODES: Node[] = [
  { id: 'n1', x: 190, y: 140, r: 12, label: 'السمع' },      // Hearing
  { id: 'n2', x: 330, y: 210, r: 14, label: 'المعالجة' },   // Processing
  { id: 'n3', x: 420, y: 150, r: 12, label: 'الإدراك' },    // Perception
  { id: 'n4', x: 360, y: 290, r: 14, label: 'التكامل' },    // Integration
  { id: 'n5', x: 250, y: 290, r: 12, label: 'الاستجابة' },  // Response
  { id: 'n6', x: 420, y: 250, r: 10, label: 'الذاكرة' },    // Memory
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function HeroCircuitBrain() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
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

    // Ripple (single wave at the node)
    const rippleColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const rippleId = uid();
    setRipples((prev) => [...prev.slice(-3), { id: rippleId, x, y, color: rippleColor }]);

    // Pulses: burst on all paths with stagger
    const waves = 3;
    const baseDur = 2.2;
    const all: Pulse[] = [];

    for (let w = 0; w < waves; w++) {
      const waveDelay = w * 0.18;
      (['c1', 'c2', 'c3'] as const).forEach((path, i) => {
        const color = COLORS[(w + i) % COLORS.length];
        all.push({
          id: uid(),
          path,
          color,
          dur: baseDur + Math.random() * 1.2,
          begin: waveDelay + i * 0.08,
          r: 3.2 + Math.random() * 1.8,
        });
      });
    }

    // Keep last 80 pulses to avoid performance issues
    setPulses((prev) => [...prev.slice(-80), ...all]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 700);
  }, [reducedMotion]);

  const handleNodeClick = useCallback((n: Node) => {
    setActive((prev) => (prev === n.id ? null : n.id));
    burstAtNode(n.x, n.y);
  }, [burstAtNode]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, n: Node) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActive((prev) => (prev === n.id ? null : n.id));
      burstAtNode(n.x, n.y);
    }
  }, [burstAtNode]);

  // CSS keyframes
  const css = useMemo(() => `
    @keyframes nodeGlow {
      0%, 100% {
        filter: drop-shadow(0 0 8px ${brandCyan}60);
      }
      50% {
        filter: drop-shadow(0 0 16px ${brandCyan});
      }
    }
    @keyframes pathFlow {
      0% { stroke-dashoffset: 100; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes brainPulse {
      0%, 100% {
        filter: drop-shadow(0 0 30px rgba(143,211,204,0.3)) drop-shadow(0 0 60px rgba(175,132,186,0.2));
      }
      50% {
        filter: drop-shadow(0 0 50px rgba(143,211,204,0.5)) drop-shadow(0 0 80px rgba(175,132,186,0.4));
      }
    }
    @keyframes scrollHint {
      0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.6; }
      50% { transform: translateX(-50%) translateY(10px); opacity: 1; }
    }
    .circuit-brain-container {
      animation: fadeInScale 1s ease-out forwards;
    }
    .circuit-brain-svg {
      animation: ${reducedMotion ? 'none' : 'brainPulse 4s ease-in-out infinite'};
    }
    .circuit-node {
      cursor: pointer;
      transition: transform 0.15s ease, filter 0.15s ease;
    }
    .circuit-node:hover {
      transform: scale(1.15);
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
      id="about"
      style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at center, rgba(20,26,45,1) 0%, rgba(8,10,18,1) 100%)',
      }}
    >
      <style>{css}</style>

      {/* Subtle grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(143,211,204,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(143,211,204,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
      }} />

      {/* Radial glow behind the brain */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(143,211,204,0.15) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Main brain circuit container */}
      <div
        className="circuit-brain-container"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isLoaded ? 1 : 0,
        }}
      >
        <svg
          className="circuit-brain-svg"
          width="600"
          height="450"
          viewBox="100 80 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Interactive brain circuit visualization"
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        >
          <defs>
            {/* Gradient for brain outline */}
            <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={brandCyan} stopOpacity="0.8" />
              <stop offset="50%" stopColor={brandPurple} stopOpacity="0.6" />
              <stop offset="100%" stopColor={brandPink} stopOpacity="0.8" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Neon glow filter */}
            <filter id="neonGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Brain silhouette outline */}
          <path
            d="M300 100
               C220 100 160 140 150 200
               C140 260 160 320 200 350
               C240 380 280 380 300 380
               C320 380 360 380 400 350
               C440 320 460 260 450 200
               C440 140 380 100 300 100Z"
            fill="none"
            stroke="url(#brainGradient)"
            strokeWidth="2"
            opacity="0.3"
          />

          {/* Inner brain folds */}
          <g stroke={brandCyan} strokeWidth="1" opacity="0.2" fill="none">
            <path d="M180 180 Q240 160 300 180 Q360 200 400 180" />
            <path d="M170 220 Q230 200 300 220 Q370 240 420 220" />
            <path d="M180 260 Q240 240 300 260 Q360 280 400 260" />
            <path d="M200 300 Q260 280 300 300 Q340 320 380 300" />
          </g>

          {/* ════════════════════════════════════════════════════════════════
              CIRCUIT PATHS (c1, c2, c3)
          ════════════════════════════════════════════════════════════════ */}

          {/* Path c1: Hearing → Processing → Perception */}
          <path
            id="c1"
            className="circuit-path"
            d="M190 140 L260 140 L260 210 L330 210"
            fill="none"
            stroke={brandCyan}
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Path c2: Perception → Memory → Integration */}
          <path
            id="c2"
            className="circuit-path"
            d="M420 150 L420 250 L360 290"
            fill="none"
            stroke={brandPurple}
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glow)"
            style={{ animationDelay: '1s' }}
          />

          {/* Path c3: Response → Integration → Memory */}
          <path
            id="c3"
            className="circuit-path"
            d="M250 290 L300 290 L300 270 L360 270 L360 290"
            fill="none"
            stroke={brandPink}
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glow)"
            style={{ animationDelay: '2s' }}
          />

          {/* Secondary circuit traces */}
          <g stroke={brandCyan} strokeWidth="1" opacity="0.4" strokeDasharray="4 2">
            <path d="M330 210 L330 150 L420 150" />
            <path d="M360 290 L420 290 L420 250" />
            <path d="M250 290 L200 290 L200 220" />
          </g>

          {/* ════════════════════════════════════════════════════════════════
              RIPPLES (wave at node on click)
          ════════════════════════════════════════════════════════════════ */}
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
                opacity="0.9"
                style={{ filter: `drop-shadow(0 0 12px ${r.color})` }}
              >
                <animate attributeName="r" values="2;40" dur="0.65s" fill="freeze" />
                <animate attributeName="opacity" values="0.9;0" dur="0.65s" fill="freeze" />
              </circle>
            ))}
          </g>

          {/* ════════════════════════════════════════════════════════════════
              PULSES (burst explosion along paths)
          ════════════════════════════════════════════════════════════════ */}
          <g opacity="0.95">
            {pulses.map((p) => (
              <circle
                key={p.id}
                r={p.r}
                fill={p.color}
                style={{ filter: `drop-shadow(0 0 12px ${p.color})` }}
              >
                <animate
                  attributeName="opacity"
                  values="0;1;0.2;0"
                  dur={`${p.dur}s`}
                  begin={`${p.begin}s`}
                  fill="freeze"
                />
                <animate
                  attributeName="r"
                  values={`${p.r};${p.r + 2.4};${p.r}`}
                  dur={`${p.dur}s`}
                  begin={`${p.begin}s`}
                  fill="freeze"
                />
                <animateMotion
                  dur={`${p.dur}s`}
                  begin={`${p.begin}s`}
                  repeatCount="1"
                  fill="freeze"
                >
                  <mpath href={`#${p.path}`} />
                </animateMotion>
              </circle>
            ))}
          </g>

          {/* ════════════════════════════════════════════════════════════════
              INTERACTIVE NODES
          ════════════════════════════════════════════════════════════════ */}
          <g filter="url(#neonGlow)">
            {NODES.map((n) => {
              const isActive = active === n.id;
              return (
                <g
                  key={n.id}
                  className="circuit-node"
                  onClick={() => handleNodeClick(n)}
                  onKeyDown={(e) => handleKeyDown(e, n)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                  aria-label={n.label}
                  style={{
                    transform: isActive ? 'scale(1.2)' : 'scale(1)',
                    transformOrigin: `${n.x}px ${n.y}px`,
                  }}
                >
                  {/* Outer glow ring */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.r + 6}
                    fill="transparent"
                    stroke={isActive ? brandPink : brandCyan}
                    strokeWidth="1"
                    opacity={isActive ? 0.8 : 0.3}
                    style={{
                      transition: 'all 0.2s ease',
                    }}
                  />

                  {/* Main node circle */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.r}
                    fill={isActive ? brandPink : `${brandCyan}20`}
                    stroke={isActive ? brandPink : brandCyan}
                    strokeWidth="2"
                    style={{
                      filter: `drop-shadow(0 0 ${isActive ? 20 : 10}px ${isActive ? brandPink : brandCyan})`,
                      transition: 'all 0.2s ease',
                    }}
                  />

                  {/* Inner pulse indicator */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.r * 0.4}
                    fill={isActive ? '#fff' : brandCyan}
                    opacity={isActive ? 1 : 0.8}
                  >
                    {!reducedMotion && (
                      <animate
                        attributeName="r"
                        values={`${n.r * 0.3};${n.r * 0.5};${n.r * 0.3}`}
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    )}
                  </circle>
                </g>
              );
            })}
          </g>

          {/* Node labels (shown on hover/active) */}
          {NODES.map((n) => (
            <text
              key={`label-${n.id}`}
              x={n.x}
              y={n.y + n.r + 18}
              fill={active === n.id ? brandPink : brandCyan}
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              opacity={active === n.id ? 1 : 0}
              style={{
                transition: 'opacity 0.2s ease',
                pointerEvents: 'none',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              {n.label}
            </text>
          ))}

          {/* Ambient floating particles */}
          {!reducedMotion && (
            <g opacity="0.6">
              {[...Array(8)].map((_, i) => (
                <circle
                  key={`particle-${i}`}
                  r="2"
                  fill={COLORS[i % COLORS.length]}
                >
                  <animate
                    attributeName="cx"
                    values={`${150 + i * 40};${200 + i * 30};${150 + i * 40}`}
                    dur={`${4 + i * 0.5}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values={`${120 + i * 30};${180 + i * 20};${120 + i * 30}`}
                    dur={`${5 + i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.3;0.8;0.3"
                    dur={`${3 + i * 0.4}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </g>
          )}
        </svg>

        {/* Instruction hint */}
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 13,
            fontFamily: 'Cairo, sans-serif',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          اضغط على العقد لتفعيل النبضات
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        animation: reducedMotion ? 'none' : 'scrollHint 2s ease-in-out infinite',
        zIndex: 10,
      }}>
        <div style={{
          width: 24,
          height: 38,
          border: '2px solid rgba(143,211,204,0.3)',
          borderRadius: 12,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 8,
        }}>
          <div style={{
            width: 4,
            height: 8,
            background: brandCyan,
            borderRadius: 2,
          }} />
        </div>
      </div>
    </section>
  );
}
