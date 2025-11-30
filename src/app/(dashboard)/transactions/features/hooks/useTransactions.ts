// src/app/(dashboard)/transactions/features/hooks/useTransactions.ts
import { useState, useCallback, useMemo } from 'react';
import { useGetTransactionsQuery, useExportTransactionsMutation } from '../api/transactionApi';
import { Transaction, TransactionsFilter, PaginationMeta } from '../types/transaction.types';

interface UseTransactionsReturn {
  transactions: Transaction[];
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  currentFilters: TransactionsFilter;
  localSearch: string;
  handleSearchChange: (search: string) => void;
  handleFilterChange: (filters: Partial<TransactionsFilter>) => void;
  handleClearFilters: () => void;
  handlePageChange: (page: number) => void;
  handleExportTransactions: () => Promise<boolean>;
  refetchTransactions: () => void;
}

export const useTransactions = (): UseTransactionsReturn => {
  const [localSearch, setLocalSearch] = useState('');
  const [currentFilters, setCurrentFilters] = useState<TransactionsFilter>({
    page: 1,
    limit: 10,
  });

  const {
    data: transactionsResponse,
    isLoading,
    error,
    refetch,
  } = useGetTransactionsQuery(currentFilters);

  const [exportTransactions] = useExportTransactionsMutation();

  const transactions = useMemo(() => {
    return transactionsResponse?.data?.items || []; 
  }, [transactionsResponse]);

  const pagination = useMemo(() => {
    const data = transactionsResponse?.data;
    return {
      page: data?.page || 1,
      pageSize: data?.pageSize || 10,
      total: data?.total || 0,
      totalPages: Math.ceil((data?.total || 0) / (data?.pageSize || 10)),
    };
  }, [transactionsResponse]);

  const handleSearchChange = useCallback((search: string) => {
    setLocalSearch(search);
    const timeoutId = setTimeout(() => {
      setCurrentFilters((prev: TransactionsFilter) => ({
        ...prev,
        search: search || undefined,
        page: 1,
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleFilterChange = useCallback((filters: Partial<TransactionsFilter>) => {
    setCurrentFilters((prev: TransactionsFilter) => ({
      ...prev,
      ...filters,
      page: 1,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setLocalSearch('');
    setCurrentFilters({
      page: 1,
      limit: 10,
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentFilters((prev: TransactionsFilter) => ({
      ...prev,
      page,
    }));
  }, []);

  const handleExportTransactions = useCallback(async (): Promise<boolean> => {
    try {
      const blob = await exportTransactions(currentFilters).unwrap();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      return false;
    }
  }, [currentFilters, exportTransactions]);

  const refetchTransactions = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    transactions,
    pagination,
    isLoading,
    error: error ? 'Failed to load transactions' : null,
    currentFilters,
    localSearch,
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleExportTransactions,
    refetchTransactions,
  };
};