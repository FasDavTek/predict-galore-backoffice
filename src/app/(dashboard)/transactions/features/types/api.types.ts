import { Transaction, TransactionsAnalytics } from './transaction.types';

// Generic API response interface
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errors: unknown;
  data: T;
}

// Define the actual API transaction response structure (raw API data)
export interface ApiTransactionResponse {
  id: number;
  reference: string;
  gatewayReference: string | null;
  buyerId: string;
  email: string;
  status: string;
  channel: string;
  totalAmount: number;
  amount: number;
  dateCreated: string;
  completedAt: string | null;
  paymentType: string;
}

// Raw API response types (before transformation)
export type RawTransactionsApiResponse = ApiResponse<{
  page: number;
  pageSize: number;
  total: number;
  items: ApiTransactionResponse[];
}>;

export type RawTransactionApiResponse = ApiResponse<ApiTransactionResponse>;

// Transformed API response types (after transformation)
export type TransactionsApiResponse = ApiResponse<{
  page: number;
  pageSize: number;
  total: number;
  items: Transaction[];
}>;

export type TransactionApiResponse = ApiResponse<Transaction>;
export type TransactionsAnalyticsResponse = ApiResponse<TransactionsAnalytics>;

// Options for exporting transaction data
export interface ExportOptions {
  filename?: string;
  fields?: (keyof Transaction)[];
  fieldLabels?: Partial<Record<keyof Transaction, string>>;
}