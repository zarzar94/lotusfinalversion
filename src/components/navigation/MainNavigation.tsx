import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface NavItem {
  id: string;
  label: { en: string; ar: string };
  icon: string;
  path: string;
  children?: NavItem[];
  badge?: string;
  isNew?: boolean;
}

interface UserInfo {
  name: string;
  role: 'guest' | 'patient' | 'parent' | 'clinician' | 'admin';
  avatar?: string;
}

type NavigationView = 'home' | 'services' | 'about' | 'assessment' | 'treatment' | 'booking' | 'dashboard' | 'contact';

interface MainNavigationProps {
  currentView: NavigationView;
  onNavigate: (view: NavigationView) => void;
  user?: UserInfo;
  onLogin?: () => void;
  onLogout?: () => void;
  onLanguageToggle?: () => void;
}

// =============================================================================
// DESIGN TOKENS
// =============================================================================

const brand = {
  cyan: '#00D4FF',
  cyanDark: '#00A8CC',
  purple: '#8B5CF6',
  purpleDark: '#7C3AED',
  coral: '#FF6B6B',
  success: '#10B981',
  warning: '#F59E0B',
  dark: '#0A0A0F',
  darkLight: '#1a1a2e',
  card: 'rgba(255,255,255,0.03)',
  cardHover: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.08)',
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.7)',
    muted: 'rgba(255,255,255,0.5)',
  },
};

