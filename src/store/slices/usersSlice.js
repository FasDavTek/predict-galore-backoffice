// store/slices/usersSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import axios from 'axios';

/**
 * Mock data fallbacks - Used when API calls fail
 * Provides default data structure for user statistics
 */
const mockUserStats = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12.5",
    bgColor: "#F0FDF4",
    icon: "users"
  },
  {
    title: "Active Users",
    value: "876",
    change: "-2.3",
    bgColor: "#FEF2F2",
    icon: "users"
  },
  {
    title: "New Users",
    value: "142",
    change: "+5.8",
    bgColor: "#EFF8FF",
    icon: "users"
  },
  {
    title: "Premium Users",
    value: "234",
    change: "+15.8",
    bgColor: "#F5F3FF",
    icon: "users"
  }
];

/**
 * Mock user list - Fallback data when user fetch fails
 * Contains sample user data with all required fields
 */
const mockUsersList = [
  {
    id: "USR-001",
    fullName: "John Doe",
    subscription: "Premium",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    status: "active",
    createdAt: "2023-05-15T10:30:00Z", // ISO format date
  },
  {
    id: "USR-002",
    fullName: "Jane Smith",
    subscription: "Free",
    email: "jane@example.com",
    phone: "+1 (555) 987-6543",
    location: "London, UK",
    status: "active",
    createdAt: "2023-06-20T14:45:00Z",
  }
];

// ==================== ASYNC THUNKS ==================== //

/**
 * Fetches user statistics from API
 * Falls back to mock data if API call fails
 */
export const fetchUserStats = createAsyncThunk(
  'users/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/users/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user stats, using mock data. Error:', error.message);
      return rejectWithValue(mockUserStats);
    }
  }
);

/**
 * Fetches user list with optional filtering
 * @param {Object} params - Contains searchQuery and timeRange
 */
// In your fetchUsersList thunk
export const fetchUsersList = createAsyncThunk(
  'users/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      const { searchQuery, timeRange, status, plan } = params;
      const response = await axios.get('/api/users', {
        params: { 
          search: searchQuery, 
          range: timeRange,
          status: status !== 'all' ? status : undefined,
          plan: plan !== 'all' ? plan : undefined
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users list, using mock data. Error:', error.message);
      return rejectWithValue(mockUsersList);
    }
  }
);

/**
 * Exports user data as CSV
 * Returns null if export fails
 */
export const exportUsersCSV = createAsyncThunk(
  'users/exportCSV',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/users/export');
      return response.data;
    } catch (error) {
      console.error('Failed to export users CSV. Error:', error.message);
      return rejectWithValue(null);
    }
  }
);

/**
 * Deletes a user by ID
 * Refreshes user list after successful deletion
 */
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      dispatch(fetchUsersList()); // Refresh list after deletion
      return userId;
    } catch (error) {
      console.error('Failed to delete user:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

/**
 * Upgrades a user to premium
 * Refreshes user list after successful upgrade
 */
export const upgradeUser = createAsyncThunk(
  'users/upgradeUser',
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      await axios.patch(`/api/users/${userId}/upgrade`);
      dispatch(fetchUsersList()); // Refresh list after upgrade
      return userId;
    } catch (error) {
      console.error('Failed to upgrade user:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

// ==================== INITIAL STATE ==================== //

/**
 * Initial Redux state structure
 * Contains:
 * - Data arrays for stats and users
 * - Loading states for different operations
 * - Error states
 * - Filter and pagination settings
 */
const initialState = {
  stats: [],
  users: [],
  loading: {
    stats: false,
    users: false,
    export: false
  },
  error: {
    stats: null,
    users: null,
    export: null
  },
  filters: {
    timeRange: 'This Month',
    searchQuery: '',
    statusFilter: 'all', // Add status filter
    planFilter: 'all'   // Add plan filter
  }
};

// ==================== SLICE DEFINITION ==================== //

const usersSlice = createSlice({
  name: 'users', // Slice name used in Redux store
  initialState,
  reducers: {
    // Action to set time range filter
    setTimeRange: (state, action) => {
      state.filters.timeRange = action.payload;
    },
    // Action to set search query
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.filters.statusFilter = action.payload;
    },
    setPlanFilter: (state, action) => {
      state.filters.planFilter = action.payload;
    },
    // Action to set current page
    setPage: (state, action) => {
      state.filters.pagination.page = action.payload;
    },
    // Action to set items per page
    setPageSize: (state, action) => {
      state.filters.pagination.pageSize = action.payload;
    },
    // Clears user-related errors
    clearUsersError: (state) => {
      state.error.users = null;
    },
    // Clears stats-related errors
    clearStatsError: (state) => {
      state.error.stats = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handles Next.js hydration (SSR state merging)
      .addCase(HYDRATE, (state, action) => {
        if (action.payload.users) {
          return {
            ...state,
            ...action.payload.users,
          };
        }
      })
      
      // ========== FETCH USER STATS REDUCERS ========== //
      .addCase(fetchUserStats.pending, (state) => {
        state.loading.stats = true;
        state.error.stats = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error.stats = action.error;
        state.stats = action.payload || mockUserStats; // Fallback to mock data
      })
      
      // ========== FETCH USERS LIST REDUCERS ========== //
      .addCase(fetchUsersList.pending, (state) => {
        state.loading.users = true;
        state.error.users = null;
      })
      .addCase(fetchUsersList.fulfilled, (state, action) => {
        state.loading.users = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersList.rejected, (state, action) => {
        state.loading.users = false;
        state.error.users = action.error;
        state.users = action.payload || mockUsersList; // Fallback to mock data
      })
      
      // ========== EXPORT CSV REDUCERS ========== //
      .addCase(exportUsersCSV.pending, (state) => {
        state.loading.export = true;
        state.error.export = null;
      })
      .addCase(exportUsersCSV.fulfilled, (state) => {
        state.loading.export = false;
      })
      .addCase(exportUsersCSV.rejected, (state, action) => {
        state.loading.export = false;
        state.error.export = action.error;
      })
      
      // ========== DELETE USER REDUCERS ========== //
      .addCase(deleteUser.pending, (state) => {
        state.loading.users = true;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading.users = false;
        // List refresh handled by fetchUsersList in thunk
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading.users = false;
        state.error.users = action.error;
      })
      
      // ========== UPGRADE USER REDUCERS ========== //
      .addCase(upgradeUser.pending, (state) => {
        state.loading.users = true;
      })
      .addCase(upgradeUser.fulfilled, (state) => {
        state.loading.users = false;
        // List refresh handled by fetchUsersList in thunk
      })
      .addCase(upgradeUser.rejected, (state, action) => {
        state.loading.users = false;
        state.error.users = action.error;
      });
  }
});

// ==================== ACTION EXPORTS ==================== //
export const {
  setTimeRange,
  setSearchQuery,
  setStatusFilter,  
  setPlanFilter,  
  setPage,
  setPageSize,
  clearUsersError,
  clearStatsError
} = usersSlice.actions;

// ==================== SELECTORS ==================== //

// Base selector for users state
export const selectUsersState = (state) => state.users;

// Memoized selector for user stats
export const selectUserStats = createSelector(
  [selectUsersState],
  (users) => users.stats
);

// Memoized selector for users list
export const selectUsersList = createSelector(
  [selectUsersState],
  (users) => users.users
);

// Memoized selector for loading states
export const selectUsersLoading = createSelector(
  [selectUsersState],
  (users) => users.loading
);

// Memoized selector for error states
export const selectUsersErrors = createSelector(
  [selectUsersState],
  (users) => users.error
);

// Memoized selector for filters
export const selectUsersFilters = createSelector(
  [selectUsersState],
  (users) => users.filters
);

// Derived selectors for specific filter values
export const selectTimeRange = createSelector(
  [selectUsersFilters],
  (filters) => filters.timeRange
);

export const selectSearchQuery = createSelector(
  [selectUsersFilters],
  (filters) => filters.searchQuery
);
export const selectStatusFilter = createSelector(
  [selectUsersFilters],
  (filters) => filters.statusFilter
);

export const selectPlanFilter = createSelector(
  [selectUsersFilters],
  (filters) => filters.planFilter
);

export const selectPagination = createSelector(
  [selectUsersFilters],
  (filters) => filters.pagination
);

export default usersSlice.reducer;