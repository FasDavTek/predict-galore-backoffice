/**
 * Users Store
 * Client state management for users UI
 */

import { create } from 'zustand';
import type { UsersFilter } from './types';

interface UsersState {
  filters: UsersFilter;
  setFilters: (filters: Partial<UsersFilter>) => void;
  clearFilters: () => void;
}

const defaultFilters: UsersFilter = {
  page: 1,
  limit: 10,
};

export const useUsersStore = create<UsersState>((set) => ({
  filters: defaultFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
    })),
  clearFilters: () => set({ filters: defaultFilters }),
}));

