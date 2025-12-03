// src/app/(dashboard)/predictions/features/components/PredictionsTable.tsx
"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
  Button,
  Chip,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Popover,
  Divider,
  Pagination,
  useMediaQuery,
  PaginationItem,
  PaginationRenderItemParams,
  Menu,
  useTheme,
  alpha,
  SelectChangeEvent,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  // Refresh as RefreshIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowLeft as PreviousIcon,
  KeyboardArrowRight as NextIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Prediction } from "../types/prediction.types";
import { getStatusColor, getTypeColor, formatProcessingTime } from "../utils/predictionTransformers";

// Types
export type PredictionStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";
export type PredictionType = "classification" | "regression" | "clustering" | "time_series";
export type PredictionAccuracy = "high" | "medium" | "low";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface FiltersState {
  status?: PredictionStatus;
  type?: PredictionType;
  accuracy?: PredictionAccuracy;
}

interface PredictionsTableProps {
  // Data
  predictions: Prediction[];
  pagination?: PaginationMeta;
  isLoading?: boolean;
  hasError?: boolean;
  
  // Filters
  currentFilters: FiltersState;
  localSearch: string;
  
  // Selection
  selectedPredictions: Prediction[];
  selectedPredictionIds: string[];
  
  // Handlers
  onPredictionSelect: (prediction: Prediction) => void;
  onPredictionEdit: (prediction: Prediction) => void;
  onPredictionDelete: (prediction: Prediction) => Promise<boolean> | Promise<void> | void;
  onPredictionCancel: (prediction: Prediction) => Promise<boolean> | Promise<void> | void;
  onAddPrediction: () => void;
  onExportPredictions: () => Promise<boolean> | Promise<void> | (() => void);
  onRefresh: () => void;
  onSearchChange: (search: string) => void;
  onFilterChange: (filters: Partial<FiltersState>) => void;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onToggleSelection: (predictionId: string) => void;
  onSelectAll: (predictions: Prediction[]) => void;
  onClearAllSelection: () => void;
  onRemoveFromSelection: (predictionId: string) => void;
  
  // States
  isExporting?: boolean;
  isRefreshing?: boolean;
}

// ==================== REUSABLE COMPONENTS ====================

const StatusBadge: React.FC<{ status: PredictionStatus }> = ({ status }) => {
  const theme = useTheme();
  
  return (
    <Typography
      variant="body2"
      sx={{
        color: getStatusColor(status) || theme.palette.text.secondary,
        fontWeight: 500,
        textTransform: 'capitalize',
      }}
    >
      {status}
    </Typography>
  );
};

const TypeBadge: React.FC<{ type: PredictionType }> = ({ type }) => {
  const theme = useTheme();
  
  return (
    <Typography
      variant="body2"
      sx={{
        color: getTypeColor(type) || theme.palette.text.secondary,
        fontWeight: 500,
        textTransform: 'capitalize',
      }}
    >
      {type.replace('_', ' ')}
    </Typography>
  );
};

// ==================== SUB-COMPONENTS ====================

