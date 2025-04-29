import {
  Box,
  Typography,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Stack,
} from "@mui/material";
import { useState } from "react";

const NotificationsTab = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    userActivity: {
      inApp: true,
      push: true,
      email: true,
    },
    predictionsPosts: {
      inApp: true,
      push: true,
      email: true,
    },
    paymentsTransactions: {
      inApp: true,
      push: true,
      email: true,
    },
    securityAlerts: {
      inApp: true,
      push: true,
      email: true,
    },
  });

  const handleToggleChange = (category, type) => (event) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: event.target.checked,
      },
    }));
  };

  const handleSave = () => {
    console.log("Notification settings saved:", notificationSettings);
    alert("Notification settings updated successfully!");
  };

  const NotificationSwitch = ({ label, checked, onChange }) => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      width: '100%',
      py: 1
    }}>
      <Typography>{label}</Typography>
      <Switch
        checked={checked}
        onChange={onChange}
        color="primary"
      />
    </Box>
  );

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
          <Button variant="contained" sx={{ mb: 4 }} onClick={handleSave}>
            Save Changes
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
              Get updated when new users sign up, delete accounts, or upgrade to
              premium
            </Typography>

            <Stack spacing={2}>
              <NotificationSwitch
                label="In-app"
                checked={notificationSettings.userActivity.inApp}
                onChange={handleToggleChange("userActivity", "inApp")}
              />
              <NotificationSwitch
                label="Push"
                checked={notificationSettings.userActivity.push}
                onChange={handleToggleChange("userActivity", "push")}
              />
              <NotificationSwitch
                label="Email"
                checked={notificationSettings.userActivity.email}
                onChange={handleToggleChange("userActivity", "email")}
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
                label="In-app"
                checked={notificationSettings.predictionsPosts.inApp}
                onChange={handleToggleChange("predictionsPosts", "inApp")}
              />
              <NotificationSwitch
                label="Push"
                checked={notificationSettings.predictionsPosts.push}
                onChange={handleToggleChange("predictionsPosts", "push")}
              />
              <NotificationSwitch
                label="Email"
                checked={notificationSettings.predictionsPosts.email}
                onChange={handleToggleChange("predictionsPosts", "email")}
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
                label="In-app"
                checked={notificationSettings.paymentsTransactions.inApp}
                onChange={handleToggleChange("paymentsTransactions", "inApp")}
              />
              <NotificationSwitch
                label="Push"
                checked={notificationSettings.paymentsTransactions.push}
                onChange={handleToggleChange("paymentsTransactions", "push")}
              />
              <NotificationSwitch
                label="Email"
                checked={notificationSettings.paymentsTransactions.email}
                onChange={handleToggleChange("paymentsTransactions", "email")}
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
                label="In-app"
                checked={notificationSettings.securityAlerts.inApp}
                onChange={handleToggleChange("securityAlerts", "inApp")}
              />
              <NotificationSwitch
                label="Push"
                checked={notificationSettings.securityAlerts.push}
                onChange={handleToggleChange("securityAlerts", "push")}
              />
              <NotificationSwitch
                label="Email"
                checked={notificationSettings.securityAlerts.email}
                onChange={handleToggleChange("securityAlerts", "email")}
              />
            </Stack>
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default NotificationsTab;