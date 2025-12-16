import { useEffect, useMemo, useRef } from 'react';

import { brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';

/**
 * Futuristic Sound Lab background:
 * - animated spectrogram-style bars
 * - subtle gradients (brand-matched)
 *
 * Runs fully client-side and respects "prefers-reduced-motion".
 */
const BackgroundFX = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const rand = (seed: number) => {
      // simple deterministic random
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const barCount = () => Math.max(48, Math.floor(window.innerWidth / 18));
    let bars = new Array(barCount()).fill(0).map((_, i) => ({
      phase: rand(i + 1) * Math.PI * 2,
      speed: 0.6 + rand(i + 2) * 1.1,
      amp: 0.25 + rand(i + 3) * 0.75,
    }));

    let t = 0;
    let raf = 0;

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // background wash
      ctx.clearRect(0, 0, w, h);

      const g = ctx.createRadialGradient(w * 0.2, h * 0.1, 0, w * 0.2, h * 0.1, Math.max(w, h));
      g.addColorStop(0, 'rgba(175,132,186,0.22)');
      g.addColorStop(0.55, 'rgba(143,211,204,0.10)');
      g.addColorStop(1, 'rgba(5,6,13,0.00)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(w * 0.85, h * 0.05, 0, w * 0.85, h * 0.05, Math.max(w, h) * 0.9);
      g2.addColorStop(0, 'rgba(176,18,112,0.14)');
      g2.addColorStop(1, 'rgba(5,6,13,0.00)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // spectrogram bars
      const count = barCount();
      if (bars.length !== count) {
        bars = new Array(count).fill(0).map((_, i) => ({
          phase: rand(i + 1) * Math.PI * 2,
          speed: 0.6 + rand(i + 2) * 1.1,
          amp: 0.25 + rand(i + 3) * 0.75,
        }));
      }

      const barW = w / count;
      const baseY = h * 0.78;

      const grad = ctx.createLinearGradient(0, baseY - 180, 0, baseY + 80);
      grad.addColorStop(0, 'rgba(143,211,204,0.00)');
      grad.addColorStop(0.2, 'rgba(143,211,204,0.28)');
      grad.addColorStop(0.55, 'rgba(175,132,186,0.22)');
      grad.addColorStop(0.85, 'rgba(176,18,112,0.18)');
      grad.addColorStop(1, 'rgba(176,18,112,0.00)');

      for (let i = 0; i < count; i += 1) {
        const b = bars[i];
        const wave = Math.sin(t * b.speed + b.phase) * 0.5 + 0.5;
        const noise = Math.sin((t * 0.9 + i) * 0.7) * 0.18 + 0.18;
        const value = Math.max(0, Math.min(1, wave * b.amp + noise));
        const height = 18 + value * 160;

        const x = i * barW;
        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.55;
        ctx.fillRect(x + barW * 0.25, baseY - height, Math.max(2, barW * 0.45), height);
      }
      ctx.globalAlpha = 1;

      // top tone-curve line
      ctx.strokeStyle = 'rgba(143,211,204,0.22)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 18) {
        const y = h * 0.26 + Math.sin(t * 0.8 + x * 0.012) * 10 + Math.sin(t * 0.4 + x * 0.022) * 6;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // subtle vignette
      ctx.fillStyle = 'rgba(5,6,13,0.55)';
      ctx.fillRect(0, 0, w, 18);
      ctx.fillRect(0, h - 22, w, 22);

      t += 0.022;
      raf = window.requestAnimationFrame(draw);
    };

    if (!prefersReducedMotion) {
      raf = window.requestAnimationFrame(draw);
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
          opacity: 0.9,
        }}
      />

      {/* Floating icons (pure CSS for performance) */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.35,
          overflow: 'hidden',
        }}
      >
        <div className="floatIcon" style={{ position: 'absolute', top: '14%', right: '8%', fontSize: 42, color: brandCyan }}>
          🎧
        </div>
        <div className="floatIcon" style={{ position: 'absolute', top: '64%', right: '12%', fontSize: 46, color: brandPurple }}>
          🧠
        </div>
        <div className="floatIcon" style={{ position: 'absolute', top: '26%', left: '10%', fontSize: 36, color: brandPink }}>
          ♫
        </div>
        <div className="floatIcon" style={{ position: 'absolute', top: '72%', left: '18%', fontSize: 38, color: brandPurpleDark }}>
          🔬
        </div>

        <style>{`
          .floatIcon {
            animation: floaty 7.5s ease-in-out infinite;
            filter: drop-shadow(0 16px 40px rgba(0,0,0,0.35));
          }
          .floatIcon:nth-child(2) { animation-duration: 9s; }
          .floatIcon:nth-child(3) { animation-duration: 8.2s; }
          .floatIcon:nth-child(4) { animation-duration: 10.2s; }

          @keyframes floaty {
            0% { transform: translate3d(0,0,0) rotate(0deg); }
            50% { transform: translate3d(0,-18px,0) rotate(3deg); }
            100% { transform: translate3d(0,0,0) rotate(0deg); }
          }

          @media (prefers-reduced-motion: reduce) {
            .floatIcon { animation: none; }
          }
        `}</style>
      </div>
    </>
  );
};

export default BackgroundFX;
