import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import { Box, Snackbar, Alert, Tabs, Tab, Typography } from "@mui/material";
import DashboardLayout from "@/layouts/DashboardLayout";

// Redux actions
import {
  fetchProfile,
  fetchNotificationSettings,
  fetchTeamMembers,
  fetchRoles,
  clearProfileError,
  clearPasswordError,
  clearTeamError,
  clearRolesError,
  clearNotificationsError,
} from "@/store/slices/settingsSlice";

// Component imports
import ProfileTab from "@/components/settings/Profile";
import SecurityTab from "@/components/settings/Security";
import NotificationsTab from "@/components/settings/Notifications";
import TeamsTab from "@/components/settings/Teams/Teams";
import IntegrationsTab from "@/components/settings/Integrations";

/**
 * Error boundary fallback component
 */
function ErrorFallback({ error }) {
  return (
    <div className="p-4 bg-red-50 text-red-600">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

/**
 * SettingsPage - Main component for settings dashboard
 * Handles:
 * - Tab navigation
 * - Initial data loading
 * - Global notifications
 * - Error clearing when switching tabs
 */
const SettingsPage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load initial data when component mounts
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchNotificationSettings());
    dispatch(fetchTeamMembers());
    dispatch(fetchRoles());
  }, [dispatch]);

  // Handle tab changes and clear relevant errors
  const handleTabChange = (event, newValue) => {
    // Clear errors when switching tabs to prevent stale errors
    if (newValue === 0) dispatch(clearProfileError());
    if (newValue === 1) dispatch(clearPasswordError());
    if (newValue === 2) dispatch(clearNotificationsError());
    if (newValue === 3) dispatch(clearTeamError());

    setActiveTab(newValue);
  };

  // Show notification helper function
  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  // Close notification handler
  const handleNotificationClose = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <DashboardLayout>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Settings
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Control your profile setup and integrations
          </Typography>

          {/* Settings tabs navigation */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ mb: 4 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Profile" />
            <Tab label="Security" />
            <Tab label="Notifications" />
            <Tab label="Team" />
            <Tab label="Integrations" />
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
          >
            <Alert
              onClose={handleNotificationClose}
              severity={notification.severity}
              sx={{ width: "100%" }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </Box>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default SettingsPage;
