// store/slices/predictionsSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import axios from 'axios';

const BASE_URL = 'https://apidev.predictgalore.com/api/v1';

// Async Thunks for API operations

// Create a new prediction
export const createPrediction = createAsyncThunk(
  'predictions/create',
  async ({ title, description, teamId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/prediction/create`, {
        title,
        description,
        teamId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Get a single prediction by ID
export const fetchPrediction = createAsyncThunk(
  'predictions/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/prediction/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Get all predictions with pagination and filtering
export const fetchPredictions = createAsyncThunk(
  'predictions/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { Page = 1, Limit = 10, search, team, startDate, endDate } = params;
      const response = await axios.get(`${BASE_URL}/prediction`, {
        params: {
          page: Page,
          limit: Limit,
          search,
          team,
          startDate,
          endDate
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Full update of a prediction
export const updatePrediction = createAsyncThunk(
  'predictions/update',
  async ({ id, title, description, teamId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/prediction/update/${id}`, {
        title,
        description,
        teamId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Partial update of a prediction
export const patchPrediction = createAsyncThunk(
  'predictions/patch',
  async ({ id, title, description, teamId }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${BASE_URL}/prediction/edit/${id}`, {
        title,
        description,
        teamId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Delete a prediction
export const deletePrediction = createAsyncThunk(
  'predictions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/prediction/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Get all teams for prediction form
export const fetchTeams = createAsyncThunk(
  'predictions/fetchTeams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/prediction/teams`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Initial state
const initialState = {
  predictions: [],
  teams: [],
  currentPrediction: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  }
};

const predictionsSlice = createSlice({
  name: 'predictions',
  initialState,
  reducers: {
    clearCurrentPrediction: (state) => {
      state.currentPrediction = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle Next.js hydration
      .addCase(HYDRATE, (state, action) => {
        return {
          ...state,
          ...action.payload.predictions,
        };
      })

      // Create prediction
      .addCase(createPrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.predictions.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createPrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single prediction
      .addCase(fetchPrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPrediction = action.payload;
      })
      .addCase(fetchPrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all predictions
      .addCase(fetchPredictions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPredictions.fulfilled, (state, action) => {
        state.loading = false;
        state.predictions = action.payload.data || [];
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          total: action.payload.totalCount || 0
        };
      })
      .addCase(fetchPredictions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update prediction
      .addCase(updatePrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrediction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.predictions.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.predictions[index] = action.payload;
        }
        if (state.currentPrediction?.id === action.payload.id) {
          state.currentPrediction = action.payload;
        }
      })
      .addCase(updatePrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Patch prediction
      .addCase(patchPrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchPrediction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.predictions.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.predictions[index] = action.payload;
        }
        if (state.currentPrediction?.id === action.payload.id) {
          state.currentPrediction = action.payload;
        }
      })
      .addCase(patchPrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete prediction
      .addCase(deletePrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.predictions = state.predictions.filter(p => p.id !== action.payload);
        state.pagination.total -= 1;
        if (state.currentPrediction?.id === action.payload) {
          state.currentPrediction = null;
        }
      })
      .addCase(deletePrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch teams
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectPredictions = (state) => state.predictions.predictions;
export const selectCurrentPrediction = (state) => state.predictions.currentPrediction;
export const selectTeams = (state) => state.predictions.teams;
export const selectLoading = (state) => state.predictions.loading;
export const selectError = (state) => state.predictions.error;
export const selectPagination = (state) => state.predictions.pagination;
export const selectPredictionStats = createSelector(
  [selectPredictions, selectPagination],
  (predictions, pagination) => ({
    total: pagination.total,
    active: predictions.filter(p => p.status === 'active').length,
    // Add other stats as needed
  })
);

// Actions
export const { 
  clearCurrentPrediction, 
  clearError, 
  setPagination 
} = predictionsSlice.actions;

export default predictionsSlice.reducer;