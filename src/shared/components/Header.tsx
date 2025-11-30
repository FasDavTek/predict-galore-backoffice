"use client";

import { useState, useRef, useEffect } from "react";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import NotificationBell from "./NotificationBell";
import NotificationPanel from "./NotificationPanel";
import { logout } from "@/app/(auth)/features/slices/authSlice";
import { useGetProfileQuery } from "@/app/(auth)/features/api/authApi";
import MenuIcon from "@mui/icons-material/Menu";

// Define proper Redux state types
interface AuthState {
  token?: string;
  user?: User;
}

interface RootState {
  auth: AuthState;
}

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  adminType?: string;
}

interface ProfileResponse {
  data?: User;
}

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Redux state
  const token = useSelector((state: RootState) => state.auth.token);
  const authUser = useSelector((state: RootState) => state.auth.user);
  
  // API call for profile data
  const { data: profileResponse } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  // Use profile data from API or fallback to Redux auth state
  const user: User = (profileResponse as ProfileResponse)?.data || authUser || {};
  const { firstName = '', lastName = '', email = '', adminType = '' } = user;

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login"); 
  };

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

  const handleNotificationToggle = () => {
    setNotificationOpen(!notificationOpen);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const handleMenuToggle = () => {
    if (onMenuToggle) {
      onMenuToggle();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, md: 4 },
        py: 2,
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        height: 72,
      }}
    >
      {/* Left Side - Menu Button for Mobile and Search Bar for Desktop */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 2,
        flex: isMobile ? 1 : 'auto'
      }}>
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
        {!isMobile && (
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
      </Box>

      {/* Right Side - User Controls */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: { xs: 1, md: 2 }, 
        position: "relative" 
      }}>
        {/* Notification Bell with Panel */}
        <div ref={notificationRef}>
          <NotificationBell
            open={notificationOpen}
            onToggle={handleNotificationToggle}
          />
          <NotificationPanel
            open={notificationOpen}
            onClose={handleNotificationClose}
          />
        </div>

        {/* User Profile */}
        <UserMenu
          user={{ firstName, lastName, email, adminType }}
          onLogout={handleLogout}
        />
      </Box>
    </Box>
  );
}