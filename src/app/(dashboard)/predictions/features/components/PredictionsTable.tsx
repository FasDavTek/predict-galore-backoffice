/**
 * Predictions Table Component
 * Updated to match backend data structure
 */

'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Chip,
  Pagination,
  Stack,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  MenuItem as SelectMenuItem,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import {
  TableErrorState,
  TableEmptyState,
  TableLoadingState,
} from '@/shared/components/TableStates';
import { Prediction, PredictionsFilter, PredictionStatus } from '@/features/predictions';
import { PaginationMeta } from '@/shared/types/common.types';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { SelectedPredictionProfile } from './SelectedPredictionProfile';
import { useTableExport } from '@/shared/hooks/useTableExport';

interface PredictionsTableProps {
  predictions: Prediction[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: Error | null;
  filters: PredictionsFilter;
  onFilterChange: (filters: Partial<PredictionsFilter>) => void;
  onAddPrediction: () => void;
  onEditPrediction: (prediction: Prediction) => void;
  onDeletePrediction: (prediction: Prediction) => void;
  onRefresh: () => void;
  selectedPrediction?: Prediction | null;
  onPredictionSelect?: (prediction: Prediction | null) => void;
}

interface PredictionRowProps {
  prediction: Prediction;
  isSelected: boolean;
  onSelect: (predictionId: number, prediction: Prediction) => void;
  onViewDetails: (predictionId: number) => void;
  onEdit: (prediction: Prediction) => void;
  onDelete: (prediction: Prediction) => void;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => 'default' | 'primary' | 'success' | 'warning' | 'error';
}

const PredictionRow = memo(function PredictionRow({
  prediction,
  isSelected,
  onSelect,
  onViewDetails,
  onEdit,
  onDelete,
  formatDate,
  getStatusColor,
}: PredictionRowProps) {
  return (
    <TableRow
      hover
      onClick={() => onSelect(prediction.id, prediction)}
      sx={{
        cursor: 'pointer',
        bgcolor: isSelected ? 'action.selected' : 'transparent',
        '&:hover': {
          bgcolor: isSelected ? 'action.selected' : 'action.hover',
        },
      }}
    >
      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onChange={() => onSelect(prediction.id, prediction)}
        />
      </TableCell>
      <TableCell>{prediction.id}</TableCell>
      <TableCell>{prediction.match}</TableCell>
      <TableCell>{prediction.picksCount}</TableCell>
      <TableCell>{prediction.accuracy}%</TableCell>
      <TableCell>{formatDate(prediction.datePostedUtc)}</TableCell>
      <TableCell>
        <Chip
          label={prediction.status.charAt(0).toUpperCase() + prediction.status.slice(1)}
          size="small"
          color={getStatusColor(prediction.status)}
        />
      </TableCell>
      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(prediction.id);
            }}
          >
            View Details
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(prediction);
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            variant="text"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(prediction);
            }}
          >
            Delete
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
});

export const PredictionsTable = memo(function PredictionsTable({
  predictions,
  pagination,
  isLoading,
  error,
  filters,
  onFilterChange,
  onAddPrediction,
  onEditPrediction,
  onDeletePrediction,
  onRefresh,
  selectedPrediction,
  onPredictionSelect,
}: PredictionsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState(filters.search || '');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  
  // Debounce search input
  const debouncedSearch = useDebounce(search, 300);
  
  // Sync selectedIds with selectedPrediction (single-select)
  useEffect(() => {
    if (selectedPrediction) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Syncing derived state from props
      setSelectedIds(new Set([selectedPrediction.id]));
    } else {
      setSelectedIds(new Set());
    }
  }, [selectedPrediction]);
  
  // Update filters when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ search: debouncedSearch || undefined, page: 1 });
    }
  }, [debouncedSearch, filters.search, onFilterChange]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleSelectOne = useCallback((predictionId: number, prediction: Prediction) => {
    // Single-select: if clicking the same item, deselect it; otherwise select the new one
    if (selectedPrediction?.id === predictionId) {
      // Deselect if clicking the already selected item
      setSelectedIds(new Set());
      setTimeout(() => onPredictionSelect?.(null), 0);
    } else {
      // Select the new item (only one at a time)
      setSelectedIds(new Set([predictionId]));
      setTimeout(() => onPredictionSelect?.(prediction), 0);
    }
  }, [selectedPrediction, onPredictionSelect]);

  const handleViewDetails = useCallback((predictionId: number) => {
    router.push(`/predictions/${predictionId}`);
  }, [router]);

  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    onFilterChange({ page });
  }, [onFilterChange]);

  const getStatusColor = useCallback((status: string): 'default' | 'primary' | 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'active':
        return 'success';
      case 'expired':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  }, []);

  const handleFilterChange = useCallback((key: keyof PredictionsFilter, value: string | undefined) => {
    onFilterChange({ [key]: value || undefined, page: 1 });
  }, [onFilterChange]);

  const handleClearFilters = useCallback(() => {
    setSearch('');
    onFilterChange({ search: undefined, status: undefined, page: 1 });
  }, [onFilterChange]);

  // CSV Export hook
  const { handleExport, canExport } = useTableExport({
    data: predictions,
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'match', label: 'Match' },
      { key: 'picksCount', label: 'Picks Count' },
      { key: 'accuracy', label: 'Accuracy', format: (value) => `${value}%` },
      { key: 'datePostedUtc', label: 'Date Posted', format: (value) => formatDate(String(value)) },
      { key: 'status', label: 'Status', format: (value) => String(value).charAt(0).toUpperCase() + String(value).slice(1) },
    ],
    filename: `predictions-${new Date().toISOString().split('T')[0]}`,
  });

  const hasActiveFilters = Boolean(filters.status || filters.search);

  const statusOptions: PredictionStatus[] = ['scheduled', 'active', 'expired', 'cancelled'];

  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  return (
    <Box>
      {/* Selected Prediction Profile */}
      {selectedPrediction && <SelectedPredictionProfile prediction={selectedPrediction} />}

      <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: 'space-between' }} alignItems="center">
        {/* Left side: Search and Filters */}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search predictions..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <SelectMenuItem value="">All</SelectMenuItem>
              {statusOptions.map((status) => (
                <SelectMenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectMenuItem>
              ))}
            </Select>
          </FormControl>

          {hasActiveFilters && (
            <Button size="small" onClick={handleClearFilters} sx={{ minWidth: 'auto' }}>
              Clear
            </Button>
          )}
        </Stack>

        {/* Right side: Action buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={!canExport}
          >
            Export CSV
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={onAddPrediction}>
            Add Prediction
          </Button>
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                {/* Single-select: no select all checkbox */}
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Match</TableCell>
              <TableCell>Picks Count</TableCell>
              <TableCell>Accuracy</TableCell>
              <TableCell>Date Posted</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                  <TableLoadingState message="Loading predictions..." />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableErrorState colSpan={8} message="Failed to load predictions. Please try again." onRetry={onRefresh} />
            ) : predictions.length === 0 ? (
              <TableEmptyState
                colSpan={8}
                message="No predictions found"
                title="No Predictions"
              />
            ) : (
              predictions.map((prediction) => (
                <PredictionRow
                  key={prediction.id}
                  prediction={prediction}
                  isSelected={selectedIds.has(prediction.id)}
                  onSelect={handleSelectOne}
                  onViewDetails={handleViewDetails}
                  onEdit={onEditPrediction}
                  onDelete={onDeletePrediction}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
});
