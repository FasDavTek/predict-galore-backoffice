import { Prediction, PredictionStatus, PredictionType, PredictionAccuracy } from '../types/prediction.types';

// More flexible interface that matches your API response structure
interface ApiPrediction {
  id: string | number;
  name: string;
  description?: string | null;
  type: string;
  status: string;
  accuracy?: string | null;
  confidenceScore?: number | null;
  inputData: string;
  outputData: string;
  modelId: string | number;
  modelName: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  createdBy: string;
  processingTime?: number | null;
  tags?: string[] | null;
  datasetSize: number;
  errorMessage?: string | null;
}

export const transformApiPredictionsToAppPredictions = (apiPredictions: ApiPrediction[]): Prediction[] => {
  return apiPredictions.map(prediction => ({
    id: String(prediction.id),
    name: prediction.name,
    description: prediction.description || undefined,
    type: prediction.type as PredictionType,
    status: prediction.status as PredictionStatus,
    accuracy: prediction.accuracy as PredictionAccuracy | undefined,
    confidenceScore: prediction.confidenceScore || undefined,
    inputData: prediction.inputData,
    outputData: prediction.outputData,
    modelId: String(prediction.modelId),
    modelName: prediction.modelName,
    createdAt: prediction.createdAt,
    updatedAt: prediction.updatedAt,
    completedAt: prediction.completedAt || undefined,
    createdBy: prediction.createdBy,
    processingTime: prediction.processingTime || undefined,
    tags: prediction.tags || [],
    datasetSize: prediction.datasetSize,
    errorMessage: prediction.errorMessage || undefined,
  }));
};

export const transformApiPredictionToAppPrediction = (apiPrediction: ApiPrediction): Prediction => {
  return {
    id: String(apiPrediction.id),
    name: apiPrediction.name,
    description: apiPrediction.description || undefined,
    type: apiPrediction.type as PredictionType,
    status: apiPrediction.status as PredictionStatus,
    accuracy: apiPrediction.accuracy as PredictionAccuracy | undefined,
    confidenceScore: apiPrediction.confidenceScore || undefined,
    inputData: apiPrediction.inputData,
    outputData: apiPrediction.outputData,
    modelId: String(apiPrediction.modelId),
    modelName: apiPrediction.modelName,
    createdAt: apiPrediction.createdAt,
    updatedAt: apiPrediction.updatedAt,
    completedAt: apiPrediction.completedAt || undefined,
    createdBy: apiPrediction.createdBy,
    processingTime: apiPrediction.processingTime || undefined,
    tags: apiPrediction.tags || [],
    datasetSize: apiPrediction.datasetSize,
    errorMessage: apiPrediction.errorMessage || undefined,
  };
};

export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: '#F59E0B',
    processing: '#3B82F6',
    completed: '#10B981',
    failed: '#EF4444',
    cancelled: '#6B7280',
  };
  return colors[status] || '#6B7280';
};

export const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    classification: '#8B5CF6',
    regression: '#06B6D4',
    clustering: '#F97316',
    time_series: '#EC4899',
  };
  return colors[type] || '#6B7280';
};

export const formatProcessingTime = (seconds?: number): string => {
  if (!seconds) return 'N/A';
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
};