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
// FUTURISTIC SOUND LAB DESIGN SYSTEM
// Advanced visual elements for an immersive auditory science experience
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Sound Lab color extensions - frequencies mapped to colors
 */
export const soundLabColors = {
  // Frequency-inspired color spectrum
  lowFreq: '#FF6B6B',      // Bass - warm red
  midFreq: '#4ECDC4',      // Mid - teal
  highFreq: '#A855F7',     // Treble - purple
  ultraFreq: '#F472B6',    // Ultra - pink

  // Neural activity colors
  alpha: '#22D3EE',        // Alpha waves - cyan
  beta: '#A78BFA',         // Beta waves - violet
  theta: '#34D399',        // Theta waves - emerald
  delta: '#FB923C',        // Delta waves - orange

  // Holographic spectrum
  holoBase: 'rgba(143, 211, 204, 0.08)',
  holoMid: 'rgba(175, 132, 186, 0.12)',
  holoAccent: 'rgba(176, 18, 112, 0.10)',
};

/**
 * Advanced glassmorphism effects for sound lab UI
 */
export const glassEffects = {
  // Primary glass panel - for main content areas
  panel: {
    background: 'rgba(13, 17, 23, 0.75)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid rgba(143, 211, 204, 0.15)`,
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2)
    `,
  },

  // Frosted glass - for overlays and modals
  frosted: {
    background: 'rgba(26, 31, 46, 0.85)',
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    border: `1px solid rgba(255, 255, 255, 0.08)`,
    boxShadow: `
      0 25px 50px -12px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
  },

  // Holographic glass - rainbow refraction effect
  holographic: {
    background: `
      linear-gradient(135deg, rgba(143, 211, 204, 0.1) 0%, transparent 50%),
      linear-gradient(225deg, rgba(175, 132, 186, 0.1) 0%, transparent 50%),
      linear-gradient(315deg, rgba(176, 18, 112, 0.08) 0%, transparent 50%),
      rgba(13, 17, 23, 0.8)
    `,
    backdropFilter: 'blur(24px) saturate(150%)',
    WebkitBackdropFilter: 'blur(24px) saturate(150%)',
    border: `1px solid rgba(143, 211, 204, 0.2)`,
  },

  // Crystal clear - minimal blur for clarity
  crystal: {
    background: 'rgba(5, 6, 13, 0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: `1px solid rgba(143, 211, 204, 0.25)`,
  },
};

/**
 * Sound wave and audio visualization styles
 */
export const soundWaveStyles = {
  // Waveform container
  waveformContainer: {
    position: 'relative' as const,
    height: 80,
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    overflow: 'hidden',
    border: `1px solid ${brandCyan}20`,
  },

  // Frequency bar styling
  frequencyBar: {
    position: 'absolute' as const,
    bottom: 0,
    width: 3,
    background: `linear-gradient(to top, ${brandCyan}, ${brandPurple})`,
    borderRadius: '2px 2px 0 0',
    transition: 'height 0.05s ease',
    boxShadow: `0 0 8px ${brandCyan}50`,
  },

  // Audio meter container
  audioMeter: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 2,
    height: 40,
    padding: '8px 12px',
    background: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 8,
  },

  // Oscilloscope display
  oscilloscope: {
    position: 'relative' as const,
    background: `
      radial-gradient(ellipse at center, rgba(143, 211, 204, 0.03) 0%, transparent 70%),
      rgba(5, 6, 13, 0.9)
    `,
    border: `2px solid ${brandCyan}30`,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: `
      0 0 30px ${brandCyan}10,
      inset 0 0 60px rgba(0, 0, 0, 0.5)
    `,
  },

  // Spectrum analyzer
  spectrumAnalyzer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    padding: 12,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
    borderRadius: 12,
    border: `1px solid ${brandCyan}15`,
  },
};

/**
 * Futuristic button variants for sound lab
 */
