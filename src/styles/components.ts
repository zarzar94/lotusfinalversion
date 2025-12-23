/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - COMPONENT STYLE SYSTEM
 * Reusable style compositions for consistent UI components
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { CSSProperties } from 'react';
import { brand, semantic, typography, spacing, radius, shadows, gradients, transitions } from './tokens';

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
export type StyleRecord = Record<string, CSSProperties>;

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT STYLES
// ─────────────────────────────────────────────────────────────────────────────
export const layout: StyleRecord = {
  page: {
    background: `radial-gradient(1200px 600px at 20% 10%, rgba(175,132,186,0.18), transparent 55%),
                 radial-gradient(900px 450px at 80% 0%, rgba(143,211,204,0.14), transparent 55%),
                 radial-gradient(900px 600px at 60% 90%, rgba(176,18,112,0.10), transparent 55%),
                 ${brand.ink}`,
    color: semantic.text.primary,
    minHeight: '100vh',
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.size.base,
    lineHeight: typography.lineHeight.normal,
    position: 'relative',
    overflowX: 'hidden',
  },
  container: {
    maxWidth: 1180,
    margin: '0 auto',
    padding: `0 ${spacing[4]}px ${spacing[20]}px`,
    position: 'relative',
    zIndex: 1,
  },
  section: {
    padding: `${spacing[8]}px ${spacing[6]}px`,
    borderRadius: radius.xl,
    border: `1px solid ${semantic.border.default}`,
    background: gradients.surface,
    marginBottom: spacing[5],
    boxShadow: shadows['2xl'],
  },
  sectionCard: {
    scrollMarginTop: 92,
    padding: `${spacing[6]}px ${spacing[5]}px`,
    borderRadius: radius.xl,
    border: `1px solid ${semantic.border.default}`,
    background: semantic.surface.card,
    backdropFilter: 'blur(6px)',
    marginBottom: spacing[5],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY STYLES
// ─────────────────────────────────────────────────────────────────────────────
export const text: StyleRecord = {
  title: {
    margin: 0,
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.black,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.wide,
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
  lead: {
    margin: 0,
    fontSize: typography.size.base,
    color: semantic.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
  },
  body: {
    margin: 0,
    color: 'rgba(255, 255, 255, 0.88)',
    fontSize: typography.size.base,
    lineHeight: typography.lineHeight.loose,
  },
  muted: {
    margin: 0,
    color: semantic.text.secondary,
    fontSize: typography.size.sm,
    lineHeight: typography.lineHeight.relaxed,
  },
  mono: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.size.sm,
    letterSpacing: typography.letterSpacing.wide,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON STYLES
// ─────────────────────────────────────────────────────────────────────────────
export const buttons: StyleRecord = {
  primary: {
    border: 'none',
    background: gradients.primary,
    color: brand.ink,
    padding: `${spacing[3]}px ${spacing[4]}px`,
    borderRadius: radius.lg,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.black,
    cursor: 'pointer',
    boxShadow: shadows.glow.cyan,
    transition: transitions.bounce,
  },
  ghost: {
    border: `1px solid ${semantic.border.emphasis}`,
    background: 'rgba(255,255,255,0.02)',
    color: semantic.text.primary,
    padding: `${spacing[2.5]}px ${spacing[3]}px`,
    borderRadius: radius.lg,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.extrabold,
    cursor: 'pointer',
    transition: transitions.normal,
  },
  disabled: {
    border: 'none',
    background: semantic.border.default,
    color: semantic.text.muted,
    padding: `${spacing[3]}px ${spacing[4]}px`,
    borderRadius: radius.lg,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.black,
    cursor: 'not-allowed',
  },
  danger: {
    border: '1px solid rgba(239,68,68,0.25)',
    background: semantic.status.error.bg,
    color: '#fecaca',
    padding: `${spacing[2.5]}px ${spacing[3]}px`,
    borderRadius: radius.lg,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.black,
    cursor: 'pointer',
    transition: transitions.normal,
  },
  neon: {
    position: 'relative',
    padding: '14px 28px',
    background: 'transparent',
    border: `2px solid ${brand.cyan}`,
    borderRadius: radius.md,
    color: brand.cyan,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: transitions.smooth,
    boxShadow: `0 0 10px ${brand.cyan}44, inset 0 0 10px ${brand.cyan}11`,
  },
  audioControl: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: `radial-gradient(circle at 30% 30%, ${brand.cyan}33, transparent 70%),
                 linear-gradient(135deg, rgba(26, 31, 46, 0.9), rgba(13, 17, 23, 0.9))`,
    border: `2px solid ${brand.cyan}55`,
    color: brand.cyan,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: `0 0 20px ${brand.cyan}33, inset 0 -3px 10px rgba(0, 0, 0, 0.3), inset 0 3px 10px rgba(255, 255, 255, 0.05)`,
    transition: transitions.fast,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// FORM STYLES
// ─────────────────────────────────────────────────────────────────────────────
export const forms: StyleRecord = {
  input: {
    background: semantic.surface.input,
    color: semantic.text.primary,
    border: `1px solid rgba(255,255,255,0.12)`,
    borderRadius: radius.md,
    padding: `${spacing[2.5]}px ${spacing[3]}px`,
    fontSize: typography.size.base,
    width: '100%',
    minWidth: 0,
    transition: transitions.fast,
  },
  textarea: {
    background: semantic.surface.input,
    color: semantic.text.primary,
    border: `1px solid rgba(255,255,255,0.12)`,
    borderRadius: radius.md,
    padding: `${spacing[2.5]}px ${spacing[3]}px`,
    fontSize: typography.size.base,
    resize: 'vertical',
    transition: transitions.fast,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1.5],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CARD STYLES
// ─────────────────────────────────────────────────────────────────────────────
export const cards: StyleRecord = {
  base: {
    borderRadius: radius.xl,
    padding: spacing[4],
    border: `1px solid ${semantic.border.default}`,
    background: semantic.surface.card,
    backdropFilter: 'blur(6px)',
    transition: transitions.smooth,
  },
  glass: {
    background: semantic.surface.glass,
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: `1px solid rgba(143, 211, 204, 0.15)`,
    boxShadow: shadows.panel,
    borderRadius: radius.xl,
    padding: spacing[6],
  },
  soundLab: {
    position: 'relative',
    padding: spacing[6],
    background: gradients.holographic,
    borderRadius: radius['2xl'],
    border: `1px solid rgba(143, 211, 204, 0.2)`,
    backdropFilter: 'blur(20px)',
    overflow: 'hidden',
    transition: transitions.bounce,
    cursor: 'pointer',
  },
  achievement: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
    padding: spacing[4],
    background: `linear-gradient(135deg, rgba(143, 211, 204, 0.08), rgba(175, 132, 186, 0.05))`,
    borderRadius: radius.lg,
    border: `1px solid ${brand.cyan}22`,
    transition: transitions.smooth,
  },
  stats: {
    padding: spacing[5],
    background: 'rgba(0, 0, 0, 0.4)',
    borderRadius: radius.lg,
    border: `1px solid rgba(255, 255, 255, 0.08)`,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[3],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// BADGE & CHIP STYLES
// ─────────────────────────────────────────────────────────────────────────────
export const badges: StyleRecord = {
  chip: {
    background: 'rgba(175,132,186,0.14)',
    border: '1px solid rgba(175,132,186,0.25)',
    color: semantic.text.primary,
    padding: `${spacing[1.5]}px ${spacing[2.5]}px`,
    borderRadius: radius.full,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.extrabold,
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[2],
  },
  comingSoon: {
    background: semantic.status.warning.bg,
    color: brand.warning,
    padding: `${spacing[1]}px ${spacing[2.5]}px`,
    borderRadius: radius.md,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.extrabold,
    letterSpacing: typography.letterSpacing.wide,
  },
  lab: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[1.5],
    padding: `${spacing[1.5]}px ${spacing[3]}px`,
    background: 'rgba(13,17,23,0.9)',
    borderRadius: radius.md,
    border: `1px solid ${brand.cyan}33`,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.extrabold,
    color: brand.cyan,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  live: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[1.5],
    padding: `${spacing[1]}px ${spacing[2.5]}px`,
    background: semantic.status.online.bg,
    borderRadius: radius.full,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: brand.success,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HUD STYLES (Lab-Tech Aesthetic)
// ─────────────────────────────────────────────────────────────────────────────
export const hud: StyleRecord = {
  // Top glow bar
  glowBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    background: gradients.glowBar,
    animation: 'glowPulse 3s ease-in-out infinite',
  },
  // Grid pattern overlay
  gridPattern: {
    position: 'absolute',
    inset: 0,
    opacity: 0.03,
    backgroundImage: `
      linear-gradient(${brand.cyan}22 1px, transparent 1px),
      linear-gradient(90deg, ${brand.cyan}22 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  },
  // Status dot
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: brand.success,
    boxShadow: `0 0 8px ${brand.success}`,
    animation: 'statusPulse 2s ease-in-out infinite',
  },
  // Corner bracket (need position props)
  cornerBracket: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderColor: `${brand.cyan}44`,
    borderStyle: 'solid',
    pointerEvents: 'none',
  },
  // Scan line effect container
  scanLineContainer: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  // Data stream particle
  dataStream: {
    position: 'absolute',
    width: '15%',
    height: 1,
    background: `linear-gradient(90deg, transparent, ${brand.cyan}44, transparent)`,
    animation: 'dataStream 6s linear infinite',
    pointerEvents: 'none',
  },
  // Circuit node
  circuitNode: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: brand.cyan,
    boxShadow: `0 0 8px ${brand.cyan}`,
    animation: 'circuitPulse 2s ease-in-out infinite',
  },
  // Panel with lab styling
  panel: {
    background: 'linear-gradient(180deg, rgba(26,31,46,0.98) 0%, rgba(13,17,23,0.95) 100%)',
    backdropFilter: 'blur(16px)',
    border: `1px solid ${brand.cyan}22`,
    borderRadius: radius.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  // Header bar for panels
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing[3]}px ${spacing[4]}px`,
    borderBottom: `1px solid ${brand.cyan}22`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// AUDIO VISUALIZATION STYLES
// ─────────────────────────────────────────────────────────────────────────────
export const audioViz: StyleRecord = {
  waveformContainer: {
    position: 'relative',
    height: 80,
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: radius.lg,
    overflow: 'hidden',
    border: `1px solid ${brand.cyan}22`,
  },
  frequencyBar: {
    position: 'absolute',
    bottom: 0,
    width: 3,
    background: gradients.cyanPurple,
    borderRadius: '2px 2px 0 0',
    transition: 'height 0.05s ease',
    boxShadow: `0 0 8px ${brand.cyan}55`,
  },
  audioMeter: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 2,
    height: 40,
    padding: `${spacing[2]}px ${spacing[3]}px`,
    background: 'rgba(0, 0, 0, 0.4)',
    borderRadius: radius.md,
  },
  oscilloscope: {
    position: 'relative',
    background: `
      radial-gradient(ellipse at center, ${brand.cyan}05 0%, transparent 70%),
      rgba(5, 6, 13, 0.9)
    `,
    border: `2px solid ${brand.cyan}33`,
    borderRadius: radius.xl,
    overflow: 'hidden',
    boxShadow: `0 0 30px ${brand.cyan}11, inset 0 0 60px rgba(0, 0, 0, 0.5)`,
  },
  spectrumAnalyzer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    padding: spacing[3],
    background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
    borderRadius: radius.lg,
    border: `1px solid ${brand.cyan}18`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA PANEL STYLES
// ─────────────────────────────────────────────────────────────────────────────
export const dataPanel: StyleRecord = {
  container: {
    ...cards.glass,
    borderRadius: radius.xl,
    padding: spacing[6],
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[5],
    paddingBottom: spacing[4],
    borderBottom: `1px solid ${brand.cyan}22`,
  },
  metric: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
    padding: `${spacing[4]}px ${spacing[5]}px`,
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: radius.lg,
    border: `1px solid ${brand.cyan}18`,
  },
  metricValue: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.extrabold,
    fontFamily: typography.fontFamily.mono,
    color: brand.cyan,
    textShadow: `0 0 20px ${brand.cyan}55`,
    lineHeight: 1,
  },
  metricLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: semantic.text.muted,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.widest,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MODAL STYLES
// ─────────────────────────────────────────────────────────────────────────────
export const modal: StyleRecord = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 40,
    padding: spacing[3],
  },
  container: {
    background: semantic.surface.overlay,
    borderRadius: radius.xl,
    padding: spacing[4],
    border: `1px solid ${semantic.border.emphasis}`,
    maxWidth: 980,
    width: '100%',
    maxHeight: '86vh',
    overflow: 'auto',
    boxShadow: shadows['2xl'],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS & LOADING STYLES
// ─────────────────────────────────────────────────────────────────────────────
export const progress: StyleRecord = {
  track: {
    height: 6,
    background: 'rgba(255,255,255,0.08)',
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    background: gradients.cyanPurple,
    borderRadius: radius.sm,
    transition: 'width 0.4s ease',
  },
  skeleton: {
    background: `linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.03) 0%,
      rgba(255, 255, 255, 0.08) 50%,
      rgba(255, 255, 255, 0.03) 100%
    )`,
    backgroundSize: '200% 100%',
    animation: 'holoShimmer 1.5s ease-in-out infinite',
    borderRadius: radius.md,
  },
  pulseLoader: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${brand.cyan} 0%, transparent 70%)`,
    animation: 'frequencyPulse 1.5s ease-in-out infinite',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TOOLTIP STYLES
// ─────────────────────────────────────────────────────────────────────────────
export const tooltip: StyleRecord = {
  container: {
    position: 'absolute',
    padding: `${spacing[2]}px ${spacing[3.5]}px`,
    background: 'rgba(13, 17, 23, 0.95)',
    border: `1px solid ${brand.cyan}33`,
    borderRadius: radius.md,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    color: semantic.text.primary,
    backdropFilter: 'blur(10px)',
    boxShadow: `0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px ${brand.cyan}11`,
    zIndex: 70,
    whiteSpace: 'nowrap',
  },
  arrow: {
    position: 'absolute',
    width: 8,
    height: 8,
    background: 'rgba(13, 17, 23, 0.95)',
    border: `1px solid ${brand.cyan}33`,
    borderRight: 'none',
    borderBottom: 'none',
    transform: 'rotate(45deg)',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HOVER EFFECT STYLES
// Pre-defined hover state transformations
// ─────────────────────────────────────────────────────────────────────────────
export const hoverEffects = {
  liftGlow: {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: shadows.panelHover,
    borderColor: `${brand.cyan}44`,
  },
  neonActivate: {
    borderColor: brand.cyan,
    boxShadow: `0 0 10px ${brand.cyan}55, 0 0 20px ${brand.cyan}33, inset 0 0 10px ${brand.cyan}11`,
  },
  scalePulse: {
    transform: 'scale(1.05)',
    boxShadow: `0 0 30px ${brand.cyan}33`,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FOCUS STYLES (Accessibility)
// ─────────────────────────────────────────────────────────────────────────────
export const focusStyles = {
  primary: {
    outline: 'none',
    boxShadow: `0 0 0 2px ${brand.ink}, 0 0 0 4px ${brand.cyan}, 0 0 20px ${brand.cyan}33`,
  },
  subtle: {
    outline: 'none',
    boxShadow: `0 0 0 2px ${brand.cyan}66`,
  },
  highContrast: {
    outline: `3px solid ${brand.cyan}`,
    outlineOffset: 2,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// MODULE METRICS & SESSION STORAGE STYLES (Issue #37)
// Styles for module metrics schema and session storage UI
// ─────────────────────────────────────────────────────────────────────────────
export const moduleMetrics: StyleRecord = {
  sessionCard: {
    padding: spacing[5],
    background: 'linear-gradient(135deg, rgba(143,211,204,0.08), rgba(175,132,186,0.05))',
    borderRadius: radius.xl,
    border: `1px solid ${brand.cyan}22`,
    position: 'relative',
    overflow: 'hidden',
  },
  metricGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: spacing[4],
  },
  metricItem: {
    padding: spacing[4],
    background: 'rgba(0,0,0,0.3)',
    borderRadius: radius.lg,
    border: `1px solid ${brand.cyan}18`,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.black,
    fontFamily: typography.fontFamily.mono,
    color: brand.cyan,
    textShadow: `0 0 15px ${brand.cyan}44`,
  },
  metricLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: semantic.text.muted,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.widest,
    marginTop: spacing[1],
  },
  sessionTimeline: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[3]}px ${spacing[4]}px`,
    background: 'rgba(0,0,0,0.2)',
    borderRadius: radius.md,
  },
  storageIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[2]}px ${spacing[3]}px`,
    background: `${brand.success}15`,
    borderRadius: radius.full,
    fontSize: typography.size.xs,
    color: brand.success,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// FOCUSED ATTENTION MODULE STYLES (Issue #38)
// CPT/odd-one-out attention task UI
// ─────────────────────────────────────────────────────────────────────────────
export const attentionModule: StyleRecord = {
  targetZone: {
    width: '100%',
    aspectRatio: '16/9',
    background: 'radial-gradient(ellipse at center, rgba(143,211,204,0.08) 0%, rgba(5,6,13,0.95) 70%)',
    borderRadius: radius.xl,
    border: `2px solid ${brand.cyan}33`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  stimulus: {
    width: 120,
    height: 120,
    borderRadius: radius.xl,
    background: gradients.cyanPurple,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
    boxShadow: `0 0 40px ${brand.cyan}44`,
    transition: transitions.spring,
  },
  stimulusTarget: {
    boxShadow: `0 0 60px ${brand.success}66, 0 0 100px ${brand.success}33`,
    border: `3px solid ${brand.success}`,
  },
  stimulusDistractor: {
    opacity: 0.6,
    filter: 'grayscale(0.3)',
  },
  responseButton: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: gradients.primary,
    border: `3px solid ${brand.cyan}`,
    cursor: 'pointer',
    transition: transitions.fast,
    boxShadow: `0 0 20px ${brand.cyan}33`,
  },
  reactionTimer: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    padding: `${spacing[2]}px ${spacing[4]}px`,
    background: 'rgba(0,0,0,0.6)',
    borderRadius: radius.full,
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.size.lg,
    color: brand.cyan,
    border: `1px solid ${brand.cyan}44`,
  },
  streakCounter: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[2]}px ${spacing[3]}px`,
    background: `linear-gradient(135deg, ${brand.purple}22, ${brand.pink}15)`,
    borderRadius: radius.lg,
    border: `1px solid ${brand.purple}33`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// BINAURAL/DICHOTIC LISTENING MODULE STYLES (Issue #39)
// Left/right ear discrimination and integration tasks
// ─────────────────────────────────────────────────────────────────────────────
export const binauralModule: StyleRecord = {
  earDisplay: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: spacing[6],
    alignItems: 'center',
    padding: spacing[6],
    background: 'linear-gradient(180deg, rgba(26,31,46,0.95) 0%, rgba(13,17,23,0.98) 100%)',
    borderRadius: radius['2xl'],
    border: `1px solid ${brand.purple}22`,
  },
  earChannel: {
    padding: spacing[5],
    background: 'rgba(0,0,0,0.4)',
    borderRadius: radius.xl,
    textAlign: 'center',
    position: 'relative',
  },
  earChannelLeft: {
    borderLeft: `4px solid ${brand.cyan}`,
    boxShadow: `-10px 0 40px ${brand.cyan}22`,
  },
  earChannelRight: {
    borderRight: `4px solid ${brand.purple}`,
    boxShadow: `10px 0 40px ${brand.purple}22`,
  },
  earIcon: {
    width: 64,
    height: 64,
    margin: '0 auto',
    marginBottom: spacing[3],
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
  },
  brainCenter: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: `radial-gradient(circle at 40% 40%, ${brand.cyan}33, ${brand.purple}22, transparent 70%)`,
    border: `2px dashed ${brand.cyan}44`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'brainPulse 3s ease-in-out infinite',
  },
  integrationIndicator: {
    padding: `${spacing[3]}px ${spacing[5]}px`,
    background: `linear-gradient(90deg, ${brand.cyan}22, ${brand.purple}22)`,
    borderRadius: radius.full,
    textAlign: 'center',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
  channelSelector: {
    display: 'flex',
    gap: spacing[3],
    padding: spacing[3],
    background: 'rgba(0,0,0,0.3)',
    borderRadius: radius.lg,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SPEECH-IN-NOISE SNR MODULE STYLES (Issue #40)
// Adaptive signal-to-noise ratio testing UI
// ─────────────────────────────────────────────────────────────────────────────
export const snrModule: StyleRecord = {
  noiseField: {
    position: 'relative',
    padding: spacing[8],
    background: `
      repeating-radial-gradient(circle at 50% 50%, transparent 0, rgba(255,255,255,0.02) 1px, transparent 2px),
      linear-gradient(180deg, rgba(13,17,23,0.98) 0%, rgba(5,6,13,0.99) 100%)
    `,
    borderRadius: radius['2xl'],
    border: `1px solid rgba(255,255,255,0.08)`,
    overflow: 'hidden',
  },
  noiseOverlay: {
    position: 'absolute',
    inset: 0,
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
    pointerEvents: 'none',
  },
  signalBubble: {
    position: 'relative',
    zIndex: 2,
    padding: `${spacing[6]}px ${spacing[8]}px`,
    background: `linear-gradient(135deg, ${brand.cyan}15, ${brand.purple}10)`,
    borderRadius: radius.xl,
    border: `2px solid ${brand.cyan}44`,
    textAlign: 'center',
    boxShadow: `0 0 40px ${brand.cyan}22`,
  },
  snrMeter: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
    padding: spacing[4],
    background: 'rgba(0,0,0,0.5)',
    borderRadius: radius.lg,
    marginTop: spacing[4],
  },
  snrBar: {
    flex: 1,
    height: 8,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: radius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  snrLevel: {
    height: '100%',
    background: `linear-gradient(90deg, ${brand.success}, ${brand.warning}, ${brand.error})`,
    borderRadius: radius.full,
    transition: 'width 0.3s ease',
  },
  wordDisplay: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.black,
    color: semantic.text.primary,
    textShadow: `0 0 30px ${brand.cyan}55`,
    letterSpacing: typography.letterSpacing.wide,
  },
  responseOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: spacing[3],
    marginTop: spacing[5],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// LONGITUDINAL ANALYTICS STYLES (Issue #41)
// Fatigue slope and progress tracking charts
// ─────────────────────────────────────────────────────────────────────────────
export const analytics: StyleRecord = {
  chartContainer: {
    padding: spacing[5],
    background: 'linear-gradient(180deg, rgba(26,31,46,0.9) 0%, rgba(13,17,23,0.95) 100%)',
    borderRadius: radius.xl,
    border: `1px solid ${brand.cyan}18`,
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
    paddingBottom: spacing[3],
    borderBottom: `1px solid ${brand.cyan}15`,
  },
  chartTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.extrabold,
    color: semantic.text.primary,
  },
  chartLegend: {
    display: 'flex',
    gap: spacing[4],
    flexWrap: 'wrap',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    fontSize: typography.size.sm,
    color: semantic.text.secondary,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },
  trendIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[1],
    padding: `${spacing[1]}px ${spacing[2.5]}px`,
    borderRadius: radius.full,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  },
  trendUp: {
    background: `${brand.success}18`,
    color: brand.success,
  },
  trendDown: {
    background: `${brand.error}18`,
    color: brand.error,
  },
  fatigueZone: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '20%',
    background: `linear-gradient(90deg, transparent, ${brand.warning}15)`,
    borderLeft: `1px dashed ${brand.warning}44`,
    pointerEvents: 'none',
  },
  sessionMarker: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: brand.cyan,
    boxShadow: `0 0 8px ${brand.cyan}66`,
    cursor: 'pointer',
    transition: transitions.fast,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROLE DASHBOARD EXPORT STYLES (Issue #42)
// Parent/school/clinician dashboard and report export UI
// ─────────────────────────────────────────────────────────────────────────────
export const dashboardExport: StyleRecord = {
  exportPanel: {
    padding: spacing[5],
    background: gradients.panel,
    borderRadius: radius.xl,
    border: `1px solid ${brand.purple}22`,
  },
  exportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  exportButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[3]}px ${spacing[5]}px`,
    background: gradients.primary,
    border: 'none',
    borderRadius: radius.lg,
    color: brand.ink,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    cursor: 'pointer',
    boxShadow: shadows.glow.cyan,
    transition: transitions.bounce,
  },
  reportPreview: {
    padding: spacing[4],
    background: 'rgba(255,255,255,0.02)',
    borderRadius: radius.lg,
    border: `1px solid ${brand.cyan}15`,
    marginBottom: spacing[4],
  },
  roleTab: {
    padding: `${spacing[2.5]}px ${spacing[4]}px`,
    background: 'transparent',
    border: `1px solid ${brand.cyan}22`,
    borderRadius: radius.md,
    color: semantic.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    cursor: 'pointer',
    transition: transitions.fast,
  },
  roleTabActive: {
    background: `linear-gradient(135deg, ${brand.cyan}22, ${brand.purple}15)`,
    borderColor: brand.cyan,
    color: brand.cyan,
  },
  childCard: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
    padding: spacing[4],
    background: 'rgba(0,0,0,0.3)',
    borderRadius: radius.lg,
    border: `1px solid ${brand.cyan}15`,
    transition: transitions.smooth,
  },
  progressRing: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: `conic-gradient(${brand.cyan} var(--progress), rgba(255,255,255,0.1) 0)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// INSTRUCTION FLOW & PRACTICE TRIAL STYLES (Issue #43)
// Onboarding instructions and practice mode UI
// ─────────────────────────────────────────────────────────────────────────────
export const instructionFlow: StyleRecord = {
  instructionOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(5,6,13,0.92)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  instructionCard: {
    maxWidth: 600,
    padding: spacing[8],
    background: gradients.card,
    borderRadius: radius['2xl'],
    border: `1px solid ${brand.cyan}33`,
    textAlign: 'center',
    boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px ${brand.cyan}15`,
  },
  stepIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: spacing[2],
    marginBottom: spacing[6],
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    transition: transitions.fast,
  },
  stepDotActive: {
    background: brand.cyan,
    boxShadow: `0 0 10px ${brand.cyan}`,
  },
  stepDotComplete: {
    background: brand.success,
  },
  instructionIcon: {
    width: 80,
    height: 80,
    margin: '0 auto',
    marginBottom: spacing[4],
    borderRadius: radius.xl,
    background: `linear-gradient(135deg, ${brand.cyan}22, ${brand.purple}15)`,
    border: `2px solid ${brand.cyan}44`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
  },
  practiceLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[2]}px ${spacing[4]}px`,
    background: `${brand.warning}20`,
    borderRadius: radius.full,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: brand.warning,
    marginBottom: spacing[4],
  },
  actionButtons: {
    display: 'flex',
    gap: spacing[3],
    justifyContent: 'center',
    marginTop: spacing[6],
  },
  skipButton: {
    padding: `${spacing[3]}px ${spacing[5]}px`,
    background: 'transparent',
    border: `1px solid rgba(255,255,255,0.2)`,
    borderRadius: radius.lg,
    color: semantic.text.secondary,
    fontSize: typography.size.sm,
    cursor: 'pointer',
  },
  continueButton: {
    padding: `${spacing[3]}px ${spacing[6]}px`,
    background: gradients.primary,
    border: 'none',
    borderRadius: radius.lg,
    color: brand.ink,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    cursor: 'pointer',
    boxShadow: shadows.glow.cyan,
  },
};
