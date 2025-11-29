import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Pagination, 
  Stack,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Skeleton,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  ArrowBack as BackIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Hooks
import { useSettings } from '../hooks/useSettings';

// Types
import { TabComponentProps, TeamMember, UserRole, TeamInvite, SystemRole } from '../types';

// Skeleton Loading Component
const TeamsSkeleton = () => (
  <Box>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <Box className="md:col-span-4">
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="90%" height={60} />
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Skeleton variant="rectangular" width={120} height={36} />
          <Skeleton variant="rectangular" width={140} height={36} />
        </Box>
      </Box>
      <Box className="md:col-span-8">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="rectangular" width={300} height={40} />
          <Skeleton variant="rectangular" width={100} height={40} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={400} />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Skeleton variant="rectangular" width={300} height={32} />
        </Box>
      </Box>
    </div>
  </Box>
);

// Member Detail Component
const MemberDetail: React.FC<{ member: TeamMember; onBack: () => void }> = ({ member, onBack }) => {
  if (!member) {
    return (
      <Box>
        <Button variant="text" startIcon={<BackIcon />} onClick={onBack} sx={{ mb: 2 }}>
          Back 
        </Button>
        <Typography variant="h6">Member data not available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<BackIcon />} onClick={onBack} sx={{ mb: 3 }}>
        Back to Team Members
      </Button>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>Member Details</Typography>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell>{member.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell>{member.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Date Added</TableCell>
                <TableCell>{member.dateAdded}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell>
                  <Chip 
                    label={member.role} 
                    color={
                      member.role === 'Super Admin' ? 'primary' :
                      member.role === 'Admin' ? 'secondary' : 'default'
                    }
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell>
                  <Chip 
                    label={member.status} 
                    color={
                      member.status === 'active' ? 'success' :
                      member.status === 'pending' ? 'warning' : 'default'
                    }
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

// Dialog Components
const InviteMembersDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSendInvites: (invites: TeamInvite[]) => Promise<boolean>;
  newMembers: TeamInvite[];
  onAddMemberField: () => void;
  onRemoveMemberField: (index: number) => void;
  onMemberChange: (index: number, field: keyof TeamInvite, value: string) => void;
}> = ({ 
  open, 
  onClose, 
  onSendInvites, 
  newMembers, 
  onAddMemberField, 
  onRemoveMemberField, 
  onMemberChange 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSendInvites(newMembers);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Members</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Add members to manage and access your system
        </Typography>

        {newMembers.map((member, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ mr: 2 }}>Email</Typography>
              {index > 0 && (
                <IconButton size="small" onClick={() => onRemoveMemberField(index)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <TextField
              fullWidth
              placeholder="user@example.com"
              value={member.email}
              onChange={(e) => onMemberChange(index, 'email', e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Role</Typography>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={member.role}
                label="Role"
                onChange={(e) => onMemberChange(index, 'role', e.target.value as UserRole)}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Editor">Editor</MenuItem>
                <MenuItem value="Viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ))}

        <Button startIcon={<AddIcon />} onClick={onAddMemberField} sx={{ mt: 1 }}>
          Add another member
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={newMembers.some(m => !m.email) || isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send invites'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EditRoleDialog: React.FC<{
  open: boolean;
  member: TeamMember | null;
  onClose: () => void;
  onSave: (role: UserRole) => Promise<boolean>;
}> = ({ open, member, onClose, onSave }) => {
  const [role, setRole] = useState<UserRole>(member?.role || "Admin");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave(role);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Role</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Editing role for: <strong>{member?.name}</strong>
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>New Role</Typography>
        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <MenuItem value="Super Admin">Super Admin</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Editor">Editor</MenuItem>
            <MenuItem value="Viewer">Viewer</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteMemberDialog: React.FC<{
  open: boolean;
  member: TeamMember | null;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
}> = ({ open, member, onClose, onConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Team Member</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 3 }}>
          Are you sure you want to delete {member?.name}? They will lose all access.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={handleConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Deleting...' : 'Delete Member'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Roles and Permissions Component
const RolesAndPermissions: React.FC<{ 
  onBack: () => void;
  roles: SystemRole[];
  isRolesLoading: boolean;
  rolesSearchTerm: string;
  setRolesSearchTerm: (term: string) => void;
  rolesPage: number;
  setRolesPage: (page: number) => void;
  onAddRoleClick: () => void;
  onRolesMenuOpen: (event: React.MouseEvent<HTMLElement>, role: SystemRole) => void;
  onEditRoleClick: () => void;
  onDeleteRole: (roleId: string) => Promise<boolean>;
  anchorEl: HTMLElement | null;
  onRolesMenuClose: () => void;
  selectedRole: SystemRole | null;
}> = ({ 
  onBack,
  roles,
  isRolesLoading,
  rolesSearchTerm,
  setRolesSearchTerm,
  rolesPage,
  setRolesPage,
  onAddRoleClick,
  onRolesMenuOpen,
  onEditRoleClick,
  onDeleteRole,
  anchorEl,
  onRolesMenuClose,
  selectedRole
}) => {
  // Filter roles based on search term
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(rolesSearchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(rolesSearchTerm.toLowerCase())
  );

  const rolesRowsPerPage = 5;
  const rolesPageCount = Math.ceil(filteredRoles.length / rolesRowsPerPage);
  const displayedRoles = filteredRoles.slice(
    (rolesPage - 1) * rolesRowsPerPage,
    rolesPage * rolesRowsPerPage
  );

  // Format permissions for display
  const formatPermissions = (permissions: string[]) => {
    return permissions.length > 0 ? permissions.join(', ') : 'No permissions';
  };

  const handleDeleteRoleClick = async () => {
    if (selectedRole) {
      await onDeleteRole(selectedRole.id);
    }
  };

  return (
    <Box>
      {/* Header and Actions */}
      <Box>
        <Box sx={{display:'flex', flexDirection:'row', gap: 0.5, alignItems: 'center', mb: 2 }}>
          <Button 
            startIcon={<BackIcon />} 
            onClick={onBack}
            variant='text'
          />
          <Typography variant="h5">
            Roles and Permissions
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Manage system roles and their permissions
        </Typography>
      </Box>

      {/* Search and Add Role */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="Search roles..."
          size="small"
          sx={{ width: 300 }}
          value={rolesSearchTerm}
          onChange={(e) => setRolesSearchTerm(e.target.value)}
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
          onClick={onAddRoleClick}
          disabled={isRolesLoading}
        >
          Add Role
        </Button>
      </Box>

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
            {isRolesLoading ? (
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
                    {formatPermissions(role.permissions)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => onRolesMenuOpen(e, role)}
                      aria-label="actions"
                      disabled={isRolesLoading}
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
          count={rolesPageCount}
          page={rolesPage}
          onChange={(e, value) => setRolesPage(value)}
          color="primary"
          disabled={isRolesLoading}
        />
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onRolesMenuClose}
      >
        <MenuItem onClick={onEditRoleClick}>Edit Role</MenuItem>
        <MenuItem 
          onClick={handleDeleteRoleClick}
          sx={{ color: 'error.main' }}
        >
          Delete Role
        </MenuItem>
      </Menu>
    </Box>
  );
};

/**
 * TeamsTab - Manages team members and their roles with all sub-components included
 */
export const TeamsTab: React.FC<TabComponentProps> = ({ showNotification }) => {
  const {
    teamMembers,
    isTeamLoading,
    teamError,
    teamFilters,
    inviteTeamMembers,
    updateTeamMemberRole,
    removeTeamMember,
    handleTeamRoleFilter,
    roles,
    isRolesLoading,
    deleteRole,
  } = useSettings();

  // View state
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'roles'>('list');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const pageCount = Math.ceil(teamMembers.length / rowsPerPage);

  // Calculate displayed members based on pagination
  const displayedMembers = teamMembers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Dialog and menu states
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentActionMember, setCurrentActionMember] = useState<TeamMember | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Roles management states
  const [selectedRole, setSelectedRole] = useState<SystemRole | null>(null);
  const [rolesSearchTerm, setRolesSearchTerm] = useState('');
  const [rolesPage, setRolesPage] = useState(1);

  // Invite members state
  const [newMembers, setNewMembers] = useState<TeamInvite[]>([{ email: "", role: "Admin" as UserRole }]);

  // Available roles for filtering
  const availableRoles = ['All', 'Super Admin', 'Admin', 'Editor', 'Viewer'];

  // Handlers for main team functionality
  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, member: TeamMember) => {
    setAnchorEl(event.currentTarget);
    setCurrentActionMember(member);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentActionMember(null);
  };

  const handleViewDetails = () => {
    if (currentActionMember) {
      setSelectedMember(currentActionMember);
      setViewMode('detail');
    }
    handleMenuClose();
  };

  const handleEditMember = () => {
    if (currentActionMember) {
      setSelectedMember(currentActionMember);
      setOpenEditDialog(true);
    }
    handleMenuClose();
  };

  const handleDeleteMemberMenu = () => {
    if (currentActionMember) {
      setMemberToDelete(currentActionMember);
      setOpenDeleteDialog(true);
    }
    handleMenuClose();
  };

  const handleRoleFilterChange = (role: string) => {
    handleTeamRoleFilter(role);
    setShowFilterMenu(false);
  };

  const handleSendInvites = async (invites: TeamInvite[]): Promise<boolean> => {
    try {
      const success = await inviteTeamMembers(invites);
      if (success) {
        showNotification('Invites sent successfully!', 'success');
        setOpenInviteDialog(false);
        setNewMembers([{ email: "", role: "Admin" }]);
        return true;
      } else {
        showNotification('Failed to send invites', 'error');
        return false;
      }
    } catch {
      showNotification('Failed to send invites', 'error');
      return false;
    }
  };

  const handleSaveRole = async (newRole: UserRole): Promise<boolean> => {
    if (!selectedMember) return false;
    
    try {
      const success = await updateTeamMemberRole({
        memberId: selectedMember.id,
        newRole
      });
      if (success) {
        showNotification('Role updated successfully!', 'success');
        setOpenEditDialog(false);
        return true;
      } else {
        showNotification('Failed to update role', 'error');
        return false;
      }
    } catch {
      showNotification('Failed to update role', 'error');
      return false;
    }
  };

  const handleDeleteMember = async (): Promise<boolean> => {
    if (!memberToDelete) return false;
    
    try {
      const success = await removeTeamMember(memberToDelete.id);
      if (success) {
        showNotification('Member removed successfully!', 'success');
        setOpenDeleteDialog(false);
        return true;
      } else {
        showNotification('Failed to remove member', 'error');
        return false;
      }
    } catch {
      showNotification('Failed to remove member', 'error');
      return false;
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedMember(null);
  };

  // Handlers for roles management
  const handleAddMemberField = () => {
    setNewMembers([...newMembers, { email: "", role: "Admin" as UserRole }]);
  };

  const handleRemoveMemberField = (index: number) => {
    const updatedMembers = [...newMembers];
    updatedMembers.splice(index, 1);
    setNewMembers(updatedMembers);
  };

  const handleMemberChange = (index: number, field: keyof TeamInvite, value: string) => {
    const updatedMembers = [...newMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setNewMembers(updatedMembers);
  };

  const handleRolesMenuOpen = (event: React.MouseEvent<HTMLElement>, role: SystemRole) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };

  const handleRolesMenuClose = () => {
    setAnchorEl(null);
    setSelectedRole(null);
  };

  const handleAddRoleClick = () => {
    showNotification('Add role functionality would be implemented here', 'info');
  };

  const handleEditRoleClick = () => {
    if (!selectedRole) return;
    showNotification(`Edit role functionality for ${selectedRole.name} would be implemented here`, 'info');
    handleRolesMenuClose();
  };

  const handleDeleteRole = async (roleId: string): Promise<boolean> => {
    if (!selectedRole) return false;
    
    try {
      const success = await deleteRole(roleId);
      if (success) {
        showNotification('Role deleted successfully!', 'success');
        handleRolesMenuClose();
        return true;
      } else {
        showNotification('Failed to delete role', 'error');
        return false;
      }
    } catch {
      showNotification('Failed to delete role', 'error');
      return false;
    }
  };

  if (isTeamLoading && viewMode === 'list') {
    return <TeamsSkeleton />;
  }

  if (teamError && teamMembers.length === 0 && viewMode === 'list') {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {teamError}
      </Alert>
    );
  }

  return (
    <Box>
      {viewMode === 'list' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column - Header and Action Buttons */}
            <Box className="md:col-span-4">
              <Typography variant="h6" sx={{ mb: 1 }}>
                Team Members
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Manage your existing team and change roles/permissions.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<EditIcon />}
                  onClick={() => setViewMode('roles')}
                  disabled={isTeamLoading}
                >
                  Edit Roles
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => setOpenInviteDialog(true)}
                  disabled={isTeamLoading}
                >
                  Invite Members
                </Button>
              </Box>
            </Box>
            
            {/* Right Column - Search, Table, and Pagination */}
            <Box className="md:col-span-8">
              {/* Search and Filters */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, position: 'relative' }}>
                <TextField
                  placeholder="Search team members..."
                  size="small"
                  sx={{ width: 300 }}
                  value={teamFilters.searchQuery}
                  disabled={isTeamLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  disabled={isTeamLoading}
                  sx={{ position: 'relative' }}
                >
                  Filter
                  {teamFilters.roleFilter !== 'All' && (
                    <Chip 
                      label={teamFilters.roleFilter} 
                      size="small"
                      sx={{ ml: 1 }} 
                    />
                  )}
                </Button>

                {showFilterMenu && (
                  <Paper sx={{ 
                    position: 'absolute', 
                    top: 45, 
                    right: 0,
                    zIndex: 1,
                    p: 2,
                    minWidth: 200
                  }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Filter by Role</Typography>
                    <Stack spacing={1}>
                      {availableRoles.map(role => (
                        <Button
                          key={role}
                          variant={teamFilters.roleFilter === role ? "contained" : "text"}
                          onClick={() => handleRoleFilterChange(role)}
                          fullWidth
                          sx={{ justifyContent: 'flex-start' }}
                        >
                          {role}
                        </Button>
                      ))}
                    </Stack>
                  </Paper>
                )}
              </Box>

              {/* Member Table */}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedMembers.length > 0 ? (
                      displayedMembers.map((member) => (
                        <TableRow key={member.id} hover>
                          <TableCell>
                            <Typography fontWeight="medium">
                              {member.name}
                            </Typography>
                          </TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            <Chip 
                              label={member.role} 
                              size="small"
                              color={
                                member.role === 'Super Admin' ? 'primary' :
                                member.role === 'Admin' ? 'secondary' : 'default'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={member.status} 
                              size="small"
                              color={
                                member.status === 'active' ? 'success' :
                                member.status === 'pending' ? 'warning' : 'default'
                              }
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              aria-label="more"
                              aria-controls="member-menu"
                              aria-haspopup="true"
                              onClick={(e) => handleMenuOpen(e, member)}
                              disabled={isTeamLoading}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No team members found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {pageCount > 1 && (
                <Pagination 
                  count={pageCount} 
                  page={page} 
                  onChange={handlePageChange}
                  sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
                  disabled={isTeamLoading}
                />
              )}

              {/* Action Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleViewDetails}>View Details</MenuItem>
                <MenuItem onClick={handleEditMember}>Edit Role</MenuItem>
                <MenuItem 
                  onClick={handleDeleteMemberMenu} 
                  sx={{ color: 'error.main' }}
                >
                  Delete Member
                </MenuItem>
              </Menu>
            </Box>
          </div>
        </>
      )}

      {viewMode === 'detail' && selectedMember && (
        <MemberDetail 
          member={selectedMember} 
          onBack={handleBackToList} 
        />
      )}

      {viewMode === 'roles' && (
        <RolesAndPermissions 
          onBack={handleBackToList}
          roles={roles}
          isRolesLoading={isRolesLoading}
          rolesSearchTerm={rolesSearchTerm}
          setRolesSearchTerm={setRolesSearchTerm}
          rolesPage={rolesPage}
          setRolesPage={setRolesPage}
          onAddRoleClick={handleAddRoleClick}
          onRolesMenuOpen={handleRolesMenuOpen}
          onEditRoleClick={handleEditRoleClick}
          onDeleteRole={handleDeleteRole}
          anchorEl={anchorEl}
          onRolesMenuClose={handleRolesMenuClose}
          selectedRole={selectedRole}
        />
      )}

      {/* Dialogs */}
      <InviteMembersDialog
        open={openInviteDialog}
        onClose={() => setOpenInviteDialog(false)}
        onSendInvites={handleSendInvites}
        newMembers={newMembers}
        onAddMemberField={handleAddMemberField}
        onRemoveMemberField={handleRemoveMemberField}
        onMemberChange={handleMemberChange}
      />

      <EditRoleDialog
        open={openEditDialog}
        member={selectedMember}
        onClose={() => setOpenEditDialog(false)}
        onSave={handleSaveRole}
      />

      <DeleteMemberDialog
        open={openDeleteDialog}
        member={memberToDelete}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteMember}
      />
    </Box>
  );
};