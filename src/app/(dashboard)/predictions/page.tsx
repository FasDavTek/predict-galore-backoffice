"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Dialog,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";

// Components
import { PredictionsTable } from "./features/components/PredictionsTable";
import { PredictionFilters } from "./features/components/PredictionFilters";
import { PredictionAnalytics } from "./features/components/PredictionAnalytics";
import { PredictionForm } from "./features/components/PredictionForm";
import { PredictionsPagination } from "./features/components/PredictionsPagination";
import { PredictionsToolbar } from "./features/components/PredictionsToolbar";
import { SelectedPredictionPreview } from "./features/components/SelectedPredictionPreview";
import { PredictionsPageLoadingSkeleton } from './features/components/PredictionsPageLoadingSkeleton';
import PredictionsPageHeader, { TimeRange } from "./features/components/PredictionsPageHeader";

// Global State Components
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";

// Hooks
import { usePredictions } from "@/app/(dashboard)/predictions/features/hooks/usePredictions";
import { usePredictionForm } from "@/app/(dashboard)/predictions/features/hooks/usePredictionForm";

// Types
import { Prediction } from "@/app/(dashboard)/predictions/features/types/prediction.types";

// Auth state selectors
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";

const PredictionsPage: React.FC = () => {
  const [isPredictionFormOpen, setIsPredictionFormOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Global time range state for predictions page
  const [globalTimeRange, setGlobalTimeRange] = useState<TimeRange>('default');
  
  // Refresh trigger state - EXACTLY like users page
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redux auth state
  const user = useSelector((state: RootState) => state.auth.user);

  const {
    predictions,
    pagination,
    isLoading,
    error,
    currentFilters,
    localSearch,
    selectedPredictionIds,
    handleSearchChange,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleDeletePrediction,
    handleCancelPrediction,
    handleExportPredictions,
    handleToggleSelection,
    handleClearAllSelection,
    refetchPredictions,
    isExporting,
  } = usePredictions();

  const { handleSubmit, isLoading: isSubmitting } = usePredictionForm({
    prediction: selectedPrediction,
    onSuccess: () => {
      setIsPredictionFormOpen(false);
      setSelectedPrediction(null);
      showSnackbar("Prediction saved successfully", "success");
      // Trigger refresh after successful form submission - EXACTLY like users page
      handleRefresh();
    },
    onError: (error) => {
      showSnackbar(error, "error");
    },
  });

  // Memoize selected predictions for performance
  const selectedPredictionsData = useMemo(() => {
    return predictions.filter(prediction => 
      selectedPredictionIds.includes(prediction.id)
    );
  }, [predictions, selectedPredictionIds]);

  // Handle refresh button click - EXACTLY like users page
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Clear selections when refreshing
    handleClearAllSelection();
    setSelectedPrediction(null);
    // Increment refresh trigger to force all components to refetch
    setRefreshTrigger(prev => prev + 1);
    
    // Refetch predictions data
    refetchPredictions();
    
    // Set a timeout to hide the loading skeleton after a minimum duration
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000); // Minimum 1 second loading state for better UX
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handlePredictionSelect = (prediction: Prediction) => {
    setSelectedPrediction(prediction);
  };

  const handlePredictionEdit = (prediction: Prediction) => {
    setSelectedPrediction(prediction);
    setIsPredictionFormOpen(true);
  };

  const handlePredictionDelete = async (prediction: Prediction) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${prediction.name}"?`
    );
    if (!confirmed) return;

    const success = await handleDeletePrediction(prediction.id);
    if (success) {
      showSnackbar("Prediction deleted successfully", "success");
      // Trigger refresh after successful deletion - EXACTLY like users page
      handleRefresh();
    } else {
      showSnackbar("Failed to delete prediction", "error");
    }
  };

  const handlePredictionCancel = async (prediction: Prediction) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel "${prediction.name}"?`
    );
    if (!confirmed) return;

    const success = await handleCancelPrediction(prediction.id);
    if (success) {
      showSnackbar("Prediction cancelled successfully", "success");
      // Trigger refresh after successful cancellation - EXACTLY like users page
      handleRefresh();
    } else {
      showSnackbar("Failed to cancel prediction", "error");
    }
  };

  const handleAddPrediction = () => {
    setSelectedPrediction(null);
    setIsPredictionFormOpen(true);
  };

  const handleClosePredictionForm = () => {
    setIsPredictionFormOpen(false);
    setSelectedPrediction(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const hasError = !!error;

  // Show loading skeleton for initial page load or during refresh - EXACTLY like users page
  if ((isLoading && predictions.length === 0) || isRefreshing) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={250} height={48} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={350} height={24} />
        </Box>
        
        <PredictionsPageLoadingSkeleton />
      </Container>
    );
  }

  // Show error state if there's an API error - EXACTLY like users page
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <ErrorState
          variant="api"
          title="Failed to Load Predictions"
          message="We encountered an error while loading prediction data. Please try again."
          retryAction={{
            onClick: handleRefresh,
            label: "Retry Loading",
          }}
          height={400}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header - EXACTLY like users page */}
      <PredictionsPageHeader 
        title="Predictions Management"
        timeRange={globalTimeRange}
        onTimeRangeChange={setGlobalTimeRange}
        onRefresh={handleRefresh}
        user={user}
      />

      {/* Analytics - Pass refresh trigger like users page */}
      <PredictionAnalytics refreshTrigger={refreshTrigger} />

      {/* Selected Predictions Preview */}
      <SelectedPredictionPreview
        selectedPredictions={selectedPredictionsData}
        onPredictionSelect={handlePredictionSelect}
        onPredictionEdit={handlePredictionEdit}
        onPredictionDelete={handlePredictionDelete}
        onPredictionCancel={handlePredictionCancel}
        onClearSelection={handleClearAllSelection}
        onRemovePrediction={handleToggleSelection}
      />

      <Box className="flex flex-col gap-3">
        {/* Filters and Toolbar */}
        <Box className="flex flex-row justify-between">
          {/* Filters */}
          <PredictionFilters
            searchTerm={localSearch}
            statusFilter={currentFilters.status}
            typeFilter={currentFilters.type}
            accuracyFilter={currentFilters.accuracy}
            onSearchChange={handleSearchChange}
            onStatusChange={(status) => handleFilterChange({ status })}
            onTypeChange={(type) => handleFilterChange({ type })}
            onAccuracyChange={(accuracy) => handleFilterChange({ accuracy })}
            onClearFilters={handleClearFilters}
          />

          {/* Toolbar - Use handleRefresh like users page */}
          <PredictionsToolbar
            selectedCount={selectedPredictionIds.length}
            onAddPrediction={handleAddPrediction}
            onExportPredictions={handleExportPredictions}
            onRefresh={handleRefresh}
            isExporting={isExporting}
            isLoading={isLoading}
          />
        </Box>

        {/* Content Area */}
        {predictions.length === 0 && !isLoading ? (
          <EmptyState
            variant={
              localSearch ||
              currentFilters.status ||
              currentFilters.type ||
              currentFilters.accuracy
                ? "search"
                : "data"
            }
            title={
              localSearch ||
              currentFilters.status ||
              currentFilters.type ||
              currentFilters.accuracy
                ? "No Predictions Found"
                : "No Predictions Yet"
            }
            description={
              localSearch ||
              currentFilters.status ||
              currentFilters.type ||
              currentFilters.accuracy
                ? "Try adjusting your search criteria or filters to find what you're looking for."
                : "Get started by creating your first prediction."
            }
            primaryAction={{
              label: "Create Prediction",
              onClick: handleAddPrediction,
            }}
            secondaryAction={
              localSearch ||
              currentFilters.status ||
              currentFilters.type ||
              currentFilters.accuracy
                ? {
                    label: "Clear Filters",
                    onClick: handleClearFilters,
                  }
                : undefined
            }
            height={300}
          />
        ) : (
          <>
            {/* Predictions Table */}
            <PredictionsTable
              predictions={predictions}
              selectedPredictionIds={selectedPredictionIds}
              onPredictionSelect={handlePredictionSelect}
              onPredictionEdit={handlePredictionEdit}
              onPredictionDelete={handlePredictionDelete}
              onPredictionCancel={handlePredictionCancel}
              onToggleSelection={handleToggleSelection}
              isLoading={isLoading}
              hasError={hasError}
              onRetry={handleRefresh} // Use handleRefresh for retry
            />

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <PredictionsPagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </Box>

      {/* Add/Edit Prediction Dialog */}
      <Dialog
        open={isPredictionFormOpen}
        onClose={handleClosePredictionForm}
        maxWidth="md"
        fullWidth
      >
        <PredictionForm
          prediction={selectedPrediction}
          onSubmit={handleSubmit}
          onCancel={handleClosePredictionForm}
          isLoading={isSubmitting}
        />
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PredictionsPage;