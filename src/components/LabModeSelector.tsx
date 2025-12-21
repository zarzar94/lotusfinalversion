/**
 * LabModeSelector - Prominent visitor mode selector with lab-tech styling
 * Routes users (Parents, Schools, Clinicians) to their appropriate journey
 */

import { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVisitorMode, VISITOR_MODES, type VisitorMode } from '../context/VisitorModeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  brandCyan,
  brandPurple,
  brandPink,
  colors,
  typography,
  spacing,
  radius,
  shadows,
} from './styles';

// Mode configurations with enhanced lab-tech styling
const MODE_CONFIGS: Record<VisitorMode, {
  icon: string;
  color: string;
  gradient: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  ctaEn: string;
  ctaAr: string;
  metrics: { labelEn: string; labelAr: string; value: string }[];
}> = {
  parent: {
    icon: '👨‍👩‍👧',
    color: brandPurple,
    gradient: `linear-gradient(135deg, ${brandPurple}25, ${brandPurple}10)`,
    titleEn: 'Parents & Families',
    titleAr: 'auto.LabModeSelector.k8',
    descEn: 'Check your child\'s auditory processing and get personalized guidance',
    descAr: 'auto.LabModeSelector.k9',
    ctaEn: 'Start Screening',
    ctaAr: 'auto.LabModeSelector.k10',
    metrics: [
      { labelEn: 'Assessment', labelAr: 'auto.LabModeSelector.k11', value: '5 min' },
      { labelEn: 'Report', labelAr: 'auto.LabModeSelector.k12', value: 'PDF' },
    ],
  },
  school: {
    icon: '🏫',
    color: '#f59e0b',
    gradient: `linear-gradient(135deg, #f59e0b25, #f59e0b10)`,
    titleEn: 'Schools & Universities',
    titleAr: 'auto.LabModeSelector.k13',
    descEn: 'Run classroom screening demos and build student support plans',
    descAr: 'auto.LabModeSelector.k14',
    ctaEn: 'Request Demo',
    ctaAr: 'auto.LabModeSelector.k15',
    metrics: [
      { labelEn: 'Partners', labelAr: 'auto.LabModeSelector.k16', value: '25+' },
      { labelEn: 'Cohort', labelAr: 'auto.LabModeSelector.k17', value: 'Batch' },
    ],
  },
  clinician: {
    icon: '🩺',
    color: brandPink,
    gradient: `linear-gradient(135deg, ${brandPink}25, ${brandPink}10)`,
    titleEn: 'Clinicians & Practitioners',
    titleAr: 'auto.LabModeSelector.k18',
    descEn: 'Evidence-based protocol, dashboards, and clinical reporting',
    descAr: 'auto.LabModeSelector.k19',
    ctaEn: 'View Protocol',
    ctaAr: 'auto.LabModeSelector.k20',
    metrics: [
      { labelEn: 'Protocol', labelAr: 'auto.LabModeSelector.k21', value: '20 sessions' },
      { labelEn: 'Export', labelAr: 'auto.LabModeSelector.k22', value: 'Clinical' },
    ],
  },
};

const ModeCard = memo(({
  mode,
  isActive,
  isArabic,
  onSelect,
  onNavigate,
}: {
  mode: VisitorMode;
  isActive: boolean;
  isArabic: boolean;
  onSelect: () => void;
  onNavigate: () => void;
}) => {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const config = MODE_CONFIGS[mode];

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      aria-pressed={isActive}
      aria-label={isArabic ? t(config.titleAr, config.titleEn) : config.titleEn}
      style={{
        position: 'relative',
        padding: spacing[5],
        background: isActive
          ? config.gradient
          : isHovered
            ? `${colors.surface.card}`
            : 'rgba(13,17,23,0.6)',
        border: `1px solid ${isActive ? config.color : isHovered ? `${config.color}50` : colors.border.subtle}`,
        borderRadius: radius.xl,
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: isActive ? 'scale(1.02)' : isHovered ? 'translateY(-4px)' : 'none',
        boxShadow: isActive
          ? `0 8px 32px ${config.color}30, 0 0 0 1px ${config.color}40, inset 0 1px 0 ${config.color}20`
          : isHovered
            ? `0 12px 24px rgba(0,0,0,0.3)`
            : 'none',
        overflow: 'hidden',
        textAlign: isArabic ? 'right' : 'left',
      }}
    >
      {/* Scan line effect on active */}
      {isActive && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
            animation: 'scanLineHorizontal 2s linear infinite',
          }}
        />
      )}

      {/* Status indicator */}
      <div
        style={{
          position: 'absolute',
          top: spacing[3],
          [isArabic ? 'left' : 'right']: spacing[3],
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: isActive ? '#22c55e' : 'rgba(255,255,255,0.3)',
            boxShadow: isActive ? '0 0 8px #22c55e' : 'none',
            animation: isActive ? 'statusPulse 2s ease-in-out infinite' : 'none',
          }}
        />
        <span
          style={{
            fontSize: 9,
            fontFamily: 'monospace',
            fontWeight: 700,
            color: isActive ? config.color : 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {isActive ? (t('auto.LabModeSelector.k1', "ACTIVE")) : (t('auto.LabModeSelector.k2', "SELECT"))}
        </span>
      </div>

      {/* Icon */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: radius.lg,
          background: isActive
            ? `linear-gradient(135deg, ${config.color}35, ${config.color}15)`
            : `${config.color}15`,
          border: `1px solid ${isActive ? `${config.color}50` : 'transparent'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          marginBottom: spacing[3],
          transition: 'all 0.3s ease',
          boxShadow: isActive ? `0 4px 16px ${config.color}40` : 'none',
        }}
      >
        {config.icon}
      </div>

      {/* Title */}
      <h3
        style={{
          margin: 0,
          fontSize: typography.size.lg,
          fontWeight: typography.weight.bold,
          color: isActive ? colors.text.primary : colors.text.secondary,
          marginBottom: spacing[2],
          transition: 'color 0.3s ease',
        }}
      >
        {isArabic ? t(config.titleAr, config.titleEn) : config.titleEn}
      </h3>

      {/* Description */}
      <p
        style={{
          margin: 0,
          fontSize: typography.size.sm,
          color: colors.text.muted,
          lineHeight: typography.lineHeight.relaxed,
          marginBottom: spacing[4],
          minHeight: 44,
        }}
      >
        {isArabic ? t(config.descAr, config.descEn) : config.descEn}
      </p>

      {/* Metrics row */}
      <div
        style={{
          display: 'flex',
          gap: spacing[3],
          marginBottom: spacing[4],
          flexWrap: 'wrap',
        }}
      >
        {config.metrics.map((metric, idx) => (
          <div
            key={idx}
            style={{
              padding: `${spacing[1]}px ${spacing[2]}px`,
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${isActive ? `${config.color}30` : 'rgba(255,255,255,0.1)'}`,
              borderRadius: radius.md,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: colors.text.muted,
                fontFamily: 'monospace',
              }}
            >
              {isArabic ? t(metric.labelAr, metric.labelEn) : metric.labelEn}:
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: isActive ? config.color : colors.text.secondary,
                fontFamily: 'monospace',
              }}
            >
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNavigate();
        }}
        style={{
          width: '100%',
          padding: `${spacing[2.5]}px ${spacing[4]}px`,
          background: isActive
            ? `linear-gradient(135deg, ${config.color}, ${config.color}cc)`
            : 'transparent',
          border: `1px solid ${isActive ? config.color : `${config.color}50`}`,
          borderRadius: radius.lg,
          color: isActive ? '#fff' : config.color,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.semibold,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {isArabic ? t(config.ctaAr, config.ctaEn) : config.ctaEn}
        <span style={{ fontSize: 14 }}>{isArabic ? '←' : '→'}</span>
      </button>
    </div>
  );
});
ModeCard.displayName = 'ModeCard';

