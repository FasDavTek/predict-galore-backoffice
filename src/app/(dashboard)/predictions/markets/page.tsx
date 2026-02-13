/**
 * Markets Page (Server Component)
 */

import { Suspense } from 'react';
import { MarketsPageLoadingSkeleton } from './features/components/MarketsPageLoadingSkeleton';
import MarketsPageClient from './MarketsPageClient';

export const metadata = {
  title: 'Markets | Predict Galore Admin',
  description: 'Manage prediction markets',
};

export default function MarketsPage() {
  return (
    <Suspense fallback={<MarketsPageLoadingSkeleton />}>
      <MarketsPageClient />
    </Suspense>
  );
}
