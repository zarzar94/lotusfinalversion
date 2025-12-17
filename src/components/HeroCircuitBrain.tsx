import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { brandCyan, brandPurple, brandPink } from './styles';
import { BRAIN_FUNCTIONS } from '../data/brainFunctions';

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
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function HeroCircuitBrain() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
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

    const rippleColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const rippleId = uid();
    setRipples((prev) => [...prev.slice(-3), { id: rippleId, x, y, color: rippleColor }]);

    const waves = 3;
    const baseDur = 2.2;
    const all: Pulse[] = [];
    const paths = ['c1', 'c2', 'c3', 'c4', 'c5'] as const;

    for (let w = 0; w < waves; w++) {
      const waveDelay = w * 0.18;
      paths.forEach((path, i) => {
        const color = COLORS[(w + i) % COLORS.length];
        all.push({
          id: uid(),
          path,
          color,
          dur: baseDur + Math.random() * 1.2,
          begin: waveDelay + i * 0.06,
          r: 3 + Math.random() * 1.5,
        });
      });
    }

    setPulses((prev) => [...prev.slice(-60), ...all]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 700);
  }, [reducedMotion]);

  const handleNodeClick = useCallback((slug: string, x: number, y: number) => {
    burstAtNode(x, y);
    // Navigate after a short delay to see the animation
    setTimeout(() => {
      navigate(`/function/${slug}`);
    }, 300);
  }, [burstAtNode, navigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, slug: string, x: number, y: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNodeClick(slug, x, y);
    }
  }, [handleNodeClick]);

  // CSS keyframes
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
    @keyframes nodeFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    @keyframes labelPop {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .circuit-brain-container {
      animation: fadeInScale 1s ease-out forwards;
    }
    .circuit-brain-svg {
      animation: ${reducedMotion ? 'none' : 'brainPulse 4s ease-in-out infinite'};
    }
    .circuit-node {
      cursor: pointer;
      transition: transform 0.2s ease, filter 0.2s ease;
    }
    .circuit-node:hover {
      transform: scale(1.25);
      filter: brightness(1.3);
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
    .node-label {
      animation: labelPop 0.2s ease-out;
      pointer-events: none;
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

      {/* Grid background */}
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

      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(143,211,204,0.12) 0%, transparent 70%)`,
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
          width="650"
          height="500"
          viewBox="100 70 400 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Interactive brain circuit - click nodes to explore brain functions"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          <defs>
            <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={brandCyan} stopOpacity="0.8" />
              <stop offset="50%" stopColor={brandPurple} stopOpacity="0.6" />
              <stop offset="100%" stopColor={brandPink} stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
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

          {/* Brain silhouette */}
          <path
            d="M300 90
               C210 90 140 140 130 210
               C120 280 145 350 195 385
               C245 420 280 420 300 420
               C320 420 355 420 405 385
               C455 350 480 280 470 210
               C460 140 390 90 300 90Z"
            fill="none"
            stroke="url(#brainGradient)"
            strokeWidth="2"
            opacity="0.25"
          />

          {/* Brain folds */}
          <g stroke={brandCyan} strokeWidth="1" opacity="0.15" fill="none">
            <path d="M160 180 Q230 155 300 175 Q370 195 430 175" />
            <path d="M150 230 Q220 205 300 225 Q380 245 440 225" />
            <path d="M160 280 Q230 255 300 275 Q370 295 430 275" />
            <path d="M180 330 Q250 305 300 325 Q350 345 400 325" />
          </g>

          {/* ═══════════════════════════════════════════════════════════════
              CIRCUIT PATHS - Connecting the nodes
          ═══════════════════════════════════════════════════════════════ */}

          <path id="c1" className="circuit-path" d="M160 130 L220 130 L220 150 L270 150" fill="none" stroke={brandCyan} strokeWidth="2" strokeLinecap="round" filter="url(#glow)" />
          <path id="c2" className="circuit-path" d="M270 150 L330 150 L330 120 L380 120" fill="none" stroke={brandPurple} strokeWidth="2" strokeLinecap="round" filter="url(#glow)" style={{ animationDelay: '0.5s' }} />
          <path id="c3" className="circuit-path" d="M380 120 L420 120 L420 180 L440 180 L440 260 L450 260" fill="none" stroke={brandPink} strokeWidth="2" strokeLinecap="round" filter="url(#glow)" style={{ animationDelay: '1s' }} />
          <path id="c4" className="circuit-path" d="M450 260 L450 330 L420 330 L320 350 L220 340 L150 280" fill="none" stroke={brandCyan} strokeWidth="2" strokeLinecap="round" filter="url(#glow)" style={{ animationDelay: '1.5s' }} />
          <path id="c5" className="circuit-path" d="M150 280 L150 200 L180 200" fill="none" stroke={brandPurple} strokeWidth="2" strokeLinecap="round" filter="url(#glow)" style={{ animationDelay: '2s' }} />

          {/* Secondary traces */}
          <g stroke={brandCyan} strokeWidth="1" opacity="0.3" strokeDasharray="4 2">
            <path d="M270 150 L270 200 L180 200" />
            <path d="M380 120 L380 180 L440 180" />
            <path d="M420 330 L420 260 L450 260" />
            <path d="M220 340 L220 280 L150 280" />
          </g>

          {/* ═══════════════════════════════════════════════════════════════
              RIPPLES
          ═══════════════════════════════════════════════════════════════ */}
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
                <animate attributeName="r" values="2;50" dur="0.7s" fill="freeze" />
                <animate attributeName="opacity" values="0.9;0" dur="0.7s" fill="freeze" />
              </circle>
            ))}
          </g>

          {/* ═══════════════════════════════════════════════════════════════
              PULSES
          ═══════════════════════════════════════════════════════════════ */}
          <g opacity="0.9">
            {pulses.map((p) => (
              <circle
                key={p.id}
                r={p.r}
                fill={p.color}
                style={{ filter: `drop-shadow(0 0 10px ${p.color})` }}
              >
                <animate attributeName="opacity" values="0;1;0.3;0" dur={`${p.dur}s`} begin={`${p.begin}s`} fill="freeze" />
                <animate attributeName="r" values={`${p.r};${p.r + 2};${p.r}`} dur={`${p.dur}s`} begin={`${p.begin}s`} fill="freeze" />
                <animateMotion dur={`${p.dur}s`} begin={`${p.begin}s`} repeatCount="1" fill="freeze">
                  <mpath href={`#${p.path}`} />
                </animateMotion>
              </circle>
            ))}
          </g>

          {/* ═══════════════════════════════════════════════════════════════
              INTERACTIVE NODES
          ═══════════════════════════════════════════════════════════════ */}
          <g filter="url(#neonGlow)">
            {BRAIN_FUNCTIONS.map((node, index) => {
              const isHovered = hoveredNode === node.id;
              const color = node.color;
              return (
                <g
                  key={node.id}
                  className="circuit-node"
                  onClick={() => handleNodeClick(node.slug, node.position.x, node.position.y)}
                  onKeyDown={(e) => handleKeyDown(e, node.slug, node.position.x, node.position.y)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onFocus={() => setHoveredNode(node.id)}
                  onBlur={() => setHoveredNode(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.labelEn} - Click to learn more`}
                  style={{
                    animation: reducedMotion ? 'none' : `nodeFloat ${2 + index * 0.2}s ease-in-out infinite`,
                  }}
                >
                  {/* Outer ring */}
                  <circle
                    cx={node.position.x}
                    cy={node.position.y}
                    r={node.position.r + 10}
                    fill="transparent"
                    stroke={color}
                    strokeWidth={isHovered ? 2 : 1}
                    opacity={isHovered ? 0.6 : 0.3}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {/* Main circle */}
                  <circle
                    cx={node.position.x}
                    cy={node.position.y}
                    r={node.position.r}
                    fill={isHovered ? `${color}60` : `${color}30`}
                    stroke={color}
                    strokeWidth="2"
                    style={{
                      filter: `drop-shadow(0 0 ${isHovered ? 20 : 12}px ${color})`,
                      transition: 'all 0.2s ease',
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
                      <animate attributeName="r" values={`${node.position.r * 0.3};${node.position.r * 0.45};${node.position.r * 0.3}`} dur="1.8s" repeatCount="indefinite" />
                    )}
                  </circle>
                  {/* Label - always visible */}
                  <text
                    x={node.position.x}
                    y={node.position.y + node.position.r + 22}
                    fill={color}
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    style={{
                      fontFamily: 'Cairo, sans-serif',
                      pointerEvents: 'none',
                      opacity: isHovered ? 1 : 0.8,
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    {node.labelEn}
                  </text>
                  {/* Icon on hover */}
                  {isHovered && (
                    <text
                      x={node.position.x}
                      y={node.position.y + 5}
                      fontSize="16"
                      textAnchor="middle"
                      className="node-label"
                      style={{ pointerEvents: 'none' }}
                    >
                      {node.icon}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Floating particles */}
          {!reducedMotion && (
            <g opacity="0.5">
              {[...Array(6)].map((_, i) => (
                <circle key={`p-${i}`} r="2" fill={COLORS[i % COLORS.length]}>
                  <animate attributeName="cx" values={`${140 + i * 50};${180 + i * 40};${140 + i * 50}`} dur={`${4 + i * 0.5}s`} repeatCount="indefinite" />
                  <animate attributeName="cy" values={`${100 + i * 40};${160 + i * 30};${100 + i * 40}`} dur={`${5 + i * 0.4}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0.7;0.2" dur={`${3 + i * 0.3}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
          )}
        </svg>

        {/* Instruction */}
        <div
          style={{
            position: 'absolute',
            bottom: -50,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 14,
            fontFamily: 'Cairo, sans-serif',
            textAlign: 'center',
          }}
        >
          Click on a node to explore how Berard AIT can help
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
          <div style={{ width: 4, height: 8, background: brandCyan, borderRadius: 2 }} />
        </div>
      </div>
    </section>
  );
}
