import { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetPredictionsQuery,
  useDeletePredictionMutation,
  useCancelPredictionMutation,
  useExportPredictionsMutation,
} from '../api/predictionApi';
import {
  setFilters,
  clearFilters,
  togglePredictionSelection,
  clearSelectedPredictions,
  setSelectedPredictionIds,
  selectCurrentFilters,
  selectSelectedPredictionIds,
} from '../slices/predictionSlice';
import { Prediction, PredictionsFilter } from '../types/prediction.types';

export const usePredictions = () => {
  const dispatch = useDispatch();
  const currentFilters = useSelector(selectCurrentFilters);
  const selectedPredictionIds = useSelector(selectSelectedPredictionIds);

  const [localSearch, setLocalSearch] = useState(currentFilters.search || '');

  // RTK Query hooks
  const {
    data: predictionsResponse,
    isLoading,
    error,
    refetch: refetchPredictions,
  } = useGetPredictionsQuery(currentFilters);

  const [deletePrediction] = useDeletePredictionMutation();
  const [cancelPrediction] = useCancelPredictionMutation();
  const [exportPredictions, { isLoading: isExporting }] = useExportPredictionsMutation();

  // Memoized data
  const predictions = useMemo(() => 
    predictionsResponse?.data?.resultItems || [], 
    [predictionsResponse]
  );

  const pagination = useMemo(() => 
    predictionsResponse?.data ? {
      page: predictionsResponse.data.page,
      limit: predictionsResponse.data.pageSize,
      total: predictionsResponse.data.total,
      totalPages: Math.ceil(predictionsResponse.data.total / predictionsResponse.data.pageSize),
    } : null,
    [predictionsResponse]
  );

  // Handlers
  const handleSearchChange = useCallback((search: string) => {
    setLocalSearch(search);
    dispatch(setFilters({ search, page: 1 }));
  }, [dispatch]);

  const handleFilterChange = useCallback((newFilters: Partial<PredictionsFilter>) => {
    dispatch(setFilters({ ...newFilters, page: 1 }));
  }, [dispatch]);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    setLocalSearch('');
  }, [dispatch]);

  const handlePageChange = useCallback((page: number) => {
    dispatch(setFilters({ page }));
  }, [dispatch]);

  const handleDeletePrediction = useCallback(async (predictionId: string): Promise<boolean> => {
    try {
      await deletePrediction(predictionId).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to delete prediction:', error);
      return false;
    }
  }, [deletePrediction]);

  const handleCancelPrediction = useCallback(async (predictionId: string): Promise<boolean> => {
    try {
      await cancelPrediction(predictionId).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to cancel prediction:', error);
      return false;
    }
  }, [cancelPrediction]);

  const handleExportPredictions = useCallback(async () => {
    try {
      const blob = await exportPredictions(currentFilters).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `predictions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Failed to export predictions:', error);
      return false;
    }
  }, [exportPredictions, currentFilters]);

  const handleToggleSelection = useCallback((predictionId: string) => {
    dispatch(togglePredictionSelection(predictionId));
  }, [dispatch]);

  const handleSelectAll = useCallback((predictionsToSelect: Prediction[]) => {
    const predictionIds = predictionsToSelect.map(p => p.id);
    dispatch(setSelectedPredictionIds(predictionIds));
  }, [dispatch]);

  const handleClearAllSelection = useCallback(() => {
    dispatch(clearSelectedPredictions());
  }, [dispatch]);

  return {
    // Data
    predictions,
    pagination,
    isLoading,
    error,
    currentFilters,
    localSearch,
    selectedPredictionIds,

    // Handlers
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleDeletePrediction,
    handleCancelPrediction,
    handleExportPredictions,
    handleToggleSelection,
    handleSelectAll,
    handleClearAllSelection,
    refetchPredictions,

    // States
    isExporting,
  };
};