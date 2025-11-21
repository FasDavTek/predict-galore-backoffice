// src/app/(dashboard)/transactions/features/types/transaction.types.ts

export interface Transaction {
  id: string;
  amount: number;
  totalAmount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  type: TransactionType;
  customerName: string;
  customerEmail: string;
  description: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  dateCreated: string;
  gatewayReference: string | null;
  buyerId: string;
  completedAt: string | null;
  paymentType: TransactionType;
  metadata?: Record<string, unknown>;
  fee?: number;
  netAmount?: number;
}

export interface TransactionsAnalytics {
  totalCount: number;
  successCount: number;
  pendingCount: number;
  failedCount: number;
  totalRevenue: number;
  totalChange?: string;
  successChange?: string;
  pendingChange?: string;
  failedChange?: string;
  revenueChange?: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface TransactionsFilter {
  page?: number;
  limit?: number;
  search?: string;
  status?: TransactionStatus;
  paymentMethod?: PaymentMethod;
  type?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
}

export type TransactionStatus = 
  | 'Successful' 
  | 'Pending' 
  | 'Failed' 
  | 'Cancelled' 
  | 'Refunded';

export type PaymentMethod = 
  | 'Paystack' 
  | 'credit_card' 
  | 'paypal' 
  | 'bank_transfer' 
  | 'crypto' 
  | 'wallet';

export type TransactionType = 
  | 'Subscription' 
  | 'payment' 
  | 'refund' 
  | 'withdrawal' 
  | 'deposit';