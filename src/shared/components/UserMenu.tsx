import { useState, MouseEvent } from 'react';
import { Box, Avatar, Typography, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import Stack from '@mui/material/Stack';
import { designTokens } from '../styles/tokens';
import { ArrowDropDown as ArrowDropDownIcon, Logout as LogoutIcon } from '@mui/icons-material';

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  adminType?: string;
}

interface UserMenuProps {
  user: User | null;
  onLogout: () => void;
}

const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);

  // Provide default values to avoid hydration mismatch
  const { firstName = '', lastName = '', email = '', adminType = '' } = user || {};

  // Calculate initials with fallback
  const userInitials =
    ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase() || '?';

  const fullName = `${firstName} ${lastName}`.trim() || 'User';

  const handleUserMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  // Show a skeleton/placeholder while user data is loading
  if (!user) {
    return (
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          pl: designTokens.spacing.itemGap,
          borderLeft: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: 'grey.300',
            color: 'grey.600',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          ?
        </Avatar>
      </Stack>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={{
        pl: designTokens.spacing.itemGap,
        borderLeft: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: 'primary.light',
          color: 'primary.main',
          fontSize: designTokens.typography.fontSize.sm,
          fontWeight: designTokens.typography.fontWeight.semibold,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          },
        }}
        onClick={handleUserMenuOpen}
      >
        {userInitials}
      </Avatar>

      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Typography variant="subtitle2" sx={{ fontWeight: designTokens.typography.fontWeight.semibold, color: 'text.primary' }}>
          {fullName}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {adminType}
        </Typography>
      </Box>

      <IconButton
        size="small"
        onClick={handleUserMenuOpen}
        sx={{
          display: { xs: 'none', sm: 'flex' },
          color: 'text.secondary',
          '&:hover': {
            color: 'primary.main',
            backgroundColor: `${designTokens.colors.primary[500]}14`,
          },
        }}
      >
        <ArrowDropDownIcon />
      </IconButton>

      {/* User Dropdown Menu */}
      <Menu
        anchorEl={userAnchorEl}
        open={Boolean(userAnchorEl)}
        onClose={handleUserMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 240,
            borderRadius: 0,
            boxShadow: designTokens.shadows.lg,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: designTokens.spacing.itemGap, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={designTokens.typography.fontWeight.semibold} color="text.primary">
            {fullName}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={onLogout}
          sx={{
            '&:hover': {
              backgroundColor: `${designTokens.colors.error[500]}14`,
              color: 'error.main',
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
    </Stack>
  );
};

export default UserMenu;
