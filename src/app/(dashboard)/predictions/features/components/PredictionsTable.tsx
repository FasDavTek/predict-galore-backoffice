import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  useTheme,
  Box,
  Alert,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Prediction } from '../types/prediction.types';
import { TableLoadingState } from '@/components/LoadingState';
import { getStatusColor, getTypeColor, formatProcessingTime } from '../utils/predictionTransformers';

interface PredictionsTableProps {
  predictions: Prediction[];
  selectedPredictionIds: string[];
  onPredictionSelect: (prediction: Prediction) => void;
  onPredictionEdit: (prediction: Prediction) => void;
  onPredictionDelete: (prediction: Prediction) => void;
  onPredictionCancel: (prediction: Prediction) => void;
  onToggleSelection: (predictionId: string) => void;
  onSelectAll?: (predictions: Prediction[]) => void;
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
}

const EmptyTableState: React.FC<{ hasError?: boolean; onRetry?: () => void }> = ({ 
  hasError, 
  onRetry 
}) => {
  if (hasError) {
    return (
      <TableRow>
        <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}>
          <WarningIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Error: Unable to Load Predictions
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
  }

  return (
    <TableRow>
      <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}>
        <WarningIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Predictions Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Predictions will appear here once they are created
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export const PredictionsTable: React.FC<PredictionsTableProps> = ({
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

  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll(predictions);
    }
  };

  if (isLoading) {
    return <TableLoadingState />;
  }

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
          <TableBody>
            {isEmpty ? (
              <EmptyTableState hasError={hasError} onRetry={onRetry} />
            ) : (
              predictions.map((prediction) => (
                <TableRow 
                  key={prediction.id} 
                  hover 
                  sx={{ cursor: 'pointer' }} 
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
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: getTypeColor(prediction.type),
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}
                    >
                      {prediction.type.replace('_', ' ')}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: getStatusColor(prediction.status),
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}
                    >
                      {prediction.status}
                    </Typography>
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
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Status indicator */}
      {!isEmpty && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Showing {predictions.length} prediction{predictions.length !== 1 ? 's' : ''}
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