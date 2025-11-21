import { z } from 'zod';

// Validation schema for transaction filters
export const transactionFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled', 'refunded']).optional(),
  paymentMethod: z.enum(['credit_card', 'paypal', 'bank_transfer', 'crypto', 'wallet']).optional(),
  type: z.enum(['payment', 'refund', 'withdrawal', 'deposit']).optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export type TransactionFilterSchema = z.infer<typeof transactionFilterSchema>;