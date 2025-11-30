// hooks/useRefreshTracker.ts
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface UseRefreshTrackerProps {
  maxRefreshes?: number;
  onFirstRefresh?: () => void;
  onMaxRefreshes?: () => void;
  isAuthenticated?: boolean;
}

interface UseRefreshTrackerReturn {
  refreshCount: number;
  handleRefresh: () => void;
  resetRefreshCount: () => void;
  shouldRedirect: boolean;
}

export const useRefreshTracker = ({
  maxRefreshes = 2,
  onFirstRefresh,
  onMaxRefreshes,
  isAuthenticated = true,
}: UseRefreshTrackerProps = {}): UseRefreshTrackerReturn => {
  const router = useRouter();
  const [refreshCount, setRefreshCount] = useState(0);
  const [hasShownToast, setHasShownToast] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Initialize from sessionStorage
  useEffect(() => {
    const savedRefreshCount = sessionStorage.getItem('refreshCount');
    const savedHasShownToast = sessionStorage.getItem('hasShownRefreshToast');
    
    if (savedRefreshCount) {
      setRefreshCount(parseInt(savedRefreshCount, 10));
    }
    
    if (savedHasShownToast) {
      setHasShownToast(savedHasShownToast === 'true');
    }
  }, []);

  // Persist state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('refreshCount', refreshCount.toString());
    sessionStorage.setItem('hasShownRefreshToast', hasShownToast.toString());
  }, [refreshCount, hasShownToast]);

  // Track page refresh/unload events
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isAuthenticated) {
        setRefreshCount(prev => prev + 1);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isAuthenticated]);

  // Handle refresh count logic and notifications
  useEffect(() => {
    if (!isAuthenticated) {
      // If not authenticated, reset the counter
      setRefreshCount(0);
      setHasShownToast(false);
      return;
    }

    if (refreshCount === 1 && !hasShownToast) {
      // First refresh
      toast.info("Session maintained. Welcome back!", {
        autoClose: 2000,
        position: "top-center",
      });
      setHasShownToast(true);
      onFirstRefresh?.();

      // Reset after first refresh notification
      const timeout = setTimeout(() => {
        setRefreshCount(0);
        setHasShownToast(false);
      }, 2500);

      return () => clearTimeout(timeout);
    }

    if (refreshCount >= maxRefreshes && !hasShownToast) {
      // Maximum refreshes reached
      toast.warning("Authentication required. Please log in again.", {
        autoClose: 3000,
        position: "top-center",
      });
      setHasShownToast(true);
      setShouldRedirect(true);
      onMaxRefreshes?.();
    }
  }, [refreshCount, hasShownToast, maxRefreshes, onFirstRefresh, onMaxRefreshes, isAuthenticated]);

  // Handle redirect when shouldRedirect is true
  useEffect(() => {
    if (shouldRedirect) {
      const timeout = setTimeout(() => {
        // Clear all storage and redirect
        sessionStorage.removeItem('refreshCount');
        sessionStorage.removeItem('hasShownRefreshToast');
        localStorage.removeItem('authState');
        localStorage.removeItem('authToken');
        router.push('/login');
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [shouldRedirect, router]);

  const handleRefresh = useCallback(() => {
    if (isAuthenticated) {
      setRefreshCount(prev => prev + 1);
    }
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, [isAuthenticated]);

  const resetRefreshCount = useCallback(() => {
    setRefreshCount(0);
    setHasShownToast(false);
    setShouldRedirect(false);
    sessionStorage.removeItem('refreshCount');
    sessionStorage.removeItem('hasShownRefreshToast');
  }, []);

  return {
    refreshCount,
    handleRefresh,
    resetRefreshCount,
    shouldRedirect,
  };
};