import { useMemo, useState } from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { brandCyan, brandPink, brandPurpleDark, styles } from '../styles';
import LabButton from '../labui/LabButton';
import { renderLabIcon } from '../icons/index';
import type { GameResult, TestOutcome } from './types';
import {
  CalibrationStep,
  CTAResultPanel,
  MetricsSummaryPanel,
  ModuleFrame,
  ModuleHeader,
  PracticeTrialsStep,
} from './ui';

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
  const { isArabic } = useLanguage();
  const [answers, setAnswers] = useState<Answer[]>(Array(questions.length).fill(0));
  const [stage, setStage] = useState<'intro' | 'questions' | 'done'>('intro');

  const score = useMemo(() => answers.reduce<number>((s, a) => s + a, 0), [answers]);
  const maxScore = questions.length * 2;

  const result: GameResult = score <= 4 ? 'high' : score <= 9 ? 'medium' : 'low';

  const message =
    result === 'high'
      ? 'مؤشرات منخفضة حسب الاستبيان. إذا كانت هناك صعوبات واضحة، قد يكون السبب خارج السمع (مثل انتباه/لغة) ويستحسن تقييم شامل.'
      : result === 'medium'
        ? 'هناك مؤشرات متوسطة. ننصح بمقارنة ذلك مع الاختبارات الموضوعية داخل الموقع للحصول على صورة أقوى.'
        : 'مؤشرات مرتفعة حسب الاستبيان. إذا كانت الأعراض مستمرة في المدرسة/البيت، يفضّل تقييم متخصص.';

  const summaryTone = result === 'high' ? 'success' : result === 'medium' ? 'warning' : 'error';
  const resultLabel = result === 'high'
    ? isArabic ? 'مرتفع' : 'High'
    : result === 'medium'
      ? isArabic ? 'متوسط' : 'Medium'
      : isArabic ? 'منخفض' : 'Low';

  const introTitle = isArabic ? 'تهيئة سريعة قبل الاستبيان' : 'Quick setup before the questionnaire';
  const introDescription = isArabic
    ? 'اختر مكانًا هادئًا وأجب بصدق. هذا استبيان ذاتي وليس تشخيصًا.'
    : 'Find a quiet moment and answer honestly. This is a subjective checklist, not a diagnosis.';
  const introHint = isArabic ? 'يمكنك تعديل الإجابات قبل الإرسال.' : 'You can adjust answers before submitting.';

  const submit = () => {
    const outcome: TestOutcome = {
      key: 'questionnaire',
      title: 'استبيان مؤشرات (Subjective Checklist)',
      result,
      scoreLabel: `Score=${score}/${maxScore}`,
      message,
      metrics: {
        totalQuestions: questions.length,
        totalScore: score,
        note: 'Subjective questionnaire, not a diagnosis.',
      },
      trials: questions.map((q, idx) => ({ question: q, answer: label(answers[idx] as Answer), value: answers[idx] })),
    };

    setStage('done');
    onDone(outcome);
  };

  return (
    <ModuleFrame>
      <ModuleHeader
        title={<>استبيان مؤشرات للأهل (غير تشخيصي)</>}
        subtitle={<>يدعم نتائج الاختبارات الموضوعية لكنه لا يكفي وحده لاتخاذ قرار.</>}
        tone="cyan"
        status={isArabic ? 'ذاتي' : 'Subjective'}
        statusTone="purple"
      />

      {stage === 'intro' ? (
        <CalibrationStep
          title={introTitle}
          description={introDescription}
          hint={introHint}
          tone="cyan"
          actions={(
            <>
              <LabButton onClick={() => setStage('questions')}>
                {isArabic ? 'ابدأ الاستبيان' : 'Start questionnaire'}
              </LabButton>
              {onCancel ? (
                <LabButton variant="ghost" onClick={onCancel}>
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </LabButton>
              ) : null}
            </>
          )}
        />
      ) : null}

      {stage === 'questions' ? (
        <PracticeTrialsStep title={isArabic ? 'ذاتي' : 'Subjective'}>
        <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
          {questions.map((q, idx) => (
            <div key={q} style={{ ...styles.section, marginBottom: 0 }}>
              <div style={{ fontWeight: 900 }}>{idx + 1}. {q}</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                {[0, 1, 2].map((v) => {
                  const val = v as Answer;
                  const active = answers[idx] === val;
                  return (
                    <LabButton
                      key={v}
                      onClick={() => setAnswers((a) => a.map((x, i) => (i === idx ? val : x)))}
                      variant={active ? 'primary' : 'ghost'}
                    >
                      {label(val)}
                    </LabButton>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12, gap: 10, flexWrap: 'wrap' }}>
          <LabButton onClick={submit}>
            حفظ النتيجة
          </LabButton>
          {onCancel ? (
            <LabButton variant="ghost" onClick={onCancel}>
              إغلاق
            </LabButton>
          ) : null}
        </div>
      </PracticeTrialsStep>
      ) : null}

      {stage === 'done' ? (
        <>
          <div style={{ ...styles.section, marginBottom: 12 }}>
            <div style={{ fontWeight: 900, color: brandPurpleDark }}>النتيجة المبدئية</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>
              مجموع النقاط: <b style={{ color: brandPink }}>{score}</b> / {maxScore}
            </p>
            <p style={{ ...styles.muted, marginTop: 6 }}>{message}</p>
          </div>
          <MetricsSummaryPanel
            title={isArabic ? 'ملخص الاستبيان' : 'Questionnaire summary'}
            subtitle={message}
            tone={summaryTone}
            metrics={[
              { label: isArabic ? 'النتيجة' : 'Result', value: resultLabel },
              { label: isArabic ? 'النقاط' : 'Score', value: `${score}/${maxScore}` },
              { label: isArabic ? 'الأسئلة' : 'Questions', value: questions.length },
            ]}
            footer={isArabic ? 'استبيان ذاتي غير تشخيصي.' : 'Subjective questionnaire, not a diagnosis.'}
          />
          <CTAResultPanel
            title={(
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {renderLabIcon('\u2705', { size: 16, tone: 'success' })}
                <span>{isArabic ? 'تم حفظ النتيجة' : 'Result saved'}</span>
              </span>
            )}
            description={isArabic ? 'يمكنك العودة للوحة أو بدء جلسة أخرى.' : 'You can return to the dashboard or start another session.'}
            actions={onCancel ? (
              <LabButton variant="ghost" onClick={onCancel}>
                {isArabic ? 'إغلاق' : 'Close'}
              </LabButton>
            ) : undefined}
          />
        </>
      ) : null}
    </ModuleFrame>
  );
}
