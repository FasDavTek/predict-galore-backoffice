import React, { useState, useMemo, useEffect, useRef } from "react";
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
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import LoadingState from "../../../../../shared/components/LoadingState";

// Define TimeRange type here or import it
export type TimeRange = 'default' | 'today' | 'thisWeek' | 'thisMonth' | 'lastMonth' | 'thisYear';

interface UserEngagementChartProps {
  refreshTrigger?: number;
  globalTimeRange?: TimeRange;
}

// Types for the engagement API response
interface EngagementPoint {
  date: string;
  activeUsers: number;
  predictions: number;
  successfulPredictions?: number;
  engagementScore?: number;
}

interface EngagementApiResponse {
  success: boolean;
  message: string;
  errors: {
    code?: string;
    message?: string;
    details?: unknown[];
  } | null;
  data: EngagementPoint[];
}

// ECharts tooltip parameter type
interface TooltipParams {
  componentType: string;
  seriesType: string;
  seriesIndex: number;
  seriesName: string;
  name: string;
  dataIndex: number;
  data: number;
  value: number | number[];
  color: string;
  dimensionNames?: string[];
  encode?: Record<string, number[]>;
  $vars: string[];
}

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
      from.setDate(today.getDate());
      break;
    case 'thisWeek':
      from.setDate(today.getDate() - today.getDay());
      break;
    case 'thisMonth':
      from.setDate(1);
      break;
    case 'lastMonth':
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
      height: 400, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <WarningIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No Engagement Data Available
      </Typography>
      <Typography variant="body2" color="text.secondary">
        User engagement data will appear here once users start making predictions
      </Typography>
    </Box>
  );
};

