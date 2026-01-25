/**
 * Predictions Service
 * Application layer - Business logic for predictions
 */

import { api } from '@/shared/api';
import { API_CONFIG } from '@/shared/api';
import { PredictionsTransformer } from '../lib/transformers';
import type {
  PredictionsFilter,
  CreatePredictionPayload,
  UpdatePredictionPayload,
  PredictionsResponse,
  PredictionsAnalyticsResponse,
  PredictionDetailResponse,
  SportsResponse,
  LeaguesResponse,
  FixturesResponse,
  MarketsResponse,
  SelectionsResponse,
  Prediction,
  PredictionDetail,
  PredictionAnalytics,
  Sport,
  League,
  Fixture,
  Market,
  Selection,
} from './types';

export class PredictionsService {
  /**
   * Get predictions list
   */
  static async getPredictions(
    filters?: PredictionsFilter
  ): Promise<{
    predictions: Prediction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await api.get<PredictionsResponse>(
      API_CONFIG.endpoints.predictions.list,
      filters as Record<string, unknown> | undefined
    );
    return PredictionsTransformer.transformPredictionsResponse(response);
  }

  /**
   * Get prediction analytics
   */
  static async getAnalytics(): Promise<PredictionAnalytics> {
    const response = await api.get<PredictionsAnalyticsResponse>(
      API_CONFIG.endpoints.predictions.analytics
    );
    return PredictionsTransformer.transformAnalyticsResponse(response);
  }

  /**
   * Create prediction
   */
  static async createPrediction(data: CreatePredictionPayload, adminUser: string): Promise<Prediction> {
    // adminUser is passed as query param, not in body
    const bodyData = data;
    const params = { adminUser };
    const response = await api.post<Prediction>(
      API_CONFIG.endpoints.predictions.create,
      bodyData,
      params
    );
    return response;
  }

  /**
   * Get prediction detail
   */
  static async getPredictionDetail(id: string): Promise<PredictionDetail> {
    const response = await api.get<PredictionDetailResponse | PredictionDetail>(API_CONFIG.endpoints.predictions.detail(id));
    
    // Handle wrapped format: { success, data: PredictionDetail }
    if ('data' in response && response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      return response.data as unknown as PredictionDetail;
    }
    
    // If response is already PredictionDetail (direct format)
    if ('id' in response && ('fixtureId' in response || 'picks' in response)) {
      return response as unknown as PredictionDetail;
    }
    
    // Fallback: return as-is
    return response as unknown as PredictionDetail;
  }

  /**
   * Update prediction
   */
  static async updatePrediction(id: string, data: UpdatePredictionPayload): Promise<PredictionDetail> {
    const response = await api.put<PredictionDetailResponse>(
      API_CONFIG.endpoints.predictions.update(id),
      data
    );
    // Handle both wrapped and direct response formats
    if ('data' in response && response.data) {
      return response.data as PredictionDetail;
    }
    // Type assertion with unknown first to avoid type error
    return response as unknown as PredictionDetail;
  }

  /**
   * Delete prediction
   */
  static async deletePrediction(id: string): Promise<void> {
    await api.delete(API_CONFIG.endpoints.predictions.delete(id));
  }

  /**
   * Get sports
   */
  static async getSports(filters?: { sportId?: number }): Promise<Sport[]> {
    const response = await api.get<SportsResponse>(API_CONFIG.endpoints.sports.list, filters);
    return response.data;
  }

  /**
   * Get leagues
   */
  static async getLeagues(filters?: { sportId?: number }): Promise<League[]> {
    const response = await api.get<LeaguesResponse>(API_CONFIG.endpoints.leagues.list, filters);
    return response.data;
  }

  /**
   * Get upcoming fixtures
   */
  static async getUpcomingFixtures(filters?: {
    leagueId?: number;
    fromDate?: string;
  }): Promise<Fixture[]> {
    const response = await api.get<FixturesResponse>(
      API_CONFIG.endpoints.fixtures.upcoming,
      filters
    );
    return response.data;
  }

  /**
   * Get markets
   */
  static async getMarkets(filters?: { fixtureId?: number }): Promise<Market[]> {
    const response = await api.get<MarketsResponse>(API_CONFIG.endpoints.markets.list, filters);
    return response.data;
  }

  /**
   * Get market selections
   */
  static async getMarketSelections(filters?: {
    marketId?: number;
  }): Promise<Selection[]> {
    if (!filters?.marketId) {
      throw new Error('marketId is required for getting market selections');
    }
    const response = await api.get<SelectionsResponse>(API_CONFIG.endpoints.selections.list(filters.marketId));
    return response.data;
  }
}
