import { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  useGetUsersQuery, 
  useDeleteUserMutation,
  useExportUsersMutation 
} from '../api/userApi';
import { 
  setFilters, 
  clearFilters, 
  selectCurrentFilters,
  setSelectedUserIds,
  clearSelectedUsers,
  toggleUserSelection,
} from '../slices/userSlice';
import { UsersFilter, User, PaginationMeta } from '../types/user.types';
import { ExportOptions } from '../types/api.types';

// Main hook for managing users data and operations
// This hook centralizes all user-related logic for easy consumption by components
export const useUsers = () => {
  // Redux hooks for state management
  const dispatch = useDispatch(); // Function to dispatch Redux actions
  const currentFilters = useSelector(selectCurrentFilters); // Get current filters from Redux store
  
  // Local state for search functionality
  const [localSearch, setLocalSearch] = useState(''); // Immediate search input value
  const [debouncedSearch, setDebouncedSearch] = useState(''); // Delayed search for API calls

  // RTK Query hooks for API operations
  // useGetUsersQuery automatically fetches users when component mounts and when filters change
  const {
    data: usersResponse,       // API response data
    isLoading: isLoadingUsers, // Loading state for users fetch
    error: usersError,         // Error state for users fetch
    refetch: refetchUsers,     // Function to manually refetch users
  } = useGetUsersQuery({
    ...currentFilters,         // Spread current filters (page, limit, status, etc.)
    search: debouncedSearch || undefined, // Only include search if not empty
  });

  // Mutation hooks for destructive operations
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation(); 
  const [exportUsers, { isLoading: isExporting }] = useExportUsersMutation(); 

  // Memoized data transformations
  // useMemo prevents unnecessary recalculations when dependencies haven't changed
  const users = useMemo(() => usersResponse?.data?.resultItems || [], [usersResponse]);
  // Extract users array from API response (resultItems), fallback to empty array

  // Transform API pagination data to match PaginationMeta interface
  const pagination = useMemo((): PaginationMeta | undefined => {
    if (!usersResponse?.data) return undefined;
    
    const apiData = usersResponse.data;
    return {
      page: apiData.currentPage,
      limit: apiData.pageSize,
      total: apiData.totalItems,
      totalPages: apiData.totalPages,
    };
  }, [usersResponse]);
  // Extract and transform pagination metadata from API response

  // Search handling with debounce to prevent excessive API calls
  // useCallback ensures the function doesn't change on every render
  const handleSearchChange = useCallback((searchTerm: string) => {
    setLocalSearch(searchTerm); // Update local search immediately for responsive UI
    
    // Debounce the API call to avoid spamming the server
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      dispatch(setFilters({ search: searchTerm, page: 1 })); // Reset to page 1 when searching
    }, 300); 

    // Cleanup function to clear timeout if search changes again
    return () => clearTimeout(timer);
  }, [dispatch]); 

  // Filter handlers for status, plan, role filters
  const handleFilterChange = useCallback((filters: Partial<UsersFilter>) => {
    // Update filters and reset to page 1 when filters change
    dispatch(setFilters({ ...filters, page: 1 }));
  }, [dispatch]);

  // Clear all filters and reset to default state
  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters()); // Clear filters in Redux store
    setLocalSearch(''); // Clear local search input
    setDebouncedSearch(''); // Clear debounced search
  }, [dispatch]);

  // Pagination handler for changing pages
  const handlePageChange = useCallback((page: number) => {
    dispatch(setFilters({ page })); // Update current page in Redux store
  }, [dispatch]);

  // User actions - individual user operations

  // Delete a user by ID
  const handleDeleteUser = useCallback(async (userId: string) => {
    try {
      await deleteUser(userId).unwrap(); // Call API and unwrap the response
      return true;
    } catch (error) {
      console.error('Failed to delete user:', error);
      return false; 
    }
  }, [deleteUser]); // Only recreate if deleteUser mutation changes

  // Export users data to CSV file
  const handleExportUsers = useCallback(async (options: ExportOptions = {}) => {
    try {
      // Call export API and get blob data
      const blob = await exportUsers(currentFilters).unwrap();
      
      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob); // Create temporary URL for blob
      const link = document.createElement('a');
      link.href = url;
      // Set filename with current date or custom name
      link.download = options.filename || `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click(); // Trigger download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up temporary URL
      
      return true;
    } catch (error) {
      console.error('Failed to export users:', error);
      return false; 
    }
  }, [exportUsers, currentFilters]); // Recreate when export function or filters change

  // Selection management for bulk operations

  // Toggle selection of a single user
  const handleToggleUserSelection = useCallback((userId: string) => {
    dispatch(toggleUserSelection(userId)); // Add or remove user from selection
  }, [dispatch]);

  // Select all users in current view
  const handleSelectAllUsers = useCallback((users: User[]) => {
    const allUserIds = users.map(user => user.id); // Extract all user IDs
    dispatch(setSelectedUserIds(allUserIds)); // Set all IDs as selected
  }, [dispatch]);

  // Clear all user selections
  const handleClearSelection = useCallback(() => {
    dispatch(clearSelectedUsers()); // Clear selection in Redux store
  }, [dispatch]);

  // Return all state and functions for components to use
  return {
    // Data from API
    users,           // Array of user objects
    pagination,      // Pagination metadata (page, limit, total, etc.)
    isLoading: isLoadingUsers, // Loading state
    error: usersError,         // Error state
    
    // Filters and search
    currentFilters,  // Current active filters
    localSearch,     // Current search input value
    handleSearchChange,  // Function to update search
    handleFilterChange,  // Function to update filters
    handleClearFilters,  // Function to clear all filters
    
    // Pagination
    handlePageChange, // Function to change pages
    
    // User actions
    handleDeleteUser,  // Function to delete a user
    handleExportUsers, // Function to export users
    isDeleting,        // Loading state for delete operation
    isExporting,       // Loading state for export operation
    refetchUsers,      // Function to manually refresh data
    
    // Selection management
    handleToggleUserSelection, // Toggle single user selection
    handleSelectAllUsers,      // Select all users
    handleClearSelection,      // Clear all selections
  };
};