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
  if (url.includes('/summary')) {
    dataSummary = 'Dashboard summary data retrieved';
  } else if (url.includes('/cards/users')) {
    dataSummary = 'User cards data retrieved';
  } else if (url.includes('/cards/payments')) {
    dataSummary = 'Payment cards data retrieved';
  } else if (url.includes('/engagement')) {
    dataSummary = 'Engagement data retrieved';
  } else if (url.includes('/traffic')) {
    dataSummary = 'Traffic data retrieved';
  } else if (url.includes('/activity')) {
    if (url.includes('/recent')) {
      dataSummary = 'Recent activity data retrieved';
    } else {
      dataSummary = 'Activity log data retrieved';
    }
  } else if (url.includes('/analytics')) {
    dataSummary = 'Analytics data retrieved';
  } else if (url.includes('/export')) {
    dataSummary = 'Dashboard export generated';
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
        if (method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE") {
          console.log(`📝 ${method} Operation Completed - ${url}`, {
            duration: `${duration}ms`,
            timestamp,
            requestData: body || params || 'No data',
            responseData: result.data
          });
        }
        
        // Log specific data for GET requests on dashboard endpoints
        if (method === "GET" && result.data) {
          const apiData = isApiResponse(result.data) ? result.data.data : result.data;
          
          if (url?.includes('/summary')) {
            console.log('📊 Dashboard Summary:', apiData);
            if (apiData && typeof apiData === 'object') {
              const summary = apiData as Record<string, unknown>;
              console.log('📈 Summary Metrics:', {
                totalUsers: summary.totalUsers,
                activeUsers: summary.activeUsers,
                totalRevenue: summary.totalRevenue,
                predictions: summary.predictions,
                conversionRate: summary.conversionRate
              });
            }
          } else if (url?.includes('/cards/users')) {
            console.log('👥 User Cards Data:', apiData);
          } else if (url?.includes('/cards/payments')) {
            console.log('💰 Payment Cards Data:', apiData);
            if (apiData && typeof apiData === 'object') {
              const payments = apiData as Record<string, unknown>;
              console.log('💳 Payment Metrics:', {
                totalRevenue: payments.totalRevenue,
                successfulPayments: payments.successfulPayments,
                failedPayments: payments.failedPayments,
                averageOrderValue: payments.averageOrderValue
              });
            }
          } else if (url?.includes('/engagement')) {
            console.log('📱 Engagement Data:', apiData);
            if (isArrayData(apiData)) {
              console.log(`📊 Engagement Items: ${apiData.length}`);
            }
          } else if (url?.includes('/traffic')) {
            console.log('🚦 Traffic Data:', apiData);
            if (isArrayData(apiData)) {
              console.log(`🌐 Traffic Sources: ${apiData.length}`);
            }
          } else if (url?.includes('/activity')) {
            if (url.includes('/recent')) {
              console.log('🕒 Recent Activity:', apiData);
              if (isArrayData(apiData)) {
                console.log(`📋 Recent Activities: ${apiData.length}`);
              }
            } else {
              console.log('📝 Activity Log:', apiData);
              if (apiData && typeof apiData === 'object') {
                const activity = apiData as Record<string, unknown>;
                if ('items' in activity && isArrayData(activity.items)) {
                  console.log(`📄 Activity Items: ${activity.items.length}`);
                }
                if ('total' in activity) {
                  console.log(`📚 Total Activities: ${activity.total}`);
                }
              }
            }
          } else if (url?.includes('/analytics')) {
            console.log('📈 Analytics Data:', apiData);
          } else if (url?.includes('/export')) {
            console.log('📤 Dashboard Export Generated - Blob Response');
          }
        }
        
        // Log dashboard-specific operation details
        if (method === "POST" && url?.includes('/export')) {
          console.log('📊 Dashboard Export Operation:', {
            exportParams: params,
            result: 'Blob data generated'
          });
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