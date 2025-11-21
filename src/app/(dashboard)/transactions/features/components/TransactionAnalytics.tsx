// src/app/(dashboard)/transactions/features/components/TransactionAnalytics.tsx
import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  ReceiptLong as TransactionsIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  Error as FailedIcon,
  AttachMoney as RevenueIcon,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { TransactionsAnalytics as AnalyticsData } from '../types/transaction.types';

// Define the analytics card config interface
interface AnalyticsCardConfig {
  title: string;
  bgColor: string;
  textColor: string;
  iconColor: string;
  icon: React.ReactElement;
  format: (value: number | undefined) => string;
}

// AnalyticsCard component
interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  loading: boolean;
  config: AnalyticsCardConfig;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, 
  value, 
  change, 
  loading, 
  config 
}) => {
  const theme = useTheme();
  const changeValue = parseFloat(change);
  const isPositive = changeValue > 0;
  const isNegative = changeValue < 0;

  return (
    <Card 
      sx={{ 
        backgroundColor: config.bgColor,
        color: config.textColor,
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box
            sx={{
              backgroundColor: config.iconColor,
              borderRadius: '50%',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ fontSize: 24, color: 'white' }}>
              {config.icon}
            </Box>
          </Box>
          
          {!loading && change && (
            <Box display="flex" alignItems="center">
              {isPositive && (
                <TrendingUp sx={{ color: '#10B981', mr: 0.5 }} />
              )}
              {isNegative && (
                <TrendingDown sx={{ color: '#EF4444', mr: 0.5 }} />
              )}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: isPositive ? '#10B981' : isNegative ? '#EF4444' : 'inherit',
                  fontWeight: 600
                }}
              >
                {change}%
              </Typography>
            </Box>
          )}
        </Box>

        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            mb: 1
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: config.textColor }} />
          ) : (
            value
          )}
        </Typography>

        <Typography 
          variant="body2" 
          sx={{ 
            opacity: 0.8,
            fontWeight: 500
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Format currency function
const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Main TransactionAnalytics component
interface TransactionAnalyticsProps {
  analytics?: AnalyticsData;
  isLoading?: boolean;
  dateRange?: { fromUtc?: string; toUtc?: string };
}

export const TransactionAnalytics: React.FC<TransactionAnalyticsProps> = ({ 
  analytics, 
  isLoading = false 
}) => {
  // Card configuration for different transaction analytics metrics
  const analyticsConfig: Record<string, AnalyticsCardConfig> = {
    totalTransactions: {
      title: 'Total Transactions',
      bgColor: '#F0F9FF',
      textColor: '#0369A1',
      iconColor: '#0EA5E9',
      icon: <TransactionsIcon />,
      format: (value: number | undefined) => value?.toLocaleString() || '0'
    },
    completedTransactions: {
      title: 'Successful',
      bgColor: '#ECFDF5',
      textColor: '#065F46',
      iconColor: '#10B981',
      icon: <CompletedIcon />,
      format: (value: number | undefined) => value?.toLocaleString() || '0'
    },
    pendingTransactions: {
      title: 'Pending',
      bgColor: '#FFFBEB',
      textColor: '#92400E',
      iconColor: '#F59E0B',
      icon: <PendingIcon />,
      format: (value: number | undefined) => value?.toLocaleString() || '0'
    },
    failedTransactions: {
      title: 'Failed',
      bgColor: '#FEF2F2',
      textColor: '#991B1B',
      iconColor: '#EF4444',
      icon: <FailedIcon />,
      format: (value: number | undefined) => value?.toLocaleString() || '0'
    },
    totalRevenue: {
      title: 'Total Revenue',
      bgColor: '#EFF6FF',
      textColor: '#1E40AF',
      iconColor: '#3B82F6',
      icon: <RevenueIcon />,
      format: (value: number | undefined) => formatCurrency(value || 0)
    }
  };

  // Map our UI keys to actual API field names
  const fieldMapping: Record<string, string> = {
    totalTransactions: 'totalCount',
    completedTransactions: 'successCount',
    pendingTransactions: 'pendingCount',
    failedTransactions: 'failedCount',
    totalRevenue: 'totalRevenue'
  };

  const changeFieldMapping: Record<string, string> = {
    totalTransactions: 'totalChange',
    completedTransactions: 'successChange',
    pendingTransactions: 'pendingChange',
    failedTransactions: 'failedChange',
    totalRevenue: 'revenueChange'
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
        Transaction Analytics
      </Typography>
      
      {/* Using flexbox instead of Grid */}
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: { xs: 'center', sm: 'space-between' }
        }}
      >
        {Object.entries(analyticsConfig).map(([key, config]) => {
          const apiField = fieldMapping[key] || key;
          const changeKey = changeFieldMapping[key] || `${key}Change`;
          
          const value = analytics?.[apiField as keyof AnalyticsData] as number | undefined;
          const changeValue = analytics?.[changeKey as keyof AnalyticsData] as string | undefined || '0';
          
          return (
            <Box 
              key={key}
              sx={{ 
                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(20% - 24px)' },
                minWidth: { xs: '100%', sm: '280px', md: 'auto' },
                maxWidth: { md: '20%' }
              }}
            >
              <AnalyticsCard
                title={config.title}
                value={config.format(value)}
                change={changeValue}
                loading={isLoading}
                config={config}
              />
            </Box>
          );
        })}
      </Box>

      {isLoading && !analytics && (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading analytics...
          </Typography>
        </Box>
      )}

      {!isLoading && !analytics && (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No analytics data available
          </Typography>
        </Box>
      )}
    </Box>
  );
};

