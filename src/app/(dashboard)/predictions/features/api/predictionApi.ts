// features/api/predictionApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import {
  PredictionsApiResponse,
  PredictionApiResponse,
  PredictionAnalyticsResponse,
  SportsApiResponse,
  LeaguesApiResponse,
  FixturesApiResponse,
  PredictionTypesApiResponse,
  HuddleApiResponse,
} from "../types/api.types";
import {
  PredictionsFilter,
  PredictionFormData,
  CreatePredictionPayload,
} from "../types/prediction.types";

const BASE_URL = "https://apidev.predictgalore.com";

interface AuthState {
  token: string | null;
}

interface AppState {
  auth: AuthState;
}

interface ApiErrorData {
  message?: string;
  status?: string;
  statusCode?: string;
  error?: string;
  details?: unknown;
}

interface ApiSuccessData {
  message?: string;
  status?: string;
  data?: unknown;
  success?: boolean;
}

interface SuccessLoggingData {
  method: string;
  url: string;
  duration: number;
  response: ApiSuccessData;
}

interface DetailedLogData {
  endpoint: string;
  method: string;
  timestamp: string;
  duration: number;
  requestData?: unknown;
  responseData?: unknown;
  errorData?: unknown;
}

// Define proper types for the base query
type LoggingBaseQueryArgs = FetchArgs;

// Enhanced error formatter with detailed error logging
const formatApiError = (error: FetchBaseQueryError, method: string, url: string): string => {
  const { status, data } = error;
  
  if (data && typeof data === 'object' && data !== null) {
    const apiError = data as ApiErrorData;
    const parts = [
      apiError.message,
      apiError.status && `Status: ${apiError.status}`,
      apiError.statusCode && `Code: ${apiError.statusCode}`,
      apiError.error && `Error: ${apiError.error}`
    ].filter(Boolean);
    
    return `❌ ${method} ${url} - ${parts.join(' | ')}`;
  }
  
  return `❌ ${method} ${url} - Status: ${status || 'UNKNOWN'}`;
};

// Enhanced success formatter
const formatApiSuccess = (loggingData: SuccessLoggingData): string => {
  const { method, url, duration, response } = loggingData;
  
  const parts = [
    response.message,
    response.status && `Status: ${response.status}`,
    `Duration: ${duration}ms`
  ].filter(Boolean);
  
  // Add data summary for specific endpoints
  let dataSummary = '';
  if (url.includes('/prediction') && !url.includes('/analytics')) {
    dataSummary = 'Prediction data processed';
  } else if (url.includes('/analytics')) {
    dataSummary = 'Analytics data retrieved';
  } else if (url.includes('/sports')) {
    dataSummary = 'Sports data retrieved';
  } else if (url.includes('/leagues')) {
    dataSummary = 'Leagues data retrieved';
  } else if (url.includes('/fixtures')) {
    dataSummary = 'Fixtures data retrieved';
  } else if (url.includes('/prediction-types')) {
    dataSummary = 'Prediction types retrieved';
  } else if (url.includes('/huddle')) {
    dataSummary = 'Huddle AI response';
  }
  
  if (dataSummary) {
    parts.push(dataSummary);
  }
  
  return `✅ ${method} ${url} - ${parts.join(' | ')}`;
};

// Type guard to check if data has array structure
const isArrayData = (data: unknown): data is unknown[] => {
  return Array.isArray(data);
};

// Type guard for API response structure
const isApiResponse = (data: unknown): data is ApiSuccessData => {
  return typeof data === 'object' && data !== null;
};

// Safe JSON stringify for logging
const safeStringify = (obj: unknown, space?: number): string => {
  try {
    return JSON.stringify(obj, null, space);
  } catch {
    return '[Unserializable Object]';
  }
};

// Log detailed request/response data
const logDetailedData = (logData: DetailedLogData): void => {
  const { endpoint, method, timestamp, duration, requestData, responseData, errorData } = logData;
  
  console.group(`🔍 ${method} ${endpoint} - Detailed Log`);
  console.log('📅 Timestamp:', timestamp);
  console.log('⏱️ Duration:', `${duration}ms`);
  
  if (requestData) {
    console.log('📤 Request Data:', requestData);
    console.log('📤 Request Data (JSON):', safeStringify(requestData, 2));
  }
  
  if (responseData) {
    console.log('📥 Response Data:', responseData);
    console.log('📥 Response Data (JSON):', safeStringify(responseData, 2));
  }
  
  if (errorData) {
    console.log('🚨 Error Data:', errorData);
    console.log('🚨 Error Data (JSON):', safeStringify(errorData, 2));
  }
  
  console.groupEnd();
};

