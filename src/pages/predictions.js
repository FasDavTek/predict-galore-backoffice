// pages/predictions.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { ErrorBoundary } from "react-error-boundary";
import { Box, Snackbar, Alert } from "@mui/material";

// Component imports
import DashboardSkeleton from "@/components/common/DashboardSkeleton";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Header } from "@/components/predictions/Header";
import PredictionStat from "@/components/predictions/PredictionStat";
import PredictionsTable from "@/components/predictions/PredictionsTable";
import PredictionDetail from "@/components/predictions/PredictionDetail";
import NewPredictionForm from "@/components/predictions/NewPredictionForm";

// Redux imports
import {
  createPrediction,
  fetchPrediction,
  fetchPredictions,
  updatePrediction,
  deletePrediction,
  fetchTeams,
  selectPredictions,
  selectCurrentPrediction,
  selectTeams,
  selectLoading,
  selectError,
  selectPagination,
  selectPredictionStats,
  clearError,
  clearCurrentPrediction,
  setPagination,
} from "@/store/slices/predictionSlice";

import {
  selectIsAuthenticated,
  selectAuthStatus,
} from "@/store/slices/authSlice";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

/**
 * Error boundary fallback component
 * Displays error message when component tree fails
 */
const ErrorFallback = ({ error }) => {
  return (
    <div className="p-4 bg-red-50 text-red-600">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
};

/**
 * Main Predictions Page Component
 * Handles displaying and managing sports predictions
 */
const PredictionsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  // console.log("Is Authenticated?", isAuthenticated);



  const predictions = useSelector(selectPredictions);
  const currentPrediction = useSelector(selectCurrentPrediction);
  const teams = useSelector(selectTeams);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const pagination = useSelector(selectPagination);
  const statsData = useSelector(selectPredictionStats);

  // Local component state
  const [viewMode, setViewMode] = useState("list");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [filters, setFilters] = useState({
    search: "",
    team: "",
    startDate: null,
    endDate: null,
  });

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };


  /**
   * Fetch predictions data on mount and when filters or pagination changes
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...filters,
        };

        await dispatch(fetchPredictions(params));
      } catch (error) {
        showNotification("Failed to load predictions", "error");
      }
    };

    fetchData();
  }, [dispatch, pagination.page, pagination.limit, filters]);

  /**
   * Fetch teams data if not already loaded
   */
  useEffect(() => {
    if (teams.length === 0) {
      dispatch(fetchTeams());
    }
  }, [dispatch, teams]);

  /**
   * Handle API error notifications
   */
  useEffect(() => {
    if (error) {
      showNotification(error.message || "An error occurred", "error");
      dispatch(clearError());
    }
  }, [error, dispatch]);


  // Event handlers
  const handlePredictionSelect = async (id) => {
    try {
      await dispatch(fetchPrediction(id)).unwrap();
      setViewMode("detail");
    } catch (error) {
      showNotification("Failed to load prediction details", "error");
    }
  };

  const handleCreateNew = async (predictionData) => {
    try {
      await dispatch(createPrediction(predictionData)).unwrap();
      showNotification("Prediction created successfully", "success");
      setViewMode("list");
    } catch (error) {
      showNotification("Failed to create prediction", "error");
    }
  };

  const handleUpdatePrediction = async ({ id, ...data }) => {
    try {
      await dispatch(updatePrediction({ id, ...data })).unwrap();
      showNotification("Prediction updated successfully", "success");
      setViewMode("list");
    } catch (error) {
      showNotification("Failed to update prediction", "error");
    }
  };

  const handleDeletePrediction = async (id) => {
    try {
      await dispatch(deletePrediction(id)).unwrap();
      showNotification("Prediction deleted successfully", "success");
      setViewMode("list");
    } catch (error) {
      showNotification("Failed to delete prediction", "error");
    }
  };

  const handleBackToList = () => {
    dispatch(clearCurrentPrediction());
    setViewMode("list");
  };

  const handleNewPredictionClick = () => {
    setViewMode("create");
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    dispatch(setPagination({ ...pagination, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setPagination({ ...pagination, page: newPage }));
  };

  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Prediction stats data
  const stats = [
    {
      title: "Total Predictions",
      value: statsData?.total?.toString() || "0",
      change: "+24.5",
    },
    {
      title: "Active Predictions",
      value: statsData?.active?.toString() || "0",
      change: "+8.3",
    },
    { title: "Winning Predictions", value: "1,284", change: "+15.2" },
    { title: "Accuracy Rate", value: "72.4%", change: "+3.8" },
  ];

  // Only render the actual page content if authenticated

    return (
       <ProtectedRoute>
      <DashboardLayout>
        {isAuthenticated && (
          <>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {/* Page header with title and action button */}
          <Header
            title="Predictions"
            subtitle="Manage and analyze sports predictions"
            onNewPrediction={handleNewPredictionClick}
          />

          {/* Main content area with conditional rendering based on view mode */}
          {viewMode === "list" && (
            <>
              {/* Stats cards row */}
              <Box
                sx={{
                  mb: 4,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(4, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {stats.map((stat, index) => (
                  <PredictionStat key={index} {...stat} />
                ))}
              </Box>

              {/* Predictions table with filtering and pagination */}
              <PredictionsTable
                predictions={predictions}
                loading={loading}
                pagination={pagination}
                filters={filters}
                onFilterChange={handleFilterChange}
                onPageChange={handlePageChange}
                onPredictionSelect={handlePredictionSelect}
                onNewPredictionClick={handleNewPredictionClick}
              />
            </>
          )}

          {/* Prediction detail view */}
          {viewMode === "detail" && currentPrediction && (
            <PredictionDetail
              prediction={currentPrediction}
              onBack={handleBackToList}
              onUpdate={handleUpdatePrediction}
              onDelete={handleDeletePrediction}
            />
          )}

          {/* New prediction form view */}
          {viewMode === "create" && (
            <NewPredictionForm
              teams={teams}
              onBack={handleBackToList}
              onSubmit={handleCreateNew}
            />
          )}

          {/* Global notification snackbar */}
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={handleNotificationClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleNotificationClose}
              severity={notification.severity}
              sx={{ width: "100%" }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </ErrorBoundary>
         </>
        )}
      </DashboardLayout>

</ProtectedRoute>
  );
};

export default PredictionsPage;
