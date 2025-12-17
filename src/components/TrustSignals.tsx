import { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  brandCyan,
  brandPurple,
  typography,
  spacing,
  radius,
  transitions,
  colors,
  shadows,
} from './styles';
import { CheckCircleIcon, ShieldIcon, StarIcon, UsersIcon } from './Icons';

interface TrustSignal {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

export default function TrustSignals() {
  const { t, isArabic } = useLanguage();

  const signals: TrustSignal[] = useMemo(() => [
    {
      icon: <CheckCircleIcon size={24} color={colors.success} />,
      value: '500+',
      label: t('trustSignals.clientsHelped'),
      color: colors.success,
    },
    {
      icon: <ShieldIcon size={24} color={brandCyan} />,
      value: '100%',
      label: t('trustSignals.certified'),
      color: brandCyan,
    },
    {
      icon: <StarIcon size={24} color="#f59e0b" />,
      value: '4.9/5',
      label: t('trustSignals.rating'),
      color: '#f59e0b',
    },
    {
      icon: <UsersIcon size={24} color={brandPurple} />,
      value: '25+',
      label: t('trustSignals.schoolPartners'),
      color: brandPurple,
    },
  ], [t]);

  const css = useMemo(() => `
    @keyframes trustPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
    .trust-card {
      transition: ${transitions.bounce};
    }
    .trust-card:hover {
      transform: translateY(-4px);
      box-shadow: ${shadows.lg};
    }
    .trust-value {
      background: linear-gradient(135deg, ${brandCyan}, ${brandPurple});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `, []);

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
          {signals.map((signal, index) => (
            <div
              key={index}
              className="trust-card"
              style={{
                padding: spacing[5],
                background: 'rgba(11,15,28,0.6)',
                borderRadius: radius.xl,
                border: `1px solid ${colors.border.default}`,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing[3],
              }}
            >
              {/* Icon */}
              <div style={{
                width: 56,
                height: 56,
                borderRadius: radius.lg,
                background: `${signal.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
            </div>
          ))}
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
      </div>
    </section>
  );
}
