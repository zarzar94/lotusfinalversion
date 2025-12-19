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
} from './styles';
import {
  ShieldIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  DocumentIcon,
  UserIcon,
} from './Icons';

// Protocol phases configuration
const PROTOCOL_PHASES = [
  {
    id: 'assessment',
    phase: 1,
    titleEn: 'Initial Assessment',
    titleAr: 'التقييم الأولي',
    durationEn: 'Day 1',
    durationAr: 'اليوم الأول',
    descEn: 'Comprehensive audiometric testing and baseline measurements',
    descAr: 'اختبارات سمعية شاملة وقياسات أساسية',
    color: brandCyan,
  },
  {
    id: 'training',
    phase: 2,
    titleEn: 'Active Training',
    titleAr: 'التدريب النشط',
    durationEn: 'Days 1-10',
    durationAr: 'الأيام 1-10',
    descEn: '20 sessions of modified music listening (2 per day)',
    descAr: '20 جلسة استماع لموسيقى معدلة (جلستان يومياً)',
    color: brandPurple,
  },
  {
    id: 'midpoint',
    phase: 3,
    titleEn: 'Mid-Program Check',
    titleAr: 'فحص منتصف البرنامج',
    durationEn: 'Day 5',
    durationAr: 'اليوم الخامس',
    descEn: 'Progress evaluation and protocol adjustments if needed',
    descAr: 'تقييم التقدم وتعديل البروتوكول إذا لزم الأمر',
    color: '#f59e0b',
  },
  {
    id: 'completion',
    phase: 4,
    titleEn: 'Post-Assessment',
    titleAr: 'التقييم النهائي',
    durationEn: 'Day 10+',
    durationAr: 'اليوم 10+',
    descEn: 'Final measurements and comprehensive progress report',
    descAr: 'قياسات نهائية وتقرير تقدم شامل',
    color: '#22c55e',
  },
];

// Safety & compliance items
const SAFETY_ITEMS = [
  {
    id: 'screening',
    iconType: 'alert',
    titleEn: 'Screening, Not Diagnosis',
    titleAr: 'فحص وليس تشخيص',
    descEn: 'Our assessments are educational screenings. They do not replace clinical diagnosis by licensed professionals.',
    descAr: 'تقييماتنا هي فحوصات تعليمية. لا تحل محل التشخيص السريري من المختصين المرخصين.',
    color: '#f59e0b',
  },
  {
    id: 'supervision',
    iconType: 'user',
    titleEn: 'Clinical Supervision',
    titleAr: 'الإشراف السريري',
    descEn: 'All sessions are supervised by certified Bérard AIT practitioners with ongoing professional development.',
    descAr: 'جميع الجلسات تحت إشراف ممارسين معتمدين من Bérard AIT مع تطوير مهني مستمر.',
    color: brandPurple,
  },
  {
    id: 'privacy',
    iconType: 'shield',
    titleEn: 'Data Privacy',
    titleAr: 'خصوصية البيانات',
    descEn: 'Your data is encrypted and stored securely. We never share personal information without explicit consent.',
    descAr: 'بياناتك مشفرة ومخزنة بأمان. لا نشارك المعلومات الشخصية بدون موافقة صريحة.',
    color: brandCyan,
  },
  {
    id: 'consent',
    iconType: 'document',
    titleEn: 'Informed Consent',
    titleAr: 'الموافقة المستنيرة',
    descEn: 'We provide clear documentation of program expectations, potential outcomes, and your rights.',
    descAr: 'نقدم وثائق واضحة عن توقعات البرنامج والنتائج المحتملة وحقوقك.',
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
          {isArabic ? phase.durationAr : phase.durationEn}
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
        {isArabic ? phase.titleAr : phase.titleEn}
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
        {isArabic ? phase.descAr : phase.descEn}
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
}) => (
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
        {isArabic ? item.titleAr : item.titleEn}
      </h5>
      <p
        style={{
          margin: 0,
          fontSize: typography.size.sm,
          color: colors.text.muted,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        {isArabic ? item.descAr : item.descEn}
      </p>
    </div>
  </div>
));
SafetyCard.displayName = 'SafetyCard';

const ClinicalProtocolSection = memo(function ClinicalProtocolSection() {
  const { isArabic } = useLanguage();
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
      }}
    >
      <style>{css}</style>

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
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[2],
            padding: `${spacing[1.5]}px ${spacing[4]}px`,
            background: `linear-gradient(135deg, ${brandPurple}15, ${brandCyan}10)`,
            border: `1px solid ${brandPurple}25`,
            borderRadius: radius.full,
            marginBottom: spacing[4],
          }}
        >
          <ShieldIcon size={14} color={brandPurple} />
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
            {isArabic ? 'مراحل البرنامج' : 'Program Phases'}
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
          {isArabic ? 'السلامة والامتثال' : 'Safety & Compliance'}
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
          {isArabic
            ? '📋 للاطلاع على الوثائق الكاملة للبروتوكول والسياسات، يرجى التواصل مع فريقنا السريري.'
            : '📋 For complete protocol documentation and policies, please contact our clinical team.'}
        </p>
      </div>
    </section>
  );
});

export default ClinicalProtocolSection;
