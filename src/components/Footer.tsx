import { ReactNode, useMemo } from 'react';
import { CLINIC } from '../data/clinic';
import { styles, brandCyan, brandPurple, brandPink } from './styles';
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
  PhoneIcon,
} from './Icons';
import BrainLogo from './BrainLogo';

type SocialLink = {
  name: string;
  href: string;
  icon: ReactNode;
  color: string;
};

const social: SocialLink[] = [
  { name: 'X', href: 'https://x.com/Berardaiteg', icon: <TwitterXIcon size={18} />, color: '#fff' },
  { name: 'TikTok', href: 'https://vt.tiktok.com/ZSydLErRH/', icon: <TikTokIcon size={18} />, color: '#ff0050' },
  { name: 'Instagram', href: 'https://www.instagram.com/berard.ait.eg?igsh=MXVjNmFnZng3MHcyMg==', icon: <InstagramIcon size={18} />, color: '#E4405F' },
  { name: 'Facebook', href: 'https://www.facebook.com/share/14LfPuhkdVH/', icon: <FacebookIcon size={18} />, color: '#1877F2' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/lotus-holistic-centre/', icon: <LinkedInIcon size={18} />, color: '#0A66C2' },
];

const quickLinks = [
  { label: 'البرنامج', href: '#overview', icon: <HeadphonesIcon size={16} /> },
  { label: 'النتائج', href: '#results', icon: <ChartIcon size={16} /> },
  { label: 'الألعاب', href: '#games', icon: <GamepadIcon size={16} /> },
  { label: 'المدارس', href: '#schools', icon: <SchoolIcon size={16} /> },
];

// Lotus Holistic Centre Abu Dhabi location
const LOCATION = {
  name: 'Lotus Holistic Centre',
  address: 'أبوظبي، الإمارات العربية المتحدة',
  addressEn: 'Abu Dhabi, UAE',
  directionsUrl: 'https://maps.google.com/?q=Lotus+Holistic+Centre+Abu+Dhabi+UAE',
};

const Footer = () => {
  const year = new Date().getFullYear();

  const css = useMemo(() => `
    @keyframes footerGlow {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
    .social-icon {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .social-icon:hover {
      transform: translateY(-4px) scale(1.05);
    }
    .quick-link-item {
      transition: all 0.25s ease;
    }
    .quick-link-item:hover {
      transform: translateX(-6px);
      color: ${brandCyan};
    }
    .location-card {
      transition: all 0.3s ease;
    }
    .location-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba(143,211,204,0.2);
    }
  `, []);

  return (
    <footer style={{
      background: 'linear-gradient(180deg, rgba(11,15,28,0.95) 0%, rgba(5,6,13,1) 100%)',
      borderTop: '1px solid rgba(143,211,204,0.15)',
      padding: '40px 20px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{css}</style>

      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${brandCyan}50, ${brandPurple}50, transparent)`,
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '-5%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${brandPurple}10, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-5%',
        width: 250,
        height: 250,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${brandCyan}08, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Top Section - Brand + Location */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 30,
          marginBottom: 30,
        }}>
          {/* Brand Column */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <BrainLogo size={50} textSize={20} showText={true} />
            </div>
            <p style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
              margin: 0,
              maxWidth: 280,
            }}>
              تدريب التكامل السمعي المعتمد لتحسين المعالجة السمعية والتركيز والتعلم
            </p>
          </div>

          {/* Location Card */}
          <a
            href={LOCATION.directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="location-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '20px 24px',
              background: 'rgba(143,211,204,0.06)',
              border: '1px solid rgba(143,211,204,0.15)',
              borderRadius: 16,
              textDecoration: 'none',
              color: '#fff',
            }}
          >
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${brandCyan}30, ${brandPurple}20)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <MapPinIcon size={28} color={brandCyan} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: brandCyan, marginBottom: 4 }}>
                {LOCATION.name}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                {LOCATION.address}
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background: 'rgba(143,211,204,0.15)',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              color: brandCyan,
            }}>
              <CompassIcon size={14} />
              الخريطة
              <ExternalLinkIcon size={12} style={{ opacity: 0.7 }} />
            </div>
          </a>

          {/* Contact Card */}
          <div style={{
            padding: '20px 24px',
            background: 'rgba(176,18,112,0.06)',
            border: '1px solid rgba(176,18,112,0.15)',
            borderRadius: 16,
          }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: brandPink, marginBottom: 12 }}>
              تواصل معنا
            </div>
            <a
              href={`https://wa.me/${CLINIC.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 16px',
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 12,
                textDecoration: 'none',
                color: '#22c55e',
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              <PhoneIcon size={18} />
              <span style={{ direction: 'ltr' }}>{CLINIC.whatsapp}</span>
            </a>
          </div>
        </div>

        {/* Middle Section - Links + Social */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 30,
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          {/* Quick Links */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 14, letterSpacing: 1 }}>
              روابط سريعة
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="quick-link-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10,
                    textDecoration: 'none',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social Icons */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 14, letterSpacing: 1 }}>
              تابعنا
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {social.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon"
                  title={s.name}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${s.color}15`,
                    border: `1px solid ${s.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    color: s.color,
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          marginTop: 30,
          paddingTop: 20,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            © {year} {CLINIC.name}. جميع الحقوق محفوظة
          </div>
          <div style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#22c55e',
              animation: 'footerGlow 2s ease-in-out infinite',
            }} />
            React + Vite • GitHub Pages
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
