import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  UsersApiResponse, 
  UserApiResponse, 
  UsersAnalyticsResponse 
} from '../types/api.types';
import { 
  UsersFilter, 
  UserFormData 
} from '../types/user.types';
import { transformApiUserToAppUser, transformApiUsersToAppUsers } from '../utils/userTransformers';

// Define proper RootState type to avoid using 'any'
interface RootState {
  auth: {
    token: string | null;
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'UsersAnalytics'], 
  endpoints: (builder) => ({
    getUsers: builder.query<UsersApiResponse, UsersFilter>({
      query: (filters) => ({
        url: '/api/v1/admin/users',
        params: {
          page: filters.page || 1,
          limit: filters.limit || 10,
          search: filters.search,
          status: filters.status,
          plan: filters.plan,
          role: filters.role,
        },
      }),
      // Transform the response to match your app's User interface
      transformResponse: (response: UsersApiResponse) => {
        if (response.data?.resultItems) {
          return {
            ...response,
            data: {
              ...response.data,
              resultItems: transformApiUsersToAppUsers(response.data.resultItems),
            },
          };
        }
        return response;
      },
      providesTags: ['User'],
    }),

    getUserById: builder.query<UserApiResponse, string>({
      query: (userId) => `/admin/users/${userId}`,
      // Transform individual user response
      transformResponse: (response: UserApiResponse) => {
        if (response.data) {
          return {
            ...response,
            data: transformApiUserToAppUser(response.data),
          };
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    createUser: builder.mutation<UserApiResponse, UserFormData>({
      query: (userData) => ({
        url: '/admin/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User', 'UsersAnalytics'],
    }),

    updateUser: builder.mutation<UserApiResponse, { userId: string; userData: Partial<UserFormData> }>({
      query: ({ userId, userData }) => ({
        url: `/admin/users/${userId}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId },
        'User',
      ],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'UsersAnalytics'],
    }),

    getUsersAnalytics: builder.query<UsersAnalyticsResponse, void>({
      query: () => '/api/v1/admin/users/summary',
      providesTags: ['UsersAnalytics'],
    }),

    exportUsers: builder.mutation<Blob, UsersFilter>({
      query: (filters) => ({
        url: '/admin/users/export',
        responseHandler: (response) => response.blob(),
        params: filters,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUsersAnalyticsQuery,
  useExportUsersMutation,
} = userApi;