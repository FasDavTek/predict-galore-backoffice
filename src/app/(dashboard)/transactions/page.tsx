// src/app/(dashboard)/transactions/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";

// Components
import { TransactionsTable } from "./features/components/TransactionsTable";
import { TransactionFilters } from "./features/components/TransactionFilters";
import { TransactionAnalytics } from "./features/components/TransactionAnalytics";
import { TransactionsPagination } from "./features/components/TransactionsPagination";
import { TransactionsToolbar } from "./features/components/TransactionsToolbar";
import { SelectedTransactionPreview } from "./features/components/SelectedTransactionPreview";
import { TransactionsPageLoadingSkeleton } from "./features/components/TransactionsPageLoadingSkeleton";
import TransactionsPageHeader, { TimeRange } from "./features/components/TransactionsPageHeader";

// Global State Components
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";

// Hooks
import { useTransactions } from "./features/hooks/useTransactions";
import { useTransactionActions } from "./features/hooks/useTransactionActions";

// Types
import { Transaction } from "./features/types/transaction.types";

// Auth state selectors
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";
import withAuth from "@/hoc/withAuth";

function TransactionsPage() {
  const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Global time range state for transactions page
  const [globalTimeRange, setGlobalTimeRange] = useState<TimeRange>('thisMonth');
  
  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redux auth state
  const user = useSelector((state: RootState) => state.auth.user);

  const {
    transactions,
    pagination,
    isLoading,
    error,
    currentFilters,
    localSearch,
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleExportTransactions,
    refetchTransactions,
  } = useTransactions();

  const { handleTransactionAction: performTransactionAction } = useTransactionActions();

  // Memoize selected transaction IDs for performance
  const selectedTransactionIds = useMemo(
    () => selectedTransactions.map((transaction) => transaction.id),
    [selectedTransactions]
  );

  // Handle refresh button click
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Clear selections when refreshing
    setSelectedTransactions([]);
    
    // Refetch transactions data
    refetchTransactions();
    
    // Set a timeout to hide the loading skeleton after a minimum duration
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTransactionSelect = (transaction: Transaction) => {
    // Here you could navigate to a detail view or show a modal
    // For now, we'll just log it
    console.log('Selected transaction:', transaction);
  };

  const handleTransactionEdit = (transaction: Transaction) => {
    // Here you would open an edit form/dialog
    showSnackbar(`Edit transaction ${transaction.reference}`, "success");
  };

  const handleTransactionAction = async (transaction: Transaction, action: string) => {
    const success = await performTransactionAction(transaction, action);
    
    if (success) {
      showSnackbar(`Transaction ${action} successful`, "success");
      // Trigger refresh after successful action
      handleRefresh();
    } else {
      showSnackbar(`Failed to ${action} transaction`, "error");
    }
  };

  // Selection handlers
  const handleToggleSelection = (transactionId: string) => {
    const transaction = transactions.find((t: Transaction) => t.id === transactionId);
    if (transaction) {
      setSelectedTransactions((prev) => {
        const isSelected = prev.some((t: Transaction) => t.id === transactionId);
        if (isSelected) {
          return prev.filter((t: Transaction) => t.id !== transactionId);
        } else {
          return [...prev, transaction];
        }
      });
    }
  };

  const handleSelectAll = (transactionsToSelect: Transaction[]) => {
    setSelectedTransactions(transactionsToSelect);
  };

  const handleClearAllSelection = () => {
    setSelectedTransactions([]);
  };

  const handleRemoveTransactionFromSelection = (transactionId: string) => {
    setSelectedTransactions((prev) => prev.filter((transaction: Transaction) => transaction.id !== transactionId));
  };

  // Show loading skeleton for initial page load or during refresh
  if ((isLoading && transactions.length === 0) || isRefreshing) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={250} height={48} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={350} height={24} />
        </Box>
        
        <TransactionsPageLoadingSkeleton />
      </Container>
    );
  }

  // Show error state if there's an API error
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <ErrorState
          variant="api"
          title="Failed to Load Transactions"
          message="We encountered an error while loading transaction data. Please try again."
          retryAction={{
            onClick: handleRefresh,
            label: "Retry Loading",
          }}
          height={400}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <TransactionsPageHeader 
        title="Transaction Management"
        timeRange={globalTimeRange}
        onTimeRangeChange={setGlobalTimeRange}
        onRefresh={handleRefresh}
        user={user}
      />

      {/* Analytics */}
      <TransactionAnalytics />

      {/* Selected Transactions Preview */}
      <SelectedTransactionPreview
        selectedTransactions={selectedTransactions}
        onTransactionSelect={handleTransactionSelect}
        onTransactionEdit={handleTransactionEdit}
        onTransactionAction={handleTransactionAction}
        onClearSelection={handleClearAllSelection}
        onRemoveTransaction={handleRemoveTransactionFromSelection}
      />

      <Box className="flex flex-col gap-3">
        {/* Filters and Toolbar */}
        <Box className="flex flex-row justify-between">
          {/* Filters */}
          <TransactionFilters
            searchTerm={localSearch}
            statusFilter={currentFilters.status}
            paymentMethodFilter={currentFilters.paymentMethod}
            typeFilter={currentFilters.type}
            onSearchChange={handleSearchChange}
            onStatusChange={(status) => handleFilterChange({ status })}
            onPaymentMethodChange={(paymentMethod) => handleFilterChange({ paymentMethod })}
            onTypeChange={(type) => handleFilterChange({ type })}
            onClearFilters={handleClearFilters}
          />

          {/* Toolbar */}
          <TransactionsToolbar
            selectedCount={selectedTransactions.length}
            onExportTransactions={() => handleExportTransactions()}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />
        </Box>

        {/* Content Area */}
        {transactions.length === 0 && !isLoading ? (
          <EmptyState
            variant={
              localSearch ||
              currentFilters.status ||
              currentFilters.paymentMethod ||
              currentFilters.type
                ? "search"
                : "data"
            }
            title={
              localSearch ||
              currentFilters.status ||
              currentFilters.paymentMethod ||
              currentFilters.type
                ? "No Transactions Found"
                : "No Transactions Yet"
            }
            description={
              localSearch ||
              currentFilters.status ||
              currentFilters.paymentMethod ||
              currentFilters.type
                ? "Try adjusting your search criteria or filters to find what you're looking for."
                : "Transactions will appear here once they are processed on the platform."
            }
            primaryAction={{
              label: "Refresh",
              onClick: handleRefresh,
            }}
            secondaryAction={
              localSearch ||
              currentFilters.status ||
              currentFilters.paymentMethod ||
              currentFilters.type
                ? {
                    label: "Clear Filters",
                    onClick: handleClearFilters,
                  }
                : undefined
            }
            height={300}
          />
        ) : (
          <>
            {/* Transactions Table */}
            <TransactionsTable
              transactions={transactions}
              selectedTransactionIds={selectedTransactionIds}
              onTransactionSelect={handleTransactionSelect}
              onToggleSelection={handleToggleSelection}
              onSelectAll={handleSelectAll}
              isLoading={isLoading}
              hasError={!!error}
            />

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <TransactionsPagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

// Wrap with authentication HOC
export default withAuth(TransactionsPage);