// Custom base query with enhanced logging
const loggingBaseQuery: BaseQueryFn<
  LoggingBaseQueryArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const { url, method = "GET", body, params } = args;
  const isDevelopment = process.env.NODE_ENV === "development";

  // Only log the specific endpoint being called
  const logRequest = () => {
    if (isDevelopment) {
      console.log(`🚀 ${method} ${url}`);
      if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
        console.log('📤 Request Payload:', body);
      }
      if (params && Object.keys(params).length > 0) {
        console.log('🔍 Request Params:', params);
      }
    }
  };

  const startTime = Date.now();

  try {
    logRequest();

    const result = await fetchBaseQuery({
      baseUrl: BASE_URL,
      prepareHeaders: (headers, { getState }) => {
        const state = getState() as AppState;
        const token = state.auth.token;
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
        headers.set("Content-Type", "application/json");
        return headers;
      },
    })(args, api, extraOptions);

    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();

    if (result.error) {
      const errorMessage = formatApiError(result.error, method, url || '');
      console.error(errorMessage);
      
      // Log detailed error information
      logDetailedData({
        endpoint: url || '',
        method,
        timestamp,
        duration,
        requestData: body || params || undefined,
        errorData: result.error
      });
      
      // Special handling for prediction-types 404 to reduce noise but still log
      if (url === "/api/v1/prediction-types" && result.error.status === 404) {
        console.warn('⚠️ Prediction types endpoint returned 404 - using fallback data');
      }
    } else {
      // Log success with details
      const responseData = isApiResponse(result.data) ? result.data : { data: result.data };
      const successMessage = formatApiSuccess({
        method,
        url: url || '',
        duration,
        response: responseData
      });
      console.log(successMessage);
      
      // Log detailed success information
      logDetailedData({
        endpoint: url || '',
        method,
        timestamp,
        duration,
        requestData: body || params || undefined,
        responseData: result.data
      });
      
      // Detailed success logging for specific operations
      if (isDevelopment) {
        if (method === "POST" || method === "PUT" || method === "DELETE") {
          console.log(`📝 ${method} Operation Completed - ${url}`, {
            duration: `${duration}ms`,
            timestamp,
            requestData: body || 'No body',
            responseData: result.data
          });
        }
        
        // Log specific data for GET requests on important endpoints
        if (method === "GET" && result.data) {
          const apiData = isApiResponse(result.data) ? result.data.data : result.data;
          
          if (url?.includes('/predictions') || url?.includes('/prediction')) {
            if (isArrayData(apiData)) {
              console.log(`📊 Predictions Count: ${apiData.length}`);
              console.log('📊 Predictions Data:', apiData);
            } else if (apiData && typeof apiData === 'object') {
              const dataObj = apiData as Record<string, unknown>;
              if ('items' in dataObj && isArrayData(dataObj.items)) {
                console.log(`📊 Predictions Count: ${dataObj.items.length}`);
              }
            }
          } else if (url?.includes('/sports')) {
            if (isArrayData(apiData)) {
              console.log(`⚽ Sports Count: ${apiData.length}`);
              console.log('⚽ Sports Data:', apiData);
            }
          } else if (url?.includes('/leagues')) {
            if (isArrayData(apiData)) {
              console.log(`🏆 Leagues Count: ${apiData.length}`);
              console.log('🏆 Leagues Data:', apiData);
            }
          } else if (url?.includes('/fixtures')) {
            if (isArrayData(apiData)) {
              console.log(`⚔️ Fixtures Count: ${apiData.length}`);
              console.log('⚔️ Fixtures Data:', apiData);
            }
          } else if (url?.includes('/prediction-types')) {
            if (isArrayData(apiData)) {
              console.log(`🎯 Prediction Types Count: ${apiData.length}`);
              console.log('🎯 Prediction Types Data:', apiData);
            }
          } else if (url?.includes('/analytics')) {
            console.log('📈 Analytics Data:', apiData);
          } else if (url?.includes('/huddle')) {
            console.log('🤖 Huddle AI Response:', apiData);
          }
        }
      }
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    const errorMessage = `💥 ${method} ${url} - ${
      error instanceof Error ? error.message : "Unknown fetch error"
    } (${duration}ms)`;
    
    console.error(errorMessage);
    
    // Log detailed error information for fetch errors
    logDetailedData({
      endpoint: url || '',
      method,
      timestamp,
      duration,
      requestData: body || params || undefined,
      errorData: {
        type: "FETCH_ERROR",
        message: error instanceof Error ? error.message : "Unknown fetch error",
        stack: error instanceof Error ? error.stack : undefined
      }
    });
    
    return {
      error: {
        status: "FETCH_ERROR",
        error: error instanceof Error ? error.message : "Unknown fetch error",
      } as FetchBaseQueryError,
    };
  }
};

