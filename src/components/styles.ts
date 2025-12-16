import type { CSSProperties } from 'react';

/**
 * Brand palette extracted from the provided AIT_LOGO + posters (purple / teal / magenta).
 * Feel free to tweak in one place and the entire UI will follow.
 */
export const brandPurple = '#AF84BA';          // Primary (logo lavender)
export const brandPurpleDark = '#774E87';      // Deep purple (slides)
export const brandCyan = '#8FD3CC';            // Teal accent (logo)
export const brandPink = '#B01270';            // Magenta accent (slides)
export const brandInk = '#05060d';             // Background
export const brandPanel = '#0b0f1c';           // Surface

export const styles: Record<string, CSSProperties> = {
  page: {
    background: `radial-gradient(1200px 600px at 20% 10%, rgba(175,132,186,0.18), transparent 55%),
                 radial-gradient(900px 450px at 80% 0%, rgba(143,211,204,0.14), transparent 55%),
                 radial-gradient(900px 600px at 60% 90%, rgba(176,18,112,0.10), transparent 55%),
                 ${brandInk}`,
    color: '#f7f8fb',
    minHeight: '100vh',
    fontFamily: 'Cairo, system-ui, -apple-system, Segoe UI, sans-serif',
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
    padding: '14px 20px',
    background: 'rgba(5,6,13,0.72)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.10)',
  },
  container: {
    maxWidth: 1180,
    margin: '0 auto',
    padding: '24px 16px 90px',
    position: 'relative',
    zIndex: 1,
  },
  section: {
    padding: '30px 22px',
    borderRadius: 18,
    border: '1px solid rgba(255,255,255,0.10)',
    background: `linear-gradient(135deg, rgba(175,132,186,0.12), rgba(143,211,204,0.07))`,
    marginBottom: 20,
    boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
  },
  sectionCard: {
    scrollMarginTop: 92,
    padding: '24px 20px',
    borderRadius: 18,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(11,15,28,0.85)',
    backdropFilter: 'blur(6px)',
    marginBottom: 20,
  },
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
  title: {
    margin: 0,
    fontSize: 30,
    lineHeight: 1.15,
    letterSpacing: 0.2,
  },
  lead: {
    margin: 0,
    opacity: 0.9,
    lineHeight: 1.6,
  },
  h2: { margin: '0 0 6px', fontSize: 22 },
  h3: { margin: '0 0 6px', fontSize: 18 },
  muted: { margin: 0, opacity: 0.75, fontSize: 14, lineHeight: 1.6 },
  bodyText: { margin: 0, opacity: 0.88, lineHeight: 1.7 },

  // Navigation
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navLink: {
    color: '#f7f8fb',
    textDecoration: 'none',
    fontWeight: 800,
    padding: '8px 10px',
    borderRadius: 12,
    display: 'inline-block',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  burger: {
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(255,255,255,0.06)',
    color: '#f7f8fb',
    padding: '7px 10px',
    borderRadius: 12,
    cursor: 'pointer',
  },

  // Buttons
  primaryBtn: {
    border: 'none',
    background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})`,
    color: brandInk,
    padding: '11px 14px',
    borderRadius: 14,
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 12px 36px rgba(143,211,204,0.24)',
  },
  ghostBtn: {
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'rgba(255,255,255,0.02)',
    color: '#f7f8fb',
    padding: '10px 12px',
    borderRadius: 14,
    fontWeight: 800,
    cursor: 'pointer',
  },
  disabledBtn: {
    border: 'none',
    background: 'rgba(255,255,255,0.10)',
    color: 'rgba(255,255,255,0.55)',
    padding: '11px 14px',
    borderRadius: 14,
    fontWeight: 900,
    cursor: 'not-allowed',
  },
  dangerBtn: {
    border: '1px solid rgba(239,68,68,0.25)',
    background: 'rgba(239,68,68,0.14)',
    color: '#fecaca',
    padding: '10px 12px',
    borderRadius: 14,
    fontWeight: 900,
    cursor: 'pointer',
  },
  comingSoonBadge: {
    background: 'rgba(245, 158, 11, 0.2)',
    color: '#f59e0b',
    padding: '4px 10px',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 800,
  },
  chip: {
    background: 'rgba(175,132,186,0.14)',
    border: '1px solid rgba(175,132,186,0.25)',
    color: '#f7f8fb',
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  },

  // Form controls
  input: {
    background: '#0f1629',
    color: '#f7f8fb',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: '10px 12px',
    minWidth: 200,
  },
  textarea: {
    background: '#0f1629',
    color: '#f7f8fb',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: '10px 12px',
    resize: 'vertical',
  },

  // Slides
  slideGrid: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  },
  slideItem: {
    borderRadius: 14,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.10)',
    background: `linear-gradient(135deg, rgba(175,132,186,0.08), rgba(176,18,112,0.06))`,
    cursor: 'pointer',
    boxShadow: '0 18px 44px rgba(0,0,0,0.22)',
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
  checklistGrid: {
    display: 'grid',
    gap: 10,
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    marginTop: 12,
  },
  checkItem: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    background: '#0f1629',
    borderRadius: 14,
    padding: 10,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  checkbox: { width: 18, height: 18 },

  // Games
  gameGrid: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  },
  gameCard: {
    borderRadius: 16,
    padding: 14,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(15,22,41,0.9)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  gameCardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  // Forms
  form: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },

  // Floating action button
  fab: {
    position: 'fixed',
    right: 18,
    bottom: 18,
    width: 52,
    height: 52,
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    background: `linear-gradient(135deg, ${brandPink}, ${brandCyan})`,
    color: brandInk,
    fontSize: 22,
    textDecoration: 'none',
    boxShadow: '0 12px 36px rgba(176,18,112,0.28)',
    border: '1px solid rgba(255,255,255,0.10)',
  },

  // Modal
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.70)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 20,
    padding: 12,
  },
  modal: {
    background: 'rgba(11,15,28,0.96)',
    borderRadius: 16,
    padding: 16,
    border: '1px solid rgba(255,255,255,0.14)',
    maxWidth: 980,
    width: '100%',
    maxHeight: '86vh',
    overflow: 'auto',
  },

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
  },
  th: {
    textAlign: 'right',
    fontWeight: 900,
    padding: '12px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(175,132,186,0.10)',
  },
  td: {
    padding: '12px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    verticalAlign: 'top',
    opacity: 0.9,
    lineHeight: 1.6,
  },
};
