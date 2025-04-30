// components/dashboard/settings/Teams/Teams.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  IconButton
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';

// Redux actions and selectors
import {
  fetchTeamMembers,
  inviteTeamMembers,
  updateTeamMemberRole,
  removeTeamMember,
  setTeamSearchQuery,
  setTeamRoleFilter,
  selectFilteredTeamMembers,
  selectTeamLoading,
  selectTeamError,
  selectTeamSearchQuery,
  selectTeamRoleFilter
} from '@/store/slices/settingsSlice';

// Components
import MemberDetail from './MemberDetail';
import RolesAndPermissions from './RolesAndPermissions';
import { InviteMembersDialog, EditRoleDialog, DeleteMemberDialog } from './Dialogs';

/**
 * TeamsTab - Manages team members and their roles
 * Features:
 * - View team members list with pagination
 * - Filter members by name/email and role
 * - Edit member roles
 * - Remove members
 * - Invite new members
 * - Access roles and permissions management
 */
const TeamsTab = ({ showNotification }) => {
  const dispatch = useDispatch();
  
  // Select data from Redux store
  const members = useSelector(selectFilteredTeamMembers);
  const loading = useSelector(selectTeamLoading);
  const error = useSelector(selectTeamError);
  const searchQuery = useSelector(selectTeamSearchQuery);
  const roleFilter = useSelector(selectTeamRoleFilter);

  // View state
  const [viewMode, setViewMode] = useState('list'); // 'list', 'detail', 'roles'
  const [selectedMember, setSelectedMember] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const pageCount = Math.ceil(members.length / rowsPerPage);

  // Calculate displayed members based on pagination
  const displayedMembers = members.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Dialog and menu states
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentActionMember, setCurrentActionMember] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Load team members when component mounts
  useEffect(() => {
    dispatch(fetchTeamMembers());
  }, [dispatch]);

  // Handlers
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setViewMode('detail');
  };

  const handleMenuOpen = (event, member) => {
    setAnchorEl(event.currentTarget);
    setCurrentActionMember(member);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentActionMember(null);
  };

  const handleViewDetails = () => {
    setSelectedMember(currentActionMember);
    setViewMode('detail');
    handleMenuClose();
  };

  const handleEditMember = () => {
    setSelectedMember(currentActionMember);
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleDeleteMemberMenu = () => {
    setMemberToDelete(currentActionMember);
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleSearchChange = (e) => {
    dispatch(setTeamSearchQuery(e.target.value));
  };

  const handleRoleFilterChange = (role) => {
    dispatch(setTeamRoleFilter(role));
    setShowFilterMenu(false);
  };

  const handleSendInvites = async (emails) => {
    try {
      await dispatch(inviteTeamMembers(emails)).unwrap();
      showNotification('Invites sent successfully!', 'success');
      setOpenInviteDialog(false);
      dispatch(fetchTeamMembers()); // Refresh the members list
    } catch (error) {
      showNotification(error.message || 'Failed to send invites', 'error');
    }
  };

  const handleSaveRole = async (newRole) => {
    if (!selectedMember) return;
    
    try {
      await dispatch(updateTeamMemberRole({
        memberId: selectedMember.id,
        newRole
      })).unwrap();
      showNotification('Role updated successfully!', 'success');
      setOpenEditDialog(false);
      dispatch(fetchTeamMembers()); // Refresh the members list
    } catch (error) {
      showNotification(error.message || 'Failed to update role', 'error');
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    
    try {
      await dispatch(removeTeamMember(memberToDelete.id)).unwrap();
      showNotification('Member removed successfully!', 'success');
      setOpenDeleteDialog(false);
      dispatch(fetchTeamMembers()); // Refresh the members list
    } catch (error) {
      showNotification(error.message || 'Failed to remove member', 'error');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedMember(null);
  };

  // Available roles for filtering
  const availableRoles = ['All', 'Super Admin', 'Admin', 'Editor', 'Viewer'];

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
                  disabled={loading}
                >
                  Edit Roles
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => setOpenInviteDialog(true)}
                  disabled={loading}
                >
                  Invite Members
                </Button>
              </Box>
              {error && (
                <Typography color="error" variant="body2">
                  {error.message || 'Error loading team members'}
                </Typography>
              )}
            </Box>
            
            {/* Right Column - Search, Table, and Pagination */}
            <Box className="md:col-span-8">
              {/* Search and Filters */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <TextField
                  placeholder="Search team members..."
                  size="small"
                  sx={{ width: 300 }}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  disabled={loading}
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
                  disabled={loading}
                  sx={{ position: 'relative' }}
                >
                  Filter
                  {roleFilter !== 'All' && (
                    <Chip 
                      label={roleFilter} 
                      size="small"
                      sx={{ ml: 1 }} 
                    />
                  )}
                </Button>

                {showFilterMenu && (
                  <Paper sx={{ 
                    position: 'absolute', 
                    top: 160, 
                    left: 320,
                    zIndex: 1,
                    p: 2,
                    minWidth: 200
                  }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Filter by Role</Typography>
                    <Stack spacing={1}>
                      {availableRoles.map(role => (
                        <Button
                          key={role}
                          variant={roleFilter === role ? "contained" : "text"}
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
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Loading team members...
                        </TableCell>
                      </TableRow>
                    ) : displayedMembers.length > 0 ? (
                      displayedMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="more"
                              aria-controls="member-menu"
                              aria-haspopup="true"
                              onClick={(e) => handleMenuOpen(e, member)}
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
                          No team members found
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
                  disabled={loading}
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
          showNotification={showNotification}
        />
      )}

      {/* Dialogs */}
      <InviteMembersDialog
        open={openInviteDialog}
        onClose={() => setOpenInviteDialog(false)}
        onSendInvites={handleSendInvites}
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

export default TeamsTab;