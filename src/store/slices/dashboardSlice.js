// store/slices/dashboard/dashboardSlice.js
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axios from "axios";

// Mock data fallbacks - Used when API calls fail or during development
const mockStatsData = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12.5%",
    bgColor: "bg-gray-50",
    icon: "users",
  },
  {
    title: "Free Users",
    value: "1,000",
    change: "+5.2%",
    bgColor: "bg-red-50",
    icon: "users",
  },
  {
    title: "Premium Users",
    value: "234",
    change: "+15.8%",
    bgColor: "bg-green-50",
    icon: "users",
  },
  {
    title: "Payments",
    value: "$12.4k",
    change: "+18.3%",
    bgColor: "bg-[#e8f9ff]",
    icon: "wallet",
  },
];



const mockEngagementData = {
  free: [
    { name: 'Mar 6', value: 20 },
    { name: 'Mar 7', value: 35 },
    { name: 'Mar 8', value: 45 },
    { name: 'Mar 9', value: 40 },
    { name: 'Mar 10', value: 60 },
    { name: 'Mar 11', value: 55 },
    { name: 'Mar 12', value: 75 }
  ],
  premium: [
    { name: 'Mar 6', value: 10 },
    { name: 'Mar 7', value: 15 },
    { name: 'Mar 8', value: 25 },
    { name: 'Mar 9', value: 30 },
    { name: 'Mar 10', value: 40 },
    { name: 'Mar 11', value: 35 },
    { name: 'Mar 12', value: 45 }
  ],
  total: [
    { name: 'Mar 6', value: 30 },
    { name: 'Mar 7', value: 50 },
    { name: 'Mar 8', value: 70 },
    { name: 'Mar 9', value: 70 },
    { name: 'Mar 10', value: 100 },
    { name: 'Mar 11', value: 90 },
    { name: 'Mar 12', value: 120 }
  ]
};


const mockTrafficData = [
  { name: 'Nigeria', percentage: '28%', users: '27,650', countryCode: 'NG' },
  { name: 'United States', percentage: '22%', users: '18,900', countryCode: 'US' },
  { name: 'United Kingdom', percentage: '15%', users: '12,600', countryCode: 'GB' },
  { name: 'South Africa', percentage: '10%', users: '9,400', countryCode: 'ZA' },
  { name: 'India', percentage: '8%', users: '7,200', countryCode: 'IN' }
];

const mockActivityLog = [
  {
    id: 1,
    type: 'payment',
    title: 'Subscription payment',
    description: 'User HighRoller88 successfully paid $20.00 for premium subscription',
    time: '1 day ago'
  },
  {
    id: 2,
    type: 'upgrade',
    title: 'Account Upgrade',
    description: 'User HighRoller88 successfully subscribed to premium plan',
    time: '1 day ago'
  },
  {
    id: 3,
    type: 'prediction',
    title: 'New Prediction Added',
    description: 'Admin JohnDoe added a new prediction: Arsenal vs Chelsea',
    time: '1 day ago'
  }
];


// Action: Fetch dashboard statistics from API
export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats", // Unique action type
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/dashboard/stats");
      return response.data; // Return actual API data
    } catch (error) {
      return rejectWithValue(mockStatsData); // Fallback to mock data
    }
  }
);

// Action: Fetch user engagement data from API
export const fetchUserEngagement = createAsyncThunk(
  "dashboard/fetchEngagement",
  async (timeRange, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/dashboard/engagement", {
        params: { range: timeRange },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(mockEngagementData);
    }
  }
);

// Action: Fetch traffic source data from API
export const fetchTrafficData = createAsyncThunk(
  "dashboard/fetchTraffic",
  async (filterType, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/dashboard/traffic", {
        params: { filter: filterType },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(mockTrafficData);
    }
  }
);

// Action: Fetch recent activity log from API
export const fetchActivityLog = createAsyncThunk(
  "dashboard/fetchActivityLog",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/dashboard/activity");
      return response.data;
    } catch (error) {
      return rejectWithValue(mockActivityLog); 
    }
  }
);

