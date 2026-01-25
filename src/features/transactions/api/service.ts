/**
 * Transactions Service
 */

import { api } from '@/shared/api';
import { API_CONFIG } from '@/shared/api';
import {
  transformApiTransactionsToAppTransactions,
  type ApiTransactionResponse,
} from '../lib/transformers';
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
    // API returns { success, message, data: { page, pageSize, total, items } }
    const raw = response as { success?: boolean; data?: { page?: number; pageSize?: number; total?: number; items?: unknown[] } };
    const apiData = raw?.data ?? {};
    const items = Array.isArray(apiData.items) ? apiData.items : [];
    const total = apiData.total ?? 0;
    const pageSize = apiData.pageSize ?? 20;
    const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;
    return {
      transactions: transformApiTransactionsToAppTransactions(items as ApiTransactionResponse[]),
      pagination: {
        page: apiData.page ?? 1,
        limit: pageSize,
        total,
        totalPages,
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

