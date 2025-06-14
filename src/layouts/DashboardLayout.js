// layouts/DashboardLayout.js
import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';


const DashboardLayout = ({ children, user }) => {
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(false);


  return (
    <Box sx={{ display: 'flex', backgroundColor: 'background.default',  width: '100%',  }}>
      <Sidebar 
      collapsed={collapsed} 
      setCollapsed={setCollapsed} 
      />

      <Box
        sx={{
          flex: 1,
          transition: 'padding 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >

        {/* Header */}
        <Header 
        />

        {/* main component */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: 4,
            pt: 3,
            overflow: 'auto',
            maxHeight: 'calc(100vh - 72px)', 
            width: '100%',
            scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
