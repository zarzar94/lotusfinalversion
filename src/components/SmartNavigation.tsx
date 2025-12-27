/**
 * SmartNavigation - Intelligent navigation with recommendations and history
 * Provides personalized navigation suggestions based on user behavior
 */

import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useVisitorMode } from '../context/VisitorModeContext';
import { useGamification } from '../context/GamificationContext';
import {
  brandCyan,
  brandPurple,
  brandPink,
  brandInk,
  colors,
  typography,
  spacing,
  radius,
  shadows,
  transitions,
} from './styles';
import { renderLabIcon, MapPinIcon, SearchIcon, SparklesIcon, CalendarIcon } from './icons/index';

// Navigation item type
interface NavItem {
  id: string;
  path: string;
  icon: string;
  label: { ar: string; en: string };
  description: { ar: string; en: string };
  color: string;
  keywords: string[];
}

// All navigation items
const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    path: '/',
    icon: '🏠',
    label: { ar: 'الرئيسية', en: 'Home' },
    description: { ar: 'الصفحة الرئيسية', en: 'Landing page' },
    color: brandCyan,
    keywords: ['home', 'main', 'start', 'الرئيسية', 'البداية'],
  },
  {
    id: 'assessment',
    path: '/assessment',
    icon: '🎯',
    label: { ar: 'التقييم', en: 'Assessment' },
    description: { ar: 'تقييم ذاتي وألعاب تشخيصية', en: 'Self-assessment and diagnostic games' },
    color: 'colors.warning',
    keywords: ['test', 'check', 'evaluate', 'تقييم', 'اختبار', 'فحص'],
  },
  {
    id: 'program',
    path: '/program',
    icon: '📋',
    label: { ar: 'البرنامج', en: 'Program' },
    description: { ar: 'البرنامج العلاجي والجلسات', en: 'Treatment program and sessions' },
    color: brandPurple,
    keywords: ['treatment', 'therapy', 'program', 'علاج', 'برنامج', 'جلسات'],
  },
  {
    id: 'science',
    path: '/science',
    icon: '🧠',
    label: { ar: 'العلم', en: 'Science' },
    description: { ar: 'الأساس العلمي والأبحاث', en: 'Scientific basis and research' },
    color: brandPink,
    keywords: ['research', 'brain', 'science', 'علم', 'بحث', 'دماغ'],
  },
  {
    id: 'results',
    path: '/results',
    icon: '📊',
    label: { ar: 'النتائج', en: 'Results' },
    description: { ar: 'قصص النجاح والشهادات', en: 'Success stories and testimonials' },
    color: 'colors.success',
    keywords: ['success', 'testimonials', 'results', 'نتائج', 'نجاح', 'شهادات'],
  },
  {
    id: 'resources',
    path: '/resources',
    icon: '📚',
    label: { ar: 'الموارد', en: 'Resources' },
    description: { ar: 'فيديوهات وعروض وأسئلة شائعة', en: 'Videos, presentations, and FAQ' },
    color: 'colors.info',
    keywords: ['video', 'faq', 'resources', 'موارد', 'فيديو', 'أسئلة'],
  },
  {
    id: 'about',
    path: '/about',
    icon: '🏛️',
    label: { ar: 'من نحن', en: 'About' },
    description: { ar: 'المركز والأخصائي', en: 'The center and specialist' },
    color: brandPurple,
    keywords: ['about', 'team', 'center', 'عنا', 'المركز', 'الفريق'],
  },
  {
    id: 'contact',
    path: '/contact',
    icon: '✉️',
    label: { ar: 'تواصل', en: 'Contact' },
    description: { ar: 'تواصل معنا وابدأ رحلتك', en: 'Contact us and start your journey' },
    color: brandCyan,
    keywords: ['contact', 'whatsapp', 'message', 'تواصل', 'رسالة', 'واتساب'],
  },
];

// Smart recommendation engine
interface NavigationHistory {
  path: string;
  timestamp: number;
  timeSpent: number;
}

const STORAGE_KEY = 'lotus_nav_history';

/**
 * SmartNavigationDrawer - Slide-out navigation with recommendations
 */
