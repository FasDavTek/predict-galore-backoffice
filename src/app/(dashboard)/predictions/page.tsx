/**
 * Predictions Page
 * Clean, simple implementation
 */

'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { PageHeader, TimeRange } from '@/shared/components/PageHeader';
import { designTokens } from '@/shared/styles/tokens';
import { PredictionsTable } from './features/components/PredictionsTable';
import { PredictionAnalytics } from './features/components/PredictionAnalytics';
import { PredictionsPageLoadingSkeleton } from './features/components/PredictionsPageLoadingSkeleton';
import { usePredictions, usePredictionsAnalytics, useDeletePrediction, PredictionsFilter, Prediction } from '@/features/predictions';
import { useAuth } from '@/features/auth';
import { getTimeRangeDates } from '@/shared/lib/helpers';
import { useQueryClient } from '@tanstack/react-query';
import withAuth from '@/hoc/with-auth';

function PredictionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('default');
  
  // Get date range from time range filter
  const dateRange = useMemo(() => getTimeRangeDates(timeRange), [timeRange]);
  
  const [filters, setFilters] = useState<PredictionsFilter>({
    page: 1,
    limit: 10,
  });
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);

  // Merge date range into filters
  const filtersWithDateRange = useMemo(() => ({
    ...filters,
    ...(dateRange ? { startDate: dateRange.from, endDate: dateRange.to } : {}),
  }), [filters, dateRange]);

  const { data, isLoading, error, refetch } = usePredictions(filtersWithDateRange);
  const { isLoading: isAnalyticsLoading, refetch: refetchAnalytics } = usePredictionsAnalytics();
  const deletePrediction = useDeletePrediction();

  // Show loading until both queries are complete
  const isPageLoading = isLoading || isAnalyticsLoading || isRefreshing;

  const predictions = useMemo(() => data?.predictions || [], [data?.predictions]);
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
        queryClient.invalidateQueries({ queryKey: ['predictions'] }),
        queryClient.invalidateQueries({ queryKey: ['predictions-analytics'] }),
        refetch(),
        refetchAnalytics(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, refetchAnalytics, queryClient]);

  const handleFilterChange = useCallback((newFilters: Partial<PredictionsFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handleAddPrediction = useCallback(() => {
    router.push('/predictions/new');
  }, [router]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEditPrediction = useCallback((_prediction: Prediction) => {
    // TODO: Implement edit functionality when PredictionForm supports editing
    router.push('/predictions/new');
  }, [router]);

  const handleDeletePrediction = useCallback(async (prediction: Prediction) => {
    if (confirm(`Are you sure you want to delete this prediction?`)) {
      await deletePrediction.mutateAsync(String(prediction.id));
      refetch();
      if (selectedPrediction?.id === prediction.id) {
        setSelectedPrediction(null);
      }
    }
  }, [deletePrediction, refetch, selectedPrediction]);

  const handlePredictionSelect = useCallback((prediction: Prediction | null) => {
    setSelectedPrediction(prediction);
  }, []);

  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    setTimeRange(range);
    // Reset to first page when time range changes
    setFilters((prev) => ({ ...prev, page: 1 }));
    // Invalidate queries when time range changes to trigger refetch with new dates
    queryClient.invalidateQueries({ queryKey: ['predictions'] });
    queryClient.invalidateQueries({ queryKey: ['predictions-analytics'] });
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
        title="Prediction Management"
        defaultSubtitle="Welcome {firstName}! Create and manage predictions."
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onRefresh={handleRefresh}
        user={user}
      />

      {isPageLoading ? (
        <PredictionsPageLoadingSkeleton />
      ) : (
        <>
          <PredictionAnalytics />

          <PredictionsTable
            predictions={predictions}
            pagination={pagination}
            isLoading={isLoading}
            error={error}
            filters={filtersWithDateRange}
            onFilterChange={handleFilterChange}
            onAddPrediction={handleAddPrediction}
            onEditPrediction={handleEditPrediction}
            onDeletePrediction={handleDeletePrediction}
            onRefresh={handleRefresh}
            selectedPrediction={selectedPrediction}
            onPredictionSelect={handlePredictionSelect}
          />
        </>
      )}
    </Box>
  );
}

export default withAuth(memo(PredictionsPage));
