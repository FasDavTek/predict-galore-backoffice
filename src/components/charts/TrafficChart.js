import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']; // Customize as needed

const TrafficChart = ({ data }) => {
  return (
    <Box className="h-[300px] w-full">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend 
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
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
            <Typography variant="h6">No Traffic Data Available</Typography>
            <Typography variant="body2" color="textSecondary">
              Traffic analytics will be displayed once users start visiting the platform
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TrafficChart;