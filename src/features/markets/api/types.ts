/**
 * Markets API Types
 */

import type { Market, MarketsFilter, CreateMarketData, UpdateMarketData, CreateSelectionData, UpdateSelectionData, MarketsAnalytics } from '../model/types';

export interface MarketsResponse {
  data: {
    page: number;
    pageSize: number;
    total: number;
    items: Market[];
  };
}

export interface MarketDetailResponse {
  data: Market;
}

export interface MarketCategoriesResponse {
  data: string[];
}

export interface MarketsAnalyticsResponse {
  data: MarketsAnalytics;
}

export type {
  Market,
  MarketsFilter,
  CreateMarketData,
  UpdateMarketData,
  CreateSelectionData,
  UpdateSelectionData,
};
