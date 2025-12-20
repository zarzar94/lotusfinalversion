import { useState, useMemo } from 'react';
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
} from './styles';
import { BrainIcon, HeadphonesIcon, CheckCircleIcon } from './Icons';


interface ProcessStep {
  id: string;
  stepNumber: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  durationEn?: string;
  durationAr?: string;
  icon: React.ReactNode;
}

// Role-specific messaging
const ROLE_MESSAGING: Record<VisitorMode, {
  focusTitleEn: string;
  focusTitleAr: string;
  focusPointsEn: string[];
  focusPointsAr: string[];
}> = {
  school: {
    focusTitleEn: 'For Educational Settings',
    focusTitleAr: 'للبيئات التعليمية',
    focusPointsEn: [
      'Group screening protocols for classroom implementation',
      'Teacher training on auditory processing awareness',
      'Progress tracking integrated with school calendars',
      'Detailed reports suitable for IEP documentation',
    ],
    focusPointsAr: [
      'بروتوكولات الفحص الجماعي للتطبيق في الفصول',
      'تدريب المعلمين على الوعي بالمعالجة السمعية',
      'تتبع التقدم المتكامل مع التقويمات المدرسية',
      'تقارير مفصلة مناسبة لوثائق الخطة التعليمية الفردية',
    ],
  },
  parent: {
    focusTitleEn: 'For Families',
    focusTitleAr: 'للعائلات',
    focusPointsEn: [
      'Non-invasive, child-friendly assessment environment',
      'Clear explanations every step of the way',
      'Home support activities provided',
      'Ongoing family guidance throughout the program',
    ],
    focusPointsAr: [
      'بيئة تقييم غير جراحية وصديقة للأطفال',
      'شروحات واضحة في كل خطوة',
      'أنشطة دعم منزلية متوفرة',
      'إرشاد عائلي مستمر طوال البرنامج',
    ],
  },
  clinician: {
    focusTitleEn: 'Clinical Protocol',
    focusTitleAr: 'البروتوكول السريري',
    focusPointsEn: [
      'Evidence-based methodology with documented outcomes',
      'Comprehensive audiometric assessment integration',
      'Professional referral pathways established',
      'Detailed clinical documentation and progress metrics',
    ],
    focusPointsAr: [
      'منهجية قائمة على الأدلة مع نتائج موثقة',
      'تكامل التقييم السمعي الشامل',
      'مسارات إحالة مهنية راسخة',
      'توثيق سريري مفصل ومقاييس التقدم',
    ],
  },
};


const PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'assessment',
    stepNumber: 1,
    titleEn: 'Initial Assessment',
    titleAr: 'التقييم الأولي',
    descriptionEn: 'Comprehensive audiogram and auditory processing evaluation',
    descriptionAr: 'مخطط سمعي شامل وتقييم المعالجة السمعية',
    durationEn: '1-2 sessions',
    durationAr: 'جلسة أو جلستان',
    icon: '📋',
  },
  {
    id: 'listening',
    stepNumber: 2,
    titleEn: 'Listening Sessions',
    titleAr: 'جلسات الاستماع',
    descriptionEn: '20 sessions of specially modulated music through high-quality headphones',
    descriptionAr: '20 جلسة من الموسيقى المعدلة خصيصاً عبر سماعات عالية الجودة',
    durationEn: '10 days (2x daily)',
    durationAr: '10 أيام (مرتين يومياً)',
    icon: <HeadphonesIcon size={20} color={brandCyan} />,
  },
  {
    id: 'break',
    stepNumber: 3,
    titleEn: 'Integration Break',
    titleAr: 'فترة التكامل',
    descriptionEn: 'Required rest period allowing the brain to integrate changes',
    descriptionAr: 'فترة راحة مطلوبة تسمح للدماغ بدمج التغييرات',
    durationEn: '3+ weeks',
    durationAr: '+3 أسابيع',
    icon: '🧠',
  },
  {
    id: 'followup',
    stepNumber: 4,
    titleEn: 'Follow-up Evaluation',
    titleAr: 'تقييم المتابعة',
    descriptionEn: 'Post-treatment audiogram and progress assessment',
    descriptionAr: 'مخطط سمعي ما بعد العلاج وتقييم التقدم',
    durationEn: '1-2 sessions',
    durationAr: 'جلسة أو جلستان',
    icon: '📊',
  },
];

