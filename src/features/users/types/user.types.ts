// Core User interface defining the structure of user data
export interface User {
  id: string;          
  email: string;        
  firstName: string;    
  lastName: string;     
  fullName: string;     
  phone?: string;       
  avatar?: string;      
  status: UserStatus;
  plan: SubscriptionPlan; 
  role: UserRole;       
  emailVerified: boolean; 
  lastActive?: string;  
  createdAt: string;    
  updatedAt: string;    
  location?: string;    
  // Additional fields from API response
  phoneNumber?: string | null;
  isActive?: boolean;
  country?: string | null;
}

// Type definitions for specific user properties:

// Possible user account statuses
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

// Available subscription plans
export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise';

// User roles defining permission levels
export type UserRole = 'user' | 'admin' | 'moderator';

// Response structure when fetching multiple users
export interface UsersResponse {
  users: User[];        // Array of user objects
  pagination: PaginationMeta; // Pagination information
}

// API Response structure matching the actual backend response
export interface UsersApiResponse {
  success: boolean;
  message: string;
  errors: any;
  data: {
    totalItems: number;
    success: boolean;
    currentPage: number;
    pageSize: number;
    resultItems: User[]; // Array of user objects from API
    totalPages: number;
    message: string;
  };
}

// Pagination metadata for handling large datasets
export interface PaginationMeta {
  page: number;        // Current page number
  limit: number;       // Number of items per page
  total: number;       // Total number of items available
  totalPages: number;  // Total number of pages
}

// Filter options for querying users
export interface UsersFilter {
  search?: string;     
  status?: UserStatus;
  plan?: SubscriptionPlan; 
  role?: UserRole;     
  page?: number;       
  limit?: number;      
}

// Analytics data for user statistics
export interface UsersAnalytics {
  totalUsers: number;      
  activeUsers: number;     
  newUsers: number;        
  premiumUsers: number;    
  totalChange: number;     
  activeChange: number;    
  newChange: number;       
  premiumChange: number;  
}

// Data structure for creating/updating users via forms
export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  plan: SubscriptionPlan;
}