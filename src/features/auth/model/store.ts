/**
 * Auth Store
 * Client state management for authentication
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from './types';
import { setAuthCookie, clearAuthCookie } from '@/shared/auth/client';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token, user) => {
        setAuthCookie(token);
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        clearAuthCookie();
        set({ token: null, user: null, isAuthenticated: false });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

