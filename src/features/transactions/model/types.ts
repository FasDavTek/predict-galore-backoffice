/**
 * Transactions Domain Types
 */

export interface Transaction {
  id: string | number;
  reference: string;
  gatewayReference: string | null;
  buyerId: string;
  email: string;
  status: TransactionStatus;
  channel: PaymentMethod;
  totalAmount: number;
  amount: number;
  dateCreated: string;
  completedAt: string | null;
  paymentType: TransactionType;
  // Additional fields from transformer
  currency?: string;
  customerName?: string;
  customerEmail?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  type?: TransactionType;
  paymentMethod?: PaymentMethod;
  metadata?: unknown;
  fee?: number;
  netAmount?: number;
}

export interface TransactionsAnalytics {
  totalCount: number;
  successCount: number;
  successAmount: number;
  failedCount: number;
  failedAmount: number;
  pendingCount: number;
  pendingAmount: number;
  totalRevenue: number;
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

export type TransactionStatus = 'Successful' | 'Pending' | 'Failed' | 'Cancelled' | 'Refunded';
export type PaymentMethod =
  | 'Paystack'
  | 'credit_card'
  | 'paypal'
  | 'bank_transfer'
  | 'crypto'
  | 'wallet';
export type TransactionType = 'Subscription' | 'payment' | 'refund' | 'withdrawal' | 'deposit';

