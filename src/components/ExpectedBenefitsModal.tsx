import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useVisitorMode, type VisitorMode } from '../context/VisitorModeContext';
import {
  brandCyan,
  brandPurple,
  colors,
  spacing,
  radius,
  typography,
  transitions,
  shadows,
} from './styles';
import {
  ArrowRightIcon,
  BookIcon,
  BrainIcon,
  HeadphonesIcon,
  MessageIcon,
  ShieldIcon,
  SparklesIcon,
  TargetIcon,
  XIcon,
} from './Icons';

interface BenefitItem {
  id: string;
  icon: React.ReactNode;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  relevantModes: VisitorMode[];
}

const BENEFITS: BenefitItem[] = [
  {
    id: 'listening',
    icon: <HeadphonesIcon size={22} color="#fff" />,
    titleEn: 'Improved Listening Skills',
    titleAr: 'تحسين مهارات الاستماع',
    descriptionEn: 'Enhanced ability to filter and process auditory information in noisy environments',
    descriptionAr: 'قدرة محسنة على تصفية ومعالجة المعلومات السمعية في البيئات الصاخبة',
    relevantModes: ['parent', 'school'],
  },
  {
    id: 'focus',
    icon: <BrainIcon size={22} color="#fff" />,
    titleEn: 'Better Focus & Attention',
    titleAr: 'تركيز وانتباه أفضل',
    descriptionEn: 'Reduced auditory hypersensitivity leads to improved concentration',
    descriptionAr: 'تقليل الحساسية السمعية المفرطة يؤدي إلى تحسين التركيز',
    relevantModes: ['parent', 'school', 'clinician'],
  },
  {
    id: 'communication',
    icon: <MessageIcon size={22} color="#fff" />,
    titleEn: 'Enhanced Communication',
    titleAr: 'تواصل محسّن',
    descriptionEn: 'Improvements in speech clarity, language processing, and social interaction',
    descriptionAr: 'تحسينات في وضوح الكلام ومعالجة اللغة والتفاعل الاجتماعي',
    relevantModes: ['parent', 'clinician'],
  },
  {
    id: 'academic',
    icon: <BookIcon size={22} color="#fff" />,
    titleEn: 'Academic Performance',
    titleAr: 'الأداء الأكاديمي',
    descriptionEn: 'Better auditory processing supports reading, spelling, and classroom learning',
    descriptionAr: 'معالجة سمعية أفضل تدعم القراءة والإملاء والتعلم في الصف',
    relevantModes: ['school', 'parent'],
  },
  {
    id: 'sensory',
    icon: <TargetIcon size={22} color="#fff" />,
    titleEn: 'Sensory Regulation',
    titleAr: 'تنظيم حسي',
    descriptionEn: 'Helps modulate sensory responses for improved emotional regulation',
    descriptionAr: 'يساعد على تنظيم الاستجابات الحسية لتحسين التنظيم العاطفي',
    relevantModes: ['parent', 'clinician'],
  },
  {
    id: 'evidence',
    icon: <ShieldIcon size={22} color="#fff" />,
    titleEn: 'Evidence-Based Protocol',
    titleAr: 'بروتوكول قائم على الأدلة',
    descriptionEn: 'Backed by decades of research and documented clinical outcomes',
    descriptionAr: 'مدعوم بعقود من البحث والنتائج السريرية الموثقة',
    relevantModes: ['clinician', 'school'],
  },
];

