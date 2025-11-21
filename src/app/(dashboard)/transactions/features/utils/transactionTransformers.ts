// src/app/(dashboard)/transactions/features/utils/transactionTransformers.ts
import { Transaction, TransactionStatus, PaymentMethod, TransactionType } from '../types/transaction.types';
import { ApiTransactionResponse } from '../types/api.types';

// Type guards for safe type conversion - Updated to match API values
const isValidTransactionStatus = (status: string): status is TransactionStatus => {
  return ['Successful', 'Pending', 'Failed', 'Cancelled', 'Refunded'].includes(status);
};

const isValidPaymentMethod = (method: string): method is PaymentMethod => {
  return ['Paystack', 'credit_card', 'paypal', 'bank_transfer', 'crypto', 'wallet'].includes(method);
};

const isValidTransactionType = (type: string): type is TransactionType => {
  return ['Subscription', 'payment', 'refund', 'withdrawal', 'deposit'].includes(type);
};

// Safe conversion functions with fallbacks
const convertTransactionStatus = (status: string): TransactionStatus => {
  return isValidTransactionStatus(status) ? status : 'Pending';
};

const convertPaymentMethod = (method: string): PaymentMethod => {
  return isValidPaymentMethod(method) ? method : 'Paystack';
};

const convertTransactionType = (type: string): TransactionType => {
  return isValidTransactionType(type) ? type : 'Subscription';
};

// Transform API transaction data to match the application's Transaction interface
export const transformApiTransactionToAppTransaction = (apiTransaction: ApiTransactionResponse): Transaction => ({
  id: apiTransaction.id.toString(),
  amount: apiTransaction.amount,
  totalAmount: apiTransaction.totalAmount,
  currency: 'NGN',
  status: convertTransactionStatus(apiTransaction.status),
  paymentMethod: convertPaymentMethod(apiTransaction.channel),
  type: convertTransactionType(apiTransaction.paymentType),
  customerName: apiTransaction.email.split('@')[0] || 'Customer',
  customerEmail: apiTransaction.email,
  description: `${apiTransaction.paymentType} Payment`,
  reference: apiTransaction.reference,
  createdAt: apiTransaction.dateCreated,
  updatedAt: apiTransaction.completedAt || apiTransaction.dateCreated,
  dateCreated: apiTransaction.dateCreated,
  gatewayReference: apiTransaction.gatewayReference,
  buyerId: apiTransaction.buyerId,
  completedAt: apiTransaction.completedAt,
  paymentType: convertTransactionType(apiTransaction.paymentType),
  metadata: undefined,
  fee: undefined,
  netAmount: apiTransaction.amount,
});

// Transform multiple API transactions to application format
export const transformApiTransactionsToAppTransactions = (apiTransactions: ApiTransactionResponse[]): Transaction[] => {
  return apiTransactions.map(transformApiTransactionToAppTransaction);
};

// Format currency for display
export const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format transaction status for display
export const formatTransactionStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Format payment method for display
export const formatPaymentMethod = (method: string): string => {
  return method.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Check if a transaction is considered successful
export const isTransactionSuccessful = (transaction: Transaction): boolean => {
  return transaction.status === 'Successful';
};

// Calculate net amount after fees
export const calculateNetAmount = (amount: number, fee?: number): number => {
  return fee ? amount - fee : amount;
};