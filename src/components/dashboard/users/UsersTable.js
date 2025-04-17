import React, {useState} from 'react';
import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Typography,
  Avatar,
  Pagination,
  Stack,
  Button,
  TextField,
  InputAdornment,
  Breadcrumbs,
  Link,
  Skeleton,
  Chip,
  Menu,
  MenuItem,
  FormControl,
  Select,
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  Home as HomeIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';

import Image from 'next/image';
import UserActionsMenu from './UserActionsMenu';
import UserDetailView from './UserDetailView';

/**
 * UsersTable - Displays a table of users with sorting, pagination and actions
 */
const UsersTable = ({
  users = [],
  loading = false,
  searchQuery = '',
  onSearchChange,
  onFilterClick,
  statusFilter,
  planFilter,
  onStatusFilterChange = () => {},
  onPlanFilterChange = () => {},   
  onExportCSV,
  exportLoading = false,
  selectedUser,
  onUserSelect,
  onBackToList,
  page = 1,
  setPage = () => {}
}) => {
  // Constants for pagination
  const PAGE_SIZE = 10;
  const pageCount = Math.ceil(users.length / PAGE_SIZE);
  const paginatedUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  // If a user is selected, show detailed view instead of table
  if (selectedUser) {
    return (
      <Box>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link 
            color="inherit" 
            onClick={onBackToList}
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Users
          </Link>
          <Typography color="text.primary">{selectedUser.fullName}</Typography>
        </Breadcrumbs>
        <UserDetailView 
          user={selectedUser} 
          onBack={onBackToList}
          users={users}
          loading={loading}
          onUserSelect={onUserSelect}
        />
      </Box>
    );
  }

  // Helper to get color for status chips
  const getChipColor = (status) => {
    const statusMap = {
      premium: 'primary',
      free: 'default',
      pro: 'secondary',
      expired: 'error'
    };
    return statusMap[status?.toLowerCase()] || 'info';
  };

  // Loading skeleton rows
  const renderLoadingSkeletons = () => {
    return Array(PAGE_SIZE).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell padding="checkbox"><Skeleton variant="rectangular" width={20} height={20} /></TableCell>
        <TableCell><Skeleton variant="text" /></TableCell>
        <TableCell><Box display="flex" alignItems="center" gap={2}><Skeleton variant="circular" width={40} height={40} /><Skeleton variant="text" width={100} /></Box></TableCell>
        <TableCell><Skeleton variant="text" width={80} /></TableCell>
        <TableCell><Skeleton variant="text" width={150} /></TableCell>
        <TableCell><Skeleton variant="text" width={120} /></TableCell>
        <TableCell><Skeleton variant="text" width={100} /></TableCell>
      </TableRow>
    ));
  };

  // Empty state display
  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={8} sx={{ border: 'none' }}>
        <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Box sx={{ width: 140, height: 140, bgcolor: '#F7F7F8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src="/empty-state.png" alt="No users" width={90} height={72} priority />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#101012', mb: 1 }}>
              {loading ? 'Loading users...' : 'No Users Found'}
            </Typography>
            <Typography sx={{ color: '#8B8D97' }}>
              {loading ? 'Please wait while we load user data' : 'User accounts will appear here once they register.'}
            </Typography>
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  );

  // Helper to get user initials for avatars
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '';
  };

  return (
    <Box>
      {/* Table toolbar with search and actions */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search users..."
            variant="outlined"
            size="small"
            sx={{ width: 300 }}
            value={searchQuery}
            onChange={onSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
          
          {/* Filter Button with Dropdown */}
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterMenuOpen}
          >
            Filter
          </Button>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterMenuClose}
          >
            <MenuItem>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => {
                    onStatusFilterChange(e.target.value);
                    handleFilterMenuClose();
                  }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </MenuItem>
            <MenuItem>
              <FormControl fullWidth size="small">
                <InputLabel>Plan</InputLabel>
                <Select
                  value={planFilter}
                  label="Plan"
                  onChange={(e) => {
                    onPlanFilterChange(e.target.value);
                    handleFilterMenuClose();
                  }}
                >
                  <MenuItem value="all">All Plans</MenuItem>
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                  <MenuItem value="pro">Pro</MenuItem>
                </Select>
              </FormControl>
            </MenuItem>
          </Menu>
        </Box>
        

        
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={onExportCSV}
          disabled={exportLoading}
        >
          {exportLoading ? 'Exporting...' : 'Export CSV'}
        </Button>
      </Box>

      {/* Main table content */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell padding="checkbox"><Checkbox /></TableCell>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? renderLoadingSkeletons() : 
             users.length > 0 ? paginatedUsers.map((user) => (
                <TableRow key={user.id} hover sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUser?.id === user.id}
                      onChange={() => onUserSelect(user)}
                    />
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: getInitials(user.id).match(/[0-9]/) ? 'error.light' : 'success.light' }}>
                        {getInitials(user.fullName)}
                      </Avatar>
                      <Typography>{user.fullName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.subscription} 
                      color={getChipColor(user.subscription)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell align="right">
                    <UserActionsMenu user={user} onViewDetails={() => onUserSelect(user)} />
                  </TableCell>
                </TableRow>
              )) : renderEmptyState()}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination controls */}
      {users.length > 0 && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Page {page} of {pageCount}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
              shape="rounded"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            />
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<NavigateBeforeIcon />}
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                endIcon={<NavigateNextIcon />}
                disabled={page === pageCount}
                onClick={() => setPage(p => p + 1)}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Next
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default UsersTable;