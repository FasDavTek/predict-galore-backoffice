// components/dashboard/users/UserDetailView.js
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format, parseISO, isValid } from 'date-fns';

const UserDetailView = ({ user, onBack }) => {
  // Safely format the date with comprehensive fallbacks
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const parsedDate = typeof dateString === 'string' 
        ? parseISO(dateString) 
        : new Date(dateString);
      
      return isValid(parsedDate) ? format(parsedDate, 'PPpp') : 'N/A';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  // Ensure we have a valid user object
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

  return (
    <Box>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={onBack}
        sx={{ mb: 2 }}
      >
        Back to Users
      </Button>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">{user.fullName || 'Unknown User'}</Typography>
            <Chip 
              label={user.subscription || 'Unknown'} 
              color={user.subscription === 'Premium' ? 'primary' : 'default'}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={3}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">User ID</Typography>
              <Typography>{user.id || 'N/A'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Email</Typography>
              <Typography>{user.email || 'N/A'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
              <Typography>{user.phone || 'N/A'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Location</Typography>
              <Typography>{user.location || 'N/A'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Status</Typography>
              <Typography>{user.status || 'Active'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">Joined Date</Typography>
              <Typography>{formatDate(user.createdAt)}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDetailView;