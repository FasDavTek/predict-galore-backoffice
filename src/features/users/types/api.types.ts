import { User, UsersResponse, UsersAnalytics, UsersFilter } from './user.types';

// Generic API response interface that wraps all API responses
// This provides consistency across all API calls
export interface ApiResponse<T> {
  success: boolean;    // Whether the request was successful
  data: T;            // The actual response data (generic type)
  message?: string;    // Optional message from the server
  errors?: any;        // Optional errors field from API
}

// Specific API response types for different endpoints:

// Response for fetching multiple users (includes pagination)
export type UsersApiResponse = ApiResponse<{
  totalItems: number;
  success: boolean;
  currentPage: number;
  pageSize: number;
  resultItems: User[]; // This matches your API response structure
  totalPages: number;
  message: string;
}>;

// Response for fetching a single user
export type UserApiResponse = ApiResponse<User>;

// Response for user analytics data
export type UsersAnalyticsResponse = ApiResponse<UsersAnalytics>;

// Options for exporting user data
export interface ExportOptions {
  filename?: string;  // Custom filename for the export

  // Which user fields to include in the export
  fields?: (keyof User)[];
  
  // Custom labels for fields in the exported file
  fieldLabels?: Partial<Record<keyof User, string>>;
}