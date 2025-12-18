import { useState, useEffect, useMemo, memo } from 'react';
import { brandCyan, brandPurple, brandPink } from './styles';

// Brain image component using the detailed PNG
const BrainImage = ({ size = 400 }: { size?: number }) => (
  <img
    src="/assets/images/brain_logo.png"
    alt="Brain with auditory center highlighted"
    width={size}
    height={size * 0.85}
    style={{
      objectFit: 'contain',
      filter: 'drop-shadow(0 0 30px rgba(143,211,204,0.4)) drop-shadow(0 0 60px rgba(175,132,186,0.3))',
    }}
  />
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

const HeroSection = memo(function HeroSection() {
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
    @media (max-width: 640px) {
      .brain-container img {
        width: 280px !important;
        height: auto !important;
      }
      .orbit-trail {
        width: 320px !important;
        height: 320px !important;
      }
      .hero-section {
        min-height: 70vh !important;
      }
      .scroll-indicator {
        bottom: 20px !important;
      }
    }
    @media (max-width: 480px) {
      .brain-container img {
        width: 220px !important;
      }
      .orbit-trail {
        width: 260px !important;
        height: 260px !important;
      }
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      .brain-container img {
        width: 360px !important;
      }
      .orbit-trail {
        width: 440px !important;
        height: 440px !important;
      }
      .hero-section {
        min-height: 75vh !important;
      }
    }
    @media (min-width: 1280px) {
      .brain-container img {
        width: 500px !important;
      }
      .orbit-trail {
        width: 600px !important;
        height: 600px !important;
      }
      .hero-section {
        min-height: 90vh !important;
      }
    }
  `, []);

  return (
    <section
      id="about"
      className="hero-section"
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
        {/* The Brain Image */}
        <BrainImage size={450} />

        {/* Orbiting particles - outside the brain */}
        {orbitingParticles.map((p, i) => (
          <OrbitingParticle key={i} {...p} />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator" style={{
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
});

export default HeroSection;