const styles = {
  nav: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: `${brand.dark}F0`,
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${brand.border}`,
    fontFamily: 'Cairo, sans-serif',
  } as React.CSSProperties,
  navScrolled: {
    boxShadow: `0 4px 30px rgba(0, 0, 0, 0.3)`,
  } as React.CSSProperties,
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '72px',
  } as React.CSSProperties,
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
  } as React.CSSProperties,
  logoIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${brand.cyan} 0%, ${brand.purple} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    boxShadow: `0 4px 15px ${brand.cyan}30`,
  } as React.CSSProperties,
  logoText: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0',
  } as React.CSSProperties,
  logoTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: brand.text.primary,
    lineHeight: 1.2,
    background: `linear-gradient(135deg, ${brand.text.primary} 0%, ${brand.cyan} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  } as React.CSSProperties,
  logoSubtitle: {
    fontSize: '0.7rem',
    color: brand.text.muted,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  } as React.CSSProperties,
  navLink: (isActive: boolean, isHovered: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1rem',
    borderRadius: '10px',
    background: isActive
      ? `linear-gradient(135deg, ${brand.cyan}20 0%, ${brand.purple}20 100%)`
      : isHovered
        ? brand.cardHover
        : 'transparent',
    border: isActive ? `1px solid ${brand.cyan}40` : '1px solid transparent',
    color: isActive ? brand.cyan : brand.text.secondary,
    fontSize: '0.9rem',
    fontWeight: isActive ? 600 : 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    textDecoration: 'none',
  } as React.CSSProperties),
  navIcon: {
    fontSize: '1rem',
  } as React.CSSProperties,
  badge: {
    position: 'absolute' as const,
    top: '-4px',
    right: '-4px',
    padding: '0.15rem 0.4rem',
    background: brand.coral,
    borderRadius: '6px',
    fontSize: '0.65rem',
    fontWeight: 600,
    color: brand.text.primary,
  } as React.CSSProperties,
  newBadge: {
    padding: '0.15rem 0.35rem',
    background: brand.success,
    borderRadius: '6px',
    fontSize: '0.65rem',
    fontWeight: 600,
    color: brand.text.primary,
    marginLeft: '0.5rem',
  } as React.CSSProperties,
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  } as React.CSSProperties,
  langToggle: {
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    background: brand.card,
    border: `1px solid ${brand.border}`,
    color: brand.text.secondary,
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.4rem 0.75rem 0.4rem 0.4rem',
    borderRadius: '12px',
    background: brand.card,
    border: `1px solid ${brand.border}`,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: `linear-gradient(135deg, ${brand.purple}50 0%, ${brand.cyan}50 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
  } as React.CSSProperties,
  userName: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: brand.text.primary,
  } as React.CSSProperties,
  loginButton: {
    padding: '0.6rem 1.25rem',
    borderRadius: '10px',
    border: 'none',
    background: `linear-gradient(135deg, ${brand.cyan} 0%, ${brand.purple} 100%)`,
    color: brand.text.primary,
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  } as React.CSSProperties,
  ctaButton: {
    padding: '0.6rem 1.25rem',
    borderRadius: '10px',
    border: 'none',
    background: `linear-gradient(135deg, ${brand.coral} 0%, ${brand.purple} 100%)`,
    color: brand.text.primary,
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: `0 4px 15px ${brand.coral}30`,
  } as React.CSSProperties,
  mobileMenuButton: {
    display: 'none',
    padding: '0.5rem',
    borderRadius: '10px',
    background: brand.card,
    border: `1px solid ${brand.border}`,
    color: brand.text.primary,
    fontSize: '1.25rem',
    cursor: 'pointer',
    '@media (max-width: 1024px)': {
      display: 'flex',
    },
  } as React.CSSProperties,
  mobileMenu: (isOpen: boolean) => ({
    position: 'fixed' as const,
    top: '72px',
    left: 0,
    right: 0,
    bottom: 0,
    background: brand.dark,
    padding: '1.5rem',
    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease',
    overflowY: 'auto' as const,
    zIndex: 999,
  } as React.CSSProperties),
  mobileNavLinks: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  } as React.CSSProperties,
  mobileNavLink: (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.25rem',
    borderRadius: '14px',
    background: isActive
      ? `linear-gradient(135deg, ${brand.cyan}20 0%, ${brand.purple}20 100%)`
      : brand.card,
    border: `1px solid ${isActive ? brand.cyan : brand.border}`,
    color: isActive ? brand.cyan : brand.text.primary,
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as React.CSSProperties),
  mobileNavIcon: {
    fontSize: '1.25rem',
    width: '28px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  mobileDivider: {
    height: '1px',
    background: brand.border,
    margin: '1rem 0',
  } as React.CSSProperties,
  mobileBottomSection: {
    marginTop: 'auto',
    paddingTop: '2rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  } as React.CSSProperties,
  dropdownMenu: (isOpen: boolean) => ({
    position: 'absolute' as const,
    top: '100%',
    right: 0,
    marginTop: '0.5rem',
    minWidth: '200px',
    background: brand.darkLight,
    border: `1px solid ${brand.border}`,
    borderRadius: '14px',
    padding: '0.5rem',
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' as const : 'hidden' as const,
    transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
    transition: 'all 0.2s ease',
    boxShadow: `0 10px 40px rgba(0, 0, 0, 0.3)`,
    zIndex: 100,
  } as React.CSSProperties),
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    color: brand.text.secondary,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
};

// =============================================================================
// NAVIGATION DATA
// =============================================================================

const navItems: NavItem[] = [
  {
    id: 'home',
    label: { en: 'Home', ar: 'الرئيسية' },
    icon: '🏠',
    path: '/',
  },
  {
    id: 'services',
    label: { en: 'Services', ar: 'الخدمات' },
    icon: '🎧',
    path: '/services',
    children: [
      { id: 'assessment', label: { en: 'Assessment', ar: 'التقييم' }, icon: '📋', path: '/assessment' },
      { id: 'treatment', label: { en: 'Treatment', ar: 'العلاج' }, icon: '🔊', path: '/treatment' },
      { id: 'soundlab', label: { en: 'Sound Lab', ar: 'مختبر الصوت' }, icon: '🎛️', path: '/soundlab', isNew: true },
    ],
  },
  {
    id: 'about',
    label: { en: 'About Us', ar: 'من نحن' },
    icon: '💜',
    path: '/about',
  },
  {
    id: 'booking',
    label: { en: 'Book Now', ar: 'احجز الآن' },
    icon: '📅',
    path: '/booking',
  },
  {
    id: 'dashboard',
    label: { en: 'Dashboard', ar: 'لوحة التحكم' },
    icon: '📊',
    path: '/dashboard',
  },
  {
    id: 'contact',
    label: { en: 'Contact', ar: 'تواصل معنا' },
    icon: '💬',
    path: '/contact',
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const MainNavigation: React.FC<MainNavigationProps> = ({
  currentView,
  onNavigate,
  user,
  onLogin,
  onLogout,
  onLanguageToggle,
}) => {
  const { isArabic } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentView]);

  // ---------------------------------------------------------------------------
  // TRANSLATIONS
  // ---------------------------------------------------------------------------

  const t = useMemo(() => ({
    logo: {
      title: isArabic ? 'لوتس ساوند لاب' : 'Lotus Sound Lab',
      subtitle: isArabic ? 'تدريب بيرارد السمعي' : 'Bérard AIT',
    },
    login: isArabic ? 'تسجيل الدخول' : 'Sign In',
    book: isArabic ? 'احجز الآن' : 'Book Now',
    lang: isArabic ? 'EN' : 'عربي',
    userMenu: {
      dashboard: isArabic ? 'لوحة التحكم' : 'Dashboard',
      profile: isArabic ? 'الملف الشخصي' : 'Profile',
      settings: isArabic ? 'الإعدادات' : 'Settings',
      logout: isArabic ? 'تسجيل الخروج' : 'Sign Out',
    },
    new: isArabic ? 'جديد' : 'NEW',
  }), [isArabic]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleNavigate = useCallback((id: string) => {
    onNavigate(id as NavigationView);
  }, [onNavigate]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const handleHover = useCallback((id: string | null) => {
    setHoveredItem(id);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen(prev => !prev);
  }, []);

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  const renderNavLink = (item: NavItem) => {
    const isActive = currentView === item.id;
    const isHovered = hoveredItem === item.id;

    return (
      <div
        key={item.id}
        style={styles.navLink(isActive, isHovered)}
        onClick={() => handleNavigate(item.id)}
        onMouseEnter={() => handleHover(item.id)}
        onMouseLeave={() => handleHover(null)}
      >
        <span style={styles.navIcon}>{item.icon}</span>
        <span>{isArabic ? item.label.ar : item.label.en}</span>
        {item.isNew && <span style={styles.newBadge}>{t.new}</span>}
        {item.badge && <span style={styles.badge}>{item.badge}</span>}
      </div>
    );
  };

  const renderMobileNavLink = (item: NavItem) => {
    const isActive = currentView === item.id;

    return (
      <div
        key={item.id}
        style={styles.mobileNavLink(isActive)}
        onClick={() => handleNavigate(item.id)}
      >
        <span style={styles.mobileNavIcon}>{item.icon}</span>
        <span>{isArabic ? item.label.ar : item.label.en}</span>
        {item.isNew && <span style={styles.newBadge}>{t.new}</span>}
      </div>
    );
  };

  return (
    <>
      <nav
        style={{
          ...styles.nav,
          ...(isScrolled ? styles.navScrolled : {}),
        }}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <div style={styles.container}>
          {/* Logo */}
          <div style={styles.logoSection} onClick={() => handleNavigate('home')}>
            <div style={styles.logoIcon}>🎧</div>
            <div style={styles.logoText}>
              <span style={styles.logoTitle}>{t.logo.title}</span>
              <span style={styles.logoSubtitle}>{t.logo.subtitle}</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {!isMobile && (
            <div style={styles.navLinks}>
              {navItems.slice(0, -1).map(renderNavLink)}
            </div>
          )}

          {/* Right Section */}
          <div style={styles.rightSection}>
            {/* Language Toggle */}
            <button
              style={styles.langToggle}
              onClick={onLanguageToggle}
            >
              {t.lang}
            </button>

            {/* Book CTA (Desktop) */}
            {!isMobile && (
              <button
                style={styles.ctaButton}
                onClick={() => handleNavigate('booking')}
              >
                📅 {t.book}
              </button>
            )}

            {/* User Section */}
            {user ? (
              <div
                style={{ position: 'relative' }}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div style={styles.userSection} onClick={toggleUserMenu}>
                  <div style={styles.userAvatar}>
                    {user.avatar || user.name.charAt(0)}
                  </div>
                  {!isMobile && <span style={styles.userName}>{user.name}</span>}
                </div>

                {/* User Dropdown */}
                <div style={styles.dropdownMenu(isUserMenuOpen)}>
                  <div
                    style={styles.dropdownItem}
                    onClick={() => handleNavigate('dashboard')}
                  >
                    <span>📊</span> {t.userMenu.dashboard}
                  </div>
                  <div style={styles.dropdownItem}>
                    <span>👤</span> {t.userMenu.profile}
                  </div>
                  <div style={styles.dropdownItem}>
                    <span>⚙️</span> {t.userMenu.settings}
                  </div>
                  <div style={styles.mobileDivider} />
                  <div
                    style={{ ...styles.dropdownItem, color: brand.coral }}
                    onClick={onLogout}
                  >
                    <span>🚪</span> {t.userMenu.logout}
                  </div>
                </div>
              </div>
            ) : (
              !isMobile && (
                <button style={styles.loginButton} onClick={onLogin}>
                  👤 {t.login}
                </button>
              )
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                style={{ ...styles.mobileMenuButton, display: 'flex' }}
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? '✕' : '☰'}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobile && (
        <div style={styles.mobileMenu(isMobileMenuOpen)}>
          <div style={styles.mobileNavLinks}>
            {navItems.map(renderMobileNavLink)}
          </div>

          <div style={styles.mobileDivider} />

          <div style={styles.mobileBottomSection}>
            {!user && (
              <button style={styles.loginButton} onClick={onLogin}>
                👤 {t.login}
              </button>
            )}
            <button
              style={styles.ctaButton}
              onClick={() => handleNavigate('booking')}
            >
              📅 {t.book}
            </button>
          </div>
        </div>
      )}

      {/* Spacer for fixed nav */}
      <div style={{ height: '72px' }} />
    </>
  );
};

export default MainNavigation;
