/**
 * Markets Service
 * Application layer - Business logic for markets
 */

import { api } from '@/shared/api';
import { API_CONFIG } from '@/shared/api';
import type {
  MarketsFilter,
  CreateMarketData,
  UpdateMarketData,
  CreateSelectionData,
  UpdateSelectionData,
  MarketsResponse,
  MarketDetailResponse,
  MarketCategoriesResponse,
  Market,
} from './types';
import type { MarketsAnalytics } from '../model/types';

export class MarketsService {
  /**
   * Get markets list
   */
  static async getMarkets(filters?: MarketsFilter): Promise<{
    markets: Market[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    // Transform filter keys to match API expectations (PascalCase)
    const apiFilters: Record<string, unknown> = {};
    if (filters) {
      if (filters.page !== undefined) apiFilters.Page = filters.page;
      if (filters.pageSize !== undefined) apiFilters.PageSize = filters.pageSize;
      if (filters.category !== undefined) apiFilters.Category = filters.category;
      if (filters.isActive !== undefined) apiFilters.IsActive = filters.isActive;
      if (filters.search !== undefined) apiFilters.Search = filters.search;
    }
    
    const response = await api.get<MarketsResponse>(
      API_CONFIG.endpoints.markets.list,
      apiFilters
    );
    
    const { page, pageSize, total, items } = response.data;
    const totalPages = Math.ceil(total / pageSize);
    
    return {
      markets: items,
      pagination: {
        page,
        limit: pageSize,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get single market
   */
  static async getMarket(id: number): Promise<Market> {
    const response = await api.get<MarketDetailResponse>(
      API_CONFIG.endpoints.markets.detail(id)
    );
    return response.data;
  }

  /**
   * Get market categories
   */
  static async getCategories(): Promise<string[]> {
    const response = await api.get<MarketCategoriesResponse>(
      API_CONFIG.endpoints.markets.categories
    );
    return response.data;
  }

  /**
   * Get markets analytics
   */
  static async getAnalytics(): Promise<MarketsAnalytics> {
    // Since there's no dedicated analytics endpoint, we'll fetch all markets and calculate
    const response = await api.get<MarketsResponse>(
      API_CONFIG.endpoints.markets.list,
      { page: 1, pageSize: 1000 }
    );
    
    const markets = response.data.items;
    const activeMarkets = markets.filter(m => m.isActive);
    const categories = new Set(markets.map(m => m.category)).size;
    const totalSelections = markets.reduce((sum, m) => sum + (m.selections?.length || 0), 0);
    
    return {
      totalMarkets: markets.length,
      activeMarkets: activeMarkets.length,
      categories,
      totalSelections,
      totalChange: 0, // Would need historical data
      activeChange: 0,
      categoriesChange: 0,
      selectionsChange: 0,
    };
  }

  /**
   * Create market
   */
  static async createMarket(data: CreateMarketData): Promise<Market> {
    const response = await api.post<MarketDetailResponse>(
      API_CONFIG.endpoints.markets.create,
      data
    );
    return response.data;
  }

  /**
   * Update market
   */
  static async updateMarket(id: number, data: UpdateMarketData): Promise<Market> {
    const response = await api.put<MarketDetailResponse>(
      API_CONFIG.endpoints.markets.update(id),
      data
    );
    return response.data;
  }

  /**
   * Delete market
   */
  static async deleteMarket(id: number): Promise<void> {
    await api.delete(API_CONFIG.endpoints.markets.delete(id));
  }

  /**
   * Toggle market active status
   */
  static async toggleMarket(id: number): Promise<Market> {
    const response = await api.patch<MarketDetailResponse>(
      API_CONFIG.endpoints.markets.toggle(id)
    );
    return response.data;
  }

  /**
   * Add selection to market
   */
  static async addSelection(marketId: number, data: CreateSelectionData): Promise<void> {
    await api.post(
      API_CONFIG.endpoints.markets.addSelection(marketId),
      data
    );
  }

  /**
   * Update selection
   */
  static async updateSelection(selectionId: number, data: UpdateSelectionData): Promise<void> {
    await api.put(
      API_CONFIG.endpoints.markets.updateSelection(selectionId),
      data
    );
  }

  /**
   * Delete selection
   */
  static async deleteSelection(selectionId: number): Promise<void> {
    await api.delete(API_CONFIG.endpoints.markets.deleteSelection(selectionId));
  }
}
