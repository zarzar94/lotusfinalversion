import { useEffect, useMemo, useState, type CSSProperties } from 'react';

import { useLanguage } from '../../context/LanguageContext';
import { useUser, type UserRole } from '../../context/UserContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { brandCyan, brandPink, brandPurpleDark, styles } from '../styles';
import LabButton from '../labui/LabButton';
import LabButtonAnchor from '../labui/LabButtonAnchor';
import SignatureCapture from '../labui/SignatureCapture';
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
import { downloadSessionCsv, downloadSessionPdf, type ReportTemplate } from './report';
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

const resolveDefaultTemplate = (role?: UserRole): ReportTemplate => {
  switch (role) {
    case 'clinician':
      return 'clinician';
    case 'school_admin':
      return 'school';
    case 'parent':
      return 'parent';
    case 'super_admin':
      return 'parent';
    case 'patient':
    case 'guest':
    default:
      return 'parent';
  }
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
  const [reportTemplate, setReportTemplate] = useState<ReportTemplate>('parent');
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signatureVisible, setSignatureVisible] = useState(false);
  const { isArabic, direction, t } = useLanguage();
  const { user } = useUser();
  const defaultTemplate = useMemo(() => resolveDefaultTemplate(user?.role), [user?.role]);
  const reportLang = isArabic ? 'ar' : 'en';
  const modalRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    if (!open) return;
    // reset when opened fresh
    setStep('intro');
    setSession({ id: genId(), startedAt: Date.now(), outcomes: {} });
    setReportTemplate(defaultTemplate);
    setSignatureDataUrl(null);
    setSignatureVisible(false);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, defaultTemplate]);

  const upsertOutcome = (outcome: TestOutcome) => {
    setSession((s) => ({ ...s, outcomes: { ...s.outcomes, [outcome.key]: outcome } }));
  };

  const persistOutcome = (outcome: TestOutcome) => {
    upsertOutcome(outcome);
    saveLabSession(buildLabMetrics(outcome, session.id));
  };

  const setHeadphone = (hc: HeadphoneCheckResult) => {
    setSession((s) => ({ ...s, headphoneCheck: hc }));
  };

  const resultText = useMemo(() => ({
    high: {
      label: t('games.resultMeta.high.label'),
      hint: t('games.resultMeta.high.hint'),
    },
    medium: {
      label: t('games.resultMeta.medium.label'),
      hint: t('games.resultMeta.medium.hint'),
    },
    low: {
      label: t('games.resultMeta.low.label'),
      hint: t('games.resultMeta.low.hint'),
    },
  }), [t]);

  const templateLabels = useMemo(() => ({
    parent: t('games.report.typeParent'),
    clinician: t('games.report.typeClinician'),
    school: t('games.report.typeSchool'),
  }), [t]);
  const templateOptions: ReportTemplate[] = ['parent', 'clinician', 'school'];

  const composite = useMemo(() => {
    const { result } = compositeFrom(session.outcomes);
    return {
      result,
      label: resultText[result].label,
      message: resultText[result].hint,
    };
  }, [session.outcomes, resultText]);

  const cta = useMemo(() => {
    if (composite.result === 'low') return { title: t('games.nextStep.low'), hash: '/contact#contact', color: brandPink };
    if (composite.result === 'medium') return { title: t('games.nextStep.medium'), hash: '#modules', color: brandPurpleDark };
    return { title: t('games.nextStep.high'), hash: '/partners#schools', color: brandCyan };
  }, [composite.result, t]);
  const ctaStyle = useMemo(
    () => ({ '--lab-btn-bg': `linear-gradient(135deg, ${brandPurpleDark}, ${cta.color})` } as CSSProperties),
    [cta.color]
  );

  if (!open) return null;

  const stepLabel = () => {
    if (step === 'questionnaire') return t('games.questionnaire');
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
            <div style={{ fontWeight: 900, color: brandCyan }}>{'\u{1F9E0}'} {t('games.title')} {'\u2022'} {t('games.subtitle')}</div>
            <div style={styles.muted}>{t('games.suite.headerSubtitle')}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={styles.chip}>{stepLabel()}</span>
            <LabButton variant="ghost" onClick={close}>
              {t('games.close')}
            </LabButton>
          </div>
        </div>

        {step === 'intro' ? (
          <div style={{ marginTop: 12 }}>
            <div style={styles.section}>
              <div style={{ fontWeight: 900, color: brandPurpleDark }}>{t('games.suite.beforeTitle')}</div>
              <p style={{ ...styles.bodyText, marginTop: 8 }}>
                {t('games.suite.beforeIntro')}
                <b>{t('games.suite.beforeAttention')}</b>
                {t('games.suite.beforeSeparator1')}
                <b>{t('games.suite.beforeFrequency')}</b>
                {t('games.suite.beforeSeparator2')}
                <b>{t('games.suite.beforeSequence')}</b>
                {t('games.suite.beforeOutro')}
              </p>
              <ul style={{ marginTop: 10, opacity: 0.9, lineHeight: 1.7 }}>
                <li>
                  {t('games.suite.bullets.headphonesIntro')}
                  <b style={{ color: brandPink }}>{t('games.suite.bullets.headphonesLabel')}</b>
                  {t('games.suite.bullets.headphonesOutro')}
                </li>
                <li>{t('games.suite.bullets.nonDiagnostic')}</li>
                <li>{t('games.suite.bullets.demoReport')}</li>
              </ul>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <LabButton onClick={() => setStep('headphone')}>
                  {t('games.suite.startSession')}
                </LabButton>
                <LabButton variant="ghost" onClick={() => setStep('questionnaire')}>
                  {t('games.suite.startWithQuestionnaire')}
                </LabButton>
              </div>
            </div>

            <div style={{ ...styles.section, marginBottom: 0 }}>
              <div style={{ fontWeight: 900, color: brandCyan }}>{t('games.sessionId')}</div>
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
              setStep('focused_attention');
            }}
            onCancel={() => setStep('summary')}
          />
        ) : null}

        {step === 'focused_attention' ? (
          <FocusedAttentionTestPanel
            onDone={(o) => {
              persistOutcome(o);
              setStep('frequency');
            }}
            onCancel={() => setStep('summary')}
            stimulusMode="audio"
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
              setStep('dichotic_listening');
            }}
            onCancel={() => setStep('summary')}
          />
        ) : null}

        {step === 'dichotic_listening' ? (
          <DichoticListeningTestPanel
            onDone={(o) => {
              persistOutcome(o);
              setStep('speech_in_noise');
            }}
            onCancel={() => setStep('summary')}
          />
        ) : null}

        {step === 'speech_in_noise' ? (
          <SpeechInNoiseTestPanel
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
                  <div style={{ fontWeight: 900, color: resultMeta[composite.result].color }}>{t('games.suite.summaryTitle')} {composite.label}</div>
                  <p style={{ ...styles.muted, marginTop: 6 }}>{composite.message}</p>
                </div>
                <LabButtonAnchor
                  href={cta.hash}
                  onClick={() => onClose()}
                  style={ctaStyle}
                >
                  {cta.title}
                </LabButtonAnchor>
              </div>

              <div style={{ marginTop: 12, ...styles.section, marginBottom: 0 }}>
                <div style={{ fontWeight: 900, color: brandPurpleDark }}>{t('games.results')}</div>
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

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                flexWrap: 'wrap',
                marginTop: 12,
                direction: isArabic ? 'rtl' : 'ltr',
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
                  {t('games.report.typeLabel')}
                </span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {templateOptions.map((type) => {
                    const isActive = reportTemplate === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setReportTemplate(type)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 999,
                          border: `1px solid ${isActive ? brandCyan : 'rgba(255,255,255,0.12)'}`,
                          background: isActive ? 'rgba(143,211,204,0.15)' : 'rgba(255,255,255,0.02)',
                          color: isActive ? brandCyan : 'rgba(255,255,255,0.6)',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {templateLabels[type]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
                    {t('signature.title', 'Signature')} ({t('signature.optional', 'Optional')})
                  </span>
                  <LabButton
                    size="sm"
                    variant="ghost"
                    onClick={() => setSignatureVisible((prev) => !prev)}
                  >
                    {signatureVisible
                      ? t('signature.close', 'Close')
                      : t('signature.add', 'Add signature')}
                  </LabButton>
                  {signatureDataUrl && (
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                      {t('signature.saved', 'Signature saved.')}
                    </span>
                  )}
                </div>
                {signatureVisible && (
                  <SignatureCapture
                    value={signatureDataUrl}
                    onChange={setSignatureDataUrl}
                    helper={t('signature.hint', 'Draw your signature in the box.')}
                    clearLabel={t('signature.clear', 'Clear')}
                    savedLabel={t('signature.saved', 'Signature saved.')}
                  />
                )}
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
                <LabButton variant="ghost" onClick={() => downloadSessionCsv(session, { lang: reportLang, template: reportTemplate })}>
                  {t('games.exportCsvSummary')}
                </LabButton>
                <LabButton onClick={() => {
                  const signature = user
                    ? {
                        label: reportTemplate === 'school'
                          ? (isArabic ? '????? ???????' : 'School signature')
                          : reportTemplate === 'clinician'
                            ? (isArabic ? '????? ????????' : 'Clinician signature')
                            : (isArabic ? '????? ??? ?????' : 'Parent signature'),
                        name: (isArabic ? user.nameAr ?? user.name : user.name ?? user.nameAr) ?? user.email ?? '',
                        title: reportTemplate === 'school'
                          ? (user.school ?? (isArabic ? '???????' : 'School'))
                          : reportTemplate === 'clinician'
                            ? (user.clinic ?? (isArabic ? '???????' : 'Clinic'))
                            : (isArabic ? '??? ?????' : 'Parent'),
                        date: new Date().toLocaleDateString(isArabic ? 'ar-SA' : 'en-US'),
                        imageDataUrl: signatureDataUrl ?? undefined,
                      }
                    : undefined;
                  void downloadSessionPdf(
                    session,
                    { lang: reportLang, template: reportTemplate },
                    { label: composite.label, message: composite.message },
                    signature,
                  );
                }}>
                  {t('games.exportPdfReport')}
                </LabButton>
                <LabButton variant="ghost" onClick={() => setStep('attention')}>
                  {t('games.suite.retryTests')}
                </LabButton>
              </div>
              <p style={{ ...styles.muted, marginTop: 8 }}>
                {t('clinical.disclaimer')}
              </p>
            </div>

            <div style={{ ...styles.section, marginBottom: 0 }}>
              <div style={{ fontWeight: 900, color: brandPink }}>{t('games.suite.complianceTitle')}</div>
              <p style={{ ...styles.muted, marginTop: 6 }}>
                {t('games.suite.complianceText')}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

