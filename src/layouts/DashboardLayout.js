import React from 'react';
import { Box, } from '@mui/material';

import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';

const DashboardLayout = ({ children }) => {
  return (
   
    
      <Box className="flex h-screen bg-white">
        <Sidebar />
        <Box className="flex-1 flex flex-col">
          <Header />
          <Box component="main" className="flex-1 p-9 pt-6 overflow-auto">
            {children}
          </Box>
        </Box>
      </Box>
  
  );
};

export default DashboardLayout;