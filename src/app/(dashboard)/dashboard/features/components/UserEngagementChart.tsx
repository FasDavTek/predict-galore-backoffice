import React, { useState, useMemo, useEffect } from "react";
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

// Define TimeRange type here or import it
export type TimeRange = 'default' | 'today' | 'thisWeek' | 'thisMonth' | 'lastMonth' | 'thisYear';

interface UserEngagementChartProps {
  refreshTrigger?: number;
  globalTimeRange?: TimeRange; // Add this prop
}

// Types for the engagement API response
interface EngagementPoint {
  date: string;
  activeUsers: number;
}

interface EngagementSegment {
  segment: number;
  points: EngagementPoint[];
}

interface EngagementApiResponse {
  success: boolean;
  message: string;
  errors: {
    code?: string;
    message?: string;
    details?: unknown[];
  } | null;
  data: EngagementSegment[];
}

const getSegmentDisplayName = (segment: number): string => {
  const names: Record<number, string> = {
    0: 'All Users',
    1: 'Active Users',
    2: 'Inactive Users',
    3: 'New Users',
    4: 'Returning Users'
  };
  return names[segment] || `Segment ${segment}`;
};

// Helper function to format dates
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to calculate date ranges
const calculateDateRange = (timeRange: TimeRange): { from: string; to: string } | undefined => {
  if (timeRange === 'default') {
    return undefined;
  }

  const today = new Date();
  const from = new Date(today);
  
  switch (timeRange) {
    case 'today':
      // Today only
      from.setDate(today.getDate());
      break;
    case 'thisWeek':
      // Start of current week (Sunday)
      from.setDate(today.getDate() - today.getDay());
      break;
    case 'thisMonth':
      // First day of current month
      from.setDate(1);
      break;
    case 'lastMonth':
      // First day of previous month to last day of previous month
      from.setMonth(today.getMonth() - 1);
      from.setDate(1);
      const to = new Date(from);
      to.setMonth(to.getMonth() + 1);
      to.setDate(0);
      return {
        from: formatDate(from),
        to: formatDate(to)
      };
    case 'thisYear':
      // January 1st of current year
      from.setMonth(0, 1);
      break;
    default:
      return undefined;
  }
  
  return {
    from: formatDate(from),
    to: formatDate(today)
  };
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

// Helper function to get segment colors
const getSegmentColor = (segment: number): string => {
  const colors: Record<number, string> = {
    0: '#42A605', // All Users - Green
    1: '#1976d2', // Active Users - Blue
    2: '#ed6c02', // Inactive Users - Orange
    3: '#9c27b0', // New Users - Purple
    4: '#2e7d32'  // Returning Users - Dark Green
  };
  return colors[segment] || '#42A605';
};

// Helper function to get segment background colors
const getSegmentBackgroundColor = (segment: number): string => {
  const colors: Record<number, string> = {
    0: 'rgba(66, 166, 5, 0.1)',
    1: 'rgba(25, 118, 210, 0.1)',
    2: 'rgba(237, 108, 2, 0.1)',
    3: 'rgba(156, 39, 176, 0.1)',
    4: 'rgba(46, 125, 50, 0.1)'
  };
  return colors[segment] || 'rgba(66, 166, 5, 0.1)';
};

export default function UserEngagementChart({ refreshTrigger, globalTimeRange = 'default' }: UserEngagementChartProps) {
  // Use the globalTimeRange prop as the default, but allow local override
  const [localTimeRange, setLocalTimeRange] = useState<TimeRange>(globalTimeRange);
  const [selectedSegment, setSelectedSegment] = useState<number>(0); // Default to All Users (segment 0)
  
  // Update localTimeRange when globalTimeRange changes
  useEffect(() => {
    setLocalTimeRange(globalTimeRange);
  }, [globalTimeRange]);
  
  // Calculate date range based on timeRange selection - returns undefined for 'default'
  const dateRange = calculateDateRange(localTimeRange);
  
  // Prepare query parameters - only include them when user has selected non-default values
  const queryParams = {
    ...(dateRange && { from: dateRange.from, to: dateRange.to }),
    ...(selectedSegment !== 0 && { segment: selectedSegment })
  };

  // Only pass query params if they have values, otherwise pass undefined for default behavior
  const shouldUseParams = Object.keys(queryParams).length > 0;
  
  const { data, isLoading, error, refetch } = useGetEngagementQuery(shouldUseParams ? queryParams : undefined);
  
  // Type assertion to handle the actual API response structure
  const engagementData = data as unknown as EngagementApiResponse;
  
  const hasError = !!error;
  
  // FIXED: Check if data exists and has segments with points
  const isEmpty = !engagementData?.data || 
                  engagementData.data.length === 0 || 
                  !engagementData.data.some(segment => 
                    segment.points && segment.points.length > 0 && 
                    segment.points.some(point => point.activeUsers > 0)
                  );

  // Refetch when refreshTrigger or filters change
  useEffect(() => {
    refetch();
  }, [refreshTrigger, localTimeRange, selectedSegment, refetch]);

  const handleTimeRangeChange = (event: SelectChangeEvent<TimeRange>) => {
    setLocalTimeRange(event.target.value as TimeRange);
  };

  const handleSegmentChange = (event: SelectChangeEvent<number>) => {
    setSelectedSegment(Number(event.target.value));
  };

  // Get available segments from API response
  const availableSegments = engagementData?.data || [];

  // Find the selected segment data
  const selectedSegmentData = availableSegments.find(segment => segment.segment === selectedSegment);

  const chartData: ChartData<"line"> = useMemo(() => {
    if (isEmpty || hasError || !selectedSegmentData || !selectedSegmentData.points) {
      return {
        labels: [],
        datasets: [
          {
            label: "Active Users",
            data: [],
            fill: false,
            tension: 0.4,
            borderColor: '#42A605',
            backgroundColor: 'rgba(66, 166, 5, 0.1)',
            borderWidth: 3,
            pointBackgroundColor: '#42A605',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 8,
          },
        ],
      };
    }

    // Format dates for better display based on time range
    const formatDateLabel = (dateString: string): string => {
      const date = new Date(dateString);
      
      switch (localTimeRange) {
        case 'today':
          return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        case 'thisWeek':
        case 'lastMonth':
          return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
        case 'thisMonth':
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        case 'thisYear':
          return date.toLocaleDateString('en-US', { month: 'short' });
        case 'default':
        default:
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    };

    // Sort points by date to ensure chronological order
    const sortedPoints = [...selectedSegmentData.points].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      labels: sortedPoints.map((point: EngagementPoint) => formatDateLabel(point.date)),
      datasets: [
        {
          label: getSegmentDisplayName(selectedSegment),
          data: sortedPoints.map((point: EngagementPoint) => point.activeUsers),
          fill: true,
          tension: 0.4,
          borderColor: getSegmentColor(selectedSegment),
          backgroundColor: getSegmentBackgroundColor(selectedSegment),
          borderWidth: 3,
          pointBackgroundColor: getSegmentColor(selectedSegment),
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 8,
        },
      ],
    };
  }, [selectedSegmentData, hasError, isEmpty, selectedSegment, localTimeRange]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          title: (context) => {
            if (selectedSegmentData?.points?.[context[0].dataIndex]?.date) {
              const pointDate = selectedSegmentData.points[context[0].dataIndex].date;
              const date = new Date(pointDate);
              
              // Different date formats based on time range
              switch (localTimeRange) {
                case 'today':
                  return date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                case 'thisWeek':
                  return date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                default:
                  return date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
              }
            }
            return '';
          },
          label: (context) => {
            const value = context.parsed.y;
            return `${getSegmentDisplayName(selectedSegment)}: ${value !== null ? value.toLocaleString() : '0'}`;
          }
        }
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
          precision: 0,
          callback: function(value) {
            return typeof value === 'number' ? value.toLocaleString() : value;
          }
        },
        title: {
          display: true,
          text: 'Active Users',
          color: 'rgba(0, 0, 0, 0.6)',
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.6)',
          maxTicksLimit: localTimeRange === 'today' ? 12 : 8
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
            <Box display="flex" gap={2}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={localTimeRange}
                  label="Time Range"
                  onChange={handleTimeRangeChange}
                >
                  <MenuItem value="default">Last 30 Days</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="thisWeek">This Week</MenuItem>
                  <MenuItem value="thisMonth">This Month</MenuItem>
                  <MenuItem value="lastMonth">Last Month</MenuItem>
                  <MenuItem value="thisYear">This Year</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>User Segment</InputLabel>
                <Select
                  value={selectedSegment}
                  label="User Segment"
                  onChange={handleSegmentChange}
                >
                  {availableSegments.map(segment => (
                    <MenuItem key={segment.segment} value={segment.segment}>
                      {getSegmentDisplayName(segment.segment)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
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
            User Engagement - {getSegmentDisplayName(selectedSegment)}
          </Typography>
          
          <Box display="flex" gap={2}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={localTimeRange}
                label="Time Range"
                onChange={handleTimeRangeChange}
              >
                <MenuItem value="default">Last 30 Days</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="thisWeek">This Week</MenuItem>
                <MenuItem value="thisMonth">This Month</MenuItem>
                <MenuItem value="lastMonth">Last Month</MenuItem>
                <MenuItem value="thisYear">This Year</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>User Segment</InputLabel>
              <Select
                value={selectedSegment}
                label="User Segment"
                onChange={handleSegmentChange}
              >
                {availableSegments.map(segment => (
                  <MenuItem key={segment.segment} value={segment.segment}>
                    {getSegmentDisplayName(segment.segment)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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

        {/* Chart Summary */}
        {!hasError && !isEmpty && selectedSegmentData && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {selectedSegmentData.points.length} data points
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {selectedSegmentData.points.reduce((sum, point) => sum + point.activeUsers, 0).toLocaleString()} users
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}