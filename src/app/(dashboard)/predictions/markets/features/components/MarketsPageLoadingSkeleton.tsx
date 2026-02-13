/**
 * Markets Page Loading Skeleton
 */

'use client';

import { Box, Skeleton, Stack } from '@mui/material';
import { designTokens } from '@/shared/styles/tokens';

export function MarketsPageLoadingSkeleton() {
  return (
    <Box>
      <Stack spacing={designTokens.spacing.sectionGap}>
        {/* Analytics Cards */}
        <Stack direction="row" spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rectangular" height={120} sx={{ flex: 1, borderRadius: 2 }} />
          ))}
        </Stack>

        {/* Table */}
        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2 }} />
      </Stack>
    </Box>
  );
}
