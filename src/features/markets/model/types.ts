/**
 * Markets Domain Types
 */

export interface Market {
  id: number;
  name: string;
  displayName: string;
  category: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  selections: Selection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Selection {
  id?: number;
  selectionKey: string;
  selectionLabel: string;
  sortOrder: number;
  isActive: boolean;
}

export interface MarketsFilter {
  page?: number;
  pageSize?: number;
  category?: string;
  isActive?: boolean;
  search?: string;
}

export interface MarketsAnalytics {
  totalMarkets: number;
  activeMarkets: number;
  categories: number;
  totalSelections: number;
  totalChange: number;
  activeChange: number;
  categoriesChange: number;
  selectionsChange: number;
}

export interface CreateMarketData {
  name: string;
  displayName: string;
  category: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  selections: Omit<Selection, 'id'>[];
}

export interface UpdateMarketData {
  displayName: string;
  category: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CreateSelectionData {
  selectionKey: string;
  selectionLabel: string;
  sortOrder: number;
  isActive: boolean;
}

export interface UpdateSelectionData {
  selectionLabel: string;
  sortOrder: number;
  isActive: boolean;
}
