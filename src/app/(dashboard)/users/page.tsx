// src/app/(dashboard)/users/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Dialog,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";

// Components
import { UsersTable } from "./features/components/UsersTable";
import { UserAnalytics } from "./features/components/UserAnalytics";
import { UserForm } from "./features/components/UserForm";
import UsersPageHeader, { TimeRange } from "./features/components/UsersPageHeader";
import { UsersPageLoadingSkeleton } from "./features/components/UsersPageLoadingSkeleton";

// Global State Components
import { ErrorState } from "@/shared/components/ErrorState";

// Hooks
import { useUsers } from "./features/hooks/useUsers";

// Types - Only import from your types file
import { User } from "./features/types/user.types";

// Auth
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import withAuth from "@/hoc/withAuth";

function UsersPage() {
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Global time range state for users page
  const [globalTimeRange, setGlobalTimeRange] = useState<TimeRange>('default');
  
  // Refresh trigger state
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redux auth state
  const user = useSelector((state: RootState) => state.auth.user);

  const {
    users,
    pagination,
    isLoading,
    error,
    currentFilters,
    localSearch,
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleDeleteUser,
    handleExportUsers,
    refetchUsers,
  } = useUsers();

  // Memoize selected user IDs for performance
  const selectedUserIds = useMemo(
    () => selectedUsers.map((user) => user.id),
    [selectedUsers]
  );

  // Handle refresh button click
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Clear selections when refreshing
    setSelectedUsers([]);
    setSelectedUser(null);
    // Increment refresh trigger to force all components to refetch
    setRefreshTrigger(prev => prev + 1);
    
    // Refetch users data
    refetchUsers();
    
    // Set a timeout to hide the loading skeleton after a minimum duration
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleUserEdit = (user: User) => {
    setSelectedUser(user);
    setIsUserFormOpen(true);
  };

  const handleUserDelete = async (user: User): Promise<void> => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.fullName}?`
    );
    if (!confirmed) return;

    const success = await handleDeleteUser(user.id);
    if (success) {
      showSnackbar("User deleted successfully", "success");
      // Remove from selected users if it was selected
      setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
      // Trigger refresh after successful deletion
      handleRefresh();
    } else {
      showSnackbar("Failed to delete user", "error");
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserFormOpen(true);
  };

  const handleCloseUserForm = () => {
    setIsUserFormOpen(false);
    setSelectedUser(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Selection handlers
  const handleToggleSelection = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUsers((prev) => {
        const isSelected = prev.some((u) => u.id === userId);
        if (isSelected) {
          return prev.filter((u) => u.id !== userId);
        } else {
          return [...prev, user];
        }
      });
    }
  };

  const handleSelectAll = (usersToSelect: User[]) => {
    setSelectedUsers(usersToSelect);
  };

  const handleClearAllSelection = () => {
    setSelectedUsers([]);
  };

  const handleRemoveUserFromSelection = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  // Show loading skeleton for initial page load or during refresh
  if ((isLoading && users.length === 0) || isRefreshing) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={250} height={48} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={350} height={24} />
        </Box>
        
        <UsersPageLoadingSkeleton />
      </Container>
    );
  }

  // Show error state if there's an API error
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <ErrorState
          variant="api"
          title="Failed to Load Users"
          message="We encountered an error while loading user data. Please try again."
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
      <UsersPageHeader 
        title="User Management"
        timeRange={globalTimeRange}
        onTimeRangeChange={setGlobalTimeRange}
        onRefresh={handleRefresh}
        user={user}
      />

      {/* Analytics */}
      <UserAnalytics refreshTrigger={refreshTrigger} />

      {/* Consolidated UsersTable Component */}
      <UsersTable
        // Data
        users={users}
        pagination={pagination}
        isLoading={isLoading}
        hasError={!!error}
        
        // Filters
        currentFilters={currentFilters}
        localSearch={localSearch}
        
        // Selection
        selectedUsers={selectedUsers}
        selectedUserIds={selectedUserIds}
        
        // Handlers
        onUserSelect={handleUserSelect}
        onUserEdit={handleUserEdit}
        onUserDelete={handleUserDelete}
        onAddUser={handleAddUser}
        onExportUsers={() => handleExportUsers()}
        onRefresh={handleRefresh}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onPageChange={handlePageChange}
        onToggleSelection={handleToggleSelection}
        onSelectAll={handleSelectAll}
        onClearAllSelection={handleClearAllSelection}
        onRemoveFromSelection={handleRemoveUserFromSelection}
        
        // States
        isExporting={false} // Add actual export state if needed
        isRefreshing={isRefreshing}
      />

      {/* Add/Edit User Dialog */}
      <Dialog
        open={isUserFormOpen}
        onClose={handleCloseUserForm}
        maxWidth="md"
        fullWidth
      >
        <UserForm
          user={selectedUser || undefined}
          onSuccess={() => {
            setIsUserFormOpen(false);
            setSelectedUser(null);
            showSnackbar("User saved successfully", "success");
            handleRefresh();
          }}
          onCancel={handleCloseUserForm}
        />
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default withAuth(UsersPage);