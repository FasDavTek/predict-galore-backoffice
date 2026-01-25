/**
 * Predictions API Types
 * API response types
 */

import type {
  Prediction,
  PredictionsFilter,
  PredictionAnalytics,
  PredictionStatus,
  PredictionType,
  PredictionAccuracy,
  Sport,
  League,
  Fixture,
  Market,
  Selection,
  CreatePredictionPayload,
  PredictionDetail,
  UpdatePredictionPayload,
} from '../model/types';

export interface PredictionsResponse {
  success: boolean;
  message: string;
  errors: null | unknown;
  data: {
    page: number;
    pageSize: number;
    total: number;
    items: Prediction[];
  };
}

export interface PredictionsAnalyticsResponse {
  success: boolean;
  data: PredictionAnalytics;
}

export interface SportsResponse {
  success: boolean;
  data: Sport[];
}

export interface LeaguesResponse {
  success: boolean;
  data: League[];
}

export interface FixturesResponse {
  success: boolean;
  data: Fixture[];
}

export interface MarketsResponse {
  success: boolean;
  data: Market[];
}

export interface SelectionsResponse {
  success: boolean;
  data: Selection[];
}

export interface PredictionDetailResponse {
  success: boolean;
  message?: string;
  errors?: null | unknown;
  data: PredictionDetail;
}

// Re-export domain types
export type {
  Prediction,
  PredictionsFilter,
  PredictionAnalytics,
  PredictionStatus,
  PredictionType,
  PredictionAccuracy,
  Sport,
  League,
  Fixture,
  Market,
  Selection,
  CreatePredictionPayload,
  PredictionDetail,
  UpdatePredictionPayload,
};

