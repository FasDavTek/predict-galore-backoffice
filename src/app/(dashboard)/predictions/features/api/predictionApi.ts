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

import { getFormattedFutureDate } from "../utils/dateUtils";

const BASE_URL = "https://apidev.predictgalore.com";

interface AuthState {
  token: string | null;
}

interface AppState {
  auth: AuthState;
}

// Define proper types for the base query
type LoggingBaseQueryArgs = FetchArgs & {
  params?: Record<string, unknown>;
  body?: unknown;
};

// Custom base query with logging
const loggingBaseQuery: BaseQueryFn<
  LoggingBaseQueryArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const { url, method = "GET", params, body } = args;

  console.group(`🚀 API Request: ${method} ${url}`);
  console.log("📤 Request Details:", {
    url: `${BASE_URL}${url}`,
    method,
    params,
    body,
    timestamp: new Date().toISOString(),
  });

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

    // Enhanced error logging
    if (result.error) {
      // Create a type-safe way to access originalStatus
      const errorWithOriginalStatus = result.error as FetchBaseQueryError & {
        originalStatus?: number;
      };

      // Safe logging without circular references
      console.error("❌ API Error Details:");
      console.error("  Status:", result.error.status);
      console.error(
        "  Data:",
        typeof result.error.data === "object"
          ? JSON.stringify(result.error.data, null, 2)
          : result.error.data
      );
      console.error(
        "  Original Status:",
        errorWithOriginalStatus.originalStatus
      );

      // Log response details if available
      if (result.meta?.response) {
        console.error("📥 Error Response:");
        console.error("  Status:", result.meta.response.status);
        console.error("  Status Text:", result.meta.response.statusText);
        console.error("  URL:", result.meta.response.url);
      }

      // Log the raw error structure safely
      console.error("🔍 Raw Error Object Structure:");
      console.error("  Type:", typeof result.error);
      console.error("  Keys:", Object.keys(result.error));
    } else {
      console.log("✅ API Success:", {
        status: result.meta?.response?.status,
        data: result.data,
        timestamp: new Date().toISOString(),
      });
    }

    console.groupEnd();
    return result;
  } catch (error) {
    console.error("💥 Fetch Error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      url: `${BASE_URL}${url}`,
      method,
      timestamp: new Date().toISOString(),
    });
    console.groupEnd();

    // Return a proper error object that RTK Query expects
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

        console.log("🔍 getPredictions filters:", filters);
        console.log("📋 getPredictions params:", params);

        return {
          url: "/api/v1/prediction",
          params,
        };
      },
      providesTags: ["Prediction"],
    }),

    getPredictionById: builder.query<PredictionApiResponse, string>({
      query: (predictionId) => {
        console.log("🔍 getPredictionById:", { predictionId });
        return {
          url: `/api/v1/prediction/${predictionId}`,
        };
      },
      providesTags: (result, error, id) => [{ type: "Prediction", id }],
    }),

    createPrediction: builder.mutation<
      PredictionApiResponse,
      CreatePredictionPayload
    >({
      query: (predictionData) => {
        console.log("📝 createPrediction data:", predictionData);
        return {
          url: "/api/v1/predictions",
          method: "POST",
          body: predictionData,
        };
      },
      invalidatesTags: ["Prediction", "PredictionsAnalytics"],
    }),

    updatePrediction: builder.mutation<
      PredictionApiResponse,
      { predictionId: string; predictionData: Partial<PredictionFormData> }
    >({
      query: ({ predictionId, predictionData }) => {
        console.log("✏️ updatePrediction:", { predictionId, predictionData });
        return {
          url: `/api/v1/prediction/${predictionId}`,
          method: "PUT",
          body: predictionData,
        };
      },
      invalidatesTags: (result, error, { predictionId }) => [
        { type: "Prediction", id: predictionId },
        "Prediction",
      ],
    }),

    deletePrediction: builder.mutation<void, string>({
      query: (predictionId) => {
        console.log("🗑️ deletePrediction:", { predictionId });
        return {
          url: `/api/v1/prediction/${predictionId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Prediction", "PredictionsAnalytics"],
    }),

    cancelPrediction: builder.mutation<PredictionApiResponse, string>({
      query: (predictionId) => {
        console.log("⏹️ cancelPrediction:", { predictionId });
        return {
          url: `/api/v1/prediction/${predictionId}/cancel`,
          method: "POST",
        };
      },
      invalidatesTags: ["Prediction", "PredictionsAnalytics"],
    }),

    getPredictionsAnalytics: builder.query<PredictionAnalyticsResponse, void>({
      query: () => {
        console.log("📊 getPredictionsAnalytics");
        return {
          url: "/api/v1/prediction/analytics",
        };
      },
      providesTags: ["PredictionsAnalytics"],
    }),

    exportPredictions: builder.mutation<Blob, PredictionsFilter>({
      query: (filters) => {
        console.log("📤 exportPredictions filters:", filters);

        // Convert PredictionsFilter to Record<string, unknown>
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

        console.log("🏈 getSports params:", params);
        console.log("📋 getSports queryParams:", queryParams);

        return {
          url: "/api/v1/sports",
          params: queryParams,
        };
      },
      providesTags: ["Sports"],
    }),

    getLeagues: builder.query<LeaguesApiResponse, { sportId: number }>({
      query: ({ sportId }) => {
        console.log("🏆 getLeagues:", { sportId });
        return {
          url: "/api/v1/leagues",
          params: { sportId },
        };
      },
      transformResponse: (response: LeaguesApiResponse) => {
        console.log("🏆 getLeagues raw response:", response);

        if (!response.data || !Array.isArray(response.data)) {
          console.log("🏆 getLeagues: No data or invalid response format");
          return response;
        }

        // Use a Map to get unique leagues by name
        const uniqueLeaguesMap = new Map();

        response.data.forEach((league) => {
          // Use league name as the key to ensure uniqueness
          if (!uniqueLeaguesMap.has(league.name)) {
            uniqueLeaguesMap.set(league.name, league);
          }
        });

        // Convert Map back to array
        const uniqueLeagues = Array.from(uniqueLeaguesMap.values());

        console.log("🏆 getLeagues filtered:", {
          originalCount: response.data.length,
          uniqueCount: uniqueLeagues.length,
          uniqueLeagues: uniqueLeagues.map((l) => ({ id: l.id, name: l.name })),
        });

        return {
          ...response,
          data: uniqueLeagues,
        };
      },
      providesTags: ["Leagues"],
    }),

    getLeaguesWithFixtures: builder.query<
      LeaguesApiResponse,
      { sportId: number }
    >({
      query: ({ sportId }) => {
        console.log("🔍 getLeaguesWithFixtures:", { sportId });
        return {
          url: "/api/v1/leagues",
          params: { sportId },
        };
      },
      transformResponse: async (
        response: LeaguesApiResponse,
        meta: TransformResponseMeta | undefined
      ) => {
        console.log("🔍 getLeaguesWithFixtures raw response:", response);

        if (!response.data || !Array.isArray(response.data)) {
          console.log(
            "🔍 getLeaguesWithFixtures: No data or invalid response format"
          );
          return response;
        }

        // Remove duplicates first
        const uniqueLeaguesMap = new Map();
        response.data.forEach((league) => {
          if (!uniqueLeaguesMap.has(league.name)) {
            uniqueLeaguesMap.set(league.name, league);
          }
        });
        const uniqueLeagues = Array.from(uniqueLeaguesMap.values());

        console.log("🔍 getLeaguesWithFixtures unique leagues:", {
          originalCount: response.data.length,
          uniqueCount: uniqueLeagues.length,
          leagues: uniqueLeagues.map((l) => ({ id: l.id, name: l.name })),
        });

        // Check which leagues have fixtures
        const leaguesWithFixtures = [];
        // Use tomorrow's date in YYYY-MM-DD format
        const tomorrow = getFormattedFutureDate(1);
        console.log("📅 Checking fixtures from date:", tomorrow);

        // Check fixtures for each league (limit to first 15 for performance)
        const leaguesToCheck = uniqueLeagues.slice(0, 15);
        console.log(
          "🔍 Checking fixtures for leagues:",
          leaguesToCheck.map((l) => l.name)
        );

        for (const league of leaguesToCheck) {
          try {
            console.log(
              `🔍 Checking fixtures for league: ${league.name} (ID: ${league.id})`
            );

            const fixtureUrl = `${BASE_URL}/api/v1/fixtures/upcoming?leagueId=${league.id}&from=${tomorrow}`;
            console.log(`🔍 Fixture API URL: ${fixtureUrl}`);

            const fixtureResponse = await fetch(fixtureUrl, {
              headers: {
                authorization:
                  meta?.request?.headers.get("authorization") || "",
                "Content-Type": "application/json",
              },
            });

            console.log(`🔍 Fixture response for ${league.name}:`, {
              status: fixtureResponse.status,
              statusText: fixtureResponse.statusText,
              ok: fixtureResponse.ok,
            });

            if (fixtureResponse.ok) {
              const fixtureData = await fixtureResponse.json();
              console.log(`🔍 Fixture data for ${league.name}:`, fixtureData);

              if (fixtureData.data && fixtureData.data.length > 0) {
                console.log(
                  `✅ ${league.name} has ${fixtureData.data.length} fixtures`
                );
                leaguesWithFixtures.push({
                  ...league,
                  fixtureCount: fixtureData.data.length,
                });
              } else {
                console.log(`❌ ${league.name} has no fixtures`);
              }
            } else {
              console.log(
                `❌ Fixture API error for ${league.name}:`,
                fixtureResponse.status,
                fixtureResponse.statusText
              );
            }
          } catch (error) {
            console.error(
              `💥 Error checking fixtures for league ${league.name}:`,
              error
            );
          }
        }

        console.log("🔍 Final leagues with fixtures:", {
          count: leaguesWithFixtures.length,
          leagues: leaguesWithFixtures.map((l) => ({
            name: l.name,
            fixtureCount: l.fixtureCount,
          })),
        });

        return {
          ...response,
          data: leaguesWithFixtures,
        };
      },
      providesTags: ["Leagues"],
    }),

    getUpcomingFixtures: builder.query<
      FixturesApiResponse,
      { leagueId: number; from?: string }
    >({
      query: ({ leagueId, from }) => {
        // If no from date provided, use tomorrow's date in YYYY-MM-DD format
        const fromDate = from || getFormattedFutureDate(1); // Default to tomorrow

        console.log("📅 getUpcomingFixtures:", {
          leagueId,
          from: fromDate,
          fromProvided: !!from,
        });

        return {
          url: "/api/v1/fixtures/upcoming",
          params: { leagueId, from: fromDate },
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        const shouldRefetch = currentArg?.leagueId !== previousArg?.leagueId;
        console.log("🔄 getUpcomingFixtures forceRefetch:", {
          currentLeagueId: currentArg?.leagueId,
          previousLeagueId: previousArg?.leagueId,
          shouldRefetch,
        });
        return shouldRefetch;
      },
      transformResponse: (response: FixturesApiResponse) => {
        console.log("📅 getUpcomingFixtures response:", {
          dataCount: response.data?.length || 0,
          data: response.data?.map((f) => ({
            id: f.id,
            label: f.label,
            kickoffUtc: f.kickoffUtc,
          })),
          success: response.success,
          message: response.message,
        });

        return {
          ...response,
          data: response.data || [],
        };
      },
      providesTags: ["Fixtures"],
    }),

    getPredictionTypes: builder.query<PredictionTypesApiResponse, void>({
      query: () => {
        console.log("🎯 getPredictionTypes");
        return {
          url: "/api/v1/prediction-types",
        };
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
      query: (data) => {
        console.log("🤖 askHuddle data:", data);
        return {
          url: "/api/v1/huddle/ask",
          method: "POST",
          body: data,
        };
      },
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
  useGetLeaguesWithFixturesQuery,
  useGetUpcomingFixturesQuery,
  useGetPredictionTypesQuery,
  useAskHuddleMutation,
} = predictionApi;
