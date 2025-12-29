import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { brandCyan, brandPink, brandPurple, brandPurpleDark, colors } from './styles';
import { useLanguage } from '../context/LanguageContext';
import { renderLabIcon, SparklesIcon } from './icons/index';

interface Partner {
  id: string;
  name: string;
  nameEn: string;
  type: 'school' | 'clinic' | 'university' | 'organization';
  icon: string;
  color: string;
  description: string;
  descriptionEn: string;
}

const partners: Partner[] = [
  {
    id: 'berard-international',
    name: 'Berard AIT الدولية',
    nameEn: 'Berard AIT International',
    type: 'organization',
    icon: '🌐',
    color: brandCyan,
    description: 'الشريك الرسمي المعتمد لبرنامج Berard AIT',
    descriptionEn: 'Official accredited partner for the Berard AIT program',
  },
  {
    id: 'lotus-holistic',
    name: 'لوتس الشاملة',
    nameEn: 'Lotus Holistic Centre',
    type: 'clinic',
    icon: '🪷',
    color: brandPink,
    description: 'المركز الرئيسي للعلاج في أبوظبي',
    descriptionEn: 'Main therapy center in Abu Dhabi',
  },
  {
    id: 'special-education',
    name: 'مراكز التربية الخاصة',
    nameEn: 'Special Education Centers',
    type: 'school',
    icon: '🏫',
    color: brandPurple,
    description: 'شراكة مع أكثر من 15 مركز تعليمي',
    descriptionEn: 'Partnering with 15+ educational centers',
  },
  {
    id: 'autism-support',
    name: 'دعم التوحد',
    nameEn: 'Autism Support Network',
    type: 'organization',
    icon: '💙',
    color: 'colors.info',
    description: 'دعم العائلات والمصابين بالتوحد',
    descriptionEn: 'Support for families and individuals with autism',
  },
  {
    id: 'therapy-clinics',
    name: 'عيادات العلاج',
    nameEn: 'Therapy Clinics UAE',
    type: 'clinic',
    icon: '🏥',
    color: 'colors.success',
    description: 'شبكة من 8+ عيادات شريكة',
    descriptionEn: 'Network of 8+ partner clinics',
  },
  {
    id: 'research-institute',
    name: 'معهد الأبحاث',
    nameEn: 'Auditory Research Institute',
    type: 'university',
    icon: '🔬',
    color: brandPurpleDark,
    description: 'أبحاث علمية في المعالجة السمعية',
    descriptionEn: 'Scientific research in auditory processing',
  },
];

const stats = [
  { value: '500+', labelAr: 'حالة ناجحة', labelEn: 'Successful cases', icon: '✓' },
  { value: '15+', labelAr: 'مدرسة شريكة', labelEn: 'Partner schools', icon: '🏫' },
  { value: '10+', labelAr: 'سنوات خبرة', labelEn: 'Years of experience', icon: '⭐' },
  { value: '8+', labelAr: 'عيادات متعاونة', labelEn: 'Partner clinics', icon: '🏥' },
];

const particleBaseStyle: CSSProperties = {
  position: 'absolute',
  width: 4,
  height: 4,
  borderRadius: '50%',
  opacity: 0.3,
};

const statsRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 24,
  marginBottom: 40,
  flexWrap: 'wrap',
};

const statCardBaseStyle: CSSProperties = {
  padding: '16px 28px',
  background: 'rgba(255,255,255,0.03)',
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.08)',
  textAlign: 'center',
  minWidth: 120,
};

const statValueStyle: CSSProperties = {
  fontSize: 32,
  fontWeight: 900,
  color: brandCyan,
  fontFamily: 'monospace',
  marginBottom: 4,
};

const statLabelStyle: CSSProperties = {
  fontSize: 12,
  color: 'rgba(255,255,255,0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
};

const partnerGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 16,
  marginBottom: 32,
};

const partnerCardBaseStyle: CSSProperties = {
  padding: 20,
  borderRadius: 18,
  cursor: 'default',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  textAlign: 'center',
};

const partnerIconBaseStyle: CSSProperties = {
  width: 60,
  height: 60,
  margin: '0 auto 14px',
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 28,
};

const partnerNameBaseStyle: CSSProperties = {
  fontWeight: 800,
  fontSize: 14,
  marginBottom: 4,
  transition: 'color 0.3s ease',
};

