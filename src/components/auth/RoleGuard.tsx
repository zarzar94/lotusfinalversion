import { memo, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useUser, type UserRole } from '../../context/UserContext';
import { AccessDenied } from './RequirePermission';

type RoleGuardProps = {
  allowedRoles: UserRole[];
  children: ReactNode;
};

function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, isAuthenticated } = useUser();
  const location = useLocation();

  if (!isAuthenticated) {
    const next = `${location.pathname}${location.search}`;
    const params = new URLSearchParams({ next });
    return <Navigate to={`/login?${params.toString()}`} replace />;
  }

  const role = user?.role ?? 'guest';
  if (role === 'super_admin' || allowedRoles.includes(role)) return <>{children}</>;

  return <AccessDenied isAuthenticated={isAuthenticated} />;
}

export default memo(RoleGuard);
