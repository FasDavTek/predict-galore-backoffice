// /features/settings/utils/settingsTransformers.ts
import { UserProfile, ProfileFormData } from '../types';

export const transformProfileToFormData = (profile: UserProfile): ProfileFormData => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
  email: profile.email,
  timezone: profile.timezone,
  phone: profile.phone || '',
});

export const generateUserInitials = (firstName: string, lastName: string): string => {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

export const formatTeamMemberRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    'super_admin': 'Super Admin',
    'admin': 'Admin',
    'editor': 'Editor',
    'viewer': 'Viewer',
  };
  return roleMap[role] || role;
};

export const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length > 0) strength += 20;
  if (password.length >= 8) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[^A-Za-z0-9]/.test(password)) strength += 20;
  return strength;
};