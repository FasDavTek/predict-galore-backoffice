import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

const UserEngagementChart = ({ data }) => {
  return (
    <Box className="h-[300px] w-full">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `${value}k`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [`${value}k`, 'Engagement']}
              labelFormatter={(label) => `Period: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#42A605"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Box className="flex items-center justify-center h-full">
          <Box className="text-center">
            <Box className="w-[140px] h-[140px] bg-gray-50 rounded-[500px] flex items-center justify-center mx-auto mb-4">
             <Image
                                  width={90}  
                                  height={72} 
                                  alt="No data"
                                  src="/closing-quote.svg"
                                  className="object-contain" 
                                  priority 
                                />
            </Box>
            <Typography variant="h6">No Data Available</Typography>
            <Typography variant="body2" color="textSecondary">
              User engagement data will appear here
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UserEngagementChart;