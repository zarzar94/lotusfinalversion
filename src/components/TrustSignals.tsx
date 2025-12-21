import { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useVisitorMode, type VisitorMode } from '../context/VisitorModeContext';
import {
  brandCyan,
  brandPurple,
  brandPink,
  typography,
  spacing,
  radius,
  transitions,
  colors,
  shadows,
} from './styles';
import { CheckCircleIcon, ShieldIcon, StarIcon, UsersIcon } from './Icons';

interface TrustSignal {
  id: string;
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  relevantModes: VisitorMode[]; // Which modes this signal is most relevant to
  detailsEn?: string;
  detailsAr?: string;
}

// Role-specific value propositions
interface RoleProposition {
  titleEn: string;
  titleAr: string;
  bulletPoints: { en: string; ar: string }[];
  ctaEn: string;
  ctaAr: string;
  ctaLink: string;
}

const ROLE_PROPOSITIONS: Record<VisitorMode, RoleProposition> = {
  school: {
    titleEn: 'Why Schools Trust Us',
    titleAr: 'auto.TrustSignals.k2',
    bulletPoints: [
      { en: 'Group screening programs for classrooms', ar: 'auto.TrustSignals.k12' },
      { en: 'Teacher training workshops included', ar: 'auto.TrustSignals.k13' },
      { en: 'Detailed reports for each student', ar: 'auto.TrustSignals.k14' },
      { en: 'Flexible scheduling around school calendar', ar: 'auto.TrustSignals.k15' },
    ],
    ctaEn: 'Request School Partnership',
    ctaAr: 'auto.TrustSignals.k3',
    ctaLink: '#contact',
  },
  parent: {
    titleEn: 'Why Families Choose Us',
    titleAr: 'auto.TrustSignals.k4',
    bulletPoints: [
      { en: 'Child-friendly assessment environment', ar: 'auto.TrustSignals.k16' },
      { en: 'Clear explanations in simple terms', ar: 'auto.TrustSignals.k17' },
      { en: 'Home practice guidance provided', ar: 'auto.TrustSignals.k18' },
      { en: 'Ongoing support throughout the program', ar: 'auto.TrustSignals.k19' },
    ],
    ctaEn: 'Book Family Consultation',
    ctaAr: 'auto.TrustSignals.k5',
    ctaLink: '#contact',
  },
  clinician: {
    titleEn: 'Clinical Excellence',
    titleAr: 'auto.TrustSignals.k6',
    bulletPoints: [
      { en: 'Evidence-based Bérard AIT protocol', ar: 'auto.TrustSignals.k20' },
      { en: 'Comprehensive audiometric assessments', ar: 'auto.TrustSignals.k21' },
      { en: 'Professional referral network', ar: 'auto.TrustSignals.k22' },
      { en: 'Detailed clinical documentation', ar: 'auto.TrustSignals.k23' },
    ],
    ctaEn: 'Professional Inquiry',
    ctaAr: 'auto.TrustSignals.k7',
    ctaLink: '#contact',
  },
};

