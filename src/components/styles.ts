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
  whatsappLight: 'rgba(37, 211, 102, 0.12)',
  linkedin: '#0077B5',
  linkedinLight: 'rgba(0, 119, 181, 0.12)',
  // Status colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

// Semantic colors
export const colors = {
  success: brandColors.success,
  successLight: 'rgba(34, 197, 94, 0.12)',
  warning: brandColors.warning,
  warningLight: 'rgba(245, 158, 11, 0.12)',
  error: brandColors.error,
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

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY SCALE
// Based on 1.25 ratio (Major Third) with 16px base
// ─────────────────────────────────────────────────────────────────────────────
export const typography = {
  // Font family
  fontFamily: 'Cairo, system-ui, -apple-system, Segoe UI, sans-serif',

  // Font sizes (using modular scale)
  size: {
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
    subtle: `rgba(143,211,204,0.1)`,
    default: `rgba(143,211,204,0.2)`,
    emphasis: `rgba(143,211,204,0.35)`,
    glow: `rgba(143,211,204,0.5)`,
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
  /* Status pulse animation for online indicators */
  @keyframes statusPulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 6px #22c55e; }
    50% { opacity: 0.6; box-shadow: 0 0 10px #22c55e; }
  }

  /* Glow bar animation for top accent bars */
  @keyframes glowBar {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  /* Horizontal scan line effect */
  @keyframes scanLine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  /* Vertical scan line effect */
  @keyframes scanLineVertical {
    0% { top: -100%; }
    100% { top: 200%; }
  }

  /* Status blink for labels */
  @keyframes statusBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* Data stream animation */
  @keyframes dataStream {
    0% { transform: translateY(0); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100px); opacity: 0; }
  }

  /* Fade in with scale */
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  /* Slide down animation */
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Reduced motion support - disable animations for users who prefer it */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// Lab-tech component styles
export const labTechStyles = {
  // Top glow bar
  glowBar: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    background: `linear-gradient(90deg, transparent, ${brandCyan}66, ${brandPurple}66, transparent)`,
    animation: 'glowBar 3s ease-in-out infinite',
  },
  // Grid pattern overlay
  gridPattern: {
    position: 'absolute' as const,
    inset: 0,
    opacity: 0.03,
    backgroundImage: `
      linear-gradient(${brandCyan}20 1px, transparent 1px),
      linear-gradient(90deg, ${brandCyan}20 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    pointerEvents: 'none' as const,
  },
  // Status indicator dot
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 8px #22c55e',
    animation: 'statusPulse 2s ease-in-out infinite',
  },
  // Lab badge container
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
  // Monospace text for tech readouts
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

// ─────────────────────────────────────────────────────────────────────────────
// ADVANCED LAB-TECH DESIGN SYSTEM
// Enhanced visual elements for futuristic auditory science lab aesthetic
// ─────────────────────────────────────────────────────────────────────────────

export const labTechAdvanced = {
  // Neural network patterns
  patterns: {
    neuralGrid: `
      linear-gradient(90deg, ${brandCyan}08 1px, transparent 1px),
      linear-gradient(${brandCyan}08 1px, transparent 1px)
    `,
    neuralGridSize: '60px 60px',
    circuitBoard: `
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        ${brandCyan}05 10px,
        ${brandCyan}05 11px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 10px,
        ${brandPurple}05 10px,
        ${brandPurple}05 11px
      )
    `,
    dataMesh: `
      radial-gradient(circle at 25% 25%, ${brandCyan}10 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, ${brandPurple}10 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, ${brandPink}05 0%, transparent 30%)
    `,
  },

  // Glow effects
  glows: {
    subtle: `0 0 20px ${brandCyan}15`,
    medium: `0 0 40px ${brandCyan}25, 0 0 80px ${brandPurple}15`,
    intense: `0 0 60px ${brandCyan}35, 0 0 120px ${brandPurple}25, 0 0 180px ${brandPink}15`,
    pulse: `0 0 30px ${brandCyan}30`,
    neural: `0 0 25px ${brandCyan}20, 0 0 50px ${brandPurple}15`,
  },

  // Gradient overlays
  overlays: {
    scanLine: `linear-gradient(
      180deg,
      transparent 0%,
      ${brandCyan}05 45%,
      ${brandCyan}10 50%,
      ${brandCyan}05 55%,
      transparent 100%
    )`,
    verticalScan: `linear-gradient(
      90deg,
      transparent 0%,
      ${brandCyan}08 48%,
      ${brandCyan}15 50%,
      ${brandCyan}08 52%,
      transparent 100%
    )`,
    holographic: `linear-gradient(
      135deg,
      ${brandCyan}15 0%,
      transparent 25%,
      ${brandPurple}15 50%,
      transparent 75%,
      ${brandPink}15 100%
    )`,
  },

  // Border styles
  borders: {
    glowCyan: `1px solid ${brandCyan}40`,
    glowPurple: `1px solid ${brandPurple}40`,
    glowPink: `1px solid ${brandPink}40`,
    neural: `1px solid linear-gradient(90deg, ${brandCyan}30, ${brandPurple}30)`,
    dataLine: `2px solid ${brandCyan}50`,
  },

  // Status indicators
  status: {
    online: { color: '#22c55e', glow: '0 0 10px #22c55e' },
    processing: { color: brandCyan, glow: `0 0 10px ${brandCyan}` },
    warning: { color: '#f59e0b', glow: '0 0 10px #f59e0b' },
    error: { color: '#ef4444', glow: '0 0 10px #ef4444' },
    standby: { color: brandPurple, glow: `0 0 10px ${brandPurple}` },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ENHANCED ANIMATION KEYFRAMES
// ─────────────────────────────────────────────────────────────────────────────

export const advancedAnimations = `
  /* Neural pulse animation */
  @keyframes neuralPulse {
    0%, 100% {
      opacity: 0.6;
      transform: scale(1);
      filter: blur(0px);
    }
    50% {
      opacity: 1;
      transform: scale(1.02);
      filter: blur(1px);
    }
  }

  /* Data flow animation */
  @keyframes dataFlow {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: 100% 100%;
    }
  }

  /* Scanning line horizontal */
  @keyframes horizontalScan {
    0% { transform: translateX(-100%); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
  }

  /* Scanning line vertical */
  @keyframes verticalScan {
    0% { transform: translateY(-100%); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }

  /* Holographic shimmer */
  @keyframes holographicShimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  /* Circuit glow */
  @keyframes circuitGlow {
    0%, 100% {
      box-shadow: 0 0 5px ${brandCyan}30, inset 0 0 5px ${brandCyan}10;
    }
    50% {
      box-shadow: 0 0 20px ${brandCyan}50, inset 0 0 10px ${brandCyan}20;
    }
  }

  /* Text reveal for lab tech labels */
  @keyframes textReveal {
    0% {
      opacity: 0;
      letter-spacing: 8px;
      filter: blur(4px);
    }
    100% {
      opacity: 1;
      letter-spacing: inherit;
      filter: blur(0);
    }
  }

  /* Floating element */
  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    25% {
      transform: translateY(-5px) rotate(1deg);
    }
    75% {
      transform: translateY(5px) rotate(-1deg);
    }
  }

  /* Brain wave oscillation */
  @keyframes brainWave {
    0%, 100% {
      transform: scaleY(1);
    }
    25% {
      transform: scaleY(1.3);
    }
    50% {
      transform: scaleY(0.8);
    }
    75% {
      transform: scaleY(1.2);
    }
  }

  /* Ripple effect */
  @keyframes ripple {
    0% {
      transform: scale(0.8);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  /* Fade slide in from direction */
  @keyframes fadeSlideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeSlideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeSlideLeft {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeSlideRight {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Stagger animation helper */
  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }
  .stagger-5 { animation-delay: 0.5s; }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// WORKFLOW UX COMPONENTS
// Pre-styled components for consistent user experience
// ─────────────────────────────────────────────────────────────────────────────

export const workflowStyles: Record<string, CSSProperties> = {
  // Step indicator for multi-step processes
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 16px',
    background: 'rgba(143,211,204,0.08)',
    borderRadius: 12,
    border: `1px solid ${brandCyan}25`,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
    color: brandInk,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 800,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.text.primary,
  },

  // Progress bar
  progressTrack: {
    height: 6,
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
    borderRadius: 3,
    transition: 'width 0.4s ease',
  },

  // Action card
  actionCard: {
    padding: 20,
    background: labTech.backgrounds.card,
    borderRadius: 16,
    border: `1px solid ${brandCyan}20`,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  actionCardHover: {
    borderColor: `${brandCyan}40`,
    boxShadow: `0 8px 30px ${brandCyan}15`,
    transform: 'translateY(-2px)',
  },

  // Lab badge
  labBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    background: 'rgba(13,17,23,0.9)',
    borderRadius: 8,
    border: `1px solid ${brandCyan}30`,
    fontSize: 11,
    fontWeight: 800,
    color: brandCyan,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },

  // Data readout
  dataReadout: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: brandCyan,
    padding: '8px 12px',
    background: 'rgba(143,211,204,0.08)',
    borderRadius: 6,
    border: `1px solid ${brandCyan}20`,
  },

  // Neural section divider
  neuralDivider: {
    height: 2,
    background: `linear-gradient(90deg, transparent, ${brandCyan}50, ${brandPurple}50, transparent)`,
    margin: '32px 0',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SOUND LAB / AUDITORY THERAPY DESIGN SYSTEM
// Futuristic audio therapy lab aesthetic for Bérard AIT treatment center
// ═══════════════════════════════════════════════════════════════════════════════

// Audio Waveform Colors
export const audioColors = {
  // Frequency spectrum colors (low to high)
  bass: '#774E87',        // Deep bass - purple
  lowMid: '#AF84BA',      // Low-mid frequencies - lavender
  mid: '#8FD3CC',         // Mid frequencies (speech range) - cyan
  highMid: '#22c55e',     // High-mid frequencies - green
  high: '#B01270',        // High frequencies - pink

  // Signal colors
  signalActive: '#00ff88',
  signalIdle: '#3b4a6b',
  signalWarning: '#f59e0b',
  signalPeak: '#ff0080',

  // Neural pathway colors
  neuralCore: brandCyan,
  neuralGlow: `${brandCyan}40`,
  synapseActive: '#00f5ff',
  synapseIdle: '#1a3a4a',
};

// Sound Lab HUD Styles
export const soundLabStyles: Record<string, CSSProperties> = {
  // Main lab container
  labContainer: {
    position: 'relative',
    background: 'linear-gradient(180deg, #0a0e1a 0%, #050810 100%)',
    borderRadius: 6,
    border: `1px solid ${brandCyan}30`,
    overflow: 'hidden',
    boxShadow: `
      0 0 40px ${brandCyan}10,
      inset 0 1px 0 ${brandCyan}15,
      inset 0 -1px 0 ${brandPurple}10
    `,
  },

  // Frequency analyzer display
  frequencyDisplay: {
    background: 'rgba(0,5,15,0.95)',
    padding: 20,
    borderRadius: 4,
    border: `1px solid ${brandCyan}20`,
    position: 'relative',
    overflow: 'hidden',
  },

  // Audio waveform container
  waveformContainer: {
    height: 80,
    background: 'linear-gradient(180deg, rgba(0,5,15,0.9), rgba(10,20,40,0.8))',
    borderRadius: 4,
    border: `1px solid ${brandCyan}15`,
    position: 'relative',
    overflow: 'hidden',
  },

  // Signal meter
  signalMeter: {
    display: 'flex',
    gap: 2,
    alignItems: 'flex-end',
    height: 40,
    padding: '0 8px',
  },

  // Signal bar
  signalBar: {
    flex: 1,
    background: `linear-gradient(180deg, ${brandCyan}, ${brandPurple})`,
    borderRadius: '2px 2px 0 0',
    transition: 'height 0.1s ease',
    boxShadow: `0 0 8px ${brandCyan}40`,
  },

  // Lab readout display (monospace)
  labReadout: {
    fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", monospace',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: brandCyan,
    textTransform: 'uppercase' as const,
    textShadow: `0 0 10px ${brandCyan}60`,
  },

  // Treatment status panel
  treatmentStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    background: 'rgba(34,197,94,0.08)',
    border: '1px solid rgba(34,197,94,0.25)',
    borderRadius: 6,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 700,
    color: '#22c55e',
    letterSpacing: 1,
  },

  // Frequency band indicator
  frequencyBand: {
    padding: '8px 14px',
    background: 'rgba(0,0,0,0.4)',
    borderRadius: 6,
    border: `1px solid ${brandCyan}20`,
    textAlign: 'center' as const,
  },

  // Neural pathway line
  neuralPath: {
    height: 2,
    background: `linear-gradient(90deg, transparent, ${brandCyan}60, ${brandPurple}60, transparent)`,
    boxShadow: `0 0 8px ${brandCyan}40`,
  },

  // Brain wave indicator
  brainWaveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    background: 'rgba(143,211,204,0.1)',
    border: `1px solid ${brandCyan}30`,
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 700,
    color: brandCyan,
  },

  // Audio spectrum bar
  spectrumBar: {
    background: `linear-gradient(180deg,
      ${brandCyan} 0%,
      ${brandPurple} 40%,
      ${brandPink} 100%
    )`,
    borderRadius: '2px 2px 0 0',
    boxShadow: `0 0 6px ${brandCyan}50`,
    transition: 'height 0.05s linear',
  },

  // Lab module header
  labModuleHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'rgba(0,0,0,0.4)',
    borderBottom: `1px solid ${brandCyan}20`,
  },

  // Lab badge
  labBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 12px',
    background: 'rgba(0,5,15,0.9)',
    border: `1px solid ${brandCyan}40`,
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 800,
    color: brandCyan,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    boxShadow: `0 0 10px ${brandCyan}15`,
  },

  // Treatment progress ring
  treatmentRing: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sound wave pulse effect
  soundPulse: {
    position: 'absolute',
    borderRadius: '50%',
    border: `2px solid ${brandCyan}40`,
    animation: 'soundPulseExpand 2s ease-out infinite',
    pointerEvents: 'none',
  },

  // Clinic status bar
  clinicStatusBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    background: 'rgba(0,0,0,0.5)',
    borderTop: `1px solid ${brandCyan}15`,
    fontFamily: 'monospace',
    fontSize: 9,
    letterSpacing: 1,
  },
};

// Sound Lab Animation Keyframes
export const soundLabAnimations = `
  /* Sound pulse expand effect */
  @keyframes soundPulseExpand {
    0% {
      transform: scale(0.8);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  /* Audio signal flow */
  @keyframes audioSignalFlow {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 200% 50%;
    }
  }

  /* Frequency bar bounce */
  @keyframes freqBarBounce {
    0%, 100% { transform: scaleY(0.3); }
    50% { transform: scaleY(1); }
  }

  /* Neural pulse */
  @keyframes neuralPulseFlow {
    0% {
      opacity: 0.3;
      box-shadow: 0 0 5px ${brandCyan}20;
    }
    50% {
      opacity: 1;
      box-shadow: 0 0 20px ${brandCyan}60;
    }
    100% {
      opacity: 0.3;
      box-shadow: 0 0 5px ${brandCyan}20;
    }
  }

  /* Brain wave oscillation */
  @keyframes brainWaveOscillate {
    0%, 100% { transform: translateY(0); }
    25% { transform: translateY(-3px); }
    75% { transform: translateY(3px); }
  }

  /* Treatment progress glow */
  @keyframes treatmentGlow {
    0%, 100% {
      filter: drop-shadow(0 0 5px ${brandCyan}40);
    }
    50% {
      filter: drop-shadow(0 0 15px ${brandCyan}80);
    }
  }

  /* Sound lab scan line */
  @keyframes labScanLine {
    0% {
      top: -5%;
      opacity: 0;
    }
    10% {
      opacity: 0.8;
    }
    90% {
      opacity: 0.8;
    }
    100% {
      top: 105%;
      opacity: 0;
    }
  }

  /* Audio meter blink */
  @keyframes audioMeterBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* Waveform draw */
  @keyframes waveformDraw {
    0% {
      stroke-dashoffset: 1000;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  /* Status indicator pulse */
  @keyframes statusPulseGlow {
    0%, 100% {
      box-shadow: 0 0 4px currentColor;
    }
    50% {
      box-shadow: 0 0 12px currentColor, 0 0 20px currentColor;
    }
  }

  .sound-pulse {
    animation: soundPulseExpand 2s ease-out infinite;
  }

  .audio-signal-flow {
    animation: audioSignalFlow 3s linear infinite;
  }

  .freq-bar-animate {
    animation: freqBarBounce 0.4s ease-in-out infinite;
  }

  .neural-pulse {
    animation: neuralPulseFlow 2s ease-in-out infinite;
  }

  .brain-wave {
    animation: brainWaveOscillate 3s ease-in-out infinite;
  }

  .treatment-glow {
    animation: treatmentGlow 2s ease-in-out infinite;
  }

  .lab-scan-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${brandCyan}80, transparent);
    animation: labScanLine 4s linear infinite;
    pointer-events: none;
  }

  .audio-meter-blink {
    animation: audioMeterBlink 1s ease-in-out infinite;
  }

  .status-pulse {
    animation: statusPulseGlow 2s ease-in-out infinite;
  }
`;

// Extended Cyberpunk Color Palette
export const cyberColors = {
  // Neon accent colors
  neonCyan: '#00f5ff',
  neonPurple: '#bf00ff',
  neonPink: '#ff0080',
  neonGreen: '#00ff88',
  neonOrange: '#ff6600',
  neonYellow: '#ffff00',

  // Holographic tones
  holoBlue: '#4fc3f7',
  holoPurple: '#ce93d8',
  holoPink: '#f48fb1',
  holoGreen: '#80cbc4',

  // Deep tech backgrounds
  voidBlack: '#000308',
  deepSpace: '#0a0e1a',
  matrixGreen: '#003300',
  terminalGreen: '#00ff41',

  // Glitch effects
  glitchRed: '#ff0033',
  glitchBlue: '#0066ff',
  glitchCyan: '#00ffff',
};

// HUD (Heads-Up Display) Style Elements
export const hudStyles: Record<string, CSSProperties> = {
  // Main HUD container
  hudContainer: {
    position: 'relative',
    padding: 24,
    background: 'linear-gradient(135deg, rgba(0,5,15,0.95), rgba(10,20,40,0.9))',
    border: `1px solid ${brandCyan}40`,
    borderRadius: 4,
    boxShadow: `
      0 0 20px ${brandCyan}20,
      inset 0 1px 0 ${brandCyan}20,
      inset 0 -1px 0 ${brandPurple}20
    `,
  },

  // HUD corner accents
  hudCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: brandCyan,
    borderStyle: 'solid',
    borderWidth: 0,
  },

  // HUD title bar
  hudTitleBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    background: `linear-gradient(90deg, ${brandCyan}15, transparent, ${brandPurple}15)`,
    borderBottom: `1px solid ${brandCyan}30`,
    marginBottom: 16,
  },

  // HUD readout display
  hudReadout: {
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    fontSize: 11,
    fontWeight: 700,
    color: brandCyan,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    padding: '6px 12px',
    background: 'rgba(143,211,204,0.08)',
    borderLeft: `3px solid ${brandCyan}`,
    animation: 'textFlicker 4s ease-in-out infinite',
  },

  // Status indicator
  hudStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 10px',
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.3)',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 800,
    color: '#22c55e',
    letterSpacing: 1.5,
  },

  // Processing indicator
  hudProcessing: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 10px',
    background: `rgba(143,211,204,0.1)`,
    border: `1px solid ${brandCyan}30`,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 800,
    color: brandCyan,
    letterSpacing: 1.5,
    animation: 'hudPulse 1.5s ease-in-out infinite',
  },

  // Data panel
  hudDataPanel: {
    padding: 16,
    background: 'rgba(0,0,0,0.5)',
    border: `1px solid ${brandCyan}20`,
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },

  // Scan line overlay
  hudScanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    background: `linear-gradient(90deg, transparent, ${brandCyan}60, transparent)`,
    animation: 'scanLineDown 3s linear infinite',
    pointerEvents: 'none',
  },
};

