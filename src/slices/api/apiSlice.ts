// src/slices/api/apiSlice.ts - Central API configuration hub
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store/store'; 

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    // Auth tags
    'Auth',
    'User',
    
    // Dashboard tags (all the ones used in dashboardApi)
    'Analytics',      
    'Engagement',     
    'Traffic',        
    'Activity',
    'DashboardSummary',
    'UserCards',
    'PaymentCards',
    
    // Users tags
    'Users', 
    
    // Notifications tags
    'Notifications', 
    'NotificationStats',
    
    // Transactions tags
    'Transactions', 
    
    // Predictions tags
    'Predictions', 
    
    // Settings tags
    'Settings',
  ],
  endpoints: () => ({}),
});