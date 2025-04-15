// pages/dashboard.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Skeleton,
  Chip,
  Divider,
  IconButton
} from "@mui/material";
import {
  People as UsersIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  HowToReg as SignupIcon,
  Assessment as PredictionIcon,
  Payment as PaymentIcon,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";

import DashboardLayout from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import UserEngagementChart from "@/components/charts/UserEngagementChart";
import TrafficChart from "@/components/charts/TrafficChart";
import { ChartCard } from "@/components/charts/ChartCard";
import ActivityLog from "@/components/dashboard/ActivityLog";

import {
  fetchDashboardStats,
  fetchUserEngagement,
  fetchTrafficData,
  fetchActivityLog,
  setTimeRange,
  setTrafficFilter,
  setActivityLogLimit,
  selectDashboardStats,
  selectUserEngagement,
  selectTrafficData,
  selectActivityLog,
  selectDashboardLoading,
  selectDashboardFilters,
} from "@/store/slices/dashboardSlice";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const [showFullActivityLog, setShowFullActivityLog] = useState(false);
  
  // Selectors
  const stats = useSelector(selectDashboardStats);
  const engagementData = useSelector(selectUserEngagement);
  const trafficData = useSelector(selectTrafficData);
  const activityLog = useSelector(selectActivityLog);
  const loading = useSelector(selectDashboardLoading);
  const filters = useSelector(selectDashboardFilters);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchUserEngagement(filters.timeRange));
    dispatch(fetchTrafficData(filters.trafficFilter));
    dispatch(fetchActivityLog());
  }, [dispatch, filters.timeRange, filters.trafficFilter]);

  const handleTimeRangeChange = (range) => {
    dispatch(setTimeRange(range));
    dispatch(fetchUserEngagement(range));
  };

  const handleTrafficFilterChange = (filter) => {
    dispatch(setTrafficFilter(filter));
    dispatch(fetchTrafficData(filter));
  };

  const handleViewAllActivities = () => {
    dispatch(setActivityLogLimit(50));
    setShowFullActivityLog(true);
  };

  const handleBackToDashboard = () => {
    setShowFullActivityLog(false);
  };

  return (
    <DashboardLayout>
      {showFullActivityLog ? (
        // Full Activity Log View
        <Box className="w-full p-4">
          {/* Breadcrumb Navigation */}
          <Box 
            className="flex items-center mb-6 cursor-pointer" 
            onClick={handleBackToDashboard}
            sx={{ '&:hover': { color: 'primary.main' } }}
          >
            <ChevronLeftIcon className="mr-2" />
            <Typography variant="h5" fontWeight={600}>
              Activity Log
            </Typography>
          </Box>
          
          {/* Full-width Activity Log */}
          <ActivityLog
            title="All Activities"
            activities={activityLog}
            loading={loading.activity}
            activityIcons={{
              signup: <SignupIcon color="primary" />,
              prediction: <PredictionIcon color="secondary" />,
              payment: <PaymentIcon color="success" />,
            }}
            emptyState={{
              icon: <SignupIcon sx={{ fontSize: 40, color: "grey.400" }} />,
              title: "No Activities Found",
              description: "New activities will appear here as they occur",
            }}
            formatTimestamp={(timestamp) =>
              new Date(timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            }
            className="w-full"
          />
        </Box>
      ) : (
        // Normal Dashboard View
        <>
          {/* Page Header */}
          <DashboardHeader
            title="Welcome, Andrew"
            subtitle="Here's what's happening with your platform today"
            timeRange={filters.timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />

          {/* Stat Cards Section */}
          <Box className="w-full mb-8">
            <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loading.stats
                ? [1, 2, 3, 4].map((item) => (
                    <Box key={item}>
                      <Skeleton
                        variant="rounded"
                        height={120}
                        className="h-full w-full"
                      />
                    </Box>
                  ))
                : stats?.map((card, index) => (
                    <Box key={index}>
                      <StatCard {...card} className="h-full" />
                    </Box>
                  ))}
            </Box>
          </Box>

          {/* Main Content */}
          <Box className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - 8/12 width on desktop */}
            <Box className="lg:col-span-8 flex flex-col gap-6">
              {/* User Engagement Chart */}
              <Box className="flex flex-1">
                <ChartCard
                  title="User Engagement"
                  filterValue={filters.timeRange}
                  onFilterChange={handleTimeRangeChange}
                  filterOptions={[
                    { value: "This Month", label: "This Month" },
                    { value: "Last Month", label: "Last Month" },
                    { value: "This Year", label: "This Year" },
                  ]}
                  minHeight={360}
                  className="w-full"
                >
                  <UserEngagementChart
                    data={engagementData}
                    loading={loading.engagement}
                  />
                </ChartCard>
              </Box>

              {/* Traffic Chart */}
              <Box className="flex flex-1">
                <ChartCard
                  title="Traffic Overview"
                  filterValue={filters.trafficFilter}
                  onFilterChange={handleTrafficFilterChange}
                  filterOptions={[
                    { value: "By location", label: "By location" },
                    { value: "By device", label: "By device" },
                    { value: "By source", label: "By source" },
                  ]}
                  minHeight={400}
                  className="w-full"
                >
                  <TrafficChart data={trafficData} loading={loading.traffic} />
                </ChartCard>
              </Box>
            </Box>

            {/* Right Column - 4/12 width on desktop */}
            <Box className="lg:col-span-4 flex">
              <ActivityLog
                title="Recent Activity"
                activities={activityLog}
                loading={loading.activity}
                onViewAll={handleViewAllActivities}
                activityIcons={{
                  signup: <SignupIcon color="primary" />,
                  prediction: <PredictionIcon color="secondary" />,
                  payment: <PaymentIcon color="success" />,
                }}
                emptyState={{
                  icon: <SignupIcon sx={{ fontSize: 40, color: "grey.400" }} />,
                  title: "No Activities Found",
                  description: "New activities will appear here as they occur",
                }}
                formatTimestamp={(timestamp) =>
                  new Date(timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                }
                className="w-full"
              />
            </Box>
          </Box>
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;