const SelectedPredictionPreview: React.FC<{
  selectedPredictions: Prediction[];
  onPredictionSelect: (prediction: Prediction) => void;
  onPredictionEdit: (prediction: Prediction) => void;
  onPredictionDelete: (prediction: Prediction) => void;
  onPredictionCancel: (prediction: Prediction) => void;
  onClearSelection: () => void;
  onRemovePrediction: (predictionId: string) => void;
}> = ({ 
  selectedPredictions, 
  onPredictionSelect, 
  onPredictionEdit, 
  onPredictionDelete,
  onPredictionCancel,
  onClearSelection 
}) => {
  const theme = useTheme();
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);

  if (selectedPredictions.length === 0) {
    return null;
  }

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, prediction: Prediction) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedPrediction(prediction);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedPrediction(null);
  };

  const handleEdit = () => {
    if (selectedPrediction) {
      onPredictionEdit(selectedPrediction);
    }
    handleActionMenuClose();
  };

  const handleDelete = () => {
    if (selectedPrediction) {
      onPredictionDelete(selectedPrediction);
    }
    handleActionMenuClose();
  };

  const handleCancel = () => {
    if (selectedPrediction) {
      onPredictionCancel(selectedPrediction);
    }
    handleActionMenuClose();
  };

  const handleView = () => {
    if (selectedPrediction) {
      onPredictionSelect(selectedPrediction);
    }
    handleActionMenuClose();
  };

  return (
    <Box
      sx={{
        mb: 8,
        animation: 'slideDown 0.3s ease-out',
        '@keyframes slideDown': {
          from: {
            opacity: 0,
            transform: 'translateY(-20px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      <TableContainer 
        component={Paper} 
        elevation={1}
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
          maxHeight: selectedPredictions.length > 3 ? 300 : 'auto',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, right: 8, zIndex: 1, marginBottom: 4}}>
          <Tooltip title="Clear selection">
            <IconButton
              size="small"
              onClick={onClearSelection}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                Prediction
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                Type
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                Accuracy
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                Processing Time
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedPredictions.map((prediction) => (
              <TableRow
                key={prediction.id}
                hover
                sx={{
                  cursor: 'pointer',
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  },
                }}
                onClick={() => onPredictionSelect(prediction)}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {prediction.name}
                  </Typography>
                  {prediction.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {prediction.description}
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  <TypeBadge type={prediction.type} />
                </TableCell>

                <TableCell>
                  <StatusBadge status={prediction.status} />
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {prediction.accuracy ? `${prediction.accuracy}%` : 'N/A'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {formatProcessingTime(prediction.processingTime)}
                  </Typography>
                </TableCell>

                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Actions">
                    <IconButton
                      size="small"
                      onClick={(e) => handleActionMenuOpen(e, prediction)}
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          },
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} />
          Edit Prediction
        </MenuItem>
        
        {selectedPrediction?.status === 'processing' && (
          <MenuItem onClick={handleCancel}>
            <CancelIcon sx={{ mr: 2, fontSize: 20, color: 'warning.main' }} />
            Cancel Prediction
          </MenuItem>
        )}
    
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 2, fontSize: 20 }} />
          Delete Prediction
        </MenuItem>
      </Menu>
    </Box>
  );
};

