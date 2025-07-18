// store/slices/predictionsSlice.js
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axios from "axios";

const BASE_URL = "https://apidev.predictgalore.com";

// Helper function for consistent error logging
const logApiError = (operation, endpoint = null, payload = null, error) => {
  //  Error message
  const errorMessage = [
    `-------------------------`,
    `API Error: ${operation}`,
    `-------------------------`,
    endpoint && `Endpoint: ${endpoint}`,
    `\n`,
    payload && `Payload: ${JSON.stringify(payload, null, 2)}`,
    `\n`,
    `Error: ${error.message}`,
    `\n`,
    error.response?.status && `Status: ${error.response.status}`,
    `\n`,
    error.response?.data?.message &&
      `Server Message: ${error.response.data.message}`,
    `\n`,
    error.response?.data?.errors &&
      `Validation Errors: ${JSON.stringify(
        error.response.data.errors,
        null,
        2
      )}`,
  ]
    .filter(Boolean) // Remove empty lines
    .join("\n"); // Join with newlines

  // Log to console (grouped for better visualization)
  console.groupCollapsed(
    `%cAPI Error: ${operation}`,
    "color: red; font-weight: bold;"
  );
  console.log(errorMessage);
  console.groupEnd();

  // Return the formatted message for potential copying
  return errorMessage;
};

// Helper function for successful operation logging
const logApiSuccess = (operation, response) => {
  console.groupCollapsed(
    `%cAPI Success: ${operation}`,
    "color: green; font-weight: bold;"
  );
  console.log("Operation:", operation);
  console.log("Response:", response);
  console.groupEnd();
};

// Async Thunks for API operations

