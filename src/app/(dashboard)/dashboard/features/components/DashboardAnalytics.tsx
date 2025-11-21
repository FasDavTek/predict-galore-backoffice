import React from "react";
import { 
  Box,
  Card,
  CardContent,
  Typography,
  Skeleton,
} from "@mui/material";
import { 
  TrendingUp as ArrowUpIcon,
  TrendingDown as ArrowDownIcon,
  People as UsersIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as RevenueIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useGetDashboardSummaryQuery } from "../api/dashboardApi";
import { TimeRange } from "./DashboardHeader";

interface AnalyticsCardConfig {
  title: string;
  bgColor: string;
  textColor: string;
  iconColor: string;
  icon: React.ReactElement;
  format: (value: number | undefined) => string;
}

interface AnalyticsCardProps {
  title: string;
  value: string;
  change?: string;
  loading?: boolean;
  config: AnalyticsCardConfig;
}

interface DashboardAnalyticsProps {
  timeRange?: TimeRange;
  refreshTrigger?: number;
}

// Types that match the actual API response structure
interface MetricValue {
  currentValue: number;
  previousValue: number;
  percentageChange: number;
  trend: number;
}

interface UsersSection {
  totalUsers: MetricValue;
  freeUsers: MetricValue;
  premiumUsers: MetricValue;
}

interface PaymentsSection {
  totalPayments: MetricValue;
  totalAmountCurrent: number;
  totalAmountPrevious: number;
  amountPercentageChange: number;
  amountTrend: number;
}

interface EngagementPoint {
  date: string;
  activeUsers: number;
}

interface EngagementSegment {
  segment: number;
  points: EngagementPoint[];
}

interface TrafficData {
  dimension: number;
  items: unknown[];
}

interface ActivityItem {
  id: number;
  createdAtUtc: string;
  title: string;
  description: string;
  actorDisplayName: string;
  actorRole: string | null;
  category: string;
}

interface RecentActivity {
  totalItems: number;
  success: boolean;
  currentPage: number;
  pageSize: number;
  resultItems: ActivityItem[];
  totalPages: number;
  message: string | null;
}

// This should match the actual SummaryData structure from the API response
interface DashboardSummaryResponse {
  range: {
    from: string;
    to: string;
  };
  users: UsersSection;
  payments: PaymentsSection;
  engagement: EngagementSegment[];
  traffic: TrafficData;
  recentActivity: RecentActivity;
}

