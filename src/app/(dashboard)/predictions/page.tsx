// src/app/(dashboard)/predictions/page.tsx
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
import { PredictionAnalytics } from "./features/components/PredictionAnalytics";
import { PredictionForm } from "./features/components/PredictionForm";
import PredictionsPageHeader, { TimeRange } from "./features/components/PredictionsPageHeader";
import { PredictionsPageLoadingSkeleton } from "./features/components/PredictionsPageLoadingSkeleton";

// Global State Components
import { ErrorState } from "@/shared/components/ErrorState";

// Hooks
import { usePredictions } from "./features/hooks/usePredictions";

// Types
import { Prediction } from "./features/types/prediction.types";

// Auth
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import withAuth from "@/hoc/withAuth";

function PredictionsPage() {
  const [showPredictionForm, setShowPredictionForm] = useState(false);
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
  const [globalTimeRange, setGlobalTimeRange] = useState<TimeRange>("default");

  // Refresh trigger state
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
    handleSelectAll,
    handleClearAllSelection,
    refetchPredictions,
    isExporting,
  } = usePredictions();

  // Memoize selected predictions for performance
  const selectedPredictionsData = useMemo(() => {
    return predictions.filter((prediction) =>
      selectedPredictionIds.includes(prediction.id)
    );
  }, [predictions, selectedPredictionIds]);

  // If handleRemoveFromSelection doesn't exist in your hook, create it locally
  const handleRemoveFromSelection = (predictionId: string) => {
    // This is the same as toggling selection - remove if selected
    if (selectedPredictionIds.includes(predictionId)) {
      handleToggleSelection(predictionId);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Clear selections when refreshing
    handleClearAllSelection();
    // Increment refresh trigger to force all components to refetch
    setRefreshTrigger((prev) => prev + 1);

    // Refetch predictions data
    refetchPredictions();

    // Set a timeout to hide the loading skeleton after a minimum duration
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handlePredictionSelect = (prediction: Prediction) => {
    // Handle prediction selection if needed
    console.log('Selected prediction:', prediction);
  };

  const handlePredictionEdit = (prediction: Prediction) => {
    // Handle prediction edit
    console.log('Edit prediction:', prediction);
    showSnackbar(`Edit prediction ${prediction.name}`, "success");
  };

  const handlePredictionDelete = async (prediction: Prediction): Promise<void> => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${prediction.name}"?`
    );
    if (!confirmed) return;

    const success = await handleDeletePrediction(prediction.id);
    if (success) {
      showSnackbar("Prediction deleted successfully", "success");
      // Trigger refresh after successful deletion
      handleRefresh();
    } else {
      showSnackbar("Failed to delete prediction", "error");
    }
  };

  const handlePredictionCancel = async (prediction: Prediction): Promise<void> => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel "${prediction.name}"?`
    );
    if (!confirmed) return;

    const success = await handleCancelPrediction(prediction.id);
    if (success) {
      showSnackbar("Prediction cancelled successfully", "success");
      // Trigger refresh after successful cancellation
      handleRefresh();
    } else {
      showSnackbar("Failed to cancel prediction", "error");
    }
  };

  const handleAddPrediction = () => {
    setShowPredictionForm(true);
  };

  const handleFormSuccess = () => {
    setShowPredictionForm(false);
    showSnackbar("Prediction created successfully", "success");
    // Trigger refresh after successful form submission
    handleRefresh();
  };

  const handleFormCancel = () => {
    setShowPredictionForm(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const hasError = !!error;

  // Show Prediction Form as main component
  if (showPredictionForm) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <PredictionForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </Container>
    );
  }

  // Show loading skeleton for initial page load or during refresh
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

  // Show error state if there's an API error
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
      {/* Header  */}
      <PredictionsPageHeader
        title="Predictions Management"
        timeRange={globalTimeRange}
        onTimeRangeChange={setGlobalTimeRange}
        onRefresh={handleRefresh}
        user={user}
      />

      {/* Analytics - Pass refresh trigger  */}
      <PredictionAnalytics refreshTrigger={refreshTrigger} />

      {/* Consolidated PredictionsTable Component */}
      <PredictionsTable
        // Data
        predictions={predictions}
        pagination={pagination || undefined} // Handle null case
        isLoading={isLoading}
        hasError={hasError}
        
        // Filters
        currentFilters={currentFilters}
        localSearch={localSearch}
        
        // Selection
        selectedPredictions={selectedPredictionsData}
        selectedPredictionIds={selectedPredictionIds}
        
        // Handlers
        onPredictionSelect={handlePredictionSelect}
        onPredictionEdit={handlePredictionEdit}
        onPredictionDelete={handlePredictionDelete}
        onPredictionCancel={handlePredictionCancel}
        onAddPrediction={handleAddPrediction}
        onExportPredictions={handleExportPredictions}
        onRefresh={handleRefresh}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onPageChange={handlePageChange}
        onToggleSelection={handleToggleSelection}
        onSelectAll={handleSelectAll}
        onClearAllSelection={handleClearAllSelection}
        onRemoveFromSelection={handleRemoveFromSelection}
        
        // States
        isExporting={isExporting}
        isRefreshing={isRefreshing}
      />

      {/* Prediction Form Dialog */}
      <Dialog
        open={showPredictionForm}
        onClose={handleFormCancel}
        maxWidth="md"
        fullWidth
      >
        <PredictionForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
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
}

export default withAuth(PredictionsPage);