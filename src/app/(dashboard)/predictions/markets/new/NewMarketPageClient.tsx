/**
 * New Market Page Client
 */

'use client';

import { useRouter } from 'next/navigation';
import { Box, Paper } from '@mui/material';
import { PageHeader } from '@/shared/components/PageHeader';
import { designTokens } from '@/shared/styles/tokens';
import { MarketForm } from '../features/components/MarketForm';

export default function NewMarketPageClient() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/predictions/markets');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Box>
      <PageHeader
        title="Create Market"
        subtitle="Add a new prediction market"
      />

      <Box sx={{ mt: designTokens.spacing.sectionGap }}>
        <Paper sx={{ p: 4 }}>
          <MarketForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </Paper>
      </Box>
    </Box>
  );
}
