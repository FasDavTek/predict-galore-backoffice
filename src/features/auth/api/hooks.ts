/**
 * Auth API Hooks
 * TanStack Query hooks for authentication
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService } from './service';
import { useAuth } from '../model/store';
import type {
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  ConfirmResetTokenData,
} from '../model/types';

// Login hook
export function useLogin() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return await AuthService.login(credentials);
    },
    onSuccess: (data) => {
      if (data.token && data.user) {
        // Map user to match User type from auth store
        const user = {
          ...data.user,
          permissions: [],
          userTypeId: 1,
        };
        login(data.token, user);
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Register hook
export function useRegister() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      return await AuthService.register(data);
    },
    onSuccess: (data) => {
      if (data.token && data.user) {
        // Map user to match User type from auth store
        const user = {
          ...data.user,
          permissions: [],
          userTypeId: 1,
        };
        login(data.token, user);
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Profile hook
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      return await AuthService.getProfile();
    },
    enabled: typeof window !== 'undefined' && !!sessionStorage.getItem('authToken'),
  });
}

// Forgot password hook
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      return await AuthService.forgotPassword(data);
    },
  });
}

// Confirm reset token hook
export function useConfirmResetToken() {
  return useMutation({
    mutationFn: async (data: ConfirmResetTokenData) => {
      return await AuthService.confirmResetToken(data);
    },
  });
}

// Reset password hook
export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      return await AuthService.resetPassword(data);
    },
  });
}

// Check email availability (for registration)
export function useCheckEmailQuery(email: string, options?: { skip?: boolean }) {
  return useQuery({
    queryKey: ['check-email', email],
    queryFn: async () => {
      return await AuthService.checkEmail(email);
    },
    enabled: !options?.skip && !!email,
  });
}

