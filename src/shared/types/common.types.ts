/**
 * Shared common types
 * Consolidates duplicate type definitions across the codebase
 */

// ====================
// Time Range
// ====================

export type TimeRange = 'default' | 'today' | 'thisWeek' | 'thisMonth' | 'lastMonth' | 'thisYear';

// ====================
// Pagination
// ====================

export interface PaginationMeta {
  page: number;
  limit?: number; // Some APIs use 'limit', others use 'pageSize'
  pageSize?: number; // Alternative to 'limit' for compatibility
  total: number;
  totalPages: number;
}

// ====================
// Common Status Types
// ====================

export type CommonStatus = 'active' | 'inactive' | 'pending' | 'suspended' | 'completed' | 'failed';

// ====================
// API Response Wrapper
// ====================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

// ====================
// Filter Base
// ====================

export interface BaseFilter {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ====================
// Pagination Component Props
// ====================

export interface PaginationComponentProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

// ====================
// Common Form Props
// ====================

export interface BaseFormProps<T = unknown> {
  data?: T | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}
