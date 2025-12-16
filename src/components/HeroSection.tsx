import { useState, useEffect, useMemo, useCallback } from 'react';
import { brandCyan, brandPurple, brandPink } from './styles';

// SVG Brain matching the exact design - purple brain with white neural lines and cyan auditory center
const BrainSVG = ({ size = 400 }: { size?: number }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Main brain shape - lavender/purple */}
    <g id="brain-outline">
      {/* Left hemisphere */}
      <path
        d="M80 150 Q60 100 100 70 Q140 40 180 50 Q200 55 200 55"
        stroke="#AF84BA"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M80 150 Q50 180 80 220 Q110 260 160 250 Q200 245 200 245"
        stroke="#AF84BA"
        strokeWidth="3"
        fill="none"
      />

      {/* Right hemisphere */}
      <path
        d="M320 150 Q340 100 300 70 Q260 40 220 50 Q200 55 200 55"
        stroke="#AF84BA"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M320 150 Q350 180 320 220 Q290 260 240 250 Q200 245 200 245"
        stroke="#AF84BA"
        strokeWidth="3"
        fill="none"
      />
    </g>

    {/* Brain fill with gradient */}
    <defs>
      <radialGradient id="brainGradient" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#C9A8D2" />
        <stop offset="50%" stopColor="#AF84BA" />
        <stop offset="100%" stopColor="#9A6FA8" />
      </radialGradient>
      <filter id="brainGlow">
        <feGaussianBlur stdDeviation="3" result="glow"/>
        <feMerge>
          <feMergeNode in="glow"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Main brain shape filled */}
    <path
      d="M80 150
         Q60 100 100 70 Q140 40 180 50 Q200 55 200 55
         Q200 55 220 50 Q260 40 300 70 Q340 100 320 150
         Q350 180 320 220 Q290 260 240 250 Q200 245 200 245
         Q200 245 160 250 Q110 260 80 220 Q50 180 80 150Z"
      fill="url(#brainGradient)"
      filter="url(#brainGlow)"
      opacity="0.95"
    />

    {/* Neural pathway lines - white/light */}
    <g stroke="rgba(255,255,255,0.85)" strokeWidth="2" fill="none" strokeLinecap="round">
      {/* Left hemisphere gyri */}
      <path d="M90 130 Q100 110 130 100 Q150 95 160 110" />
      <path d="M85 150 Q110 135 140 140 Q160 142 170 155" />
      <path d="M90 175 Q115 165 145 175 Q165 180 175 195" />
      <path d="M100 200 Q130 185 155 195 Q175 202 185 215" />
      <path d="M120 220 Q145 210 170 220 Q185 228 190 240" />
      <path d="M95 110 Q115 95 145 90 Q165 88 175 100" />
      <path d="M75 160 Q90 155 105 160" />
      <path d="M80 190 Q100 182 115 190" />

      {/* Right hemisphere gyri */}
      <path d="M310 130 Q300 110 270 100 Q250 95 240 110" />
      <path d="M315 150 Q290 135 260 140 Q240 142 230 155" />
      <path d="M310 175 Q285 165 255 175 Q235 180 225 195" />
      <path d="M300 200 Q270 185 245 195 Q225 202 215 215" />
      <path d="M280 220 Q255 210 230 220 Q215 228 210 240" />
      <path d="M305 110 Q285 95 255 90 Q235 88 225 100" />
      <path d="M325 160 Q310 155 295 160" />
      <path d="M320 190 Q300 182 285 190" />

      {/* Connecting pathways */}
      <path d="M170 120 Q200 115 230 120" />
      <path d="M175 145 Q200 140 225 145" />
      <path d="M180 220 Q200 215 220 220" />
    </g>

    {/* Cerebellum (bottom back of brain) */}
    <ellipse cx="290" cy="235" rx="35" ry="22" fill="#9A6FA8" opacity="0.9" />
    <g stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" fill="none">
      <path d="M260 230 Q275 225 290 230 Q305 225 320 230" />
      <path d="M265 240 Q280 235 290 240 Q300 235 315 240" />
      <path d="M270 248 Q285 244 290 248 Q295 244 310 248" />
    </g>

    {/* Auditory center - cyan circle with stem */}
    <g id="auditory-center">
      {/* Stem going up */}
      <rect x="194" y="45" width="12" height="75" rx="6" fill={brandCyan} />

      {/* Main auditory circle */}
      <circle cx="200" cy="145" r="35" fill={brandCyan} />

      {/* Inner glow */}
      <circle cx="200" cy="145" r="25" fill="rgba(255,255,255,0.2)" />
      <circle cx="200" cy="145" r="15" fill="rgba(255,255,255,0.15)" />

      {/* Outer glow ring */}
      <circle cx="200" cy="145" r="42" stroke={brandCyan} strokeWidth="2" fill="none" opacity="0.4" />
    </g>
  </svg>
);

