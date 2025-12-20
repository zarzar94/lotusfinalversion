import { useMemo, useState, useEffect, useCallback, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { brandPurple, brandCyan, brandPink, colors, radius, spacing, typography, transitions } from './styles';
import { MenuIcon, XIcon, BrainIcon, HeadphonesIcon, GamepadIcon, PhoneIcon, HelpIcon, HomeIcon } from './Icons';
import BrainLogo from './BrainLogo';
import LanguageToggle from './LanguageToggle';
import ModeSwitcher from './ModeSwitcher';
import ProfileMenu from './auth/ProfileMenu';
import LoginModal from './auth/LoginModal';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { useVisitorMode, type VisitorMode } from '../context/VisitorModeContext';
import { useBreakpoints } from '../hooks';

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION ITEMS - Multi-page structure with translation keys
// ═══════════════════════════════════════════════════════════════════════════

interface NavItem {
  id: string;
  translationKey: string; // Translation key for consistent language handling
  path: string;
  icon: React.ReactNode;
  color?: string;
  priority?: Record<VisitorMode, number>; // Priority per visitor mode (lower = higher priority)
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    translationKey: 'nav.home',
    path: '/',
    icon: <HomeIcon size={16} />,
    color: brandCyan,
    priority: { school: 0, parent: 0, clinician: 0 },
  },
  {
    id: 'assessment',
    translationKey: 'nav.assessment',
    path: '/assessment',
    icon: <BrainIcon size={16} />,
    color: brandCyan,
    priority: { school: 1, parent: 2, clinician: 2 }, // Schools: assessment first
  },
  {
    id: 'program',
    translationKey: 'nav.program',
    path: '/program',
    icon: <HeadphonesIcon size={16} />,
    color: brandPurple,
    priority: { school: 3, parent: 1, clinician: 3 }, // Parents: learn about program first
  },
  {
    id: 'science',
    translationKey: 'nav.science',
    path: '/science',
    icon: '🧠',
    color: brandPink,
    priority: { school: 5, parent: 5, clinician: 1 }, // Clinicians: science/evidence first
  },
  {
    id: 'results',
    translationKey: 'nav.results',
    path: '/results',
    icon: '📊',
    color: '#22c55e',
    priority: { school: 2, parent: 3, clinician: 4 }, // Schools & Parents: want to see results
  },
  {
    id: 'resources',
    translationKey: 'nav.resources',
    path: '/resources',
    icon: <HelpIcon size={16} />,
    color: '#f59e0b',
    priority: { school: 4, parent: 4, clinician: 5 },
  },
  {
    id: 'about',
    translationKey: 'nav.about',
    path: '/about',
    icon: '🏛️',
    color: brandPurple,
    priority: { school: 6, parent: 6, clinician: 6 },
  },
  {
    id: 'contact',
    translationKey: 'nav.contact',
    path: '/contact',
    icon: <PhoneIcon size={16} />,
    color: brandCyan,
    priority: { school: 7, parent: 7, clinician: 7 }, // Contact always last
  },
];

// Function to get sorted nav items based on visitor mode
const getSortedNavItems = (mode: VisitorMode): NavItem[] => {
  return [...NAV_ITEMS].sort((a, b) => {
    const priorityA = a.priority?.[mode] ?? 99;
    const priorityB = b.priority?.[mode] ?? 99;
    return priorityA - priorityB;
  });
};

