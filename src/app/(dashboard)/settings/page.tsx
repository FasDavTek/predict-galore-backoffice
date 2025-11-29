// src/app/(dashboard)/settings/page.tsx
"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Container,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";

// Components
import { ProfileTab } from "./features/components/ProfileTab";
import { SecurityTab } from "./features/components/SecurityTab";
import { NotificationsTab } from "./features/components/NotificationsTab";
import { TeamsTab } from "./features/components/TeamsTab";
import { IntegrationsTab } from "./features/components/IntegrationsTab";
import { SettingsPageLoadingSkeleton } from "./features/components/SettingsPageLoadingSkeleton";

// Hooks
import { useSettings } from "./features/hooks/useSettings";

// Types
import { TabComponentProps } from "./features/types";

// Redux actions
import {
  clearProfileError,
  clearPasswordError,
  clearTeamError,
  clearRolesError,
  clearNotificationsError,
  clearIntegrationsError,
  clearPermissionsError,
} from "./features/slices/settingsSlice";
import withAuth from "@/hoc/withAuth";

function SettingsPage() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const {
    isProfileLoading,
    isNotificationsLoading,
    isTeamLoading,
    isRolesLoading,
    isIntegrationsLoading,
    clearErrors,
  } = useSettings();

  // Show notification helper function
  const showNotification: TabComponentProps['showNotification'] = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  // Close notification handler
  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Handle tab changes and clear relevant errors
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    // Clear errors when switching tabs to prevent stale errors
    clearErrors();
    
    // Specific error clearing for each tab
    switch (newValue) {
      case 0:
        dispatch(clearProfileError());
        break;
      case 1:
        dispatch(clearPasswordError());
        break;
      case 2:
        dispatch(clearNotificationsError());
        break;
      case 3:
        dispatch(clearTeamError());
        dispatch(clearRolesError());
        break;
      case 4:
        dispatch(clearIntegrationsError());
        dispatch(clearPermissionsError());
        break;
    }

    setActiveTab(newValue);
  };

  // Check if any data is loading
  const isLoading = isProfileLoading || isNotificationsLoading || isTeamLoading || 
                   isRolesLoading || isIntegrationsLoading;

  // Show loading skeleton for initial page load
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <SettingsPageLoadingSkeleton />
      </Container>
    );
  }

  const tabLabels = ["Profile", "Security", "Notifications", "Team", "Integrations"];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Settings
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Control your profile setup and integrations
        </Typography>
      </Box>

      {/* Settings tabs navigation */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ 
          mb: 4,
          borderBottom: 1,
          borderColor: 'divider'
        }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabLabels.map((label, index) => (
          <Tab 
            key={label} 
            label={label}
            id={`settings-tab-${index}`}
            aria-controls={`settings-tabpanel-${index}`}
          />
        ))}
      </Tabs>

      {/* Tab content */}
      <Box sx={{ width: "100%" }}>
        {activeTab === 0 && (
          <ProfileTab showNotification={showNotification} />
        )}

        {activeTab === 1 && (
          <SecurityTab showNotification={showNotification} />
        )}

        {activeTab === 2 && (
          <NotificationsTab showNotification={showNotification} />
        )}

        {activeTab === 3 && (
          <TeamsTab showNotification={showNotification} />
        )}

        {activeTab === 4 && (
          <IntegrationsTab showNotification={showNotification} />
        )}
      </Box>

      {/* Global notification system */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

// Wrap with authentication HOC
export default withAuth(SettingsPage);