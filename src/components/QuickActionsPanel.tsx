import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVisitorMode, type VisitorMode } from '../context/VisitorModeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  brandCyan,
  brandPurple,
  brandPink,
  typography,
  spacing,
  radius,
  transitions,
  colors,
} from './styles';
import {
  BrainCircuitIcon,
  HeadsetIcon,
  DownloadIcon,
  ReportIcon,
  ShieldMedicalIcon,
  SchoolIcon,
  ClinicianIcon,
  ParentIcon,
  WaveformIcon,
} from './icons/index';

// Quick action configuration per visitor mode
interface QuickAction {
  id: string;
  icon: React.ReactNode;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  linkTo: string;
  isPrimary?: boolean;
  isExternal?: boolean;
  downloadFile?: string;
}

interface ModeQuickActions {
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  actions: QuickAction[];
}

const QUICK_ACTIONS: Record<VisitorMode, ModeQuickActions> = {
  school: {
    titleEn: 'School Quick Actions',
    titleAr: 'إجراءات سريعة للمدارس',
    subtitleEn: 'Get started with your school screening program',
    subtitleAr: 'ابدأ برنامج الفحص المدرسي الخاص بك',
    actions: [
      {
        id: 'demo',
        icon: <SchoolIcon size={24} tone="warning" />,
        titleEn: 'Request School Demo',
        titleAr: 'طلب عرض تجريبي للمدرسة',
        descriptionEn: 'Schedule a presentation for your administration',
        descriptionAr: 'جدولة عرض تقديمي للإدارة',
        linkTo: '/contact',
        isPrimary: true,
      },
      {
        id: 'pilot',
        icon: <DownloadIcon size={24} tone="warning" />,
        titleEn: 'Download Pilot Kit',
        titleAr: 'تحميل ملف البرنامج التجريبي',
        descriptionEn: 'Get our school partnership materials',
        descriptionAr: 'احصل على مواد شراكة المدارس',
        linkTo: '/downloads/school-pilot-kit.pdf',
        isExternal: true,
        downloadFile: 'school-pilot-kit.pdf',
      },
      {
        id: 'assess',
        icon: <BrainCircuitIcon size={24} tone="warning" />,
        titleEn: 'Try Group Screening',
        titleAr: 'جرب الفحص الجماعي',
        descriptionEn: 'Preview our classroom assessment tools',
        descriptionAr: 'معاينة أدوات التقييم الصفي',
        linkTo: '/assessment',
      },
      {
        id: 'results',
        icon: <ReportIcon size={24} tone="warning" />,
        titleEn: 'View Sample Reports',
        titleAr: 'عرض تقارير نموذجية',
        descriptionEn: 'See what school reports look like',
        descriptionAr: 'شاهد شكل التقارير المدرسية',
        linkTo: '/results',
      },
    ],
  },
  parent: {
    titleEn: 'Parent Quick Actions',
    titleAr: 'إجراءات سريعة للأهل',
    subtitleEn: 'Start your child\'s auditory assessment journey',
    subtitleAr: 'ابدأ رحلة التقييم السمعي لطفلك',
    actions: [
      {
        id: 'screening',
        icon: <ParentIcon size={24} tone="purple" />,
        titleEn: 'Book Free Screening',
        titleAr: 'حجز فحص مجاني',
        descriptionEn: 'Schedule your child\'s initial assessment',
        descriptionAr: 'جدولة التقييم الأولي لطفلك',
        linkTo: '/contact',
        isPrimary: true,
      },
      {
        id: 'checklist',
        icon: <ReportIcon size={24} tone="purple" />,
        titleEn: 'Take Checklist',
        titleAr: 'إجراء قائمة الفحص',
        descriptionEn: 'Complete our auditory processing questionnaire',
        descriptionAr: 'أكمل استبيان المعالجة السمعية',
        linkTo: '/assessment#checklist',
      },
      {
        id: 'soundlab',
        icon: <HeadsetIcon size={24} tone="purple" />,
        titleEn: 'Try Sound Lab',
        titleAr: 'جرب مختبر الصوت',
        descriptionEn: 'Interactive auditory exploration games',
        descriptionAr: 'ألعاب استكشاف سمعي تفاعلية',
        linkTo: '/assessment#games',
      },
      {
        id: 'program',
        icon: <ShieldMedicalIcon size={24} tone="pink" />,
        titleEn: 'Learn About Program',
        titleAr: 'تعرف على البرنامج',
        descriptionEn: 'Understand how Bérard AIT works',
        descriptionAr: 'افهم كيف يعمل برنامج بيرارد',
        linkTo: '/program',
      },
    ],
  },
  clinician: {
    titleEn: 'Clinician Quick Actions',
    titleAr: 'إجراءات سريعة للمختصين',
    subtitleEn: 'Professional resources and referral pathways',
    subtitleAr: 'موارد مهنية ومسارات الإحالة',
    actions: [
      {
        id: 'protocol',
        icon: <BrainCircuitIcon size={24} tone="purple" />,
        titleEn: 'View Clinical Protocol',
        titleAr: 'عرض البروتوكول السريري',
        descriptionEn: 'Review our evidence-based methodology',
        descriptionAr: 'مراجعة منهجيتنا القائمة على الأدلة',
        linkTo: '/science',
        isPrimary: true,
      },
      {
        id: 'referral',
        icon: <ClinicianIcon size={24} tone="pink" />,
        titleEn: 'Referral Partnership',
        titleAr: 'شراكة الإحالة',
        descriptionEn: 'Establish a professional referral relationship',
        descriptionAr: 'إنشاء علاقة إحالة مهنية',
        linkTo: '/contact',
      },
      {
        id: 'research',
        icon: <ReportIcon size={24} tone="pink" />,
        titleEn: 'Research & Evidence',
        titleAr: 'الأبحاث والأدلة',
        descriptionEn: 'Access studies and clinical documentation',
        descriptionAr: 'الوصول للدراسات والتوثيق السريري',
        linkTo: '/science',
      },
      {
        id: 'results',
        icon: <WaveformIcon size={24} tone="pink" />,
        titleEn: 'Clinical Outcomes',
        titleAr: 'النتائج السريرية',
        descriptionEn: 'Review documented improvement metrics',
        descriptionAr: 'مراجعة مقاييس التحسن الموثقة',
        linkTo: '/results',
      },
    ],
  },
};

