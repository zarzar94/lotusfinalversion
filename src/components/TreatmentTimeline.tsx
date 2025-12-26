import { useState, useEffect, useRef } from 'react';
import { brandCyan, brandPink, brandPurple, brandPurpleDark, styles } from './styles';
import LabButtonAnchor from './labui/LabButtonAnchor';
import { useLanguage } from '../context/LanguageContext';

const timelineSteps = [
  {
    day: 1,
    title: 'التقييم الأولي',
    titleEn: 'Initial Assessment',
    description: 'اختبار سمعي شامل وتحديد الترددات المستهدفة',
    descriptionEn: 'Comprehensive hearing test to establish baseline',
    icon: '🔬',
    color: brandCyan,
    details: ['فحص الأذن', 'اختبار السمع', 'تحديد الحساسيات'],
    detailsEn: ['Hearing evaluation', 'Auditory profile', 'Target frequencies'],
  },
  {
    day: 2,
    title: 'بدء البرنامج',
    titleEn: 'Program Start',
    description: 'الجلسة الأولى مع موسيقى معدلة الترددات',
    descriptionEn: 'First listening session with calibrated music',
    icon: '🎧',
    color: '#22c55e',
    details: ['30 دقيقة صباحاً', '30 دقيقة مساءً', 'راحة بين الجلسات'],
    detailsEn: ['30 min morning session', '30 min evening session', 'Rest between sessions'],
  },
  {
    day: 3,
    title: 'التكيف',
    titleEn: 'Adaptation',
    description: 'الدماغ يبدأ بالتكيف مع التحفيز السمعي الجديد',
    descriptionEn: 'Brain begins adapting to new auditory stimulation',
    icon: '🧠',
    color: brandPurple,
    details: ['ملاحظة التغييرات الأولية', 'تعديل مستوى الصوت', 'متابعة الاستجابة'],
    detailsEn: ['Monitor response', 'Adjustments as needed', 'Track comfort'],
  },
  {
    day: 5,
    title: 'نقطة التحول',
    titleEn: 'Turning Point',
    description: 'بداية ظهور التحسينات الملموسة',
    descriptionEn: 'Noticeable improvements start to appear',
    icon: '⚡',
    color: '#F59E0B',
    details: ['تحسن الانتباه', 'هدوء أكبر', 'تواصل أفضل'],
    detailsEn: ['Improved attention', 'Better listening', 'Calmer responses'],
  },
  {
    day: 7,
    title: 'التقدم المتسارع',
    titleEn: 'Accelerated Progress',
    description: 'تعزيز المسارات العصبية الجديدة',
    descriptionEn: 'Neural pathways strengthen and gains accelerate',
    icon: '📈',
    color: brandPink,
    details: ['تحسن السمع', 'تركيز أفضل', 'نوم أعمق'],
    detailsEn: ['Stronger auditory processing', 'Improved focus', 'Better learning readiness'],
  },
  {
    day: 10,
    title: 'إتمام البرنامج',
    titleEn: 'Program Complete',
    description: 'تقييم نهائي وتوصيات للمتابعة',
    descriptionEn: 'Final sessions and post-assessment with report',
    icon: '🏆',
    color: brandPurpleDark,
    details: ['اختبار سمعي نهائي', 'تقرير مفصل', 'خطة متابعة'],
    detailsEn: ['Final hearing test', 'Summary report', 'Next steps plan'],
  },
];

const benefits = [
  { icon: '🎯', label: 'تحسن التركيز', labelEn: 'Improved Focus', description: 'تقارير أولياء الأمور', descriptionEn: 'Parent reports' },
  { icon: '👂', label: 'معالجة سمعية', labelEn: 'Auditory Processing', description: 'ملاحظات سريرية', descriptionEn: 'Clinical observations' },
  { icon: '💬', label: 'تواصل أفضل', labelEn: 'Better Communication', description: 'تغذية راجعة', descriptionEn: 'Feedback' },
  { icon: '😴', label: 'نوم محسّن', labelEn: 'Improved Sleep', description: 'ملاحظات العائلات', descriptionEn: 'Family observations' },
];

