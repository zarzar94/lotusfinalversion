import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  brandCyan,
  brandPink,
  brandPurple,
  colors,
  gradients,
  radius,
  shadows,
  spacing,
  typography,
} from './styles';

// Futuristic journey flow for the landing page
// Keeps everything inline to align with existing design tokens

type JourneyStep = {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  path: string;
  accent: string;
  tags: { en: string; ar: string }[];
  outcome: { en: string; ar: string };
};

const steps: JourneyStep[] = [
  {
    id: 'intake',
    title: 'Discovery Intake',
    titleAr: 'auto.ExperienceJourney.k10',
    description: 'Share goals and sensory priorities in a secure, guided intake.',
    descriptionAr: 'auto.ExperienceJourney.k11',
    path: '/contact',
    accent: brandCyan,
    tags: [
      { en: 'Secure intake', ar: 'auto.ExperienceJourney.k18' },
      { en: '2-min form', ar: 'auto.ExperienceJourney.k19' },
      { en: 'Signal check', ar: 'auto.ExperienceJourney.k20' },
    ],
    outcome: {
      en: 'We tailor your Berard AIT path using your stated goals.',
      ar: 'auto.ExperienceJourney.k21',
    },
  },
  {
    id: 'assessment',
    title: 'Neuro Assessment',
    titleAr: 'auto.ExperienceJourney.k12',
    description: 'Run the immersive self-assessment to map focus, sound, and balance.',
    descriptionAr: 'auto.ExperienceJourney.k13',
    path: '/assessment',
    accent: brandPurple,
    tags: [
      { en: 'Interactive games', ar: 'auto.ExperienceJourney.k22' },
      { en: 'Adaptive scoring', ar: 'auto.ExperienceJourney.k23' },
      { en: 'Guided steps', ar: 'auto.ExperienceJourney.k24' },
    ],
    outcome: {
      en: 'Generates a precision profile for your training blocks.',
      ar: 'auto.ExperienceJourney.k25',
    },
  },
  {
    id: 'program',
    title: 'Precision Program',
    titleAr: 'auto.ExperienceJourney.k14',
    description: 'Lock in your 20-session Berard AIT protocol with crystal-clear milestones.',
    descriptionAr: 'auto.ExperienceJourney.k15',
    path: '/program',
    accent: brandPink,
    tags: [
      { en: '20 sessions', ar: 'auto.ExperienceJourney.k26' },
      { en: 'Calibrated audio', ar: 'auto.ExperienceJourney.k27' },
      { en: 'Lab-grade pacing', ar: 'auto.ExperienceJourney.k28' },
    ],
    outcome: {
      en: 'Every milestone is pre-mapped so you always know what is next.',
      ar: 'auto.ExperienceJourney.k29',
    },
  },
  {
    id: 'insights',
    title: 'Evidence & Insights',
    titleAr: 'auto.ExperienceJourney.k16',
    description: 'Track change with dashboards, exportables, and research-aligned markers.',
    descriptionAr: 'auto.ExperienceJourney.k17',
    path: '/results',
    accent: '#22c55e',
    tags: [
      { en: 'Live dashboards', ar: 'auto.ExperienceJourney.k30' },
      { en: 'Clinician ready', ar: 'auto.ExperienceJourney.k31' },
      { en: 'Shareable PDF', ar: 'auto.ExperienceJourney.k32' },
    ],
    outcome: {
      en: 'Celebrate wins and loop your clinician in with one click.',
      ar: 'auto.ExperienceJourney.k33',
    },
  },
];

