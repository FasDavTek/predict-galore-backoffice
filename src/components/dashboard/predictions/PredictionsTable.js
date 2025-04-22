// components/dashboard/predictions/PredictionsTable.js
import React, { useState } from 'react';
import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Typography,
  Pagination,
  Stack,
  Button,
  TextField,
  InputAdornment,
  Skeleton,
  Chip,
  Menu,
  MenuItem,
  FormControl,
  Select,
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon
} from '@mui/icons-material';

import PredictionActions from './PredictionActions';
import PredictionDetail from './PredictionDetail';
import NewPredictionForm from './NewPredictionForm';

/**
 * PredictionsTable - Displays a table of predictions with filtering and actions
 */
const PredictionsTable = ({
  predictions = [],
  loading = false,
  searchQuery = '',
  onSearchChange,
  sportFilter = 'all',
  statusFilter = 'all',
  onSportFilterChange = () => {},
  onStatusFilterChange = () => {},   
  onExportCSV,
  exportLoading = false,
  selectedPrediction,
  onPredictionSelect,
  onBackToList,
  onCreateNew,
  page = 1,
  setPage = () => {}
}) => {
  const PAGE_SIZE = 10;
  const pageCount = Math.ceil(predictions.length / PAGE_SIZE);
  const paginatedPredictions = predictions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false); // Add this state

  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  const handleCreateNew = () => {
    setIsCreatingNew(true);
  };

  const handleCancelCreate = () => {
    setIsCreatingNew(false);
  };

  const handleSubmitNew = (newPrediction) => {
    onCreateNew(newPrediction);
    setIsCreatingNew(false);
  };

  // If creating new or viewing details, show appropriate view
  if (isCreatingNew) {
    return <NewPredictionForm onBack={handleCancelCreate} onSubmit={handleSubmitNew} />;
  }

  // If a prediction is selected, show detailed view instead of table
  if (selectedPrediction) {
    return (
      <Box>
        <Button 
          startIcon={<NavigateBeforeIcon />} 
          onClick={onBackToList}
          sx={{ mb: 2 }}
        >
          Back to Predictions
        </Button>
        <PredictionDetail 
          prediction={selectedPrediction} 
          onBack={onBackToList}
        />
      </Box>
    );
  }

  // Rest of the component remains the same...
  // Helper to get color for status chips
  const getChipColor = (status) => {
    const statusMap = {
      scheduled: 'info',
      active: 'success',
      expired: 'warning',
      cancelled: 'error'
    };
    return statusMap[status?.toLowerCase()] || 'default';
  };

  // Loading skeleton rows
  const renderLoadingSkeletons = () => {
    return Array(PAGE_SIZE).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell padding="checkbox"><Skeleton variant="rectangular" width={20} height={20} /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
      </TableRow>
    ));
  };

  // Empty state display
  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={8} sx={{ border: 'none' }}>
        <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Typography variant="h6" sx={{ color: '#101012', mb: 1 }}>
            {loading ? 'Loading predictions...' : 'No Predictions Found'}
          </Typography>
          <Typography sx={{ color: '#8B8D97' }}>
            {loading ? 'Please wait while we load prediction data' : 'Predictions will appear here once created.'}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );

  return (
    <Box>
      {/* Table toolbar with search and actions */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search predictions..."
            variant="outlined"
            size="small"
            sx={{ width: 300 }}
            value={searchQuery}
            onChange={onSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
          
          {/* Filter Button with Dropdown */}
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterMenuOpen}
          >
            Filter
          </Button>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterMenuClose}
          >
            <MenuItem>
              <FormControl fullWidth size="small">
                <InputLabel>Sport</InputLabel>
                <Select
                  value={sportFilter}
                  label="Sport"
                  onChange={(e) => {
                    onSportFilterChange(e.target.value);
                    handleFilterMenuClose();
                  }}
                >
                  <MenuItem value="all">All Sports</MenuItem>
                  <MenuItem value="football">Football</MenuItem>
                  <MenuItem value="basketball">Basketball</MenuItem>
                  <MenuItem value="tennis">Tennis</MenuItem>
                </Select>
              </FormControl>
            </MenuItem>
            <MenuItem>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => {
                    onStatusFilterChange(e.target.value);
                    handleFilterMenuClose();
                  }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </MenuItem>
          </Menu>
        </Box>
        
       <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            sx={{ 
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            Create New Prediction
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onExportCSV}
            disabled={exportLoading || predictions.length === 0}
          >
            {exportLoading ? 'Exporting...' : 'Export CSV'}
          </Button>
        </Box>
      </Box>

      {/* Main table content */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox disabled={predictions.length === 0} />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Match</TableCell>
              <TableCell>Sport</TableCell>
              <TableCell>Predictions</TableCell>
              <TableCell>Accuracy</TableCell>
              <TableCell>Date Posted</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? renderLoadingSkeletons() : 
             predictions.length > 0 ? paginatedPredictions.map((prediction) => (
                <TableRow 
                  key={prediction.id} 
                  hover 
                  sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  selected={selectedPrediction?.id === prediction.id}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedPrediction?.id === prediction.id}
                      onChange={() => onPredictionSelect(prediction)}
                    />
                  </TableCell>
                  <TableCell>#{prediction.id}</TableCell>
                  <TableCell>{prediction.match}</TableCell>
                  <TableCell>
                    <Chip 
                      label={prediction.sport} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{prediction.predictions}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`${prediction.accuracy}%`} 
                      color={prediction.accuracy === 100 ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(prediction.datePosted).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={prediction.status} 
                      color={getChipColor(prediction.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <PredictionActions 
                      prediction={prediction} 
                      onViewDetails={() => onPredictionSelect(prediction)}
                    />
                  </TableCell>
                </TableRow>
              )) : renderEmptyState()}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination controls */}
      {predictions.length > 0 && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, predictions.length)} of {predictions.length} predictions
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeIcon />}
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Previous
            </Button>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
              shape="rounded"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            />
            <Button
              variant="outlined"
              endIcon={<NavigateNextIcon />}
              disabled={page === pageCount}
              onClick={() => setPage(p => p + 1)}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Next
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default PredictionsTable;