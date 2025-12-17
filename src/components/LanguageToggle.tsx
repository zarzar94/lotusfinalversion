import { useLanguage } from '../context/LanguageContext';
import { brandCyan, brandPurple, typography, spacing, radius, transitions, gradients, colors } from './styles';

interface LanguageToggleProps {
  compact?: boolean;
}

export default function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { language, toggleLanguage, t } = useLanguage();

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
        border: '1px solid rgba(143,211,204,0.2)',
        borderRadius: compact ? radius.sm : radius.md,
        cursor: 'pointer',
        transition: transitions.normal,
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(143,211,204,0.12)';
        e.currentTarget.style.borderColor = 'rgba(143,211,204,0.35)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.borderColor = 'rgba(143,211,204,0.2)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
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
}
