/**
 * Transactions Service
 */

import { api } from '@/shared/api';
import { API_CONFIG } from '@/shared/api';
import { transformApiTransactionsToAppTransactions } from '../lib/transformers';
import type {
  TransactionsFilter,
  UpdateTransactionData,
  TransactionsResponse,
  TransactionsAnalyticsResponse,
  Transaction,
  TransactionsAnalytics,
} from './types';

export class TransactionsService {
  static async getTransactions(filters?: TransactionsFilter): Promise<{
    transactions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await api.get<TransactionsResponse>(
      API_CONFIG.endpoints.transactions.list,
      filters as Record<string, unknown> | undefined
    );
    // Handle real API structure: response.data contains page, pageSize, total, resultItems
    const apiData = response.data;
    return {
      transactions: transformApiTransactionsToAppTransactions(apiData.resultItems || []),
      pagination: {
        page: apiData.currentPage,
        limit: apiData.pageSize,
        total: apiData.totalItems,
        totalPages: apiData.totalPages,
      },
    };
  }

  static async getAnalytics(): Promise<TransactionsAnalytics> {
    const response = await api.get<TransactionsAnalyticsResponse>(
      API_CONFIG.endpoints.transactions.analytics
    );
    return response.data;
  }

  static async updateTransaction(data: UpdateTransactionData): Promise<Transaction> {
    const { id, ...updateData } = data;
    const response = await api.put<Transaction>(
      API_CONFIG.endpoints.transactions.update(id),
      updateData
    );
    return response;
  }

  static async exportTransactions(filters?: TransactionsFilter): Promise<Blob> {
    return await api.get<Blob>(API_CONFIG.endpoints.transactions.export, filters as Record<string, unknown> | undefined);
  }

  /**
   * Get single transaction
   */
  static async getTransaction(id: string): Promise<Transaction> {
    const response = await api.get<Transaction>(API_CONFIG.endpoints.transactions.detail(id));
    return response;
  }
}

