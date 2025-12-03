import { useState, MouseEvent } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  ArrowDropDown as ArrowDropDownIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

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
  const userInitials = (
    (firstName?.charAt(0) || "") + (lastName?.charAt(0) || "")
  ).toUpperCase() || "?";

  const fullName = `${firstName} ${lastName}`.trim() || "User";

  const handleUserMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  // Show a skeleton/placeholder while user data is loading
  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pl: 2,
          borderLeft: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: "grey.300",
            color: "grey.600",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          ?
        </Avatar>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        pl: 2,
        borderLeft: "1px solid",
        borderColor: "divider",
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: "primary.light",
          color: "primary.main",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          '&:hover': {
            bgcolor: "primary.main",
            color: "primary.contrastText",
          },
        }}
        onClick={handleUserMenuOpen}
      >
        {userInitials}
      </Avatar>
      
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary" }}>
          {fullName}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {adminType}
        </Typography>
      </Box>
      
      <IconButton
        size="small"
        onClick={handleUserMenuOpen}
        sx={{ 
          display: { xs: "none", sm: "flex" },
          color: "text.secondary",
          '&:hover': {
            color: "primary.main",
            backgroundColor: 'rgba(66, 166, 5, 0.08)',
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
            borderRadius: 2,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600} color="text.primary">
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
              backgroundColor: 'rgba(236, 66, 81, 0.08)',
              color: 'error.main',
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: "text.secondary" }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;