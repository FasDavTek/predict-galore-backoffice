import { Transaction } from './transaction.types';

export interface TransactionsTableProps {
  transactions: Transaction[];
  selectedTransactionIds: string[];
  onTransactionSelect: (transaction: Transaction) => void;
  onTransactionEdit: (transaction: Transaction) => void;
  onTransactionAction: (transaction: Transaction, action: string) => void;
  onToggleSelection: (transactionId: string) => void;
  onSelectAll: (transactions: Transaction[]) => void;
  isLoading?: boolean;
  hasError?: boolean;
}