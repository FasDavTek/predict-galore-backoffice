// src/app/(dashboard)/transactions/features/api/transactionApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
      query: (transactionId) => `/api/v1/transactions/${transactionId}`,
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