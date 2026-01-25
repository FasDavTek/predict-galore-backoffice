'use client';

import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { alpha, useTheme } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useUnreadCount } from '@/features/notifications';

interface NotificationBellProps {
  open: boolean;
  onToggle: () => void;
}

const NotificationBell = ({ open, onToggle }: NotificationBellProps) => {
  const theme = useTheme();
  const { data: unreadCountData } = useUnreadCount();
  const unreadCount = unreadCountData || 0;

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton
        onClick={onToggle}
        sx={{
          backgroundColor: open ? alpha(theme.palette.primary.main, 0.08) : 'background.default',
          color: open ? 'primary.main' : 'text.secondary',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            color: 'primary.main',
          },
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
          animation: unreadCount > 0 && !open ? 'pulse 1.5s infinite' : 'none',
          '@keyframes pulse': {
            '0%': {
              boxShadow: `0 0 0 0 ${alpha(theme.palette.error.main, 0.7)}`,
            },
            '70%': {
              boxShadow: `0 0 0 6px ${alpha(theme.palette.error.main, 0)}`,
            },
            '100%': {
              boxShadow: `0 0 0 0 ${alpha(theme.palette.error.main, 0)}`,
            },
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          overlap="circular"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.65rem',
              fontWeight: 700,
              height: 18,
              minWidth: 18,
              animation: unreadCount > 0 ? 'bounce 1s infinite' : 'none',
              '@keyframes bounce': {
                '0%, 100%': {
                  transform: 'scale(1)',
                },
                '50%': {
                  transform: 'scale(1.1)',
                },
              },
            },
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </Box>
  );
};

export default NotificationBell;
