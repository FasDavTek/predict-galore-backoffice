// features/types/api.types.ts
import {
  Prediction,
  PredictionAnalytics,
  Sport,
  League,
  Fixture,
  PredictionTypeOption,
} from "./prediction.types";

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

export interface SportsApiResponse {
  data: Sport[];
  success: boolean;
  message?: string;
}

export interface LeaguesApiResponse {
  data: League[];
  success: boolean;
  message?: string;
}

export interface FixturesApiResponse {
  data: Fixture[];
  success: boolean;
  message?: string;
}

export interface PredictionTypesApiResponse {
  data: PredictionTypeOption[];
  success: boolean;
  message?: string;
}

export interface HuddleApiResponse {
  data: {
    answer: string;
    sources?: string[];
    confidence?: number;
  };
  message?: string;
  success: boolean;
}
