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
  Star as PremiumIcon,
  CreditCard as PaymentIcon
} from '@mui/icons-material';

// Icon mapping with different icons for each stat type
const iconMap = {
  'Total Users': <UsersIcon />,
  'Free Users': <UsersIcon />,
  'Premium Users': <PremiumIcon />,
  'Payments': <PaymentIcon />,
  'wallet': <WalletIcon />,
  'users': <UsersIcon />
};

const DashboardStat = ({ 
  title, 
  value, 
  change = '0%', 
  loading = false
}) => {
  // Determine if the change is positive or negative
  const isPositive = parseFloat(change) >= 0;
  
  // Set colors based on change direction
  const positiveColor = '#3C9705';
  const negativeColor = '#D72638';
  const iconColor = isPositive ? positiveColor : negativeColor;
  const bgColor = isPositive ? '#E6F4EA' : '#FFEBEE'; // Light green/red backgrounds

  // Loading state
  if (loading) {
    return (
      <Card sx={{ 
        height: '100%',
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'divider'
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
      border: '1px solid',
      borderColor: 'divider',
      '&:hover': { boxShadow: 1 }
    }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            {/* Stat title */}
            <Typography 
              variant="subtitle2" 
              color="text.secondary" 
              gutterBottom
              sx={{ textTransform: 'uppercase' }}
            >
              {title}
            </Typography>
            {/* Stat value */}
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Box>
          {/* Stat icon with dynamic color */}
          <Avatar sx={{
            bgcolor: bgColor,
            color: iconColor,
            width: 44,
            height: 44
          }}>
            {iconMap[title] || iconMap['users']}
          </Avatar>
        </Stack>

        {/* Change indicator */}
        <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
          {isPositive ? (
            <ArrowUpward sx={{ color: positiveColor, fontSize: '1rem' }} />
          ) : (
            <ArrowDownward sx={{ color: negativeColor, fontSize: '1rem' }} />
          )}
          <Typography variant="body2" sx={{ color: iconColor, fontWeight: 500 }}>
            {change}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            vs last month
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardStat;