import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Prediction, PredictionsFilter } from '../types/prediction.types';
import { RootState } from '@/store/store'; // Import your RootState

interface PredictionsState {
  selectedPrediction: Prediction | null;
  currentFilters: PredictionsFilter;
  selectedPredictionIds: string[];
  bulkAction: string | null;
}

const initialState: PredictionsState = {
  selectedPrediction: null,
  currentFilters: {
    page: 1,
    limit: 10,
  },
  selectedPredictionIds: [],
  bulkAction: null,
};

const predictionsSlice = createSlice({
  name: 'predictions',
  initialState,
  reducers: {
    setSelectedPrediction: (state, action: PayloadAction<Prediction | null>) => {
      state.selectedPrediction = action.payload;
    },
    clearSelectedPrediction: (state) => {
      state.selectedPrediction = null;
    },
    setFilters: (state, action: PayloadAction<Partial<PredictionsFilter>>) => {
      state.currentFilters = { ...state.currentFilters, ...action.payload };
    },
    clearFilters: (state) => {
      state.currentFilters = { page: 1, limit: 10 };
    },
    setSelectedPredictionIds: (state, action: PayloadAction<string[]>) => {
      state.selectedPredictionIds = action.payload;
    },
    togglePredictionSelection: (state, action: PayloadAction<string>) => {
      const predictionId = action.payload;
      const index = state.selectedPredictionIds.indexOf(predictionId);
      
      if (index === -1) {
        state.selectedPredictionIds.push(predictionId);
      } else {
        state.selectedPredictionIds.splice(index, 1);
      }
    },
    clearSelectedPredictions: (state) => {
      state.selectedPredictionIds = [];
    },
    setBulkAction: (state, action: PayloadAction<string | null>) => {
      state.bulkAction = action.payload;
    },
  },
});

export const {
  setSelectedPrediction,
  clearSelectedPrediction,
  setFilters,
  clearFilters,
  setSelectedPredictionIds,
  togglePredictionSelection,
  clearSelectedPredictions,
  setBulkAction,
} = predictionsSlice.actions;

// Updated selectors with proper RootState typing and fallbacks
export const selectSelectedPrediction = (state: RootState) => 
  state.predictions?.selectedPrediction ?? null;

export const selectCurrentFilters = (state: RootState) => 
  state.predictions?.currentFilters ?? { page: 1, limit: 10 };

export const selectSelectedPredictionIds = (state: RootState) => 
  state.predictions?.selectedPredictionIds ?? [];

export const selectBulkAction = (state: RootState) => 
  state.predictions?.bulkAction ?? null;

export const predictionsReducer = predictionsSlice.reducer;