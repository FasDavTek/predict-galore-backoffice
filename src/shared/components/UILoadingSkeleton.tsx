import React from 'react';
import { Box, Skeleton, Card, CardContent } from '@mui/material';

export interface PageSkeletonProps {
  /**
   * Type of skeleton to display
   * - 'dashboard': For dashboard pages with cards and charts
   * - 'table': For data tables
   * - 'form': For forms
   * - 'basic': Basic loading skeleton
   */
  variant?: 'dashboard' | 'table' | 'form' | 'basic';

  /**
   * Number of skeleton items to display
   */
  itemCount?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * A reusable loading skeleton component for page-level loading states
 * Can be used across all pages in the application
 */
export const UILoadingSkeleton: React.FC<PageSkeletonProps> = ({
  variant = 'dashboard',
  itemCount = 4,
  className,
}) => {
  const renderDashboardSkeleton = () => (
    <Box className={className}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={24} />
          </Box>
          <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 1 }} />
        </Box>
        <Skeleton variant="text" height={2} />
      </Box>

      {/* Analytics Cards Skeleton */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {Array.from({ length: itemCount }).map((_, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: '1 1 100%',
                  sm: '1 1 calc(50% - 8px)',
                  md: '1 1 calc(25% - 8px)',
                },
                minWidth: { xs: '100%', sm: 250 },
              }}
            >
              <Card sx={{ height: '100%', boxShadow: 'none' }}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={48} sx={{ mt: 1 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton variant="text" width="30%" height={20} sx={{ ml: 1 }} />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Charts and Content Skeleton */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 3,
          mt: 3,
        }}
      >
        {/* Main Content Skeleton */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {/* Chart Skeleton */}
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Skeleton variant="text" width="30%" height={32} />
                <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 1 }} />
              </Box>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>

          {/* Table Skeleton */}
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Skeleton variant="text" width="40%" height={32} />
                <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
              </Box>
              {Array.from({ length: 5 }).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                    gap: 2,
                  }}
                >
                  <Skeleton variant="text" sx={{ flex: 3 }} height={24} />
                  <Skeleton variant="text" sx={{ flex: 2 }} height={24} />
                  <Skeleton variant="text" sx={{ flex: 2 }} height={24} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

        {/* Sidebar Skeleton */}
        <Box
          sx={{
            width: { xs: '100%', lg: 400 },
            minWidth: { xs: 'auto', lg: 400 },
          }}
        >
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Skeleton variant="text" width="50%" height={32} />
                <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
              </Box>
              {Array.from({ length: 3 }).map((_, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="60%" height={16} />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );

  const renderTableSkeleton = () => (
    <Box className={className}>
      <Card>
        <CardContent>
          {/* Table Header */}
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
          >
            <Skeleton variant="text" width="30%" height={40} />
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
          </Box>

          {/* Table Headers */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2,
              gap: 2,
            }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} variant="text" sx={{ flex: 1 }} height={24} />
            ))}
          </Box>

          {/* Table Rows */}
          {Array.from({ length: itemCount }).map((_, rowIndex) => (
            <Box
              key={rowIndex}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2,
                gap: 2,
              }}
            >
              {Array.from({ length: 4 }).map((_, colIndex) => (
                <Skeleton key={colIndex} variant="text" sx={{ flex: 1 }} height={20} />
              ))}
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );

  const renderFormSkeleton = () => (
    <Box className={className}>
      <Card>
        <CardContent>
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />

          {Array.from({ length: itemCount }).map((_, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
            </Box>
          ))}

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const renderBasicSkeleton = () => (
    <Box className={className}>
      <Card>
        <CardContent>
          {Array.from({ length: itemCount }).map((_, index) => (
            <Skeleton key={index} variant="text" width="100%" height={24} sx={{ mb: 1 }} />
          ))}
        </CardContent>
      </Card>
    </Box>
  );

  switch (variant) {
    case 'table':
      return renderTableSkeleton();
    case 'form':
      return renderFormSkeleton();
    case 'basic':
      return renderBasicSkeleton();
    case 'dashboard':
    default:
      return renderDashboardSkeleton();
  }
};

export default UILoadingSkeleton;