export default function TrustSignals() {
  const { t, isArabic } = useLanguage();
  const { mode: visitorMode, config: visitorConfig, isSchool, isParent, isClinician } = useVisitorMode();
  const [hoveredSignal, setHoveredSignal] = useState<string | null>(null);

  const signals: TrustSignal[] = useMemo(() => [
    {
      id: 'clients',
      icon: <CheckCircleIcon size={24} color={colors.success} />,
      value: '500+',
      label: t('trustSignals.clientsHelped'),
      color: colors.success,
      relevantModes: ['parent', 'clinician'],
      detailsEn: 'Families and individuals helped through our programs',
      detailsAr: 'auto.TrustSignals.k8',
    },
    {
      id: 'certified',
      icon: <ShieldIcon size={24} color={brandCyan} />,
      value: '100%',
      label: t('trustSignals.certified'),
      color: brandCyan,
      relevantModes: ['clinician', 'school'],
      detailsEn: 'All practitioners certified by Bérard AIT International',
      detailsAr: 'auto.TrustSignals.k9',
    },
    {
      id: 'rating',
      icon: <StarIcon size={24} color="#f59e0b" />,
      value: '4.9/5',
      label: t('trustSignals.rating'),
      color: '#f59e0b',
      relevantModes: ['parent'],
      detailsEn: 'Based on verified family reviews',
      detailsAr: 'auto.TrustSignals.k10',
    },
    {
      id: 'schools',
      icon: <UsersIcon size={24} color={brandPurple} />,
      value: '25+',
      label: t('trustSignals.schoolPartners'),
      color: brandPurple,
      relevantModes: ['school'],
      detailsEn: 'Schools in our screening partnership program',
      detailsAr: 'auto.TrustSignals.k11',
    },
  ], [t]);

  // Get the role-specific proposition
  const roleProposition = ROLE_PROPOSITIONS[visitorMode];

  // Check if a signal is highlighted for current mode
  const isSignalHighlighted = (signal: TrustSignal) =>
    signal.relevantModes.includes(visitorMode);

  const css = useMemo(() => `
    @keyframes trustPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
    @keyframes highlightGlow {
      0%, 100% { box-shadow: 0 0 15px ${visitorConfig.color}20; }
      50% { box-shadow: 0 0 25px ${visitorConfig.color}40; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .trust-card {
      transition: ${transitions.bounce};
    }
    .trust-card:hover {
      transform: translateY(-4px);
      box-shadow: ${shadows.lg};
    }
    .trust-card.highlighted {
      animation: highlightGlow 2s ease-in-out infinite;
      border-color: ${visitorConfig.color}50 !important;
    }
    .trust-card.highlighted::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, ${visitorConfig.color}, transparent);
      border-radius: ${radius.xl} ${radius.xl} 0 0;
    }
    .trust-value {
      background: linear-gradient(135deg, ${brandCyan}, ${brandPurple});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .role-proposition {
      background: linear-gradient(135deg, ${visitorConfig.color}10, ${visitorConfig.color}05);
      border: 1px solid ${visitorConfig.color}30;
    }
    .proposition-badge {
      background: linear-gradient(90deg, ${visitorConfig.color}20, ${visitorConfig.color}40, ${visitorConfig.color}20);
      background-size: 200% 100%;
      animation: shimmer 3s ease infinite;
    }
  `, [visitorConfig.color]);

  return (
    <section
      style={{
        padding: `${spacing[10]}px ${spacing[4]}px`,
        background: 'linear-gradient(180deg, rgba(11,15,28,0.3) 0%, rgba(5,6,13,0.6) 100%)',
        borderTop: `1px solid ${colors.border.subtle}`,
        borderBottom: `1px solid ${colors.border.subtle}`,
      }}
    >
      <style>{css}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: spacing[8],
        }}>
          <h2 style={{
            margin: 0,
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
            marginBottom: spacing[2],
          }}>
            {t('trustSignals.title')}
          </h2>
          <p style={{
            margin: 0,
            fontSize: typography.size.base,
            color: colors.text.secondary,
          }}>
            {t('trustSignals.subtitle')}
          </p>
        </div>

        {/* Trust Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: spacing[4],
        }}>
          {signals.map((signal) => {
            const highlighted = isSignalHighlighted(signal);
            const isHovered = hoveredSignal === signal.id;

            return (
              <div
                key={signal.id}
                className={`trust-card ${highlighted ? 'highlighted' : ''}`}
                onMouseEnter={() => setHoveredSignal(signal.id)}
                onMouseLeave={() => setHoveredSignal(null)}
                style={{
                  position: 'relative',
                  padding: spacing[5],
                  background: highlighted
                    ? `linear-gradient(135deg, rgba(11,15,28,0.8), ${visitorConfig.color}10)`
                    : 'rgba(11,15,28,0.6)',
                  borderRadius: radius.xl,
                  border: `1px solid ${highlighted ? visitorConfig.color + '40' : colors.border.default}`,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: spacing[3],
                  overflow: 'hidden',
                }}
              >
                {/* Highlighted badge */}
                {highlighted && (
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    right: isArabic ? 'auto' : 8,
                    left: isArabic ? 8 : 'auto',
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: visitorConfig.color + '20',
                    border: `1px solid ${visitorConfig.color}40`,
                    fontSize: 10,
                    fontWeight: 700,
                    color: visitorConfig.color,
                  }}>
                    {visitorConfig.icon} {t('auto.TrustSignals.k1', "For you")}
                  </div>
                )}

                {/* Icon */}
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: radius.lg,
                  background: `${signal.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: highlighted ? 16 : 0,
                }}>
                  {signal.icon}
                </div>

                {/* Value */}
                <div
                  className="trust-value"
                  style={{
                    fontSize: typography.size['3xl'],
                    fontWeight: typography.weight.black,
                    lineHeight: 1,
                  }}
                >
                  {signal.value}
                </div>

                {/* Label */}
                <div style={{
                  fontSize: typography.size.sm,
                  color: colors.text.secondary,
                  fontWeight: typography.weight.medium,
                }}>
                  {signal.label}
                </div>

                {/* Hover details tooltip */}
                {isHovered && (signal.detailsEn || signal.detailsAr) && (
                  <div style={{
                    marginTop: spacing[2],
                    padding: '8px 12px',
                    background: 'rgba(0,0,0,0.4)',
                    borderRadius: radius.md,
                    fontSize: typography.size.xs,
                    color: colors.text.muted,
                    lineHeight: 1.4,
                  }}>
                    {isArabic ? t(signal.detailsAr, signal.detailsEn) : signal.detailsEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom trust text */}
        <div style={{
          marginTop: spacing[8],
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          gap: spacing[6],
          flexWrap: 'wrap',
        }}>
          {[
            t('trustSignals.guarantee1'),
            t('trustSignals.guarantee2'),
            t('trustSignals.guarantee3'),
          ].map((text, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                fontSize: typography.size.sm,
                color: colors.text.muted,
              }}
            >
              <CheckCircleIcon size={16} color={colors.success} />
              {text}
            </div>
          ))}
        </div>

        {/* Role-Specific Value Proposition */}
        <div
          className="role-proposition"
          style={{
            marginTop: spacing[8],
            padding: spacing[6],
            borderRadius: radius.xl,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[4],
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[3],
            flexWrap: 'wrap',
          }}>
            <div
              className="proposition-badge"
              style={{
                padding: '6px 12px',
                borderRadius: radius.lg,
                fontSize: typography.size.xs,
                fontWeight: typography.weight.bold,
                color: visitorConfig.color,
                border: `1px solid ${visitorConfig.color}40`,
              }}
            >
              {visitorConfig.icon} {isArabic ? t(visitorConfig.labelAr, visitorConfig.label) : visitorConfig.label}
            </div>
            <h3 style={{
              margin: 0,
              fontSize: typography.size.xl,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
            }}>
              {isArabic ? t(roleProposition.titleAr, roleProposition.titleEn) : roleProposition.titleEn}
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: spacing[3],
          }}>
            {roleProposition.bulletPoints.map((point, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing[2],
                  padding: spacing[3],
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: radius.lg,
                }}
              >
                <CheckCircleIcon size={18} color={visitorConfig.color} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{
                  fontSize: typography.size.sm,
                  color: colors.text.secondary,
                  lineHeight: 1.5,
                }}>
                  {isArabic ? t(point.ar, point.en) : point.en}
                </span>
              </div>
            ))}
          </div>

          <a
            href={roleProposition.ctaLink}
            style={{
              alignSelf: 'center',
              marginTop: spacing[2],
              padding: `${spacing[3]}px ${spacing[6]}px`,
              background: `linear-gradient(135deg, ${visitorConfig.color}, ${visitorConfig.color}cc)`,
              borderRadius: radius.lg,
              color: '#fff',
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing[2],
              transition: transitions.fast,
              boxShadow: `0 4px 15px ${visitorConfig.color}30`,
            }}
          >
            {isArabic ? t(roleProposition.ctaAr, roleProposition.ctaEn) : roleProposition.ctaEn}
            <span style={{ fontSize: 16 }}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
