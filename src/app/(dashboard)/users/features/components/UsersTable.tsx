import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  useTheme,
  Box,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { User, UserStatus, SubscriptionPlan } from '../types/user.types'; 
import { UsersTableProps } from '../types/table.types';
import { TableLoadingState } from '@/components/LoadingState';


export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  selectedUserIds,
  onUserSelect,
  onUserEdit,
  onUserDelete,
  onToggleSelection,
  onSelectAll,
  isLoading = false,
  hasError = false,
}) => {
  const theme = useTheme();
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const isEmpty = users.length === 0;

  // Color mapping for status with default for undefined
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

  // Color mapping for plan with default for undefined
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

  // Color mapping for role
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

  const handleSelectAll = () => {
    onSelectAll(users);
  };

  if (isLoading) {
    return <TableLoadingState />;
  }

  return (
    <>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedUserIds.length > 0 && 
                    selectedUserIds.length < users.length
                  }
                  checked={
                    users.length > 0 && 
                    selectedUserIds.length === users.length
                  }
                  onChange={handleSelectAll}
                  disabled={isEmpty || hasError}
                />
              </TableCell>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hasError ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 8 }}>
                  <WarningIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
                  <Typography variant="h6" color="error.main" gutterBottom>
                    Unable to Load Users Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    There was an error loading the users data
                  </Typography>
                </TableCell>
              </TableRow>
            ) : isEmpty ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 8 }}>
                  <WarningIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Users Found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Users will appear here once they register on the platform
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow 
                  key={user.id} 
                  hover 
                  sx={{ cursor: 'pointer' }} 
                  onClick={() => onUserSelect(user)}
                >
                  {/* Checkbox */}
                  <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedUserIds.includes(user.id)} 
                      onChange={() => onToggleSelection(user.id)} 
                    />
                  </TableCell>

                  {/* User Info */}
                  <TableCell>
                    <Typography fontWeight="medium">{user.fullName}</Typography>
                  </TableCell>

                  {/* Email */}
                  <TableCell>{user.email}</TableCell>

                  {/* Plan - Colored text instead of chip */}
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

                  {/* Status - Colored text instead of chip */}
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

                  {/* Role - Colored text instead of chip */}
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

                  {/* Actions - Three-dot menu */}
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Actions">
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleActionMenuOpen(e, user)}
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
      {!hasError && !isEmpty && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Showing {users.length} user{users.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      )}

      {/* Action Menu */}
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
          Edit User
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 2, fontSize: 20 }} />
          Delete User
        </MenuItem>
      </Menu>
    </>
  );
};