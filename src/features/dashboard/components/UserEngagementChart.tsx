import React, { useState, useMemo } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from "@mui/material";
import { useGetEngagementQuery } from "../api/dashboardApi";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { TimeRange } from "./DashboardHeader";
import EmptyState from "../../../components/EmptyState";
import ErrorState from "../../../components/ErrorState";
import LoadingState from "../../../components/LoadingState";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface UserEngagementChartProps {
  globalTimeRange?: TimeRange;
}

// Define available time ranges
type ChartTimeRange = 'default' | 'today' | 'thisWeek' | 'thisMonth' | 'lastMonth' | 'thisYear';

// Get display label for current range - moved outside component to avoid declaration order issues
const getRangeDisplayLabel = (range: TimeRange): string => {
  const labels: Record<TimeRange, string> = {
    default: 'All Time',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    thisYear: 'This Year'
  };
  return labels[range];
};

export default function UserEngagementChart({ globalTimeRange }: UserEngagementChartProps) {
  // Local filter state for component-specific control
  const [localTimeRange, setLocalTimeRange] = useState<ChartTimeRange>('default');
  
  // Use global time range if provided, otherwise use local
  const effectiveTimeRange = globalTimeRange || localTimeRange;
  
  // Only pass range to API if it's not 'default'
  const queryParams = effectiveTimeRange !== 'default' ? { range: effectiveTimeRange } : undefined;
  
  const { data, isLoading, error, refetch } = useGetEngagementQuery(queryParams);

  // Handle local filter change
  const handleTimeRangeChange = (event: SelectChangeEvent<ChartTimeRange>) => {
    setLocalTimeRange(event.target.value as ChartTimeRange);
  };

  // Transform data for chart - MUST be called unconditionally
  const chartData: ChartData<"line"> = useMemo(() => {
    const points = data?.data ?? [];
    
    return {
      labels: points.map((p) => p.label),
      datasets: [
        {
          label: "Engagement",
          data: points.map((p) => p.value),
          fill: false,
          tension: 0.2,
          borderColor: '#42A605',
          backgroundColor: 'rgba(66, 166, 5, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#42A605',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [data]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        display: false 
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.6)',
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.6)',
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
  };

  // Handle error state - AFTER all hooks
  if (error) {
    return (
     <Box sx={{ mb: 3 }}>
          <ErrorState
            variant="api"
            title="Failed to Load Engagement Data"
            message="We couldn't load the user engagement chart. This might be due to a temporary server issue."
            retryAction={{ 
              label: "Retry Chart", 
              onClick: refetch 
            }}
            height={300}
          />
     </Box>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              User Engagement
            </Typography>
            {globalTimeRange && globalTimeRange !== 'default' ? (
              <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                Using Global Filter: {getRangeDisplayLabel(globalTimeRange)}
              </Typography>
            ) : (
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={localTimeRange}
                  label="Time Range"
                  onChange={handleTimeRangeChange}
                >
                  <MenuItem value="default">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="thisWeek">This Week</MenuItem>
                  <MenuItem value="thisMonth">This Month</MenuItem>
                  <MenuItem value="lastMonth">Last Month</MenuItem>
                  <MenuItem value="thisYear">This Year</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
          <LoadingState
            variant="text"
            message="Loading engagement chart..."
            height={300}
          />
        </CardContent>
      </Card>
    );
  }

  // Handle empty state - AFTER all hooks
  if (!data || data.data.length === 0) {
    return (
     <Box sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              User Engagement
            </Typography>
            
            {globalTimeRange && globalTimeRange !== 'default' ? (
              <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                Using Global Filter: {getRangeDisplayLabel(globalTimeRange)}
              </Typography>
            ) : (
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={localTimeRange}
                  label="Time Range"
                  onChange={handleTimeRangeChange}
                >
                  <MenuItem value="default">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="thisWeek">This Week</MenuItem>
                  <MenuItem value="thisMonth">This Month</MenuItem>
                  <MenuItem value="lastMonth">Last Month</MenuItem>
                  <MenuItem value="thisYear">This Year</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
          
          <EmptyState
            variant="data"
            title="No Engagement Data"
            description="There's no user engagement data available for the selected time period. Data will appear once users start interacting with your platform."
            primaryAction={{
              label: "Try Different Range",
              onClick: () => setLocalTimeRange('thisMonth'),
            }}
            secondaryAction={{
              label: "Refresh Data",
              onClick: refetch,
            }}
            height={300}
          />
     </Box>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            User Engagement
          </Typography>
          
          {/* Show indicator when using global filter */}
          {globalTimeRange && globalTimeRange !== 'default' ? (
            <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
              Using Global Filter: {getRangeDisplayLabel(globalTimeRange)}
            </Typography>
          ) : (
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={localTimeRange}
                label="Time Range"
                onChange={handleTimeRangeChange}
              >
                <MenuItem value="default">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="thisWeek">This Week</MenuItem>
                <MenuItem value="thisMonth">This Month</MenuItem>
                <MenuItem value="lastMonth">Last Month</MenuItem>
                <MenuItem value="thisYear">This Year</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>

        <Box sx={{ height: 300 }}>
          <Line data={chartData} options={options} />
        </Box>

        {/* Show current filter info */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {getRangeDisplayLabel(effectiveTimeRange)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}