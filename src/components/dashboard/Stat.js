// components/dashboard/DashboardStat.js
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Box,
  Skeleton
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  AccountBalanceWallet as WalletIcon,
  People as UsersIcon,
  Person as FreeUserIcon,
  Star as PremiumIcon,
  CreditCard as PaymentIcon,
  Receipt as TransactionIcon,
  TrendingUp as GrowthIcon
} from '@mui/icons-material';

// Style mapping for different stat types
const statTypeStyles = {
  'Total Users': {
    bgColor: '#F0F9FF',
    textColor: '#0369A1',
    iconColor: '#0EA5E9',
    icon: <UsersIcon />
  },
  'Free Users': {
    bgColor: '#ECFDF5',
    textColor: '#065F46',
    iconColor: '#059669',
    icon: <FreeUserIcon />
  },
  'Premium Users': {
    bgColor: '#F5F3FF',
    textColor: '#5B21B6',
    iconColor: '#7C3AED',
    icon: <PremiumIcon />
  },
  'Payments': {
    bgColor: '#FEF2F2',
    textColor: '#991B1B',
    iconColor: '#EF4444',
    icon: <PaymentIcon />
  },
  'Revenue': {
    bgColor: '#F0FDF4',
    textColor: '#166534',
    iconColor: '#22C55E',
    icon: <WalletIcon />
  },
  'Transactions': {
    bgColor: '#FFFBEB',
    textColor: '#92400E',
    iconColor: '#F59E0B',
    icon: <TransactionIcon />
  },
  'Growth': {
    bgColor: '#ECFDF3',
    textColor: '#065F46',
    iconColor: '#12B76A',
    icon: <GrowthIcon />
  },
  'default': {
    bgColor: '#F8FAFC',
    textColor: '#1E293B',
    iconColor: '#64748B',
    icon: <UsersIcon />
  }
};

const DashboardStat = ({ 
  title, 
  value, 
  change = '0%', 
  loading = false
}) => {
  // Determine if the change is positive or negative
  const isPositive = parseFloat(change) >= 0;
  
  // Get styles based on stat title
  const getStatStyle = () => {
    if (statTypeStyles[title]) return statTypeStyles[title];
    return statTypeStyles.default;
  };
  
  const statStyle = getStatStyle();

  // Loading state
  if (loading) {
    return (
      <Card sx={{ 
        height: '100%',
        boxShadow: 'none',
        border: 'none',
        backgroundColor: '#F8FAFC'
      }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={40} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      height: '100%',
      boxShadow: 'none',
      border: 'none',
      backgroundColor: statStyle.bgColor,
      '&:hover': { boxShadow: 1 }
    }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            {/* Stat title */}
            <Typography 
              variant="subtitle2" 
              gutterBottom
              sx={{ 
                textTransform: 'uppercase',
                color: statStyle.textColor,
                fontSize: '0.875rem', 
                fontWeight: 500,
                opacity: 0.8
              }}
            >
              {title}
            </Typography>
            
            {/* Stat value */}
            <Typography variant="h4" sx={{ 
              color: statStyle.textColor, 
              mb: 2, 
              fontWeight: 600 
            }} >
              {value}
            </Typography>
          </Box>
          
          {/* Stat icon with dynamic color */}
          <Avatar sx={{
            bgcolor: statStyle.iconColor + '20', // Add opacity
            color: statStyle.iconColor,
            width: 44,
            height: 44
          }}>
            {statStyle.icon}
          </Avatar>
        </Stack>

        {/* Change indicator */}
        <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
          {isPositive ? (
            <ArrowUpward sx={{ 
              color: '#3C9705', 
              fontSize: '1rem' 
            }} />
          ) : (
            <ArrowDownward sx={{ 
              color: '#D92D20', 
              fontSize: '1rem' 
            }} />
          )}
          <Typography variant="body2" sx={{ 
            color: isPositive ? '#3C9705' : '#D92D20', 
            fontWeight: 500 
          }}>
            {change}
          </Typography>
          <Typography variant="caption" sx={{ 
            color: statStyle.textColor, 
            fontSize: '0.5rem', 
            fontWeight: 500,
            opacity: 0.8
          }}>
            vs last month
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardStat;