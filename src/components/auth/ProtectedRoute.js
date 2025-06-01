import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import DashboardSkeleton from '@/components/common/DashboardSkeleton';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showAuthMessage, setShowAuthMessage] = useState(false);

  useEffect(() => {
    if (isAuthenticated === false) {
      setShowSkeleton(true);
      setShowAuthMessage(true);
      const timer = setTimeout(() => {
        if (!isAuthenticated) {
          router.replace(`/auth/login?redirect=${encodeURIComponent(router.asPath)}`);
        }
      }, 3000);
      return () => clearTimeout(timer);
    } else if (!isAuthenticated) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [isAuthenticated, router]);

  if (showSkeleton || isAuthenticated === false) {
    return <DashboardSkeleton showAuthMessage={showAuthMessage} />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectedRoute;