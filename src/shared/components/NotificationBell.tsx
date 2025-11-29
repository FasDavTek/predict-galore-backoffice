"use client";

import React from "react";
import {
  Box,
  IconButton,
  Badge,
  alpha,
  useTheme,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { useGetNotificationStatsQuery } from "../api/notificationApi";

interface NotificationBellProps {
  open: boolean;
  onToggle: () => void;
}

const NotificationBell = ({ open, onToggle }: NotificationBellProps) => {
  const theme = useTheme();
  const { data: statsData } = useGetNotificationStatsQuery();
  
  // Calculate unread count from stats or fallback
  const unreadCount = statsData?.data?.unreadCount || 0;

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        onClick={onToggle}
        sx={{
          backgroundColor: open 
            ? alpha(theme.palette.primary.main, 0.08) 
            : "background.default",
          color: open ? "primary.main" : "text.secondary",
          "&:hover": { 
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            color: "primary.main",
          },
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
        }}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error" 
          overlap="circular"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.7rem',
              fontWeight: 'bold',
              animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
            }
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </Box>
  );
};

export default NotificationBell;