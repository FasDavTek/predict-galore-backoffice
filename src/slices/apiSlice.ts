// src/slices/api/apiSlice.ts - Central API configuration hub
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store'; 

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Try to get token from Redux store first
      const state = getState() as RootState;
      const reduxToken = state.auth?.token;
      
      // Fallback to sessionStorage if Redux token doesn't exist
      let token = reduxToken;
      if (!token && typeof window !== 'undefined') {
        token = sessionStorage.getItem('authToken');
      }
      
      // If we have a token, add it to headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      // Add other common headers
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      
      return headers;
    },
  }),
  // Global configuration for all endpoints
  refetchOnMountOrArgChange: true, // Auto-refresh when component mounts
  keepUnusedDataFor: 60, // Keep unused data for 60 seconds
  // Error handling configuration

  tagTypes: [
    // Auth tags
    'Auth',
    'User',
    'Profile',
    
    // Dashboard tags
    'Analytics',      
    'Engagement',     
    'Traffic',        
    'Activity',
    'DashboardSummary',
    'UserCards',
    'PaymentCards',
    'Dashboard',
    
    // Users tags
    'Users', 
    'UserDetails',
    'UserAnalytics',
    
    // Notifications tags
    'Notifications', 
    'NotificationStats',
    'NotificationPreferences',
    
    // Transactions tags
    'Transactions', 
    'TransactionDetails',
    'TransactionAnalytics',
    
    // Predictions tags
    'Predictions', 
    'PredictionDetails',
    'PredictionAnalytics',
    
    // Settings tags
    'Settings',
    'AppSettings',
    'UserSettings',
    
    // Generic tags
    'Cache',
  ],
  endpoints: () => ({}),
});

// Optional: Create a utility function to check if token exists
export const checkToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  // Check both localStorage and sessionStorage for compatibility
  const token = 
    sessionStorage.getItem('authToken') || 
    localStorage.getItem('authToken');
  
  return token;
};

// Optional: Utility to get full auth headers
export const getAuthHeaders = () => {
  const token = checkToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};