export const futuristicButtons: Record<string, CSSProperties> = {
  // Neon glow button
  neonButton: {
    position: 'relative',
    padding: '14px 28px',
    background: 'transparent',
    border: `2px solid ${brandCyan}`,
    borderRadius: 8,
    color: brandCyan,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: `
      0 0 10px ${brandCyan}40,
      inset 0 0 10px ${brandCyan}10
    `,
  },

  // Holographic button
  holoButton: {
    position: 'relative',
    padding: '16px 32px',
    background: `linear-gradient(135deg,
      ${brandCyan}20 0%,
      ${brandPurple}20 50%,
      ${brandPink}20 100%
    )`,
    border: `1px solid rgba(255, 255, 255, 0.2)`,
    borderRadius: 12,
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: `
      0 4px 20px rgba(143, 211, 204, 0.15),
      0 0 40px rgba(175, 132, 186, 0.1)
    `,
  },

  // Pulse button - for primary actions
  pulseButton: {
    position: 'relative',
    padding: '16px 36px',
    background: `linear-gradient(135deg, ${brandCyan} 0%, ${brandPurple} 100%)`,
    border: 'none',
    borderRadius: 50,
    color: brandInk,
    fontSize: 15,
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: `
      0 4px 15px ${brandCyan}40,
      0 0 30px ${brandCyan}20
    `,
    transition: 'all 0.3s ease',
  },

  // Audio control button (play/pause style)
  audioControlButton: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: `radial-gradient(circle at 30% 30%, ${brandCyan}30, transparent 70%),
                 linear-gradient(135deg, rgba(26, 31, 46, 0.9), rgba(13, 17, 23, 0.9))`,
    border: `2px solid ${brandCyan}50`,
    color: brandCyan,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: `
      0 0 20px ${brandCyan}30,
      inset 0 -3px 10px rgba(0, 0, 0, 0.3),
      inset 0 3px 10px rgba(255, 255, 255, 0.05)
    `,
    transition: 'all 0.2s ease',
  },
};

/**
 * Neural network visualization styles
 */
export const neuralStyles = {
  // Node styling
  node: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: `radial-gradient(circle at 30% 30%, ${brandCyan}, ${brandPurple})`,
    boxShadow: `0 0 15px ${brandCyan}60`,
    animation: 'neuralPulse 2s ease-in-out infinite',
  },

  // Active node (highlighted)
  nodeActive: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    background: `radial-gradient(circle at 30% 30%, #fff, ${brandCyan})`,
    boxShadow: `
      0 0 20px ${brandCyan},
      0 0 40px ${brandCyan}80,
      0 0 60px ${brandCyan}40
    `,
  },

  // Connection line
  connection: {
    stroke: brandCyan,
    strokeWidth: 1,
    opacity: 0.4,
    strokeDasharray: '4 4',
  },

  // Active connection (data flowing)
  connectionActive: {
    stroke: `url(#neuralGradient)`,
    strokeWidth: 2,
    opacity: 0.8,
    filter: `drop-shadow(0 0 4px ${brandCyan})`,
  },
};

/**
 * Data visualization panel styles
 */
export const dataPanelStyles: Record<string, CSSProperties> = {
  // Main data panel
  dataPanel: {
    ...glassEffects.panel,
    borderRadius: 16,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },

  // Panel header with status
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: `1px solid ${brandCyan}20`,
  },

  // Metric display
  metricDisplay: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: '16px 20px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    border: `1px solid ${brandCyan}15`,
  },

  // Metric value (large number)
  metricValue: {
    fontSize: 32,
    fontWeight: 800,
    fontFamily: 'monospace',
    color: brandCyan,
    textShadow: `0 0 20px ${brandCyan}50`,
    lineHeight: 1,
  },

  // Metric label
  metricLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: colors.text.muted,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
  },

  // Real-time indicator
  liveIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    background: 'rgba(34, 197, 94, 0.15)',
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 700,
    color: '#22c55e',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
};

/**
 * Futuristic card variants
 */
export const futuristicCards: Record<string, CSSProperties> = {
  // Sound lab card - primary interactive element
  soundLabCard: {
    position: 'relative',
    padding: 24,
    background: `
      linear-gradient(135deg, rgba(143, 211, 204, 0.05) 0%, transparent 50%),
      linear-gradient(225deg, rgba(175, 132, 186, 0.05) 0%, transparent 50%),
      rgba(13, 17, 23, 0.85)
    `,
    borderRadius: 20,
    border: `1px solid rgba(143, 211, 204, 0.2)`,
    backdropFilter: 'blur(20px)',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  },

  // Test module card
  testModuleCard: {
    position: 'relative',
    padding: 20,
    background: 'rgba(26, 31, 46, 0.8)',
    borderRadius: 16,
    border: `1px solid ${brandCyan}25`,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },

  // Achievement card
  achievementCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    background: `linear-gradient(135deg, rgba(143, 211, 204, 0.08), rgba(175, 132, 186, 0.05))`,
    borderRadius: 14,
    border: `1px solid ${brandCyan}20`,
    transition: 'all 0.3s ease',
  },

  // Stats card
  statsCard: {
    padding: 20,
    background: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 14,
    border: `1px solid rgba(255, 255, 255, 0.08)`,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
};