// Orbiting particle that circles around the brain
const OrbitingParticle = ({
  orbitRadius,
  duration,
  delay,
  size,
  color,
  reverse = false,
  offsetY = 0
}: {
  orbitRadius: number;
  duration: number;
  delay: number;
  size: number;
  color: string;
  reverse?: boolean;
  offsetY?: number;
}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: `calc(50% + ${offsetY}px)`,
      width: orbitRadius * 2,
      height: orbitRadius * 2,
      marginLeft: -orbitRadius,
      marginTop: -orbitRadius,
      animation: `orbit${reverse ? 'Reverse' : ''} ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
      pointerEvents: 'none',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 ${size}px ${color}, 0 0 ${size * 2}px ${color}80`,
      }}
    />
  </div>
);

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Orbiting particles configuration - they orbit AROUND the brain
  const orbitingParticles = useMemo(() => [
    { orbitRadius: 220, duration: 20, delay: 0, size: 8, color: brandCyan, reverse: false, offsetY: 0 },
    { orbitRadius: 240, duration: 25, delay: 2, size: 6, color: brandPurple, reverse: true, offsetY: 10 },
    { orbitRadius: 260, duration: 30, delay: 4, size: 10, color: brandPink, reverse: false, offsetY: -15 },
    { orbitRadius: 200, duration: 18, delay: 6, size: 5, color: brandCyan, reverse: true, offsetY: 20 },
    { orbitRadius: 280, duration: 35, delay: 8, size: 7, color: '#fff', reverse: false, offsetY: -10 },
    { orbitRadius: 230, duration: 22, delay: 10, size: 6, color: brandPurple, reverse: true, offsetY: 5 },
    { orbitRadius: 250, duration: 28, delay: 3, size: 8, color: brandCyan, reverse: false, offsetY: -20 },
    { orbitRadius: 210, duration: 19, delay: 7, size: 5, color: brandPink, reverse: true, offsetY: 15 },
  ], []);

  const css = useMemo(() => `
    @keyframes orbit {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes orbitReverse {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    @keyframes brainPulse {
      0%, 100% {
        filter: drop-shadow(0 0 30px rgba(143,211,204,0.4)) drop-shadow(0 0 60px rgba(175,132,186,0.3));
        transform: scale(1);
      }
      50% {
        filter: drop-shadow(0 0 50px rgba(143,211,204,0.6)) drop-shadow(0 0 80px rgba(175,132,186,0.5));
        transform: scale(1.02);
      }
    }
    @keyframes auditoryPulse {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; }
    }
    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes scrollHint {
      0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.6; }
      50% { transform: translateX(-50%) translateY(10px); opacity: 1; }
    }
    .brain-container {
      animation: fadeInScale 1.2s ease-out forwards, brainPulse 4s ease-in-out infinite;
      animation-delay: 0s, 1.2s;
    }
    .orbit-trail {
      opacity: 0.1;
      animation: orbitReverse 60s linear infinite;
    }
  `, []);

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

      {/* Orbit trail rings */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 500,
        borderRadius: '50%',
        border: `1px dashed rgba(143,211,204,0.1)`,
        pointerEvents: 'none',
      }} className="orbit-trail" />
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 560,
        height: 560,
        borderRadius: '50%',
        border: `1px dashed rgba(175,132,186,0.08)`,
        pointerEvents: 'none',
        animation: 'orbit 80s linear infinite',
      }} />

      {/* Main brain container */}
      <div
        className="brain-container"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isLoaded ? 1 : 0,
        }}
      >
        {/* The Brain SVG */}
        <BrainSVG size={450} />

        {/* Orbiting particles - outside the brain */}
        {orbitingParticles.map((p, i) => (
          <OrbitingParticle key={i} {...p} />
        ))}
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
        animation: 'scrollHint 2s ease-in-out infinite',
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