const Header = memo(function Header() {
  const { t, direction, isArabic } = useLanguage();
  const { user, isAuthenticated, hasPermission } = useUser();
  const { mode: visitorMode, config: visitorConfig } = useVisitorMode();
  const { isMobile, isTablet } = useBreakpoints();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState<string | null>(null);
  const handleHomeClick = useCallback(() => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  // Get sorted nav items based on visitor mode
  const sortedNavItems = useMemo(() => getSortedNavItems(visitorMode), [visitorMode]);
  const visibleNavItems = useMemo(() => {
    if (isAuthenticated) return sortedNavItems;
    return sortedNavItems.filter((item) => (
      item.id === 'home'
      || item.id === 'program'
      || item.id === 'about'
      || item.id === 'contact'
    ));
  }, [isAuthenticated, sortedNavItems]);

  // Check if current path matches nav item
  const isActivePath = useCallback((path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  // Role-based dashboard link
  const dashboardLink = useMemo(() => {
    if (!isAuthenticated || !user) return null;
    if (hasPermission('view_child_reports')) {
      return { path: '/dashboard/parent', translationKey: 'nav.childrenDashboard', icon: '👨‍👩‍👧' };
    }
    if (hasPermission('view_patient_reports')) {
      return { path: '/dashboard/clinician', translationKey: 'nav.patientsDashboard', icon: '🏥' };
    }
    if (hasPermission('school_analytics')) {
      return { path: '/dashboard/educator', translationKey: 'nav.schoolDashboard', icon: '📊' };
    }
    return null;
  }, [isAuthenticated, user, hasPermission]);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  useEffect(() => {
    if (isAuthenticated) return;
    const params = new URLSearchParams(location.search);
    if (params.get('login') !== '1') return;
    const next = params.get('next');
    if (next && next.startsWith('/')) {
      navigate(`/login?next=${encodeURIComponent(next)}`, { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, location.search, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !loginRedirect) return;
    const target = loginRedirect;
    setLoginRedirect(null);
    navigate(target);
  }, [isAuthenticated, loginRedirect, navigate]);

  // Close mobile menu when switching to desktop or route changes
  useEffect(() => {
    if (!isMobile) setIsMobileMenuOpen(false);
  }, [isMobile]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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
      @keyframes activePulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(143,211,204,0.3); }
        50% { box-shadow: 0 0 8px 2px rgba(143,211,204,0.2); }
      }
      @keyframes scanLine {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      @keyframes statusPulse {
        0%, 100% { opacity: 1; box-shadow: 0 0 6px ${brandCyan}; }
        50% { opacity: 0.6; box-shadow: 0 0 10px ${brandCyan}; }
      }
      @keyframes headerGlow {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
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
        text-shadow: 0 0 10px ${brandCyan}44;
      }
      .nav-link.active::after {
        width: 80%;
      }
      .nav-link.active {
        color: ${brandCyan};
        background: rgba(143,211,204,0.1);
        text-shadow: 0 0 8px ${brandCyan}33;
      }
      .mobile-menu {
        animation: slideDown 0.3s ease forwards;
      }
      .menu-btn {
        transition: all 0.3s ease;
      }
      .menu-btn:hover {
        transform: scale(1.1);
        border-color: ${brandCyan}44 !important;
        box-shadow: 0 0 15px ${brandCyan}22;
      }
      .header-container {
        position: relative;
      }
      .header-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, ${brandCyan}66, ${brandPurple}66, transparent);
        animation: headerGlow 3s ease-in-out infinite;
      }
      .header-scan-line {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
      }
      .header-scan-line::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 30%;
        height: 100%;
        background: linear-gradient(90deg, transparent, ${brandCyan}08, transparent);
        animation: scanLine 4s linear infinite;
      }
    `,
    [],
  );

  const showCompactNav = isMobile || isTablet;

  return (
    <>
      <style>{css}</style>
      <header
        className="header-container"
        style={{
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
            ? 'linear-gradient(180deg, rgba(26,31,46,0.98) 0%, rgba(13,17,23,0.95) 100%)'
            : 'linear-gradient(180deg, rgba(26,31,46,0.95) 0%, rgba(13,17,23,0.85) 70%, transparent 100%)',
          backdropFilter: 'blur(16px)',
          borderBottom: isScrolled ? `1px solid ${brandCyan}22` : 'none',
          boxShadow: isScrolled ? `0 4px 30px rgba(0,0,0,0.3), 0 0 40px ${brandCyan}08` : 'none',
          transition: 'all 0.3s ease',
        }}>
        {/* Scan line effect */}
        <div className="header-scan-line" />
        {/* Logo Section */}
        <Link to="/" style={{ textDecoration: 'none', transition: 'all 0.3s ease' }}>
          <BrainLogo
            size={isScrolled ? 45 : 55}
            textSize={isScrolled ? 20 : 24}
            showText={!showCompactNav}
          />
        </Link>

        {/* Desktop Navigation */}
        {!showCompactNav && (
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            background: 'rgba(13,17,23,0.5)',
            borderRadius: 14,
            border: '1px solid rgba(143,211,204,0.1)',
          }}>
            {/* Lab status indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              marginRight: isArabic ? undefined : 4,
              marginLeft: isArabic ? 4 : undefined,
              borderRight: isArabic ? undefined : '1px solid rgba(143,211,204,0.15)',
              borderLeft: isArabic ? '1px solid rgba(143,211,204,0.15)' : undefined,
            }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px #22c55e',
                animation: 'statusPulse 2s ease-in-out infinite',
              }} />
              <span style={{
                fontSize: 9,
                fontWeight: 800,
                color: brandCyan,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}>{t('nav.lab')}</span>
            </div>
            {visibleNavItems.map((item) => {
              const isActive = isActivePath(item.path);
              const isPriority = item.priority?.[visitorMode] === 1; // Top priority for current mode
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={item.id === 'home' ? handleHomeClick : undefined}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 12px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: isActive ? brandCyan : isPriority ? visitorConfig.color : '#f7f8fb',
                    textDecoration: 'none',
                    borderRadius: 10,
                    background: isActive
                      ? `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`
                      : isPriority
                        ? `${visitorConfig.color}10`
                        : 'rgba(255,255,255,0.04)',
                    border: isActive
                      ? `1px solid ${brandCyan}35`
                      : isPriority
                        ? `1px solid ${visitorConfig.color}30`
                        : '1px solid transparent',
                    boxShadow: isActive ? `0 0 12px ${brandCyan}15` : 'none',
                  }}
                >
                  {/* Priority indicator dot */}
                  {isPriority && !isActive && (
                    <span style={{
                      position: 'absolute',
                      top: -3,
                      right: isArabic ? 'auto' : -3,
                      left: isArabic ? -3 : 'auto',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: visitorConfig.color,
                      border: '2px solid rgba(11,15,28,0.9)',
                    }} />
                  )}
                  <span style={{ fontSize: 14, opacity: isActive ? 1 : isPriority ? 0.9 : 0.7 }}>
                    {item.icon}
                  </span>
                  {t(item.translationKey)}
                </Link>
              );
            })}

            {/* Role-based Dashboard Link */}
            {dashboardLink && (
              <Link
                to={dashboardLink.path}
                className={`nav-link ${isActivePath(dashboardLink.path) ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: brandCyan,
                  textDecoration: 'none',
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`,
                  border: `1px solid ${brandCyan}30`,
                }}
              >
                <span>{dashboardLink.icon}</span>
                {t(dashboardLink.translationKey)}
              </Link>
            )}

            {/* Mode Switcher */}
            <ModeSwitcher />

            {/* Language Toggle */}
            <LanguageToggle />

            {/* Profile Menu */}
            <ProfileMenu onLoginClick={openLoginModal} />
          </nav>
        )}

        {/* Mobile/Tablet Menu Button */}
        {showCompactNav && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 10px',
            background: 'rgba(13,17,23,0.5)',
            borderRadius: 14,
            border: '1px solid rgba(143,211,204,0.1)',
          }}>
            {/* Mobile status dot */}
            <div style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 6px #22c55e',
              animation: 'statusPulse 2s ease-in-out infinite',
            }} />
            <ModeSwitcher />
            <LanguageToggle compact={isMobile} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="menu-btn"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              style={{
                background: isMobileMenuOpen
                  ? `linear-gradient(135deg, ${brandCyan}20, ${brandPurple}15)`
                  : 'rgba(255,255,255,0.06)',
                border: `1px solid ${isMobileMenuOpen ? brandCyan + '40' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 10,
                padding: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isMobileMenuOpen ? `0 0 15px ${brandCyan}20` : 'none',
              }}
            >
              {isMobileMenuOpen ? (
                <XIcon size={22} color={brandCyan} />
              ) : (
                <MenuIcon size={22} color="#f7f8fb" />
              )}
            </button>
          </div>
        )}
      </header>

      {/* Mobile Menu Dropdown */}
      {showCompactNav && isMobileMenuOpen && (
        <nav
          id="mobile-nav-menu"
          className="mobile-menu"
          role="navigation"
          aria-label={t('nav.mainNavigation')}
          style={{
            position: 'fixed',
            top: 75,
            left: 16,
            right: 16,
            zIndex: 99,
            background: 'linear-gradient(180deg, rgba(26,31,46,0.98) 0%, rgba(13,17,23,0.98) 100%)',
            border: `1px solid ${brandCyan}25`,
            borderRadius: 18,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            backdropFilter: 'blur(20px)',
            boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 40px ${brandCyan}08`,
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
          }}
        >
          {/* Mobile menu header bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            marginBottom: 8,
            borderBottom: `1px solid ${brandCyan}15`,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px #22c55e',
              }} />
              <span style={{
                fontSize: 10,
                fontWeight: 800,
                color: brandCyan,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>
                {t('labTech.lotusLab')} • {t('labTech.navigation')}
              </span>
            </div>
            <span style={{
              fontSize: 9,
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'monospace',
            }}>
              {t('labTech.version')}
            </span>
          </div>
          {/* Home Link */}
          <Link
            to="/"
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleHomeClick();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              fontSize: 15,
              fontWeight: 700,
              color: isActivePath('/') && location.pathname === '/' ? brandCyan : '#f7f8fb',
              textDecoration: 'none',
              borderRadius: 12,
              background: isActivePath('/') && location.pathname === '/'
                ? `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`
                : 'linear-gradient(135deg, rgba(143,211,204,0.05), rgba(175,132,186,0.05))',
              border: isActivePath('/') && location.pathname === '/'
                ? `1px solid ${brandCyan}40`
                : '1px solid rgba(255,255,255,0.08)',
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
              fontSize: 18,
            }}>
              <HomeIcon size={18} />
            </span>
            {t('nav.home')}
          </Link>

          {/* Nav Items - Sorted by visitor mode priority */}
          {visibleNavItems.filter((item) => item.id !== 'home').map((item, index) => {
            const isActive = isActivePath(item.path);
            const isPriority = item.priority?.[visitorMode] === 1;
            return (
              <Link
                key={item.id}
                to={item.path}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  fontSize: 15,
                  fontWeight: 700,
                  color: isActive ? brandCyan : isPriority ? visitorConfig.color : '#f7f8fb',
                  textDecoration: 'none',
                  borderRadius: 12,
                  background: isActive
                    ? `linear-gradient(135deg, ${brandCyan}15, ${brandPurple}10)`
                    : isPriority
                      ? `linear-gradient(135deg, ${visitorConfig.color}15, ${visitorConfig.color}08)`
                      : `linear-gradient(135deg, rgba(143,211,204,${0.05 + index * 0.01}), rgba(175,132,186,${0.05 + index * 0.01}))`,
                  border: isActive
                    ? `1px solid ${brandCyan}40`
                    : isPriority
                      ? `1px solid ${visitorConfig.color}40`
                      : '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Priority badge */}
                {isPriority && !isActive && (
                  <span style={{
                    position: 'absolute',
                    top: 6,
                    right: isArabic ? 'auto' : 6,
                    left: isArabic ? 6 : 'auto',
                    padding: '2px 6px',
                    fontSize: 9,
                    fontWeight: 800,
                    background: visitorConfig.color,
                    color: '#fff',
                    borderRadius: 4,
                  }}>
                    {t('nav.recommended')}
                  </span>
                )}
                <span style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: isActive
                    ? `linear-gradient(135deg, ${item.color || brandCyan}30, ${brandPurple}25)`
                    : isPriority
                      ? `linear-gradient(135deg, ${visitorConfig.color}30, ${visitorConfig.color}20)`
                      : `linear-gradient(135deg, ${brandCyan}22, ${brandPurple}22)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: typeof item.icon === 'string' ? 18 : 16,
                  color: isActive ? item.color : isPriority ? visitorConfig.color : undefined,
                }}>
                  {item.icon}
                </span>
                {t(item.translationKey)}
                {isActive && (
                  <span style={{
                    marginRight: isArabic ? 'auto' : 0,
                    marginLeft: isArabic ? 0 : 'auto',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: brandCyan,
                  }} />
                )}
              </Link>
            );
          })}

          {/* Role-based Dashboard Link (Mobile) */}
          {dashboardLink && (
            <Link
              to={dashboardLink.path}
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
              {t(dashboardLink.translationKey)}
            </Link>
          )}

          {/* Profile in Mobile Menu */}
          <div style={{
            marginTop: 8,
            paddingTop: 12,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
          }}>
            <ProfileMenu onLoginClick={() => {
              setIsMobileMenuOpen(false);
              openLoginModal();
            }} />
          </div>
        </nav>
      )}

      {/* Spacer for fixed header */}
      <div style={{ height: showCompactNav ? 75 : 90 }} />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
});

export default Header;
