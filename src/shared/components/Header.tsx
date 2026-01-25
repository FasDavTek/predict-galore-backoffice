'use client';

import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import { designTokens } from '../styles/tokens';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import NotificationBell from './NotificationBell';
import NotificationPanel from './NotificationPanel';
import { useAuth, useProfile } from '@/features/auth';
import type { User } from '@/features/auth/model/types';
import type { ProfileResponse } from '@/features/auth/model/types';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  onMenuToggle?: () => void;
}

// Type for user data that can come from either auth store or profile API
type UserData = User | ProfileResponse['data'] | null | undefined;

function Header({ onMenuToggle }: HeaderProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user: authUser, logout } = useAuth();
  const { data: profileData } = useProfile();

  // State
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Use profile data from API or fallback to auth store
  const user: UserData = useMemo(() => {
    if (profileData?.data) {
      return profileData.data;
    }
    return authUser;
  }, [profileData, authUser]);

  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const email = user?.email || '';
  const adminType = user?.adminType || null;

  const handleLogout = useCallback(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  // Close notification panel when clicking outside
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationToggle = useCallback(() => {
    setNotificationOpen((prev) => !prev);
  }, []);

  const handleNotificationClose = useCallback(() => {
    setNotificationOpen(false);
  }, []);

  const handleMenuToggle = useCallback(() => {
    onMenuToggle?.();
  }, [onMenuToggle]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: designTokens.spacing.itemGap, md: designTokens.spacing.xl },
        py: designTokens.spacing.itemGap,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        height: 72,
      }}
    >
      {/* Left Side - Menu Button for Mobile and Search Bar for Desktop */}
      <Stack
        direction="row"
        spacing={designTokens.spacing.itemGap}
        alignItems="center"
        sx={{ flex: isMobile ? 1 : 'auto' }}
      >
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            onClick={handleMenuToggle}
            sx={{
              color: 'text.primary',
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Search Bar - Hidden on Mobile */}
        {!isMobile && <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearchChange} />}
      </Stack>

      {/* Right Side - User Controls */}
      <Stack
        direction="row"
        spacing={{ xs: 1, md: designTokens.spacing.itemGap }}
        alignItems="center"
        sx={{ position: 'relative' }}
      >
        {/* Notification Bell with Panel */}
        <div ref={notificationRef}>
          <NotificationBell open={notificationOpen} onToggle={handleNotificationToggle} />
          <NotificationPanel open={notificationOpen} onClose={handleNotificationClose} />
        </div>

        {/* User Profile */}
        <UserMenu user={{ firstName, lastName, email, adminType: adminType || undefined }} onLogout={handleLogout} />
      </Stack>
    </Box>
  );
}

export default memo(Header);
