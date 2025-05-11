// components/dashboard/users/UsersStat.js
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import {
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  People as UsersIcon,
  Person as UserIcon,
  PersonAdd as NewUserIcon,
  Star as PremiumIcon,
  CheckCircle as ActiveUserIcon
} from '@mui/icons-material';

const userTypeStyles = {
  total: {
    bgColor: '#F8FAFC',
    textColor: '#1E293B',
    iconColor: '#64748B',
    icon: <UsersIcon />
  },
  active: {
    bgColor: '#ECFDF5',
    textColor: '#065F46',
    iconColor: '#059669',
    icon: <ActiveUserIcon />
  },
  new: {
    bgColor: '#EFF6FF',
    textColor: '#1E40AF',
    iconColor: '#3B82F6',
    icon: <NewUserIcon />
  },
  premium: {
    bgColor: '#F5F3FF',
    textColor: '#5B21B6',
    iconColor: '#7C3AED',
    icon: <PremiumIcon />
  }
};

const UserStats = ({ title, value, change }) => {
  const isPositive = parseFloat(change) >= 0;
  
  // Determine which user type style to use based on title
  const getUserTypeStyle = () => {
    if (title.toLowerCase().includes('total')) return userTypeStyles.total;
    if (title.toLowerCase().includes('active')) return userTypeStyles.active;
    if (title.toLowerCase().includes('new')) return userTypeStyles.new;
    if (title.toLowerCase().includes('premium')) return userTypeStyles.premium;
    return userTypeStyles.total; // default
  };
  
  const userTypeStyle = getUserTypeStyle();

  return (
    <Card sx={{ 
      border: 'none',
      backgroundColor: userTypeStyle.bgColor,
      boxShadow: 'none'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ 
              color: userTypeStyle.textColor, 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              mb: 1 
            }}>
              {title}
            </Typography>
            
            <Typography variant="h4" sx={{ 
              color: userTypeStyle.textColor, 
              mb: 2, 
              fontWeight: 600 
            }}>
              {value}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}>
              {isPositive ? (
                <ArrowUpIcon sx={{ 
                  color: '#3C9705', 
                  width: 20, 
                  height: 20 
                }} />
              ) : (
                <ArrowDownIcon sx={{ 
                  color: '#D92D20',
                  width: 20, 
                  height: 20 
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
                color: userTypeStyle.textColor, 
                fontSize: '0.5rem', 
                fontWeight: 500,
                opacity: 0.8
              }}>
                vs last month
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            bgcolor: userTypeStyle.iconColor + '20', // Add opacity to the icon background
            width: 40,
            height: 40,
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {React.cloneElement(userTypeStyle.icon, { 
              sx: { 
                color: userTypeStyle.iconColor,
                fontSize: '1.25rem'
              } 
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserStats;