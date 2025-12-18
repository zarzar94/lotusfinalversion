/**
 * CircuitDecoration - Animated floating circuit lines and particles
 * Adds visual interest to sections with subtle neural network animations
 */

import { memo, useMemo, useEffect, useState } from 'react';
import { brandCyan, brandPurple, brandPink } from './styles';

interface CircuitDecorationProps {
  variant?: 'sparse' | 'dense';
  opacity?: number;
  position?: 'left' | 'right' | 'both';
}

const CircuitDecoration = memo(({
  variant = 'sparse',
  opacity = 0.15,
  position = 'both'
}: CircuitDecorationProps) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const nodeCount = variant === 'dense' ? 12 : 6;
  const connectionCount = variant === 'dense' ? 8 : 4;

  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => ({
      id: `node-${i}`,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: 3 + Math.random() * 4,
      color: [brandCyan, brandPurple, brandPink][i % 3],
      delay: i * 0.3,
      duration: 3 + Math.random() * 2,
    }));
  }, [nodeCount]);

  const connections = useMemo(() => {
    return Array.from({ length: connectionCount }, (_, i) => {
      const startNode = nodes[i % nodes.length];
      const endNode = nodes[(i + 2) % nodes.length];
      return {
        id: `conn-${i}`,
        x1: startNode.x,
        y1: startNode.y,
        x2: endNode.x,
        y2: endNode.y,
        color: startNode.color,
        delay: i * 0.5,
        duration: 4 + Math.random() * 2,
      };
    });
  }, [nodes, connectionCount]);

  const css = `
    @keyframes circuitNodePulse {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.5); }
    }
    @keyframes circuitLineDash {
      from { stroke-dashoffset: 100; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes circuitFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes particleDrift {
      0% { transform: translate(0, 0); opacity: 0; }
      10% { opacity: 0.8; }
      90% { opacity: 0.8; }
      100% { transform: translate(30px, -50px); opacity: 0; }
    }
  `;

  const renderSide = (side: 'left' | 'right') => (
    <svg
      key={side}
      style={{
        position: 'absolute',
        top: 0,
        [side]: 0,
        width: '20%',
        height: '100%',
        pointerEvents: 'none',
        opacity,
        transform: side === 'right' ? 'scaleX(-1)' : 'none',
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id={`glow-${side}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connection lines */}
      {connections.map((conn) => (
        <line
          key={conn.id}
          x1={`${conn.x1}%`}
          y1={`${conn.y1}%`}
          x2={`${conn.x2}%`}
          y2={`${conn.y2}%`}
          stroke={conn.color}
          strokeWidth="0.5"
          strokeDasharray="4 4"
          opacity="0.4"
          style={{
            animation: reducedMotion
              ? 'none'
              : `circuitLineDash ${conn.duration}s linear infinite`,
            animationDelay: `${conn.delay}s`,
          }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node) => (
        <g key={node.id} filter={`url(#glow-${side})`}>
          <circle
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={node.size}
            fill={node.color}
            style={{
              animation: reducedMotion
                ? 'none'
                : `circuitNodePulse ${node.duration}s ease-in-out infinite, circuitFloat ${node.duration + 1}s ease-in-out infinite`,
              animationDelay: `${node.delay}s`,
              transformOrigin: `${node.x}% ${node.y}%`,
            }}
          />
        </g>
      ))}

      {/* Floating particles */}
      {!reducedMotion && Array.from({ length: 4 }).map((_, i) => (
        <circle
          key={`particle-${side}-${i}`}
          cx={`${20 + i * 20}%`}
          cy={`${80 + i * 5}%`}
          r="1.5"
          fill={[brandCyan, brandPurple, brandPink, brandCyan][i]}
          style={{
            animation: `particleDrift ${5 + i}s linear infinite`,
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}
    </svg>
  );

  return (
    <>
      <style>{css}</style>
      {(position === 'left' || position === 'both') && renderSide('left')}
      {(position === 'right' || position === 'both') && renderSide('right')}
    </>
  );
});

CircuitDecoration.displayName = 'CircuitDecoration';

export default CircuitDecoration;
