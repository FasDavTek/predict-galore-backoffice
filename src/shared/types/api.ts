export interface ApiError {
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}