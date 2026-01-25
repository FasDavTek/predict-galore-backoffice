import React from 'react';
import { Box, Skeleton, Paper } from '@mui/material';

export const SettingsPageLoadingSkeleton: React.FC = () => {
  return (
    <Box className="flex flex-col gap-6">
      {/* Header Skeleton */}
      <Box>
        <Skeleton variant="text" width={120} height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={250} height={24} />
      </Box>

      {/* Tabs Skeleton */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} variant="rounded" width={100} height={40} />
        ))}
      </Box>

      {/* Content Skeleton */}
      <Paper sx={{ p: 4 }}>
        <Box className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column Skeleton */}
          <Box className="md:col-span-4">
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 3 }} />
            <Skeleton variant="rounded" width={120} height={36} />
          </Box>

          {/* Right Column Skeleton */}
          <Box className="md:col-span-8">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[...Array(4)].map((_, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                  <Skeleton variant="rounded" width="100%" height={56} />
                  {index === 0 && <Skeleton variant="rounded" width="100%" height={56} />}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
