import { useMemo, useState } from 'react';
import { styles, brandCyan, brandPink } from '../styles';

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

const stages: Stage[] = [
  { id: 'welcome', title: 'Welcome', description: 'Overview of the 9-stage virtual assessment.' },
  { id: 'environment', title: 'Environment Check', description: 'Confirm quiet space and stable internet.', requiresInput: true },
  { id: 'headphones', title: 'Headphone Check', description: 'Calibrate volume and channel balance.', requiresInput: true },
  { id: 'questionnaire', title: 'Questionnaire', description: 'Medical history + auditory profile.', requiresInput: true },
  { id: 'attention', title: 'Attention Test', description: 'Short CPT-style focus exercise.', requiresInput: true },
  { id: 'frequency', title: 'Frequency Test', description: 'Hear tones across bands with confirmation.', requiresInput: true },
  { id: 'sequencing', title: 'Sequencing Test', description: 'Memory + order recall mini-game.', requiresInput: true },
  { id: 'results', title: 'Results', description: 'Instant summary of collected signals.' },
  { id: 'recommendations', title: 'Recommendations', description: 'Next steps + optional treatment plan.' },
];

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

const stageDescriptions: Partial<Record<StageId, string>> = {
  environment: 'تأكد من أن البيئة هادئة وخالية من المشتتات، مع تثبيت الجهاز.',
  headphones: 'اختبر توازن القنوات اليمنى/اليسرى وتأكد من راحة الصوت.',
  questionnaire: 'إدخال معلومات تاريخ طبي، حساسية سمعية، والبيئة المدرسية.',
  attention: 'تمرين تركيز قصير مع مقياس دقة وزمن استجابة.',
  frequency: 'تشغيل نغمات عبر نطاقات مختلفة مع تأكيد السمع.',
  sequencing: 'تمرين ذاكرة لتذكر ترتيب الأصوات أو الرموز.',
};

const VirtualAssessmentFlow = ({ locale = 'ar' }: { locale?: 'ar' | 'en' }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<StageId, string>>({} as Record<StageId, string>);
  const t = translations[locale];

  const activeStage = stages[current];
  const percent = useMemo(() => Math.round(((current + 1) / stages.length) * 100), [current]);
  const canContinue = !activeStage.requiresInput || Boolean(answers[activeStage.id]);

  const updateAnswer = (value: string) => setAnswers({ ...answers, [activeStage.id]: value });

  return (
    <section style={{ ...styles.sectionCard, display: 'grid', gap: 16 }}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>{t.title}</h2>
          <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.14)' }}>{percent}%</span>
        </div>
        <p style={styles.bodyText}>{t.subtitle}</p>
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
              <div style={{ ...styles.h3, margin: 0 }}>{stageDescriptions[activeStage.id] ?? activeStage.description}</div>
            </div>
            <span style={{ ...styles.chip, background: 'rgba(255,255,255,0.05)' }}>
              {current + 1}/{stages.length}
            </span>
          </div>
          <p style={styles.bodyText}>{activeStage.description}</p>
          {activeStage.requiresInput && (
            <textarea
              value={answers[activeStage.id] ?? ''}
              onChange={(e) => updateAnswer(e.target.value)}
              placeholder="أدخل الملاحظات / النتائج"
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
          {stages.map((stage, idx) => (
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
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          style={{ ...styles.ghostBtn, padding: '10px 16px', opacity: current === 0 ? 0.5 : 1 }}
          disabled={current === 0}
        >
          {t.back}
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.min(stages.length - 1, c + 1))}
            style={{
              ...styles.primaryBtn,
              padding: '10px 16px',
              opacity: canContinue ? 1 : 0.5,
              cursor: canContinue ? 'pointer' : 'not-allowed',
            }}
            disabled={!canContinue || current === stages.length - 1}
          >
            {current === stages.length - 2 ? t.submit : t.next}
          </button>
          {current === stages.length - 1 && <span style={styles.chip}>{t.complete}</span>}
        </div>
      </div>
    </section>
  );
};

export default VirtualAssessmentFlow;
