// pages/predictions.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Snackbar, Alert } from '@mui/material';
import { SportsSoccer as PredictionsIcon } from '@mui/icons-material';

// Component imports
import DashboardLayout from '@/layouts/DashboardLayout';
import { Header } from '@/components/predictions/Header';
import PredictionStat from '@/components/predictions/PredictionStat';
import PredictionsTable from '@/components/predictions/PredictionsTable';
import PredictionDetail from '@/components/predictions/PredictionDetail';
import NewPredictionForm from '@/components/predictions/NewPredictionForm';

// Redux imports
import {
  fetchPredictionsStats,
  fetchPredictionsList,
  exportPredictionsCSV,
  createPrediction,
  updatePrediction,
  cancelPrediction,
  resolvePrediction,
  setTimeRange,
  setSearchQuery,
  setSportFilter,
  setStatusFilter,
  selectPredictionsStats,
  selectPredictionsList,
  selectFilteredPredictions,
  selectPredictionsLoading,
  selectTimeRange,
  selectSearchQuery,
  selectSportFilter,
  selectStatusFilter,
} from '@/store/slices/predictionSlice';

/**
 * Error boundary fallback component
 */
function ErrorFallback({ error }) {
  return (
    <div className="p-4 bg-red-50 text-red-600">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

/**
 * PredictionsPage - Main component for predictions dashboard
 */
const PredictionsPage = () => {
  const dispatch = useDispatch();
  
  // Select data from Redux store
  const stats = useSelector(selectPredictionsStats);
  const predictions = useSelector(selectPredictionsList);
  const loading = useSelector(selectPredictionsLoading);
  const timeRange = useSelector(selectTimeRange);
  const searchQuery = useSelector(selectSearchQuery);
  const sportFilter = useSelector(selectSportFilter);
  const statusFilter = useSelector(selectStatusFilter);
  
  // Local state for selected prediction and notifications
  const [viewMode, setViewMode] = useState('list'); // 'list', 'detail', or 'create'
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch data on mount and when filters change
  useEffect(() => {
    dispatch(fetchPredictionsStats());
    dispatch(fetchPredictionsList({ searchQuery, timeRange }));
  }, [dispatch, searchQuery, timeRange]);

  // Handler for time range filter change
  const handleTimeRangeChange = (range) => {
    dispatch(setTimeRange(range));
  };

  // Handler for search input changes
  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSportFilterChange = (sport) => {
    dispatch(setSportFilter(sport));
  };

  const handleStatusFilterChange = (status) => {
    dispatch(setStatusFilter(status));
  };

  // Handler for CSV export with loading state
  const handleExportCSV = async () => {
    try {
      await dispatch(exportPredictionsCSV());
      showNotification('Export started successfully', 'success');
    } catch (error) {
      showNotification('Export failed', 'error');
    }
  };


  // Handler for creating new prediction
  const handleCreateNew = async (newPrediction) => {
    try {
      await dispatch(createPrediction(newPrediction));
      showNotification('Prediction created successfully', 'success');
      setViewMode('list');
    } catch (error) {
      showNotification('Failed to create prediction', 'error');
    }
  };

  const handlePredictionSelect = (prediction) => {
    setSelectedPrediction(prediction);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
  };

  const handleNewPredictionClick = () => {
    setViewMode('create');
  };

  // Handler for closing notifications
  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Helper to show notifications
  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };


  return (
    <DashboardLayout>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {/* Page Header with title and time range selector */}
        <Header
          title="Predictions"
          subtitle="Manage and analyze sports predictions"
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />

     {/* Stats cards section - only shown when viewing list */}
     {viewMode === 'list' && (
          <Box sx={{ mb: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {stats.map((card, index) => (
              <PredictionStat
                key={index}
                title={card.title}
                value={card.value}
                change={card.change}
              />
            ))}
          </Box>
        )}


        {/* Main predictions table */}
        <Box sx={{ width: '100%' }}>
           {viewMode === 'list' && (
            <PredictionsTable
              predictions={predictions}
              loading={loading.predictions}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              sportFilter={sportFilter}
              statusFilter={statusFilter}
              onSportFilterChange={handleSportFilterChange}
              onStatusFilterChange={handleStatusFilterChange}
              onExportCSV={handleExportCSV}
              exportLoading={loading.export}
              onPredictionSelect={handlePredictionSelect}
              onNewPredictionClick={handleNewPredictionClick}
            />
          )}


{viewMode === 'detail' && selectedPrediction && (
            <PredictionDetail 
              prediction={selectedPrediction} 
              onBack={handleBackToList}
            />
          )}

          {viewMode === 'create' && (
            <NewPredictionForm 
              onBack={handleBackToList}
              onSubmit={handleCreateNew}
            />
          )}
        </Box>

        {/* Global notification system */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleNotificationClose}
        >
          <Alert 
            onClose={handleNotificationClose} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default PredictionsPage;