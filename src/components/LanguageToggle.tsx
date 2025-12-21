import { memo, useCallback, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { brandCyan, brandPink, brandPurple, typography, spacing, radius, transitions, colors } from './styles';

interface LanguageToggleProps {
  compact?: boolean;
}

// Memoized language toggle for performance in Header/Footer
const LanguageToggle = memo(function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { language, toggleLanguage, isArabic, t } = useLanguage();
  const [showFeedback, setShowFeedback] = useState(false);

  const handleToggle = useCallback(() => {
    toggleLanguage();
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 1500);
  }, [toggleLanguage]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = `linear-gradient(135deg, ${brandCyan}18, ${brandPurple}12)`;
    e.currentTarget.style.borderColor = brandCyan;
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = `0 8px 20px ${brandCyan}22`;
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
    e.currentTarget.style.borderColor = `${brandCyan}33`;
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleToggle}
        aria-label={`Switch to ${language === 'ar' ? 'English' : 'Arabic'}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: compact ? spacing[1.5] : spacing[2],
          padding: compact ? `${spacing[1.5]}px ${spacing[3]}px` : `${spacing[2]}px ${spacing[4]}px`,
          fontSize: compact ? typography.size.xs : typography.size.sm,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${brandCyan}33`,
          borderRadius: compact ? radius.md : radius.lg,
          cursor: 'pointer',
          transition: transitions.normal,
          whiteSpace: 'nowrap',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Active indicator dot */}
        <div style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: brandCyan,
          boxShadow: `0 0 6px ${brandCyan}`,
          animation: 'pulse 2s ease-in-out infinite',
        }} />

        {/* Language codes with switch animation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[1],
          fontFamily: 'system-ui, sans-serif',
        }}>
          <span style={{
            color: isArabic ? brandCyan : 'rgba(255,255,255,0.4)',
            fontWeight: isArabic ? 800 : 600,
            transition: 'all 0.3s ease',
          }}>
            AR
          </span>
          <span style={{
            color: 'rgba(255,255,255,0.2)',
            fontSize: 10,
          }}>|</span>
          <span style={{
            color: !isArabic ? brandCyan : 'rgba(255,255,255,0.4)',
            fontWeight: !isArabic ? 800 : 600,
            transition: 'all 0.3s ease',
          }}>
            EN
          </span>
        </div>

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
          style={{ opacity: 0.8 }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </button>

      {/* Language change feedback toast */}
      {showFeedback && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: 8,
          padding: '6px 12px',
          background: 'linear-gradient(135deg, #1a1f2e, #0d1117)',
          border: `1px solid ${brandCyan}44`,
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 700,
          color: brandCyan,
          whiteSpace: 'nowrap',
          zIndex: 1000,
          animation: 'fadeInUp 0.3s ease-out',
          boxShadow: `0 8px 20px rgba(0,0,0,0.4), 0 0 20px ${brandCyan}22`,
        }}>
          {t('auto.LanguageToggle.k1', "Changed to English")}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
});

export default LanguageToggle;
