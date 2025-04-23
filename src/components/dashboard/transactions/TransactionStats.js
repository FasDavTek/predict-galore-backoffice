// components/dashboard/transactions/TransactionsStat.js
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import {
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon
} from '@mui/icons-material';

const statusStyles = {
  completed: {
    bgColor: '#ECFDF5',
    textColor: '#065F46',
    iconColor: '#059669'
  },
  pending: {
    bgColor: '#EFF6FF',
    textColor: '#1E40AF',
    iconColor: '#3B82F6'
  },
  failed: {
    bgColor: '#FEF2F2',
    textColor: '#991B1B',
    iconColor: '#EF4444'
  },
  default: {
    bgColor: '#F8FAFC',
    textColor: '#1E293B',
    iconColor: '#64748B'
  }
};

const TransactionStats = ({ title, value, icon, change }) => {
  const isPositive = parseFloat(change) >= 0;
  
  // Determine which status style to use based on title
  const getStatusStyle = () => {
    if (title.toLowerCase().includes('completed')) return statusStyles.completed;
    if (title.toLowerCase().includes('pending')) return statusStyles.pending;
    if (title.toLowerCase().includes('failed')) return statusStyles.failed;
    return statusStyles.default;
  };
  
  const statusStyle = getStatusStyle();

  return (
    <Card sx={{ 
      border: 'none',
      backgroundColor: statusStyle.bgColor,
      boxShadow: 'none'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ 
              color: statusStyle.textColor, 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              mb: 1 
            }}>
              {title}
            </Typography>
            
            <Typography variant="h4" sx={{ 
              color: statusStyle.textColor, 
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
                color: statusStyle.textColor, 
                fontSize: '0.5rem', 
                fontWeight: 500,
                opacity: 0.8
              }}>
                vs last month
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            bgcolor: statusStyle.iconColor + '20', // Add opacity to the icon background
            width: 40,
            height: 40,
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {React.cloneElement(icon, { 
              sx: { 
                color: statusStyle.iconColor,
                fontSize: '1.25rem'
              } 
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TransactionStats;