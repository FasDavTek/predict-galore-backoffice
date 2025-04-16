// store/slices/usersSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import axios from 'axios';

// Mock data fallbacks
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

const mockUsersList = [
  {
    id: "USR-001",
    fullName: "John Doe",
    subscription: "Premium",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    status: "active"
  },
  {
    id: "USR-002",
    fullName: "Jane Smith",
    subscription: "Free",
    email: "jane@example.com",
    phone: "+1 (555) 987-6543",
    location: "London, UK",
    status: "active"
  }
];

// Async thunks for users data fetching
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

export const fetchUsersList = createAsyncThunk(
  'users/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      const { searchQuery, timeRange } = params;
      const response = await axios.get('/api/users', {
        params: { search: searchQuery, range: timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users list, using mock data. Error:', error.message);
      return rejectWithValue(mockUsersList);
    }
  }
);

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

// Initial state
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
    pagination: {
      page: 1,
      pageSize: 10
    }
  }
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setTimeRange: (state, action) => {
      state.filters.timeRange = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },
    setPage: (state, action) => {
      state.filters.pagination.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.filters.pagination.pageSize = action.payload;
    },
    clearUsersError: (state) => {
      state.error.users = null;
    },
    clearStatsError: (state) => {
      state.error.stats = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action) => {
        if (action.payload.users) {
          return {
            ...state,
            ...action.payload.users,
          };
        }
      })
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
        state.stats = action.payload || mockUserStats;
      })
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
        state.users = action.payload || mockUsersList;
      })
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
      });
  }
});

// Export actions
export const {
  setTimeRange,
  setSearchQuery,
  setPage,
  setPageSize,
  clearUsersError,
  clearStatsError
} = usersSlice.actions;

// Selectors
export const selectUsersState = (state) => state.users;

export const selectUserStats = createSelector(
  [selectUsersState],
  (users) => users.stats
);

export const selectUsersList = createSelector(
  [selectUsersState],
  (users) => users.users
);

export const selectUsersLoading = createSelector(
  [selectUsersState],
  (users) => users.loading
);

export const selectUsersErrors = createSelector(
  [selectUsersState],
  (users) => users.error
);

export const selectUsersFilters = createSelector(
  [selectUsersState],
  (users) => users.filters
);

export const selectTimeRange = createSelector(
  [selectUsersFilters],
  (filters) => filters.timeRange
);

export const selectSearchQuery = createSelector(
  [selectUsersFilters],
  (filters) => filters.searchQuery
);

export const selectPagination = createSelector(
  [selectUsersFilters],
  (filters) => filters.pagination
);

export default usersSlice.reducer;