export default function ExpectedBenefitsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { isArabic } = useLanguage();
  const { mode: visitorMode, config: visitorConfig } = useVisitorMode();
  const [hoveredBenefit, setHoveredBenefit] = useState<string | null>(null);

  const sortedBenefits = useMemo(() => {
    return [...BENEFITS].sort((a, b) => {
      const aRelevant = a.relevantModes.includes(visitorMode);
      const bRelevant = b.relevantModes.includes(visitorMode);
      if (aRelevant && !bRelevant) return -1;
      if (!aRelevant && bRelevant) return 1;
      return 0;
    });
  }, [visitorMode]);

  const isRelevant = (benefit: BenefitItem) => benefit.relevantModes.includes(visitorMode);

  useEffect(() => {
    if (!open) return undefined;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const title = isArabic ? 'الفوائد المتوقعة' : 'Expected Benefits';
  const subtitle = isArabic
    ? 'فوائد مختارة لك بناءً على احتياجاتك'
    : 'Benefits highlighted for you based on your needs';
  const question = isArabic
    ? 'هل لديك أسئلة حول ما إذا كان برنامج بيرارد AIT مناسباً لك؟'
    : 'Have questions about whether Berard AIT is right for you?';
  const ctaLabel = isArabic ? 'احجز استشارة مجانية' : 'Book a Free Consultation';

  const css = `
    @keyframes benefitsModalFade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes benefitsModalSlide {
      from { opacity: 0; transform: translateY(16px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes benefitCardIn {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .expected-benefit-card {
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .expected-benefit-card:hover {
      transform: translateY(-6px) scale(1.02);
    }
    .expected-benefit-relevant {
      animation: benefitPulse 2s ease-in-out infinite;
    }
    @keyframes benefitPulse {
      0%, 100% { box-shadow: 0 0 20px ${visitorConfig.color}20; }
      50% { box-shadow: 0 0 30px ${visitorConfig.color}35; }
    }
    @media (max-width: 768px) {
      .expected-benefits-grid {
        grid-template-columns: 1fr !important;
      }
      .expected-benefits-modal {
        padding: ${spacing[5]}px !important;
      }
    }
  `;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5,6,13,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200,
        padding: spacing[4],
        animation: 'benefitsModalFade 0.3s ease-out',
      }}
    >
      <style>{css}</style>
      <div
        className="expected-benefits-modal"
        onClick={(event) => event.stopPropagation()}
        dir={isArabic ? 'rtl' : 'ltr'}
        style={{
          background: colors.surface.overlay,
          borderRadius: radius.xl,
          maxWidth: 1000,
          width: '100%',
          maxHeight: '88vh',
          overflow: 'auto',
          position: 'relative',
          border: `1px solid ${colors.border.emphasis}`,
          boxShadow: shadows['2xl'],
          padding: spacing[6],
          animation: 'benefitsModalSlide 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <button
          onClick={onClose}
          aria-label={isArabic ? 'إغلاق' : 'Close'}
          style={{
            position: 'absolute',
            top: spacing[3],
            [isArabic ? 'left' : 'right']: spacing[3],
            width: 40,
            height: 40,
            borderRadius: radius.md,
            border: `1px solid ${colors.border.subtle}`,
            background: 'rgba(255,255,255,0.06)',
            display: 'grid',
            placeItems: 'center',
            color: colors.text.muted,
            cursor: 'pointer',
            transition: transitions.fast,
          }}
        >
          <XIcon size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: spacing[6] }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing[2],
              padding: `${spacing[1.5]}px ${spacing[4]}px`,
              background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
              border: `1px solid ${brandCyan}30`,
              borderRadius: radius.full,
              marginBottom: spacing[3],
            }}
          >
            <SparklesIcon size={14} color={brandCyan} />
            <span
              style={{
                fontSize: typography.size.xs,
                fontWeight: typography.weight.bold,
                color: brandCyan,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {isArabic ? 'الفوائد المتوقعة' : 'Expected Benefits'}
            </span>
          </div>
          <h2 style={{
            margin: 0,
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
            marginBottom: spacing[2],
          }}>
            {title}
          </h2>
          <p style={{
            margin: 0,
            fontSize: typography.size.sm,
            color: colors.text.muted,
          }}>
            {subtitle}
          </p>
        </div>

        <div
          className="expected-benefits-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: spacing[4],
          }}
        >
          {sortedBenefits.map((benefit, idx) => {
            const relevant = isRelevant(benefit);
            const isHovered = hoveredBenefit === benefit.id;

            return (
              <div
                key={benefit.id}
                className={`expected-benefit-card ${relevant ? 'expected-benefit-relevant' : ''}`}
                onMouseEnter={() => setHoveredBenefit(benefit.id)}
                onMouseLeave={() => setHoveredBenefit(null)}
                style={{
                  position: 'relative',
                  padding: spacing[5],
                  background: relevant
                    ? `linear-gradient(135deg, ${visitorConfig.color}12, ${visitorConfig.color}05)`
                    : 'rgba(11,15,28,0.6)',
                  borderRadius: radius.xl,
                  border: `1px solid ${relevant ? `${visitorConfig.color}40` : colors.border.subtle}`,
                  textAlign: 'center',
                  boxShadow: isHovered
                    ? `0 15px 40px rgba(0,0,0,0.3), 0 0 20px ${relevant ? visitorConfig.color : brandCyan}15`
                    : 'none',
                  animation: `benefitCardIn 0.45s ease-out ${idx * 0.08}s backwards`,
                }}
              >
                {relevant && (
                  <div style={{
                    position: 'absolute',
                    top: -8,
                    right: isArabic ? 'auto' : -8,
                    left: isArabic ? -8 : 'auto',
                    padding: '4px 8px',
                    background: visitorConfig.color,
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#fff',
                    boxShadow: `0 2px 8px ${visitorConfig.color}50`,
                  }}>
                    {visitorConfig.icon}
                  </div>
                )}

                <div
                  style={{
                    width: 52,
                    height: 52,
                    margin: '0 auto',
                    marginBottom: spacing[3],
                    borderRadius: 14,
                    background: relevant
                      ? `linear-gradient(135deg, ${visitorConfig.color}30, ${visitorConfig.color}15)`
                      : `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}15)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.3s ease',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {benefit.icon}
                </div>

                <div
                  style={{
                    fontWeight: typography.weight.bold,
                    fontSize: typography.size.base,
                    color: relevant ? visitorConfig.color : colors.text.primary,
                    marginBottom: spacing[2],
                  }}
                >
                  {isArabic ? benefit.titleAr : benefit.titleEn}
                </div>
                <div
                  style={{
                    fontSize: typography.size.xs,
                    color: colors.text.muted,
                    lineHeight: 1.6,
                  }}
                >
                  {isArabic ? benefit.descriptionAr : benefit.descriptionEn}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: spacing[8],
          textAlign: 'center',
          padding: spacing[5],
          background: `linear-gradient(135deg, ${visitorConfig.color}12, transparent)`,
          borderRadius: radius.xl,
          border: `1px solid ${visitorConfig.color}25`,
        }}>
          <p style={{
            margin: 0,
            fontSize: typography.size.base,
            color: colors.text.secondary,
            marginBottom: spacing[4],
          }}>
            {question}
          </p>
          <a
            href="#contact"
            onClick={onClose}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing[2],
              padding: `${spacing[3]}px ${spacing[6]}px`,
              background: `linear-gradient(135deg, ${visitorConfig.color}, ${visitorConfig.color}cc)`,
              borderRadius: radius.lg,
              color: '#fff',
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
              textDecoration: 'none',
              boxShadow: `0 4px 15px ${visitorConfig.color}30`,
              transition: transitions.fast,
            }}
          >
            {ctaLabel}
            <span style={{ transform: isArabic ? 'rotate(180deg)' : 'none' }}>
              <ArrowRightIcon size={16} />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
