// /app/(dashboard)/dashboard/features/api/dashboardApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { RootState } from '../../../../../store/store';
import { 
  SummaryResponse,
  UserCardsResponse,
  PaymentCardsResponse,
  EngagementResponse,
  TrafficResponse,
  ActivityResponse,
  RecentActivityResponse,
  AnalyticsResponse,
  SummaryParams,
  UserCardsParams,
  PaymentCardsParams,
  EngagementParams,
  TrafficParams,
  ActivityParams,
  RecentActivityParams
} from '../types/dashboard.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://apidev.predictgalore.com';

// Define proper types for the base query
type LoggingBaseQueryArgs = FetchArgs;

// Custom base query with reduced logging - same implementation as settings API
const loggingBaseQuery: BaseQueryFn<
  LoggingBaseQueryArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const { url, method = "GET" } = args;

  // Only log in development
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚀 API: ${method} ${url}`);
  }

  try {
    const result = await fetchBaseQuery({
      baseUrl: BASE_URL,
      prepareHeaders: (headers: Headers, { getState }: { getState: () => unknown }) => {
        const state = getState() as RootState;
        const token = state.auth?.token;
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

      console.error(`❌ API Error (${method} ${url}):`, {
        status: result.error.status,
        data: result.error.data,
        originalStatus: errorWithOriginalStatus.originalStatus
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.groupEnd();
    }
    return result;
  } catch (error) {
    console.error(`💥 Fetch Error (${method} ${url}):`, error);
    
    if (process.env.NODE_ENV === 'development') {
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

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: loggingBaseQuery,
  tagTypes: [
    'DashboardSummary', 
    'UserCards', 
    'PaymentCards', 
    'Engagement', 
    'Traffic', 
    'Activity', 
    'Analytics'
  ],
  endpoints: (builder) => ({
    // 1. Dashboard Summary
    getDashboardSummary: builder.query<SummaryResponse, SummaryParams | void>({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        
        if (params && 'from' in params && params.from) queryParams.from = params.from;
        if (params && 'to' in params && params.to) queryParams.to = params.to;
        if (params && 'trafficDimension' in params && params.trafficDimension !== undefined) queryParams.trafficDimension = params.trafficDimension;
        if (params && 'activityPage' in params && params.activityPage) queryParams.activityPage = params.activityPage;
        if (params && 'activityPageSize' in params && params.activityPageSize) queryParams.activityPageSize = params.activityPageSize;

        return {
          url: '/api/v1/dashboard/summary',
          params: queryParams,
        };
      },
      providesTags: ['DashboardSummary'],
    }),

    // 2. User Cards
    getUserCards: builder.query<UserCardsResponse, UserCardsParams | void>({
      query: (params) => {
        const queryParams: Record<string, string> = {};
        
        if (params && 'from' in params && params.from) queryParams.from = params.from;
        if (params && 'to' in params && params.to) queryParams.to = params.to;

        return {
          url: '/api/v1/dashboard/cards/users',
          params: queryParams,
        };
      },
      providesTags: ['UserCards'],
    }),

    // 3. Payment Cards
    getPaymentCards: builder.query<PaymentCardsResponse, PaymentCardsParams | void>({
      query: (params) => {
        const queryParams: Record<string, string> = {};
        
        if (params && 'from' in params && params.from) queryParams.from = params.from;
        if (params && 'to' in params && params.to) queryParams.to = params.to;

        return {
          url: '/api/v1/dashboard/cards/payments',
          params: queryParams,
        };
      },
      providesTags: ['PaymentCards'],
    }),

    // 4. Engagement Data
    getEngagement: builder.query<EngagementResponse, EngagementParams | void>({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        
        if (params && 'from' in params && params.from) queryParams.from = params.from;
        if (params && 'to' in params && params.to) queryParams.to = params.to;
        if (params && 'segment' in params && params.segment !== undefined) queryParams.segment = params.segment;

        return {
          url: '/api/v1/dashboard/engagement',
          params: queryParams,
        };
      },
      providesTags: ['Engagement'],
    }),

    // 5. Traffic Data
    getTraffic: builder.query<TrafficResponse, TrafficParams | void>({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        
        if (params && 'from' in params && params.from) queryParams.from = params.from;
        if (params && 'to' in params && params.to) queryParams.to = params.to;
        if (params && 'dimension' in params && params.dimension !== undefined) queryParams.dimension = params.dimension;
        if (params && 'top' in params && params.top) queryParams.top = params.top;

        return {
          url: '/api/v1/dashboard/traffic',
          params: queryParams,
        };
      },
      providesTags: ['Traffic'],
    }),

    // 6. Activity Log (with pagination and filters)
    getActivity: builder.query<ActivityResponse, ActivityParams | void>({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        
        if (params && 'from' in params && params.from) queryParams.from = params.from;
        if (params && 'to' in params && params.to) queryParams.to = params.to;
        if (params && 'page' in params && params.page) queryParams.page = params.page;
        if (params && 'pageSize' in params && params.pageSize) queryParams.pageSize = params.pageSize;
        if (params && 'category' in params && params.category) queryParams.category = params.category;
        if (params && 'actorId' in params && params.actorId) queryParams.actorId = params.actorId;
        if (params && 'search' in params && params.search) queryParams.search = params.search;

        return {
          url: '/api/v1/dashboard/activity',
          params: queryParams,
        };
      },
      providesTags: ['Activity'],
    }),

    // 7. Recent Activity
    getRecentActivity: builder.query<RecentActivityResponse, RecentActivityParams | void>({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        
        if (params && 'from' in params && params.from) queryParams.from = params.from;
        if (params && 'to' in params && params.to) queryParams.to = params.to;
        if (params && 'take' in params && params.take) queryParams.take = params.take;

        return {
          url: '/api/v1/dashboard/activity/recent',
          params: queryParams,
        };
      },
      providesTags: ['Activity'],
    }),

    // Legacy endpoints (keeping for backward compatibility)
    getAnalytics: builder.query<AnalyticsResponse, { range?: string } | void>({
      query: (params) => {
        const queryParams: Record<string, string> = {};
        
        if (params && 'range' in params && params.range) queryParams.range = params.range;

        return {
          url: '/api/v1/dashboard/analytics',
          params: queryParams,
        };
      },
      providesTags: ['Analytics'],
    }),

    // Export Dashboard Data
    exportDashboardData: builder.mutation<Blob, SummaryParams>({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        
        if (params.from) queryParams.from = params.from;
        if (params.to) queryParams.to = params.to;
        if (params.trafficDimension !== undefined) queryParams.trafficDimension = params.trafficDimension;

        return {
          url: '/api/v1/dashboard/export',
          responseHandler: (response) => response.blob(),
          params: queryParams,
        };
      },
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetUserCardsQuery,
  useGetPaymentCardsQuery,
  useGetEngagementQuery,
  useGetTrafficQuery,
  useGetActivityQuery,
  useGetRecentActivityQuery,
  useGetAnalyticsQuery,
  useExportDashboardDataMutation,
} = dashboardApi;