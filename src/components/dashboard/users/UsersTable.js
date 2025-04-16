// components/dashboard/users/UsersTable.js
import React from 'react';
import {
  Box,
  Card,
  TextField,
  InputAdornment,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Skeleton,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import Image from 'next/image';

const UsersTable = ({
  users = [],
  loading = false,
  searchQuery = '',
  onSearchChange,
  onExportCSV,
  onFilterClick,
  exportLoading = false
}) => {
  // Table columns configuration
  const columns = [
    { id: 'checkbox', label: '', width: 60, align: 'center' },
    { id: 'id', label: 'ID', width: 116 },
    { id: 'fullName', label: 'Full Name' },
    { id: 'subscription', label: 'Subscription', width: 116 },
    { id: 'email', label: 'Email Address', width: 240 },
    { id: 'phone', label: 'Phone Number', width: 180 },
    { id: 'location', label: 'Location', width: 198 },
    { id: 'actions', label: 'Actions', width: 48 }
  ];

  // Loading skeleton for table rows
  const renderLoadingSkeletons = () => {
    return Array(5).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {columns.map((column) => (
          <TableCell key={column.id} sx={{ width: column.width }}>
            <Skeleton variant="text" animation="wave" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  // Empty state component
  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={columns.length} sx={{ border: 'none' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 3,
          py: 8 
        }}>
          <Box sx={{ 
            width: 140, 
            height: 140, 
            bgcolor: '#F7F7F8', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Image 
              src="/images/no-data.svg" 
              alt="No users" 
              width={90} 
              height={72} 
              priority
            />
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

  return (
    <Card sx={{ border: '1px solid #EEEEF0' }}>
      {/* Table Toolbar with search and actions */}
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search users..."
            variant="outlined"
            size="small"
            sx={{ width: 304 }}
            value={searchQuery}
            onChange={onSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#919393' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={onFilterClick}
            sx={{ 
              color: '#737584',
              borderColor: '#737584',
              '&:hover': {
                borderColor: '#414147',
                bgcolor: '#F7F7F8'
              }
            }}
          >
            Filter
          </Button>
        </Box>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={onExportCSV}
          disabled={exportLoading}
          sx={{ 
            color: '#737584',
            borderColor: '#737584',
            '&:hover': {
              borderColor: '#414147',
              bgcolor: '#F7F7F8'
            }
          }}
        >
          {exportLoading ? 'Exporting...' : 'Export CSV'}
        </Button>
      </Box>

      {/* Table Content */}
      <TableContainer>
        <Table>
          {/* Table Header */}
          <TableHead sx={{ bgcolor: '#F7F7F8' }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{ 
                    width: column.width,
                    borderRight: '1px solid #EEEEF0',
                    textAlign: column.align || 'left'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {loading ? (
              renderLoadingSkeletons()
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell padding="checkbox" sx={{ borderRight: '1px solid #EEEEF0' }}>
                    <Checkbox size="small" />
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #EEEEF0' }}>{user.id}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #EEEEF0' }}>{user.fullName}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #EEEEF0' }}>{user.subscription}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #EEEEF0' }}>{user.email}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #EEEEF0' }}>{user.phone}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #EEEEF0' }}>{user.location}</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              ))
            ) : (
              renderEmptyState()
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default UsersTable;