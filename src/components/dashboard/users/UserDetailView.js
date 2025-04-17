// components/dashboard/users/UserDetailView.js
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
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch } from 'react-redux';
import { deleteUser, upgradeUser } from '@/store/slices/usersSlice';

const UserDetailView = ({ user, onBack }) => {
  const dispatch = useDispatch();
  const [actionLoading, setActionLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);

  if (!user) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
          Back to Users
        </Button>
        <Typography variant="h6">User data not available</Typography>
      </Box>
    );
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setOpenDeleteDialog(true);
  };

  const handleUpgradeClick = () => {
    handleMenuClose();
    setOpenUpgradeDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      await dispatch(deleteUser(user.id));
      setOpenDeleteDialog(false);
      onBack(); // Go back to list after deletion
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpgradeConfirm = async () => {
    setActionLoading(true);
    try {
      await dispatch(upgradeUser(user.id));
      setOpenUpgradeDialog(false);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>{user.fullName || 'Unknown User'}</Typography>
          <Typography color="text.secondary" gutterBottom>Last active: 30 mins ago</Typography>
          
          <Divider sx={{ my: 3 }} />

          

          <Table sx={{ mb: 3 }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>First Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Last Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Plan</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{user.fullName?.split(' ')[0] || 'N/A'}</TableCell>
                <TableCell>{user.fullName?.split(' ').slice(1).join(' ') || 'N/A'}</TableCell>
                <TableCell>{user.location || 'N/A'}</TableCell>
                <TableCell>{user.phone || 'N/A'}</TableCell>
                <TableCell>{user.email || 'N/A'}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.subscription || 'Unknown'} 
                    color={user.subscription === 'Premium' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    onClick={handleMenuOpen}
                    aria-label="user actions"
                    aria-controls="user-actions-menu"
                    aria-haspopup="true"
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="user-actions-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem 
                      onClick={handleUpgradeClick}
                      disabled={user.subscription === 'Premium'}
                    >
                      Upgrade Account
                    </MenuItem>
                    <MenuItem 
                      onClick={handleDeleteClick}
                      sx={{ color: 'error.main' }}
                    >
                      Delete User
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {user.fullName}? This action cannot be undone.
          </Typography>
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
          >
            {actionLoading ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upgrade Confirmation Dialog */}
      <Dialog
        open={openUpgradeDialog}
        onClose={() => setOpenUpgradeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upgrade Account</DialogTitle>
        <DialogContent>
          <Typography>
            Upgrade {user.fullName} to premium account?
          </Typography>
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
          >
            {actionLoading ? 'Upgrading...' : 'Confirm Upgrade'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDetailView;