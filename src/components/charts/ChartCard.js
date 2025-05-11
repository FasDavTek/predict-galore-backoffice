// components/dashboard/ChartCard.js
import { Card, CardContent, Box, Typography, Select, MenuItem } from '@mui/material';

export const ChartCard = ({ 
  title, 
  children, 
  filterValue, 
  onFilterChange, 
  filterOptions,
  minHeight 
}) => {
  return (
    <Card sx={{
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'none',
      border: '1px solid',
      borderColor: 'divider',
    }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}>
          <Typography variant="h3" component="h3">
            {title}
          </Typography>
          {filterOptions && (
            <Select
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              {filterOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>
        <Box sx={{ flex: 1, minHeight }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};