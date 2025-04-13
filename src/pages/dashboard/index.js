// pages/dashboard.js
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardContent, Typography, Select, MenuItem, Grid, List, ListItem, ListItemText } from '@mui/material';
import {
  People as UsersIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  ChevronRight as ChevronRightIcon,
  HowToReg as SignupIcon,
  Assessment as PredictionIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';

// Custom chart components
import UserEngagementChart from '@/components/charts/UserEngagementChart';
import TrafficChart from '@/components/charts/TrafficChart';

import DashboardLayout from '@/layouts/DashboardLayout';

// Redux actions and selectors
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
  selectDashboardFilters
} from '@/store/slices/dashboardSlice';

// Icon mapping for activity log
const activityIcons = {
  signup: <SignupIcon color="primary" />,
  prediction: <PredictionIcon color="secondary" />,
  payment: <PaymentIcon style={{ color: '#4CAF50' }} />
};

// MAIN DASHBOARD COMPONENT
const DashboardPage = () => {
  // Initialize Redux hooks
  const dispatch = useDispatch();
  
  // Select data from Redux store
  const stats = useSelector(selectDashboardStats);
  const engagementData = useSelector(selectUserEngagement);
  const trafficData = useSelector(selectTrafficData);
  const activityLog = useSelector(selectActivityLog);
  const loading = useSelector(selectDashboardLoading);
  const filters = useSelector(selectDashboardFilters);

  // Fetch initial data on component mount
  useEffect(() => {
    console.log('Initializing dashboard data fetching...');
    dispatch(fetchDashboardStats());
    dispatch(fetchUserEngagement(filters.timeRange));
    dispatch(fetchTrafficData(filters.trafficFilter));
    dispatch(fetchActivityLog());
  }, [dispatch, filters.timeRange, filters.trafficFilter]);

  // Handler for time range filter change
  const handleTimeRangeChange = (range) => {
    console.log('Time range changed to:', range);
    dispatch(setTimeRange(range));
    dispatch(fetchUserEngagement(range));
  };

  // Handler for traffic filter change
  const handleTrafficFilterChange = (filter) => {
    console.log('Traffic filter changed to:', filter);
    dispatch(setTrafficFilter(filter));
    dispatch(fetchTrafficData(filter));
  };

  // Handler for view all activities
  const handleViewAllActivities = () => {
    console.log('Showing all activities');
    dispatch(setActivityLogLimit(10)); // Show more activities
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <DashboardLayout>
      {/* HEADER SECTION WITH GREETING AND FILTER */}
      <Box className="flex items-center justify-between mb-6">
        <Box className="flex flex-col gap-1">
          <Typography variant="h4" className="text-gray-950 font-normal">
            Welcome Andrew
          </Typography>
          <Typography variant="body1" className="text-gray-500">
            It&apos;s a great day for predictions! Stay sharp and keep delivering winning insights.
          </Typography>
        </Box>

        {/* TIME PERIOD SELECTOR - Connected to Redux */}
        <Select
          value={filters.timeRange}
          onChange={(e) => handleTimeRangeChange(e.target.value)}
          className="w-auto border border-[#d9d9de] h-9 px-2"
        >
          <MenuItem value="This Month">This Month</MenuItem>
          <MenuItem value="Last Month">Last Month</MenuItem>
          <MenuItem value="This Year">This Year</MenuItem>
        </Select>
      </Box>

      {/* STATS CARDS GRID - Using data from Redux */}
      <Grid container spacing={3} className="mb-6">
        {stats?.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="border border-[#eeeef0] rounded-lg h-full">
              <CardContent className="flex items-start justify-between p-6">
                <Box className="flex flex-col gap-3">
                  <Box className="flex flex-col gap-2">
                    <Typography variant="subtitle2" className="text-[#7a7a9d]">
                      {card?.title || 'N/A'}
                    </Typography>
                    <Typography variant="h4" className="text-gray-950">
                      {card?.value || '0'}
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <Box className="flex items-center gap-1">
                      <TrendingUpIcon className="text-green-600 w-5 h-5" />
                      <Typography variant="body2" className="text-green-600">
                        {card?.change || '+0%'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" className="text-gray-600">
                      vs last month
                    </Typography>
                  </Box>
                </Box>
                <Box className={`${card?.bgColor || 'bg-gray-50'} w-10 h-10 rounded-[20px] flex items-center justify-center`}>
                  {card?.icon === 'wallet' ? <WalletIcon /> : <UsersIcon />}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* MAIN CONTENT GRID */}
      <Grid container spacing={3}>
        {/* USER ENGAGEMENT CHART COLUMN (LEFT) - Connected to Redux */}
        <Grid item xs={12} md={8}>
          <Card className="border border-[#eeeef0] rounded-lg">
            <CardContent>
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6">User Engagement</Typography>
                <Select
                  value={filters.timeRange}
                  onChange={(e) => handleTimeRangeChange(e.target.value)}
                  size="small"
                >
                  <MenuItem value="This Month">This Month</MenuItem>
                  <MenuItem value="Last Month">Last Month</MenuItem>
                  <MenuItem value="This Year">This Year</MenuItem>
                </Select>
              </Box>
              <UserEngagementChart 
                data={engagementData} 
                loading={loading.engagement} 
              />
            </CardContent>
          </Card>
        </Grid>

        {/* ACTIVITY LOG COLUMN (RIGHT) */}
        <Grid item xs={12} md={4}>
          <Card className="border border-[#eeeef0] rounded-lg h-full">
            <CardContent>
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6">Activity Log</Typography>
                <Box 
                  className="flex items-center text-green-600 cursor-pointer"
                  onClick={handleViewAllActivities}
                >
                  <Typography variant="body2">View all</Typography>
                  <ChevronRightIcon />
                </Box>
              </Box>
              
              {activityLog?.length > 0 ? (
                <List>
                  {activityLog.map((activity) => (
                    <ListItem key={activity.id} className="border-b border-gray-100 last:border-b-0">
                      <Box className="flex items-center gap-3">
                        {activityIcons[activity.icon] || <SignupIcon />}
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {activity.action}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {activity.user} • {formatTimestamp(activity.timestamp)}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box className="flex items-center justify-center h-[300px]">
                  <Box className="text-center">
                    <Box className="w-[140px] h-[140px] bg-gray-50 rounded-[500px] flex items-center justify-center mx-auto mb-4">
                      <Image
                        width={90}  
                        height={72} 
                        alt="No data"
                        src="/closing-quote.svg"
                        className="object-contain" 
                        priority 
                      />
                    </Box>
                    <Typography variant="h6">No Activities Yet</Typography>
                    <Typography variant="body2" color="textSecondary">
                      All actions and updates will appear here once recorded.
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* TRAFFIC CHART (FULL WIDTH) - Connected to Redux */}
        <Grid item xs={12}>
          <Card className="border border-[#eeeef0] rounded-lg">
            <CardContent>
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6">Traffic</Typography>
                <Select
                  value={filters.trafficFilter}
                  onChange={(e) => handleTrafficFilterChange(e.target.value)}
                  size="small"
                >
                  <MenuItem value="By location">By location</MenuItem>
                  <MenuItem value="By device">By device</MenuItem>
                  <MenuItem value="By source">By source</MenuItem>
                </Select>
              </Box>
              <TrafficChart 
                data={trafficData} 
                loading={loading.traffic} 
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default DashboardPage;