const Toolbar: React.FC<{
  selectedCount: number;
  onAddPrediction: () => void;
  onExport?: () => Promise<boolean> | Promise<void> | (() => void);
  onRefresh?: () => void;
  isExporting?: boolean;
  isLoading?: boolean;
}> = ({
  selectedCount,
  onAddPrediction,
  onExport,
  // onRefresh,
  isExporting = false,
  // isLoading = false,
}) => {
  const theme = useTheme();

  const handleExport = async () => {
    if (onExport) {
      try {
        await onExport();
      } catch (error) {
        console.error("Export failed:", error);
      }
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
      >
        {selectedCount > 0 && (
          <Typography variant="body2" color="text.secondary">
            {selectedCount} prediction{selectedCount !== 1 ? "s" : ""} selected
          </Typography>
        )}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          {/* {onRefresh && (
            <Tooltip title="Refresh predictions">
              <Button
                startIcon={<RefreshIcon />}
                onClick={onRefresh}
                variant="outlined"
                size="medium"
                disabled={isLoading}
                sx={{ borderRadius: 2, minWidth: "auto", px: 2 }}
              >
                Refresh
              </Button>
            </Tooltip>
          )} */}

          {onExport && (
            <Tooltip title="Export predictions data to CSV">
              <LoadingButton
                startIcon={<DownloadIcon />}
                onClick={handleExport}
                loading={isExporting}
                loadingPosition="start"
                variant="outlined"
                size="medium"
                sx={{ borderRadius: 1, minWidth: "auto", px: 2 }}
              >
                {isExporting ? "Exporting..." : "Export"}
              </LoadingButton>
            </Tooltip>
          )}

          <Button
            startIcon={<AddIcon />}
            onClick={onAddPrediction}
            variant="contained"
            size="medium"
            sx={{
              borderRadius: 1,
              minWidth: "auto",
              px: 3,
              fontWeight: 600,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              "&:hover": {
                boxShadow: `0 6px 20px ${alpha(
                  theme.palette.primary.main,
                  0.4
                )}`,
                transform: "translateY(-1px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            New Prediction
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

const FilterComponent: React.FC<{
  searchTerm: string;
  statusFilter?: PredictionStatus;
  typeFilter?: PredictionType;
  accuracyFilter?: PredictionAccuracy;
  onSearchChange: (search: string) => void;
  onStatusChange: (status?: PredictionStatus) => void;
  onTypeChange: (type?: PredictionType) => void;
  onAccuracyChange: (accuracy?: PredictionAccuracy) => void;
  onClearFilters: () => void;
}> = (props) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const hasActiveFilters = Boolean(
    props.searchTerm ||
      props.statusFilter ||
      props.typeFilter ||
      props.accuracyFilter
  );

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) =>
    setFilterAnchorEl(event.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);

  const filterOptions = [
    {
      label: "Status",
      value: props.statusFilter || "",
      onChange: (value: string) => {
        props.onStatusChange((value as PredictionStatus) || undefined);
        handleFilterClose();
      },
      options: ["", "pending", "processing", "completed", "failed", "cancelled"],
    },
    {
      label: "Type",
      value: props.typeFilter || "",
      onChange: (value: string) => {
        props.onTypeChange((value as PredictionType) || undefined);
        handleFilterClose();
      },
      options: ["", "classification", "regression", "clustering", "time_series"],
    },
    {
      label: "Accuracy",
      value: props.accuracyFilter || "",
      onChange: (value: string) => {
        props.onAccuracyChange((value as PredictionAccuracy) || undefined);
        handleFilterClose();
      },
      options: ["", "high", "medium", "low"],
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          placeholder="Search predictions..."
          value={props.searchTerm}
          onChange={(e) => props.onSearchChange(e.target.value)}
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
            ),
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
            borderRadius: 1,
            minWidth: "auto",
            px: 2,
            borderColor: hasActiveFilters ? "primary.main" : "divider",
          }}
        >
          Filters
          {hasActiveFilters && (
            <Chip
              label="On"
              size="small"
              color="primary"
              sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
            />
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={props.onClearFilters}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Clear
          </Button>
        )}
      </Stack>

      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: { width: 320, maxHeight: 400, borderRadius: 2, p: 2, mt: 1 },
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Filter Predictions
        </Typography>

        <Stack spacing={2}>
          {filterOptions.map(({ label, value, onChange, options }) => (
            <FormControl key={label} fullWidth size="small">
              <InputLabel>{label}</InputLabel>
              <Select
                value={value}
                label={label}
                onChange={(e) => onChange(e.target.value)}
              >
                <MenuItem value="">All {label}s</MenuItem>
                {options.slice(1).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
          <Divider />
        </Stack>
      </Popover>

      {hasActiveFilters && (
        <Box sx={{ mt: 2 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
          >
            <FilterIcon fontSize="small" color="action" />
            {props.searchTerm && (
              <Chip
                label={`Search: "${props.searchTerm}"`}
                size="small"
                onDelete={() => props.onSearchChange("")}
              />
            )}
            {props.statusFilter && (
              <Chip
                label={`Status: ${props.statusFilter}`}
                size="small"
                onDelete={() => props.onStatusChange(undefined)}
              />
            )}
            {props.typeFilter && (
              <Chip
                label={`Type: ${props.typeFilter}`}
                size="small"
                onDelete={() => props.onTypeChange(undefined)}
              />
            )}
            {props.accuracyFilter && (
              <Chip
                label={`Accuracy: ${props.accuracyFilter}`}
                size="small"
                onDelete={() => props.onAccuracyChange(undefined)}
              />
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

const PaginationComponent: React.FC<{
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}> = ({ pagination, onPageChange, onPageSizeChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { page, limit, total, totalPages } = pagination;

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newSize = Number(event.target.value);
    onPageSizeChange?.(newSize);
    onPageChange(1);
  };

  const getDisplayRange = () => {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return { start, end };
  };

  const { start, end } = getDisplayRange();
  if (total === 0) return null;

  const renderPaginationItem = (item: PaginationRenderItemParams) => {
    if (isMobile && item.type === 'page') return null;
    if (item.type === 'previous' || item.type === 'next') {
      return (
        <IconButton onClick={item.onClick} disabled={item.disabled} sx={{ borderRadius: 1, '&.Mui-disabled': { opacity: 0.5 } }}>
          {item.type === 'previous' ? <PreviousIcon /> : <NextIcon />}
        </IconButton>
      );
    }
    return <PaginationItem {...item} component="button" />;
  };

  return (
    <Box sx={{ py: 3 }}>
      <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 2 : 0} 
        justifyContent="space-between" alignItems={isMobile ? 'stretch' : 'center'}>
        
        <Box>
          <Typography variant="body2" color="text.secondary">
            Showing <Typography component="span" variant="body2" fontWeight="bold" color="text.primary">
              {start}-{end}
            </Typography> of{' '}
            <Typography component="span" variant="body2" fontWeight="bold" color="text.primary">
              {total.toLocaleString()}
            </Typography> predictions
          </Typography>
        </Box>

        <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems={isMobile ? 'stretch' : 'center'}>
          {onPageSizeChange && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rows per page</InputLabel>
              <Select value={limit} label="Rows per page" onChange={handlePageSizeChange}>
                {[10, 25, 50, 100].map((option) => (
                  <MenuItem key={option} value={option}>{option} per page</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => onPageChange(newPage)}
            color="primary"
            size={isMobile ? "small" : "medium"}
            showFirstButton
            showLastButton
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 1 : 2}
            renderItem={renderPaginationItem}
            sx={{
              '& .MuiPaginationItem-root': { fontWeight: 600, borderRadius: 2 },
              '& .MuiPaginationItem-page.Mui-selected': { 
                backgroundColor: 'primary.main', 
                color: 'white', 
                '&:hover': { backgroundColor: 'primary.dark' } 
              },
            }}
          />
        </Stack>
      </Stack>

      {isMobile && (
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">Page {page} of {totalPages}</Typography>
        </Box>
      )}
    </Box>
  );
};

const TableComponent: React.FC<{
  predictions: Prediction[];
  selectedPredictionIds: string[];
  onPredictionSelect: (prediction: Prediction) => void;
  onPredictionEdit: (prediction: Prediction) => void;
  onPredictionDelete: (prediction: Prediction) => void;
  onPredictionCancel: (prediction: Prediction) => void;
  onToggleSelection: (predictionId: string) => void;
  onSelectAll: (predictions: Prediction[]) => void;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
}> = ({
  predictions,
  selectedPredictionIds,
  onPredictionSelect,
  onPredictionEdit,
  onPredictionDelete,
  onPredictionCancel,
  onToggleSelection,
  onSelectAll,
  isLoading = false,
  hasError = false,
  onRetry,
}) => {
  const theme = useTheme();
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);

  const isEmpty = predictions.length === 0;

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, prediction: Prediction) => {
    event.stopPropagation();
    setActionMenuAnchor(event.currentTarget);
    setSelectedPrediction(prediction);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedPrediction(null);
  };

  const handleEdit = () => {
    if (selectedPrediction) {
      onPredictionEdit(selectedPrediction);
    }
    handleActionMenuClose();
  };

  const handleDelete = () => {
    if (selectedPrediction) {
      onPredictionDelete(selectedPrediction);
    }
    handleActionMenuClose();
  };

  const handleCancel = () => {
    if (selectedPrediction) {
      onPredictionCancel(selectedPrediction);
    }
    handleActionMenuClose();
  };

  const handleView = () => {
    if (selectedPrediction) {
      onPredictionSelect(selectedPrediction);
    }
    handleActionMenuClose();
  };

  const handleSelectAll = () => onSelectAll(predictions);

  if (isLoading) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Loading predictions...
        </Typography>
      </Box>
    );
  }

  const renderTableRows = () => {
    if (hasError) return renderErrorState();
    if (isEmpty) return renderEmptyState();
    return predictions.map(renderPredictionRow);
  };

  const renderErrorState = () => (
    <TableRow>
      <TableCell colSpan={8} sx={{ textAlign: "center", py: 8 }}>
        <WarningIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
        <Typography variant="h6" color="error.main" gutterBottom>
          Unable to Load Predictions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          There was an error loading the predictions data
        </Typography>
        {onRetry && (
          <Button 
            variant="outlined" 
            onClick={onRetry}
            sx={{ mt: 2 }}
          >
            Retry Loading
          </Button>
        )}
      </TableCell>
    </TableRow>
  );

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={8} sx={{ textAlign: "center", py: 8 }}>
        <WarningIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Predictions Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Predictions will appear here once they are created
        </Typography>
      </TableCell>
    </TableRow>
  );

  const renderPredictionRow = (prediction: Prediction) => (
    <TableRow
      key={prediction.id}
      hover
      sx={{ cursor: "pointer" }}
      onClick={() => onPredictionSelect(prediction)}
    >
      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={selectedPredictionIds.includes(prediction.id)}
          onChange={() => onToggleSelection(prediction.id)}
        />
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography fontWeight="medium">
            {prediction.name}
          </Typography>
        </Box>
        {prediction.description && (
          <Typography variant="body2" color="text.secondary">
            {prediction.description}
          </Typography>
        )}
      </TableCell>
      <TableCell>
        <TypeBadge type={prediction.type} />
      </TableCell>
      <TableCell>
        <StatusBadge status={prediction.status} />
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {prediction.accuracy ? `${prediction.accuracy}%` : 'N/A'}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {formatProcessingTime(prediction.processingTime)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          {new Date(prediction.createdAt).toLocaleDateString()}
        </Typography>
      </TableCell>
      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
        <Tooltip title="Actions">
          <IconButton
            size="small"
            onClick={(e) => handleActionMenuOpen(e, prediction)}
            sx={{
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {/* Error banner - only show if there's an error but we have some data */}
      {hasError && !isEmpty && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          action={
            onRetry && (
              <Button color="inherit" size="small" onClick={onRetry}>
                Retry
              </Button>
            )
          }
        >
          Showing available data. Some predictions may not be loaded.
        </Alert>
      )}

      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedPredictionIds.length > 0 && 
                    selectedPredictionIds.length < predictions.length
                  }
                  checked={
                    predictions.length > 0 && 
                    selectedPredictionIds.length === predictions.length
                  }
                  onChange={handleSelectAll}
                  disabled={isEmpty || hasError}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Accuracy</TableCell>
              <TableCell>Processing Time</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      </TableContainer>

      {!isEmpty && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Showing {predictions.length} prediction{predictions.length !== 1 ? "s" : ""}
            {selectedPredictionIds.length > 0 && ` (${selectedPredictionIds.length} selected)`}
          </Typography>
        </Box>
      )}

      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 160,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} />
          Edit
        </MenuItem>
        {selectedPrediction?.status === 'processing' && (
          <MenuItem onClick={handleCancel}>
            <CancelIcon sx={{ mr: 2, fontSize: 20, color: 'warning.main' }} />
            Cancel
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 2, fontSize: 20 }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

// ==================== MAIN COMPONENT ====================

export const PredictionsTable: React.FC<PredictionsTableProps> = ({
  predictions,
  pagination,
  isLoading = false,
  hasError = false,
  currentFilters,
  localSearch,
  selectedPredictions,
  selectedPredictionIds,
  onPredictionSelect,
  onPredictionEdit,
  onPredictionDelete,
  onPredictionCancel,
  onAddPrediction,
  onExportPredictions,
  onRefresh,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  onPageChange,
  onPageSizeChange,
  onToggleSelection,
  onSelectAll,
  onClearAllSelection,
  onRemoveFromSelection,
  isExporting = false,
  isRefreshing = false,
}) => {
  
  // Check if there are active filters
  const hasActiveFilters = Boolean(
    localSearch ||
      currentFilters.status ||
      currentFilters.type ||
      currentFilters.accuracy
  );
  const isEmptyState = predictions.length === 0 && !isLoading;

  return (
    <Box className="flex flex-col gap-3">
      {/* Selected Predictions Preview */}
      <SelectedPredictionPreview
        selectedPredictions={selectedPredictions}
        onPredictionSelect={onPredictionSelect}
        onPredictionEdit={onPredictionEdit}
        onPredictionDelete={onPredictionDelete}
        onPredictionCancel={onPredictionCancel}
        onClearSelection={onClearAllSelection}
        onRemovePrediction={onRemoveFromSelection}
      />

      {/* Filters and Toolbar */}
      <Box className="flex flex-row justify-between">
        {/* Filters */}
        <FilterComponent
          searchTerm={localSearch}
          statusFilter={currentFilters.status}
          typeFilter={currentFilters.type}
          accuracyFilter={currentFilters.accuracy}
          onSearchChange={onSearchChange}
          onStatusChange={(status) => onFilterChange({ status })}
          onTypeChange={(type) => onFilterChange({ type })}
          onAccuracyChange={(accuracy) => onFilterChange({ accuracy })}
          onClearFilters={onClearFilters}
        />

        {/* Toolbar */}
        <Toolbar
          selectedCount={selectedPredictions.length}
          onAddPrediction={onAddPrediction}
          onExport={onExportPredictions}
          onRefresh={onRefresh}
          isExporting={isExporting}
          isLoading={isLoading || isRefreshing}
        />
      </Box>

      {/* Content Area */}
      {isEmptyState ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <WarningIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {hasActiveFilters ? "No Predictions Found" : "No Predictions Yet"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {hasActiveFilters
              ? "Try adjusting your search criteria or filters to find what you're looking for."
              : "Get started by creating your first prediction."}
          </Typography>
        
          {hasActiveFilters && (
            <Button variant="outlined" onClick={onClearFilters}>
              Clear Filters
            </Button>
          )}
        </Box>
      ) : (
        <>
          {/* Predictions Table */}
          <TableComponent
            predictions={predictions}
            selectedPredictionIds={selectedPredictionIds}
            onPredictionSelect={onPredictionSelect}
            onPredictionEdit={onPredictionEdit}
            onPredictionDelete={onPredictionDelete}
            onPredictionCancel={onPredictionCancel}
            onToggleSelection={onToggleSelection}
            onSelectAll={onSelectAll}
            isLoading={isLoading || isRefreshing}
            hasError={hasError}
            onRetry={onRefresh}
          />

          {/* Pagination */}
          {pagination && pagination.total > 0 && (
            <PaginationComponent
              pagination={pagination}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          )}
        </>
      )}
    </Box>
  );
};