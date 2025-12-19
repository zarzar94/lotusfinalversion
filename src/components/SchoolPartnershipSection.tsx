import { useMemo, useCallback, useState } from 'react';
import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';
import { CLINIC } from '../data/clinic';
import { handleWhatsApp } from '../utils/whatsapp';
import { createPdfDoc, PDF_MARGIN_X, writePdfText } from '../utils/pdf';
import { useLanguage } from '../context/LanguageContext';
import { downloadSessionCsv, downloadSessionPdf } from './games/report';
import type { AssessmentSession, TestOutcome } from './games/types';
import { SchoolIcon, CheckCircleIcon, UsersIcon, ChartIcon, ClockIcon, DocumentIcon, StarIcon } from './Icons';

// Impact Statistics
const IMPACT_STATS = {
  schools: 25,
  students: 1500,
  satisfaction: 96,
  teachers: 200,
};

// Process Steps
const getProcessSteps = (t: (key: string) => string) => [
  {
    step: 1,
    icon: <DocumentIcon size={24} color={brandCyan} />,
    title: t('schools.process.step1Title'),
    description: t('schools.process.step1Desc'),
  },
  {
    step: 2,
    icon: <UsersIcon size={24} color={brandPurple} />,
    title: t('schools.process.step2Title'),
    description: t('schools.process.step2Desc'),
  },
  {
    step: 3,
    icon: <ChartIcon size={24} color={brandPink} />,
    title: t('schools.process.step3Title'),
    description: t('schools.process.step3Desc'),
  },
  {
    step: 4,
    icon: <CheckCircleIcon size={24} color="#22c55e" />,
    title: t('schools.process.step4Title'),
    description: t('schools.process.step4Desc'),
  },
];

// Tier data with translation keys
const getTiers = (t: (key: string) => string) => [
  {
    name: t('schools.tiers.pilot.name'),
    subtitle: t('schools.tiers.pilot.subtitle'),
    badge: t('schools.tiers.pilot.badge'),
    color: brandCyan,
    bullets: [
      t('schools.tiers.pilot.bullet1'),
      t('schools.tiers.pilot.bullet2'),
      t('schools.tiers.pilot.bullet3'),
      t('schools.tiers.pilot.bullet4'),
    ],
  },
  {
    name: t('schools.tiers.partner.name'),
    subtitle: t('schools.tiers.partner.subtitle'),
    badge: t('schools.tiers.partner.badge'),
    color: brandPurple,
    popular: true,
    bullets: [
      t('schools.tiers.partner.bullet1'),
      t('schools.tiers.partner.bullet2'),
      t('schools.tiers.partner.bullet3'),
      t('schools.tiers.partner.bullet4'),
    ],
  },
  {
    name: t('schools.tiers.enterprise.name'),
    subtitle: t('schools.tiers.enterprise.subtitle'),
    badge: t('schools.tiers.enterprise.badge'),
    color: brandPink,
    bullets: [
      t('schools.tiers.enterprise.bullet1'),
      t('schools.tiers.enterprise.bullet2'),
      t('schools.tiers.enterprise.bullet3'),
      t('schools.tiers.enterprise.bullet4'),
    ],
  },
];

