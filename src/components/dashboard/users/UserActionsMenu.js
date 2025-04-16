// components/dashboard/users/UserActionsMenu.js
import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch } from 'react-redux';
import { deleteUser, upgradeUser } from '@/store/slices/usersSlice';

/**
 * UserActionsMenu component - Provides action menu for user operations
 * @param {Object} user - The user object to perform actions on
 */
const UserActionsMenu = ({ user }) => {
  // State management for menu and dialogs
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for menu positioning
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Delete dialog visibility
  const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false); // Upgrade dialog visibility
  const [actionLoading, setActionLoading] = useState(false); // Loading state for actions

  /**
   * Handles opening the action menu
   * @param {Event} event - The click event
   */
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Set anchor to clicked button
  };

  /**
   * Handles closing the action menu
   */
  const handleMenuClose = () => {
    setAnchorEl(null); // Clear anchor to close menu
  };

  /**
   * Handles delete button click
   * Opens delete confirmation dialog
   */
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true); // Show delete dialog
    handleMenuClose(); // Close the action menu
  };

  /**
   * Handles upgrade button click
   * Opens upgrade confirmation dialog
   */
  const handleUpgradeClick = () => {
    setOpenUpgradeDialog(true); // Show upgrade dialog
    handleMenuClose(); // Close the action menu
  };

  /**
   * Handles delete confirmation
   * Dispatches delete action to Redux store
   */
  const handleDeleteConfirm = async () => {
    setActionLoading(true); // Show loading state
    try {
      await dispatch(deleteUser(user.id)); // Dispatch delete action
      // Note: Success notification is handled by the Redux slice
    } finally {
      setActionLoading(false); // Hide loading state
      setOpenDeleteDialog(false); // Close dialog
    }
  };

  /**
   * Handles upgrade confirmation
   * Dispatches upgrade action to Redux store
   */
  const handleUpgradeConfirm = async () => {
    setActionLoading(true); // Show loading state
    try {
      await dispatch(upgradeUser(user.id)); // Dispatch upgrade action
      // Note: Success notification is handled by the Redux slice
    } finally {
      setActionLoading(false); // Hide loading state
      setOpenUpgradeDialog(false); // Close dialog
    }
  };

  return (
    <>
      {/* Three-dot menu button */}
      <IconButton 
        onClick={handleMenuOpen}
        aria-label="user actions"
        aria-controls="user-actions-menu"
        aria-haspopup="true"
      >
        <MoreVertIcon />
      </IconButton>

      {/* Dropdown action menu */}
      <Menu
        id="user-actions-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {/* Upgrade account option */}
        <MenuItem 
          onClick={handleUpgradeClick}
          disabled={user.subscription === 'Premium'} // Disable if already premium
        >
          Upgrade Account
        </MenuItem>
        
        {/* Delete user option */}
        <MenuItem onClick={handleDeleteClick}>
          Delete User
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {user.fullName}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            disabled={actionLoading}
            autoFocus
          >
            {actionLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upgrade Confirmation Dialog */}
      <Dialog 
        open={openUpgradeDialog} 
        onClose={() => setOpenUpgradeDialog(false)}
        aria-labelledby="upgrade-dialog-title"
      >
        <DialogTitle id="upgrade-dialog-title">Confirm Upgrade</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Upgrade {user.fullName} to premium account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenUpgradeDialog(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpgradeConfirm} 
            color="primary"
            disabled={actionLoading}
            autoFocus
          >
            {actionLoading ? 'Upgrading...' : 'Upgrade'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserActionsMenu;