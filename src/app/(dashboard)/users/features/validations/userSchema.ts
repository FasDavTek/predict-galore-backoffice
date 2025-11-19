import { z } from 'zod';

// Define validation schema for user form data using Zod
// This ensures data integrity and provides validation error messages
export const userFormSchema = z.object({

  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),

  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),

  email: z.string().email('Invalid email address'),

  phone: z.string().optional(),

  role: z.enum(['user', 'admin', 'moderator']),

  plan: z.enum(['free', 'basic', 'premium', 'enterprise']),
});

// Extract TypeScript type from the Zod schema
// This automatically creates a type that matches the validation schema
export type UserFormSchema = z.infer<typeof userFormSchema>;

// Define validation schema for user filtering options
export const userFilterSchema = z.object({
  // Optional search term for filtering users
  search: z.string().optional(),
  // Optional status filter with specific allowed values
  status: z.enum(['active', 'inactive', 'suspended', 'pending']).optional(),
  // Optional plan filter with specific allowed values
  plan: z.enum(['free', 'basic', 'premium', 'enterprise']).optional(),
  // Optional role filter with specific allowed values
  role: z.enum(['user', 'admin', 'moderator']).optional(),
  // Page number for pagination, defaults to 1
  page: z.number().min(1).default(1),
  // Number of items per page, defaults to 10, max 100
  limit: z.number().min(1).max(100).default(10),
});

// Extract TypeScript type from the filter schema
export type UserFilterSchema = z.infer<typeof userFilterSchema>;