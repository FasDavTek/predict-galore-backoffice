// components/auth/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import DashboardSkeleton from '@/components/common/DashboardSkeleton';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === null) {
    // Initial state while checking auth
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) {
    // Will be redirected, so return nothing
    return null;
  }

  return children;
};

export default ProtectedRoute;