// Initial state structure for the dashboard slice
const initialState = {
  stats: [], // Will hold statistics cards data
  engagement: [], // Will hold user engagement chart data
  traffic: [], // Will hold traffic source data
  activityLog: [], // Will hold recent activities

  // Loading states for each data type
  loading: {
    stats: false,
    engagement: false,
    traffic: false,
    activityLog: false,
  },

  // Error states for each data type
  error: {
    stats: null,
    engagement: null,
    traffic: null,
    activityLog: null,
  },

  // User-selected filters
  filters: {
    timeRange: "This Month", // Default time period filter
    trafficFilter: "By location", // How to group traffic data
    activityLogLimit: 3, // Number of activities to show
  },
};

// Create the dashboard slice with reducers and async handling
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Reducer: Update the time range filter
    setTimeRange: (state, action) => {
      state.filters.timeRange = action.payload;
    },

    // Reducer: Update the traffic filter type
    setTrafficFilter: (state, action) => {
      state.filters.trafficFilter = action.payload;
    },

    // Reducer: Update how many activities to show
    setActivityLogLimit: (state, action) => {
      state.filters.activityLogLimit = action.payload;
    },

    // Reducer: Clear statistics error
    clearStatsError: (state) => {
      state.error.stats = null;
    },

    // Reducer: Clear engagement error
    clearEngagementError: (state) => {
      state.error.engagement = null;
    },

    // Reducer: Clear traffic error
    clearTrafficError: (state) => {
      state.error.traffic = null;
    },

    // Reducer: Clear activity log error
    clearActivityLogError: (state) => {
      state.error.activityLog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Special case for Next.js server-side rendering
      .addCase(HYDRATE, (state, action) => {
        if (action.payload.dashboard) {
          return {
            ...state,
            ...action.payload.dashboard,
          };
        }
      })

      // Handle stats data fetching lifecycle
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

      // Handle engagement data fetching lifecycle
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

      // Handle traffic data fetching lifecycle
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

      // Handle activity log fetching lifecycle
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

// Export all actions for components to use
export const {
  setTimeRange,
  setTrafficFilter,
  setActivityLogLimit,
  clearStatsError,
  clearEngagementError,
  clearTrafficError,
  clearActivityLogError,
} = dashboardSlice.actions;

// SELECTORS

// Selector: Get the entire dashboard state
export const selectDashboardState = (state) => state.dashboard;

// Selector: Get just the statistics data (memoized)
export const selectDashboardStats = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.stats || mockStatsData
);

// Selector: Get user engagement data (memoized)
export const selectUserEngagement = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.engagement
);

// Selector: Get traffic source data (memoized)
export const selectTrafficData = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.traffic
);

// Selector: Get activity log with current limit applied (memoized)
export const selectActivityLog = createSelector(
  [selectDashboardState],
  (dashboard) => {
    const limit = dashboard.filters.activityLogLimit;
    const log = Array.isArray(dashboard.activityLog) ? dashboard.activityLog : mockActivityLog;
    return log.slice(0, limit);
  }
);

// Selector: Get all loading states (memoized)
export const selectDashboardLoading = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.loading
);

// Selector: Get all error states (memoized)
export const selectDashboardErrors = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.error
);

// Selector: Get all filter values (memoized)
export const selectDashboardFilters = createSelector(
  [selectDashboardState],
  (dashboard) => dashboard.filters
);

// Selector: Get just the time range filter (memoized)
export const selectTimeRange = createSelector(
  [selectDashboardFilters],
  (filters) => filters.timeRange
);

// Selector: Get just the traffic filter (memoized)
export const selectTrafficFilter = createSelector(
  [selectDashboardFilters],
  (filters) => filters.trafficFilter
);

// Selector: Get just the activity log limit (memoized)
export const selectActivityLogLimit = createSelector(
  [selectDashboardFilters],
  (filters) => filters.activityLogLimit
);

// Export the reducer to be included in the Redux store
export default dashboardSlice.reducer;
