import { useCreateUserMutation, useUpdateUserMutation } from '../api/userApi';
import { UserFormData, User } from '../types/user.types';

interface UseUserFormProps {
  user?: User | null;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useUserForm = ({ user, onSuccess, onError }: UseUserFormProps = {}) => {
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const isEditing = Boolean(user?.id);
  const isLoading = isCreating || isUpdating;

  const handleSubmit = async (formData: UserFormData) => {
    try {
      if (isEditing && user?.id) {
        await updateUser({ 
          userId: user.id,
          userData: formData
        }).unwrap();
      } else {
        await createUser(formData).unwrap();
      }
      
      onSuccess?.();
      return true;
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to save user';
      
      onError?.(errorMessage);
      return false;
    }
  };

  return {
    handleSubmit,
    isLoading,
    isEditing,
  };
};