"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import DashboardHeader, { TimeRange } from "./features/components/DashboardHeader";
import UserEngagementChart from "./features/components/UserEngagementChart";
import Traffic from "./features/components/Traffic";
import ActivityLog from "./features/components/ActivityLog";
import { DashboardPageLoadingSkeleton } from "@/app/(dashboard)/dashboard/features/components/DashboardPageLoadingSkeleton";
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";
import DashboardAnalytics from "@/app/(dashboard)/dashboard/features/components/DashboardAnalytics";

export default function DashboardPage() {
  const [isClientSide, setIsClientSide] = useState(false);
  
  // Global time range state for all dashboard components
  const [globalTimeRange, setGlobalTimeRange] = useState<TimeRange>('default');
  
  // Refresh trigger state
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redux auth state
  const user = useSelector((state: RootState) => state.auth.user);

  // Set client-side flag using setTimeout to avoid synchronous state update
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClientSide(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle refresh button click
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Increment refresh trigger to force all components to refetch
    setRefreshTrigger(prev => prev + 1);
    
    // Set a timeout to hide the loading skeleton after a minimum duration
    // This ensures users see the loading state even for fast refreshes
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000); // Minimum 1 second loading state for better UX
  };

  // Use user from auth state first, fallback to fresh profile
  const currentUser = user;

  // Prevent rendering on server to avoid hydration mismatches
  if (!isClientSide) {
    return <DashboardPageLoadingSkeleton />;
  }

  // Show loading skeleton if refreshing, or if we don't have any user data
  if (isRefreshing || !currentUser) {
    return <DashboardPageLoadingSkeleton />;
  }

  return (
    <>
      <DashboardHeader 
        timeRange={globalTimeRange}
        onTimeRangeChange={setGlobalTimeRange}
        onRefresh={handleRefresh}
        user={currentUser}
      />

      {/* Overview Analytics Cards */}
      <DashboardAnalytics 
        timeRange={globalTimeRange} 
        refreshTrigger={refreshTrigger}
      />

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
          <UserEngagementChart 
            globalTimeRange={globalTimeRange} 
            refreshTrigger={refreshTrigger}
          />
          <Traffic refreshTrigger={refreshTrigger} />
        </Box>

        {/* Right column - Activity log (full height) */}
        <Box sx={{ 
          width: { xs: '100%', lg: 400 },
          minWidth: { xs: 'auto', lg: 400 },
          display: 'flex',
          flexDirection: 'column'
        }}>
          <ActivityLog refreshTrigger={refreshTrigger} />
        </Box>
      </Box>
    </>
  );
}