import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useVisitorMode } from '../context/VisitorModeContext';
import { useLanguage } from '../context/LanguageContext';
import { brandCyan, brandPurple, brandPink, colors, radius, spacing, typography, transitions, shadows } from './styles';

// ═══════════════════════════════════════════════════════════════════════════
// STICKY SMART CTA
// An adaptive floating CTA that changes based on visitor mode
// ═══════════════════════════════════════════════════════════════════════════

const StickySmartCTA = memo(function StickySmartCTA() {
  const { config, isSchool, isParent, isClinician } = useVisitorMode();
  const { isArabic, t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Show CTA after scrolling past hero section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * 0.5;
      setIsVisible(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  // Get icon based on mode
  const ctaIcon = useMemo(() => {
    if (isSchool) return '🏫';
    if (isParent) return '📋';
    if (isClinician) return '🩺';
    return '✨';
  }, [isSchool, isParent, isClinician]);

  // Get secondary text
  const secondaryText = useMemo(() => {
    if (isSchool) return {
      en: 'Free classroom demo available',
      ar: 'auto.StickySmartCTA.k4',
    };
    if (isParent) return {
      en: 'Quick 15-min screening',
      ar: 'auto.StickySmartCTA.k5',
    };
    if (isClinician) return {
      en: 'Protocol documentation included',
      ar: 'auto.StickySmartCTA.k6',
    };
    return { en: '', ar: '' };
  }, [isSchool, isParent, isClinician]);

  const css = useMemo(() => `
    .sticky-cta-container {
      animation: stickyCtaSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes stickyCtaSlideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .sticky-cta-button:hover {
      transform: scale(1.02);
      box-shadow: 0 8px 30px ${config.color}40 !important;
    }
    .sticky-cta-button:active {
      transform: scale(0.98);
    }
    @media (max-width: 640px) {
      .sticky-cta-container {
        left: ${spacing[3]}px !important;
        right: ${spacing[3]}px !important;
        bottom: ${spacing[3]}px !important;
      }
      .sticky-cta-content {
        flex-direction: column !important;
        gap: ${spacing[2]}px !important;
      }
    }
  `, [config.color]);

  if (!isVisible) return null;

  return (
    <>
      <style>{css}</style>
      <div
        className="sticky-cta-container"
        style={{
          position: 'fixed',
          bottom: spacing[5],
          left: isArabic ? spacing[5] : 'auto',
          right: isArabic ? 'auto' : spacing[5],
          zIndex: 90,
          maxWidth: isMinimized ? 56 : 380,
          transition: 'max-width 0.3s ease',
        }}
      >
        {isMinimized ? (
          // Minimized state - just icon
          <button
            onClick={toggleMinimize}
            aria-label={t('auto.StickySmartCTA.k1', "Expand")}
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)`,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              boxShadow: `0 4px 20px ${config.color}50`,
              transition: transitions.bounce,
            }}
          >
            {ctaIcon}
          </button>
        ) : (
          // Expanded state
          <div style={{
            background: colors.surface.overlay,
            border: `1px solid ${config.color}30`,
            borderRadius: radius.xl,
            padding: spacing[3],
            boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px ${config.color}20`,
            backdropFilter: 'blur(12px)',
          }}>
            {/* Close/Minimize button */}
            <button
              onClick={toggleMinimize}
              aria-label={t('auto.StickySmartCTA.k2', "Minimize")}
              style={{
                position: 'absolute',
                top: -8,
                right: isArabic ? 'auto' : -8,
                left: isArabic ? -8 : 'auto',
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: colors.surface.elevated,
                border: `1px solid ${colors.border.default}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: colors.text.muted,
              }}
            >
              ✕
            </button>

            <div className="sticky-cta-content" style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
            }}>
              {/* Icon */}
              <div style={{
                width: 48,
                height: 48,
                borderRadius: radius.lg,
                background: `${config.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                flexShrink: 0,
              }}>
                {ctaIcon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: typography.size.xs,
                  color: config.color,
                  fontWeight: typography.weight.semibold,
                  marginBottom: 2,
                }}>
                  {isArabic ? t(secondaryText.ar, secondaryText.en) : secondaryText.en}
                </div>
                <Link
                  to={config.ctaPath}
                  className="sticky-cta-button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: spacing[2],
                    padding: `${spacing[2]}px ${spacing[4]}px`,
                    background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
                    border: 'none',
                    borderRadius: radius.lg,
                    color: '#fff',
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.bold,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: transitions.bounce,
                    boxShadow: `0 4px 15px ${config.color}30`,
                  }}
                >
                  {isArabic ? t(config.ctaLabelAr, config.ctaLabel) : config.ctaLabel}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d={isArabic ? "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" : "M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"} />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Trust badge */}
            <div style={{
              marginTop: spacing[2],
              paddingTop: spacing[2],
              borderTop: `1px solid ${colors.border.subtle}`,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              fontSize: typography.size.xs,
              color: colors.text.muted,
            }}>
              <span style={{ color: '#22c55e' }}>●</span>
              {t('auto.StickySmartCTA.k3', "Clinician-supervised service")}
            </div>
          </div>
        )}
      </div>
    </>
  );
});

export default StickySmartCTA;