// Create a new prediction
export const createPrediction = createAsyncThunk(
  "predictions/create",
  async ({ data: predictionData, token }, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/prediction/create`;

    try {
      console.log("Creating new prediction with data:", predictionData);

      // Transform data to match backend expectations
      const requestData = {
        matchId: predictionData.matchId,
        isPremium: predictionData.isPremium,
        isScheduled: predictionData.isScheduled,
        scheduledTime: predictionData.scheduledTime,
        competitionId: predictionData.competitionId,
        expertAnalysis: predictionData.expertAnalysis,
        confidencePercentage: predictionData.confidencePercentage,
        values: predictionData.values.map((value) => ({
          predictionTypeId: value.predictionTypeId,
          value: value.value,
          label: value.label || null,
          tip: value.tip || null,
          odds: Number(value.odds),
          confidence: Number(value.confidence),
        })),
      };

      const response = await axios.post(endpoint, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      logApiSuccess("createPrediction", response.data);
      return response.data;
    } catch (error) {
      logApiError(
        "createPrediction",
        endpoint,
        {
          matchId: predictionData.matchId,
          competitionId: predictionData.competitionId,
        },
        error
      );

      return rejectWithValue({
        message: error.response?.data?.message || "Prediction creation failed",
        statusCode: error.response?.status || 500,
        errors: error.response?.data?.errors || null,
      });
    }
  }
);

// Get a single prediction by ID
export const fetchPrediction = createAsyncThunk(
  "predictions/fetchOne",
  async (id, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/prediction/{id}`;

    try {
      console.debug(`Fetching prediction with ID: ${id}`);
      const response = await axios.get(endpoint);
      logApiSuccess("fetchPrediction", response.data);
      return response.data;
    } catch (error) {
      logApiError("fetchPrediction", endpoint, { id }, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch prediction",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

// Get all predictions with pagination and filtering
export const fetchPredictions = createAsyncThunk(
  "predictions/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/prediction`;
    const { Page = 1, Limit = 10, search, team, startDate, endDate } = params;

    try {
      console.debug("Fetching predictions with params:", params);
      const response = await axios.get(endpoint, {
        params: {
          page: Page,
          limit: Limit,
          search,
          team,
          startDate,
          endDate,
        },
      });
      logApiSuccess("fetchPredictions", response.data);
      return response.data;
    } catch (error) {
      logApiError("fetchPredictions", endpoint, params, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch predictions",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

// Get prediction statistics (total, active, winning, accuracy)
export const fetchPredictionStats = createAsyncThunk(
  "predictions/fetchStats",
  async (_, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/prediction`;

    try {
      console.debug("Fetching prediction statistics");
      const response = await axios.get(endpoint);
      logApiSuccess("fetchPredictionStats", response.data);
      return response.data;
    } catch (error) {
      logApiError("fetchPredictionStats", endpoint, null, error);
      return rejectWithValue({
        message:
          error.response?.data?.message || "Failed to fetch prediction stats",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

// Full update of a prediction
export const updatePrediction = createAsyncThunk(
  "predictions/update",
  async ({ id, title, description, teamId }, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/prediction/update/{id}`;

    try {
      console.debug(`Updating prediction with ID: ${id}`);
      const response = await axios.put(endpoint, {
        title,
        description,
        teamId,
      });
      logApiSuccess("updatePrediction", response.data);
      return response.data;
    } catch (error) {
      logApiError("updatePrediction", endpoint, { id, title, teamId }, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Prediction update failed",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

// Partial update of a prediction
export const patchPrediction = createAsyncThunk(
  "predictions/patch",
  async ({ id, title, description, teamId }, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/prediction/edit/{id}`;

    try {
      console.debug(`Partially updating prediction with ID: ${id}`);
      const response = await axios.patch(endpoint, {
        title,
        description,
        teamId,
      });
      logApiSuccess("patchPrediction", response.data);
      return response.data;
    } catch (error) {
      logApiError("patchPrediction", endpoint, { id, title, teamId }, error);
      return rejectWithValue({
        message:
          error.response?.data?.message || "Prediction partial update failed",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

// Delete a prediction
export const deletePrediction = createAsyncThunk(
  "predictions/delete",
  async (id, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/prediction/delete/{id}`;

    try {
      console.debug(`Deleting prediction with ID: ${id}`);
      await axios.delete(endpoint);
      logApiSuccess("deletePrediction", { id });
      return id;
    } catch (error) {
      logApiError("deletePrediction", endpoint, { id }, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Prediction deletion failed",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

// Get all teams for prediction form
export const fetchTeams = createAsyncThunk(
  "predictions/fetchTeams",
  async (_, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/teams`;

    try {
      console.debug("Fetching teams for predictions");
      const response = await axios.get(endpoint);
      logApiSuccess("fetchTeams", response.data);
      return response.data;
    } catch (error) {
      logApiError("fetchTeams", endpoint, null, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch teams",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

// Create a new team
export const createTeam = createAsyncThunk(
  "predictions/createTeam",
  async ({ formData, token }, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/teams`;

    try {
      console.debug("Creating new team with data:", formData);
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      logApiSuccess("createTeam", response.data);
      return response.data;
    } catch (error) {
      logApiError("createTeam", endpoint, formData, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Team creation failed",
        statusCode: error.response?.status || 500,
        errors: error.response?.data?.errors || null,
      });
    }
  }
);

// Get a single team by ID
export const fetchTeamById = createAsyncThunk(
  "predictions/fetchTeamById",
  async (id, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/teams/${id}`;

    try {
      console.debug(`Fetching team with ID: ${id}`);
      const response = await axios.get(endpoint);
      logApiSuccess("fetchTeamById", response.data);
      return response.data;
    } catch (error) {
      logApiError("fetchTeamById", endpoint, { id }, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch team",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

// Get sports for prediction with filtering
export const fetchSportsForPrediction = createAsyncThunk(
  "predictions/fetchSportsForPrediction",
  async (params = {}, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/prediction/get/sports`;
    const {
      PageNumber = 1,
      PageSize = 10,
      SportName,
      Download,
      Search,
    } = params;

    try {
      console.debug("Fetching sports for prediction with params:", params);
      const response = await axios.get(endpoint, {
        params: {
          PageNumber,
          PageSize,
          SportName,
          Download,
          Search,
        },
      });
      logApiSuccess("fetchSportsForPrediction", response.data);
      return response.data;
    } catch (error) {
      logApiError("fetchSportsForPrediction", endpoint, params, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch sports",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

// Get prediction types
export const fetchPredictionTypes = createAsyncThunk(
  "predictions/fetchTypes",
  async (_, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/v1/prediction/types`;

    try {
      console.debug("Fetching prediction types");
      const response = await axios.get(endpoint);
      logApiSuccess("fetchPredictionTypes", response.data);
      return response.data;
    } catch (error) {
      logApiError("fetchPredictionTypes", endpoint, null, error);
      return rejectWithValue({
        message:
          error.response?.data?.message || "Failed to fetch prediction types",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

// Get matches with filtering
export const fetchMatches = createAsyncThunk(
  "predictions/fetchMatches",
  async (params = {}, { rejectWithValue }) => {
    const endpoint = `${BASE_URL}/api/matches`;
    const {
      leagueId,
      pageNumber = 1,
      pageSize = 10,
      download = false,
      startDate,
      endDate,
      matchDate,
    } = params;

    try {
      console.debug("Fetching matches with params:", params);
      const response = await axios.get(endpoint, {
        params: {
          leagueId,
          pageNumber,
          pageSize,
          download,
          startDate,
          endDate,
          matchDate,
        },
      });
      logApiSuccess("fetchMatches", response.data);
      return response.data;
    } catch (error) {
      logApiError("fetchMatches", endpoint, params, error);
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch matches",
        statusCode: error.response?.status || 500,
        errorDetails: error.response?.data?.errors || null,
      });
    }
  }
);

// Initial state
const initialState = {
  predictions: [],
  sports: [],
  matches: [],
  predictionTypes: [],
  teams: [],
  currentPrediction: null,
  stats: {
    total: 0,
    active: 0,
    winning: 0,
    accuracy: 0,
    loading: false,
    error: null,
  },
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const predictionsSlice = createSlice({
  name: "predictions",
  initialState,
  reducers: {
    clearCurrentPrediction: (state) => {
      state.currentPrediction = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearStatsError: (state) => {
      state.stats.error = null;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
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
          total: action.payload.totalCount || 0,
        };
      })
      .addCase(fetchPredictions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch prediction statistics
      .addCase(fetchPredictionStats.pending, (state) => {
        state.stats.loading = true;
        state.stats.error = null;
      })
      .addCase(fetchPredictionStats.fulfilled, (state, action) => {
        state.stats.loading = false;
        state.stats = {
          ...state.stats,
          ...action.payload,
          error: null,
        };
      })
      .addCase(fetchPredictionStats.rejected, (state, action) => {
        state.stats.loading = false;
        state.stats.error = action.payload;
      })

      // Update prediction
      .addCase(updatePrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrediction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.predictions.findIndex(
          (p) => p.id === action.payload.id
        );
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
        const index = state.predictions.findIndex(
          (p) => p.id === action.payload.id
        );
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
        state.predictions = state.predictions.filter(
          (p) => p.id !== action.payload
        );
        state.pagination.total -= 1;
        if (state.currentPrediction?.id === action.payload) {
          state.currentPrediction = null;
        }
      })
      .addCase(deletePrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create team
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.teams.unshift(action.payload);
      })
      .addCase(createTeam.rejected, (state, action) => {
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
      })

      // Fetch team by id
      .addCase(fetchTeamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.loading = false;
        // You might want to store this in a separate state field if needed
        // Currently adding to teams array
        const existingIndex = state.teams.findIndex(
          (t) => t.id === action.payload.id
        );
        if (existingIndex === -1) {
          state.teams.push(action.payload);
        } else {
          state.teams[existingIndex] = action.payload;
        }
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch sports for prediction
      .addCase(fetchSportsForPrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSportsForPrediction.fulfilled, (state, action) => {
        state.loading = false;
        // Store sports data - you might want to add a sports field to your state
        state.sports = action.payload.data || [];
      })
      .addCase(fetchSportsForPrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPredictionTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPredictionTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.predictionTypes = action.payload.data || [];
      })
      .addCase(fetchPredictionTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload.data || [];
        // Update pagination if available in response
        if (action.payload.pagination) {
          state.pagination = {
            ...state.pagination,
            ...action.payload.pagination,
          };
        }
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectPredictions = (state) => state.predictions.predictions;
export const selectCurrentPrediction = (state) =>
  state.predictions.currentPrediction;
export const selectTeams = (state) => state.predictions.teams;
export const selectSports = (state) => state.predictions.sports;
export const selectLoading = (state) => state.predictions.loading;
export const selectError = (state) => state.predictions.error;
export const selectPagination = (state) => state.predictions.pagination;
export const selectPredictionStats = (state) => state.predictions.stats;
export const selectPredictionTypes = (state) => state.predictions.predictionTypes;
export const selectMatches = (state) => state.predictions.matches;

// Actions
export const {
  clearCurrentPrediction,
  clearError,
  clearStatsError,
  setPagination,
} = predictionsSlice.actions;

export default predictionsSlice.reducer;
