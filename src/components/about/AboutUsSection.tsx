import React, { useState, useMemo, useCallback } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface TeamMember {
  id: string;
  name: { en: string; ar: string };
  title: { en: string; ar: string };
  bio: { en: string; ar: string };
  credentials: string[];
  specializations: string[];
  imageUrl?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

interface Milestone {
  year: number;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
}

interface CoreValue {
  id: string;
  icon: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  color: string;
}

interface Stat {
  value: string;
  label: { en: string; ar: string };
  icon: string;
}

interface AboutUsSectionProps {
  onContactClick?: () => void;
  onBookingClick?: () => void;
}

// =============================================================================
// DESIGN TOKENS
// =============================================================================

const brand = {
  cyan: '#00D4FF',
  cyanDark: '#00A8CC',
  purple: '#8B5CF6',
  purpleDark: '#7C3AED',
  coral: '#FF6B6B',
  gold: '#FFD700',
  success: '#10B981',
  warning: '#F59E0B',
  dark: '#0A0A0F',
  card: 'rgba(255,255,255,0.03)',
  cardHover: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.08)',
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.7)',
    muted: 'rgba(255,255,255,0.5)',
  },
};

const styles = {
  container: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${brand.dark} 0%, #1a1a2e 50%, #16213e 100%)`,
    fontFamily: 'Cairo, sans-serif',
    overflow: 'hidden',
  } as React.CSSProperties,
  heroSection: {
    position: 'relative' as const,
    padding: '6rem 2rem',
    textAlign: 'center' as const,
    overflow: 'hidden',
  } as React.CSSProperties,
  heroBackground: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(ellipse at 30% 20%, ${brand.cyan}15 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, ${brand.purple}15 0%, transparent 50%)
    `,
    zIndex: 0,
  } as React.CSSProperties,
  heroContent: {
    position: 'relative' as const,
    zIndex: 1,
    maxWidth: '900px',
    margin: '0 auto',
  } as React.CSSProperties,
  logo: {
    width: '120px',
    height: '120px',
    borderRadius: '30px',
    background: `linear-gradient(135deg, ${brand.cyan} 0%, ${brand.purple} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    margin: '0 auto 2rem',
    boxShadow: `0 20px 60px ${brand.cyan}30`,
  } as React.CSSProperties,
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 800,
    color: brand.text.primary,
    marginBottom: '1.5rem',
    lineHeight: 1.2,
    background: `linear-gradient(135deg, ${brand.text.primary} 0%, ${brand.cyan} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  } as React.CSSProperties,
  heroSubtitle: {
    fontSize: '1.25rem',
    color: brand.text.secondary,
    maxWidth: '700px',
    margin: '0 auto 2rem',
    lineHeight: 1.8,
  } as React.CSSProperties,
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1.5rem',
    maxWidth: '800px',
    margin: '3rem auto 0',
  } as React.CSSProperties,
  statCard: {
    padding: '1.5rem',
    textAlign: 'center' as const,
    background: brand.card,
    border: `1px solid ${brand.border}`,
    borderRadius: '20px',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  statIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  statValue: {
    fontSize: '2rem',
    fontWeight: 700,
    color: brand.cyan,
    marginBottom: '0.25rem',
  } as React.CSSProperties,
  statLabel: {
    fontSize: '0.85rem',
    color: brand.text.muted,
  } as React.CSSProperties,
  section: {
    padding: '5rem 2rem',
  } as React.CSSProperties,
  sectionHeader: {
    textAlign: 'center' as const,
    marginBottom: '4rem',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: brand.text.primary,
    marginBottom: '1rem',
  } as React.CSSProperties,
  sectionSubtitle: {
    fontSize: '1.1rem',
    color: brand.text.secondary,
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.7,
  } as React.CSSProperties,
  missionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  } as React.CSSProperties,
  missionCard: (gradient: string) => ({
    background: brand.card,
    border: `1px solid ${brand.border}`,
    borderRadius: '24px',
    padding: '2rem',
    position: 'relative' as const,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  } as React.CSSProperties),
  missionCardGlow: (color: string) => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: color,
  } as React.CSSProperties),
  missionIcon: (color: string) => ({
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    background: `${color}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.75rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties),
  missionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: brand.text.primary,
    marginBottom: '1rem',
  } as React.CSSProperties,
  missionDescription: {
    fontSize: '0.95rem',
    color: brand.text.secondary,
    lineHeight: 1.7,
  } as React.CSSProperties,
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1200px',
    margin: '0 auto',
  } as React.CSSProperties,
  valueCard: (color: string, isHovered: boolean) => ({
    background: isHovered ? brand.cardHover : brand.card,
    border: `1px solid ${isHovered ? color : brand.border}`,
    borderRadius: '20px',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'translateY(-4px)' : 'none',
  } as React.CSSProperties),
  valueIcon: (color: string) => ({
    width: '50px',
    height: '50px',
    borderRadius: '14px',
    background: `${color}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    marginBottom: '1rem',
  } as React.CSSProperties),
  valueTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: brand.text.primary,
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  valueDescription: {
    fontSize: '0.9rem',
    color: brand.text.muted,
    lineHeight: 1.6,
  } as React.CSSProperties,
  teamSection: {
    background: 'rgba(255,255,255,0.02)',
    padding: '5rem 2rem',
  } as React.CSSProperties,
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  } as React.CSSProperties,
  teamCard: {
    background: brand.card,
    border: `1px solid ${brand.border}`,
    borderRadius: '24px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  teamImagePlaceholder: {
    height: '200px',
    background: `linear-gradient(135deg, ${brand.cyan}30 0%, ${brand.purple}30 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4rem',
  } as React.CSSProperties,
  teamContent: {
    padding: '1.5rem',
  } as React.CSSProperties,
  teamName: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: brand.text.primary,
    marginBottom: '0.25rem',
  } as React.CSSProperties,
  teamTitle: {
    fontSize: '0.9rem',
    color: brand.cyan,
    marginBottom: '1rem',
  } as React.CSSProperties,
  teamBio: {
    fontSize: '0.9rem',
    color: brand.text.secondary,
    lineHeight: 1.6,
    marginBottom: '1rem',
  } as React.CSSProperties,
  credentialsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    marginBottom: '1rem',
  } as React.CSSProperties,
  credential: {
    padding: '0.25rem 0.75rem',
    background: `${brand.purple}20`,
    border: `1px solid ${brand.purple}40`,
    borderRadius: '20px',
    fontSize: '0.75rem',
    color: brand.purple,
  } as React.CSSProperties,
  socialLinks: {
    display: 'flex',
    gap: '0.75rem',
  } as React.CSSProperties,
  socialLink: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: brand.border,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    color: brand.text.secondary,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  timelineSection: {
    padding: '5rem 2rem',
  } as React.CSSProperties,
  timeline: {
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative' as const,
  } as React.CSSProperties,
  timelineLine: {
    position: 'absolute' as const,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '2px',
    height: '100%',
    background: `linear-gradient(180deg, ${brand.cyan} 0%, ${brand.purple} 100%)`,
  } as React.CSSProperties,
  timelineItem: (isLeft: boolean) => ({
    display: 'flex',
    justifyContent: isLeft ? 'flex-end' : 'flex-start',
    paddingLeft: isLeft ? '0' : '52%',
    paddingRight: isLeft ? '52%' : '0',
    marginBottom: '3rem',
    position: 'relative' as const,
  } as React.CSSProperties),
  timelineDot: {
    position: 'absolute' as const,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: brand.cyan,
    border: `4px solid ${brand.dark}`,
    zIndex: 1,
  } as React.CSSProperties,
  timelineCard: {
    background: brand.card,
    border: `1px solid ${brand.border}`,
    borderRadius: '16px',
    padding: '1.5rem',
    maxWidth: '350px',
  } as React.CSSProperties,
  timelineYear: {
    fontSize: '0.85rem',
    color: brand.cyan,
    fontWeight: 600,
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  timelineTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: brand.text.primary,
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  } as React.CSSProperties,
  timelineDescription: {
    fontSize: '0.9rem',
    color: brand.text.secondary,
    lineHeight: 1.6,
  } as React.CSSProperties,
  ctaSection: {
    padding: '5rem 2rem',
    textAlign: 'center' as const,
    background: `linear-gradient(135deg, ${brand.cyan}10 0%, ${brand.purple}10 100%)`,
  } as React.CSSProperties,
  ctaCard: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '3rem',
    background: brand.card,
    border: `1px solid ${brand.border}`,
    borderRadius: '30px',
    position: 'relative' as const,
    overflow: 'hidden',
  } as React.CSSProperties,
  ctaGlow: {
    position: 'absolute' as const,
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `radial-gradient(circle, ${brand.cyan}10 0%, transparent 50%)`,
    zIndex: 0,
  } as React.CSSProperties,
  ctaContent: {
    position: 'relative' as const,
    zIndex: 1,
  } as React.CSSProperties,
  ctaTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: brand.text.primary,
    marginBottom: '1rem',
  } as React.CSSProperties,
  ctaText: {
    fontSize: '1.1rem',
    color: brand.text.secondary,
    marginBottom: '2rem',
    lineHeight: 1.7,
  } as React.CSSProperties,
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  ctaButton: (isPrimary: boolean) => ({
    padding: '1rem 2rem',
    borderRadius: '14px',
    border: isPrimary ? 'none' : `1px solid ${brand.border}`,
    background: isPrimary
      ? `linear-gradient(135deg, ${brand.cyan} 0%, ${brand.purple} 100%)`
      : 'transparent',
    color: brand.text.primary,
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  } as React.CSSProperties),
};

