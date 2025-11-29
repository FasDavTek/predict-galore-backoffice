// /features/settings/validations/settingsSchema.ts
import { z } from 'zod';

export const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().email('Invalid email address'),
  timezone: z.string().min(1, 'Timezone is required'),
  phone: z.string().optional().or(z.literal('')),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const teamInviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['Super Admin', 'Admin', 'Editor', 'Viewer']),
});

export const roleFormSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  permissions: z.array(z.string()),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;
export type TeamInviteValues = z.infer<typeof teamInviteSchema>;
export type RoleFormValues = z.infer<typeof roleFormSchema>;