/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS DESIGN SYSTEM - COMPONENT BRIDGE
 * Re-exports from the unified design system at src/styles/
 * This file maintains backward compatibility while providing access to the
 * comprehensive new design system including module-specific styles for issues #37-43
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { CSSProperties } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// RE-EXPORT UNIFIED DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

// Design tokens
export {
  brand,
  audio,
  semantic,
  typography,
  spacing,
  radius,
  shadows,
  gradients,
  transitions,
  breakpoints,
  media,
  zIndex,
  durations,
} from '../styles';

// Animations
export {
  coreAnimations,
  animationPresets,
  createStaggerDelay,
  reducedMotionAnimations,
} from '../styles';

// Component styles
export {
  layout,
  text,
  buttons,
  forms,
  cards,
  badges,
  hud,
  audioViz,
  dataPanel,
  modal,
  progress,
  tooltip,
} from '../styles';

// Module-specific styles (Issues #37-43)
export {
  moduleMetrics,      // #37 - Session storage
  attentionModule,    // #38 - CPT/odd-one-out
  binauralModule,     // #39 - Dichotic listening
  snrModule,          // #40 - Speech-in-noise
  analytics,          // #41 - Longitudinal charts
  dashboardExport,    // #42 - Role dashboards
  instructionFlow,    // #43 - Practice trials
} from '../styles';

// Style hooks
export {
  useGlobalAnimations,
  useHudBrackets,
  useStaggeredAnimation,
  useCardHover,
  useLabPanel,
  useStatusBadge,
  useButtonStyle,
  useContainerStyle,
  useFrequencyColor,
  useProgressGradient,
  useScrolledHeader,
  useRtlPosition,
  useNavLinkStyle,
} from '../styles';

// Legacy compatibility re-exports
export {
  brandCyan,
  brandPurple,
  brandPurpleDark,
  brandPink,
  brandInk,
  brandPanel,
  colors,
  styles,
  labTechStyles,
} from '../styles';

// ═══════════════════════════════════════════════════════════════════════════════
// ADDITIONAL COMPONENT-SPECIFIC EXPORTS
// Extended styles that complement the core design system
// ═══════════════════════════════════════════════════════════════════════════════

// Extended brand colors for convenience
export const brandColors = {
  cyan: '#8FD3CC',
  purple: '#AF84BA',
  purpleDark: '#774E87',
  pink: '#B01270',
  whatsapp: '#25D366',
  whatsappLight: 'rgba(37, 211, 102, 0.12)',
  linkedin: '#0077B5',
  linkedinLight: 'rgba(0, 119, 181, 0.12)',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

// Media queries (legacy format)
export const mediaQueries = {
  phone: '@media (max-width: 479px)',
  tablet: '@media (min-width: 480px) and (max-width: 1023px)',
  desktop: '@media (min-width: 1024px)',
};

// Lab-tech design tokens
export const labTech = {
  panel: {
    background: 'linear-gradient(135deg, rgba(13,17,23,0.9), rgba(20,25,35,0.85))',
    border: 'rgba(143, 211, 204, 0.20)',
    glow: 'rgba(143, 211, 204, 0.08)',
  },
  corner: {
    size: 12,
    color: 'rgba(143, 211, 204, 0.50)',
    width: 2,
  },
  scanLine: {
    color: 'linear-gradient(90deg, transparent, rgba(143,211,204,0.3), transparent)',
    speed: '3s',
  },
  grid: {
    background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 28px)',
    size: 28,
    color: 'rgba(255, 255, 255, 0.04)',
  },
  data: {
    active: '#8FD3CC',
    warning: '#f59e0b',
    critical: '#ef4444',
    offline: 'rgba(255,255,255,0.3)',
  },
};

// Lab-tech animations
export const labTechAnimations = `
  @keyframes scanLine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes statusPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes dataStream {
    0% { background-position: 0 0; }
    100% { background-position: 28px 28px; }
  }
  @keyframes energyPulse {
    0%, 100% { box-shadow: 0 0 8px rgba(143,211,204,0.3), 0 0 16px rgba(143,211,204,0.15); }
    50% { box-shadow: 0 0 16px rgba(143,211,204,0.5), 0 0 32px rgba(143,211,204,0.25); }
  }
  @keyframes hologramGlow {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.15) hue-rotate(5deg); }
  }
  @keyframes neuralPulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.02); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes glitchFlicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.85; transform: translateX(-1px); }
  }
`;

