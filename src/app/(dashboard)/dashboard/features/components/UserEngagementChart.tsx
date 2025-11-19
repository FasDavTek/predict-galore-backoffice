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
  SelectChangeEvent,
} from "@mui/material";
import { 
  Warning as WarningIcon,
} from "@mui/icons-material";
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
import LoadingState from "../../../../../components/LoadingState";

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
  refreshTrigger?: number;
}

type ChartTimeRange = 'default' | 'today' | 'thisWeek' | 'thisMonth' | 'lastMonth' | 'thisYear';

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

const EmptyChartState: React.FC = () => {
  return (
    <Box sx={{ 
      height: 300, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <WarningIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No Engagement Data
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Engagement data will appear here once available
      </Typography>
    </Box>
  );
};

const ErrorChartState: React.FC = () => {
  return (
    <Box sx={{ 
      height: 300, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      backgroundColor: '#FEF2F2',
    }}>
      <WarningIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" color="error.main" gutterBottom>
        Unable to Load Engagement Data
      </Typography>
      <Typography variant="body2" color="text.secondary">
        There was an error loading the engagement data
      </Typography>
    </Box>
  );
};

export default function UserEngagementChart({ globalTimeRange, refreshTrigger }: UserEngagementChartProps) {
  const [localTimeRange, setLocalTimeRange] = useState<ChartTimeRange>('default');
  
  const effectiveTimeRange = globalTimeRange || localTimeRange;
  
  const queryParams = effectiveTimeRange !== 'default' ? { range: effectiveTimeRange } : undefined;
  
  const { data, isLoading, error, refetch } = useGetEngagementQuery(queryParams);
  
  const hasError = !!error;
  const isEmpty = !data?.data || data.data.length === 0;

  // Refetch when refreshTrigger changes
  React.useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const handleTimeRangeChange = (event: SelectChangeEvent<ChartTimeRange>) => {
    setLocalTimeRange(event.target.value as ChartTimeRange);
  };

  const chartData: ChartData<"line"> = useMemo(() => {
    if (isEmpty || hasError) {
      return {
        labels: [],
        datasets: [
          {
            label: "Engagement",
            data: [],
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
    }

    return {
      labels: data.data.map((p) => p.label),
      datasets: [
        {
          label: "Engagement",
          data: data.data.map((p) => p.value),
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
  }, [data, hasError, isEmpty]);

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

        <Box sx={{ height: 300 }}>
          {hasError ? (
            <ErrorChartState />
          ) : isEmpty ? (
            <EmptyChartState />
          ) : (
            <Line data={chartData} options={options} />
          )}
        </Box>

     
      </CardContent>
    </Card>
  );
}