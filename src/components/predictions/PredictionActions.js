// components/dashboard/predictions/PredictionsActions.js
import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  Typography,
  Divider,
  Button,
  Box
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { cancelPrediction } from '../../store/slices/predictionSlice';
// import { cancelPrediction, deletePrediction } from '../../../store/slices/PredictionSlice';


/**
 * PredictionsActions - Provides actions for a prediction
 */
const PredictionActions = ({ prediction, onViewDetails, onEdit }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleCancelClick = () => {
    setOpenCancelDialog(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleCancelConfirm = async () => {
    setActionLoading(true);
    try {
      await dispatch(cancelPrediction(prediction.id));
    } finally {
      setActionLoading(false);
      setOpenCancelDialog(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      await dispatch(deletePrediction(prediction.id));
    } finally {
      setActionLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  return (
    <>
      {/* Action menu trigger */}
      <IconButton 
        onClick={handleMenuOpen}
        aria-label="prediction actions"
      >
        <MoreVertIcon />
      </IconButton>

      {/* Dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={onViewDetails}>
          View Details
        </MenuItem>
       
        {prediction.status === 'scheduled' && (
          <MenuItem onClick={handleCancelClick}>
            Cancel Schedule
          </MenuItem>
        )}
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          Delete Prediction
        </MenuItem>
      </Menu>

      {/* Cancel confirmation dialog */}
      <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Cancel Prediction</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography sx={{ mb: 3 }}>
            Are you sure you want to cancel prediction #{prediction.id}?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setOpenCancelDialog(false)}
              disabled={actionLoading}
            >
              No, Keep
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={handleCancelConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Yes, Cancel'}
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Delete Prediction</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography sx={{ mb: 3 }}>
            Are you sure you want to permanently delete prediction #{prediction.id}?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setOpenDeleteDialog(false)}
              disabled={actionLoading}
            >
              No, Keep
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={handleDeleteConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? 'Deleting...' : 'Yes, Delete'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default PredictionActions;