// Lab-tech advanced panel styles
export const labTechAdvanced = {
  cornerBracket: (position: 'tl' | 'tr' | 'bl' | 'br'): CSSProperties => {
    const size = labTech.corner.size;
    const base: CSSProperties = {
      position: 'absolute',
      width: size,
      height: size,
      borderColor: labTech.corner.color,
      borderStyle: 'solid',
    };
    const positions = {
      tl: { top: 4, left: 4, borderWidth: `${labTech.corner.width}px 0 0 ${labTech.corner.width}px` },
      tr: { top: 4, right: 4, borderWidth: `${labTech.corner.width}px ${labTech.corner.width}px 0 0` },
      bl: { bottom: 4, left: 4, borderWidth: `0 0 ${labTech.corner.width}px ${labTech.corner.width}px` },
      br: { bottom: 4, right: 4, borderWidth: `0 ${labTech.corner.width}px ${labTech.corner.width}px 0` },
    };
    return { ...base, ...positions[position] };
  },
  scanLine: (): CSSProperties => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    background: labTech.scanLine.color,
    animation: `scanLine ${labTech.scanLine.speed} linear infinite`,
  }),
  grid: (): CSSProperties => ({
    backgroundImage: labTech.grid.background,
    backgroundSize: `${labTech.grid.size}px ${labTech.grid.size}px`,
    animation: 'dataStream 2s linear infinite',
  }),
};

// Advanced animations
export const advancedAnimations = `
  @keyframes waveformPulse {
    0%, 100% { transform: scaleY(0.3); }
    50% { transform: scaleY(1); }
  }
  @keyframes soundRipple {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  @keyframes brainGlow {
    0%, 100% { filter: brightness(1) drop-shadow(0 0 8px rgba(143,211,204,0.3)); }
    50% { filter: brightness(1.2) drop-shadow(0 0 20px rgba(143,211,204,0.5)); }
  }
  @keyframes dataFlowLeft {
    0% { transform: translateX(100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(-100%); opacity: 0; }
  }
  @keyframes dataFlowRight {
    0% { transform: translateX(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
  }
  @keyframes spinGlow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes pulseGradient {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  @keyframes floatUp {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

// Workflow styles
export const workflowStyles: Record<string, CSSProperties> = {
  container: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  },
  step: {
    padding: 20,
    borderRadius: 14,
    background: 'linear-gradient(135deg, rgba(143,211,204,0.08), rgba(175,132,186,0.05))',
    border: '1px solid rgba(255,255,255,0.10)',
    position: 'relative',
    transition: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #8FD3CC, #AF84BA)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 800,
    color: '#05060d',
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#f7f8fb',
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 1.5,
  },
  connector: {
    position: 'absolute',
    top: '50%',
    right: -16,
    width: 32,
    height: 2,
    background: 'linear-gradient(90deg, #8FD3CC, transparent)',
  },
};

// Sound lab colors
export const soundLabColors = {
  frequency: {
    low: '#FF6B6B',
    midLow: '#F59E0B',
    mid: '#4ECDC4',
    midHigh: '#A855F7',
    high: '#F472B6',
  },
  neural: {
    alpha: '#22D3EE',
    beta: '#A78BFA',
    theta: '#34D399',
    delta: '#FB923C',
  },
  signal: {
    active: '#8FD3CC',
    processing: '#AF84BA',
    standby: 'rgba(255,255,255,0.3)',
    alert: '#ef4444',
  },
};

// Glass effects
export const glassEffects = {
  panel: {
    background: 'rgba(13, 17, 23, 0.75)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.10)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  },
  card: {
    background: 'rgba(26, 31, 46, 0.65)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(143, 211, 204, 0.15)',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.25)',
  },
  overlay: {
    background: 'rgba(5, 6, 13, 0.88)',
    backdropFilter: 'blur(12px)',
  },
};

// Sound wave styles
export const soundWaveStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    height: 40,
  },
  bar: (index: number, isPlaying: boolean): CSSProperties => ({
    width: 4,
    height: isPlaying ? `${30 + Math.sin(index * 0.5) * 20}%` : '15%',
    borderRadius: 2,
    background: `linear-gradient(180deg, #8FD3CC, #AF84BA)`,
    animation: isPlaying ? `waveformPulse 0.5s ease-in-out infinite` : 'none',
    animationDelay: `${index * 0.05}s`,
    transition: '300ms ease',
  }),
};

