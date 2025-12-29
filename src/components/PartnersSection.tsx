/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOTUS SOUND LAB - Partners Section
 * Display partner organizations, schools, clinics, and collaborators
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  brand,
  colors,
  gradients,
  shadows,
  spacing,
  radius,
  typography,
  transitions,
  cards,
  buttons,
  accent,
} from '../styles';
import { renderLabIcon } from './icons/index';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Partner {
  id: string;
  type: 'school' | 'clinic' | 'research' | 'organization' | 'hospital';
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  logo: string;
  location: string;
  locationAr: string;
  partnerSince: string;
  featured: boolean;
  services: string[];
  servicesAr: string[];
  website?: string;
  color: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const partners: Partner[] = [
  {
    id: '1',
    type: 'school',
    name: 'International School of Riyadh',
    nameAr: 'المدرسة الدولية بالرياض',
    description: 'Leading international school implementing AIT screening programs for students with learning differences.',
    descriptionAr: 'مدرسة دولية رائدة تنفذ برامج فحص AIT للطلاب ذوي صعوبات التعلم.',
    logo: '\u{1F3EB}',
    location: 'Riyadh, Saudi Arabia',
    locationAr: 'الرياض، المملكة العربية السعودية',
    partnerSince: '2020',
    featured: true,
    services: ['Student Screening', 'Teacher Training', 'Parent Workshops'],
    servicesAr: ['فحص الطلاب', 'تدريب المعلمين', 'ورش عمل الآباء'],
    color: brand.cyan,
  },
  {
    id: '2',
    type: 'hospital',
    name: 'King Faisal Specialist Hospital',
    nameAr: 'مستشفى الملك فيصل التخصصي',
    description: 'Partnership for clinical referrals and research collaboration in pediatric auditory processing.',
    descriptionAr: 'شراكة للإحالات السريرية والتعاون البحثي في معالجة السمع لدى الأطفال.',
    logo: '\u{1F3E5}',
    location: 'Riyadh, Saudi Arabia',
    locationAr: 'الرياض، المملكة العربية السعودية',
    partnerSince: '2019',
    featured: true,
    services: ['Clinical Referrals', 'Research Studies', 'Grand Rounds'],
    servicesAr: ['الإحالات السريرية', 'الدراسات البحثية', 'الجولات الكبرى'],
    color: brand.purple,
  },
  {
    id: '3',
    type: 'organization',
    name: 'Saudi Autism Society',
    nameAr: 'الجمعية السعودية للتوحد',
    description: 'Collaborative programs to support families of children with autism spectrum disorder.',
    descriptionAr: 'برامج تعاونية لدعم أسر الأطفال المصابين باضطراب طيف التوحد.',
    logo: '\u{1F499}',
    location: 'National',
    locationAr: 'على المستوى الوطني',
    partnerSince: '2021',
    featured: true,
    services: ['Family Support', 'Awareness Programs', 'Subsidized Treatment'],
    servicesAr: ['دعم الأسرة', 'برامج التوعية', 'العلاج المدعوم'],
    color: brand.pink,
  },
  {
    id: '4',
    type: 'school',
    name: 'Al-Faisal Academy',
    nameAr: 'أكاديمية الفيصل',
    description: 'Private academy with integrated auditory support services for students with APD.',
    descriptionAr: 'أكاديمية خاصة مع خدمات دعم سمعي متكاملة للطلاب ذوي اضطراب المعالجة السمعية.',
    logo: '\u{1F4DA}',
    location: 'Jeddah, Saudi Arabia',
    locationAr: 'جدة، المملكة العربية السعودية',
    partnerSince: '2022',
    featured: false,
    services: ['Student Screening', 'Classroom Modifications', 'Teacher Training'],
    servicesAr: ['فحص الطلاب', 'تعديلات الصف', 'تدريب المعلمين'],
    color: accent.gold,
  },
  {
    id: '5',
    type: 'clinic',
    name: 'Pediatric Development Center',
    nameAr: 'مركز نمو الطفل',
    description: 'Multidisciplinary pediatric clinic offering complementary OT and speech therapy services.',
    descriptionAr: 'عيادة أطفال متعددة التخصصات تقدم خدمات العلاج الوظيفي والنطق التكميلية.',
    logo: '\u{1F476}',
    location: 'Dammam, Saudi Arabia',
    locationAr: 'الدمام، المملكة العربية السعودية',
    partnerSince: '2021',
    featured: false,
    services: ['Co-Treatment', 'Referral Network', 'Case Coordination'],
    servicesAr: ['العلاج المشترك', 'شبكة الإحالة', 'تنسيق الحالات'],
    color: accent.teal,
  },
  {
    id: '6',
    type: 'research',
    name: 'KAUST Neuroscience Lab',
    nameAr: 'مختبر الأعصاب في كاوست',
    description: 'Research collaboration studying neuroplasticity and auditory processing interventions.',
    descriptionAr: 'تعاون بحثي يدرس المرونة العصبية وتدخلات المعالجة السمعية.',
    logo: '\u{1F52C}',
    location: 'Thuwal, Saudi Arabia',
    locationAr: 'ثول، المملكة العربية السعودية',
    partnerSince: '2023',
    featured: false,
    services: ['Research Studies', 'Data Analysis', 'Publication Collaboration'],
    servicesAr: ['الدراسات البحثية', 'تحليل البيانات', 'التعاون في النشر'],
    color: accent.violet,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  section: {
    padding: `${spacing[16]} ${spacing[4]}`,
    background: brand.ink,
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
    color: brand.cyan,
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
    color: colors.text.muted,
    maxWidth: '600px',
    margin: '0 auto',
  } as React.CSSProperties,

  filterTabs: {
    display: 'flex',
    justifyContent: 'center',
    gap: spacing[2],
    marginBottom: spacing[8],
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  filterTab: {
    padding: `${spacing[2]} ${spacing[4]}`,
    borderRadius: radius.full,
    fontSize: typography.size.sm,
    cursor: 'pointer',
    transition: transitions.fast,
    border: '1px solid transparent',
  } as React.CSSProperties,

  filterTabActive: {
    background: `${brand.cyan}20`,
    color: brand.cyan,
    border: `1px solid ${brand.cyan}40`,
  } as React.CSSProperties,

  filterTabInactive: {
    background: 'transparent',
    color: colors.text.disabled,
    border: `1px solid ${colors.border.emphasis}`,
  } as React.CSSProperties,

  partnersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: spacing[6],
  } as React.CSSProperties,

  partnerCard: {
    ...cards.glass,
    padding: spacing[6],
    position: 'relative' as const,
    overflow: 'hidden',
    transition: transitions.normal,
  } as React.CSSProperties,

  partnerCardFeatured: {
    border: `2px solid ${brand.cyan}40`,
  } as React.CSSProperties,

  featuredBadge: {
    position: 'absolute' as const,
    top: spacing[3],
    right: spacing[3],
    background: gradients.cyanPurple,
    color: colors.text.primary,
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: radius.full,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
  } as React.CSSProperties,

  typeBadge: {
    position: 'absolute' as const,
    top: spacing[3],
    left: spacing[3],
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: radius.full,
    fontSize: typography.size.xs,
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,

  partnerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
    marginBottom: spacing[4],
    marginTop: spacing[4],
  } as React.CSSProperties,

  partnerLogo: {
    width: '70px',
    height: '70px',
    borderRadius: radius.xl,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    flexShrink: 0,
  } as React.CSSProperties,

  partnerMeta: {
    flex: 1,
  } as React.CSSProperties,

  partnerName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing[1],
  } as React.CSSProperties,

  partnerLocation: {
    fontSize: typography.size.sm,
    color: colors.text.muted,
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  } as React.CSSProperties,

  partnerDescription: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: 1.6,
    marginBottom: spacing[4],
  } as React.CSSProperties,

  servicesList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: spacing[2],
    marginBottom: spacing[4],
  } as React.CSSProperties,

  serviceTag: {
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: radius.md,
    fontSize: typography.size.xs,
    background: `${brand.panel}`,
    color: colors.text.secondary,
    border: `1px solid ${colors.border.emphasis}`,
  } as React.CSSProperties,

  partnerFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[4],
    borderTop: `1px solid ${colors.border.emphasis}`,
  } as React.CSSProperties,

  partnerSince: {
    fontSize: typography.size.xs,
    color: colors.text.disabled,
  } as React.CSSProperties,

  viewButton: {
    ...buttons.ghost,
    padding: `${spacing[1]} ${spacing[3]}`,
    fontSize: typography.size.xs,
    borderRadius: radius.full,
  } as React.CSSProperties,

  ctaBox: {
    marginTop: spacing[12],
    padding: spacing[8],
    background: gradients.panel,
    borderRadius: radius.xl,
    border: `1px solid ${brand.purple}30`,
    textAlign: 'center' as const,
  } as React.CSSProperties,

  ctaTitle: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing[3],
  } as React.CSSProperties,

  ctaText: {
    fontSize: typography.size.base,
    color: colors.text.muted,
    maxWidth: '500px',
    margin: '0 auto',
    marginBottom: spacing[6],
  } as React.CSSProperties,

  ctaButton: {
    ...buttons.primary,
    padding: `${spacing[3]} ${spacing[8]}`,
    fontSize: typography.size.base,
    background: gradients.cyanPurple,
  } as React.CSSProperties,

  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: spacing[4],
    marginBottom: spacing[12],
    padding: spacing[6],
    background: `${brand.panel}80`,
    borderRadius: radius.xl,
    border: `1px solid ${brand.cyan}20`,
  } as React.CSSProperties,

  statItem: {
    textAlign: 'center' as const,
  } as React.CSSProperties,

  statValue: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.weight.bold,
    background: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  } as React.CSSProperties,

  statLabel: {
    fontSize: typography.size.sm,
    color: colors.text.muted,
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const PartnersSection: React.FC = () => {
  const { isArabic } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterCategories = useMemo(() => [
    { id: 'all', label: isArabic ? 'الكل' : 'All' },
    { id: 'school', label: isArabic ? 'مدارس' : 'Schools' },
    { id: 'hospital', label: isArabic ? 'مستشفيات' : 'Hospitals' },
    { id: 'clinic', label: isArabic ? 'عيادات' : 'Clinics' },
    { id: 'organization', label: isArabic ? 'منظمات' : 'Organizations' },
    { id: 'research', label: isArabic ? 'بحث' : 'Research' },
  ], [isArabic]);

  const filteredPartners = useMemo(() => {
    if (activeFilter === 'all') return partners;
    return partners.filter(p => p.type === activeFilter);
  }, [activeFilter]);

  const stats = useMemo(() => [
    { value: '15+', label: isArabic ? 'شريك نشط' : 'Active Partners' },
    { value: '8', label: isArabic ? 'مدارس' : 'Schools' },
    { value: '1000+', label: isArabic ? 'طالب مفحوص' : 'Students Screened' },
    { value: '5', label: isArabic ? 'مدن' : 'Cities Covered' },
  ], [isArabic]);

  const typeLabels: Record<string, { en: string; ar: string }> = {
    school: { en: 'School', ar: 'مدرسة' },
    hospital: { en: 'Hospital', ar: 'مستشفى' },
    clinic: { en: 'Clinic', ar: 'عيادة' },
    organization: { en: 'Organization', ar: 'منظمة' },
    research: { en: 'Research', ar: 'بحث' },
  };

  return (
    <section id="partners" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <p style={styles.sectionLabel}>
            {isArabic ? 'شركاؤنا' : 'Our Partners'}
          </p>
          <h2 style={styles.title}>
            {isArabic ? 'شراكات لتأثير أكبر' : 'Partnerships for Greater Impact'}
          </h2>
          <p style={styles.subtitle}>
            {isArabic
              ? 'نتعاون مع المؤسسات الرائدة لتوسيع نطاق خدماتنا'
              : 'Collaborating with leading institutions to expand our reach'}
          </p>
        </div>

        {/* Stats Bar */}
        <div style={styles.stats}>
          {stats.map((stat, idx) => (
            <div key={idx} style={styles.statItem}>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={styles.filterTabs}>
          {filterCategories.map(cat => (
            <button
              key={cat.id}
              style={{
                ...styles.filterTab,
                ...(activeFilter === cat.id
                  ? styles.filterTabActive
                  : styles.filterTabInactive),
              }}
              onClick={() => setActiveFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Partners Grid */}
        <div style={styles.partnersGrid}>
          {filteredPartners.map(partner => (
            <div
              key={partner.id}
              style={{
                ...styles.partnerCard,
                ...(partner.featured ? styles.partnerCardFeatured : {}),
              }}
            >
              {/* Type Badge */}
              <span
                style={{
                  ...styles.typeBadge,
                  background: `${partner.color}20`,
                  color: partner.color,
                }}
              >
                {isArabic
                  ? typeLabels[partner.type].ar
                  : typeLabels[partner.type].en}
              </span>

              {partner.featured && (
                <span style={styles.featuredBadge}>
                  {isArabic ? '⭐ شريك رئيسي' : '⭐ Key Partner'}
                </span>
              )}

              <div style={styles.partnerHeader}>
                <div
                  style={{
                    ...styles.partnerLogo,
                    background: `${partner.color}20`,
                  }}
                >
                  {renderLabIcon(partner.logo, { size: 32, style: { color: partner.color } })}
                </div>
                <div style={styles.partnerMeta}>
                  <h3 style={styles.partnerName}>
                    {isArabic ? partner.nameAr : partner.name}
                  </h3>
                  <p style={styles.partnerLocation}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      {renderLabIcon('\u{1F4CD}', { size: 14, tone: 'cyan' })}
                      {isArabic ? partner.locationAr : partner.location}
                    </span>
                  </p>
                </div>
              </div>

              <p style={styles.partnerDescription}>
                {isArabic ? partner.descriptionAr : partner.description}
              </p>

              <div style={styles.servicesList}>
                {(isArabic ? partner.servicesAr : partner.services).map((service, idx) => (
                  <span key={idx} style={styles.serviceTag}>
                    {service}
                  </span>
                ))}
              </div>

              <div style={styles.partnerFooter}>
                <span style={styles.partnerSince}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {renderLabIcon('\u{1F91D}', { size: 14, tone: 'cyan' })}
                    {isArabic ? `شريك منذ ${partner.partnerSince}` : `Partner since ${partner.partnerSince}`}
                  </span>
                </span>
                {partner.website && (
                  <button style={styles.viewButton}>
                    {isArabic ? 'زيارة' : 'Visit'} →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Box */}
        <div style={styles.ctaBox}>
          <h3 style={styles.ctaTitle}>
            {isArabic ? 'كن شريكاً' : 'Become a Partner'}
          </h3>
          <p style={styles.ctaText}>
            {isArabic
              ? 'هل أنت مدرسة أو عيادة أو منظمة مهتمة بالشراكة؟ نرحب بالتعاون لتوسيع نطاق خدماتنا.'
              : 'Are you a school, clinic, or organization interested in partnership? We welcome collaborations to expand our services.'}
          </p>
          <button style={styles.ctaButton}>
            {isArabic ? 'تواصل معنا' : 'Contact Us'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
