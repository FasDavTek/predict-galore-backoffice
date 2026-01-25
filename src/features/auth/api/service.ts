/**
 * Auth Service
 * Application layer - Business logic for authentication
 */

import { api } from '@/shared/api';
import { API_CONFIG } from '@/shared/api';
import type {
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  ConfirmResetTokenData,
  AuthResponse,
  ProfileResponse,
} from '../model/types';

export class AuthService {
  /**
   * Login user
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      API_CONFIG.endpoints.auth.signin,
      credentials
    );
    return response;
  }

  /**
   * Register new user
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      API_CONFIG.endpoints.auth.signup,
      data
    );
    return response;
  }

  /**
   * Get user profile
   */
  static async getProfile(): Promise<ProfileResponse> {
    const response = await api.get<ProfileResponse>(API_CONFIG.endpoints.auth.profile);
    return response;
  }

  /**
   * Forgot password
   */
  static async forgotPassword(data: ForgotPasswordData): Promise<void> {
    await api.post(API_CONFIG.endpoints.auth.resetPassword, data);
  }

  /**
   * Confirm reset token
   */
  static async confirmResetToken(data: ConfirmResetTokenData): Promise<void> {
    await api.post(API_CONFIG.endpoints.auth.confirmResetToken, data);
  }

  /**
   * Reset password
   */
  static async resetPassword(data: ResetPasswordData): Promise<void> {
    await api.post(API_CONFIG.endpoints.auth.resetPassword, data);
  }

  /**
   * Check email availability
   */
  static async checkEmail(email: string): Promise<{ available: boolean }> {
    const response = await api.get<{ available: boolean }>(API_CONFIG.endpoints.auth.checkEmail, {
      email,
    });
    return response;
  }
}

