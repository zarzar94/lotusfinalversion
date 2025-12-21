import { useMemo, useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPink, brandPurpleDark, styles } from '../styles';
import type { GameResult, TestOutcome } from './types';

const questions = [
  'هل يطلب الطفل تكرار الكلام كثيراً (؟ماذا/هاه)؟',
  'هل يبدو أنه يسمع لكن لا يستجيب في بيئة noisy؟',
  'هل ينزعج من الأصوات أو يغطي أذنيه؟',
  'هل يشتت بسهولة في الصف أو أثناء الواجبات؟',
  'هل توجد صعوبة في اتباع تعليمات متعددة الخطوات؟',
  'هل توجد مشاكل في القراءة/التهجئة أو الانتباه السمعي؟',
  'هل يتعب بسرعة من المحادثة أو الدراسة في بيئة مزدحمة؟',
  'هل يخلط بين الأصوات أو يخطئ في سماع كلمات متشابهة؟',
];

type Answer = 0 | 1 | 2; // 0=لا, 1=أحياناً, 2=نعم

const label = (a: Answer) => (a === 0 ? 'لا' : a === 1 ? 'أحياناً' : 'نعم');

export default function QuestionnairePanel({
  onDone,
  onCancel,
}: {
  onDone: (outcome: TestOutcome) => void;
  onCancel?: () => void;
}) {
  const { isArabic, t } = useLanguage();
  const [answers, setAnswers] = useState<Answer[]>(Array(questions.length).fill(0));
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => answers.reduce<number>((s, a) => s + a, 0), [answers]);

  const result: GameResult = score <= 4 ? 'high' : score <= 9 ? 'medium' : 'low';

  const message =
    result === 'high'
      ? 'مؤشرات منخفضة حسب الاستبيان. إذا كانت هناك صعوبات واضحة، قد يكون السبب خارج السمع (مثل انتباه/لغة) ويستحسن تقييم شامل.'
      : result === 'medium'
        ? 'هناك مؤشرات متوسطة. ننصح بمقارنة ذلك مع الاختبارات الموضوعية داخل الموقع للحصول على صورة أقوى.'
        : 'مؤشرات مرتفعة حسب الاستبيان. إذا كانت الأعراض مستمرة في المدرسة/البيت، يفضّل تقييم متخصص.';

  const submit = () => {
    const outcome: TestOutcome = {
      key: 'questionnaire',
      title: 'استبيان مؤشرات (Subjective Checklist)',
      result,
      scoreLabel: `Score=${score}/${questions.length * 2}`,
      message,
      metrics: {
        totalQuestions: questions.length,
        totalScore: score,
        note: 'Subjective questionnaire, not a diagnosis.',
      },
      trials: questions.map((q, idx) => ({ question: q, answer: label(answers[idx] as Answer), value: answers[idx] })),
    };

    setSubmitted(true);
    onDone(outcome);
  };

  return (
    <div style={styles.section}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 900, color: brandCyan }}>استبيان مؤشرات للأهل (غير تشخيصي)</div>
          <div style={styles.muted}>يدعم نتائج الاختبارات الموضوعية لكنه لا يكفي وحده لاتخاذ قرار.</div>
        </div>
        <span style={styles.chip}>{t('auto.QuestionnairePanel.k1', "Subjective")}</span>
      </div>

      <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
        {questions.map((q, idx) => (
          <div key={q} style={{ ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900 }}>{idx + 1}. {q}</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
              {[0, 1, 2].map((v) => {
                const val = v as Answer;
                const active = answers[idx] === val;
                return (
                  <button
                    key={v}
                    onClick={() => setAnswers((a) => a.map((x, i) => (i === idx ? val : x))) }
                    style={active ? { ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandPink})` } : styles.ghostBtn}
                  >
                    {label(val)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, ...styles.section, marginBottom: 0 }}>
        <div style={{ fontWeight: 900, color: brandPurpleDark }}>النتيجة المبدئية</div>
        <p style={{ ...styles.muted, marginTop: 6 }}>
          مجموع النقاط: <b style={{ color: brandPink }}>{score}</b> / {questions.length * 2}
        </p>
        <p style={{ ...styles.muted, marginTop: 6 }}>{message}</p>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, gap: 10, flexWrap: 'wrap' }}>
          <button onClick={submit} style={{ ...styles.primaryBtn, background: `linear-gradient(135deg, ${brandPurpleDark}, ${brandPink})` }}>
            حفظ النتيجة
          </button>
          {onCancel ? <button onClick={onCancel} style={styles.ghostBtn}>إغلاق</button> : null}
        </div>

        {submitted ? <div style={{ marginTop: 10, color: brandCyan, fontWeight: 900, textAlign: 'center' }}>تم الحفظ ✅</div> : null}
      </div>
    </div>
  );
}
