import React from 'react';
import { 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  Divider, 
  FormControl, 
  InputLabel, 
  IconButton,
  Tooltip 
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { User as AuthUser } from '@/app/(auth)/features/types/authTypes';

export type TimeRange = 'default' | 'today' | 'thisWeek' | 'thisMonth' | 'lastMonth' | 'thisYear';

interface TransactionsPageHeaderProps {
  title?: string;
  subtitle?: string;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  onRefresh?: () => void;
  user?: AuthUser | null; 
}

export const TransactionsPageHeader: React.FC<TransactionsPageHeaderProps> = ({ 
  title = "Transactions Management", 
  subtitle, 
  timeRange, 
  onTimeRangeChange,
  onRefresh,
  user
}) => {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  // Generate the subtitle with the user's first name
  const getSubtitle = () => {
    if (subtitle) {
      return subtitle; 
    }
    
    const firstName = user?.firstName || 'there';
    return `Welcome ${firstName}! Monitor and manage all financial transactions.`;
  };

  const displaySubtitle = getSubtitle();

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
      }}>
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {displaySubtitle}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
              label="Time Range"
            >
              <MenuItem value="default">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="thisWeek">This Week</MenuItem>
              <MenuItem value="thisMonth">This Month</MenuItem>
              <MenuItem value="lastMonth">Last Month</MenuItem>
              <MenuItem value="thisYear">This Year</MenuItem>
            </Select>
          </FormControl>
          
          <Tooltip title="Refresh transactions data">
            <IconButton 
              onClick={handleRefresh}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Divider />
    </Box>
  );
};

export default TransactionsPageHeader;