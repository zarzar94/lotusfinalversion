import { useState, useEffect, useRef, useMemo } from 'react';
import { brandCyan, brandPink, brandPurple, brandPurpleDark, colors, styles } from './styles';
import { useVisitorMode, type VisitorMode } from '../context/VisitorModeContext';
import { useLanguage } from '../context/LanguageContext';
import { renderLabIcon } from './icons/index';

interface Credential {
  id: string;
  title: string;
  titleAr: string;
  icon: string;
  color: string;
  description: string;
  descriptionEn: string;
  relevantModes: VisitorMode[]; // Which modes this credential is most relevant to
}

const credentials: Credential[] = [
  {
    id: 'berard',
    title: 'Berard AIT Certified',
    titleAr: 'auto.CredentialsBanner.k4',
    icon: '🎓',
    color: brandCyan,
    description: 'برنامج معتمد رسمياً من مؤسسة Berard AIT الدولية',
    descriptionEn: 'Officially certified by Berard AIT International',
    relevantModes: ['clinician', 'school'],
  },
  {
    id: 'licensed',
    title: 'Licensed Practitioner',
    titleAr: 'auto.CredentialsBanner.k5',
    icon: '✅',
    color: colors.success,
    description: 'حاصل على ترخيص ممارسة العلاج السمعي التكاملي',
    descriptionEn: 'Licensed to practice auditory integration therapy',
    relevantModes: ['clinician', 'parent'],
  },
  {
    id: 'experience',
    title: '10+ Years Experience',
    titleAr: 'auto.CredentialsBanner.k6',
    icon: '⭐',
    color: brandPurple,
    description: 'خبرة تتجاوز عشر سنوات في العلاج السمعي',
    descriptionEn: 'Over 10 years of auditory therapy experience',
    relevantModes: ['parent', 'clinician'],
  },
  {
    id: 'cases',
    title: '500+ Success Cases',
    titleAr: 'auto.CredentialsBanner.k7',
    icon: '🏆',
    color: brandPink,
    description: 'أكثر من 500 حالة تحسن موثقة',
    descriptionEn: 'Over 500 documented improvement cases',
    relevantModes: ['parent'],
  },
  {
    id: 'research',
    title: 'Research-Based',
    titleAr: 'auto.CredentialsBanner.k8',
    icon: '📊',
    color: brandPurpleDark,
    description: 'بروتوكول مبني على أبحاث علمية موثقة',
    descriptionEn: 'Protocol based on documented scientific research',
    relevantModes: ['clinician', 'school'],
  },
  {
    id: 'schools',
    title: 'School Partnership Program',
    titleAr: 'auto.CredentialsBanner.k9',
    icon: '🏫',
    color: colors.warning,
    description: 'برامج فحص وتدريب مخصصة للمؤسسات التعليمية',
    descriptionEn: 'Specialized screening and training programs for educational institutions',
    relevantModes: ['school'],
  },
];

interface Partner {
  name: string;
  nameEn: string;
  count: string;
  icon: string;
  relevantMode?: VisitorMode;
}

const partners: Partner[] = [
  { name: 'مدارس شريكة', nameEn: 'Partner Schools', count: '15+', icon: '🏫', relevantMode: 'school' },
  { name: 'جامعات متعاونة', nameEn: 'Partner Universities', count: '3+', icon: '🎓', relevantMode: 'school' },
  { name: 'عيادات شريكة', nameEn: 'Partner Clinics', count: '8+', icon: '🏥', relevantMode: 'clinician' },
  { name: 'عائلات سعيدة', nameEn: 'Happy Families', count: '500+', icon: '👨‍👩‍👧', relevantMode: 'parent' },
];

