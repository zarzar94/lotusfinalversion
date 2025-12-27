import { memo, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import LoginModal from '../components/auth/LoginModal';
import { colors, spacing, typography } from '../components/styles';
import { LabShell } from '../components/labui/LabShell';
import LabCard from '../components/labui/LabCard';
import LabButton from '../components/labui/LabButton';
import { LockIcon } from '../components/icons/index';

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
    <LabShell variant="primary">
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing[6],
        }}
      >
        <LabCard
          padding={spacing[6]}
          style={{
            maxWidth: 560,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: spacing[3] }}>
            <LockIcon size={32} tone="cyan" />
          </div>
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
          <LabButton onClick={() => setIsOpen(true)} style={{ marginTop: spacing[4] }}>
            {isArabic ? 'فتح تسجيل الدخول' : 'Open Sign In'}
          </LabButton>
        </LabCard>
      </div>

      <LoginModal isOpen={isOpen} onClose={handleClose} />
    </LabShell>
  );
}

export default memo(LoginPage);
