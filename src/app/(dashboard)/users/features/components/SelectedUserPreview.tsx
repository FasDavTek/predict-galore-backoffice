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
} from '@mui/icons-material';

import { User, UserStatus, SubscriptionPlan } from '../types/user.types';

interface SelectedUserPreviewProps {
  selectedUsers: User[];
  onUserSelect: (user: User) => void;
  onUserEdit: (user: User) => void;
  onUserDelete: (user: User) => void;
  onClearSelection: () => void;
  onRemoveUser: (userId: string) => void;
}

export const SelectedUserPreview: React.FC<SelectedUserPreviewProps> = ({
  selectedUsers,
  onUserSelect,
  onUserEdit,
  onUserDelete,
  onClearSelection,
}) => {
  const theme = useTheme();
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (selectedUsers.length === 0) {
    return null;
  }

  // Updated to handle undefined values
  const getStatusColor = (status: UserStatus | undefined) => {
    const defaultColor = theme.palette.text.secondary;
    if (!status) return defaultColor;
    
    const colors: Record<UserStatus, string> = {
      active: theme.palette.success.main,
      inactive: theme.palette.error.main,
      suspended: theme.palette.warning.main,
      pending: theme.palette.text.secondary,
    };
    return colors[status] || defaultColor;
  };

  // Updated to handle undefined values
  const getPlanColor = (plan: SubscriptionPlan | undefined) => {
    const defaultColor = theme.palette.text.secondary;
    if (!plan) return defaultColor;
    
    const colors: Record<SubscriptionPlan, string> = {
      free: theme.palette.info.main,
      basic: theme.palette.secondary.main,
      premium: theme.palette.warning.main,
      enterprise: theme.palette.primary.main,
    };
    return colors[plan] || defaultColor;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: theme.palette.error.main,
      moderator: theme.palette.warning.main,
      user: theme.palette.info.main,
    };
    return colors[role] || theme.palette.text.secondary;
  };

  // Helper function to get display text with fallback
  const getDisplayText = (value: string | undefined, fallback: string = 'Unknown') => {
    return value || fallback;
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedUser(user);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedUser(null);
  };

  const handleEdit = () => {
    if (selectedUser) {
      onUserEdit(selectedUser);
    }
    handleActionMenuClose();
  };

  const handleDelete = () => {
    if (selectedUser) {
      onUserDelete(selectedUser);
    }
    handleActionMenuClose();
  };

  const handleView = () => {
    if (selectedUser) {
      onUserSelect(selectedUser);
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
          maxHeight: selectedUsers.length > 3 ? 300 : 'auto',
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
                User
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                Plan
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                Role
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedUsers.map((user) => (
              <TableRow
                key={user.id}
                hover
                sx={{
                  cursor: 'pointer',
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  },
                }}
                onClick={() => onUserSelect(user)}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {user.fullName}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      color: getPlanColor(user.plan),
                      fontWeight: 500,
                    }}
                  >
                    {getDisplayText(user.plan, 'No Plan')}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      color: getStatusColor(user.status),
                      fontWeight: 500,
                    }}
                  >
                    {getDisplayText(user.status, 'Unknown')}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      color: getRoleColor(user.role),
                      fontWeight: 500,
                      textTransform: 'capitalize',
                    }}
                  >
                    {user.role}
                  </Typography>
                </TableCell>

                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Actions">
                    <IconButton
                      size="small"
                      onClick={(e) => handleActionMenuOpen(e, user)}
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
          Edit User
        </MenuItem>
    
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 2, fontSize: 20 }} />
          Delete User
        </MenuItem>
      </Menu>
    </Box>
  );
};