// components/dashboard/ActivityLog.js
import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Divider,
  Button,
  Skeleton,
  Avatar,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  ChevronRight as ViewAllIcon,
  Payment as PaymentIcon,
  Star as PremiumIcon,
  Edit as PredictionIcon
} from '@mui/icons-material';

// Fallback data in case API fails
const fallbackData = [
  {
    id: 1,
    type: 'payment',
    title: 'Subscription payment',
    description: 'User paid for premium subscription'
  },
  {
    id: 2,
    type: 'upgrade',
    title: 'Account Upgrade',
    description: 'User subscribed to premium plan'
  },
  {
    id: 3,
    type: 'prediction',
    title: 'New Prediction',
    description: 'Admin added new prediction'
  }
];

const ActivityLog = ({ 
  title = 'Activity Log',
  activities = [],
  loading = false,
  onViewAll,
  isFullScreen = false
}) => {
  // Use real data if available, otherwise use fallback data
  const displayData = activities.length > 0 ? activities : fallbackData;
  
  // Choose icon based on activity type
  const getActivityIcon = (type) => {
    switch(type) {
      case 'payment': return <PaymentIcon color="success" />;
      case 'upgrade': return <PremiumIcon color="primary" />;
      case 'prediction': return <PredictionIcon color="secondary" />;
      default: return <PaymentIcon />;
    }
  };

  return (
    <Box sx={{
      width: '100%',
      p: 3,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      bgcolor: 'background.paper',
      // Full height in full-screen mode
      height: isFullScreen ? 'calc(100vh - 200px)' : 'auto'
    }}>
      {/* Show header and "View All" button only in compact mode */}
      {!isFullScreen && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <Button 
            endIcon={<ViewAllIcon />}
            onClick={onViewAll}
            size="small"
            sx={{ textTransform: 'none' }}
            variant='text'
          >
            View all
          </Button>
        </Stack>
      )}

      {/* Loading state */}
      {loading ? (
        <Stack spacing={2}>
          {[1, 2, 3].map((item) => (
            <Box key={item}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="90%" height={20} />
              <Divider sx={{ my: 2 }} />
            </Box>
          ))}
        </Stack>
      ) : (
        /* Actual activity list */
        <List>
          {/* Show all items in full-screen, only 3 in compact view */}
          {displayData.slice(0, isFullScreen ? undefined : 3).map((activity) => (
            <React.Fragment key={activity.id || activity._id}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <Avatar sx={{ 
                  bgcolor: 'action.hover',
                  color: 'text.primary',
                  width: 36,
                  height: 36,
                  mr: 2
                }}>
                  {getActivityIcon(activity.type)}
                </Avatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={600}>
                      {activity.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {activity.description}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider sx={{ my: 2 }} />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ActivityLog;