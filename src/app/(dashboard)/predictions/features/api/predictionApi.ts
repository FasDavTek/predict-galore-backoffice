import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  PredictionsApiResponse, 
  PredictionApiResponse, 
  PredictionAnalyticsResponse 
} from '../types/api.types';
import { 
  PredictionsFilter, 
  PredictionFormData 
} from '../types/prediction.types';

const BASE_URL = 'https://apidev.predictgalore.com';

// Define a type for the auth state
interface AuthState {
  token: string | null;
}

// Define a type for the root state structure we need
interface AppState {
  auth: AuthState;
}

export const predictionApi = createApi({
  reducerPath: 'predictionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL ,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as AppState;
      const token = state.auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Prediction', 'PredictionsAnalytics'],
  endpoints: (builder) => ({
    getPredictions: builder.query<PredictionsApiResponse, PredictionsFilter>({
      query: (filters) => ({
        url: '/api/v1/prediction',
        params: {
          page: filters.page || 1,
          limit: filters.limit || 10,
          search: filters.search,
          status: filters.status,
          type: filters.type,
          accuracy: filters.accuracy,
          startDate: filters.startDate,
          endDate: filters.endDate,
        },
      }),
      providesTags: ['Prediction'],
    }),

    getPredictionById: builder.query<PredictionApiResponse, string>({
      query: (predictionId) => `/api/v1/prediction/${predictionId}`,
      providesTags: (result, error, id) => [{ type: 'Prediction', id }],
    }),

    createPrediction: builder.mutation<PredictionApiResponse, PredictionFormData>({
      query: (predictionData) => ({
        url: '/api/v1/predictions',
        method: 'POST',
        body: predictionData,
      }),
      invalidatesTags: ['Prediction', 'PredictionsAnalytics'],
    }),

    updatePrediction: builder.mutation<PredictionApiResponse, { predictionId: string; predictionData: Partial<PredictionFormData> }>({
      query: ({ predictionId, predictionData }) => ({
        url: `/api/v1/prediction/${predictionId}`,
        method: 'PUT',
        body: predictionData,
      }),
      invalidatesTags: (result, error, { predictionId }) => [
        { type: 'Prediction', id: predictionId },
        'Prediction',
      ],
    }),

    deletePrediction: builder.mutation<void, string>({
      query: (predictionId) => ({
        url: `/api/v1/prediction/${predictionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Prediction', 'PredictionsAnalytics'],
    }),

    cancelPrediction: builder.mutation<PredictionApiResponse, string>({
      query: (predictionId) => ({
        url: `/api/v1/prediction/${predictionId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Prediction', 'PredictionsAnalytics'],
    }),

    getPredictionsAnalytics: builder.query<PredictionAnalyticsResponse, void>({
      query: () => '/api/v1/prediction/analytics',
      providesTags: ['PredictionsAnalytics'],
    }),

    exportPredictions: builder.mutation<Blob, PredictionsFilter>({
      query: (filters) => ({
        url: '/api/v1/prediction/export',
        responseHandler: (response) => response.blob(),
        params: filters,
      }),
    }),
  }),
});

export const {
  useGetPredictionsQuery,
  useGetPredictionByIdQuery,
  useCreatePredictionMutation,
  useUpdatePredictionMutation,
  useDeletePredictionMutation,
  useCancelPredictionMutation,
  useGetPredictionsAnalyticsQuery,
  useExportPredictionsMutation,
} = predictionApi;