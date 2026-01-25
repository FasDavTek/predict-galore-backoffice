/**
 * Dashboard Page
 * Clean, simple implementation
 */

'use client';

import { PageHeader, TimeRange } from '@/shared/components/PageHeader';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import DashboardAnalytics from './features/components/DashboardAnalytics';
import UserEngagementChart from './features/components/UserEngagementChart';
import Traffic from './features/components/Traffic';
import ActivityLog from './features/components/ActivityLog';
import { DashboardPageLoadingSkeleton } from './features/components/DashboardPageLoadingSkeleton';
import { useAuth } from '@/features/auth';
import { useState, useCallback, memo, useMemo } from 'react';
import { useDashboardSummary, useDashboardEngagement, useDashboardTraffic, useDashboardActivity } from '@/features/dashboard';
import { getTimeRangeDates } from '@/shared/lib/helpers';
import { useQueryClient } from '@tanstack/react-query';
import withAuth from '@/hoc/with-auth';

function DashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [timeRange, setTimeRange] = useState<TimeRange>('default');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get date range from time range filter
  const dateRange = useMemo(() => getTimeRangeDates(timeRange), [timeRange]);

  // Fetch all dashboard data at page level to coordinate loading
  const { isLoading: isSummaryLoading, refetch: refetchSummary } = useDashboardSummary(dateRange || undefined);
  const { isLoading: isEngagementLoading, refetch: refetchEngagement } = useDashboardEngagement();
  const { isLoading: isTrafficLoading, refetch: refetchTraffic } = useDashboardTraffic();
  const { isLoading: isActivityLoading, refetch: refetchActivity } = useDashboardActivity();

  // Show loading until all critical queries are complete
  const isPageLoading = isSummaryLoading || isEngagementLoading || isTrafficLoading || isActivityLoading || isRefreshing;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Invalidate and refetch all dashboard queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-engagement'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-traffic'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] }),
        refetchSummary(),
        refetchEngagement(),
        refetchTraffic(),
        refetchActivity(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient, refetchSummary, refetchEngagement, refetchTraffic, refetchActivity]);

  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    setTimeRange(range);
    // Invalidate queries when time range changes to trigger refetch with new dates
    queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-engagement'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-traffic'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] });
  }, [queryClient]);

  return (
    <Box
      sx={{
        // maxWidth: 1536, 
        width: '100%',
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
      }}
    >
      <PageHeader
        title="Dashboard Overview"
        defaultSubtitle="Welcome {firstName}! Here's what's happening with your platform today."
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onRefresh={handleRefresh}
        user={user}
      />

      {/* Show loading skeleton while loading */}
      {isPageLoading ? (
        <DashboardPageLoadingSkeleton />
      ) : (
        <>
          <DashboardAnalytics timeRange={timeRange} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
              gap: 3,
              mt: 3,
            }}
          >
            <Box>
              <Stack spacing={3}>
                <UserEngagementChart timeRange={timeRange} />
                <Traffic />
              </Stack>
            </Box>

            <Box>
              <ActivityLog />
            </Box>
          </Box>
        </>
      )}

    </Box>
  );
}

export default withAuth(memo(DashboardPage));
