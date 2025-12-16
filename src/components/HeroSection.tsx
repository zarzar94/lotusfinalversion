import { useState, useEffect, useMemo, useCallback } from 'react';
import { brandCyan, brandPurple, brandPink } from './styles';
import { assetUrl } from '../utils/asset';
import { BrainIcon, HeadphonesIcon, SparklesIcon } from './Icons';

// Particle system for cosmic effect
const CosmicParticle = ({ delay, duration, size, color, startX, startY }: {
  delay: number;
  duration: number;
  size: number;
  color: string;
  startX: number;
  startY: number;
}) => (
  <div
    style={{
      position: 'absolute',
      left: `${startX}%`,
      top: `${startY}%`,
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}50`,
      animation: `cosmicFloat ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      opacity: 0.6,
    }}
  />
);

// Interactive hotspot on the brain
const BrainHotspot = ({ x, y, label, color, delay, onHover }: {
  x: number;
  y: number;
  label: string;
  color: string;
  delay: number;
  onHover: (label: string | null) => void;
}) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      onMouseEnter={() => { setIsActive(true); onHover(label); }}
      onMouseLeave={() => { setIsActive(false); onHover(null); }}
      onClick={() => setIsActive(!isActive)}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        zIndex: 20,
      }}
    >
      {/* Pulse ring */}
      <div style={{
        position: 'absolute',
        width: isActive ? 60 : 40,
        height: isActive ? 60 : 40,
        borderRadius: '50%',
        border: `2px solid ${color}`,
        animation: `pulseRing 2s ease-out infinite`,
        animationDelay: `${delay}s`,
        opacity: isActive ? 0.8 : 0.4,
        transform: 'translate(-50%, -50%)',
        left: '50%',
        top: '50%',
        transition: 'all 0.3s ease',
      }} />

      {/* Core dot */}
      <div style={{
        width: isActive ? 16 : 10,
        height: isActive ? 16 : 10,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 20px ${color}, 0 0 40px ${color}80`,
        transition: 'all 0.3s ease',
        transform: isActive ? 'scale(1.2)' : 'scale(1)',
      }} />

      {/* Label tooltip */}
      {isActive && (
        <div style={{
          position: 'absolute',
          top: '120%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(11,15,28,0.95)',
          border: `1px solid ${color}50`,
          borderRadius: 10,
          padding: '8px 14px',
          fontSize: 12,
          fontWeight: 700,
          color: '#fff',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(10px)',
          animation: 'fadeInUp 0.3s ease',
          boxShadow: `0 10px 30px rgba(0,0,0,0.4), 0 0 20px ${color}30`,
        }}>
          {label}
        </div>
      )}
    </div>
  );
};

export default function HeroSection() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }, []);

  // Brain regions with positions
  const brainRegions = useMemo(() => [
    { x: 35, y: 35, label: 'المعالجة السمعية', color: brandCyan, delay: 0 },
    { x: 65, y: 35, label: 'التركيز والانتباه', color: brandPurple, delay: 0.3 },
    { x: 30, y: 55, label: 'الذاكرة السمعية', color: brandPink, delay: 0.6 },
    { x: 70, y: 55, label: 'تمييز الأصوات', color: '#22c55e', delay: 0.9 },
    { x: 50, y: 70, label: 'التكامل الحسي', color: '#f59e0b', delay: 1.2 },
  ], []);

  // Particles configuration
  const particles = useMemo(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
      size: 2 + Math.random() * 4,
      color: [brandCyan, brandPurple, brandPink, '#fff'][Math.floor(Math.random() * 4)],
      startX: Math.random() * 100,
      startY: Math.random() * 100,
    })), []);

  const css = useMemo(() => `
    @keyframes cosmicFloat {
      0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 0.3;
      }
      25% {
        transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(1.2);
        opacity: 0.8;
      }
      50% {
        transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(0.8);
        opacity: 0.5;
      }
      75% {
        transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) scale(1.1);
        opacity: 0.7;
      }
    }
    @keyframes pulseRing {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
      100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateX(-50%) translateY(10px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes brainGlow {
      0%, 100% {
        filter: drop-shadow(0 0 30px rgba(143,211,204,0.5)) drop-shadow(0 0 60px rgba(176,18,112,0.4));
      }
      50% {
        filter: drop-shadow(0 0 50px rgba(143,211,204,0.7)) drop-shadow(0 0 80px rgba(176,18,112,0.6));
      }
    }
    @keyframes cosmicRotate {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
    @keyframes heroFadeIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes scrollBounce {
      0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
      40% { transform: translateX(-50%) translateY(-10px); }
      60% { transform: translateX(-50%) translateY(-5px); }
    }
    .cosmic-brain {
      animation: brainGlow 4s ease-in-out infinite, heroFadeIn 1.5s ease-out;
      transition: transform 0.3s ease;
    }
    .cosmic-brain:hover {
      transform: scale(1.02);
    }
  `, []);

  return (
    <section
      id="about"
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at center, rgba(15,22,41,1) 0%, rgba(5,6,13,1) 100%)',
      }}
    >
      <style>{css}</style>

      {/* Cosmic background effects */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(800px circle at ${mousePos.x}% ${mousePos.y}%, rgba(143,211,204,0.15), transparent 40%),
          radial-gradient(600px circle at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(176,18,112,0.12), transparent 40%)
        `,
        transition: 'background 0.3s ease',
        pointerEvents: 'none',
      }} />

      {/* Rotating cosmic ring */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: '120%',
        height: '120%',
        border: '1px solid rgba(143,211,204,0.1)',
        borderRadius: '50%',
        animation: 'cosmicRotate 60s linear infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: '140%',
        height: '140%',
        border: '1px solid rgba(175,132,186,0.08)',
        borderRadius: '50%',
        animation: 'cosmicRotate 80s linear infinite reverse',
        pointerEvents: 'none',
      }} />

      {/* Floating particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {particles.map((p, i) => (
          <CosmicParticle key={i} {...p} />
        ))}
      </div>

      {/* Main cosmic brain container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 700,
        aspectRatio: '16/10',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Cosmic Brain Image */}
        <div
          className="cosmic-brain"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={assetUrl('assets/images/cosmic_brain.jpg')}
            alt="Cosmic Brain - Berard AIT"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 20,
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              // Fallback to gradient brain if image not found
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />

          {/* Fallback animated brain if image fails */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `
              radial-gradient(ellipse at 40% 40%, rgba(143,211,204,0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 60% 60%, rgba(176,18,112,0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(175,132,186,0.3) 0%, transparent 60%)
            `,
            borderRadius: 20,
            animation: 'brainGlow 4s ease-in-out infinite',
            zIndex: -1,
          }}>
            <BrainIcon size={200} color="rgba(143,211,204,0.3)" />
          </div>

          {/* Interactive hotspots */}
          {brainRegions.map((region, i) => (
            <BrainHotspot
              key={i}
              {...region}
              onHover={setActiveRegion}
            />
          ))}
        </div>

        {/* Active region display */}
        {activeRegion && (
          <div style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(11,15,28,0.9)',
            border: '1px solid rgba(143,211,204,0.3)',
            borderRadius: 14,
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            animation: 'fadeInUp 0.3s ease',
            zIndex: 30,
          }}>
            <SparklesIcon size={20} color={brandCyan} />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
              {activeRegion}
            </span>
          </div>
        )}
      </div>

      {/* Brand mark - minimal */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(11,15,28,0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(143,211,204,0.2)',
        borderRadius: 12,
        padding: '8px 14px',
      }}>
        <HeadphonesIcon size={18} color={brandCyan} />
        <span style={{ fontSize: 13, fontWeight: 800 }}>
          <span style={{ color: brandPurple }}>Berard</span>{' '}
          <span style={{ color: brandCyan }}>AIT</span>
        </span>
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
        animation: 'scrollBounce 2s infinite',
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
            animation: 'cosmicFloat 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>
    </section>
  );
}
