import { Box, Skeleton } from '@mui/material';

export const TransactionsPageLoadingSkeleton: React.FC = () => {
  return (
    <Box className="flex flex-col gap-6">
      {/* Analytics Skeleton */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {[...Array(5)].map((_, index) => (
          <Box
            key={index}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', lg: '1 1 calc(20% - 16px)' },
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

      {/* Filters and Toolbar Skeleton */}
      <Box className="flex flex-row justify-between gap-4">
        {/* Filters Skeleton */}
        <Box sx={{ display: 'flex', gap: 2, flex: 1, flexWrap: 'wrap' }}>
          <Skeleton variant="rectangular" width={200} height={56} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={150} height={56} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={150} height={56} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={150} height={56} sx={{ borderRadius: 1 }} />
        </Box>

        {/* Toolbar Skeleton */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>

      {/* Table Skeleton */}
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
        {/* Table Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Skeleton variant="circular" width={24} height={24} />
          {[...Array(7)].map((_, index) => (
            <Skeleton key={index} variant="text" width={index === 1 ? 120 : 100} height={24} />
          ))}
        </Box>

        {/* Table Rows */}
        {[...Array(5)].map((_, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              p: 2,
              borderBottom: rowIndex < 4 ? 1 : 0,
              borderColor: 'divider',
              display: 'flex',
              gap: 2,
              alignItems: 'center',
            }}
          >
            {/* Checkbox */}
            <Skeleton variant="circular" width={24} height={24} />

            {/* Transaction Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              <Box>
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={80} height={16} />
              </Box>
            </Box>

            {/* Customer */}
            <Box>
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="text" width={80} height={16} />
            </Box>

            {/* Amount */}
            <Skeleton variant="text" width={80} height={20} />

            {/* Method */}
            <Skeleton variant="text" width={80} height={20} />

            {/* Status */}
            <Skeleton variant="text" width={60} height={20} />

            {/* Date */}
            <Skeleton variant="text" width={100} height={20} />

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
              <Skeleton variant="rectangular" width={60} height={32} sx={{ borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={60} height={32} sx={{ borderRadius: 1 }} />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Pagination Skeleton */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton variant="text" width={120} height={20} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    </Box>
  );
};
