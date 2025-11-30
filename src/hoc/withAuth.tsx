// src/hoc/withAuth.tsx
"use client";

import { useEffect, useState, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { CircularProgress, Box, Typography } from '@mui/material';

/**
 * HOC to protect pages that require authentication
 * Redirects to login if no token is found
 */
const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    
    // Get auth state from Redux
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
      const checkAuth = async () => {
        // Check if we're on client side
        if (typeof window === 'undefined') {
          setIsChecking(false);
          return;
        }

        // Check for token in both Redux state and localStorage as fallback
        const localToken = localStorage.getItem('authToken');
        const hasToken = token || localToken;

        if (!hasToken) {
          // No token found, redirect to login
          console.warn('No authentication token found, redirecting to login...');
          router.replace('/login');
          return;
        }

        // Token exists, allow access
        setIsChecking(false);
      };

      checkAuth();
    }, [token, router]); // Removed unnecessary dependencies

    // Show loading spinner while checking authentication
    if (isChecking) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Checking authentication...
          </Typography>
        </Box>
      );
    }

    // If we have a token (or we're still checking but have localStorage token as fallback)
    const localToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token && !localToken) {
      // This should not happen due to the redirect above, but as a safety net
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 2,
          }}
        >
          <Typography variant="h6" color="error">
            Authentication required
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Redirecting to login...
          </Typography>
        </Box>
      );
    }

    // User is authenticated, render the wrapped component
    return <WrappedComponent {...props} />;
  };

  // Add display name for better debugging
  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;