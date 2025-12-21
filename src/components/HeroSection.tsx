import { useState, useEffect, useMemo, memo } from 'react';
import { brandCyan, brandPurple, brandPink } from './styles';
import { useLanguage } from '../context/LanguageContext';
import { assetUrl } from '../utils/asset';

// Brain image component using the detailed PNG
const BrainImage = ({ size = 400 }: { size?: number }) => (
  <img
    src={assetUrl('assets/images/sound_lab_logo.png')}
    alt="Sound Lab logo"
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
  const { t } = useLanguage();
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
    @keyframes scanLineVertical {
      0% { top: -100%; }
      100% { top: 200%; }
    }
    @keyframes glowPulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    @keyframes statusBlink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    @keyframes dataStream {
      0% { transform: translateY(0); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100px); opacity: 0; }
    }
    /* Advanced holographic ring */
    @keyframes holoRing {
      0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 0.3; }
      50% { opacity: 0.6; }
      100% { transform: translate(-50%, -50%) rotate(360deg); opacity: 0.3; }
    }
    /* Energy wave expand */
    @keyframes energyWave {
      0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
      100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
    }
    /* Data circuit path */
    @keyframes circuitPath {
      0% { stroke-dashoffset: 1000; }
      100% { stroke-dashoffset: 0; }
    }
    /* Neural network pulse */
    @keyframes neuralPulse {
      0%, 100% { opacity: 0.2; filter: blur(0px); }
      50% { opacity: 0.6; filter: blur(1px); }
    }
    /* Holographic interference */
    @keyframes holoInterference {
      0%, 100% { transform: translateX(0); opacity: 1; }
      2% { transform: translateX(-3px); opacity: 0.85; }
      4% { transform: translateX(3px); opacity: 1; }
      6% { transform: translateX(0); opacity: 0.9; }
    }
    /* Cyber glow expand */
    @keyframes cyberGlow {
      0%, 100% { box-shadow: 0 0 30px ${brandCyan}30, 0 0 60px ${brandPurple}20; }
      50% { box-shadow: 0 0 60px ${brandCyan}50, 0 0 120px ${brandPurple}35; }
    }
    /* Radar sweep */
    @keyframes radarSweep {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
    .brain-container {
      animation: fadeInScale 1.2s ease-out forwards, brainPulse 4s ease-in-out infinite;
      animation-delay: 0s, 1.2s;
    }
    .orbit-trail {
      opacity: 0.1;
      animation: orbitReverse 60s linear infinite;
    }
    .hero-scan-line {
      position: absolute;
      left: 0;
      right: 0;
      height: 100px;
      background: linear-gradient(180deg, transparent, ${brandCyan}08, transparent);
      pointer-events: none;
      animation: scanLineVertical 8s linear infinite;
    }
    .corner-bracket {
      position: absolute;
      width: 30px;
      height: 30px;
      border-color: ${brandCyan}40;
      border-style: solid;
    }
    /* Holographic ring */
    .holo-ring {
      position: absolute;
      left: 50%;
      top: 50%;
      border-radius: 50%;
      border: 1px solid ${brandCyan}30;
      background: transparent;
      animation: holoRing 20s linear infinite;
    }
    /* Energy wave */
    .energy-wave {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      border: 2px solid ${brandCyan}40;
      animation: energyWave 3s ease-out infinite;
      pointer-events: none;
    }
    /* Neural pulse background */
    .neural-bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 30% 30%, ${brandCyan}08 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 70%, ${brandPurple}08 0%, transparent 50%),
                  radial-gradient(ellipse at 50% 50%, ${brandPink}05 0%, transparent 40%);
      animation: neuralPulse 6s ease-in-out infinite;
      pointer-events: none;
    }
    /* Cyber badge */
    .cyber-badge {
      position: relative;
      overflow: hidden;
    }
    .cyber-badge::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      animation: shimmer 3s ease-in-out infinite;
    }
    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    /* Radar sweep line */
    .radar-sweep {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 50%;
      height: 2px;
      background: linear-gradient(90deg, ${brandCyan}60, transparent);
      transform-origin: left center;
      animation: radarSweep 8s linear infinite;
      opacity: 0.4;
    }
    /* Data readout animation */
    .data-readout {
      animation: holoInterference 8s ease-in-out infinite;
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
      .lab-badge {
        display: none !important;
      }
      .corner-bracket {
        display: none !important;
      }
      .holo-ring, .energy-wave, .radar-sweep {
        display: none !important;
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
        background: 'linear-gradient(180deg, #1a1f2e 0%, #0d1117 40%, rgba(8,10,18,1) 100%)',
      }}
    >
      <style>{css}</style>

      {/* Top glow bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${brandCyan}66, ${brandPurple}66, transparent)`,
        animation: 'glowPulse 3s ease-in-out infinite',
        zIndex: 10,
      }} />

      {/* Scan line effect */}
      <div className="hero-scan-line" />

      {/* Neural pulse background */}
      <div className="neural-bg" />

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

      {/* Holographic rings */}
      <div className="holo-ring" style={{ width: 600, height: 600 }} />
      <div className="holo-ring" style={{ width: 700, height: 700, animationDelay: '-5s', animationDuration: '25s' }} />
      <div className="holo-ring" style={{ width: 800, height: 800, animationDelay: '-10s', animationDuration: '30s', borderColor: `${brandPurple}20` }} />

      {/* Energy waves */}
      <div className="energy-wave" />
      <div className="energy-wave" style={{ animationDelay: '1s' }} />
      <div className="energy-wave" style={{ animationDelay: '2s' }} />

      {/* Radar sweep */}
      <div className="radar-sweep" />

      {/* Corner brackets for tech aesthetic */}
      <div className="corner-bracket" style={{ top: 40, left: 40, borderWidth: '2px 0 0 2px' }} />
      <div className="corner-bracket" style={{ top: 40, right: 40, borderWidth: '2px 2px 0 0' }} />
      <div className="corner-bracket" style={{ bottom: 80, left: 40, borderWidth: '0 0 2px 2px' }} />
      <div className="corner-bracket" style={{ bottom: 80, right: 40, borderWidth: '0 2px 2px 0' }} />

      {/* Lab status badge - top left */}
      <div className="lab-badge" style={{
        position: 'absolute',
        top: 100,
        left: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        zIndex: 5,
      }}>
        <div className="cyber-badge" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          background: 'linear-gradient(135deg, rgba(13,17,23,0.9), rgba(20,25,35,0.85))',
          border: `1px solid ${brandCyan}40`,
          borderRadius: 8,
          backdropFilter: 'blur(15px)',
          boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 30px ${brandCyan}10`,
        }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e, #10b981)',
            boxShadow: '0 0 12px #22c55e, 0 0 24px #22c55e60',
            animation: 'statusBlink 2s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            color: brandCyan,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            fontFamily: '"JetBrains Mono", monospace',
            textShadow: `0 0 10px ${brandCyan}40`,
          }}>
            {t('labTech.neuralScanActive')}
          </span>
        </div>
        <div className="data-readout" style={{
          fontSize: 9,
          color: 'rgba(255,255,255,0.4)',
          fontFamily: '"JetBrains Mono", monospace',
          paddingLeft: 4,
          letterSpacing: 1,
        }}>
          {t('labTech.lotusLab')} {t('labTech.version')}
        </div>
      </div>

      {/* Tech readout - top right */}
      <div className="lab-badge" style={{
        position: 'absolute',
        top: 100,
        right: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
        zIndex: 5,
      }}>
        <div className="cyber-badge" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 16px',
          background: 'linear-gradient(135deg, rgba(20,25,35,0.85), rgba(13,17,23,0.9))',
          border: `1px solid ${brandPurple}40`,
          borderRadius: 8,
          backdropFilter: 'blur(15px)',
          boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 30px ${brandPurple}10`,
        }}>
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            color: brandPurple,
            letterSpacing: 1.5,
            fontFamily: '"JetBrains Mono", monospace',
            textShadow: `0 0 10px ${brandPurple}40`,
          }}>
            {t('labTech.auditoryCenter')}
          </span>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${brandPurple}, ${brandPink})`,
            boxShadow: `0 0 12px ${brandPurple}, 0 0 24px ${brandPurple}60`,
            animation: 'statusBlink 3s ease-in-out infinite',
            animationDelay: '0.5s',
          }} />
        </div>
        <div className="data-readout" style={{
          fontSize: 9,
          color: 'rgba(255,255,255,0.35)',
          fontFamily: '"JetBrains Mono", monospace',
          letterSpacing: 1,
        }}>
          {t('labTech.berardProtocol')}
        </div>
      </div>

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
        gap: 10,
        animation: 'scrollHint 2s ease-in-out infinite',
        zIndex: 10,
      }}>
        <div style={{
          fontSize: 9,
          fontWeight: 700,
          color: brandCyan,
          letterSpacing: 2,
          textTransform: 'uppercase',
          fontFamily: 'monospace',
          opacity: 0.7,
        }}>
          {t('labTech.explore')}
        </div>
        <div style={{
          width: 24,
          height: 38,
          border: `2px solid ${brandCyan}40`,
          borderRadius: 12,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 8,
          background: 'rgba(13,17,23,0.5)',
        }}>
          <div style={{
            width: 4,
            height: 8,
            background: brandCyan,
            borderRadius: 2,
            boxShadow: `0 0 8px ${brandCyan}`,
          }} />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        background: 'linear-gradient(to top, #0d1117, transparent)',
        pointerEvents: 'none',
      }} />
    </section>
  );
});

export default HeroSection;
