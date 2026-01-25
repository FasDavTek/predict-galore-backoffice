/**
 * User Engagement Chart Component
 * Clean, simple implementation
 */

'use client';

import { useMemo, memo } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { designTokens } from '@/shared/styles/tokens';
import { useDashboardEngagement } from '@/features/dashboard';
import { TimeRange } from '@/shared/components/PageHeader';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TableLoadingState, TableErrorState } from '@/shared/components/TableStates';

interface UserEngagementChartProps {
  timeRange?: TimeRange;
}

const getDateRange = (timeRange: TimeRange = 'default') => {
  const now = new Date();
  const to = now.toISOString().split('T')[0];
  let from: string;

  switch (timeRange) {
    case 'today':
      from = to;
      break;
    case 'thisWeek':
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      from = weekAgo.toISOString().split('T')[0];
      break;
    case 'thisMonth':
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      from = monthAgo.toISOString().split('T')[0];
      break;
    default:
      from = new Date(2020, 0, 1).toISOString().split('T')[0];
  }

  return { from, to };
};

const UserEngagementChart = memo(function UserEngagementChart({
  timeRange = 'default',
}: UserEngagementChartProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _dateRange = useMemo(() => getDateRange(timeRange), [timeRange]);
  const { data, isLoading, error } = useDashboardEngagement();

  const chartData = useMemo(() => {
    // Handle the real API structure: data is an array of segments, each with points
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    // Get the first segment (usually segment 0 for all users)
    const firstSegment = data.find(segment => segment.segment === 0) || data[0];
    if (!firstSegment || !firstSegment.points || !Array.isArray(firstSegment.points)) return [];

    return firstSegment.points.map((point) => ({
      date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      activeUsers: point.activeUsers || 0,
      newUsers: 0, // Not provided in current API
      returningUsers: 0, // Not provided in current API
    }));
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <TableLoadingState message="Loading engagement data..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <TableErrorState
            colSpan={1}
            message="Failed to load engagement data"
            onRetry={() => {}}
          />
        </CardContent>
      </Card>
    );
  }

  // Handle empty data state
  if (!isLoading && (!chartData || chartData.length === 0)) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            User Engagement
          </Typography>
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body2" color="text.secondary">
              No engagement data available
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
              Data will appear here once users start engaging with the platform
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User Engagement
        </Typography>
        <Box sx={{ width: '100%', height: 400, mt: designTokens.spacing.itemGap }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="activeUsers" fill="#0EA5E9" name="Active Users" />
              <Bar dataKey="newUsers" fill="#10B981" name="New Users" />
              <Bar dataKey="returningUsers" fill="#3B82F6" name="Returning Users" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
});

UserEngagementChart.displayName = 'UserEngagementChart';

export default UserEngagementChart;
