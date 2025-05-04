import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Button, 
  TextField,
  InputAdornment,
  Paper,
  Pagination,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { 
  Search as SearchIcon,
  ArrowBack as BackIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

// Redux actions and selectors
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  selectRoles,
  selectRolesLoading,
  selectRolesError
} from '../../../store/slices/settingsSlice';

// Available permissions for roles
const AVAILABLE_PERMISSIONS = [
  'View Dashboard',
  'Manage Content',
  'Manage Users',
  'Manage Settings',
  'View Reports',
  'Manage Billing',
  'API Access'
];

/**
 * RolesAndPermissions - Manages system roles and their permissions
 * Features:
 * - View all system roles
 * - Create new roles with specific permissions
 * - Edit existing roles
 * - Delete roles
 * - Search and paginate through roles
 */
const RolesAndPermissions = ({ onBack, showNotification }) => {
  const dispatch = useDispatch();
  
  // Select data from Redux store
  const roles = useSelector(selectRoles);
  const loading = useSelector(selectRolesLoading);
  const error = useSelector(selectRolesError);

  // Local state for UI
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Form state
  const [roleForm, setRoleForm] = useState({
    id: '',
    name: '',
    description: '',
    permissions: []
  });

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  // Load roles when component mounts
  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  // Filter roles based on search term
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const pageCount = Math.ceil(filteredRoles.length / rowsPerPage);
  const displayedRoles = filteredRoles.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Handlers
  const handleMenuOpen = (event, role) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRole(null);
  };

  const handleAddClick = () => {
    setRoleForm({
      id: '',
      name: '',
      description: '',
      permissions: []
    });
    setOpenAddDialog(true);
  };

  const handleEditClick = () => {
    if (!selectedRole) return;
    setRoleForm({
      id: selectedRole.id,
      name: selectedRole.name,
      description: selectedRole.description,
      permissions: [...selectedRole.permissions]
    });
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    
    try {
      await dispatch(deleteRole(selectedRole.id)).unwrap();
      showNotification('Role deleted successfully!', 'success');
      handleMenuClose();
    } catch (error) {
      showNotification(error.message || 'Failed to delete role', 'error');
    }
  };

  const handlePermissionToggle = (permission) => {
    setRoleForm(prev => {
      const newPermissions = prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission];
      
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSaveRole = async (isEdit = false) => {
    try {
      if (isEdit) {
        await dispatch(updateRole({
          roleId: roleForm.id,
          roleData: {
            name: roleForm.name,
            description: roleForm.description,
            permissions: roleForm.permissions
          }
        })).unwrap();
        showNotification('Role updated successfully!', 'success');
      } else {
        await dispatch(createRole({
          name: roleForm.name,
          description: roleForm.description,
          permissions: roleForm.permissions
        })).unwrap();
        showNotification('Role created successfully!', 'success');
      }
      
      setOpenAddDialog(false);
      setOpenEditDialog(false);
    } catch (error) {
      showNotification(error.message || 'Failed to save role', 'error');
    }
  };

  return (
    <Box>
      {/* Header and Actions */}
      <Button 
        startIcon={<BackIcon />} 
        onClick={onBack}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Roles and Permissions
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Manage system roles and their permissions
      </Typography>

      {/* Search and Add Role */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="Search roles..."
          size="small"
          sx={{ width: 300 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          disabled={loading}
        >
          Add Role
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error.message || 'Error loading roles'}
        </Typography>
      )}

      {/* Roles Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Loading roles...
                </TableCell>
              </TableRow>
            ) : displayedRoles.length > 0 ? (
              displayedRoles.map((role) => (
                <TableRow key={role.id} hover>
                  <TableCell>
                    <Typography fontWeight="medium">{role.name}</Typography>
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    {role.permissions.join(', ')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, role)}
                      aria-label="actions"
                      disabled={loading}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No roles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2">
          Showing {filteredRoles.length} roles
        </Typography>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
          disabled={loading}
        />
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>Edit Role</MenuItem>
        <MenuItem 
          onClick={handleDeleteRole}
          sx={{ color: 'error.main' }}
        >
          Delete Role
        </MenuItem>
      </Menu>

      {/* Add Role Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Add New Role</DialogTitle>
        <DialogContent>
          <TextField
            label="Role Name"
            fullWidth
            margin="normal"
            value={roleForm.name}
            onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
            disabled={loading}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={roleForm.description}
            onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
            disabled={loading}
          />
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Permissions
          </Typography>
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
            {AVAILABLE_PERMISSIONS.map(permission => (
              <FormControlLabel
                key={permission}
                control={
                  <Checkbox
                    checked={roleForm.permissions.includes(permission)}
                    onChange={() => handlePermissionToggle(permission)}
                    disabled={loading}
                  />
                }
                label={permission}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => handleSaveRole(false)}
            disabled={!roleForm.name || loading}
          >
            {loading ? 'Creating...' : 'Create Role'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent>
          <TextField
            label="Role Name"
            fullWidth
            margin="normal"
            value={roleForm.name}
            onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
            disabled={loading}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={roleForm.description}
            onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
            disabled={loading}
          />
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Permissions
          </Typography>
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
            {AVAILABLE_PERMISSIONS.map(permission => (
              <FormControlLabel
                key={permission}
                control={
                  <Checkbox
                    checked={roleForm.permissions.includes(permission)}
                    onChange={() => handlePermissionToggle(permission)}
                    disabled={loading}
                  />
                }
                label={permission}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => handleSaveRole(true)}
            disabled={!roleForm.name || loading}
          >
            {loading ? 'Updating...' : 'Update Role'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolesAndPermissions;