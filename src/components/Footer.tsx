import { ReactNode, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CLINIC } from '../data/clinic';
import { styles, brandCyan, brandPurple, brandPink, brandPanel, brandColors, colors, radius, spacing, typography, labTech } from './styles';
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
  ExternalLinkIcon,
  PhoneIcon,
  BrainIcon,
  HelpIcon,
  UsersIcon,
} from './Icons';
import BrainLogo from './BrainLogo';
import { useLanguage } from '../context/LanguageContext';
import { renderLabIcon } from './icons/index';

type SocialLink = {
  name: string;
  href: string;
  icon: ReactNode;
  color: string;
};

const social: SocialLink[] = [
  { name: 'X', href: 'https://x.com/Berardaiteg', icon: <TwitterXIcon size={18} />, color: colors.text.primary },
  { name: 'TikTok', href: 'https://vt.tiktok.com/ZSydLErRH/', icon: <TikTokIcon size={18} />, color: brandColors.tiktok },
  { name: 'Instagram', href: 'https://www.instagram.com/berard.ait.eg?igsh=MXVjNmFnZng3MHcyMg==', icon: <InstagramIcon size={18} />, color: brandColors.instagram },
  { name: 'Facebook', href: 'https://www.facebook.com/share/14LfPuhkdVH/', icon: <FacebookIcon size={18} />, color: brandColors.facebook },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/lotus-holistic-centre/', icon: <LinkedInIcon size={18} />, color: brandColors.linkedin },
];

// Quick links with proper page routes - using translation keys for consistency
type QuickLink = {
  translationKey: string;
  to: string;
  icon: ReactNode;
};

const QUICK_LINKS: QuickLink[] = [
  { translationKey: 'nav.program', to: '/program', icon: <HeadphonesIcon size={16} /> },
  { translationKey: 'nav.assessment', to: '/lab', icon: <GamepadIcon size={16} /> },
  { translationKey: 'nav.results', to: '/results', icon: <ChartIcon size={16} /> },
  { translationKey: 'nav.partners', to: '/partners', icon: <UsersIcon size={16} /> },
  { translationKey: 'nav.science', to: '/science', icon: <BrainIcon size={16} /> },
  { translationKey: 'nav.resources', to: '/resources', icon: <HelpIcon size={16} /> },
  { translationKey: 'nav.faq', to: '/faq', icon: <HelpIcon size={16} /> },
  { translationKey: 'nav.about', to: '/about', icon: renderLabIcon('🏛️', { size: 16, tone: 'cyan' }) },
  { translationKey: 'nav.contact', to: '/contact', icon: <PhoneIcon size={16} /> },
];

// Lotus Holistic Centre Abu Dhabi location
const LOCATION = {
  name: 'Lotus Holistic Centre',
  directionsUrl: 'https://maps.google.com/?q=Lotus+Holistic+Centre+Abu+Dhabi+UAE',
};

