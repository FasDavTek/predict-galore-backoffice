// components/dashboard/Header.js
import React from 'react';
import { 
  Box, 
  IconButton, 
  InputBase, 
  Badge,
  Avatar,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  ArrowDropDown as ArrowDropDownIcon
} from '@mui/icons-material';

const Header = () => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 4,
      py: 2,
      backgroundColor: 'background.paper',
      borderBottom: '1px solid',
      borderColor: 'divider',
      height: 72
    }}>
      {/* Search Bar */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 1,
        width: 480,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.default',
        '&:hover': {
          borderColor: 'primary.main'
        }
      }}>
        <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
        <InputBase
          placeholder="Search dashboard..."
          sx={{ flex: 1, fontSize: 14 }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </Box>

      {/* User Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Notification Badge */}
        <IconButton sx={{ 
          backgroundColor: 'background.default',
          '&:hover': { backgroundColor: 'action.hover' }
        }}>
          <Badge badgeContent={3} color="error">
            <NotificationsIcon sx={{ color: 'text.secondary' }} />
          </Badge>
        </IconButton>

        {/* User Profile */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          pl: 2,
          borderLeft: '1px solid',
          borderColor: 'divider'
        }}>
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36,
              bgcolor: 'primary.light',
              color: 'primary.main',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            AS
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Andrew Smith
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Admin
            </Typography>
          </Box>
          <IconButton size="small">
            <ArrowDropDownIcon sx={{ color: 'text.secondary' }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;