/**
 * Enhanced animation keyframes for sound lab
 */
export const soundLabAnimations = `
  /* Sound wave animation - bars bouncing */
  @keyframes soundWave {
    0%, 100% { transform: scaleY(0.3); }
    50% { transform: scaleY(1); }
  }

  /* Frequency pulse - expanding rings */
  @keyframes frequencyPulse {
    0% {
      transform: scale(0.8);
      opacity: 1;
      box-shadow: 0 0 0 0 ${brandCyan}60;
    }
    70% {
      transform: scale(1);
      opacity: 0.7;
      box-shadow: 0 0 0 20px ${brandCyan}00;
    }
    100% {
      transform: scale(0.8);
      opacity: 1;
      box-shadow: 0 0 0 0 ${brandCyan}00;
    }
  }

  /* Audio spectrum animation */
  @keyframes spectrumBar {
    0%, 100% { height: 20%; }
    25% { height: 80%; }
    50% { height: 40%; }
    75% { height: 90%; }
  }

  /* Holographic shimmer - rainbow sweep */
  @keyframes holoShimmer {
    0% {
      background-position: -200% 0;
      filter: hue-rotate(0deg);
    }
    50% {
      filter: hue-rotate(30deg);
    }
    100% {
      background-position: 200% 0;
      filter: hue-rotate(0deg);
    }
  }

  /* Neon flicker effect */
  @keyframes neonFlicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
      opacity: 1;
      text-shadow:
        0 0 4px ${brandCyan},
        0 0 11px ${brandCyan},
        0 0 19px ${brandCyan},
        0 0 40px ${brandCyan};
    }
    20%, 24%, 55% {
      opacity: 0.8;
      text-shadow: none;
    }
  }

  /* Data stream flowing */
  @keyframes dataStreamFlow {
    0% {
      transform: translateY(100%);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100%);
      opacity: 0;
    }
  }

  /* Radar sweep */
  @keyframes radarSweep {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Neural network pulse - node activation */
  @keyframes nodeActivate {
    0% {
      transform: scale(1);
      box-shadow: 0 0 10px ${brandCyan}40;
    }
    50% {
      transform: scale(1.3);
      box-shadow: 0 0 30px ${brandCyan}80, 0 0 60px ${brandCyan}40;
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 10px ${brandCyan}40;
    }
  }

  /* Connection data flow */
  @keyframes connectionFlow {
    0% {
      stroke-dashoffset: 20;
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
    100% {
      stroke-dashoffset: 0;
      opacity: 0.3;
    }
  }

  /* Glitch effect for text */
  @keyframes glitchText {
    0%, 100% {
      transform: translate(0);
      text-shadow:
        -2px 0 ${brandPink},
        2px 0 ${brandCyan};
    }
    25% {
      transform: translate(-2px, 1px);
      text-shadow:
        2px 0 ${brandPink},
        -2px 0 ${brandCyan};
    }
    50% {
      transform: translate(2px, -1px);
      text-shadow:
        -2px 0 ${brandCyan},
        2px 0 ${brandPink};
    }
    75% {
      transform: translate(-1px, 2px);
      text-shadow:
        2px 0 ${brandCyan},
        -2px 0 ${brandPink};
    }
  }

  /* Typing cursor blink */
  @keyframes cursorBlink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  /* Card hover lift with glow */
  @keyframes cardLift {
    0% {
      transform: translateY(0) scale(1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    100% {
      transform: translateY(-8px) scale(1.02);
      box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.3),
        0 0 60px ${brandCyan}20;
    }
  }

  /* Breathing glow for focus states */
  @keyframes breathingGlow {
    0%, 100% {
      box-shadow:
        0 0 5px ${brandCyan}30,
        0 0 10px ${brandCyan}20,
        0 0 15px ${brandCyan}10;
    }
    50% {
      box-shadow:
        0 0 10px ${brandCyan}50,
        0 0 20px ${brandCyan}30,
        0 0 30px ${brandCyan}20;
    }
  }

  /* Progress ring animation */
  @keyframes progressRing {
    0% {
      stroke-dashoffset: 283;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  /* Particle float with 3D effect */
  @keyframes particleFloat3D {
    0%, 100% {
      transform: translate3d(0, 0, 0) rotateX(0deg);
    }
    25% {
      transform: translate3d(10px, -15px, 20px) rotateX(5deg);
    }
    50% {
      transform: translate3d(-5px, -25px, 10px) rotateX(-5deg);
    }
    75% {
      transform: translate3d(-15px, -10px, 30px) rotateX(3deg);
    }
  }

  /* Scanner line effect */
  @keyframes scannerLine {
    0% {
      top: 0;
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      top: 100%;
      opacity: 1;
    }
  }

  /* Energy charge animation */
  @keyframes energyCharge {
    0% {
      background-size: 0% 100%;
    }
    100% {
      background-size: 100% 100%;
    }
  }

  /* Rotate with glow */
  @keyframes rotateGlow {
    0% {
      transform: rotate(0deg);
      filter: drop-shadow(0 0 5px ${brandCyan}40);
    }
    50% {
      filter: drop-shadow(0 0 15px ${brandCyan}80);
    }
    100% {
      transform: rotate(360deg);
      filter: drop-shadow(0 0 5px ${brandCyan}40);
    }
  }

  /* Stagger animation delays for lists */
  .stagger-delay-1 { animation-delay: 0.05s; }
  .stagger-delay-2 { animation-delay: 0.1s; }
  .stagger-delay-3 { animation-delay: 0.15s; }
  .stagger-delay-4 { animation-delay: 0.2s; }
  .stagger-delay-5 { animation-delay: 0.25s; }
  .stagger-delay-6 { animation-delay: 0.3s; }
  .stagger-delay-7 { animation-delay: 0.35s; }
  .stagger-delay-8 { animation-delay: 0.4s; }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

/**
 * Interactive hover state styles
 */
export const hoverEffects = {
  // Lift with glow
  liftGlow: {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 60px ${brandCyan}15
    `,
    borderColor: `${brandCyan}40`,
  },

  // Neon border activation
  neonActivate: {
    borderColor: brandCyan,
    boxShadow: `
      0 0 10px ${brandCyan}50,
      0 0 20px ${brandCyan}30,
      inset 0 0 10px ${brandCyan}10
    `,
  },

  // Holographic shift
  holoShift: {
    background: `
      linear-gradient(135deg, ${brandCyan}15 0%, transparent 30%),
      linear-gradient(225deg, ${brandPurple}15 0%, transparent 30%),
      linear-gradient(315deg, ${brandPink}10 0%, transparent 30%),
      rgba(13, 17, 23, 0.9)
    `,
  },

  // Scale pulse
  scalePulse: {
    transform: 'scale(1.05)',
    boxShadow: `0 0 30px ${brandCyan}30`,
  },
};

/**
 * Focus state styles for accessibility
 */
export const focusStyles = {
  // Primary focus ring
  primary: {
    outline: 'none',
    boxShadow: `
      0 0 0 2px ${brandInk},
      0 0 0 4px ${brandCyan},
      0 0 20px ${brandCyan}30
    `,
  },

  // Subtle focus
  subtle: {
    outline: 'none',
    boxShadow: `0 0 0 2px ${brandCyan}60`,
  },

  // High contrast focus
  highContrast: {
    outline: `3px solid ${brandCyan}`,
    outlineOffset: 2,
  },
};

/**
 * Loading and skeleton styles
 */
export const loadingStyles: Record<string, CSSProperties> = {
  // Skeleton shimmer
  skeleton: {
    background: `linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.03) 0%,
      rgba(255, 255, 255, 0.08) 50%,
      rgba(255, 255, 255, 0.03) 100%
    )`,
    backgroundSize: '200% 100%',
    animation: 'holoShimmer 1.5s ease-in-out infinite',
    borderRadius: 8,
  },

  // Pulse loader
  pulseLoader: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${brandCyan} 0%, transparent 70%)`,
    animation: 'frequencyPulse 1.5s ease-in-out infinite',
  },

  // Scanning line loader
  scanLoader: {
    position: 'relative',
    height: 4,
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
};

/**
 * Tooltip styles
 */
export const tooltipStyles: Record<string, CSSProperties> = {
  tooltip: {
    position: 'absolute',
    padding: '8px 14px',
    background: 'rgba(13, 17, 23, 0.95)',
    border: `1px solid ${brandCyan}30`,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 500,
    color: colors.text.primary,
    backdropFilter: 'blur(10px)',
    boxShadow: `
      0 10px 30px rgba(0, 0, 0, 0.4),
      0 0 20px ${brandCyan}10
    `,
    zIndex: 1000,
    whiteSpace: 'nowrap' as const,
  },

  tooltipArrow: {
    position: 'absolute',
    width: 8,
    height: 8,
    background: 'rgba(13, 17, 23, 0.95)',
    border: `1px solid ${brandCyan}30`,
    borderRight: 'none',
    borderBottom: 'none',
    transform: 'rotate(45deg)',
  },
};
