/**
 * Predictions Transformers
 * Business logic for data transformation
 */

import type {
  Prediction,
  PredictionAnalytics,
} from '../model/types';
import type {
  PredictionsResponse,
  PredictionsAnalyticsResponse,
} from '../api/types';

export class PredictionsTransformer {
  /**
   * Transform API response to domain model
   */
  static transformPredictionsResponse(
    response: PredictionsResponse
  ): {
    predictions: Prediction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  } {
    const { page, pageSize, total, items } = response.data;
    const totalPages = Math.ceil(total / pageSize);
    
    return {
      predictions: items,
      pagination: {
        page,
        limit: pageSize,
        total,
        totalPages,
      },
    };
  }

  /**
   * Transform analytics response
   */
  static transformAnalyticsResponse(
    response: PredictionsAnalyticsResponse
  ): PredictionAnalytics {
    return response.data;
  }
}

