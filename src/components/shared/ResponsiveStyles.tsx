/**
 * ResponsiveStyles - Global responsive CSS utilities
 * Provides responsive grid, typography, and spacing adjustments
 */

import { memo } from 'react';
import { breakpoints, spacing, typography } from '../styles';

// Responsive CSS that can be injected into any page
export const responsiveCSS = `
  /* ═══════════════════════════════════════════════════════════════════════════
     RESPONSIVE GRID UTILITIES
     ═══════════════════════════════════════════════════════════════════════════ */

  /* Dashboard stats grid */
  .stats-grid {
    display: grid;
    gap: ${spacing[4]}px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  @media (max-width: ${breakpoints.sm}px) {
    .stats-grid {
      grid-template-columns: 1fr;
      gap: ${spacing[3]}px;
    }
  }

  @media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md}px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Charts/Panels grid */
  .panels-grid {
    display: grid;
    gap: ${spacing[6]}px;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }

  @media (max-width: ${breakpoints.md}px) {
    .panels-grid {
      grid-template-columns: 1fr;
      gap: ${spacing[4]}px;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RESPONSIVE TYPOGRAPHY
     ═══════════════════════════════════════════════════════════════════════════ */

  .page-title {
    font-size: ${typography.size['3xl']}px;
    font-weight: ${typography.weight.black};
    line-height: ${typography.lineHeight.tight};
  }

  @media (max-width: ${breakpoints.sm}px) {
    .page-title {
      font-size: ${typography.size['2xl']}px;
    }
  }

  .section-title {
    font-size: ${typography.size.xl}px;
    font-weight: ${typography.weight.bold};
  }

  @media (max-width: ${breakpoints.sm}px) {
    .section-title {
      font-size: ${typography.size.lg}px;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RESPONSIVE SPACING & PADDING
     ═══════════════════════════════════════════════════════════════════════════ */

  .page-container {
    padding: ${spacing[10]}px ${spacing[4]}px;
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (max-width: ${breakpoints.sm}px) {
    .page-container {
      padding: ${spacing[6]}px ${spacing[3]}px;
    }
  }

  @media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md}px) {
    .page-container {
      padding: ${spacing[8]}px ${spacing[4]}px;
    }
  }

  /* Card padding adjustments */
  .card {
    padding: ${spacing[5]}px;
  }

  @media (max-width: ${breakpoints.sm}px) {
    .card {
      padding: ${spacing[4]}px;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RESPONSIVE TABLE UTILITIES
     ═══════════════════════════════════════════════════════════════════════════ */

  .responsive-table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  @media (max-width: ${breakpoints.md}px) {
    .responsive-table {
      min-width: 600px;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RESPONSIVE FLEX UTILITIES
     ═══════════════════════════════════════════════════════════════════════════ */

  .flex-responsive {
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing[4]}px;
  }

  @media (max-width: ${breakpoints.sm}px) {
    .flex-responsive {
      flex-direction: column;
      gap: ${spacing[3]}px;
    }
  }

  .header-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[4]}px;
  }

  @media (max-width: ${breakpoints.sm}px) {
    .header-flex {
      flex-direction: column;
      align-items: flex-start;
      gap: ${spacing[3]}px;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     HIDE/SHOW UTILITIES
     ═══════════════════════════════════════════════════════════════════════════ */

  .hide-on-phone {
    display: block;
  }

  .show-on-phone {
    display: none;
  }

  @media (max-width: ${breakpoints.sm}px) {
    .hide-on-phone {
      display: none !important;
    }
    .show-on-phone {
      display: block !important;
    }
  }

  .hide-on-tablet {
    display: block;
  }

  @media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.lg}px) {
    .hide-on-tablet {
      display: none !important;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     TOUCH-FRIENDLY UTILITIES
     ═══════════════════════════════════════════════════════════════════════════ */

  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }

  @media (hover: none) {
    .hover-effect:hover {
      transform: none;
    }
  }
`;

/**
 * ResponsiveStyles component - Injects global responsive CSS
 * Use this component once at the app or page level
 */
function ResponsiveStyles() {
  return <style>{responsiveCSS}</style>;
}

export default memo(ResponsiveStyles);
