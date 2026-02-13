/**
 * Transactions Page (Client)
 * Clean, simple implementation
 */

'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import { PageHeader, TimeRange } from '@/shared/components/PageHeader';
import { designTokens } from '@/shared/styles/tokens';
import dynamic from 'next/dynamic';
import { TransactionsPageLoadingSkeleton } from './features/components/TransactionsPageLoadingSkeleton';
import { useTransactions, TransactionsFilter, Transaction } from '@/features/transactions';
import { useAuth } from '@/features/auth';
import { getTimeRangeDates } from '@/shared/lib/helpers';
import { useQueryClient } from '@tanstack/react-query';

const TransactionAnalytics = dynamic(() => import('./features/components/TransactionAnalytics').then((mod) => mod.TransactionAnalytics), {
  loading: () => <TransactionsPageLoadingSkeleton />,
  ssr: false,
});
const TransactionsTable = dynamic(() => import('./features/components/TransactionsTable').then((mod) => mod.TransactionsTable), {
  loading: () => <TransactionsPageLoadingSkeleton />,
  ssr: false,
});

function TransactionsPageClient() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('default');
  
  // Get date range from time range filter
  const dateRange = useMemo(() => getTimeRangeDates(timeRange), [timeRange]);
  
  const [filters, setFilters] = useState<TransactionsFilter>({
    page: 1,
    limit: 10,
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Merge date range into filters
  const filtersWithDateRange = useMemo(() => ({
    ...filters,
    ...(dateRange ? { startDate: dateRange.from, endDate: dateRange.to } : {}),
  }), [filters, dateRange]);

  const { data, isLoading, error, refetch } = useTransactions(filtersWithDateRange);

  const transactions = useMemo(() => data?.transactions || [], [data?.transactions]);
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
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['transactions-analytics'] }),
        refetch(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, queryClient]);

  const handleFilterChange = useCallback((newFilters: Partial<TransactionsFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    setTimeRange(range);
    // Reset to first page when time range changes
    setFilters((prev) => ({ ...prev, page: 1 }));
    // Invalidate queries when time range changes to trigger refetch with new dates
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['transactions-analytics'] });
  }, [queryClient]);

  const handleTransactionSelect = useCallback((transaction: Transaction | null) => {
    setSelectedTransaction(transaction);
  }, []);

  const handleViewDetails = useCallback((transaction: Transaction) => {
    router.push(`/transactions/${String(transaction.id)}`);
  }, [router]);

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
        title="Transaction Management"
        defaultSubtitle="Welcome {firstName}! Manage and monitor all transactions."
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onRefresh={handleRefresh}
        user={user}
      />

      {(isLoading || isRefreshing) ? (
        <TransactionsPageLoadingSkeleton />
      ) : (
        <>
          <TransactionAnalytics />

          <TransactionsTable
            transactions={transactions}
            pagination={pagination}
            isLoading={isLoading}
            error={error}
            filters={filtersWithDateRange}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
            selectedTransaction={selectedTransaction}
            onTransactionSelect={handleTransactionSelect}
            onViewDetails={handleViewDetails}
          />
        </>
      )}
    </Box>
  );
}

export default memo(TransactionsPageClient);
