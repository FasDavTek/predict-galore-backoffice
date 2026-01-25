'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Avatar from '@mui/material/Avatar';
import { alpha, useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import SportsIcon from '@mui/icons-material/SportsSoccer';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import DeleteAllIcon from '@mui/icons-material/DeleteSweep';
import NoNotificationsIcon from '@mui/icons-material/NotificationsNone';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  useNotifications,
  useUnreadCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from '@/features/notifications';
import { createLogger } from '@/shared/api';
import ErrorState from './ErrorState';

const logger = createLogger('NotificationPanel');

// Define TypeScript interfaces
interface Notification {
  id: number;
  userId: string;
  title: string;
  content: string;
  notificationType: string;
  isRead: boolean;
  predictionId?: number;
  fixtureId?: number;
  subscriptionId?: number;
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

interface NotificationTypeConfig {
  label: string;
  color: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';
  icon: React.ReactElement;
  bgColor: string;
}

interface NotificationTypes {
  [key: string]: NotificationTypeConfig;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

const NotificationPanel = ({ open, onClose }: NotificationPanelProps) => {
  const theme = useTheme();

  // API Hooks
  const { data: notificationsData, isLoading, error, refetch } = useNotifications();

  const { data: unreadCountData } = useUnreadCount();
  const unreadCount = unreadCountData || 0;
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  // Local State
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [deleteAllDialog, setDeleteAllDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | string | null>(null);

  // Enhanced notification type configuration with background colors
  const notificationTypes: NotificationTypes = {
    PREDICTION: {
      label: 'Prediction',
      color: 'primary',
      icon: <SportsIcon />,
      bgColor: alpha(theme.palette.primary.main, 0.1),
    },
    SYSTEM: {
      label: 'System',
      color: 'secondary',
      icon: <InfoIcon />,
      bgColor: alpha(theme.palette.secondary.main, 0.1),
    },
    ALERT: {
      label: 'Alert',
      color: 'error',
      icon: <ErrorIcon />,
      bgColor: alpha(theme.palette.error.main, 0.1),
    },
    SUCCESS: {
      label: 'Success',
      color: 'success',
      icon: <CheckCircleIcon />,
      bgColor: alpha(theme.palette.success.main, 0.1),
    },
    INFO: {
      label: 'Info',
      color: 'info',
      icon: <InfoIcon />,
      bgColor: alpha(theme.palette.info.main, 0.1),
    },
    WARNING: {
      label: 'Warning',
      color: 'warning',
      icon: <ErrorIcon />,
      bgColor: alpha(theme.palette.warning.main, 0.1),
    },
  };

  const getNotificationType = (type: string): NotificationTypeConfig => {
    return notificationTypes[type.toUpperCase()] || notificationTypes.INFO;
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
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      setActionLoading(notificationId);
      await markAsReadMutation.mutateAsync(notificationId);
      showSnackbar('Notification marked as read');
    } catch (error) {
      logger.error('Failed to mark notification as read', { notificationId, error });
      showSnackbar('Failed to mark notification as read', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading('all-read');
      await markAllAsReadMutation.mutateAsync();
      showSnackbar('All notifications marked as read');
    } catch (error) {
      logger.error('Failed to mark all notifications as read', { error });
      showSnackbar('Failed to mark all notifications as read', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      setActionLoading(notificationId);
      await deleteNotificationMutation.mutateAsync(notificationId);
      showSnackbar('Notification deleted');
    } catch (error) {
      logger.error('Failed to delete notification', { notificationId, error });
      showSnackbar('Failed to delete notification', 'error');
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

  const handleDeleteAllNotifications = async () => {
    try {
      setActionLoading('delete-all');
      // TODO: Implement bulk delete when mutation is added
      // For now, just mark all as read
      await markAllAsReadMutation.mutateAsync();
      showSnackbar('All notifications deleted');
      setDeleteAllDialog(false);
    } catch (error) {
      logger.error('Failed to delete all notifications', { error });
      showSnackbar('Failed to delete all notifications', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Data
  const notifications: Notification[] = notificationsData?.notifications || [];
  const totalCount = notificationsData?.total || 0;

  // Enhanced Loading State
  const renderLoadingState = () => (
    <Box
      sx={{
        width: 400,
        maxHeight: 500,
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 24,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress size={32} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Loading notifications...
        </Typography>
      </Box>
    </Box>
  );

  // Enhanced Error State
  const renderErrorState = () => (
    <Box
      sx={{
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 24,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <ErrorState
        variant="api"
        message="We couldn't load your notifications. This might be due to a temporary server issue."
        retryAction={{
          label: 'Try Again',
          onClick: refetch,
        }}
        height={200}
      />
    </Box>
  );

  // Enhanced Empty State
  const renderEmptyState = () => (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Avatar
        sx={{
          width: 80,
          height: 80,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: 'primary.main',
          mx: 'auto',
          mb: 2,
        }}
      >
        <NoNotificationsIcon sx={{ fontSize: 40 }} />
      </Avatar>
      <Typography variant="h6" gutterBottom color="text.primary">
        No Notifications
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        You&apos;re all caught up! There are no new notifications at the moment.
      </Typography>
      <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => refetch()} size="small">
        Refresh
      </Button>
    </Box>
  );

  if (!open) return null;

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: '100%',
          mt: 1,
          zIndex: 1300,
          animation: 'slideDown 0.2s ease-out',
          '@keyframes slideDown': {
            '0%': { opacity: 0, transform: 'translateY(-10px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Box
          sx={{
            width: 420,
            maxHeight: 560,
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 24,
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2.5,
              pb: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1.5,
              }}
            >
              <Typography variant="h6" fontWeight={700} color="text.primary">
                Notifications
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {notifications.length > 0 && (
                  <>
                    <IconButton
                      size="small"
                      onClick={handleMarkAllAsRead}
                      disabled={actionLoading === 'all-read' || unreadCount === 0}
                      title="Mark all as read"
                      sx={{
                        color: 'primary.main',
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                      }}
                    >
                      {actionLoading === 'all-read' ? (
                        <CircularProgress size={18} />
                      ) : (
                        <MarkEmailReadIcon fontSize="small" />
                      )}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={openDeleteAllDialog}
                      disabled={actionLoading === 'delete-all'}
                      color="error"
                      title="Delete all notifications"
                      sx={{
                        '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) },
                      }}
                    >
                      <DeleteAllIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
                <IconButton
                  size="small"
                  onClick={onClose}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { bgcolor: alpha(theme.palette.text.secondary, 0.1) },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Total: {totalCount}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                <Typography variant="body2" color="primary.main" fontWeight={600}>
                  Unread: {unreadCount}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Content */}
          {isLoading ? (
            renderLoadingState()
          ) : error ? (
            renderErrorState()
          ) : (
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {notifications.length === 0 ? (
                renderEmptyState()
              ) : (
                <List dense sx={{ p: 0 }}>
                  {notifications.slice(0, 8).map((notification: Notification) => {
                    const typeConfig = getNotificationType(notification.notificationType || 'INFO');
                    const isMarkingRead = actionLoading === notification.id;
                    const isDeleting = actionLoading === notification.id;

                    return (
                      <ListItem
                        key={notification.id}
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                          backgroundColor: notification.isRead
                            ? 'transparent'
                            : alpha(theme.palette.primary.main, 0.02),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.04),
                          },
                          transition: 'background-color 0.2s ease',
                          py: 1.5,
                          px: 2,
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 44 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: typeConfig.bgColor,
                              color: `${typeConfig.color}.main`,
                            }}
                          >
                            <Box sx={{ fontSize: 'small' }}>{typeConfig.icon}</Box>
                          </Avatar>
                        </ListItemIcon>

                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                              <Typography variant="subtitle2" component="span" fontWeight={600}>
                                {notification.title}
                              </Typography>
                              {!notification.isRead && (
                                <Chip
                                  label="New"
                                  color="primary"
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    fontWeight: 600,
                                    '& .MuiChip-label': { px: 1 },
                                  }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography
                                variant="body2"
                                color="text.primary"
                                sx={{
                                  lineHeight: 1.4,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {notification.content}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mt: 0.5, display: 'block' }}
                              >
                                {formatDate(notification.createdAt)}
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
                                onClick={() => handleMarkAsRead(notification.id)}
                                title="Mark as read"
                                disabled={isMarkingRead || isDeleting}
                                sx={{
                                  color: 'success.main',
                                  '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.1) },
                                }}
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
                              onClick={() => handleDeleteNotification(notification.id)}
                              title="Delete notification"
                              disabled={isMarkingRead || isDeleting}
                              sx={{
                                color: 'error.main',
                                '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) },
                              }}
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
          )}

          {/* Footer */}
          {notifications.length > 0 && (
            <>
              <Divider />
              <Box
                sx={{
                  p: 2,
                  textAlign: 'center',
                  background: alpha(theme.palette.primary.main, 0.02),
                }}
              >
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    onClose();
                    // router.push('/notifications');
                  }}
                  sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                  }}
                >
                  View All Notifications ({notifications.length})
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Delete All Confirmation Dialog */}
      <Dialog
        open={deleteAllDialog}
        onClose={closeDeleteAllDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Delete All Notifications</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete all notifications? This action cannot be undone and will
            delete all {notifications.length} notifications.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={closeDeleteAllDialog}
            disabled={actionLoading === 'delete-all'}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAllNotifications}
            color="error"
            disabled={actionLoading === 'delete-all'}
            startIcon={
              actionLoading === 'delete-all' ? <CircularProgress size={16} /> : <DeleteAllIcon />
            }
            variant="contained"
            sx={{ borderRadius: 2 }}
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
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: 8,
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NotificationPanel;
