// slices/api/apiSlice.ts - Central API configuration hub
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
    'Users', 
    'Notifications', 
    'Transactions', 
    'Predictions', 
    'Dashboard', 
    'Settings',
    'Analytics',      
    'Engagement',     
    'Traffic',        
    'Activity',
    'NotificationStats' 
  ],
  endpoints: () => ({}),
});