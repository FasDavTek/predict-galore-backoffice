import { useState, useCallback } from 'react';
import { useCreateUserMutation, useUpdateUserMutation } from '../api/userApi';
import { UserFormData, User } from '../types/user.types';

// Props for the useUserForm hook
interface UseUserFormProps {
  user?: User | null;        // Existing user for editing, undefined for creating new
  onSuccess?: () => void;    // Callback when form submission succeeds
  onError?: (error: string) => void; // Callback when form submission fails
}

// Custom hook for managing user form operations (create and update)
// This hook handles the form submission logic for both creating and editing users
export const useUserForm = ({ user, onSuccess, onError }: UseUserFormProps = {}) => {
  // RTK Query mutations for API operations
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation(); // Create new user
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation(); // Update existing user

  // Determine if we're in edit mode or create mode
  const isEditing = Boolean(user?.id); // True if user has an ID (existing user)
  const isLoading = isCreating || isUpdating; // Combined loading state

  // Main form submission handler
  // useCallback prevents recreation on every render
  const handleSubmit = useCallback(async (formData: UserFormData) => {
    try {
      // Determine whether to create or update based on mode
      if (isEditing && user?.id) {
        // Update existing user
        await updateUser({ 
          userId: user.id,     // ID of user to update
          userData: formData   // New form data
        }).unwrap(); // unwrap() throws error if request fails
      } else {
        // Create new user
        await createUser(formData).unwrap();
      }
      
      // Call success callback if provided
      onSuccess?.(); 
      return true; 
      
    } catch (error: any) {
      // Extract error message from API response or use default
      const errorMessage = error?.data?.message || 'Failed to save user';
      
      // Call error callback if provided
      onError?.(errorMessage);
      return false; 
    }
  }, [
    isEditing,     
    user?.id,       
    createUser,   
    updateUser,     
    onSuccess,     
    onError         
  ]);

  // Return form management functions and state
  return {
    handleSubmit, // Function to call when form is submitted
    isLoading,    // Loading state for form submission
    isEditing,    // Whether we're editing an existing user
  };
};