"use client";

import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  IconButton,
  Tooltip,
  useTheme,
  Typography,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { FiHome, FiUsers, FiActivity, FiTrendingUp, FiLayers } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

// Sidebar width constants
const drawerWidth = 260; // Expanded width
const collapsedWidth = 72; // Collapsed width

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: <FiHome /> },
  { name: "Users", href: "/users", icon: <FiUsers /> },
  { name: "Predictions", href: "/predictions", icon: <FiTrendingUp /> },
  { name: "Transactions", href: "/transactions", icon: <FiActivity /> },
  { name: "Settings", href: "/settings", icon: <FiLayers /> },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();

  // Toggle sidebar between expanded/collapsed states
  const toggleSidebar = () => {
    if (onToggle) {
      onToggle();
    }
  };

  // Check if current route matches item path
  const isActive = (href: string) => pathname.startsWith(href);

  // Main drawer content
  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
      }}
    >
      {/* Header section with logo and collapse button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          px: 2,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Show logo only when expanded */}
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/predict-galore-logo.png"
              alt="Predict Galore"
              width={140}
              height={32}
              style={{ objectFit: 'contain' }}
            />
          </Box>
        )}
        {/* Collapse/expand button */}
        <IconButton 
          onClick={toggleSidebar}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* Navigation menu items */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: collapsed ? 0.5 : 1.5, py: 1 }}>
        <List>
          {menuItems.map((item, index) => {
            const active = isActive(item.href);
            
            // Reusable button component for each menu item
            const menuButton = (
              <ListItemButton
                selected={active}
                onClick={() => {
                  router.push(item.href);
                }}
                sx={{
                  borderRadius: 1,
                  mx: collapsed ? 0.5 : 0,
                  my: 0.5,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  minHeight: 44,
                  // Active state styling
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(66, 166, 5, 0.12)',
                    '& .MuiListItemIcon-root': { 
                      color: 'primary.main',
                    },
                    '& .MuiListItemText-primary': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(66, 166, 5, 0.16)',
                    },
                  },
                  // Hover state styling
                  '&:hover': {
                    backgroundColor: 'rgba(66, 166, 5, 0.08)',
                    '& .MuiListItemIcon-root': { 
                      color: 'primary.main',
                    },
                    '& .MuiListItemText-primary': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 'auto' : 36,
                    justifyContent: 'center',
                    color: active ? 'primary.main' : 'text.secondary',
                    fontSize: '1.25rem',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {/* Hide text when collapsed */}
                {!collapsed && (
                  <ListItemText
                    primary={item.name}
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
                {collapsed ? (
                  <Tooltip title={item.name} placement="right">
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

      {/* Footer section */}
      <Box
        sx={{
          px: collapsed ? 0.5 : 2,
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        {!collapsed && (
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ px: 1, display: 'block', textAlign: 'center' }}
          >
            Predict Galore v1.0
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? collapsedWidth : drawerWidth,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          borderRight: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}