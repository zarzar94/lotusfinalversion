import { memo, useState, useCallback, useMemo } from 'react';
import { useVisitorMode, VISITOR_MODES, VisitorMode } from '../context/VisitorModeContext';
import { useLanguage } from '../context/LanguageContext';
import { brandCyan, brandPurple, brandPink, colors, radius, spacing, typography, transitions } from './styles';

// ═══════════════════════════════════════════════════════════════════════════
// MODE SWITCHER COMPONENT
// A compact, accessible mode switcher for School/Parent/Clinician visitors
// ═══════════════════════════════════════════════════════════════════════════

const ModeSwitcher = memo(function ModeSwitcher() {
  const { mode, setMode, config } = useVisitorMode();
  const { isArabic } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const modes = useMemo(() => Object.values(VISITOR_MODES), []);

  const handleModeSelect = useCallback((newMode: VisitorMode) => {
    setMode(newMode);
    setIsExpanded(false);
  }, [setMode]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const css = useMemo(() => `
    .mode-switcher-dropdown {
      animation: modeDropdownSlide 0.2s ease-out;
    }
    @keyframes modeDropdownSlide {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .mode-option:hover {
      background: rgba(255,255,255,0.08) !important;
    }
    .mode-option:focus-visible {
      outline: 2px solid ${brandCyan};
      outline-offset: 2px;
    }
  `, []);

  return (
    <div style={{ position: 'relative' }}>
      <style>{css}</style>

      {/* Current Mode Button */}
      <button
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
        aria-haspopup="listbox"
        aria-label={isArabic ? 'اختر وضع الزيارة' : 'Select visitor mode'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          padding: `${spacing[1.5]}px ${spacing[3]}px`,
          background: `${config.color}15`,
          border: `1px solid ${config.color}40`,
          borderRadius: radius.lg,
          cursor: 'pointer',
          transition: transitions.fast,
        }}
      >
        <span style={{ fontSize: 16 }}>{config.icon}</span>
        <span style={{
          fontSize: typography.size.xs,
          fontWeight: typography.weight.bold,
          color: config.color,
        }}>
          {isArabic ? config.labelAr : config.label}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke={config.color}
          strokeWidth="2"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: transitions.fast,
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {isExpanded && (
        <div
          className="mode-switcher-dropdown"
          role="listbox"
          aria-label={isArabic ? 'أوضاع الزيارة' : 'Visitor modes'}
          style={{
            position: 'absolute',
            top: '100%',
            right: isArabic ? 0 : 'auto',
            left: isArabic ? 'auto' : 0,
            marginTop: spacing[1],
            background: colors.surface.overlay,
            border: `1px solid ${colors.border.emphasis}`,
            borderRadius: radius.lg,
            padding: spacing[1],
            minWidth: 220,
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            zIndex: 200,
          }}
        >
          {modes.map((modeConfig) => {
            const isActive = mode === modeConfig.id;
            return (
              <button
                key={modeConfig.id}
                className="mode-option"
                role="option"
                aria-selected={isActive}
                onClick={() => handleModeSelect(modeConfig.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[3],
                  padding: `${spacing[2.5]}px ${spacing[3]}px`,
                  background: isActive ? `${modeConfig.color}15` : 'transparent',
                  border: 'none',
                  borderRadius: radius.md,
                  cursor: 'pointer',
                  transition: transitions.fast,
                  textAlign: isArabic ? 'right' : 'left',
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.md,
                  background: `${modeConfig.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}>
                  {modeConfig.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.bold,
                    color: isActive ? modeConfig.color : colors.text.primary,
                  }}>
                    {isArabic ? modeConfig.labelAr : modeConfig.label}
                  </div>
                  <div style={{
                    fontSize: typography.size.xs,
                    color: colors.text.muted,
                    marginTop: 2,
                  }}>
                    {isArabic ? modeConfig.descriptionAr : modeConfig.description}
                  </div>
                </div>
                {isActive && (
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: modeConfig.color,
                    flexShrink: 0,
                  }} />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Click outside to close */}
      {isExpanded && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 199,
          }}
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
});

export default ModeSwitcher;
