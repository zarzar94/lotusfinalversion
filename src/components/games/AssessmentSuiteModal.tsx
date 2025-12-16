import { useEffect, useMemo, useState } from 'react';

import { useFocusTrap } from '../../hooks/useFocusTrap';
import { brandCyan, brandPink, brandPurpleDark, styles } from '../styles';
import type { AssessmentSession, GameResult, TestKey, TestOutcome } from './types';
import { resultMeta } from './types';
import HeadphoneCheckPanel, { HeadphoneCheckResult } from './HeadphoneCheckPanel';
import AttentionTestPanel from './AttentionTestPanel';
import FrequencyDiscriminationTestPanel from './FrequencyDiscriminationTestPanel';
import SequencingTestPanel from './SequencingTestPanel';
import QuestionnairePanel from './QuestionnairePanel';
import { downloadSessionCsv, downloadSessionPdf } from './report';

const genId = () => `S${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();

const scoreMap: Record<GameResult, number> = { low: 0, medium: 1, high: 2 };

const compositeFrom = (outcomes: Partial<Record<TestKey, TestOutcome>>): { result: GameResult; score: number } => {
  const keys: TestKey[] = ['attention', 'frequency', 'sequence'];
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
  const [step, setStep] = useState<'intro' | 'headphone' | 'attention' | 'frequency' | 'sequence' | 'questionnaire' | 'summary'>('intro');
  const [session, setSession] = useState<AssessmentSession>(() => ({ id: genId(), startedAt: Date.now(), outcomes: {} }));
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
    if (composite.result === 'low') return { title: 'احجز تقييماً', hash: '#contact', color: brandPink };
    if (composite.result === 'medium') return { title: 'ابدأ بالاستبيان', hash: '#games', color: brandPurpleDark };
    return { title: 'خيار المدارس/الجامعات', hash: '#schools', color: brandCyan };
  }, [composite.result]);

  if (!open) return null;

  const stepLabel = () => {
    if (step === 'questionnaire') return 'استبيان';
    const order = ['intro', 'headphone', 'attention', 'frequency', 'sequence', 'summary'];
    const idx = order.indexOf(step);
    return idx >= 0 ? `${idx + 1}/${order.length}` : '';
  };

  const close = () => {
    onClose();
  };

  return (
    <div style={styles.modalBackdrop} onClick={close} role="presentation">
      <div ref={modalRef} style={styles.modal} dir="rtl" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 900, color: brandCyan }}>🧪 معمل الفحص السمعي — 3 اختبارات موضوعية</div>
            <div style={styles.muted}>جلسة تفاعلية قصيرة + تقرير PDF/CSV (للأهل والمدارس).</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={styles.chip}>{stepLabel()}</span>
            <button onClick={close} style={styles.ghostBtn}>إغلاق</button>
          </div>
        </div>

        {step === 'intro' ? (
          <div style={{ marginTop: 12 }}>
            <div style={styles.section}>
              <div style={{ fontWeight: 900, color: brandPurpleDark }}>قبل البدء</div>
              <p style={{ ...styles.bodyText, marginTop: 8 }}>
                هذا "فحص تفاعلي" (Screening) يساعد على قياس مؤشرات مرتبطة بـ <b>الانتباه السمعي</b> و<b>تمييز التردد</b> و<b>التسلسل/الذاكرة السمعية</b> تحت الضوضاء.
              </p>
              <ul style={{ marginTop: 10, opacity: 0.9, lineHeight: 1.7 }}>
                <li>يفضل استخدام <b style={{ color: brandPink }}>سماعات</b> وفي مكان هادئ.</li>
                <li>النتائج ليست تشخيصاً طبياً، ولا تغني عن تقييم أخصائي بأدوات معيارية.</li>
                <li>يمكن تنزيل تقرير تجريبي للمدارس (PDF/CSV) بدون بيانات شخصية.</li>
              </ul>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <button onClick={() => setStep('headphone')} style={{ ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandPink})` }}>
                  ابدأ الجلسة
                </button>
                <button onClick={() => setStep('questionnaire')} style={{ ...styles.ghostBtn, borderColor: 'rgba(175,132,186,0.25)' }}>
                  أو ابدأ بالاستبيان
                </button>
              </div>
            </div>

            <div style={{ ...styles.section, marginBottom: 0 }}>
              <div style={{ fontWeight: 900, color: brandCyan }}>Session ID</div>
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
              upsertOutcome(o);
              setStep('frequency');
            }}
            onCancel={() => setStep('summary')}
          />
        ) : null}

        {step === 'frequency' ? (
          <FrequencyDiscriminationTestPanel
            onDone={(o) => {
              upsertOutcome(o);
              setStep('sequence');
            }}
            onCancel={() => setStep('summary')}
          />
        ) : null}

        {step === 'sequence' ? (
          <SequencingTestPanel
            enableExports={false}
            onDone={(o) => {
              upsertOutcome(o);
              setStep('summary');
            }}
            onCancel={() => setStep('summary')}
          />
        ) : null}

        {step === 'questionnaire' ? (
          <QuestionnairePanel
            onDone={(o) => {
              upsertOutcome(o);
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
                  <div style={{ fontWeight: 900, color: resultMeta[composite.result].color }}>الخلاصة: {composite.label}</div>
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
                <div style={{ fontWeight: 900, color: brandPurpleDark }}>نتائج الاختبارات</div>
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
                  تنزيل CSV (ملخص)
                </button>
                <button
                  onClick={() => downloadSessionPdf(session, { label: composite.label, message: composite.message })}
                  style={{ ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandCyan})` }}
                >
                  تنزيل PDF (تقرير)
                </button>
                <button onClick={() => setStep('attention')} style={styles.ghostBtn}>إعادة الاختبارات</button>
              </div>
            </div>

            <div style={{ ...styles.section, marginBottom: 0 }}>
              <div style={{ fontWeight: 900, color: brandPink }}>تنبيه امتثال</div>
              <p style={{ ...styles.muted, marginTop: 6 }}>
                هذا التقرير توعوي وغير تشخيصي. للحصول على تشخيص/خطة علاج، يجب تقييم سريري ومعايرة سماعات واستخدام أدوات معيارية.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
