import { useMemo, useState, useEffect, useCallback } from 'react';
import { brandPurple, brandCyan, brandPink, colors, radius, spacing, typography, transitions } from './styles';
import { MenuIcon, XIcon, BrainIcon, HeadphonesIcon, GamepadIcon, PhoneIcon, HelpIcon } from './Icons';
import BrainLogo from './BrainLogo';
import LanguageToggle from './LanguageToggle';
import ProfileMenu from './auth/ProfileMenu';
import LoginModal from './auth/LoginModal';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { useBreakpoints } from '../hooks';

const getNavItems = (t: (key: string) => string) => [
  { label: t('nav.program'), href: '#overview', icon: <HeadphonesIcon size={16} /> },
  { label: t('nav.neuralScanner'), href: '#checklist', icon: <BrainIcon size={16} /> },
  { label: t('nav.games'), href: '#games', icon: <GamepadIcon size={16} /> },
  { label: t('nav.faq'), href: '#faq', icon: <HelpIcon size={16} /> },
  { label: t('nav.contact'), href: '#contact', icon: <PhoneIcon size={16} /> },
];

const Header = () => {
  const { t, direction, isArabic } = useLanguage();
  const { user, isAuthenticated, hasPermission } = useUser();
  const { isMobile } = useBreakpoints();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const NAV_ITEMS = useMemo(() => getNavItems(t), [t]);

  // Role-based dashboard link
  const dashboardLink = useMemo(() => {
    if (!isAuthenticated || !user) return null;
    if (hasPermission('view_child_reports')) {
      return { href: '/parent-dashboard', label: isArabic ? 'لوحة الأطفال' : 'Children', icon: '👨‍👩‍👧' };
    }
    if (hasPermission('view_patient_reports')) {
      return { href: '/clinician-dashboard', label: isArabic ? 'المرضى' : 'Patients', icon: '🏥' };
    }
    if (hasPermission('school_analytics')) {
      return { href: '/school-dashboard', label: isArabic ? 'المدرسة' : 'School', icon: '📊' };
    }
    return null;
  }, [isAuthenticated, user, hasPermission, isArabic]);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile) setIsMobileMenuOpen(false);
  }, [isMobile]);

  // Scroll listener for header background
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const css = useMemo(
    () => `
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-6px) rotate(2deg); }
      }
      @keyframes glow {
        0%, 100% { filter: drop-shadow(0 0 15px rgba(143,211,204,0.4)) drop-shadow(0 0 30px rgba(175,132,186,0.3)); }
        50% { filter: drop-shadow(0 0 25px rgba(143,211,204,0.6)) drop-shadow(0 0 50px rgba(175,132,186,0.5)); }
      }
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .brandGlow {
        filter: drop-shadow(0 10px 30px rgba(143,211,204,0.18));
      }
      .navPill:hover {
        border-color: rgba(143,211,204,0.28);
        background: rgba(143,211,204,0.08);
      }
      .headerBrainLogo {
        mix-blend-mode: screen;
        filter: drop-shadow(0 0 15px rgba(143,211,204,0.5)) drop-shadow(0 0 30px rgba(175,132,186,0.3));
      }
      .menuPanel {
        position: absolute;
        right: 12px;
        top: 62px;
        background: rgba(11,15,28,0.96);
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: 16px;
        padding: 12px;
        min-width: 260px;
        box-shadow: 0 20px 70px rgba(0,0,0,0.45);
      }
      .nav-link {
        position: relative;
        transition: all 0.3s ease;
      }
      .nav-link::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, ${brandCyan}, ${brandPurple});
        transition: width 0.3s ease;
        border-radius: 2px;
      }
      .nav-link:hover::after {
        width: 80%;
      }
      .nav-link:hover {
        color: ${brandCyan};
      }
      .mobile-menu {
        animation: slideDown 0.3s ease forwards;
      }
      .menu-btn {
        transition: transform 0.3s ease;
      }
      .menu-btn:hover {
        transform: scale(1.1);
      }
    `,
    [],
  );

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <style>{css}</style>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: isScrolled ? '10px 20px' : '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        background: isScrolled
          ? 'rgba(11,15,28,0.95)'
          : 'linear-gradient(180deg, rgba(11,15,28,0.95) 0%, rgba(11,15,28,0.8) 70%, transparent 100%)',
        backdropFilter: 'blur(12px)',
        borderBottom: isScrolled ? '1px solid rgba(143,211,204,0.15)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        {/* Logo Section */}
        <a href="#" className="floatingLogo" style={{ textDecoration: 'none', transition: 'all 0.3s ease' }}>
          <BrainLogo
            size={isScrolled ? 45 : 55}
            textSize={isScrolled ? 20 : 24}
            showText={true}
          />
        </a>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="nav-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#f7f8fb',
                  textDecoration: 'none',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                }}
              >
                {item.icon}
                {item.label}
              </a>
            ))}
            {/* Role-based Dashboard Link */}
            {dashboardLink && (
              <a
                href={dashboardLink.href}
                className="nav-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  fontSize: 14,
                  fontWeight: 700,
                  color: brandCyan,
                  textDecoration: 'none',
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
                  border: `1px solid ${brandCyan}30`,
                }}
              >
                <span>{dashboardLink.icon}</span>
                {dashboardLink.label}
              </a>
            )}
            {/* Language Toggle */}
            <LanguageToggle />
            {/* Profile Menu */}
            <ProfileMenu onLoginClick={openLoginModal} />
          </nav>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="menu-btn"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 12,
              padding: 10,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isMobileMenuOpen ? (
              <XIcon size={22} color="#f7f8fb" />
            ) : (
              <MenuIcon size={22} color="#f7f8fb" />
            )}
          </button>
        )}
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="mobile-menu"
          style={{
            position: 'fixed',
            top: 75,
            left: 16,
            right: 16,
            zIndex: 99,
            background: 'rgba(11,15,28,0.98)',
            border: '1px solid rgba(143,211,204,0.2)',
            borderRadius: 16,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                fontSize: 15,
                fontWeight: 700,
                color: '#f7f8fb',
                textDecoration: 'none',
                borderRadius: 12,
                background: `linear-gradient(135deg, rgba(143,211,204,${0.05 + index * 0.02}), rgba(175,132,186,${0.05 + index * 0.02}))`,
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${brandCyan}22, ${brandPurple}22)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {item.icon}
              </span>
              {item.label}
            </a>
          ))}
          {/* Role-based Dashboard Link (Mobile) */}
          {dashboardLink && (
            <a
              href={dashboardLink.href}
              onClick={handleNavClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                fontSize: 15,
                fontWeight: 700,
                color: brandCyan,
                textDecoration: 'none',
                borderRadius: 12,
                background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
                border: `1px solid ${brandCyan}30`,
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${brandCyan}30, ${brandPurple}25)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}>
                {dashboardLink.icon}
              </span>
              {dashboardLink.label}
            </a>
          )}
          {/* Language Toggle & Profile in Mobile Menu */}
          <div style={{
            marginTop: 8,
            paddingTop: 12,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
          }}>
            <LanguageToggle />
            <ProfileMenu onLoginClick={() => {
              setIsMobileMenuOpen(false);
              openLoginModal();
            }} />
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div style={{ height: isMobile ? 75 : 90 }} />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
};

export default Header;
