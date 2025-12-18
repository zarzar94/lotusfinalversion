import { memo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { brandCyan, typography, spacing, radius, transitions, gradients, colors } from './styles';

interface LanguageToggleProps {
  compact?: boolean;
}

// Memoized language toggle for performance in Header/Footer
const LanguageToggle = memo(function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { language, toggleLanguage, t } = useLanguage();

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = `${brandCyan}18`;
    e.currentTarget.style.borderColor = `${brandCyan}55`;
    e.currentTarget.style.transform = 'translateY(-1px)';
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
    e.currentTarget.style.borderColor = `${brandCyan}33`;
    e.currentTarget.style.transform = 'translateY(0)';
  }, []);

  return (
    <button
      onClick={toggleLanguage}
      aria-label={`Switch to ${language === 'ar' ? 'English' : 'Arabic'}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? spacing[1] : spacing[2],
        padding: compact ? `${spacing[1.5]}px ${spacing[2.5]}px` : `${spacing[2]}px ${spacing[3.5]}px`,
        fontSize: compact ? typography.size.xs : typography.size.sm,
        fontWeight: typography.weight.bold,
        color: colors.text.primary,
        background: 'rgba(255,255,255,0.06)',
        border: `1px solid ${brandCyan}33`,
        borderRadius: compact ? radius.sm : radius.md,
        cursor: 'pointer',
        transition: transitions.normal,
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Globe Icon */}
      <svg
        width={compact ? 14 : 16}
        height={compact ? 14 : 16}
        viewBox="0 0 24 24"
        fill="none"
        stroke={brandCyan}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>

      {/* Language Text */}
      <span style={{
        background: gradients.cyanPurple,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {t('language.toggle')}
      </span>
    </button>
  );
});

export default LanguageToggle;
