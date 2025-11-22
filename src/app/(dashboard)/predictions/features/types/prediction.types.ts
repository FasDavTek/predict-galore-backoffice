// features/types/prediction.types.ts
export type PredictionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type PredictionType = 'classification' | 'regression' | 'clustering' | 'time_series';
export type PredictionAccuracy = 'high' | 'medium' | 'low';
export type AudienceType = 'PREMIUM' | 'FREE';

export interface Prediction {
  id: string;
  name: string;
  description?: string;
  type: PredictionType;
  status: PredictionStatus;
  accuracy?: PredictionAccuracy;
  confidenceScore?: number;
  inputData: string;
  outputData: string;
  modelId: string;
  modelName: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  createdBy: string;
  processingTime?: number;
  tags: string[];
  datasetSize: number;
  errorMessage?: string;
}

export interface PredictionsFilter {
  page?: number;
  limit?: number;
  search?: string;
  status?: PredictionStatus;
  type?: PredictionType;
  accuracy?: PredictionAccuracy;
  startDate?: string;
  endDate?: string;
}

export interface PredictionFormData {
  name: string;
  description: string;
  type: PredictionType;
  modelId: string;
  inputData: string;
  tags: string[];
  datasetSize: number;
}

export interface PredictionsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PredictionAnalytics {
  totalPredictions: number;
  completedPredictions: number;
  failedPredictions: number;
  averageProcessingTime: number;
  totalChange: number;
  completedChange: number;
  failedChange: number;
  processingTimeChange: number;
}

// New types for prediction form
export interface Sport {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

export interface League {
  id: number;
  name: string;
  sportId: number;
  country: string;
  isPopular: boolean;
}

export interface Fixture {
  id: number;
  label: string;  
  kickoffUtc: string;

}

export interface PredictionTypeOption {
  id: number;
  name: string;
  category: string;
}

export interface Pick {
  market: string;
  selectionKey: string;
  confidence: number;
}

export interface CreatePredictionPayload {
  fixtureId: number;
  title: string;
  analysis: string;
  accuracy: number;
  audience: AudienceType;
  picks: Pick[];
}

// API Response types
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