// Define proper type for the transformResponse parameter
interface TransformResponseMeta {
  request: {
    headers: Headers;
  };
  response?: {
    status: number;
  };
}

// Define proper type for prediction types response
interface PredictionTypesFallbackResponse {
  data: Array<{
    id: number;
    name: string;
    category: string;
  }>;
  success: boolean;
  message: string;
}

export const predictionApi = createApi({
  reducerPath: "predictionApi",
  baseQuery: loggingBaseQuery,
  tagTypes: [
    "Prediction",
    "PredictionsAnalytics",
    "Sports",
    "Leagues",
    "Fixtures",
    "PredictionTypes",
  ],
  endpoints: (builder) => ({
    // Existing prediction endpoints
    getPredictions: builder.query<PredictionsApiResponse, PredictionsFilter>({
      query: (filters) => {
        const params: Record<string, unknown> = {
          page: filters.page || 1,
          limit: filters.limit || 10,
          search: filters.search,
          status: filters.status,
          type: filters.type,
          accuracy: filters.accuracy,
          startDate: filters.startDate,
          endDate: filters.endDate,
        };

        return {
          url: "/api/v1/prediction",
          params,
        };
      },
      providesTags: ["Prediction"],
    }),

    getPredictionById: builder.query<PredictionApiResponse, string>({
      query: (predictionId) => ({
        url: `/api/v1/prediction/${predictionId}`,
      }),
      providesTags: (result, error, id) => [{ type: "Prediction", id }],
    }),

    createPrediction: builder.mutation<
      PredictionApiResponse,
      CreatePredictionPayload
    >({
      query: (predictionData) => ({
        url: "/api/v1/predictions",
        method: "POST",
        body: predictionData,
      }),
      invalidatesTags: ["Prediction", "PredictionsAnalytics"],
    }),

    updatePrediction: builder.mutation<
      PredictionApiResponse,
      { predictionId: string; predictionData: Partial<PredictionFormData> }
    >({
      query: ({ predictionId, predictionData }) => ({
        url: `/api/v1/prediction/${predictionId}`,
        method: "PUT",
        body: predictionData,
      }),
      invalidatesTags: (result, error, { predictionId }) => [
        { type: "Prediction", id: predictionId },
        "Prediction",
      ],
    }),

    deletePrediction: builder.mutation<void, string>({
      query: (predictionId) => ({
        url: `/api/v1/prediction/${predictionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Prediction", "PredictionsAnalytics"],
    }),

    cancelPrediction: builder.mutation<PredictionApiResponse, string>({
      query: (predictionId) => ({
        url: `/api/v1/prediction/${predictionId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["Prediction", "PredictionsAnalytics"],
    }),

    getPredictionsAnalytics: builder.query<PredictionAnalyticsResponse, void>({
      query: () => ({
        url: "/api/v1/prediction/analytics",
      }),
      providesTags: ["PredictionsAnalytics"],
    }),

    exportPredictions: builder.mutation<Blob, PredictionsFilter>({
      query: (filters) => {
        const params: Record<string, unknown> = {
          page: filters.page,
          limit: filters.limit,
          search: filters.search,
          status: filters.status,
          type: filters.type,
          accuracy: filters.accuracy,
          startDate: filters.startDate,
          endDate: filters.endDate,
        };

        return {
          url: "/api/v1/prediction/export",
          responseHandler: (response: Response) => response.blob(),
          params,
        };
      },
    }),

    // New endpoints for prediction form
    getSports: builder.query<
      SportsApiResponse,
      { pageNumber?: number; pageSize?: number }
    >({
      query: (params = {}) => {
        const queryParams: Record<string, unknown> = {
          pageNumber: params.pageNumber || 1,
          pageSize: params.pageSize || 10,
        };

        return {
          url: "/api/v1/sports",
          params: queryParams,
        };
      },
      providesTags: ["Sports"],
    }),

    getLeagues: builder.query<LeaguesApiResponse, { sportId: number }>({
      query: ({ sportId }) => ({
        url: "/api/v1/leagues",
        params: { sportId },
      }),
      transformResponse: (response: LeaguesApiResponse) => {
        if (!response.data || !Array.isArray(response.data)) {
          return response;
        }

        // Use a Map to get unique leagues by name
        const uniqueLeaguesMap = new Map();

        response.data.forEach((league) => {
          if (!uniqueLeaguesMap.has(league.name)) {
            uniqueLeaguesMap.set(league.name, league);
          }
        });

        // Convert Map back to array
        const uniqueLeagues = Array.from(uniqueLeaguesMap.values());

        return {
          ...response,
          data: uniqueLeagues,
        };
      },
      providesTags: ["Leagues"],
    }),

    getUpcomingFixtures: builder.query<
      FixturesApiResponse,
      { 
        leagueId: number; 
        from?: string; 
        to?: string;
        page?: number;
        pageSize?: number;
      }
    >({
      query: ({ leagueId, from, to, page, pageSize }) => {
        const params: Record<string, string | number> = {
          leagueId: leagueId,
        };
        
        if (from) params.from = from;
        if (to) params.to = to;
        if (page) params.page = page;
        if (pageSize) params.pageSize = pageSize;

        return {
          url: `/api/v1/fixtures/upcoming`,
          params,
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg?.leagueId !== previousArg?.leagueId || 
               currentArg?.from !== previousArg?.from;
      },
      transformResponse: (response: FixturesApiResponse) => {
        // Ensure data is always an array, even if the API returns different structure
        let fixturesData = [];
        
        if (response.data) {
          if (Array.isArray(response.data)) {
            fixturesData = response.data;
          } else if (response.data && typeof response.data === 'object') {
            // Handle different possible response structures with proper type checking
            const data = response.data as Record<string, unknown>;
            
            if ('items' in data && Array.isArray(data.items)) {
              // Handle paginated response
              fixturesData = data.items;
            } else if ('fixtures' in data && Array.isArray(data.fixtures)) {
              // Handle nested fixtures property
              fixturesData = data.fixtures;
            } else {
              // Try to find any array property in the response data
              const arrayProperties = Object.values(data).filter(Array.isArray);
              if (arrayProperties.length > 0) {
                fixturesData = arrayProperties[0];
              }
            }
          }
        }

        return {
          ...response,
          data: fixturesData,
        };
      },
      providesTags: ["Fixtures"],
    }),

    getPredictionTypes: builder.query<PredictionTypesApiResponse, void>({
      query: () => ({
        url: "/api/v1/prediction/types",
      }),
      // Handle 404 gracefully with fallback data
      transformResponse: (
        response: PredictionTypesApiResponse,
        meta: TransformResponseMeta | undefined
      ): PredictionTypesApiResponse | PredictionTypesFallbackResponse => {
        if (meta?.response?.status === 404) {
          // Return fallback prediction types
          return {
            data: [
              { id: 1, name: "Match Winner", category: "main" },
              { id: 2, name: "Over/Under", category: "goals" },
              { id: 3, name: "Both Teams to Score", category: "goals" },
              { id: 4, name: "Double Chance", category: "main" },
              { id: 5, name: "Correct Score", category: "score" },
            ],
            success: true,
            message: "Using fallback prediction types",
          };
        }
        return response;
      },
      providesTags: ["PredictionTypes"],
    }),

    // Huddle AI endpoint
    askHuddle: builder.mutation<
      HuddleApiResponse,
      {
        prompt: string;
        sport: string;
        league: string;
        teams: string[];
        toolsAllowed: boolean;
        lookbackGames: number;
        asOfUtc: string;
      }
    >({
      query: (data) => ({
        url: "/api/v1/huddle/ask",
        method: "POST",
        body: data,
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
  useGetSportsQuery,
  useGetLeaguesQuery,
  useGetUpcomingFixturesQuery,
  useGetPredictionTypesQuery,
  useAskHuddleMutation,
} = predictionApi;