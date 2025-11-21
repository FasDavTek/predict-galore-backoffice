import { useState, useCallback } from 'react';
import { 
  useRetryTransactionMutation, 
  useRefundTransactionMutation, 
  useUpdateTransactionStatusMutation 
} from '../api/transactionApi';
import { Transaction } from '../types/transaction.types';

interface UseTransactionActionsReturn {
  handleTransactionAction: (transaction: Transaction, action: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

interface ApiError {
  data?: {
    message?: string;
  };
}

export const useTransactionActions = (): UseTransactionActionsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [retryTransaction] = useRetryTransactionMutation();
  const [refundTransaction] = useRefundTransactionMutation();
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();

  const handleTransactionAction = useCallback(async (
    transaction: Transaction, 
    action: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      switch (action) {
        case 'retry':
          await retryTransaction({ id: transaction.id }).unwrap();
          break;
        
        case 'refund':
          await refundTransaction({ id: transaction.id }).unwrap();
          break;
        
        case 'mark_completed':
          await updateTransactionStatus({ 
            id: transaction.id, 
            status: 'completed' 
          }).unwrap();
          break;
        
        default:
          throw new Error(`Unknown action: ${action}`);
      }
      
      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      setIsLoading(false);
      const apiError = err as ApiError;
      setError(apiError?.data?.message || `Failed to ${action} transaction`);
      return false;
    }
  }, [retryTransaction, refundTransaction, updateTransactionStatus]);

  return {
    handleTransactionAction,
    isLoading,
    error,
  };
};