// Holographic Effect Styles
export const holoStyles: Record<string, CSSProperties> = {
  // Holographic card
  holoCard: {
    position: 'relative',
    padding: 24,
    background: `linear-gradient(
      135deg,
      rgba(143,211,204,0.1) 0%,
      rgba(175,132,186,0.08) 25%,
      rgba(176,18,112,0.06) 50%,
      rgba(175,132,186,0.08) 75%,
      rgba(143,211,204,0.1) 100%
    )`,
    backgroundSize: '400% 400%',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 16,
    backdropFilter: 'blur(20px)',
    animation: 'holoShift 8s ease infinite',
    boxShadow: `
      0 8px 32px rgba(0,0,0,0.4),
      0 0 60px rgba(143,211,204,0.1),
      inset 0 1px 0 rgba(255,255,255,0.1)
    `,
  },

  // Rainbow shimmer overlay
  holoShimmer: {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(
      120deg,
      transparent 0%,
      rgba(255,255,255,0.1) 25%,
      rgba(143,211,204,0.2) 50%,
      rgba(175,132,186,0.2) 75%,
      transparent 100%
    )`,
    backgroundSize: '200% 100%',
    animation: 'shimmerSlide 3s ease-in-out infinite',
    borderRadius: 'inherit',
    pointerEvents: 'none',
  },

  // Holographic text
  holoText: {
    background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple}, ${brandPink}, ${brandCyan})`,
    backgroundSize: '300% 100%',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'holoTextShift 4s ease infinite',
    fontWeight: 900,
    textShadow: `0 0 40px ${brandCyan}40`,
  },

  // Iridescent border
  holoBorder: {
    position: 'relative',
    padding: 2,
    background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple}, ${brandPink}, ${brandCyan})`,
    backgroundSize: '300% 300%',
    borderRadius: 18,
    animation: 'borderFlow 4s ease infinite',
  },
};

// Gamification System Styles
export const gamificationStyles: Record<string, CSSProperties> = {
  // XP Bar container
  xpBarContainer: {
    position: 'relative',
    height: 8,
    background: 'rgba(0,0,0,0.4)',
    borderRadius: 4,
    overflow: 'hidden',
    border: `1px solid ${brandCyan}20`,
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
  },

  // XP Bar fill
  xpBarFill: {
    height: '100%',
    background: `linear-gradient(90deg,
      ${brandCyan},
      ${brandPurple} 50%,
      ${brandPink} 100%
    )`,
    borderRadius: 3,
    transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
    position: 'relative',
    boxShadow: `0 0 10px ${brandCyan}60`,
  },

  // XP Bar shimmer effect
  xpBarShimmer: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    animation: 'xpShimmer 2s ease-in-out infinite',
  },

  // Level badge
  levelBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${brandPurple}, ${brandCyan})`,
    border: '3px solid rgba(255,255,255,0.2)',
    boxShadow: `
      0 0 20px ${brandCyan}40,
      0 4px 15px rgba(0,0,0,0.3),
      inset 0 2px 0 rgba(255,255,255,0.2)
    `,
    fontSize: 18,
    fontWeight: 900,
    color: '#fff',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },

  // Level badge glow
  levelBadgeGlow: {
    position: 'absolute',
    inset: -4,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${brandCyan}30 0%, transparent 70%)`,
    animation: 'levelPulse 2s ease-in-out infinite',
    pointerEvents: 'none',
  },

  // Achievement badge
  achievementBadge: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 16,
    background: `linear-gradient(135deg, rgba(143,211,204,0.2), rgba(175,132,186,0.2))`,
    border: `2px solid ${brandCyan}40`,
    boxShadow: `
      0 8px 24px rgba(0,0,0,0.3),
      0 0 30px ${brandCyan}15,
      inset 0 1px 0 rgba(255,255,255,0.1)
    `,
    fontSize: 28,
    transition: 'all 0.3s ease',
  },

  // Achievement badge unlocked
  achievementUnlocked: {
    background: `linear-gradient(135deg, ${brandCyan}30, ${brandPurple}30)`,
    border: `2px solid ${brandCyan}`,
    boxShadow: `
      0 8px 24px ${brandCyan}30,
      0 0 40px ${brandCyan}25,
      inset 0 1px 0 rgba(255,255,255,0.2)
    `,
    animation: 'achievementShine 3s ease-in-out infinite',
  },

  // Achievement locked
  achievementLocked: {
    opacity: 0.4,
    filter: 'grayscale(0.8)',
    background: 'rgba(255,255,255,0.05)',
    border: '2px solid rgba(255,255,255,0.1)',
    boxShadow: 'none',
  },

  // Streak counter
  streakCounter: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    background: 'linear-gradient(135deg, rgba(255,165,0,0.15), rgba(255,69,0,0.15))',
    border: '1px solid rgba(255,165,0,0.4)',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 800,
    color: '#ffa500',
    boxShadow: '0 4px 15px rgba(255,165,0,0.2)',
  },

  // Points popup animation
  pointsPopup: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 900,
    color: brandCyan,
    textShadow: `0 0 10px ${brandCyan}`,
    animation: 'pointsFloat 1s ease-out forwards',
    pointerEvents: 'none',
  },

  // Progress ring
  progressRing: {
    transform: 'rotate(-90deg)',
    filter: `drop-shadow(0 0 10px ${brandCyan}40)`,
  },

  // Leaderboard row
  leaderboardRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.06)',
    transition: 'all 0.2s ease',
  },

  // Leaderboard row highlight
  leaderboardRowHighlight: {
    background: `linear-gradient(135deg, ${brandCyan}10, ${brandPurple}08)`,
    border: `1px solid ${brandCyan}30`,
    boxShadow: `0 0 20px ${brandCyan}10`,
  },

  // Rank badge
  rankBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 900,
  },

  // Rank 1-3 special styles
  rankGold: {
    background: 'linear-gradient(135deg, #ffd700, #ffb300)',
    color: '#1a1a1a',
    boxShadow: '0 4px 15px rgba(255,215,0,0.4)',
  },
  rankSilver: {
    background: 'linear-gradient(135deg, #c0c0c0, #a0a0a0)',
    color: '#1a1a1a',
    boxShadow: '0 4px 15px rgba(192,192,192,0.3)',
  },
  rankBronze: {
    background: 'linear-gradient(135deg, #cd7f32, #a5642a)',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(205,127,50,0.3)',
  },

  // Power-up effect
  powerUp: {
    position: 'relative',
    padding: 16,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    border: `2px solid ${brandCyan}`,
    boxShadow: `
      0 0 30px ${brandCyan}30,
      0 0 60px ${brandCyan}15,
      inset 0 0 30px ${brandCyan}10
    `,
    animation: 'powerUpGlow 1.5s ease-in-out infinite',
  },

  // Combo multiplier
  comboMultiplier: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    background: `linear-gradient(135deg, ${brandPink}, ${brandPurple})`,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 900,
    color: '#fff',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
    boxShadow: `0 4px 15px ${brandPink}40`,
    animation: 'comboPulse 0.5s ease-in-out infinite',
  },
};

// Circuit Board Pattern Styles
export const circuitStyles: Record<string, CSSProperties> = {
  // Circuit board background
  circuitBackground: {
    position: 'relative',
    background: `
      linear-gradient(90deg, ${brandCyan}05 1px, transparent 1px),
      linear-gradient(${brandCyan}05 1px, transparent 1px),
      radial-gradient(circle at 50% 50%, ${brandPurple}10 0%, transparent 50%)
    `,
    backgroundSize: '40px 40px, 40px 40px, 100% 100%',
  },

  // Circuit node
  circuitNode: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: brandCyan,
    boxShadow: `0 0 10px ${brandCyan}, 0 0 20px ${brandCyan}60`,
    animation: 'nodeGlow 2s ease-in-out infinite',
  },

  // Circuit line
  circuitLine: {
    height: 2,
    background: `linear-gradient(90deg, transparent, ${brandCyan}60, transparent)`,
    boxShadow: `0 0 5px ${brandCyan}40`,
  },

  // Data flow line
  dataFlowLine: {
    position: 'relative',
    height: 2,
    background: 'rgba(143,211,204,0.2)',
    overflow: 'hidden',
  },

  // Data flow particle
  dataFlowParticle: {
    position: 'absolute',
    top: -2,
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: brandCyan,
    boxShadow: `0 0 10px ${brandCyan}`,
    animation: 'dataFlowMove 2s linear infinite',
  },

  // Terminal container
  terminalContainer: {
    background: 'rgba(0,0,0,0.8)',
    borderRadius: 8,
    border: `1px solid ${brandCyan}30`,
    overflow: 'hidden',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    fontSize: 12,
  },

  // Terminal header
  terminalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },

  // Terminal dot
  terminalDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },

  // Terminal body
  terminalBody: {
    padding: 16,
    color: brandCyan,
    lineHeight: 1.6,
  },

  // Typing cursor
  typingCursor: {
    display: 'inline-block',
    width: 8,
    height: 16,
    background: brandCyan,
    marginLeft: 2,
    animation: 'cursorBlink 1s step-end infinite',
  },
};

// Data Visualization Styles
export const dataVizStyles: Record<string, CSSProperties> = {
  // Chart container
  chartContainer: {
    position: 'relative',
    padding: 24,
    background: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    border: `1px solid ${brandCyan}20`,
  },

  // Axis line
  axisLine: {
    background: 'rgba(255,255,255,0.2)',
  },

  // Bar chart bar
  chartBar: {
    background: `linear-gradient(180deg, ${brandCyan}, ${brandPurple})`,
    borderRadius: '4px 4px 0 0',
    boxShadow: `0 0 10px ${brandCyan}30`,
    transition: 'height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  // Chart bar glow
  chartBarGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: `linear-gradient(to top, ${brandCyan}30, transparent)`,
    filter: 'blur(4px)',
    pointerEvents: 'none',
  },

  // Pie segment
  pieSegment: {
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.3))`,
  },

  // Data point
  dataPoint: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: brandCyan,
    border: '2px solid #fff',
    boxShadow: `0 0 10px ${brandCyan}`,
    transition: 'transform 0.2s ease',
  },

  // Tooltip
  dataTooltip: {
    position: 'absolute',
    padding: '8px 12px',
    background: 'rgba(0,0,0,0.9)',
    border: `1px solid ${brandCyan}40`,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    color: '#fff',
    boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 20px ${brandCyan}15`,
    zIndex: 100,
    pointerEvents: 'none',
  },

  // Metric card
  metricCard: {
    padding: 20,
    background: `linear-gradient(135deg, rgba(143,211,204,0.08), rgba(175,132,186,0.05))`,
    borderRadius: 16,
    border: `1px solid ${brandCyan}20`,
    textAlign: 'center' as const,
  },

  // Metric value
  metricValue: {
    fontSize: 36,
    fontWeight: 900,
    background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1.2,
  },

  // Metric label
  metricLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginTop: 8,
  },

  // Trend indicator up
  trendUp: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    background: 'rgba(34,197,94,0.15)',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 700,
    color: '#22c55e',
  },

  // Trend indicator down
  trendDown: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 8px',
    background: 'rgba(239,68,68,0.15)',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 700,
    color: '#ef4444',
  },
};

// Interactive Element Styles
export const interactiveStyles: Record<string, CSSProperties> = {
  // Magnetic button
  magneticButton: {
    position: 'relative',
    padding: '14px 28px',
    background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
    border: 'none',
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 800,
    color: '#fff',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.3s ease',
    boxShadow: `
      0 4px 20px ${brandCyan}40,
      0 8px 40px ${brandPurple}20
    `,
  },

  // Button ripple effect container
  rippleContainer: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    borderRadius: 'inherit',
    pointerEvents: 'none',
  },

  // Button hover overlay
  buttonHoverOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(255,255,255,0)',
    transition: 'background 0.3s ease',
    borderRadius: 'inherit',
  },

  // Glass card
  glassCard: {
    padding: 24,
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20,
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },

  // Floating action
  floatingAction: {
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
    border: 'none',
    boxShadow: `
      0 8px 30px ${brandCyan}40,
      0 0 40px ${brandCyan}20
    `,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    animation: 'floatSoft 3s ease-in-out infinite',
    zIndex: 50,
  },

  // Expandable card
  expandableCard: {
    position: 'relative',
    background: 'rgba(11,15,28,0.95)',
    borderRadius: 20,
    border: `1px solid ${brandCyan}20`,
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Card expand trigger
  expandTrigger: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'rgba(143,211,204,0.2)',
    border: `1px solid ${brandCyan}40`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // Slider thumb
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
    border: '3px solid #fff',
    boxShadow: `0 0 15px ${brandCyan}60`,
    cursor: 'grab',
  },

  // Slider track
  sliderTrack: {
    height: 6,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    position: 'relative',
  },

  // Slider fill
  sliderFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
    borderRadius: 3,
    boxShadow: `0 0 10px ${brandCyan}40`,
  },

  // Toggle switch
  toggleSwitch: {
    position: 'relative',
    width: 52,
    height: 28,
    borderRadius: 14,
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  // Toggle switch active
  toggleSwitchActive: {
    background: `linear-gradient(90deg, ${brandCyan}, ${brandPurple})`,
    border: `1px solid ${brandCyan}60`,
    boxShadow: `0 0 20px ${brandCyan}30`,
  },

  // Toggle knob
  toggleKnob: {
    position: 'absolute',
    top: 3,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    transition: 'all 0.3s ease',
  },
};

// Advanced Animation Keyframes (to be added to CSS)
export const advancedKeyframes = `
  /* HUD Pulse */
  @keyframes hudPulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 10px ${brandCyan}30; }
    50% { opacity: 0.7; box-shadow: 0 0 20px ${brandCyan}50; }
  }

  /* Text Flicker */
  @keyframes textFlicker {
    0%, 100% { opacity: 1; }
    92% { opacity: 1; }
    93% { opacity: 0.8; }
    94% { opacity: 1; }
    95% { opacity: 0.9; }
    96% { opacity: 1; }
  }

  /* Holographic Shift */
  @keyframes holoShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Holographic Text Shift */
  @keyframes holoTextShift {
    0% { background-position: 0% 50%; }
    100% { background-position: 300% 50%; }
  }

  /* Shimmer Slide */
  @keyframes shimmerSlide {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  /* Border Flow */
  @keyframes borderFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* XP Bar Shimmer */
  @keyframes xpShimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  /* Level Pulse */
  @keyframes levelPulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }

  /* Achievement Shine */
  @keyframes achievementShine {
    0%, 100% { box-shadow: 0 8px 24px ${brandCyan}30, 0 0 40px ${brandCyan}25; }
    50% { box-shadow: 0 8px 32px ${brandCyan}50, 0 0 60px ${brandCyan}35; }
  }

  /* Points Float */
  @keyframes pointsFloat {
    0% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(-40px); opacity: 0; }
  }

  /* Power-up Glow */
  @keyframes powerUpGlow {
    0%, 100% { box-shadow: 0 0 30px ${brandCyan}30, 0 0 60px ${brandCyan}15, inset 0 0 30px ${brandCyan}10; }
    50% { box-shadow: 0 0 50px ${brandCyan}50, 0 0 100px ${brandCyan}25, inset 0 0 50px ${brandCyan}20; }
  }

  /* Combo Pulse */
  @keyframes comboPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  /* Node Glow */
  @keyframes nodeGlow {
    0%, 100% { box-shadow: 0 0 10px ${brandCyan}, 0 0 20px ${brandCyan}60; }
    50% { box-shadow: 0 0 20px ${brandCyan}, 0 0 40px ${brandCyan}80; }
  }

  /* Data Flow Move */
  @keyframes dataFlowMove {
    0% { left: -6px; }
    100% { left: calc(100% + 6px); }
  }

  /* Cursor Blink */
  @keyframes cursorBlink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  /* Scan Line Down */
  @keyframes scanLineDown {
    0% { top: -10%; }
    100% { top: 110%; }
  }

  /* Float Soft */
  @keyframes floatSoft {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  /* Particle Orbit */
  @keyframes particleOrbit {
    0% { transform: rotate(0deg) translateX(100px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
  }

  /* Matrix Rain */
  @keyframes matrixRain {
    0% { transform: translateY(-100%); opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0; }
  }

  /* Glitch Effect */
  @keyframes glitchEffect {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }

  /* Energy Pulse */
  @keyframes energyPulse {
    0%, 100% { transform: scale(1); filter: brightness(1); }
    50% { transform: scale(1.02); filter: brightness(1.2); }
  }

  /* Radar Sweep */
  @keyframes radarSweep {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Heartbeat */
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    10% { transform: scale(1.1); }
    20% { transform: scale(1); }
    30% { transform: scale(1.05); }
    40% { transform: scale(1); }
  }

  /* Bounce In */
  @keyframes bounceIn {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.1); }
    70% { transform: scale(0.95); }
    100% { transform: scale(1); opacity: 1; }
  }

  /* Slide In Right */
  @keyframes slideInRight {
    0% { transform: translateX(100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }

  /* Slide In Left */
  @keyframes slideInLeft {
    0% { transform: translateX(-100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }

  /* Scale Up */
  @keyframes scaleUp {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  /* Rotate In */
  @keyframes rotateIn {
    0% { transform: rotate(-180deg) scale(0); opacity: 0; }
    100% { transform: rotate(0) scale(1); opacity: 1; }
  }
`;
