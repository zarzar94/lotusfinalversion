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
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

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
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    const target = document.getElementById(module.targetId);
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
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
// PLATFORM METRICS - Dashboard stats
// ═══════════════════════════════════════════════════════════════════════════

type PlatformMetric = {
  id: string;
  valueAr: string;
  valueEn: string;
  labelAr: string;
  labelEn: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
};

const PLATFORM_METRICS: PlatformMetric[] = [
  {
    id: 'sessions',
    valueAr: '20',
    valueEn: '20',
    labelAr: 'جلسة علاجية',
    labelEn: 'Sessions',
    icon: '🎧',
    color: brandCyan,
  },
  {
    id: 'success',
    valueAr: '92%',
    valueEn: '92%',
    labelAr: 'نسبة التحسن',
    labelEn: 'Success Rate',
    icon: '📈',
    color: '#22c55e',
    trend: 'up',
  },
  {
    id: 'cases',
    valueAr: '+500',
    valueEn: '500+',
    labelAr: 'حالة ناجحة',
    labelEn: 'Cases',
    icon: '✓',
    color: brandPurple,
  },
  {
    id: 'experience',
    valueAr: '+10',
    valueEn: '10+',
    labelAr: 'سنوات خبرة',
    labelEn: 'Years Exp.',
    icon: '⭐',
    color: brandPink,
  },
];

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
        @keyframes countUp {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes dataFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Section header */}
      <div style={{
        textAlign: 'center',
        marginBottom: spacing[6],
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

      {/* ═══ METRICS ROW - Clinical Dashboard Stats ═══ */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: spacing[3],
        maxWidth: 800,
        margin: `0 auto ${spacing[8]}px`,
        padding: spacing[4],
        background: `linear-gradient(135deg, rgba(11,15,28,0.8), rgba(20,26,45,0.6))`,
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius.xl,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated data flow line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${brandCyan}60, ${brandPurple}60, ${brandPink}60, transparent)`,
          backgroundSize: '200% 100%',
          animation: 'dataFlow 4s ease-in-out infinite',
        }} />

        {PLATFORM_METRICS.map((metric, index) => (
          <div
            key={metric.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2.5],
              padding: `${spacing[2.5]}px ${spacing[4]}px`,
              background: `linear-gradient(135deg, ${metric.color}08, transparent)`,
              border: `1px solid ${metric.color}20`,
              borderRadius: radius.lg,
              animation: `countUp 0.5s ease-out ${index * 0.1}s both`,
              minWidth: 140,
            }}
          >
            {/* Icon */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: radius.md,
              background: `linear-gradient(135deg, ${metric.color}20, ${metric.color}08)`,
              border: `1px solid ${metric.color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              {metric.icon}
            </div>

            {/* Value and label */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[1],
              }}>
                <span style={{
                  fontSize: typography.size.xl,
                  fontWeight: typography.weight.black,
                  color: metric.color,
                  fontFamily: 'monospace',
                  letterSpacing: -1,
                }}>
                  {isArabic ? metric.valueAr : metric.valueEn}
                </span>
                {metric.trend === 'up' && (
                  <span style={{ color: '#22c55e', fontSize: 12 }}>↑</span>
                )}
              </div>
              <div style={{
                fontSize: typography.size.xs,
                color: colors.text.muted,
                marginTop: 2,
              }}>
                {isArabic ? metric.labelAr : metric.labelEn}
              </div>
            </div>
          </div>
        ))}

        {/* System status indicator */}
        <div style={{
          position: 'absolute',
          bottom: spacing[2],
          [isArabic ? 'left' : 'right']: spacing[3],
          display: 'flex',
          alignItems: 'center',
          gap: spacing[1.5],
          fontSize: typography.size.xs,
          color: colors.text.muted,
        }}>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 8px #22c55e',
            animation: 'pulseGlow 2s ease-in-out infinite',
          }} />
          <span>{isArabic ? 'النظام متصل' : 'System Online'}</span>
        </div>
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
