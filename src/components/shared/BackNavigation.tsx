/**
 * BackNavigation - Reusable back navigation link
 */

import { memo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { colors, typography, spacing, radius, transitions } from '../styles';

interface BackNavigationProps {
  href?: string;
  label?: string;
  labelAr?: string;
}

function BackNavigation({ href = '/', label = 'Back to Home', labelAr = 'العودة للرئيسية' }: BackNavigationProps) {
  const { isArabic } = useLanguage();

  return (
    <a
      href={href}
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
    >
      <span style={{ transform: isArabic ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>←</span>
      {isArabic ? labelAr : label}
    </a>
  );
}

export default memo(BackNavigation);
