import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp as ArrowUpIcon,
  TrendingDown as ArrowDownIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useGetPredictionsAnalyticsQuery } from '../api/predictionApi';
import { PredictionAnalytics as PredictionAnalyticsType } from '../types/prediction.types';

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

interface PredictionAnalyticsProps {
  refreshTrigger?: number;
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
      backgroundColor: config.bgColor,
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
              color: config.textColor, 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              mb: 1,
              opacity: 0.9
            }}>
              {title}
            </Typography>
            
            <Typography variant="h5" sx={{ 
              color: config.textColor, 
              mb: 2, 
              fontWeight: 600,
              fontSize: { xs: '1rem', md: '1rem' }
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
                color: config.textColor, 
                fontSize: '0.75rem', 
                fontWeight: 500,
                opacity: 0.8
              }}>
                vs last period
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            bgcolor: `${config.iconColor}20`,
            width: 40,
            height: 40,
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            ml: 2
          }}>
            <Box sx={{ color: config.iconColor, fontSize: '1.25rem' }}>
              {config.icon}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const ErrorAnalyticsCard: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
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
          Error: Unable to load analytics data
        </Typography>
        {onRetry && (
          <Typography 
            variant="body2" 
            color="#DC2626" 
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={onRetry}
          >
            Click to retry
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export const PredictionAnalytics: React.FC<PredictionAnalyticsProps> = ({ refreshTrigger = 0 }) => {
  const { data: analyticsResponse, isLoading, error, refetch } = useGetPredictionsAnalyticsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Refetch when refreshTrigger changes
  React.useEffect(() => {
    refetch();
  }, [refreshTrigger, refetch]);

  const analytics = analyticsResponse?.data;

  const analyticsConfig: Record<string, AnalyticsCardConfig> = {
    totalPredictions: {
      title: 'Total Predictions',
      bgColor: '#F0F9FF',
      textColor: '#0369A1',
      iconColor: '#0EA5E9',
      icon: <AnalyticsIcon />,
      format: (value: number | undefined) => value?.toLocaleString() || 'N/A'
    },
    completedPredictions: {
      title: 'Completed',
      bgColor: '#ECFDF5',
      textColor: '#065F46',
      iconColor: '#10B981',
      icon: <CheckIcon />,
      format: (value: number | undefined) => value?.toLocaleString() || 'N/A'
    },
    failedPredictions: {
      title: 'Failed',
      bgColor: '#FEF2F2',
      textColor: '#991B1B',
      iconColor: '#EF4444',
      icon: <ErrorIcon />,
      format: (value: number | undefined) => value?.toLocaleString() || 'N/A'
    },
    averageProcessingTime: {
      title: 'Avg Processing Time',
      bgColor: '#FFFBEB',
      textColor: '#92400E',
      iconColor: '#F59E0B',
      icon: <ScheduleIcon />,
      format: (value: number | undefined) => value ? `${Math.round(value)}s` : 'N/A'
    }
  };

  const hasError = !!error;
  const isLoadingData = isLoading;

  // Helper function to safely get values from analytics data
  const getAnalyticsValue = (key: keyof PredictionAnalyticsType): number | undefined => {
    return analytics?.[key];
  };

  // Helper function to safely get change values
  const getChangeValue = (key: string): string => {
    const changeKey = `${key.replace('Predictions', '')}Change` as keyof PredictionAnalyticsType;
    const changeValue = analytics?.[changeKey];
    return changeValue?.toString() || '0';
  };

  // If there's an error, show a single error card
  if (hasError) {
    return (
      <Box sx={{ mb: 4 }}>
        <ErrorAnalyticsCard onRetry={refetch} />
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
        {Object.entries(analyticsConfig).map(([key, config]) => {
          const analyticsKey = key as keyof PredictionAnalyticsType;
          const changeValue = getChangeValue(key);
          
          return (
            <Box key={key}>
              <AnalyticsCard
                title={config.title}
                value={config.format(getAnalyticsValue(analyticsKey))}
                change={changeValue}
                loading={isLoadingData}
                config={config}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};