// pages/dashboard/users.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Snackbar, Alert } from '@mui/material';
import { People as UsersIcon } from '@mui/icons-material';

import DashboardLayout from '@/layouts/DashboardLayout';
import { Header } from '@/components/dashboard/users/Header';
import UsersStat from '@/components/dashboard/users/UsersStat';
import UsersTable from '@/components/dashboard/users/UsersTable';

import {
  fetchUserStats,
  fetchUsersList,
  exportUsersCSV,
  setTimeRange,
  setSearchQuery,
  deleteUser,
  upgradeUser,
  selectUserStats,
  selectUsersList,
  selectUsersLoading,
  selectTimeRange,
  selectSearchQuery
} from '@/store/slices/usersSlice';

function ErrorFallback({ error }) {
  return (
    <div className="p-4 bg-red-50 text-red-600">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

const UsersPage = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectUserStats);
  const users = useSelector(selectUsersList);
  const loading = useSelector(selectUsersLoading);
  const timeRange = useSelector(selectTimeRange);
  const searchQuery = useSelector(selectSearchQuery);
  
  // State for selected user and notifications
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch data on component mount and when filters change
  useEffect(() => {
    dispatch(fetchUserStats());
    dispatch(fetchUsersList({ searchQuery, timeRange }));
  }, [dispatch, searchQuery, timeRange]);

  // Handler for time range change
  const handleTimeRangeChange = (range) => {
    dispatch(setTimeRange(range));
  };

  // Handler for search input change
  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  // Handler for CSV export
  const handleExportCSV = () => {
    dispatch(exportUsersCSV());
  };

  // Handler for viewing user details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  // Handler for selecting a user
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  // Handler for going back to the list view
  const handleBackToList = () => {
    setSelectedUser(null);
  };

  // Handler for filter button click
  const handleFilterClick = () => {
    // Implement filter functionality here
    console.log('Filter button clicked');
  };

  // Handler for closing notification
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <DashboardLayout>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {/* Page Header */}
        <Header
          title="Users"
          subtitle="Provide expert insights by adding predictions so that users can engage with your analysis."
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />

        {/* Users Stat Cards Section */}
        {!selectedUser && (
          <Box className="w-full mb-8">
            <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {stats.map((card, index) => (
                <UsersStat
                  key={index}
                  title={card.title}
                  value={card.value}
                  icon={<UsersIcon />}
                  change={card.change}
                  bgColor={card.bgColor}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Main Content with Users Table */}
        <Box className="w-full">
          <UsersTable
            users={users}
            loading={loading.users}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onExportCSV={handleExportCSV}
            onFilterClick={handleFilterClick}
            exportLoading={loading.export}
            selectedUser={selectedUser}
            onUserSelect={handleUserSelect}
            onViewDetails={handleViewDetails}
            onBackToList={handleBackToList}
          />
        </Box>

        {/* Notification Snackbar */}
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