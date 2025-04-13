// store/slices/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import axios from 'axios';

// Async thunks for authentication actions
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Registration failed',
        statusCode: error.response?.status || 500,
      });
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Login failed',
        statusCode: error.response?.status || 500,
      });
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (verificationToken, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/verify-email', { token: verificationToken });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Email verification failed',
        statusCode: error.response?.status || 500,
      });
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Password reset request failed',
        statusCode: error.response?.status || 500,
      });
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Password reset failed',
        statusCode: error.response?.status || 500,
      });
    }
  }
);


export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otp, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/verify-otp', { otp });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'OTP verification failed',
        statusCode: error.response?.status || 500,
      });
    }
  }
);

export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/resend-otp');
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to resend OTP',
        statusCode: error.response?.status || 500,
      });
    }
  }
);


// Check if user is authenticated (for initial state)
const getInitialAuthState = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    return {
      user: null,
      token: token || null,
      isAuthenticated: !!token,
      loading: false,
      status: 'idle',
      error: null,
      otpLoading: false,
      resendLoading: false,
      otpError: null,
      resendSuccess: false,
    };
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    status: 'idle',
    error: null,
    otpLoading: false,
    resendLoading: false,
    otpError: null,
    resendSuccess: false,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuthState(),
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
    },
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuthError: (state) => {
      state.error = null;
      state.status = 'idle';
    },
    clearOtpError: (state) => {
      state.otpError = null;
    },
    resetResendSuccess: (state) => {
      state.resendSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Next.js hydration
      .addCase(HYDRATE, (state, action) => {
        if (action.payload.auth) {
          return {
            ...state,
            ...action.payload.auth,
          };
        }
      })

      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })

      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })

      // Email verification cases
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })

      // Forgot password cases
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })

      // Reset password cases
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
       // OTP Verification cases
       .addCase(verifyOTP.pending, (state) => {
        state.otpLoading = true;
        state.otpError = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('authToken', action.payload.token);
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.otpLoading = false;
        state.otpError = action.payload;
      })

      // Resend OTP cases
      .addCase(resendOTP.pending, (state) => {
        state.resendLoading = true;
        state.resendSuccess = false;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.resendLoading = false;
        state.resendSuccess = true;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.resendLoading = false;
        state.otpError = action.payload;
      })
  },
});

// Export actions
export const { logout, setAuthUser, clearAuthError,  clearOtpError, resetResendSuccess } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectOtpLoading = (state) => state.auth.otpLoading;
export const selectResendLoading = (state) => state.auth.resendLoading;
export const selectOtpError = (state) => state.auth.otpError;
export const selectResendSuccess = (state) => state.auth.resendSuccess;


export default authSlice.reducer;