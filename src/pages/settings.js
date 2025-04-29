import React, { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProfileTab from "@/components/dashboard/settings/Profile";
import SecurityTab from "@/components/dashboard/settings/Security";
import NotificationsTab from "@/components/dashboard/settings/Notifications";
import TeamsTab from "@/components/dashboard/settings/Teams/Teams";



const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  

  return (
    <DashboardLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Settings
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4 }}>
          Control your profile setup and integrations
        </Typography>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
          <Tab label="Profile" />
          <Tab label="Security" />
          <Tab label="Notifications" />
          <Tab label="Team" />
          <Tab label="Integrations" />
        </Tabs>

        {activeTab === 0 && (
          <ProfileTab />
        )}

        {activeTab === 1 && (
          <SecurityTab />
        )} 

        {activeTab === 2 && (
        <NotificationsTab />
      )}

        {activeTab === 3 && (
          <TeamsTab />
        )}
        
        {/* {activeTab === 4 && (
        <IntegrationsTab />
      )} */}
      </Box>
    </DashboardLayout>
  );
};

export default SettingsPage;