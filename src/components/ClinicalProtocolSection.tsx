/**
 * ClinicalProtocolSection - Trust Kit for clinical credibility
 * Shows protocol overview, safety disclaimers, supervision, and compliance
 */

import { memo, useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useVisitorMode } from '../context/VisitorModeContext';
import {
  brandCyan,
  brandPurple,
  brandPink,
  colors,
  typography,
  spacing,
  radius,
  shadows,
  labTech,
  audioColors,
} from './styles';
import {
  ShieldIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  DocumentIcon,
  UserIcon,
} from './Icons';
import { renderLabIcon } from './icons/index';

// Protocol phases configuration
const PROTOCOL_PHASES = [
  {
    id: 'assessment',
    phase: 1,
    titleEn: 'Initial Assessment',
    titleAr: 'auto.ClinicalProtocolSection.k4',
    durationEn: 'Day 1',
    durationAr: 'auto.ClinicalProtocolSection.k5',
    descEn: 'Comprehensive audiometric testing and baseline measurements',
    descAr: 'auto.ClinicalProtocolSection.k6',
    color: brandCyan,
  },
  {
    id: 'training',
    phase: 2,
    titleEn: 'Active Training',
    titleAr: 'auto.ClinicalProtocolSection.k7',
    durationEn: 'Days 1-10',
    durationAr: 'auto.ClinicalProtocolSection.k8',
    descEn: '20 sessions of modified music listening (2 per day)',
    descAr: 'auto.ClinicalProtocolSection.k9',
    color: brandPurple,
  },
  {
    id: 'midpoint',
    phase: 3,
    titleEn: 'Mid-Program Check',
    titleAr: 'auto.ClinicalProtocolSection.k10',
    durationEn: 'Day 5',
    durationAr: 'auto.ClinicalProtocolSection.k11',
    descEn: 'Progress evaluation and protocol adjustments if needed',
    descAr: 'auto.ClinicalProtocolSection.k12',
    color: colors.warning,
  },
  {
    id: 'completion',
    phase: 4,
    titleEn: 'Post-Assessment',
    titleAr: 'auto.ClinicalProtocolSection.k13',
    durationEn: 'Day 10+',
    durationAr: 'auto.ClinicalProtocolSection.k14',
    descEn: 'Final measurements and comprehensive progress report',
    descAr: 'auto.ClinicalProtocolSection.k15',
    color: colors.success,
  },
];

// Safety & compliance items
const SAFETY_ITEMS = [
  {
    id: 'screening',
    iconType: 'alert',
    titleEn: 'Screening, Not Diagnosis',
    titleAr: 'auto.ClinicalProtocolSection.k16',
    descEn: 'Our assessments are educational screenings. They do not replace clinical diagnosis by licensed professionals.',
    descAr: 'auto.ClinicalProtocolSection.k17',
    color: colors.warning,
  },
  {
    id: 'supervision',
    iconType: 'user',
    titleEn: 'Clinical Supervision',
    titleAr: 'auto.ClinicalProtocolSection.k18',
    descEn: 'All sessions are supervised by certified Bérard AIT practitioners with ongoing professional development.',
    descAr: 'auto.ClinicalProtocolSection.k19',
    color: brandPurple,
  },
  {
    id: 'privacy',
    iconType: 'shield',
    titleEn: 'Data Privacy',
    titleAr: 'auto.ClinicalProtocolSection.k20',
    descEn: 'Your data is encrypted and stored securely. We never share personal information without explicit consent.',
    descAr: 'auto.ClinicalProtocolSection.k21',
    color: brandCyan,
  },
  {
    id: 'consent',
    iconType: 'document',
    titleEn: 'Informed Consent',
    titleAr: 'auto.ClinicalProtocolSection.k22',
    descEn: 'We provide clear documentation of program expectations, potential outcomes, and your rights.',
    descAr: 'auto.ClinicalProtocolSection.k23',
    color: brandPink,
  },
];

// Icon component
const getIcon = (iconType: string, color: string) => {
  const iconProps = { size: 20, color };
  switch (iconType) {
    case 'alert':
      return <AlertCircleIcon {...iconProps} />;
    case 'user':
      return <UserIcon {...iconProps} />;
    case 'shield':
      return <ShieldIcon {...iconProps} />;
    case 'document':
      return <DocumentIcon {...iconProps} />;
    default:
      return <CheckCircleIcon {...iconProps} />;
  }
};

// Protocol Phase Card
const PhaseCard = memo(({
  phase,
  isArabic,
}: {
  phase: typeof PROTOCOL_PHASES[0];
  isArabic: boolean;
}) => {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: spacing[5],
        background: isHovered
          ? `linear-gradient(135deg, ${phase.color}15, ${phase.color}05)`
          : colors.surface.card,
        border: `1px solid ${isHovered ? phase.color : colors.border.subtle}`,
        borderRadius: radius.xl,
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'none',
        boxShadow: isHovered ? `0 8px 24px ${phase.color}20` : 'none',
      }}
    >
      {/* Phase number badge */}
      <div
        style={{
          position: 'absolute',
          top: -12,
          [isArabic ? 'right' : 'left']: spacing[4],
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${phase.color}, ${phase.color}cc)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 800,
          color: '#fff',
          boxShadow: `0 4px 12px ${phase.color}50`,
        }}
      >
        {phase.phase}
      </div>

      {/* Duration tag */}
      <div
        style={{
          display: 'inline-block',
          padding: `${spacing[1]}px ${spacing[2]}px`,
          background: `${phase.color}15`,
          border: `1px solid ${phase.color}30`,
          borderRadius: radius.md,
          marginBottom: spacing[3],
          marginTop: spacing[2],
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: phase.color,
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {isArabic ? t(phase.durationAr, phase.durationEn) : phase.durationEn}
        </span>
      </div>

      {/* Title */}
      <h4
        style={{
          margin: 0,
          fontSize: typography.size.md,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
          marginBottom: spacing[2],
        }}
      >
        {isArabic ? t(phase.titleAr, phase.titleEn) : phase.titleEn}
      </h4>

      {/* Description */}
      <p
        style={{
          margin: 0,
          fontSize: typography.size.sm,
          color: colors.text.muted,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        {isArabic ? t(phase.descAr, phase.descEn) : phase.descEn}
      </p>
    </div>
  );
});
PhaseCard.displayName = 'PhaseCard';

// Safety Item Card
const SafetyCard = memo(({
  item,
  isArabic,
}: {
  item: typeof SAFETY_ITEMS[0];
  isArabic: boolean;
}) => {
  const { t } = useLanguage();

  return (
    <div
      style={{
        display: 'flex',
        gap: spacing[4],
        padding: spacing[4],
        background: 'rgba(13,17,23,0.6)',
        border: `1px solid ${colors.border.subtle}`,
        borderRadius: radius.lg,
        alignItems: 'flex-start',
        flexDirection: isArabic ? 'row-reverse' : 'row',
        textAlign: isArabic ? 'right' : 'left',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: radius.lg,
          background: `${item.color}15`,
          border: `1px solid ${item.color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {getIcon(item.iconType, item.color)}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h5
          style={{
            margin: 0,
            fontSize: typography.size.md,
            fontWeight: typography.weight.semibold,
            color: colors.text.primary,
            marginBottom: spacing[1],
          }}
        >
          {isArabic ? t(item.titleAr, item.titleEn) : item.titleEn}
        </h5>
        <p
          style={{
            margin: 0,
            fontSize: typography.size.sm,
            color: colors.text.muted,
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          {isArabic ? t(item.descAr, item.descEn) : item.descEn}
        </p>
      </div>
    </div>
  );
});
SafetyCard.displayName = 'SafetyCard';

const ClinicalProtocolSection = memo(function ClinicalProtocolSection() {
  const { isArabic, t } = useLanguage();
  const { isClinician, isSchool } = useVisitorMode();

  // Only show full detail for clinicians and schools
  const showFullProtocol = isClinician || isSchool;

  const header = useMemo(
    () =>
      isArabic
        ? {
            badge: 'البروتوكول السريري',
            title: 'بروتوكول مبني على الأدلة',
            subtitle: 'نتبع بروتوكول Bérard AIT المعتمد دولياً مع الالتزام الكامل بمعايير السلامة والخصوصية.',
          }
        : {
            badge: 'CLINICAL PROTOCOL',
            title: 'Evidence-Based Protocol',
            subtitle: 'We follow the internationally recognized Bérard AIT protocol with full commitment to safety and privacy standards.',
          },
    [isArabic]
  );

  const css = `
    @keyframes protocolGlow {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.6; }
    }
    @keyframes hudPulse {
      0%, 100% { opacity: 0.5; box-shadow: 0 0 4px ${brandCyan}; }
      50% { opacity: 1; box-shadow: 0 0 10px ${brandCyan}; }
    }
    @keyframes scanLine {
      0% { left: -20%; opacity: 0; }
      10% { opacity: 0.5; }
      90% { opacity: 0.5; }
      100% { left: 120%; opacity: 0; }
    }
    @keyframes dataStream {
      0% { transform: translateY(100%); opacity: 0; }
      10% { opacity: 0.5; }
      90% { opacity: 0.5; }
      100% { transform: translateY(-100%); opacity: 0; }
    }
    @keyframes phasePulse {
      0%, 100% { box-shadow: 0 4px 12px var(--phase-color); }
      50% { box-shadow: 0 6px 20px var(--phase-color); }
    }
    .protocol-hud-corner {
      position: absolute;
      width: 14px;
      height: 14px;
      border-color: ${brandPurple};
      border-style: solid;
      animation: hudPulse 3s ease-in-out infinite;
    }
    .protocol-scan-line {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 80px;
      background: linear-gradient(90deg, transparent, ${brandPurple}25, transparent);
      animation: scanLine 4s linear infinite;
      pointer-events: none;
    }
    .protocol-data-particle {
      position: absolute;
      width: 2px;
      height: 6px;
      background: ${brandPurple};
      opacity: 0.4;
      animation: dataStream 3s linear infinite;
    }
    @media (max-width: 768px) {
      .protocol-section {
        padding: ${spacing[6]}px ${spacing[3]}px !important;
      }
      .protocol-phases-grid {
        grid-template-columns: 1fr !important;
        gap: ${spacing[5]}px !important;
      }
      .safety-grid {
        grid-template-columns: 1fr !important;
      }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
      .protocol-phases-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
  `;

  return (
    <section
      className="protocol-section"
      aria-labelledby="protocol-title"
      style={{
        position: 'relative',
        padding: `${spacing[12]}px ${spacing[4]}px`,
        maxWidth: 1200,
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      <style>{css}</style>

      {/* HUD Corner Brackets */}
      <div className="protocol-hud-corner" style={{ top: 8, left: 8, borderWidth: '2px 0 0 2px' }} />
      <div className="protocol-hud-corner" style={{ top: 8, right: 8, borderWidth: '2px 2px 0 0' }} />
      <div className="protocol-hud-corner" style={{ bottom: 8, left: 8, borderWidth: '0 0 2px 2px' }} />
      <div className="protocol-hud-corner" style={{ bottom: 8, right: 8, borderWidth: '0 2px 2px 0' }} />

      {/* Scan Line Effect */}
      <div className="protocol-scan-line" />

      {/* Data Stream Particles */}
      <div className="protocol-data-particle" style={{ right: '15%', animationDelay: '0s' }} />
      <div className="protocol-data-particle" style={{ right: '35%', animationDelay: '1s' }} />
      <div className="protocol-data-particle" style={{ right: '55%', animationDelay: '2s' }} />

      {/* Background effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 30% 30%, ${brandPurple}08 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 70%, ${brandCyan}06 0%, transparent 50%)`,
          pointerEvents: 'none',
          animation: 'protocolGlow 6s ease-in-out infinite',
        }}
      />

      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: spacing[10],
          position: 'relative',
        }}
      >
        {/* Badge with Lab Tech Styling */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[3],
            padding: `${spacing[2]}px ${spacing[4]}px`,
            background: `linear-gradient(135deg, ${brandPurple}15, ${brandCyan}10)`,
            border: `1px solid ${brandPurple}35`,
            borderRadius: radius.lg,
            marginBottom: spacing[4],
            boxShadow: `0 0 20px ${brandPurple}15`,
          }}
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${brandPurple}25, ${brandCyan}15)`,
            border: `1px solid ${brandPurple}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ShieldIcon size={16} color={brandPurple} />
          </div>
          <div>
            <span
              style={{
                fontSize: typography.size.xs,
                fontWeight: typography.weight.bold,
                color: brandPurple,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                fontFamily: 'monospace',
              }}
            >
              {header.badge}
            </span>
            <div style={{
              fontSize: 9,
              fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: 0.5,
              marginTop: 2,
            }}>
              LOTUS SOUND LAB // TREATMENT PROTOCOL
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 6,
          }}>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: colors.success,
              boxShadow: `0 0 6px ${colors.success}`,
            }} />
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              color: colors.success,
              fontFamily: 'monospace',
            }}>
              CERTIFIED
            </span>
          </div>
        </div>

        <h2
          id="protocol-title"
          style={{
            fontSize: typography.size['3xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
            marginBottom: spacing[3],
            background: `linear-gradient(135deg, ${colors.text.primary}, ${brandPurple})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {header.title}
        </h2>

        <p
          style={{
            fontSize: typography.size.lg,
            color: colors.text.secondary,
            maxWidth: 700,
            margin: '0 auto',
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          {header.subtitle}
        </p>
      </div>

      {/* Protocol Phases - Show for clinicians and schools */}
      {showFullProtocol && (
        <div style={{ marginBottom: spacing[10] }}>
          <h3
            style={{
              fontSize: typography.size.xl,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
              marginBottom: spacing[6],
              textAlign: isArabic ? 'right' : 'left',
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              flexDirection: isArabic ? 'row-reverse' : 'row',
            }}
          >
            <span style={{ color: brandCyan }}>01</span>
            {t('auto.ClinicalProtocolSection.k1', "Program Phases")}
          </h3>

          <div
            className="protocol-phases-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: spacing[6],
            }}
          >
            {PROTOCOL_PHASES.map((phase) => (
              <PhaseCard key={phase.id} phase={phase} isArabic={isArabic} />
            ))}
          </div>
        </div>
      )}

      {/* Safety & Compliance */}
      <div>
        <h3
          style={{
            fontSize: typography.size.xl,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
            marginBottom: spacing[6],
            textAlign: isArabic ? 'right' : 'left',
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
            flexDirection: isArabic ? 'row-reverse' : 'row',
          }}
        >
          <span style={{ color: brandPink }}>{showFullProtocol ? '02' : '01'}</span>
          {t('auto.ClinicalProtocolSection.k2', "Safety & Compliance")}
        </h3>

        <div
          className="safety-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: spacing[4],
          }}
        >
          {SAFETY_ITEMS.map((item) => (
            <SafetyCard key={item.id} item={item} isArabic={isArabic} />
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <div
        style={{
          marginTop: spacing[8],
          padding: spacing[4],
          background: `linear-gradient(135deg, ${brandCyan}08, transparent)`,
          border: `1px solid ${brandCyan}20`,
          borderRadius: radius.lg,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: typography.size.sm,
            color: colors.text.muted,
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {renderLabIcon('📋', { size: 14, tone: 'cyan' })}
            <span>{t('auto.ClinicalProtocolSection.k3', 'For complete protocol documentation and policies, please contact our clinical team.')}</span>
          </span>
        </p>
      </div>

      {/* System Status Footer */}
      <div
        style={{
          marginTop: spacing[6],
          padding: '12px 16px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: radius.lg,
          border: `1px solid ${labTech.borders.subtle}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            fontSize: 9,
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: 1,
          }}>
            LOTUS SOUND LAB // CLINICAL PROTOCOL v3.0
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: colors.success,
              boxShadow: `0 0 6px ${colors.success}`,
            }} />
            <span style={{
              fontSize: 9,
              fontFamily: 'monospace',
              color: colors.success,
              letterSpacing: 0.5,
            }}>
              BÉRARD AIT CERTIFIED
            </span>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{
            fontSize: 9,
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: 0.5,
          }}>
            10 DAYS • 20 SESSIONS
          </span>
          <div style={{ display: 'flex', gap: 3 }}>
            {[brandCyan, brandPurple, colors.warning, colors.success].map((color, i) => (
              <div key={i} style={{
                width: 12,
                height: 4,
                borderRadius: 2,
                background: color,
                opacity: 0.6,
              }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default ClinicalProtocolSection;
