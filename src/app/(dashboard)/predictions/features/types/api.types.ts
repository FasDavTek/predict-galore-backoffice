import { Prediction, PredictionAnalytics,  } from './prediction.types';

export interface PredictionsApiResponse {
  data: {
    resultItems: Prediction[];
    page: number;
    pageSize: number;
    total: number;
  };
  message?: string;
  success: boolean;
}

export interface PredictionApiResponse {
  data: Prediction;
  message?: string;
  success: boolean;
}

export interface PredictionAnalyticsResponse {
  data: PredictionAnalytics;
  message?: string;
  success: boolean;
}