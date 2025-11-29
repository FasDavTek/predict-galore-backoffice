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