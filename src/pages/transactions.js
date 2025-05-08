// pages/transactions.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Snackbar, Alert } from '@mui/material';
import { Receipt as TransactionsIcon } from '@mui/icons-material';

// Component imports
import DashboardLayout from '@/layouts/DashboardLayout';
import { Header } from '@/components/transactions/Header';
import TransactionStats from '@/components/transactions/TransactionStats';
import TransactionsTable from '@/components/transactions/TransactionsTable';
import TransactionDetail from '@/components/transactions/TransactionDetail';

// Redux imports
import {
  fetchTransactionStats,
  fetchTransactionsList,
  exportTransactionsCSV,
  setTimeRange,
  setSearchQuery,
  setStatusFilter,
  setPlanFilter,
  selectStatusFilter,
  selectPlanFilter,
  selectTransactionStats,
  selectTransactionsList,
  selectTransactionsLoading,
  selectTimeRange,
  selectSearchQuery
} from '@/store/slices/transactionSlice';

/**
 * Error boundary fallback component
 */
function ErrorFallback({ error }) {
  return (
    <div className="p-4 bg-red-50 text-red-600">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

/**
 * TransactionsPage - Main component for transactions dashboard
 */
const TransactionsPage = () => {
  const dispatch = useDispatch();
  
  // Select data from Redux store
  const stats = useSelector(selectTransactionStats);
  const transactions = useSelector(selectTransactionsList);
  const loading = useSelector(selectTransactionsLoading);
  const timeRange = useSelector(selectTimeRange);
  const searchQuery = useSelector(selectSearchQuery);
  const statusFilter = useSelector(selectStatusFilter);
  const planFilter = useSelector(selectPlanFilter);
  

   const [viewMode, setViewMode] = useState("list"); // 'list', 'detail', 

  // Local state for selected transaction and notifications
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch data on mount and when filters change
  useEffect(() => {
    dispatch(fetchTransactionStats());
    dispatch(fetchTransactionsList({ searchQuery, timeRange }));
  }, [dispatch, searchQuery, timeRange]);

  // Handler for time range filter change
  const handleTimeRangeChange = (range) => {
    dispatch(setTimeRange(range));
  };

  // Handler for search input changes
  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleStatusFilterChange = (status) => {
    dispatch(setStatusFilter(status));
  };

  const handlePlanFilterChange = (plan) => {
    dispatch(setPlanFilter(plan));
  };

  // Handler for CSV export with loading state
  const handleExportCSV = async () => {
    try {
      await dispatch(exportTransactionsCSV());
      showNotification('Export started successfully', 'success');
    } catch (error) {
      showNotification('Export failed', 'error');
    }
  };

  // Helper to show notifications
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // Handler for transaction selection
  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // Handler for returning to list view
  const handleBackToList = () => {
    setSelectedTransaction(null);
  };

  // Handler for closing notifications
  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <DashboardLayout>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {/* Page Header with title and time range selector */}
        <Header
          title="Transactions"
          subtitle="Track and manage all transactions"
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />

        {/* Stats cards section - only shown when no transaction is selected */}
        {!selectedTransaction && (
          <Box sx={{ mb: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {stats.map((card, index) => (
              <TransactionStats
                key={index}
                title={card.title}
                value={card.value}
                icon={<TransactionsIcon />}
                change={card.change}
                bgColor={card.bgColor}
              />
            ))}
          </Box>
        )}

        {/* Main transactions table or detail view */}
        <Box sx={{ width: '100%' }}>
          {selectedTransaction ? (
            <TransactionDetail
              transaction={selectedTransaction}
              onBack={handleBackToList}
            />
          ) : (
            <TransactionsTable
              transactions={transactions}
              loading={loading.transactions}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              statusFilter={statusFilter}
              planFilter={planFilter}
              onStatusFilterChange={handleStatusFilterChange}
              onPlanFilterChange={handlePlanFilterChange}
              onExportCSV={handleExportCSV}
              exportLoading={loading.export}
              onTransactionSelect={handleTransactionSelect}
            />
          )}
        </Box>

        {/* Global notification system */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleNotificationClose}
        >
          <Alert 
            onClose={handleNotificationClose} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default TransactionsPage;