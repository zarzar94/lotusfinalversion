/**
 * Breadcrumb - Navigation breadcrumb for better UX
 * Shows current location in the site hierarchy
 */

import { memo, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  brandCyan,
  colors,
  typography,
  spacing,
  radius,
} from '../styles';

interface BreadcrumbItem {
  label: string;
  labelAr: string;
  path: string;
  icon?: string;
}

// Route to breadcrumb mapping
const ROUTE_BREADCRUMBS: Record<string, BreadcrumbItem> = {
  '/': { label: 'Home', labelAr: 'auto.Breadcrumb.k2', path: '/', icon: '🏠' },
  '/assessment': { label: 'Assessment', labelAr: 'auto.Breadcrumb.k3', path: '/assessment', icon: '🎯' },
  '/program': { label: 'Program', labelAr: 'auto.Breadcrumb.k4', path: '/program', icon: '📋' },
  '/science': { label: 'Science', labelAr: 'auto.Breadcrumb.k5', path: '/science', icon: '🧠' },
  '/results': { label: 'Results', labelAr: 'auto.Breadcrumb.k6', path: '/results', icon: '📊' },
  '/resources': { label: 'Resources', labelAr: 'auto.Breadcrumb.k7', path: '/resources', icon: '📚' },
  '/partners': { label: 'Partners', labelAr: 'auto.Breadcrumb.k8', path: '/partners', icon: '🤝' },
  '/contact': { label: 'Contact', labelAr: 'auto.Breadcrumb.k9', path: '/contact', icon: '✉️' },
  '/school-dashboard': { label: 'School Dashboard', labelAr: 'auto.Breadcrumb.k10', path: '/school-dashboard', icon: '🏫' },
  '/parent-dashboard': { label: 'Parent Dashboard', labelAr: 'auto.Breadcrumb.k11', path: '/parent-dashboard', icon: '👨‍👩‍👧' },
  '/clinician-dashboard': { label: 'Clinician Dashboard', labelAr: 'auto.Breadcrumb.k12', path: '/clinician-dashboard', icon: '🏥' },
  '/dashboard/parent': { label: 'Parent Dashboard', labelAr: 'auto.Breadcrumb.k13', path: '/dashboard/parent' },
  '/dashboard/educator': { label: 'Educator Dashboard', labelAr: 'auto.Breadcrumb.k14', path: '/dashboard/educator' },
  '/dashboard/clinician': { label: 'Clinician Dashboard', labelAr: 'auto.Breadcrumb.k15', path: '/dashboard/clinician' },
  '/settings': { label: 'Settings', labelAr: 'auto.Breadcrumb.k16', path: '/settings', icon: '⚙️' },
};

interface BreadcrumbProps {
  showHome?: boolean;
  showIcon?: boolean;
}

function Breadcrumb({ showHome = true, showIcon = true }: BreadcrumbProps) {
  const { isArabic, t } = useLanguage();
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    const items: BreadcrumbItem[] = [];

    // Always add home if requested
    if (showHome && location.pathname !== '/') {
      items.push(ROUTE_BREADCRUMBS['/']);
    }

    // Get current page breadcrumb
    const currentBreadcrumb = ROUTE_BREADCRUMBS[location.pathname];
    if (currentBreadcrumb && location.pathname !== '/') {
      items.push(currentBreadcrumb);
    }

    // Handle dynamic routes like /function/:slug
    if (location.pathname.startsWith('/function/')) {
      const slug = location.pathname.replace('/function/', '');
      items.push({
        label: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        labelAr: slug.replace(/-/g, ' '),
        path: location.pathname,
        icon: '🧠',
      });
    }

    return items;
  }, [location.pathname, showHome]);

  // Don't render on home page or if no breadcrumbs
  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label={t('auto.Breadcrumb.k1', "Breadcrumb")}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[2],
        padding: `${spacing[3]}px 0`,
        fontSize: typography.size.sm,
        flexWrap: 'wrap',
      }}
    >
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const label = isArabic ? t(item.labelAr, item.label) : item.label;

        return (
          <span
            key={item.path}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            {index > 0 && (
              <span
                style={{
                  color: colors.text.muted,
                  transform: isArabic ? 'rotate(180deg)' : 'none',
                  display: 'inline-block',
                }}
              >
                /
              </span>
            )}

            {isLast ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing[1],
                  color: brandCyan,
                  fontWeight: typography.weight.semibold,
                  padding: `${spacing[1]}px ${spacing[2]}px`,
                  background: `${brandCyan}10`,
                  borderRadius: radius.sm,
                }}
              >
                {showIcon && item.icon && <span style={{ fontSize: 14 }}>{item.icon}</span>}
                {label}
              </span>
            ) : (
              <Link
                to={item.path}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing[1],
                  color: colors.text.secondary,
                  textDecoration: 'none',
                  padding: `${spacing[1]}px ${spacing[2]}px`,
                  borderRadius: radius.sm,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = brandCyan;
                  e.currentTarget.style.background = `${brandCyan}08`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text.secondary;
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {showIcon && item.icon && <span style={{ fontSize: 14 }}>{item.icon}</span>}
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default memo(Breadcrumb);
