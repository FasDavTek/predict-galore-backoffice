/**
 * Transactions API Types
 */

import type {
  Transaction,
  TransactionsFilter,
  TransactionsAnalytics,
  TransactionStatus,
  PaymentMethod,
  TransactionType,
} from '../model/types';
import type { ApiTransactionResponse } from '../lib/transformers';

export interface TransactionsResponse {
  success: boolean;
  message: string;
  data: {
    totalItems: number;
    success: boolean;
    currentPage: number;
    pageSize: number;
    resultItems: ApiTransactionResponse[];
    totalPages: number;
    message: string;
  };
}

export interface TransactionsAnalyticsResponse {
  success: boolean;
  data: TransactionsAnalytics;
}

export interface UpdateTransactionData {
  id: string;
  status?: TransactionStatus;
  [key: string]: unknown;
}

// Re-export domain types
export type {
  Transaction,
  TransactionsFilter,
  TransactionsAnalytics,
  TransactionStatus,
  PaymentMethod,
  TransactionType,
};

