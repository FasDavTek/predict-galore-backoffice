import { TeamMember, TeamFilters } from '../types';

export const filterTeamMembers = (
  members: TeamMember[],
  filters: TeamFilters
): TeamMember[] => {
  let filtered = [...members];
  
  // Apply search filter
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(member => 
      member.name.toLowerCase().includes(query) || 
      member.email.toLowerCase().includes(query)
    );
  }
  
  // Apply role filter
  if (filters.roleFilter !== 'All') {
    filtered = filtered.filter(member => member.role === filters.roleFilter);
  }
  
  return filtered;
};

export const getPasswordStrengthColor = (strength: number): 'error' | 'warning' | 'success' => {
  if (strength < 40) return 'error';
  if (strength < 80) return 'warning';
  return 'success';
};

export const getPasswordStrengthLabel = (strength: number): string => {
  if (strength < 40) return 'Weak';
  if (strength < 80) return 'Good';
  return 'Strong';
};