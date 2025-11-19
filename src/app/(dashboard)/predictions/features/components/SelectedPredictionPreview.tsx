import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { Prediction } from '../types/prediction.types';
import { getStatusColor, getTypeColor, formatProcessingTime } from '../utils/predictionTransformers';

interface SelectedPredictionPreviewProps {
  selectedPredictions: Prediction[];
  onPredictionSelect: (prediction: Prediction) => void;
  onPredictionEdit: (prediction: Prediction) => void;
  onPredictionDelete: (prediction: Prediction) => void;
  onPredictionCancel: (prediction: Prediction) => void;
  onClearSelection: () => void;
  onRemovePrediction: (predictionId: string) => void;
}

export const SelectedPredictionPreview: React.FC<SelectedPredictionPreviewProps> = ({
  selectedPredictions,
  onPredictionSelect,
  onPredictionEdit,
  onPredictionDelete,
  onPredictionCancel,
  onClearSelection,
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
                    {prediction.accuracy || 'N/A'}
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