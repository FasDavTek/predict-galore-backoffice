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
import { useDispatch } from 'react-redux';
import { deleteUser, upgradeUser } from '@/store/slices/usersSlice';

/**
 * UserActionsMenu - Provides contextual actions for a user
 */
const UserActionsMenu = ({ user, onViewDetails }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Menu handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Action handlers
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleUpgradeClick = () => {
    setOpenUpgradeDialog(true);
    handleMenuClose();
  };

  // Confirmation handlers
  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      await dispatch(deleteUser(user.id));
    } finally {
      setActionLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  const handleUpgradeConfirm = async () => {
    setActionLoading(true);
    try {
      await dispatch(upgradeUser(user.id));
    } finally {
      setActionLoading(false);
      setOpenUpgradeDialog(false);
    }
  };

  return (
    <>
      {/* Action menu trigger */}
      <IconButton 
        onClick={handleMenuOpen}
        aria-label="user actions"
        aria-controls="user-actions-menu"
        aria-haspopup="true"
      >
        <MoreVertIcon />
      </IconButton>

      {/* Dropdown menu */}
      <Menu
        id="user-actions-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { onViewDetails(); handleMenuClose(); }}>
          View Details
        </MenuItem>
        <MenuItem 
          onClick={handleUpgradeClick}
          disabled={user.subscription === 'Premium'}
        >
          Upgrade Account
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          Delete User
        </MenuItem>
      </Menu>

      {/* Delete confirmation dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Delete User</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ mb: 3 }}>
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setOpenDeleteDialog(false)}
              disabled={actionLoading}
              sx={{ minWidth: 100 }}
            >
              No, Cancel
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={handleDeleteConfirm}
              disabled={actionLoading}
              sx={{ minWidth: 100 }}
            >
              {actionLoading ? 'Deleting...' : 'Yes, Delete'}
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Upgrade confirmation dialog */}
      <Dialog 
        open={openUpgradeDialog} 
        onClose={() => setOpenUpgradeDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Upgrade Account</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ mb: 3 }}>
            Upgrade this account to premium subscription?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setOpenUpgradeDialog(false)}
              disabled={actionLoading}
              sx={{ minWidth: 100 }}
            >
              No, Cancel
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleUpgradeConfirm}
              disabled={actionLoading}
              sx={{ minWidth: 100 }}
            >
              {actionLoading ? 'Upgrading...' : 'Yes, Upgrade'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default UserActionsMenu;