import React from 'react';
import { Box, Typography } from '@mui/material';

// Reusable feature card component for left sidebar
const FeatureCard = ({ icon, title, description }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      {/* Icon container */}
      <Box sx={{
        p: 1.5,
        bgcolor: 'primary.main',
        borderRadius: 1,
        color: 'common.white'
      }}>
        {icon}
      </Box>

      {/* Text content */}
      <Box>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'primary.light' }}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default FeatureCard;