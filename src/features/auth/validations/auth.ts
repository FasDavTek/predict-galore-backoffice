/**
 * Auth Validations
 * Zod schemas for authentication forms
 */

import { z } from 'zod';
import {
  nameSchema,
  emailSchema,
  countryCodeSchema,
  passwordSchema,
  confirmPasswordSchema,
} from '@/shared/validations/commonSchemas';

// Register Validation
export const registerFormValidation = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    countryCode: countryCodeSchema,
    phoneNumber: z
      .string()
      .regex(/^[0-9]{7,15}$/, 'Invalid phone number')
      .min(1, 'Phone number is required'),
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    userTypeId: z.number(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerFormValidation>;

// Country Code Type
export interface CountryCode {
  code: string;
  name: string;
  flag: string;
}

// Login Validation
export const loginFormValidation = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginFormValidation>;

// Reset Password - Initial Step (Username)
export const resetPasswordFirstStepFormValidation = z.object({
  username: z.string().min(1, 'Username is required'),
});

export type ResetPasswordFirstStepData = z.infer<typeof resetPasswordFirstStepFormValidation>;

// Reset Password - Token Step
export const resetPasswordTokenValidation = z.object({
  token: z.string().min(1, 'Token is required'),
});

export type ResetPasswordTokenData = z.infer<typeof resetPasswordTokenValidation>;

// Reset Password - Final Step (New Password)
export const resetPasswordFinalStepFormValidation = z
  .object({
    username: z.string().min(1, 'Username is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ResetPasswordFinalStepData = z.infer<typeof resetPasswordFinalStepFormValidation>;

// Additional form types for compatibility
export interface ResetPasswordFormData {
  username: string;
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

