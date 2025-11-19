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
  Analytics as PredictionsIcon,
  CheckCircle as AccuracyIcon,
  AttachMoney as RevenueIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useGetAnalyticsQuery } from "../api/dashboardApi";
import { TimeRange } from "./DashboardHeader";

interface AnalyticsCardProps {
  title: string;
  value: string;
  change?: string;
  loading?: boolean;
  bgColor?: string;
  textColor?: string;
  iconColor?: string;
  icon?: React.ReactElement;
}

interface DashboardAnalyticsProps {
  timeRange?: TimeRange;
  refreshTrigger?: number;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, 
  value, 
  change = '0%', 
  loading = false, 
  bgColor = "#F0F9FF",
  textColor = "#0369A1",
  iconColor = "#0EA5E9",
  icon,
}) => {
  const isPositive = parseFloat(String(change).replace("%", "")) >= 0;

  if (loading) {
    return (
      <Card sx={{ border: 'none', boxShadow: 'none', height: '140px' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="80%" height={32} sx={{ my: 1 }} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      border: 'none',
      backgroundColor: bgColor,
      boxShadow: 'none',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ 
              color: textColor, 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              mb: 1,
              opacity: 0.9
            }}>
              {title}
            </Typography>
            
            <Typography variant="h4" sx={{ 
              color: textColor, 
              mb: 2, 
              fontWeight: 600,
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}>
              {value}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isPositive ? (
                <ArrowUpIcon sx={{ 
                  color: '#3C9705',
                  width: 16, 
                  height: 16 
                }} />
              ) : (
                <ArrowDownIcon sx={{ 
                  color: '#D92D20',
                  width: 16, 
                  height: 16 
                }} />
              )}
              <Typography sx={{ 
                color: isPositive ? '#3C9705' : '#D92D20',
                fontSize: '0.875rem', 
                fontWeight: 500 
              }}>
                {change}%
              </Typography>
              <Typography sx={{ 
                color: textColor, 
                fontSize: '0.75rem', 
                fontWeight: 500,
                opacity: 0.8
              }}>
                vs last period
              </Typography>
            </Box>
          </Box>
          
          {icon && (
            <Box sx={{ 
              bgcolor: `${iconColor}20`,
              width: 40,
              height: 40,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              ml: 2
            }}>
              <Box sx={{ color: iconColor, fontSize: '1.25rem' }}>
                {icon}
              </Box>
            </Box>
          )}
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

export default function DashboardAnalytics({ timeRange, refreshTrigger }: DashboardAnalyticsProps) {
  const queryParams = timeRange && timeRange !== 'default' ? { range: timeRange } : undefined;
  const { data, isLoading, error, refetch } = useGetAnalyticsQuery(queryParams);
  
  const hasError = !!error;
  const isEmpty = !data?.data || data.data.length === 0;

  // Refetch when refreshTrigger changes
  React.useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  // Default analytics configuration
  const analyticsConfig = [
    {
      title: 'Total Users',
      bgColor: '#F0F9FF',
      textColor: '#0369A1',
      iconColor: '#0EA5E9',
      icon: <UsersIcon />,
      format: (value: string | number) => String(value || 'N/A')
    },
    {
      title: 'Active Predictions',
      bgColor: '#ECFDF5',
      textColor: '#065F46',
      iconColor: '#10B981',
      icon: <PredictionsIcon />,
      format: (value: string | number) => String(value || 'N/A')
    },
    {
      title: 'Accuracy Rate',
      bgColor: '#FFFBEB',
      textColor: '#92400E',
      iconColor: '#F59E0B',
      icon: <AccuracyIcon />,
      format: (value: string | number) => String(value || 'N/A')
    },
    {
      title: 'Revenue',
      bgColor: '#EFF6FF',
      textColor: '#1E40AF',
      iconColor: '#3B82F6',
      icon: <RevenueIcon />,
      format: (value: string | number) => String(value || 'N/A')
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
              md: '1 1 calc(25% - 16px)',
            },
            minWidth: {
              xs: '100%',
              sm: '200px',
              md: '220px',
            },
          },
        }}
      >
        {analyticsConfig.map((config, index) => {
          const apiData = data?.data?.[index];
          const formattedValue = config.format(apiData?.value || 'N/A');
          
          return (
            <Box key={config.title}>
              <AnalyticsCard
                title={config.title}
                value={formattedValue}
                change={apiData?.change || '0%'}
                loading={isLoading}
                bgColor={config.bgColor}
                textColor={config.textColor}
                iconColor={config.iconColor}
                icon={config.icon}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}