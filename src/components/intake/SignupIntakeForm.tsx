import { useMemo, useState } from 'react';
import { styles, brandCyan, brandPink } from '../styles';

type StepId = 'patient' | 'guardian' | 'medical' | 'auditory' | 'school' | 'consent' | 'review';

interface Step {
  id: StepId;
  title: string;
  description: string;
  fields: string[];
}

const steps: Step[] = [
  { id: 'patient', title: 'بيانات المريض', description: 'الاسم، العمر، الجنس، التواصل', fields: ['name', 'age', 'gender', 'contact'] },
  { id: 'guardian', title: 'الوصي', description: 'الاسم والعلاقة ورقم التواصل', fields: ['guardianName', 'relationship', 'guardianPhone'] },
  { id: 'medical', title: 'التاريخ الطبي', description: 'تشخيصات، أدوية، حساسية', fields: ['diagnosis', 'medications'] },
  { id: 'auditory', title: 'الملف السمعي', description: 'حساسية الأصوات، التحديات الدراسية', fields: ['sensitivity', 'classroomChallenges'] },
  { id: 'school', title: 'المدرسة', description: 'اسم المدرسة، الصف، ملاحظات', fields: ['school', 'grade', 'notes'] },
  { id: 'consent', title: 'الموافقة', description: 'موافقة ولي الأمر وسياسة الخصوصية', fields: ['consent'] },
  { id: 'review', title: 'المراجعة', description: 'تحقق من البيانات قبل الإرسال', fields: [] },
];

const SignupIntakeForm = ({ locale = 'ar', onSubmit }: { locale?: 'ar' | 'en'; onSubmit?: (values: Record<string, string>) => void }) => {
  const [current, setCurrent] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({ consent: 'false' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeStep = steps[current];
  const percent = useMemo(() => Math.round(((current + 1) / steps.length) * 100), [current]);

  const validateStep = () => {
    const required = activeStep.fields;
    const nextErrors: Record<string, string> = {};
    required.forEach((field) => {
      if (!values[field]) nextErrors[field] = 'مطلوب';
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrent((c) => Math.min(steps.length - 1, c + 1));
    }
  };

  const handleSubmit = () => {
    if (validateStep()) {
      onSubmit?.(values);
    }
  };

  return (
    <section style={{ ...styles.sectionCard, display: 'grid', gap: 16 }}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>نموذج تسجيل ٧ خطوات</h2>
          <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.14)' }}>{percent}%</span>
        </div>
        <p style={styles.bodyText}>مريض → ولي أمر → تاريخ طبي → ملف سمعي → مدرسة → موافقة → مراجعة</p>
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
        <div style={{ ...styles.section, display: 'grid', gap: 10 }}>
          <div style={{ ...styles.sectionHeaderRow, alignItems: 'center' }}>
            <div>
              <div style={{ ...styles.kicker, opacity: 0.8 }}>{activeStep.title}</div>
              <div style={{ ...styles.h3, margin: 0 }}>{activeStep.description}</div>
            </div>
            <span style={{ ...styles.chip, background: 'rgba(255,255,255,0.08)' }}>{current + 1}/{steps.length}</span>
          </div>

          {activeStep.fields.map((field) => (
            <div key={field} style={{ display: 'grid', gap: 6 }}>
              <label style={styles.bodyText} htmlFor={field}>{field}</label>
              <input
                id={field}
                value={values[field] ?? ''}
                onChange={(e) => setValues({ ...values, [field]: e.target.value })}
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: `1px solid ${errors[field] ? brandPink : 'rgba(255,255,255,0.08)'}`,
                  background: 'rgba(255,255,255,0.03)',
                  color: 'white',
                }}
              />
              {errors[field] && <span style={{ color: brandPink, fontSize: 12 }}>{errors[field]}</span>}
            </div>
          ))}

          {activeStep.id === 'review' && (
            <div style={{ display: 'grid', gap: 6 }}>
              {Object.entries(values).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={styles.bodyText}>{key}</span>
                  <span style={{ ...styles.kicker, color: 'rgba(255,255,255,0.8)' }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {steps.map((step, idx) => (
            <div
              key={step.id}
              style={{
                ...styles.section,
                padding: 10,
                border: `1px solid ${idx === current ? brandCyan : 'rgba(255,255,255,0.08)'}`,
                background: idx <= current ? 'rgba(143,211,204,0.08)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer',
              }}
              onClick={() => setCurrent(idx)}
            >
              <div style={{ ...styles.kicker, opacity: 0.8 }}>{idx + 1}. {step.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{step.description}</div>
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
          السابق
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          {current < steps.length - 1 && (
            <button type="button" onClick={handleNext} style={{ ...styles.primaryBtn, padding: '10px 16px' }}>
              التالي
            </button>
          )}
          {current === steps.length - 1 && (
            <button type="button" onClick={handleSubmit} style={{ ...styles.primaryBtn, padding: '10px 16px' }}>
              إرسال
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default SignupIntakeForm;
