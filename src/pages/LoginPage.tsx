import { memo, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import LoginModal from '../components/auth/LoginModal';
import { brandCyan, brandPurple, colors, radius, spacing, typography } from '../components/styles';

function LoginPage() {
  const { isArabic } = useLanguage();
  const { isAuthenticated } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const nextPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const next = params.get('next');
    if (next && next.startsWith('/')) return next;
    return '/';
  }, [location.search]);

  useEffect(() => {
    if (!isAuthenticated) return;
    navigate(nextPath, { replace: true });
  }, [isAuthenticated, navigate, nextPath]);

  const handleClose = () => {
    setIsOpen(false);
    navigate('/', { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[6],
        background: 'radial-gradient(circle at top, rgba(143,211,204,0.08), transparent 55%)',
      }}
    >
      <div
        style={{
          maxWidth: 560,
          width: '100%',
          background: colors.surface.card,
          borderRadius: radius.xl,
          border: `1px solid ${colors.border.default}`,
          padding: spacing[6],
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: spacing[3] }}>🔐</div>
        <div
          style={{
            fontSize: typography.size['2xl'],
            fontWeight: typography.weight.black,
            color: colors.text.primary,
          }}
        >
          {isArabic ? 'تسجيل الدخول' : 'Sign In'}
        </div>
        <p style={{ marginTop: spacing[2], color: colors.text.secondary }}>
          {isArabic
            ? 'سجّل الدخول للوصول إلى لوحات القياس والبيانات.'
            : 'Sign in to access dashboards and reports.'}
        </p>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            marginTop: spacing[4],
            padding: '12px 18px',
            borderRadius: radius.full,
            border: 'none',
            background: `linear-gradient(135deg, ${brandCyan}, ${brandPurple})`,
            color: '#05060d',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          {isArabic ? 'فتح تسجيل الدخول' : 'Open Sign In'}
        </button>
      </div>

      <LoginModal isOpen={isOpen} onClose={handleClose} />
    </div>
  );
}

export default memo(LoginPage);
