/**
 * New Prediction Page (Client)
 * Full-page form for creating new predictions
 */

'use client';

import { useCallback, memo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { designTokens } from '@/shared/styles/tokens';
import dynamic from 'next/dynamic';

// Lazy load heavy form component
const PredictionForm = dynamic(
  () => import('../features/components/PredictionForm'),
  {
    loading: () => <div>Loading form...</div>,
    ssr: false,
  }
);

function NewPredictionPageClient() {
  const router = useRouter();

  const handleSuccess = useCallback(() => {
    router.push('/predictions');
  }, [router]);

  const handleCancel = useCallback(() => {
    router.push('/predictions');
  }, [router]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        px: { xs: 2, sm: 3, md: 4 },
        py: designTokens.spacing.xl,
        position: 'relative',
      }}
    >
      <Suspense fallback={<div>Loading form...</div>}>
        <PredictionForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </Suspense>
    </Box>
  );
}

export default memo(NewPredictionPageClient);
