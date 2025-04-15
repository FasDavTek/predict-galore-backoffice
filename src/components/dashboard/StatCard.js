// components/dashboard/StatCard.js
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Box
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  AccountBalanceWallet as WalletIcon,
  People as UsersIcon
} from '@mui/icons-material';

const iconMap = {
  wallet: <WalletIcon />,
  users: <UsersIcon />
};

const StatCard = ({ title, value, icon, change, bgColor }) => {
  const isPositive = parseFloat(change) >= 0;

  return (
    <Card
      sx={{
        height: '100%',
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': { boxShadow: 1 }
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: bgColor || 'grey.100',
              color: 'primary.main',
              width: 44,
              height: 44
            }}
          >
            {iconMap[icon] || <UsersIcon />}
          </Avatar>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
          {isPositive ? (
            <ArrowUpward color="success" fontSize="small" />
          ) : (
            <ArrowDownward color="error" fontSize="small" />
          )}
          <Typography
            variant="body2"
            color={isPositive ? 'success.main' : 'error.main'}
          >
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

export default StatCard;