// =============================================================================
// MOCK DATA
// =============================================================================

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: { en: 'Dr. Sarah Al-Rahman', ar: 'د. سارة الرحمن' },
    title: { en: 'Founder & Lead Practitioner', ar: 'المؤسسة والممارسة الرئيسية' },
    bio: {
      en: 'Board-certified audiologist with over 15 years of experience in auditory processing disorders. Pioneer in bringing Bérard AIT to the Middle East.',
      ar: 'أخصائية سمعيات معتمدة مع أكثر من 15 عاماً من الخبرة في اضطرابات المعالجة السمعية. رائدة في إدخال تدريب التكامل السمعي بيرارد إلى الشرق الأوسط.',
    },
    credentials: ['PhD Audiology', 'Bérard AIT Certified', 'ASHA Member'],
    specializations: ['Auditory Processing', 'Pediatric Audiology', 'AIT'],
    social: { linkedin: '#', email: 'dr.sarah@lotusait.com' },
  },
  {
    id: '2',
    name: { en: 'Ahmed Hassan', ar: 'أحمد حسن' },
    title: { en: 'Clinical Director', ar: 'المدير السريري' },
    bio: {
      en: 'Specialized in neurodevelopmental disorders with expertise in integrative approaches. Passionate about helping children unlock their full potential.',
      ar: 'متخصص في الاضطرابات العصبية التنموية مع خبرة في المناهج التكاملية. شغوف بمساعدة الأطفال على تحقيق كامل إمكاناتهم.',
    },
    credentials: ['MSc Neuroscience', 'Bérard AIT Certified', 'Child Development Specialist'],
    specializations: ['Neurodevelopment', 'Child Psychology', 'Family Therapy'],
    social: { linkedin: '#', email: 'ahmed@lotusait.com' },
  },
  {
    id: '3',
    name: { en: 'Fatima Al-Sayed', ar: 'فاطمة السيد' },
    title: { en: 'Senior AIT Practitioner', ar: 'ممارسة AIT أولى' },
    bio: {
      en: 'Dedicated practitioner with a gentle approach perfect for working with children. Expert in tailoring treatment protocols for individual needs.',
      ar: 'ممارسة متفانية ذات نهج لطيف مثالي للعمل مع الأطفال. خبيرة في تخصيص بروتوكولات العلاج للاحتياجات الفردية.',
    },
    credentials: ['BSc Speech Therapy', 'Bérard AIT Certified', 'Sensory Integration Certified'],
    specializations: ['Pediatric AIT', 'Sensory Processing', 'Parent Education'],
    social: { email: 'fatima@lotusait.com' },
  },
];