export default function CredentialsBanner() {
  const { mode: visitorMode, config: visitorConfig } = useVisitorMode();
  const { isArabic, t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCredential, setHoveredCredential] = useState<string | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Sort credentials: relevant ones first
  const sortedCredentials = useMemo(() => {
    return [...credentials].sort((a, b) => {
      const aRelevant = a.relevantModes.includes(visitorMode);
      const bRelevant = b.relevantModes.includes(visitorMode);
      if (aRelevant && !bRelevant) return -1;
      if (!aRelevant && bRelevant) return 1;
      return 0;
    });
  }, [visitorMode]);

  // Filter partners: show relevant ones first, then others
  const sortedPartners = useMemo(() => {
    return [...partners].sort((a, b) => {
      const aRelevant = a.relevantMode === visitorMode;
      const bRelevant = b.relevantMode === visitorMode;
      if (aRelevant && !bRelevant) return -1;
      if (!aRelevant && bRelevant) return 1;
      return 0;
    });
  }, [visitorMode]);

  // Check if a credential is relevant
  const isRelevant = (cred: Credential) => cred.relevantModes.includes(visitorMode);

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
        @keyframes relevantGlow {
          0%, 100% { box-shadow: 0 0 15px ${visitorConfig.color}30; }
          50% { box-shadow: 0 0 25px ${visitorConfig.color}50; }
        }
        .credential-relevant {
          animation: relevantGlow 2s ease-in-out infinite;
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
        {/* Visitor mode badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 12px',
          background: `${visitorConfig.color}15`,
          border: `1px solid ${visitorConfig.color}30`,
          borderRadius: 20,
          marginBottom: 10,
          fontSize: 11,
          fontWeight: 700,
          color: visitorConfig.color,
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            {renderLabIcon(visitorConfig.icon, { size: 14, style: { color: visitorConfig.color } })}
          </span>
          {t('auto.CredentialsBanner.k1', "Highlighted for you")}
        </div>
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
          <span style={{ fontSize: 18 }}>
            {renderLabIcon('\u{1F3C5}', { size: 18, tone: 'warning' })}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: brandCyan }}>
            {t('auto.CredentialsBanner.k2', "Certifications & Credentials")}
          </span>
        </div>
        <h3 style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 900,
          color: colors.text.primary,
        }}>
          {t('auto.CredentialsBanner.k3', "Internationally Certified & Licensed")}
        </h3>
        <p style={{
          margin: '8px 0 0',
          fontSize: 13,
          color: 'rgba(255,255,255,0.6)',
        }}>
          {isArabic ? 'ممارسون معتمدون ومرخصون لـ Berard AIT' : 'Certified & Licensed Berard AIT Practitioners'}
        </p>
      </div>

      {/* Credentials Grid */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 16,
        maxWidth: 1100,
        margin: '0 auto 24px',
        position: 'relative',
        zIndex: 1,
      }}>
        {sortedCredentials.map((cred, index) => {
          const relevant = isRelevant(cred);
          const isHovered = hoveredCredential === cred.id;

          return (
            <div
              key={cred.id}
              className={relevant ? 'credential-relevant' : ''}
              onMouseEnter={() => setHoveredCredential(cred.id)}
              onMouseLeave={() => setHoveredCredential(null)}
              style={{
                position: 'relative',
                padding: '16px 20px',
                background: isHovered
                  ? `linear-gradient(135deg, ${cred.color}22, ${cred.color}11)`
                  : relevant
                    ? `linear-gradient(135deg, ${visitorConfig.color}15, ${visitorConfig.color}08)`
                    : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isHovered ? cred.color : relevant ? visitorConfig.color + '40' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 16,
                cursor: 'default',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'translateY(-5px) scale(1.02)' : 'translateY(0)',
                boxShadow: isHovered ? `0 15px 40px ${cred.color}22` : 'none',
                animation: isVisible ? `credentialEnter 0.6s ease-out ${index * 0.1}s backwards` : 'none',
                minWidth: 160,
                textAlign: 'center',
              }}
            >
              {/* Relevant badge */}
              {relevant && (
                <div style={{
                  position: 'absolute',
                  top: -8,
                  right: isArabic ? 'auto' : -8,
                  left: isArabic ? -8 : 'auto',
                  padding: '3px 8px',
                  background: visitorConfig.color,
                  borderRadius: 6,
                  fontSize: 9,
                  fontWeight: 800,
                  color: colors.text.primary,
                  boxShadow: `0 2px 8px ${visitorConfig.color}50`,
                }}>
                  {renderLabIcon(visitorConfig.icon, { size: 12, style: { color: colors.text.primary } })}
                </div>
              )}

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
                animation: isHovered ? 'float 2s ease-in-out infinite' : 'none',
                boxShadow: isHovered ? `0 0 20px ${cred.color}44` : 'none',
              }}>
                {renderLabIcon(cred.icon, { size: 24, style: { color: cred.color } })}
              </div>

              {/* Title */}
              <div style={{
                fontWeight: 800,
                fontSize: 13,
                color: cred.color,
                marginBottom: 4,
              }}>
                {isArabic ? t(cred.titleAr, cred.title) : cred.title}
              </div>
              {isArabic && (
                <div style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.5)',
                }}>
                  {cred.title}
                </div>
              )}

              {/* Description on hover */}
              {isHovered && (
                <div style={{
                  marginTop: 10,
                  padding: '8px 10px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: 8,
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.7)',
                  animation: 'credentialEnter 0.3s ease-out',
                }}>
                  {isArabic ? cred.description : cred.descriptionEn}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Partners Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        flexWrap: 'wrap',
        paddingTop: 20,
        borderTop: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        zIndex: 1,
      }}>
        {sortedPartners.map((partner, index) => {
          const isPartnerRelevant = partner.relevantMode === visitorMode;

          return (
            <div
              key={partner.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 16px',
                background: isPartnerRelevant
                  ? `linear-gradient(135deg, ${visitorConfig.color}15, ${visitorConfig.color}08)`
                  : 'rgba(255,255,255,0.03)',
                borderRadius: 10,
                border: `1px solid ${isPartnerRelevant ? visitorConfig.color + '40' : 'rgba(255,255,255,0.06)'}`,
                animation: isVisible ? `credentialEnter 0.6s ease-out ${0.5 + index * 0.1}s backwards` : 'none',
                boxShadow: isPartnerRelevant ? `0 0 15px ${visitorConfig.color}20` : 'none',
              }}
            >
              <span style={{ fontSize: 20 }}>
                {renderLabIcon(partner.icon, { size: 20, style: { color: isPartnerRelevant ? visitorConfig.color : brandCyan } })}
              </span>
              <div>
                <div style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: isPartnerRelevant ? visitorConfig.color : brandCyan,
                  fontFamily: 'monospace',
                }}>
                  {partner.count}
                </div>
                <div style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.6)',
                }}>
                  {isArabic ? partner.name : partner.nameEn}
                </div>
              </div>
            </div>
          );
        })}
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
