// components/dashboard/Traffic.js
import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton
} from '@mui/material';

import ReactCountryFlag from 'react-country-flag';

const Traffic = ({ 
  TrafficData,
  loading, 
  filterValue, 
  onFilterChange
}) => {
  
  // Sample data structure (used as fallback)
  const fallbackData = [
    { name: 'Nigeria', percentage: '28%', users: '27,650', countryCode: 'NG' },
    { name: 'United States', percentage: '22%', users: '18,900', countryCode: 'US' },
    { name: 'United Kingdom', percentage: '15%', users: '12,600', countryCode: 'GB' },
    { name: 'South Africa', percentage: '10%', users: '9,400', countryCode: 'ZA' },
    { name: 'India', percentage: '8%', users: '7,200', countryCode: 'IN' }
  ];

  // Use provided data or fallback data if empty
  const displayData = TrafficData && TrafficData.length > 0 ? TrafficData : fallbackData;

  // Filter options
  const filterOptions = [
    { value: "By location", label: "By Location" },
    { value: "By sport", label: "By Sport" },
    { value: "By prediction", label: "By Prediction Type" }
  ];

  return (
    <Box sx={{ 
      width: '100%',
      p: 3,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      bgcolor: 'background.paper'
    }}>
      {/* Header with filter selector */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        mb={3}
      >
        <Typography variant="h6" fontWeight={600}>
          Traffic Overview
        </Typography>
        
        <Select
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
          size="small"
          sx={{ 
            minWidth: 180,
            '& .MuiSelect-select': {
              py: 1
            }
          }}
        >
          {filterOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      {loading ? (
        // Loading state
        <Box>
          {[1, 2, 3, 4, 5].map((item) => (
            <Skeleton key={item} variant="rectangular" height={56} sx={{ mb: 1 }} />
          ))}
        </Box>
      ) : (
        // Data display
        <TableContainer component={Paper} elevation={0} sx={{ boxShadow: 'none' }}>
          <Table size="small" aria-label="traffic table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>#Country</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Percentage</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>No. of users</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayData.map((country, index) => (
                <TableRow key={country.name || index}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ minWidth: 24 }}>
                        {index + 1}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ReactCountryFlag
                          countryCode={country.countryCode}
                          svg
                          style={{
                            width: '1.2em',
                            height: '1.2em',
                            marginRight: '8px'
                          }}
                          title={country.name}
                        />
                      </Box>
                      <Typography variant="body2">
                        {country.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {country.percentage}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {country.users}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}


    </Box>
  );
};

export default Traffic;