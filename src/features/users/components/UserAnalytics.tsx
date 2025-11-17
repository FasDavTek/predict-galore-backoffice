import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as UsersIcon,
  Person as UserIcon,
  PersonAdd as NewUserIcon,
  Star as PremiumIcon,
} from '@mui/icons-material';
import { useGetUsersAnalyticsQuery } from '../api/userApi';
import { AnalyticsCardProps, UserAnalyticsProps } from '../types/analytics.types';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';

// Individual analytics card component
const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  isLoading = false,
}) => {
  const theme = useTheme();
  const isPositive = change >= 0;

  // Show skeleton while loading
  if (isLoading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <LoadingState
            variant="skeleton"
            skeletonLines={3}
            height={120}
            message=""
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(color, 0.15)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={500} gutterBottom>
              {title}
            </Typography>
            
            <Typography variant="h4" fontWeight="bold" color={color} gutterBottom>
              {value}
            </Typography>

            {/* Change indicator with trend arrow */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isPositive ? <TrendingUpIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                : <TrendingDownIcon sx={{ color: theme.palette.error.main, fontSize: 20 }} />}
              
              <Typography variant="body2" fontWeight={600}
                color={isPositive ? theme.palette.success.main : theme.palette.error.main}>
                {isPositive ? '+' : ''}{change}%
              </Typography>
              
              <Typography variant="caption" color="text.secondary">
                vs last period
              </Typography>
            </Box>
          </Box>

          {/* Metric icon */}
          <Box sx={{ backgroundColor: alpha(color, 0.1), borderRadius: '12px', width: 48, height: 48,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const UserAnalytics: React.FC<UserAnalyticsProps> = ({ dateRange }) => {
  // Fetch analytics data from API
  const { data: analyticsResponse, isLoading, error, refetch } = useGetUsersAnalyticsQuery();
  const analytics = analyticsResponse?.data;

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ mb: 4 }}>
        <LoadingState
          variant="skeleton"
          skeletonLines={4}
          height={160}
          message="Loading analytics..."
          contained={true}
        />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ mb: 4 }}>
        <ErrorState
          variant="api"
          title="Failed to Load Analytics"
          message="We couldn't load the user analytics data. Please try again."
          retryAction={{
            onClick: refetch,
            label: 'Retry'
          }}
          height={200}
        />
      </Box>
    );
  }

  // Analytics metrics configuration
  const analyticsData = [
    { title: 'Total Users', value: analytics?.totalUsers?.toLocaleString() || '0', change: analytics?.totalChange || 0,
      icon: <UsersIcon />, color: '#6366F1' },
    { title: 'Active Users', value: analytics?.activeUsers?.toLocaleString() || '0', change: analytics?.activeChange || 0,
      icon: <UserIcon />, color: '#10B981' },
    { title: 'New Users', value: analytics?.newUsers?.toLocaleString() || '0', change: analytics?.newChange || 0,
      icon: <NewUserIcon />, color: '#3B82F6' },
    { title: 'Premium Users', value: analytics?.premiumUsers?.toLocaleString() || '0', change: analytics?.premiumChange || 0,
      icon: <PremiumIcon />, color: '#F59E0B' },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>User Analytics</Typography>
      
      {/* Analytics grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {analyticsData.map((metric, index) => (
        <AnalyticsCard key={index} {...metric} isLoading={false} />
      ))}
    </div>

      {/* Analytics metadata */}
      {/* {analytics && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Typography variant="caption" color="text.secondary">Last updated: {new Date().toLocaleTimeString()}</Typography>
          <Typography variant="caption" color="text.secondary">Data period: Last 30 days</Typography>
        </Box>
      )} */}
    </Box>
  );
};