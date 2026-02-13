/**
 * Markets API Hooks
 * TanStack Query hooks for markets
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MarketsService } from './service';
import type {
  MarketsFilter,
  CreateMarketData,
  UpdateMarketData,
  CreateSelectionData,
  UpdateSelectionData,
} from './types';

export function useMarkets(filters?: MarketsFilter) {
  return useQuery({
    queryKey: ['markets', filters],
    queryFn: async () => {
      return await MarketsService.getMarkets(filters);
    },
  });
}

export function useMarket(id: number) {
  return useQuery({
    queryKey: ['market', id],
    queryFn: async () => {
      return await MarketsService.getMarket(id);
    },
    enabled: !!id,
  });
}

export function useMarketCategories() {
  return useQuery({
    queryKey: ['market-categories'],
    queryFn: async () => {
      return await MarketsService.getCategories();
    },
  });
}

export function useMarketsAnalytics() {
  return useQuery({
    queryKey: ['markets-analytics'],
    queryFn: async () => {
      return await MarketsService.getAnalytics();
    },
  });
}

export function useCreateMarket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMarketData) => {
      return await MarketsService.createMarket(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['markets-analytics'] });
    },
  });
}

export function useUpdateMarket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateMarketData }) => {
      return await MarketsService.updateMarket(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['market'] });
    },
  });
}

export function useDeleteMarket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await MarketsService.deleteMarket(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['markets-analytics'] });
    },
  });
}

export function useToggleMarket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await MarketsService.toggleMarket(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['market'] });
    },
  });
}

export function useAddSelection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ marketId, data }: { marketId: number; data: CreateSelectionData }) => {
      return await MarketsService.addSelection(marketId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['market'] });
    },
  });
}

export function useUpdateSelection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ selectionId, data }: { selectionId: number; data: UpdateSelectionData }) => {
      return await MarketsService.updateSelection(selectionId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['market'] });
    },
  });
}

export function useDeleteSelection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (selectionId: number) => {
      return await MarketsService.deleteSelection(selectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
      queryClient.invalidateQueries({ queryKey: ['market'] });
    },
  });
}
