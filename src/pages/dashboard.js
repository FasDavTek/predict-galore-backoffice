// pages/dashboard.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { ChevronLeft as BackIcon } from "@mui/icons-material";

// Layout and components
import DashboardLayout from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/Header";
import DashboardStat from "@/components/dashboard/Stat";
import UserEngagementChart from "@/components/charts/UserEngagementChart";
import Traffic from "@/components/dashboard/Traffic";
import ActivityLog from "@/components/dashboard/ActivityLog";

import { useAuth } from "@/context/AuthContext";

// Redux actions and selectors
import { selectIsAuthenticated } from "@/store/slices/authSlice";

import {
  fetchDashboardStats,
  fetchUserEngagement,
  fetchTrafficData,
  fetchActivityLog,
  setTimeRange,
  setTrafficFilter,
  setActivityLogLimit,
  selectDashboardLoading,
  selectDashboardStats,
  selectUserEngagement,
  selectTrafficData,
  selectActivityLog,
  selectDashboardFilters,
} from "@/store/slices/dashboardSlice";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useAuth();

  console.log("Logged in User details:", user);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Track when component has mounted
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Check authentication status and show dialog if not authenticated
  useEffect(() => {
    if (hasMounted && !isAuthenticated) {
      setShowAuthDialog(true);
      
      // Redirect to login page after 3 seconds
      const timer = setTimeout(() => {
        router.push(`/auth/login?returnUrl=${encodeURIComponent(router.pathname)}`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, router, hasMounted]);

  // State for controlling full-screen activity log view
  const [showFullActivityLog, setShowFullActivityLog] = useState(false);
  const [userType, setUserType] = useState("free");

  // Get data from Redux store
  const stats = useSelector(selectDashboardStats);
  const engagementData = useSelector(selectUserEngagement);
  const trafficData = useSelector(selectTrafficData);
  const activityLog = useSelector(selectActivityLog);
  const loading = useSelector(selectDashboardLoading);
  const filters = useSelector(selectDashboardFilters);

  // Fetch data when component mounts or filters change
  useEffect(() => {
    if (hasMounted && isAuthenticated) {
      dispatch(fetchDashboardStats());
      dispatch(fetchUserEngagement(filters.timeRange));
      dispatch(fetchTrafficData(filters.trafficFilter));
      dispatch(fetchActivityLog());
    }
  }, [dispatch, filters.timeRange, filters.trafficFilter, isAuthenticated, hasMounted]);

  // Handler for time range filter change
  const handleTimeRangeChange = (range) => {
    dispatch(setTimeRange(range));
    dispatch(fetchUserEngagement(range));
  };

  // Handler for traffic filter change
  const handleTrafficFilterChange = (filter) => {
    dispatch(setTrafficFilter(filter));
    dispatch(fetchTrafficData(filter));
  };

  // Show full activity log view
  const handleViewAllActivities = () => {
    dispatch(setActivityLogLimit(50)); // Load more activities
    setShowFullActivityLog(true); // Switch to full-screen view
  };

  // Return to normal dashboard view
  const handleBackToDashboard = () => {
    setShowFullActivityLog(false);
  };

  // Handle immediate navigation to login page
  const handleNavigateToLogin = () => {
    router.push(`/auth/login?returnUrl=${encodeURIComponent(router.pathname)}`);
  };

  // Don't render anything until component has mounted
  if (!hasMounted) {
    return null;
  }

  // If not authenticated, show the auth dialog instead of dashboard content
  if (!isAuthenticated) {
    return (
      <Dialog open={showAuthDialog} onClose={() => setShowAuthDialog(false)}>
        <DialogTitle>Authentication Required</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You need to be logged in to access the dashboard. You will be redirected to the login page shortly.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNavigateToLogin} color="primary" variant="contained">
            Go to Login Page
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Render dashboard content if authenticated
  return (
    <DashboardLayout user={user}>
      {/* Always show the header at the top */}
      <DashboardHeader
        title={`Welcome, ${user?.fullName}`}
        subtitle="Here's what's happening with your platform today"
        timeRange={filters.timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        user={user}
      />

      {/* Conditional rendering based on view mode */}
      {showFullActivityLog ? (
        // FULL-SCREEN ACTIVITY LOG VIEW
        <Box className="w-full p-4">
          {/* Back button to return to dashboard */}
          <Box
            onClick={handleBackToDashboard}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              cursor: "pointer",
              "&:hover": { color: "primary.main" },
            }}
          >
            <BackIcon className="mr-2" />
            <Typography variant="h5" fontWeight={600}>
              Activity Log
            </Typography>
          </Box>

          {/* Activity log taking full width */}
          <ActivityLog
            activities={activityLog}
            loading={loading.activity}
            isFullScreen={true}
          />
        </Box>
      ) : (
        // NORMAL DASHBOARD VIEW
        <>
          {/* Top row of stat cards */}
          <Box className="w-full mb-8">
            <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loading.stats
                ? // Show loading skeletons while data loads
                  [1, 2, 3, 4].map((item) => (
                    <DashboardStat key={`skeleton-${item}`} loading />
                  ))
                : // Display actual stat cards when data is loaded
                  stats?.map((card, index) => (
                    <DashboardStat
                      key={`stat-${index}`}
                      title={card.title}
                      value={card.value}
                      icon={card.icon}
                      change={card.change}
                      bgColor={card.bgColor}
                    />
                  ))}
            </Box>
          </Box>

          {/* Main content area with two columns */}
          <Box className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column (wider) */}
            <Box className="lg:col-span-8 flex flex-col gap-6">
              {/* User engagement chart */}
              <UserEngagementChart
                data={engagementData}
                loading={loading.engagement}
                userType={userType}
                onUserTypeChange={setUserType}
              />

              {/* Traffic component */}
              <Traffic
                data={trafficData}
                loading={loading.traffic}
                filterValue={filters.trafficFilter}
                onFilterChange={handleTrafficFilterChange}
              />
            </Box>

            {/* Right column (narrower) for activity log */}
            <Box className="lg:col-span-4 flex">
              <ActivityLog
                title="Activity Log"
                activities={activityLog}
                loading={loading.activity}
                onViewAll={handleViewAllActivities}
                isFullScreen={false}
              />
            </Box>
          </Box>
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;