const milestones: Milestone[] = [
  {
    year: 2018,
    title: { en: 'Foundation', ar: 'التأسيس' },
    description: {
      en: 'Lotus Sound Lab was founded with a vision to bring Bérard AIT to the region.',
      ar: 'تأسس لوتس ساوند لاب برؤية لجلب تدريب التكامل السمعي بيرارد إلى المنطقة.',
    },
    icon: '🌱',
  },
  {
    year: 2019,
    title: { en: 'First Clinic', ar: 'العيادة الأولى' },
    description: {
      en: 'Opened our first state-of-the-art clinic in Riyadh with specialized sound therapy rooms.',
      ar: 'افتتحنا عيادتنا الأولى المتطورة في الرياض مع غرف علاج صوتي متخصصة.',
    },
    icon: '🏥',
  },
  {
    year: 2020,
    title: { en: '500 Patients', ar: '500 مريض' },
    description: {
      en: 'Celebrated helping our 500th patient on their journey to better auditory processing.',
      ar: 'احتفلنا بمساعدة مريضنا الـ500 في رحلتهم نحو معالجة سمعية أفضل.',
    },
    icon: '🎉',
  },
  {
    year: 2022,
    title: { en: 'School Partnerships', ar: 'شراكات المدارس' },
    description: {
      en: 'Launched partnerships with leading schools to provide on-site assessments and referrals.',
      ar: 'أطلقنا شراكات مع مدارس رائدة لتوفير التقييمات والإحالات في الموقع.',
    },
    icon: '🏫',
  },
  {
    year: 2024,
    title: { en: 'Digital Platform', ar: 'المنصة الرقمية' },
    description: {
      en: 'Launched our digital platform for virtual assessments and progress tracking.',
      ar: 'أطلقنا منصتنا الرقمية للتقييمات الافتراضية ومتابعة التقدم.',
    },
    icon: '💻',
  },
];

