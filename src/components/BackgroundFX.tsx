import { useEffect, useMemo, useRef, memo } from 'react';

import { assetUrl } from '../utils/asset';
import { brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';

/**
 * Enhanced Sound Lab Background:
 * - Neural network particle system (professional + engaging)
 * - Floating sound waves with depth
 * - Ambient particles with parallax layers
 * - Scroll-responsive color gradients
 * - Child-friendly floating elements
 * - Professional clinical undertone
 *
 * Targets both parents (trustworthy, medical) and children (colorful, fun)
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  layer: number;
  type: 'neuron' | 'sound' | 'ambient' | 'star';
  pulse: number;
  pulseSpeed: number;
  connections?: number[];
}

interface SoundWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  color: string;
  alpha: number;
}

interface FloatingShape {
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  type: 'circle' | 'hexagon' | 'diamond' | 'star';
  color: string;
  alpha: number;
  floatOffset: number;
  floatSpeed: number;
}

const BackgroundFX = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollYRef = useRef(0);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Track scroll for parallax using ref (no re-renders)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          scrollYRef.current = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Color palette
    const colors = {
      cyan: brandCyan,
      pink: brandPink,
      purple: brandPurple,
      purpleDark: brandPurpleDark,
      gold: '#FFD700',
      white: '#FFFFFF',
    };

    // Initialize particles
    const particleCount = Math.min(80, Math.floor(w / 25));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const layer = Math.random() < 0.3 ? 0 : Math.random() < 0.6 ? 1 : 2;
      const types: Particle['type'][] = ['neuron', 'sound', 'ambient', 'star'];
      const type = types[Math.floor(Math.random() * types.length)];
      const colorKeys = Object.keys(colors) as (keyof typeof colors)[];
      const color = colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];

      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: type === 'neuron' ? 3 + Math.random() * 4 : 1 + Math.random() * 2,
        color,
        alpha: 0.15 + Math.random() * 0.35,
        layer,
        type,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    // Initialize sound waves
    const soundWaves: SoundWave[] = [];
    const createSoundWave = () => {
      if (soundWaves.length < 5) {
        soundWaves.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: 0,
          maxRadius: 100 + Math.random() * 200,
          speed: 0.5 + Math.random() * 1,
          color: Math.random() > 0.5 ? colors.cyan : colors.purple,
          alpha: 0.15,
        });
      }
    };

    // Initialize floating shapes (child-friendly)
    const floatingShapes: FloatingShape[] = [];
    const shapeTypes: FloatingShape['type'][] = ['circle', 'hexagon', 'diamond', 'star'];

    for (let i = 0; i < 12; i++) {
      const colorKeys = Object.keys(colors) as (keyof typeof colors)[];
      floatingShapes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        size: 20 + Math.random() * 40,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        color: colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]],
        alpha: 0.05 + Math.random() * 0.1,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.01 + Math.random() * 0.02,
      });
    }

    let t = 0;
    let raf = 0;
    let lastScrollY = 0;

    // Helper functions for drawing shapes
    const drawHexagon = (cx: number, cy: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + Math.cos(angle) * size;
        const y = cy + Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const drawDiamond = (cx: number, cy: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy - size);
      ctx.lineTo(cx + size * 0.7, cy);
      ctx.lineTo(cx, cy + size);
      ctx.lineTo(cx - size * 0.7, cy);
      ctx.closePath();
    };

    const drawStar = (cx: number, cy: number, size: number, points = 5) => {
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const angle = (Math.PI / points) * i - Math.PI / 2;
        const radius = i % 2 === 0 ? size : size * 0.5;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const draw = () => {
      // Get current scroll for parallax (from ref, no re-render)
      const currentScrollY = scrollYRef.current;
      const scrollDelta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      const scrollProgress = Math.min(1, currentScrollY / (document.body.scrollHeight - h));

      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      // Dynamic gradient based on scroll
      const hueShift = scrollProgress * 30;

      // Base gradient - deep background
      const g1 = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.3, Math.max(w, h));
      g1.addColorStop(0, `rgba(${25 + scrollProgress * 10}, ${10 + scrollProgress * 5}, ${35 + scrollProgress * 15}, 0.95)`);
      g1.addColorStop(1, 'rgba(5, 6, 13, 1)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // Accent gradient - top left (purple)
      const g2 = ctx.createRadialGradient(w * 0.15, h * 0.1, 0, w * 0.15, h * 0.1, w * 0.6);
      g2.addColorStop(0, `rgba(175, 132, 186, ${0.18 + scrollProgress * 0.1})`);
      g2.addColorStop(0.5, 'rgba(175, 132, 186, 0.05)');
      g2.addColorStop(1, 'rgba(5, 6, 13, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // Accent gradient - top right (pink)
      const g3 = ctx.createRadialGradient(w * 0.85, h * 0.05, 0, w * 0.85, h * 0.05, w * 0.5);
      g3.addColorStop(0, `rgba(176, 18, 112, ${0.12 + scrollProgress * 0.08})`);
      g3.addColorStop(1, 'rgba(5, 6, 13, 0)');
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, w, h);

      // Accent gradient - bottom (cyan)
      const g4 = ctx.createRadialGradient(w * 0.6, h * 0.9, 0, w * 0.6, h * 0.9, w * 0.7);
      g4.addColorStop(0, `rgba(143, 211, 204, ${0.1 + scrollProgress * 0.05})`);
      g4.addColorStop(1, 'rgba(5, 6, 13, 0)');
      ctx.fillStyle = g4;
      ctx.fillRect(0, 0, w, h);

      // Clinical grid pattern (subtle - professional)
      ctx.strokeStyle = 'rgba(143, 211, 204, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw floating shapes (background layer - child-friendly)
      floatingShapes.forEach((shape, i) => {
        const floatY = Math.sin(t * shape.floatSpeed + shape.floatOffset) * 20;
        const parallaxY = (currentScrollY * (0.1 + i * 0.02)) % h;

        ctx.save();
        ctx.translate(shape.x, (shape.y + floatY - parallaxY + h) % h);
        ctx.rotate(shape.rotation + t * shape.rotationSpeed);
        ctx.globalAlpha = shape.alpha;
        ctx.fillStyle = shape.color;
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 1.5;

        switch (shape.type) {
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
            ctx.stroke();
            break;
          case 'hexagon':
            drawHexagon(0, 0, shape.size / 2);
            ctx.stroke();
            break;
          case 'diamond':
            drawDiamond(0, 0, shape.size / 2);
            ctx.stroke();
            break;
          case 'star':
            drawStar(0, 0, shape.size / 2);
            ctx.fill();
            break;
        }

        ctx.restore();
      });

      // Draw sound waves (auditory concept visualization)
      soundWaves.forEach((wave, i) => {
        wave.radius += wave.speed;
        wave.alpha = 0.15 * (1 - wave.radius / wave.maxRadius);

        if (wave.radius < wave.maxRadius) {
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
          ctx.strokeStyle = wave.color;
          ctx.globalAlpha = wave.alpha;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      // Remove completed waves and create new ones
      for (let i = soundWaves.length - 1; i >= 0; i--) {
        if (soundWaves[i].radius >= soundWaves[i].maxRadius) {
          soundWaves.splice(i, 1);
        }
      }
      if (Math.random() < 0.015) createSoundWave();

      // Draw and update particles
      particles.forEach((p, i) => {
        // Parallax based on layer
        const parallaxFactor = 0.05 + p.layer * 0.1;
        const offsetY = currentScrollY * parallaxFactor;
        const drawY = (p.y - offsetY % h + h) % h;

        // Pulse animation
        p.pulse += p.pulseSpeed;
        const pulseScale = 1 + Math.sin(p.pulse) * 0.3;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Draw based on type
        ctx.globalAlpha = p.alpha;

        if (p.type === 'neuron') {
          // Draw neuron node
          const gradient = ctx.createRadialGradient(p.x, drawY, 0, p.x, drawY, p.size * pulseScale * 2);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(0.5, p.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, drawY, p.size * pulseScale * 2, 0, Math.PI * 2);
          ctx.fill();

          // Draw connections to nearby neurons
          particles.forEach((p2, j) => {
            if (i !== j && p2.type === 'neuron') {
              const dx = p.x - p2.x;
              const dy = drawY - ((p2.y - offsetY % h + h) % h);
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 150) {
                ctx.strokeStyle = p.color;
                ctx.globalAlpha = (p.alpha * 0.3) * (1 - dist / 150);
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p.x, drawY);
                ctx.lineTo(p2.x, (p2.y - offsetY % h + h) % h);
                ctx.stroke();
                ctx.globalAlpha = p.alpha;
              }
            }
          });
        } else if (p.type === 'sound') {
          // Sound particle - sine wave trail
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let s = 0; s < 30; s++) {
            const sx = p.x - s * 2;
            const sy = drawY + Math.sin((t + s) * 0.3) * 5;
            if (s === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        } else if (p.type === 'star') {
          // Twinkling star
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * (0.5 + Math.sin(p.pulse * 2) * 0.5);
          drawStar(p.x, drawY, p.size * pulseScale);
          ctx.fill();
        } else {
          // Ambient particle - soft glow
          const gradient = ctx.createRadialGradient(p.x, drawY, 0, p.x, drawY, p.size * 3);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, drawY, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;

      // Animated spectrogram bars at bottom (signature sound lab element)
      const barCount = Math.max(48, Math.floor(w / 18));
      const barW = w / barCount;
      const baseY = h * 0.85;

      const barGrad = ctx.createLinearGradient(0, baseY - 100, 0, baseY);
      barGrad.addColorStop(0, 'rgba(143, 211, 204, 0)');
      barGrad.addColorStop(0.3, 'rgba(143, 211, 204, 0.2)');
      barGrad.addColorStop(0.6, 'rgba(175, 132, 186, 0.15)');
      barGrad.addColorStop(1, 'rgba(176, 18, 112, 0.1)');

      for (let i = 0; i < barCount; i++) {
        const wave = Math.sin(t * (0.6 + (i % 5) * 0.2) + i * 0.1) * 0.5 + 0.5;
        const noise = Math.sin((t * 0.9 + i) * 0.7) * 0.15 + 0.15;
        const height = 10 + (wave * 0.7 + noise * 0.3) * 80;

        ctx.fillStyle = barGrad;
        ctx.globalAlpha = 0.4;
        ctx.fillRect(i * barW + barW * 0.3, baseY - height, Math.max(2, barW * 0.4), height);
      }
      ctx.globalAlpha = 1;

      // Top audio waveform line (professional)
      ctx.strokeStyle = 'rgba(143, 211, 204, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 12) {
        const y = h * 0.15 + Math.sin(t * 0.5 + x * 0.01) * 8 + Math.sin(t * 0.3 + x * 0.025) * 5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Second waveform (pink)
      ctx.strokeStyle = 'rgba(176, 18, 112, 0.1)';
      ctx.beginPath();
      for (let x = 0; x <= w; x += 12) {
        const y = h * 0.18 + Math.sin(t * 0.4 + x * 0.015 + 1) * 6 + Math.sin(t * 0.25 + x * 0.02) * 4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Subtle vignette (professional finish)
      const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.8);
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(5, 6, 13, 0.4)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      t += 0.016;
      raf = window.requestAnimationFrame(draw);
    };

    if (!prefersReducedMotion) {
      raf = window.requestAnimationFrame(draw);
    } else {
      // Static frame for reduced motion
      draw();
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Enhanced floating icons - dual audience appeal */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Professional icons */}
        <div className="floatIcon medical" style={{ position: 'absolute', top: '8%', right: '12%', fontSize: 48 }}>
          <span style={{ filter: 'drop-shadow(0 0 20px rgba(143, 211, 204, 0.5))' }}>🎧</span>
        </div>
        <div className="floatIcon medical" style={{ position: 'absolute', top: '55%', right: '8%', fontSize: 52 }}>
          <span style={{ filter: 'drop-shadow(0 0 20px rgba(175, 132, 186, 0.5))' }}>🧠</span>
        </div>
        <div className="floatIcon medical" style={{ position: 'absolute', top: '75%', left: '6%', fontSize: 44 }}>
          <span style={{ filter: 'drop-shadow(0 0 20px rgba(176, 18, 112, 0.3))' }}>🔬</span>
        </div>

        {/* Child-friendly icons */}
        <div className="floatIcon playful" style={{ position: 'absolute', top: '22%', left: '8%', fontSize: 38 }}>
          <span style={{ filter: 'drop-shadow(0 0 15px rgba(143, 211, 204, 0.4))' }}>♫</span>
        </div>
        <div className="floatIcon playful" style={{ position: 'absolute', top: '42%', left: '5%', fontSize: 32 }}>
          <span style={{ filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.4))' }}>⭐</span>
        </div>
        <div className="floatIcon playful" style={{ position: 'absolute', top: '35%', right: '6%', fontSize: 36 }}>
          <span style={{ filter: 'drop-shadow(0 0 15px rgba(175, 132, 186, 0.4))' }}>🎵</span>
        </div>
        <div className="floatIcon playful" style={{ position: 'absolute', top: '88%', right: '15%', fontSize: 30 }}>
          <span style={{ filter: 'drop-shadow(0 0 15px rgba(143, 211, 204, 0.4))' }}>💫</span>
        </div>

        {/* Sound wave decorations */}
        <div className="soundRing" style={{ position: 'absolute', top: '15%', left: '20%' }}>
          <div className="ring ring1" />
          <div className="ring ring2" />
          <div className="ring ring3" />
        </div>
        <div className="soundRing" style={{ position: 'absolute', bottom: '25%', right: '18%' }}>
          <div className="ring ring1" />
          <div className="ring ring2" />
          <div className="ring ring3" />
        </div>

        {/* Floating Logo Watermarks - roped across background */}
        <div className="logoWatermark logo1">
          <img src={assetUrl('assets/images/brain_logo.png')} alt="" loading="lazy" decoding="async" />
        </div>
        <div className="logoWatermark logo2">
          <img src={assetUrl('assets/images/brain_logo.png')} alt="" loading="lazy" decoding="async" />
        </div>
        <div className="logoWatermark logo3">
          <img src={assetUrl('assets/images/brain_logo.png')} alt="" loading="lazy" decoding="async" />
        </div>
        <div className="logoWatermark logo4">
          <img src={assetUrl('assets/images/brain_logo.png')} alt="" loading="lazy" decoding="async" />
        </div>
        <div className="logoWatermark logo5">
          <img src={assetUrl('assets/images/brain_logo.png')} alt="" loading="lazy" decoding="async" />
        </div>

        <style>{`
          .floatIcon {
            animation: floaty 7s ease-in-out infinite;
            opacity: 0.4;
            transition: opacity 0.3s, transform 0.3s;
          }
          .floatIcon.medical {
            animation-duration: 9s;
          }
          .floatIcon.playful {
            animation-duration: 6s;
          }
          .floatIcon:nth-child(2) { animation-delay: -2s; }
          .floatIcon:nth-child(3) { animation-delay: -4s; }
          .floatIcon:nth-child(4) { animation-delay: -1s; }
          .floatIcon:nth-child(5) { animation-delay: -3s; }
          .floatIcon:nth-child(6) { animation-delay: -5s; }
          .floatIcon:nth-child(7) { animation-delay: -0.5s; }

          @keyframes floaty {
            0%, 100% {
              transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
            }
            25% {
              transform: translate3d(8px, -15px, 0) rotate(3deg) scale(1.05);
            }
            50% {
              transform: translate3d(0, -25px, 0) rotate(0deg) scale(1);
            }
            75% {
              transform: translate3d(-8px, -15px, 0) rotate(-3deg) scale(1.05);
            }
          }

          .soundRing {
            width: 80px;
            height: 80px;
            position: relative;
          }
          .ring {
            position: absolute;
            inset: 0;
            border: 2px solid ${brandCyan};
            border-radius: 50%;
            animation: ringPulse 3s ease-out infinite;
            opacity: 0;
          }
          .ring1 { animation-delay: 0s; }
          .ring2 { animation-delay: 1s; }
          .ring3 { animation-delay: 2s; }

          @keyframes ringPulse {
            0% {
              transform: scale(0.3);
              opacity: 0.4;
            }
            100% {
              transform: scale(2.5);
              opacity: 0;
            }
          }

          /* Logo Watermarks - roped across background */
          .logoWatermark {
            position: absolute;
            pointer-events: none;
            opacity: 0.04;
            filter: grayscale(20%);
            animation: logoFloat 20s ease-in-out infinite;
          }
          .logoWatermark img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          .logo1 {
            top: 5%;
            left: 5%;
            width: 180px;
            height: 180px;
            animation-delay: 0s;
            animation-duration: 25s;
          }
          .logo2 {
            top: 30%;
            right: 3%;
            width: 220px;
            height: 220px;
            animation-delay: -5s;
            animation-duration: 30s;
            opacity: 0.03;
          }
          .logo3 {
            bottom: 40%;
            left: 8%;
            width: 150px;
            height: 150px;
            animation-delay: -10s;
            animation-duration: 22s;
          }
          .logo4 {
            bottom: 10%;
            right: 10%;
            width: 200px;
            height: 200px;
            animation-delay: -15s;
            animation-duration: 28s;
            opacity: 0.035;
          }
          .logo5 {
            top: 60%;
            left: 40%;
            width: 250px;
            height: 250px;
            animation-delay: -8s;
            animation-duration: 35s;
            opacity: 0.025;
          }

          @keyframes logoFloat {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg) scale(1);
            }
            25% {
              transform: translate(15px, -20px) rotate(5deg) scale(1.05);
            }
            50% {
              transform: translate(-10px, -35px) rotate(-3deg) scale(0.95);
            }
            75% {
              transform: translate(-20px, -15px) rotate(3deg) scale(1.02);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .floatIcon { animation: none; }
            .ring { animation: none; opacity: 0.15; transform: scale(1); }
            .logoWatermark { animation: none; }
          }
        `}</style>
      </div>
    </>
  );
});

BackgroundFX.displayName = 'BackgroundFX';

export default BackgroundFX;
