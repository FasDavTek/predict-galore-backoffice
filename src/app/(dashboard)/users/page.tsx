"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Dialog,
  Snackbar,
  Alert,
} from "@mui/material";

// Components
import { UsersTable } from "../../../features/users/components/UsersTable";
import { UserFilters } from "../../../features/users/components/UserFilters";
import { UserAnalytics } from "../../../features/users/components/UserAnalytics";
import { UserForm } from "../../../features/users/components/UserForm";
import { UsersPagination } from "../../../features/users/components/UsersPagination";
import { UsersToolbar } from "../../../features/users/components/UsersToolbar";
import { SelectedUserPreview } from "../../../features/users/components/SelectedUserPreview"; // New component

// Global State Components
import { PageLoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";

// Hooks
import { useUsers } from "@/features/users/hooks/useUsers";
import { useUserForm } from "@/features/users/hooks/useUserForm";

// Types
import { User } from "@/features/users/types/user.types";

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

  const { handleSubmit, isLoading: isSubmitting } = useUserForm({
    user: selectedUser,
    onSuccess: () => {
      setIsUserFormOpen(false);
      setSelectedUser(null);
      showSnackbar("User saved successfully", "success");
    },
    onError: (error) => {
      showSnackbar(error, "error");
    },
  });

  // Memoize selected user IDs for performance
  const selectedUserIds = useMemo(
    () => selectedUsers.map((user) => user.id),
    [selectedUsers]
  );

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    // You could open a detailed view modal here if needed
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

  // Show loading state for initial page load
  if (isLoading && users.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <PageLoadingState
          message="Loading users..."
          subtitle="Please wait while we fetch your user data"
        />
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
            onClick: refetchUsers,
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your platform users, their roles, and subscriptions
        </Typography>
      </Box>

      {/* Analytics */}
      <UserAnalytics />

      {/* Selected Users Preview */}
      <SelectedUserPreview
        selectedUsers={selectedUsers}
        onUserSelect={handleUserSelect}
        onUserEdit={handleUserEdit}
        onUserDelete={handleUserDelete}
        onClearSelection={handleClearAllSelection}
        onRemoveUser={handleRemoveUserFromSelection}
      />

      <Box className="mflex flex-col gap-3">
        {/* filters and toolbox */}
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
            onRefresh={refetchUsers}
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
          user={selectedUser}
          onSubmit={handleSubmit}
          onCancel={handleCloseUserForm}
          isLoading={isSubmitting}
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
