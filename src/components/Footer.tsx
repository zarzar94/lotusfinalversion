import { ReactNode, useMemo } from 'react';
import { CLINIC } from '../data/clinic';
import { styles, brandCyan, brandPurple, brandPurpleDark, brandPink } from './styles';
import {
  MapPinIcon,
  CompassIcon,
  TwitterXIcon,
  TikTokIcon,
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  HeadphonesIcon,
  ChartIcon,
  GamepadIcon,
  SchoolIcon,
  ExternalLinkIcon,
} from './Icons';

type SocialLink = {
  name: string;
  href: string;
  icon: ReactNode;
  color: string;
};

const social: SocialLink[] = [
  { name: 'X', href: 'https://x.com/Berardaiteg', icon: <TwitterXIcon size={16} />, color: '#fff' },
  { name: 'TikTok', href: 'https://vt.tiktok.com/ZSydLErRH/', icon: <TikTokIcon size={16} />, color: '#ff0050' },
  { name: 'Instagram', href: 'https://www.instagram.com/berard.ait.eg?igsh=MXVjNmFnZng3MHcyMg==', icon: <InstagramIcon size={16} />, color: '#E4405F' },
  { name: 'Facebook', href: 'https://www.facebook.com/share/14LfPuhkdVH/', icon: <FacebookIcon size={16} />, color: '#1877F2' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/lotus-holistic-centre/', icon: <LinkedInIcon size={16} />, color: '#0A66C2' },
];

const quickLinks = [
  { label: 'البرنامج', href: '#overview', icon: <HeadphonesIcon size={14} /> },
  { label: 'النتائج', href: '#results', icon: <ChartIcon size={14} /> },
  { label: 'الألعاب', href: '#games', icon: <GamepadIcon size={14} /> },
  { label: 'شراكات المدارس', href: '#schools', icon: <SchoolIcon size={14} /> },
];

// Lotus Holistic Centre Abu Dhabi location
const LOCATION = {
  name: 'Lotus Holistic Centre',
  address: 'أبوظبي، الإمارات العربية المتحدة',
  addressEn: 'Abu Dhabi, United Arab Emirates',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.2!2d54.37!3d24.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLotus%20Holistic%20Centre!5e0!3m2!1sen!2sae!4v1',
  directionsUrl: 'https://www.google.com/maps/search/Lotus+Holistic+Centre+Abu+Dhabi',
};

const Footer = () => {
  const year = new Date().getFullYear();

  const css = useMemo(() => `
    .social-link {
      transition: all 0.3s ease;
    }
    .social-link:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(143,211,204,0.25);
    }
    .quick-link {
      transition: all 0.2s ease;
    }
    .quick-link:hover {
      transform: translateX(-4px);
      background: rgba(143,211,204,0.15);
      border-color: rgba(143,211,204,0.3);
    }
    .directions-btn {
      transition: all 0.3s ease;
    }
    .directions-btn:hover {
      transform: scale(1.02);
      box-shadow: 0 12px 40px rgba(143,211,204,0.35);
    }
  `, []);

  return (
    <footer style={{ ...styles.sectionCard, marginBottom: 0, padding: 20 }}>
      <style>{css}</style>

      {/* Map Section */}
      <div style={{
        marginBottom: 24,
        borderRadius: 18,
        overflow: 'hidden',
        border: '1px solid rgba(143,211,204,0.2)',
        background: 'linear-gradient(135deg, rgba(143,211,204,0.05), rgba(175,132,186,0.05))',
      }}>
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14,
          background: 'rgba(11,15,28,0.6)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${brandCyan}22, ${brandPurple}22)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(143,211,204,0.2)',
            }}>
              <MapPinIcon size={24} color={brandCyan} />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, color: brandCyan }}>
                {LOCATION.name}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>
                {LOCATION.address}
              </div>
            </div>
          </div>
          <a
            href={LOCATION.directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="directions-btn"
            style={{
              ...styles.primaryBtn,
              textDecoration: 'none',
              padding: '12px 20px',
              fontSize: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 12,
            }}
          >
            <CompassIcon size={18} /> الحصول على الاتجاهات
            <ExternalLinkIcon size={14} style={{ opacity: 0.7 }} />
          </a>
        </div>
        <div style={{ position: 'relative', height: 200 }}>
          <iframe
            src={LOCATION.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{
              border: 0,
              filter: 'grayscale(0.3) contrast(1.1)',
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="موقع Lotus Holistic Centre"
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 50,
            background: 'linear-gradient(to top, rgba(11,15,28,0.9), transparent)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* Footer Content Grid */}
      <div style={{
        display: 'grid',
        gap: 24,
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      }}>
        {/* Brand Column */}
        <div>
          <div style={{
            fontWeight: 900,
            fontSize: 18,
            marginBottom: 8,
            background: `linear-gradient(135deg, ${brandPurple}, ${brandCyan})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {CLINIC.name}
          </div>
          <div style={{ ...styles.muted, marginTop: 8 }}>{CLINIC.city}</div>
          <div style={{
            marginTop: 10,
            padding: '10px 14px',
            background: 'rgba(143,211,204,0.08)',
            borderRadius: 10,
            border: '1px solid rgba(143,211,204,0.15)',
          }}>
            <span style={{ color: brandCyan, fontWeight: 800, fontSize: 12 }}>WhatsApp</span>
            <div style={{ fontWeight: 900, marginTop: 4, direction: 'ltr', textAlign: 'left' }}>
              {CLINIC.whatsapp}
            </div>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <div style={{ fontWeight: 900, marginBottom: 12, color: brandPurple }}>روابط سريعة</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="quick-link"
                style={{
                  ...styles.navLink,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                }}
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Social Column */}
        <div>
          <div style={{ fontWeight: 900, marginBottom: 12, color: brandPink }}>تابعنا</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {social.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="social-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  textDecoration: 'none',
                  color: '#f7f8fb',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                <span style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: `${s.color}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {s.icon}
                </span>
                {s.name}
              </a>
            ))}
          </div>
          <div style={{
            ...styles.muted,
            marginTop: 16,
            padding: '10px 12px',
            background: 'rgba(245,158,11,0.08)',
            borderRadius: 10,
            border: '1px solid rgba(245,158,11,0.15)',
            fontSize: 12,
          }}>
            ملاحظة: لا نقدم تشخيصاً عبر الموقع. للتقييم، يرجى التواصل لحجز موعد.
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(143,211,204,0.3), rgba(175,132,186,0.3), transparent)',
        marginTop: 20,
        marginBottom: 14,
      }} />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={styles.muted}>© {year} {CLINIC.name}</div>
        <div style={{
          ...styles.muted,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#22c55e',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          Built with React + Vite • Hosted on GitHub Pages
        </div>
      </div>
    </footer>
  );
};

export default Footer;
