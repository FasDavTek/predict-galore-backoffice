// store/slices/dashboard/dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import axios from 'axios';

// Mock data fallbacks
const mockStatsData = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12.5%",
    bgColor: "bg-gray-50",
    icon: "users"
  },
  {
    title: "Free Users",
    value: "1,000",
    change: "+10.2%",
    bgColor: "bg-red-50",
    icon: "users"
  },
  {
    title: "Premium Users",
    value: "234",
    change: "+15.8%",
    bgColor: "bg-green-50",
    icon: "users"
  },
  {
    title: "Payments",
    value: "$12.4k",
    change: "+18.3%",
    bgColor: "bg-[#e8f9ff]",
    icon: "wallet"
  },
];

const mockEngagementData = [
  {
    id: "Total Users",
    data: [
      { x: "Mar 6", y: 20 },
      { x: "Mar 7", y: 35 },
      { x: "Mar 8", y: 45 },
      { x: "Mar 9", y: 40 },
      { x: "Mar 10", y: 60 },
      { x: "Mar 11", y: 55 },
      { x: "Mar 12", y: 75 },
    ],
  },
];

const mockTrafficData = [
  { id: 'Mobile', value: 45, label: 'Mobile' },
  { id: 'Desktop', value: 35, label: 'Desktop' },
  { id: 'Tablet', value: 20, label: 'Tablet' },
];

const mockActivityLog = [
  {
    id: 1,
    action: "User signed up",
    user: "john@example.com",
    timestamp: "2023-05-15T10:30:00Z",
    icon: "signup"
  },
  {
    id: 2,
    action: "Prediction made",
    user: "sarah@example.com",
    timestamp: "2023-05-15T11:45:00Z",
    icon: "prediction"
  },
  {
    id: 3,
    action: "Payment processed",
    user: "mike@example.com",
    timestamp: "2023-05-15T12:15:00Z",
    icon: "payment"
  }
];

// Async thunks for dashboard data fetching
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching dashboard stats from API...');
      const response = await axios.get('/api/dashboard/stats');
      console.log('Stats data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch stats, using mock data. Error:', error.message);
      return rejectWithValue(mockStatsData);
    }
  }
);

export const fetchUserEngagement = createAsyncThunk(
  'dashboard/fetchEngagement',
  async (timeRange, { rejectWithValue }) => {
    try {
      console.log(`Fetching engagement data for range: ${timeRange}`);
      const response = await axios.get('/api/dashboard/engagement', {
        params: { range: timeRange }
      });
      console.log('Engagement data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch engagement, using mock data. Error:', error.message);
      return rejectWithValue(mockEngagementData);
    }
  }
);

export const fetchTrafficData = createAsyncThunk(
  'dashboard/fetchTraffic',
  async (filterType, { rejectWithValue }) => {
    try {
      console.log(`Fetching traffic data with filter: ${filterType}`);
      const response = await axios.get('/api/dashboard/traffic', {
        params: { filter: filterType }
      });
      console.log('Traffic data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch traffic, using mock data. Error:', error.message);
      return rejectWithValue(mockTrafficData);
    }
  }
);

export const fetchActivityLog = createAsyncThunk(
  'dashboard/fetchActivityLog',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching activity log...');
      const response = await axios.get('/api/dashboard/activity');
      console.log('Activity log received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch activity log, using mock data. Error:', error.message);
      return rejectWithValue(mockActivityLog);
    }
  }
);

// Initial state
const initialState = {
  stats: [],
  engagement: [],
  traffic: [],
  activityLog: [],
  loading: {
    stats: false,
    engagement: false,
    traffic: false,
    activityLog: false
  },
  error: {
    stats: null,
    engagement: null,
    traffic: null,
    activityLog: null
  },
  filters: {
    timeRange: 'This Month',
    trafficFilter: 'By location',
    activityLogLimit: 3 // Default to show 3 recent activities
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Reducers for filter changes
    setTimeRange: (state, action) => {
      state.filters.timeRange = action.payload;
    },
    setTrafficFilter: (state, action) => {
      state.filters.trafficFilter = action.payload;
    },
    setActivityLogLimit: (state, action) => {
      state.filters.activityLogLimit = action.payload;
    },
    // Error clearing reducers
    clearStatsError: (state) => {
      state.error.stats = null;
    },
    clearEngagementError: (state) => {
      state.error.engagement = null;
    },
    clearTrafficError: (state) => {
      state.error.traffic = null;
    },
    clearActivityLogError: (state) => {
      state.error.activityLog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Next.js hydration
      .addCase(HYDRATE, (state, action) => {
        if (action.payload.dashboard) {
          return {
            ...state,
            ...action.payload.dashboard,
          };
        }
      })

      // Stats data cases
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading.stats = true;
        state.error.stats = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error.stats = action.error;
        state.stats = action.payload || mockStatsData;
      })

      // Engagement data cases
      .addCase(fetchUserEngagement.pending, (state) => {
        state.loading.engagement = true;
        state.error.engagement = null;
      })
      .addCase(fetchUserEngagement.fulfilled, (state, action) => {
        state.loading.engagement = false;
        state.engagement = action.payload;
      })
      .addCase(fetchUserEngagement.rejected, (state, action) => {
        state.loading.engagement = false;
        state.error.engagement = action.error;
        state.engagement = action.payload || mockEngagementData;
      })

      // Traffic data cases
      .addCase(fetchTrafficData.pending, (state) => {
        state.loading.traffic = true;
        state.error.traffic = null;
      })
      .addCase(fetchTrafficData.fulfilled, (state, action) => {
        state.loading.traffic = false;
        state.traffic = action.payload;
      })
      .addCase(fetchTrafficData.rejected, (state, action) => {
        state.loading.traffic = false;
        state.error.traffic = action.error;
        state.traffic = action.payload || mockTrafficData;
      })

      // Activity log cases
      .addCase(fetchActivityLog.pending, (state) => {
        state.loading.activityLog = true;
        state.error.activityLog = null;
      })
      .addCase(fetchActivityLog.fulfilled, (state, action) => {
        state.loading.activityLog = false;
        state.activityLog = action.payload;
      })
      .addCase(fetchActivityLog.rejected, (state, action) => {
        state.loading.activityLog = false;
        state.error.activityLog = action.error;
        state.activityLog = action.payload || mockActivityLog;
      });
  },
});

// Export actions
export const {
  setTimeRange,
  setTrafficFilter,
  setActivityLogLimit,
  clearStatsError,
  clearEngagementError,
  clearTrafficError,
  clearActivityLogError,
} = dashboardSlice.actions;

// Selectors
export const selectDashboardStats = (state) => state.dashboard.stats;
export const selectUserEngagement = (state) => state.dashboard.engagement;
export const selectTrafficData = (state) => state.dashboard.traffic;
export const selectActivityLog = (state) => {
  const limit = state.dashboard.filters.activityLogLimit;
  return state.dashboard.activityLog.slice(0, limit);
};
export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectDashboardErrors = (state) => state.dashboard.error;
export const selectDashboardFilters = (state) => state.dashboard.filters;

export default dashboardSlice.reducer;