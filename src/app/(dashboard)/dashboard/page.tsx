"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import DashboardHeader, { TimeRange } from "../../../features/dashboard/components/DashboardHeader";
import AnalyticsGrid from "../../../features/dashboard/components/AnalyticsGrid";
import UserEngagementChart from "../../../features/dashboard/components/UserEngagementChart";
import Traffic from "../../../features/dashboard/components/Traffic";
import ActivityLog from "../../../features/dashboard/components/ActivityLog";
import UILoadingSkeleton from "../../../components/UILoadingSkeleton";

// Auth state selectors and actions
import { RootState } from "../../../store/store";
import { useGetProfileQuery } from "@/features/auth/api/authApi";
import { logout } from "@/features/auth/slices/authSlice";

import { Box } from "@mui/material";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isClientSide, setIsClientSide] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  
  // Global time range state for all dashboard components
  const [globalTimeRange, setGlobalTimeRange] = useState<TimeRange>('default');

  // Redux auth state
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = Boolean(token);

  // Set client-side flag
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  // Use user from auth state first, fallback to fresh profile
  const currentUser = user;

  // Prevent rendering on server to avoid hydration mismatches
  if (!isClientSide) {
    return <UILoadingSkeleton variant="dashboard" itemCount={4} />;
  }

  // Show loading while redirecting
  if (hasRedirected) {
    return <UILoadingSkeleton variant="dashboard" itemCount={4} />;
  }

  // Show loading only if we don't have any user data and profile is loading
  const isLoading = !currentUser;
  
  if (isLoading) {
    return <UILoadingSkeleton variant="dashboard" itemCount={4} />;
  }

  return (
    <>
      <DashboardHeader 
        timeRange={globalTimeRange}
        onTimeRangeChange={setGlobalTimeRange}
        user={currentUser}
      />

      {/* Overview Analytics Cards */}
      <AnalyticsGrid timeRange={globalTimeRange} />

      {/* Main content area with flexbox layout */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' },
        gap: 3,
        mt: 3,
        minHeight: 'calc(100vh - 200px)' // Ensure the container has minimum height
      }}>
        {/* Left column - Main charts */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          <UserEngagementChart globalTimeRange={globalTimeRange} />
          <Traffic />
        </Box>

        {/* Right column - Activity log (full height) */}
        <Box sx={{ 
          width: { xs: '100%', lg: 400 },
          minWidth: { xs: 'auto', lg: 400 },
          display: 'flex',
          flexDirection: 'column'
        }}>
          <ActivityLog />
        </Box>
      </Box>
    </>
  );
}