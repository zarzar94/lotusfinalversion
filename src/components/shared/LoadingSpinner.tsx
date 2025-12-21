/**
 * LoadingSpinner - Animated loading indicator
 */

import { memo, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPurple, colors, typography, spacing } from '../styles';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  messageAr?: string;
}

function LoadingSpinner({ size = 'md', message, messageAr }: LoadingSpinnerProps) {
  const { isArabic, t } = useLanguage();
  const dims = useMemo(() => ({ sm: { s: 24, b: 3 }, md: { s: 40, b: 4 }, lg: { s: 56, b: 5 } }), []);
  const { s, b } = dims[size];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: spacing[8], gap: spacing[4] }}>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <div style={{
        width: s, height: s, borderRadius: '50%',
        border: `${b}px solid ${colors.border.default}`,
        borderTopColor: brandCyan, borderRightColor: brandPurple,
        animation: 'spin 1s linear infinite',
      }} />
      {message && (
        <p style={{ margin: 0, fontSize: typography.size.sm, color: colors.text.secondary }}>
          {isArabic ? messageAr || message : message}
        </p>
      )}
    </div>
  );
}

export default memo(LoadingSpinner);
