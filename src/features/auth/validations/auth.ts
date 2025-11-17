// /features/auth/validations/auth.ts
import { z } from 'zod';

// Register Validation
export const registerFormValidation = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  countryCode: z.string().regex(/^\+[0-9]{1,4}$/, 'Invalid country code'),
  phoneNumber: z.string().regex(/^[0-9]{7,15}$/, 'Invalid phone number').min(1, 'Phone number is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .min(1, 'Password is required'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
  userTypeId: z.number(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
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

export type ResetPasswordFirstStepData = z.infer<typeof resetPasswordFirstStepFormValidation>; // Fixed this line

// Reset Password - Token Step
export const resetPasswordTokenValidation = z.object({
  token: z.string().min(1, 'Token is required'),
});

export type ResetPasswordTokenData = z.infer<typeof resetPasswordTokenValidation>;

// Reset Password - Final Step (New Password)
export const resetPasswordFinalStepFormValidation = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ResetPasswordFinalStepData = z.infer<typeof resetPasswordFinalStepFormValidation>;