const SmartNavigationDrawer = memo(() => {
  const { isArabic } = useLanguage();
  const { mode } = useVisitorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [navHistory, setNavHistory] = useState<NavigationHistory[]>([]);
  const [recommendations, setRecommendations] = useState<NavItem[]>([]);

  // Load navigation history
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setNavHistory(JSON.parse(saved));
    }
  }, []);

  // Track navigation
  useEffect(() => {
    const entry: NavigationHistory = {
      path: location.pathname,
      timestamp: Date.now(),
      timeSpent: 0,
    };

    // Update time spent on previous page
    setNavHistory((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        const lastEntry = updated[updated.length - 1];
        lastEntry.timeSpent = Date.now() - lastEntry.timestamp;
      }
      updated.push(entry);
      // Keep last 50 entries
      const trimmed = updated.slice(-50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      return trimmed;
    });
  }, [location.pathname]);

  // Generate recommendations based on history and mode
  useEffect(() => {
    const generateRecommendations = () => {
      const visited = new Set(navHistory.map((h) => h.path));
      const currentPath = location.pathname;

      // Priority order based on mode
      const modePriority: Record<string, string[]> = {
        school: ['/assessment', '/results', '/program', '/science', '/resources'],
        parent: ['/program', '/assessment', '/results', '/science', '/contact'],
        clinician: ['/science', '/program', '/results', '/assessment', '/resources'],
      };

      const priority = modePriority[mode] || modePriority.parent;

      // Find unvisited high-priority pages
      const unvisited = priority.filter((p) => !visited.has(p) && p !== currentPath);

      // Get recommendations
      const recs = unvisited
        .slice(0, 3)
        .map((path) => NAV_ITEMS.find((item) => item.path === path))
        .filter(Boolean) as NavItem[];

      // If we have less than 3, add popular pages
      if (recs.length < 3) {
        const popular = NAV_ITEMS.filter(
          (item) =>
            item.path !== currentPath &&
            !recs.find((r) => r.path === item.path)
        ).slice(0, 3 - recs.length);
        recs.push(...popular);
      }

      setRecommendations(recs);
    };

    generateRecommendations();
  }, [navHistory, location.pathname, mode]);

  // Filter items by search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return NAV_ITEMS;

    const query = searchQuery.toLowerCase();
    return NAV_ITEMS.filter(
      (item) =>
        item.label.ar.includes(query) ||
        item.label.en.toLowerCase().includes(query) ||
        item.keywords.some((k) => k.includes(query))
    );
  }, [searchQuery]);

  // Recent pages (last 5 unique)
  const recentPages = useMemo(() => {
    const seen = new Set<string>();
    const recent: NavItem[] = [];

    for (let i = navHistory.length - 1; i >= 0 && recent.length < 5; i--) {
      const path = navHistory[i].path;
      if (!seen.has(path) && path !== location.pathname) {
        const item = NAV_ITEMS.find((n) => n.path === path);
        if (item) {
          seen.add(path);
          recent.push(item);
        }
      }
    }

    return recent;
  }, [navHistory, location.pathname]);

  const handleNavigate = useCallback((path: string) => {
    setIsOpen(false);
    setSearchQuery('');
    navigate(path);
  }, [navigate]);

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          top: spacing[4],
          [isArabic ? 'left' : 'right']: spacing[4],
          width: 48,
          height: 48,
          borderRadius: radius.lg,
          background: colors.surface.overlay,
          border: `1px solid ${colors.border.emphasis}`,
          boxShadow: shadows.lg,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 40,
          transition: transitions.bounce,
        }}
        aria-label={isArabic ? 'فتح التنقل' : 'Open navigation'}
      >
        <span style={{ fontSize: 20 }}>
          <MapPinIcon size={20} tone="cyan" />
        </span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            animation: 'fadeIn 0.2s ease-out',
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          [isArabic ? 'right' : 'left']: isOpen ? 0 : -400,
          width: 380,
          maxWidth: '90vw',
          height: '100vh',
          background: colors.surface.overlay,
          borderRight: isArabic ? 'none' : `1px solid ${colors.border.default}`,
          borderLeft: isArabic ? `1px solid ${colors.border.default}` : 'none',
          boxShadow: shadows['2xl'],
          zIndex: 101,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          direction: isArabic ? 'rtl' : 'ltr',
        }}
      >
        {/* Header with search */}
        <div
          style={{
            padding: spacing[4],
            borderBottom: `1px solid ${colors.border.default}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: spacing[4],
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: typography.size.lg,
                fontWeight: typography.weight.bold,
                color: colors.text.primary,
              }}
            >
              {isArabic ? 'التنقل الذكي' : 'Smart Navigation'}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                width: 32,
                height: 32,
                borderRadius: radius.md,
                background: colors.border.default,
                border: 'none',
                color: colors.text.primary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {renderLabIcon('\u2715', { size: 12, tone: 'muted' })}
            </button>
          </div>

          {/* Search input */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'ابحث عن صفحة... (⌘K)' : 'Search pages... (⌘K)'}
              style={{
                width: '100%',
                padding: `${spacing[3]}px ${spacing[4]}px`,
                paddingRight: isArabic ? spacing[4] : spacing[10],
                paddingLeft: isArabic ? spacing[10] : spacing[4],
                background: colors.surface.input,
                border: `1px solid ${colors.border.default}`,
                borderRadius: radius.lg,
                color: colors.text.primary,
                fontSize: typography.size.sm,
                outline: 'none',
              }}
              autoFocus
            />
            <span
              style={{
                position: 'absolute',
                top: '50%',
                [isArabic ? 'left' : 'right']: spacing[3],
                transform: 'translateY(-50%)',
                fontSize: 16,
                opacity: 0.5,
              }}
            >
              <SearchIcon size={16} tone="muted" />
            </span>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: spacing[4],
          }}
        >
          {/* Recommendations section */}
          {!searchQuery && recommendations.length > 0 && (
            <div style={{ marginBottom: spacing[6] }}>
              <h3
                style={{
                  margin: 0,
                  marginBottom: spacing[3],
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color: brandCyan,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                }}
              >
                <span>
                  <SparklesIcon size={14} tone="cyan" />
                </span>
                {isArabic ? 'موصى به لك' : 'Recommended for You'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                {recommendations.map((item) => (
                  <NavButton
                    key={item.id}
                    item={item}
                    isArabic={isArabic}
                    isActive={location.pathname === item.path}
                    isRecommended
                    onClick={() => handleNavigate(item.path)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent pages */}
          {!searchQuery && recentPages.length > 0 && (
            <div style={{ marginBottom: spacing[6] }}>
              <h3
                style={{
                  margin: 0,
                  marginBottom: spacing[3],
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.bold,
                  color: colors.text.muted,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                }}
              >
                <span>
                  <CalendarIcon size={14} tone="muted" />
                </span>
                {isArabic ? 'الصفحات الأخيرة' : 'Recent Pages'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                {recentPages.map((item) => (
                  <NavButton
                    key={item.id}
                    item={item}
                    isArabic={isArabic}
                    isActive={false}
                    onClick={() => handleNavigate(item.path)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All pages or search results */}
          <div>
            <h3
              style={{
                margin: 0,
                marginBottom: spacing[3],
                fontSize: typography.size.xs,
                fontWeight: typography.weight.bold,
                color: colors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {searchQuery
                ? isArabic
                  ? `نتائج البحث (${filteredItems.length})`
                  : `Search Results (${filteredItems.length})`
                : isArabic
                  ? 'جميع الصفحات'
                  : 'All Pages'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
              {filteredItems.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  isArabic={isArabic}
                  isActive={location.pathname === item.path}
                  onClick={() => handleNavigate(item.path)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: spacing[3],
            borderTop: `1px solid ${colors.border.subtle}`,
            background: `${brandCyan}05`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[3],
              fontSize: typography.size.xs,
              color: colors.text.muted,
            }}
          >
            <span>⌘K {isArabic ? 'للفتح' : 'to open'}</span>
            <span>•</span>
            <span>ESC {isArabic ? 'للإغلاق' : 'to close'}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
});

SmartNavigationDrawer.displayName = 'SmartNavigationDrawer';

// Navigation button component
interface NavButtonProps {
  item: NavItem;
  isArabic: boolean;
  isActive: boolean;
  isRecommended?: boolean;
  onClick: () => void;
}

const NavButton = memo(({ item, isArabic, isActive, isRecommended, onClick }: NavButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: spacing[3],
        padding: spacing[3],
        background: isActive
          ? `${item.color}20`
          : isHovered
            ? colors.surface.card
            : 'transparent',
        border: isActive
          ? `1px solid ${item.color}40`
          : isRecommended
            ? `1px solid ${brandCyan}30`
            : `1px solid transparent`,
        borderRadius: radius.lg,
        cursor: 'pointer',
        textAlign: isArabic ? 'right' : 'left',
        transition: transitions.fast,
        position: 'relative',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.md,
          background: `${item.color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
        {renderLabIcon(item.icon, { size: 20, style: { color: item.color } })}
    </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: typography.size.sm,
            fontWeight: isActive ? typography.weight.bold : typography.weight.medium,
            color: isActive ? item.color : colors.text.primary,
            marginBottom: 2,
          }}
        >
          {isArabic ? item.label.ar : item.label.en}
        </div>
        <div
          style={{
            fontSize: typography.size.xs,
            color: colors.text.muted,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {isArabic ? item.description.ar : item.description.en}
        </div>
      </div>

      {/* Recommended badge */}
      {isRecommended && !isActive && (
        <span
          style={{
            padding: `${spacing[0.5]}px ${spacing[2]}px`,
            background: `${brandCyan}20`,
            borderRadius: radius.full,
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            color: brandCyan,
          }}
        >
          {isArabic ? 'موصى' : 'Suggested'}
        </span>
      )}

      {/* Active indicator */}
      {isActive && (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: item.color,
            boxShadow: `0 0 8px ${item.color}`,
          }}
        />
      )}
    </button>
  );
});

