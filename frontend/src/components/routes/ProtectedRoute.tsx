import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useUser } from '../../context/UserContext';

type ProtectedRouteProps = {
  variant: 'dashboard' | 'onboarding';
  children: ReactNode;
};

export function ProtectedRoute({ variant, children }: ProtectedRouteProps) {
  const { userData } = useUser();
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  if (variant === 'dashboard') {
    if (!token) {
      return <Navigate to="/" replace />;
    }
    if (!userData.isProfileComplete) {
      return <Navigate to="/onboarding" replace />;
    }
    return <>{children}</>;
  }

  if (variant === 'onboarding') {
    if (userData.isProfileComplete) {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  }

  return <>{children}</>;
}
