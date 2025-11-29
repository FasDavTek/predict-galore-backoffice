import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Alert,
  Skeleton,
  Chip
} from "@mui/material";
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from "@mui/icons-material";
import Image from "next/image";

// Hooks
import { useSettings } from "../hooks/useSettings";

// Types
import { TabComponentProps, Integration } from "../types";

// Skeleton Loading Component
const IntegrationsSkeleton = () => (
  <Box>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <Box className="md:col-span-4">
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="90%" height={60} />
        <Skeleton variant="rectangular" width={120} height={36} sx={{ mt: 2 }} />
      </Box>
      <Box className="md:col-span-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ))}
        </div>
      </Box>
    </div>
  </Box>
);

/**
 * IntegrationsTab - Component for managing third-party integrations
 */
export const IntegrationsTab: React.FC<TabComponentProps> = ({ showNotification }) => {
  const {
    integrations,
    isIntegrationsLoading,
    integrationsError,
    updateIntegration,
    toggleIntegrationNotifications,
  } = useSettings();
  
  // Dialog state management
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [formData, setFormData] = useState<{
    publicKey: string;
    secretKey: string;
    enabled: boolean;
  }>({
    publicKey: "",
    secretKey: "",
    enabled: false
  });
  
  // UI state for sensitive data visibility
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  
  // Track pending changes for bulk save
  const [pendingChanges, setPendingChanges] = useState<Integration[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  /**
   * Handle integration toggle changes
   */
  const handleIntegrationToggle = (integrationId: string, newValue: boolean) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      // Add to pending changes or update existing change
      setPendingChanges(prev => {
        const existingChangeIndex = prev.findIndex(c => c.id === integrationId);
        if (existingChangeIndex >= 0) {
          const updated = [...prev];
          updated[existingChangeIndex] = { ...integration, enabled: newValue };
          return updated;
        }
        return [...prev, { ...integration, enabled: newValue }];
      });
      setHasUnsavedChanges(true);
    }
  };

  /**
   * Save all pending integration changes at once
   */
  const handleSaveAllChanges = async () => {
    if (pendingChanges.length === 0) return;
    
    try {
      let successCount = 0;
      for (const change of pendingChanges) {
        const success = await updateIntegration(change.id, { enabled: change.enabled });
        if (success) successCount++;
      }
      
      if (successCount === pendingChanges.length) {
        showNotification(`${successCount} integration(s) updated successfully!`, 'success');
        setPendingChanges([]);
        setHasUnsavedChanges(false);
      } else {
        showNotification(`Updated ${successCount} of ${pendingChanges.length} integrations`, 'warning');
      }
    } catch {
      showNotification("Failed to update integrations", "error");
    }
  };

  /**
   * Open integration configuration dialog
   */
  const handleViewIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setFormData({
      publicKey: integration.publicKey || "",
      secretKey: integration.secretKey || "",
      enabled: integration.enabled
    });
    setOpenDialog(true);
  };

  // Close dialog and reset related states
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIntegration(null);
    setShowPublicKey(false);
    setShowSecretKey(false);
  };

  // Handle form input changes for integration configuration
  const handleInputChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  /**
   * Save integration configuration
   */
  const handleSave = async () => {
    if (!selectedIntegration) return;
    
    try {
      const success = await updateIntegration(selectedIntegration.id, {
        publicKey: formData.publicKey,
        secretKey: formData.secretKey,
        enabled: formData.enabled
      });
      
      if (success) {
        showNotification("Integration updated successfully!", "success");
        handleCloseDialog();
      } else {
        showNotification("Failed to update integration", "error");
      }
    } catch {
      showNotification("Failed to update integration", "error");
    }
  };

  /**
   * Handle integration notifications toggle
   */
  const handleNotificationsToggle = async (enabled: boolean) => {
    try {
      const success = await toggleIntegrationNotifications(enabled);
      if (success) {
        showNotification(
          `Integration notifications ${enabled ? 'enabled' : 'disabled'}!`,
          'success'
        );
      } else {
        showNotification('Failed to update integration notifications', 'error');
      }
    } catch {
      showNotification('Failed to update integration notifications', 'error');
    }
  };

  if (isIntegrationsLoading) {
    return <IntegrationsSkeleton />;
  }

  if (integrationsError && integrations.length === 0) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {integrationsError}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Main content grid with two columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column - Header and Description */}
        <Box className="md:col-span-4">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Integrations
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Connect and manage third-party services. Configure credentials and 
            enable/disable integrations as needed.
          </Typography>

          {/* Save Changes Button - Only shows when there are pending changes */}
          <Button
            variant="contained"
            onClick={handleSaveAllChanges}
            disabled={isIntegrationsLoading || !hasUnsavedChanges}
            sx={{ mb: 2 }}
          >
            {isIntegrationsLoading ? 'Saving...' : `Save Changes (${pendingChanges.length})`}
          </Button>

          {/* Global Notifications Toggle */}
          <Box sx={{ mt: 3 }}>
            <FormControlLabel
              control={
                <Switch 
                  onChange={(e) => handleNotificationsToggle(e.target.checked)}
                  color="primary"
                />
              }
              label="Enable Integration Notifications"
            />
            <Typography variant="caption" color="text.secondary">
              Receive notifications for all integration activities
            </Typography>
          </Box>
        </Box>

        {/* Right Column - Integration Cards */}
        <Box className="md:col-span-8">
          {/* Integration Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} sx={{ mb: 2 }}>
                <CardContent>
                  {/* Integration Header with Toggle */}
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    mb: 2 
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {integration.logo && (
                        <Image
                          src={integration.logo}
                          alt={integration.name}
                          width={24}
                          height={24}
                        />
                      )}
                      <Typography variant="subtitle1" fontWeight="medium">
                        {integration.name}
                      </Typography>
                    </Box>
                    <Switch
                      checked={integration.enabled}
                      onChange={(e) => handleIntegrationToggle(integration.id, e.target.checked)}
                      color="primary"
                      disabled={isIntegrationsLoading}
                    />
                  </Box>
                  
                  {/* Integration Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {integration.description}
                  </Typography>
                  
                  {/* Status and Configuration Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={integration.status} 
                      size="small"
                      color={
                        integration.status === 'connected' ? 'success' :
                        integration.status === 'pending' ? 'warning' : 'default'
                      }
                      variant="outlined"
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewIntegration(integration)}
                      disabled={isIntegrationsLoading}
                    >
                      Configure
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </div>
        </Box>
      </div>

      {/* Integration Configuration Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {/* Dialog Header with Close Button */}
        <DialogTitle sx={{ 
          display: "flex",  
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center",
          position: 'relative'
        }}>
          <IconButton 
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>

          {/* Integration Logo and Title */}
          {selectedIntegration?.logo && (
            <Image
              src={selectedIntegration.logo}
              alt={selectedIntegration.name}
              width={32}
              height={32}
              style={{ marginBottom: 8 }}
            />
          )}
          <Typography variant="h6">
            {selectedIntegration?.name} Integration
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {selectedIntegration?.description}
          </Typography>
        </DialogTitle>
        
        {/* Dialog Content - Configuration Form */}
        <DialogContent className="flex flex-col gap-3">
          {/* Public Key Input */}
          <TextField
            fullWidth
            label="Public Key"
            value={formData.publicKey}
            onChange={handleInputChange("publicKey")}
            sx={{ mb: 3 }}
            type={showPublicKey ? "text" : "password"}
            helperText="Set your public key"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPublicKey(!showPublicKey)}
                    edge="end"
                  >
                    {showPublicKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Secret Key Input */}
          <TextField
            fullWidth
            label="Secret Key"
            value={formData.secretKey}
            onChange={handleInputChange("secretKey")}
            sx={{ mb: 3 }}
            type={showSecretKey ? "text" : "password"}
            helperText="Set your secret key"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    edge="end"
                  >
                    {showSecretKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Integration Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={formData.enabled}
                onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
                color="primary"
              />
            }
            label="Enable Integration"
            sx={{ mb: 3 }}
          />
        </DialogContent>
        
        {/* Dialog Actions - Save/Cancel Buttons */}
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ mr: 2 }}
            disabled={isIntegrationsLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            disabled={isIntegrationsLoading}
          >
            {isIntegrationsLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};