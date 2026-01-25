import { Box, Skeleton } from '@mui/material';

export const DashboardPageLoadingSkeleton: React.FC = () => {
  // Predefined heights for bar chart to avoid using Math.random()
  const barHeights = [45, 65, 35, 80, 55, 70, 40];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Skeleton */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}
      >
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={300} height={24} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>

      {/* Analytics Grid Skeleton */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {[...Array(4)].map((_, index) => (
          <Box
            key={index}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', lg: '1 1 calc(25% - 16px)' },
              minHeight: 140,
            }}
          >
            <Skeleton
              variant="rectangular"
              height={140}
              sx={{
                borderRadius: 2,
                bgcolor: 'grey.100',
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Main Content Area Skeleton */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 3,
          mt: 3,
          minHeight: '400px',
        }}
      >
        {/* Left Column - Charts Skeleton */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {/* User Engagement Chart Skeleton */}
          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              p: 3,
              height: 400,
            }}
          >
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Box>
                <Skeleton variant="text" width={180} height={28} sx={{ mb: 1 }} />
                <Skeleton variant="text" width={250} height={20} />
              </Box>
              <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 250 }}>
              {barHeights.map((height, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width="12%"
                  height={`${height}%`}
                  sx={{ borderRadius: 1 }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2 }}>
              {[...Array(3)].map((_, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Skeleton variant="circular" width={12} height={12} />
                  <Skeleton variant="text" width={60} height={20} />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Traffic Chart Skeleton */}
          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              p: 3,
              height: 300,
            }}
          >
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Box>
                <Skeleton variant="text" width={150} height={28} sx={{ mb: 1 }} />
                <Skeleton variant="text" width={200} height={20} />
              </Box>
              <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
            </Box>
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 180 }}
            >
              <Skeleton variant="circular" width={150} height={150} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
              {[...Array(4)].map((_, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Skeleton variant="circular" width={12} height={12} />
                  <Skeleton variant="text" width={50} height={20} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Right Column - Activity Log Skeleton */}
        <Box
          sx={{
            width: { xs: '100%', lg: 400 },
            minWidth: { xs: 'auto', lg: 400 },
          }}
        >
          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              p: 3,
              height: 743, // Matches the combined height of both charts
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Skeleton variant="text" width={120} height={28} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={180} height={20} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[...Array(6)].map((_, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Skeleton variant="circular" width={8} height={8} sx={{ mt: 1 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="90%" height={20} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width="70%" height={16} />
                    <Skeleton variant="text" width="40%" height={14} sx={{ mt: 0.5 }} />
                  </Box>
                  <Skeleton variant="text" width={60} height={16} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
