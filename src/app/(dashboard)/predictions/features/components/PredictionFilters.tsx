import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Stack,
  Popover,
  Divider,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { PredictionStatus, PredictionType, PredictionAccuracy } from '../types/prediction.types';

interface PredictionFiltersProps {
  searchTerm: string;
  statusFilter?: PredictionStatus;
  typeFilter?: PredictionType;
  accuracyFilter?: PredictionAccuracy;
  onSearchChange: (search: string) => void;
  onStatusChange: (status?: PredictionStatus) => void;
  onTypeChange: (type?: PredictionType) => void;
  onAccuracyChange: (accuracy?: PredictionAccuracy) => void;
  onClearFilters: () => void;
}

export const PredictionFilters: React.FC<PredictionFiltersProps> = ({
  searchTerm,
  statusFilter,
  typeFilter,
  accuracyFilter,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onAccuracyChange,
  onClearFilters,
}) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const hasActiveFilters = Boolean(searchTerm || statusFilter || typeFilter || accuracyFilter);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const open = Boolean(filterAnchorEl);

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          placeholder="Search predictions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
        />

        <Button
          variant={hasActiveFilters ? "contained" : "outlined"}
          color={hasActiveFilters ? "primary" : "inherit"}
          startIcon={<FilterIcon />}
          endIcon={<ExpandMoreIcon />}
          onClick={handleFilterClick}
          size="medium"
          sx={{
            borderRadius: 2,
            minWidth: 'auto',
            px: 2,
            borderColor: hasActiveFilters ? 'primary.main' : 'divider',
          }}
        >
          Filters
          {hasActiveFilters && (
            <Chip 
              label="On" 
              size="small" 
              color="primary" 
              sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
            />
          )}
        </Button>

        {hasActiveFilters && (
          <Button 
            variant="outlined" 
            startIcon={<ClearIcon />} 
            onClick={onClearFilters} 
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Clear
          </Button>
        )}
      </Stack>

      <Popover
        open={open}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 400,
            borderRadius: 2,
            p: 2,
            mt: 1,
          },
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Filter Predictions
        </Typography>

        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter || ''}
              label="Status"
              onChange={(e) => {
                onStatusChange(e.target.value as PredictionStatus || undefined);
                handleFilterClose();
              }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter || ''}
              label="Type"
              onChange={(e) => {
                onTypeChange(e.target.value as PredictionType || undefined);
                handleFilterClose();
              }}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="classification">Classification</MenuItem>
              <MenuItem value="regression">Regression</MenuItem>
              <MenuItem value="clustering">Clustering</MenuItem>
              <MenuItem value="time_series">Time Series</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Accuracy</InputLabel>
            <Select
              value={accuracyFilter || ''}
              label="Accuracy"
              onChange={(e) => {
                onAccuracyChange(e.target.value as PredictionAccuracy || undefined);
                handleFilterClose();
              }}
            >
              <MenuItem value="">All Accuracy Levels</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>

          <Divider />
        </Stack>
      </Popover>

      {hasActiveFilters && (
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <FilterIcon fontSize="small" color="action" />
            {searchTerm && (
              <Chip 
                label={`Search: "${searchTerm}"`} 
                size="small" 
                onDelete={() => onSearchChange('')} 
              />
            )}
            {statusFilter && (
              <Chip 
                label={`Status: ${statusFilter}`} 
                size="small" 
                onDelete={() => onStatusChange(undefined)} 
              />
            )}
            {typeFilter && (
              <Chip 
                label={`Type: ${typeFilter}`} 
                size="small" 
                onDelete={() => onTypeChange(undefined)} 
              />
            )}
            {accuracyFilter && (
              <Chip 
                label={`Accuracy: ${accuracyFilter}`} 
                size="small" 
                onDelete={() => onAccuracyChange(undefined)} 
              />
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};