const Footer = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const css = useMemo(() => `
    @keyframes footerGlow {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
    @keyframes scanLine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes statusPulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 6px ${colors.success}; }
      50% { opacity: 0.6; box-shadow: 0 0 10px ${colors.success}; }
    }
    @keyframes glowBar {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    .social-icon {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    .social-icon::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
      transform: translateX(-100%);
      transition: transform 0.6s ease;
    }
    .social-icon:hover {
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 8px 25px var(--icon-color, ${brandCyan}4D);
    }
    .social-icon:hover::after {
      transform: translateX(100%);
    }
    .quick-link-item {
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }
    .quick-link-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background: ${brandCyan};
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }
    .quick-link-item:hover {
      transform: translateX(-6px);
      color: ${brandCyan};
      border-color: ${brandCyan}30;
      box-shadow: 0 0 20px ${brandCyan}20;
    }
    .quick-link-item:hover::before {
      transform: scaleY(1);
    }
    .location-card {
      transition: all 0.3s ease;
    }
    .location-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px ${brandCyan}26, 0 0 30px ${brandCyan}10;
      border-color: ${brandCyan}30;
    }
    .contact-card:hover {
      border-color: ${brandPink}30;
      box-shadow: 0 0 25px ${brandPink}10;
    }
    .footer-scan-line {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
    }
    .footer-scan-line::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40%;
      height: 100%;
      background: linear-gradient(90deg, transparent, ${brandCyan}04, transparent);
      animation: scanLine 6s linear infinite;
    }
    @media (max-width: 640px) {
      .footer-main {
        padding: 28px 16px 20px !important;
      }
      .footer-top-grid {
        gap: 20px !important;
      }
      .footer-middle-section {
        gap: 20px !important;
        padding-top: 20px !important;
      }
      .location-card {
        padding: 16px !important;
        gap: 12px !important;
      }
      .contact-card {
        padding: 16px !important;
      }
      .quick-links-container {
        gap: 6px !important;
      }
      .quick-link-item {
        padding: 8px 12px !important;
        font-size: 12px !important;
      }
      .social-icons-container {
        gap: 8px !important;
      }
      .social-icon {
        width: 40px !important;
        height: 40px !important;
      }
      .footer-bottom-bar {
        flex-direction: column !important;
        text-align: center !important;
        gap: 12px !important;
      }
    }
    @media (min-width: 768px) and (max-width: 1023px) {
      .footer-top-grid {
        grid-template-columns: 1fr 1fr !important;
      }
      .footer-middle-section {
        flex-direction: row !important;
        justify-content: space-between !important;
      }
      .quick-links-container {
        max-width: 400px;
      }
    }
    @media (min-width: 1280px) {
      .footer-main {
        padding: 48px 32px 28px !important;
      }
      .footer-top-grid {
        grid-template-columns: 1.2fr 1fr 1fr !important;
        gap: 40px !important;
      }
      .footer-middle-section {
        gap: 48px !important;
        padding-top: 32px !important;
      }
      .quick-link-item {
        padding: 12px 20px !important;
        font-size: 14px !important;
      }
      .social-icon {
        width: 48px !important;
        height: 48px !important;
      }
    }
  `, []);

  return (
    <footer className="footer-main" style={{
      background: labTech.backgrounds.footer,
      borderTop: `1px solid ${brandCyan}20`,
      padding: '40px 20px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{css}</style>

      {/* Top glow bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${brandCyan}66, ${brandPurple}66, transparent)`,
        animation: 'glowBar 3s ease-in-out infinite',
      }} />

      {/* Scan line effect */}
      <div className="footer-scan-line" />

      {/* Grid pattern overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        backgroundImage: `
          linear-gradient(${brandCyan}20 1px, transparent 1px),
          linear-gradient(90deg, ${brandCyan}20 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '-5%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${brandPurple}08, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-5%',
        width: 250,
        height: 250,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${brandCyan}06, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Top Section - Brand + Location */}
        <div className="footer-top-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
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
              {t('footer.description')}
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
              background: '${brandCyan}0F',
              border: '1px solid ${brandCyan}26',
              borderRadius: 16,
              textDecoration: 'none',
              color: colors.text.primary,
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
                {t('footer.location')}
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background: '${brandCyan}26',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              color: brandCyan,
            }}>
              <CompassIcon size={14} />
              {t('common.map')}
              <ExternalLinkIcon size={12} style={{ opacity: 0.7 }} />
            </div>
          </a>

          {/* Contact Card */}
          <div className="contact-card" style={{
            padding: '20px 24px',
            background: 'rgba(176,18,112,0.06)',
            border: '1px solid rgba(176,18,112,0.15)',
            borderRadius: 16,
          }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: brandPink, marginBottom: 12 }}>
              {t('common.contactUs')}
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
                color: colors.success,
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
        <div className="footer-middle-section" style={{
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
              {t('common.quickLinks')}
            </div>
            <div className="quick-links-container" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
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
                  {t(link.translationKey)}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Icons */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 14, letterSpacing: 1 }}>
              {t('common.followUs')}
            </div>
            <div className="social-icons-container" style={{ display: 'flex', gap: 10 }}>
              {social.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="social-icon"
                  title={s.name}
                  aria-label={`Follow us on ${s.name}`}
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
        <div className="footer-bottom-bar" style={{
          marginTop: 30,
          paddingTop: 20,
          borderTop: `1px solid ${brandCyan}10`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            © {year} {CLINIC.name}. {t('footer.copyright')}
          </div>

          {/* Lab tech status bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            {/* Version badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              background: '${brandCyan}14',
              border: `1px solid ${brandCyan}20`,
              borderRadius: 6,
            }}>
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                color: brandCyan,
                letterSpacing: 1,
              }}>{t('labTech.lotusLab')}</span>
              <span style={{
                fontSize: 8,
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'monospace',
              }}>{t('labTech.version')}</span>
            </div>

            {/* System status */}
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
                background: colors.success,
                animation: 'statusPulse 2s ease-in-out infinite',
              }} />
              <span style={{ fontFamily: 'monospace', fontSize: 10 }}>{t('labTech.systemOnline')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