export default function WhatIsAIT() {
  const { isArabic } = useLanguage();
  const { mode: visitorMode, config: visitorConfig } = useVisitorMode();
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const roleMessaging = ROLE_MESSAGING[visitorMode];

  // Sort benefits: relevant ones first

  const css = useMemo(() => `
    @keyframes aitFadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes aitPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.9; }
    }
    @keyframes stepGlow {
      0%, 100% { box-shadow: 0 0 20px ${visitorConfig.color}20; }
      50% { box-shadow: 0 0 30px ${visitorConfig.color}40; }
    }
    @keyframes progressPulse {
      0% { width: 0%; }
      100% { width: 100%; }
    }
    .ait-step-card {
      transition: all 0.3s ease;
    }
    .ait-step-card:hover {
      transform: translateX(${isArabic ? '-8px' : '8px'});
    }
    .ait-step-active {
      background: linear-gradient(135deg, ${visitorConfig.color}15, ${visitorConfig.color}05) !important;
      border-color: ${visitorConfig.color}50 !important;
    }
    @media (max-width: 768px) {
      .ait-two-column {
        flex-direction: column !important;
      }
    }
  `, [visitorConfig.color, isArabic]);

  return (
    <section
      id="what-is-ait"
      style={{
        padding: `${spacing[12]}px ${spacing[4]}px`,
        background: 'linear-gradient(180deg, rgba(5,6,13,0.95) 0%, rgba(11,15,28,0.98) 50%, rgba(5,6,13,0.95) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{css}</style>

      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-10%',
        width: 400,
        height: 400,
        background: `radial-gradient(circle, ${brandPurple}10, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-5%',
        width: 300,
        height: 300,
        background: `radial-gradient(circle, ${brandCyan}10, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: spacing[10] }}>
          {/* Medical badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
            border: `1px solid ${brandCyan}30`,
            borderRadius: 30,
            marginBottom: spacing[4],
          }}>
            <span style={{ fontSize: 18 }}>🏥</span>
            <span style={{
              fontSize: typography.size.sm,
              fontWeight: typography.weight.bold,
              color: brandCyan,
            }}>
              {isArabic ? 'علاج قائم على الأدلة' : 'Evidence-Based Therapy'}
            </span>
          </div>

          <h2 style={{
            margin: 0,
            fontSize: typography.size['3xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
            marginBottom: spacing[3],
            lineHeight: 1.2,
          }}>
            {isArabic ? 'ما هو برنامج بيرارد AIT؟' : 'What is Bérard AIT?'}
          </h2>
          <p style={{
            margin: 0,
            fontSize: typography.size.lg,
            color: colors.text.secondary,
            maxWidth: 700,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}>
            {isArabic
              ? 'برنامج العلاج التكاملي السمعي بطريقة بيرارد - تقنية متخصصة لتحسين المعالجة السمعية والتعلم'
              : 'Bérard Auditory Integration Training - A specialized technique for improving auditory processing and learning'}
          </p>
        </div>

        {/* Two-column layout: Overview + Role Focus */}
        <div
          className="ait-two-column"
          style={{
            display: 'flex',
            gap: spacing[6],
            marginBottom: spacing[10],
          }}
        >
          {/* Left: Overview */}
          <div style={{
            flex: 1,
            padding: spacing[6],
            background: 'rgba(11,15,28,0.6)',
            borderRadius: radius.xl,
            border: `1px solid ${colors.border.subtle}`,
          }}>
            <h3 style={{
              margin: 0,
              fontSize: typography.size.xl,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
              marginBottom: spacing[4],
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}>
              <BrainIcon size={24} color={brandCyan} />
              {isArabic ? 'نظرة عامة' : 'Overview'}
            </h3>
            <div style={{
              fontSize: typography.size.base,
              color: colors.text.secondary,
              lineHeight: 1.8,
            }}>
              <p style={{ margin: `0 0 ${spacing[3]}px` }}>
                {isArabic
                  ? 'طوّر الدكتور جاي بيرارد هذه الطريقة في فرنسا، وهي تستخدم موسيقى معدلة إلكترونياً تُسمع عبر سماعات عالية الجودة لإعادة تدريب الجهاز السمعي.'
                  : 'Developed by Dr. Guy Bérard in France, this method uses electronically modulated music delivered through high-quality headphones to retrain the auditory system.'}
              </p>
              <p style={{ margin: 0 }}>
                {isArabic
                  ? 'يساعد البرنامج في معالجة مشاكل المعالجة السمعية، والحساسية للأصوات، وصعوبات الانتباه والتركيز المرتبطة بالسمع.'
                  : 'The program helps address auditory processing issues, sound sensitivities, and attention difficulties related to hearing.'}
              </p>
            </div>

            {/* Quick stats */}
            <div style={{
              display: 'flex',
              gap: spacing[4],
              marginTop: spacing[5],
              padding: spacing[4],
              background: 'rgba(0,0,0,0.3)',
              borderRadius: radius.lg,
            }}>
              {[
                { value: '40+', labelEn: 'Years of Research', labelAr: 'سنة من البحث' },
                { value: '50+', labelEn: 'Countries', labelAr: 'دولة' },
                { value: '1000s', labelEn: 'Success Stories', labelAr: 'قصة نجاح' },
              ].map((stat, idx) => (
                <div key={idx} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    fontSize: typography.size.xl,
                    fontWeight: typography.weight.black,
                    color: brandCyan,
                    fontFamily: 'monospace',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: typography.size.xs,
                    color: colors.text.muted,
                  }}>
                    {isArabic ? stat.labelAr : stat.labelEn}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Role-specific focus */}
          <div style={{
            flex: 1,
            padding: spacing[6],
            background: `linear-gradient(135deg, ${visitorConfig.color}10, ${visitorConfig.color}05)`,
            borderRadius: radius.xl,
            border: `1px solid ${visitorConfig.color}30`,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              marginBottom: spacing[4],
            }}>
              <div style={{
                padding: '6px 12px',
                background: `${visitorConfig.color}20`,
                borderRadius: radius.lg,
                fontSize: typography.size.xs,
                fontWeight: typography.weight.bold,
                color: visitorConfig.color,
                border: `1px solid ${visitorConfig.color}40`,
              }}>
                {visitorConfig.icon} {isArabic ? visitorConfig.labelAr : visitorConfig.label}
              </div>
            </div>

            <h3 style={{
              margin: 0,
              fontSize: typography.size.xl,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
              marginBottom: spacing[4],
            }}>
              {isArabic ? roleMessaging.focusTitleAr : roleMessaging.focusTitleEn}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
              {(isArabic ? roleMessaging.focusPointsAr : roleMessaging.focusPointsEn).map((point, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: spacing[3],
                    padding: spacing[3],
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: radius.lg,
                    animation: `aitFadeIn 0.5s ease-out ${idx * 0.1}s backwards`,
                  }}
                >
                  <CheckCircleIcon
                    size={18}
                    color={visitorConfig.color}
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                  <span style={{
                    fontSize: typography.size.sm,
                    color: colors.text.secondary,
                    lineHeight: 1.5,
                  }}>
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The Process */}
        <div style={{ marginBottom: spacing[10] }}>
          <h3 style={{
            textAlign: 'center',
            margin: 0,
            fontSize: typography.size.xl,
            fontWeight: typography.weight.bold,
            color: colors.text.primary,
            marginBottom: spacing[6],
          }}>
            {isArabic ? 'كيف يعمل البرنامج؟' : 'How Does It Work?'}
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[3],
            maxWidth: 800,
            margin: '0 auto',
          }}>
            {PROCESS_STEPS.map((step, idx) => {
              const isActive = activeStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`ait-step-card ${isActive ? 'ait-step-active' : ''}`}
                  onMouseEnter={() => setActiveStep(step.id)}
                  onMouseLeave={() => setActiveStep(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[4],
                    padding: spacing[4],
                    background: 'rgba(11,15,28,0.6)',
                    borderRadius: radius.lg,
                    border: `1px solid ${colors.border.subtle}`,
                    cursor: 'pointer',
                    animation: `aitFadeIn 0.5s ease-out ${idx * 0.15}s backwards`,
                  }}
                >
                  {/* Step number */}
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: radius.lg,
                    background: isActive
                      ? `linear-gradient(135deg, ${visitorConfig.color}, ${visitorConfig.color}cc)`
                      : `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}15)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: typography.size.lg,
                    fontWeight: typography.weight.black,
                    color: isActive ? '#fff' : brandCyan,
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                  }}>
                    {typeof step.icon === 'string' ? step.icon : step.stepNumber}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: typography.weight.bold,
                      fontSize: typography.size.base,
                      color: colors.text.primary,
                      marginBottom: 4,
                    }}>
                      {isArabic ? step.titleAr : step.titleEn}
                    </div>
                    <div style={{
                      fontSize: typography.size.sm,
                      color: colors.text.muted,
                      lineHeight: 1.4,
                    }}>
                      {isArabic ? step.descriptionAr : step.descriptionEn}
                    </div>
                  </div>

                  {/* Duration badge */}
                  {step.durationEn && (
                    <div style={{
                      padding: '6px 12px',
                      background: isActive ? `${visitorConfig.color}20` : 'rgba(0,0,0,0.3)',
                      borderRadius: radius.md,
                      fontSize: typography.size.xs,
                      fontWeight: typography.weight.bold,
                      color: isActive ? visitorConfig.color : colors.text.muted,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s ease',
                    }}>
                      {isArabic ? step.durationAr : step.durationEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        </div>
    </section>
  );
}
