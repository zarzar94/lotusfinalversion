/**
 * Shared Animation Keyframes
 * Centralized animation definitions to avoid duplication across components
 */

// Common keyframe definitions that can be injected into style tags
export const keyframes = {
  // Basic transforms
  spin: `@keyframes spin { to { transform: rotate(360deg); } }`,

  fadeIn: `@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }`,

  fadeInUp: `@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }`,

  fadeInDown: `@keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }`,

  slideInUp: `@keyframes slideInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }`,

  slideInDown: `@keyframes slideInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }`,

  // Pulse effects
  pulse: `@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }`,

  pulseScale: `@keyframes pulseScale {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }`,

  pulseRing: `@keyframes pulseRing {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(2); opacity: 0; }
  }`,

  // Glow effects
  glow: `@keyframes glow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }`,

  glowPulse: `@keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 5px currentColor; }
    50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
  }`,

  // Float effects
  float: `@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }`,

  floatSlight: `@keyframes floatSlight {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }`,

  // Scale effects
  scaleIn: `@keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }`,

  scaleOut: `@keyframes scaleOut {
    from { transform: scale(1); opacity: 1; }
    to { transform: scale(0.9); opacity: 0; }
  }`,

  // Shimmer/loading effects
  shimmer: `@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }`,

  skeleton: `@keyframes skeleton {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  }`,

  // Scan line effect
  scanLine: `@keyframes scanLine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }`,

  // Data stream
  dataStream: `@keyframes dataStream {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }`,

  // Bounce
  bounce: `@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-25%); }
  }`,

  // Shake
  shake: `@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }`,
} as const;

/**
 * Combine multiple keyframe definitions into a single string
 */
export function combineKeyframes(...names: (keyof typeof keyframes)[]): string {
  return names.map(name => keyframes[name]).join('\n');
}

/**
 * Get all keyframes as a single CSS string
 */
export function getAllKeyframes(): string {
  return Object.values(keyframes).join('\n');
}

/**
 * Animation timing presets
 */
export const timing = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '700ms',
} as const;

/**
 * Easing function presets
 */
export const easing = {
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

/**
 * Create an animation string
 */
export function animation(
  name: string,
  duration: string = timing.normal,
  easingFn: string = easing.smooth,
  fillMode: string = 'forwards'
): string {
  return `${name} ${duration} ${easingFn} ${fillMode}`;
}
