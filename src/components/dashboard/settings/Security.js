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
  IconButton
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Lock as LockIcon, 
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon 
} from "@mui/icons-material";
import { changePassword, toggleTwoFactor } from "@/store/slices/settingsSlice";

/**
 * SecurityTab - Handles security-related settings
 * Features:
 * - Password change functionality
 * - Password strength indicator
 * - Two-factor authentication toggle
 */
const SecurityTab = ({ showNotification }) => {
  const dispatch = useDispatch();
  const { 
    twoFactorEnabled,
    loading: { password: loading },
    error: { password: error }
  } = useSelector((state) => state.settings);

  const [passwordData, setPasswordData] = useState({
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
  const handleInputChange = (field) => (event) => {
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
  const calculatePasswordStrength = (password) => {
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

    try {
      await dispatch(changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })).unwrap();
      
      showNotification('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordStrength(0);
    } catch (error) {
      showNotification(error.message || 'Failed to change password', 'error');
    }
  };

  // Handle 2FA toggle
  const handleTwoFactorToggle = () => {
    dispatch(toggleTwoFactor());
    showNotification(
      `Two-factor authentication ${twoFactorEnabled ? 'disabled' : 'enabled'}`,
      'success'
    );
  };

  // Get color for password strength indicator
  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'error';
    if (passwordStrength < 80) return 'warning';
    return 'success';
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

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
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </Button>
          {error && (
            <Typography color="error" variant="body2">
              {error.message || 'Failed to update password'}
            </Typography>
          )}
        </Box>

        {/* Right Column - Form Fields */}
        <Box className="md:col-span-8">
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Current Password"
              type={showPassword.current ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={handleInputChange('currentPassword')}
              fullWidth
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

export default SecurityTab;