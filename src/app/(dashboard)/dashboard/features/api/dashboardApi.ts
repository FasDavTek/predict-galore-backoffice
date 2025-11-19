// src/features/dashboard/api/dashboardApi.ts
import { apiSlice } from "../../../../../slices/api/apiSlice";

/* ---------------------- Types ---------------------- */

export type AnalyticsCard = {
    id?: string | number;
    title: string;
    value: string | number;
    change?: string;
    icon?: string;
    bgColor?: string;
};

export type AnalyticsResponse = {
    data: AnalyticsCard[];
};

export type EngagementPoint = {
    label: string;
    value: number;
};

export type EngagementResponse = {
    data: EngagementPoint[];
};

export type TrafficRow = {
    name: string;
    percentage: string;
    users: string;
    countryCode?: string;
};

export type TrafficResponse = {
    data: TrafficRow[];
};

export type ActivityItem = {
    id?: string | number;
    type: string;
    title: string;
    description: string;
    createdAt?: string;
};

export type ActivityResponse = {
    data: ActivityItem[];
};

/* ---------------------- API ---------------------- */

export const dashboardApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getAnalytics: builder.query<AnalyticsResponse, { range?: string } | void>({
  query: (arg) => {
    // If no args or no range, don't include range parameter
    if (!arg || !arg.range) {
      return { url: '/dashboard/analytics', method: 'GET' };
    }
    
    return {
      url: `/dashboard/analytics?range=${encodeURIComponent(arg.range)}`,
      method: 'GET',
    };
  },
  providesTags: ['Analytics'],
}),

getEngagement: builder.query<EngagementResponse, { range?: string } | void>({
  query: (arg) => {
    // If no args or no range, don't include range parameter
    if (!arg || !arg.range) {
      return { url: '/dashboard/engagement', method: 'GET' };
    }
    
    return {
      url: `/dashboard/engagement?range=${encodeURIComponent(arg.range)}`,
      method: 'GET',
    };
  },
  providesTags: ['Engagement'],
}),

      getTraffic: builder.query<TrafficResponse, { filter?: string } | void>({
  query: (arg) => {
    // If no args or no filter, don't include filter parameter
    if (!arg || !arg.filter) {
      return { url: '/dashboard/traffic', method: 'GET' };
    }
    
    return {
      url: `/dashboard/traffic?filter=${encodeURIComponent(arg.filter)}`,
      method: 'GET',
    };
  },
  providesTags: ['Traffic'],
}),

        getActivity: builder.query<ActivityResponse, { limit?: number } | void>({
            query: (arg) => {
                // If no args or no limit, don't include limit parameter
                if (!arg || !arg.limit) {
                    return { url: '/dashboard/activity', method: 'GET' };
                }

                return {
                    url: `/dashboard/activity?limit=${arg.limit}`,
                    method: 'GET',
                };
            },
            providesTags: ['Activity'],
        }),
    }),
});

export const {
    useGetAnalyticsQuery,
    useGetEngagementQuery,
    useGetTrafficQuery,
    useGetActivityQuery,
} = dashboardApi;
