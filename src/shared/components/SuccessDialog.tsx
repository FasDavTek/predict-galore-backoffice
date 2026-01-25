/**
 * Success Dialog
 * Displays success messages with a checkmark icon
 */

'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

export interface SuccessDialogProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  buttonLabel?: string;
}

export const SuccessDialog: React.FC<SuccessDialogProps> = ({
  open,
  title,
  message,
  onClose,
  buttonLabel = 'OK',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          p: 0,
        },
      }}
    >
      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        {/* Success Icon */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: '#E8F5E9',
              border: '2px solid #4CAF50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 32,
                color: '#4CAF50',
              }}
            />
          </Box>
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '20px',
            color: '#000',
            mb: 2,
          }}
        >
          {title}
        </Typography>

        {/* Message */}
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            fontSize: '14px',
            lineHeight: 1.6,
            mb: 4,
          }}
        >
          {message}
        </Typography>

        {/* Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              minWidth: 120,
              borderRadius: '8px',
              bgcolor: '#4CAF50',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#45a049',
              },
            }}
          >
            {buttonLabel}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
