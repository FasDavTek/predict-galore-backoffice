/**
 * Edit Market Page
 */

'use client';

import { useRouter, useParams } from 'next/navigation';
import { Box, Paper, CircularProgress, Button, Typography } from '@mui/material';
import { useMarket } from '@/features/markets';
import { MarketForm } from '../../features/components/MarketForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQueryClient } from '@tanstack/react-query';

export default function EditMarketPage() {
  const router = useRouter();
  const params = useParams();
  const marketId = parseInt(params.id as string, 10);
  const queryClient = useQueryClient();
  
  const { data: market, isLoading, error } = useMarket(marketId);

  const handleSuccess = async () => {
    // Invalidate all market queries to trigger refetch
    await queryClient.invalidateQueries({ queryKey: ['markets'] });
    await queryClient.invalidateQueries({ queryKey: ['market', marketId] });
    await queryClient.invalidateQueries({ queryKey: ['markets-analytics'] });
    router.push('/predictions/markets');
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !market) {
    return (
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>Market Not Found</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The requested market could not be found
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/predictions/markets')}>
          Back to Markets
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Back Button */}
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleCancel}
        sx={{ mb: 3 }}
      >
        Back to Markets
      </Button>

      <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
        Edit Market
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Update details for {market.displayName}
      </Typography>

      <Paper sx={{ p: 4 }}>
        <MarketForm market={market} onSuccess={handleSuccess} onCancel={handleCancel} />
      </Paper>
    </Box>
  );
}
