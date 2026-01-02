import { useMemo, useState } from 'react';
import { styles, brandCyan, brandPink } from '../styles';
import LabButton from '../labui/LabButton';
import { useLanguage } from '../../context/LanguageContext';
import { useVisitorMode } from '../../context/VisitorModeContext';

type StageId =
  | 'welcome'
  | 'environment'
  | 'headphones'
  | 'questionnaire'
  | 'attention'
  | 'frequency'
  | 'sequencing'
  | 'results'
  | 'recommendations';

interface Stage {
  id: StageId;
  title: string;
  description: string;
  requiresInput?: boolean;
}

const stageContent: Record<'ar' | 'en', Stage[]> = {
  en: [
    { id: 'welcome', title: 'Welcome', description: 'Overview of the 9-stage virtual assessment.' },
    { id: 'environment', title: 'Environment Check', description: 'Confirm quiet space and stable internet.', requiresInput: true },
    { id: 'headphones', title: 'Headphone Check', description: 'Calibrate volume and channel balance.', requiresInput: true },
    { id: 'questionnaire', title: 'Questionnaire', description: 'Medical history + auditory profile.', requiresInput: true },
    { id: 'attention', title: 'Attention Test', description: 'Short CPT-style focus exercise.', requiresInput: true },
    { id: 'frequency', title: 'Frequency Test', description: 'Hear tones across bands with confirmation.', requiresInput: true },
    { id: 'sequencing', title: 'Sequencing Test', description: 'Memory + order recall mini-game.', requiresInput: true },
    { id: 'results', title: 'Results', description: 'Instant summary of collected signals.' },
    { id: 'recommendations', title: 'Recommendations', description: 'Next steps + optional treatment plan.' },
  ],
  ar: [
    { id: 'welcome', title: 'الترحيب', description: 'نظرة عامة على التقييم الافتراضي المكون من ٩ مراحل.' },
    { id: 'environment', title: 'فحص البيئة', description: 'تأكد من أن البيئة هادئة وخالية من المشتتات مع اتصال مستقر.', requiresInput: true },
    { id: 'headphones', title: 'فحص السماعات', description: 'معايرة مستوى الصوت وتوازن القنوات اليمنى/اليسرى.', requiresInput: true },
    { id: 'questionnaire', title: 'الاستبيان', description: 'تاريخ طبي + ملف سمعي + معلومات مدرسية.', requiresInput: true },
    { id: 'attention', title: 'اختبار الانتباه', description: 'تمرين تركيز قصير بأسلوب CPT مع قياس الدقة والوقت.', requiresInput: true },
    { id: 'frequency', title: 'اختبار التردد', description: 'تشغيل نغمات عبر نطاقات متعددة مع تأكيد الاستماع.', requiresInput: true },
    { id: 'sequencing', title: 'اختبار التسلسل', description: 'تمرين ذاكرة لتذكر وترتيب الأصوات أو الرموز.', requiresInput: true },
    { id: 'results', title: 'النتائج', description: 'ملخص فوري للإشارات التي تم جمعها.' },
    { id: 'recommendations', title: 'التوصيات', description: 'الخطوات التالية مع خطة علاجية اختيارية.' },
  ],
};

const translations = {
  ar: {
    title: 'التقييم الافتراضي (٩ مراحل)',
    subtitle: 'الترحيب → فحص البيئة → فحص السماعات → استبيان → اختبار انتباه → اختبار تردد → اختبار تسلسل → نتائج → توصيات',
    next: 'التالي',
    back: 'السابق',
    submit: 'إرسال',
    complete: 'اكتملت',
  },
  en: {
    title: 'Virtual Assessment (9 stages)',
    subtitle: 'Welcome → Environment → Headphones → Questionnaire → Attention → Frequency → Sequencing → Results → Recommendations',
    next: 'Next',
    back: 'Back',
    submit: 'Submit',
    complete: 'Done',
  },
};

const flowCopy = {
  school: {
    intro: {
      ar: 'ابدأ بفرز صفّي سريع يعرض المؤشرات السمعية الأساسية مع تقارير تجريبية قابلة للتحميل.',
      en: 'School-first flow with fast classroom screening and downloadable demo reports.',
    },
    bullets: {
      ar: [
        'فرز صفّي سريع مع مؤشرات سمعية واضحة',
        'تقارير تجريبية قابلة للتحميل ومشاركة آمنة',
        'توصيات عملية لبرنامج المدرسة والمتابعة',
      ],
      en: [
        'Fast classroom screening with clear auditory indicators',
        'Downloadable demo reports for safe sharing',
        'Actionable next steps for school programs',
      ],
    },
  },
  parent: {
    intro: {
      ar: 'ابدأ بملاحظات المنزل ثم انتقل لاختبارات التركيز والانتباه لفهم احتياجات طفلك.',
      en: 'Start with home observations, then move into focus and attention checks.',
    },
    bullets: {
      ar: [
        'مؤشرات تركيز وانتباه مبسطة للأطفال',
        'أسئلة موجهة لتوثيق ملاحظات المنزل',
        'نتائج أولية تساعد على اختيار الخطوة التالية',
      ],
      en: [
        'Child-friendly focus and attention signals',
        'Guided questions to capture home observations',
        'Starter results that clarify the next step',
      ],
    },
  },
  clinician: {
    intro: {
      ar: 'سير عمل سريري يبرز مقاييس الوحدات ومؤشرات الجودة وتقارير قابلة للتوقيع.',
      en: 'Clinical workflow highlighting module metrics, quality flags, and signed reports.',
    },
    bullets: {
      ar: [
        'مقاييس وحدات تفصيلية قابلة للمقارنة',
        'مؤشرات جودة وتنبيه مبكر لتحسين التفسير',
        'تقارير قابلة للتوقيع والمتابعة الطولية',
      ],
      en: [
        'Comparable module metrics across sessions',
        'Quality flags for cleaner interpretation',
        'Signature-ready reports with longitudinal tracking',
      ],
    },
  },
};

const VirtualAssessmentFlow = ({ locale }: { locale?: 'ar' | 'en' }) => {
  const { isArabic, t } = useLanguage();
  const { mode } = useVisitorMode();
  const activeLocale = locale ?? (isArabic ? 'ar' : 'en');
  const localizedStages = stageContent[activeLocale];
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<StageId, string>>({} as Record<StageId, string>);
  const labels = translations[activeLocale];
  const copy = flowCopy[mode] ?? flowCopy.school;
  const intro = isArabic ? copy.intro.ar : t(`lab.flowIntro.${mode}`, copy.intro.en);
  const bullets = isArabic
    ? copy.bullets.ar
    : copy.bullets.en.map((text, index) => t(`lab.flowBullets.${mode}.${index}`, text));
  const benefitsLabel = isArabic ? 'ماذا تحصل عليه' : t('lab.flowBenefits', 'What you get');
  const inputPlaceholder = isArabic ? '???? ????????? / ???????' : t('lab.flowInputPlaceholder', 'Add notes or observations');

  const activeStage = localizedStages[current];
  const percent = useMemo(() => Math.round(((current + 1) / localizedStages.length) * 100), [current, localizedStages.length]);
  const canContinue = !activeStage.requiresInput || Boolean(answers[activeStage.id]);

  const updateAnswer = (value: string) => setAnswers({ ...answers, [activeStage.id]: value });

  return (
    <section
      style={{
        ...styles.sectionCard,
        display: 'grid',
        gap: 16,
        direction: isArabic ? 'rtl' : 'ltr',
        textAlign: isArabic ? 'right' : 'left',
      }}
    >
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>{labels.title}</h2>
          <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.14)' }}>{percent}%</span>
        </div>
        <p style={styles.bodyText}>{intro}</p>
        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ ...styles.kicker, opacity: 0.8 }}>{benefitsLabel}</div>
          <ul
            style={{
              margin: 0,
              paddingInlineStart: isArabic ? 0 : 18,
              paddingInlineEnd: isArabic ? 18 : 0,
              listStylePosition: 'inside',
              color: 'rgba(255,255,255,0.78)',
              fontSize: 13,
              lineHeight: 1.6,
              display: 'grid',
              gap: 6,
            }}
          >
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
        <p style={{ ...styles.muted, marginTop: 4 }}>{labels.subtitle}</p>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 999, position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: `${percent}%`,
              background: `linear-gradient(90deg, ${brandCyan}, ${brandPink})`,
              borderRadius: 999,
            }}
          />
        </div>
      </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ ...styles.section, minHeight: 200 }}>
            <div style={{ ...styles.sectionHeaderRow, marginBottom: 8 }}>
              <div>
                <div style={{ ...styles.kicker, opacity: 0.8 }}>{activeStage.title}</div>
                <div style={{ ...styles.h3, margin: 0 }}>{activeStage.description}</div>
              </div>
              <span style={{ ...styles.chip, background: 'rgba(255,255,255,0.05)' }}>
                {current + 1}/{localizedStages.length}
              </span>
            </div>
          <p style={styles.bodyText}>{activeStage.description}</p>
          {activeStage.requiresInput && (
            <textarea
              value={answers[activeStage.id] ?? ''}
              onChange={(e) => updateAnswer(e.target.value)}
              placeholder={inputPlaceholder}
              style={{
                width: '100%',
                minHeight: 90,
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                padding: 12,
                color: 'white',
              }}
            />
          )}
        </div>

        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {localizedStages.map((stage, idx) => (
            <div
              key={stage.id}
              style={{
                ...styles.section,
                padding: 12,
                border: `1px solid ${idx === current ? brandCyan : 'rgba(255,255,255,0.08)'}`,
                background: idx <= current ? 'rgba(143,211,204,0.08)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer',
              }}
              onClick={() => setCurrent(idx)}
            >
              <div style={{ ...styles.kicker, opacity: 0.8 }}>{idx + 1}. {stage.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{stage.description}</div>
            </div>
          ))}
        </div>
      </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
          <LabButton
            variant="ghost"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            style={{ padding: '10px 16px' }}
          >
            {labels.back}
          </LabButton>
          <div style={{ display: 'flex', gap: 8 }}>
            <LabButton
              variant="primary"
              onClick={() => setCurrent((c) => Math.min(localizedStages.length - 1, c + 1))}
              disabled={!canContinue || current === localizedStages.length - 1}
              style={{ padding: '10px 16px' }}
            >
                {current === localizedStages.length - 2 ? labels.submit : labels.next}
            </LabButton>
          {current === localizedStages.length - 1 && <span style={styles.chip}>{labels.complete}</span>}
          </div>
        </div>
    </section>
  );
};

export default VirtualAssessmentFlow;
