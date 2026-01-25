/**
 * Shared validation schemas
 * Common Zod schemas used across multiple features
 */

import { z } from 'zod';

// ====================
// Common Field Schemas
// ====================

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email address').min(1, 'Email is required');

/**
 * Name validation schema (first/last name)
 */
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(50, 'Name is too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters');

/**
 * Phone number validation schema
 */
export const phoneSchema = z
  .string()
  .regex(/^[0-9]{7,15}$/, 'Invalid phone number')
  .optional()
  .or(z.literal(''));

/**
 * Country code validation schema
 */
export const countryCodeSchema = z.string().regex(/^\+[0-9]{1,4}$/, 'Invalid country code');

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .min(1, 'Password is required');

/**
 * Confirm password validation (used with refine)
 */
export const confirmPasswordSchema = z.string().min(1, 'Confirm password is required');

// ====================
// Common Form Schemas
// ====================

/**
 * Base profile form schema (first name, last name, email)
 */
export const baseProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
});

/**
 * Extended profile schema with phone
 */
export const profileWithPhoneSchema = baseProfileSchema.extend({
  phone: phoneSchema,
});

/**
 * Password change schema
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// ====================
// Type Exports
// ====================

export type BaseProfileFormData = z.infer<typeof baseProfileSchema>;
export type ProfileWithPhoneFormData = z.infer<typeof profileWithPhoneSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
