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

// Define proper types for the base query
type LoggingBaseQueryArgs = FetchArgs;

// Custom base query with reduced logging
const loggingBaseQuery: BaseQueryFn<
  LoggingBaseQueryArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const { url, method = "GET" } = args;

  // Only log in development
  if (process.env.NODE_ENV === "development") {
    console.group(`🚀 API: ${method} ${url}`);
  }

  try {
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

    // Only log errors, not successful responses to reduce noise
    if (result.error) {
      const errorWithOriginalStatus = result.error as FetchBaseQueryError & {
        originalStatus?: number;
      };

      // Don't log 404 errors for prediction-types to reduce noise
      if (url !== "/api/v1/prediction-types" || result.error.status !== 404) {
        console.error(`❌ API Error (${method} ${url}):`, {
          status: result.error.status,
          data: result.error.data,
          originalStatus: errorWithOriginalStatus.originalStatus,
        });
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.groupEnd();
    }
    return result;
  } catch (error) {
    console.error(`💥 Fetch Error (${method} ${url}):`, error);

    if (process.env.NODE_ENV === "development") {
      console.groupEnd();
    }

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
        url: "/api/v1/prediction-types",
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
