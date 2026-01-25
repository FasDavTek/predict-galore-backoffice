/**
 * Predictions API Hooks
 * TanStack Query hooks for predictions
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PredictionsService } from './service';
import type {
  PredictionsFilter,
  CreatePredictionPayload,
  UpdatePredictionPayload,
} from './types';

// Get predictions hook
export function usePredictions(filters?: PredictionsFilter) {
  return useQuery({
    queryKey: ['predictions', filters],
    queryFn: async () => {
      return await PredictionsService.getPredictions(filters);
    },
  });
}

// Get prediction analytics hook
export function usePredictionsAnalytics() {
  return useQuery({
    queryKey: ['predictions-analytics'],
    queryFn: async () => {
      return await PredictionsService.getAnalytics();
    },
  });
}

// Create prediction hook
export function useCreatePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, adminUser }: { data: CreatePredictionPayload; adminUser: string }) => {
      return await PredictionsService.createPrediction(data, adminUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['predictions-analytics'] });
    },
  });
}

// Get prediction detail hook
export function usePrediction(id: string) {
  return useQuery({
    queryKey: ['prediction', id],
    queryFn: async () => {
      return await PredictionsService.getPredictionDetail(id);
    },
    enabled: !!id,
  });
}

// Update prediction hook
export function useUpdatePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePredictionPayload }) => {
      return await PredictionsService.updatePrediction(id, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['prediction', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['predictions-analytics'] });
    },
  });
}

// Delete prediction hook
export function useDeletePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await PredictionsService.deletePrediction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      queryClient.invalidateQueries({ queryKey: ['predictions-analytics'] });
    },
  });
}

// Get sports hook
export function useSports(filters?: { sportId?: number }) {
  return useQuery({
    queryKey: ['sports', filters],
    queryFn: async () => {
      return await PredictionsService.getSports(filters);
    },
  });
}

// Get leagues hook
export function useLeagues(filters?: { sportId?: number }) {
  const enabled = !!(filters?.sportId && filters.sportId > 0);

  return useQuery({
    queryKey: ['leagues', filters],
    queryFn: async () => {
      return await PredictionsService.getLeagues(filters);
    },
    enabled,
  });
}

// Get upcoming fixtures hook
export function useUpcomingFixtures(filters?: { leagueId?: number; fromDate?: string }) {
  return useQuery({
    queryKey: ['fixtures', filters?.leagueId, filters?.fromDate],
    queryFn: async () => {
      if (!filters?.leagueId || !filters?.fromDate) return [];
      return await PredictionsService.getUpcomingFixtures(filters);
    },
    enabled: !!filters?.leagueId && !!filters?.fromDate,
    staleTime: 0,
  });
}

// Get markets hook
export function useMarkets(filters?: { fixtureId?: number }) {
  return useQuery({
    queryKey: ['markets', filters],
    queryFn: async () => {
      return await PredictionsService.getMarkets(filters);
    },
  });
}

// Get market selections hook
export function useMarketSelections(
  filters?: { marketId?: number },
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['selections', filters],
    queryFn: async () => {
      return await PredictionsService.getMarketSelections(filters);
    },
    enabled: options?.enabled !== false && !!filters?.marketId,
  });
}

