// src/hoc/withAuth.tsx
"use client";

import { useEffect, useState, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '../app/(auth)/features/slices/authSlice';
import { CircularProgress, Box, Typography } from '@mui/material';

/**
 * HOC to protect pages that require authentication
 * Redirects to login if no token is found
 * Uses sessionStorage for token persistence (cleared on browser close)
 */
const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const dispatch = useDispatch();
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

        // Check for token in both Redux state and sessionStorage
        const sessionToken = sessionStorage.getItem('authToken');
        const hasToken = token || sessionToken;

        if (!hasToken) {
          // No token found, redirect to login
          console.warn('No authentication token found, redirecting to login...');
          
          // Clear any stale auth data
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('userData');
          sessionStorage.removeItem('tokenExpiry');
          localStorage.removeItem('authToken'); // Clean up localStorage if exists
          localStorage.removeItem('userData');
          localStorage.removeItem('tokenExpiry');
          
          // Dispatch logout to clear Redux state
          dispatch(logout());
          
          router.replace('/login');
          return;
        }

        // Optional: Check if token is expired
        const tokenExpiry = sessionStorage.getItem('tokenExpiry');
        if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
          console.warn('Token expired, redirecting to login...');
          
          // Clear expired token and logout
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('userData');
          sessionStorage.removeItem('tokenExpiry');
          dispatch(logout());
          
          router.replace('/login');
          return;
        }

        // Optional: Validate token structure (basic check)
        if (sessionToken && sessionToken.length < 10) {
          console.warn('Invalid token format, redirecting to login...');
          
          // Clear invalid token
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('userData');
          sessionStorage.removeItem('tokenExpiry');
          dispatch(logout());
          
          router.replace('/login');
          return;
        }

        // If we have a session token but no Redux token, restore Redux state
        if (sessionToken && !token) {
          try {
            const userData = sessionStorage.getItem('userData');
            if (userData) {
              // Dispatch an action to restore auth state if you have one
              // Example: dispatch(setAuth({ token: sessionToken, user: JSON.parse(userData) }));
              console.log('Restoring auth state from sessionStorage...');
            }
          } catch (error) {
            console.error('Failed to restore auth state:', error);
          }
        }

        // Token exists and is valid, allow access
        setIsChecking(false);
      };

      checkAuth();

      // Optional: Listen for storage changes to sync between tabs
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'authToken' && !event.newValue) {
          // Token was cleared in another tab
          console.log('Auth token cleared in another tab, logging out...');
          dispatch(logout());
          router.replace('/login');
        }
      };

      // Optional: Listen for beforeunload to clean up on tab close
      const handleBeforeUnload = () => {
        // sessionStorage will be automatically cleared on tab close
        // You can add additional cleanup here if needed
      };

      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('beforeunload', handleBeforeUnload);

      // Cleanup
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, [token, router, dispatch]);

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

    // Final check before rendering
    const sessionToken = typeof window !== 'undefined' ? sessionStorage.getItem('authToken') : null;
    if (!token && !sessionToken) {
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