// src/app/(auth)/features/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthStatus, User, ApiError } from '@/app/(auth)/features/types/authTypes';

// Helper function to get initial token from sessionStorage
const getInitialToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  // Check sessionStorage first, fallback to localStorage for migration
  return sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
};

// Helper function to get initial user data
const getInitialUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const sessionUser = sessionStorage.getItem('userData');
  const localUser = localStorage.getItem('userData');
  
  try {
    if (sessionUser) {
      return JSON.parse(sessionUser);
    }
    if (localUser) {
      return JSON.parse(localUser);
    }
  } catch (error) {
    console.error('Failed to parse user data:', error);
    // Clean up invalid data
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('userData');
      localStorage.removeItem('userData');
    }
  }
  
  return null;
};

// Helper function to get initial auth status
const getInitialAuthStatus = (): AuthStatus => {
  if (typeof window === 'undefined') return AuthStatus.IDLE;
  
  const token = getInitialToken();
  const user = getInitialUser();
  
  if (token && user) {
    return AuthStatus.AUTHENTICATED;
  } else if (!token && !user) {
    return AuthStatus.UNAUTHENTICATED;
  } else {
    // Inconsistent state - clean up
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userData');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    return AuthStatus.UNAUTHENTICATED;
  }
};

const initialState: AuthState = {
  user: getInitialUser(),
  token: getInitialToken(),
  role: null,
  permissions: null,
  authStatus: getInitialAuthStatus(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set complete auth state (login success)
    setAuth: (state, action: PayloadAction<{ 
      user: User; 
      token: string; 
      role?: string; 
      permissions?: string[];
      hasUpdatedPassword?: boolean;
    }>) => {
      const { user, token, role, permissions, hasUpdatedPassword } = action.payload;
      
      state.user = {
        ...user,
        hasUpdatedPassword: hasUpdatedPassword ?? user.hasUpdatedPassword,
        fullName: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
      };
      state.token = token;
      state.role = role || user.role || null;
      state.permissions = permissions || user.permissions || null;
      state.authStatus = AuthStatus.AUTHENTICATED;
      state.loading = false;
      state.error = null;
      
      // Store in sessionStorage (cleared on browser close)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('userData', JSON.stringify(state.user));
        
        // Clean up localStorage for migration
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    },
    
    // Logout user
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.permissions = null;
      state.authStatus = AuthStatus.UNAUTHENTICATED;
      state.loading = false;
      state.error = null;
      
      // Clear all storage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('tokenExpiry');
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('tokenExpiry');
      }
    },
    
    // Restore auth from sessionStorage
    restoreAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = sessionStorage.getItem('authToken');
        const userData = sessionStorage.getItem('userData');
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            state.user = user;
            state.token = token;
            state.role = user.role || null;
            state.permissions = user.permissions || null;
            state.authStatus = AuthStatus.AUTHENTICATED;
          } catch (error) {
            console.error('Failed to restore auth:', error);
            // Clean up invalid data
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('userData');
            state.authStatus = AuthStatus.UNAUTHENTICATED;
          }
        } else {
          state.authStatus = AuthStatus.UNAUTHENTICATED;
        }
      }
    },
    
    // Update user profile
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { 
          ...state.user, 
          ...action.payload,
          fullName: action.payload.firstName && action.payload.lastName 
            ? `${action.payload.firstName} ${action.payload.lastName}`.trim()
            : state.user.fullName
        };
        
        // Update sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('userData', JSON.stringify(state.user));
        }
      }
    },
    
    // Update password status
    updatePasswordStatus: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.hasUpdatedPassword = action.payload;
        
        // Update sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('userData', JSON.stringify(state.user));
        }
      }
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set auth user (deprecated - use setAuth instead)
    setAuthUser: (state, action: PayloadAction<User>) => {
      state.user = {
        ...action.payload,
        fullName: action.payload.fullName || `${action.payload.firstName} ${action.payload.lastName}`.trim(),
      };
      state.authStatus = AuthStatus.AUTHENTICATED;
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('userData', JSON.stringify(state.user));
      }
    },
    
    // Set token (deprecated - use setAuth instead)
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('authToken', action.payload);
        localStorage.removeItem('authToken'); // Clean up old storage
      }
    },
    
    // Set auth status
    setAuthStatus: (state, action: PayloadAction<AuthStatus>) => {
      state.authStatus = action.payload;
    },
    
    // Set loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error with ApiError type
    setError: (state, action: PayloadAction<ApiError | null>) => {
      state.error = action.payload;
    },
    
    // Set error message (convenience method)
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.error = { 
        message: action.payload,
        status: 400 // Default error status
      };
    },
    
    // Clean storage only (without changing Redux state)
    clearStorage: () => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('tokenExpiry');
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('tokenExpiry');
      }
    },
    
    // Migrate from localStorage to sessionStorage
    migrateToSessionStorage: (state) => {
      if (typeof window !== 'undefined') {
        const localToken = localStorage.getItem('authToken');
        const localUser = localStorage.getItem('userData');
        
        if (localToken) {
          sessionStorage.setItem('authToken', localToken);
          state.token = localToken;
        }
        
        if (localUser) {
          try {
            const user = JSON.parse(localUser);
            sessionStorage.setItem('userData', localUser);
            state.user = user;
            state.role = user.role || null;
            state.permissions = user.permissions || null;
          } catch (error) {
            console.error('Failed to migrate user data:', error);
          }
        }
        
        // Clean up localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('tokenExpiry');
        
        if (localToken || localUser) {
          state.authStatus = AuthStatus.AUTHENTICATED;
        }
      }
    },
    
    // Verify email status
    verifyEmail: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.isEmailVerified = action.payload;
        
        // Update sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('userData', JSON.stringify(state.user));
        }
      }
    },
    
    // Set user permissions
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
    },
    
    // Set user role
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
      if (state.user) {
        state.user.role = action.payload;
        
        // Update sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('userData', JSON.stringify(state.user));
        }
      }
    },
  },
});

export const {
  setAuth,
  logout,
  restoreAuth,
  updateUser,
  updatePasswordStatus,
  clearError,
  setAuthUser,
  setToken,
  setAuthStatus,
  setLoading,
  setError,
  setErrorMessage,
  clearStorage,
  migrateToSessionStorage,
  verifyEmail,
  setPermissions,
  setRole,
} = authSlice.actions;

export default authSlice.reducer;