// Futuristic buttons
export const futuristicButtons: Record<string, CSSProperties> = {
  neon: {
    padding: '12px 24px',
    borderRadius: 10,
    background: 'transparent',
    border: '2px solid #8FD3CC',
    color: '#8FD3CC',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transition: '300ms ease',
    boxShadow: '0 0 15px rgba(143,211,204,0.3), inset 0 0 15px rgba(143,211,204,0.1)',
  },
  holographic: {
    padding: '14px 28px',
    borderRadius: 12,
    background: 'linear-gradient(135deg, rgba(143,211,204,0.15), rgba(175,132,186,0.15))',
    border: '1px solid rgba(143,211,204,0.30)',
    color: '#f7f8fb',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    position: 'relative',
    transition: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 32px rgba(143,211,204,0.15)',
    animation: 'hologramGlow 3s ease-in-out infinite',
  },
  gradient: {
    padding: '14px 28px',
    borderRadius: 12,
    background: 'linear-gradient(135deg, #8FD3CC, #AF84BA)',
    border: 'none',
    color: '#05060d',
    fontWeight: 800,
    fontSize: 14,
    cursor: 'pointer',
    transition: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 12px 36px rgba(143,211,204,0.24)',
  },
  danger: {
    padding: '12px 24px',
    borderRadius: 10,
    background: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.30)',
    color: '#ef4444',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    transition: '300ms ease',
  },
};

// Neural styles
export const neuralStyles = {
  container: {
    position: 'relative' as const,
    overflow: 'hidden',
  },
  node: (x: number, y: number, size = 8): CSSProperties => ({
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    width: size,
    height: size,
    borderRadius: '50%',
    background: '#8FD3CC',
    boxShadow: '0 0 12px rgba(143,211,204,0.5)',
    animation: 'neuralPulse 2s ease-in-out infinite',
  }),
  connection: (startX: number, startY: number, endX: number, endY: number): CSSProperties => ({
    position: 'absolute',
    left: `${startX}%`,
    top: `${startY}%`,
    width: `${Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2)}%`,
    height: 1,
    background: 'linear-gradient(90deg, rgba(143,211,204,0.5), rgba(175,132,186,0.5))',
    transform: `rotate(${Math.atan2(endY - startY, endX - startX) * (180 / Math.PI)}deg)`,
    transformOrigin: 'left center',
  }),
};

// Data panel styles
export const dataPanelStyles: Record<string, CSSProperties> = {
  container: {
    background: 'linear-gradient(135deg, rgba(13,17,23,0.9), rgba(20,25,35,0.85))',
    border: '1px solid rgba(143,211,204,0.20)',
    borderRadius: 14,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    color: '#8FD3CC',
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#22c55e',
    animation: 'statusPulse 2s ease-in-out infinite',
  },
  content: {
    display: 'grid',
    gap: 12,
  },
  metric: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  metricLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 700,
    color: '#f7f8fb',
  },
};

