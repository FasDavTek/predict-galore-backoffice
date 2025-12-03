// src/app/(dashboard)/users/features/api/userApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { 
  UsersApiResponse, 
  UserApiResponse, 
  UsersAnalyticsResponse 
} from '../types/api.types';
import { 
  UsersFilter, 
  UserFormData 
} from '../types/user.types';
import { transformApiUserToAppUser, transformApiUsersToAppUsers } from '../utils/userTransformers';

// Define proper RootState type to avoid using 'any'
interface RootState {
  auth: {
    token: string | null;
  };
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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://apidev.predictgalore.com';

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
  if (url.includes('/users') && !url.includes('/summary') && !url.includes('/export')) {
    dataSummary = 'Users data processed';
  } else if (url.includes('/summary')) {
    dataSummary = 'Analytics data retrieved';
  } else if (url.includes('/export')) {
    dataSummary = 'Export data generated';
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
        
        // Log specific data for GET requests on important endpoints
        if (method === "GET" && result.data) {
          const apiData = isApiResponse(result.data) ? result.data.data : result.data;
          
          if (url?.includes('/users') && !url?.includes('/summary')) {
            if (isArrayData(apiData)) {
              console.log(`👥 Users Count: ${apiData.length}`);
              console.log('👥 Users Data:', apiData);
            } else if (apiData && typeof apiData === 'object') {
              const dataObj = apiData as Record<string, unknown>;
              if ('resultItems' in dataObj && isArrayData(dataObj.resultItems)) {
                console.log(`👥 Users Count: ${dataObj.resultItems.length}`);
                console.log('👥 Users Items:', dataObj.resultItems);
              }
              if ('total' in dataObj) {
                console.log(`👥 Total Users: ${dataObj.total}`);
              }
              if ('page' in dataObj) {
                console.log(`📄 Current Page: ${dataObj.page}`);
              }
              if ('totalPages' in dataObj) {
                console.log(`📚 Total Pages: ${dataObj.totalPages}`);
              }
            }
          } else if (url?.includes('/summary')) {
            console.log('📊 Users Analytics:', apiData);
          } else if (url?.includes('/export')) {
            console.log('📤 Export Data Generated - Blob Response');
          }
        }
        
        // Log user operation details
        if (method === "POST" && url?.includes('/users') && !url.includes('/export')) {
          console.log('👤 User Creation Operation:', {
            userData: body,
            result: result.data
          });
        } else if (method === "PUT" && url?.includes('/users/')) {
          const userId = url.split('/').pop();
          console.log('✏️ User Update Operation:', {
            userId,
            updateData: body,
            result: result.data
          });
        } else if (method === "DELETE" && url?.includes('/users/')) {
          const userId = url.split('/').pop();
          console.log('🗑️ User Deletion Operation:', {
            userId,
            result: result.data
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

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: loggingBaseQuery,
  tagTypes: ['User', 'UsersAnalytics'], 
  endpoints: (builder) => ({
    getUsers: builder.query<UsersApiResponse, UsersFilter>({
      query: (filters) => ({
        url: '/api/v1/admin/users',
        params: {
          page: filters.page || 1,
          limit: filters.limit || 10,
          search: filters.search,
          status: filters.status,
          plan: filters.plan,
          role: filters.role,
        },
      }),
      // Transform the response to match your app's User interface
      transformResponse: (response: UsersApiResponse) => {
        if (response.data?.resultItems) {
          return {
            ...response,
            data: {
              ...response.data,
              resultItems: transformApiUsersToAppUsers(response.data.resultItems),
            },
          };
        }
        return response;
      },
      providesTags: ['User'],
    }),

    getUserById: builder.query<UserApiResponse, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
      }),
      // Transform individual user response
      transformResponse: (response: UserApiResponse) => {
        if (response.data) {
          return {
            ...response,
            data: transformApiUserToAppUser(response.data),
          };
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    createUser: builder.mutation<UserApiResponse, UserFormData>({
      query: (userData) => ({
        url: '/admin/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User', 'UsersAnalytics'],
    }),

    updateUser: builder.mutation<UserApiResponse, { userId: string; userData: Partial<UserFormData> }>({
      query: ({ userId, userData }) => ({
        url: `/admin/users/${userId}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
        'User',
      ],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'UsersAnalytics'],
    }),

    getUsersAnalytics: builder.query<UsersAnalyticsResponse, void>({
      query: () => ({
        url: '/api/v1/admin/users/summary',
      }),
      providesTags: ['UsersAnalytics'],
    }),

    exportUsers: builder.mutation<Blob, UsersFilter>({
      query: (filters) => ({
        url: '/admin/users/export',
        responseHandler: (response) => response.blob(),
        params: filters,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUsersAnalyticsQuery,
  useExportUsersMutation,
} = userApi;