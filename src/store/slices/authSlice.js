// store/slices/auth/authSlice.js

import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";


import { HYDRATE } from "next-redux-wrapper";
import axios from "axios";

const BASE_URL = "https://apidev.predictgalore.com";

// Authentication Status Constants
export const AuthStatus = {
  IDLE: "idle", // Initial state, no action taken
  CHECKING: "checking",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
};

// Helper function for consistent error logging
const logApiError = (operation, endpoint = null, payload = null, error) => {
  // Construct a clean, copy-friendly error message
  const errorMessage = [
    `-------------------------`,
    `API Error: ${operation}`,
    `-------------------------`,
    endpoint && `Endpoint: ${endpoint}`,
    `\n`,
    payload && `Payload: ${JSON.stringify(payload, null, 2)}`,
    `\n`,
    `Error: ${error.message}`,
    `\n`,
    error.response?.status && `Status: ${error.response.status}`,
    `\n`,
    error.response?.data?.message &&
      `Server Message: ${error.response.data.message}`,
    `\n`,
    error.response?.data?.errors &&
      `Validation Errors: ${JSON.stringify(
        error.response.data.errors,
        null,
        2
      )}`,
  ]
    .filter(Boolean) // Remove empty lines
    .join("\n"); // Join with newlines

  // Log to console (grouped for better visualization)
  console.groupCollapsed(
    `%cAPI Error: ${operation}`,
    "color: red; font-weight: bold;"
  );
  console.log(errorMessage);
  console.groupEnd();

  // Return the formatted message for potential copying
  return errorMessage;
};

// Helper function for successful operation logging
const logApiSuccess = (operation, response) => {
  console.groupCollapsed(
    `%cAPI Success: ${operation}`,
    "color: green; font-weight: bold;"
  );
  console.log("Operation:", operation);
  console.log("Response:", response);
  console.groupEnd();
};

