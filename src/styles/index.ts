/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - DESIGN SYSTEM
 * Unified exports for the complete design system
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Design tokens
export * from './tokens';

// Animations
export * from './animations';

// Component styles
export * from './components';

// Style hooks
export * from './hooks';

// Re-export commonly used tokens with shorter names for convenience
export {
  brand as brandColors,
  audio as audioColors,
  semantic as semanticColors,
  gradients,
  shadows,
  spacing,
  radius,
  typography,
  transitions,
  breakpoints,
  media,
  zIndex,
  durations,
} from './tokens';

// Legacy compatibility exports
// These match the original styles.ts exports for backwards compatibility
export { brand } from './tokens';
export const brandCyan = '#8FD3CC';
export const brandPurple = '#AF84BA';
export const brandPurpleDark = '#774E87';
export const brandPink = '#B01270';
export const brandInk = '#05060d';
export const brandPanel = '#0b0f1c';

// Colors object (legacy compatibility)
export const colors = {
  success: '#22c55e',
  successLight: 'rgba(34, 197, 94, 0.12)',
  warning: '#f59e0b',
  warningLight: 'rgba(245, 158, 11, 0.12)',
  error: '#ef4444',
  errorLight: 'rgba(239, 68, 68, 0.12)',
  info: '#3b82f6',
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
    base: '#05060d',
    elevated: '#0b0f1c',
    overlay: 'rgba(11, 15, 28, 0.96)',
    card: 'rgba(11, 15, 28, 0.85)',
    input: '#0f1629',
  },
};

// Re-export labTech for legacy compatibility
export { hud as labTechStyles } from './components';
export { layout, text, buttons, forms, cards, badges, hud, audioViz, dataPanel, modal, progress, tooltip } from './components';

// Module-specific styles (Issues #37-43)
export {
  moduleMetrics,      // #37 - Session storage
  attentionModule,    // #38 - CPT/odd-one-out
  binauralModule,     // #39 - Dichotic listening
  snrModule,          // #40 - Speech-in-noise
  analytics,          // #41 - Longitudinal charts
  dashboardExport,    // #42 - Role dashboards
  instructionFlow,    // #43 - Practice trials
} from './components';

// Combine all styles for legacy 'styles' object
import { layout, text, buttons, forms, cards, badges, hud, modal, progress } from './components';
import type { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
  // Layout
  page: layout.page,
  container: layout.container,
  section: layout.section,
  sectionCard: layout.sectionCard,

  // Typography
  title: text.title,
  h2: text.h2,
  h3: text.h3,
  lead: text.lead,
  bodyText: text.body,
  muted: text.muted,

  // Headers
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    background: 'rgba(5,6,13,0.72)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.10)',
  },

  // Section headers
  sectionHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  sectionHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  // Buttons
  primaryBtn: buttons.primary,
  ghostBtn: buttons.ghost,
  disabledBtn: buttons.disabled,
  dangerBtn: buttons.danger,

  // Badges
  comingSoonBadge: badges.comingSoon,
  chip: badges.chip,

  // Forms
  input: forms.input,
  textarea: forms.textarea,
  formField: forms.field,
  form: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  },

  // Navigation
  navList: { listStyle: 'none', padding: 0, margin: 0 },
  navLink: {
    color: '#f7f8fb',
    textDecoration: 'none',
    fontWeight: 800,
    fontSize: 13,
    padding: '8px 10px',
    borderRadius: 10,
    display: 'inline-block',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.06)',
    transition: '250ms ease',
  },
  burger: {
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'rgba(255,255,255,0.06)',
    color: '#f7f8fb',
    padding: '8px 10px',
    borderRadius: 10,
    cursor: 'pointer',
    transition: '150ms ease',
  },

  // Grid layouts
  slideGrid: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
  },
  checklistGrid: {
    display: 'grid',
    gap: 10,
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    marginTop: 12,
  },
  gameGrid: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  },

  // Slides
  slideItem: {
    borderRadius: 14,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'linear-gradient(135deg, rgba(175,132,186,0.08), rgba(176,18,112,0.06))',
    cursor: 'pointer',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.25)',
    transition: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  slideThumbImg: {
    width: '100%',
    display: 'block',
    aspectRatio: '16/9',
    objectFit: 'cover',
    background: '#0f1629',
  },
  slideItemMeta: {
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },

  // Checklist
  checkItem: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    background: '#0f1629',
    borderRadius: 14,
    padding: 10,
    border: '1px solid rgba(255,255,255,0.06)',
    transition: '150ms ease',
  },
  checkbox: { width: 18, height: 18 },

  // Game cards
  gameCard: {
    borderRadius: 18,
    padding: 14,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(15,22,41,0.9)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    transition: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  gameCardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  // Modal
  modalBackdrop: modal.backdrop,
  modal: modal.container,

  // Tables
  tableWrap: {
    overflowX: 'auto',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(15,22,41,0.55)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 720,
    fontSize: 13,
  },
  th: {
    textAlign: 'right',
    fontWeight: 900,
    fontSize: 13,
    padding: 12,
    borderBottom: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(175,132,186,0.10)',
  },
  td: {
    padding: 12,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    verticalAlign: 'top',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 1.65,
  },

  // FAB
  fab: {
    position: 'fixed',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 999,
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, #B01270, #8FD3CC)',
    color: '#05060d',
    fontSize: 22,
    textDecoration: 'none',
    boxShadow: '0 12px 36px rgba(176, 18, 112, 0.24)',
    border: '1px solid rgba(255,255,255,0.10)',
    transition: '500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
};
