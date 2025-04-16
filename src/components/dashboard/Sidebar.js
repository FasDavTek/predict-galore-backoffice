// components/dashboard/Sidebar.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  AccountBalanceWallet as WalletIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Sidebar width constants
const drawerWidth = 260; // Expanded width
const collapsedWidth = 72; // Collapsed width

// Navigation items configuration
const navigationItems = [
  { icon: <DashboardIcon />, label: 'Dashboard', path: '/dashboard' },
  { icon: <DescriptionIcon />, label: 'Predictions', path: '/predictions' },
  { icon: <PeopleIcon />, label: 'Users', path: '/users' },
  { icon: <WalletIcon />, label: 'Transactions', path: '/transactions' },
  { icon: <SettingsIcon />, label: 'Settings', path: '/settings' },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if mobile view

  // State for mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  // Toggle sidebar between expanded/collapsed states
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen); // Toggle mobile drawer
    } else {
      setCollapsed(!collapsed); // Toggle desktop collapsed state
    }
  };

  // Check if current route matches item path
  const isActive = (path) => router.pathname === path;

  // Close mobile drawer when switching to desktop view
  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  // Main drawer content
  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header section with logo and collapse button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed || isMobile ? 'center' : 'space-between',
          px: 2,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Show logo only when expanded */}
        {!collapsed && !isMobile && (
          <Image
            src="/predict-galore-logo.png"
            alt="Predict galore logo"
            width={160}
            height={40}
            priority
          />
        )}
        {/* Collapse/expand button */}
        <IconButton onClick={toggleSidebar}>
          {collapsed || isMobile ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* Navigation menu items */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: collapsed || isMobile ? 0 : 1.5 }}>
        <List>
          {navigationItems.map((item, index) => {
            const active = isActive(item.path);
            
            // Reusable button component for each menu item
            const menuButton = (
              <ListItemButton
                selected={active}
                onClick={() => {
                  router.push(item.path);
                  if (isMobile) setMobileOpen(false); // Auto-close on mobile
                }}
                sx={{
                  borderRadius: 1,
                  mx: collapsed || isMobile ? 0.5 : 0, // Adjust margin based on state
                  my: 0.5,
                  justifyContent: collapsed || isMobile ? 'center' : 'flex-start',
                  // Active state styling
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(66, 166, 5, 0.12)', // Light green background
                    '& .MuiListItemIcon-root': { color: 'primary.main' }, // Green icon
                    '& .MuiListItemText-primary': {
                      color: 'primary.main', // Green text
                      fontWeight: 600, // Bold text
                    },
                  },
                  // Hover state styling
                  '&:hover': {
                    backgroundColor: 'rgba(66, 166, 5, 0.08)', // Lighter green background
                    '& .MuiListItemIcon-root': { color: 'primary.main' }, // Green icon
                    '& .MuiListItemText-primary': {
                      color: 'primary.main', // Green text
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed || isMobile ? 'auto' : 36,
                    justifyContent: 'center',
                    color: active ? 'primary.main' : 'text.secondary', // Green when active
                  }}
                >
                  {React.cloneElement(item.icon, { fontSize: 'small' })}
                </ListItemIcon>
                {/* Hide text when collapsed */}
                {!(collapsed || isMobile) && (
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
                {/* Show tooltip only when collapsed */}
                {collapsed || isMobile ? (
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
          px: collapsed || isMobile ? 0 : 2,
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Tooltip title="Logout" placement="right" disableHoverListener={!(collapsed || isMobile)}>
          <ListItemButton
            sx={{
              borderRadius: 1,
              justifyContent: collapsed || isMobile ? 'center' : 'flex-start',
              mx: collapsed || isMobile ? 0.5 : 0,
            }}
          >
            <ListItemIcon
              sx={{ minWidth: collapsed || isMobile ? 'auto' : 36, justifyContent: 'center' }}
            >
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            {!(collapsed || isMobile) && (
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
      {/* Mobile menu trigger button (only visible on mobile) */}
      {isMobile && (
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => setMobileOpen(true)}
          sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1300 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Main drawer component */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'} // Temporary for mobile, permanent for desktop
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          width: collapsed || isMobile ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed || isMobile ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            transition: 'width 0.3s', // Smooth transition
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;