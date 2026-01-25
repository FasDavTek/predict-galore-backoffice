/**
 * Users Page
 * Clean, simple implementation
 */

'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { PageHeader, TimeRange } from '@/shared/components/PageHeader';
import { designTokens } from '@/shared/styles/tokens';
import { UsersTable } from './features/components/UsersTable';
import { UserAnalytics } from './features/components/UserAnalytics';
import { UsersPageLoadingSkeleton } from './features/components/UsersPageLoadingSkeleton';
import { useUsers, useUsersStore, UsersFilter, User } from '@/features/users';
import { useAuth } from '@/features/auth';
import { getTimeRangeUtcDates } from '@/shared/lib/helpers';
import { useQueryClient } from '@tanstack/react-query';
import withAuth from '@/hoc/with-auth';

function UsersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { filters, setFilters, clearFilters } = useUsersStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('default');

  // Get UTC date range from time range filter
  const dateRange = useMemo(() => getTimeRangeUtcDates(timeRange), [timeRange]);

  // Convert store filters to API filters
  const apiFilters: UsersFilter = useMemo(() => ({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    status: filters.status,
    plan: filters.plan,
    role: filters.role,
    ...(dateRange ? { FromUtc: dateRange.fromUtc, ToUtc: dateRange.toUtc } : {}),
  }), [filters, dateRange]);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading, error, refetch } = useUsers(apiFilters);

  const users = useMemo(() => data?.users || [], [data?.users]);
  const pagination = useMemo(() => {
    if (!data?.pagination) return null;
    return {
      page: data.pagination.page,
      limit: data.pagination.limit,
      total: data.pagination.total,
      totalPages: data.pagination.totalPages,
    };
  }, [data]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['users'] }),
        queryClient.invalidateQueries({ queryKey: ['users-analytics'] }),
        refetch(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, queryClient]);

  const handleAddUser = useCallback(() => {
    router.push('/users/new');
  }, [router]);


  const handleUserSelect = useCallback((user: User | null) => {
    setSelectedUser(user);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<UsersFilter>) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    setTimeRange(range);
    // Invalidate queries when time range changes to trigger refetch with new dates
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.invalidateQueries({ queryKey: ['users-analytics'] });
  }, [queryClient]);


  return (
    <Box
      sx={{
        // maxWidth: 1536, // 2xl breakpoint (96rem = 1536px)
        width: '100%',
        px: { xs: 2, sm: 3, md: 4 },
        py: designTokens.spacing.xl,
      }}
    >
      <PageHeader
        title="User Management"
        defaultSubtitle="Welcome {firstName}! Manage your platform users."
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onRefresh={handleRefresh}
        user={user}
      />

      {(isLoading || isRefreshing) ? (
        <UsersPageLoadingSkeleton />
      ) : (
        <>
          <UserAnalytics />

          <UsersTable
        users={users}
        pagination={pagination}
        isLoading={isLoading}
        error={error}
        filters={apiFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        onAddUser={handleAddUser}
        onRefresh={handleRefresh}
        selectedUser={selectedUser}
        onUserSelect={handleUserSelect}
          />
        </>
      )}
    </Box>
  );
}

export default withAuth(memo(UsersPage));