NavButton.displayName = 'NavButton';

/**
 * BreadcrumbNav - Contextual breadcrumb navigation
 */
export const BreadcrumbNav = memo(() => {
  const { isArabic } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Build breadcrumb path
  const breadcrumbs = useMemo(() => {
    const paths = location.pathname.split('/').filter(Boolean);
    const crumbs = [{ path: '/', label: isArabic ? 'الرئيسية' : 'Home' }];

    let currentPath = '';
    for (const segment of paths) {
      currentPath += `/${segment}`;
      const item = NAV_ITEMS.find((n) => n.path === currentPath);
      if (item) {
        crumbs.push({
          path: currentPath,
          label: isArabic ? item.label.ar : item.label.en,
        });
      }
    }

    return crumbs;
  }, [location.pathname, isArabic]);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[2],
        padding: `${spacing[2]}px ${spacing[4]}px`,
        fontSize: typography.size.sm,
        direction: isArabic ? 'rtl' : 'ltr',
      }}
      aria-label="Breadcrumb"
    >
      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.path} style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          {index > 0 && (
            <span style={{ color: colors.text.muted }}>{isArabic ? '←' : '→'}</span>
          )}
          {index === breadcrumbs.length - 1 ? (
            <span style={{ color: brandCyan, fontWeight: typography.weight.medium }}>
              {crumb.label}
            </span>
          ) : (
            <button
              onClick={() => navigate(crumb.path)}
              style={{
                background: 'none',
                border: 'none',
                color: colors.text.muted,
                cursor: 'pointer',
                padding: 0,
                fontSize: 'inherit',
              }}
            >
              {crumb.label}
            </button>
          )}
        </span>
      ))}
    </nav>
  );
});