// Futuristic cards
export const futuristicCards: Record<string, CSSProperties> = {
  glass: {
    background: 'rgba(26, 31, 46, 0.65)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(143, 211, 204, 0.15)',
    borderRadius: 18,
    padding: 24,
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.25)',
    transition: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  gradient: {
    background: 'linear-gradient(135deg, rgba(143,211,204,0.08), rgba(175,132,186,0.05))',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 18,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    transition: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  holographic: {
    background: `linear-gradient(135deg, rgba(143,211,204,0.15) 0%, transparent 25%), linear-gradient(225deg, rgba(175,132,186,0.15) 0%, transparent 25%), linear-gradient(315deg, rgba(176,18,112,0.10) 0%, transparent 25%), rgba(13, 17, 23, 0.85)`,
    border: '1px solid rgba(143, 211, 204, 0.20)',
    borderRadius: 18,
    padding: 24,
    boxShadow: '0 12px 36px rgba(143,211,204,0.12)',
    animation: 'hologramGlow 4s ease-in-out infinite',
    transition: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  soundLab: {
    background: 'linear-gradient(180deg, rgba(26,31,46,0.95) 0%, rgba(13,17,23,0.95) 100%)',
    border: '1px solid rgba(143, 211, 204, 0.20)',
    borderRadius: 18,
    padding: 24,
    position: 'relative',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    transition: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Sound lab animations
export const soundLabAnimations = `
  @keyframes frequencyBar {
    0%, 100% { transform: scaleY(0.3); }
    25% { transform: scaleY(0.7); }
    50% { transform: scaleY(1); }
    75% { transform: scaleY(0.5); }
  }
  @keyframes neuralWave {
    0% { stroke-dashoffset: 100; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes brainPulse {
    0%, 100% { opacity: 0.6; transform: scale(0.95); }
    50% { opacity: 1; transform: scale(1); }
  }
  @keyframes soundRing {
    0% { transform: scale(0.8); opacity: 1; border-width: 3px; }
    100% { transform: scale(1.8); opacity: 0; border-width: 1px; }
  }
  @keyframes audioSpectrum {
    0%, 100% { height: 20%; }
    10% { height: 60%; }
    20% { height: 40%; }
    30% { height: 80%; }
    40% { height: 30%; }
    50% { height: 70%; }
    60% { height: 50%; }
    70% { height: 90%; }
    80% { height: 35%; }
    90% { height: 55%; }
  }
  @keyframes earPulse {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(143,211,204,0.3)); }
    50% { transform: scale(1.05); filter: drop-shadow(0 0 16px rgba(143,211,204,0.5)); }
  }
  @keyframes signalFlow {
    0% { stroke-dashoffset: 20; opacity: 0; }
    50% { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0; }
  }
  @keyframes processingPulse {
    0%, 100% { background: rgba(143,211,204,0.1); }
    50% { background: rgba(143,211,204,0.25); }
  }
  @keyframes textGlow {
    0%, 100% { text-shadow: 0 0 8px rgba(143,211,204,0.5); }
    50% { text-shadow: 0 0 20px rgba(143,211,204,0.8), 0 0 40px rgba(143,211,204,0.4); }
  }
  @keyframes borderGlow {
    0%, 100% { border-color: rgba(143,211,204,0.3); box-shadow: 0 0 20px rgba(143,211,204,0.1); }
    50% { border-color: rgba(143,211,204,0.6); box-shadow: 0 0 30px rgba(143,211,204,0.2); }
  }
`;

// Hover effects
export const hoverEffects = {
  lift: {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  },
  glow: (color = '#8FD3CC') => ({
    boxShadow: `0 0 30px ${color}40, 0 20px 40px rgba(0, 0, 0, 0.3)`,
  }),
  scale: {
    transform: 'scale(1.02)',
  },
  borderGlow: (color = '#8FD3CC') => ({
    borderColor: `${color}60`,
    boxShadow: `0 0 20px ${color}20`,
  }),
};

// Focus styles
export const focusStyles = {
  ring: (color = '#8FD3CC') => ({
    outline: 'none',
    boxShadow: `0 0 0 3px ${color}40`,
  }),
  glow: (color = '#8FD3CC') => ({
    outline: 'none',
    boxShadow: `0 0 0 2px ${color}60, 0 0 16px ${color}30`,
  }),
};

// Loading styles
export const loadingStyles: Record<string, CSSProperties> = {
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: '#8FD3CC',
    borderRadius: '50%',
    animation: 'spinGlow 0.8s linear infinite',
  },
  skeleton: {
    background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s ease-in-out infinite',
    borderRadius: 8,
  },
  pulse: {
    animation: 'neuralPulse 1.5s ease-in-out infinite',
  },
};

// Tooltip styles
export const tooltipStyles: Record<string, CSSProperties> = {
  container: {
    position: 'absolute',
    background: 'rgba(13, 17, 23, 0.95)',
    border: '1px solid rgba(143, 211, 204, 0.25)',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 12,
    color: '#f7f8fb',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    zIndex: 100,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    animation: 'fadeInUp 0.2s ease-out',
  },
  arrow: {
    position: 'absolute',
    width: 8,
    height: 8,
    background: 'rgba(13, 17, 23, 0.95)',
    border: '1px solid rgba(143, 211, 204, 0.25)',
    borderRight: 'none',
    borderBottom: 'none',
    transform: 'rotate(45deg)',
  },
};