const coreValues: CoreValue[] = [
  {
    id: 'child-first',
    icon: '👶',
    title: { en: 'Child-First Approach', ar: 'نهج الطفل أولاً' },
    description: {
      en: 'Every decision we make prioritizes the comfort, safety, and wellbeing of the children we serve.',
      ar: 'كل قرار نتخذه يعطي الأولوية لراحة وسلامة ورفاهية الأطفال الذين نخدمهم.',
    },
    color: brand.coral,
  },
  {
    id: 'evidence-based',
    icon: '🔬',
    title: { en: 'Evidence-Based', ar: 'مبني على الأدلة' },
    description: {
      en: 'Our treatments are grounded in decades of research and continuously validated outcomes.',
      ar: 'علاجاتنا مبنية على عقود من البحث ونتائج مُتحقق منها باستمرار.',
    },
    color: brand.cyan,
  },
  {
    id: 'family-partnership',
    icon: '👨‍👩‍👧',
    title: { en: 'Family Partnership', ar: 'شراكة العائلة' },
    description: {
      en: 'We work closely with families, providing education and support throughout the journey.',
      ar: 'نعمل عن كثب مع العائلات، نقدم التعليم والدعم طوال الرحلة.',
    },
    color: brand.purple,
  },
  {
    id: 'innovation',
    icon: '💡',
    title: { en: 'Innovation', ar: 'الابتكار' },
    description: {
      en: 'We continuously improve our methods and embrace technology to enhance outcomes.',
      ar: 'نحسن أساليبنا باستمرار ونتبنى التكنولوجيا لتعزيز النتائج.',
    },
    color: brand.success,
  },
  {
    id: 'compassion',
    icon: '💜',
    title: { en: 'Compassion', ar: 'الرحمة' },
    description: {
      en: 'We treat every child and family with empathy, understanding, and genuine care.',
      ar: 'نعامل كل طفل وعائلة بالتعاطف والتفهم والرعاية الحقيقية.',
    },
    color: brand.warning,
  },
  {
    id: 'excellence',
    icon: '⭐',
    title: { en: 'Excellence', ar: 'التميز' },
    description: {
      en: 'We strive for the highest standards in everything we do, from assessment to follow-up.',
      ar: 'نسعى لأعلى المعايير في كل ما نفعله، من التقييم إلى المتابعة.',
    },
    color: brand.gold,
  },
];

