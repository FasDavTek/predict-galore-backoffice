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

const drawerWidth = 260;
const collapsedWidth = 72;

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const isActive = (path) => router.pathname === path;

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo + Toggle */}
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
        {!collapsed && !isMobile && (
          <Image
            src="/predict-galore-logo.png"
            alt="Predict galore logo"
            width={160}
            height={40}
            priority
          />
        )}
        <IconButton onClick={toggleSidebar}>
          {collapsed || isMobile ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* Menu */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: collapsed || isMobile ? 0 : 1.5 }}>
        <List>
          {navigationItems.map((item, index) => {
            const active = isActive(item.path);
            const menuButton = (
              <ListItemButton
                selected={active}
                onClick={() => {
                  router.push(item.path);
                  if (isMobile) setMobileOpen(false); // auto-close on mobile
                }}
                sx={{
                  borderRadius: 1,
                  mx: collapsed || isMobile ? 0.5 : 0,
                  my: 0.5,
                  justifyContent: collapsed || isMobile ? 'center' : 'flex-start',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                    '& .MuiListItemText-primary': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed || isMobile ? 'auto' : 36,
                    justifyContent: 'center',
                  }}
                >
                  {React.cloneElement(item.icon, { fontSize: 'small' })}
                </ListItemIcon>
                {!(collapsed || isMobile) && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 14 }}
                    sx={{ ml: 1 }}
                  />
                )}
              </ListItemButton>
            );

            return (
              <ListItem key={index} disablePadding sx={{ display: 'block' }}>
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

      {/* Logout */}
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
      {/* Mobile menu trigger */}
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

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: collapsed || isMobile ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed || isMobile ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
