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

const IntegrationsTab = ({ showNotification }) => {
  const dispatch = useDispatch();
  const integrations = useSelector(selectIntegrations);
  const loading = useSelector(selectIntegrationsLoading);
  const error = useSelector(selectIntegrationsError);
  const notificationsEnabled = useSelector(selectNotificationsEnabled);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [formData, setFormData] = useState({
    publicKey: "",
    secretKey: "",
    enabled: false
  });
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  useEffect(() => {
    dispatch(fetchIntegrations());
  }, [dispatch]);

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

  const handleIntegrationToggle = (integrationId, newValue) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      dispatch(updateIntegration({
        id: integrationId,
        integrationData: { ...integration, enabled: newValue }
      }))
        .unwrap()
        .then(() => {
          showNotification(
            newValue 
              ? "Integration enabled" 
              : "Integration disabled"
          );
        })
        .catch((error) => {
          showNotification(error.message || "Failed to update integration", "error");
        });
    }
  };

  const handleViewIntegration = (integration) => {
    setSelectedIntegration(integration);
    setFormData({
      publicKey: integration.publicKey || "",
      secretKey: integration.secretKey || "",
      enabled: integration.enabled
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIntegration(null);
    setShowPublicKey(false);
    setShowSecretKey(false);
  };

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

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
      {/* Notifications Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column - Header and Description */}
        <Box className="md:col-span-4">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Integrations
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Get notifications to find out what&apos;s going on when you&apos;re not online. 
            You can turn them off anytime.
          </Typography>
          
          {/* <Button 
            variant="contained" 
            onClick={handleNotificationsToggle}
            disabled={loading}
            sx={{ mb: 4 }}
          >
            {notificationsEnabled ? 'Disable Notifications' : 'Enable Notifications'}
          </Button> */}
          
          {error && (
            <Typography color="error" variant="body2">
              {error.message || "Error loading integrations"}
            </Typography>
          )}
        </Box>

        {/* Right Column - Integration Cards */}
        <Box className="md:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
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
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {integration.description}
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleViewIntegration(integration)}
                    disabled={loading}
                  >
                    View Integration
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Box>
      </div>

      {/* Integration Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>

        <DialogTitle sx={{ display: "flex",  flexDirection: "column",justifyContent: "center", alignItems: "center" }}>

          {/* <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2}}> */}
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

          {/* </Box> */}
        
        </DialogTitle>
        
        <DialogContent className="flex flex-col gap-3">
          {/* <Divider sx={{ my: 2 }} /> */}

          {/* <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "medium" }}>
            Public Key
          </Typography> */}

          <TextField
            fullWidth
            label="public key"
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

          {/* <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "medium" }}>
            Secret Key
          </Typography> */}
          <TextField
            fullWidth
            label="secret key"
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

             {/* integration toggle  */}
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