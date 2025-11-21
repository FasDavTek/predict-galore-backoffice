"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkEmailReadIcon,
  SportsSoccer as SportsIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  DeleteSweep as DeleteAllIcon,
} from "@mui/icons-material";
import { 
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} from "../../../api/notificationApi";
import EmptyState from "../../EmptyState";
import ErrorState from "../../ErrorState";

// Define TypeScript interfaces
interface Notification {
  _id: string;
  id?: string;
  title: string;
  message: string;
  content?: string;
  notificationType?: string;
  isRead?: boolean;
  createdAt?: string;
  timestamp?: string;
}

interface NotificationPanelProps {
  onClose: () => void;
}

interface NotificationTypeConfig {
  label: string;
  color: 'primary' | 'secondary' | 'error' | 'success' | 'info';
  icon: React.ReactElement;
}

interface NotificationTypes {
  [key: string]: NotificationTypeConfig;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

const NotificationPanel = ({ onClose }: NotificationPanelProps) => {
  // API Hooks
  const { data: notificationsData, isLoading, error, refetch } = useGetNotificationsQuery();
  const { data: statsData } = useGetNotificationStatsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();

  // Local State
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteAllDialog, setDeleteAllDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Notification type configuration
  const notificationTypes: NotificationTypes = {
    PREDICTION: { label: 'Prediction', color: 'primary', icon: <SportsIcon /> },
    SYSTEM: { label: 'System', color: 'secondary', icon: <InfoIcon /> },
    ALERT: { label: 'Alert', color: 'error', icon: <ErrorIcon /> },
    SUCCESS: { label: 'Success', color: 'success', icon: <CheckCircleIcon /> },
    INFO: { label: 'Info', color: 'info', icon: <InfoIcon /> },
  };

  const getNotificationType = (type: string): NotificationTypeConfig => {
    return notificationTypes[type] || notificationTypes.INFO;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays > 1) return `${diffDays} days ago`;
    
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffHours > 1) return `${diffHours} hours ago`;
    
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    if (diffMinutes > 1) return `${diffMinutes} minutes ago`;
    
    return 'Just now';
  };

  // Handler Functions
  const showSnackbar = (message: string, severity: SnackbarState['severity'] = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setActionLoading(notificationId);
      await markAsRead(notificationId).unwrap();
      showSnackbar('Notification marked as read');
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      showSnackbar('Failed to mark notification as read', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading('all-read');
      await markAllAsRead().unwrap();
      showSnackbar('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      showSnackbar('Failed to mark all notifications as read', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      setActionLoading(`delete-${notificationId}`);
      await deleteNotification(notificationId).unwrap();
      showSnackbar('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      showSnackbar('Failed to delete notification', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      setActionLoading('delete-all');
      await deleteAllNotifications().unwrap();
      showSnackbar('All notifications deleted');
      setDeleteAllDialog(false);
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
      showSnackbar('Failed to delete all notifications', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const openDeleteAllDialog = () => {
    setDeleteAllDialog(true);
  };

  const closeDeleteAllDialog = () => {
    setDeleteAllDialog(false);
  };

  // Data - Access stats from the data object
  const notifications: Notification[] = notificationsData?.data || [];
  const unreadCount = statsData?.data?.unreadCount || notifications.filter(n => !n.isRead).length;
  const totalCount = statsData?.data?.total || notifications.length;

  // Handle loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          width: 400,
          maxHeight: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <CircularProgress size={24} />
        </Box>
      </Box>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Box
        sx={{
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          border: 1,
          borderColor: "divider",
        }}
      >
        <ErrorState
          variant="api"
          message="We couldn't load your notifications. This might be due to a temporary server issue."
          retryAction={{ 
            label: "Retry", 
            onClick: refetch 
          }}
          height={200}
        />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: 400,
          maxHeight: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          border: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {notifications.length > 0 && (
                <>
                  <Button
                    size="small"
                    startIcon={<MarkEmailReadIcon />}
                    onClick={handleMarkAllAsRead}
                    disabled={actionLoading === 'all-read' || unreadCount === 0}
                  >
                    {actionLoading === 'all-read' ? <CircularProgress size={16} /> : 'Mark all read'}
                  </Button>
                  <IconButton 
                    size="small" 
                    onClick={openDeleteAllDialog}
                    disabled={actionLoading === 'delete-all'}
                    color="error"
                  >
                    <DeleteAllIcon />
                  </IconButton>
                </>
              )}
              <IconButton size="small" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          
          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total: {totalCount}
            </Typography>
            <Typography variant="body2" color="primary.main" fontWeight={600}>
              Unread: {unreadCount}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Notifications List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <EmptyState
              variant="data"
              title="No Notifications"
              description="You're all caught up! There are no new notifications at the moment."
              primaryAction={{
                label: "Refresh",
                onClick: refetch,
              }}
              height={150}
            />
          ) : (
            <List dense sx={{ p: 0 }}>
              {notifications.slice(0, 10).map((notification: Notification) => {
                const typeConfig = getNotificationType(notification.notificationType || 'INFO');
                const isMarkingRead = actionLoading === notification._id;
                const isDeleting = actionLoading === `delete-${notification._id}`;
                
                return (
                  <ListItem
                    key={notification._id}
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box sx={{ color: `${typeConfig.color}.main` }}>
                        {typeConfig.icon}
                      </Box>
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="subtitle2" component="span">
                            {notification.title}
                          </Typography>
                          {!notification.isRead && (
                            <Chip
                              label="New"
                              color="primary"
                              size="small"
                              sx={{ ml: 1, height: 20, fontSize: '0.6rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                            {notification.message || notification.content}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(notification.createdAt || notification.timestamp || new Date().toISOString())}
                          </Typography>
                        </Box>
                      }
                      sx={{ mr: 2 }}
                    />
                    
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {!notification.isRead && (
                          <IconButton
                            size="small"
                            onClick={() => handleMarkAsRead(notification._id)}
                            title="Mark as read"
                            disabled={isMarkingRead || isDeleting}
                          >
                            {isMarkingRead ? (
                              <CircularProgress size={16} />
                            ) : (
                              <CheckCircleIcon fontSize="small" />
                            )}
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteNotification(notification._id)}
                          title="Delete notification"
                          disabled={isMarkingRead || isDeleting}
                          sx={{ color: 'error.main' }}
                        >
                          {isDeleting ? (
                            <CircularProgress size={16} />
                          ) : (
                            <DeleteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button 
                size="small" 
                onClick={() => {
                  onClose();
                  // router.push('/notifications');
                }}
              >
                View All Notifications ({notifications.length})
              </Button>
            </Box>
          </>
        )}
      </Box>

      {/* Delete All Confirmation Dialog */}
      <Dialog
        open={deleteAllDialog}
        onClose={closeDeleteAllDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete All Notifications</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete all notifications? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteAllDialog} disabled={actionLoading === 'delete-all'}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAllNotifications} 
            color="error"
            disabled={actionLoading === 'delete-all'}
            startIcon={actionLoading === 'delete-all' ? <CircularProgress size={16} /> : <DeleteAllIcon />}
          >
            {actionLoading === 'delete-all' ? 'Deleting...' : 'Delete All'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NotificationPanel;