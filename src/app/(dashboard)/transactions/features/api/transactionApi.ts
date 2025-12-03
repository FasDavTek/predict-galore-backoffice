// src/app/(dashboard)/transactions/features/api/transactionApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { 
  TransactionsApiResponse, 
  TransactionApiResponse, 
  TransactionsAnalyticsResponse,
  RawTransactionsApiResponse,
  RawTransactionApiResponse,
} from '../types/api.types';
import { TransactionsFilter } from '../types/transaction.types';
import { transformApiTransactionToAppTransaction, transformApiTransactionsToAppTransactions } from '../utils/transactionTransformers';

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
  if (url.includes('/transactions') && !url.includes('/summary') && !url.includes('/export')) {
    dataSummary = 'Transactions data processed';
  } else if (url.includes('/summary')) {
    dataSummary = 'Analytics data retrieved';
  } else if (url.includes('/export')) {
    dataSummary = 'Export data generated';
  } else if (url.includes('/retry') || url.includes('/refund') || url.includes('/status')) {
    dataSummary = 'Transaction operation completed';
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
          
          if (url?.includes('/transactions') && !url?.includes('/summary')) {
            if (isArrayData(apiData)) {
              console.log(`💰 Transactions Count: ${apiData.length}`);
              console.log('💰 Transactions Data:', apiData);
            } else if (apiData && typeof apiData === 'object') {
              const dataObj = apiData as Record<string, unknown>;
              if ('items' in dataObj && isArrayData(dataObj.items)) {
                console.log(`💰 Transactions Count: ${dataObj.items.length}`);
                console.log('💰 Transactions Items:', dataObj.items);
              }
              if ('total' in dataObj) {
                console.log(`💰 Total Transactions: ${dataObj.total}`);
              }
              if ('page' in dataObj) {
                console.log(`📄 Current Page: ${dataObj.page}`);
              }
            }
          } else if (url?.includes('/summary')) {
            console.log('📊 Transactions Analytics:', apiData);
          } else if (url?.includes('/export')) {
            console.log('📤 Export Data Generated - Blob Response');
          }
        }
        
        // Log transaction operation details
        if (url?.includes('/retry')) {
          console.log('🔄 Transaction Retry Operation:', {
            transactionId: url.split('/').pop(),
            result: result.data
          });
        } else if (url?.includes('/refund')) {
          console.log('💸 Transaction Refund Operation:', {
            transactionId: url.split('/').pop(),
            refundAmount: body && typeof body === 'object' && 'amount' in body ? (body as { amount?: number }).amount : 'Full amount',
            result: result.data
          });
        } else if (url?.includes('/status')) {
          console.log('📊 Transaction Status Update:', {
            transactionId: url.split('/').pop(),
            newStatus: body && typeof body === 'object' && 'status' in body ? (body as { status: string }).status : 'Unknown',
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

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
  baseQuery: loggingBaseQuery,
  tagTypes: ['Transaction', 'TransactionsAnalytics'],
  endpoints: (builder) => ({
    getTransactions: builder.query<TransactionsApiResponse, TransactionsFilter>({
      query: (filters) => ({
        url: '/api/v1/transactions',
        params: {
          page: filters.page || 1,
          pageSize: filters.limit || 10,
          search: filters.search,
          status: filters.status,
          channel: filters.paymentMethod,
          paymentType: filters.type,
          minAmount: filters.minAmount,
          maxAmount: filters.maxAmount,
          startDate: filters.startDate,
          endDate: filters.endDate,
        },
      }),
      transformResponse: (response: RawTransactionsApiResponse): TransactionsApiResponse => {
        if (response.data?.items) {
          const transformedItems = transformApiTransactionsToAppTransactions(response.data.items);
          
          return {
            ...response,
            data: {
              ...response.data,
              items: transformedItems,
            },
          };
        }
        return response as unknown as TransactionsApiResponse;
      },
      providesTags: ['Transaction'],
    }),

    getTransactionById: builder.query<TransactionApiResponse, string>({
      query: (transactionId) => ({
        url: `/api/v1/transactions/${transactionId}`,
      }),
      transformResponse: (response: RawTransactionApiResponse): TransactionApiResponse => {
        if (response.data) {
          const transformedData = transformApiTransactionToAppTransaction(response.data);
          
          return {
            ...response,
            data: transformedData,
          };
        }
        return response as unknown as TransactionApiResponse;
      },
      providesTags: (result, error, id) => [{ type: 'Transaction', id }],
    }),

    getTransactionsAnalytics: builder.query<TransactionsAnalyticsResponse, { fromUtc?: string; toUtc?: string }>({
      query: (params = {}) => ({
        url: '/api/v1/transactions/summary',
        params,
      }),
      providesTags: ['TransactionsAnalytics'],
    }),

    retryTransaction: builder.mutation<TransactionApiResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/transactions/${id}/retry`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Transaction', id },
        'Transaction',
        'TransactionsAnalytics',
      ],
    }),

    refundTransaction: builder.mutation<TransactionApiResponse, { id: string; amount?: number }>({
      query: ({ id, amount }) => ({
        url: `/api/v1/transactions/${id}/refund`,
        method: 'POST',
        body: amount ? { amount } : {},
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Transaction', id },
        'Transaction',
        'TransactionsAnalytics',
      ],
    }),

    updateTransactionStatus: builder.mutation<TransactionApiResponse, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/api/v1/transactions/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Transaction', id },
        'Transaction',
      ],
    }),

    exportTransactions: builder.mutation<Blob, TransactionsFilter>({
      query: (filters) => ({
        url: '/api/v1/transactions/export',
        responseHandler: (response) => response.blob(),
        params: filters,
      }),
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useGetTransactionsAnalyticsQuery,
  useRetryTransactionMutation,
  useRefundTransactionMutation,
  useUpdateTransactionStatusMutation,
  useExportTransactionsMutation,
} = transactionApi;