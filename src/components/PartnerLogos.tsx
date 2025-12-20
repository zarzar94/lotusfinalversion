import { useState, useEffect, useRef } from 'react';
import { brandCyan, brandPink, brandPurple, brandPurpleDark, styles } from './styles';

interface Partner {
  id: string;
  name: string;
  nameEn: string;
  type: 'school' | 'clinic' | 'university' | 'organization';
  icon: string;
  color: string;
  description: string;
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
  },
  {
    id: 'lotus-holistic',
    name: 'لوتس الشاملة',
    nameEn: 'Lotus Holistic Centre',
    type: 'clinic',
    icon: '🪷',
    color: brandPink,
    description: 'المركز الرئيسي للعلاج في أبوظبي',
  },
  {
    id: 'special-education',
    name: 'مراكز التربية الخاصة',
    nameEn: 'Special Education Centers',
    type: 'school',
    icon: '🏫',
    color: brandPurple,
    description: 'شراكة مع أكثر من 15 مركز تعليمي',
  },
  {
    id: 'autism-support',
    name: 'دعم التوحد',
    nameEn: 'Autism Support Network',
    type: 'organization',
    icon: '💙',
    color: '#3B82F6',
    description: 'دعم العائلات والمصابين بالتوحد',
  },
  {
    id: 'therapy-clinics',
    name: 'عيادات العلاج',
    nameEn: 'Therapy Clinics UAE',
    type: 'clinic',
    icon: '🏥',
    color: '#22c55e',
    description: 'شبكة من 8+ عيادات شريكة',
  },
  {
    id: 'research-institute',
    name: 'معهد الأبحاث',
    nameEn: 'Auditory Research Institute',
    type: 'university',
    icon: '🔬',
    color: brandPurpleDark,
    description: 'أبحاث علمية في المعالجة السمعية',
  },
];

const stats = [
  { value: '500+', label: 'حالة ناجحة', icon: '✓' },
  { value: '15+', label: 'مدرسة شريكة', icon: '🏫' },
  { value: '10+', label: 'سنوات خبرة', icon: '⭐' },
  { value: '8+', label: 'عيادات متعاونة', icon: '🏥' },
];

export default function PartnerLogos() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredPartner, setHoveredPartner] = useState<string | null>(null);
  const [animatedStats, setAnimatedStats] = useState<string[]>(['0', '0', '0', '0']);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate stats
          stats.forEach((stat, i) => {
            const targetNum = parseInt(stat.value);
            let current = 0;
            const increment = targetNum / 40;
            const interval = setInterval(() => {
              current += increment;
              if (current >= targetNum) {
                current = targetNum;
                clearInterval(interval);
              }
              setAnimatedStats(prev => {
                const newStats = [...prev];
                newStats[i] = Math.floor(current) + (stat.value.includes('+') ? '+' : '');
                return newStats;
              });
            }, 30);
          });
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
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
          position: 'absolute',
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: i % 2 === 0 ? brandCyan : brandPurple,
          opacity: 0.3,
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
            <span style={{ fontSize: 18 }}>🤝</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: brandCyan }}>
              شركاؤنا في النجاح
            </span>
          </div>
          <h3 style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 900,
            color: '#fff',
            marginBottom: 8,
          }}>
            شبكة من المؤسسات الموثوقة
          </h3>
          <p style={{
            margin: 0,
            fontSize: 14,
            color: 'rgba(255,255,255,0.6)',
          }}>
            Trusted Partners in Auditory Integration Training
          </p>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          marginBottom: 40,
          flexWrap: 'wrap',
        }}>
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              style={{
                padding: '16px 28px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.08)',
                textAlign: 'center',
                minWidth: 120,
                animation: isVisible ? `partnerEnter 0.5s ease-out ${index * 0.1}s backwards` : 'none',
              }}
            >
              <div style={{
                fontSize: 32,
                fontWeight: 900,
                color: brandCyan,
                fontFamily: 'monospace',
                marginBottom: 4,
              }}>
                {animatedStats[index]}
              </div>
              <div style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}>
                <span>{stat.icon}</span>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Partner Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}>
          {partners.map((partner, index) => (
            <div
              key={partner.id}
              onMouseEnter={() => setHoveredPartner(partner.id)}
              onMouseLeave={() => setHoveredPartner(null)}
              style={{
                padding: 20,
                background: hoveredPartner === partner.id
                  ? `linear-gradient(135deg, ${partner.color}15, ${partner.color}08)`
                  : 'rgba(255,255,255,0.02)',
                borderRadius: 18,
                border: `1px solid ${hoveredPartner === partner.id ? partner.color : 'rgba(255,255,255,0.06)'}`,
                cursor: 'default',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredPartner === partner.id ? 'translateY(-6px) scale(1.02)' : 'translateY(0)',
                boxShadow: hoveredPartner === partner.id ? `0 20px 40px ${partner.color}15` : 'none',
                animation: isVisible ? `partnerEnter 0.6s ease-out ${0.2 + index * 0.08}s backwards` : 'none',
                textAlign: 'center',
              }}
            >
              {/* Icon */}
              <div style={{
                width: 60,
                height: 60,
                margin: '0 auto 14px',
                borderRadius: 16,
                background: `linear-gradient(135deg, ${partner.color}25, ${partner.color}10)`,
                border: `2px solid ${partner.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                animation: hoveredPartner === partner.id ? 'float 2s ease-in-out infinite' : 'none',
                boxShadow: hoveredPartner === partner.id ? `0 0 30px ${partner.color}30` : 'none',
              }}>
                {partner.icon}
              </div>

              {/* Name */}
              <div style={{
                fontWeight: 800,
                fontSize: 14,
                color: hoveredPartner === partner.id ? partner.color : '#fff',
                marginBottom: 4,
                transition: 'color 0.3s ease',
              }}>
                {partner.name}
              </div>
              <div style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.5)',
                marginBottom: hoveredPartner === partner.id ? 10 : 0,
              }}>
                {partner.nameEn}
              </div>

              {/* Description on hover */}
              {hoveredPartner === partner.id && (
                <div style={{
                  marginTop: 10,
                  padding: '8px 10px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: 8,
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.7)',
                  animation: 'partnerEnter 0.3s ease-out',
                }}>
                  {partner.description}
                </div>
              )}

              {/* Type badge */}
              <div style={{
                marginTop: 10,
                display: 'inline-flex',
                padding: '4px 10px',
                background: `${partner.color}15`,
                borderRadius: 6,
                fontSize: 9,
                color: partner.color,
                textTransform: 'uppercase',
                fontWeight: 700,
                letterSpacing: 0.5,
              }}>
                {partner.type === 'school' && 'مدرسة'}
                {partner.type === 'clinic' && 'عيادة'}
                {partner.type === 'university' && 'جامعة'}
                {partner.type === 'organization' && 'مؤسسة'}
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
            color: '#fff',
            marginBottom: 8,
          }}>
            🌟 انضم لشبكة شركائنا
          </div>
          <p style={{
            margin: '0 0 16px',
            fontSize: 13,
            color: 'rgba(255,255,255,0.6)',
          }}>
            هل أنت مؤسسة تعليمية أو صحية مهتمة بالشراكة؟
          </p>
          <a href="/contact#contact" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
            borderRadius: 12,
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: `0 4px 20px ${brandCyan}33`,
            transition: 'all 0.3s ease',
          }}>
            تواصل معنا
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
