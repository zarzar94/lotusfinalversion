import { useMemo } from 'react';
import { styles, brandCyan, brandPink, brandPurple, brandPurpleDark } from './styles';
import { CLINIC } from '../data/clinic';
import { handleWhatsApp } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';
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
    badge: 'PILOT',
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
    badge: 'PARTNER',
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
    badge: 'ENTERPRISE',
    color: brandPink,
    bullets: [
      t('schools.tiers.enterprise.bullet1'),
      t('schools.tiers.enterprise.bullet2'),
      t('schools.tiers.enterprise.bullet3'),
      t('schools.tiers.enterprise.bullet4'),
    ],
  },
];

const SchoolPartnershipSection = () => {
  const { t, isArabic, direction } = useLanguage();
  const processSteps = useMemo(() => getProcessSteps(t), [t]);
  const tiers = useMemo(() => getTiers(t), [t]);
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
            <span style={{ ...styles.chip, background: 'rgba(175,132,186,0.12)', borderColor: 'rgba(175,132,186,0.25)' }}>Learning Support</span>
            <span style={{ ...styles.chip, background: 'rgba(176,18,112,0.12)', borderColor: 'rgba(176,18,112,0.25)' }}>SEN / Inclusion</span>
          </div>

          <div style={{ marginTop: 12, ...styles.section, marginBottom: 0 }}>
            <div style={{ fontWeight: 900, color: brandCyan }}>{t('schools.tryDemoNow')}</div>
            <p style={{ ...styles.muted, marginTop: 6 }}>
              {t('schools.demoInstructions')}
            </p>
            <a href="/assessment#games" style={{ ...styles.primaryBtn, textDecoration: 'none', marginTop: 10, display: 'inline-flex' }}>
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
                href="/contact#contact"
                style={{
                  ...styles.primaryBtn,
                  textDecoration: 'none',
                  background: `linear-gradient(135deg, ${tier.color}, ${brandPink})`,
                }}
              >
                {t('schools.requestQuote')}
              </a>
              <a href="/faq#comparison" style={{ ...styles.ghostBtn, textDecoration: 'none', borderColor: `${tier.color}44` }}>
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
            href="/contact#contact"
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
