// components/dashboard/DashboardHeader.js
import { Box, Typography, Select, MenuItem, Divider } from '@mui/material';

export const DashboardHeader = ({ 
  title, 
  subtitle, 
  timeRange, 
  onTimeRangeChange 
}) => {
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
            {subtitle}
          </Typography>
        </Box>
        <Select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="This Month">This Month</MenuItem>
          <MenuItem value="Last Month">Last Month</MenuItem>
          <MenuItem value="This Year">This Year</MenuItem>
        </Select>
      </Box>
      <Divider />
    </Box>
  );
};