export default function TreatmentTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { isArabic, t } = useLanguage();

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-advance through steps
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % timelineSteps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section ref={sectionRef} id="timeline" style={styles.sectionCard}>
      <style>{`
        @keyframes timelineEnter {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px var(--glow-color); }
          50% { box-shadow: 0 0 40px var(--glow-color); }
        }
        @keyframes progressFill {
          from { width: 0; }
          to { width: var(--target-width); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Header */}
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>{t('timeline.title')}</h2>
          <span style={{
            ...styles.chip,
            background: 'linear-gradient(135deg, rgba(143,211,204,0.2), rgba(175,132,186,0.2))',
            borderColor: 'rgba(143,211,204,0.4)',
          }}>
            {t('timeline.title')}
          </span>
        </div>
        <p style={styles.bodyText}>{t('timeline.subtitle')}</p>
      </div>

      {/* Main Timeline Container */}
      <div style={{
        marginTop: 24,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
      }}>
        {/* Left - Visual Timeline */}
        <div style={{
          padding: 24,
          background: 'linear-gradient(135deg, rgba(11,15,28,0.95), rgba(25,30,50,0.95))',
          borderRadius: 20,
          border: '1px solid rgba(143,211,204,0.2)',
          position: 'relative',
        }}>
          {/* Progress line */}
          <div style={{
            position: 'absolute',
            top: 60,
            bottom: 60,
            left: 44,
            width: 4,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 2,
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              width: '100%',
              height: `${(activeStep / (timelineSteps.length - 1)) * 100}%`,
              background: `linear-gradient(180deg, ${brandCyan}, ${brandPurple})`,
              borderRadius: 2,
              transition: 'height 0.5s ease',
            }} />
          </div>

          {/* Timeline Steps */}
          {timelineSteps.map((step, index) => (
            <div
              key={step.day}
              onClick={() => setActiveStep(index)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                padding: '12px 0',
                cursor: 'pointer',
                opacity: index <= activeStep ? 1 : 0.4,
                transition: 'all 0.3s ease',
                animation: isVisible ? `timelineEnter 0.5s ease-out ${index * 0.1}s backwards` : 'none',
              }}
            >
              {/* Step indicator */}
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: index === activeStep
                  ? `linear-gradient(135deg, ${step.color}, ${step.color}88)`
                  : index < activeStep
                    ? `${step.color}44`
                    : 'rgba(255,255,255,0.1)',
                border: `2px solid ${index <= activeStep ? step.color : 'rgba(255,255,255,0.1)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
                position: 'relative',
                zIndex: 1,
                boxShadow: index === activeStep ? `0 0 25px ${step.color}44` : 'none',
                animation: index === activeStep ? 'float 3s ease-in-out infinite' : 'none',
              }}>
                {step.icon}
              </div>

              {/* Step content */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 4,
                }}>
                  <span style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    background: `${step.color}33`,
                    borderRadius: 4,
                    color: step.color,
                    fontWeight: 700,
                  }}>
                    {t('timeline.day')} {step.day}
                  </span>
                  {index === activeStep && (
                    <span style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      background: '#22c55e33',
                      borderRadius: 4,
                      color: '#22c55e',
                    }}>
                      {isArabic ? '● الآن' : '● Now'}
                    </span>
                  )}
                </div>
                <div style={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: index === activeStep ? step.color : '#fff',
                  marginBottom: 4,
                }}>
                  {isArabic ? step.title : step.titleEn}
                </div>
                <div style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.6)',
                }}>
                  {isArabic ? step.description : step.descriptionEn}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right - Active Step Details & Benefits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Active Step Card */}
          <div style={{
            padding: 24,
            background: `linear-gradient(135deg, ${timelineSteps[activeStep].color}15, rgba(15,22,41,0.95))`,
            borderRadius: 20,
            border: `2px solid ${timelineSteps[activeStep].color}44`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Glow effect */}
            <div style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              background: `radial-gradient(circle, ${timelineSteps[activeStep].color}33, transparent)`,
              borderRadius: '50%',
              filter: 'blur(40px)',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Icon */}
              <div style={{
                width: 70,
                height: 70,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${timelineSteps[activeStep].color}44, ${timelineSteps[activeStep].color}22)`,
                border: `2px solid ${timelineSteps[activeStep].color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                marginBottom: 16,
                boxShadow: `0 0 30px ${timelineSteps[activeStep].color}33`,
              }}>
                {timelineSteps[activeStep].icon}
              </div>

              {/* Title */}
              <div style={{
                fontSize: 11,
                color: timelineSteps[activeStep].color,
                marginBottom: 4,
              }}>
                {t('timeline.day')} {timelineSteps[activeStep].day} - {isArabic ? timelineSteps[activeStep].title : timelineSteps[activeStep].titleEn}
              </div>
              <h3 style={{
                margin: '0 0 12px',
                fontSize: 24,
                fontWeight: 900,
                color: '#fff',
              }}>
                {isArabic ? timelineSteps[activeStep].title : timelineSteps[activeStep].titleEn}
              </h3>
              <p style={{
                margin: '0 0 16px',
                fontSize: 14,
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.6,
              }}>
                {isArabic ? timelineSteps[activeStep].description : timelineSteps[activeStep].descriptionEn}
              </p>

              {/* Details */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
              }}>
                {(isArabic ? timelineSteps[activeStep].details : timelineSteps[activeStep].detailsEn).map((detail, i) => (
                  <span key={i} style={{
                    padding: '6px 12px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 8,
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.8)',
                  }}>
                    ✓ {detail}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
          }}>
            {benefits.map((benefit) => (
              <div key={isArabic ? benefit.label : benefit.labelEn} style={{
                padding: 16,
                background: 'rgba(15,22,41,0.8)',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}>
                <span style={{ fontSize: 28, marginBottom: 8 }}>{benefit.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                  {isArabic ? benefit.label : benefit.labelEn}
                </span>
                <span style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.5)',
                }}>
                  {isArabic ? benefit.description : benefit.descriptionEn}
                </span>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div style={{
            marginTop: 12,
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 8,
            fontSize: 11,
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
          }}>
            * {t('results.disclaimer')}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        marginTop: 24,
        padding: 20,
        background: 'linear-gradient(135deg, rgba(143,211,204,0.1), rgba(176,18,112,0.1))',
        borderRadius: 16,
        border: '1px solid rgba(143,211,204,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 16, color: '#fff' }}>{t('cta.headline')}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{t('cta.subheadline')}</div>
        </div>
        <LabButtonAnchor
          href="#contact"
          variant="primary"
          style={{ padding: '12px 24px' }}
        >
          {t('cta.bookConsultation')}
        </LabButtonAnchor>
      </div>
    </section>
  );
}