const stats: Stat[] = [
  { value: '2,500+', label: { en: 'Patients Helped', ar: 'مريض تمت مساعدتهم' }, icon: '👥' },
  { value: '10,000+', label: { en: 'Sessions Completed', ar: 'جلسة مكتملة' }, icon: '🎧' },
  { value: '94%', label: { en: 'Satisfaction Rate', ar: 'معدل الرضا' }, icon: '⭐' },
  { value: '6+', label: { en: 'Years Experience', ar: 'سنوات خبرة' }, icon: '📅' },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  onContactClick,
  onBookingClick,
}) => {
  const { isArabic } = useLanguage();
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // TRANSLATIONS
  // ---------------------------------------------------------------------------

  const t = useMemo(() => ({
    hero: {
      title: isArabic ? 'لوتس ساوند لاب' : 'Lotus Sound Lab',
      subtitle: isArabic
        ? 'رواد تدريب التكامل السمعي بيرارد في الشرق الأوسط. نحن ملتزمون بمساعدة الأطفال على تحقيق كامل إمكاناتهم من خلال أحدث تقنيات العلاج الصوتي.'
        : 'Pioneers of Bérard Auditory Integration Training in the Middle East. We are committed to helping children reach their full potential through cutting-edge sound therapy techniques.',
    },
    mission: {
      title: isArabic ? 'مهمتنا ورؤيتنا' : 'Our Mission & Vision',
      subtitle: isArabic
        ? 'نؤمن بأن كل طفل يستحق فرصة النجاح'
        : 'We believe every child deserves the opportunity to thrive',
      cards: [
        {
          title: isArabic ? 'مهمتنا' : 'Our Mission',
          description: isArabic
            ? 'توفير تدريب التكامل السمعي بيرارد بأعلى جودة لمساعدة الأطفال والبالغين على التغلب على تحديات المعالجة السمعية وتحقيق إمكاناتهم الكاملة في التعلم والتواصل.'
            : 'To provide the highest quality Bérard Auditory Integration Training to help children and adults overcome auditory processing challenges and achieve their full potential in learning and communication.',
          icon: '🎯',
          color: brand.cyan,
        },
        {
          title: isArabic ? 'رؤيتنا' : 'Our Vision',
          description: isArabic
            ? 'أن نكون المركز الرائد في الشرق الأوسط للعلاج السمعي، حيث يتمكن كل طفل يعاني من تحديات المعالجة السمعية من الحصول على رعاية عالمية المستوى قريبة من المنزل.'
            : 'To be the leading auditory therapy center in the Middle East, where every child with auditory processing challenges can access world-class care close to home.',
          icon: '🌟',
          color: brand.purple,
        },
        {
          title: isArabic ? 'نهجنا' : 'Our Approach',
          description: isArabic
            ? 'نجمع بين منهج بيرارد المجرب والتكنولوجيا الحديثة والرعاية الشخصية لإنشاء خطط علاج مخصصة تلبي الاحتياجات الفريدة لكل مريض.'
            : 'We combine the proven Bérard method with modern technology and personalized care to create tailored treatment plans that address each patient\'s unique needs.',
          icon: '💎',
          color: brand.success,
        },
      ],
    },
    values: {
      title: isArabic ? 'قيمنا الأساسية' : 'Our Core Values',
      subtitle: isArabic
        ? 'المبادئ التي توجه كل ما نفعله'
        : 'The principles that guide everything we do',
    },
    team: {
      title: isArabic ? 'فريقنا' : 'Our Team',
      subtitle: isArabic
        ? 'تعرف على الخبراء المتفانين وراء نجاحنا'
        : 'Meet the dedicated experts behind our success',
    },
    timeline: {
      title: isArabic ? 'رحلتنا' : 'Our Journey',
      subtitle: isArabic
        ? 'المعالم التي شكلت من نحن'
        : 'The milestones that shaped who we are',
    },
    cta: {
      title: isArabic ? 'ابدأ رحلتك اليوم' : 'Start Your Journey Today',
      text: isArabic
        ? 'هل أنت مستعد لاتخاذ الخطوة الأولى نحو تحسين المعالجة السمعية؟ فريقنا هنا لإرشادك في كل خطوة على الطريق.'
        : 'Ready to take the first step towards improved auditory processing? Our team is here to guide you every step of the way.',
      booking: isArabic ? 'احجز استشارة' : 'Book a Consultation',
      contact: isArabic ? 'تواصل معنا' : 'Contact Us',
    },
  }), [isArabic]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleValueHover = useCallback((id: string | null) => {
    setHoveredValue(id);
  }, []);

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div style={styles.container} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroBackground} />
        <div style={styles.heroContent}>
          <div style={styles.logo}>🎧</div>
          <h1 style={styles.heroTitle}>{t.hero.title}</h1>
          <p style={styles.heroSubtitle}>{t.hero.subtitle}</p>

          {/* Stats Grid */}
          <div style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} style={styles.statCard}>
                <div style={styles.statIcon}>{stat.icon}</div>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statLabel}>
                  {isArabic ? stat.label.ar : stat.label.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{t.mission.title}</h2>
          <p style={styles.sectionSubtitle}>{t.mission.subtitle}</p>
        </div>
        <div style={styles.missionGrid}>
          {t.mission.cards.map((card, index) => (
            <div key={index} style={styles.missionCard(`${card.color}`)}>
              <div style={styles.missionCardGlow(card.color)} />
              <div style={styles.missionIcon(card.color)}>{card.icon}</div>
              <h3 style={styles.missionTitle}>{card.title}</h3>
              <p style={styles.missionDescription}>{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values Section */}
      <section style={{ ...styles.section, background: 'rgba(255,255,255,0.02)' }}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{t.values.title}</h2>
          <p style={styles.sectionSubtitle}>{t.values.subtitle}</p>
        </div>
        <div style={styles.valuesGrid}>
          {coreValues.map((value) => (
            <div
              key={value.id}
              style={styles.valueCard(value.color, hoveredValue === value.id)}
              onMouseEnter={() => handleValueHover(value.id)}
              onMouseLeave={() => handleValueHover(null)}
            >
              <div style={styles.valueIcon(value.color)}>{value.icon}</div>
              <h4 style={styles.valueTitle}>
                {isArabic ? value.title.ar : value.title.en}
              </h4>
              <p style={styles.valueDescription}>
                {isArabic ? value.description.ar : value.description.en}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section style={styles.teamSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{t.team.title}</h2>
          <p style={styles.sectionSubtitle}>{t.team.subtitle}</p>
        </div>
        <div style={styles.teamGrid}>
          {teamMembers.map((member) => (
            <div key={member.id} style={styles.teamCard}>
              <div style={styles.teamImagePlaceholder}>
                👤
              </div>
              <div style={styles.teamContent}>
                <h3 style={styles.teamName}>
                  {isArabic ? member.name.ar : member.name.en}
                </h3>
                <p style={styles.teamTitle}>
                  {isArabic ? member.title.ar : member.title.en}
                </p>
                <p style={styles.teamBio}>
                  {isArabic ? member.bio.ar : member.bio.en}
                </p>
                <div style={styles.credentialsContainer}>
                  {member.credentials.map((cred, i) => (
                    <span key={i} style={styles.credential}>{cred}</span>
                  ))}
                </div>
                <div style={styles.socialLinks}>
                  {member.social?.linkedin && (
                    <div style={styles.socialLink}>in</div>
                  )}
                  {member.social?.email && (
                    <div style={styles.socialLink}>✉️</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section style={styles.timelineSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{t.timeline.title}</h2>
          <p style={styles.sectionSubtitle}>{t.timeline.subtitle}</p>
        </div>
        <div style={styles.timeline}>
          <div style={styles.timelineLine} />
          {milestones.map((milestone, index) => (
            <div
              key={index}
              style={styles.timelineItem(index % 2 === 0)}
            >
              <div style={styles.timelineDot} />
              <div style={styles.timelineCard}>
                <div style={styles.timelineYear}>{milestone.year}</div>
                <div style={styles.timelineTitle}>
                  <span>{milestone.icon}</span>
                  {isArabic ? milestone.title.ar : milestone.title.en}
                </div>
                <p style={styles.timelineDescription}>
                  {isArabic ? milestone.description.ar : milestone.description.en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaCard}>
          <div style={styles.ctaGlow} />
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>{t.cta.title}</h2>
            <p style={styles.ctaText}>{t.cta.text}</p>
            <div style={styles.ctaButtons}>
              <button
                onClick={onBookingClick}
                style={styles.ctaButton(true)}
              >
                📅 {t.cta.booking}
              </button>
              <button
                onClick={onContactClick}
                style={styles.ctaButton(false)}
              >
                💬 {t.cta.contact}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsSection;
