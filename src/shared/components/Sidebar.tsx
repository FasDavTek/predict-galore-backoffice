// components/dashboard/Sidebar.tsx
'use client';

import React, { memo, useCallback } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth';

// Sidebar width constants
const DRAWER_WIDTH = 260; // Expanded width
const COLLAPSED_WIDTH = 72; // Collapsed width

// Navigation items configuration
interface NavigationItem {
  icon: React.ReactElement;
  label: string;
  path: string;
}

// Memoize navigation items to prevent recreation
const navigationItems: NavigationItem[] = [
  { icon: <DashboardIcon />, label: 'Dashboard', path: '/dashboard' },
  { icon: <DescriptionIcon />, label: 'Predictions', path: '/predictions' },
  { icon: <PeopleIcon />, label: 'Users', path: '/users' },
  { icon: <WalletIcon />, label: 'Transactions', path: '/transactions' },
  { icon: <SettingsIcon />, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Toggle sidebar between expanded/collapsed states (desktop only)
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  }, [isMobile, mobileOpen, collapsed, setMobileOpen, setCollapsed]);

  // Close mobile sidebar
  const handleMobileClose = useCallback(() => {
    setMobileOpen(false);
  }, [setMobileOpen]);

  // Check if current route matches item path
  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  // Handle navigation
  const handleNavigation = useCallback((path: string) => {
    router.push(path);
    if (isMobile) setMobileOpen(false);
  }, [router, isMobile, setMobileOpen]);

  // Handle logout
  const handleLogout = useCallback(() => {
    logout();
    router.push('/login');
    if (isMobile) setMobileOpen(false);
  }, [logout, router, isMobile, setMobileOpen]);

  // Main drawer content
  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      {/* Header section with logo and collapse button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'space-between' : collapsed ? 'center' : 'space-between',
          px: 2,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Show Predict Galore logo when expanded or on mobile */}
        {(!collapsed || isMobile) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src="/predict-galore-logo.png"
              alt="Predict Galore Logo"
              width={160}
              height={40}
              priority
              style={{
                objectFit: 'contain',
              }}
            />
          </Box>
        )}

        {/* Close button for mobile, collapse button for desktop */}
        <IconButton onClick={isMobile ? handleMobileClose : toggleSidebar}>
          {isMobile ? <CloseIcon /> : collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* Navigation menu items */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: collapsed && !isMobile ? 0 : 1.5,
          py: 2,
        }}
      >
        <List>
          {navigationItems.map((item, index) => {
            const active = isActive(item.path);

            // Reusable button component for each menu item
            const menuButton = (
              <ListItemButton
                selected={active}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: isMobile ? 0 : 1, // Remove border radius on mobile
                  mx: collapsed && !isMobile ? 0.5 : 0,
                  my: isMobile ? 0 : 0.5, // Remove vertical margin on mobile
                  justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                  // Active state styling
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(66, 166, 5, 0.12)',
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                    '& .MuiListItemText-primary': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                  },
                  // Hover state styling
                  '&:hover': {
                    backgroundColor: 'rgba(66, 166, 5, 0.08)',
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                    '& .MuiListItemText-primary': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed && !isMobile ? 'auto' : 36,
                    justifyContent: 'center',
                    color: active ? 'primary.main' : 'text.secondary',
                  }}
                >
                  <Box sx={{ fontSize: 'small' }}>{item.icon}</Box>
                </ListItemIcon>
                {/* Hide text when collapsed on desktop */}
                {!(collapsed && !isMobile) && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      color: active ? 'primary.main' : 'text.secondary',
                      fontWeight: active ? 600 : 'normal',
                    }}
                    sx={{ ml: 1 }}
                  />
                )}
              </ListItemButton>
            );

            return (
              <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                {/* Show tooltip only when collapsed on desktop */}
                {collapsed && !isMobile ? (
                  <Tooltip title={item.label} placement="right">
                    {menuButton}
                  </Tooltip>
                ) : (
                  menuButton
                )}
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer section with logout button */}
      <Box
        sx={{
          px: collapsed && !isMobile ? 0 : 2,
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Tooltip title="Logout" placement="right" disableHoverListener={!(collapsed && !isMobile)}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: isMobile ? 0 : 1, // Remove border radius on mobile
              justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
              mx: collapsed && !isMobile ? 0.5 : 0,
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                '& .MuiListItemIcon-root': { color: 'error.main' },
                '& .MuiListItemText-primary': { color: 'error.main' },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed && !isMobile ? 'auto' : 36,
                justifyContent: 'center',
                color: 'text.secondary',
              }}
            >
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            {!(collapsed && !isMobile) && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ fontSize: 14 }}
                sx={{ ml: 1 }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleMobileClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: isMobile ? 'auto' : collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile ? DRAWER_WIDTH : collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            // Remove border radius on mobile and add proper styling
            ...(isMobile && {
              boxShadow: '0 0 24px rgba(0,0,0,0.1)',
              borderRadius: 0, // Remove border radius on mobile
              borderRight: 'none', // Remove right border on mobile
            }),
            // Desktop styling with border radius
            ...(!isMobile && {
              borderRadius: collapsed ? 0 : '0 12px 12px 0', // Only apply border radius on expanded desktop
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Backdrop - Only for mobile temporary drawer */}
      {isMobile && mobileOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: theme.zIndex.drawer - 1,
          }}
          onClick={handleMobileClose}
        />
      )}
    </>
  );
};

export default memo(Sidebar);