export default function QuickActionsPanel() {
  const { mode: visitorMode, config: visitorConfig } = useVisitorMode();
  const { isArabic } = useLanguage();
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const modeActions = QUICK_ACTIONS[visitorMode];

  const css = useMemo(() => `
    @keyframes quickActionSlide {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmerBorder {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .quick-action-card {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .quick-action-card:hover {
      transform: translateY(-6px) scale(1.02);
    }
    .quick-action-primary {
      background: linear-gradient(135deg, ${visitorConfig.color}, ${visitorConfig.color}cc) !important;
    }
    .quick-action-primary::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 18px;
      background: linear-gradient(90deg, ${visitorConfig.color}, ${brandCyan}, ${brandPurple}, ${visitorConfig.color});
      background-size: 300% 300%;
      animation: shimmerBorder 4s ease infinite;
      z-index: -1;
      opacity: 0.5;
    }
    @media (max-width: 640px) {
      .quick-actions-grid {
        grid-template-columns: 1fr !important;
      }
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      .quick-actions-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
  `, [visitorConfig.color]);

  return (
    <section style={{
      padding: `${spacing[10]}px ${spacing[4]}px`,
      background: 'linear-gradient(180deg, rgba(11,15,28,0.4) 0%, rgba(5,6,13,0.6) 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{css}</style>

      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 600,
        background: `radial-gradient(circle, ${visitorConfig.color}08, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: spacing[8] }}>
          {/* Mode badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            background: `${visitorConfig.color}15`,
            border: `1px solid ${visitorConfig.color}30`,
            borderRadius: 30,
            marginBottom: spacing[3],
          }}>
            <span style={{ fontSize: 18 }}>{visitorConfig.icon}</span>
            <span style={{
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
              color: visitorConfig.color,
            }}>
              {isArabic ? visitorConfig.labelAr : visitorConfig.label}
            </span>
          </div>

          <h2 style={{
            margin: 0,
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
            marginBottom: spacing[2],
          }}>
            {isArabic ? modeActions.titleAr : modeActions.titleEn}
          </h2>
          <p style={{
            margin: 0,
            fontSize: typography.size.base,
            color: colors.text.secondary,
          }}>
            {isArabic ? modeActions.subtitleAr : modeActions.subtitleEn}
          </p>
        </div>

        {/* Actions Grid */}
        <div
          className="quick-actions-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: spacing[4],
          }}
        >
          {modeActions.actions.map((action, index) => {
            const isHovered = hoveredAction === action.id;
            const isPrimary = action.isPrimary;

            const cardContent = (
              <div
                className={`quick-action-card ${isPrimary ? 'quick-action-primary' : ''}`}
                onMouseEnter={() => setHoveredAction(action.id)}
                onMouseLeave={() => setHoveredAction(null)}
                style={{
                  position: 'relative',
                  padding: spacing[5],
                  borderRadius: 16,
                  background: isPrimary
                    ? `linear-gradient(135deg, ${visitorConfig.color}, ${visitorConfig.color}cc)`
                    : 'rgba(11,15,28,0.7)',
                  border: `1px solid ${isPrimary ? 'transparent' : isHovered ? visitorConfig.color + '50' : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: spacing[3],
                  animation: `quickActionSlide 0.5s ease-out ${index * 0.1}s backwards`,
                  boxShadow: isHovered
                    ? `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${visitorConfig.color}20`
                    : isPrimary
                      ? `0 10px 30px ${visitorConfig.color}30`
                      : '0 4px 20px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'inherit',
                  height: '100%',
                  minHeight: 180,
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: isPrimary
                    ? 'rgba(255,255,255,0.2)'
                    : `linear-gradient(135deg, ${visitorConfig.color}25, ${visitorConfig.color}10)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  color: isPrimary ? '#fff' : visitorConfig.color,
                  transition: 'transform 0.3s ease',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                }}>
                  {typeof action.icon === 'string' ? action.icon : action.icon}
                </div>

                {/* Title */}
                <div style={{
                  fontWeight: typography.weight.bold,
                  fontSize: typography.size.base,
                  color: isPrimary ? '#fff' : colors.text.primary,
                  lineHeight: 1.3,
                }}>
                  {isArabic ? action.titleAr : action.titleEn}
                </div>

                {/* Description */}
                <div style={{
                  fontSize: typography.size.xs,
                  color: isPrimary ? 'rgba(255,255,255,0.8)' : colors.text.muted,
                  lineHeight: 1.5,
                  flex: 1,
                }}>
                  {isArabic ? action.descriptionAr : action.descriptionEn}
                </div>

                {/* Arrow indicator */}
                <div style={{
                  fontSize: 16,
                  color: isPrimary ? 'rgba(255,255,255,0.7)' : visitorConfig.color,
                  transform: isHovered ? 'translateX(-4px)' : 'translateX(0)',
                  transition: 'transform 0.3s ease',
                }}>
                  {isArabic ? '←' : '→'}
                </div>

                {/* Primary badge */}
                {isPrimary && (
                  <div style={{
                    position: 'absolute',
                    top: -10,
                    right: isArabic ? 'auto' : -10,
                    left: isArabic ? -10 : 'auto',
                    padding: '4px 10px',
                    background: '#fff',
                    borderRadius: 8,
                    fontSize: 10,
                    fontWeight: 800,
                    color: visitorConfig.color,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}>
                    {isArabic ? 'موصى به' : 'Recommended'}
                  </div>
                )}
              </div>
            );

            // Render as Link or anchor based on action type
            if (action.isExternal || action.downloadFile) {
              return (
                <a
                  key={action.id}
                  href={action.linkTo}
                  download={action.downloadFile}
                  target={action.isExternal ? '_blank' : undefined}
                  rel={action.isExternal ? 'noopener noreferrer' : undefined}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <Link
                key={action.id}
                to={action.linkTo}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>

        {/* Bottom hint */}
        <div style={{
          marginTop: spacing[6],
          textAlign: 'center',
          fontSize: typography.size.xs,
          color: colors.text.muted,
        }}>
          {isArabic
            ? 'يمكنك تغيير وضع التصفح من القائمة العلوية'
            : 'You can switch browsing mode from the top navigation'
          }
        </div>
      </div>
    </section>
  );
}
