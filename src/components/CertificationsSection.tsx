/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - Certifications & Credentials Section
 * Display practitioner credentials, certifications, and professional affiliations
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  brand,
  gradients,
  shadows,
  spacing,
  radius,
  typography,
  transitions,
  cards,
} from './styles';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Certification {
  id: string;
  type: 'practitioner' | 'training' | 'affiliation' | 'education';
  name: string;
  nameAr: string;
  issuingBody: string;
  issuingBodyAr: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  description: string;
  descriptionAr: string;
  icon: string;
  color: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const certifications: Certification[] = [
  {
    id: '1',
    type: 'practitioner',
    name: 'Certified Bérard AIT Practitioner',
    nameAr: 'ممارس معتمد لـ Bérard AIT',
    issuingBody: 'Bérard AIT International',
    issuingBodyAr: 'Bérard AIT الدولية',
    issueDate: '2018',
    description: 'Certified to administer the complete Bérard Auditory Integration Training protocol, including initial assessments, 10-day treatment programs, and follow-up evaluations.',
    descriptionAr: 'معتمد لتقديم بروتوكول تدريب التكامل السمعي Bérard الكامل، بما في ذلك التقييمات الأولية وبرامج العلاج لمدة 10 أيام وتقييمات المتابعة.',
    icon: '🎧',
    color: brand.cyan,
  },
  {
    id: '2',
    type: 'training',
    name: 'Advanced AIT Practitioner Training',
    nameAr: 'تدريب ممارس AIT المتقدم',
    issuingBody: 'The Bérard AIT International Society',
    issuingBodyAr: 'الجمعية الدولية لـ Bérard AIT',
    issueDate: '2020',
    description: 'Advanced certification covering complex cases, modified protocols for special populations, and integration with other therapeutic approaches.',
    descriptionAr: 'شهادة متقدمة تغطي الحالات المعقدة والبروتوكولات المعدلة للفئات الخاصة والتكامل مع المناهج العلاجية الأخرى.',
    icon: '🎓',
    color: brand.purple,
  },
  {
    id: '3',
    type: 'education',
    name: 'Masters in Audiology & Speech Pathology',
    nameAr: 'ماجستير في علم السمع وأمراض النطق',
    issuingBody: 'University of Jordan',
    issuingBodyAr: 'الجامعة الأردنية',
    issueDate: '2015',
    description: 'Comprehensive training in auditory processing, speech-language disorders, and therapeutic interventions for pediatric and adult populations.',
    descriptionAr: 'تدريب شامل في المعالجة السمعية واضطرابات النطق واللغة والتدخلات العلاجية للأطفال والبالغين.',
    icon: '📜',
    color: brand.pink,
  },
  {
    id: '4',
    type: 'affiliation',
    name: 'International Association of AIT Practitioners',
    nameAr: 'الرابطة الدولية لممارسي AIT',
    issuingBody: 'IAAITP',
    issuingBodyAr: 'IAAITP',
    issueDate: '2018',
    description: 'Active member of the international professional organization dedicated to advancing auditory integration training practices and research.',
    descriptionAr: 'عضو نشط في المنظمة المهنية الدولية المكرسة لتطوير ممارسات وأبحاث تدريب التكامل السمعي.',
    icon: '🌐',
    color: '#FFD700',
  },
  {
    id: '5',
    type: 'training',
    name: 'Sensory Integration Certification',
    nameAr: 'شهادة التكامل الحسي',
    issuingBody: 'American Occupational Therapy Association',
    issuingBodyAr: 'الجمعية الأمريكية للعلاج الوظيفي',
    issueDate: '2019',
    description: 'Specialized training in sensory processing disorders and their intersection with auditory processing challenges.',
    descriptionAr: 'تدريب متخصص في اضطرابات المعالجة الحسية وتقاطعها مع تحديات المعالجة السمعية.',
    icon: '🧠',
    color: '#00CED1',
  },
  {
    id: '6',
    type: 'education',
    name: 'Pediatric Developmental Specialist',
    nameAr: 'أخصائي النمو عند الأطفال',
    issuingBody: 'Saudi Commission for Health Specialties',
    issuingBodyAr: 'الهيئة السعودية للتخصصات الصحية',
    issueDate: '2017',
    description: 'Board certification in pediatric developmental assessments and interventions, with focus on neurodevelopmental conditions.',
    descriptionAr: 'شهادة مجلس في تقييمات وتدخلات نمو الأطفال، مع التركيز على الحالات العصبية النمائية.',
    icon: '👶',
    color: '#FF6B6B',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  section: {
    padding: `${spacing[16]} ${spacing[4]}`,
    background: `linear-gradient(180deg, ${brand.ink} 0%, ${brand.panel} 100%)`,
    position: 'relative' as const,
  } as React.CSSProperties,

  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  } as React.CSSProperties,

  header: {
    textAlign: 'center' as const,
    marginBottom: spacing[10],
  } as React.CSSProperties,

  sectionLabel: {
    fontSize: typography.size.sm,
    color: brand.purple,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginBottom: spacing[2],
  } as React.CSSProperties,

  title: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    background: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: spacing[3],
  } as React.CSSProperties,

  subtitle: {
    fontSize: typography.size.lg,
    color: '#888',
    maxWidth: '600px',
    margin: '0 auto',
  } as React.CSSProperties,

  certGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: spacing[6],
  } as React.CSSProperties,

  certCard: {
    ...cards.glass,
    padding: spacing[6],
    position: 'relative' as const,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: transitions.normal,
  } as React.CSSProperties,

  certCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: shadows.lg,
  } as React.CSSProperties,

  certGlow: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    borderRadius: `${radius.lg} ${radius.lg} 0 0`,
  } as React.CSSProperties,

  certHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing[4],
    marginBottom: spacing[4],
  } as React.CSSProperties,

  certIcon: {
    width: '60px',
    height: '60px',
    borderRadius: radius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.8rem',
    flexShrink: 0,
  } as React.CSSProperties,

  certMeta: {
    flex: 1,
  } as React.CSSProperties,

  certType: {
    fontSize: typography.size.xs,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: spacing[1],
    opacity: 0.8,
  } as React.CSSProperties,

  certName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: '#fff',
    marginBottom: spacing[1],
  } as React.CSSProperties,

  certIssuer: {
    fontSize: typography.size.sm,
    color: '#888',
  } as React.CSSProperties,

  certDescription: {
    fontSize: typography.size.sm,
    color: '#aaa',
    lineHeight: 1.6,
    marginBottom: spacing[4],
  } as React.CSSProperties,

  certFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[4],
    borderTop: '1px solid #333',
  } as React.CSSProperties,

  certDate: {
    fontSize: typography.size.xs,
    color: '#666',
  } as React.CSSProperties,

  certBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: radius.full,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  } as React.CSSProperties,

  verifiedBadge: {
    background: `${brand.cyan}20`,
    color: brand.cyan,
  } as React.CSSProperties,

  affiliationsBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[8],
    marginTop: spacing[12],
    padding: `${spacing[6]} ${spacing[4]}`,
    background: `${brand.panel}80`,
    borderRadius: radius.xl,
    border: `1px solid ${brand.cyan}20`,
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  affiliationItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: spacing[2],
  } as React.CSSProperties,

  affiliationLogo: {
    width: '80px',
    height: '80px',
    borderRadius: radius.lg,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
  } as React.CSSProperties,

  affiliationName: {
    fontSize: typography.size.xs,
    color: '#888',
    textAlign: 'center' as const,
    maxWidth: '100px',
  } as React.CSSProperties,

  trustBadges: {
    display: 'flex',
    justifyContent: 'center',
    gap: spacing[6],
    marginTop: spacing[8],
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  trustBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: `${spacing[2]} ${spacing[4]}`,
    borderRadius: radius.full,
    background: `${brand.ink}`,
    border: '1px solid #333',
    fontSize: typography.size.sm,
    color: '#ccc',
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const CertificationsSection: React.FC = () => {
  const { isArabic } = useLanguage();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const certTypeLabels: Record<string, { en: string; ar: string }> = {
    practitioner: { en: 'Practitioner Certification', ar: 'شهادة ممارس' },
    training: { en: 'Professional Training', ar: 'تدريب مهني' },
    affiliation: { en: 'Professional Affiliation', ar: 'انتماء مهني' },
    education: { en: 'Academic Credential', ar: 'مؤهل أكاديمي' },
  };

  const affiliations = [
    { icon: '🎧', name: isArabic ? 'Bérard AIT الدولية' : 'Bérard AIT International' },
    { icon: '🏥', name: isArabic ? 'الهيئة السعودية للتخصصات' : 'Saudi Health Specialties' },
    { icon: '🌍', name: isArabic ? 'IAAITP' : 'IAAITP' },
    { icon: '🎓', name: isArabic ? 'ASHA' : 'ASHA' },
  ];

  const trustBadges = [
    { icon: '✓', label: isArabic ? 'معتمد دولياً' : 'Internationally Certified' },
    { icon: '🛡️', label: isArabic ? 'مرخص' : 'Licensed Professional' },
    { icon: '📋', label: isArabic ? 'مؤمن عليه' : 'Fully Insured' },
    { icon: '🔒', label: isArabic ? 'سرية تامة' : 'HIPAA Compliant' },
  ];

  return (
    <section id="certifications" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <p style={styles.sectionLabel}>
            {isArabic ? 'الشهادات والاعتمادات' : 'Certifications & Credentials'}
          </p>
          <h2 style={styles.title}>
            {isArabic ? 'مؤهلات موثوقة' : 'Trusted Qualifications'}
          </h2>
          <p style={styles.subtitle}>
            {isArabic
              ? 'التزام بأعلى معايير التدريب والممارسة المهنية'
              : 'Committed to the highest standards of professional training and practice'}
          </p>
        </div>

        {/* Certifications Grid */}
        <div style={styles.certGrid}>
          {certifications.map(cert => (
            <div
              key={cert.id}
              style={{
                ...styles.certCard,
                ...(hoveredCard === cert.id ? styles.certCardHover : {}),
              }}
              onMouseEnter={() => setHoveredCard(cert.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Color accent bar */}
              <div
                style={{
                  ...styles.certGlow,
                  background: `linear-gradient(90deg, ${cert.color}, ${cert.color}00)`,
                }}
              />

              <div style={styles.certHeader}>
                <div
                  style={{
                    ...styles.certIcon,
                    background: `${cert.color}20`,
                  }}
                >
                  {cert.icon}
                </div>
                <div style={styles.certMeta}>
                  <p style={{ ...styles.certType, color: cert.color }}>
                    {isArabic
                      ? certTypeLabels[cert.type].ar
                      : certTypeLabels[cert.type].en}
                  </p>
                  <h3 style={styles.certName}>
                    {isArabic ? cert.nameAr : cert.name}
                  </h3>
                  <p style={styles.certIssuer}>
                    {isArabic ? cert.issuingBodyAr : cert.issuingBody}
                  </p>
                </div>
              </div>

              <p style={styles.certDescription}>
                {isArabic ? cert.descriptionAr : cert.description}
              </p>

              <div style={styles.certFooter}>
                <span style={styles.certDate}>
                  📅 {isArabic ? `منذ ${cert.issueDate}` : `Since ${cert.issueDate}`}
                </span>
                <span style={{ ...styles.certBadge, ...styles.verifiedBadge }}>
                  ✓ {isArabic ? 'موثق' : 'Verified'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Affiliations Bar */}
        <div style={styles.affiliationsBar}>
          {affiliations.map((aff, idx) => (
            <div key={idx} style={styles.affiliationItem}>
              <div style={styles.affiliationLogo}>{aff.icon}</div>
              <span style={styles.affiliationName}>{aff.name}</span>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div style={styles.trustBadges}>
          {trustBadges.map((badge, idx) => (
            <div key={idx} style={styles.trustBadge}>
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