export function ExperienceJourney({ isArabic }: { isArabic: boolean }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState<string>(steps[0].id);

  const activeStep = useMemo(() => steps.find((s) => s.id === activeId) ?? steps[0], [activeId]);

  const header = useMemo(
    () =>
      isArabic
        ? {
            badge: 'رحلة تجربة مختبرية',
            title: 'تدفق تجربة مستقبلي من الخطوة الأولى حتى التتبع',
            subtitle:
              'صممنا رحلة Berard AIT لتكون متناسقة مع هوية المختبر، واضحة، وذات تأثير فوري على المستخدم.',
            cta: 'ابدأ من هنا',
          }
        : {
            badge: 'Lab-grade journey',
            title: 'Futuristic, end-to-end flow from first click to insights',
            subtitle:
              'We designed the Berard AIT journey to feel cohesive, branded, and immediately actionable.',
            cta: 'Start here',
          },
    [isArabic]
  );

  const alignment = isArabic ? ('flex-end' as const) : ('flex-start' as const);

  return (
    <section
      aria-labelledby="journey-title"
      style={{
        position: 'relative',
        margin: `0 auto ${spacing[10]}px`,
        padding: `${spacing[10]}px ${spacing[4]}px`,
        maxWidth: 1200,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius['2xl'],
          background: `radial-gradient(circle at 20% 20%, ${brandCyan}14, transparent 30%),
            radial-gradient(circle at 80% 0%, ${brandPink}12, transparent 35%),
            ${gradients.grid}`,
          border: `1px solid ${colors.border.subtle}`,
          filter: 'drop-shadow(0 30px 120px rgba(0,0,0,0.35))',
        }}
      />

      <div
        style={{
          position: 'relative',
          padding: `${spacing[8]}px ${spacing[6]}px`,
          borderRadius: radius['2xl'],
          overflow: 'hidden',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          background: 'rgba(5, 6, 13, 0.85)',
          border: `1px solid ${colors.border.default}`,
          boxShadow: `${shadows.xl}, inset 0 0 0 1px rgba(255,255,255,0.02)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: spacing[6],
            alignItems: 'flex-start',
            flexDirection: isArabic ? 'row-reverse' : 'row',
          }}
        >
          <div style={{ flex: 1, textAlign: isArabic ? 'right' : 'left' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[1.5]}px ${spacing[4]}px`,
                background: `linear-gradient(135deg, ${brandCyan}18, ${brandPurple}10)`,
                border: `1px solid ${brandCyan}25`,
                borderRadius: radius.full,
                fontSize: typography.size.xs,
                letterSpacing: typography.letterSpacing.wide,
                color: brandCyan,
                textTransform: 'uppercase',
              }}
            >
              <span role="img" aria-hidden>
                🚀
              </span>
              {header.badge}
            </div>

            <h2
              id="journey-title"
              style={{
                margin: `${spacing[3]}px 0 ${spacing[2]}px`,
                fontSize: typography.size['3xl'],
                fontWeight: typography.weight.black,
                color: colors.text.primary,
                background: `linear-gradient(120deg, ${colors.text.primary}, ${brandCyan})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: typography.lineHeight.tight,
              }}
            >
              {header.title}
            </h2>
            <p
              style={{
                margin: 0,
                maxWidth: 560,
                color: colors.text.secondary,
                lineHeight: typography.lineHeight.relaxed,
                fontSize: typography.size.lg,
              }}
            >
              {header.subtitle}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: spacing[3],
              alignItems: 'stretch',
              flexWrap: 'wrap',
              justifyContent: alignment,
              minWidth: 260,
            }}
          >
            <div
              style={{
                padding: `${spacing[4]}px ${spacing[4]}px`,
                borderRadius: radius.lg,
                border: `1px solid ${colors.border.default}`,
                background: 'rgba(255,255,255,0.02)',
                color: colors.text.primary,
                minWidth: 220,
                boxShadow: shadows.glow.cyan,
              }}
            >
              <div style={{ fontSize: typography.size.md, color: colors.text.muted, marginBottom: spacing[1] }}>
                {t('auto.ExperienceJourney.k1', "Designed moments")}
              </div>
              <div style={{ fontSize: typography.size['2xl'], fontWeight: typography.weight.black }}>
                {t('auto.ExperienceJourney.k2', "4 phases")}
              </div>
              <div style={{ color: colors.text.secondary, marginTop: spacing[1] }}>
                {t('auto.ExperienceJourney.k3', "Every stage carries the lab identity with explicit next actions.")}
              </div>
            </div>
            <div
              style={{
                padding: `${spacing[4]}px ${spacing[4]}px`,
                borderRadius: radius.lg,
                border: `1px solid ${colors.border.default}`,
                background: 'rgba(255,255,255,0.02)',
                color: colors.text.primary,
                minWidth: 220,
                boxShadow: shadows.glow.purple,
              }}
            >
              <div style={{ fontSize: typography.size.md, color: colors.text.muted, marginBottom: spacing[1] }}>
                {t('auto.ExperienceJourney.k4', "Transition time")}
              </div>
              <div style={{ fontSize: typography.size['2xl'], fontWeight: typography.weight.black }}>
                {t('auto.ExperienceJourney.k5', "<10 seconds")}
              </div>
              <div style={{ color: colors.text.secondary, marginTop: spacing[1] }}>
                {t('auto.ExperienceJourney.k6', "Clear CTA on every step to accelerate the journey.")}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: spacing[4],
            marginTop: spacing[7],
          }}
        >
          {steps.map((step, index) => {
            const isActive = step.id === activeId;
            return (
              <div
                key={step.id}
                onClick={() => setActiveId(step.id)}
                onMouseEnter={() => setActiveId(step.id)}
                onFocus={() => setActiveId(step.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveId(step.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                style={{
                  textAlign: isArabic ? 'right' : 'left',
                  background: isActive
                    ? `linear-gradient(145deg, ${step.accent}20, rgba(255,255,255,0.02))`
                    : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isActive ? step.accent : colors.border.default}`,
                  borderRadius: radius.xl,
                  padding: `${spacing[5]}px`,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 220ms ease, border-color 200ms ease, box-shadow 240ms ease',
                  transform: isActive ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
                  boxShadow: isActive ? `${shadows.lg}, 0 0 0 1px ${step.accent}40` : shadows.sm,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at ${isArabic ? '100% 0%' : '0% 0%'}, ${step.accent}15, transparent 45%)`,
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 200ms ease',
                  }}
                />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: isArabic ? 'row-reverse' : 'row',
                      gap: spacing[3],
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: radius.lg,
                        border: `1px solid ${step.accent}66`,
                        background: `${step.accent}18`,
                        display: 'grid',
                        placeItems: 'center',
                        color: colors.text.primary,
                        fontWeight: typography.weight.black,
                        fontSize: typography.size.md,
                        boxShadow: `0 8px 24px ${step.accent}30`,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: typography.size['2xl'],
                          color: colors.text.primary,
                          fontWeight: typography.weight.extrabold,
                        }}
                      >
                        {isArabic ? t(step.titleAr, step.title) : step.title}
                      </h3>
                      <p
                        style={{
                          margin: `${spacing[1]}px 0 0`,
                          color: colors.text.secondary,
                          lineHeight: typography.lineHeight.relaxed,
                          fontSize: typography.size.md,
                        }}
                      >
                        {isArabic ? t(step.descriptionAr, step.description) : step.description}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: spacing[2],
                      flexWrap: 'wrap',
                      marginTop: spacing[4],
                      justifyContent: alignment,
                    }}
                  >
                    {step.tags.map((tag) => (
                      <span
                        key={tag.en}
                        style={{
                          padding: `${spacing[1]}px ${spacing[2.5]}px`,
                          borderRadius: radius.full,
                          background: `${step.accent}18`,
                          border: `1px solid ${step.accent}40`,
                          color: colors.text.primary,
                          fontSize: typography.size.sm,
                        }}
                      >
                        {isArabic ? t(tag.ar, tag.en) : tag.en}
                      </span>
                    ))}
                  </div>

                  <div
                    style={{
                      marginTop: spacing[4],
                      color: colors.text.muted,
                      fontSize: typography.size.sm,
                      lineHeight: typography.lineHeight.normal,
                    }}
                  >
                    {isArabic ? t(step.outcome.ar, step.outcome.en) : step.outcome.en}
                  </div>

                  <div
                    style={{
                      marginTop: spacing[5],
                      display: 'flex',
                      justifyContent: alignment,
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(step.path);
                      }}
                      style={{
                        padding: `${spacing[2.5]}px ${spacing[4]}px`,
                        borderRadius: radius.full,
                        border: 'none',
                        background: `linear-gradient(135deg, ${step.accent}, ${brandCyan})`,
                        color: '#05060d',
                        fontWeight: typography.weight.bold,
                        cursor: 'pointer',
                        boxShadow: `0 12px 30px ${step.accent}35`,
                        transition: 'transform 160ms ease, box-shadow 200ms ease',
                      }}
                    >
                      {t('auto.ExperienceJourney.k7', "Go to step")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: spacing[6],
            display: 'flex',
            gap: spacing[4],
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            flexDirection: isArabic ? 'row-reverse' : 'row',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              color: colors.text.secondary,
              fontSize: typography.size.md,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: radius.full,
                background: `${brandCyan}18`,
                border: `1px solid ${brandCyan}40`,
                display: 'grid',
                placeItems: 'center',
                color: colors.text.primary,
                boxShadow: shadows.glow.cyan,
              }}
            >
              ⌁
            </div>
            <div>
              <div style={{ color: colors.text.primary, fontWeight: typography.weight.bold }}>
                {t('auto.ExperienceJourney.k8', "Consistent transitions")}
              </div>
              <div style={{ color: colors.text.muted }}>
                {t('auto.ExperienceJourney.k9', "Every CTA routes you forward without losing the futuristic lab visual language.")}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(activeStep.path)}
            style={{
              padding: `${spacing[3]}px ${spacing[6]}px`,
              borderRadius: radius.full,
              background: `linear-gradient(120deg, ${brandPurple}, ${brandCyan})`,
              border: 'none',
              color: '#05060d',
              fontWeight: typography.weight.black,
              fontSize: typography.size.lg,
              cursor: 'pointer',
              boxShadow: shadows.glow.purple,
              transition: 'transform 160ms ease, box-shadow 200ms ease',
            }}
          >
            {header.cta}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ExperienceJourney;
