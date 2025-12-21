import { memo, type ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useUser } from '../../context/UserContext';

type RequireAuthProps = {
  children?: ReactNode;
};

function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated } = useUser();
  const location = useLocation();

  if (!isAuthenticated) {
    const next = `${location.pathname}${location.search}`;
    const params = new URLSearchParams({ next });
    return <Navigate to={`/login?${params.toString()}`} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default memo(RequireAuth);
