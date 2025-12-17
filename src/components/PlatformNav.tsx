import { useState, memo } from 'react';
import {
  brandCyan,
  brandPurple,
  brandPink,
  colors,
  typography,
  spacing,
  radius,
  shadows,
  transitions,
} from './styles';
import { useLanguage } from '../context/LanguageContext';

// ═══════════════════════════════════════════════════════════════════════════
// PLATFORM MODULE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

type PlatformModule = {
  id: string;
  icon: string;
  labelAr: string;
  labelEn: string;
  descAr: string;
  descEn: string;
  color: string;
  targetId: string;
  badge?: { ar: string; en: string };
};

const PLATFORM_MODULES: PlatformModule[] = [
  {
    id: 'diagnostic',
    icon: '🔬',
    labelAr: 'أدوات التشخيص',
    labelEn: 'Diagnostic Tools',
    descAr: 'قائمة التقييم الذاتي والألعاب التفاعلية',
    descEn: 'Self-assessment checklist & interactive games',
    color: brandCyan,
    targetId: 'checklist',
    badge: { ar: 'تفاعلي', en: 'Interactive' },
  },
  {
    id: 'protocol',
    icon: '📋',
    labelAr: 'بروتوكول العلاج',
    labelEn: 'Treatment Protocol',
    descAr: 'نظرة شاملة على البرنامج والجدول الزمني',
    descEn: 'Program overview & treatment timeline',
    color: brandPurple,
    targetId: 'overview',
  },
  {
    id: 'science',
    icon: '🧬',
    labelAr: 'البحث العلمي',
    labelEn: 'Research & Science',
    descAr: 'المرونة العصبية وتقنية الصوت',
    descEn: 'Neuroplasticity & audio technology',
    color: brandPink,
    targetId: 'neuroplasticity',
  },
  {
    id: 'evidence',
    icon: '📊',
    labelAr: 'النتائج والأدلة',
    labelEn: 'Results & Evidence',
    descAr: 'شهادات وإحصائيات النجاح',
    descEn: 'Testimonials & success statistics',
    color: brandCyan,
    targetId: 'results',
  },
  {
    id: 'resources',
    icon: '📚',
    labelAr: 'المصادر التعليمية',
    labelEn: 'Learning Resources',
    descAr: 'عروض تقديمية وفيديوهات تعليمية',
    descEn: 'Presentations & educational videos',
    color: brandPurple,
    targetId: 'slides',
  },
  {
    id: 'connect',
    icon: '💬',
    labelAr: 'تواصل معنا',
    labelEn: 'Get Started',
    descAr: 'استمارة التسجيل والتواصل',
    descEn: 'Intake form & contact',
    color: brandPink,
    targetId: 'intake',
    badge: { ar: 'ابدأ الآن', en: 'Start Now' },
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MODULE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const ModuleCard = memo(({
  module,
  isArabic,
  index,
}: {
  module: PlatformModule;
  isArabic: boolean;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    const target = document.getElementById(module.targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: spacing[2],
        padding: spacing[4],
        background: isHovered
          ? `linear-gradient(135deg, ${module.color}15, ${module.color}08)`
          : `linear-gradient(135deg, rgba(15,20,35,0.6), rgba(20,26,45,0.4))`,
        border: `1px solid ${isHovered ? `${module.color}40` : colors.border.default}`,
        borderRadius: radius.xl,
        cursor: 'pointer',
        textAlign: isArabic ? 'right' : 'left',
        transition: transitions.normal,
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? `0 12px 32px ${module.color}20` : shadows.md,
        animation: `moduleEnter 0.5s ease-out ${index * 0.08}s both`,
        overflow: 'hidden',
      }}
    >
      {/* Gradient line at top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${module.color}, transparent)`,
        opacity: isHovered ? 1 : 0.4,
        transition: transitions.fast,
      }} />

      {/* Icon container */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: radius.lg,
          background: `linear-gradient(135deg, ${module.color}20, ${module.color}08)`,
          border: `1px solid ${module.color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          boxShadow: isHovered ? `0 4px 16px ${module.color}30` : 'none',
          transition: transitions.normal,
        }}>
          {module.icon}
        </div>

        {/* Badge */}
        {module.badge && (
          <span style={{
            padding: `${spacing[1]}px ${spacing[2]}px`,
            background: `${module.color}20`,
            border: `1px solid ${module.color}40`,
            borderRadius: radius.full,
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            color: module.color,
          }}>
            {isArabic ? module.badge.ar : module.badge.en}
          </span>
        )}
      </div>

      {/* Text content */}
      <div>
        <h3 style={{
          margin: 0,
          fontSize: typography.size.base,
          fontWeight: typography.weight.bold,
          color: colors.text.primary,
          fontFamily: typography.fontFamily,
          lineHeight: typography.lineHeight.tight,
        }}>
          {isArabic ? module.labelAr : module.labelEn}
        </h3>
        <p style={{
          margin: `${spacing[1]}px 0 0`,
          fontSize: typography.size.xs,
          color: colors.text.muted,
          fontFamily: typography.fontFamily,
          lineHeight: typography.lineHeight.normal,
        }}>
          {isArabic ? module.descAr : module.descEn}
        </p>
      </div>

      {/* Hover arrow indicator */}
      <div style={{
        position: 'absolute',
        bottom: spacing[3],
        [isArabic ? 'left' : 'right']: spacing[3],
        opacity: isHovered ? 1 : 0,
        transform: isHovered
          ? `translateX(0)`
          : `translateX(${isArabic ? '-8px' : '8px'})`,
        transition: transitions.fast,
        color: module.color,
        fontSize: typography.size.lg,
      }}>
        {isArabic ? '←' : '→'}
      </div>
    </button>
  );
});
ModuleCard.displayName = 'ModuleCard';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function PlatformNav() {
  const { isArabic, direction } = useLanguage();

  return (
    <section
      id="platform-nav"
      style={{
        position: 'relative',
        padding: `${spacing[10]}px ${spacing[4]}px`,
        direction,
      }}
    >
      <style>{`
        @keyframes moduleEnter {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>

      {/* Section header */}
      <div style={{
        textAlign: 'center',
        marginBottom: spacing[8],
      }}>
        {/* Medical-tech badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: spacing[2],
          padding: `${spacing[1.5]}px ${spacing[4]}px`,
          background: `linear-gradient(135deg, ${brandPurple}15, ${brandCyan}10)`,
          border: `1px solid ${brandPurple}30`,
          borderRadius: radius.full,
          marginBottom: spacing[4],
        }}>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: brandCyan,
            boxShadow: `0 0 8px ${brandCyan}`,
            animation: 'pulseGlow 2s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            color: brandCyan,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            {isArabic ? 'لوحة التحكم الطبية' : 'Medical Dashboard'}
          </span>
        </div>

        <h2 style={{
          margin: 0,
          fontSize: typography.size['3xl'],
          fontWeight: typography.weight.black,
          fontFamily: typography.fontFamily,
          color: colors.text.primary,
          lineHeight: typography.lineHeight.tight,
        }}>
          {isArabic ? 'استكشف المنصة' : 'Explore the Platform'}
        </h2>
        <p style={{
          margin: `${spacing[2]}px auto 0`,
          maxWidth: 500,
          fontSize: typography.size.base,
          color: colors.text.secondary,
          fontFamily: typography.fontFamily,
          lineHeight: typography.lineHeight.relaxed,
        }}>
          {isArabic
            ? 'اختر القسم الذي يناسب احتياجاتك للوصول السريع'
            : 'Select a module that fits your needs for quick access'}
        </p>
      </div>

      {/* Module grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: spacing[4],
        maxWidth: 1000,
        margin: '0 auto',
      }}>
        {PLATFORM_MODULES.map((module, index) => (
          <ModuleCard
            key={module.id}
            module={module}
            isArabic={isArabic}
            index={index}
          />
        ))}
      </div>

      {/* Bottom decorative line */}
      <div style={{
        marginTop: spacing[10],
        height: 1,
        background: `linear-gradient(90deg, transparent, ${colors.border.subtle}, transparent)`,
      }} />
    </section>
  );
}
