import { useState, useEffect, useRef } from 'react';
import { brandCyan, brandPink, brandPurple, brandPurpleDark, styles } from './styles';

const credentials = [
  {
    id: 'berard',
    title: 'Berard AIT Certified',
    titleAr: 'معتمد من Berard AIT',
    icon: '🎓',
    color: brandCyan,
    description: 'برنامج معتمد رسمياً من مؤسسة Berard AIT الدولية',
  },
  {
    id: 'licensed',
    title: 'Licensed Practitioner',
    titleAr: 'ممارس مرخص',
    icon: '✅',
    color: '#22c55e',
    description: 'حاصل على ترخيص ممارسة العلاج السمعي التكاملي',
  },
  {
    id: 'experience',
    title: '10+ Years Experience',
    titleAr: '+10 سنوات خبرة',
    icon: '⭐',
    color: brandPurple,
    description: 'خبرة تتجاوز عشر سنوات في العلاج السمعي',
  },
  {
    id: 'cases',
    title: '500+ Success Cases',
    titleAr: '+500 حالة ناجحة',
    icon: '🏆',
    color: brandPink,
    description: 'أكثر من 500 حالة تحسن موثقة',
  },
  {
    id: 'research',
    title: 'Research-Based',
    titleAr: 'قائم على الأبحاث',
    icon: '📊',
    color: brandPurpleDark,
    description: 'بروتوكول مبني على أبحاث علمية موثقة',
  },
];

const partners = [
  { name: 'مدارس شريكة', count: '15+', icon: '🏫' },
  { name: 'جامعات متعاونة', count: '3+', icon: '🎓' },
  { name: 'عيادات شريكة', count: '8+', icon: '🏥' },
];

export default function CredentialsBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCredential, setHoveredCredential] = useState<string | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (bannerRef.current) observer.observe(bannerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={bannerRef} style={{
      padding: '30px 20px',
      background: 'linear-gradient(135deg, rgba(11,15,28,0.98), rgba(25,30,50,0.98))',
      borderTop: '1px solid rgba(143,211,204,0.2)',
      borderBottom: '1px solid rgba(143,211,204,0.2)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes credentialEnter {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        background: `radial-gradient(circle, ${brandCyan}15, transparent)`,
        borderRadius: '50%',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 150,
        height: 150,
        background: `radial-gradient(circle, ${brandPurple}15, transparent)`,
        borderRadius: '50%',
        filter: 'blur(30px)',
      }} />

      {/* Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: 24,
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 20px',
          background: 'rgba(143,211,204,0.1)',
          border: '1px solid rgba(143,211,204,0.25)',
          borderRadius: 30,
          marginBottom: 12,
        }}>
          <span style={{ fontSize: 18 }}>🏅</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: brandCyan }}>
            الاعتمادات والشهادات
          </span>
        </div>
        <h3 style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 900,
          color: '#fff',
        }}>
          معتمدون ومرخصون دولياً
        </h3>
        <p style={{
          margin: '8px 0 0',
          fontSize: 13,
          color: 'rgba(255,255,255,0.6)',
        }}>
          Certified & Licensed Berard AIT Practitioners
        </p>
      </div>

      {/* Credentials Grid */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 16,
        maxWidth: 1000,
        margin: '0 auto 24px',
        position: 'relative',
        zIndex: 1,
      }}>
        {credentials.map((cred, index) => (
          <div
            key={cred.id}
            onMouseEnter={() => setHoveredCredential(cred.id)}
            onMouseLeave={() => setHoveredCredential(null)}
            style={{
              padding: '16px 20px',
              background: hoveredCredential === cred.id
                ? `linear-gradient(135deg, ${cred.color}22, ${cred.color}11)`
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${hoveredCredential === cred.id ? cred.color : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 16,
              cursor: 'default',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: hoveredCredential === cred.id ? 'translateY(-5px) scale(1.02)' : 'translateY(0)',
              boxShadow: hoveredCredential === cred.id ? `0 15px 40px ${cred.color}22` : 'none',
              animation: isVisible ? `credentialEnter 0.6s ease-out ${index * 0.1}s backwards` : 'none',
              minWidth: 160,
              textAlign: 'center',
            }}
          >
            {/* Icon with glow */}
            <div style={{
              width: 50,
              height: 50,
              margin: '0 auto 10px',
              borderRadius: 12,
              background: `linear-gradient(135deg, ${cred.color}33, ${cred.color}11)`,
              border: `1px solid ${cred.color}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              animation: hoveredCredential === cred.id ? 'float 2s ease-in-out infinite' : 'none',
              boxShadow: hoveredCredential === cred.id ? `0 0 20px ${cred.color}44` : 'none',
            }}>
              {cred.icon}
            </div>

            {/* Title */}
            <div style={{
              fontWeight: 800,
              fontSize: 13,
              color: cred.color,
              marginBottom: 4,
            }}>
              {cred.titleAr}
            </div>
            <div style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.5)',
            }}>
              {cred.title}
            </div>

            {/* Description on hover */}
            {hoveredCredential === cred.id && (
              <div style={{
                marginTop: 10,
                padding: '8px 10px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 8,
                fontSize: 11,
                color: 'rgba(255,255,255,0.7)',
                animation: 'credentialEnter 0.3s ease-out',
              }}>
                {cred.description}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Partners Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 30,
        flexWrap: 'wrap',
        paddingTop: 20,
        borderTop: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        zIndex: 1,
      }}>
        {partners.map((partner, index) => (
          <div
            key={partner.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.06)',
              animation: isVisible ? `credentialEnter 0.6s ease-out ${0.5 + index * 0.1}s backwards` : 'none',
            }}
          >
            <span style={{ fontSize: 20 }}>{partner.icon}</span>
            <div>
              <div style={{
                fontSize: 18,
                fontWeight: 900,
                color: brandCyan,
                fontFamily: 'monospace',
              }}>
                {partner.count}
              </div>
              <div style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.6)',
              }}>
                {partner.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Animated border */}
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