const ErrorChartState: React.FC = () => {
  return (
    <Box sx={{ 
      height: 400, 
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
        Please try refreshing the page or check your connection
      </Typography>
    </Box>
  );
};

export default function UserEngagementChart({ refreshTrigger, globalTimeRange = 'default' }: UserEngagementChartProps) {
  const [localTimeRange, setLocalTimeRange] = useState<TimeRange>(globalTimeRange);
  const chartRef = useRef<ReactECharts>(null);
  
  useEffect(() => {
    setLocalTimeRange(globalTimeRange);
  }, [globalTimeRange]);
  
  const dateRange = calculateDateRange(localTimeRange);
  
  const queryParams = {
    ...(dateRange && { from: dateRange.from, to: dateRange.to }),
  };

  const shouldUseParams = Object.keys(queryParams).length > 0;
  
  const { data, isLoading, error, refetch } = useGetEngagementQuery(shouldUseParams ? queryParams : undefined);
  
  const engagementData = data as unknown as EngagementApiResponse;
  
  const hasError = !!error;
  
  const isEmpty = !engagementData?.data || 
                  engagementData.data.length === 0 || 
                  !engagementData.data.some(point => point.activeUsers > 0);

  useEffect(() => {
    refetch();
  }, [refreshTrigger, localTimeRange, refetch]);

  const handleTimeRangeChange = (event: SelectChangeEvent<TimeRange>) => {
    setLocalTimeRange(event.target.value as TimeRange);
  };

  // Enhanced ECharts configuration
  const chartOption = useMemo(() => {
    if (isEmpty || hasError || !engagementData?.data) {
      return {
        title: {
          text: 'No Data Available',
          left: 'center',
          top: 'center',
          textStyle: {
            color: '#999',
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        xAxis: { show: false },
        yAxis: { show: false }
      };
    }

    // Sort points by date
    const sortedPoints = [...engagementData.data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Format labels based on time range
    const formatDateLabel = (dateString: string): string => {
      const date = new Date(dateString);
      
      switch (localTimeRange) {
        case 'today':
          return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        case 'thisWeek':
          return date.toLocaleDateString('en-US', { weekday: 'short' });
        case 'thisMonth':
        case 'lastMonth':
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        case 'thisYear':
          return date.toLocaleDateString('en-US', { month: 'short' });
        default:
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    };

    const dates = sortedPoints.map(point => formatDateLabel(point.date));
    const activeUsers = sortedPoints.map(point => point.activeUsers);
    const predictions = sortedPoints.map(point => point.predictions || 0);
    const successfulPredictions = sortedPoints.map(point => point.successfulPredictions || 0);

    // Calculate engagement score if available, otherwise use active users
    const engagementScores = sortedPoints.map(point => 
      point.engagementScore || point.activeUsers
    );

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ddd',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        },
        formatter: (params: TooltipParams[] | TooltipParams) => {
          // Handle both array and single parameter cases
          const tooltipParams = Array.isArray(params) ? params : [params];
          const dataIndex = tooltipParams[0]?.dataIndex ?? 0;
          
          const point = sortedPoints[dataIndex];
          if (!point) return '';

          let html = `<div style="font-weight: 600; margin-bottom: 8px;">${new Date(point.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</div>`;
          
          tooltipParams.forEach((param: TooltipParams) => {
            const value = typeof param.value === 'number' ? param.value.toLocaleString() : '0';
            html += `
              <div style="display: flex; align-items: center; margin: 4px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
                <span style="flex: 1;">${param.seriesName}:</span>
                <span style="font-weight: 600; margin-left: 8px;">${value}</span>
              </div>
            `;
          });
          
          return html;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        },
        axisLabel: {
          color: '#666',
          fontSize: 11
        }
      },
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ccc'
            }
          },
          axisLabel: {
            color: '#666',
            formatter: '{value}'
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
              type: 'dashed'
            }
          }
        },
        {
          type: 'value',
          position: 'right',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ccc'
            }
          },
          axisLabel: {
            color: '#666',
            formatter: '{value}'
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: 'Active Users',
          type: 'line',
          data: activeUsers,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: '#42A605'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(66, 166, 5, 0.1)' },
              { offset: 1, color: 'rgba(255, 255, 255, 0)' }
            ])
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2
            }
          }
        },
        {
          name: 'Predictions Made',
          type: 'line',
          data: predictions,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: '#ff6b35'
          },
          emphasis: {
            focus: 'series'
          }
        },
        {
          name: 'Successful Predictions',
          type: 'line',
          data: successfulPredictions,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: '#00b894'
          },
          emphasis: {
            focus: 'series'
          }
        },
        {
          name: 'Engagement Score',
          type: 'line',
          yAxisIndex: 1,
          data: engagementScores,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
            type: 'dashed',
            color: '#a29bfe'
          },
          emphasis: {
            focus: 'series'
          }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          type: 'slider',
          show: true,
          bottom: '2%',
          height: 20,
          backgroundColor: '#f8f9fa',
          borderColor: '#e9ecef',
          textStyle: {
            color: '#666'
          }
        }
      ]
    };
  }, [engagementData, hasError, isEmpty, localTimeRange]);

  if (isLoading) {
    return (
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              Sports Prediction Engagement
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
            </Box>
          </Box>
          <LoadingState
            variant="text"
            message="Loading engagement analytics..."
            height={400}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Sports Prediction Engagement
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track user activity, predictions, and engagement over time
            </Typography>
          </Box>
          
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
          </Box>
        </Box>

        <Box sx={{ height: 400 }}>
          {hasError ? (
            <ErrorChartState />
          ) : isEmpty ? (
            <EmptyChartState />
          ) : (
            <ReactECharts
              ref={chartRef}
              option={chartOption}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          )}
        </Box>

        {/* Enhanced Summary Stats */}
        {!hasError && !isEmpty && engagementData?.data && (
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            backgroundColor: 'grey.50', 
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box textAlign="center">
              <Typography variant="h6" color="primary.main" fontWeight={600}>
                {engagementData.data.reduce((sum, point) => sum + point.activeUsers, 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Active Users
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" color="success.main" fontWeight={600}>
                {engagementData.data.reduce((sum, point) => sum + (point.predictions || 0), 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Predictions Made
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" color="info.main" fontWeight={600}>
                {engagementData.data.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Data Points
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" color="warning.main" fontWeight={600}>
                {engagementData.data.length > 0 
                  ? Math.round(engagementData.data.reduce((sum, point) => sum + (point.engagementScore || point.activeUsers), 0) / engagementData.data.length)
                  : 0
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Engagement
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}