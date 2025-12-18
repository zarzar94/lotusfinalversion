/**
 * BackNavigation - Reusable back navigation link
 * Uses react-router Link for proper SPA navigation
 */

import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { colors, typography, spacing, radius, transitions, brandCyan } from '../styles';

interface BackNavigationProps {
  to?: string;
  label?: string;
  // Legacy support for old props
  href?: string;
  labelAr?: string;
}

function BackNavigation({ to, label, href, labelAr }: BackNavigationProps) {
  const { isArabic } = useLanguage();

  // Support both new (to) and legacy (href) props
  const destination = to || href || '/';

  // Use provided label, or fall back to Arabic version if available, or defaults
  const displayLabel = label || (isArabic ? (labelAr || 'العودة للرئيسية') : 'Back to Home');

  return (
    <Link
      to={destination}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing[2],
        padding: `${spacing[2]}px ${spacing[3]}px`,
        marginBottom: spacing[6],
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius.md,
        color: colors.text.secondary,
        textDecoration: 'none',
        fontSize: typography.size.sm,
        fontWeight: typography.weight.semibold,
        transition: transitions.fast,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(143,211,204,0.08)';
        e.currentTarget.style.borderColor = `${brandCyan}40`;
        e.currentTarget.style.color = brandCyan;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.borderColor = colors.border.default;
        e.currentTarget.style.color = colors.text.secondary;
      }}
    >
      <span style={{ transform: isArabic ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>←</span>
      {displayLabel}
    </Link>
  );
}

export default memo(BackNavigation);
