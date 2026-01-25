/**
 * Delete Confirmation Dialog
 * Matches the exact design from the screenshot
 */

'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

export interface DeleteConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Yes, Delete',
  cancelLabel = 'No, Cancel',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
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
        {/* Warning Icon */}
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
              bgcolor: '#FFEBEE',
              border: '2px solid #E94C5C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WarningIcon
              sx={{
                fontSize: 32,
                color: '#E94C5C',
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

        {/* Buttons */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            onClick={onCancel}
            variant="outlined"
            sx={{
              minWidth: 120,
              borderRadius: '8px',
              borderColor: '#000',
              color: '#000',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: '#000',
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            sx={{
              minWidth: 120,
              borderRadius: '8px',
              bgcolor: confirmLabel.toLowerCase().includes('delete') ? '#E94C5C' : '#4CAF50',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                bgcolor: confirmLabel.toLowerCase().includes('delete') ? '#D32F2F' : '#45a049',
              },
            }}
          >
            {confirmLabel}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
