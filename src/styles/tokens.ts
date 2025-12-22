/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - UNIFIED DESIGN TOKENS
 * Comprehensive design token system for consistent, futuristic UI
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// BRAND COLORS
// Core brand palette extracted from AIT_LOGO + clinical aesthetic
// ─────────────────────────────────────────────────────────────────────────────
export const brand = {
  // Primary palette
  cyan: '#8FD3CC',
  cyanLight: '#B0E4DF',
  cyanDark: '#6BB8B0',

  purple: '#AF84BA',
  purpleLight: '#C9A8D2',
  purpleDark: '#774E87',

  pink: '#B01270',
  pinkLight: '#D42A90',
  pinkDark: '#8A0D58',

  // Base surfaces
  ink: '#05060d',
  panel: '#0b0f1c',
  surface: '#1a1f2e',

  // Status & functional
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Social
  whatsapp: '#25D366',
  linkedin: '#0077B5',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO FREQUENCY COLORS
// Frequency spectrum visualization palette
// ─────────────────────────────────────────────────────────────────────────────
export const audio = {
  // Frequency bands (low → high)
  bass: '#FF6B6B',       // 20-250 Hz
  midLow: '#F59E0B',     // 250-1000 Hz
  mid: '#4ECDC4',        // 1000-3000 Hz (speech range)
  midHigh: '#A855F7',    // 3000-8000 Hz
  treble: '#F472B6',     // 8000-20000 Hz

  // Neural wave patterns
  alpha: '#22D3EE',      // Alpha waves - relaxation
  beta: '#A78BFA',       // Beta waves - active thinking
  theta: '#34D399',      // Theta waves - creativity
  delta: '#FB923C',      // Delta waves - deep sleep

  // Signal states
  active: brand.cyan,
  processing: brand.purple,
  standby: 'rgba(255,255,255,0.3)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SEMANTIC COLORS
// Contextual color usage
// ─────────────────────────────────────────────────────────────────────────────
export const semantic = {
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
    glow: `rgba(143, 211, 204, 0.40)`,
  },
  surface: {
    base: brand.ink,
    elevated: brand.panel,
    overlay: 'rgba(11, 15, 28, 0.96)',
    card: 'rgba(11, 15, 28, 0.85)',
    glass: 'rgba(13, 17, 23, 0.75)',
    input: '#0f1629',
  },
  status: {
    online: { bg: 'rgba(34,197,94,0.15)', color: brand.success },
    warning: { bg: 'rgba(245,158,11,0.15)', color: brand.warning },
    error: { bg: 'rgba(239,68,68,0.15)', color: brand.error },
    info: { bg: 'rgba(59,130,246,0.15)', color: brand.info },
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY SCALE
// Based on 1.25 ratio (Major Third) with 16px base
// ─────────────────────────────────────────────────────────────────────────────
export const typography = {
  fontFamily: {
    primary: 'Cairo, system-ui, -apple-system, Segoe UI, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
  size: {
    xs: 11,      // Labels, badges
    sm: 13,      // Captions
    base: 15,    // Body text
    md: 16,      // Standard
    lg: 18,      // Emphasized
    xl: 22,      // h2
    '2xl': 26,   // Section titles
    '3xl': 32,   // Hero subtitle
    '4xl': 42,   // Hero title
    '5xl': 56,   // Display
  },
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeight: {
    tight: 1.15,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
    loose: 1.8,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 1.5,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SPACING SCALE
// 4px unit system for consistent rhythm
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
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────────────────────────────────────
export const radius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  full: 999,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SHADOWS & GLOWS
// Layered shadow system for depth and sci-fi aesthetic
// ─────────────────────────────────────────────────────────────────────────────
export const shadows = {
  none: 'none',
  sm: '0 2px 8px rgba(0, 0, 0, 0.15)',
  md: '0 8px 24px rgba(0, 0, 0, 0.20)',
  lg: '0 16px 48px rgba(0, 0, 0, 0.25)',
  xl: '0 24px 64px rgba(0, 0, 0, 0.30)',
  '2xl': '0 32px 80px rgba(0, 0, 0, 0.35)',
  inner: '0 1px 2px 0 rgba(0, 0, 0, 0.40) inset',

  // Colored glows for sci-fi effect
  glow: {
    cyan: `0 12px 36px rgba(143, 211, 204, 0.24)`,
    cyanIntense: `0 0 30px rgba(143, 211, 204, 0.50)`,
    purple: `0 12px 36px rgba(175, 132, 186, 0.24)`,
    pink: `0 12px 36px rgba(176, 18, 112, 0.24)`,
    success: `0 8px 24px rgba(34, 197, 94, 0.20)`,
    neural: `0 0 25px ${brand.cyan}33, 0 0 50px ${brand.purple}22`,
  },

  // Lab-tech panel shadows
  panel: `0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
  panelHover: `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 60px ${brand.cyan}15`,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// GRADIENTS
// Reusable gradient definitions
// ─────────────────────────────────────────────────────────────────────────────
export const gradients = {
  // Primary brand gradients
  primary: `linear-gradient(135deg, ${brand.purpleDark}, ${brand.cyan})`,
  secondary: `linear-gradient(135deg, ${brand.pink}, ${brand.cyan})`,
  cyanPurple: `linear-gradient(135deg, ${brand.cyan}, ${brand.purple})`,
  purplePink: `linear-gradient(135deg, ${brand.purple}, ${brand.pink})`,

  // Surface gradients
  surface: `linear-gradient(135deg, rgba(175, 132, 186, 0.12), rgba(143, 211, 204, 0.07))`,
  glass: `linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))`,
  card: `linear-gradient(180deg, rgba(26,31,46,0.95) 0%, rgba(13,17,23,0.95) 100%)`,

  // Lab-tech backgrounds
  hero: 'linear-gradient(180deg, #1a1f2e 0%, #0d1117 40%, rgba(8,10,18,1) 100%)',
  panel: 'linear-gradient(135deg, rgba(13,17,23,0.9), rgba(20,25,35,0.85))',

  // Holographic effect
  holographic: `
    linear-gradient(135deg, ${brand.cyan}15 0%, transparent 25%),
    linear-gradient(225deg, ${brand.purple}15 0%, transparent 25%),
    linear-gradient(315deg, ${brand.pink}10 0%, transparent 25%),
    rgba(13, 17, 23, 0.85)
  `,

  // Glow bar (animated)
  glowBar: `linear-gradient(90deg, transparent, ${brand.cyan}66, ${brand.purple}66, transparent)`,

  // Grid pattern
  grid: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 28px)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TRANSITIONS & TIMING
// ─────────────────────────────────────────────────────────────────────────────
export const transitions = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '350ms ease',
  bounce: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  spring: '500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  smooth: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// BREAKPOINTS
// Mobile-first responsive system
// ─────────────────────────────────────────────────────────────────────────────
export const breakpoints = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const media = {
  phone: `@media (max-width: ${breakpoints.sm - 1}px)`,
  tablet: `@media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.lg - 1}px)`,
  desktop: `@media (min-width: ${breakpoints.lg}px)`,
  phoneOnly: `@media (max-width: ${breakpoints.md - 1}px)`,
  tabletUp: `@media (min-width: ${breakpoints.md}px)`,
  desktopUp: `@media (min-width: ${breakpoints.lg}px)`,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Z-INDEX SCALE
// Consistent layering system
// ─────────────────────────────────────────────────────────────────────────────
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
  header: 100,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION DURATIONS
// ─────────────────────────────────────────────────────────────────────────────
export const durations = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
  slowest: 1000,
} as const;
