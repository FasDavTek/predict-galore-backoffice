/**
 * Auth Domain Types
 * Core domain types for authentication
 */

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  permissions: string[];
  userTypeId: number;
  adminType?: string | null;
  fullName?: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  userTypeId: number;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ConfirmResetTokenData {
  token: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    adminType?: string;
  };
}

export interface ProfileResponse {
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    adminType?: string;
  };
}

// UI-specific types (for auth pages)
export interface AuthFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Quote {
  text: string;
  author: string;
}

export interface PasswordStrengthProps {
  password: string;
}

export enum ResetPasswordStep {
  INITIAL = 0,
  TOKEN_GENERATED = 1,
  TOKEN_CONFIRMED = 2,
  COMPLETED = 3,
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorData {
  errors?: ValidationError[];
  error?: string;
  statusCode?: number;
  timestamp?: string;
  path?: string;
  [key: string]: unknown;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: ErrorData;
  endpoint?: string;
  method?: string;
}

