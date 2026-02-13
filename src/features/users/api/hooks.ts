/**
 * Users API Hooks
 * TanStack Query hooks for users
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UsersService } from './service';
import type { UsersFilter, CreateUserData, AssignPermissionsData } from './types';

export function useUsers(filters?: UsersFilter) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      return await UsersService.getUsers(filters);
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      return await UsersService.getUser(id);
    },
    enabled: !!id,
  });
}

export function useUsersAnalytics() {
  return useQuery({
    queryKey: ['users-analytics'],
    queryFn: async () => {
      return await UsersService.getAnalytics();
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      return await UsersService.createUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users-analytics'] });
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, action }: { userId: string; action: string }) => {
      return await UsersService.updateUserStatus(userId, action);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users-analytics'] });
    },
  });
}

export function useAssignPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AssignPermissionsData) => {
      return await UsersService.assignPermissions(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await UsersService.deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users-analytics'] });
    },
  });
}

export function useExportUsers(filters?: UsersFilter) {
  return useMutation({
    mutationFn: async () => {
      return await UsersService.exportUsers(filters);
    },
  });
}

