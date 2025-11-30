import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  PasswordResetData,
  ChangePasswordData,
  User,
} from '@/app/(auth)/features/types/authTypes';
import { RootState } from '@/store/store';

const BASE_URL = 'https://apidev.predictgalore.com';

// Define the API response type for login
interface LoginApiResponse {
  token: string;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    mobile?: string;
    permissions?: string[];
    userTypeId?: number;
    adminType?: string;
    fullName?: string;
  };
  role?: string;
  hasUpdatedPassword?: boolean;
  message?: string;
  code?: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User', 'Auth'],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/api/v1/Admin/auth/signin',
        method: 'POST',
        body: credentials,
      }),
      // Transform the response to include user data in a consistent format
      transformResponse: (response: LoginApiResponse): AuthResponse => {
        // console.log("🔐 Login API Response:", response);
        return {
          token: response.token,
          user: {
            id: response.user?.id || '',
            firstName: response.user?.firstName || '',
            lastName: response.user?.lastName || '',
            email: response.user?.email || '',
            mobile: response.user?.mobile || '',
            permissions: response.user?.permissions || [],
            userTypeId: response.user?.userTypeId || 0,
            adminType: response.user?.adminType || '',
            fullName: response.user?.fullName || '',
          },
          role: response.role || '',
          hasUpdatedPassword: response.hasUpdatedPassword || false,
          message: response.message || '',
          code: response.code || '',
        };
      },
      invalidatesTags: ['Auth', 'User'],
    }),

    register: builder.mutation<AuthResponse, RegisterData>({
      query: (userData) => ({
        url: '/api/v1/auth/user/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    // Profile endpoints (keep for manual profile updates)
    getProfile: builder.query<User, void>({
      query: () => '/api/v1/auth/user/me',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (profileData) => ({
        url: '/api/v1/auth/user/profile/update',
        method: 'POST',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),

    // Password endpoints
    generateResetToken: builder.mutation<{ message: string }, { username: string }>({
      query: ({ username }) => ({
        url: '/api/v1/auth/forgot_password/generate_token',
        method: 'POST',
        body: { username },
      }),
    }),

    confirmResetToken: builder.mutation<{ valid: boolean; token?: string }, { token: string }>({
      query: ({ token }) => ({
        url: '/api/v1/auth/forgot_password/confirm_token',
        method: 'POST',
        body: { token },
      }),
    }),

    resetPassword: builder.mutation<{ message: string }, PasswordResetData>({
      query: (resetData) => ({
        url: '/api/v1/auth/forgot_password/reset_password',
        method: 'POST',
        body: resetData,
      }),
    }),

    changePassword: builder.mutation<{ message: string }, ChangePasswordData>({
      query: (passwordData) => ({
        url: '/api/v1/auth/change_password',
        method: 'POST',
        body: passwordData,
      }),
    }),

    // Email verification
    checkEmail: builder.query<{ available: boolean }, string>({
      query: (email) => ({
        url: '/api/v1/auth/user/check-email',
        params: { email },
      }),
    }),

    confirmEmail: builder.mutation<{ message: string }, { userId: string; token: string }>({
      query: ({ userId, token }) => ({
        url: '/api/v1/auth/user/confirmemail',
        params: { userId, token },
      }),
    }),

    verifyEmail: builder.mutation<{ message: string }, string>({
      query: (email) => ({
        url: '/api/v1/auth/verify-email',
        method: 'POST',
        body: { email },
      }),
    }),

    resendVerification: builder.mutation<{ message: string }, string>({
      query: (email) => ({
        url: '/api/v1/auth/resend-verification',
        method: 'POST',
        body: { email },
      }),
    }),

    // 2FA endpoints
    validateTwoFA: builder.mutation<{ valid: boolean }, { token: string }>({
      query: ({ token }) => ({
        url: '/api/v1/auth/2FA/ValidateToken',
        method: 'POST',
        body: { token },
      }),
    }),

    resendTwoFA: builder.mutation<{ message: string }, { phoneEmail: string }>({
      query: ({ phoneEmail }) => ({
        url: '/api/v1/auth/resend/2FA',
        method: 'POST',
        params: { phoneemail: phoneEmail },
      }),
    }),

    // OTP endpoints
    verifyOTP: builder.mutation<{ valid: boolean }, string>({
      query: (otp) => ({
        url: '/api/v1/auth/verify-otp',
        method: 'POST',
        body: { otp },
      }),
    }),

    resendOTP: builder.mutation<{ message: string }, string>({
      query: (email) => ({
        url: '/api/v1/auth/resend-otp',
        method: 'POST',
        body: { email },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGenerateResetTokenMutation,
  useConfirmResetTokenMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useCheckEmailQuery,
  useConfirmEmailMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useValidateTwoFAMutation,
  useResendTwoFAMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
} = authApi;