const buildDemoSession = (t: (key: string) => string): { session: AssessmentSession; composite: { label: string; message: string } } => {
  const now = Date.now();
  const sampleId = `DEMO-SCHOOL-${new Date(now).getFullYear()}-${String(now).slice(-5)}`;

  const attention: TestOutcome = {
    key: 'attention',
    title: t('schools.demoSession.attention.title'),
    result: 'medium',
    scoreLabel: t('schools.demoSession.attention.scoreLabel'),
    message: t('schools.demoSession.attention.message'),
    metrics: {
      trials: 36,
      targets: 12,
      hitRate: '0.78',
      falseAlarmRate: '0.12',
      avgReactionMs: 620,
      sustainedAttention: t('schools.demoSession.attention.metrics.sustainedAttention'),
      rtVariability: t('schools.demoSession.attention.metrics.rtVariability'),
      fatigueIndex: t('schools.demoSession.attention.metrics.fatigueIndex'),
      maxNoiseLevel: '0.62',
    },
  };

  const frequency: TestOutcome = {
    key: 'frequency',
    title: t('schools.demoSession.frequency.title'),
    result: 'high',
    scoreLabel: t('schools.demoSession.frequency.scoreLabel'),
    message: t('schools.demoSession.frequency.message'),
    metrics: {
      referenceHz: 1000,
      trials: 24,
      accuracyPct: 88,
      thresholdHz: 45,
      thresholdPercent: '4.5%',
      consistencyStdHz: 12,
      avgReactionMs: 520,
    },
  };

  const sequence: TestOutcome = {
    key: 'sequence',
    title: t('schools.demoSession.sequence.title'),
    result: 'medium',
    scoreLabel: t('schools.demoSession.sequence.scoreLabel'),
    message: t('schools.demoSession.sequence.message'),
    metrics: {
      rounds: 8,
      correctRounds: 6,
      accuracyPct: 75,
      maxSpan: 5,
      avgReactionMs: 690,
      workingMemorySpan: 5,
    },
  };

  const questionnaire: TestOutcome = {
    key: 'questionnaire',
    title: t('schools.demoSession.questionnaire.title'),
    result: 'medium',
    scoreLabel: t('schools.demoSession.questionnaire.scoreLabel'),
    message: t('schools.demoSession.questionnaire.message'),
    metrics: {
      totalQuestions: 10,
      totalScore: 22,
      note: t('schools.demoSession.questionnaire.metrics.note'),
    },
  };

  const composite = {
    label: t('schools.demoSession.composite.label'),
    message: t('schools.demoSession.composite.message'),
  };

  return {
    session: {
      id: sampleId,
      startedAt: now - 1000 * 60 * 60 * 24 * 3,
      headphoneCheck: { supported: true, passed: true, correct: 4, total: 4 },
      outcomes: {
        attention,
        frequency,
        sequence,
        questionnaire,
      },
    },
    composite,
  };
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const downloadInterpretationGuide = async (t: (key: string) => string, isArabic: boolean) => {
  const doc = await createPdfDoc();

  doc.setFont('Cairo', 'bold');
  doc.setFontSize(18);
  let y = 62;
  y = writePdfText(doc, t('schools.interpretationGuide.title'), PDF_MARGIN_X, y, { maxWidth: 520, lineHeight: 22 });

  doc.setFont('Cairo', 'normal');
  doc.setFontSize(11);
  y = writePdfText(doc, t('schools.interpretationGuide.subtitle'), PDF_MARGIN_X, y + 8, { maxWidth: 520, lineHeight: 16 });
  y = writePdfText(doc, t('schools.interpretationGuide.intro'), PDF_MARGIN_X, y + 6, { maxWidth: 520, lineHeight: 16 });

  const writeSection = (title: string, items: string[], startY: number) => {
    doc.setFont('Cairo', 'bold');
    doc.setFontSize(12);
    let nextY = writePdfText(doc, title, PDF_MARGIN_X, startY + 12, { maxWidth: 520, lineHeight: 16 });
    doc.setFont('Cairo', 'normal');
    doc.setFontSize(11);
    items.forEach((item) => {
      nextY = writePdfText(doc, `- ${item}`, PDF_MARGIN_X, nextY + 6, { maxWidth: 520, lineHeight: 16 });
    });
    return nextY;
  };

  y = writeSection(
    t('schools.interpretationGuide.levelsTitle'),
    [
      t('schools.interpretationGuide.levels.high'),
      t('schools.interpretationGuide.levels.medium'),
      t('schools.interpretationGuide.levels.low'),
    ],
    y,
  );

  y = writeSection(
    t('schools.interpretationGuide.signalsTitle'),
    [
      t('schools.interpretationGuide.signals.hitRate'),
      t('schools.interpretationGuide.signals.rtVariability'),
      t('schools.interpretationGuide.signals.sequenceSpan'),
    ],
    y,
  );

  y = writeSection(
    t('schools.interpretationGuide.nextStepsTitle'),
    [
      t('schools.interpretationGuide.nextSteps.share'),
      t('schools.interpretationGuide.nextSteps.assess'),
      t('schools.interpretationGuide.nextSteps.retest'),
    ],
    y,
  );

  doc.setFont('Cairo', 'normal');
  doc.setFontSize(10);
  y = writePdfText(doc, t('schools.interpretationGuide.footer'), PDF_MARGIN_X, y + 10, { maxWidth: 520, lineHeight: 14 });

  doc.save(`Berard-AIT-Interpretation-Guide-${isArabic ? 'AR' : 'EN'}.pdf`);
};

const SchoolPartnershipSection = () => {
  const { t, isArabic, direction } = useLanguage();
  const processSteps = useMemo(() => getProcessSteps(t), [t]);
  const tiers = useMemo(() => getTiers(t), [t]);
  const [isDownloading, setIsDownloading] = useState(false);

  const demoPack = useMemo(() => ({
    title: t('schools.demoPack.title'),
    description: t('schools.demoPack.description'),
    items: [
      t('schools.demoPack.items.reportPdf'),
      t('schools.demoPack.items.reportCsv'),
      t('schools.demoPack.items.guidePdf'),
    ],
    note: t('schools.demoPack.note'),
    button: t('schools.demoPack.button'),
    buttonLoading: t('schools.demoPack.buttonLoading'),
  }), [t]);

  const handleDownloadDemoPack = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const { session, composite } = buildDemoSession(t);
      await downloadSessionPdf(session, composite);
      await wait(350);
      downloadSessionCsv(session);
      await wait(350);
      await downloadInterpretationGuide(t, isArabic);
    } finally {
      setIsDownloading(false);
    }
  }, [isArabic, isDownloading, t]);
  return (
    <section id="schools" style={styles.sectionCard}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionHeaderRow}>
          <h2 style={styles.h2}>{t('schools.title')}</h2>
          <span style={{ ...styles.chip, background: 'rgba(143,211,204,0.12)', borderColor: 'rgba(143,211,204,0.25)' }}>
            🏫 {t('schools.badge')}
          </span>
        </div>
        <p style={styles.bodyText}>
          {t('schools.description')}
        </p>
        <p style={styles.muted}>
          ✅ {t('schools.disclaimer')}
        </p>
      </div>

      {/* Impact Statistics Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 16,
        marginBottom: 24,
        padding: 20,
        background: 'linear-gradient(135deg, rgba(143,211,204,0.08), rgba(175,132,186,0.08))',
        borderRadius: 16,
        border: '1px solid rgba(143,211,204,0.15)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: brandCyan }}>{IMPACT_STATS.schools}+</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{t('schools.stats.schools')}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: brandPurple }}>{IMPACT_STATS.students.toLocaleString()}+</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{t('schools.stats.students')}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: brandPink }}>{IMPACT_STATS.teachers}+</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{t('schools.stats.teachers')}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#22c55e' }}>{IMPACT_STATS.satisfaction}%</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{t('schools.stats.satisfaction')}</div>
        </div>
      </div>

      {/* Partnership Process Timeline */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ ...styles.h3, marginBottom: 16 }}>{t('schools.processTitle')}</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
        }}>
          {processSteps.map((step, index) => (
            <div key={step.step} style={{
              position: 'relative',
              padding: 16,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{
                position: 'absolute',
                top: -12,
                [isArabic ? 'right' : 'left']: 16,
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 900,
                color: '#fff',
              }}>
                {step.step}
              </div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                {step.icon}
                <div style={{ fontWeight: 800, fontSize: 15 }}>{step.title}</div>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 8, lineHeight: 1.6 }}>
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <div style={styles.section}>
          <h3 style={{ ...styles.h3, marginTop: 0 }}>{t('schools.whatYouGet')}</h3>
          <ul style={{ margin: 0, paddingInlineStart: 18, lineHeight: 1.85, opacity: 0.92 }}>
            <li>{t('schools.benefits.demo')}</li>
            <li>{t('schools.benefits.report')}</li>
            <li>{t('schools.benefits.workshop')}</li>
            <li>{t('schools.benefits.templates')}</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={{ ...styles.h3, marginTop: 0 }}>{t('schools.suitableFor')}</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={styles.chip}>{t('schools.audiences.schools')}</span>
            <span style={styles.chip}>{t('schools.audiences.universities')}</span>
            <span style={styles.chip}>{t('schools.audiences.supportCenters')}</span>
            <span style={{ ...styles.chip, background: 'rgba(175,132,186,0.12)', borderColor: 'rgba(175,132,186,0.25)' }}>{t('schools.audiences.learningSupport')}</span>
            <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.12)', borderColor: 'rgba(176,18,112,0.25)' }}>{t('schools.audiences.senInclusion')}</span>
          </div>

          <div style={{ marginTop: 12, ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: brandCyan }}>{t('schools.tryDemoNow')}</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>
              {t('schools.demoInstructions')}
            </p>
            <a href="#games" style={{ ...styles.primaryBtn, textDecoration: 'none', marginTop: 10, display: 'inline-flex' }}>
              {t('schools.runSimulation')}
            </a>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={{ ...styles.h3, marginTop: 0 }}>{t('schools.whyAdvanced')}</h3>
          <ul style={{ margin: 0, paddingInlineStart: 18, lineHeight: 1.85, opacity: 0.92 }}>
            <li>{t('schools.advantages.interactive')}</li>
            <li>{t('schools.advantages.instantReport')}</li>
            <li>{t('schools.advantages.clearOptions')}</li>
            <li>{t('schools.advantages.arabicFirst')}</li>
          </ul>
        </div>
      </div>

      {/* Demo Pack Download */}
      <div style={{
        marginTop: 18,
        padding: 20,
        background: 'linear-gradient(135deg, rgba(143,211,204,0.12), rgba(175,132,186,0.12))',
        borderRadius: 16,
        border: '1px solid rgba(143,211,204,0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          flexDirection: isArabic ? 'row-reverse' : 'row',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexDirection: isArabic ? 'row-reverse' : 'row' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(143,211,204,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <SchoolIcon size={22} color={brandCyan} />
            </div>
            <div style={{ textAlign: 'start' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{demoPack.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                {demoPack.description}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownloadDemoPack}
            disabled={isDownloading}
            style={{
              ...styles.primaryBtn,
              background: isDownloading
                ? 'linear-gradient(135deg, rgba(143,211,204,0.6), rgba(175,132,186,0.6))'
                : 'linear-gradient(135deg, #1aa37a, #8FD3CC)',
              color: '#05060d',
              opacity: isDownloading ? 0.7 : 1,
              cursor: isDownloading ? 'wait' : 'pointer',
            }}
          >
            {isDownloading ? demoPack.buttonLoading : demoPack.button}
          </button>
        </div>

        <div style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}>
          {demoPack.items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                background: 'rgba(0,0,0,0.25)',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)',
                flexDirection: isArabic ? 'row-reverse' : 'row',
                textAlign: 'start',
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {index === 0 ? <DocumentIcon size={18} color={brandCyan} /> : null}
                {index === 1 ? <ChartIcon size={18} color={brandPurple} /> : null}
                {index === 2 ? <StarIcon size={18} color={brandPink} /> : null}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                {item}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'start' }}>
          {demoPack.note}
        </div>
      </div>

      {/* Pricing Tiers */}
      <h3 style={{ ...styles.h3, marginTop: 24, marginBottom: 16 }}>{t('schools.packagesTitle')}</h3>
      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {tiers.map((tier) => (
          <div key={tier.name} style={{
            ...styles.sectionCard,
            marginBottom: 0,
            position: 'relative',
            border: tier.popular ? `2px solid ${tier.color}` : undefined,
          }}>
            {tier.popular && (
              <div style={{
                position: 'absolute',
                top: -12,
                [isArabic ? 'left' : 'right']: 16,
                background: tier.color,
                color: '#fff',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 800,
              }}>
                {t('schools.mostPopular')}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 16 }}>{tier.name}</div>
                <div style={styles.muted}>{tier.subtitle}</div>
              </div>
              <span
                style={{
                  ...styles.chip,
                  background: `${tier.color}22`,
                  borderColor: `${tier.color}44`,
                  color: tier.color,
                }}
              >
                {tier.badge}
              </span>
            </div>

            <ul style={{ margin: 0, marginTop: 10, paddingInlineStart: 18, lineHeight: 1.85, opacity: 0.92 }}>
              {tier.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              <a
                href="#contact"
                style={{
                  ...styles.primaryBtn,
                  textDecoration: 'none',
                  background: `linear-gradient(135deg, ${tier.color}, ${brandPink})`,
                }}
              >
                {t('schools.requestQuote')}
              </a>
              <a href="#comparison" style={{ ...styles.ghostBtn, textDecoration: 'none', borderColor: `${tier.color}44` }}>
                {t('schools.comparePrograms')}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Important Note */}
      <div style={{ marginTop: 14, ...styles.section, marginBottom: 0 }}>
        <div style={{ fontWeight: 900, color: brandPurpleDark }}>{t('schools.importantNote')}</div>
        <p style={{ ...styles.muted, marginTop: 6 }}>
          {t('schools.importantNoteText')}
        </p>
      </div>

      {/* School Testimonial */}
      <div style={{
        marginTop: 20,
        padding: 24,
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 16,
          [isArabic ? 'right' : 'left']: 20,
          fontSize: 48,
          opacity: 0.15,
          color: brandCyan,
        }}>❝</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', margin: 0 }}>
            {t('schools.testimonial.quote')}
          </p>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${brandCyan}40, ${brandPurple}40)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}>👩‍🏫</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{t('schools.testimonial.author')}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{t('schools.testimonial.role')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent School CTA */}
      <div style={{
        marginTop: 20,
        padding: 24,
        background: `linear-gradient(135deg, rgba(143,211,204,0.15), rgba(175,132,186,0.15))`,
        borderRadius: 16,
        border: '1px solid rgba(143,211,204,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
            🏫 {t('schools.cta.title')}
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
            {t('schools.cta.subtitle')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handleWhatsApp(t('schools.cta.whatsappMessage'))}
            style={{
              ...styles.primaryBtn,
              background: '#25D366',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              border: 'none',
            }}
          >
            💬 {t('schools.cta.whatsappButton')}
          </button>
          <a
            href="#contact"
            style={{
              ...styles.ghostBtn,
              textDecoration: 'none',
              borderColor: brandPurple,
              color: brandPurple,
            }}
          >
            {t('schools.cta.contactForm')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default SchoolPartnershipSection;
