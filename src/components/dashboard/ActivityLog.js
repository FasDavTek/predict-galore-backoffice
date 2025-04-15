// components/dashboard/ActivityLog.js
import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Skeleton
} from '@mui/material';
import {
  ChevronRight as ChevronRightIcon,
  HowToReg as SignupIcon,
  Assessment as PredictionIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';

const ActivityLog = ({
  title = 'Recent Activity',
  activities = [],
  loading = false,
  onViewAll,
  activityIcons = {
    signup: <SignupIcon color="primary" />,
    prediction: <PredictionIcon color="secondary" />,
    payment: <PaymentIcon color="success" />,
    default: <SignupIcon />
  },
  emptyState = {
    icon: <SignupIcon sx={{ fontSize: 40, color: 'grey.400' }} />,
    title: 'No Activities Yet',
    description: 'All actions will appear here once recorded'
  },
  formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  className = ''
}) => {
  return (
    <Card className={className} sx={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'none',
      border: '1px solid',
      borderColor: 'divider',
    }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header Section */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          {onViewAll && (
            <Chip
              label="View All"
              onClick={onViewAll}
              size="small"
              deleteIcon={<ChevronRightIcon fontSize="small" />}
              onDelete={onViewAll}
              sx={{ cursor: 'pointer' }}
            />
          )}
        </Box>

        {/* Content Section */}
        {loading ? (
          <List>
            {Array.from(new Array(5)).map((_, index) => (
              <ListItem key={`skeleton-${index}`}>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" width="80%" />}
                  secondary={<Skeleton variant="text" width="40%" />}
                />
              </ListItem>
            ))}
          </List>
        ) : activities?.length > 0 ? (
          <List sx={{ flex: 1 }}>
            {activities.map((activity, index) => (
              <ListItem 
                key={`activity-${index}`}
                alignItems="flex-start"
                sx={{
                  px: 0,
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 0 }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ 
                    bgcolor: 'action.hover',
                    color: 'text.primary',
                    width: 36,
                    height: 36
                  }}>
                    {activityIcons[activity.type] || activityIcons.default}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight={500}>
                      {activity.message}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {activity.user} • {formatTimestamp(activity.timestamp)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 300,
            textAlign: 'center'
          }}>
            <Box sx={{ 
              width: 120,
              height: 120,
              bgcolor: 'grey.100',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}>
              {emptyState.icon}
            </Box>
            <Typography variant="h6" gutterBottom>
              {emptyState.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {emptyState.description}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLog;