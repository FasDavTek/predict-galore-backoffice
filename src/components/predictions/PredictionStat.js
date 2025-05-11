// components/dashboard/predictions/PredictionsStat.js
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
  SportsSoccer as FootballIcon,
  EmojiEvents as TrophyIcon,
  Timeline as StatsIcon,
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
  AllInclusive as TotalIcon
} from '@mui/icons-material';

const predictionTypeStyles = {
  'Total Predictions': {
    bgColor: '#F0F9FF',
    textColor: '#0369A1',
    iconColor: '#0EA5E9',
    icon: <TotalIcon />
  },
  'Active Predictions': {
    bgColor: '#FFFBEB',
    textColor: '#92400E',
    iconColor: '#F59E0B',
    icon: <FootballIcon />
  },
  'Winning Predictions': {
    bgColor: '#ECFDF5',
    textColor: '#065F46',
    iconColor: '#10B981',
    icon: <TrophyIcon />
  },
  'Accuracy Rate': {
    bgColor: '#F5F3FF',
    textColor: '#5B21B6',
    iconColor: '#8B5CF6',
    icon: <StatsIcon />
  },
  'Correct Predictions': {
    bgColor: '#ECFDF3',
    textColor: '#065F46',
    iconColor: '#12B76A',
    icon: <CorrectIcon />
  },
  'Wrong Predictions': {
    bgColor: '#FEF2F2',
    textColor: '#991B1B',
    iconColor: '#EF4444',
    icon: <WrongIcon />
  },
  'default': {
    bgColor: '#F8FAFC',
    textColor: '#1E293B',
    iconColor: '#64748B',
    icon: <StatsIcon />
  }
};

const PredictionStat = ({ title, value, change = '0%' }) => {
  const isPositive = parseFloat(change) >= 0;
  
  // Get styles based on prediction title
  const getPredictionStyle = () => {
    if (predictionTypeStyles[title]) return predictionTypeStyles[title];
    return predictionTypeStyles.default;
  };
  
  const predictionStyle = getPredictionStyle();

  return (
    <Card sx={{ 
      border: 'none',
      backgroundColor: predictionStyle.bgColor,
      boxShadow: 'none'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ 
              color: predictionStyle.textColor, 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              mb: 1 
            }}>
              {title}
            </Typography>
            
            <Typography variant="h4" sx={{ 
              color: predictionStyle.textColor, 
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
                color: predictionStyle.textColor, 
                fontSize: '0.5rem', 
                fontWeight: 500,
                opacity: 0.8
              }}>
                vs last month
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            bgcolor: predictionStyle.iconColor + '20', // Add opacity to the icon background
            width: 40,
            height: 40,
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {React.cloneElement(predictionStyle.icon, { 
              sx: { 
                color: predictionStyle.iconColor,
                fontSize: '1.25rem'
              } 
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PredictionStat;