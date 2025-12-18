import { useMemo, useState, useEffect, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { brandPurple, brandCyan, brandPink, colors, radius, spacing, typography, transitions } from './styles';
import { MenuIcon, XIcon, BrainIcon, HeadphonesIcon, GamepadIcon, PhoneIcon, HelpIcon } from './Icons';
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
// NAVIGATION ITEMS - Multi-page structure
// ═══════════════════════════════════════════════════════════════════════════

interface NavItem {
  id: string;
  label: string;
  labelAr: string;
  path: string;
  icon: React.ReactNode;
  color?: string;
  priority?: Record<VisitorMode, number>; // Priority per visitor mode (lower = higher priority)
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'assessment',
    label: 'Assessment',
    labelAr: 'التقييم',
    path: '/assessment',
    icon: <BrainIcon size={16} />,
    color: brandCyan,
    priority: { school: 1, parent: 2, clinician: 2 }, // Schools: assessment first
  },
  {
    id: 'program',
    label: 'Program',
    labelAr: 'البرنامج',
    path: '/program',
    icon: <HeadphonesIcon size={16} />,
    color: brandPurple,
    priority: { school: 3, parent: 1, clinician: 3 }, // Parents: learn about program first
  },
  {
    id: 'science',
    label: 'Science',
    labelAr: 'العلوم',
    path: '/science',
    icon: '🧠',
    color: brandPink,
    priority: { school: 5, parent: 5, clinician: 1 }, // Clinicians: science/evidence first
  },
  {
    id: 'results',
    label: 'Results',
    labelAr: 'النتائج',
    path: '/results',
    icon: '📊',
    color: '#22c55e',
    priority: { school: 2, parent: 3, clinician: 4 }, // Schools & Parents: want to see results
  },
  {
    id: 'resources',
    label: 'Resources',
    labelAr: 'الموارد',
    path: '/resources',
    icon: <HelpIcon size={16} />,
    color: '#f59e0b',
    priority: { school: 4, parent: 4, clinician: 5 },
  },
  {
    id: 'about',
    label: 'About',
    labelAr: 'من نحن',
    path: '/about',
    icon: '🏛️',
    color: brandPurple,
    priority: { school: 6, parent: 6, clinician: 6 },
  },
  {
    id: 'contact',
    label: 'Contact',
    labelAr: 'تواصل',
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Get sorted nav items based on visitor mode
  const sortedNavItems = useMemo(() => getSortedNavItems(visitorMode), [visitorMode]);

  // Check if current path matches nav item
  const isActivePath = useCallback((path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  // Role-based dashboard link
  const dashboardLink = useMemo(() => {
    if (!isAuthenticated || !user) return null;
    if (hasPermission('view_child_reports')) {
      return { path: '/parent-dashboard', label: isArabic ? 'لوحة الأطفال' : 'Children', icon: '👨‍👩‍👧' };
    }
    if (hasPermission('view_patient_reports')) {
      return { path: '/clinician-dashboard', label: isArabic ? 'المرضى' : 'Patients', icon: '🏥' };
    }
    if (hasPermission('school_analytics')) {
      return { path: '/school-dashboard', label: isArabic ? 'المدرسة' : 'School', icon: '📊' };
    }
    return null;
  }, [isAuthenticated, user, hasPermission, isArabic]);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

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
      .nav-link.active::after {
        width: 80%;
      }
      .nav-link.active {
        color: ${brandCyan};
        background: rgba(143,211,204,0.1);
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

  const showCompactNav = isMobile || isTablet;

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
        <Link to="/" style={{ textDecoration: 'none', transition: 'all 0.3s ease' }}>
          <BrainLogo
            size={isScrolled ? 45 : 55}
            textSize={isScrolled ? 20 : 24}
            showText={!showCompactNav}
          />
        </Link>

        {/* Desktop Navigation */}
        {!showCompactNav && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {sortedNavItems.map((item, index) => {
              const isActive = isActivePath(item.path);
              const isPriority = item.priority?.[visitorMode] === 1; // Top priority for current mode
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
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
                      ? 'rgba(143,211,204,0.1)'
                      : isPriority
                        ? `${visitorConfig.color}10`
                        : 'rgba(255,255,255,0.04)',
                    border: isActive
                      ? `1px solid ${brandCyan}30`
                      : isPriority
                        ? `1px solid ${visitorConfig.color}30`
                        : '1px solid transparent',
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
                  <span style={{ fontSize: 14 }}>
                    {typeof item.icon === 'string' ? item.icon : item.icon}
                  </span>
                  {isArabic ? item.labelAr : item.label}
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
                {dashboardLink.label}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ModeSwitcher />
            <LanguageToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="menu-btn"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isArabic ? (isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة') : (isMobileMenuOpen ? 'Close menu' : 'Open menu')}
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
          </div>
        )}
      </header>

      {/* Mobile Menu Dropdown */}
      {showCompactNav && isMobileMenuOpen && (
        <nav
          id="mobile-nav-menu"
          className="mobile-menu"
          role="navigation"
          aria-label={isArabic ? 'القائمة الرئيسية' : 'Main navigation'}
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
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
          }}
        >
          {/* Home Link */}
          <Link
            to="/"
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
              🏠
            </span>
            {isArabic ? 'الرئيسية' : 'Home'}
          </Link>

          {/* Nav Items - Sorted by visitor mode priority */}
          {sortedNavItems.map((item, index) => {
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
                    {isArabic ? 'موصى' : 'Top'}
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
                {isArabic ? item.labelAr : item.label}
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
              {dashboardLink.label}
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
