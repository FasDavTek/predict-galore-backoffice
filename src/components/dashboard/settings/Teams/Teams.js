import { useState, useEffect } from 'react';
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
  Paper
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import MemberDetail from './MemberDetail';
import MembersTable from './MembersTable';
import { 
  InviteMembersDialog, 
  EditRoleDialog, 
  DeleteMemberDialog 
} from './Dialogs';

import RolesAndPermissions from './RolesAndPermissions';

// Mock data
const allTeamMembers = [
  { id: 1, name: "Andrew Smith", email: "andrewsmith@email.com", date: "Apr 12, 2023 09:32AM", role: "Super Admin" },
  { id: 2, name: "Jane Doe", email: "janedoe@email.com", date: "Apr 11, 2023 10:15AM", role: "Admin" },
  { id: 3, name: "John Johnson", email: "johnjohnson@email.com", date: "Apr 10, 2023 02:45PM", role: "Admin" },
  { id: 4, name: "Sarah Williams", email: "sarahw@email.com", date: "Apr 9, 2023 11:20AM", role: "Editor" },
  { id: 5, name: "Michael Brown", email: "michaelb@email.com", date: "Apr 8, 2023 04:30PM", role: "Viewer" },
];

const TeamsTab = () => {
  // View state
  const [viewMode, setViewMode] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [showRolesView, setShowRolesView] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [displayedMembers, setDisplayedMembers] = useState([]);
  const pageCount = Math.ceil(filteredMembers.length / rowsPerPage);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Dialog state
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentActionMember, setCurrentActionMember] = useState(null);

  // Initialize and filter members
  useEffect(() => {
    let result = [...allTeamMembers];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(member => 
        member.name.toLowerCase().includes(term) || 
        member.email.toLowerCase().includes(term)
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'All') {
      result = result.filter(member => member.role === roleFilter);
    }
    
    setFilteredMembers(result);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, roleFilter]);

  // Update displayed members when page or filters change
  useEffect(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setDisplayedMembers(filteredMembers.slice(startIndex, endIndex));
  }, [page, filteredMembers]);

  // Handlers
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setViewMode(true);
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
    setViewMode(true);
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
    setSearchTerm(e.target.value);
  };

  const handleRoleFilterChange = (role) => {
    setRoleFilter(role);
    setShowFilterMenu(false);
  };

  const handleSendInvites = (invites) => {
    console.log('Invites sent:', invites);
    setOpenInviteDialog(false);
    alert('Invites sent successfully!');
  };

  const handleSaveRole = (newRole) => {
    console.log(`Role changed to ${newRole} for ${selectedMember.name}`);
    setOpenEditDialog(false);
    alert('Role updated successfully!');
  };

  const handleDeleteMember = () => {
    console.log(`Deleting member: ${memberToDelete.name}`);
    setOpenDeleteDialog(false);
    alert('Member deleted successfully!');
  };

  return (
    <Box>
    {showRolesView ? (
      <RolesAndPermissions onBack={() => setShowRolesView(false)} />
    ) : viewMode ? (
      <MemberDetail 
        member={selectedMember} 
        onBack={() => setViewMode(false)} 
      />
    ) : (
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
  onClick={() => setShowRolesView(true)}
>
  Edit Roles
</Button>

              <Button 
                variant="contained" 
                onClick={() => setOpenInviteDialog(true)}
              >
                Invite Members
              </Button>
            </Box>

          </Box>
          

          {/* Right Column - Search, Table, and Pagination */}
        <Box className="md:col-span-8">
          {/* Search and Filters */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField
              placeholder="Search team members..."
              size="small"
              sx={{ width: 300 }}
              value={searchTerm}
              onChange={handleSearchChange}
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
                  {['All', 'Super Admin', 'Admin', 'Editor', 'Viewer'].map(role => (
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
          <MembersTable
            members={displayedMembers}
            selectedMember={selectedMember}
            onSelectMember={handleSelectMember}
            onMenuOpen={handleMenuOpen}
          />

          {/* Pagination */}
          {pageCount > 1 && (
            <Pagination 
              count={pageCount} 
              page={page} 
              onChange={handlePageChange}
              sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
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