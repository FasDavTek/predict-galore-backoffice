/**
 * Query Provider
 */

'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api';
import { ReactNode, lazy, Suspense } from 'react';

// Lazy load React Query DevTools to reduce initial bundle size
const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((mod) => ({
    default: mod.ReactQueryDevtools,
  }))
);

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
