// components/charts/UserEngagementChart.js
import React from 'react';
import { Box, Typography, Select, MenuItem, Skeleton } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockEngagementData = {
  free: [
    { name: 'Mar 6', value: 20 },
    { name: 'Mar 7', value: 35 },
    { name: 'Mar 8', value: 45 },
    { name: 'Mar 9', value: 40 },
    { name: 'Mar 10', value: 60 },
    { name: 'Mar 11', value: 55 },
    { name: 'Mar 12', value: 75 }
  ],
  premium: [
    { name: 'Mar 6', value: 10 },
    { name: 'Mar 7', value: 15 },
    { name: 'Mar 8', value: 25 },
    { name: 'Mar 9', value: 30 },
    { name: 'Mar 10', value: 40 },
    { name: 'Mar 11', value: 35 },
    { name: 'Mar 12', value: 45 }
  ],
  total: [
    { name: 'Mar 6', value: 30 },
    { name: 'Mar 7', value: 50 },
    { name: 'Mar 8', value: 70 },
    { name: 'Mar 9', value: 70 },
    { name: 'Mar 10', value: 100 },
    { name: 'Mar 11', value: 90 },
    { name: 'Mar 12', value: 120 }
  ]
};

const UserEngagementChart = ({ 
  data = {}, 
  loading = false,
  userType = 'free',
  onUserTypeChange 
}) => {
  // Use provided data or fallback to mock data if empty
  const chartData = data[userType] || mockEngagementData[userType] || [];

  return (
    <Box sx={{
      width: '100%',
      p: 3,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      bgcolor: 'background.paper'
    }}>
      {/* Header with title and user type selector */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h6" fontWeight={600}>
          User Engagement
        </Typography>
        
        {loading ? (
          <Skeleton variant="rectangular" width={120} height={40} />
        ) : (
          <Select
            value={userType}
            onChange={(e) => onUserTypeChange(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="free">Free Users</MenuItem>
            <MenuItem value="premium">Premium Users</MenuItem>
            <MenuItem value="total">All Users</MenuItem>
          </Select>
        )}
      </Box>

      {/* Chart area */}
      {loading ? (
        <Skeleton variant="rectangular" height={300} />
      ) : chartData.length === 0 ? (
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No data available for selected user type
          </Typography>
        </Box>
      ) : (
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#42A605" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#42A605" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 'auto']}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Engagement']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#42A605"
                fillOpacity={1}
                fill="url(#colorValue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default UserEngagementChart;