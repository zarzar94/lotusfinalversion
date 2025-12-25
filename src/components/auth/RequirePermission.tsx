import { memo, type ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';

import { useLanguage } from '../../context/LanguageContext';
import { useUser, type Permission } from '../../context/UserContext';
import { brandCyan, brandPurple, colors, radius, spacing, typography } from '../styles';

type RequirePermissionProps = {
  permission: Permission;
  children: ReactNode;
};

type AccessDeniedProps = {
  isAuthenticated: boolean;
};

export function AccessDenied({ isAuthenticated }: AccessDeniedProps) {
  const { t, isArabic } = useLanguage();
  const title = isAuthenticated
    ? t('auth.accessRestrictedTitle', 'Access restricted')
    : t('auth.signInRequiredTitle', 'Sign in required');
  const message = isAuthenticated
    ? t('auth.accessRestrictedBody', 'Your account does not have permission to view this page.')
    : t('auth.signInRequiredBody', 'Please sign in with an authorized account to continue.');

  return (
    <main
      style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: spacing[6],
        direction: isArabic ? 'rtl' : 'ltr',
        textAlign: isArabic ? 'right' : 'left',
      }}
    >
      <section
        style={{
          background: colors.surface.card,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radius.xl,
          padding: spacing[6],
        }}
      >
        <div style={{ fontSize: typography.size['2xl'], fontWeight: typography.weight.black, color: colors.text.primary }}>
          {title}
        </div>
        <p style={{ marginTop: spacing[2], color: colors.text.secondary, lineHeight: typography.lineHeight.relaxed }}>
          {message}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[3], marginTop: spacing[4] }}>
          <Link
            to="/"
            style={{
              padding: '10px 16px',
              borderRadius: radius.full,
              background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
              color: '#05060d',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            {t('common.goHome', 'Go Home')}
          </Link>
          <Link
            to="/contact"
            style={{
              padding: '10px 16px',
              borderRadius: radius.full,
              border: `1px solid ${colors.border.default}`,
              color: colors.text.primary,
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            {t('common.contactUs', 'Contact Us')}
          </Link>
        </div>
      </section>
    </main>
  );
}

function RequirePermission({ permission, children }: RequirePermissionProps) {
  const { hasPermission, isAuthenticated } = useUser();
  const location = useLocation();

  if (hasPermission(permission)) return <>{children}</>;
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <AccessDenied isAuthenticated={isAuthenticated} />;
}

export default memo(RequirePermission);
