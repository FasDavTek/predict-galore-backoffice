import React from "react";
import { Box } from "@mui/material";
import { useGetAnalyticsQuery } from "../api/dashboardApi";
import DashboardAnalytics from "../components/DashboardAnalytics";
import { TimeRange } from "./DashboardHeader";
import EmptyState from "../../../components/EmptyState";
import ErrorState from "../../../components/ErrorState";
import LoadingState from "../../../components/LoadingState";

interface AnalyticsGridProps {
  timeRange?: TimeRange;
}

export default function AnalyticsGrid({ timeRange }: AnalyticsGridProps) {
  const queryParams = timeRange && timeRange !== 'default' ? { range: timeRange } : undefined;
  const { data, isLoading, error, refetch } = useGetAnalyticsQuery(queryParams);

  const stats = data?.data ?? [];

  // Handle error state
  if (error) {
    return (
      <Box sx={{ mb: 3 }}>
        <ErrorState
          variant="api"
          title="Failed to Load Analytics"
          message="We couldn't load the analytics data. This might be due to a temporary server issue."
          retryAction={{ 
            label: "Retry Analytics", 
            onClick: refetch 
          }}
          height={200}
        />
      </Box>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <Box sx={{ mb: 3 }}>
        <LoadingState
          variant="text"
          message="Loading analytics..."
          skeletonLines={4}
          height={200}
        />
      </Box>
    );
  }

  // Handle empty state
  if (stats.length === 0) {
    return (
      <Box sx={{ mb: 3 }}>
        <EmptyState
          variant="data"
          title="No Analytics Data"
          description="There's no analytics data available for the selected time period. Data will appear once users start interacting with your platform."
          primaryAction={{
            label: "Refresh Data",
            onClick: refetch,
          }}
          height={200}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: 2 
      }}>
        {stats.map((card, idx) => (
          <Box key={card.id ?? idx} sx={{ 
            flex: { 
              xs: '1 1 100%', 
              sm: '1 1 calc(50% - 8px)', 
              md: '1 1 calc(25% - 8px)' 
            },
            minWidth: { xs: '100%', sm: 250 }
          }}>
            <DashboardAnalytics
              title={card.title}
              value={card.value}
              change={card.change}
              loading={false}
              bgColor={card.bgColor}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}