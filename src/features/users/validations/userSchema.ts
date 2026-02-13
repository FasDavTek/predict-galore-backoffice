/**
 * Users Validations
 * Zod schemas for user forms
 */

import { z } from 'zod';

export const userFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role: z.enum(['admin', 'editor', 'viewer'] as const),
  plan: z.enum(['free', 'basic', 'premium', 'enterprise'] as const),
  isActive: z.boolean().default(true),
  sendWelcomeEmail: z.boolean().default(false),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

