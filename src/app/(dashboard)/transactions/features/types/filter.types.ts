import { TransactionStatus, PaymentMethod, TransactionType } from './transaction.types';

export interface TransactionFiltersProps {
  searchTerm: string;
  statusFilter: TransactionStatus | undefined;
  paymentMethodFilter: PaymentMethod | undefined;
  typeFilter: TransactionType | undefined;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: TransactionStatus | undefined) => void;
  onPaymentMethodChange: (method: PaymentMethod | undefined) => void;
  onTypeChange: (type: TransactionType | undefined) => void;
  onClearFilters: () => void;
}