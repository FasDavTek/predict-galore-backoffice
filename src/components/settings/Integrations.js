import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
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
  InputAdornment
} from "@mui/material";
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from "@mui/icons-material";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchIntegrations,
  updateIntegration,
  toggleNotifications,
  selectIntegrations,
  selectIntegrationsLoading,
  selectIntegrationsError,
  selectNotificationsEnabled
} from "@/store/slices/settingsSlice";

/**
 * IntegrationsTab - Component for managing third-party integrations
 * Features:
 * - View and toggle integration status
 * - Configure integration credentials
 * - Save all changes at once
 */
const IntegrationsTab = ({ showNotification }) => {
  // Redux state management
  const dispatch = useDispatch();
  const integrations = useSelector(selectIntegrations);
  const loading = useSelector(selectIntegrationsLoading);
  const error = useSelector(selectIntegrationsError);
  const notificationsEnabled = useSelector(selectNotificationsEnabled);
  
  // Dialog state management
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [formData, setFormData] = useState({
    publicKey: "",
    secretKey: "",
    enabled: false
  });
  
  // UI state for sensitive data visibility
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  
  // Track pending changes for bulk save
  const [pendingChanges, setPendingChanges] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch integrations on component mount
  useEffect(() => {
    dispatch(fetchIntegrations());
  }, [dispatch]);

  /**
   * Handle notifications toggle
   * Updates global notification setting and shows status message
   */
  const handleNotificationsToggle = () => {
    dispatch(toggleNotifications(!notificationsEnabled))
      .unwrap()
      .then(() => {
        showNotification(
          !notificationsEnabled 
            ? "Notifications enabled" 
            : "Notifications disabled"
        );
      })
      .catch((error) => {
        showNotification(error.message || "Failed to update notifications", "error");
      });
  };

  /**
   * Handle integration toggle changes
   * Tracks changes for bulk save rather than saving immediately
   * @param {string} integrationId - ID of the integration being toggled
   * @param {boolean} newValue - New enabled state
   */
  const handleIntegrationToggle = (integrationId, newValue) => {
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
      // Process all pending changes sequentially
      for (const change of pendingChanges) {
        await dispatch(updateIntegration({
          id: change.id,
          integrationData: change
        })).unwrap();
      }
      
      showNotification(`${pendingChanges.length} integration(s) updated successfully!`);
      setPendingChanges([]);
      setHasUnsavedChanges(false);
    } catch (error) {
      showNotification(error.message || "Failed to update integrations", "error");
    }
  };

  /**
   * Open integration configuration dialog
   * @param {Object} integration - Integration to configure
   */
  const handleViewIntegration = (integration) => {
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
  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  /**
   * Save integration configuration
   * Updates single integration with form data
   */
  const handleSave = () => {
    if (!selectedIntegration) return;
    
    dispatch(updateIntegration({
      id: selectedIntegration.id,
      integrationData: {
        ...selectedIntegration,
        publicKey: formData.publicKey,
        secretKey: formData.secretKey,
        enabled: formData.enabled
      }
    }))
      .unwrap()
      .then(() => {
        showNotification("Integration updated successfully!");
        handleCloseDialog();
      })
      .catch((error) => {
        showNotification(error.message || "Failed to update integration", "error");
      });
  };

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
              disabled={loading || !hasUnsavedChanges}
            >
              {loading ? 'Saving...' : `Save Changes `}
            </Button>
     
        </Box>

        {/* Right Column - Integration Cards and Save Button */}
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
                      <Image
                        src="/paystack-logo.svg"
                        alt={integration.name}
                        width={20}
                        height={20}
                      />
                      <Typography variant="subtitle1" fontWeight="medium">
                        {integration.name}
                      </Typography>
                    </Box>
                    <Switch
                      checked={integration.enabled}
                      onChange={(e) => handleIntegrationToggle(integration.id, e.target.checked)}
                      color="primary"
                      disabled={loading}
                    />
                  </Box>
                  
                  {/* Integration Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {integration.description}
                  </Typography>
                  
                  {/* Configuration Button */}
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleViewIntegration(integration)}
                    disabled={loading}
                  >
                    Configure Integration
                  </Button>
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
          <Image
            src="/paystack-logo.svg"
            alt={selectedIntegration?.name}
            width={20}
            height={20}
          />
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
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IntegrationsTab;