import { useEffect, useMemo, useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { brandCyan, brandPink, brandPurpleDark, styles } from '../styles';
import type { AssessmentSession, GameResult, TestKey, TestOutcome } from './types';
import { resultMeta } from './types';
import HeadphoneCheckPanel, { HeadphoneCheckResult } from './HeadphoneCheckPanel';
import AttentionTestPanel from './AttentionTestPanel';
import FocusedAttentionTestPanel from './FocusedAttentionTestPanel';
import FrequencyDiscriminationTestPanel from './FrequencyDiscriminationTestPanel';
import SequencingTestPanel from './SequencingTestPanel';
import DichoticListeningTestPanel from './DichoticListeningTestPanel';
import SpeechInNoiseTestPanel from './SpeechInNoiseTestPanel';
import QuestionnairePanel from './QuestionnairePanel';
import { downloadSessionCsv, downloadSessionPdf } from './report';
import { saveSession as saveLabSession } from '../../utils/sessionStorage';
import { buildLabMetrics } from '../../utils/labMetrics';

const genId = () => `S${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();

const scoreMap: Record<GameResult, number> = { low: 0, medium: 1, high: 2 };

const compositeFrom = (outcomes: Partial<Record<TestKey, TestOutcome>>): { result: GameResult; score: number } => {
  const keys: TestKey[] = ['attention', 'focused_attention', 'frequency', 'sequence', 'dichotic_listening', 'speech_in_noise'];
  const available = keys.map((k) => outcomes[k]).filter(Boolean) as TestOutcome[];
  if (!available.length) return { result: 'medium', score: 1 };
  const avg = available.reduce((s, o) => s + scoreMap[o.result], 0) / available.length;
  const result: GameResult = avg >= 1.5 ? 'high' : avg >= 0.8 ? 'medium' : 'low';
  return { result, score: avg };
};

export default function AssessmentSuiteModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<
    | 'intro'
    | 'headphone'
    | 'attention'
    | 'focused_attention'
    | 'frequency'
    | 'sequence'
    | 'dichotic_listening'
    | 'speech_in_noise'
    | 'questionnaire'
    | 'summary'
  >('intro');
  const [session, setSession] = useState<AssessmentSession>(() => ({ id: genId(), startedAt: Date.now(), outcomes: {} }));
  const { isArabic, direction } = useLanguage();
  const modalRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    if (!open) return;
    // reset when opened fresh
    setStep('intro');
    setSession({ id: genId(), startedAt: Date.now(), outcomes: {} });
  }, [open]);

  const upsertOutcome = (outcome: TestOutcome) => {
    setSession((s) => ({ ...s, outcomes: { ...s.outcomes, [outcome.key]: outcome } }));
  };

  const persistOutcome = (outcome: TestOutcome) => {
    upsertOutcome(outcome);
    saveLabSession(buildLabMetrics(outcome));
  };

  const setHeadphone = (hc: HeadphoneCheckResult) => {
    setSession((s) => ({ ...s, headphoneCheck: hc }));
  };

  const composite = useMemo(() => {
    const { result } = compositeFrom(session.outcomes);
    return {
      result,
      label: resultMeta[result].label,
      message: resultMeta[result].hint,
    };
  }, [session.outcomes]);

  const cta = useMemo(() => {
    if (composite.result === 'low') return { title: isArabic ? 'احجز تقييماً' : 'Book Assessment', hash: '#contact', color: brandPink };
    if (composite.result === 'medium') return { title: isArabic ? 'ابدأ بالاستبيان' : 'Start Questionnaire', hash: '#games', color: brandPurpleDark };
    return { title: isArabic ? 'خيار المدارس/الجامعات' : 'Schools/Universities', hash: '#schools', color: brandCyan };
  }, [composite.result, isArabic]);

  if (!open) return null;

  const stepLabel = () => {
    if (step === 'questionnaire') return isArabic ? 'استبيان' : 'Questionnaire';
    const order = ['intro', 'headphone', 'attention', 'focused_attention', 'frequency', 'sequence', 'dichotic_listening', 'speech_in_noise', 'summary'];
    const idx = order.indexOf(step);
    return idx >= 0 ? `${idx + 1}/${order.length}` : '';
  };

  const close = () => {
    onClose();
  };

  return (
    <div style={styles.modalBackdrop} onClick={close} role="presentation">
      <div ref={modalRef} style={styles.modal} dir={direction} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 900, color: brandCyan }}>🧪 {isArabic ? 'مختبر الفحص السمعي — 6 اختبارات موضوعية' : 'Auditory Screening Lab — 6 Objective Tests'}</div>
            <div style={styles.muted}>{isArabic ? 'جلسة تفاعلية قصيرة + تقرير PDF/CSV (للأهل والمدارس).' : 'Quick interactive session + PDF/CSV report (for parents & schools).'}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={styles.chip}>{stepLabel()}</span>
            <button onClick={close} style={styles.ghostBtn}>{isArabic ? 'إغلاق' : 'Close'}</button>
          </div>
        </div>

        {step === 'intro' ? (
          <div style={{ marginTop: 12 }}>
            <div style={styles.section}>
              <div style={{ fontWeight: 900, color: brandPurpleDark }}>{isArabic ? 'قبل البدء' : 'Before Starting'}</div>
              <p style={{ ...styles.bodyText, marginTop: 8 }}>
                {isArabic
                  ? <>هذا "فحص تفاعلي" (Screening) يساعد على قياس مؤشرات مرتبطة بـ <b>الانتباه السمعي</b> و<b>تمييز التردد</b> و<b>التسلسل/الذاكرة السمعية</b> تحت الضوضاء.</>
                  : <>This is an interactive screening that helps measure indicators related to <b>auditory attention</b>, <b>frequency discrimination</b>, and <b>sequencing/auditory memory</b> in noise.</>
                }
              </p>
              <ul style={{ marginTop: 10, opacity: 0.9, lineHeight: 1.7 }}>
                <li>{isArabic ? <>يفضل استخدام <b style={{ color: brandPink }}>سماعات</b> وفي مكان هادئ.</> : <>Using <b style={{ color: brandPink }}>headphones</b> in a quiet environment is recommended.</>}</li>
                <li>{isArabic ? 'النتائج ليست تشخيصاً طبياً، ولا تغني عن تقييم أخصائي بأدوات معيارية.' : 'Results are not a medical diagnosis and do not replace professional assessment with standardized tools.'}</li>
                <li>{isArabic ? 'يمكن تنزيل تقرير تجريبي للمدارس (PDF/CSV) بدون بيانات شخصية.' : 'You can download a demo report for schools (PDF/CSV) without personal data.'}</li>
              </ul>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <button onClick={() => setStep('headphone')} style={{ ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandPink})` }}>
                  {isArabic ? 'ابدأ الجلسة' : 'Start Session'}
                </button>
                <button onClick={() => setStep('questionnaire')} style={{ ...styles.ghostBtn, borderColor: 'rgba(175,132,186,0.25)' }}>
                  {isArabic ? 'أو ابدأ بالاستبيان' : 'Or Start with Questionnaire'}
                </button>
              </div>
            </div>

            <div style={{ ...styles.section, marginBottom: 0 }}>
              <div style={{ fontWeight: 900, color: brandCyan }}>{isArabic ? 'معرف الجلسة' : 'Session ID'}</div>
              <div style={styles.muted}>{session.id}</div>
            </div>
          </div>
        ) : null}

        {step === 'headphone' ? (
          <HeadphoneCheckPanel
            onDone={(hc) => {
              setHeadphone(hc);
              setStep('attention');
            }}
            onSkip={() => setStep('attention')}
          />
        ) : null}

        {step === 'attention' ? (
          <AttentionTestPanel
            onDone={(o) => {
              persistOutcome(o);
              setStep('frequency');
            }}
            onCancel={() => setStep('summary')}
          />
        ) : null}

        {step === 'frequency' ? (
          <FrequencyDiscriminationTestPanel
            onDone={(o) => {
              persistOutcome(o);
              setStep('sequence');
            }}
            onCancel={() => setStep('summary')}
          />
        ) : null}

        {step === 'sequence' ? (
          <SequencingTestPanel
            enableExports={false}
            onDone={(o) => {
              persistOutcome(o);
              setStep('summary');
            }}
            onCancel={() => setStep('summary')}
          />
        ) : null}

        {step === 'questionnaire' ? (
          <QuestionnairePanel
            onDone={(o) => {
              persistOutcome(o);
              setStep('headphone');
            }}
            onCancel={() => setStep('intro')}
          />
        ) : null}

        {step === 'summary' ? (
          <div style={{ marginTop: 12 }}>
            <div style={styles.section}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 900, color: resultMeta[composite.result].color }}>{isArabic ? 'الخلاصة:' : 'Summary:'} {composite.label}</div>
                  <p style={{ ...styles.muted, marginTop: 6 }}>{composite.message}</p>
                </div>
                <a
                  href={cta.hash}
                  onClick={() => onClose()}
                  style={{ ...styles.primaryBtn, textDecoration: 'none', background: `linear-gradient(135deg, ${brandPurpleDark}, ${cta.color})` }}
                >
                  {cta.title}
                </a>
              </div>

              <div style={{ marginTop: 12, ...styles.section, marginBottom: 0 }}>
                <div style={{ fontWeight: 900, color: brandPurpleDark }}>{isArabic ? 'نتائج الاختبارات' : 'Test Results'}</div>
                <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginTop: 10 }}>
                  {(Object.values(session.outcomes) as TestOutcome[]).map((o) => (
                    <div key={o.key} style={{ padding: 12, borderRadius: 14, border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(0,0,0,0.18)' }}>
                      <div style={{ fontWeight: 900 }}>{o.title}</div>
                      <div style={{ ...styles.muted, marginTop: 6 }}>{o.scoreLabel}</div>
                      <div style={{ ...styles.muted, marginTop: 6 }}>{o.message}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
                <button
                  onClick={() => downloadSessionCsv(session)}
                  style={{ ...styles.ghostBtn, borderColor: 'rgba(143,211,204,0.25)' }}
                >
                  {isArabic ? 'تنزيل CSV (ملخص)' : 'Download CSV (Summary)'}
                </button>
                <button
                  onClick={() => downloadSessionPdf(session, { label: composite.label, message: composite.message }, isArabic ? 'ar' : 'en')}
                  style={{ ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})` }}
                >
                  {isArabic ? 'تنزيل PDF (تقرير)' : 'Download PDF (Report)'}
                </button>
                <button onClick={() => setStep('attention')} style={styles.ghostBtn}>{isArabic ? 'إعادة الاختبارات' : 'Retry Tests'}</button>
              </div>
            </div>

            <div style={{ ...styles.section, marginBottom: 0 }}>
              <div style={{ fontWeight: 900, color: brandPink }}>{isArabic ? 'تنبيه امتثال' : 'Compliance Notice'}</div>
              <p style={{ ...styles.muted, marginTop: 6 }}>
                {isArabic
                  ? 'هذا التقرير توعوي وغير تشخيصي. للحصول على تشخيص/خطة علاج، يجب تقييم سريري ومعايرة سماعات واستخدام أدوات معيارية.'
                  : 'This report is educational and non-diagnostic. For a diagnosis or treatment plan, clinical evaluation with calibrated equipment and standardized tools is required.'}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
