import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Switch,
  Stack,
  Alert,
  Skeleton,
} from "@mui/material";

// Hooks
import { useSettings } from "../hooks/useSettings";

// Types
import { TabComponentProps, NotificationUpdatePayload } from "../types";

// Notification Switch Component
interface NotificationSwitchProps {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const NotificationSwitch: React.FC<NotificationSwitchProps> = ({ 
  label, 
  checked, 
  onChange, 
  disabled = false 
}) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    width: '100%',
    py: 1
  }}>
    <Typography variant="body2">{label}</Typography>
    <Switch
      checked={checked}
      onChange={onChange}
      color="primary"
      disabled={disabled}
    />
  </Box>
);

// Skeleton Loading Component
const NotificationsSkeleton = () => (
  <Box>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <Box className="md:col-span-4">
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="90%" height={60} />
        <Skeleton variant="rectangular" width={120} height={36} sx={{ mt: 2 }} />
      </Box>
      <Box className="md:col-span-8">
        {[...Array(4)].map((_, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Skeleton variant="text" width="40%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} variant="rectangular" width="100%" height={40} />
              ))}
            </Stack>
            {index < 3 && <Skeleton variant="rectangular" width="100%" height={1} sx={{ mt: 4 }} />}
          </Box>
        ))}
      </Box>
    </div>
  </Box>
);

/**
 * NotificationsTab - Handles notification preferences
 */
export const NotificationsTab: React.FC<TabComponentProps> = ({ showNotification }) => {
  const {
    notificationSettings,
    isNotificationsLoading,
    notificationsError,
    updateNotificationSettings,
    isUpdatingNotifications,
  } = useSettings();

  // Initialize local state directly with notificationSettings or default values
  const [localSettings, setLocalSettings] = useState<NotificationUpdatePayload>(() => {
    // Use functional initialization to merge default values with fetched settings
    const defaultSettings = {
      enableInApp: true,
      enableEmail: true,
      enablePush: true,
      enableSms: true,
      enableEmailPred: true,
      enableInAppPred: true,
      enablePushPred: true,
      payEnableEmail: true,
      payEnableInApp: true,
      payEnablePush: true,
      secEnableEmail: true,
      secEnableInApp: true,
      secEnablePush: true,
    };

    // If we have notificationSettings from the API, use them, otherwise use defaults
    return notificationSettings ? { ...defaultSettings, ...notificationSettings } : defaultSettings;
  });

  // Track changes for save button
  const [hasChanges, setHasChanges] = useState(false);

  // Handle toggle changes for the new structure
  const handleToggleChange = (field: keyof NotificationUpdatePayload) => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSettings = {
      ...localSettings,
      [field]: event.target.checked
    };
    
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  // Save all changes
  const handleSaveChanges = async () => {
    try {
      const success = await updateNotificationSettings(localSettings);
      if (success) {
        showNotification('Notification settings updated!', 'success');
        setHasChanges(false);
      } else {
        showNotification('Failed to update notifications', 'error');
        // Revert to last saved settings on error
        if (notificationSettings) {
          setLocalSettings(notificationSettings);
        }
        setHasChanges(false);
      }
    } catch {
      showNotification('Failed to update notifications', 'error');
    }
  };

  if (isNotificationsLoading) {
    return <NotificationsSkeleton />;
  }

  if (notificationsError && !notificationSettings) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {notificationsError}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column - Header and Description */}
        <Box className="md:col-span-4">
          <Typography variant="h6" sx={{ mb: 1 }}>
            Notifications
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Get notifications to find out what&apos;s going on when you&apos;re
            not online. You can turn them off anytime.
          </Typography>
          
          {/* Save Changes Button */}
          <Button
            variant="contained"
            onClick={handleSaveChanges}
            disabled={!hasChanges || isUpdatingNotifications}
            sx={{
              minWidth: 120,
              opacity: hasChanges ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          >
            {isUpdatingNotifications ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>

        {/* Right Column */}
        <Box className="md:col-span-8">
          {/* User Activity Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 1 }}>
              User Activity
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Get updated when new users sign up, delete accounts, or upgrade to premium
            </Typography>

            <Stack spacing={2}>
              <NotificationSwitch
                label="In-app notifications"
                checked={localSettings.enableInApp}
                onChange={handleToggleChange("enableInApp")}
                disabled={isUpdatingNotifications}
              />
              <NotificationSwitch
                label="Push notifications"
                checked={localSettings.enablePush}
                onChange={handleToggleChange("enablePush")}
                disabled={isUpdatingNotifications}
              />
              <NotificationSwitch
                label="Email notifications"
                checked={localSettings.enableEmail}
                onChange={handleToggleChange("enableEmail")}
                disabled={isUpdatingNotifications}
              />
              <NotificationSwitch
                label="SMS notifications"
                checked={localSettings.enableSms}
                onChange={handleToggleChange("enableSms")}
                disabled={isUpdatingNotifications}
              />
            </Stack>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Predictions & Posts Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 1 }}>
              Predictions & Posts
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Alerts for new, edited, or deleted predictions
            </Typography>

            <Stack spacing={2}>
              <NotificationSwitch
                label="In-app prediction notifications"
                checked={localSettings.enableInAppPred}
                onChange={handleToggleChange("enableInAppPred")}
                disabled={isUpdatingNotifications}
              />
              <NotificationSwitch
                label="Push prediction notifications"
                checked={localSettings.enablePushPred}
                onChange={handleToggleChange("enablePushPred")}
                disabled={isUpdatingNotifications}
              />
              <NotificationSwitch
                label="Email prediction notifications"
                checked={localSettings.enableEmailPred}
                onChange={handleToggleChange("enableEmailPred")}
                disabled={isUpdatingNotifications}
              />
            </Stack>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Payments & Transactions Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 1 }}>
              Payments & Transactions
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Notifications for successful and failed subscriptions payments
            </Typography>
            
            <Stack spacing={2}>
              <NotificationSwitch
                label="In-app payment notifications"
                checked={localSettings.payEnableInApp}
                onChange={handleToggleChange("payEnableInApp")}
                disabled={isUpdatingNotifications}
              />
              <NotificationSwitch
                label="Push payment notifications"
                checked={localSettings.payEnablePush}
                onChange={handleToggleChange("payEnablePush")}
                disabled={isUpdatingNotifications}
              />
              <NotificationSwitch
                label="Email payment notifications"
                checked={localSettings.payEnableEmail}
                onChange={handleToggleChange("payEnableEmail")}
                disabled={isUpdatingNotifications}
              />
            </Stack>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Security Alerts Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 1 }}>
              Security Alerts
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Login attempts, suspicious activity, password reset requests
            </Typography>
            <Stack spacing={2}>
              <NotificationSwitch
                label="In-app security notifications"
                checked={localSettings.secEnableInApp}
                onChange={handleToggleChange("secEnableInApp")}
                disabled={isUpdatingNotifications}
              />
              <NotificationSwitch
                label="Push security notifications"
                checked={localSettings.secEnablePush}
                onChange={handleToggleChange("secEnablePush")}
                disabled={isUpdatingNotifications}
              />
              <NotificationSwitch
                label="Email security notifications"
                checked={localSettings.secEnableEmail}
                onChange={handleToggleChange("secEnableEmail")}
                disabled={isUpdatingNotifications}
              />
            </Stack>
          </Box>
        </Box>
      </div>
    </Box>
  );
};