import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Snackbar, Alert } from '@mui/material';
import { People as UsersIcon } from '@mui/icons-material';

// Component imports
import DashboardLayout from '@/layouts/DashboardLayout';
import { Header } from '@/components/users/Header';
import UserStats from '@/components/users/UserStats';
import UsersTable from '@/components/users/UsersTable';

// Redux imports
import {
  fetchUserStats,
  fetchUsersList,
  exportUsersCSV,
  setTimeRange,
  setSearchQuery,
  setStatusFilter,
  setPlanFilter,
  selectStatusFilter,
  selectPlanFilter,
  selectUserStats,
  selectUsersList,
  selectUsersLoading,
  selectTimeRange,
  selectSearchQuery
} from '@/store/slices/userSlice';

/**
 * Error boundary fallback component
 * Shows error message when components fail to render
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
 * UsersPage - Main component for users dashboard
 * Manages user data fetching, filtering, and display
 */
const UsersPage = () => {
  const dispatch = useDispatch();
  
  // Select data from Redux store
  const stats = useSelector(selectUserStats);
  const users = useSelector(selectUsersList);
  const loading = useSelector(selectUsersLoading);
  const timeRange = useSelector(selectTimeRange);
  const searchQuery = useSelector(selectSearchQuery);
  const statusFilter = useSelector(selectStatusFilter);
  const planFilter = useSelector(selectPlanFilter);
  
  // Local state for selected user and notifications
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch data on mount and when filters change
  useEffect(() => {
    dispatch(fetchUserStats());
    dispatch(fetchUsersList({ searchQuery, timeRange }));
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
      await dispatch(exportUsersCSV());
      showNotification('Export started successfully', 'success');
    } catch (error) {
      showNotification('Export failed', 'error');
    }
  };

  // Helper to show notifications
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  // Handler for user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  // Handler for returning to list view
  const handleBackToList = () => {
    setSelectedUser(null);
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
          title="Users"
          subtitle="Manage and analyze user accounts"
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />

        {/* Stats cards section - only shown when no user is selected */}
        {!selectedUser && (
          <Box sx={{ mb: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {stats.map((card, index) => (
              <UserStats
                key={index}
                title={card.title}
                value={card.value}
                icon={<UsersIcon />}
                change={card.change}
                bgColor={card.bgColor}
              />
            ))}
          </Box>
        )}

        {/* Main users table component */}
        <Box sx={{ width: '100%' }}>
          <UsersTable
            users={users}
            loading={loading.users}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            planFilter={planFilter}
            onStatusFilterChange={handleStatusFilterChange}
            onPlanFilterChange={handlePlanFilterChange}
            onExportCSV={handleExportCSV}
            exportLoading={loading.export}
            selectedUser={selectedUser}
            onUserSelect={handleUserSelect}
            onBackToList={handleBackToList}
          />
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

export default UsersPage;