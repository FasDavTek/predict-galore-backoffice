import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthStatus, User, ApiError } from '@/features/auth/types/authTypes';

const getInitialToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

const initialState: AuthState = {
  user: null,
  token: getInitialToken(),
  role: null,
  permissions: null,
  authStatus: AuthStatus.IDLE,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.permissions = null;
      state.authStatus = AuthStatus.UNAUTHENTICATED;
      state.loading = false;
      state.error = null;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    },

    clearError: (state) => {
      state.error = null;
    },

    setAuthUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.authStatus = AuthStatus.AUTHENTICATED;
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', action.payload);
      }
    },

    setAuthStatus: (state, action: PayloadAction<AuthStatus>) => {
      state.authStatus = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  logout,
  clearError,
  setAuthUser,
  setToken,
  setAuthStatus,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;