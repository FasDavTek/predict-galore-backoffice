// components/dashboard/predictions/PredictionDetail.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { cancelPrediction } from '../../../store/slices/predictionSlice';

const PredictionDetail = ({ prediction, onBack }) => {
  const dispatch = useDispatch();
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  if (!prediction) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
          Back to Predictions
        </Button>
        <Typography variant="h6">Prediction data not available</Typography>
      </Box>
    );
  }

  const handleCancelConfirm = async () => {
    setActionLoading(true);
    try {
      await dispatch(cancelPrediction(prediction.id));
      onBack();
    } finally {
      setActionLoading(false);
      setOpenCancelDialog(false);
    }
  };

  return (
    <Box>
      {/* Header with breadcrumb and action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          Back to Predictions
        </Button>

        <Stack direction="row" spacing={2}>
          {prediction.status === 'scheduled' && (
            <Button 
              variant="contained" 
              color="error"
              onClick={() => setOpenCancelDialog(true)}
            >
              Cancel Schedule
            </Button>
          )}
        </Stack>
      </Box>

      {/* Prediction summary card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {prediction.match}
          </Typography>
          <Divider sx={{ my: 3 }} />

          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Prediction ID</TableCell>
                <TableCell>#{prediction.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Sport</TableCell>
                <TableCell>
                  <Chip label={prediction.sport} size="small" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Predictions</TableCell>
                <TableCell>{prediction.predictions}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Accuracy</TableCell>
                <TableCell>
                  <Chip 
                    label={`${prediction.accuracy}%`} 
                    color={prediction.accuracy === 100 ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Date Posted</TableCell>
                <TableCell>
                  {new Date(prediction.datePosted).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell>
                  <Chip 
                    label={prediction.status} 
                    color={
                      prediction.status === 'active' ? 'success' :
                      prediction.status === 'scheduled' ? 'info' :
                      prediction.status === 'expired' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancel Prediction</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel prediction #{prediction.id}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenCancelDialog(false)}
            disabled={actionLoading}
          >
            No, Keep
          </Button>
          <Button 
            onClick={handleCancelConfirm}
            color="error"
            disabled={actionLoading}
          >
            {actionLoading ? 'Processing...' : 'Yes, Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PredictionDetail;