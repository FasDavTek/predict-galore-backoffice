/**
 * Transactions API Hooks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TransactionsService } from './service';
import type { TransactionsFilter, UpdateTransactionData } from './types';

export function useTransactions(filters?: TransactionsFilter) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      return await TransactionsService.getTransactions(filters);
    },
  });
}

export function useTransactionsAnalytics() {
  return useQuery({
    queryKey: ['transactions-analytics'],
    queryFn: async () => {
      return await TransactionsService.getAnalytics();
    },
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: async () => {
      return await TransactionsService.getTransaction(id);
    },
    enabled: !!id,
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateTransactionData) => {
      return await TransactionsService.updateTransaction(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-analytics'] });
    },
  });
}

export function useExportTransactions(filters?: TransactionsFilter) {
  return useMutation({
    mutationFn: async () => {
      return await TransactionsService.exportTransactions(filters);
    },
  });
}

