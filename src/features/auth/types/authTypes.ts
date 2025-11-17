export interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface ResetPasswordFormData {
  username: string;
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Quote {
  text: string;
  author: string;
}

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export interface PasswordStrengthProps {
  password: string;
}

export enum ResetPasswordStep {
  INITIAL = 0,
  TOKEN_GENERATED = 1,
  TOKEN_CONFIRMED = 2,
  COMPLETED = 3
}


export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string; 
  permissions?: string[];
  isEmailVerified?: boolean; 
  phoneNumber?: string;
  createdAt?: string; 
  updatedAt?: string; 
  
  // Additional properties from API response
  fullName?: string | null;
  mobile?: string;
  adminType?: string | null;
  userTypeId?: number;
  hasUpdatedPassword?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
  role: string | null;
  hasUpdatedPassword: boolean;
  message: string | null;
  code: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  userTypeId: number;
}

export interface PasswordResetData {
  username: string;
  password: string;
  confirmPassword: string;
  token: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
  endpoint?: string;
  method?: string;
}

export enum AuthStatus {
  IDLE = 'idle',
  CHECKING = 'checking',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
}

export interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null;
  permissions: string[] | null;
  authStatus: AuthStatus;
  loading: boolean;
  error: ApiError | null;
}