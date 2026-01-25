/**
 * Predictions Store
 * Client state management for predictions UI
 */

import { create } from 'zustand';
import type { PredictionsFilter } from './types';

interface PredictionsState {
  filters: PredictionsFilter;
  selectedPredictionIds: string[];
  setFilters: (filters: Partial<PredictionsFilter>) => void;
  clearFilters: () => void;
  togglePredictionSelection: (predictionId: string) => void;
  selectAllPredictions: (predictionIds: string[]) => void;
  clearSelection: () => void;
}

const defaultFilters: PredictionsFilter = {
  page: 1,
  limit: 10,
};

export const usePredictionsStore = create<PredictionsState>((set) => ({
  filters: defaultFilters,
  selectedPredictionIds: [],

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
    })),

  clearFilters: () => set({ filters: defaultFilters }),

  togglePredictionSelection: (predictionId) =>
    set((state) => ({
      selectedPredictionIds: state.selectedPredictionIds.includes(predictionId)
        ? state.selectedPredictionIds.filter((id) => id !== predictionId)
        : [...state.selectedPredictionIds, predictionId],
    })),

  selectAllPredictions: (predictionIds) => set({ selectedPredictionIds: predictionIds }),

  clearSelection: () => set({ selectedPredictionIds: [] }),
}));