// Async thunks for authentication actions
export const checkEmail = createAsyncThunk(
  "auth/checkEmail",
  async (email, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/auth/user/check-email`;

    try {
      console.debug(`Checking email availability for: ${email}`);
      const response = await axios.get(endpoint, {
        params: { email },
      });
      logApiSuccess("checkEmail", response.data);
      return response.data;
    } catch (error) {
      logApiError("checkEmail", endpoint, { email }, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Email check failed",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

export const adminSignin = createAsyncThunk(
  "auth/adminSignin",
  async ({ username, password }, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/Admin/auth/signin`;

    try {
      console.debug("Admin signin attempt for username:", username);
      const response = await axios.post(
        endpoint,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      logApiSuccess("adminSignin", response.data);

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }

      return response.data;
    } catch (error) {
      logApiError("adminSignin", endpoint, { username }, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Authentication failed",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/auth/user/register`;

    try {
      console.debug(
        "Registering user with data:",
        JSON.stringify(userData, null, 2)
      );
      const response = await axios.post(endpoint, userData);
      logApiSuccess("registerUser", response.data);
      return response.data;
    } catch (error) {
      logApiError("registerUser", endpoint, userData, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Registration failed",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

export const confirmEmail = createAsyncThunk(
  "auth/confirmEmail",
  async ({ userId, token }, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/auth/user/confirmemail`;

    try {
      console.debug(`Confirming email for userId: ${userId}`);
      const response = await axios.get(endpoint, {
        params: { userId, token },
      });
      logApiSuccess("confirmEmail", response.data);
      return response.data;
    } catch (error) {
      logApiError("confirmEmail", endpoint, { userId }, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Email confirmation failed",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue, getState }) => {
    const endpoint = `${BASE_URL}/api/v1/auth/user/me`;

    try {
      console.debug("Fetching user profile");
      const token = getState().auth.token;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      logApiSuccess("fetchUserProfile", response.data);
      return response.data;
    } catch (error) {
      logApiError("fetchUserProfile", endpoint, null, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch profile",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (profileData, { rejectWithValue, getState }) => {
    const endpoint = `${BASE_URL}/api/v1/auth/user/profile/update`;

    try {
      console.debug(
        "Updating user profile with data:",
        JSON.stringify(profileData, null, 2)
      );
      const token = getState().auth.token;
      const response = await axios.post(endpoint, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      logApiSuccess("updateUserProfile", response.data);
      return response.data;
    } catch (error) {
      logApiError("updateUserProfile", endpoint, profileData, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Profile update failed",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

export const generatePasswordResetToken = createAsyncThunk(
  "auth/generatePasswordResetToken",
  async (username, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/auth/forgot_password/generate_token`;

    try {
      console.debug(`Generating password reset token for: ${username}`);
      const response = await axios.post(endpoint, { username });
      logApiSuccess("generatePasswordResetToken", response.data);
      return { ...response.data, username };
    } catch (error) {
      logApiError("generatePasswordResetToken", endpoint, { username }, error);
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Password reset token generation failed",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

export const confirmPasswordResetToken = createAsyncThunk(
  "auth/confirmPasswordResetToken",
  async ({ token, username }, { rejectWithValue }) => {
    console.log("token:", token);
    console.log("username:", username);

    const endpoint = `${BASE_URL}/api/v1/auth/forgot_password/confirm_token`;

    try {
      console.debug("Confirming password reset token for user:", username);

      const response = await axios.post(endpoint, { token });

      logApiSuccess("confirmPasswordResetToken", response.data);

      return { ...response.data, username };
    } catch (error) {
      logApiError(
        "confirmPasswordResetToken",
        endpoint,
        { token, username },
        error
      );
      return rejectWithValue({
        message: error.response?.data?.message || "Token confirmation failed",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { username, password, confirmPassword, token },
    { rejectWithValue }
  ) => {
    const endpoint = `${BASE_URL}/api/v1/auth/forgot_password/reset_password`;

    try {
      console.debug("Resetting password for user:", username);
      const response = await axios.post(
        endpoint,
        {
          username,
          password,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      logApiSuccess("resetPassword", response.data);
      return response.data;
    } catch (error) {
      logApiError("resetPassword", endpoint, { username }, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Password reset failed",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    { currentPassword, newPassword, confirmPassword },
    { rejectWithValue, getState }
  ) => {
    const endpoint = `${BASE_URL}/api/v1/auth/change_password`;

    try {
      console.debug("Changing password");
      const token = getState().auth.token;
      const response = await axios.post(
        endpoint,
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      logApiSuccess("changePassword", response.data);
      return response.data;
    } catch (error) {
      logApiError("changePassword", endpoint, null, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Password change failed",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

export const validateTwoFAToken = createAsyncThunk(
  "auth/validateTwoFAToken",
  async (token, { rejectWithValue, getState }) => {
    const endpoint = `${BASE_URL}/api/v1/auth/2FA/ValidateToken`;

    try {
      console.debug("Validating 2FA token");
      const authToken = getState().auth.token;
      const response = await axios.post(
        endpoint,
        { token },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      logApiSuccess("validateTwoFAToken", response.data);
      return response.data;
    } catch (error) {
      logApiError("validateTwoFAToken", endpoint, { token }, error);
      return rejectWithValue({
        message: error.response?.data?.message || "2FA token validation failed",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

export const resendTwoFAToken = createAsyncThunk(
  "auth/resendTwoFAToken",
  async (phoneEmail, { rejectWithValue, getState }) => {
    const endpoint = `${BASE_URL}/api/v1/auth/resend/2FA`;

    try {
      console.debug(`Resending 2FA token to: ${phoneEmail}`);
      const token = getState().auth.token;
      const response = await axios.post(endpoint, null, {
        params: { phoneemail: phoneEmail },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      logApiSuccess("resendTwoFAToken", response.data);
      return response.data;
    } catch (error) {
      logApiError("resendTwoFAToken", endpoint, { phoneEmail }, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to resend 2FA token",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

// Initial state
const initialState = {
  loading: false,
  status: "idle",
  error: null,
  authStatus: AuthStatus.IDLE,
  user: null,
  token:
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null,
  user: null,
  token: null, // Initialize as null
  role: null,
};

if (typeof window !== "undefined") {
  initialState.token = localStorage.getItem("authToken");
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      console.debug("Logging out user");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.authStatus = AuthStatus.UNAUTHENTICATED;
      localStorage.removeItem("authToken");
    },
    checkAuthStatus: (state) => {
      console.debug("Checking authentication status");
      state.authStatus = AuthStatus.CHECKING;
    },
    setAuthUser: (state, action) => {
      console.debug("Setting auth user manually:", action.payload);
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuthError: (state) => {
      console.debug("Clearing auth errors");
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Next.js hydration
      .addCase(HYDRATE, (state, action) => {
        console.debug("Hydrating auth state from server");
        if (action.payload.auth) {
          return {
            ...state,
            ...action.payload.auth,
          };
        }
      })

      // Admin Signin cases
      .addCase(adminSignin.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.authStatus = AuthStatus.CHECKING;
      })
      
      .addCase(adminSignin.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.authStatus = AuthStatus.AUTHENTICATED;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.permissions = action.payload.user?.permissions;
      })

      .addCase(adminSignin.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.authStatus = AuthStatus.FAILED;
        state.error = action.payload;
      })

      // Check Email cases
      .addCase(checkEmail.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(checkEmail.fulfilled, (state) => {
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(checkEmail.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("authToken", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      // Confirm Email cases
      .addCase(confirmEmail.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(confirmEmail.fulfilled, (state) => {
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(confirmEmail.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch User Profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      // Update Profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      // Generate Password Reset Token cases
      .addCase(generatePasswordResetToken.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(generatePasswordResetToken.fulfilled, (state) => {
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(generatePasswordResetToken.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      // Confirm Password Reset Token cases
      .addCase(confirmPasswordResetToken.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(confirmPasswordResetToken.fulfilled, (state) => {
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(confirmPasswordResetToken.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      // Reset Password cases
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      // Change Password cases
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      // Validate 2FA Token cases
      .addCase(validateTwoFAToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateTwoFAToken.fulfilled, (state) => {
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(validateTwoFAToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Resend 2FA Token cases
      .addCase(resendTwoFAToken.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(resendTwoFAToken.fulfilled, (state) => {
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(resendTwoFAToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  logout,
  checkAuthStatus,
  setAuthUser,
  clearAuthError,
  clearOtpError,
  resetResendSuccess,
  clearTwoFAError,
} = authSlice.actions;

// Selectors
export const selectCurrentUser = createSelector(
  (state) => state.auth,
  (auth) => ({
    user: auth.user,
    token: auth.token,
    role: auth.role,
    permissions: auth.permissions,
  })
);

export const selectAuthToken = (state) => state.auth.token;
export const selectAuthStatus = (state) => state.auth.authStatus;
export const selectIsAuthenticated = (state) =>
  state.auth.authStatus === AuthStatus.AUTHENTICATED;
export const selectAuthError = (state) => state.auth.error;
export const selectOtpLoading = (state) => state.auth.otpLoading;
export const selectResendLoading = (state) => state.auth.resendLoading;
export const selectOtpError = (state) => state.auth.otpError;
export const selectResendSuccess = (state) => state.auth.resendSuccess;
export const selectTwoFALoading = (state) => state.auth.twoFALoading;
export const selectTwoFAError = (state) => state.auth.twoFAError;

export default authSlice.reducer;