const partnerNameEnBaseStyle: CSSProperties = {
  fontSize: 10,
  color: 'rgba(255,255,255,0.5)',
};

const partnerDescriptionBaseStyle: CSSProperties = {
  marginTop: 10,
  padding: '8px 10px',
  background: 'rgba(0,0,0,0.3)',
  borderRadius: 8,
  fontSize: 11,
  color: 'rgba(255,255,255,0.7)',
  animation: 'partnerEnter 0.3s ease-out',
};

const partnerBadgeBaseStyle: CSSProperties = {
  marginTop: 10,
  display: 'inline-flex',
  padding: '4px 10px',
  borderRadius: 6,
  fontSize: 9,
  textTransform: 'uppercase' as const,
  fontWeight: 700,
  letterSpacing: 0.5,
};


export default function PartnerLogos() {
  const { isArabic } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredPartner, setHoveredPartner] = useState<string | null>(null);
  const [animatedStats, setAnimatedStats] = useState<string[]>(['0', '0', '0', '0']);
  const sectionRef = useRef<HTMLDivElement>(null);
  const intervalsRef = useRef<number[]>([]);
  const hasAnimatedRef = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;
        setIsVisible(true);
        // Animate stats
        stats.forEach((stat, i) => {
          const targetNum = parseInt(stat.value);
          let current = 0;
          const increment = targetNum / 40;
          const intervalId = window.setInterval(() => {
            current += increment;
            if (current >= targetNum) {
              current = targetNum;
              window.clearInterval(intervalId);
              intervalsRef.current = intervalsRef.current.filter(id => id !== intervalId);
            }
            setAnimatedStats(prev => {
              const newStats = [...prev];
              newStats[i] = Math.floor(current) + (stat.value.includes('+') ? '+' : '');
              return newStats;
            });
          }, 30);
          intervalsRef.current.push(intervalId);
        });
        observer.unobserve(entry.target);
      },
      { threshold: 0.2 }
    );

    const current = sectionRef.current;
    if (current) observer.observe(current);
    return () => {
      observer.disconnect();
      intervalsRef.current.forEach((intervalId) => window.clearInterval(intervalId));
      intervalsRef.current = [];
    };
  }, []);

  return (
    <div ref={sectionRef} style={{
      padding: '40px 20px',
      background: 'linear-gradient(180deg, rgba(11,15,28,0.95), rgba(15,22,41,0.98))',
      borderTop: '1px solid rgba(143,211,204,0.1)',
      borderBottom: '1px solid rgba(143,211,204,0.1)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes partnerEnter {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Decorative Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        background: `radial-gradient(circle at 20% 50%, ${brandCyan}, transparent 50%),
                     radial-gradient(circle at 80% 50%, ${brandPurple}, transparent 50%)`,
      }} />

      {/* Floating particles */}
      {isVisible && [...Array(8)].map((_, i) => (
        <div key={i} style={{
          ...particleBaseStyle,
          background: i % 2 === 0 ? brandCyan : brandPurple,
          top: `${20 + (i * 10)}%`,
          left: `${10 + (i * 12)}%`,
          animation: `float ${3 + i * 0.5}s ease-in-out infinite ${i * 0.2}s`,
        }} />
      ))}

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 20px',
            background: 'rgba(143,211,204,0.1)',
            border: '1px solid rgba(143,211,204,0.25)',
            borderRadius: 30,
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 18 }}>
              <SparklesIcon size={18} tone="cyan" />
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: brandCyan }}>
              {isArabic ? 'شركاؤنا في النجاح' : 'Partners in Success'}
            </span>
          </div>
          <h3 style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 900,
            color: colors.text.primary,
            marginBottom: 8,
          }}>
            {isArabic ? 'شبكة من المؤسسات الموثوقة' : 'A Network of Trusted Institutions'}
          </h3>
          <p style={{
            margin: 0,
            fontSize: 14,
            color: 'rgba(255,255,255,0.6)',
          }}>
            {isArabic ? 'شركاء موثوقون في تدريب التكامل السمعي' : 'Trusted Partners in Auditory Integration Training'}
          </p>
        </div>

        {/* Stats Row */}
        <div style={statsRowStyle}>
          {stats.map((stat, index) => (
            <div
              key={stat.value}
              style={{
                ...statCardBaseStyle,
                animation: isVisible ? `partnerEnter 0.5s ease-out ${index * 0.1}s backwards` : 'none',
              }}
            >
              <div style={statValueStyle}>
                {animatedStats[index]}
              </div>
              <div style={statLabelStyle}>
                <span>{renderLabIcon(stat.icon, { size: 14, style: { color: brandCyan } })}</span>
                {isArabic ? stat.labelAr : stat.labelEn}
              </div>
            </div>
          ))}
        </div>

        {/* Partner Grid */}
        <div style={partnerGridStyle}>
          {partners.map((partner, index) => (
            <div
              key={partner.id}
              onMouseEnter={() => setHoveredPartner(partner.id)}
              onMouseLeave={() => setHoveredPartner(null)}
              style={{
                ...partnerCardBaseStyle,
                background: hoveredPartner === partner.id
                  ? `linear-gradient(135deg, ${partner.color}15, ${partner.color}08)`
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${hoveredPartner === partner.id ? partner.color : 'rgba(255,255,255,0.06)'}`,
                transform: hoveredPartner === partner.id ? 'translateY(-6px) scale(1.02)' : 'translateY(0)',
                boxShadow: hoveredPartner === partner.id ? `0 20px 40px ${partner.color}15` : 'none',
                animation: isVisible ? `partnerEnter 0.6s ease-out ${0.2 + index * 0.08}s backwards` : 'none',
              }}
            >
              {/* Icon */}
              <div style={{
                ...partnerIconBaseStyle,
                background: `linear-gradient(135deg, ${partner.color}25, ${partner.color}10)`,
                border: `2px solid ${partner.color}40`,
                animation: hoveredPartner === partner.id ? 'float 2s ease-in-out infinite' : 'none',
                boxShadow: hoveredPartner === partner.id ? `0 0 30px ${partner.color}30` : 'none',
              }}>
                {renderLabIcon(partner.icon, { size: 26, style: { color: partner.color } })}
              </div>

              {/* Name */}
              <div style={{
                ...partnerNameBaseStyle,
                color: hoveredPartner === partner.id ? partner.color : colors.text.primary,
              }}>
                {isArabic ? partner.name : partner.nameEn}
              </div>
              {isArabic && (
                <div style={{
                  ...partnerNameEnBaseStyle,
                  marginBottom: hoveredPartner === partner.id ? 10 : 0,
                }}>
                  {partner.nameEn}
                </div>
              )}

              {/* Description on hover */}
              {hoveredPartner === partner.id && (
                <div style={partnerDescriptionBaseStyle}>
                  {isArabic ? partner.description : partner.descriptionEn}
                </div>
              )}

              {/* Type badge */}
              <div style={{
                ...partnerBadgeBaseStyle,
                background: `${partner.color}15`,
                color: partner.color,
              }}>
                {partner.type === 'school' && (isArabic ? 'مدرسة' : 'School')}
                {partner.type === 'clinic' && (isArabic ? 'عيادة' : 'Clinic')}
                {partner.type === 'university' && (isArabic ? 'جامعة' : 'University')}
                {partner.type === 'organization' && (isArabic ? 'مؤسسة' : 'Organization')}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          textAlign: 'center',
          padding: '24px 20px',
          background: 'linear-gradient(135deg, rgba(143,211,204,0.08), rgba(176,18,112,0.08))',
          borderRadius: 18,
          border: '1px solid rgba(143,211,204,0.15)',
        }}>
          <div style={{
            fontSize: 15,
            fontWeight: 800,
            color: colors.text.primary,
            marginBottom: 8,
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {renderLabIcon('\u{2B50}', { size: 16, tone: 'warning' })}
              {isArabic ? 'انضم لشبكة شركائنا' : 'Join Our Partner Network'}
            </span>
          </div>
          <p style={{
            margin: '0 0 16px',
            fontSize: 13,
            color: 'rgba(255,255,255,0.6)',
          }}>
            {isArabic ? 'هل أنت مؤسسة تعليمية أو صحية مهتمة بالشراكة؟' : 'Are you an educational or healthcare organization interested in partnering with us?'}
          </p>
          <a href="/contact#contact" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
            borderRadius: 12,
            color: colors.text.primary,
            fontSize: 14,
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: `0 4px 20px ${brandCyan}33`,
            transition: 'all 0.3s ease',
          }}>
            {isArabic ? 'تواصل معنا' : 'Contact Us'}
            <span style={{ fontSize: 16 }}>←</span>
          </a>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${brandCyan}, ${brandPurple}, ${brandPink}, transparent)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s linear infinite',
      }} />
    </div>
  );
}
