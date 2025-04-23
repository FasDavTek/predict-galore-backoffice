// store/slices/predictionsSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import axios from 'axios';

/**
 * Mock data fallbacks - Used when API calls fail
 * Provides default data structure for prediction statistics
 */
const mockPredictionStats = [
  {
    title: "Total Predictions",
    value: "1,856",
    change: "+24.5"
  },
  {
    title: "Active Predictions",
    value: "432",
    change: "+8.3"
  },
  {
    title: "Winning Predictions",
    value: "1,284",
    change: "+15.2"
  },
  {
    title: "Accuracy Rate",
    value: "72.4%",
    change: "+3.8"
  }
];

/**
 * Mock predictions list - Fallback data when predictions fetch fails
 * Contains sample prediction data with all required fields
 */
const mockPredictionsList = [
  {
    id: "PRED-001",
    match: "Arsenal vs Chelsea",
    sport: "football",
    league: "English Premier League",
    prediction: "Arsenal to win",
    confidence: 85,
    status: "active",
    accuracy: 72,
    datePosted: "2023-06-15T14:30:00Z",
    outcome: "pending"
  },
  {
    id: "PRED-002",
    match: "Barcelona vs Real Madrid",
    sport: "football",
    league: "LaLiga",
    prediction: "Over 2.5 goals",
    confidence: 78,
    status: "won",
    accuracy: 100,
    datePosted: "2023-06-10T20:45:00Z",
    outcome: "won"
  },
  {
    id: "PRED-003",
    match: "Lakers vs Warriors",
    sport: "basketball",
    league: "NBA",
    prediction: "Lakers +5.5",
    confidence: 65,
    status: "lost",
    accuracy: 0,
    datePosted: "2023-06-05T03:30:00Z",
    outcome: "lost"
  }
];

// ==================== ASYNC THUNKS ==================== //

/**
 * Fetches prediction statistics from API
 * Falls back to mock data if API call fails
 */
export const fetchPredictionsStats = createAsyncThunk(
  'predictions/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/predictions/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch prediction stats, using mock data. Error:', error.message);
      return rejectWithValue(mockPredictionStats);
    }
  }
);

/**
 * Fetches predictions list with optional filtering
 * @param {Object} params - Contains searchQuery, timeRange, sportFilter, and statusFilter
 */
export const fetchPredictionsList = createAsyncThunk(
  'predictions/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      const { searchQuery, timeRange, sportFilter, statusFilter } = params;
      const response = await axios.get('/api/predictions', {
        params: { 
          search: searchQuery, 
          range: timeRange,
          sport: sportFilter !== 'all' ? sportFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch predictions list, using mock data. Error:', error.message);
      return rejectWithValue(mockPredictionsList);
    }
  }
);

/**
 * Exports predictions data as CSV
 * Returns null if export fails
 */
export const exportPredictionsCSV = createAsyncThunk(
  'predictions/exportCSV',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/predictions/export');
      return response.data;
    } catch (error) {
      console.error('Failed to export predictions CSV. Error:', error.message);
      return rejectWithValue(null);
    }
  }
);

/**
 * Creates a new prediction
 * Refreshes predictions list after successful creation
 */
export const createPrediction = createAsyncThunk(
  'predictions/create',
  async (predictionData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post('/api/predictions', predictionData);
      dispatch(fetchPredictionsList({})); // Refresh list with current filters
      return response.data;
    } catch (error) {
      console.error('Failed to create prediction:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

/**
 * Updates an existing prediction
 * Refreshes predictions list after successful update
 */
export const updatePrediction = createAsyncThunk(
  'predictions/update',
  async ({ id, predictionData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(`/api/predictions/${id}`, predictionData);
      dispatch(fetchPredictionsList({})); // Refresh list with current filters
      return response.data;
    } catch (error) {
      console.error('Failed to update prediction:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

/**
 * Cancels a scheduled prediction
 * Refreshes predictions list after successful cancellation
 */
export const cancelPrediction = createAsyncThunk(
  'predictions/cancel',
  async (predictionId, { rejectWithValue, dispatch }) => {
    try {
      await axios.patch(`/api/predictions/${predictionId}/cancel`);
      dispatch(fetchPredictionsList({})); // Refresh list with current filters
      return predictionId;
    } catch (error) {
      console.error('Failed to cancel prediction:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

/**
 * Resolves a prediction (mark as won/lost)
 * Refreshes predictions list after successful resolution
 */
export const resolvePrediction = createAsyncThunk(
  'predictions/resolve',
  async ({ predictionId, outcome }, { rejectWithValue, dispatch }) => {
    try {
      await axios.patch(`/api/predictions/${predictionId}/resolve`, { outcome });
      dispatch(fetchPredictionsList({})); // Refresh list with current filters
      return { predictionId, outcome };
    } catch (error) {
      console.error('Failed to resolve prediction:', error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);

// ==================== INITIAL STATE ==================== //

/**
 * Initial Redux state structure
 * Contains:
 * - Data arrays for stats and predictions
 * - Loading states for different operations
 * - Error states
 * - Filter and pagination settings
 */
const initialState = {
  stats: [],
  predictions: [],
  loading: {
    stats: false,
    predictions: false,
    export: false,
    create: false,
    update: false
  },
  error: {
    stats: null,
    predictions: null,
    export: null,
    create: null,
    update: null
  },
  filters: {
    timeRange: 'This Month',
    searchQuery: '',
    sportFilter: 'all',
    statusFilter: 'all'
  }
};

// ==================== SLICE DEFINITION ==================== //

const predictionSlice = createSlice({
  name: 'predictions', // Slice name used in Redux store
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
    // Action to set sport filter
    setSportFilter: (state, action) => {
      state.filters.sportFilter = action.payload;
    },
    // Action to set status filter
    setStatusFilter: (state, action) => {
      state.filters.statusFilter = action.payload;
    },
    // Clears prediction-related errors
    clearPredictionsError: (state) => {
      state.error.predictions = null;
    },
    // Clears stats-related errors
    clearStatsError: (state) => {
      state.error.stats = null;
    },
    // Clears creation-related errors
    clearCreateError: (state) => {
      state.error.create = null;
    },
    // Clears update-related errors
    clearUpdateError: (state) => {
      state.error.update = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handles Next.js hydration (SSR state merging)
      .addCase(HYDRATE, (state, action) => {
        if (action.payload.predictions) {
          return {
            ...state,
            ...action.payload.predictions,
          };
        }
      })
      
      // ========== FETCH PREDICTION STATS REDUCERS ========== //
      .addCase(fetchPredictionsStats.pending, (state) => {
        state.loading.stats = true;
        state.error.stats = null;
      })
      .addCase(fetchPredictionsStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchPredictionsStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error.stats = action.error;
        state.stats = action.payload || mockPredictionStats; // Fallback to mock data
      })
      
      // ========== FETCH PREDICTIONS LIST REDUCERS ========== //
      .addCase(fetchPredictionsList.pending, (state) => {
        state.loading.predictions = true;
        state.error.predictions = null;
      })
      .addCase(fetchPredictionsList.fulfilled, (state, action) => {
        state.loading.predictions = false;
        state.predictions = action.payload;
      })
      .addCase(fetchPredictionsList.rejected, (state, action) => {
        state.loading.predictions = false;
        state.error.predictions = action.error;
        state.predictions = action.payload || mockPredictionsList; // Fallback to mock data
      })
      
      // ========== EXPORT CSV REDUCERS ========== //
      .addCase(exportPredictionsCSV.pending, (state) => {
        state.loading.export = true;
        state.error.export = null;
      })
      .addCase(exportPredictionsCSV.fulfilled, (state) => {
        state.loading.export = false;
      })
      .addCase(exportPredictionsCSV.rejected, (state, action) => {
        state.loading.export = false;
        state.error.export = action.error;
      })
      
      // ========== CREATE PREDICTION REDUCERS ========== //
      .addCase(createPrediction.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createPrediction.fulfilled, (state) => {
        state.loading.create = false;
        // List refresh handled by fetchPredictionsList in thunk
      })
      .addCase(createPrediction.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.error;
      })
      
      // ========== UPDATE PREDICTION REDUCERS ========== //
      .addCase(updatePrediction.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updatePrediction.fulfilled, (state) => {
        state.loading.update = false;
        // List refresh handled by fetchPredictionsList in thunk
      })
      .addCase(updatePrediction.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.error;
      })
      
      // ========== CANCEL PREDICTION REDUCERS ========== //
      .addCase(cancelPrediction.pending, (state) => {
        state.loading.update = true;
      })
      .addCase(cancelPrediction.fulfilled, (state) => {
        state.loading.update = false;
        // List refresh handled by fetchPredictionsList in thunk
      })
      .addCase(cancelPrediction.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.error;
      })
      
      // ========== RESOLVE PREDICTION REDUCERS ========== //
      .addCase(resolvePrediction.pending, (state) => {
        state.loading.update = true;
      })
      .addCase(resolvePrediction.fulfilled, (state) => {
        state.loading.update = false;
        // List refresh handled by fetchPredictionsList in thunk
      })
      .addCase(resolvePrediction.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.error;
      });
  }
});

// ==================== ACTION EXPORTS ==================== //
export const {
  setTimeRange,
  setSearchQuery,
  setSportFilter,
  setStatusFilter,
  clearPredictionsError,
  clearStatsError,
  clearCreateError,
  clearUpdateError
} = predictionSlice.actions;

// ==================== SELECTORS ==================== //

// Base selector for predictions state
export const selectPredictionsState = (state) => state.predictions;

// Memoized selector for prediction stats
export const selectPredictionsStats = createSelector(
  [selectPredictionsState],
  (predictions) => predictions.stats
);

// Memoized selector for predictions list
export const selectPredictionsList = createSelector(
  [selectPredictionsState],
  (predictions) => predictions.predictions
);

// Memoized selector for loading states
export const selectPredictionsLoading = createSelector(
  [selectPredictionsState],
  (predictions) => predictions.loading
);

// Memoized selector for error states
export const selectPredictionsErrors = createSelector(
  [selectPredictionsState],
  (predictions) => predictions.error
);

// Memoized selector for filters
export const selectPredictionsFilters = createSelector(
  [selectPredictionsState],
  (predictions) => predictions.filters
);

// Derived selectors for specific filter values
export const selectTimeRange = createSelector(
  [selectPredictionsFilters],
  (filters) => filters.timeRange
);

export const selectSearchQuery = createSelector(
  [selectPredictionsFilters],
  (filters) => filters.searchQuery
);

export const selectSportFilter = createSelector(
  [selectPredictionsFilters],
  (filters) => filters.sportFilter
);

export const selectStatusFilter = createSelector(
  [selectPredictionsFilters],
  (filters) => filters.statusFilter
);

// Selector for filtered predictions (client-side filtering example)
export const selectFilteredPredictions = createSelector(
  [selectPredictionsList, selectSearchQuery, selectSportFilter, selectStatusFilter],
  (predictions, searchQuery, sportFilter, statusFilter) => {
    let filtered = [...predictions];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prediction => 
        prediction.match.toLowerCase().includes(query) || 
        prediction.prediction.toLowerCase().includes(query)
      );
    }
    
    // Apply sport filter
    if (sportFilter !== 'all') {
      filtered = filtered.filter(prediction => prediction.sport === sportFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(prediction => prediction.status === statusFilter);
    }
    
    return filtered;
  }
);

export default predictionSlice.reducer;