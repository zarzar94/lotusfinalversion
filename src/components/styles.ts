import type { CSSProperties } from 'react';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOTUS DESIGN SYSTEM
 * A comprehensive design token system for consistent, polished UI
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// COLOR PALETTE
// Brand colors extracted from AIT_LOGO + posters
// ─────────────────────────────────────────────────────────────────────────────
export const brandPurple = '#AF84BA';          // Primary (logo lavender)
export const brandPurpleDark = '#774E87';      // Deep purple (slides)
export const brandCyan = '#8FD3CC';            // Teal accent (logo)
export const brandPink = '#B01270';            // Magenta accent (slides)
export const brandInk = '#05060d';             // Background
export const brandPanel = '#0b0f1c';           // Surface

// Extended brand colors for consistency across components
export const brandColors = {
  // Primary brand colors
  cyan: brandCyan,
  purple: brandPurple,
  purpleDark: brandPurpleDark,
  pink: brandPink,
  // Functional colors (consistent across the app)
  whatsapp: '#25D366',
  whatsappDark: '#128C7E',
  whatsappLight: 'rgba(37, 211, 102, 0.12)',
  youtube: '#FF0000',
  linkedin: '#0077B5',
  linkedinLight: 'rgba(0, 119, 181, 0.12)',
  gold: '#FFD700',
  goldLight: 'rgba(255, 215, 0, 0.4)',
  // Status colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

// Semantic colors
export const colors = {
  success: brandColors.success,
  successSubtle: 'rgba(34, 197, 94, 0.08)',
  successLight: 'rgba(34, 197, 94, 0.12)',
  warning: brandColors.warning,
  warningSubtle: 'rgba(245, 158, 11, 0.08)',
  warningLight: 'rgba(245, 158, 11, 0.12)',
  error: brandColors.error,
  errorSubtle: 'rgba(239, 68, 68, 0.08)',
  errorLight: 'rgba(239, 68, 68, 0.12)',
  info: brandColors.info,
  infoLight: 'rgba(59, 130, 246, 0.12)',
  text: {
    primary: '#f7f8fb',
    secondary: 'rgba(255, 255, 255, 0.75)',
    muted: 'rgba(255, 255, 255, 0.55)',
    disabled: 'rgba(255, 255, 255, 0.35)',
  },
  border: {
    default: 'rgba(255, 255, 255, 0.10)',
    subtle: 'rgba(255, 255, 255, 0.06)',
    emphasis: 'rgba(255, 255, 255, 0.18)',
  },
  surface: {
    base: brandInk,
    elevated: brandPanel,
    overlay: 'rgba(11, 15, 28, 0.96)',
    card: 'rgba(11, 15, 28, 0.85)',
    input: '#0f1629',
  },
};

// Performance bands for charts and analytics visualizations
export const performanceBands = {
  high: {
    stroke: colors.success,
    fill: colors.successSubtle,
  },
  mid: {
    stroke: colors.warning,
    fill: colors.warningSubtle,
  },
  low: {
    stroke: colors.error,
    fill: colors.errorSubtle,
  },
};

export const moduleColors = {
  attention: '#3B82F6',
  focusedAttention: '#0EA5E9',
  frequency: '#8B5CF6',
  sequence: '#F59E0B',
  dichotic: '#10B981',
  speechInNoise: '#F97316',
};

export const moduleGradients = {
  suite: `linear-gradient(135deg, ${colors.success}, #16a34a)`,
  attention: `linear-gradient(135deg, ${moduleColors.attention}, #2563EB)`,
  focusedAttention: `linear-gradient(135deg, ${moduleColors.focusedAttention}, #0284C7)`,
  frequency: `linear-gradient(135deg, ${moduleColors.frequency}, #7C3AED)`,
  sequence: `linear-gradient(135deg, ${moduleColors.sequence}, #D97706)`,
  dichotic: `linear-gradient(135deg, ${moduleColors.dichotic}, #059669)`,
  speechInNoise: `linear-gradient(135deg, ${moduleColors.speechInNoise}, #EA580C)`,
  questionnaire: `linear-gradient(135deg, ${brandPink}, #9D174D)`,
};

export const devicePalette = {
  black: '#000000',
  cameraGradient: 'radial-gradient(circle at 30% 30%, #2a2a3a, #0a0a12)',
  cameraBorder: '#1a1a2a',
  frameBorder: '#2c2c2e',
  frameOutline: '#1a1a1a',
  frameGradient: 'linear-gradient(180deg, #1c1c1e 0%, #000000 100%)',
  screenGradientSubmitted: `linear-gradient(180deg, ${brandPurpleDark} 0%, #1a1a2e 50%, #0a0a14 100%)`,
  screenGradientDefault: 'linear-gradient(180deg, #2d2d35 0%, #1c1c1e 30%, #0a0a0e 100%)',
  screenTopFade: 'linear-gradient(180deg, rgba(28,28,30,1) 0%, transparent 100%)',
  screenBottomFade: 'linear-gradient(180deg, transparent 0%, rgba(10,10,14,0.95) 20%)',
  instagramGradient: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
};

export const videoPalette = {
  monitorFrameTop: '#2a2a3a',
  monitorFrameBottom: '#1a1a24',
  monitorStandTop: '#3a3a4a',
  monitorStandBottom: '#2a2a3a',
};

export const intakePalette = {
  ink: '#3a3020',
  inkMuted: '#5a4a3a',
  inkSoft: '#7a6a5a',
  inkFaint: '#8a7a6a',
  inkDisabled: '#a09080',
  border: '#c4b8a8',
  borderStrong: '#d4c8b8',
  borderMuted: '#9a8a7a',
  line: '#e8e0d8',
  paper: '#faf8f5',
  paperTop: '#fefcf9',
  paperBottom: '#f8f4ee',
  paperWarm: '#faf5f0',
  paperTan: '#f5f0ea',
  paperMint: '#f8faf9',
  paperRose: '#faf5f8',
  paperCool: '#f5fafa',
  paperLavender: '#faf5fa',
  clipboardStart: '#b89c72',
  clipboardMid: '#9a8060',
  clipboardEnd: '#8a7050',
  clipMetalStart: '#e0e0e0',
  clipMetalMid: '#a0a0a0',
  clipMetalEnd: '#c0c0c0',
  clipInnerStart: '#c8c8c8',
  clipInnerEnd: '#888888',
  clipArmStart: '#b0b0b0',
  clipArmEnd: '#909090',
  sectionFatherBorder: '#c4d8d4',
  sectionFatherInk: '#3a5a4a',
  sectionMotherBorder: '#d8c4c8',
  sectionMotherInk: '#5a3a4a',
  sectionHearingBorder: '#b8d4d4',
  sectionHearingInk: '#3a5a5a',
  sectionBehaviorBorder: '#d4b8d4',
  sectionBehaviorInk: '#5a3a5a',
  successDeep: '#16a34a',
  white: '#ffffff',
};

export const brainRegionColors = {
  auditory: '#FF6B35',
  language: '#00A8CC',
  music: '#C41E3A',
  attention: '#1E40AF',
  sensory: '#166534',
  balance: '#15803D',
  memory: '#EA580C',
  learning: '#1E3A5F',
  behavior: '#9333EA',
  wellbeing: '#2563EB',
};

export const brain3dPalette = {
  surface: '#e8b4bc',
  highlight: '#ffffff',
  labelText: '#1a1a2e',
};

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY SCALE
// Based on 1.25 ratio (Major Third) with 16px base
// ─────────────────────────────────────────────────────────────────────────────
export const typography = {
  // Font family
  fontFamily: 'Cairo, system-ui, -apple-system, Segoe UI, sans-serif',

  // Font sizes (using modular scale)
  size: {
    xxs: 9,      // 0.5625rem - dense labels
    xs: 11,      // 0.6875rem - labels, badges
    sm: 13,      // 0.8125rem - captions, small text
    base: 15,    // 0.9375rem - body text
    md: 16,      // 1rem - standard
    lg: 18,      // 1.125rem - h3, emphasized
    xl: 22,      // 1.375rem - h2
    '2xl': 26,   // 1.625rem - section titles
    '3xl': 32,   // 2rem - hero subtitle
    '4xl': 42,   // 2.625rem - hero title
    '5xl': 56,   // 3.5rem - display
  },

  // Font weights
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Line heights
  lineHeight: {
    tight: 1.15,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
    loose: 1.8,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SPACING SCALE
// Based on 4px unit system
// ─────────────────────────────────────────────────────────────────────────────
export const spacing = {
  px: 1,
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  4.5: 18,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  14.5: 58,
  16: 64,
  20: 80,
  24: 96,
};

// ─────────────────────────────────────────────────────────────────────────────
// BORDER RADIUS
// Consistent corner rounding scale
// ─────────────────────────────────────────────────────────────────────────────
export const radius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  full: 999,
};

// ─────────────────────────────────────────────────────────────────────────────
// SHADOWS / ELEVATION
// Layered shadow system for depth
// ─────────────────────────────────────────────────────────────────────────────
export const shadows = {
  none: 'none',
  sm: '0 2px 8px rgba(0, 0, 0, 0.15)',
  md: '0 8px 24px rgba(0, 0, 0, 0.20)',
  lg: '0 16px 48px rgba(0, 0, 0, 0.25)',
  xl: '0 24px 64px rgba(0, 0, 0, 0.30)',
  '2xl': '0 32px 80px rgba(0, 0, 0, 0.35)',
  // Colored glows
  glow: {
    cyan: '0 12px 36px rgba(143, 211, 204, 0.24)',
    purple: '0 12px 36px rgba(175, 132, 186, 0.24)',
    pink: '0 12px 36px rgba(176, 18, 112, 0.24)',
    success: '0 8px 24px rgba(34, 197, 94, 0.20)',
  },
  // Inner shadows
  inner: '0 1px 2px 0 rgba(0, 0, 0, 0.40) inset',
};

// ─────────────────────────────────────────────────────────────────────────────
// TRANSITIONS / ANIMATIONS
// Consistent timing and easing functions
// ─────────────────────────────────────────────────────────────────────────────
export const transitions = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '350ms ease',
  bounce: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  spring: '500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO COLORS
// Frequency-based color palette for audio visualization
// ─────────────────────────────────────────────────────────────────────────────
export const audioColors = {
  // Low frequencies (bass) - warm tones
  low: '#ef4444',
  lowMid: '#f97316',
  // Mid frequencies (speech) - neutral tones
  mid: '#eab308',
  midHigh: '#22c55e',
  // High frequencies (treble) - cool tones
  high: '#06b6d4',
  ultraHigh: '#8b5cf6',
  // Semantic audio colors
  active: brandCyan,
  inactive: 'rgba(143, 211, 204, 0.3)',
  peak: brandPink,
  warning: '#f59e0b',
};

// ─────────────────────────────────────────────────────────────────────────────
// SOUND LAB STYLES
// Styles for audio visualization and spectrum components
// ─────────────────────────────────────────────────────────────────────────────
export const soundLabStyles = {
  spectrumBar: {
    position: 'relative' as const,
    background: `linear-gradient(180deg, ${brandCyan}, ${brandPurple})`,
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.1s ease-out',
  },
  frequencyLabel: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    textAlign: 'center' as const,
    marginTop: spacing[1],
  },
  waveformContainer: {
    position: 'relative' as const,
    width: '100%',
    height: 120,
    background: colors.surface.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    border: `1px solid ${colors.border.default}`,
  },
  playButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: radius.full,
    background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    fontSize: typography.size.lg,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: shadows.glow.cyan,
  },
  volumeSlider: {
    width: 100,
    height: 4,
    background: colors.border.default,
    borderRadius: radius.full,
    appearance: 'none' as const,
    cursor: 'pointer',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// LAB-TECH DESIGN SYSTEM
// Futuristic lab-tech aesthetic with consistent dark theme
// ─────────────────────────────────────────────────────────────────────────────
export const labTech = {
  // Dark theme gradients
  backgrounds: {
    primary: 'linear-gradient(180deg, #1a1f2e 0%, #0d1117 100%)',
    hero: 'linear-gradient(180deg, #1a1f2e 0%, #0d1117 40%, rgba(8,10,18,1) 100%)',
    footer: 'linear-gradient(180deg, #1a1f2e 0%, #0d1117 50%, rgba(5,6,13,1) 100%)',
    card: 'linear-gradient(180deg, rgba(26,31,46,0.95) 0%, rgba(13,17,23,0.95) 100%)',
    glass: 'rgba(13,17,23,0.8)',
  },
  // Border colors
  borders: {
    subtle: 'rgba(143,211,204,0.1)',
    default: 'rgba(143,211,204,0.2)',
    emphasis: 'rgba(143,211,204,0.35)',
    glow: 'rgba(143,211,204,0.5)',
  },
  // Status colors
  status: {
    online: '#22c55e',
    active: brandCyan,
    warning: '#f59e0b',
    error: '#ef4444',
  },
};

// Consolidated animation keyframes for lab-tech aesthetic
export const labTechAnimations = `
  @keyframes statusPulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 6px #22c55e; }
    50% { opacity: 0.6; box-shadow: 0 0 10px #22c55e; }
  }
  @keyframes glowBar {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  @keyframes scanLine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS DASHBOARD STYLES
// Styles for charts, metrics, and data visualization
// ─────────────────────────────────────────────────────────────────────────────
export const analytics = {
  metricCard: {
    padding: spacing[4],
    borderRadius: radius.lg,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[1],
  },
  metricLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.muted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    lineHeight: typography.lineHeight.tight,
  },
  chartContainer: {
    position: 'relative' as const,
    width: '100%',
    height: 300,
    background: colors.surface.card,
    borderRadius: radius.lg,
    border: `1px solid ${colors.border.default}`,
    padding: spacing[4],
  },
  fatigueZone: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    background: 'rgba(245, 158, 11, 0.08)',
    borderTop: '1px dashed rgba(245, 158, 11, 0.3)',
    borderBottom: '1px dashed rgba(245, 158, 11, 0.3)',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    fontSize: typography.size.sm,
    color: colors.text.secondary,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },
};

// Lab-tech component styles
export const labTechStyles = {
  glowBar: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    background: `linear-gradient(90deg, transparent, ${brandCyan}66, ${brandPurple}66, transparent)`,
    animation: 'glowBar 3s ease-in-out infinite',
  },
  gridPattern: {
    position: 'absolute' as const,
    inset: 0,
    opacity: 0.03,
    backgroundImage: `linear-gradient(${brandCyan}20 1px, transparent 1px), linear-gradient(90deg, ${brandCyan}20 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
    pointerEvents: 'none' as const,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 8px #22c55e',
    animation: 'statusPulse 2s ease-in-out infinite',
  },
  labBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    background: 'rgba(13,17,23,0.8)',
    border: `1px solid ${brandCyan}30`,
    borderRadius: 8,
    backdropFilter: 'blur(10px)',
  },
  monoText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIVE BREAKPOINTS
// Mobile-first breakpoint system
// ─────────────────────────────────────────────────────────────────────────────
export const breakpoints = {
  xs: 320,    // Small phones
  sm: 480,    // Large phones
  md: 768,    // Tablets (iPad mini, portrait)
  lg: 1024,   // Tablets landscape, small laptops
  xl: 1280,   // Laptops, desktops
  '2xl': 1536, // Large desktops
};

// Media query helpers (for use in CSS-in-JS)
export const mediaQueries = {
  phone: `@media (max-width: ${breakpoints.sm - 1}px)`,
  tablet: `@media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.lg - 1}px)`,
  desktop: `@media (min-width: ${breakpoints.lg}px)`,
  // Specific device queries
  phoneOnly: `@media (max-width: ${breakpoints.md - 1}px)`,
  tabletUp: `@media (min-width: ${breakpoints.md}px)`,
  tabletOnly: `@media (min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  desktopUp: `@media (min-width: ${breakpoints.lg}px)`,
};

// ─────────────────────────────────────────────────────────────────────────────
// GRADIENTS
// Reusable gradient definitions
// ─────────────────────────────────────────────────────────────────────────────
export const gradients = {
  primary: `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})`,
  secondary: `linear-gradient(135deg, ${brandPink}, ${brandCyan})`,
  surface: `linear-gradient(135deg, rgba(175, 132, 186, 0.12), rgba(143, 211, 204, 0.07))`,
  glass: `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))`,
  cyanPurple: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
  purplePink: `linear-gradient(135deg, ${brandPurple}, ${brandPink})`,
  grid:
    'repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 28px)',
};

// Global popup scale for centered modals
export const modalScale = 0.75;

export const styles: Record<string, CSSProperties> = {
  // ─────────────────────────────────────────────────────────────────────────
  // LAYOUT
  // ─────────────────────────────────────────────────────────────────────────
  page: {
    background: `radial-gradient(1200px 600px at 20% 10%, rgba(175,132,186,0.18), transparent 55%),
                 radial-gradient(900px 450px at 80% 0%, rgba(143,211,204,0.14), transparent 55%),
                 radial-gradient(900px 600px at 60% 90%, rgba(176,18,112,0.10), transparent 55%),
                 ${brandInk}`,
    color: colors.text.primary,
    minHeight: '100vh',
    fontFamily: typography.fontFamily,
    fontSize: typography.size.base,
    lineHeight: typography.lineHeight.normal,
    position: 'relative',
    overflowX: 'hidden',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing[3.5]}px ${spacing[5]}px`,
    background: 'rgba(5,6,13,0.72)',
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${colors.border.default}`,
  },
  container: {
    maxWidth: 1180,
    margin: '0 auto',
    padding: `${spacing[6]}px ${spacing[4]}px ${spacing[20]}px`,
    position: 'relative',
    zIndex: 1,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SECTIONS
  // ─────────────────────────────────────────────────────────────────────────
  section: {
    padding: `${spacing[8]}px ${spacing[6]}px`,
    borderRadius: radius.xl,
    border: `1px solid ${colors.border.default}`,
    background: gradients.surface,
    marginBottom: spacing[5],
    boxShadow: shadows['2xl'],
  },
  sectionCard: {
    scrollMarginTop: 92,
    padding: `${spacing[6]}px ${spacing[5]}px`,
    borderRadius: radius.xl,
    border: `1px solid ${colors.border.default}`,
    background: colors.surface.card,
    backdropFilter: 'blur(6px)',
    marginBottom: spacing[5],
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
  sectionHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: spacing[3],
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TYPOGRAPHY
  // ─────────────────────────────────────────────────────────────────────────
  title: {
    margin: 0,
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.black,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.wide,
  },
  lead: {
    margin: 0,
    fontSize: typography.size.base,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
  },
  h2: {
    margin: `0 0 ${spacing[1.5]}px`,
    fontSize: typography.size.xl,
    fontWeight: typography.weight.extrabold,
    lineHeight: typography.lineHeight.snug,
  },
  h3: {
    margin: `0 0 ${spacing[1.5]}px`,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.extrabold,
    lineHeight: typography.lineHeight.snug,
  },
  muted: {
    margin: 0,
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.relaxed,
  },
  bodyText: {
    margin: 0,
    color: 'rgba(255, 255, 255, 0.88)',
    fontSize: typography.size.base,
    lineHeight: typography.lineHeight.loose,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────────────────────────────────
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navLink: {
    color: colors.text.primary,
    textDecoration: 'none',
    fontWeight: typography.weight.extrabold,
    fontSize: typography.size.sm,
    padding: `${spacing[2]}px ${spacing[2.5]}px`,
    borderRadius: radius.md,
    display: 'inline-block',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${colors.border.subtle}`,
    transition: transitions.normal,
  },
  burger: {
    border: `1px solid ${colors.border.emphasis}`,
    background: 'rgba(255,255,255,0.06)',
    color: colors.text.primary,
    padding: `${spacing[2]}px ${spacing[2.5]}px`,
    borderRadius: radius.md,
    cursor: 'pointer',
    transition: transitions.fast,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BUTTONS
  // ─────────────────────────────────────────────────────────────────────────
  primaryBtn: {
    border: 'none',
    background: gradients.primary,
    color: brandInk,
    padding: `${spacing[3]}px ${spacing[4]}px`,
    borderRadius: radius.lg,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.black,
    cursor: 'pointer',
    boxShadow: shadows.glow.cyan,
    transition: transitions.bounce,
  },
  ghostBtn: {
    border: `1px solid ${colors.border.emphasis}`,
    background: 'rgba(255,255,255,0.02)',
    color: colors.text.primary,
    padding: `${spacing[2.5]}px ${spacing[3]}px`,
    borderRadius: radius.lg,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.extrabold,
    cursor: 'pointer',
    transition: transitions.normal,
  },
  disabledBtn: {
    border: 'none',
    background: colors.border.default,
    color: colors.text.muted,
    padding: `${spacing[3]}px ${spacing[4]}px`,
    borderRadius: radius.lg,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.black,
    cursor: 'not-allowed',
  },
  dangerBtn: {
    border: '1px solid rgba(239,68,68,0.25)',
    background: colors.errorLight,
    color: '#fecaca',
    padding: `${spacing[2.5]}px ${spacing[3]}px`,
    borderRadius: radius.lg,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.black,
    cursor: 'pointer',
    transition: transitions.normal,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BADGES & CHIPS
  // ─────────────────────────────────────────────────────────────────────────
  comingSoonBadge: {
    background: colors.warningLight,
    color: colors.warning,
    padding: `${spacing[1]}px ${spacing[2.5]}px`,
    borderRadius: radius.md,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.extrabold,
    letterSpacing: typography.letterSpacing.wide,
  },
  chip: {
    background: 'rgba(175,132,186,0.14)',
    border: '1px solid rgba(175,132,186,0.25)',
    color: colors.text.primary,
    padding: `${spacing[1.5]}px ${spacing[2.5]}px`,
    borderRadius: radius.full,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.extrabold,
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[2],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // FORM CONTROLS
  // ─────────────────────────────────────────────────────────────────────────
  input: {
    background: colors.surface.input,
    color: colors.text.primary,
    border: `1px solid rgba(255,255,255,0.12)`,
    borderRadius: radius.md,
    padding: `${spacing[2.5]}px ${spacing[3]}px`,
    fontSize: typography.size.base,
    width: '100%',
    minWidth: 0, // Allow shrinking on mobile
    transition: transitions.fast,
  },
  textarea: {
    background: colors.surface.input,
    color: colors.text.primary,
    border: `1px solid rgba(255,255,255,0.12)`,
    borderRadius: radius.md,
    padding: `${spacing[2.5]}px ${spacing[3]}px`,
    fontSize: typography.size.base,
    resize: 'vertical',
    transition: transitions.fast,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SLIDES
  // ─────────────────────────────────────────────────────────────────────────
  slideGrid: {
    display: 'grid',
    gap: spacing[3],
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
  },
  slideItem: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    border: `1px solid ${colors.border.default}`,
    background: `linear-gradient(135deg, rgba(175,132,186,0.08), rgba(176,18,112,0.06))`,
    cursor: 'pointer',
    boxShadow: shadows.lg,
    transition: transitions.bounce,
  },
  slideThumbImg: {
    width: '100%',
    display: 'block',
    aspectRatio: '16/9',
    objectFit: 'cover',
    background: colors.surface.input,
  },
  slideItemMeta: {
    padding: spacing[2.5],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1.5],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CHECKLIST
  // ─────────────────────────────────────────────────────────────────────────
  checklistGrid: {
    display: 'grid',
    gap: spacing[2.5],
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    marginTop: spacing[3],
  },
  checkItem: {
    display: 'flex',
    gap: spacing[2],
    alignItems: 'center',
    background: colors.surface.input,
    borderRadius: radius.lg,
    padding: spacing[2.5],
    border: `1px solid ${colors.border.subtle}`,
    transition: transitions.fast,
  },
  checkbox: { width: 18, height: 18 },

  // ─────────────────────────────────────────────────────────────────────────
  // GAMES
  // ─────────────────────────────────────────────────────────────────────────
  gameGrid: {
    display: 'grid',
    gap: spacing[3],
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  },
  gameCard: {
    borderRadius: radius.xl,
    padding: spacing[3.5],
    border: `1px solid ${colors.border.default}`,
    background: 'rgba(15,22,41,0.9)',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
    transition: transitions.bounce,
  },
  gameCardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2.5],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // FORMS
  // ─────────────────────────────────────────────────────────────────────────
  form: {
    display: 'grid',
    gap: spacing[3],
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1.5],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // FLOATING ACTION BUTTON
  // ─────────────────────────────────────────────────────────────────────────
  fab: {
    position: 'fixed',
    right: spacing[4],
    bottom: spacing[4],
    width: 56,
    height: 56,
    borderRadius: radius.full,
    display: 'grid',
    placeItems: 'center',
    background: gradients.secondary,
    color: brandInk,
    fontSize: typography.size.xl,
    textDecoration: 'none',
    boxShadow: shadows.glow.pink,
    border: `1px solid ${colors.border.default}`,
    transition: transitions.spring,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MODAL
  // ─────────────────────────────────────────────────────────────────────────
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 20,
    padding: spacing[3],
  },
  modal: {
    background: colors.surface.overlay,
    borderRadius: radius.xl,
    padding: spacing[4],
    border: `1px solid ${colors.border.emphasis}`,
    maxWidth: 980,
    width: '100%',
    maxHeight: '86vh',
    overflow: 'auto',
    boxShadow: shadows['2xl'],
    transform: `scale(${modalScale})`,
    transformOrigin: 'center',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TABLES
  // ─────────────────────────────────────────────────────────────────────────
  tableWrap: {
    overflowX: 'auto',
    borderRadius: radius.lg,
    border: `1px solid ${colors.border.default}`,
    background: 'rgba(15,22,41,0.55)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 720,
    fontSize: typography.size.sm,
  },
  th: {
    textAlign: 'right',
    fontWeight: typography.weight.black,
    fontSize: typography.size.sm,
    padding: `${spacing[3]}px`,
    borderBottom: `1px solid ${colors.border.default}`,
    background: 'rgba(175,132,186,0.10)',
  },
  td: {
    padding: `${spacing[3]}px`,
    borderBottom: `1px solid ${colors.border.subtle}`,
    verticalAlign: 'top',
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
  },
};
