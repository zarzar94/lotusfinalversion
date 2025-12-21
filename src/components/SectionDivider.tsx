import { memo } from 'react';
import {
  brandCyan,
  brandPurple,
  brandPink,
  colors,
  typography,
  spacing,
  radius,
} from './styles';
import { useLanguage } from '../context/LanguageContext';

// ═══════════════════════════════════════════════════════════════════════════
// SECTION CATEGORY DEFINITIONS
// Medical-tech themed category headers for platform flow
// ═══════════════════════════════════════════════════════════════════════════

export type SectionCategory =
  | 'diagnostic'
  | 'protocol'
  | 'science'
  | 'evidence'
  | 'resources'
  | 'network'
  | 'connect';

type CategoryConfig = {
  icon: string;
  labelAr: string;
  labelEn: string;
  descAr: string;
  descEn: string;
  color: string;
  gradient: string;
};

const CATEGORY_CONFIG: Record<SectionCategory, CategoryConfig> = {
  diagnostic: {
    icon: '🔬',
    labelAr: 'auto.SectionDivider.k1',
    labelEn: 'Diagnostic Tools',
    descAr: 'auto.SectionDivider.k2',
    descEn: 'Self-assessment tools & interactive analysis',
    color: brandCyan,
    gradient: `linear-gradient(135deg, ${brandCyan}20, ${brandCyan}05)`,
  },
  protocol: {
    icon: '📋',
    labelAr: 'auto.SectionDivider.k3',
    labelEn: 'Treatment Protocol',
    descAr: 'auto.SectionDivider.k4',
    descEn: 'Program overview & treatment timeline',
    color: brandPurple,
    gradient: `linear-gradient(135deg, ${brandPurple}20, ${brandPurple}05)`,
  },
  science: {
    icon: '🧬',
    labelAr: 'auto.SectionDivider.k5',
    labelEn: 'Research & Science',
    descAr: 'auto.SectionDivider.k6',
    descEn: 'Scientific foundations & technologies',
    color: brandPink,
    gradient: `linear-gradient(135deg, ${brandPink}20, ${brandPink}05)`,
  },
  evidence: {
    icon: '📊',
    labelAr: 'auto.SectionDivider.k7',
    labelEn: 'Results & Evidence',
    descAr: 'auto.SectionDivider.k8',
    descEn: 'Testimonials & documented results',
    color: brandCyan,
    gradient: `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}05)`,
  },
  resources: {
    icon: '📚',
    labelAr: 'auto.SectionDivider.k9',
    labelEn: 'Learning Resources',
    descAr: 'auto.SectionDivider.k10',
    descEn: 'Presentations, videos & articles',
    color: brandPurple,
    gradient: `linear-gradient(135deg, ${brandPurple}20, ${brandCyan}05)`,
  },
  network: {
    icon: '🤝',
    labelAr: 'auto.SectionDivider.k11',
    labelEn: 'Partnerships & Network',
    descAr: 'auto.SectionDivider.k12',
    descEn: 'Partner schools, universities & clinics',
    color: brandPink,
    gradient: `linear-gradient(135deg, ${brandPink}15, ${brandPurple}05)`,
  },
  connect: {
    icon: '💬',
    labelAr: 'auto.SectionDivider.k13',
    labelEn: 'Get Connected',
    descAr: 'auto.SectionDivider.k14',
    descEn: 'Start your journey with Berard AIT',
    color: brandCyan,
    gradient: `linear-gradient(135deg, ${brandCyan}15, ${brandPink}05)`,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION DIVIDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

type SectionDividerProps = {
  category: SectionCategory;
  showNumber?: boolean;
  number?: number;
};

function SectionDivider({ category, showNumber = true, number }: SectionDividerProps) {
  const { isArabic, direction, t } = useLanguage();
  const config = CATEGORY_CONFIG[category];

  // Calculate section number based on category order
  const categoryOrder: SectionCategory[] = ['diagnostic', 'protocol', 'science', 'evidence', 'resources', 'network', 'connect'];
  const sectionNumber = number ?? categoryOrder.indexOf(category) + 1;

  return (
    <div
      style={{
        position: 'relative',
        padding: `${spacing[8]}px ${spacing[4]}px ${spacing[6]}px`,
        direction,
      }}
    >
      <style>{`
        @keyframes dividerPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes scanLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes nodeGlow {
          0%, 100% { box-shadow: 0 0 10px ${config.color}40; }
          50% { box-shadow: 0 0 20px ${config.color}60; }
        }
      `}</style>

      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: config.gradient,
        opacity: 0.5,
        pointerEvents: 'none',
      }} />

      {/* Tech scan line effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        overflow: 'hidden',
      }}>
        <div style={{
          width: '50%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
          animation: 'scanLine 3s ease-in-out infinite',
        }} />
      </div>

      {/* Main content */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: spacing[4],
        maxWidth: 1000,
        margin: '0 auto',
      }}>
        {/* Left connector line */}
        <div style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(${isArabic ? '270deg' : '90deg'}, transparent, ${config.color}40)`,
        }} />

        {/* Center badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[3],
          padding: `${spacing[2.5]}px ${spacing[5]}px`,
          background: `linear-gradient(135deg, rgba(11,15,28,0.95), rgba(20,26,45,0.9))`,
          border: `1px solid ${config.color}30`,
          borderRadius: radius.full,
          boxShadow: `0 4px 24px ${config.color}15`,
        }}>
          {/* Section number indicator */}
          {showNumber && (
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${config.color}30, ${config.color}10)`,
              border: `1px solid ${config.color}50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: typography.size.xs,
              fontWeight: typography.weight.black,
              color: config.color,
              fontFamily: 'monospace',
              animation: 'nodeGlow 2s ease-in-out infinite',
            }}>
              {String(sectionNumber).padStart(2, '0')}
            </div>
          )}

          {/* Icon */}
          <div style={{
            width: 36,
            height: 36,
            borderRadius: radius.md,
            background: `linear-gradient(135deg, ${config.color}25, ${config.color}10)`,
            border: `1px solid ${config.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}>
            {config.icon}
          </div>

          {/* Text */}
          <div>
            <div style={{
              fontSize: typography.size.sm,
              fontWeight: typography.weight.black,
              color: colors.text.primary,
              fontFamily: typography.fontFamily,
              letterSpacing: 0.5,
            }}>
              {isArabic ? t(config.labelAr, config.labelEn) : config.labelEn}
            </div>
            <div style={{
              fontSize: typography.size.xs,
              color: config.color,
              fontFamily: typography.fontFamily,
              marginTop: 2,
            }}>
              {isArabic ? t(config.descAr, config.descEn) : config.descEn}
            </div>
          </div>

          {/* Status indicator */}
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: config.color,
            boxShadow: `0 0 10px ${config.color}`,
            animation: 'dividerPulse 2s ease-in-out infinite',
          }} />
        </div>

        {/* Right connector line */}
        <div style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(${isArabic ? '90deg' : '270deg'}, transparent, ${config.color}40)`,
        }} />
      </div>

      {/* Data flow dots */}
      <div style={{
        position: 'absolute',
        bottom: spacing[2],
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: spacing[1.5],
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: config.color,
              opacity: 0.3 + (i * 0.2),
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(SectionDivider);
