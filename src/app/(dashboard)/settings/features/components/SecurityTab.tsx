import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Divider, 
  LinearProgress, 
  Switch,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { 
  Lock as LockIcon, 
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon 
} from "@mui/icons-material";

// Hooks
import { useSettings } from "../hooks/useSettings";

// Types
import { TabComponentProps, PasswordChangeData } from "../types";

/**
 * SecurityTab - Handles security-related settings
 */
export const SecurityTab: React.FC<TabComponentProps> = ({ showNotification }) => {
  const {
    twoFactorEnabled,
    changePassword,
    isChangingPassword,
    passwordError,
    toggleTwoFactorAuth,
  } = useSettings();

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Handle input changes and calculate password strength
  const handleInputChange = (field: keyof PasswordChangeData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));

    // Calculate password strength when new password changes
    if (field === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  // Calculate password strength based on complexity
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length > 0) strength += 20;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    setPasswordStrength(strength);
  };

  // Handle password change submission
  const handleSave = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification("Passwords don't match!", 'error');
      return;
    }

    if (passwordStrength < 60) {
      showNotification("Please choose a stronger password", 'warning');
      return;
    }

    try {
      const success = await changePassword(passwordData);
      if (success) {
        showNotification('Password changed successfully!', 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordStrength(0);
      } else {
        showNotification('Failed to change password', 'error');
      }
    } catch {
      showNotification('Failed to change password', 'error');
    }
  };

  // Handle 2FA toggle
  const handleTwoFactorToggle = async () => {
    try {
      const success = await toggleTwoFactorAuth(!twoFactorEnabled);
      if (success) {
        showNotification(
          `Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}!`,
          'success'
        );
      } else {
        showNotification('Failed to update two-factor authentication', 'error');
      }
    } catch {
      showNotification('Failed to update two-factor authentication', 'error');
    }
  };

  // Get color for password strength indicator
  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'error';
    if (passwordStrength < 80) return 'warning';
    return 'success';
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const isFormValid = passwordData.currentPassword && 
                     passwordData.newPassword && 
                     passwordData.confirmPassword &&
                     passwordData.newPassword === passwordData.confirmPassword;

  return (
    <Box>
      {/* Password Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column - Header and Description */}
        <Box className="md:col-span-4">
          <Typography variant="h6" sx={{ mb: 1 }}>
            Password
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Please enter your current password to change your password.
          </Typography>
          <Button 
            variant="contained" 
            sx={{ mb: 4 }}
            onClick={handleSave}
            disabled={isChangingPassword || !isFormValid}
          >
            {isChangingPassword ? 'Updating...' : 'Save Changes'}
          </Button>
          {passwordError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {passwordError}
            </Alert>
          )}
        </Box>

        {/* Right Column - Form Fields */}
        <Box className="md:col-span-8 flex flex-col gap-3">
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Current Password"
              type={showPassword.current ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={handleInputChange('currentPassword')}
              fullWidth
              disabled={isChangingPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('current')}
                      edge="end"
                      disabled={isChangingPassword}
                    >
                      {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              label="New Password"
              type={showPassword.new ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={handleInputChange('newPassword')}
              fullWidth
              disabled={isChangingPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('new')}
                      edge="end"
                      disabled={isChangingPassword}
                    >
                      {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {passwordData.newPassword && (
              <>
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  Password strength
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={passwordStrength} 
                  color={getPasswordStrengthColor()}
                  sx={{ height: 6, borderRadius: 3, mt: 1 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {passwordStrength < 40 ? 'Weak' : passwordStrength < 80 ? 'Good' : 'Strong'}
                </Typography>
              </>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              label="Confirm Password"
              type={showPassword.confirm ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              fullWidth
              disabled={isChangingPassword}
              error={passwordData.confirmPassword !== '' && passwordData.newPassword !== passwordData.confirmPassword}
              helperText={
                passwordData.confirmPassword !== '' && passwordData.newPassword !== passwordData.confirmPassword 
                  ? "Passwords don't match" 
                  : ''
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('confirm')}
                      edge="end"
                      disabled={isChangingPassword}
                    >
                      {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Box>
      </div>

      <Divider sx={{ my: 4 }} />

      {/* Two Factor Authentication Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column - Header and Description */}
        <Box className="md:col-span-4">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Two Factor Authentication
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Add an extra layer of security with two-factor authentication.
          </Typography>
        </Box>

        {/* Right Column - 2FA Options */}
        <Box className="md:col-span-8">
          <FormControlLabel
            control={
              <Switch 
                checked={twoFactorEnabled}
                onChange={handleTwoFactorToggle}
                color="primary"
                disabled={isChangingPassword}
              />
            }
            label={twoFactorEnabled ? "Enabled" : "Disabled"}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            When enabled, you&apos;ll be required to enter both your password and a verification code.
          </Typography>
        </Box>
      </div>
    </Box>
  );
};