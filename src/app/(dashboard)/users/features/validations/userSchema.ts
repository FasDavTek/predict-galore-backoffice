// features/validations/userSchema.ts
import { z } from 'zod';

// Define validation schema for user form data using Zod
export const userFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().or(z.literal('')),
  role: z.enum(['user', 'admin', 'moderator']),
  plan: z.enum(['free', 'basic', 'premium', 'enterprise']),
  isActive: z.boolean(),
  sendWelcomeEmail: z.boolean(),
});

// Extract TypeScript type from the Zod schema
export type UserFormValues = z.infer<typeof userFormSchema>;

// Define validation schema for user filtering options
export const userFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended', 'pending']).optional(),
  plan: z.enum(['free', 'basic', 'premium', 'enterprise']).optional(),
  role: z.enum(['user', 'admin', 'moderator']).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// Extract TypeScript type from the filter schema
export type UserFilterSchema = z.infer<typeof userFilterSchema>;