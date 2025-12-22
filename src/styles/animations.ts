/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - UNIFIED ANIMATION SYSTEM
 * Centralized keyframes to prevent duplication across components
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { brand } from './tokens';

// ─────────────────────────────────────────────────────────────────────────────
// CORE ANIMATIONS
// Fundamental animations used across the entire application
// ─────────────────────────────────────────────────────────────────────────────
export const coreAnimations = `
  /* ═══════════════════════════════════════════════════════════════════════════
     FADE ANIMATIONS
     ═══════════════════════════════════════════════════════════════════════════ */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeSlideLeft {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes fadeSlideRight {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     SPIN & ROTATE
     ═══════════════════════════════════════════════════════════════════════════ */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes spinReverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }

  @keyframes orbit {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes orbitReverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     PULSE & GLOW ANIMATIONS
     ═══════════════════════════════════════════════════════════════════════════ */
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes statusPulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 6px ${brand.success}; }
    50% { opacity: 0.6; box-shadow: 0 0 10px ${brand.success}; }
  }

  @keyframes glowPulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  @keyframes breathingGlow {
    0%, 100% {
      box-shadow: 0 0 5px ${brand.cyan}33, 0 0 10px ${brand.cyan}22, 0 0 15px ${brand.cyan}11;
    }
    50% {
      box-shadow: 0 0 10px ${brand.cyan}55, 0 0 20px ${brand.cyan}33, 0 0 30px ${brand.cyan}22;
    }
  }

  @keyframes energyPulse {
    0%, 100% { box-shadow: 0 0 10px ${brand.cyan}22, inset 0 0 10px ${brand.cyan}11; }
    50% { box-shadow: 0 0 25px ${brand.cyan}44, inset 0 0 20px ${brand.cyan}22; }
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

  @keyframes circuitPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }

  @keyframes neuralPulse {
    0%, 100% { opacity: 0.2; filter: blur(0px); }
    50% { opacity: 0.6; filter: blur(1px); }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     SCAN LINE EFFECTS
     ═══════════════════════════════════════════════════════════════════════════ */
  @keyframes scanLine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes scanLineVertical {
    0% { top: -100%; }
    100% { top: 200%; }
  }

  @keyframes horizontalScan {
    0% { transform: translateX(-100%); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
  }

  @keyframes verticalScan {
    0% { transform: translateY(-100%); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }

  @keyframes scannerLine {
    0% { top: 0; opacity: 1; }
    50% { opacity: 0.5; }
    100% { top: 100%; opacity: 1; }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     DATA STREAM ANIMATIONS
     ═══════════════════════════════════════════════════════════════════════════ */
  @keyframes dataStream {
    0% { transform: translateY(0); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100px); opacity: 0; }
  }

  @keyframes dataStreamFlow {
    0% { transform: translateY(100%); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100%); opacity: 0; }
  }

  @keyframes dataFlow {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     HOLOGRAPHIC EFFECTS
     ═══════════════════════════════════════════════════════════════════════════ */
  @keyframes holoBorderFlow {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }

  @keyframes holoShimmer {
    0% { background-position: -200% 0; filter: hue-rotate(0deg); }
    50% { filter: hue-rotate(30deg); }
    100% { background-position: 200% 0; filter: hue-rotate(0deg); }
  }

  @keyframes holoRing {
    0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 0.3; }
    50% { opacity: 0.6; }
    100% { transform: translate(-50%, -50%) rotate(360deg); opacity: 0.3; }
  }

  @keyframes holoInterference {
    0%, 100% { transform: translateX(0); opacity: 1; }
    2% { transform: translateX(-3px); opacity: 0.85; }
    4% { transform: translateX(3px); opacity: 1; }
    6% { transform: translateX(0); opacity: 0.9; }
  }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     SOUND & AUDIO ANIMATIONS
     ═══════════════════════════════════════════════════════════════════════════ */
  @keyframes soundWave {
    0%, 100% { transform: scaleY(0.3); }
    50% { transform: scaleY(1); }
  }

  @keyframes frequencyPulse {
    0% {
      transform: scale(0.8);
      opacity: 1;
      box-shadow: 0 0 0 0 ${brand.cyan}66;
    }
    70% {
      transform: scale(1);
      opacity: 0.7;
      box-shadow: 0 0 0 20px ${brand.cyan}00;
    }
    100% {
      transform: scale(0.8);
      opacity: 1;
      box-shadow: 0 0 0 0 ${brand.cyan}00;
    }
  }

  @keyframes spectrumBar {
    0%, 100% { height: 20%; }
    25% { height: 80%; }
    50% { height: 40%; }
    75% { height: 90%; }
  }

  @keyframes brainWave {
    0%, 100% { transform: scaleY(1); }
    25% { transform: scaleY(1.3); }
    50% { transform: scaleY(0.8); }
    75% { transform: scaleY(1.2); }
  }

  @keyframes auditoryPulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     ENERGY & WAVE ANIMATIONS
     ═══════════════════════════════════════════════════════════════════════════ */
  @keyframes energyWave {
    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
  }

  @keyframes ripple {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }

  @keyframes statusPulseRing {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(2); opacity: 0; }
  }

  @keyframes energyCharge {
    0% { background-size: 0% 100%; }
    100% { background-size: 100% 100%; }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RADAR & CIRCUIT ANIMATIONS
     ═══════════════════════════════════════════════════════════════════════════ */
  @keyframes radarSweep {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }

  @keyframes circuitGlow {
    0%, 100% {
      box-shadow: 0 0 5px ${brand.cyan}33, inset 0 0 5px ${brand.cyan}11;
    }
    50% {
      box-shadow: 0 0 20px ${brand.cyan}55, inset 0 0 10px ${brand.cyan}22;
    }
  }

  @keyframes circuitPath {
    0% { stroke-dashoffset: 1000; }
    100% { stroke-dashoffset: 0; }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     NEURAL NETWORK ANIMATIONS
     ═══════════════════════════════════════════════════════════════════════════ */
  @keyframes nodeActivate {
    0% { transform: scale(1); box-shadow: 0 0 10px ${brand.cyan}44; }
    50% { transform: scale(1.3); box-shadow: 0 0 30px ${brand.cyan}88, 0 0 60px ${brand.cyan}44; }
    100% { transform: scale(1); box-shadow: 0 0 10px ${brand.cyan}44; }
  }

  @keyframes connectionFlow {
    0% { stroke-dashoffset: 20; opacity: 0.3; }
    50% { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0.3; }
  }

  @keyframes synapseFire {
    0% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1.2); }
    100% { opacity: 0; transform: scale(0); }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     TEXT & UI ANIMATIONS
     ═══════════════════════════════════════════════════════════════════════════ */
  @keyframes textReveal {
    0% { opacity: 0; letter-spacing: 8px; filter: blur(4px); }
    100% { opacity: 1; letter-spacing: inherit; filter: blur(0); }
  }

  @keyframes cursorBlink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  @keyframes statusBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  @keyframes glitchText {
    0%, 100% { transform: translate(0); text-shadow: -2px 0 ${brand.pink}, 2px 0 ${brand.cyan}; }
    25% { transform: translate(-2px, 1px); text-shadow: 2px 0 ${brand.pink}, -2px 0 ${brand.cyan}; }
    50% { transform: translate(2px, -1px); text-shadow: -2px 0 ${brand.cyan}, 2px 0 ${brand.pink}; }
    75% { transform: translate(-1px, 2px); text-shadow: 2px 0 ${brand.cyan}, -2px 0 ${brand.pink}; }
  }

  @keyframes navGlitch {
    0%, 100% { transform: translateX(0); opacity: 1; }
    92% { transform: translateX(0); opacity: 1; }
    93% { transform: translateX(-2px); opacity: 0.8; }
    94% { transform: translateX(2px); opacity: 1; }
    95% { transform: translateX(0); opacity: 0.9; }
  }

  @keyframes neonFlicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
      opacity: 1;
      text-shadow: 0 0 4px ${brand.cyan}, 0 0 11px ${brand.cyan}, 0 0 19px ${brand.cyan}, 0 0 40px ${brand.cyan};
    }
    20%, 24%, 55% { opacity: 0.8; text-shadow: none; }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     SLIDE & CARD ANIMATIONS
     ═══════════════════════════════════════════════════════════════════════════ */
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes cardLift {
    0% {
      transform: translateY(0) scale(1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    100% {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 60px ${brand.cyan}22;
    }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-5px) rotate(1deg); }
    75% { transform: translateY(5px) rotate(-1deg); }
  }

  @keyframes particleFloat3D {
    0%, 100% { transform: translate3d(0, 0, 0) rotateX(0deg); }
    25% { transform: translate3d(10px, -15px, 20px) rotateX(5deg); }
    50% { transform: translate3d(-5px, -25px, 10px) rotateX(-5deg); }
    75% { transform: translate3d(-15px, -10px, 30px) rotateX(3deg); }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     ACHIEVEMENT & GAMIFICATION
     ═══════════════════════════════════════════════════════════════════════════ */
  @keyframes achievementBounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @keyframes confetti {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
  }

  @keyframes progressRing {
    0% { stroke-dashoffset: 283; }
    100% { stroke-dashoffset: 0; }
  }

  @keyframes rotateGlow {
    0% { transform: rotate(0deg); filter: drop-shadow(0 0 5px ${brand.cyan}44); }
    50% { filter: drop-shadow(0 0 15px ${brand.cyan}88); }
    100% { transform: rotate(360deg); filter: drop-shadow(0 0 5px ${brand.cyan}44); }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     PAGE TRANSITIONS
     ═══════════════════════════════════════════════════════════════════════════ */
  @keyframes pageEnterFade {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes bgPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @keyframes innerPulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }

  @keyframes orbitDot {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes scrollHint {
    0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.6; }
    50% { transform: translateX(-50%) translateY(10px); opacity: 1; }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     SCROLL INDICATOR
     ═══════════════════════════════════════════════════════════════════════════ */
  @keyframes scrollIndicator {
    0%, 100% { transform: translateY(0); opacity: 0.6; }
    50% { transform: translateY(8px); opacity: 1; }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     STAGGER ANIMATION DELAYS
     Helper classes for sequential animations
     ═══════════════════════════════════════════════════════════════════════════ */
  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.1s; }
  .stagger-3 { animation-delay: 0.15s; }
  .stagger-4 { animation-delay: 0.2s; }
  .stagger-5 { animation-delay: 0.25s; }
  .stagger-6 { animation-delay: 0.3s; }
  .stagger-7 { animation-delay: 0.35s; }
  .stagger-8 { animation-delay: 0.4s; }

  /* ═══════════════════════════════════════════════════════════════════════════
     REDUCED MOTION SUPPORT
     Accessibility: Disable animations for users who prefer it
     ═══════════════════════════════════════════════════════════════════════════ */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION PRESETS
// Pre-defined animation strings for easy component usage
// ─────────────────────────────────────────────────────────────────────────────
export const animationPresets = {
  // Entry animations
  fadeIn: 'fadeIn 0.3s ease-out forwards',
  fadeInUp: 'fadeInUp 0.4s ease-out forwards',
  fadeInDown: 'fadeInDown 0.4s ease-out forwards',
  fadeInScale: 'fadeInScale 0.4s ease-out forwards',
  slideDown: 'slideDown 0.3s ease-out forwards',
  slideUp: 'slideUp 0.3s ease-out forwards',

  // Continuous animations
  spin: 'spin 1s linear infinite',
  spinSlow: 'spin 3s linear infinite',
  pulse: 'pulse 2s ease-in-out infinite',
  float: 'float 3s ease-in-out infinite',
  breathingGlow: 'breathingGlow 3s ease-in-out infinite',

  // Lab-tech effects
  statusPulse: 'statusPulse 2s ease-in-out infinite',
  glowPulse: 'glowPulse 3s ease-in-out infinite',
  scanLine: 'scanLine 4s linear infinite',
  dataStream: 'dataStream 3s linear infinite',
  circuitPulse: 'circuitPulse 2s ease-in-out infinite',

  // Sound lab
  soundWave: 'soundWave 0.5s ease-in-out infinite',
  frequencyPulse: 'frequencyPulse 1.5s ease-in-out infinite',
  brainPulse: 'brainPulse 4s ease-in-out infinite',

  // Holographic
  holoShimmer: 'holoShimmer 3s ease-in-out infinite',
  holoBorderFlow: 'holoBorderFlow 4s linear infinite',

  // Interactive
  cardLift: 'cardLift 0.3s ease forwards',
  achievementBounce: 'achievementBounce 0.6s ease-in-out',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION UTILITIES
// Helper functions for generating animation styles
// ─────────────────────────────────────────────────────────────────────────────
export function createStaggerDelay(index: number, baseDelay = 0.1): string {
  return `${index * baseDelay}s`;
}

export function createAnimationStyle(
  animation: keyof typeof animationPresets,
  delay?: number
): { animation: string; animationDelay?: string } {
  const result: { animation: string; animationDelay?: string } = {
    animation: animationPresets[animation],
  };
  if (delay !== undefined) {
    result.animationDelay = `${delay}s`;
  }
  return result;
}
