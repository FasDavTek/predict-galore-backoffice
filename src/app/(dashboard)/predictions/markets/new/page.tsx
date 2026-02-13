/**
 * New Market Page (Server Component)
 */

import { Suspense } from 'react';
import { Skeleton } from '@mui/material';
import NewMarketPageClient from './NewMarketPageClient';

export const metadata = {
  title: 'Create Market | Predict Galore Admin',
  description: 'Create a new prediction market',
};

export default function NewMarketPage() {
  return (
    <Suspense fallback={<Skeleton variant="rectangular" height={600} />}>
      <NewMarketPageClient />
    </Suspense>
  );
}