// Analytics config type
interface AnalyticsConfig {
  title: string;
  bgColor: string;
  textColor: string;
  iconColor: string;
  icon: React.ReactElement;
  getValue: (data: DashboardSummaryResponse | undefined) => number | undefined;
  getChange: (data: DashboardSummaryResponse | undefined) => number | undefined;
  getTrend: (data: DashboardSummaryResponse | undefined) => number;
  format: (value: number | undefined) => string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, 
  value, 
  change = '0%', 
  loading = false, 
  config,
}) => {
  const isPositive = parseFloat(change) >= 0;
  
  if (loading) {
    return (
      <Card sx={{ 
        border: 'none', 
        boxShadow: 'none', 
        height: '140px',
        borderRadius: 2
      }}>
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            height: '100%'
          }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="70%" height={20} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="90%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="60%" height={18} />
            </Box>
            <Skeleton 
              variant="circular" 
              width={48} 
              height={48} 
              sx={{ flexShrink: 0 }}
            />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      border: 'none',
      backgroundColor: config.bgColor,
      boxShadow: 'none',
      borderRadius: 2,
      height: '140px',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
      }
    }}>
      <CardContent sx={{ 
        p: 3, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 2
        }}>
          <Typography sx={{ 
            color: config.textColor, 
            fontSize: '0.875rem', 
            fontWeight: 600, 
            opacity: 0.9,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {title}
          </Typography>
          
          {/* Icon Container */}
          <Box sx={{ 
            bgcolor: `${config.iconColor}15`,
            width: 48,
            height: 48,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: `1px solid ${config.iconColor}20`
          }}>
            <Box sx={{ 
              color: config.iconColor, 
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {config.icon}
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box>
          {/* Value */}
          <Typography variant="h4" sx={{ 
            color: config.textColor, 
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2rem' },
            lineHeight: 1.2,
            mb: 1
          }}>
            {value}
          </Typography>
          
          {/* Change Indicator */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1 
          }}>
            {/* Trend Icon with Background */}
            <Box sx={{
              width: 24,
              height: 24,
              borderRadius: '6px',
              backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isPositive ? (
                <ArrowUpIcon sx={{ 
                  color: '#10B981',
                  width: 14, 
                  height: 14 
                }} />
              ) : (
                <ArrowDownIcon sx={{ 
                  color: '#EF4444',
                  width: 14, 
                  height: 14 
                }} />
              )}
            </Box>

            {/* Change Percentage */}
            <Typography sx={{ 
              color: isPositive ? '#10B981' : '#EF4444',
              fontSize: '0.875rem', 
              fontWeight: 600,
              lineHeight: 1
            }}>
              {change}%
            </Typography>

            {/* Comparison Text */}
            <Typography sx={{ 
              color: config.textColor, 
              fontSize: '0.75rem', 
              fontWeight: 500,
              opacity: 0.7,
              lineHeight: 1
            }}>
              vs previous
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const ErrorAnalyticsCard: React.FC = () => {
  return (
    <Card sx={{ 
      border: 'none',
      backgroundColor: '#FEF2F2',
      boxShadow: 'none',
      height: '140px'
    }}>
      <CardContent sx={{ 
        p: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <WarningIcon sx={{ color: '#DC2626', fontSize: 32, mb: 1 }} />
        <Typography variant="h6" color="#DC2626" gutterBottom>
          Unable to load analytics data
        </Typography>
      </CardContent>
    </Card>
  );
};

const EmptyAnalyticsState: React.FC = () => {
  return (
    <Card sx={{ 
      border: 'none',
      backgroundColor: '#F8FAFC',
      boxShadow: 'none',
      height: '140px'
    }}>
      <CardContent sx={{ 
        p: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <WarningIcon sx={{ color: 'grey.400', fontSize: 32, mb: 1 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Analytics Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
          Analytics data will appear here once available
        </Typography>
      </CardContent>
    </Card>
  );
};

// Helper function to calculate date range based on timeRange
const calculateDateRange = (timeRange: TimeRange): { from: string; to: string } | undefined => {
  if (timeRange === 'default') {
    return undefined;
  }

  const now = new Date();
  const to = new Date(now);
  const from = new Date(now);

  switch (timeRange) {
    case 'today':
      from.setDate(now.getDate() - 1);
      break;
    case 'thisWeek':
      from.setDate(now.getDate() - 7);
      break;
    case 'thisMonth':
      from.setDate(now.getDate() - 30);
      break;
    case 'lastMonth':
      from.setMonth(now.getMonth() - 2);
      to.setMonth(now.getMonth() - 1);
      // Set to the last day of the previous month
      to.setDate(0);
      break;
    case 'thisYear':
      from.setFullYear(now.getFullYear() - 1);
      break;
    default:
      // Default to last 30 days for any unknown time range
      from.setDate(now.getDate() - 30);
      break;
  }

  // Format dates to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    from: formatDate(from),
    to: formatDate(to)
  };
};

export default function DashboardAnalytics({ timeRange, refreshTrigger }: DashboardAnalyticsProps) {
  // Calculate query parameters based on timeRange
  const queryParams = timeRange ? calculateDateRange(timeRange) : undefined;
  
  const { data, isLoading, error, refetch } = useGetDashboardSummaryQuery(queryParams);
  
  const hasError = !!error;
  const isEmpty = !data?.data;

  // Refetch when refreshTrigger changes
  React.useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  // Analytics configuration based on the actual API response
  const analyticsConfig: AnalyticsConfig[] = [
    {
      title: 'Total Users',
      bgColor: '#F0F9FF',
      textColor: '#0369A1',
      iconColor: '#0EA5E9',
      icon: <UsersIcon />,
      getValue: (data) => data?.users?.totalUsers?.currentValue,
      getChange: (data) => data?.users?.totalUsers?.percentageChange,
      getTrend: (data) => data?.users?.totalUsers?.trend || 0,
      format: (value: number | undefined) => value?.toLocaleString() || '0'
    },
    {
      title: 'Premium Users',
      bgColor: '#ECFDF5',
      textColor: '#065F46',
      iconColor: '#10B981',
      icon: <CheckCircleIcon />,
      getValue: (data) => data?.users?.premiumUsers?.currentValue,
      getChange: (data) => data?.users?.premiumUsers?.percentageChange,
      getTrend: (data) => data?.users?.premiumUsers?.trend || 0,
      format: (value: number | undefined) => value?.toLocaleString() || '0'
    },
    {
      title: 'Total Payments',
      bgColor: '#FFFBEB',
      textColor: '#92400E',
      iconColor: '#F59E0B',
      icon: <AnalyticsIcon />,
      getValue: (data) => data?.payments?.totalPayments?.currentValue,
      getChange: (data) => data?.payments?.totalPayments?.percentageChange,
      getTrend: (data) => data?.payments?.totalPayments?.trend || 0,
      format: (value: number | undefined) => value?.toLocaleString() || '0'
    },
    {
      title: 'Total Revenue',
      bgColor: '#EFF6FF',
       textColor: '#1E40AF',
      iconColor: '#3B82F6',
      icon: <RevenueIcon />,
      getValue: (data) => data?.payments?.totalAmountCurrent,
      getChange: (data) => data?.payments?.amountPercentageChange,
      getTrend: (data) => data?.payments?.amountTrend || 0,
      format: (value: number | undefined) => value !== undefined ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'
    }
  ];

  // If there's an error, show a single error card
  if (hasError) {
    return (
      <Box sx={{ mb: 4 }}>
        <ErrorAnalyticsCard  />
      </Box>
    );
  }

  // If no data and no error, show empty state
  if (isEmpty && !isLoading) {
    return (
      <Box sx={{ mb: 4 }}>
        <EmptyAnalyticsState />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 2,
            '& > *': {
              flex: {
                xs: '1 1 100%',
                sm: '1 1 calc(50% - 16px)',
                md: '1 1 calc(50% - 16px)',
              },
              minWidth: {
                xs: '100%',
                sm: '200px',
                md: '220px',
              },
            },
          }}
        >
        {analyticsConfig.map((config) => {
          // Safely cast the data to the expected type
          const apiData = data?.data as unknown as DashboardSummaryResponse | undefined;
          const value = config.getValue(apiData);
          const change = config.getChange(apiData);
          const formattedValue = config.format(value);
          const changeValue = change !== undefined ? change.toFixed(1) : '0.0';
          
          return (
            <Box key={config.title}>
              <AnalyticsCard
                title={config.title}
                value={formattedValue}
                change={changeValue}
                loading={isLoading}
                config={{
                  title: config.title,
                  bgColor: config.bgColor,
                  textColor: config.textColor,
                  iconColor: config.iconColor,
                  icon: config.icon,
                  format: config.format
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}