const LabModeSelector = memo(function LabModeSelector() {
  const navigate = useNavigate();
  const { mode, setMode } = useVisitorMode();
  const { isArabic, t } = useLanguage();

  const handleModeSelect = useCallback((selectedMode: VisitorMode) => {
    setMode(selectedMode);
  }, [setMode]);

  const handleNavigate = useCallback((selectedMode: VisitorMode) => {
    setMode(selectedMode);
    const config = VISITOR_MODES[selectedMode];
    navigate(config.ctaPath);
  }, [setMode, navigate]);

  const css = `
    @keyframes scanLineHorizontal {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes statusPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.2); }
    }
    @keyframes selectorGlow {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.7; }
    }
    @media (max-width: 768px) {
      .mode-selector-grid {
        grid-template-columns: 1fr !important;
        gap: ${spacing[4]}px !important;
      }
      .mode-selector-section {
        padding: ${spacing[6]}px ${spacing[3]}px !important;
      }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      .mode-selector-grid {
        grid-template-columns: repeat(3, 1fr) !important;
        gap: ${spacing[4]}px !important;
      }
    }
  `;

  return (
    <section
      className="mode-selector-section"
      aria-label={t('auto.LabModeSelector.k3', "Choose Your Path")}
      style={{
        position: 'relative',
        padding: `${spacing[10]}px ${spacing[4]}px`,
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <style>{css}</style>

      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, ${brandCyan}08 0%, transparent 60%)`,
          pointerEvents: 'none',
          animation: 'selectorGlow 4s ease-in-out infinite',
        }}
      />

      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: spacing[8],
          position: 'relative',
        }}
      >
        {/* Lab badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[1.5]}px ${spacing[4]}px`,
            background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
            border: `1px solid ${brandCyan}25`,
            borderRadius: radius.full,
            marginBottom: spacing[4],
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 8px #22c55e',
            }}
          />
          <span
            style={{
              fontSize: typography.size.xs,
              fontWeight: typography.weight.bold,
              color: brandCyan,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              fontFamily: 'monospace',
            }}
          >
            {t('auto.LabModeSelector.k4', "MODE SELECT")}
          </span>
        </div>

        <h2
          style={{
            fontSize: typography.size['3xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
            marginBottom: spacing[3],
            background: `linear-gradient(135deg, ${colors.text.primary}, ${brandCyan})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {t('auto.LabModeSelector.k5', "Choose Your Path")}
        </h2>

        <p
          style={{
            fontSize: typography.size.lg,
            color: colors.text.secondary,
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          {t('auto.LabModeSelector.k6', "We personalize your experience based on your needs. Select the path that fits you.")}
        </p>
      </div>

      {/* Mode cards grid */}
      <div
        className="mode-selector-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: spacing[5],
          position: 'relative',
        }}
      >
        {(['parent', 'school', 'clinician'] as VisitorMode[]).map((modeType) => (
          <ModeCard
            key={modeType}
            mode={modeType}
            isActive={mode === modeType}
            isArabic={isArabic}
            onSelect={() => handleModeSelect(modeType)}
            onNavigate={() => handleNavigate(modeType)}
          />
        ))}
      </div>

      {/* Bottom hint */}
      <div
        style={{
          marginTop: spacing[6],
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: typography.size.sm,
            color: colors.text.muted,
            fontFamily: 'monospace',
          }}
        >
          {t('auto.LabModeSelector.k7', "💡 You can change your path anytime from settings")}
        </p>
      </div>
    </section>
  );
});

export default LabModeSelector;