BreadcrumbNav.displayName = 'BreadcrumbNav';

/**
 * ContinueWhereYouLeftOff - Smart continuation prompt
 */
export const ContinueWhereYouLeftOff = memo(() => {
  const { isArabic } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [lastPage, setLastPage] = useState<NavItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on home page
    if (location.pathname !== '/') {
      setIsVisible(false);
      return;
    }

    // Get last visited page
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const history: NavigationHistory[] = JSON.parse(saved);
      // Find the last page that isn't home
      for (let i = history.length - 1; i >= 0; i--) {
        if (history[i].path !== '/') {
          const item = NAV_ITEMS.find((n) => n.path === history[i].path);
          if (item) {
            setLastPage(item);
            // Show after a delay
            setTimeout(() => setIsVisible(true), 2000);
            break;
          }
        }
      }
    }
  }, [location.pathname]);

  if (!isVisible || !lastPage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: spacing[6],
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 400,
        width: 'calc(100% - 32px)',
        padding: spacing[4],
        background: colors.surface.overlay,
        borderRadius: radius.xl,
        border: `1px solid ${lastPage.color}30`,
        boxShadow: `${shadows.xl}, 0 0 40px ${lastPage.color}10`,
        zIndex: 45,
        animation: 'continueSlide 0.5s ease-out',
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      {/* Dismiss */}
      <button
        onClick={() => setIsVisible(false)}
        style={{
          position: 'absolute',
          top: spacing[2],
          [isArabic ? 'left' : 'right']: spacing[2],
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'transparent',
          border: 'none',
          color: colors.text.muted,
          cursor: 'pointer',
        }}
      >
        {renderLabIcon('\u2715', { size: 12, tone: 'muted' })}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.lg,
            background: `${lastPage.color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            flexShrink: 0,
          }}
        >
          {renderLabIcon(lastPage.icon, { size: 24, style: { color: lastPage.color } })}
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: 0,
              fontSize: typography.size.xs,
              color: colors.text.muted,
              marginBottom: 4,
            }}
          >
            {isArabic ? 'تابع من حيث توقفت' : 'Continue where you left off'}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: typography.size.base,
              fontWeight: typography.weight.bold,
              color: colors.text.primary,
            }}
          >
            {isArabic ? lastPage.label.ar : lastPage.label.en}
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          setIsVisible(false);
          navigate(lastPage.path);
        }}
        style={{
          width: '100%',
          marginTop: spacing[3],
          padding: `${spacing[3]}px`,
          background: `linear-gradient(135deg, ${lastPage.color}, ${brandPurple})`,
          border: 'none',
          borderRadius: radius.lg,
          color: 'white',
          fontSize: typography.size.sm,
          fontWeight: typography.weight.bold,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[2],
        }}
      >
        <span>{isArabic ? 'متابعة' : 'Continue'}</span>
        <span>{isArabic ? '←' : '→'}</span>
      </button>

      <style>{`
        @keyframes continueSlide {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
});

ContinueWhereYouLeftOff.displayName = 'ContinueWhereYouLeftOff';

export default SmartNavigationDrawer;
