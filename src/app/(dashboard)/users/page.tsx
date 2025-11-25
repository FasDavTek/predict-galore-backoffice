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
import { UserFilters } from "./features/components/UserFilters";
import { UserAnalytics } from "./features/components/UserAnalytics";
import { UserForm } from "./features/components/UserForm";
import { UsersPagination } from "./features/components/UsersPagination";
import { UsersToolbar } from "./features/components/UsersToolbar";
import { SelectedUserPreview } from "./features/components/SelectedUserPreview";
import { UsersPageLoadingSkeleton } from "@/app/(dashboard)/users/features/components/UsersPageLoadingSkeleton";
import UsersPageHeader, { TimeRange } from "./features/components/UsersPageHeader";

// Global State Components
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";

// Hooks
import { useUsers } from "@/app/(dashboard)/users/features/hooks/useUsers";

// Types
import { User } from "@/app/(dashboard)/users/features/types/user.types";

// Auth state selectors
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";

const UsersPage: React.FC = () => {
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
    }, 1000); // Minimum 1 second loading state for better UX
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

  const handleUserDelete = async (user: User) => {
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

      {/* Selected Users Preview */}
      <SelectedUserPreview
        selectedUsers={selectedUsers}
        onUserSelect={handleUserSelect}
        onUserEdit={handleUserEdit}
        onUserDelete={handleUserDelete}
        onClearSelection={handleClearAllSelection}
        onRemoveUser={handleRemoveUserFromSelection}
      />

      <Box className="flex flex-col gap-3">
        {/* Filters and Toolbar */}
        <Box className="flex flex-row justify-between">
          {/* Filters */}
          <UserFilters
            searchTerm={localSearch}
            statusFilter={currentFilters.status}
            planFilter={currentFilters.plan}
            roleFilter={currentFilters.role}
            onSearchChange={handleSearchChange}
            onStatusChange={(status) => handleFilterChange({ status })}
            onPlanChange={(plan) => handleFilterChange({ plan })}
            onRoleChange={(role) => handleFilterChange({ role })}
            onClearFilters={handleClearFilters}
          />

          {/* Toolbar */}
          <UsersToolbar
            selectedCount={selectedUsers.length}
            onAddUser={handleAddUser}
            onExportUsers={() => handleExportUsers()}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />
        </Box>

        {/* Content Area */}
        {users.length === 0 && !isLoading ? (
          <EmptyState
            variant={
              localSearch ||
              currentFilters.status ||
              currentFilters.plan ||
              currentFilters.role
                ? "search"
                : "data"
            }
            title={
              localSearch ||
              currentFilters.status ||
              currentFilters.plan ||
              currentFilters.role
                ? "No Users Found"
                : "No Users Yet"
            }
            description={
              localSearch ||
              currentFilters.status ||
              currentFilters.plan ||
              currentFilters.role
                ? "Try adjusting your search criteria or filters to find what you're looking for."
                : "Get started by adding your first user to the platform."
            }
            primaryAction={{
              label: "Add User",
              onClick: handleAddUser,
            }}
            secondaryAction={
              localSearch ||
              currentFilters.status ||
              currentFilters.plan ||
              currentFilters.role
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
            {/* Users Table */}
            <UsersTable
              users={users}
              selectedUserIds={selectedUserIds}
              onUserSelect={handleUserSelect}
              onUserEdit={handleUserEdit}
              onUserDelete={handleUserDelete}
              onToggleSelection={handleToggleSelection}
              onSelectAll={handleSelectAll}
              isLoading={isLoading}
              hasError={!!error}
            />

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <UsersPagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </Box>

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
};

export default UsersPage;