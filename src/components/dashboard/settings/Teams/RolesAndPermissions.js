import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField,
  InputAdornment,
  Paper,
  Stack,
  Pagination,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Search as SearchIcon,
  ArrowBack as BackIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

const RolesAndPermissions = ({ onBack }) => {
  // State for roles data
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Super Administrator',
      description: 'Unrestricted access to all system features',
      permissions: ['All permissions'],
      createdAt: '2023-01-15'
    },
    {
      id: 2,
      name: 'Administrator',
      description: 'Manage day-to-day operations and content',
      permissions: ['Content management', 'User management'],
      createdAt: '2023-02-20'
    },
    {
      id: 3,
      name: 'Content Editor',
      description: 'Create and edit content',
      permissions: ['Content creation', 'Content editing'],
      createdAt: '2023-03-10'
    }
  ]);

  // State for add role dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: []
  });

  // State for action menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Handle menu open
  const handleMenuOpen = (event, role) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRole(null);
  };

  // Handle add role
  const handleAddRole = () => {
    const newRoleWithId = {
      ...newRole,
      id: roles.length + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRoles([...roles, newRoleWithId]);
    setOpenAddDialog(false);
    setNewRole({ name: '', description: '', permissions: [] });
  };

  // Handle delete role
  const handleDeleteRole = () => {
    setRoles(roles.filter(role => role.id !== selectedRole.id));
    handleMenuClose();
  };

  return (
    <Box>
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="Search roles..."
          size="small"
          sx={{ width: 300 }}
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
          onClick={() => setOpenAddDialog(true)}
        >
          Add Role
        </Button>
      </Box>

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
            {roles.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((role) => (
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
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2">
          Showing {roles.length} roles
        </Typography>
        <Pagination
          count={Math.ceil(roles.length / rowsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit Role</MenuItem>
        <MenuItem onClick={handleDeleteRole} sx={{ color: 'error.main' }}>Delete Role</MenuItem>
      </Menu>

      {/* Add Role Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Role</DialogTitle>
        <DialogContent>
          <TextField
            label="Role Name"
            fullWidth
            margin="normal"
            value={newRole.name}
            onChange={(e) => setNewRole({...newRole, name: e.target.value})}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={newRole.description}
            onChange={(e) => setNewRole({...newRole, description: e.target.value})}
          />
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Permissions
          </Typography>
          {/* Permission selection would go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddRole}
            disabled={!newRole.name}
          >
            Create Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolesAndPermissions;