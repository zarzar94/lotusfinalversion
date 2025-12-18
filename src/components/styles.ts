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
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
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
    minWidth: 200,
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
