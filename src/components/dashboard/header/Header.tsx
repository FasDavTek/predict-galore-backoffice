"use client";

import { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation"; // Changed from 'next/router'
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import NotificationBell from "./NotificationBell";
import { logout } from "@/app/(auth)/features/slices/authSlice";
import { useGetProfileQuery } from "@/app/(auth)/features/api/authApi";

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

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // State
  const [openNotifs, setOpenNotifs] = useState(false);
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
        setOpenNotifs(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 4,
        py: 2,
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        height: 72,
      }}
    >
      {/* Search Bar - Left Side */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Right Side - User Controls */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Notification Bell */}
        <div ref={notificationRef}>
          <NotificationBell
            openNotifs={openNotifs}
            setOpenNotifs={setOpenNotifs}
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